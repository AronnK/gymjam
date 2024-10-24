"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "../supabase";
import { useUser } from "@/context/UserContext";

export default function Add() {
  const [workoutSelected, setWorkoutSelected] = useState<"yes" | "no" | null>(
    null
  );
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [workoutName, setWorkoutName] = useState<string>("");
  const [sets, setSets] = useState<string>(""); // Now accepting a single integer as string
  const [weights, setWeights] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const { userInfo } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  useEffect(() => {
    const isWorkoutFilled = workoutName.trim() !== "";
    const isSetValid = sets.trim() !== "";
    const areWeightsFilled = weights.trim() !== "";
    const areRepsFilled = reps.trim() !== "";

    setCanSubmit(
      isWorkoutFilled || isSetValid || areWeightsFilled || areRepsFilled
    );
  }, [workoutName, sets, weights, reps]);

  const restrictToNumbers = (value: string) => {
    return value.replace(/[^0-9]/g, ""); // Restrict to integer input only
  };

  const restrictToNumbersAndCommas = (value: string) => {
    return value.replace(/[^0-9,]/g, "");
  };

  const handleAddWorkoutField = async () => {
    const parsedSets = parseInt(sets, 10); // Convert sets to an integer
    const parsedWeights = weights.split(",").map(Number);
    const parsedReps = reps.split(",").map(Number);

    if (workoutName.trim() === "") {
      alert("Please provide a workout name before adding details.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Insert or update workout entry
    const { data: workoutEntry, error: entryError } = await supabase
      .from("workout_entries")
      .upsert({
        user_id: userInfo?.id,
        date: today,
        workout: true,
        workout_name: workoutName,
      })
      .select();

    if (entryError) {
      console.error("Error inserting workout entry:", entryError);
      return;
    }

    const workoutEntryId = workoutEntry[0].id;

    // Insert workout details
    const { error: detailsError } = await supabase
      .from("workout_details")
      .insert([
        {
          workout_id: workoutEntryId,
          sets: parsedSets || null,
          weights: parsedWeights || null,
          reps: parsedReps || null,
        },
      ]);

    if (detailsError) {
      console.error("Error inserting workout details:", detailsError);
      return;
    }

    // Clear input fields for the next entry
    setWorkoutName("");
    setSets("");
    setWeights("");
    setReps("");
  };

  const handleWorkoutSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    const parsedSets = parseInt(sets, 10); // Convert sets to an integer
    const parsedWeights = weights.split(",").map(Number);
    const parsedReps = reps.split(",").map(Number);

    if (workoutName.trim() === "") {
      alert("Please provide a workout name before adding details.");
      return;
    }

    // Insert or update workout entry
    const { data: workoutEntry, error: entryError } = await supabase
      .from("workout_entries")
      .upsert({
        user_id: userInfo?.id,
        date: today,
        workout: true,
        workout_name: workoutName,
      })
      .select();

    if (entryError) {
      console.error("Error inserting workout entry:", entryError);
      return;
    }

    const workoutEntryId = workoutEntry[0].id;

    // Insert workout details
    const { error: detailsError } = await supabase
      .from("workout_details")
      .insert([
        {
          workout_id: workoutEntryId,
          sets: parsedSets || null,
          weights: parsedWeights || null,
          reps: parsedReps || null,
        },
      ]);

    if (detailsError) {
      console.error("Error inserting workout details:", detailsError);
      return;
    }

    setSubmitted(true);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-500 p-3 z-50">
      <div className="flex justify-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          {!submitted ? (
            <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)}>
                Did you do workout today?
              </Button>
            </DialogTrigger>
          ) : (
            <Button className="cursor-not-allowed">
              {workoutSelected === "no"
                ? "No workouts today😔"
                : "Workout done for today😎"}
            </Button>
          )}

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Did you workout today?</DialogTitle>
            </DialogHeader>

            {workoutSelected === null && (
              <div className="space-y-2">
                <div>
                  <Checkbox
                    id="yes"
                    onCheckedChange={() => setWorkoutSelected("yes")}
                  />
                  <label htmlFor="yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div>
                  <Checkbox
                    id="no"
                    onCheckedChange={() => setWorkoutSelected("no")}
                  />
                  <label htmlFor="no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
            )}
            {workoutSelected === "yes" && (
              <div className="space-y-4">
                <h2>Add Today&apos;s Workout</h2>
                <Input
                  placeholder="Workout Name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
                <Input
                  placeholder="Number of sets"
                  value={sets}
                  onChange={(e) => setSets(restrictToNumbers(e.target.value))}
                />
                <Input
                  placeholder="Weights for each set (comma-separated)"
                  value={weights}
                  onChange={(e) =>
                    setWeights(restrictToNumbersAndCommas(e.target.value))
                  }
                />
                <Input
                  placeholder="Reps for each set (comma-separated)"
                  value={reps}
                  onChange={(e) =>
                    setReps(restrictToNumbersAndCommas(e.target.value))
                  }
                />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setWorkoutSelected(null)}
                  >
                    Back
                  </Button>
                  <div className="flex justify-end space-x-2">
                    <Button onClick={handleAddWorkoutField}>Add More</Button>
                    <Button onClick={handleWorkoutSubmit}>
                      {canSubmit ? "Submit" : "Skip"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {workoutSelected === "no" && (
              <div className="space-y-4">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setWorkoutSelected(null)}
                  >
                    Back
                  </Button>
                  <Button onClick={handleWorkoutSubmit}>Submit</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
