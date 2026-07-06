"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { getGame, getCategory } from "@/lib/data/games";
import { useAppState } from "@/lib/i18n/LanguageProvider";
import { useStats } from "@/lib/stats/useStats";

export default function GamePage({ params }: { params: { id: string } }) {
  const { lang, t, gentleMode } = useAppState();
  const { logGame } = useStats();
  const router = useRouter();
  const [logged, setLogged] = useState(false);

  const game = getGame(params.id);
  if (!game) return notFound();
  const category = getCategory(game.categoryId);
  const tr = game.translations[lang];

  const handleLog = () => {
    logGame(game.id);
    setLogged(true);
    setTimeout(() => setLogged(false), 1600);
  };

  return (
    <PageTransition>
      <div className="space-y-5">
        <Link href={category ? `/kategorie/${category.id}` : "/"} className="text-xs text-muted">
          ← {t("game.back")}
        </Link>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold leading-tight">{tr.name}</h1>
            {game.isPlaceholder && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 border border-line text-muted">
                {t("game.placeholder.badge")}
              </span>
            )}
          </div>
          {category && (
            <p className="text-xs text-muted mt-1">
              {category.icon} {category.name[lang]}
            </p>
          )}
        </div>

        <div className="card p-4">
          <p className="text-sm leading-relaxed">
            {gentleMode
              ? tr.rule.replace(/trink\w*|drink\w*|beb\w*|Schluck\w*|sip\w*|trago\w*/gi, "sammelst du einen Punkt")
              : tr.rule}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label={t("game.players")} value={`${game.minPlayers}–${game.maxPlayers}`} />
          <Stat label={t("game.duration")} value={t(`duration.${game.duration}`)} />
          <Stat label={t("game.intensity")} value={"●".repeat(game.intensity) + "○".repeat(5 - game.intensity)} />
          <Stat label={t("game.equipment")} value={game.equipment.join(", ")} />
        </div>

        <div
          className={`text-xs rounded-xl2 p-3 border ${
            game.onlineCapable ? "border-good/40 bg-good/5 text-good" : "border-line text-muted"
          }`}
        >
          {game.onlineCapable ? "📡 " : "🚫 "}
          {game.onlineReason[lang]}
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleLog}
          className="btn-primary w-full rounded-xl2 py-3 font-bold"
        >
          {t("stats.log_game")}
        </motion.button>

        <AnimatePresence>
          {logged && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-good text-bg text-xs font-semibold px-4 py-2 rounded-full shadow-lg"
            >
              ✓ {tr.name}
            </motion.div>
          )}
        </AnimatePresence>

        {game.onlineCapable && (
          <button
            onClick={() => router.push("/online")}
            className="btn-ghost w-full rounded-xl2 py-3 text-sm"
          >
            {t("online.title")} →
          </button>
        )}
      </div>
    </PageTransition>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3">
      <p className="text-[10px] text-muted uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}
