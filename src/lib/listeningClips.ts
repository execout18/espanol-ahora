// Pre-seeded listening clip scripts
// Used as the starting library — instant load, no API call required for first sessions
// "Generate new" button uses Claude + ElevenLabs for fresh content

import type { ListeningScenario, ListeningDifficulty } from "@/app/api/listening/script/route";

export interface ListeningClip {
  id: string;
  scenario: ListeningScenario;
  difficulty: ListeningDifficulty;
  spanish: string;
  english: string;
  vocab: Array<{ word: string; meaning: string }>;
  gender: "male" | "female";
}

export const SEED_CLIPS: ListeningClip[] = [
  // ---------- KID SPEED ----------
  {
    id: "k1",
    scenario: "kid_speed",
    difficulty: 1,
    spanish: "Mami, mami, ¿sabes qué? Hoy en la escuela jugué con Sofía y comimos galletas. ¡Estaban riquísimas!",
    english: "Mommy, mommy, you know what? Today at school I played with Sofía and we ate cookies. They were super delicious!",
    vocab: [
      { word: "¿sabes qué?", meaning: "you know what?" },
      { word: "riquísimas", meaning: "super delicious (intensified form of 'rica')" },
    ],
    gender: "female",
  },
  {
    id: "k2",
    scenario: "kid_speed",
    difficulty: 2,
    spanish: "Papá, la maestra dijo que mañana tenemos que llevar algo verde y yo no sé qué llevar porque mis manzanas son rojas.",
    english: "Dad, the teacher said tomorrow we have to bring something green and I don't know what to bring because my apples are red.",
    vocab: [
      { word: "tenemos que llevar", meaning: "we have to bring" },
      { word: "algo verde", meaning: "something green" },
    ],
    gender: "female",
  },
  {
    id: "k3",
    scenario: "kid_speed",
    difficulty: 1,
    spanish: "¡Mira lo que hice! Es un dibujo de nuestra familia. Tú, mami, yo, y el perrito.",
    english: "Look what I made! It's a drawing of our family. You, mommy, me, and the doggy.",
    vocab: [
      { word: "lo que hice", meaning: "what I made" },
      { word: "el perrito", meaning: "the doggy (diminutive of perro)" },
    ],
    gender: "female",
  },
  {
    id: "k4",
    scenario: "kid_speed",
    difficulty: 2,
    spanish: "No quiero comer las verduras. Están feas. ¿Puedo comer solo el arroz? El arroz sí me gusta mucho.",
    english: "I don't want to eat the vegetables. They're gross. Can I eat just the rice? I do like the rice a lot.",
    vocab: [
      { word: "están feas", meaning: "they're gross/ugly" },
      { word: "sí me gusta", meaning: "I do like (sí used for emphasis)" },
    ],
    gender: "female",
  },
  {
    id: "k5",
    scenario: "kid_speed",
    difficulty: 3,
    spanish: "Mami, si me porto bien toda la semana, ¿me llevas al parque el sábado? Y también quiero invitar a Valeria, porque es mi mejor amiga.",
    english: "Mommy, if I behave well all week, will you take me to the park on Saturday? And I also want to invite Valeria, because she's my best friend.",
    vocab: [
      { word: "si me porto bien", meaning: "if I behave well" },
      { word: "mi mejor amiga", meaning: "my best friend" },
    ],
    gender: "female",
  },

  // ---------- MOM TO KID ----------
  {
    id: "m1",
    scenario: "mom_to_kid",
    difficulty: 1,
    spanish: "Ven acá, mi amor. Ponte los zapatos, ya nos vamos.",
    english: "Come here, my love. Put your shoes on, we're leaving now.",
    vocab: [
      { word: "ven acá", meaning: "come here" },
      { word: "ya nos vamos", meaning: "we're leaving now" },
    ],
    gender: "female",
  },
  {
    id: "m2",
    scenario: "mom_to_kid",
    difficulty: 1,
    spanish: "¿Te lavaste las manos? Acuérdate de lavarte antes de comer.",
    english: "Did you wash your hands? Remember to wash up before eating.",
    vocab: [
      { word: "acuérdate", meaning: "remember (imperative)" },
      { word: "antes de comer", meaning: "before eating" },
    ],
    gender: "female",
  },
  {
    id: "m3",
    scenario: "mom_to_kid",
    difficulty: 2,
    spanish: "Mija, recoge tus juguetes y guárdalos en la caja, por favor. Después vamos a leer un cuento.",
    english: "Sweetheart, pick up your toys and put them in the box, please. After we'll read a story.",
    vocab: [
      { word: "mija", meaning: "sweetheart (contraction of mi hija)" },
      { word: "guárdalos", meaning: "put them away" },
    ],
    gender: "female",
  },
  {
    id: "m4",
    scenario: "mom_to_kid",
    difficulty: 2,
    spanish: "Apúrate, vas a llegar tarde a la escuela. Toma tu mochila y vámonos.",
    english: "Hurry up, you're going to be late to school. Grab your backpack and let's go.",
    vocab: [
      { word: "apúrate", meaning: "hurry up" },
      { word: "vámonos", meaning: "let's go" },
    ],
    gender: "female",
  },
  {
    id: "m5",
    scenario: "mom_to_kid",
    difficulty: 3,
    spanish: "Si terminas la tarea ahorita, después te dejo ver un poquito de televisión, pero solamente media hora, ¿de acuerdo?",
    english: "If you finish your homework right now, after I'll let you watch a little TV, but only half an hour, OK?",
    vocab: [
      { word: "ahorita", meaning: "right now (Mexican)" },
      { word: "te dejo", meaning: "I'll let you" },
    ],
    gender: "female",
  },

  // ---------- SERVICE WORKER ----------
  {
    id: "s1",
    scenario: "service_worker",
    difficulty: 1,
    spanish: "Buenos días, ¿qué le doy?",
    english: "Good morning, what can I get you?",
    vocab: [
      { word: "¿qué le doy?", meaning: "what can I get you? (literally: what do I give you?)" },
    ],
    gender: "male",
  },
  {
    id: "s2",
    scenario: "service_worker",
    difficulty: 2,
    spanish: "Son ciento cincuenta pesos. ¿Va a pagar con tarjeta o efectivo?",
    english: "That's one hundred fifty pesos. Are you paying with card or cash?",
    vocab: [
      { word: "ciento cincuenta", meaning: "one hundred fifty" },
      { word: "efectivo", meaning: "cash" },
    ],
    gender: "male",
  },
  {
    id: "s3",
    scenario: "service_worker",
    difficulty: 2,
    spanish: "Disculpe, ¿desea algo más? Tenemos pan dulce recién hecho.",
    english: "Excuse me, would you like anything else? We have freshly made sweet bread.",
    vocab: [
      { word: "desea", meaning: "would you like (formal)" },
      { word: "recién hecho", meaning: "freshly made" },
    ],
    gender: "female",
  },
  {
    id: "s4",
    scenario: "service_worker",
    difficulty: 3,
    spanish: "Para llevar va a tardar como diez minutos porque acabamos de poner una orden grande. ¿Le parece bien?",
    english: "For takeout it'll take about ten minutes because we just put in a big order. Is that OK?",
    vocab: [
      { word: "para llevar", meaning: "to go / takeout" },
      { word: "acabamos de", meaning: "we just (did something)" },
      { word: "¿le parece bien?", meaning: "does that work for you?" },
    ],
    gender: "male",
  },
  {
    id: "s5",
    scenario: "service_worker",
    difficulty: 1,
    spanish: "Su cambio, gracias por su compra.",
    english: "Your change, thank you for your purchase.",
    vocab: [
      { word: "su cambio", meaning: "your change (money back)" },
    ],
    gender: "female",
  },

  // ---------- TWO FRIENDS ----------
  {
    id: "f1",
    scenario: "two_friends",
    difficulty: 2,
    spanish: "Oye güey, ¿qué onda? ¿Vamos a salir el sábado o qué? Tengo unas ganas de ir al cine.",
    english: "Hey dude, what's up? Are we going out Saturday or what? I really feel like going to the movies.",
    vocab: [
      { word: "güey", meaning: "dude (very Mexican casual)" },
      { word: "qué onda", meaning: "what's up" },
      { word: "tengo ganas de", meaning: "I feel like" },
    ],
    gender: "male",
  },
  {
    id: "f2",
    scenario: "two_friends",
    difficulty: 2,
    spanish: "Híjole, no me cuentes. Mi jefe me trae de un lado para otro. Ya no aguanto.",
    english: "Oh man, don't even tell me. My boss has me running around. I can't take it anymore.",
    vocab: [
      { word: "híjole", meaning: "oh man / wow (Mexican exclamation)" },
      { word: "me trae de un lado para otro", meaning: "has me running all over" },
      { word: "no aguanto", meaning: "I can't stand it" },
    ],
    gender: "female",
  },
  {
    id: "f3",
    scenario: "two_friends",
    difficulty: 3,
    spanish: "Te juro que si no me hubiera ido a tiempo, me hubiera quedado atorada en el tráfico horas. Llegué justo a tiempo.",
    english: "I swear if I hadn't left on time, I would've been stuck in traffic for hours. I got there just in time.",
    vocab: [
      { word: "te juro que", meaning: "I swear that" },
      { word: "atorada", meaning: "stuck" },
      { word: "justo a tiempo", meaning: "just in time" },
    ],
    gender: "female",
  },
  {
    id: "f4",
    scenario: "two_friends",
    difficulty: 2,
    spanish: "¿Ya viste el restaurante nuevo en la esquina? Dicen que está buenísimo, deberíamos ir.",
    english: "Did you see the new restaurant on the corner? They say it's really good, we should go.",
    vocab: [
      { word: "buenísimo", meaning: "really good" },
      { word: "deberíamos", meaning: "we should" },
    ],
    gender: "male",
  },
  {
    id: "f5",
    scenario: "two_friends",
    difficulty: 1,
    spanish: "¿Cómo te fue ayer? Te quería preguntar pero se me olvidó.",
    english: "How did it go yesterday? I wanted to ask you but I forgot.",
    vocab: [
      { word: "¿cómo te fue?", meaning: "how did it go?" },
      { word: "se me olvidó", meaning: "I forgot" },
    ],
    gender: "female",
  },
];

export const SCENARIO_META: Record<ListeningScenario, { label: string; emoji: string; description: string }> = {
  kid_speed: { label: "Kid speed", emoji: "👧", description: "Like Charlotte" },
  mom_to_kid: { label: "Mom to kid", emoji: "👩", description: "Like Carly" },
  service_worker: { label: "Service worker", emoji: "☕", description: "Cafe, taxi, shop" },
  two_friends: { label: "Two friends", emoji: "🗣️", description: "Casual, slang, fast" },
};
