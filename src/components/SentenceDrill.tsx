"use client";

import { useState, useEffect } from "react";
import {
  PROMPTS,
  CATEGORY_META,
  Category,
  Prompt,
  getRandomPrompt,
} from "@/lib/prompts";
import { scoreAnswer, ScoreResult } from "@/lib/scoring";
import { saveSession, getDaysUntilTrip } from "@/lib/storage";

interface Props {
  onComplete: () => void;
}

const BA_MODE_THRESHOLD = 56; // last 8 weeks

export default function SentenceDrill({ onComplete }: Props) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [reveal, setReveal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [baMode, setBaMode] = useState(false);

  useEffect(() => {
    setBaMode(getDaysUntilTrip() <= BA_MODE_THRESHOLD);
    nextPrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextPrompt = () => {
    const next = getRandomPrompt(filter === "all" ? undefined : { category: filter });
    setCurrentPrompt(next);
    setUserInput("");
    setResult(null);
    setReveal(false);
  };

  const handleCheck = () => {
    if (!currentPrompt) return;
    const accepted = [
      currentPrompt.spanish,
      ...(currentPrompt.alternates || []),
      ...(baMode && currentPrompt.argentine ? [currentPrompt.argentine] : []),
    ];
    const r = scoreAnswer(userInput, accepted);
    setResult(r);
    setReveal(true);
    if (r.score >= 80) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setCompleted((c) => c + 1);
    if (completed + 1 === 5) {
      // Session credit at 5 prompts
      saveSession("drill", 8);
      onComplete();
    }
    nextPrompt();
  };

  if (!currentPrompt) return null;

  const categories: Array<Category | "all"> = ["all", "family", "work", "ba_travel", "daily", "dealmaking"];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Sentence Drill</h2>
          <div className="text-xs text-gray-500 mt-1">
            {completed} done this session · streak {streak} 🔥
          </div>
        </div>
        {baMode && (
          <div className="text-xs bg-sun-arg/20 text-sun-arg px-3 py-1 rounded-full font-bold">
            🇦🇷 BA Mode active
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => {
          const meta = c === "all" ? null : CATEGORY_META[c];
          const active = filter === c;
          return (
            <button
              key={c}
              onClick={() => {
                setFilter(c);
                setTimeout(nextPrompt, 0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                active
                  ? "bg-sun-arg text-ink-900"
                  : "bg-ink-700 text-gray-300 hover:bg-ink-700/70"
              }`}
            >
              {meta ? `${meta.emoji} ${meta.label}` : "All"}
            </button>
          );
        })}
      </div>

      {/* The prompt */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-4 mb-3">
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
          {CATEGORY_META[currentPrompt.category].emoji}{" "}
          {CATEGORY_META[currentPrompt.category].label} · Difficulty{" "}
          {currentPrompt.difficulty}/3
        </div>
        <div className="text-lg text-white font-medium">
          {currentPrompt.english}
        </div>
      </div>

      {/* Input */}
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !reveal) {
            e.preventDefault();
            handleCheck();
          }
        }}
        placeholder="Write it in Spanish..."
        disabled={reveal}
        className="w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sun-arg disabled:opacity-60"
        rows={2}
        autoFocus
      />

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        {!reveal ? (
          <>
            <button
              onClick={handleCheck}
              disabled={!userInput.trim()}
              className="btn-primary flex-1 disabled:opacity-30"
            >
              Check (Enter ↵)
            </button>
            <button onClick={() => setReveal(true)} className="btn-secondary">
              Show answer
            </button>
          </>
        ) : (
          <button onClick={handleNext} className="btn-primary flex-1">
            Next →
          </button>
        )}
      </div>

      {/* Result */}
      {reveal && (
        <div className="mt-4 space-y-3">
          {result && (
            <div
              className={`p-3 rounded-xl border ${
                result.match === "exact"
                  ? "bg-accent-green/10 border-accent-green/30"
                  : result.match === "close"
                  ? "bg-sun-arg/10 border-sun-arg/30"
                  : "bg-accent-red/10 border-accent-red/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold">
                  {result.match === "exact" && "✓ Got it"}
                  {result.match === "close" && "≈ Close"}
                  {result.match === "partial" && "△ Partial"}
                  {result.match === "miss" && "✗ Miss"}
                </div>
                <div className="text-2xl font-black">{result.score}</div>
              </div>
              <div className="text-sm text-gray-300">{result.feedback}</div>
            </div>
          )}

          <div className="bg-ink-900 border border-ink-700 rounded-xl p-3">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Answer
            </div>
            <div className="text-lg text-white">{currentPrompt.spanish}</div>
            {currentPrompt.argentine && (
              <div className="text-sm text-sun-arg mt-2">
                🇦🇷 Argentine: {currentPrompt.argentine}
              </div>
            )}
            {currentPrompt.alternates && currentPrompt.alternates.length > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                Also OK: {currentPrompt.alternates.join(" · ")}
              </div>
            )}
            {currentPrompt.notes && (
              <div className="text-xs text-gray-400 mt-3 italic border-t border-ink-700 pt-2">
                💡 {currentPrompt.notes}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600 text-center">
        Complete 5 prompts to mark Sentence Drill done for the day
      </div>
    </div>
  );
}
