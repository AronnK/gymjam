"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../supabase";
import { useUser } from "@/context/UserContext";

export default function FutureWorkoutDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { userInfo } = useUser();
  const [workouts, setWorkouts] = useState<
    {
      workoutName: string;
      sets: string;
      weights: string;
      reps: string;
      date: string;
    }[]
  >([]);
  const [currentWorkout, setCurrentWorkout] = useState({
    workoutName: "",
    sets: "",
    weights: "",
    reps: "",
    date: "",
  });

  const restrictToNumbers = (value: string) => value.replace(/[^0-9]/g, "");
  const restrictToNumbersAndCommas = (value: string) =>
    value.replace(/[^0-9,]/g, "");

  const handleAddMore = () => {
    const { workoutName, sets, weights, reps, date } = currentWorkout;

    if (!workoutName || !sets || !weights || !reps || !date) {
      alert("Please fill all fields before adding more.");
      return;
    }

    setWorkouts((prev) => [...prev, currentWorkout]);
    setCurrentWorkout({
      workoutName: "",
      sets: "",
      weights: "",
      reps: "",
      date: "",
    });
  };

  const handleSubmit = async () => {
    if (workouts.length === 0) {
      alert("Please add at least one workout.");
      return;
    }

    const entries = workouts.map(
      ({ workoutName, sets, weights, reps, date }) => ({
        user_id: userInfo?.id,
        workout_name: workoutName,
        date,
        sets: parseInt(sets, 10),
        weights: weights.split(",").map(Number),
        reps: reps.split(",").map(Number),
      })
    );

    const { error } = await supabase.from("future_entries").insert(entries);

    if (error) {
      console.error("Error adding future workouts:", error);
      alert("Failed to add workouts. Please try again.");
    } else {
      setWorkouts([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Future Workout Plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Workout Name"
            value={currentWorkout.workoutName}
            onChange={(e) =>
              setCurrentWorkout({
                ...currentWorkout,
                workoutName: e.target.value,
              })
            }
          />
          <Input
            placeholder="Number of Sets"
            value={currentWorkout.sets}
            onChange={(e) =>
              setCurrentWorkout({
                ...currentWorkout,
                sets: restrictToNumbers(e.target.value),
              })
            }
          />
          <Input
            placeholder="Weights (comma-separated)"
            value={currentWorkout.weights}
            onChange={(e) =>
              setCurrentWorkout({
                ...currentWorkout,
                weights: restrictToNumbersAndCommas(e.target.value),
              })
            }
          />
          <Input
            placeholder="Reps (comma-separated)"
            value={currentWorkout.reps}
            onChange={(e) =>
              setCurrentWorkout({
                ...currentWorkout,
                reps: restrictToNumbersAndCommas(e.target.value),
              })
            }
          />
          <Input
            type="date"
            placeholder="Select Date"
            value={currentWorkout.date}
            onChange={(e) =>
              setCurrentWorkout({ ...currentWorkout, date: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleAddMore}>
              Add More
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
