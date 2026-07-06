"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GameCard from "@/components/GameCard";
import { onlineGames } from "@/lib/data/games";
import { useAppState } from "@/lib/i18n/LanguageProvider";

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function OnlinePage() {
  const { t } = useAppState();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [joinInput, setJoinInput] = useState("");
  const games = onlineGames();

  return (
    <PageTransition>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold">{t("online.title")}</h1>
          <p className="text-xs text-muted mt-1">{t("online.subtitle")}</p>
        </div>

        <div className="card p-4 space-y-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setRoomCode(generateCode())}
            className="btn-primary w-full rounded-xl2 py-3 font-bold"
          >
            {t("online.create")}
          </motion.button>

          {roomCode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <p className="text-[11px] text-muted">{t("online.code.label")}</p>
              <p className="text-3xl font-extrabold tracking-widest text-accent">{roomCode}</p>
            </motion.div>
          )}

          <div className="flex gap-2">
            <input
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              placeholder={t("online.code.label")}
              maxLength={4}
              className="flex-1 bg-surface2 border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button className="btn-ghost rounded-xl px-4 text-sm font-semibold">{t("online.join")}</button>
          </div>

          <p className="text-[11px] text-muted text-center pt-1">{t("online.mock.note")}</p>
        </div>

        <div className="space-y-3">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
