# PartyRound

Kategorisierter Trinkspiel-Katalog als Next.js-App (App Router, TypeScript, Tailwind, Framer Motion).

## Features
- Sprachumschaltung DE (Standard) / EN / ES, jederzeit live umstellbar, pro Nutzer in `localStorage` gespeichert
- Kategorisierter Spiele-Katalog mit echten Ankerspielen + Platzhalter-Einträgen nach einheitlichem Schema
- Online-Lobby, die automatisch nur `onlineCapable`-Spiele anzeigt
- Lokales Stats-Tracking (Sessions, gespielte Spiele, Lieblingsspiel, Verlauf)
- Sanfter Modus (alkoholfrei) + 18+ Hinweis-Gate beim ersten Start
- Mobile-first UI mit Framer-Motion-Animationen (Seitenübergänge, Sprach-Pill, Zufallsspiel-Shuffle)

## Entwicklung

```bash
npm install
npm run dev
```

## Struktur
- `app/` – Routen (Home, Kategorie, Spiel-Detail, Online, Stats)
- `components/` – UI-Bausteine
- `lib/data/games.ts` – Spiele-Katalog (Datenquelle für alles)
- `lib/i18n/` – Übersetzungen + Sprachkontext
- `lib/stats/` – LocalStorage-Statistik-Hook

## Nächste Schritte
- Design-Feinabstimmung an eine bestehende Vorlage anpassen, sobald diese verfügbar ist
- Echte Online-Verbindung (WebSocket/Realtime) statt Mock-Lobby
- Weitere Platzhalter-Spiele mit echten Regeltexten befüllen
