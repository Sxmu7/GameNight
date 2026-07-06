"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Game } from "@/lib/data/types";
import { useAppState } from "@/lib/i18n/LanguageProvider";

const intensityColor = (level: number) => {
  if (level <= 1) return "bg-good";
  if (level <= 2) return "bg-good";
  if (level === 3) return "bg-yellow-400";
  if (level === 4) return "bg-accent";
  return "bg-red-500";
};

export default function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const { lang, t } = useAppState();
  const tr = game.translations[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={`/spiel/${game.id}`} className="card block p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[15px] truncate">{tr.name}</h3>
              {game.isPlaceholder && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface2 border border-line text-muted">
                  {t("game.placeholder.badge")}
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-1 line-clamp-2">{tr.rule}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`intensity-dot ${i < game.intensity ? intensityColor(game.intensity) : "bg-line"}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted">
              {game.minPlayers}–{game.maxPlayers} {t("game.players").toLowerCase()}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              game.onlineCapable
                ? "border-good/50 text-good bg-good/10"
                : "border-line text-muted"
            }`}
          >
            {game.onlineCapable ? t("game.online.yes") : t("game.online.no")}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-line text-muted">
            {t(`duration.${game.duration}`)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
