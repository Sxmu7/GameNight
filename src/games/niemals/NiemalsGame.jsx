import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Wifi, Shuffle } from "lucide-react";
import { NIEMALS_PROMPTS } from "./prompts";
import { usePlayerName, getOrCreatePlayerId } from "../../lib/usePlayerName";
import {
  genRoomCode, createRoom, roomExists, joinLobby, leaveLobby,
  startRoomGame, writeRoomState, subscribeRoom,
} from "../../lib/onlineRoom";

const GAME_KEY = "niemals";

function Btn({ children, className = "", ...props }) {
  return (
    <button style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
      className={`select-none ${className}`} {...props}>
      {children}
    </button>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function NiemalsGame({ onExit }) {
  const { name: myName, setName } = usePlayerName();
  const [playerId] = useState(getOrCreatePlayerId);
  const [nameInput, setNameInput] = useState("");

  const [phase, setPhase] = useState("setup"); // setup | online-lobby | play
  const [includeSpicy, setIncludeSpicy] = useState(true);
  const [players, setPlayers] = useState(() => [myName || ""]);
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [sips, setSips] = useState({});
  const [direction, setDirection] = useState(1);

  // ── Online ────────────────────────────────────────────────────────────
  const [online, setOnline] = useState(false);
  const [room, setRoom] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [lobby, setLobby] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [joinErr, setJoinErr] = useState("");
  const [joining, setJoining] = useState(false);
  const unsubRef = useRef(null);

  const buildDeck = () => shuffle(NIEMALS_PROMPTS.filter(p => includeSpicy || p.cat === "mild"));

  function addPlayer() { setPlayers(p => (p.length >= 12 ? p : [...p, ""])); }
  function updatePlayer(i, v) { setPlayers(p => p.map((x, idx) => (idx === i ? v : x))); }
  function removePlayer(i) { setPlayers(p => p.filter((_, idx) => idx !== i)); }

  function startLocal() {
    const d = buildDeck();
    setDeck(d); setIndex(0);
    setSips(Object.fromEntries(players.filter(Boolean).map(n => [n, 0])));
    setPhase("play");
  }

  async function handleCreateOnline() {
    if (!myName.trim()) return;
    const code = genRoomCode("NIE");
    setRoom(code); setIsHost(true); setOnline(true); setPhase("online-lobby");
    await createRoom(GAME_KEY, code, playerId, myName);
  }
  async function handleJoinOnline() {
    const code = joinCode.trim().toUpperCase();
    if (!code || !myName.trim()) return;
    setJoining(true); setJoinErr("");
    const res = await roomExists(GAME_KEY, code);
    if (!res.ok) { setJoinErr("Raum nicht gefunden."); setJoining(false); return; }
    await joinLobby(GAME_KEY, code, playerId, myName);
    setRoom(code); setIsHost(false); setOnline(true); setPhase("online-lobby");
    setJoining(false);
  }
  async function handleStartOnlineGame() {
    const d = buildDeck();
    const names = lobby.map(p => p.name);
    const state = { deck: d, index: 0, sips: Object.fromEntries(names.map(n => [n, 0])) };
    setDeck(d); setIndex(0); setSips(state.sips);
    setPhase("play");
    await startRoomGame(GAME_KEY, room, state);
  }

  useEffect(() => {
    if (!online || !room) return;
    unsubRef.current = subscribeRoom(GAME_KEY, room, {
      onLobby: setLobby,
      onState: (s) => { setDeck(s.deck); setIndex(s.index); setSips(s.sips); },
      onStatus: (s) => { if (s === "game") setPhase("play"); },
    });
    return () => unsubRef.current?.();
  }, [online, room]);

  async function syncState(ov = {}) {
    if (!online) return;
    await writeRoomState(GAME_KEY, room, { deck, index, sips, ...ov });
  }

  function next() {
    setDirection(1);
    const ni = Math.min(index + 1, deck.length - 1);
    setIndex(ni);
    if (online && isHost) syncState({ index: ni });
  }
  function markDrunk(name) {
    const ns = { ...sips, [name]: (sips[name] || 0) + 1 };
    setSips(ns);
    if (online) syncState({ sips: ns });
  }

  const card = deck[index];
  const allNames = online ? lobby.map(p => p.name) : players.filter(Boolean);

  // ════════════════════════════ SETUP ════════════════════════════
  if (phase === "setup") {
    return (
      <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="mx-auto max-w-md space-y-4 relative z-10 p-5 pt-8">
          <Btn onClick={onExit} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black flex items-center gap-2"><Home size={16} />Übersicht</Btn>

          <div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-6 text-center">
            <div className="text-5xl">🥴</div>
            <h1 className="text-4xl font-black tracking-tight">Ich hab noch nie</h1>
            <p className="text-sm text-white/60">Wer's getan hat, trinkt. {NIEMALS_PROMPTS.length} echte Karten, keine Platzhalter.</p>

            <div className="flex rounded-2xl border border-white/10 overflow-hidden">
              <Btn onClick={() => setIncludeSpicy(false)} className={`flex-1 py-3 text-sm font-black ${!includeSpicy ? "bg-white text-black" : "bg-white/5 text-white/60"}`}>Nur Mild</Btn>
              <Btn onClick={() => setIncludeSpicy(true)} className={`flex-1 py-3 text-sm font-black ${includeSpicy ? "bg-white text-black" : "bg-white/5 text-white/60"}`}>Mild + Spicy</Btn>
            </div>

            {!myName && (
              <div className="rounded-[26px] bg-white/5 border border-white/10 p-4 space-y-3 text-left">
                <div className="text-center text-sm font-black text-white/70">Dein Name (wird gemerkt)</div>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Name eingeben…"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none text-lg" />
                <Btn onClick={() => { setName(nameInput); setPlayers(p => (p[0] ? p : [nameInput])); }} disabled={!nameInput.trim()}
                  className="w-full rounded-[20px] py-3 font-black bg-white text-black disabled:opacity-40">Bestätigen</Btn>
              </div>
            )}

            <div className="space-y-3 text-left">
              <div className="text-lg font-black text-center">Lokal: Spieler</div>
              {players.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input value={p} onChange={e => updatePlayer(i, e.target.value)} placeholder={`Spieler ${i + 1}`}
                    className="flex-1 rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 font-semibold text-center outline-none" />
                  {players.length > 1 && <Btn onClick={() => removePlayer(i)} className="px-3 rounded-[18px] bg-white/10">✕</Btn>}
                </div>
              ))}
              <Btn onClick={addPlayer} className="w-full rounded-[18px] py-3 font-black bg-white/5 border border-white/10 text-white/70">+ Spieler</Btn>
            </div>

            <Btn onClick={startLocal} disabled={players.filter(Boolean).length < 2}
              className="w-full rounded-[26px] py-6 text-lg font-black bg-white text-black disabled:opacity-40">▶ Lokal starten</Btn>

            <div className="border-t border-white/10 pt-5 space-y-3">
              <div className="text-sm font-black text-white/60 flex items-center justify-center gap-2"><Wifi size={16} />Online (jeder auf eigenem Gerät)</div>
              <Btn onClick={handleCreateOnline} disabled={!myName.trim()} className="w-full rounded-[22px] py-4 font-black bg-white/10 border border-white/10 disabled:opacity-40">Raum erstellen</Btn>
              <div className="flex gap-2">
                <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="NIE-XXXX"
                  className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-center font-black tracking-widest outline-none" />
                <Btn onClick={handleJoinOnline} disabled={!myName.trim() || joining} className="px-5 rounded-2xl bg-white/10 border border-white/10 font-black disabled:opacity-40">
                  {joining ? "…" : "Beitreten"}
                </Btn>
              </div>
              {joinErr && <div className="text-red-300 text-sm font-bold">{joinErr}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════ ONLINE LOBBY ════════════════════════════
  if (phase === "online-lobby") {
    return (
      <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="mx-auto max-w-md space-y-4 relative z-10 p-5 pt-8">
          <Btn onClick={onExit} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black flex items-center gap-2"><Home size={16} />Übersicht</Btn>
          <div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-5 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 font-black">Raum-Code</div>
            <div className="text-5xl font-black tracking-widest text-white">{room}</div>
            <div className="space-y-2">
              {lobby.map((p, i) => (
                <div key={p.id} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex items-center gap-3">
                  <span>{i === 0 ? "👑" : "👤"}</span><span className="font-black flex-1 text-left">{p.name}</span>
                </div>
              ))}
              {lobby.length < 2 && <div className="text-xs text-white/30">Warte auf weitere Spieler…</div>}
            </div>
            {isHost ? (
              <Btn onClick={handleStartOnlineGame} disabled={lobby.length < 2} className="w-full rounded-[26px] py-6 font-black bg-white text-black disabled:opacity-40">▶ Spiel starten</Btn>
            ) : (
              <div className="text-white/50 font-black text-sm">⏳ Host startet gleich…</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════ PLAY ════════════════════════════
  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="mx-auto max-w-md space-y-4 relative z-10 p-5 pt-8">
        <div className="flex gap-2">
          <Btn onClick={onExit} className="flex-1 rounded-2xl bg-white/10 py-4 text-sm font-black flex items-center justify-center gap-2"><Home size={16} />Übersicht</Btn>
          {(!online || isHost) && (
            <Btn onClick={() => { const d = buildDeck(); setDeck(d); setIndex(0); if (online) syncState({ deck: d, index: 0 }); }}
              className="rounded-2xl bg-white/10 px-4 py-4"><Shuffle size={18} /></Btn>
          )}
        </div>

        <div className="text-center text-xs font-black uppercase tracking-widest text-white/40">
          Karte {Math.min(index + 1, deck.length)} / {deck.length}
        </div>

        <div className="relative h-72">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60, rotate: direction * 6 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -direction * 60, rotate: -direction * 6 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 rounded-[36px] border-4 border-white/70 bg-zinc-950 p-7 flex flex-col items-center justify-center text-center shadow-2xl"
            >
              <div className="text-5xl mb-4">🍻</div>
              <div className="text-xl font-black leading-snug">Ich hab noch nie{card?.text}</div>
              {card?.cat === "spicy" && <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-amber-300">Spicy</div>}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-black/45 backdrop-blur-2xl p-4">
          <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-2 text-center">Wer hat's getan? Tippen zum Trinken</div>
          <div className="grid grid-cols-2 gap-2">
            {allNames.map(n => (
              <Btn key={n} onClick={() => markDrunk(n)} className="rounded-2xl bg-white/10 border border-white/10 px-3 py-3 text-sm font-black flex flex-col items-center gap-1">
                <span>{n}</span><span className="text-white/50 text-xs">🥃 {sips[n] || 0}</span>
              </Btn>
            ))}
          </div>
        </div>

        {(!online || isHost) && (
          <Btn onClick={next} disabled={index >= deck.length - 1}
            className="w-full rounded-[26px] py-6 text-lg font-black bg-white text-black disabled:opacity-40">
            {index >= deck.length - 1 ? "Letzte Karte" : "Nächste Karte →"}
          </Btn>
        )}
      </div>
    </div>
  );
}
