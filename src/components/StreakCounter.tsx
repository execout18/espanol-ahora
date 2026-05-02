"use client";

import { StreakStats } from "@/lib/storage";

interface Props {
  stats: StreakStats;
}

export default function StreakCounter({ stats }: Props) {
  const flame = stats.current >= 7 ? "🔥🔥🔥" : stats.current >= 3 ? "🔥🔥" : stats.current >= 1 ? "🔥" : "💤";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card text-center">
        <div className="stat-label mb-2">Current Streak</div>
        <div className="stat-number text-sun-arg">
          {stats.current}
        </div>
        <div className="text-2xl mt-1">{flame}</div>
      </div>

      <div className="card text-center">
        <div className="stat-label mb-2">Longest Streak</div>
        <div className="stat-number text-sky-arg">{stats.longest}</div>
        <div className="text-xs text-gray-500 mt-2">personal best</div>
      </div>

      <div className="card text-center">
        <div className="stat-label mb-2">Total Days</div>
        <div className="stat-number text-white">{stats.totalDays}</div>
        <div className="text-xs text-gray-500 mt-2">since start</div>
      </div>

      <div className="card text-center">
        <div className="stat-label mb-2">Total Minutes</div>
        <div className="stat-number text-white">{stats.totalMinutes}</div>
        <div className="text-xs text-gray-500 mt-2">
          ≈ {Math.round(stats.totalMinutes / 60)} hrs
        </div>
      </div>
    </div>
  );
}
