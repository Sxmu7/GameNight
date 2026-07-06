import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../lib/i18n/LanguageContext";

const SLIDES = [
  { emoji: "🎉", key: "1" },
  { emoji: "🂡🥴🎯", key: "2" },
  { emoji: "📡", key: "3" },
  { emoji: "🌐", key: "4" },
];

const ONBOARD_KEY = "gamenight_onboarded";

export function hasSeenOnboarding() {
  return localStorage.getItem(ONBOARD_KEY) === "true";
}

export default function OnboardingScreens({ onDone }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const isLast = step === SLIDES.length - 1;

  function finish() {
    localStorage.setItem(ONBOARD_KEY, "true");
    onDone();
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_50%)]" />

      <button onClick={finish} className="absolute top-6 right-5 z-20 text-xs font-black uppercase tracking-widest text-white/40">
        {t("onboarding.skip")}
      </button>

      <div className="flex-1 flex items-center justify-center relative z-10 px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-sm text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
              className="text-6xl"
            >
              {SLIDES[step].emoji}
            </motion.div>
            <h1 className="text-2xl font-black leading-tight">{t(`onboarding.${SLIDES[step].key}.title`)}</h1>
            <p className="text-sm text-white/60 leading-relaxed">{t(`onboarding.${SLIDES[step].key}.text`)}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 px-8 pb-10 space-y-5">
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-white"
              animate={{ width: i === step ? 28 : 8, opacity: i === step ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          className="w-full rounded-[26px] py-5 text-lg font-black bg-white text-black"
        >
          {isLast ? t("onboarding.start") : t("onboarding.next")}
        </motion.button>
      </div>
    </div>
  );
}
