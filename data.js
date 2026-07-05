/* ==========================================================================
   CardParty — static data & translations (DE / EN)
   ========================================================================== */

const SUITS = [
  { s: '♠', c: 'black' },
  { s: '♣', c: 'black' },
  { s: '♥', c: 'red' },
  { s: '♦', c: 'red' },
];
const RANK_LABEL = r => (r <= 10 ? String(r) : ({ 11: 'J', 12: 'Q', 13: 'K', 14: 'A' })[r]);
const SUIT_NAME = {
  de: { '♠': 'Pik', '♥': 'Herz', '♦': 'Karo', '♣': 'Kreuz' },
  en: { '♠': 'Spades', '♥': 'Hearts', '♦': 'Diamonds', '♣': 'Clubs' },
};
const RANK_WORD = {
  de: { 11: 'Bube', 12: 'Dame', 13: 'König', 14: 'Ass' },
  en: { 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' },
};
function cardName(card, lang) {
  const r = RANK_WORD[lang][card.rank] || String(card.rank);
  return lang === 'de' ? `${SUIT_NAME.de[card.suit]} ${r}` : `${r} of ${SUIT_NAME.en[card.suit]}`;
}

/* ---------------- KING'S CUP RULES ---------------- */
const KC_RULES = {
  de: {
    2: 'Du bestimmst\nWähle jemanden, der jetzt trinkt.',
    3: 'Ich\nDu trinkst selbst.',
    4: 'Boden\nAlle berühren den Boden — der Letzte trinkt.',
    5: 'Männer\nAlle Männer trinken.',
    6: 'Frauen\nAlle Frauen trinken.',
    7: 'Nach oben\nAlle zeigen nach oben — der Letzte trinkt.',
    8: 'Trinkpartner\nWähle einen Partner. Trinkt einer, trinkt der andere mit.',
    9: 'Reimspiel\nSag ein Wort — reihum wird gereimt. Wer keinen Reim findet, trinkt.',
    10: 'Kategorien\nNenne eine Kategorie. Reihum nennt jeder einen Begriff — wer nichts mehr weiß, trinkt.',
    11: 'Neue Regel\nErfinde eine neue Regel für den Rest des Spiels. Wer sie vergisst, trinkt.',
    12: 'Fragemeisterin\nWer direkt auf deine Fragen antwortet, trinkt.',
    13: "König\nGieße etwas von deinem Getränk ins Glas. Wer den 4. König zieht, trinkt den King's Cup aus!",
    14: 'Wasserfall\nAlle trinken gleichzeitig. Du darfst erst aufhören, wenn dein linker Nachbar aufhört.',
  },
  en: {
    2: 'You Choose\nPick someone who has to drink.',
    3: 'Me\nYou drink.',
    4: 'Floor\nEveryone touches the floor — last one drinks.',
    5: 'Men\nAll men drink.',
    6: 'Women\nAll women drink.',
    7: 'Point Up\nEveryone points up — last one drinks.',
    8: 'Drinking Buddy\nPick a partner. Whenever one drinks, the other drinks too.',
    9: "Rhyme Time\nSay a word — go around rhyming. Whoever can't rhyme drinks.",
    10: 'Categories\nName a category. Go around naming items — whoever runs out drinks.',
    11: 'New Rule\nInvent a new rule for the rest of the game. Whoever forgets it drinks.',
    12: 'Question Master\nWhoever answers your questions directly drinks.',
    13: "King\nPour a splash of your drink into the cup. Whoever draws the 4th king drinks the King's Cup!",
    14: 'Waterfall\nEveryone drinks at once. You can only stop once the person to your left stops.',
  },
};

/* ---------------- MOST LIKELY TO ---------------- */
const MOST_LIKELY = {
  de: [
    'Wer würde eher im Urlaub die Kreditkarte verlieren?',
    'Wer würde eher versehentlich den Chef beleidigen?',
    'Wer würde eher auf einer einsamen Insel überleben?',
    'Wer würde eher betrunken seinem Ex schreiben?',
    'Wer würde eher berühmt werden — und wofür?',
    'Wer würde eher beim ersten Date einschlafen?',
    'Wer würde eher ein Haustier vergessen zu füttern?',
    'Wer würde eher aus Versehen "Ich liebe dich" zur falschen Person sagen?',
    'Wer würde eher zu spät zur eigenen Hochzeit kommen?',
    'Wer würde eher einen Marathon ohne Training laufen?',
    'Wer würde eher im Restaurant das Trinkgeld vergessen?',
    'Wer würde eher heimlich Fastfood essen und es abstreiten?',
    'Wer würde eher einen Werwolf-Bluff nicht überleben?',
    'Wer würde eher als Erstes bei einer Zombie-Apokalypse sterben?',
    'Wer würde eher einen Reality-TV-Auftritt bekommen?',
    'Wer würde eher versehentlich einen Livestream starten?',
    'Wer würde eher ein Vermögen verzocken?',
    'Wer würde eher mit Fremden auf einer Party tanzen?',
    'Wer würde eher drei Tage ohne Handy überleben?',
    'Wer würde eher einen Elternteil vor Freunden blamieren?',
    'Wer würde eher als Spion durchgehen?',
    'Wer würde eher betrunken einen Heiratsantrag machen?',
    'Wer würde eher in ein Fettnäpfchen treten?',
    'Wer würde eher seinen eigenen Geburtstag vergessen?',
    'Wer würde eher im Meeting einschlafen?',
    'Wer würde eher etwas online kaufen und es nie benutzen?',
    'Wer würde eher versuchen, mit dem Chef zu flirten für eine Beförderung?',
    'Wer würde eher einen One-Night-Stand als Beziehung bezeichnen?',
    'Wer würde eher bei "Wer wird Millionär" alles verlieren?',
    'Wer würde eher ein ganzes Wochenende im Pyjama verbringen?',
    'Wer würde eher lügen, um aus einem Date rauszukommen?',
    'Wer würde eher einen Groupchat gründen — und ihn nie beantworten?',
    'Wer würde eher betrunken kochen und die Küche abfackeln?',
    'Wer würde eher heimlich diese Frage später googeln?',
    'Wer würde eher auf einer Beerdigung lachen müssen?',
    'Wer würde eher seinen Job kündigen, um zu reisen?',
    'Wer würde eher einem Kind die Wahrheit über den Weihnachtsmann verraten?',
    'Wer würde eher betrunken einkaufen gehen?',
    'Wer würde eher vergessen, wo das Auto geparkt ist?',
    'Wer würde eher zum Mond fliegen, wenn er könnte?',
  ],
  en: [
    'Who would be most likely to lose their credit card on vacation?',
    'Who would be most likely to accidentally insult their boss?',
    'Who would be most likely to survive on a deserted island?',
    'Who would be most likely to text their ex while drunk?',
    'Who would be most likely to become famous — and for what?',
    'Who would be most likely to fall asleep on a first date?',
    'Who would be most likely to forget to feed a pet?',
    'Who would be most likely to say "I love you" to the wrong person?',
    'Who would be most likely to be late to their own wedding?',
    'Who would be most likely to run a marathon with zero training?',
    'Who would be most likely to forget to tip at a restaurant?',
    'Who would be most likely to secretly eat fast food and deny it?',
    'Who would be most likely to get caught lying in Werewolf?',
    'Who would be most likely to die first in a zombie apocalypse?',
    'Who would be most likely to get cast on a reality show?',
    'Who would be most likely to accidentally start a livestream?',
    'Who would be most likely to gamble away a fortune?',
    'Who would be most likely to dance with strangers at a party?',
    'Who would be most likely to survive three days without a phone?',
    'Who would be most likely to embarrass a parent in front of friends?',
    'Who would be most likely to pass as a spy?',
    'Who would be most likely to propose while drunk?',
    'Who would be most likely to put their foot in their mouth?',
    'Who would be most likely to forget their own birthday?',
    'Who would be most likely to fall asleep in a meeting?',
    'Who would be most likely to buy something online and never use it?',
    'Who would be most likely to flirt with the boss for a promotion?',
    'Who would be most likely to call a one-night stand a relationship?',
    'Who would be most likely to lose everything on a game show?',
    'Who would be most likely to spend an entire weekend in pajamas?',
    'Who would be most likely to lie their way out of a date?',
    'Who would be most likely to start a group chat and never reply?',
    'Who would be most likely to burn down the kitchen cooking drunk?',
    'Who would be most likely to secretly google this question later?',
    'Who would be most likely to laugh at a funeral?',
    'Who would be most likely to quit their job to travel?',
    'Who would be most likely to tell a kid the truth about Santa?',
    'Who would be most likely to go grocery shopping drunk?',
    'Who would be most likely to forget where they parked the car?',
    'Who would be most likely to fly to the moon if they could?',
  ],
};

/* ---------------- PARTY PROMPTS ---------------- */
const CATEGORY_TOPICS = {
  de: ['Biermarken', 'Länder', 'Fußballvereine', 'Tiere', 'Automarken', 'Filme', 'Superhelden', 'Süßigkeiten'],
  en: ['Beer brands', 'Countries', 'Football clubs', 'Animals', 'Car brands', 'Movies', 'Superheroes', 'Candy'],
};
const RHYME_WORDS = {
  de: ['Haus', 'Baum', 'Stein', 'Schuh', 'Sonne', 'Katze', 'Wasser', 'Nacht'],
  en: ['House', 'Tree', 'Stone', 'Shoe', 'Sun', 'Cat', 'Water', 'Night'],
};
function partyPromptPool(lang) {
  const cat = CATEGORY_TOPICS[lang][Math.floor(Math.random() * CATEGORY_TOPICS[lang].length)];
  const rhyme = RHYME_WORDS[lang][Math.floor(Math.random() * RHYME_WORDS[lang].length)];
  if (lang === 'de') {
    return [
      { title: 'Kategorien', body: `Kategorie: "${cat}". Reihum nennt jeder einen Begriff — wer zögert oder sich wiederholt, trinkt.` },
      { title: 'Reimspiel', body: `Startwort: "${rhyme}". Reihum wird gereimt — wer keinen Reim findet, trinkt.` },
      { title: 'Fragemeisterin', body: 'Du bist ab jetzt Fragemeisterin. Wer direkt auf deine Fragen antwortet (ohne Gegenfrage), trinkt.' },
      { title: 'Daumenkönig', body: 'Du bist Daumenkönig. Lege irgendwann unauffällig deinen Daumen auf den Tisch — alle müssen nachziehen. Der Letzte trinkt.' },
      { title: 'Neue Regel', body: 'Erfinde eine neue Regel, die bis zum Spielende gilt (z. B. keine Vornamen nennen).' },
    ];
  }
  return [
    { title: 'Categories', body: `Category: "${cat}". Go around naming items — whoever hesitates or repeats drinks.` },
    { title: 'Rhyme Time', body: `Starting word: "${rhyme}". Go around rhyming — whoever can't rhyme drinks.` },
    { title: 'Question Master', body: "You're Question Master now. Anyone who answers your questions directly (without a question back) drinks." },
    { title: 'Thumb Master', body: "You're Thumb Master. At any point, quietly put your thumb on the table — everyone follows. Last one drinks." },
    { title: 'New Rule', body: 'Invent a new rule that lasts until the game ends (e.g. no first names allowed).' },
  ];
}

/* ---------------- RULEBOOK (reference screen) ---------------- */
const RULEBOOK = {
  de: [
    { title: '👑 Kings Cup (Ring of Fire)', body: "52 Karten werden verdeckt um ein Glas gelegt. Reihum zieht jeder eine Karte — jede Karte hat eine feste Regel (siehe Modus \"King's Cup\"). Wer den 4. König zieht, trinkt das gefüllte Glas in der Mitte aus." },
    { title: '🚌 Busfahrer (Ride the Bus)', body: 'Phase 1: Reihenfolge-Fragen — Rot/Schwarz, Höher/Tiefer, Innerhalb/Außerhalb, Farbe. Jede falsche Antwort = trinken.\nPhase 2: Eine Kartenpyramide wird aufgedeckt — wer eine passende Karte auf der Hand hat, verteilt Schlucke (je höher die Reihe, desto mehr Schlucke).\nPhase 3: Der Spieler mit den meisten Fehlern aus Phase 1 fährt die Kartenstraße — bei jeder falschen Vermutung geht es von vorne los.' },
    { title: '❤️🖤 Rot oder Schwarz', body: 'Vor jeder aufgedeckten Karte wird geraten: Rot oder Schwarz, danach Höher oder Tiefer. Falsch geraten = trinken.' },
    { title: '🃏 Fuck the Dealer', body: 'Ein Dealer zieht Karten, die anderen raten (Farbe → Höher/Tiefer → Innerhalb/Außerhalb). Bei richtiger Vermutung trinkt der Dealer, bei falscher der Ratende. Nach mehreren richtigen Antworten wechselt der Dealer.' },
    { title: '▲ Pyramide', body: 'Jeder erhält 4 Handkarten (echtes Deck nötig). Eine Pyramide wird Karte für Karte aufgedeckt — wer eine passende Karte hat, verteilt Schlucke entsprechend der Reihe.' },
    { title: '🂡 Ass, König, Dame, Bube', body: 'Karten werden nacheinander gezogen: Ass = 1 Schluck, König = 2, Dame = 3, Bube = 4. Alle anderen Karten sind bedeutungslos.' },
    { title: '🗂️ Kategorien', body: 'Ein Spieler nennt eine Kategorie (z. B. Biermarken). Reihum nennt jeder einen Begriff — wer nichts mehr weiß oder sich wiederholt, trinkt.' },
    { title: '🎤 Reimspiel', body: 'Ein Wort wird genannt, reihum wird gereimt. Wer keinen Reim findet oder zu lange braucht, trinkt.' },
    { title: '❓ Fragemeister', body: 'Ein Spieler darf nur noch Fragen stellen. Wer direkt antwortet statt mit einer Gegenfrage zu kontern, trinkt.' },
    { title: '👍 Daumenkönig', body: 'Ein Spieler ist Daumenkönig und legt irgendwann unauffällig den Daumen auf den Tisch. Alle müssen nachziehen — der Letzte trinkt.' },
    { title: '✦ Wer würde eher', body: 'Eine Frage wird vorgelesen ("Wer würde eher …?"). Alle zeigen gleichzeitig auf die Person, die am ehesten zutrifft — wer in der Minderheit landet (oder am häufigsten gezeigt wird), trinkt.' },
    { title: '📜 Beliebte Zusatzregeln', body: 'Neue Regel: Wer einen Buben zieht, darf eine neue Regel festlegen.\nSchimpfwörter verboten · Namen verboten · Handy benutzen verboten · Lachen bei bestimmten Aktionen verboten.' },
    { title: '🂡 Anlegen (High · Low · Same)', body: 'Drei Stapel liegen offen aus. Der aktive Stapel zeigt eine Karte — du rätst, ob die nächste Karte höher oder tiefer liegt. Bei Gleichstand: Push, nochmal. Bei 3 richtigen in Folge kannst du den Stapel "abgeben" (Sieg + neue Karte) oder mit ⚡ Extreme doppelt pokern. Falsch geraten = trinken, der Stapel wird neu gemischt.' },
    { title: '⚠️ Hinweis', body: 'Bitte verantwortungsvoll spielen. Niemand sollte zum Trinken gedrängt werden — alle Spiele funktionieren auch mit alkoholfreien Getränken.' },
  ],
  en: [
    { title: '👑 Kings Cup (Ring of Fire)', body: "52 cards are laid face-down around a glass. Players take turns drawing a card — each card triggers a fixed rule (see the \"King's Cup\" mode). Whoever draws the 4th king finishes the filled cup in the middle." },
    { title: '🚌 Ride the Bus', body: 'Phase 1: A sequence of guesses — Red/Black, Higher/Lower, Inside/Outside, Suit. Every wrong guess means a drink.\nPhase 2: A card pyramid is revealed — anyone holding a matching card hands out sips (higher rows are worth more).\nPhase 3: The player with the most mistakes from Phase 1 drives "the bus" — any wrong guess sends them back to the start.' },
    { title: '❤️🖤 Red or Black', body: 'Before each card is revealed, guess Red or Black, then Higher or Lower. A wrong guess means a drink.' },
    { title: '🃏 Fuck the Dealer', body: 'A dealer draws cards while others guess (color → higher/lower → inside/outside). A correct guess makes the dealer drink; a wrong one makes the guesser drink. The dealer role rotates after enough correct guesses.' },
    { title: '▲ Pyramid', body: 'Each player is dealt 4 cards from a real deck. A pyramid is revealed card by card — anyone holding a match hands out sips based on the row.' },
    { title: '🂡 Ace, King, Queen, Jack', body: 'Cards are drawn one by one: Ace = 1 sip, King = 2, Queen = 3, Jack = 4. All other cards are harmless.' },
    { title: '🗂️ Categories', body: 'A player names a category (e.g. beer brands). Going around, everyone names an item — whoever hesitates or repeats drinks.' },
    { title: '🎤 Rhyme Time', body: "A word is called out and everyone rhymes in turn. Whoever can't find a rhyme (or takes too long) drinks." },
    { title: '❓ Question Master', body: 'One player may only speak in questions. Anyone who answers directly instead of countering with a question drinks.' },
    { title: '👍 Thumb Master', body: 'One player is Thumb Master and quietly puts a thumb on the table at any point — everyone follows. Last one drinks.' },
    { title: '✦ Most Likely To', body: 'A prompt is read aloud ("Who would be most likely to …?"). Everyone points at the person they think fits — whoever gets pointed at most (or ends up in the minority) drinks.' },
    { title: '📜 Popular House Rules', body: 'New rule: whoever draws a jack may set a new rule.\nNo swearing · no first names · no phones · no laughing at certain actions.' },
    { title: '🂡 Anlegen (High · Low · Same)', body: 'Three piles lie face up. The active pile shows a card — guess whether the next one is higher or lower. A tie is a push, redraw. Get 3 correct in a row and you can cash in the pile (win + fresh card) or push your luck with ⚡ Extreme for double. Wrong guess = drink, and the pile reshuffles.' },
    { title: '⚠️ Please Note', body: 'Play responsibly. No one should be pressured to drink — every game also works with non-alcoholic drinks.' },
  ],
};

/* ---------------- UI STRINGS ---------------- */
const I18N = {
  de: {
    brand: 'card', brandAccent: 'party.', tagline: 'Minimalistische Kartentrinkspiele',
    playersLabel: 'Mitspieler', playersEmpty: 'Noch keine Spieler — Namen hinzufügen', addPlaceholder: 'Name hinzufügen…',
    gamesLabel: 'Spiele', rulesLabel: 'Regeln nachlesen',
    tapDraw: 'Karte antippen zum Ziehen', nextBtn: 'Weiter →',
    deckReshuffled: 'Deck neu gemischt',
    correct: 'Richtig', wrong: 'Falsch — trinken', push: 'Gleichstand — nochmal',
    higher: 'Höher', lower: 'Tiefer', red: 'Rot', black: 'Schwarz', inside: 'Innen', outside: 'Außen',
    streak: 'Serie', best: 'Rekord', drinksLabel: 'Schlucke', newRound: 'Neue Runde', nextPlayer: 'Nächster Spieler',
    loadingMsgs: ['Karten werden gemischt…', 'Deck wird ausgeteilt…', 'Tisch wird gedeckt…'],
    preparing: 'bereitet vor…',
    backAria: 'Zurück', ready: 'Bereit',
    navHome: 'Home', navRules: 'Regeln', turnLabel: 'Am Zug',
    modes: {
      kings: { title: "King's Cup", desc: 'Volles Deck — jede Karte hat eine eigene Regel' },
      bus: { title: 'Busfahrer', desc: '3 Phasen: Fragen, Pyramide, die Kartenstraße' },
      streak: { title: 'Höher / Tiefer', desc: 'Endlos-Serie — wie weit kommst du?' },
      redblack: { title: 'Rot oder Schwarz', desc: 'Errate die Farbe der nächsten Karte' },
      dealer: { title: 'Fuck the Dealer', desc: 'Dealer gegen Ratende — wer trinkt zuerst?' },
      akqj: { title: 'Ass, König, Dame, Bube', desc: 'Bildkarten zählen Schlucke — der Rest ist sicher' },
      mostlikely: { title: 'Wer würde eher', desc: 'Zeigt auf die passendste Person' },
      party: { title: 'Party-Prompts', desc: 'Kategorien, Reime, Fragemeister & mehr' },
      mix: { title: 'Mix-Modus', desc: 'Zufällige Mischung aus allem' },
      anlegen: { title: 'Anlegen', desc: 'High · Low · Same — 3 Stapel, ein Deck' },
    },
    anlegen: {
      pile: 'Stapel', card1: 'Karte', cardN: 'Karten', longest: 'längste', active: 'aktiv',
      streak: 'Serie', deck: 'Deck', where: 'Wo anlegen?', left: '← Links', right: '→ Rechts',
      bank: n => `Abgeben ab ${n}`, extreme: '⚡ Extreme', classic: 'KLASSISCH',
      banked: 'Abgegeben — Stapel gewonnen!', busted: n => `Falsch — ${n}× trinken`,
      wins: 'Siege',
    },
    bus: {
      phaseNames: ['Rot oder Schwarz', 'Höher oder Tiefer', 'Innen oder Außen', 'Farbe raten'],
      roundLabel: 'Runde', roundDone: 'Runde abgeschlossen',
      pyramidTitle: 'Phase 2 · Pyramide', pyramidHint: 'Reihe {row} · Wert {v}. Hast du eine passende Karte? Tippe auf einen Namen, um Schlucke zu verteilen.',
      pyramidDone: 'Pyramide fertig — weiter zur Kartenstraße', busTitle: 'Phase 3 · Die Kartenstraße', busDriver: 'Fahrer: {name}',
      busWrong: 'Falsch — zurück zum Start!', busWin: 'Geschafft! Die Straße ist frei 🎉',
      busProgress: 'Karte {n} / {total}', phase1Title: 'Phase 1 · Fragerunde', phase1Player: 'Am Zug: {name}', allDone: 'Alle Spieler fertig — weiter zur Pyramide',
      startBus: 'Kartenstraße starten', continueBtn: 'Weiter →', mistakes: 'Fehler',
    },
    dealer: { dealerLabel: 'Dealer', guesserLabel: 'Rater', dealerDrinks: 'Dealer trinkt', guesserDrinksTxt: 'Du trinkst', changeDealer: 'Dealer wechseln', streakHint: 'Serie: {n} richtig' },
    akqjText: { ace: 'Ass — 1 Schluck', king: 'König — 2 Schlucke', queen: 'Dame — 3 Schlucke', jack: 'Bube — 4 Schlucke', safe: 'Ungefährlich' },
    mostLikelyReveal: 'Aufdecken', mostLikelyNext: 'Nächste Frage →',
    partyNext: 'Nächster Prompt →',
    landing: {
      intro: 'Der digitale Kartenstapel für deinen Abend: King\'s Cup, Busfahrer, Wer würde eher und mehr — animiert, minimalistisch, sofort startklar.',
      cta: 'Los geht\'s →',
      features: [
        { icon: '🃏', label: '10 Spiele' },
        { icon: '🌍', label: 'DE & EN' },
        { icon: '⚡', label: 'Kein Setup' },
      ],
    },
  },
  en: {
    brand: 'card', brandAccent: 'party.', tagline: 'Minimal card drinking games',
    playersLabel: 'Players', playersEmpty: 'No players yet — add some names', addPlaceholder: 'Add a name…',
    gamesLabel: 'Games', rulesLabel: 'How to play',
    tapDraw: 'Tap the card to draw', nextBtn: 'Next →',
    deckReshuffled: 'Deck reshuffled',
    correct: 'Correct', wrong: 'Wrong — drink', push: 'Tie — redraw',
    higher: 'Higher', lower: 'Lower', red: 'Red', black: 'Black', inside: 'Inside', outside: 'Outside',
    streak: 'Streak', best: 'Best', drinksLabel: 'Drinks', newRound: 'New Round', nextPlayer: 'Next Player',
    loadingMsgs: ['Shuffling the deck…', 'Dealing the cards…', 'Setting the table…'],
    preparing: 'preparing…',
    backAria: 'Back', ready: 'Ready',
    navHome: 'Home', navRules: 'Rules', turnLabel: 'Your Turn',
    modes: {
      kings: { title: "King's Cup", desc: 'Full deck — every card triggers its own rule' },
      bus: { title: 'Ride the Bus', desc: '3 phases: questions, pyramid, the bus' },
      streak: { title: 'Higher / Lower', desc: 'Endless streak — how far can you go?' },
      redblack: { title: 'Red or Black', desc: 'Guess the color of the next card' },
      dealer: { title: 'Fuck the Dealer', desc: 'Dealer vs. guessers — who drinks first?' },
      akqj: { title: 'Ace, King, Queen, Jack', desc: 'Face cards count sips — everything else is safe' },
      mostlikely: { title: 'Most Likely To', desc: 'Point at whoever fits the prompt best' },
      party: { title: 'Party Prompts', desc: 'Categories, rhymes, question master & more' },
      mix: { title: 'Mix Mode', desc: 'Random blend of everything' },
      anlegen: { title: 'Anlegen', desc: 'High · Low · Same — 3 piles, one deck' },
    },
    anlegen: {
      pile: 'Pile', card1: 'card', cardN: 'cards', longest: 'longest', active: 'active',
      streak: 'Streak', deck: 'Deck', where: 'Which way?', left: '← Lower', right: '→ Higher',
      bank: n => `Cash in from ${n}`, extreme: '⚡ Extreme', classic: 'CLASSIC',
      banked: 'Cashed in — pile won!', busted: n => `Wrong — drink ${n}×`,
      wins: 'Wins',
    },
    bus: {
      phaseNames: ['Red or Black', 'Higher or Lower', 'Inside or Outside', 'Guess the Suit'],
      roundLabel: 'Round', roundDone: 'Round complete',
      pyramidTitle: 'Phase 2 · Pyramid', pyramidHint: 'Row {row} · worth {v}. Got a matching card? Tap a name to hand out sips.',
      pyramidDone: 'Pyramid complete — on to the bus', busTitle: 'Phase 3 · The Bus', busDriver: 'Driver: {name}',
      busWrong: 'Wrong — back to the start!', busWin: 'Made it! The bus is clear 🎉',
      busProgress: 'Card {n} / {total}', phase1Title: 'Phase 1 · Question Round', phase1Player: 'Turn: {name}', allDone: 'All players done — on to the pyramid',
      startBus: 'Start the Bus', continueBtn: 'Continue →', mistakes: 'Mistakes',
    },
    dealer: { dealerLabel: 'Dealer', guesserLabel: 'Guesser', dealerDrinks: 'Dealer drinks', guesserDrinksTxt: 'You drink', changeDealer: 'Change Dealer', streakHint: 'Streak: {n} correct' },
    akqjText: { ace: 'Ace — 1 sip', king: 'King — 2 sips', queen: 'Queen — 3 sips', jack: 'Jack — 4 sips', safe: 'Safe' },
    mostLikelyReveal: 'Reveal', mostLikelyNext: 'Next Question →',
    partyNext: 'Next Prompt →',
    landing: {
      intro: "The digital deck for your next get-together: King's Cup, Ride the Bus, Most Likely To and more — animated, minimal, ready in seconds.",
      cta: "Let's go →",
      features: [
        { icon: '🃏', label: '10 games' },
        { icon: '🌍', label: 'DE & EN' },
        { icon: '⚡', label: 'Zero setup' },
      ],
    },
  },
};
