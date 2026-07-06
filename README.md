# ANLEGEN — Game Night

Vite + React + Tailwind + Framer Motion + Firebase Realtime Database.

## Enthalten

- **Intro:** animiertes, nachgebautes "GAME NIGHT"-Logo (SVG, kein Platzhalter) als Splash-Screen.
- **Hub / Landing Page:** merkt den Spielernamen dauerhaft auf dem Gerät (`localStorage`), zeigt eine saubere Spielauswahl.
- **ANLEGEN:** vollständiges Höher/Tiefer/Gleich-Kartenspiel — Klassisch- und Party-Modi (Hardcore, Speed, Chaos, Teams, Last Man, Random, Storage, Turm), Extreme-Deck, Getränke-Auswahl, echte Firebase-Online-Lobby mit Raumcode/QR, Bluetooth-Lokal-Lobby, Regeln & Statistik-Screens.
- **Ich hab noch nie:** 30 kuratierte Karten (Mild/Spicy), lokal oder online über eine eigene Firebase-Lobby.
- **Wahrheit oder Pflicht:** 15 echte Wahrheitsfragen, 15 echte Aufgaben, Zufallsauswahl des Spielers.

Alle drei Spiele sind vollständig spielbar — keine "Platzhalter"-Karten mehr.

## Lokal starten

```bash
npm install
npm run dev
```

## Deployen (Vercel)

Framework Preset: **Vite** · Build Command: `npm run build` · Output Directory: `dist`

```bash
npm install
vercel deploy --prod
```

## Struktur

- `src/App.jsx` — Intro → Hub → Spielauswahl
- `src/games/anlegen/` — vollständiges ANLEGEN-Kartenspiel
- `src/games/niemals/` — "Ich hab noch nie" mit echtem Karten-Deck
- `src/games/wahrheit/` — "Wahrheit oder Pflicht" mit echten Fragen/Aufgaben
- `src/lib/onlineRoom.js` — gemeinsame Firebase-Lobby-Infrastruktur (Raumcode erstellen/beitreten/synchronisieren), von allen Online-Spielen genutzt
- `src/lib/usePlayerName.js` — geräteweite Namensspeicherung
- `src/components/GameNightLogo.jsx` + `IntroScreen.jsx` — animiertes Logo

## Hinweis zu alten Next.js-Dateien

Der erste Entwurf (Next.js, "PartyRound") liegt noch als totes Restmaterial im selben Ordner
(`app/`, `components/*.tsx`, `lib/data`, `next.config.mjs`, `tsconfig.json` u. a.) — er wird von
diesem Vite-Projekt nicht mehr verwendet. Ohne Shell-Zugriff konnten diese Dateien nicht automatisch
gelöscht werden; sie können manuell entfernt werden.
