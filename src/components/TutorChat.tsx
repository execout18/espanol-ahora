"use client";

import { useState, useRef, useEffect } from "react";
import { saveSession } from "@/lib/storage";

interface Props {
  onComplete: () => void;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function TutorChat({ onComplete }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [sessionLogged, setSessionLogged] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Kickoff message
  useEffect(() => {
    if (messages.length === 0) {
      send("¡Hola! Empecemos.", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = async (text: string, isInitial = false) => {
    if (!text.trim()) return;
    setError(null);

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = isInitial ? [userMsg] : [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);

      const newCount = exchangeCount + 1;
      setExchangeCount(newCount);

      // Log session credit at 5 exchanges
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

  const handleSubmit = () => {
    if (!loading && input.trim()) {
      send(input);
    }
  };

  const reset = () => {
    setMessages([]);
    setExchangeCount(0);
    setSessionLogged(false);
    setError(null);
    setTimeout(() => send("¡Hola! Empecemos de nuevo.", true), 100);
  };

  return (
    <div className="card flex flex-col" style={{ height: "600px" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            💬 AI Tutor
            <span className="text-xs bg-sun-arg/20 text-sun-arg px-2 py-0.5 rounded-full font-bold">
              Argentine
            </span>
          </h2>
          <div className="text-xs text-gray-500 mt-1">
            {exchangeCount} exchanges
            {sessionLogged && " · ✓ session credit earned"}
          </div>
        </div>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-white">
          ↻ Reset
        </button>
      </div>

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
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                m.role === "user"
                  ? "bg-sun-arg text-ink-900 rounded-br-sm"
                  : "bg-ink-700 text-white rounded-bl-sm"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
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
          placeholder="Escribí en español... (or English if you're stuck)"
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
        Tip: try "switch to coach mode" or "let's roleplay a BA taxi"
      </div>
    </div>
  );
}
