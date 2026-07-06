import { useState, useCallback } from "react";

const NAME_KEY = "anlegen_pname";

// Shared across every game in the app: the device remembers the player's
// name once entered, so it never has to be typed again.
export function usePlayerName() {
  const [name, setNameState] = useState(() => localStorage.getItem(NAME_KEY) || "");

  const setName = useCallback((n) => {
    const trimmed = n.trim();
    if (!trimmed) return;
    localStorage.setItem(NAME_KEY, trimmed);
    setNameState(trimmed);
  }, []);

  const clearName = useCallback(() => {
    localStorage.removeItem(NAME_KEY);
    setNameState("");
  }, []);

  return { name, setName, clearName };
}

export function getOrCreatePlayerId() {
  // sessionStorage = einzigartig pro Browser-Tab/Fenster, damit mehrere Tabs
  // im selben Browser als unterschiedliche Spieler erkannt werden.
  let id = sessionStorage.getItem("anlegen_pid");
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    sessionStorage.setItem("anlegen_pid", id);
  }
  return id;
}
