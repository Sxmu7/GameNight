"use client";

import { useCallback, useEffect, useState } from "react";

export interface StatsData {
  sessionsCount: number;
  gamesPlayedCount: number;
  playCounts: Record<string, number>;
  history: { gameId: string; timestamp: number }[];
}

const STATS_KEY = "partyround.stats";

const emptyStats: StatsData = {
  sessionsCount: 0,
  gamesPlayedCount: 0,
  playCounts: {},
  history: [],
};

function loadStats(): StatsData {
  if (typeof window === "undefined") return emptyStats;
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return emptyStats;
    return { ...emptyStats, ...JSON.parse(raw) };
  } catch {
    return emptyStats;
  }
}

function saveStats(data: StatsData) {
  window.localStorage.setItem(STATS_KEY, JSON.stringify(data));
}

export function useStats() {
  const [stats, setStats] = useState<StatsData>(emptyStats);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStats(loadStats());
    setHydrated(true);
  }, []);

  const logGame = useCallback((gameId: string) => {
    setStats((prev) => {
      const next: StatsData = {
        ...prev,
        gamesPlayedCount: prev.gamesPlayedCount + 1,
        playCounts: {
          ...prev.playCounts,
          [gameId]: (prev.playCounts[gameId] ?? 0) + 1,
        },
        history: [{ gameId, timestamp: Date.now() }, ...prev.history].slice(0, 50),
      };
      saveStats(next);
      return next;
    });
  }, []);

  const startSession = useCallback(() => {
    setStats((prev) => {
      const next: StatsData = { ...prev, sessionsCount: prev.sessionsCount + 1 };
      saveStats(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStats(emptyStats);
    saveStats(emptyStats);
  }, []);

  const favoriteGameId = Object.entries(stats.playCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return { stats, hydrated, logGame, startSession, reset, favoriteGameId };
}
