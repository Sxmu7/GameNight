import { db } from "../firebase";
import { ref, set, get, onValue, off, remove } from "firebase/database";

// Generalized version of ANLEGEN's Firebase room system, namespaced per game
// (rooms/<gameKey>/<code>) so every online-capable game in the app can run
// its own live lobby on the same Firebase Realtime Database project.

export function genRoomCode(prefix = "RND") {
  return `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms)),
  ]);
}

export async function createRoom(gameKey, code, hostId, hostName) {
  try {
    await set(ref(db, `rooms/${gameKey}/${code}`), {
      status: "lobby",
      hostId,
      createdAt: Date.now(),
      stateJson: null,
      lobby: { [hostId]: { name: hostName, joinedAt: Date.now() } },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.code || e.message || String(e) };
  }
}

export async function roomExists(gameKey, code) {
  try {
    const snap = await withTimeout(get(ref(db, `rooms/${gameKey}/${code}`)), 6000);
    return { ok: snap.exists() };
  } catch (e) {
    return { ok: false, error: e.code || e.message || String(e) };
  }
}

export async function joinLobby(gameKey, code, pid, name) {
  try {
    await set(ref(db, `rooms/${gameKey}/${code}/lobby/${pid}`), { name, joinedAt: Date.now() });
  } catch (e) {
    console.error(e);
  }
}

export async function leaveLobby(gameKey, code, pid) {
  try {
    await remove(ref(db, `rooms/${gameKey}/${code}/lobby/${pid}`));
  } catch {}
}

export async function startRoomGame(gameKey, code, state) {
  try {
    await set(ref(db, `rooms/${gameKey}/${code}/status`), "game");
    await set(ref(db, `rooms/${gameKey}/${code}/stateJson`), JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

export async function writeRoomState(gameKey, code, state) {
  try {
    await set(ref(db, `rooms/${gameKey}/${code}/stateJson`), JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

export async function writeRoomEvent(gameKey, code, event) {
  try {
    await set(ref(db, `rooms/${gameKey}/${code}/event`), event);
  } catch (e) {
    console.error(e);
  }
}

// Subscribes to lobby/state/status/event changes for a room. Returns an
// unsubscribe function. Callbacks are optional.
export function subscribeRoom(gameKey, code, { onLobby, onState, onStatus, onEvent }) {
  const lobbyRef = ref(db, `rooms/${gameKey}/${code}/lobby`);
  const stateRef = ref(db, `rooms/${gameKey}/${code}/stateJson`);
  const statusRef = ref(db, `rooms/${gameKey}/${code}/status`);
  const eventRef = ref(db, `rooms/${gameKey}/${code}/event`);

  if (onLobby) onValue(lobbyRef, (snap) => {
    const d = snap.val() || {};
    onLobby(Object.entries(d).map(([id, v]) => ({ id, name: v.name })));
  });
  if (onState) onValue(stateRef, (snap) => {
    const j = snap.val();
    if (!j) return;
    try { onState(JSON.parse(j)); } catch (e) { console.error(e); }
  });
  if (onStatus) onValue(statusRef, (snap) => onStatus(snap.val() || "lobby"));
  if (onEvent) onValue(eventRef, (snap) => { if (snap.val()) onEvent(snap.val()); });

  return () => {
    off(lobbyRef); off(stateRef); off(statusRef); off(eventRef);
  };
}
