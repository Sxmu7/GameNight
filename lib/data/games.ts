import { Category, Game } from "./types";

export const categories: Category[] = [
  {
    id: "klassiker",
    icon: "🍺",
    name: { de: "Klassiker", en: "Classics", es: "Clásicos" },
    description: {
      de: "Die bewährten Grundpfeiler jeder Runde.",
      en: "The tried-and-true backbone of every round.",
      es: "Los pilares clásicos de cualquier ronda.",
    },
  },
  {
    id: "karten",
    icon: "🃏",
    name: { de: "Kartenspiele", en: "Card Games", es: "Juegos de Cartas" },
    description: {
      de: "Alles was ein Kartendeck braucht.",
      en: "Everything that needs a deck of cards.",
      es: "Todo lo que necesita una baraja.",
    },
  },
  {
    id: "wuerfel",
    icon: "🎲",
    name: { de: "Würfelspiele", en: "Dice Games", es: "Juegos de Dados" },
    description: {
      de: "Glück, Bluff und ein paar Würfel.",
      en: "Luck, bluff and a couple of dice.",
      es: "Suerte, farol y un par de dados.",
    },
  },
  {
    id: "party",
    icon: "🎉",
    name: { de: "Party & große Gruppen", en: "Party & Big Groups", es: "Fiesta y Grupos Grandes" },
    description: {
      de: "Für volle Wohnzimmer und laute Abende.",
      en: "For packed living rooms and loud nights.",
      es: "Para salones llenos y noches ruidosas.",
    },
  },
  {
    id: "duo",
    icon: "💞",
    name: { de: "Duo & Paare", en: "Duo & Couples", es: "Dúo y Parejas" },
    description: {
      de: "Perfekt für zwei Spieler.",
      en: "Perfect for exactly two players.",
      es: "Perfecto para dos jugadores.",
    },
  },
  {
    id: "quick",
    icon: "⚡",
    name: { de: "Quickies", en: "Quickies", es: "Rapiditos" },
    description: {
      de: "Unter zwei Minuten pro Runde.",
      en: "Under two minutes per round.",
      es: "Menos de dos minutos por ronda.",
    },
  },
  {
    id: "strategie",
    icon: "🧠",
    name: { de: "Strategie & Geschick", en: "Strategy & Skill", es: "Estrategia y Habilidad" },
    description: {
      de: "Ruhige Hand und klarer Kopf gefragt.",
      en: "Steady hands and a clear head required.",
      es: "Se necesita mano firme y mente clara.",
    },
  },
  {
    id: "online",
    icon: "📡",
    name: { de: "Online-Only", en: "Online-Only", es: "Solo en Línea" },
    description: {
      de: "Gemacht für Fernrunden über mehrere Geräte.",
      en: "Built for remote rounds across devices.",
      es: "Pensado para rondas remotas entre dispositivos.",
    },
  },
  {
    id: "events",
    icon: "🎆",
    name: { de: "Saison-Events", en: "Seasonal Events", es: "Eventos de Temporada" },
    description: {
      de: "Karneval, Oktoberfest, Silvester & Co.",
      en: "Carnival, Oktoberfest, New Year's & more.",
      es: "Carnaval, Oktoberfest, Nochevieja y más.",
    },
  },
];

const reasonNotOnline = {
  de: "Nicht online-tauglich – braucht physische Gegenstände am selben Tisch.",
  en: "Not online-capable – needs physical objects at the same table.",
  es: "No apto para online – requiere objetos físicos en la misma mesa.",
};

const reasonOnlineVote = {
  de: "Online-tauglich – reine Abstimmung, funktioniert per Video-Call.",
  en: "Online-capable – pure voting mechanic, works over video call.",
  es: "Apto para online – mecánica de votación, funciona por videollamada.",
};

const reasonOnlineTimer = {
  de: "Online-tauglich – App misst Zeit/Reaktion zentral für alle Geräte.",
  en: "Online-capable – app measures time/reaction centrally for all devices.",
  es: "Apto para online – la app mide tiempo/reacción para todos los dispositivos.",
};

const reasonOnlineText = {
  de: "Online-tauglich – läuft komplett über Text-/Auswahleingabe.",
  en: "Online-capable – runs entirely on text/choice input.",
  es: "Apto para online – funciona por completo con texto o selección.",
};

function placeholder(
  id: string,
  categoryId: string,
  n: number,
  opts?: Partial<Game>
): Game {
  return {
    id,
    categoryId,
    minPlayers: 3,
    maxPlayers: 10,
    duration: "mittel",
    intensity: 3,
    equipment: ["keine"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: `Platzhalter ${n}`, rule: "Platzhalter-Eintrag – Regeltext folgt in diesem Schema." },
      en: { name: `Placeholder ${n}`, rule: "Placeholder entry – rule text follows this schema." },
      es: { name: `Marcador ${n}`, rule: "Entrada de marcador – el texto de la regla sigue este esquema." },
    },
    ...opts,
  };
}

export const games: Game[] = [
  // Klassiker
  {
    id: "ich-hab-noch-nie",
    categoryId: "klassiker",
    minPlayers: 3,
    maxPlayers: 12,
    duration: "mittel",
    intensity: 3,
    equipment: ["keine"],
    onlineCapable: true,
    onlineReason: reasonOnlineVote,
    isPlaceholder: false,
    translations: {
      de: { name: "Ich hab noch nie", rule: "Reihum sagt jeder \"Ich hab noch nie …\". Wer es doch schon getan hat, trinkt." },
      en: { name: "Never Have I Ever", rule: "Take turns saying \"Never have I ever…\". Anyone who has done it drinks." },
      es: { name: "Yo Nunca", rule: "Por turnos, cada uno dice \"Yo nunca…\". Quien sí lo haya hecho, bebe." },
    },
  },
  {
    id: "kings-cup",
    categoryId: "klassiker",
    minPlayers: 4,
    maxPlayers: 10,
    duration: "lang",
    intensity: 4,
    equipment: ["Karten", "Becher"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: false,
    translations: {
      de: { name: "Kings Cup", rule: "Jede gezogene Karte hat eine feste Regel. Der letzte gezogene König leert den Mittelbecher." },
      en: { name: "Kings Cup", rule: "Every drawn card has a fixed rule. The last King drawn empties the center cup." },
      es: { name: "Copa del Rey", rule: "Cada carta tiene una regla fija. El último rey vacía el vaso central." },
    },
  },
  {
    id: "wahrheit-oder-pflicht",
    categoryId: "klassiker",
    minPlayers: 3,
    maxPlayers: 12,
    duration: "mittel",
    intensity: 3,
    equipment: ["keine"],
    onlineCapable: true,
    onlineReason: reasonOnlineText,
    isPlaceholder: false,
    translations: {
      de: { name: "Wahrheit oder Pflicht", rule: "Jeder wählt Wahrheit oder Pflicht. Verweigern kostet einen Schluck." },
      en: { name: "Truth or Dare", rule: "Everyone picks truth or dare. Refusing costs a sip." },
      es: { name: "Verdad o Reto", rule: "Cada uno elige verdad o reto. Negarse cuesta un trago." },
    },
  },
  {
    id: "flunkyball",
    categoryId: "klassiker",
    minPlayers: 4,
    maxPlayers: 20,
    duration: "lang",
    intensity: 4,
    equipment: ["Flasche", "Ball"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: false,
    translations: {
      de: { name: "Flunkyball", rule: "Zwei Teams, ein Ball, eine Flasche in der Mitte. Wer trifft, muss aufstehen und trinken." },
      en: { name: "Flunkyball", rule: "Two teams, one ball, one bottle in the middle. Getting hit means standing up and drinking." },
      es: { name: "Flunkyball", rule: "Dos equipos, una pelota, una botella en el centro. Si te dan, te levantas y bebes." },
    },
  },
  placeholder("klassiker-p1", "klassiker", 6),
  placeholder("klassiker-p2", "klassiker", 7),

  // Kartenspiele
  {
    id: "ass-sammler",
    categoryId: "karten",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "mittel",
    intensity: 2,
    equipment: ["Karten"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Ass-Sammler", rule: "Platzhalter – wer die meisten Asse sammelt, verteilt Schlucke." },
      en: { name: "Ace Collector", rule: "Placeholder – whoever collects the most aces hands out sips." },
      es: { name: "Coleccionista de Ases", rule: "Marcador – quien reúna más ases reparte tragos." },
    },
  },
  {
    id: "bluff-runde",
    categoryId: "karten",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "mittel",
    intensity: 2,
    equipment: ["Karten"],
    onlineCapable: true,
    onlineReason: reasonOnlineVote,
    isPlaceholder: true,
    translations: {
      de: { name: "Bluff-Runde", rule: "Platzhalter – Karten verdeckt spielen, Gruppe stimmt ab wer blufft." },
      en: { name: "Bluff Round", rule: "Placeholder – play cards face down, the group votes on who's bluffing." },
      es: { name: "Ronda de Farol", rule: "Marcador – juega cartas boca abajo, el grupo vota quién farolea." },
    },
  },
  placeholder("karten-p3", "karten", 3),
  placeholder("karten-p4", "karten", 4),
  placeholder("karten-p5", "karten", 5),

  // Würfelspiele
  {
    id: "meiern",
    categoryId: "wuerfel",
    minPlayers: 2,
    maxPlayers: 8,
    duration: "mittel",
    intensity: 3,
    equipment: ["Würfel"],
    onlineCapable: true,
    onlineReason: reasonOnlineText,
    isPlaceholder: true,
    translations: {
      de: { name: "Meiern", rule: "Platzhalter – verdeckt würfeln, bluffen, weiterreichen oder aufdecken." },
      en: { name: "Liar's Dice", rule: "Placeholder – roll hidden, bluff, pass on or reveal." },
      es: { name: "Dados del Mentiroso", rule: "Marcador – tira oculto, farolea, pasa o revela." },
    },
  },
  {
    id: "wuerfel-turm",
    categoryId: "wuerfel",
    minPlayers: 2,
    maxPlayers: 6,
    duration: "kurz",
    intensity: 2,
    equipment: ["Würfel", "Becher"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Würfel-Turm", rule: "Platzhalter – Zahl erwürfeln, entsprechend viele Schlucke trinken." },
      en: { name: "Dice Tower", rule: "Placeholder – roll a number, drink that many sips." },
      es: { name: "Torre de Dados", rule: "Marcador – tira un número, bebe esa cantidad de tragos." },
    },
  },
  placeholder("wuerfel-p3", "wuerfel", 3),
  placeholder("wuerfel-p4", "wuerfel", 4),

  // Party & große Gruppen
  {
    id: "reise-nach-jerusalem",
    categoryId: "party",
    minPlayers: 5,
    maxPlayers: 20,
    duration: "kurz",
    intensity: 2,
    equipment: ["Stühle", "Musik"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Reise nach Jerusalem (Trinkvariante)", rule: "Platzhalter – wer keinen Stuhl bekommt, trinkt statt auszuscheiden." },
      en: { name: "Musical Chairs (Drinking Variant)", rule: "Placeholder – whoever has no chair drinks instead of being out." },
      es: { name: "Sillas Musicales (Variante con Bebida)", rule: "Marcador – quien se queda sin silla bebe en vez de salir." },
    },
  },
  {
    id: "stadt-land-fluss-trink",
    categoryId: "party",
    minPlayers: 3,
    maxPlayers: 12,
    duration: "mittel",
    intensity: 2,
    equipment: ["keine"],
    onlineCapable: true,
    onlineReason: reasonOnlineText,
    isPlaceholder: false,
    translations: {
      de: { name: "Stadt-Land-Fluss (Trinkvariante)", rule: "Wer bei einer Kategorie nichts einträgt, trinkt einen Schluck." },
      en: { name: "Scattergories (Drinking Variant)", rule: "Anyone who can't fill a category drinks a sip." },
      es: { name: "Basta (Variante con Bebida)", rule: "Quien no complete una categoría bebe un trago." },
    },
  },
  placeholder("party-p3", "party", 3),
  placeholder("party-p4", "party", 4),
  placeholder("party-p5", "party", 5),

  // Duo & Paare
  {
    id: "zwei-personen-challenge",
    categoryId: "duo",
    minPlayers: 2,
    maxPlayers: 2,
    duration: "mittel",
    intensity: 3,
    equipment: ["keine"],
    onlineCapable: true,
    onlineReason: reasonOnlineText,
    isPlaceholder: true,
    translations: {
      de: { name: "Zwei-Personen-Challenge", rule: "Platzhalter – abwechselnd Fragen beantworten, bei Übereinstimmung trinken beide." },
      en: { name: "Two-Player Challenge", rule: "Placeholder – take turns answering, if answers match both drink." },
      es: { name: "Reto para Dos", rule: "Marcador – responded por turnos, si coinciden, ambos beben." },
    },
  },
  placeholder("duo-p2", "duo", 2),
  placeholder("duo-p3", "duo", 3),

  // Quickies
  {
    id: "schnellrunde-reaktion",
    categoryId: "quick",
    minPlayers: 2,
    maxPlayers: 10,
    duration: "kurz",
    intensity: 2,
    equipment: ["Smartphone"],
    onlineCapable: true,
    onlineReason: reasonOnlineTimer,
    isPlaceholder: false,
    translations: {
      de: { name: "Schnellrunde: Reaktionstest", rule: "Auf Signal so schnell wie möglich tippen. Die zwei Langsamsten trinken." },
      en: { name: "Quick Round: Reaction Test", rule: "Tap as fast as possible on signal. The two slowest drink." },
      es: { name: "Ronda Rápida: Test de Reacción", rule: "Toca lo más rápido posible a la señal. Los dos más lentos beben." },
    },
  },
  placeholder("quick-p2", "quick", 2),
  placeholder("quick-p3", "quick", 3),

  // Strategie & Geschick
  {
    id: "turm-balance",
    categoryId: "strategie",
    minPlayers: 2,
    maxPlayers: 8,
    duration: "mittel",
    intensity: 3,
    equipment: ["Klötze/Turm"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Turm-Balance", rule: "Platzhalter – wer den Turm zum Einsturz bringt, trinkt alle offenen Schlucke." },
      en: { name: "Tower Balance", rule: "Placeholder – whoever topples the tower drinks all pending sips." },
      es: { name: "Equilibrio de Torre", rule: "Marcador – quien derribe la torre bebe todos los tragos pendientes." },
    },
  },
  placeholder("strategie-p2", "strategie", 2),

  // Online-Only
  {
    id: "quiz-duell",
    categoryId: "online",
    minPlayers: 2,
    maxPlayers: 12,
    duration: "mittel",
    intensity: 2,
    equipment: ["App-intern"],
    onlineCapable: true,
    onlineReason: reasonOnlineText,
    isPlaceholder: false,
    translations: {
      de: { name: "Quiz-Duell", rule: "Wissensfragen gegeneinander, falsche Antworten kosten einen Schluck." },
      en: { name: "Quiz Duel", rule: "Trivia questions head-to-head, wrong answers cost a sip." },
      es: { name: "Duelo de Preguntas", rule: "Preguntas de cultura general uno contra otro, fallar cuesta un trago." },
    },
  },
  {
    id: "bluff-voting",
    categoryId: "online",
    minPlayers: 3,
    maxPlayers: 12,
    duration: "mittel",
    intensity: 2,
    equipment: ["App-intern"],
    onlineCapable: true,
    onlineReason: reasonOnlineVote,
    isPlaceholder: false,
    translations: {
      de: { name: "Bluff-Voting", rule: "Jeder gibt anonym eine Antwort ab, die Gruppe rät, wer gelogen hat." },
      en: { name: "Bluff Voting", rule: "Everyone submits an anonymous answer, the group guesses who lied." },
      es: { name: "Votación de Farol", rule: "Cada uno da una respuesta anónima, el grupo adivina quién mintió." },
    },
  },
  {
    id: "reaktions-battle",
    categoryId: "online",
    minPlayers: 2,
    maxPlayers: 12,
    duration: "kurz",
    intensity: 1,
    equipment: ["App-intern"],
    onlineCapable: true,
    onlineReason: reasonOnlineTimer,
    isPlaceholder: false,
    translations: {
      de: { name: "Reaktions-Battle", rule: "Die App misst die Tap-Geschwindigkeit aller Verbundenen live." },
      en: { name: "Reaction Battle", rule: "The app measures everyone's tap speed live across devices." },
      es: { name: "Batalla de Reacción", rule: "La app mide en vivo la velocidad de toque de todos los conectados." },
    },
  },
  placeholder("online-p4", "online", 4),

  // Saison-Events
  {
    id: "karneval-edition",
    categoryId: "events",
    minPlayers: 3,
    maxPlayers: 20,
    duration: "lang",
    intensity: 3,
    equipment: ["Kostüme"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Karneval-Edition", rule: "Platzhalter – Kostüm-Challenges und Schunkel-Runden." },
      en: { name: "Carnival Edition", rule: "Placeholder – costume challenges and singalong rounds." },
      es: { name: "Edición Carnaval", rule: "Marcador – retos de disfraces y rondas de canto." },
    },
  },
  {
    id: "oktoberfest-edition",
    categoryId: "events",
    minPlayers: 3,
    maxPlayers: 20,
    duration: "lang",
    intensity: 4,
    equipment: ["Maßkrug"],
    onlineCapable: false,
    onlineReason: reasonNotOnline,
    isPlaceholder: true,
    translations: {
      de: { name: "Oktoberfest-Edition", rule: "Platzhalter – Maßkrugstemmen und Prost-Runden." },
      en: { name: "Oktoberfest Edition", rule: "Placeholder – stein-holding contest and toast rounds." },
      es: { name: "Edición Oktoberfest", rule: "Marcador – concurso de jarras y rondas de brindis." },
    },
  },
  {
    id: "silvester-countdown",
    categoryId: "events",
    minPlayers: 2,
    maxPlayers: 20,
    duration: "kurz",
    intensity: 3,
    equipment: ["keine"],
    onlineCapable: true,
    onlineReason: reasonOnlineTimer,
    isPlaceholder: true,
    translations: {
      de: { name: "Silvester-Countdown", rule: "Platzhalter – letzte 60 Sekunden des Jahres, jede 10 Sekunden ein Schluck." },
      en: { name: "New Year's Countdown", rule: "Placeholder – last 60 seconds of the year, one sip every 10 seconds." },
      es: { name: "Cuenta Regresiva de Año Nuevo", rule: "Marcador – últimos 60 segundos del año, un trago cada 10 segundos." },
    },
  },
];

export function gamesByCategory(categoryId: string): Game[] {
  return games.filter((g) => g.categoryId === categoryId);
}

export function onlineGames(): Game[] {
  return games.filter((g) => g.onlineCapable);
}

export function getGame(id: string): Game | undefined {
  return games.find((g) => g.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
