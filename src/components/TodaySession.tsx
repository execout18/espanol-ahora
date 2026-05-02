"use client";

import { DailySession, SessionType, saveSession } from "@/lib/storage";

interface Props {
  todaySession: DailySession | null;
  onUpdate: () => void;
}

const COMPONENTS: Array<{
  id: SessionType;
  label: string;
  description: string;
  minutes: number;
  emoji: string;
  status: "active" | "coming_soon";
}> = [
  {
    id: "joao",
    label: "João Lesson",
    description: "Listening — Natural Way method",
    minutes: 12,
    emoji: "🎧",
    status: "active",
  },
  {
    id: "drill",
    label: "Sentence Drill",
    description: "EN → ES production",
    minutes: 8,
    emoji: "✍️",
    status: "coming_soon",
  },
  {
    id: "tutor",
    label: "AI Tutor Chat",
    description: "Live conversation w/ Claude",
    minutes: 10,
    emoji: "💬",
    status: "coming_soon",
  },
  {
    id: "capture",
    label: "Real-World Capture",
    description: "Log a phrase from your day",
    minutes: 1,
    emoji: "📝",
    status: "active",
  },
];

export default function TodaySession({ todaySession, onUpdate }: Props) {
  const completed = todaySession?.components || [];

  const handleComplete = (component: SessionType, minutes: number) => {
    saveSession(component, minutes);
    onUpdate();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Morning Coffee Session</h2>
        <div className="text-sm text-gray-400">
          {completed.length} / {COMPONENTS.length} done
        </div>
      </div>

      <div className="space-y-3">
        {COMPONENTS.map((c) => {
          const done = completed.includes(c.id);
          return (
            <div
              key={c.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                done
                  ? "bg-accent-green/10 border-accent-green/30"
                  : "bg-ink-900 border-ink-700 hover:border-ink-700/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{c.emoji}</div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {c.label}
                    {c.status === "coming_soon" && (
                      <span className="text-xs bg-ink-700 px-2 py-0.5 rounded-full text-gray-400">
                        Stage 2
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{c.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">~{c.minutes} min</div>
                </div>
              </div>

              {done ? (
                <div className="text-accent-green text-2xl">✓</div>
              ) : c.status === "active" ? (
                <button
                  className="btn-secondary"
                  onClick={() => handleComplete(c.id, c.minutes)}
                >
                  Mark Done
                </button>
              ) : (
                <div className="text-xs text-gray-600 italic">soon</div>
              )}
            </div>
          );
        })}
      </div>

      {completed.length >= 2 && (
        <div className="mt-4 p-3 bg-sun-arg/10 border border-sun-arg/30 rounded-xl text-center">
          <div className="font-bold text-sun-arg">¡Día completo! 🔥</div>
          <div className="text-xs text-gray-400 mt-1">
            Streak protected. Vamos.
          </div>
        </div>
      )}
    </div>
  );
}
