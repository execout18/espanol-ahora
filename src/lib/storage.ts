// Storage layer for Espanol Ahora
// All state lives in browser localStorage for v1
// Trip target: Buenos Aires, October 2026

export const TRIP_DATE = new Date("2026-10-15T00:00:00"); // adjust if needed
export const TRIP_NAME = "Buenos Aires";

const STORAGE_KEYS = {
  SESSIONS: "ea_sessions", // array of completed daily sessions
  CAPTURES: "ea_captures", // real-world phrase captures
  SETTINGS: "ea_settings", // user settings
  LAST_SESSION_TYPE: "ea_last_session", // for resume
} as const;

export type SessionType = "joao" | "drill" | "tutor" | "capture" | "listening";

export interface DailySession {
  date: string; // YYYY-MM-DD
  components: SessionType[]; // which pieces were completed
  totalMinutes: number;
  timestamp: number;
}

export interface Capture {
  id: string;
  type: "heard" | "wanted_to_say";
  text: string;
  context?: string;
  date: string;
  resolved: boolean; // marked true once you've drilled it
}

export interface Settings {
  dailyTargetMinutes: number;
  reminderTime: string; // HH:MM
  tripDate: string; // ISO date string
}

const DEFAULT_SETTINGS: Settings = {
  dailyTargetMinutes: 25,
  reminderTime: "07:00",
  tripDate: TRIP_DATE.toISOString(),
};

// ---------- helpers ----------
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function todayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ---------- sessions ----------
export function getSessions(): DailySession[] {
  if (typeof window === "undefined") return [];
  return safeParse<DailySession[]>(localStorage.getItem(STORAGE_KEYS.SESSIONS), []);
}

export function saveSession(component: SessionType, minutes: number): DailySession {
  const sessions = getSessions();
  const today = todayStr();
  const existing = sessions.find((s) => s.date === today);

  if (existing) {
    if (!existing.components.includes(component)) {
      existing.components.push(component);
    }
    existing.totalMinutes += minutes;
    existing.timestamp = Date.now();
  } else {
    sessions.push({
      date: today,
      components: [component],
      totalMinutes: minutes,
      timestamp: Date.now(),
    });
  }

  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  localStorage.setItem(STORAGE_KEYS.LAST_SESSION_TYPE, component);
  return existing || sessions[sessions.length - 1];
}

export function getTodaySession(): DailySession | null {
  const today = todayStr();
  return getSessions().find((s) => s.date === today) || null;
}

// ---------- streak math ----------
export interface StreakStats {
  current: number;
  longest: number;
  totalDays: number;
  totalMinutes: number;
  todayComplete: boolean;
  todayPartial: boolean;
}

export function getStreakStats(): StreakStats {
  const sessions = getSessions();
  if (sessions.length === 0) {
    return {
      current: 0,
      longest: 0,
      totalDays: 0,
      totalMinutes: 0,
      todayComplete: false,
      todayPartial: false,
    };
  }

  // Sort sessions by date ascending
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const today = todayStr();
  const todaySession = sorted.find((s) => s.date === today);
  const todayComplete = !!todaySession && todaySession.components.length >= 2;
  const todayPartial = !!todaySession && todaySession.components.length === 1;

  // Calculate longest streak
  let longest = 0;
  let running = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      running += 1;
    } else {
      longest = Math.max(longest, running);
      running = 1;
    }
  }
  longest = Math.max(longest, running);

  // Calculate current streak (counting back from today or yesterday)
  let current = 0;
  const cursor = new Date();
  // If today not done, start from yesterday — streak isn't broken until a full day passes
  if (!todaySession) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (true) {
    const ds = dateStr(cursor);
    const found = sorted.find((s) => s.date === ds);
    if (found) {
      current += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  const totalMinutes = sorted.reduce((sum, s) => sum + s.totalMinutes, 0);

  return {
    current,
    longest,
    totalDays: sorted.length,
    totalMinutes,
    todayComplete,
    todayPartial,
  };
}

// ---------- countdown ----------
export function getDaysUntilTrip(): number {
  const settings = getSettings();
  const trip = new Date(settings.tripDate);
  const now = new Date();
  const diff = trip.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

// ---------- captures ----------
export function getCaptures(): Capture[] {
  if (typeof window === "undefined") return [];
  return safeParse<Capture[]>(localStorage.getItem(STORAGE_KEYS.CAPTURES), []);
}

export function addCapture(c: Omit<Capture, "id" | "date" | "resolved">): Capture {
  const captures = getCaptures();
  const newCapture: Capture = {
    ...c,
    id: `cap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: todayStr(),
    resolved: false,
  };
  captures.push(newCapture);
  localStorage.setItem(STORAGE_KEYS.CAPTURES, JSON.stringify(captures));
  return newCapture;
}

export function resolveCapture(id: string): void {
  const captures = getCaptures();
  const c = captures.find((x) => x.id === id);
  if (c) {
    c.resolved = true;
    localStorage.setItem(STORAGE_KEYS.CAPTURES, JSON.stringify(captures));
  }
}

// ---------- settings ----------
export function getSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  return safeParse<Settings>(
    localStorage.getItem(STORAGE_KEYS.SETTINGS),
    DEFAULT_SETTINGS
  );
}

export function saveSettings(s: Partial<Settings>): Settings {
  const current = getSettings();
  const merged = { ...current, ...s };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  return merged;
}

// ---------- dev helpers ----------
export function resetAll(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
