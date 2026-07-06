import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { TRUTHS, DARES } from "./prompts";
import { usePlayerName } from "../../lib/usePlayerName";
import { useLanguage } from "../../lib/i18n/LanguageContext";

function Btn({ children, className = "", ...props }) {
  return (
    <button style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      className={`select-none ${className}`} {...props}>
      {children}
    </button>
  );
}
function pick(arr, excludeIdx = -1) {
  let i = Math.floor(Math.random() * arr.length);
  if (arr.length > 1) while (i === excludeIdx) i = Math.floor(Math.random() * arr.length);
  return i;
}

export default function WahrheitGame({ onExit }) {
  const { name: myName, setName } = usePlayerName();
  const { lang, t } = useLanguage();
  const [nameInput, setNameInput] = useState("");
  const [phase, setPhase] = useState("setup"); // setup | picking | choice | reveal
  const [players, setPlayers] = useState(() => [myName || ""]);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState(null); // truth | dare
  const [truthIdx, setTruthIdx] = useState(-1);
  const [dareIdx, setDareIdx] = useState(-1);
  const [sips, setSips] = useState({});
  const [spinName, setSpinName] = useState("");

  function addPlayer() { setPlayers(p => (p.length >= 12 ? p : [...p, ""])); }
  function updatePlayer(i, v) { setPlayers(p => p.map((x, idx) => (idx === i ? v : x))); }
  function removePlayer(i) { setPlayers(p => p.filter((_, idx) => idx !== i)); }

  function startGame() {
    const names = players.filter(Boolean);
    setSips(Object.fromEntries(names.map(n => [n, 0])));
    setPhase("picking");
    spinToPlayer(names);
  }

  function spinToPlayer(names = players.filter(Boolean)) {
    setMode(null); setPhase("picking");
    let ticks = 0;
    const maxTicks = 14;
    const interval = setInterval(() => {
      setSpinName(names[Math.floor(Math.random() * names.length)]);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        const chosen = names[Math.floor(Math.random() * names.length)];
        setCurrent(chosen);
        setSpinName(chosen);
        setTimeout(() => setPhase("choice"), 450);
      }
    }, 90);
  }

  function choose(m) {
    setMode(m);
    if (m === "truth") { const i = pick(TRUTHS, truthIdx); setTruthIdx(i); }
    else { const i = pick(DARES, dareIdx); setDareIdx(i); }
    setPhase("reveal");
  }

  function refuse() {
    setSips(s => ({ ...s, [current]: (s[current] || 0) + 1 }));
    spinToPlayer();
  }
  function done() {
    spinToPlayer();
  }

  const names = players.filter(Boolean);

  if (phase === "setup") {
    return (
      <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="mx-auto max-w-md space-y-4 relative z-10 p-5 pt-8">
          <Btn onClick={onExit} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black flex items-center gap-2"><Home size={16} />{t("wahrheit.overview")}</Btn>
          <div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-6 text-center">
            <div className="text-5xl">🎯</div>
            <h1 className="text-4xl font-black tracking-tight">{t("wahrheit.title")}</h1>
            <p className="text-sm text-white/60">{TRUTHS.length} {t("wahrheit.subtitle")} · {DARES.length} {t("wahrheit.dares.subtitle")}</p>

            {!myName && (
              <div className="rounded-[26px] bg-white/5 border border-white/10 p-4 space-y-3 text-left">
                <div className="text-center text-sm font-black text-white/70">{t("niemals.name.title")}</div>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder={t("hub.name.placeholder")}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none text-lg" />
                <Btn onClick={() => { setName(nameInput); setPlayers(p => (p[0] ? p : [nameInput])); }} disabled={!nameInput.trim()}
                  className="w-full rounded-[20px] py-3 font-black bg-white text-black disabled:opacity-40">{t("niemals.confirm")}</Btn>
              </div>
            )}

            <div className="space-y-3 text-left">
              <div className="text-lg font-black text-center">{t("wahrheit.players.title")}</div>
              {players.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input value={p} onChange={e => updatePlayer(i, e.target.value)} placeholder={`${t("niemals.player.placeholder")} ${i + 1}`}
                    className="flex-1 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 font-semibold text-center outline-none" />
                  {players.length > 1 && <Btn onClick={() => removePlayer(i)} className="px-3 rounded-[18px] bg-white/10">✕</Btn>}
                </div>
              ))}
              <Btn onClick={addPlayer} className="w-full rounded-[18px] py-3 font-black bg-white/5 border border-white/10 text-white/70">{t("niemals.add.player")}</Btn>
            </div>

            <Btn onClick={startGame} disabled={names.length < 2}
              className="w-full rounded-[26px] py-6 text-lg font-black bg-white text-black disabled:opacity-40">{t("wahrheit.start")}</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="mx-auto max-w-md space-y-4 relative z-10 p-5 pt-8">
        <Btn onClick={onExit} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black flex items-center gap-2"><Home size={16} />{t("wahrheit.overview")}</Btn>

        <div className="rounded-[30px] border border-white/10 bg-black/45 backdrop-blur-2xl p-3">
          <div className="grid grid-cols-2 gap-2">
            {names.map(n => (
              <div key={n} className={`rounded-2xl px-3 py-2 text-center text-sm font-bold ${n === current ? "bg-white/15 border border-white/25" : "bg-white/5"}`}>
                {n} <span className="text-white/40 text-xs">🥃{sips[n] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "picking" && (
            <motion.div key="picking" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="rounded-[36px] border-4 border-white/70 bg-zinc-950 p-10 text-center space-y-3">
              <div className="text-xs uppercase tracking-widest text-white/40 font-black">{t("wahrheit.picking")}</div>
              <div className="text-4xl font-black">{spinName}</div>
            </motion.div>
          )}

          {phase === "choice" && (
            <motion.div key="choice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-[36px] border-4 border-white/70 bg-zinc-950 p-8 text-center space-y-6">
              <div className="text-3xl font-black">{current}</div>
              <div className="grid grid-cols-2 gap-3">
                <Btn onClick={() => choose("truth")} className="rounded-[24px] py-8 font-black bg-white text-black text-lg">{t("wahrheit.truth")}</Btn>
                <Btn onClick={() => choose("dare")} className="rounded-[24px] py-8 font-black bg-white/10 border border-white/10 text-lg">{t("wahrheit.dare")}</Btn>
              </div>
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div key="reveal" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="rounded-[36px] border-4 border-white/70 bg-zinc-950 p-8 text-center space-y-6">
              <div className="text-xs uppercase tracking-widest text-white/40 font-black">{current} · {mode === "truth" ? t("wahrheit.truth") : t("wahrheit.dare")}</div>
              <div className="text-xl font-black leading-snug">{mode === "truth" ? TRUTHS[truthIdx][lang] : DARES[dareIdx][lang]}</div>
              <div className="grid grid-cols-2 gap-3">
                <Btn onClick={refuse} className="rounded-[22px] py-5 font-black bg-white/10 border border-white/10">{t("wahrheit.refuse")}</Btn>
                <Btn onClick={done} className="rounded-[22px] py-5 font-black bg-white text-black">{t("wahrheit.done")}</Btn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
