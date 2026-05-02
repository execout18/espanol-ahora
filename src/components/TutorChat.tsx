"use client";

import { useState, useRef, useEffect } from "react";
import { saveSession } from "@/lib/storage";

type TutorMode = "onboarding" | "build" | "ba_prep";

interface Props {
  onComplete: () => void;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  explanation?: string;
  loadingExplanation?: boolean;
}

const MODE_META: Record<TutorMode, { label: string; emoji: string; description: string; color: string }> = {
  onboarding: {
    label: "Onboarding",
    emoji: "🟢",
    description: "Bilingual · Mexican · simple",
    color: "bg-accent-green/20 text-accent-green border-accent-green/30",
  },
  build: {
    label: "Build",
    emoji: "🟡",
    description: "Spanish primary · Mexican",
    color: "bg-sun-arg/20 text-sun-arg border-sun-arg/30",
  },
  ba_prep: {
    label: "BA Prep",
    emoji: "🔴",
    description: "Argentine · porteño",
    color: "bg-accent-red/20 text-accent-red border-accent-red/30",
  },
};

const MODE_STORAGE_KEY = "ea_tutor_mode";
const TRANSLATE_STORAGE_KEY = "ea_tutor_translate";

export default function TutorChat({ onComplete }: Props) {
  const [mode, setMode] = useState<TutorMode>("onboarding");
  const [translate, setTranslate] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [sessionLogged, setSessionLogged] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved mode preference
  useEffect(() => {
    const saved = localStorage.getItem(MODE_STORAGE_KEY) as TutorMode | null;
    if (saved && (saved === "onboarding" || saved === "build" || saved === "ba_prep")) {
      setMode(saved);
    }
    const savedTranslate = localStorage.getItem(TRANSLATE_STORAGE_KEY);
    if (savedTranslate === "false") {
      setTranslate(false);
    }
    setInitialized(true);
  }, []);

  // Kickoff after mode loaded
  useEffect(() => {
    if (initialized && messages.length === 0) {
      sendMessage("¡Hola!", true, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const switchMode = (newMode: TutorMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
    // Reset conversation with new mode
    setMessages([]);
    setExchangeCount(0);
    setSessionLogged(false);
    setTimeout(() => sendMessage("¡Hola!", true, newMode), 100);
  };

  const sendMessage = async (text: string, isInitial = false, modeOverride?: TutorMode) => {
    if (!text.trim()) return;
    setError(null);

    const useMode = modeOverride || mode;
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = isInitial ? [userMsg] : [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, mode: useMode, translate }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);

      const newCount = exchangeCount + 1;
      setExchangeCount(newCount);

      if (newCount >= 5 && !sessionLogged) {
        saveSession("tutor", 10);
        setSessionLogged(true);
        onComplete();
      }
    } catch (err: any) {
      setError(err.message || "Failed to reach tutor");
    } finally {
      setLoading(false);
    }
  };

  const explainMessage = async (idx: number) => {
    const msg = messages[idx];
    if (!msg || msg.explanation || msg.loadingExplanation) return;

    setMessages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], loadingExplanation: true };
      return copy;
    });

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spanish: msg.content }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          explanation: data.explanation || data.error || "Failed to explain",
          loadingExplanation: false,
        };
        return copy;
      });
    } catch (err: any) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          explanation: `Error: ${err.message}`,
          loadingExplanation: false,
        };
        return copy;
      });
    }
  };

  const handleSubmit = () => {
    if (!loading && input.trim()) {
      sendMessage(input);
    }
  };

  const reset = () => {
    setMessages([]);
    setExchangeCount(0);
    setSessionLogged(false);
    setError(null);
    setTimeout(() => sendMessage("¡Hola!", true), 100);
  };

  return (
    <div className="card flex flex-col" style={{ height: "650px" }}>
      {/* Header with mode selector */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold">💬 AI Tutor</h2>
          <div className="text-xs text-gray-500 mt-1">
            {exchangeCount} exchanges
            {sessionLogged && " · ✓ session credit earned"}
          </div>
        </div>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-white">
          ↻ Reset
        </button>
      </div>

      {/* Mode selector pills */}
      <div className="flex gap-2 mb-3">
        {(["onboarding", "build", "ba_prep"] as TutorMode[]).map((m) => {
          const meta = MODE_META[m];
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 px-2 py-2 rounded-xl text-xs font-bold border transition-all ${
                active ? meta.color : "bg-ink-700 text-gray-400 border-ink-700 hover:text-white"
              }`}
            >
              <div>{meta.emoji} {meta.label}</div>
              <div className="text-[10px] font-normal opacity-80 mt-0.5">{meta.description}</div>
            </button>
          );
        })}
      </div>

      {/* Translation toggle (onboarding mode only) */}
      {mode === "onboarding" && (
        <div className="flex items-center justify-between mb-3 px-3 py-2 bg-ink-900 border border-ink-700 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs">🇬🇧</span>
            <span className="text-xs text-gray-300 font-medium">Show English translations</span>
          </div>
          <button
            onClick={() => {
              const next = !translate;
              setTranslate(next);
              localStorage.setItem(TRANSLATE_STORAGE_KEY, String(next));
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              translate ? "bg-accent-green" : "bg-ink-700"
            }`}
            aria-label="Toggle translations"
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                translate ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-ink-900 rounded-xl p-3 mb-3 space-y-3"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  m.role === "user"
                    ? "bg-sun-arg text-ink-900 rounded-br-sm"
                    : "bg-ink-700 text-white rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </div>

              {/* Explain button on tutor messages */}
              {m.role === "assistant" && !m.explanation && !m.loadingExplanation && (
                <button
                  onClick={() => explainMessage(i)}
                  className="text-[10px] text-gray-500 hover:text-sky-arg mt-1 ml-1"
                >
                  🔍 Explain in English
                </button>
              )}
              {m.loadingExplanation && (
                <div className="text-[10px] text-gray-500 mt-1 ml-1 italic">
                  translating...
                </div>
              )}
              {m.explanation && (
                <div className="mt-1 ml-1 text-xs bg-sky-arg/10 border border-sky-arg/30 rounded-lg p-2 text-gray-200">
                  <div className="text-[10px] uppercase tracking-widest text-sky-arg font-bold mb-1">
                    English
                  </div>
                  <div className="whitespace-pre-wrap">{m.explanation}</div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-ink-700 text-gray-400 rounded-2xl px-4 py-2 rounded-bl-sm text-sm italic">
              pensando...
            </div>
          </div>
        )}
        {error && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-xl p-3 text-sm">
            <div className="font-bold text-accent-red mb-1">Tutor unavailable</div>
            <div className="text-gray-300">{error}</div>
            {error.includes("ANTHROPIC_API_KEY") && (
              <div className="text-xs text-gray-400 mt-2">
                Add the env var in Vercel → Settings → Environment Variables, then redeploy.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Escribe en español... (or English if stuck)"
          disabled={loading}
          className="flex-1 bg-ink-900 border border-ink-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sun-arg disabled:opacity-60"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="btn-primary disabled:opacity-30"
        >
          Send
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-600 text-center">
        🟢 start here · switch up when ready · 5 exchanges = day complete
      </div>
    </div>
  );
}
