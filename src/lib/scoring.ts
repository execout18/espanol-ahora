// Lightweight Spanish answer scoring
// We're forgiving on accents and punctuation — focus is on getting the words right

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[¿?¡!.,;:]/g, "") // strip punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export interface ScoreResult {
  score: number; // 0-100
  match: "exact" | "close" | "partial" | "miss";
  feedback: string;
}

export function scoreAnswer(userAnswer: string, accepted: string[]): ScoreResult {
  const userNorm = normalize(userAnswer);
  const acceptedNorms = accepted.map(normalize);

  if (!userNorm) {
    return { score: 0, match: "miss", feedback: "No answer given." };
  }

  // Exact match (after normalization)
  if (acceptedNorms.includes(userNorm)) {
    // Check if they had the accents right
    const exactWithAccents = accepted.some((a) => a.toLowerCase() === userAnswer.toLowerCase());
    if (exactWithAccents) {
      return { score: 100, match: "exact", feedback: "¡Perfecto! Accents and all." };
    }
    return { score: 95, match: "exact", feedback: "Right words — watch your accent marks." };
  }

  // Word-level overlap
  const userWords = new Set(userNorm.split(" "));
  const bestOverlap = Math.max(
    ...acceptedNorms.map((a) => {
      const accWords = a.split(" ");
      const matches = accWords.filter((w) => userWords.has(w)).length;
      return matches / accWords.length;
    })
  );

  if (bestOverlap >= 0.8) {
    return {
      score: Math.round(bestOverlap * 100),
      match: "close",
      feedback: "Very close — small word swap or order issue.",
    };
  }
  if (bestOverlap >= 0.5) {
    return {
      score: Math.round(bestOverlap * 100),
      match: "partial",
      feedback: "Got the idea, missing some words.",
    };
  }
  return {
    score: Math.round(bestOverlap * 100),
    match: "miss",
    feedback: "Not quite — review and try again.",
  };
}
