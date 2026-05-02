"use client";

import { useEffect, useState } from "react";
import StreakCounter from "@/components/StreakCounter";
import TripCountdown from "@/components/TripCountdown";
import TodaySession from "@/components/TodaySession";
import QuickCapture from "@/components/QuickCapture";
import SentenceDrill from "@/components/SentenceDrill";
import TutorChat from "@/components/TutorChat";
import ListeningDrill from "@/components/ListeningDrill";
import {
  getStreakStats,
  getDaysUntilTrip,
  getTodaySession,
  getCaptures,
  StreakStats,
  DailySession,
  Capture,
  SessionType,
} from "@/lib/storage";

type Panel = "dashboard" | "drill" | "tutor" | "listening";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [panel, setPanel] = useState<Panel>("dashboard");
  const [stats, setStats] = useState<StreakStats>({
    current: 0,
    longest: 0,
    totalDays: 0,
    totalMinutes: 0,
    todayComplete: false,
    todayPartial: false,
  });
  const [daysLeft, setDaysLeft] = useState(0);
  const [todaySession, setTodaySession] = useState<DailySession | null>(null);
  const [captures, setCaptures] = useState<Capture[]>([]);

  const refresh = () => {
    setStats(getStreakStats());
    setDaysLeft(getDaysUntilTrip());
    setTodaySession(getTodaySession());
    setCaptures(getCaptures());
  };

  useEffect(() => {
    setMounted(true);
    refresh();
  }, []);

  const handleLaunch = (component: SessionType) => {
    if (component === "drill") setPanel("drill");
    else if (component === "tutor") setPanel("tutor");
    else if (component === "listening") setPanel("listening");
  };

  if (!mounted) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => setPanel("dashboard")}
            className="text-3xl md:text-4xl font-black tracking-tight hover:opacity-80 transition-opacity"
          >
            Español <span className="text-sun-arg">Ahora</span>
          </button>
          <p className="text-gray-400 text-sm mt-1">En casa. En México. En todas partes.</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-gray-500">Today</div>
          <div className="text-sm text-gray-300">
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Tab nav (visible when not on dashboard) */}
      {panel !== "dashboard" && (
        <div className="mb-4">
          <button
            onClick={() => setPanel("dashboard")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to dashboard
          </button>
        </div>
      )}

      {panel === "dashboard" && (
        <>
          {/* Top row */}
          <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TripCountdown daysLeft={daysLeft} totalDaysCompleted={stats.totalDays} />
            </div>
            <div className="card flex flex-col justify-center">
              <div className="stat-label mb-2 text-center">Daily Goal</div>
              <div className="text-center">
                {stats.todayComplete ? (
                  <div>
                    <div className="text-5xl mb-2">✅</div>
                    <div className="font-bold text-accent-green">Done for today</div>
                    <div className="text-xs text-gray-500 mt-1">streak protected</div>
                  </div>
                ) : stats.todayPartial ? (
                  <div>
                    <div className="text-5xl mb-2">⚡</div>
                    <div className="font-bold text-sun-arg">Almost there</div>
                    <div className="text-xs text-gray-500 mt-1">one more component</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-2">☕</div>
                    <div className="font-bold text-white">Time to start</div>
                    <div className="text-xs text-gray-500 mt-1">no zero days</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <StreakCounter stats={stats} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TodaySession
              todaySession={todaySession}
              onUpdate={refresh}
              onLaunch={handleLaunch}
            />
            <QuickCapture recentCaptures={captures} onAdd={refresh} />
          </section>
        </>
      )}

      {panel === "drill" && (
        <section className="max-w-2xl mx-auto">
          <SentenceDrill onComplete={refresh} />
        </section>
      )}

      {panel === "tutor" && (
        <section className="max-w-3xl mx-auto">
          <TutorChat onComplete={refresh} />
        </section>
      )}

      {panel === "listening" && (
        <section className="max-w-2xl mx-auto">
          <ListeningDrill onComplete={refresh} />
        </section>
      )}

      <footer className="mt-12 text-center text-xs text-gray-600">
        <div>Stage 2 · Streak + Capture + Drill + AI Tutor</div>
      </footer>
    </main>
  );
}
