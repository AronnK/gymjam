"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FutureWorkoutDialog from "./futureworkout";

export default function Header() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-500 p-3 z-50">
      <div className="flex justify-between">
        <Button>Settings</Button>
        <Button onClick={() => setIsDialogOpen(true)}>Add Workout Plan</Button>
      </div>
      <FutureWorkoutDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
