"use client";

import { useState, useRef, useEffect } from "react";
import { SEED_CLIPS, SCENARIO_META, ListeningClip } from "@/lib/listeningClips";
import type { ListeningScenario, ListeningDifficulty } from "@/app/api/listening/script/route";
import { scoreAnswer } from "@/lib/scoring";
import { saveSession } from "@/lib/storage";

interface Props {
  onComplete: () => void;
}

type Speed = 0.6 | 0.75 | 0.85 | 1.0 | 1.15;

const SPEED_LABELS: Record<Speed, string> = {
  0.6: "0.6x · slow",
  0.75: "0.75x",
  0.85: "0.85x",
  1.0: "1.0x · native",
  1.15: "1.15x · fast",
};

export default function ListeningDrill({ onComplete }: Props) {
  const [scenario, setScenario] = useState<ListeningScenario | "all">("all");
  const [difficulty, setDifficulty] = useState<ListeningDifficulty>(1);
  const [speed, setSpeed] = useState<Speed>(0.85);
  const [currentClip, setCurrentClip] = useState<ListeningClip | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState("");
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [generatingNew, setGeneratingNew] = useState(false);
  const [sessionLogged, setSessionLogged] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Pick first clip on mount
  useEffect(() => {
    pickClip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update audio playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed, audioUrl]);

  const pickClip = () => {
    let pool = SEED_CLIPS;
    if (scenario !== "all") pool = pool.filter((c) => c.scenario === scenario);
    pool = pool.filter((c) => c.difficulty === difficulty);
    if (pool.length === 0) {
      pool = SEED_CLIPS.filter((c) => c.difficulty === difficulty);
    }
    if (pool.length === 0) pool = SEED_CLIPS;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setCurrentClip(next);
    setUserInput("");
    setReveal(false);
    setScore(null);
    setAudioError(null);
    loadAudio(next.spanish, next.gender);
  };

  const loadAudio = async (text: string, gender: "male" | "female") => {
    setAudioLoading(true);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/listening/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, gender }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      setAudioError(err.message || "Failed to load audio");
    } finally {
      setAudioLoading(false);
    }
  };

  const generateNewClip = async () => {
    setGeneratingNew(true);
    setAudioError(null);
    try {
      const useScenario = scenario === "all"
        ? (["kid_speed", "mom_to_kid", "service_worker", "two_friends"] as ListeningScenario[])[
            Math.floor(Math.random() * 4)
          ]
        : scenario;

      const res = await fetch("/api/listening/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: useScenario, difficulty }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const newClip: ListeningClip = {
        id: `gen_${Date.now()}`,
        scenario: data.scenario,
        difficulty: data.difficulty,
        spanish: data.spanish,
        english: data.english,
        vocab: data.vocab || [],
        gender: useScenario === "kid_speed" || useScenario === "mom_to_kid" ? "female" : Math.random() > 0.5 ? "male" : "female",
      };
      setCurrentClip(newClip);
      setUserInput("");
      setReveal(false);
      setScore(null);
      loadAudio(newClip.spanish, newClip.gender);
    } catch (err: any) {
      setAudioError(err.message || "Failed to generate clip");
    } finally {
      setGeneratingNew(false);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
    }
  };

  const handleCheck = () => {
    if (!currentClip) return;
    const result = scoreAnswer(userInput, [currentClip.spanish]);
    setScore(result.score);
    setReveal(true);
  };

  const handleNext = () => {
    const newCompleted = completed + 1;
    setCompleted(newCompleted);
    if (newCompleted >= 3 && !sessionLogged) {
      saveSession("listening", 10);
      setSessionLogged(true);
      onComplete();
    }
    pickClip();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">🎧 Listening Drill</h2>
          <div className="text-xs text-gray-500 mt-1">
            {completed} done · {sessionLogged ? "✓ session credit earned" : "3 to credit day"}
          </div>
        </div>
      </div>

      {/* Scenario filter */}
      <div className="mb-3">
        <div className="stat-label mb-2">Scenario</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setScenario("all"); setTimeout(pickClip, 0); }}
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              scenario === "all" ? "bg-sun-arg text-ink-900" : "bg-ink-700 text-gray-300"
            }`}
          >
            All
          </button>
          {(Object.keys(SCENARIO_META) as ListeningScenario[]).map((s) => {
            const meta = SCENARIO_META[s];
            const active = scenario === s;
            return (
              <button
                key={s}
                onClick={() => { setScenario(s); setTimeout(pickClip, 0); }}
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  active ? "bg-sun-arg text-ink-900" : "bg-ink-700 text-gray-300"
                }`}
                title={meta.description}
              >
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty + Speed */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <div className="stat-label mb-2">Difficulty</div>
          <div className="flex gap-1">
            {([1, 2, 3] as ListeningDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); setTimeout(pickClip, 0); }}
                className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                  difficulty === d ? "bg-accent-green text-ink-900" : "bg-ink-700 text-gray-300"
                }`}
              >
                {d}/3
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="stat-label mb-2">Speed</div>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value) as Speed)}
            className="w-full bg-ink-700 text-white text-xs font-bold rounded-lg py-1 px-2"
          >
            {(Object.keys(SPEED_LABELS) as unknown as Speed[]).map((s) => (
              <option key={s} value={s}>
                {SPEED_LABELS[s as Speed]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audio player */}
      <div className="bg-ink-900 border border-ink-700 rounded-xl p-4 mb-3">
        {audioLoading ? (
          <div className="text-center text-gray-400 text-sm py-4">
            🔊 Loading audio...
          </div>
        ) : audioError ? (
          <div className="text-sm">
            <div className="text-accent-red font-bold mb-1">Audio error</div>
            <div className="text-gray-300">{audioError}</div>
            {audioError.includes("ELEVENLABS_API_KEY") && (
              <div className="text-xs text-gray-400 mt-2">
                Add ELEVENLABS_API_KEY in Vercel → Settings → Environment Variables, then redeploy.
              </div>
            )}
          </div>
        ) : audioUrl ? (
          <div className="flex items-center gap-3">
            <button
              onClick={playAudio}
              className="bg-sun-arg text-ink-900 rounded-full w-14 h-14 flex items-center justify-center text-2xl hover:bg-yellow-400 transition-colors flex-shrink-0"
              aria-label="Play audio"
            >
              ▶
            </button>
            <div className="flex-1 text-sm text-gray-400">
              <div>Tap to play. Listen carefully.</div>
              <div className="text-xs mt-1">
                Speed: <span className="text-sun-arg font-bold">{SPEED_LABELS[speed]}</span>
              </div>
            </div>
            <audio ref={audioRef} src={audioUrl} preload="auto" />
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="mb-3">
        <div className="stat-label mb-2">Type what you heard (best guess)</div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !reveal) {
              e.preventDefault();
              handleCheck();
            }
          }}
          placeholder="Escribe en español..."
          disabled={reveal}
          className="w-full bg-ink-900 border border-ink-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sun-arg disabled:opacity-60"
          rows={3}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
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
              Reveal
            </button>
          </>
        ) : (
          <>
            <button onClick={handleNext} className="btn-primary flex-1">
              Next clip →
            </button>
            <button
              onClick={generateNewClip}
              disabled={generatingNew}
              className="btn-secondary disabled:opacity-30"
              title="Generate brand new clip with AI"
            >
              {generatingNew ? "..." : "✨ New AI clip"}
            </button>
          </>
        )}
      </div>

      {/* Reveal section */}
      {reveal && currentClip && (
        <div className="mt-4 space-y-3">
          {score !== null && (
            <div className={`p-3 rounded-xl border text-center ${
              score >= 90 ? "bg-accent-green/10 border-accent-green/30" :
              score >= 60 ? "bg-sun-arg/10 border-sun-arg/30" :
              "bg-accent-red/10 border-accent-red/30"
            }`}>
              <div className="text-3xl font-black">{score}</div>
              <div className="text-xs text-gray-400">match score</div>
            </div>
          )}

          <div className="bg-ink-900 border border-ink-700 rounded-xl p-3">
            <div className="stat-label mb-1">Spanish</div>
            <div className="text-white">{currentClip.spanish}</div>
          </div>

          <div className="bg-ink-900 border border-sky-arg/30 rounded-xl p-3">
            <div className="stat-label mb-1 text-sky-arg">English</div>
            <div className="text-gray-200">{currentClip.english}</div>
          </div>

          {currentClip.vocab && currentClip.vocab.length > 0 && (
            <div className="bg-ink-900 border border-ink-700 rounded-xl p-3">
              <div className="stat-label mb-2">Vocab notes</div>
              <div className="space-y-1">
                {currentClip.vocab.map((v, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-sun-arg font-bold">{v.word}</span>
                    <span className="text-gray-400"> — {v.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-600 text-center pt-2">
            💡 Replay it 2-3 more times before moving on. Listening = repetition.
          </div>
        </div>
      )}
    </div>
  );
}
