import { useState } from "react";
import { motion } from "framer-motion";
import GameNightLogo from "./GameNightLogo";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { usePlayerName } from "../lib/usePlayerName";

export default function NameGate({ onDone }) {
  const { t } = useLanguage();
  const { setName } = usePlayerName();
  const [input, setInput] = useState("");

  function confirm() {
    if (!input.trim()) return;
    setName(input);
    onDone();
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative z-10 w-full max-w-sm rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-7 text-center space-y-5"
      >
        <div className="flex justify-center">
          <GameNightLogo size={96} animated={false} />
        </div>
        <div>
          <h1 className="text-2xl font-black">{t("namegate.title")}</h1>
          <p className="text-sm text-white/50 mt-1">{t("namegate.subtitle")}</p>
        </div>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          placeholder={t("namegate.placeholder")}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-white font-black outline-none text-lg"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={confirm}
          disabled={!input.trim()}
          className="w-full rounded-[24px] py-4 font-black bg-white text-black disabled:opacity-40"
        >
          {t("namegate.confirm")}
        </motion.button>
      </motion.div>
    </div>
  );
}
