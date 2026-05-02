"use client";

import { useState } from "react";
import { addCapture, Capture } from "@/lib/storage";

interface Props {
  recentCaptures: Capture[];
  onAdd: () => void;
}

export default function QuickCapture({ recentCaptures, onAdd }: Props) {
  const [type, setType] = useState<"heard" | "wanted_to_say">("wanted_to_say");
  const [text, setText] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    addCapture({ type, text: text.trim(), context: context.trim() || undefined });
    setText("");
    setContext("");
    onAdd();
  };

  const unresolvedCount = recentCaptures.filter((c) => !c.resolved).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Real-World Capture</h2>
        {unresolvedCount > 0 && (
          <div className="text-xs bg-sun-arg/20 text-sun-arg px-3 py-1 rounded-full font-bold">
            {unresolvedCount} to drill
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setType("wanted_to_say")}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-colors ${
            type === "wanted_to_say"
              ? "bg-sun-arg text-ink-900"
              : "bg-ink-700 text-gray-300"
          }`}
        >
          Wanted to say
        </button>
        <button
          onClick={() => setType("heard")}
          className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-colors ${
            type === "heard"
              ? "bg-sky-arg text-ink-900"
              : "bg-ink-700 text-gray-300"
          }`}
        >
          Heard / didn't catch
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          type === "wanted_to_say"
            ? "What did you want to say in Spanish?"
            : "What did you hear? (rough phonetic OK)"
        }
        className="w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sun-arg"
        rows={2}
      />

      <input
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Context (optional) — e.g., dinner with Carly"
        className="w-full bg-ink-900 border border-ink-700 rounded-xl p-2 mt-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sun-arg"
      />

      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="btn-primary w-full mt-3 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Log it
      </button>

      {recentCaptures.length > 0 && (
        <div className="mt-6">
          <div className="stat-label mb-2">Recent</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentCaptures.slice(-5).reverse().map((c) => (
              <div
                key={c.id}
                className={`text-sm p-2 rounded-lg border ${
                  c.resolved
                    ? "bg-ink-900/50 border-ink-700/50 opacity-60"
                    : "bg-ink-900 border-ink-700"
                }`}
              >
                <span
                  className={`text-xs font-bold mr-2 ${
                    c.type === "wanted_to_say" ? "text-sun-arg" : "text-sky-arg"
                  }`}
                >
                  {c.type === "wanted_to_say" ? "WTS" : "HRD"}
                </span>
                <span className="text-gray-200">{c.text}</span>
                {c.context && (
                  <span className="text-xs text-gray-500 ml-2">— {c.context}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
