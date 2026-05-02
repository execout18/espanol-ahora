"use client";

import { DailySession, SessionType, saveSession } from "@/lib/storage";

interface Props {
  todaySession: DailySession | null;
  onUpdate: () => void;
  onLaunch: (component: SessionType) => void;
}

const COMPONENTS: Array<{
  id: SessionType;
  label: string;
  description: string;
  minutes: number;
  emoji: string;
  externalUrl?: string;
  launchable?: boolean;
}> = [
  {
    id: "joao",
    label: "João Lesson",
    description: "Listening — Natural Way method",
    minutes: 12,
    emoji: "🎧",
    externalUrl: "https://spanishthenaturalway.app.clientclub.net/courses/library-v2",
  },
  {
    id: "drill",
    label: "Sentence Drill",
    description: "EN → ES production · scored",
    minutes: 8,
    emoji: "✍️",
    launchable: true,
  },
  {
    id: "tutor",
    label: "AI Tutor Chat",
    description: "Live conversation w/ Claude (Argentine)",
    minutes: 10,
    emoji: "💬",
    launchable: true,
  },
  {
    id: "capture",
    label: "Real-World Capture",
    description: "Log a phrase from your day",
    minutes: 1,
    emoji: "📝",
  },
];

export default function TodaySession({ todaySession, onUpdate, onLaunch }: Props) {
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
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-3xl">{c.emoji}</div>
                <div className="min-w-0">
                  <div className="font-bold">{c.label}</div>
                  <div className="text-sm text-gray-400 truncate">{c.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">~{c.minutes} min</div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2">
                {c.externalUrl && (
                  <a
                    href={c.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs"
                    title="Open in new tab"
                  >
                    Open ↗
                  </a>
                )}
                {c.launchable && (
                  <button
                    onClick={() => onLaunch(c.id)}
                    className="btn-secondary text-xs"
                  >
                    Start
                  </button>
                )}
                {done ? (
                  <div className="text-accent-green text-2xl ml-1">✓</div>
                ) : (
                  <button
                    className="btn-secondary text-xs"
                    onClick={() => handleComplete(c.id, c.minutes)}
                    title="Mark as done"
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completed.length >= 2 && (
        <div className="mt-4 p-3 bg-sun-arg/10 border border-sun-arg/30 rounded-xl text-center">
          <div className="font-bold text-sun-arg">¡Día completo! 🔥</div>
          <div className="text-xs text-gray-400 mt-1">Streak protected. Vamos.</div>
        </div>
      )}
    </div>
  );
}
