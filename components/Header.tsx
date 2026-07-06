"use client";

import { motion } from "framer-motion";
import { useAppState } from "@/lib/i18n/LanguageProvider";
import { Lang } from "@/lib/data/types";

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "de", flag: "🇩🇪", label: "DE" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "es", flag: "🇪🇸", label: "ES" },
];

export default function Header() {
  const { lang, setLang, t, gentleMode, setGentleMode } = useAppState();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-bg/80 border-b border-line">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col leading-tight"
        >
          <span className="font-extrabold text-lg tracking-tight">{t("app.name")}</span>
          <span className="text-[11px] text-muted">{t("app.tagline")}</span>
        </motion.div>

        <div className="flex items-center gap-2">
          <button
            aria-label={t("gentle.toggle")}
            onClick={() => setGentleMode(!gentleMode)}
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm border transition-colors ${
              gentleMode ? "bg-good/20 border-good text-good" : "border-line text-muted"
            }`}
          >
            🌱
          </button>

          <div className="flex rounded-full border border-line overflow-hidden">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 text-xs font-semibold transition-colors relative ${
                  lang === l.code ? "text-bg" : "text-muted"
                }`}
              >
                {lang === l.code && (
                  <motion.span
                    layoutId="lang-pill"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
