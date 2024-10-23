import { createClient } from "@/utils/supabase/server";
import Calendar from "./calender";
import Header from "./header";
import { redirect } from "next/navigation";
import SignInForm from "./signinform";
import Add from "./add";
import UserCard from "./usercard";
import AchievementsCard from "./achievements";

interface WorkoutEntry {
  date: string;
  workout: boolean;
}

export default async function Dash() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("name, username, height, weight, age, bmi, gender, jams")
    .eq("id", user?.id)
    .single();
  if (error) {
    return <SignInForm />;
  }

  const { name, username, height, weight, age, bmi, gender, jams } = profiles;

  if (!name || !username || !height || !weight || !age || !bmi || !gender) {
    return <SignInForm />;
  }

  const { data: workoutEntries, error: workoutError } = await supabase
    .from("workout_entries")
    .select("date, workout")
    .eq("user_id", user.id);

  if (workoutError) {
    console.error("Error fetching workout entries:", workoutError);
    return;
  }

  const workoutData =
    workoutEntries?.map((entry: WorkoutEntry) => ({
      date: entry.date,
      count: entry.workout ? 1 : 0,
    })) || [];
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex">
          <div className="flex flex-col space-y-40">
            <UserCard name={name} username={username} jams={jams} />
            <AchievementsCard />
          </div>

          <div className="flex-grow">
            <Calendar workoutData={workoutData} />
          </div>
        </main>
        <Add />
      </div>
    </>
  );
}
