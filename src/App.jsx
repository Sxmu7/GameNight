import { useState } from "react";
import { motion } from "framer-motion";
import IntroScreen from "./components/IntroScreen";
import OnboardingScreens, { hasSeenOnboarding } from "./components/OnboardingScreens";
import NameGate from "./components/NameGate";
import GameNightLogo from "./components/GameNightLogo";
import { usePlayerName } from "./lib/usePlayerName";
import { LanguageProvider, useLanguage, LANGS } from "./lib/i18n/LanguageContext";
import AnlegenGame from "./games/anlegen/AnlegenGame";
import NiemalsGame from "./games/niemals/NiemalsGame";
import WahrheitGame from "./games/wahrheit/WahrheitGame";
import { NIEMALS_PROMPTS } from "./games/niemals/prompts";
import { TRUTHS, DARES } from "./games/wahrheit/prompts";

const NAME_KEY = "anlegen_pname";

const GAMES = [
  { id: "anlegen", emoji: "🂡", online: true, key: "anlegen" },
  { id: "niemals", emoji: "🥴", online: true, key: "niemals" },
  { id: "wahrheit", emoji: "🎯", online: false, key: "wahrheit" },
];

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex rounded-full border border-white/10 overflow-hidden self-center">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1.5 text-sm transition-colors ${lang === l.code ? "bg-white" : "bg-transparent"}`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}

function Hub({ onSelect, onChangeName }) {
  const { t } = useLanguage();
  const { name } = usePlayerName();

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.10),transparent_45%)]" />
      <div className="mx-auto max-w-md min-h-full flex flex-col gap-6 relative z-10 p-5 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-3">
          <GameNightLogo size={128} animated={false} />
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/40">{t("hub.tagline")}</p>
          <LanguageSwitcher />
        </motion.div>

        {/* Name — already collected before the hub, just shown here */}
        <div className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-2xl p-4 flex items-center justify-between">
          <div className="text-sm text-white/60">{t("hub.name.label")}</div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">{name}</span>
            <button onClick={onChangeName} className="text-xs text-white/30 underline">{t("hub.name.change")}</button>
          </div>
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
              onClick={() => onSelect(g.id)}
              className="w-full text-left rounded-[30px] border border-white/10 bg-black/45 backdrop-blur-2xl p-5 flex items-center gap-4"
            >
              <div className="text-4xl">{g.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-lg">{t(`${g.key}.title`)}</span>
                  {g.online && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-black uppercase tracking-wide">{t("hub.online.badge")}</span>
                  )}
                </div>
                <div className="text-xs text-white/50">
                  {g.id === "niemals" && `${NIEMALS_PROMPTS.length} `}
                  {g.id === "wahrheit" && `${TRUTHS.length} ${t("wahrheit.subtitle")} · ${DARES.length} ${t("wahrheit.dares.subtitle")}`}
                  {g.key !== "wahrheit" && t(`${g.key}.subtitle`)}
                </div>
                <div className="text-xs text-white/40 mt-1 leading-snug">{t(`${g.key}.desc`)}</div>
              </div>
              <div className="text-white/30 text-xl">›</div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-[11px] text-white/30 pt-2">{t("hub.footer")}</p>
      </div>
    </div>
  );
}

function AppInner() {
  const [introDone, setIntroDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(hasSeenOnboarding);
  const [nameConfirmed, setNameConfirmed] = useState(() => !!localStorage.getItem(NAME_KEY));
  const [activeGame, setActiveGame] = useState(null);

  // Order: animated logo intro -> (first run only) animated explainer ->
  // name gate (blocks until a name is saved) -> hub / game picker.
  if (!introDone) return <IntroScreen onDone={() => setIntroDone(true)} />;
  if (!onboardingDone) return <OnboardingScreens onDone={() => setOnboardingDone(true)} />;
  if (!nameConfirmed) return <NameGate onDone={() => setNameConfirmed(true)} />;

  if (activeGame === "anlegen") return <AnlegenGame onExit={() => setActiveGame(null)} />;
  if (activeGame === "niemals") return <NiemalsGame onExit={() => setActiveGame(null)} />;
  if (activeGame === "wahrheit") return <WahrheitGame onExit={() => setActiveGame(null)} />;

  return <Hub onSelect={setActiveGame} onChangeName={() => setNameConfirmed(false)} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
