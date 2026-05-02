# Español Ahora 🇦🇷

> Buenos Aires or bust. October deadline. No zero days.

A daily Spanish training app built around the actual bottleneck (listening + production), not vocabulary memorization. Replaces a folder full of half-used apps with one daily forcing function.

## Stage 1 (live now)

- **Streak engine** — current streak, longest streak, total minutes, days complete
- **Buenos Aires countdown** — days until trip, phase indicator (Foundation → Build → BA Mode)
- **Daily session tracker** — mark off components as you complete them
- **Real-world capture** — log phrases you wanted to say or didn't catch

## Stage 2 (next session)

- AI Tutor chat (Claude API, Argentine Spanish, only corrects what breaks meaning)
- Sentence builder drill (English → Spanish, scored)
- 200+ seeded prompts across Family / Work / BA Travel / Daily Life

## Stage 3 (after that)

- Listening drill with variable-speed audio
- BA Module unlocks at T-minus 8 weeks (vos, sh-sounds, taxi/restaurant/Subte vocab)

---

## Setup (one-time, ~10 min)

You need Node.js installed. If `node --version` returns nothing, install it from [nodejs.org](https://nodejs.org) (LTS version).

```bash
# Clone the repo
git clone https://github.com/execout18/espanol-ahora.git
cd espanol-ahora

# Install dependencies
npm install

# Run it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it. All your data lives in browser localStorage for now (no server, no database to set up). Move to Vercel later for phone access.

## Daily usage

Open every morning with coffee. Mark off:

1. **João lesson** (~12 min) — your listening engine
2. **Capture** (~1 min) — log one phrase from yesterday

Stage 2 adds:

3. **Sentence drill** (~8 min)
4. **AI tutor** (~10 min)

**Streak protected at 2+ components.** Don't break the chain.

## Trip date

Set in `src/lib/storage.ts`:

```ts
export const TRIP_DATE = new Date("2026-10-15T00:00:00");
```

Update to your exact flight date when booked.

---

Built with Claude as partner. Methodology informed by Krashen comprehensible input, Paul Noble building blocks, and the Madrigal cognate bridge.
