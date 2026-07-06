"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { useAppState } from "@/lib/i18n/LanguageProvider";
import { useStats } from "@/lib/stats/useStats";
import { getGame } from "@/lib/data/games";

export default function StatsPage() {
  const { lang, t } = useAppState();
  const { stats, hydrated, reset, favoriteGameId } = useStats();

  const favoriteGame = favoriteGameId ? getGame(favoriteGameId) : undefined;
  const hasData = hydrated && stats.gamesPlayedCount > 0;

  return (
    <PageTransition>
      <div className="space-y-5">
        <h1 className="text-xl font-bold">{t("stats.title")}</h1>

        {!hasData ? (
          <div className="card p-6 text-center text-sm text-muted">{t("stats.none_yet")}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
                <p className="text-[10px] text-muted uppercase tracking-wide">{t("stats.sessions")}</p>
                <p className="text-2xl font-extrabold mt-1">{stats.sessionsCount}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="card p-4"
              >
                <p className="text-[10px] text-muted uppercase tracking-wide">{t("stats.games_played")}</p>
                <p className="text-2xl font-extrabold mt-1">{stats.gamesPlayedCount}</p>
              </motion.div>
            </div>

            {favoriteGame && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-4"
              >
                <p className="text-[10px] text-muted uppercase tracking-wide">{t("stats.favorite")}</p>
                <p className="text-lg font-bold mt-1">{favoriteGame.translations[lang].name}</p>
              </motion.div>
            )}

            <div className="space-y-2">
              {stats.history.slice(0, 8).map((h, i) => {
                const g = getGame(h.gameId);
                if (!g) return null;
                return (
                  <motion.div
                    key={`${h.gameId}-${h.timestamp}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between text-xs text-muted border-b border-line py-2"
                  >
                    <span className="text-white">{g.translations[lang].name}</span>
                    <span>{new Date(h.timestamp).toLocaleDateString()}</span>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        <button onClick={reset} className="btn-ghost w-full rounded-xl2 py-2.5 text-xs text-muted">
          {t("stats.reset")}
        </button>
      </div>
    </PageTransition>
  );
}
