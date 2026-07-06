"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { games } from "@/lib/data/games";
import { useAppState } from "@/lib/i18n/LanguageProvider";

export default function RandomButton() {
  const { t, lang } = useAppState();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const handleClick = () => {
    if (spinning) return;
    setSpinning(true);

    let ticks = 0;
    const maxTicks = 10;
    const interval = setInterval(() => {
      const random = games[Math.floor(Math.random() * games.length)];
      setPreviewName(random.translations[lang].name);
      ticks += 1;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalGame = games[Math.floor(Math.random() * games.length)];
        setPreviewName(finalGame.translations[lang].name);
        setTimeout(() => {
          router.push(`/spiel/${finalGame.id}`);
          setSpinning(false);
          setPreviewName(null);
        }, 500);
      }
    }, 90);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      className="btn-primary w-full rounded-xl2 px-5 py-5 flex items-center justify-between shadow-lg shadow-accent/20"
    >
      <div className="text-left">
        <p className="font-extrabold text-lg leading-tight">{t("home.random.title")}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={previewName ?? "idle"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="text-xs font-medium opacity-80"
          >
            {previewName ?? t("home.random.subtitle")}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.span
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
        className="text-3xl"
      >
        🎲
      </motion.span>
    </motion.button>
  );
}
