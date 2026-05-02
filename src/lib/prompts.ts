// Sentence drill prompts — seeded for execout18
// Categories matched to actual life: family, work (M&A/legal), BA travel, daily, deal-making

export type Category = "family" | "work" | "ba_travel" | "daily" | "dealmaking";
export type Difficulty = 1 | 2 | 3; // 1=easy, 2=medium, 3=hard

export interface Prompt {
  id: string;
  english: string;
  spanish: string; // accepted "good" answer
  alternates?: string[]; // also-acceptable variations
  category: Category;
  difficulty: Difficulty;
  notes?: string; // grammar/vocab notes shown after answering
  argentine?: string; // Rioplatense version (vos, etc.) shown when BA mode is active
}

export const PROMPTS: Prompt[] = [
  // ---------- FAMILY ----------
  {
    id: "f1",
    english: "Put your shoes on.",
    spanish: "Ponte los zapatos.",
    alternates: ["Pónte los zapatos."],
    argentine: "Ponete los zapatos.",
    category: "family",
    difficulty: 1,
    notes: "Imperative with reflexive. In Argentina they use 'ponete' (vos form).",
  },
  {
    id: "f2",
    english: "What's for dinner?",
    spanish: "¿Qué hay para cenar?",
    alternates: ["¿Qué vamos a cenar?"],
    category: "family",
    difficulty: 1,
  },
  {
    id: "f3",
    english: "My daughter is learning Spanish at home.",
    spanish: "Mi hija está aprendiendo español en casa.",
    category: "family",
    difficulty: 2,
  },
  {
    id: "f4",
    english: "Did you brush your teeth?",
    spanish: "¿Te cepillaste los dientes?",
    alternates: ["¿Te lavaste los dientes?"],
    category: "family",
    difficulty: 2,
  },
  {
    id: "f5",
    english: "I'll pick her up after work.",
    spanish: "La recojo después del trabajo.",
    alternates: ["La voy a recoger después del trabajo."],
    category: "family",
    difficulty: 2,
  },
  {
    id: "f6",
    english: "Tell me what happened at school today.",
    spanish: "Cuéntame qué pasó en la escuela hoy.",
    argentine: "Contame qué pasó en la escuela hoy.",
    category: "family",
    difficulty: 2,
  },
  {
    id: "f7",
    english: "I'm proud of you.",
    spanish: "Estoy orgulloso de ti.",
    argentine: "Estoy orgulloso de vos.",
    category: "family",
    difficulty: 1,
    notes: "Use 'orgullosa' if the speaker is female. 'De vos' in Argentina, 'de ti' elsewhere.",
  },
  {
    id: "f8",
    english: "Don't forget your backpack.",
    spanish: "No olvides tu mochila.",
    argentine: "No te olvides la mochila.",
    category: "family",
    difficulty: 2,
  },

  // ---------- WORK / M&A / LEGAL ----------
  {
    id: "w1",
    english: "I'm a lawyer.",
    spanish: "Soy abogado.",
    category: "work",
    difficulty: 1,
    notes: "'Abogada' if female.",
  },
  {
    id: "w2",
    english: "I work in mergers and acquisitions.",
    spanish: "Trabajo en fusiones y adquisiciones.",
    category: "work",
    difficulty: 2,
  },
  {
    id: "w3",
    english: "The deal closes next month.",
    spanish: "La operación se cierra el mes que viene.",
    alternates: ["El trato se cierra el próximo mes.", "La transacción se cierra el mes que viene."],
    category: "work",
    difficulty: 2,
  },
  {
    id: "w4",
    english: "I need to review the contract before signing.",
    spanish: "Necesito revisar el contrato antes de firmar.",
    category: "work",
    difficulty: 2,
  },
  {
    id: "w5",
    english: "We're waiting for the buyer's response.",
    spanish: "Estamos esperando la respuesta del comprador.",
    category: "work",
    difficulty: 2,
  },
  {
    id: "w6",
    english: "The valuation came in lower than expected.",
    spanish: "La valoración resultó más baja de lo esperado.",
    alternates: ["La valuación fue más baja de lo esperado."],
    category: "work",
    difficulty: 3,
  },
  {
    id: "w7",
    english: "I have a meeting in twenty minutes.",
    spanish: "Tengo una reunión en veinte minutos.",
    category: "work",
    difficulty: 1,
  },
  {
    id: "w8",
    english: "Can you send me the documents by Friday?",
    spanish: "¿Me puedes enviar los documentos para el viernes?",
    argentine: "¿Me podés mandar los documentos para el viernes?",
    category: "work",
    difficulty: 2,
  },

  // ---------- BA TRAVEL ----------
  {
    id: "ba1",
    english: "Take me to Palermo, please.",
    spanish: "Lléveme a Palermo, por favor.",
    argentine: "Lleváme a Palermo, por favor.",
    category: "ba_travel",
    difficulty: 1,
    notes: "Standard usted form vs. Argentine vos imperative.",
  },
  {
    id: "ba2",
    english: "How much does it cost?",
    spanish: "¿Cuánto cuesta?",
    alternates: ["¿Cuánto sale?"],
    category: "ba_travel",
    difficulty: 1,
    notes: "In Argentina '¿Cuánto sale?' is more common conversationally.",
  },
  {
    id: "ba3",
    english: "I'll have the steak, medium rare.",
    spanish: "Me trae el bife, jugoso.",
    alternates: ["Voy a pedir el bife, jugoso."],
    category: "ba_travel",
    difficulty: 2,
    notes: "In Argentina: 'bife' for steak. 'Jugoso' = juicy/medium-rare. 'A punto' = medium.",
  },
  {
    id: "ba4",
    english: "Where is the nearest subway station?",
    spanish: "¿Dónde está la estación de metro más cercana?",
    argentine: "¿Dónde está la estación de subte más cercana?",
    category: "ba_travel",
    difficulty: 2,
    notes: "In BA the subway is called 'el subte' (short for subterráneo).",
  },
  {
    id: "ba5",
    english: "I don't speak much Spanish, but I'm learning.",
    spanish: "No hablo mucho español, pero estoy aprendiendo.",
    category: "ba_travel",
    difficulty: 2,
  },
  {
    id: "ba6",
    english: "Can you speak more slowly, please?",
    spanish: "¿Puede hablar más despacio, por favor?",
    argentine: "¿Podés hablar más despacio, por favor?",
    category: "ba_travel",
    difficulty: 1,
    notes: "Single most useful sentence for the trip. Memorize.",
  },
  {
    id: "ba7",
    english: "I'm here for my birthday.",
    spanish: "Estoy aquí por mi cumpleaños.",
    argentine: "Estoy acá por mi cumpleaños.",
    category: "ba_travel",
    difficulty: 1,
    notes: "Argentines say 'acá' more than 'aquí'.",
  },
  {
    id: "ba8",
    english: "What do you recommend?",
    spanish: "¿Qué me recomienda?",
    argentine: "¿Qué me recomendás?",
    category: "ba_travel",
    difficulty: 2,
  },
  {
    id: "ba9",
    english: "The check, please.",
    spanish: "La cuenta, por favor.",
    category: "ba_travel",
    difficulty: 1,
  },
  {
    id: "ba10",
    english: "I'd like a glass of Malbec.",
    spanish: "Quisiera una copa de Malbec.",
    alternates: ["Me trae una copa de Malbec, por favor."],
    category: "ba_travel",
    difficulty: 2,
  },

  // ---------- DAILY ----------
  {
    id: "d1",
    english: "I'll be there in five minutes.",
    spanish: "Llego en cinco minutos.",
    alternates: ["Voy a estar ahí en cinco minutos."],
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d2",
    english: "I forgot to do it.",
    spanish: "Se me olvidó hacerlo.",
    alternates: ["Olvidé hacerlo."],
    category: "daily",
    difficulty: 2,
    notes: "'Se me olvidó' is more natural — literally 'it forgot itself to me.'",
  },
  {
    id: "d3",
    english: "I'm running late.",
    spanish: "Voy tarde.",
    alternates: ["Llego tarde."],
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d4",
    english: "Can you do me a favor?",
    spanish: "¿Me puedes hacer un favor?",
    argentine: "¿Me podés hacer un favor?",
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d5",
    english: "I had a long day.",
    spanish: "Tuve un día largo.",
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d6",
    english: "I haven't decided yet.",
    spanish: "Todavía no he decidido.",
    alternates: ["Aún no lo he decidido.", "Todavía no decidí."],
    category: "daily",
    difficulty: 2,
  },
  {
    id: "d7",
    english: "Let me think about it.",
    spanish: "Déjame pensarlo.",
    argentine: "Dejame pensarlo.",
    category: "daily",
    difficulty: 2,
  },
  {
    id: "d8",
    english: "It depends.",
    spanish: "Depende.",
    category: "daily",
    difficulty: 1,
  },

  // ---------- DEALMAKING / NEGOTIATION ----------
  {
    id: "dm1",
    english: "We need to find a fair price.",
    spanish: "Necesitamos encontrar un precio justo.",
    category: "dealmaking",
    difficulty: 2,
  },
  {
    id: "dm2",
    english: "That's a deal.",
    spanish: "Trato hecho.",
    category: "dealmaking",
    difficulty: 1,
    notes: "Universal phrase. Use to close anything from negotiations to a bet with your daughter.",
  },
  {
    id: "dm3",
    english: "Let me make a counteroffer.",
    spanish: "Déjame hacer una contraoferta.",
    argentine: "Dejame hacer una contraoferta.",
    category: "dealmaking",
    difficulty: 2,
  },
  {
    id: "dm4",
    english: "We can't pay more than that.",
    spanish: "No podemos pagar más que eso.",
    category: "dealmaking",
    difficulty: 2,
  },
  {
    id: "dm5",
    english: "Both parties have to agree.",
    spanish: "Ambas partes tienen que estar de acuerdo.",
    alternates: ["Las dos partes tienen que estar de acuerdo."],
    category: "dealmaking",
    difficulty: 2,
  },
  {
    id: "dm6",
    english: "I think we have an understanding.",
    spanish: "Creo que tenemos un entendimiento.",
    category: "dealmaking",
    difficulty: 3,
  },

  // Family extra
  {
    id: "f9",
    english: "Are you hungry?",
    spanish: "¿Tienes hambre?",
    argentine: "¿Tenés hambre?",
    category: "family",
    difficulty: 1,
  },
  {
    id: "f10",
    english: "I love you.",
    spanish: "Te amo.",
    alternates: ["Te quiero."],
    category: "family",
    difficulty: 1,
    notes: "'Te quiero' is more common between family/friends; 'Te amo' is romantic/deep.",
  },

  // Work extra
  {
    id: "w9",
    english: "I'll get back to you tomorrow.",
    spanish: "Te respondo mañana.",
    alternates: ["Te contesto mañana."],
    category: "work",
    difficulty: 1,
  },
  {
    id: "w10",
    english: "We didn't reach an agreement.",
    spanish: "No llegamos a un acuerdo.",
    category: "work",
    difficulty: 2,
  },

  // Daily extra
  {
    id: "d9",
    english: "I'm tired.",
    spanish: "Estoy cansado.",
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d10",
    english: "What time is it?",
    spanish: "¿Qué hora es?",
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d11",
    english: "I don't understand.",
    spanish: "No entiendo.",
    category: "daily",
    difficulty: 1,
  },
  {
    id: "d12",
    english: "Can you repeat that?",
    spanish: "¿Puedes repetir?",
    argentine: "¿Podés repetir?",
    category: "daily",
    difficulty: 1,
  },
];

export const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  family: { label: "Family", emoji: "👨‍👩‍👧", color: "text-pink-400" },
  work: { label: "Work / M&A", emoji: "💼", color: "text-blue-400" },
  ba_travel: { label: "Buenos Aires", emoji: "🇦🇷", color: "text-sun-arg" },
  daily: { label: "Daily", emoji: "☕", color: "text-gray-300" },
  dealmaking: { label: "Dealmaking", emoji: "🤝", color: "text-accent-green" },
};

export function getRandomPrompt(filter?: { category?: Category; difficulty?: Difficulty }): Prompt {
  let pool = PROMPTS;
  if (filter?.category) pool = pool.filter((p) => p.category === filter.category);
  if (filter?.difficulty) pool = pool.filter((p) => p.difficulty === filter.difficulty);
  if (pool.length === 0) pool = PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
