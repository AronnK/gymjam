"use client"; // Ensures CSR for this component

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface CalendarProps {
  workoutData: { date: string; count: number }[];
}

const Calendar = ({ workoutData }: CalendarProps) => {
  return (
    <div className="absolute right-12 w-[60vw] h-[50vh]">
      <CalendarHeatmap
        startDate={new Date("2024-01-01")}
        endDate={new Date("2024-12-31")}
        values={workoutData}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return value.count > 0 ? "color-filled" : "color-empty";
        }}
      />
    </div>
  );
};

export default Calendar;
