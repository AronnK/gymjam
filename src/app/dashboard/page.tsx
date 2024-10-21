import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import { redirect, useRouter } from "next/navigation";
import SignInForm from "../signinform/page";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import Calendar from "./calender";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("name, username, height, weight, age, bmi, gender")
    .eq("id", user?.id)
    .single();
  if (error) {
    return <SignInForm />;
  }

  const { name, username, height, weight, age, bmi, gender } = profiles;

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
    workoutEntries?.map((entry: any) => ({
      date: entry.date,
      count: entry.workout,
    })) || [];

  return (
    <div className="flex pl-10 pt-10 min-h-screen">
      <Card className="w-[400px] h-2/3">
        <CardHeader>
          <CardTitle>User Dashboard</CardTitle>
          <CardDescription>Hi {profiles?.name}!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Name</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.name}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Username</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.username}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Height</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.height} cm
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Weight</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.weight} kg
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Age</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.age}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Gender</Label>
              <p className="border border-black rounded-lg p-2 ">
                {profiles?.gender}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Edit</Button>
        </CardFooter>
      </Card>
      <Calendar workoutData={workoutData} />
    </div>
  );
}
