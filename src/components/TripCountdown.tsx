"use client";

import { TRIP_NAME } from "@/lib/storage";

interface Props {
  daysLeft: number;
  totalDaysCompleted: number;
}

export default function TripCountdown({ daysLeft, totalDaysCompleted }: Props) {
  const weeks = Math.floor(daysLeft / 7);
  const remDays = daysLeft % 7;

  // What % of remaining days have you trained on so far?
  const totalTrainingDays = totalDaysCompleted + daysLeft;
  const completionRate = totalTrainingDays > 0
    ? Math.round((totalDaysCompleted / totalTrainingDays) * 100)
    : 0;

  // Phase indicator
  let phase = "Foundation";
  let phaseColor = "text-sky-arg";
  if (daysLeft <= 56) {
    phase = "BA Mode 🇦🇷";
    phaseColor = "text-sun-arg";
  } else if (daysLeft <= 112) {
    phase = "Build Phase";
    phaseColor = "text-accent-green";
  }

  return (
    <div className="card bg-gradient-to-br from-sky-arg/10 via-ink-800 to-sun-arg/10 border-sky-arg/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="stat-label">Trip to {TRIP_NAME}</div>
          <div className={`text-sm font-bold mt-1 ${phaseColor}`}>{phase}</div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-black tracking-tight text-white">
            {daysLeft}
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            days left
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-300">
        {weeks} weeks, {remDays} days · {totalDaysCompleted} training days banked ({completionRate}%)
      </div>

      <div className="mt-4 h-2 bg-ink-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-arg to-sun-arg transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
}
