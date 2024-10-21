"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "../supabase";
import Link from "next/link";

export default function MainPage() {
  const { userInfo } = useUser();
  const [workoutSelected, setWorkoutSelected] = useState<string | null>(null);
  const [workoutCardVisible, setWorkoutCardVisible] = useState(false);
  const [inputFields, setInputFields] = useState<string[]>([]);
  const [updatedCardVisible, setUpdatedCardVisible] = useState(false);
  const [updatedCardMessage, setUpdatedCardMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!userInfo) return;
    const today = new Date().toISOString().split("T")[0];

    if (workoutSelected === "no") {
      await supabase
        .from("workout_entries")
        .insert([{ user_id: userInfo.id, date: today, workout: false }]);
      setUpdatedCardMessage("No workouts today😔");
    }

    if (workoutSelected === "yes") {
      setWorkoutCardVisible(true);
    }
    setUpdatedCardVisible(true);
  };

  const handleAddInput = () => {
    setInputFields((prev) => [...prev, ""]);
  };

  const handleDeleteInput = (index: number) => {
    const updatedFields = [...inputFields];
    updatedFields.splice(index, 1);
    setInputFields(updatedFields);
  };

  const handleWorkoutDetailsSubmit = async () => {
    if (inputFields.some((field) => field.trim() === "")) {
      setErrorMessage("Please fill in all workout details.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("workout_entries").insert([
      {
        user_id: userInfo?.id,
        date: today,
        workout: true,
        workout_details: inputFields,
      },
    ]);

    if (!error) {
      setWorkoutCardVisible(false);
      setInputFields([]);
      setWorkoutSelected(null);
      setUpdatedCardMessage("Keep the consistency up😎");
      setUpdatedCardVisible(true);
      setErrorMessage("");
    } else {
      console.error("Failed to submit workout details", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 left-4">Hi, {userInfo?.name}!</div>

      {!workoutCardVisible && !updatedCardVisible && (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-auto h-auto p-10">
            <CardHeader>
              <CardTitle>Did you workout today?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={(value) => setWorkoutSelected(value)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="yes" id="r1" />
                  <Label htmlFor="r1">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="r2" />
                  <Label htmlFor="r2">No</Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit}>
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {workoutCardVisible && (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-auto h-auto p-10">
            <CardHeader>
              <CardTitle>Add today&apos;s workout</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage && (
                <p className="text-red-500 mb-2">{errorMessage}</p>
              )}
              {inputFields.map((_, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    placeholder={`Workout ${index + 1}`}
                    className="mb-2"
                    onChange={(e) => {
                      const updatedFields = [...inputFields];
                      updatedFields[index] = e.target.value;
                      setInputFields(updatedFields);
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteInput(index)}
                    className="mb-2"
                  >
                    Del
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleAddInput}>
                +
              </Button>
              <Button className="w-auto" onClick={handleWorkoutDetailsSubmit}>
                {inputFields.length > 0 ? "Submit" : "Skip"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {updatedCardVisible && (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="w-auto h-auto p-10">
            <CardHeader>
              <CardTitle>Workout Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{updatedCardMessage}</p>
            </CardContent>
            <CardFooter>{/* add something catchy here */}</CardFooter>
          </Card>
        </div>
      )}
      <div className="absolute bottom-4 left-4">
        <Link href="/dashboard" passHref>
          <Button>Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
