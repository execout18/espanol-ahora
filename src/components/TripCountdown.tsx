"use client";

interface Props {
  daysLeft: number;
  totalDaysCompleted: number;
}

export default function TripCountdown({ daysLeft, totalDaysCompleted }: Props) {
  const weeks = Math.floor(daysLeft / 7);

  // Phase indicator
  let phase = "Foundation · Mexican Spanish";
  let phaseColor = "text-sky-arg";
  let phaseEmoji = "🏗️";
  if (daysLeft <= 56) {
    phase = "BA Overlay Active 🇦🇷";
    phaseColor = "text-sun-arg";
    phaseEmoji = "🇦🇷";
  } else if (daysLeft <= 112) {
    phase = "Build · Mexican Spanish";
    phaseColor = "text-accent-green";
    phaseEmoji = "📈";
  }

  // What % of remaining days have you trained on?
  const totalTrainingDays = totalDaysCompleted + daysLeft;
  const completionRate =
    totalTrainingDays > 0
      ? Math.round((totalDaysCompleted / totalTrainingDays) * 100)
      : 0;

  return (
    <div className="card bg-gradient-to-br from-sky-arg/10 via-ink-800 to-sun-arg/10 border-sky-arg/30">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="stat-label">Current Phase</div>
          <div className={`text-sm font-bold mt-1 ${phaseColor}`}>
            {phaseEmoji} {phase}
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-black tracking-tight text-white">
            {daysLeft}
          </div>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            days to BA
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 mb-3">
        {weeks} weeks until Buenos Aires · {totalDaysCompleted} training days banked
      </div>

      <div className="h-2 bg-ink-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-arg to-sun-arg transition-all duration-500"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      <div className="mt-3 text-xs text-gray-500 italic">
        Daily Spanish is for Carly, Charlotte, family. BA is a milestone, not the mission.
      </div>
    </div>
  );
}
