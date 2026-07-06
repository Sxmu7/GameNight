import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroScreen from "./components/IntroScreen";
import GameNightLogo from "./components/GameNightLogo";
import { usePlayerName } from "./lib/usePlayerName";
import AnlegenGame from "./games/anlegen/AnlegenGame";
import NiemalsGame from "./games/niemals/NiemalsGame";
import WahrheitGame from "./games/wahrheit/WahrheitGame";

const GAMES = [
  {
    id: "anlegen",
    title: "ANLEGEN",
    subtitle: "Höher · Tiefer · Gleich",
    emoji: "🂡",
    online: true,
    desc: "Das große Kartenspiel mit Party-Modi, Extreme-Deck und Live-Online-Lobby.",
  },
  {
    id: "niemals",
    title: "Ich hab noch nie",
    subtitle: "30 echte Karten",
    emoji: "🥴",
    online: true,
    desc: "Klassiker mit kuratierten Mild- & Spicy-Prompts, lokal oder online.",
  },
  {
    id: "wahrheit",
    title: "Wahrheit oder Pflicht",
    subtitle: "15 Wahrheiten · 15 Aufgaben",
    emoji: "🎯",
    online: false,
    desc: "Zufälliger Spieler, echte Fragen & Aufgaben, verweigern kostet einen Schluck.",
  },
];

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const { name, setName, clearName } = usePlayerName();
  const [nameInput, setNameInput] = useState("");

  if (!introDone) return <IntroScreen onDone={() => setIntroDone(true)} />;

  if (activeGame === "anlegen") return <AnlegenGame onExit={() => setActiveGame(null)} />;
  if (activeGame === "niemals") return <NiemalsGame onExit={() => setActiveGame(null)} />;
  if (activeGame === "wahrheit") return <WahrheitGame onExit={() => setActiveGame(null)} />;

  // ── Clean landing / hub ────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.10),transparent_45%)]" />
      <div className="mx-auto max-w-md min-h-full flex flex-col gap-6 relative z-10 p-5 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-3">
          <GameNightLogo size={128} animated={false} />
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/40">Wähl dein Spiel</p>
        </motion.div>

        {/* Name — remembered on this device */}
        <div className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-2xl p-4">
          {name ? (
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">Angemeldet als</div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg">{name}</span>
                <button onClick={clearName} className="text-xs text-white/30 underline">ändern</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Dein Name…"
                onKeyDown={e => e.key === "Enter" && setName(nameInput)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-bold outline-none" />
              <button onClick={() => setName(nameInput)} disabled={!nameInput.trim()}
                className="rounded-2xl px-5 font-black bg-white text-black disabled:opacity-40">Merken</button>
            </div>
          )}
        </div>

        {/* Game picker */}
        <div className="space-y-3">
          {GAMES.map((g, i) => (
            <motion.button
              key={g.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, type: "spring", stiffness: 220, damping: 20 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveGame(g.id)}
              className="w-full text-left rounded-[30px] border border-white/10 bg-black/45 backdrop-blur-2xl p-5 flex items-center gap-4"
            >
              <div className="text-4xl">{g.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-lg">{g.title}</span>
                  {g.online && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-black uppercase tracking-wide">Online</span>
                  )}
                </div>
                <div className="text-xs text-white/50">{g.subtitle}</div>
                <div className="text-xs text-white/40 mt-1 leading-snug">{g.desc}</div>
              </div>
              <div className="text-white/30 text-xl">›</div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/30 pt-2">Bitte trinke verantwortungsvoll.</p>
      </div>
    </div>
  );
}
