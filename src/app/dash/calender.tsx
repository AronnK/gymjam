"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface CalendarProps {
  workoutData: { date: string; count: number }[];
}

const Calendar = ({ workoutData }: CalendarProps) => {
  return (
    <div className="pt-14">
      <div className="absolute right-10 w-2/3 h-[30vh] bg-white shadow-md rounded-lg border border-gray-300">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Workout Calendar
        </h2>
        <div className="px-4">
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
      </div>
    </div>
  );
};

export default Calendar;
