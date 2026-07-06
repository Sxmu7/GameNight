"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Lang } from "@/lib/data/types";
import { t as translate } from "./dictionaries";

interface AppStateContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  gentleMode: boolean;
  setGentleMode: (v: boolean) => void;
  t: (key: string) => string;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

const LANG_KEY = "partyround.lang";
const GENTLE_KEY = "partyround.gentleMode";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  const [gentleMode, setGentleModeState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedLang = window.localStorage.getItem(LANG_KEY) as Lang | null;
    const storedGentle = window.localStorage.getItem(GENTLE_KEY);
    if (storedLang === "de" || storedLang === "en" || storedLang === "es") {
      setLangState(storedLang);
    }
    if (storedGentle === "true") {
      setGentleModeState(true);
    }
    setHydrated(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(LANG_KEY, l);
  };

  const setGentleMode = (v: boolean) => {
    setGentleModeState(v);
    window.localStorage.setItem(GENTLE_KEY, String(v));
  };

  const value = useMemo<AppStateContextValue>(
    () => ({
      lang,
      setLang,
      gentleMode,
      setGentleMode,
      t: (key: string) => translate(lang, key),
    }),
    [lang, gentleMode]
  );

  if (!hydrated) {
    return null;
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
