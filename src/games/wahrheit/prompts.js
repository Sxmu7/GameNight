// Real, curated, trilingual prompt decks for "Wahrheit oder Pflicht" /
// "Truth or Dare" / "Verdad o Reto". Every entry has a `pack` so themed sets
// can be toggled on top of the always-available classic deck.
export const PACKS = ["classic", "bachelor", "office", "date", "holiday"];

export const TRUTHS = [
  // ── Classic (20) ─────────────────────────────────────────────────────────
  { pack: "classic", de: "Was ist die peinlichste Nachricht in deinem Handy?", en: "What's the most embarrassing text on your phone?", es: "¿Cuál es el mensaje más vergonzoso en tu teléfono?" },
  { pack: "classic", de: "Wer aus dieser Runde würdest du am ehesten daten?", en: "Who in this group would you most likely date?", es: "¿Con quién de este grupo saldrías más probablemente?" },
  { pack: "classic", de: "Was ist die größte Lüge, die du je erzählt hast?", en: "What's the biggest lie you've ever told?", es: "¿Cuál es la mentira más grande que has dicho?" },
  { pack: "classic", de: "Welche App checkst du morgens als Erstes?", en: "Which app do you check first in the morning?", es: "¿Qué app revisas primero por la mañana?" },
  { pack: "classic", de: "Was war dein peinlichster Moment in der Schule?", en: "What was your most embarrassing moment at school?", es: "¿Cuál fue tu momento más vergonzoso en el colegio?" },
  { pack: "classic", de: "Wen hast du zuletzt heimlich auf Social Media gestalkt?", en: "Who did you last secretly stalk on social media?", es: "¿A quién stalkeaste por última vez en redes sociales?" },
  { pack: "classic", de: "Was ist das Unangenehmste, das dir auf einem Date passiert ist?", en: "What's the most awkward thing that's happened to you on a date?", es: "¿Cuál es lo más incómodo que te ha pasado en una cita?" },
  { pack: "classic", de: "Welche Notlüge benutzt du am häufigsten?", en: "What white lie do you use most often?", es: "¿Qué mentira piadosa usas más seguido?" },
  { pack: "classic", de: "Was würdest du nie öffentlich zugeben, außer jetzt?", en: "What would you never admit publicly, except right now?", es: "¿Qué nunca admitirías en público, excepto ahora?" },
  { pack: "classic", de: "Wer in dieser Runde könnte dich am ehesten überreden, etwas Dummes zu tun?", en: "Who in this group could most easily talk you into doing something dumb?", es: "¿Quién de este grupo podría convencerte más fácilmente de hacer una tontería?" },
  { pack: "classic", de: "Was ist dein größtes Guilty Pleasure?", en: "What's your biggest guilty pleasure?", es: "¿Cuál es tu mayor placer culposo?" },
  { pack: "classic", de: "Welche Nachricht hast du abgeschickt und sofort bereut?", en: "What message did you send and instantly regret?", es: "¿Qué mensaje enviaste y te arrepentiste al instante?" },
  { pack: "classic", de: "Was ist das Verrückteste, das du je um 3 Uhr nachts getan hast?", en: "What's the craziest thing you've done at 3am?", es: "¿Qué es lo más loco que has hecho a las 3 de la madrugada?" },
  { pack: "classic", de: "Wem in dieser Runde würdest du am ehesten dein Passwort anvertrauen?", en: "Who in this group would you trust with your password?", es: "¿A quién de este grupo le confiarías tu contraseña?" },
  { pack: "classic", de: "Was war dein peinlichster Spitzname?", en: "What was your most embarrassing nickname?", es: "¿Cuál fue tu apodo más vergonzoso?" },
  { pack: "classic", de: "Was ist das Peinlichste, das du je gepostet hast?", en: "What's the most embarrassing thing you've ever posted?", es: "¿Qué es lo más vergonzoso que has publicado?" },
  { pack: "classic", de: "Welche Serie schaust du heimlich, ohne es zuzugeben?", en: "What show do you secretly watch without admitting it?", es: "¿Qué serie ves a escondidas sin admitirlo?" },
  { pack: "classic", de: "Was ist die unangenehmste Verabredung, die du je hattest?", en: "What's the most awkward date you've ever been on?", es: "¿Cuál ha sido tu cita más incómoda?" },
  { pack: "classic", de: "Wen in dieser Runde würdest du am ehesten um einen Gefallen bitten, den du nicht zurückzahlen kannst?", en: "Who in this group would you most likely ask for a favor you can't repay?", es: "¿A quién de este grupo le pedirías un favor que no puedes devolver?" },
  { pack: "classic", de: "Was ist das Ungewöhnlichste, wofür du je Geld ausgegeben hast?", en: "What's the strangest thing you've ever spent money on?", es: "¿Cuál es lo más raro en lo que has gastado dinero?" },

  // ── Themed truths (4 per pack) ──────────────────────────────────────────────
  { pack: "bachelor", de: "Was ist das Verrückteste, das du auf einem Junggesellenabschied erlebt hast?", en: "What's the craziest thing you've experienced at a bachelor/bachelorette party?", es: "¿Qué es lo más loco que has vivido en una despedida de soltero/a?" },
  { pack: "bachelor", de: "Wer aus dieser Runde wäre der chaotischste Trauzeuge / die chaotischste Brautjungfer?", en: "Who in this group would be the most chaotic best man/bridesmaid?", es: "¿Quién de este grupo sería el padrino/dama de honor más caótico/a?" },
  { pack: "bachelor", de: "Was würdest du bei deinem eigenen Junggesellenabschied auf keinen Fall wollen?", en: "What would you absolutely not want at your own bachelor/bachelorette party?", es: "¿Qué no querrías de ninguna manera en tu propia despedida de soltero/a?" },
  { pack: "bachelor", de: "Welches peinliche Kostüm hast du schon getragen?", en: "What's the most embarrassing costume you've ever worn?", es: "¿Cuál es el disfraz más vergonzoso que has llevado?" },

  { pack: "office", de: "Was ist das Unprofessionellste, das du je auf der Arbeit getan hast?", en: "What's the most unprofessional thing you've ever done at work?", es: "¿Qué es lo más poco profesional que has hecho en el trabajo?" },
  { pack: "office", de: "Wen aus dieser Runde würdest du am ehesten als Chef wollen?", en: "Who in this group would you most want as your boss?", es: "¿A quién de este grupo querrías más como jefe/a?" },
  { pack: "office", de: "Was hast du schon mal in einer Firmen-E-Mail bereut?", en: "What have you regretted sending in a work email?", es: "¿Qué has lamentado enviar en un correo de trabajo?" },
  { pack: "office", de: "Was ist deine unbeliebteste Meinung übers Büroleben?", en: "What's your most unpopular opinion about office life?", es: "¿Cuál es tu opinión más impopular sobre la vida de oficina?" },

  { pack: "date", de: "Was ist dein größter Dealbreaker bei einem Date?", en: "What's your biggest dealbreaker on a date?", es: "¿Cuál es tu mayor motivo de ruptura en una cita?" },
  { pack: "date", de: "Was war dein bestes erstes Date?", en: "What was your best first date?", es: "¿Cuál fue tu mejor primera cita?" },
  { pack: "date", de: "Wer aus dieser Runde wäre dein Traum-Date?", en: "Who in this group would be your dream date?", es: "¿Quién de este grupo sería tu cita ideal?" },
  { pack: "date", de: "Was ist die schlechteste Anmache, die du je gehört hast?", en: "What's the worst pickup line you've ever heard?", es: "¿Cuál es la peor frase para ligar que has escuchado?" },

  { pack: "holiday", de: "Was ist dein schlechtester Vorsatz fürs neue Jahr gewesen?", en: "What was your worst New Year's resolution?", es: "¿Cuál fue tu peor propósito de año nuevo?" },
  { pack: "holiday", de: "Was ist das schlechteste Geschenk, das du je bekommen hast?", en: "What's the worst gift you've ever received?", es: "¿Cuál es el peor regalo que has recibido?" },
  { pack: "holiday", de: "Welche Familientradition an Feiertagen findest du am nervigsten?", en: "Which holiday family tradition annoys you the most?", es: "¿Qué tradición familiar navideña te resulta más molesta?" },
  { pack: "holiday", de: "Was war dein chaotischstes Silvester?", en: "What was your most chaotic New Year's Eve?", es: "¿Cuál ha sido tu Nochevieja más caótica?" },
];

export const DARES = [
  // ── Classic (20) ─────────────────────────────────────────────────────────
  { pack: "classic", de: "Mach 10 Liegestütze — sofort.", en: "Do 10 push-ups — right now.", es: "Haz 10 flexiones — ahora mismo." },
  { pack: "classic", de: "Tanze 20 Sekunden ohne Musik, alle schauen zu.", en: "Dance for 20 seconds with no music, everyone watching.", es: "Baila 20 segundos sin música, todos mirando." },
  { pack: "classic", de: "Lass dir von der Gruppe ein Wort geben und erfinde einen Rap dazu.", en: "Have the group give you a word and freestyle a rap about it.", es: "Deja que el grupo te dé una palabra e improvisa un rap con ella." },
  { pack: "classic", de: "Sprich für die nächsten drei Minuten mit einem Akzent deiner Wahl.", en: "Speak in an accent of your choice for the next three minutes.", es: "Habla con el acento que quieras durante los próximos tres minutos." },
  { pack: "classic", de: "Ruf jemanden an und sing die ersten Zeilen eines Liedes vor.", en: "Call someone and sing the first lines of a song to them.", es: "Llama a alguien y cántale las primeras líneas de una canción." },
  { pack: "classic", de: "Lass die Gruppe dein nächstes Story-Bild aussuchen.", en: "Let the group pick your next story photo.", es: "Deja que el grupo elija tu próxima foto de historia." },
  { pack: "classic", de: "Mach ein Kompliment an jede Person in der Runde — ohne zu lachen.", en: "Give every person in the group a compliment — without laughing.", es: "Hazle un cumplido a cada persona del grupo — sin reírte." },
  { pack: "classic", de: "Erzähl einen Witz. Lacht niemand, trinkst du extra.", en: "Tell a joke. If nobody laughs, you drink extra.", es: "Cuenta un chiste. Si nadie se ríe, bebes extra." },
  { pack: "classic", de: "Tausche für die nächste Runde einen Gegenstand mit deinem Nachbarn.", en: "Swap an item with your neighbor for the rest of the round.", es: "Intercambia un objeto con tu vecino/a por el resto de la ronda." },
  { pack: "classic", de: "Imitiere eine Person aus der Runde, die anderen raten wer.", en: "Impersonate someone in the group, everyone else guesses who.", es: "Imita a alguien del grupo, los demás adivinan a quién." },
  { pack: "classic", de: "Erzähl die Handlung deines Lieblingsfilms nur mit Gesten.", en: "Act out the plot of your favorite movie using only gestures.", es: "Actúa la trama de tu película favorita solo con gestos." },
  { pack: "classic", de: "Lass dir von jemandem die Schuhe binden — mit geschlossenen Augen.", en: "Have someone tie your shoes — with your eyes closed.", es: "Deja que alguien te ate los zapatos — con los ojos cerrados." },
  { pack: "classic", de: "Sing den Refrain eines Liedes, das dir gerade einfällt.", en: "Sing the chorus of whatever song comes to mind first.", es: "Canta el estribillo de la primera canción que se te ocurra." },
  { pack: "classic", de: "Halte 30 Sekunden lang Blickkontakt mit deinem Nachbarn, ohne zu lachen.", en: "Hold eye contact with your neighbor for 30 seconds without laughing.", es: "Mantén contacto visual con tu vecino/a 30 segundos sin reírte." },
  { pack: "classic", de: "Erfinde spontan ein Trinklied für diese Runde.", en: "Make up a drinking song for this group on the spot.", es: "Inventa una canción para beber para este grupo, en el momento." },
  { pack: "classic", de: "Lass dich von der Gruppe für 2 Minuten fotografieren, wie du posierst.", en: "Let the group photograph you posing for 2 minutes.", es: "Deja que el grupo te fotografíe posando durante 2 minutos." },
  { pack: "classic", de: "Erzähl eine Geschichte rückwärts, Satz für Satz.", en: "Tell a story backwards, sentence by sentence.", es: "Cuenta una historia al revés, frase por frase." },
  { pack: "classic", de: "Mach für die nächste Runde Ansagen wie ein Sportkommentator.", en: "Do sports-commentator style commentary for the next round.", es: "Comenta la siguiente ronda como un comentarista deportivo." },
  { pack: "classic", de: "Lass jemanden aus der Gruppe dein nächstes Getränk bestellen — du trinkst es, ohne zu fragen was es ist.", en: "Let someone in the group order your next drink — you drink it without asking what it is.", es: "Deja que alguien del grupo pida tu próxima bebida — la bebes sin preguntar qué es." },
  { pack: "classic", de: "Halte eine 30-Sekunden-Werbung für einen Gegenstand aus deiner Tasche.", en: "Give a 30-second infomercial for an object from your pocket or bag.", es: "Haz un anuncio de 30 segundos de un objeto de tu bolsillo o bolso." },

  // ── Themed dares (4 per pack) ────────────────────────────────────────────────
  { pack: "bachelor", de: "Halte eine spontane Rede auf das Brautpaar (oder eine imaginäre Hochzeit).", en: "Give a spontaneous toast to the happy couple (or an imaginary wedding).", es: "Da un brindis espontáneo por la feliz pareja (o una boda imaginaria)." },
  { pack: "bachelor", de: "Trag für die nächste Runde einen imaginären Schleier oder eine imaginäre Krawatte.", en: "Wear an imaginary veil or tie for the rest of the round.", es: "Lleva un velo o corbata imaginarios durante el resto de la ronda." },
  { pack: "bachelor", de: "Erzähl die peinlichste Anekdote über eine Person in der Runde.", en: "Tell the most embarrassing anecdote about someone in the group.", es: "Cuenta la anécdota más vergonzosa sobre alguien del grupo." },
  { pack: "bachelor", de: "Tanze einen imaginären Hochzeitstanz mit deinem Nachbarn.", en: "Dance an imaginary wedding dance with your neighbor.", es: "Baila un baile de boda imaginario con tu vecino/a." },

  { pack: "office", de: "Halte eine 30-Sekunden-Präsentation über ein zufälliges Bürothema.", en: "Give a 30-second presentation on a random office topic.", es: "Da una presentación de 30 segundos sobre un tema de oficina al azar." },
  { pack: "office", de: "Beantworte die nächste Frage im professionellsten Ton, den du hinbekommst.", en: "Answer the next question in the most professional tone you can manage.", es: "Responde a la siguiente pregunta con el tono más profesional que puedas." },
  { pack: "office", de: "Schreib eine Fake-Abwesenheitsnotiz und lies sie laut vor.", en: "Write a fake out-of-office auto-reply and read it aloud.", es: "Escribe una respuesta automática falsa de 'fuera de la oficina' y léela en voz alta." },
  { pack: "office", de: "Imitiere den nervigsten Kollegen-Typ, den du kennst.", en: "Impersonate the most annoying coworker type you know.", es: "Imita al tipo de compañero de trabajo más molesto que conozcas." },

  { pack: "date", de: "Flirt mit deinem Nachbarn mit der schlechtesten Anmache, die dir einfällt.", en: "Flirt with your neighbor using the worst pickup line you can think of.", es: "Coquetea con tu vecino/a con la peor frase para ligar que se te ocurra." },
  { pack: "date", de: "Beschreib deinen Traumpartner nur mit drei Wörtern.", en: "Describe your dream partner in just three words.", es: "Describe a tu pareja ideal en solo tres palabras." },
  { pack: "date", de: "Schreib eine Kurz-Dating-Profil-Bio für die Person rechts von dir.", en: "Write a short dating-profile bio for the person on your right.", es: "Escribe una breve biografía de perfil de citas para la persona a tu derecha." },
  { pack: "date", de: "Mach der Gruppe ein aufrichtiges Kompliment, ohne zu lächeln.", en: "Give the group a sincere compliment without smiling.", es: "Hazle un cumplido sincero al grupo sin sonreír." },

  { pack: "holiday", de: "Sing ein Weihnachtslied oder ein Feiertagslied, so gut du kannst.", en: "Sing a Christmas carol or holiday song as best you can.", es: "Canta un villancico o canción festiva lo mejor que puedas." },
  { pack: "holiday", de: "Mach einen Countdown wie an Silvester — laut und dramatisch.", en: "Do a New Year's-style countdown — loud and dramatic.", es: "Haz una cuenta regresiva al estilo Nochevieja — fuerte y dramática." },
  { pack: "holiday", de: "Verteile spontan ein imaginäres Geschenk an jede Person in der Runde.", en: "Spontaneously hand out an imaginary gift to everyone in the group.", es: "Reparte espontáneamente un regalo imaginario a cada persona del grupo." },
  { pack: "holiday", de: "Erzähl den peinlichsten Feiertagsmoment deiner Familie.", en: "Tell the most embarrassing holiday moment from your family.", es: "Cuenta el momento festivo más vergonzoso de tu familia." },
];
