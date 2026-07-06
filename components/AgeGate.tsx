"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "@/lib/i18n/LanguageProvider";

const AGE_KEY = "partyround.ageConfirmed";

export default function AgeGate() {
  const { t, gentleMode, setGentleMode } = useAppState();
  const [confirmed, setConfirmed] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(AGE_KEY);
    setConfirmed(stored === "true");
  }, []);

  const confirm = () => {
    window.localStorage.setItem(AGE_KEY, "true");
    setConfirmed(true);
  };

  return (
    <AnimatePresence>
      {!confirmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="card w-full max-w-sm p-6"
          >
            <span className="text-3xl">🔞</span>
            <h2 className="text-lg font-bold mt-3">{t("ageGate.title")}</h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">{t("ageGate.body")}</p>

            <label className="flex items-center gap-2 mt-4 text-xs text-muted">
              <input
                type="checkbox"
                checked={gentleMode}
                onChange={(e) => setGentleMode(e.target.checked)}
                className="accent-accent"
              />
              {t("ageGate.gentle_mode")}
            </label>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={confirm}
              className="btn-primary w-full rounded-xl2 py-3 mt-5 font-bold"
            >
              {t("ageGate.confirm")}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
