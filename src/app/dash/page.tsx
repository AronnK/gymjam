import { createClient } from "@/utils/supabase/server";
import Calendar from "./calender";
import Header from "./header";
import { redirect } from "next/navigation";
import SignInForm from "./signinform";
import Add from "./add";
import UserCard from "./usercard";
import AchievementsCard from "./achievements";
import WorkoutHistory, { WorkoutHistoryEntry } from "./workouthistory";

export default async function Dash() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("name, username, height, weight, age, bmi, gender, jams")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return <SignInForm />;
  }

  const { name, username, height, weight, age, bmi, gender, jams } = profiles;

  if (!name || !username || !height || !weight || !age || !bmi || !gender) {
    return <SignInForm />;
  }

  const { data: workoutEntries, error: workoutError } = await supabase
    .from("workout_entries")
    .select("id, workout_name, date")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (workoutError) {
    console.error("Error fetching workout entries:", workoutError);
    return;
  }

  const workoutHistory: WorkoutHistoryEntry[] = await Promise.all(
    workoutEntries.map(async (entry: any) => {
      const { data: workoutDetails, error: detailsError } = await supabase
        .from("workout_details")
        .select("sets, weights, reps")
        .eq("workout_id", entry.id)
        .single();

      if (detailsError) {
        console.error(
          `Error fetching details for workout ${entry.id}:`,
          detailsError
        );
        return {
          id: entry.id,
          workout: entry.workout_name,
          sets: [],
          weights: [],
          reps: [],
          date: entry.date,
        };
      }

      return {
        id: entry.id,
        workout: entry.workout_name,
        sets: workoutDetails?.sets || [],
        weights: (workoutDetails?.weights || []).join(","),
        reps: (workoutDetails?.reps || []).join(","),
        date: entry.date,
      };
    })
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow grid grid-cols-5 gap-4 p-4">
        <div className="col-span-2 row-span-1 h-[30vh]">
          <UserCard name={name} username={username} jams={jams} />
        </div>
        <div className="col-span-3 row-span-1 h-[30vh]">
          <Calendar
            workoutData={workoutHistory.map(({ date, workout }) => ({
              date,
              count: workout ? 1 : 0,
            }))}
          />
        </div>
        <div className="col-span-2 row-span-2 h-[calc(100vh-30vh-6rem)]">
          <AchievementsCard />
        </div>
        <div className="col-span-3 row-span-2 h-[calc(100vh-30vh-6rem)]">
          <WorkoutHistory workoutHistory={workoutHistory} />
        </div>
      </main>
      <Add />
    </div>
  );
}