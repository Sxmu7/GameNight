// Real, curated, trilingual prompt deck for "Ich hab noch nie" / "Never Have I
// Ever" / "Yo Nunca". Every entry has a `pack` so themed decks can be
// toggled on top of the always-available classic deck. No duplicates, same
// meaning across de/en/es so the deck stays identical when switching language.
export const PACKS = ["classic", "bachelor", "office", "date", "holiday"];

export const NIEMALS_PROMPTS = [
  // ── Classic (40) ─────────────────────────────────────────────────────────
  { pack: "classic", cat: "mild", de: "…einen Chef angelogen, um früher gehen zu können.", en: "…lied to a boss to leave work early.", es: "…le mentí a un jefe para salir antes del trabajo." },
  { pack: "classic", cat: "mild", de: "…in der Öffentlichkeit hingefallen.", en: "…fallen down in public.", es: "…me caí en público." },
  { pack: "classic", cat: "mild", de: "…eine Nachricht an die falsche Person geschickt.", en: "…sent a text to the wrong person.", es: "…envié un mensaje a la persona equivocada." },
  { pack: "classic", cat: "mild", de: "…bei einem Date so getan, als würde ich zuhören.", en: "…pretended to listen on a date.", es: "…fingí escuchar en una cita." },
  { pack: "classic", cat: "mild", de: "…aus Versehen einen Alarm ausgelöst.", en: "…accidentally set off an alarm.", es: "…activé una alarma sin querer." },
  { pack: "classic", cat: "mild", de: "…ein Kino verlassen, weil der Film so schlecht war.", en: "…walked out of a movie because it was that bad.", es: "…salí de un cine porque la película era pésima." },
  { pack: "classic", cat: "mild", de: "…unter falschem Namen einen Tisch reserviert.", en: "…made a reservation under a fake name.", es: "…reservé una mesa con un nombre falso." },
  { pack: "classic", cat: "mild", de: "…betrunken eine wichtige Nachricht getippt, aber nie abgeschickt.", en: "…typed an important message while drunk but never sent it.", es: "…escribí un mensaje importante borracho/a pero nunca lo envié." },
  { pack: "classic", cat: "mild", de: "…eine Prüfung ohne zu lernen bestanden.", en: "…passed an exam without studying.", es: "…aprobé un examen sin estudiar." },
  { pack: "classic", cat: "mild", de: "…jemanden auf Social Media heimlich gestalkt.", en: "…secretly stalked someone on social media.", es: "…stalkeé a alguien en redes sociales en secreto." },
  { pack: "classic", cat: "mild", de: "…auf der Arbeit oder in der Uni eingeschlafen.", en: "…fallen asleep at work or in class.", es: "…me quedé dormido/a en el trabajo o en clase." },
  { pack: "classic", cat: "mild", de: "…beim Karaoke komplett versagt.", en: "…completely bombed at karaoke.", es: "…fracasé por completo cantando karaoke." },
  { pack: "classic", cat: "mild", de: "…einen Trip abgesagt, weil ich zu faul zum Packen war.", en: "…cancelled a trip because I was too lazy to pack.", es: "…cancelé un viaje por pereza de hacer la maleta." },
  { pack: "classic", cat: "mild", de: "…in der Schule geschummelt.", en: "…cheated on a test at school.", es: "…copié en un examen en el colegio." },
  { pack: "classic", cat: "mild", de: "…vor Publikum über meine eigenen Füße gestolpert.", en: "…tripped over my own feet in front of people.", es: "…tropecé con mis propios pies delante de gente." },
  { pack: "classic", cat: "mild", de: "…ein Geschenk weiterverschenkt, das ich selbst bekommen habe.", en: "…regifted something I received myself.", es: "…regalé algo que a mí me habían regalado." },
  { pack: "classic", cat: "mild", de: "…so getan, als hätte ich eine Nachricht nicht gesehen.", en: "…pretended I hadn't seen a message.", es: "…fingí no haber visto un mensaje." },
  { pack: "classic", cat: "mild", de: "…ein Foto von mir stark bearbeitet, bevor ich es gepostet habe.", en: "…heavily edited a photo of myself before posting it.", es: "…edité mucho una foto mía antes de publicarla." },
  { pack: "classic", cat: "mild", de: "…mich verlaufen, obwohl ich wusste, wo ich war.", en: "…gotten lost even though I knew where I was.", es: "…me perdí aunque sabía dónde estaba." },
  { pack: "classic", cat: "mild", de: "…bei einem Quiz geschummelt, um zu gewinnen.", en: "…cheated at a quiz just to win.", es: "…hice trampa en un concurso solo para ganar." },
  { pack: "classic", cat: "spicy", de: "…mit meinem Ex geschrieben, obwohl ich es nicht wollte.", en: "…texted my ex even though I didn't want to.", es: "…le escribí a mi ex aunque no quería." },
  { pack: "classic", cat: "spicy", de: "…ein Date direkt nach dem ersten Treffen abgesagt.", en: "…cancelled a date right after the first meeting.", es: "…cancelé una cita justo después del primer encuentro." },
  { pack: "classic", cat: "spicy", de: "…jemanden in dieser Runde schon mal attraktiv gefunden.", en: "…found someone in this group attractive.", es: "…encontré atractivo/a a alguien de este grupo." },
  { pack: "classic", cat: "spicy", de: "…eine Beziehung nur wegen der Bequemlichkeit fortgesetzt.", en: "…stayed in a relationship purely out of convenience.", es: "…seguí en una relación solo por comodidad." },
  { pack: "classic", cat: "spicy", de: "…jemanden geghostet.", en: "…ghosted someone.", es: "…le hice ghosting a alguien." },
  { pack: "classic", cat: "spicy", de: "…bei einem One-Night-Stand am nächsten Morgen bereut, geblieben zu sein.", en: "…regretted staying the morning after a one-night stand.", es: "…me arrepentí de quedarme la mañana después de un one-night-stand." },
  { pack: "classic", cat: "spicy", de: "…heimlich jemanden aus dieser Runde gegoogelt.", en: "…secretly googled someone in this group.", es: "…busqué en secreto a alguien de este grupo en internet." },
  { pack: "classic", cat: "spicy", de: "…eine Notlüge benutzt, um ein Date zu beenden.", en: "…used a white lie to end a date early.", es: "…usé una mentira piadosa para terminar una cita." },
  { pack: "classic", cat: "spicy", de: "…schon mal jemandem aus Mitleid geantwortet.", en: "…replied to someone out of pity.", es: "…le respondí a alguien por lástima." },
  { pack: "classic", cat: "spicy", de: "…eine Dating-App gleichzeitig mit mehreren Leuten genutzt.", en: "…used multiple dating apps with several people at once.", es: "…usé varias apps de citas con varias personas a la vez." },
  { pack: "classic", cat: "spicy", de: "…mit jemandem geflirtet, nur um ein Getränk spendiert zu bekommen.", en: "…flirted with someone just to get a free drink.", es: "…coqueteé con alguien solo para que me invitaran una bebida." },
  { pack: "classic", cat: "spicy", de: "…ein zweites Date abgesagt, weil das erste zu langweilig war.", en: "…cancelled a second date because the first was too boring.", es: "…cancelé una segunda cita porque la primera fue muy aburrida." },
  { pack: "classic", cat: "spicy", de: "…jemanden aus reiner Neugier auf ein Date eingeladen.", en: "…asked someone out purely out of curiosity.", es: "…invité a salir a alguien solo por curiosidad." },
  { pack: "classic", cat: "spicy", de: "…über meinen Beziehungsstatus gelogen, um Aufmerksamkeit zu vermeiden.", en: "…lied about my relationship status to avoid attention.", es: "…mentí sobre mi estado sentimental para evitar atención." },
  { pack: "classic", cat: "spicy", de: "…während einer Beziehung mit jemand anderem geflirtet.", en: "…flirted with someone else while in a relationship.", es: "…coqueteé con alguien más estando en una relación." },
  { pack: "classic", cat: "spicy", de: "…ein Foto gelöscht, weil ein Ex noch drauf war.", en: "…deleted a photo because an ex was still in it.", es: "…borré una foto porque salía un ex." },
  { pack: "classic", cat: "spicy", de: "…absichtlich eine Nachricht ignoriert, um interessanter zu wirken.", en: "…deliberately ignored a message to seem more interesting.", es: "…ignoré un mensaje a propósito para parecer más interesante." },
  { pack: "classic", cat: "spicy", de: "…jemanden aus dieser Runde in einem Traum geküsst.", en: "…dreamed about kissing someone in this group.", es: "…soñé con besar a alguien de este grupo." },
  { pack: "classic", cat: "spicy", de: "…eine Verabredung nur wegen des Essens durchgezogen.", en: "…went on a date purely for the food.", es: "…fui a una cita solo por la comida." },
  { pack: "classic", cat: "spicy", de: "…schon mal aus Langeweile mit einem Ex geflirtet.", en: "…flirted with an ex out of boredom.", es: "…coqueteé con un ex por aburrimiento." },

  // ── Junggesellenabschied / Bachelor(ette) Party (6) ────────────────────────
  { pack: "bachelor", cat: "mild", de: "…die Aufgaben als Trauzeuge/Brautjungfer unterschätzt.", en: "…underestimated the best man/bridesmaid duties.", es: "…subestimé las tareas de padrino/dama de honor." },
  { pack: "bachelor", cat: "mild", de: "…bei einer Hochzeit mehr geweint als das Brautpaar.", en: "…cried more at a wedding than the couple getting married.", es: "…lloré más en una boda que la pareja que se casaba." },
  { pack: "bachelor", cat: "spicy", de: "…bei einem Junggesellenabschied jemanden angeflirtet.", en: "…flirted with someone at a bachelor/bachelorette party.", es: "…coqueteé con alguien en una despedida de soltero/a." },
  { pack: "bachelor", cat: "mild", de: "…einen Teil eines Junggesellenabschieds komplett verschlafen.", en: "…slept through part of a bachelor/bachelorette party.", es: "…me quedé dormido/a durante parte de una despedida de soltero/a." },
  { pack: "bachelor", cat: "spicy", de: "…etwas auf einem Junggesellenabschied getan, das die Braut/der Bräutigam nie erfahren darf.", en: "…done something at a bachelor/bachelorette party the bride/groom must never find out about.", es: "…hice algo en una despedida que la novia/el novio nunca debe saber." },
  { pack: "bachelor", cat: "mild", de: "…ein peinliches Kostüm bei einem Junggesellenabschied getragen.", en: "…worn an embarrassing costume at a bachelor/bachelorette party.", es: "…llevé un disfraz vergonzoso en una despedida de soltero/a." },

  // ── Büro-Party / Office Party (6) ──────────────────────────────────────────
  { pack: "office", cat: "mild", de: "…bei der Weihnachtsfeier zu viel getrunken und es am nächsten Tag bereut.", en: "…drunk too much at the office party and regretted it the next day.", es: "…bebí demasiado en la fiesta de la oficina y me arrepentí al día siguiente." },
  { pack: "office", cat: "spicy", de: "…mit einem Kollegen oder einer Kollegin geflirtet.", en: "…flirted with a coworker.", es: "…coqueteé con un compañero/a de trabajo." },
  { pack: "office", cat: "mild", de: "…bei einer Firmenfeier vor dem Chef getanzt.", en: "…danced in front of my boss at a company party.", es: "…bailé delante de mi jefe/a en una fiesta de empresa." },
  { pack: "office", cat: "mild", de: "…eine Karaoke-Nummer bei der Firmenfeier hingelegt.", en: "…done a karaoke number at the company party.", es: "…canté karaoke en la fiesta de la empresa." },
  { pack: "office", cat: "mild", de: "…am Tag nach der Weihnachtsfeier krank gemeldet.", en: "…called in sick the day after the office party.", es: "…me reporté enfermo/a el día después de la fiesta de la oficina." },
  { pack: "office", cat: "spicy", de: "…etwas auf der Firmenfeier gesagt, das ich im Büro nie hätte sagen sollen.", en: "…said something at the office party I should never have said at work.", es: "…dije algo en la fiesta de la oficina que nunca debí decir en el trabajo." },

  // ── Date-Edition (6) ────────────────────────────────────────────────────────
  { pack: "date", cat: "spicy", de: "…bei einem ersten Date die Rechnung absichtlich nicht angeschaut.", en: "…deliberately avoided looking at the bill on a first date.", es: "…evité a propósito mirar la cuenta en una primera cita." },
  { pack: "date", cat: "mild", de: "…ein Date gecancelt, weil ich keine Lust mehr hatte.", en: "…cancelled a date because I just wasn't feeling it anymore.", es: "…cancelé una cita porque ya no tenía ganas." },
  { pack: "date", cat: "mild", de: "…mich vor einem Date stundenlang vorbereitet.", en: "…spent hours getting ready before a date.", es: "…me preparé durante horas antes de una cita." },
  { pack: "date", cat: "mild", de: "…bei einem Date über meinen Ex gesprochen.", en: "…talked about my ex on a date.", es: "…hablé de mi ex en una cita." },
  { pack: "date", cat: "mild", de: "…ein zweites Date nur wegen des guten Essens vereinbart.", en: "…arranged a second date purely because the food was good.", es: "…acordé una segunda cita solo porque la comida estaba buena." },
  { pack: "date", cat: "spicy", de: "…bei einem Date gelogen, um interessanter zu wirken.", en: "…lied on a date to seem more interesting.", es: "…mentí en una cita para parecer más interesante." },

  // ── Feiertage / Holidays (6) ────────────────────────────────────────────────
  { pack: "holiday", cat: "mild", de: "…an Silvester einen guten Vorsatz schon im Januar gebrochen.", en: "…broken a New Year's resolution before January was over.", es: "…rompí un propósito de año nuevo antes de que acabara enero." },
  { pack: "holiday", cat: "mild", de: "…an Weihnachten das falsche Geschenk gekauft.", en: "…bought the wrong Christmas present for someone.", es: "…compré el regalo equivocado en Navidad." },
  { pack: "holiday", cat: "mild", de: "…an Silvester eingeschlafen, bevor es Mitternacht war.", en: "…fallen asleep on New Year's Eve before midnight.", es: "…me quedé dormido/a en Nochevieja antes de medianoche." },
  { pack: "holiday", cat: "mild", de: "…an einem Feiertag mit der Familie gestritten.", en: "…argued with family on a holiday.", es: "…discutí con la familia en un día festivo." },
  { pack: "holiday", cat: "mild", de: "…ein Weihnachtslied komplett falsch mitgesungen.", en: "…sung a Christmas carol completely wrong.", es: "…canté un villancico completamente mal." },
  { pack: "holiday", cat: "mild", de: "…an Silvester ein Feuerwerk verpasst, weil ich zu spät dran war.", en: "…missed the fireworks on New Year's because I was running late.", es: "…me perdí los fuegos artificiales de fin de año por llegar tarde." },
];
