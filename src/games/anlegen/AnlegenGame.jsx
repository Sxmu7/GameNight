import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, RefreshCw, BookOpen, Home, Zap,
  Users, Wifi, Trash2, UserPlus, Bluetooth, Plus, QrCode, Info, Eye,
} from "lucide-react";
import { db } from "../../firebase";
import { ref, set, get, onValue, off, remove, serverTimestamp } from "firebase/database";

// ─── Admin Codes ─────────────────────────────────────────────────────────────
const ADMIN_CODES = ["TIGER-482","WOLF-917","EAGLE-253","SHARK-731","LION-604","COBRA-385","FALCON-129","PANTHER-847","VIPER-562","GHOST-318","STORM-745","BLAZE-193","FROST-826","RAVEN-471","THUNDER-039","SHADOW-684","CRYSTAL-257","ROCKET-913","LEGEND-548","MYSTIC-762","PHOENIX-431","DIESEL-879","MATRIX-364","ULTRA-597","DELTA-128","OMEGA-853","ALPHA-276","ZENITH-641","NOVA-395","TITAN-718","SXMU_UNLIMITED"];
const MAX_FREE_ROUNDS = 3;

// ─── Firebase helpers ────────────────────────────────────────────────────────
function getOrCreatePlayerId() {
  // sessionStorage = einzigartig pro Browser-Tab/Fenster.
  // Das erlaubt das Testen mit mehreren Tabs im selben Browser als
  // unterschiedliche Spieler (sonst würden alle Tabs als derselbe
  // Spieler erkannt werden, weil localStorage browserweit geteilt wird).
  let id = sessionStorage.getItem("anlegen_pid");
  if (!id) { id = Date.now().toString(36) + Math.random().toString(36).slice(2); sessionStorage.setItem("anlegen_pid", id); }
  return id;
}
function fbGenCode() { return "ANL-" + Math.random().toString(36).slice(2,6).toUpperCase(); }
async function fbCreateRoom(code, hostId, hostName) {
  try {
    await set(ref(db, `anlegen/${code}`), {
      status:"lobby", hostId, createdAt:Date.now(), gsj:null,
      lobby:{ [hostId]:{ name:hostName, joinedAt:Date.now() } },
    });
    return { ok:true };
  } catch(e) { console.error("createRoom",e); return { ok:false, error: e.code||e.message||String(e) }; }
}
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms)),
  ]);
}
async function fbRoomExists(code) {
  try {
    const snap = await withTimeout(get(ref(db, `anlegen/${code}`)), 6000);
    return { ok: snap.exists() };
  } catch(e) { return { ok:false, error: e.code||e.message||String(e) }; }
}
async function fbJoinLobby(code, pid, name) {
  try { await set(ref(db, `anlegen/${code}/lobby/${pid}`), { name, joinedAt:Date.now() }); } catch(e){ console.error(e); }
}
async function fbLeaveLobby(code, pid) {
  try { await remove(ref(db, `anlegen/${code}/lobby/${pid}`)); } catch {}
}
async function fbStartGame(code, gs) {
  try {
    await set(ref(db, `anlegen/${code}/status`), "game");
    await set(ref(db, `anlegen/${code}/gsj`), JSON.stringify(gs));
  } catch(e){ console.error(e); }
}
async function fbWriteGs(code, gs) {
  try { await set(ref(db, `anlegen/${code}/gsj`), JSON.stringify(gs)); } catch(e){ console.error(e); }
}
// Syncs a single "what just happened" event (drawn card, result, toast, …)
// so every device replays the exact same reveal/feedback animation, not
// just the underlying game state.
async function fbWriteEvent(code, ev) {
  try { await set(ref(db, `anlegen/${code}/event`), ev); } catch(e){ console.error(e); }
}

// ─── Drinks ──────────────────────────────────────────────────────────────────
const DRINKS = {
  bier:  { label:"Bier",  emoji:"🍺", divisor:1,    fluidColor:"from-amber-950 via-yellow-700 to-yellow-300", bubbleColor:"rgba(251,191,36,0.5)" },
  wein:  { label:"Wein",  emoji:"🍷", divisor:2,    fluidColor:"from-red-950 via-red-700 to-red-400",         bubbleColor:"rgba(239,68,68,0.4)"   },
  vodka: { label:"Vodka", emoji:"🥃", divisor:2,    fluidColor:"from-zinc-900 via-zinc-600 to-zinc-300",      bubbleColor:"rgba(200,200,200,0.3)" },
  wasser:{ label:"Wasser",emoji:"💧", divisor:9999, fluidColor:"from-blue-950 via-blue-500 to-blue-200",      bubbleColor:"rgba(96,165,250,0.4)"  },
};
const DRINK_KEYS = ["bier","wein","vodka","wasser"];
function calcSips(raw, dk) { const d=DRINKS[dk]||DRINKS.bier; if(d.divisor>=9999)return 0; return Math.max(1,Math.round(raw/d.divisor)); }

// ─── Deck ────────────────────────────────────────────────────────────────────
const SUITS=[{key:"hearts",symbol:"♥",red:true},{key:"diamonds",symbol:"♦",red:true},{key:"clubs",symbol:"♣",red:false},{key:"spades",symbol:"♠",red:false}];
const RANKS=[{label:"7",value:7},{label:"8",value:8},{label:"9",value:9},{label:"10",value:10},{label:"B",value:11},{label:"D",value:12},{label:"K",value:13},{label:"A",value:14}];
function buildDeck(withJokers=false){
  const cards=SUITS.flatMap(s=>RANKS.map(r=>({id:`${r.label}-${s.key}-${Math.random().toString(36).slice(2)}`,rank:r.label,value:r.value,suit:s.symbol,red:s.red,joker:false})));
  if(withJokers){cards.push({id:`j1-${Math.random()}`,rank:"JOKER",value:15,suit:"★",red:false,joker:true});cards.push({id:`j2-${Math.random()}`,rank:"JOKER",value:15,suit:"★",red:true,joker:true});}
  return cards;
}
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function compare(b,n){if(n.value>b.value)return"higher";if(n.value<b.value)return"lower";return"same";}
function guessLabel(g){return g==="higher"?"höher":g==="lower"?"tiefer":"gleich";}
const isHeartKing=(c)=>c?.rank==="K"&&c?.suit==="♥";
const isHeartQueen=(c)=>c?.rank==="D"&&c?.suit==="♥";
const isJoker=(c)=>!!c?.joker;

// ─── Party ───────────────────────────────────────────────────────────────────
const PARTY_DESCRIPTIONS={Hardcore:"Survival-Modus. Verliere alle Leben und du bist raus.",Speed:"Schnell tippen. Bei Fehler extra Strafe.",Chaos:"Unberechenbar. Zufällige Events triggern ständig.",Teams:"Spiele für dein Team. Fehler tun allen weh.","Last Man":"Wer als letzter steht gewinnt.",Random:"Reines Glück. Mini-Hits jederzeit.",Storage:"Schlucke im Tank sammeln. Bei 10 wird's voll.",Turm:"Baue einen Turm aus Karten. Höher = mehr Belohnung."};
const PARTY_FULL_RULES={Hardcore:{title:"Hardcore Modus",emoji:"💀",rules:["Jeder Spieler startet mit X Leben (einstellbar 1-5).","Bei jedem Fehler verlierst du 1 Leben.","Bei 0 Leben bist du komplett aus dem Spiel raus.","Wer am Ende noch Leben hat, gewinnt."]},Speed:{title:"Speed Modus",emoji:"⚡",rules:["Ab einer Streak von 3 gibt jede richtige Karte einen Tempo-Druck.","Bei einem Fehler bekommst du zusätzlich +1 Strafschluck.","Belohnt schnelle Entscheidungen."]},Chaos:{title:"Chaos Modus",emoji:"🌪️",rules:["Bei jeder geraden Streak triggert ein Chaos-Event.","Chaos-Event = ALLE Spieler müssen Schlucke nehmen."]},Teams:{title:"Team Modus",emoji:"🛡️",rules:["Spieler werden automatisch in 2 Teams aufgeteilt.","Bei einem Fehler trinken auch deine Teamkollegen mit!"]},"Last Man":{title:"Last Man Standing",emoji:"👑",rules:["Bei einem Fehler verlierst du zusätzlich einen Runden-Punkt.","Bei einer 5er-Streak bekommst du Immunität."]}};
const PARTY_STYLES={Hardcore:{emoji:"💀",bg:"from-red-950/70 via-black to-zinc-950",border:"border-red-400/50",badge:"bg-red-400 text-black",glow:"shadow-[0_0_60px_rgba(248,113,113,0.25)]"},Speed:{emoji:"⚡",bg:"from-cyan-950/70 via-black to-zinc-950",border:"border-cyan-300/50",badge:"bg-cyan-300 text-black",glow:"shadow-[0_0_60px_rgba(34,211,238,0.25)]"},Chaos:{emoji:"🌪️",bg:"from-fuchsia-950/70 via-black to-zinc-950",border:"border-fuchsia-300/50",badge:"bg-fuchsia-300 text-black",glow:"shadow-[0_0_60px_rgba(217,70,239,0.25)]"},Teams:{emoji:"🛡️",bg:"from-emerald-950/70 via-black to-zinc-950",border:"border-emerald-300/50",badge:"bg-emerald-300 text-black",glow:"shadow-[0_0_60px_rgba(52,211,153,0.25)]"},"Last Man":{emoji:"👑",bg:"from-yellow-950/70 via-black to-zinc-950",border:"border-yellow-300/60",badge:"bg-yellow-300 text-black",glow:"shadow-[0_0_60px_rgba(250,204,21,0.25)]"},Random:{emoji:"🎲",bg:"from-violet-950/70 via-black to-zinc-950",border:"border-violet-300/50",badge:"bg-violet-300 text-black",glow:"shadow-[0_0_60px_rgba(167,139,250,0.25)]"},Storage:{emoji:"🛢️",bg:"from-orange-950/70 via-black to-zinc-950",border:"border-orange-300/50",badge:"bg-orange-300 text-black",glow:"shadow-[0_0_60px_rgba(251,146,60,0.25)]"},Turm:{emoji:"🗼",bg:"from-indigo-950/70 via-black to-zinc-950",border:"border-indigo-300/50",badge:"bg-indigo-300 text-black",glow:"shadow-[0_0_60px_rgba(129,140,248,0.25)]"}};

// ─── UI helpers ───────────────────────────────────────────────────────────────
function Btn({children,className="",...props}){return(<button style={{touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}}className={`select-none ${className}`}{...props}>{children}</button>);}
function CardComp({card,small=false,active=false,revealKey=0,bigReveal=false}){
  if(!card)return null;
  const sz=bigReveal?"h-56 w-40":small?"h-20 w-14":"h-28 w-20";
  const base=`${sz} shrink-0 rounded-2xl border bg-white shadow-lg flex flex-col justify-between p-2 ${active?"ring-4 ring-yellow-300":""}`;
  const anim=revealKey?{initial:{opacity:0,scale:bigReveal?0.72:0.94,y:bigReveal?18:6},animate:{opacity:1,scale:1,y:0},transition:{duration:bigReveal?0.42:0.28,ease:"easeOut"}}:{};
  if(card.joker)return(<motion.div key={revealKey?`${card.id}-${revealKey}`:card.id}layout={false}{...anim}className={base}><div className="text-[10px] font-black text-black">JOKER</div><div className={`text-center ${bigReveal?"text-7xl":"text-3xl"}`}>🃏</div><div className="rotate-180 text-[10px] font-black text-black">JOKER</div></motion.div>);
  return(<motion.div key={revealKey?`${card.id}-${revealKey}`:card.id}layout={false}{...anim}className={base}><div className={`font-black leading-none ${card.red?"text-red-500":"text-black"}`}>{card.rank}</div><div className={`text-center ${bigReveal?"text-8xl":small?"text-2xl":"text-4xl"} ${card.red?"text-red-500":"text-black"}`}>{card.suit}</div><div className={`font-black rotate-180 leading-none ${card.red?"text-red-500":"text-black"}`}>{card.rank}</div></motion.div>);
}
function DeckBack(){return<div className="h-20 w-14 rounded-2xl bg-zinc-900 shadow-md border-2 border-white/40 grid place-items-center text-white text-xl select-none">★</div>;}
function KingCard({size="normal",animated=false}){const big=size==="big";return(<motion.div initial={animated?{opacity:0,scale:0.7,rotate:-14,y:20}:false}animate={animated?{opacity:1,scale:1,rotate:-4,y:0}:{rotate:[-6,6,-6],y:[0,-8,0]}}transition={animated?{duration:0.7,type:"spring"}:{duration:1.4,repeat:Infinity,ease:"easeInOut"}}className={`relative ${big?"h-40 w-32":"h-32 w-28"} mx-auto rounded-[30px] bg-white shadow-2xl border-[4px] border-white overflow-hidden`}><div className={`absolute top-3 left-3 text-red-500 font-black ${big?"text-5xl":"text-4xl"}`}>K</div><div className="absolute inset-0 flex flex-col items-center justify-center"><div className={big?"text-7xl":"text-6xl"}>👑</div><div className={`text-red-500 ${big?"text-6xl":"text-5xl"}`}>♥</div></div><div className={`absolute bottom-3 right-3 rotate-180 text-red-500 font-black ${big?"text-5xl":"text-4xl"}`}>K</div></motion.div>);}
function ModeBtn({active,children,onClick}){return(<Btn onClick={onClick}className={`w-full rounded-[22px] py-4 px-3 font-black border active:scale-[0.97] transition-all ${active?"bg-white text-black border-white":"bg-white/5 text-white border-white/10"}`}>{children}</Btn>);}
function Modal({children}){return(<motion.div initial={{opacity:0}}animate={{opacity:1}}exit={{opacity:0}}className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"><motion.div initial={{scale:0.6,opacity:0,y:35}}animate={{scale:[0.6,1.08,1],opacity:1,y:[35,-8,0]}}exit={{opacity:0,scale:0.85}}transition={{duration:0.5}}className="w-full max-w-sm">{children}</motion.div></motion.div>);}
function NavBar({onHome,onRules}){return(<div className="rounded-[24px] border border-white/10 bg-black/45 p-2 backdrop-blur-xl"><div className="flex gap-2"><Btn onClick={onHome}className="flex-1 rounded-2xl bg-white/10 py-4 text-sm font-black text-white flex items-center justify-center gap-2"><Home size={17}/>Home</Btn><Btn onClick={onRules}className="flex-1 rounded-2xl bg-white/10 py-4 text-sm font-black text-white flex items-center justify-center gap-2"><BookOpen size={17}/>Regeln</Btn></div></div>);}
function QRModal({url,onClose}){const q=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}&bgcolor=000000&color=ffffff&margin=10`;return(<Modal><div className="rounded-[38px] border-4 border-white/70 bg-zinc-950 p-6 text-center text-white space-y-4"><div className="text-3xl font-black">QR-Code</div><div className="text-xs text-white/60 font-bold break-all">{url}</div><div className="flex justify-center"><img src={q}alt="QR"className="rounded-2xl w-56 h-56"/></div><Btn onClick={onClose}className="w-full rounded-[22px] py-4 font-black bg-white text-black">Schließen</Btn></div></Modal>);}
function BeerFluid({level=0,drinkKey="bier"}){const d=DRINKS[drinkKey]||DRINKS.bier;return(<div className="pointer-events-none fixed inset-0 z-[0] overflow-hidden bg-black"><div className="absolute inset-0 z-[5] shadow-[inset_0_0_150px_rgba(0,0,0,0.98),inset_0_0_80px_rgba(0,0,0,0.88),inset_0_0_35px_rgba(0,0,0,0.75)]"/><motion.div className={`absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[18%] bg-gradient-to-t ${d.fluidColor}`}animate={{height:`${level*100}%`}}transition={{duration:2,ease:"easeInOut"}}><motion.div className="absolute -top-16 left-[-35%] h-32 w-[170%] rounded-[48%] blur-xl"style={{background:d.bubbleColor}}animate={{x:["-6%","6%","-6%"]}}transition={{duration:4.8,repeat:Infinity,ease:"easeInOut"}}/></motion.div></div>);}
const STORAGE_MAX=10;
function StorageTank({amount,drinkKey,onDrink}){const pct=Math.min(amount/STORAGE_MAX,1);const isFull=amount>=STORAGE_MAX;const d=DRINKS[drinkKey]||DRINKS.bier;return(<motion.div animate={isFull?{scale:[1,1.04,1],borderColor:["rgba(251,146,60,0.5)","rgba(251,146,60,1)","rgba(251,146,60,0.5)"]}:{}}transition={isFull?{duration:0.9,repeat:Infinity}:{}}className={`rounded-[24px] border p-4 ${isFull?"border-orange-400 bg-orange-950/40":"border-white/10 bg-white/5"}`}><div className="flex items-center justify-between mb-2"><div className="text-sm font-black text-white">{d.emoji} Storage Tank</div><div className={`text-xl font-black ${isFull?"text-orange-300":"text-white"}`}>{amount}/{STORAGE_MAX}</div></div><div className="h-4 rounded-full bg-white/10 overflow-hidden mb-3"><motion.div className={`h-full rounded-full ${isFull?"bg-orange-400":"bg-white/60"}`}animate={{width:`${pct*100}%`}}transition={{duration:0.5}}/></div>{isFull&&<Btn onClick={onDrink}className="w-full rounded-[18px] py-4 font-black bg-orange-400 text-black">{d.emoji} {amount} Schlucke trinken</Btn>}{!isFull&&amount>0&&<div className="text-xs text-white/50 text-center">{STORAGE_MAX-amount} bis zum Limit</div>}</motion.div>);}
function DrinkPickerModal({playerName,onPick}){return(<Modal><div className="rounded-[38px] border-4 border-white/30 bg-zinc-950 p-6 text-center text-white space-y-4"><div className="text-5xl mb-1">🍹</div><div className="text-2xl font-black">{playerName}</div><div className="text-sm text-white/60">Was trinkst du heute?</div><div className="grid grid-cols-2 gap-3 pt-2">{DRINK_KEYS.map(k=>{const d=DRINKS[k];return(<Btn key={k}onClick={()=>onPick(k)}className="rounded-[22px] py-5 font-black bg-white/10 border border-white/10 text-white flex flex-col items-center gap-2"><span className="text-4xl">{d.emoji}</span><span>{d.label}</span><span className="text-[10px] text-white/50">{d.divisor>=9999?"keine Strafe":"÷"+d.divisor}</span></Btn>);})}</div></div></Modal>);}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN GAME — ANLEGEN (Höher / Tiefer / Gleich)
// ═════════════════════════════════════════════════════════════════════════════
export default function AnlegenGame({ onExit }){
  // ── Player identity ──────────────────────────────────────────────────────
  const [playerId]           = useState(getOrCreatePlayerId);
  const [myName, setMyName]  = useState(()=>localStorage.getItem("anlegen_pname")||"");
  const [nameInput, setNameInput] = useState("");

  // ── Multiplayer ──────────────────────────────────────────────────────────
  const [mpRoom, setMpRoom]       = useState(""); // room code
  const [mpIsHost, setMpIsHost]   = useState(false);
  const [mpActive, setMpActive]   = useState(false); // connected to a room
  const [mpStatus, setMpStatus]   = useState("lobby");
  const [mpLobby, setMpLobby]     = useState([]); // [{id,name}]
  const [mpJoinCode, setMpJoinCode] = useState("");
  const [mpJoinErr, setMpJoinErr] = useState("");
  const [mpJoining, setMpJoining] = useState(false);
  const [showLobbyQR, setShowLobbyQR] = useState(false);
  const lastWrite = useRef(null);
  const lastEventKey = useRef(null); // dedupes our own synced animation events
  const [copiedCode, setCopiedCode] = useState(false);

  // ── Nav ─────────────────────────────────────────────────────────────────
  // Starts straight at "home" — the shared app shell already played the
  // logo intro before this game was opened.
  const [screen, setScreen]   = useState("home");
  const [introLevel, setIntroLevel] = useState(0);

  // ── Game config ──────────────────────────────────────────────────────────
  const [gameMode, setGameMode]           = useState("classic");
  const [deckMode, setDeckMode]           = useState("classic");
  const [partySubMode, setPartySubMode]   = useState("Hardcore");
  const [livesPerPlayer, setLivesPerPlayer] = useState(3);
  const [playerCount, setPlayerCount]     = useState(2);
  const [playerNames, setPlayerNames]     = useState(["",""]);
  const [targetStreak, setTargetStreak]   = useState(3);
  const [sipsPerCard, setSipsPerCard]     = useState(1);

  // ── Game state ───────────────────────────────────────────────────────────
  const [players, setPlayers]             = useState([]);
  const [playerDrinks, setPlayerDrinks]   = useState([]);
  const [drinkPickQueue, setDrinkPickQueue] = useState([]);
  const [deck, setDeck]                   = useState([]);
  const [discard, setDiscard]             = useState([]);
  const [stacks, setStacks]               = useState([[],[],[]]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [activeStack, setActiveStack]     = useState(0);
  const [chooseSide, setChooseSide]       = useState(null);
  const [streak, setStreak]               = useState(0);
  const [lastRevealId, setLastRevealId]   = useState(null);
  const [lastRevealCard, setLastRevealCard] = useState(null);
  const [roundsDone, setRoundsDone]       = useState(Array(10).fill(0));
  const [sips, setSips]                   = useState(Array(10).fill(0));
  const [storageTank, setStorageTank]     = useState(Array(10).fill(0));
  const [bodyguards, setBodyguards]       = useState(Array(10).fill(0));
  const [lives, setLives]                 = useState([]);
  const [runHadMistake, setRunHadMistake] = useState(false);
  const [perfectRun, setPerfectRun]       = useState(null);

  // ── UI ───────────────────────────────────────────────────────────────────
  const [toastMsg, setToastMsg]           = useState(null);
  const [playerAlert, setPlayerAlert]     = useState(null);
  const [mistakeInfo, setMistakeInfo]     = useState(null);
  const [penaltyInfo, setPenaltyInfo]     = useState(null);
  const [distributeInfo, setDistributeInfo] = useState(null);
  const [resetConfirm, setResetConfirm]   = useState(false);
  const [showQR, setShowQR]               = useState(false);
  const [modeInfoOpen, setModeInfoOpen]   = useState(null);
  const [tankDrinkModal, setTankDrinkModal] = useState(null);

  // ── Access ───────────────────────────────────────────────────────────────
  const [isUnlocked, setIsUnlocked] = useState(()=>localStorage.getItem("anlegen_unlocked")==="true");
  const [freeRoundsUsed, setFreeRoundsUsed] = useState(()=>Number(localStorage.getItem("anlegen_demo_rounds")||0));
  const [roundCycleCount, setRoundCycleCount] = useState(()=>Number(localStorage.getItem("anlegen_round_cycle")||0));
  const [codeInput, setCodeInput]   = useState("");
  const [codeError, setCodeError]   = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  // ── Lobby (local BT) ─────────────────────────────────────────────────────
  const [lobbyPlayers, setLobbyPlayers] = useState([]);
  const [btStatus, setBtStatus] = useState("Noch nicht verbunden");
  const [btError, setBtError]   = useState("");

  // ── Refs ─────────────────────────────────────────────────────────────────
  const timeoutsRef = useRef([]);
  const longPressRef = useRef(null);
  const isLongPress  = useRef(false);
  const playerAlertTimer = useRef(null);

  const safeTimeout = useCallback((fn,ms)=>{const id=window.setTimeout(fn,ms);timeoutsRef.current.push(id);return id;},[]);
  useEffect(()=>{return()=>{timeoutsRef.current.forEach(clearTimeout);};},[]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const maxStackLen    = useMemo(()=>Math.max(...stacks.map(s=>s.length)),[stacks]);
  const deckCount      = deck.length;
  const isStreakDone   = streak >= targetStreak;
  const isDoubleStreak = streak >= targetStreak * 2;
  const partyStyle     = PARTY_STYLES[partySubMode]||PARTY_STYLES.Hardcore;
  const hasGameData    = players.length>0; // guards against the briefly-empty default state on join
  const isEndgame      = screen==="game" && hasGameData && !runHadMistake && deckCount<=10;
  const isLastCards    = screen==="game" && hasGameData && !runHadMistake && deckCount<=5;
  const currentDrink   = playerDrinks[currentPlayer]||"bier";
  const currentDrinkObj= DRINKS[currentDrink]||DRINKS.bier;

  // isMyTurn: in multiplayer, only the player whose name matches can act
  const isMyTurn = !mpActive || players[currentPlayer] === myName;
  // isSpectator: in the room but not in players[] at all
  const isSpectator = mpActive && players.length > 0 && !players.includes(myName);

  // ── URL join ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const p = new URLSearchParams(window.location.search).get("join");
    if(p){ setMpJoinCode(p.toUpperCase()); setScreen("internetInfo"); window.history.replaceState({},"","/"); }
  },[]);

  // ── Firebase listeners ───────────────────────────────────────────────────
  useEffect(()=>{
    if(!mpActive || !mpRoom) return;

    const lobbyRef  = ref(db, `anlegen/${mpRoom}/lobby`);
    const gsjRef    = ref(db, `anlegen/${mpRoom}/gsj`);
    const statusRef = ref(db, `anlegen/${mpRoom}/status`);
    const eventRef  = ref(db, `anlegen/${mpRoom}/event`);

    onValue(lobbyRef, snap=>{
      const d = snap.val()||{};
      setMpLobby(Object.entries(d).map(([id,v])=>({id,name:v.name})));
    });

    onValue(gsjRef, snap=>{
      const gsj = snap.val();
      if(!gsj || gsj===lastWrite.current) return;
      try { applyGs(JSON.parse(gsj)); } catch(e){ console.error(e); }
    });

    onValue(statusRef, snap=>{
      const s = snap.val();
      setMpStatus(s||"lobby");
      if(s==="game") setScreen("game");
    });

    // Replays the same reveal/result animation that the active player's
    // device just showed, so every screen sees the identical sequence.
    onValue(eventRef, snap=>{
      const ev = snap.val();
      if(!ev || ev.key===lastEventKey.current) return;
      lastEventKey.current = ev.key;
      playEvent(ev);
    });

    return ()=>{ off(lobbyRef); off(gsjRef); off(statusRef); off(eventRef); };
  },[mpActive, mpRoom]);

  // ── Apply game state from Firebase ───────────────────────────────────────
  function applyGs(gs){
    if(!gs) return;
    if(gs.players)        setPlayers(gs.players);
    if(gs.playerDrinks)   setPlayerDrinks(gs.playerDrinks);
    if(gs.deck)           setDeck(gs.deck);
    if(gs.discard)        setDiscard(gs.discard);
    if(gs.stacks)         setStacks(gs.stacks);
    if(gs.currentPlayer!==undefined) setCurrentPlayer(gs.currentPlayer);
    if(gs.activeStack!==undefined)   setActiveStack(gs.activeStack);
    if(gs.chooseSide!==undefined)    setChooseSide(gs.chooseSide);
    if(gs.streak!==undefined)        setStreak(gs.streak);
    if(gs.sips)           setSips(gs.sips);
    if(gs.storageTank)    setStorageTank(gs.storageTank);
    if(gs.bodyguards)     setBodyguards(gs.bodyguards);
    if(gs.lives)          setLives(gs.lives);
    if(gs.runHadMistake!==undefined) setRunHadMistake(gs.runHadMistake);
    if(gs.roundsDone)     setRoundsDone(gs.roundsDone);
    if(gs.gameMode)       setGameMode(gs.gameMode);
    if(gs.deckMode)       setDeckMode(gs.deckMode);
    if(gs.partySubMode)   setPartySubMode(gs.partySubMode);
    if(gs.targetStreak)   setTargetStreak(gs.targetStreak);
    if(gs.sipsPerCard)    setSipsPerCard(gs.sipsPerCard);
    if(gs.livesPerPlayer) setLivesPerPlayer(gs.livesPerPlayer);
    if(gs.drinkPickQueue) setDrinkPickQueue(gs.drinkPickQueue);
  }

  // ── Build + sync game state ───────────────────────────────────────────────
  function buildGs(ov={}){
    return { players,playerDrinks,deck,discard,stacks,currentPlayer,activeStack,chooseSide,streak,
      sips,storageTank,bodyguards,lives,runHadMistake,roundsDone,drinkPickQueue,
      gameMode,deckMode,partySubMode,targetStreak,sipsPerCard,livesPerPlayer, ...ov };
  }
  async function sync(ov={}){
    if(!mpActive||!mpRoom) return;
    const gs = buildGs(ov);
    const gsj = JSON.stringify(gs);
    lastWrite.current = gsj;
    await fbWriteGs(mpRoom, gs);
  }

  // ── Create room: code shown IMMEDIATELY, Firebase in background ───────────
  const [mpCreateErr, setMpCreateErr] = useState("");
  async function handleCreateRoom(){
    if(!myName.trim()) return;
    const code = fbGenCode();
    setMpRoom(code);
    setMpIsHost(true);
    setMpActive(true);
    setMpStatus("lobby");
    setMpCreateErr("");
    // Firebase write in background — UI shows code instantly
    const res = await fbCreateRoom(code, playerId, myName);
    if(!res.ok) setMpCreateErr(`Firebase-Fehler beim Erstellen: ${res.error}`);
  }

  // ── Join room ─────────────────────────────────────────────────────────────
  async function handleJoinRoom(){
    const code = mpJoinCode.trim().toUpperCase();
    if(!code||!myName.trim()) return;
    setMpJoining(true); setMpJoinErr("");

    let res = await fbRoomExists(code);
    // Retry once after a short delay — covers the case where the host's
    // room-creation write is still in flight (room code shown instantly,
    // but Firebase write takes a moment to land).
    if(!res.ok){
      await new Promise(r=>setTimeout(r,700));
      res = await fbRoomExists(code);
    }
    if(!res.ok){
      setMpJoinErr(res.error ? `Firebase-Fehler: ${res.error}` : "Raum nicht gefunden. Code prüfen.");
      setMpJoining(false);
      return;
    }

    await fbJoinLobby(code, playerId, myName);
    setMpRoom(code);
    setMpIsHost(false);
    setMpActive(true);
    setMpJoining(false);
    // Status-listener handles the rest (lobby vs game screen)
  }

  async function handleLeaveRoom(){
    if(mpRoom) await fbLeaveLobby(mpRoom, playerId);
    setMpActive(false); setMpRoom(""); setMpIsHost(false); setMpLobby([]); setMpJoinCode("");
  }

  // ── Start multiplayer game ────────────────────────────────────────────────
  async function handleStartMpGame(){
    const names = mpLobby.map(p=>p.name);
    if(names.length<2) return;
    setPlayerCount(names.length); setPlayerNames(names);
    let newDeck = shuffle(buildDeck(deckMode==="extreme"));
    const isTurm = gameMode==="party"&&partySubMode==="Turm";
    const sc = isTurm?1:3;
    const newStacks = Array.from({length:sc},()=>[]);
    for(let i=0;i<sc;i++){ newStacks[i].push(newDeck[0]); newDeck=newDeck.slice(1); }
    const dq = Array.from({length:names.length},(_,i)=>i);
    const gs = {
      players:names, playerDrinks:Array(names.length).fill(null),
      deck:newDeck, discard:[], stacks:newStacks,
      currentPlayer:0, activeStack:0, chooseSide:null, streak:0,
      sips:Array(names.length).fill(0), storageTank:Array(names.length).fill(0),
      bodyguards:Array(names.length).fill(0), lives:Array(names.length).fill(livesPerPlayer),
      runHadMistake:false, roundsDone:Array(names.length).fill(0), drinkPickQueue:dq,
      gameMode,deckMode,partySubMode,targetStreak,sipsPerCard,livesPerPlayer,
    };
    applyGs(gs);
    setScreen("game");
    const gsj = JSON.stringify(gs);
    lastWrite.current = gsj;
    await fbStartGame(mpRoom, gs);
  }

  // ── Toast + Announce ─────────────────────────────────────────────────────
  function showToast(title,emoji,text,light=false){
    const key=Date.now();
    setToastMsg({key,title,emoji,text,light});
    safeTimeout(()=>setToastMsg(cur=>(cur&&cur.key===key)?null:cur),2400);
  }
  function announcePlayer(name,sub="am Zug"){ clearTimeout(playerAlertTimer.current); setPlayerAlert({key:Date.now(),name,sub}); playerAlertTimer.current=window.setTimeout(()=>setPlayerAlert(null),1900); timeoutsRef.current.push(playerAlertTimer.current); }

  // ── Card draw ────────────────────────────────────────────────────────────
  function drawCard(d,disc){ let dk=[...d];let di=[...disc]; if(!dk.length&&di.length){dk=shuffle(di);di=[];} if(!dk.length)return{card:null,deck:[],discard:di}; return{card:dk[0],deck:dk.slice(1),discard:di}; }

  // ── Access ───────────────────────────────────────────────────────────────
  function checkIsAllowed(){
    if(isUnlocked)return true;
    const nc=roundCycleCount+1;
    if(nc>=playerCount){const nr=freeRoundsUsed+1;localStorage.setItem("anlegen_demo_rounds",String(nr));localStorage.setItem("anlegen_round_cycle","0");setFreeRoundsUsed(nr);setRoundCycleCount(0);return nr<MAX_FREE_ROUNDS;}
    localStorage.setItem("anlegen_round_cycle",String(nc));setRoundCycleCount(nc);return true;
  }
  function handleCodeCheck(){const t=codeInput.trim();if(!ADMIN_CODES.includes(t)){setCodeError("Falscher Zugangscode");return;}localStorage.setItem("anlegen_unlocked","true");localStorage.setItem("anlegen_demo_rounds","0");localStorage.setItem("anlegen_round_cycle","0");setIsUnlocked(true);setFreeRoundsUsed(0);setRoundCycleCount(0);setCodeInput("");setCodeError("");setShowCodeInput(false);showToast("Access guaranteed","🔓👑","Unlimited aktiviert.",true);}
  function handleRevokeLicense(){localStorage.removeItem("anlegen_unlocked");localStorage.setItem("anlegen_demo_rounds","0");localStorage.setItem("anlegen_round_cycle","0");setIsUnlocked(false);setFreeRoundsUsed(0);setRoundCycleCount(0);setResetConfirm(false);}

  // ── Start game (local) ───────────────────────────────────────────────────
  function startGame(){
    setScreen("loading");
    safeTimeout(()=>{
      const names=Array.from({length:playerCount},(_,i)=>playerNames[i]?.trim()||`Spieler ${i+1}`);
      let d=shuffle(buildDeck(deckMode==="extreme"));
      const isTurm=gameMode==="party"&&partySubMode==="Turm";const sc=isTurm?1:3;
      const ns=Array.from({length:sc},()=>[]);
      for(let i=0;i<sc;i++){ns[i].push(d[0]);d=d.slice(1);}
      setPlayers(names);setPlayerDrinks(Array(names.length).fill(null));setDrinkPickQueue(Array.from({length:names.length},(_,i)=>i));
      setDeck(d);setDiscard([]);setStacks(ns);setCurrentPlayer(0);setActiveStack(0);setChooseSide(null);
      setStreak(0);setLastRevealId(null);setLastRevealCard(null);setRoundsDone(Array(names.length).fill(0));
      setSips(Array(names.length).fill(0));setStorageTank(Array(names.length).fill(0));setBodyguards(Array(names.length).fill(0));
      setLives(Array(names.length).fill(livesPerPlayer));setRunHadMistake(false);setPerfectRun(null);
      setScreen("game");
    },3000);
  }

  function setDrinkForPlayer(idx,dk){
    const next=[...playerDrinks];next[idx]=dk;setPlayerDrinks(next);
    const q=drinkPickQueue.filter(i=>i!==idx);setDrinkPickQueue(q);
    if(mpActive) sync({playerDrinks:next,drinkPickQueue:q});
  }

  function nextPlayer(){
    const nx=(currentPlayer+1)%players.length;
    setCurrentPlayer(nx);setStreak(0);
    const bi=stacks.findIndex(s=>s.length===Math.max(...stacks.map(x=>x.length)));
    setActiveStack(bi>=0?bi:0);setChooseSide(null);
    setDrinkPickQueue(prev=>{ if(playerDrinks[nx]===null&&!prev.includes(nx))return[...prev,nx];return prev; });
    announcePlayer(players[nx]||`Spieler ${nx+1}`,"am Zug");
    if(mpActive) sync({currentPlayer:nx,streak:0,chooseSide:null,activeStack:bi>=0?bi:0});
  }

  function addSips(pi,raw){
    const dk=playerDrinks[pi]||"bier";const real=calcSips(raw,dk);if(!real)return;
    if(gameMode==="party"&&partySubMode==="Storage"){
      setStorageTank(prev=>{const n=[...prev];n[pi]=Math.min(STORAGE_MAX,(n[pi]||0)+real);if(n[pi]>=STORAGE_MAX)safeTimeout(()=>setTankDrinkModal({pi}),300);return n;});
    } else {setSips(prev=>prev.map((v,i)=>i===pi?(v||0)+real:v));}
  }
  function addSipsAll(r){players.forEach((_,i)=>addSips(i,r));}
  function drinkTank(pi){const a=storageTank[pi]||0;setSips(prev=>prev.map((v,i)=>i===pi?(v||0)+a:v));setStorageTank(prev=>prev.map((v,i)=>i===pi?0:v));setTankDrinkModal(null);showToast("Tank geleert!","🛢️",`${players[pi]} trinkt ${a} Schlucke!`);}

  // ── Party events ─────────────────────────────────────────────────────────
  function applyPartyEvent(ns){
    if(gameMode!=="party")return null;
    if(partySubMode==="Speed"&&ns>=3){addSips(currentPlayer,1);return{title:"Speed",emoji:"⚡",text:"+1 Schluck."};}
    if(partySubMode==="Chaos"&&ns>0&&ns%2===0){addSipsAll(sipsPerCard);return{title:"Chaos",emoji:"🌪️",text:"Alle trinken."};}
    if(partySubMode==="Teams"&&ns>0&&ns%4===0){const t=currentPlayer%2;players.forEach((_,i)=>{if(i%2===t)setSips(p=>p.map((v,j)=>j===i?(v||0)+1:v));});return{title:"Team",emoji:"🛡️",text:"Team Bodyguard."};}
    if(partySubMode==="Last Man"&&ns>0&&ns%5===0){setBodyguards(p=>p.map((v,i)=>i===currentPlayer?(v||0)+1:v));return{title:"Immun",emoji:"👑",text:"Schutz."};}
    if(partySubMode==="Random"&&Math.random()<0.4){const r=Math.floor(Math.random()*players.length);addSips(r,sipsPerCard);return{title:"Random",emoji:"🎲",text:`${players[r]} trinkt.`};}
    return null;
  }
  function applyExtremeEvent(card){
    if(deckMode!=="extreme")return null;
    if(card.rank==="A"&&card.suit==="♥"){const nx=(currentPlayer+1)%players.length;addSips(nx,sipsPerCard*2);return{title:"Boss",emoji:"♥️",text:`${players[nx]} trinkt doppelt.`};}
    if(card.rank==="A"&&card.suit==="♠"){players.forEach((_,i)=>{if(i!==currentPlayer)addSips(i,sipsPerCard);});return{title:"Blackout",emoji:"♠️",text:"Alle außer dir."};}
    if(card.rank==="K"&&card.suit==="♣"){setBodyguards(p=>p.map((v,i)=>i===currentPlayer?(v||0)+1:v));return{title:"Guard",emoji:"♣️",text:"Schutz."};}
    return null;
  }

  // ── Plays a synced reveal/result animation sequence. Called both locally
  // (by the player who made the guess) and remotely (by every other device
  // that receives the event via Firebase), so all screens show the exact
  // same sequence — reveal card, then the matching feedback popup.
  // Timing constants ensure the big card-reveal modal fully closes before
  // any result modal (toast/mistake/penalty) opens — never overlapping.
  const REVEAL_MS  = 900;   // how long the big revealed card stays up
  const GAP_MS     = 120;   // small breathing gap between modals
  const MISTAKE_MS = 1500;  // how long the "Falsch!" modal stays up
  const PENALTY_MS = 2400;  // how long the "Verkackt" modal stays up

  function playEvent(ev){
    if(!ev) return;
    setLastRevealId(ev.card.id);
    setLastRevealCard({key:ev.key,card:ev.card});
    safeTimeout(()=>setLastRevealCard(null),REVEAL_MS);

    if(ev.type==="joker"){
      safeTimeout(()=>showToast(ev.safe?"JOKER SAFE":"JOKER CHAOS","🃏",ev.safe?"Schutz!":"Alle trinken."),REVEAL_MS+GAP_MS);
      return;
    }

    if(ev.type==="correct"){
      safeTimeout(()=>{
        if(ev.distribute) setDistributeInfo({key:ev.key,amount:ev.distribute.amount,player:ev.distribute.player});
        else if(ev.toast) showToast(ev.toast.title,ev.toast.emoji,ev.toast.text);
        if(ev.perfectRun) setPerfectRun({key:ev.key});
      },REVEAL_MS+GAP_MS);
      return;
    }

    if(ev.type==="wrong"){
      safeTimeout(()=>{
        setMistakeInfo({key:ev.key,cards:ev.punishment,guessed:ev.guess,actual:ev.result});
        safeTimeout(()=>setMistakeInfo(null),MISTAKE_MS);
      },REVEAL_MS+GAP_MS);
      safeTimeout(()=>{
        setPenaltyInfo({key:ev.key,player:ev.player,amount:ev.amount,cards:ev.punishment.length,shielded:ev.shielded,lifeLost:ev.lifeLost,emoji:ev.emoji});
        safeTimeout(()=>setPenaltyInfo(null),PENALTY_MS);
      },REVEAL_MS+GAP_MS+MISTAKE_MS+GAP_MS);
    }
  }

  // ── Make guess ────────────────────────────────────────────────────────────
  function makeGuess(guess){
    if(!chooseSide||!isMyTurn) return;
    const stack=stacks[activeStack];if(!stack?.length)return;
    const topCard=chooseSide==="left"?stack[0]:stack[stack.length-1];
    const drawn=drawCard(deck,discard);const drawnCard=drawn.card;
    if(!drawnCard){if(!runHadMistake&&discard.length===0)setPerfectRun({key:Date.now()});return;}

    const evKey = Date.now()+Math.random();

    if(isJoker(drawnCard)){
      const safe=Math.random()<0.5;
      if(safe)setBodyguards(p=>p.map((v,i)=>i===currentPlayer?(v||0)+1:v));else addSipsAll(sipsPerCard);
      const ns=stacks.map((s,idx)=>idx===activeStack?(chooseSide==="left"?[drawnCard,...s]:[...s,drawnCard]):s);
      setStacks(ns);setDeck(drawn.deck);setDiscard(drawn.discard);setStreak(p=>p+1);setChooseSide(null);

      const ev={key:evKey,type:"joker",card:drawnCard,safe};
      lastEventKey.current=evKey;
      playEvent(ev);
      safeTimeout(()=>{ sync({stacks:ns,deck:drawn.deck,discard:drawn.discard,streak:streak+1,chooseSide:null}); if(mpActive&&mpRoom)fbWriteEvent(mpRoom,ev); },100);
      return;
    }

    const result=compare(topCard,drawnCard);

    if(result===guess){
      const ns=stacks.map((s,idx)=>idx===activeStack?(chooseSide==="left"?[drawnCard,...s]:[...s,drawnCard]):s);
      setStacks(ns);setDeck(drawn.deck);setDiscard(drawn.discard);
      const newS=streak+1;setStreak(newS);setChooseSide(null);

      let toast=null, distribute=null;
      if(!runHadMistake&&discard.length===0&&newS%10===0){
        distribute={amount:sipsPerCard*5,player:players[currentPlayer]};
      } else if(isHeartKing(drawnCard)){
        addSipsAll(sipsPerCard); toast={title:"König",emoji:"👑🍻",text:`Alle trinken ${sipsPerCard}.`};
      } else if(isHeartQueen(drawnCard)){
        addSipsAll(sipsPerCard); toast={title:"Rote Hure!",emoji:"♥️",text:"Alle trinken."};
      } else if(guess==="same"){
        toast={title:"GLEICH!",emoji:"🥃",text:"Riskiert und gewonnen!"};
      } else {
        toast = applyExtremeEvent(drawnCard) || applyPartyEvent(newS);
      }
      const willPerfect = !runHadMistake && !drawn.deck.length && !drawn.discard.length;

      const ev={key:evKey,type:"correct",card:drawnCard,toast,distribute,perfectRun:willPerfect};
      lastEventKey.current=evKey;
      playEvent(ev);
      safeTimeout(()=>{ sync({stacks:ns,deck:drawn.deck,discard:drawn.discard,streak:newS,chooseSide:null}); if(mpActive&&mpRoom)fbWriteEvent(mpRoom,ev); },100);
      return;
    }

    // ── Mistake ────────────────────────────────────────────────────────────
    setRunHadMistake(true);
    const punishment=[...stack,drawnCard];
    let nd=drawn.deck;let ndisc=drawn.discard;
    const ex=drawCard(nd,ndisc);nd=ex.deck;ndisc=[...(ex.discard||[]),...punishment];
    const repl=ex.card?[ex.card]:[];
    let penRaw=punishment.length*sipsPerCard;
    let lifeLost=false;

    if(gameMode==="party"){
      if(partySubMode==="Hardcore"){
        setLives(p=>p.map((v,i)=>i===currentPlayer?Math.max(0,v-1):v));
        lifeLost=true; // shown inline in the penalty modal, no separate popup
      }
      if(partySubMode==="Speed")penRaw+=sipsPerCard;
      if(partySubMode==="Teams")players.forEach((_,i)=>{if(i%2===currentPlayer%2&&i!==currentPlayer)addSips(i,sipsPerCard);});
    }

    let shielded=false;
    if((bodyguards[currentPlayer]||0)>0){penRaw=0;shielded=true;setBodyguards(p=>p.map((v,i)=>i===currentPlayer?Math.max(0,(v||0)-1):v));}
    if(penRaw>0)addSips(currentPlayer,penRaw);

    const realPen=shielded?0:calcSips(penRaw,playerDrinks[currentPlayer]||"bier");
    const ns=stacks.map((s,idx)=>idx===activeStack?repl:s);
    const bi=ns.findIndex(s=>s.length===Math.max(...ns.map(x=>x.length)));
    setStacks(ns);setActiveStack(bi>=0?bi:0);setDeck(nd);setDiscard(ndisc);setStreak(0);setChooseSide(null);

    const ev={key:evKey,type:"wrong",card:drawnCard,punishment,guess,result,player:players[currentPlayer],amount:realPen,shielded,lifeLost,emoji:currentDrinkObj.emoji};
    lastEventKey.current=evKey;
    playEvent(ev);

    safeTimeout(()=>{ sync({stacks:ns,activeStack:bi>=0?bi:0,deck:nd,discard:ndisc,streak:0,chooseSide:null,runHadMistake:true}); if(mpActive&&mpRoom)fbWriteEvent(mpRoom,ev); },100);
  }

  function handlePass(){
    if(streak<targetStreak||!isMyTurn)return;
    if(!checkIsAllowed()){setScreen("locked");return;}
    setSips(p=>p.map((v,i)=>i===currentPlayer?v+1:v));
    safeTimeout(nextPlayer,250);
  }

  function canSelectStack(idx){return (streak>0||stacks[idx].length===maxStackLen)&&isMyTurn;}

  function handleLongPressStart(){longPressRef.current=window.setTimeout(()=>{isLongPress.current=true;setShowCodeInput(true);},3000);}
  function handleLongPressEnd(){clearTimeout(longPressRef.current);}

  function addLobbyPlayer(name){setLobbyPlayers(p=>p.length>=10?p:[...p,{id:`${Date.now()}-${Math.random()}`,name}]);}
  function removeLobbyPlayer(id){setLobbyPlayers(p=>p.filter(x=>x.id!==id));}
  function startFromLobby(){const names=lobbyPlayers.map(p=>p.name).slice(0,10);if(names.length<2)return;setPlayerCount(names.length);setPlayerNames(names);setScreen("landing");}
  async function connectBluetooth(){setBtError("");if(!navigator.bluetooth){setBtStatus("Nicht verfügbar");setBtError("Bluetooth nicht unterstützt.");return;}try{setBtStatus("Suche…");const d=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:["battery_service"]});addLobbyPlayer(d.name||`BT ${lobbyPlayers.length+1}`);setBtStatus(`${d.name||"Gerät"} verbunden`);}catch{setBtStatus("Abgebrochen");setBtError("Keine Verbindung.");}}

  const appUrl   = typeof window!=="undefined"?window.location.href:"";
  const lobbyUrl = mpRoom?`${window.location.origin}?join=${mpRoom}`:"";
  const pendingDrinkPick = drinkPickQueue.length>0?drinkPickQueue[0]:null;

  // ════════════════════════════════════════════════════════════════════════
  // MODALS
  // ════════════════════════════════════════════════════════════════════════
  const GlobalModals=()=>(
    <>
      <AnimatePresence>{showQR&&<QRModal url={appUrl}onClose={()=>setShowQR(false)}/>}</AnimatePresence>
      <AnimatePresence>{showLobbyQR&&mpRoom&&<QRModal url={lobbyUrl}onClose={()=>setShowLobbyQR(false)}/>}</AnimatePresence>
      <AnimatePresence>{modeInfoOpen&&PARTY_FULL_RULES[modeInfoOpen]&&(<Modal><div className="rounded-[38px] border-4 border-white/30 bg-zinc-950 p-6 text-white space-y-4 max-h-[80vh] overflow-y-auto"><div className="text-center"><div className="text-6xl">{PARTY_FULL_RULES[modeInfoOpen].emoji}</div><div className="text-3xl font-black">{PARTY_FULL_RULES[modeInfoOpen].title}</div></div><div className="space-y-2">{PARTY_FULL_RULES[modeInfoOpen].rules.map((r,i)=>(<div key={i}className="rounded-2xl bg-white/5 border border-white/10 p-3 text-sm flex gap-3"><span className="text-white/40">{i+1}.</span><span>{r}</span></div>))}</div><Btn onClick={()=>setModeInfoOpen(null)}className="w-full rounded-[22px] py-4 font-black bg-white text-black">Verstanden</Btn></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{screen==="game"&&pendingDrinkPick!==null&&isMyTurn&&(<DrinkPickerModal playerName={players[pendingDrinkPick]||`Spieler ${pendingDrinkPick+1}`}onPick={dk=>setDrinkForPlayer(pendingDrinkPick,dk)}/>)}</AnimatePresence>
      <AnimatePresence>{tankDrinkModal&&(<Modal><div className="rounded-[38px] border-4 border-orange-400/80 bg-zinc-950 p-6 text-center text-white space-y-4"><div className="text-6xl">🛢️💥</div><div className="text-3xl font-black">Tank voll!</div><div className="text-5xl font-black text-orange-300">{storageTank[tankDrinkModal.pi]} Schlucke</div><Btn onClick={()=>drinkTank(tankDrinkModal.pi)}className="w-full rounded-[22px] py-5 font-black bg-orange-400 text-black text-xl">Jetzt trinken!</Btn></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{perfectRun&&(<Modal><div className="rounded-[42px] border-4 border-yellow-300/80 bg-zinc-950 p-7 text-center text-white"><div className="text-7xl mb-3">👑🍻</div><div className="text-4xl font-black text-yellow-200">Perfect Run</div><div className="mt-5 grid grid-cols-2 gap-2"><Btn onClick={()=>setScreen("stats")}className="rounded-[22px] py-4 font-black bg-white/10 text-white border border-white/10">Statistik</Btn><Btn onClick={()=>{setPerfectRun(null);setScreen("playmode");}}className="rounded-[22px] py-4 font-black bg-white text-black">Neue Runde</Btn></div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{resetConfirm&&(<Modal><div className="rounded-[38px] border-4 border-yellow-300/70 bg-zinc-950 p-6 text-center text-white"><div className="text-6xl mb-3">⚠️</div><div className="text-3xl font-black">Zurück zur Demo?</div><div className="mt-5 grid grid-cols-2 gap-2"><Btn onClick={()=>setResetConfirm(false)}className="rounded-[22px] py-4 font-black bg-white/10 text-white border border-white/10">Nein</Btn><Btn onClick={handleRevokeLicense}className="rounded-[22px] py-4 font-black bg-white text-black">Ja</Btn></div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{lastRevealCard&&(<Modal><div className="rounded-[42px] border-4 border-white/70 bg-zinc-950 p-7 text-center text-white"><div className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-white/60">Neue Karte</div><div className="flex justify-center"><CardComp card={lastRevealCard.card}revealKey={lastRevealCard.key}bigReveal/></div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{playerAlert&&(<Modal><div className="rounded-[38px] border-4 border-cyan-300/50 bg-zinc-950 p-8 text-center text-white"><div className="text-6xl mb-3">🔥</div><div className="text-cyan-100 uppercase tracking-[0.35em] text-xs font-black">Jetzt {playerAlert.sub}</div><div className="mt-4 text-5xl font-black">{playerAlert.name}</div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{distributeInfo&&(<Modal><div className="rounded-[38px] border-4 border-yellow-300/70 bg-zinc-950 p-6 text-center text-white"><div className="text-6xl mb-3">🍻👑</div><div className="text-3xl font-black">10er Streak!</div><div className="mt-2 text-sm text-white/75">{distributeInfo.player} darf {distributeInfo.amount} verteilen.</div>{isMyTurn?(<div className="mt-5 grid grid-cols-2 gap-2">{players.map((p,i)=>(<Btn key={i}onClick={()=>{addSips(i,distributeInfo.amount);setDistributeInfo(null);}}className="rounded-2xl bg-white/10 border border-white/10 px-3 py-4 text-sm font-black text-white">{DRINKS[playerDrinks[i]||"bier"]?.emoji} {p||`Spieler ${i+1}`}</Btn>))}</div>):(<div className="mt-5 text-sm text-white/40 font-bold">⏳ {distributeInfo.player} entscheidet…</div>)}</div></Modal>)}</AnimatePresence>
      <AnimatePresence>{toastMsg&&(<Modal><div className={`${toastMsg.light?"bg-white text-black":"bg-zinc-900 text-white"} rounded-[38px] border-4 border-white/60 p-8 text-center`}><div className="text-6xl mb-3">{toastMsg.emoji}</div><div className="text-4xl font-black uppercase">{toastMsg.title}</div><div className="mt-3 text-lg font-black">{toastMsg.text}</div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{mistakeInfo&&(<Modal><div className="rounded-[38px] border-4 border-red-400/70 bg-zinc-950 p-5 text-center text-white"><div className="text-3xl font-black text-red-300">Falsch!</div><div className="my-4 rounded-2xl bg-white/10 p-3"><div className="text-sm text-white/60">Du sagtest</div><div className="text-2xl font-black">{guessLabel(mistakeInfo.guessed)}</div><div className="mt-2 text-sm text-white/60">Es war</div><div className="text-3xl font-black text-yellow-200">{guessLabel(mistakeInfo.actual)}</div></div><div className="flex justify-center flex-wrap gap-2">{mistakeInfo.cards.map((c,i)=><CardComp key={`mi-${c.id}-${i}`}card={c}small revealKey={mistakeInfo.key}/>)}</div></div></Modal>)}</AnimatePresence>
      <AnimatePresence>{penaltyInfo&&(<Modal><div className="rounded-[38px] border-4 border-white/70 bg-zinc-900 p-6 text-center text-white"><div className="text-6xl mb-2">{penaltyInfo.emoji||"💀"}</div><div className="text-4xl font-black">Verkackt</div><div className="mt-2 text-lg">{penaltyInfo.player} muss trinken!</div><div className="mt-4 text-4xl font-black text-yellow-200">+{penaltyInfo.amount} Schluck{penaltyInfo.amount===1?"":"e"}</div><div className="mt-1 text-sm text-white/70">{penaltyInfo.shielded?"Bodyguard geblockt":`${penaltyInfo.cards} Karten zerstört`}</div>{penaltyInfo.lifeLost&&<div className="mt-2 text-sm font-black text-red-300">💀 −1 Leben</div>}</div></Modal>)}</AnimatePresence>
    </>
  );

  // ── Player panel ─────────────────────────────────────────────────────────
  function PlayerPanel(){
    return(
      <div className="rounded-[30px] border border-white/10 bg-black/45 text-white backdrop-blur-2xl">
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2 text-center">
            {players.map((name,i)=>{
              const dk=playerDrinks[i]||"bier";const d=DRINKS[dk];
              const isActive=i===currentPlayer;const isMe=mpActive&&name===myName;
              return(
                <div key={i}className={`rounded-2xl px-3 py-3 min-h-[88px] flex flex-col items-center justify-center gap-1 ${isActive?"bg-white/15 border border-white/25":"bg-white/5"}`}>
                  <div className="w-full text-sm font-bold truncate">{d?.emoji} {name}{isMe?" 👤":""}</div>
                  <div className="font-black text-sm">🏆 {roundsDone[i]||0}</div>
                  <div className="text-sm">🥃 {sips[i]||0}</div>
                  {gameMode==="party"&&partySubMode==="Hardcore"&&<div className="text-xs font-black text-red-200">{Array.from({length:lives[i]??livesPerPlayer}).map(()=>"❤️").join("")||"☠️"}</div>}
                  {gameMode==="party"&&partySubMode==="Storage"&&<div className={`text-xs font-black ${storageTank[i]>=STORAGE_MAX?"text-orange-300":"text-white/60"}`}>🛢️ {storageTank[i]||0}/{STORAGE_MAX}</div>}
                  {(bodyguards[i]||0)>0&&<div className="text-xs font-black text-cyan-200">🛡️ {bodyguards[i]}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Stacks ───────────────────────────────────────────────────────────────
  function StacksView(){
    return(
      <div className="space-y-3">
        {stacks.map((stack,idx)=>{
          const isActive=activeStack===idx;const sel=canSelectStack(idx);
          return(
            <button key={idx}disabled={!sel}onClick={()=>sel&&setActiveStack(idx)}
              style={{touchAction:"manipulation",WebkitTapHighlightColor:"transparent"}}
              className={`w-full rounded-[30px] p-4 text-left border border-white/10 transition-all ${isActive?"bg-white/10 ring-2 ring-yellow-300/50":"bg-black/35"} ${sel?"":"opacity-40"}`}>
              <div className="flex justify-between gap-3 mb-4">
                <div><div className="font-black text-2xl text-white">Stapel {idx+1}</div><div className="mt-1 text-sm text-white/70">{stack.length} Karte{stack.length===1?"":"n"}{stack.length===maxStackLen?" · längste":""}</div></div>
                <div className="text-xs font-black text-yellow-200">{isActive?chooseSide||"aktiv":""}</div>
              </div>
              <div className="overflow-x-auto pb-1"style={{WebkitOverflowScrolling:"touch",touchAction:"pan-x"}}>
                <div className={`flex gap-2 ${stack.length<=4?"justify-center":"min-w-max"}`}>
                  {stack.map((card,ci)=>(<CardComp key={`${card.id}-${ci}`}card={card}small revealKey={card.id===lastRevealId?1:0}active={isActive&&(chooseSide==="left"?ci===0:ci===stack.length-1)}/>))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // ── Action panel ─────────────────────────────────────────────────────────
  function ActionPanel(){
    const style=PARTY_STYLES[partySubMode]||PARTY_STYLES.Hardcore;
    const panelClass=isEndgame?"border-yellow-300/80 bg-yellow-300/10":gameMode==="party"?`${style.border} bg-gradient-to-br ${style.bg} ${style.glow}`:isDoubleStreak?"border-yellow-300/70 bg-yellow-300/10":isStreakDone?"border-white/30 bg-white/10":"border-white/10 bg-black/45";

    // SPECTATOR MODE — not your turn
    if(!isMyTurn){
      const curName=players[currentPlayer]||"?";
      return(
        <motion.div initial={{opacity:0,y:6}}animate={{opacity:1,y:0}}transition={{duration:0.35}}
          className={`rounded-[32px] border backdrop-blur-2xl overflow-hidden ${panelClass}`}>
          <div className="p-5">
            {/* Who's playing */}
            <div className="text-center mb-4">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Gerade am Zug</div>
              <div className="text-3xl font-black text-white">{curName}</div>
              <div className="text-sm text-white/40 mt-1">Serie: {streak}/{targetStreak}</div>
            </div>

            {/* Who am I waiting for */}
            {players.length>0&&(
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3 text-center mb-4">
                <div className="text-xs text-white/40 mb-1">Du bist dran als</div>
                <div className="text-lg font-black text-white">{myName}</div>
                <div className="mt-2 flex justify-center gap-1">
                  {players.map((p,i)=>(
                    <div key={i}style={{width:8,height:8,borderRadius:"50%",background:i===currentPlayer?"white":"rgba(255,255,255,0.2)",transition:"background 0.3s"}}/>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-1 opacity-30 mt-2"><DeckBack/><DeckBack/></div>
          </div>
        </motion.div>
      );
    }

    // PURE SPECTATOR (not in players list)
    if(isSpectator){
      return(
        <motion.div initial={{opacity:0,y:6}}animate={{opacity:1,y:0}}transition={{duration:0.35}}
          className="rounded-[32px] border border-white/10 bg-black/45 backdrop-blur-2xl">
          <div className="p-5 text-center space-y-3">
            <div className="text-4xl">👀</div>
            <div className="text-lg font-black text-white">{players[currentPlayer]} ist dran</div>
            <div className="text-sm text-white/40">Du schaust zu</div>
            <div className="flex justify-center gap-1 opacity-30"><DeckBack/><DeckBack/></div>
          </div>
        </motion.div>
      );
    }

    // ACTIVE PLAYER
    return(
      <div className={`rounded-[32px] border text-white backdrop-blur-2xl ${panelClass}`}>
        <div className="p-4 space-y-3 relative">
          <div className={`absolute -top-2 right-3 rounded-full px-3 py-1 text-[10px] font-black uppercase ${gameMode==="party"?style.badge:"bg-yellow-300 text-black"}`}>
            {gameMode==="party"?`${style.emoji} ${partySubMode}`:"Klassisch"}
          </div>
          <div className="flex items-center justify-between text-sm text-white pt-2">
            <span>Serie: <b>{streak}/{targetStreak}</b></span>
            <span>{currentDrinkObj.emoji} {players[currentPlayer]}</span>
            <span>Deck: <b>{deckCount}</b></span>
          </div>
          {gameMode==="party"&&partySubMode==="Storage"&&<StorageTank amount={storageTank[currentPlayer]||0}drinkKey={currentDrink}onDrink={()=>drinkTank(currentPlayer)}/>}
          {chooseSide?(
            <div className="space-y-3">
              <div className="flex justify-between items-center rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                <div className="text-sm font-black">Anlegen: <span className="text-yellow-200">{chooseSide==="left"?"links":"rechts"}</span></div>
                <Btn onClick={()=>setChooseSide(null)}className="rounded-xl bg-white/10 px-3 py-2 text-xs font-black">ändern</Btn>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["higher","same","lower"].map(g=>(<Btn key={g}onClick={()=>makeGuess(g)}className="rounded-[16px] min-h-[56px] text-sm font-black bg-white text-black active:scale-[0.95] transition-all">{g==="higher"?"Höher":g==="same"?"Gleich":"Tiefer"}</Btn>))}
              </div>
            </div>
          ):(
            <div className="space-y-3">
              <div className="text-lg font-black text-center">Wo anlegen?</div>
              <div className="grid grid-cols-2 gap-3">
                <Btn onClick={()=>setChooseSide("left")}className="rounded-[20px] min-h-[68px] bg-white text-black font-black flex flex-col items-center justify-center gap-1"><ArrowLeft size={22}/>Links</Btn>
                <Btn onClick={()=>setChooseSide("right")}className="rounded-[20px] min-h-[68px] bg-white text-black font-black flex flex-col items-center justify-center gap-1"><ArrowRight size={22}/>Rechts</Btn>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Btn disabled={!isStreakDone}onClick={handlePass}className="rounded-[24px] py-6 font-black bg-white/10 text-white border border-white/10 disabled:opacity-40">
              Abgeben{isStreakDone?"":" ab "+targetStreak}
            </Btn>
            {deckMode==="extreme"?(
              <Btn disabled={!isDoubleStreak}onClick={()=>{if(!isDoubleStreak)return;const o=[{t:"Alle trinken",e:"🍻",a:()=>addSipsAll(sipsPerCard)},{t:"Links trinkt",e:"⬅️",a:()=>addSips((currentPlayer-1+players.length)%players.length,sipsPerCard)},{t:"Rechts trinkt",e:"➡️",a:()=>addSips((currentPlayer+1)%players.length,sipsPerCard)}];const p=o[Math.floor(Math.random()*o.length)];p.a();showToast(p.t,p.e,"");}}
                className="rounded-[24px] py-6 font-black bg-white/10 text-white border border-white/10 disabled:opacity-40 flex items-center justify-center gap-2">
                <Zap size={18}/>Rad
              </Btn>
            ):(
              <div className="rounded-[24px] py-6 font-black bg-white/5 text-white/40 border border-white/10 flex items-center justify-center gap-2"><Zap size={18}/>Extreme</div>
            )}
          </div>
          <div className="flex justify-center gap-1 opacity-70"><DeckBack/><DeckBack/></div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════════════════

  if(screen==="loading")return(<div className="fixed inset-0 bg-black text-white font-sans flex items-center justify-center overflow-hidden"><div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center gap-8 text-center"><motion.div initial={{opacity:0,scale:0.55,rotate:-18,y:80}}animate={{opacity:1,scale:[0.55,1.08,1],rotate:[-18,5,-3],y:[80,-15,0]}}transition={{duration:1.15}}><motion.div animate={{y:[0,-10,0],rotate:[-4,4,-4]}}transition={{duration:2.6,repeat:Infinity}}><KingCard size="big"/></motion.div></motion.div><div><div className="text-5xl font-black">HERZ KÖNIG</div><div className="text-2xl font-black text-white/75 mt-2">bereitet vor…</div></div><div className="w-full rounded-full border border-white/15 bg-white/10 p-1 overflow-hidden"><motion.div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-white to-red-500"initial={{width:"0%"}}animate={{width:"100%"}}transition={{duration:3}}/></div></div></div>);

  if(screen==="locked")return(<div className="fixed inset-0 bg-black text-white font-sans flex items-center justify-center p-5"><GlobalModals/><div className="w-full max-w-md rounded-[34px] border border-white/10 bg-black/65 p-6 text-center space-y-5 backdrop-blur-2xl"><div className="text-6xl">🔒</div><h1 className="text-4xl font-black">Demo beendet</h1><p className="text-white/70">{MAX_FREE_ROUNDS} Runden gespielt.</p><input value={codeInput}onChange={e=>{setCodeInput(e.target.value);setCodeError("");}}placeholder="Zugangscode"autoCorrect="off"autoCapitalize="none"spellCheck={false}className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none text-lg"/>{codeError&&<div className="text-red-300 font-black">{codeError}</div>}<Btn onClick={handleCodeCheck}className="w-full rounded-[22px] py-5 font-black bg-white text-black text-lg">Code prüfen</Btn><Btn onClick={()=>setScreen("home")}className="w-full rounded-[26px] py-5 font-black bg-white/10 text-white border border-white/10">Zurück</Btn></div></div>);

  if(screen==="home")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]"/><div className="mx-auto max-w-md min-h-full flex flex-col justify-center gap-5 relative z-10 p-5 py-10"><motion.div initial={{y:20,opacity:0}}animate={{y:0,opacity:1}}className="text-center space-y-5"><KingCard animated/><div><h1 className="text-6xl font-black tracking-[-0.08em]">ANLEGEN</h1><p className="mt-2 text-sm font-bold tracking-[0.25em] text-white/70">HIGH • LOW • SAME</p>{isUnlocked?(<div className="mx-auto mt-4 max-w-xs rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.25em] text-white/70">Unlimited aktiv</div>):(<div className="mx-auto mt-4 max-w-xs rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-center"><div className="text-xs font-black uppercase tracking-[0.25em] text-yellow-200">Demo</div><div className="mt-1 text-sm font-bold">{Math.max(MAX_FREE_ROUNDS-freeRoundsUsed,0)} von {MAX_FREE_ROUNDS} Runden übrig</div></div>)}</div></motion.div><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-4"><Btn onPointerDown={handleLongPressStart}onPointerUp={handleLongPressEnd}onPointerLeave={handleLongPressEnd}onPointerCancel={handleLongPressEnd}onClick={()=>{if(isLongPress.current){isLongPress.current=false;return;}if(!isUnlocked&&freeRoundsUsed>=MAX_FREE_ROUNDS){setScreen("locked");return;}setScreen("playmode");}}className="w-full rounded-[26px] py-7 text-xl font-black bg-white text-black flex items-center justify-center gap-2">▶ Neues Spiel</Btn><AnimatePresence>{showCodeInput&&(<motion.div initial={{opacity:0,y:12}}animate={{opacity:1,y:0}}className="rounded-[28px] border border-white/10 bg-white/5 p-4 space-y-3"><div className="text-center text-sm font-black">Unlimited aktivieren</div><input value={codeInput}onChange={e=>{setCodeInput(e.target.value);setCodeError("");}}placeholder="Zugangscode"autoCorrect="off"autoCapitalize="none"spellCheck={false}className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none"/>{codeError&&<div className="text-center text-red-300 font-black text-sm">{codeError}</div>}<Btn onClick={handleCodeCheck}className="w-full rounded-[22px] py-4 font-black bg-white text-black">Code prüfen</Btn></motion.div>)}</AnimatePresence>{isUnlocked&&<Btn onClick={()=>setResetConfirm(true)}className="w-full rounded-[26px] py-5 font-black bg-white/5 text-white/70 border border-white/10">Zurück zur Demo</Btn>}<Btn onClick={()=>setScreen("rules")}className="w-full rounded-[26px] py-6 text-lg font-black bg-white/10 text-white border border-white/10 flex items-center justify-center gap-2"><BookOpen size={22}/>Regeln</Btn><Btn onClick={()=>setShowQR(true)}className="w-full rounded-[26px] py-5 font-black bg-white/10 text-white border border-white/10 flex items-center justify-center gap-2"><QrCode size={20}/>App teilen (QR)</Btn>{onExit&&<Btn onClick={onExit}className="w-full rounded-[26px] py-5 font-black bg-white/5 text-white/50 border border-white/10 flex items-center justify-center gap-2">← Zur Spielübersicht</Btn>}</div></div></div>);

  if(screen==="rules")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8"><NavBar onHome={()=>setScreen("home")}onRules={()=>{}}/><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-5"><div className="text-center"><div className="text-5xl mb-2">📜</div><h1 className="text-4xl font-black">Regeln</h1></div><div className="grid gap-4 text-white/90 text-sm">{[["Ziel","Schaffe die eingestellte Anzahl richtiger Ansagen hintereinander."],["Fehler","Die ganze Kette fliegt raus. Schlucke = Karten × Einstellung."],["Getränk","Bier = volle Schlucke · Wein/Vodka = halbe Schlucke · Wasser = keine"],["Specials","Herz König & Herz Dame = alle trinken · Joker = Safe oder Chaos"],["Perfect Run","Alle Karten ohne Fehler = Perfect Run! 👑"]].map(([t,x])=>(<div key={t}className="rounded-3xl bg-white/5 border border-white/10 p-4"><b>{t}:</b> {x}</div>))}</div><Btn onClick={()=>setScreen("playmode")}className="w-full rounded-[26px] py-6 font-black bg-white text-black">Spiel einstellen</Btn></div></div></div>);

  if(screen==="stats")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8"><NavBar onHome={()=>setScreen("home")}onRules={()=>setScreen("rules")}/><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-4"><h1 className="text-4xl font-black text-center">Statistiken</h1>{players.map((n,i)=>{const d=DRINKS[playerDrinks[i]||"bier"];return(<div key={i}className="rounded-3xl bg-white/5 border border-white/10 p-4"><b>{d?.emoji} {n||`Spieler ${i+1}`}</b><div>🏆 {roundsDone[i]||0} Runden · 🥃 {sips[i]||0} Schlucke ({d?.label})</div></div>);})}<Btn onClick={()=>setScreen("playmode")}className="w-full rounded-[26px] py-6 font-black bg-white text-black">Neue Runde</Btn></div></div></div>);

  if(screen==="playmode")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md min-h-full flex flex-col justify-center gap-5 z-10 relative p-5"><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-5 text-center"><div className="text-5xl">🎮</div><h1 className="text-4xl font-black">Spielart wählen</h1><Btn onClick={()=>setScreen("landing")}className="w-full rounded-[28px] bg-white text-black p-6 text-left"><div className="text-2xl font-black">Lokal spielen</div><div className="mt-1 text-sm text-black/60">Ein Gerät für alle.</div></Btn><Btn onClick={()=>setScreen("onlineSetup")}className="w-full rounded-[28px] bg-white/10 text-white border border-white/10 p-6 text-left"><div className="text-2xl font-black flex items-center gap-2">🔥 Online Multiplayer</div><div className="mt-1 text-sm text-white/60">Jeder auf eigenem Gerät — Live-Sync.</div></Btn><Btn onClick={()=>setScreen("home")}className="w-full rounded-[26px] py-5 font-black bg-white/5 text-white/70 border border-white/10">Zurück</Btn></div></div></div>);

  if(screen==="onlineSetup")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8"><NavBar onHome={()=>setScreen("home")}onRules={()=>setScreen("rules")}/><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-5 text-center"><div className="text-5xl">🌐</div><h1 className="text-4xl font-black">Online Modus</h1><Btn onClick={()=>setScreen("bluetoothInfo")}className="w-full rounded-[28px] bg-white/10 text-white border border-white/10 p-6 text-left"><div className="text-2xl font-black">Bluetooth</div><div className="text-sm text-white/60">Geräte koppeln.</div></Btn><Btn onClick={()=>setScreen("internetInfo")}className="w-full rounded-[28px] bg-white/10 text-white border border-white/10 p-6 text-left"><div className="text-2xl font-black">🔥 Internet Lobby</div><div className="text-sm text-white/60">Firebase Echtzeit-Sync.</div></Btn><Btn onClick={()=>setScreen("playmode")}className="w-full rounded-[26px] py-5 font-black bg-white/5 text-white/70 border border-white/10">Zurück</Btn></div></div></div>);

  if(screen==="bluetoothInfo")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8"><NavBar onHome={()=>setScreen("home")}onRules={()=>setScreen("rules")}/><div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-5 text-center"><div className="text-6xl">📡</div><h1 className="text-4xl font-black">Bluetooth Lobby</h1><div className="rounded-3xl bg-white/5 border border-white/10 p-4 text-left"><div className="text-xs uppercase tracking-[0.25em] text-white/45 font-black">Status</div><div className="text-lg font-black">{btStatus}</div>{btError&&<div className="text-sm text-yellow-200 mt-1">{btError}</div>}</div><Btn onClick={connectBluetooth}className="w-full rounded-[26px] py-6 font-black bg-white text-black flex items-center justify-center gap-2"><Bluetooth size={22}/>BT koppeln</Btn><Btn onClick={()=>addLobbyPlayer(`Spieler ${lobbyPlayers.length+1}`)}className="w-full rounded-[26px] py-5 font-black bg-white/10 text-white border border-white/10 flex items-center justify-center gap-2"><UserPlus size={20}/>Spieler hinzufügen</Btn>{lobbyPlayers.map((p,i)=>(<div key={p.id}className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 flex justify-between items-center"><b>{i+1}. {p.name}</b><Btn onClick={()=>removeLobbyPlayer(p.id)}className="p-2 rounded-xl bg-white/10"><Trash2 size={16}/></Btn></div>))}<Btn disabled={lobbyPlayers.length<2}onClick={startFromLobby}className="w-full rounded-[26px] py-6 font-black bg-white text-black disabled:opacity-40">Mit Lobby starten</Btn></div></div></div>);

  // ── INTERNET LOBBY (Firebase) ────────────────────────────────────────────
  if(screen==="internetInfo"){
    const needName = !myName.trim();
    return(
      <div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}>
        <GlobalModals/>
        <div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8">
          <NavBar onHome={async()=>{await handleLeaveRoom();setScreen("home");}}onRules={()=>setScreen("rules")}/>

          <div className="rounded-[34px] border border-white/10 bg-black/45 backdrop-blur-2xl overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="text-center">
                <div className="text-5xl mb-2">🔥</div>
                <h1 className="text-3xl font-black">Online Lobby</h1>
              </div>

              {/* Step 1: Name */}
              {needName && (
                <div className="rounded-[28px] bg-white/5 border border-white/10 p-4 space-y-3">
                  <div className="text-center text-sm font-black text-white/70">Dein Name</div>
                  <input value={nameInput}onChange={e=>setNameInput(e.target.value)}onKeyDown={e=>{if(e.key==="Enter"&&nameInput.trim()){const n=nameInput.trim();localStorage.setItem("anlegen_pname",n);setMyName(n);}}}placeholder="Name eingeben…"autoFocus className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none text-xl"/>
                  <Btn onClick={()=>{const n=nameInput.trim();if(n){localStorage.setItem("anlegen_pname",n);setMyName(n);}}}disabled={!nameInput.trim()}className="w-full rounded-[22px] py-4 font-black bg-white text-black disabled:opacity-40">Bestätigen →</Btn>
                </div>
              )}

              {/* Step 2: Create or join (when not yet in a room) */}
              {!needName && !mpActive && (
                <>
                  <div className="text-center text-sm text-white/50">Spielst als <b className="text-white">{myName}</b> <button onClick={()=>{localStorage.removeItem("anlegen_pname");setMyName("");}}className="text-white/30 text-xs underline ml-1">ändern</button></div>

                  {/* CREATE */}
                  <Btn onClick={handleCreateRoom}
                    className="w-full rounded-[28px] bg-white text-black p-5 text-left active:scale-[0.98] transition-all">
                    <div className="text-xl font-black flex items-center gap-2"><Wifi size={20}/>Raum erstellen</div>
                    <div className="text-sm text-black/60 mt-1">Du bist Host. Teile den Code mit deinen Freunden.</div>
                  </Btn>

                  {/* JOIN */}
                  <div className="rounded-[28px] bg-white/5 border border-white/10 p-4 space-y-3">
                    <div className="text-sm font-black text-center text-white/70">Raum beitreten</div>
                    <input value={mpJoinCode}onChange={e=>setMpJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,""))}onKeyDown={e=>e.key==="Enter"&&handleJoinRoom()}placeholder="ANL-XXXX"className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center text-white font-black outline-none text-2xl tracking-widest"/>
                    {mpJoinErr&&<div className="text-red-300 font-black text-sm text-center">{mpJoinErr}</div>}
                    <Btn onClick={handleJoinRoom}disabled={!mpJoinCode.trim()||mpJoining}className="w-full rounded-[22px] py-4 font-black bg-white/20 text-white disabled:opacity-40">
                      {mpJoining?"Suche Raum…":"Beitreten →"}
                    </Btn>
                  </div>
                </>
              )}

              {/* Step 3: In lobby */}
              {!needName && mpActive && (
                <>
                  {/* ROOM CODE — always visible and prominent */}
                  <motion.div
                    initial={{scale:0.9,opacity:0}}animate={{scale:1,opacity:1}}
                    className="rounded-[28px] bg-white text-black p-5 text-center space-y-3">
                    <div className="text-xs uppercase tracking-[0.3em] font-black text-black/40">Raum-Code</div>
                    <div className="text-5xl font-black tracking-widest">{mpRoom}</div>
                    <div className="flex gap-2 justify-center">
                      <Btn onClick={()=>{navigator.clipboard?.writeText(lobbyUrl).catch(()=>{});setCopiedCode(true);setTimeout(()=>setCopiedCode(false),1600);}}
                        className="rounded-2xl bg-black/10 px-4 py-2 text-sm font-black flex items-center gap-1">
                        {copiedCode?"✓ Kopiert!":"🔗 Link kopieren"}
                      </Btn>
                      <Btn onClick={()=>setShowLobbyQR(true)}
                        className="rounded-2xl bg-black/10 px-4 py-2 text-sm font-black flex items-center gap-1">
                        <QrCode size={15}/>QR
                      </Btn>
                    </div>
                    <div className="text-xs text-black/40 font-bold">Freunde scannen QR oder geben den Code ein</div>
                  </motion.div>

                  {/* Visible Firebase error — so it's debuggable on a phone */}
                  {mpCreateErr && (
                    <div className="rounded-2xl bg-red-500/15 border border-red-400/40 p-3 text-center">
                      <div className="text-xs font-black text-red-300 uppercase tracking-widest mb-1">Verbindungsfehler</div>
                      <div className="text-sm font-bold text-red-200 break-words">{mpCreateErr}</div>
                    </div>
                  )}

                  {/* Players in lobby (live) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-white/40">Spieler ({mpLobby.length})</span>
                      <motion.div animate={{opacity:[0.4,1,0.4]}}transition={{duration:1.5,repeat:Infinity}}className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"/><span className="text-xs text-green-400 font-bold">LIVE</span></motion.div>
                    </div>
                    {mpLobby.map((p,i)=>(
                      <motion.div key={p.id}initial={{x:-20,opacity:0}}animate={{x:0,opacity:1}}
                        className={`rounded-2xl px-4 py-3 flex items-center gap-3 ${p.name===myName?"bg-white/20 border border-white/30":"bg-white/5 border border-white/10"}`}>
                        <div className="text-lg">{i===0?"👑":"👤"}</div>
                        <span className="font-black flex-1">{p.name}</span>
                        {p.name===myName&&<span className="text-xs text-white/40 font-bold">Du</span>}
                        {i===0&&p.name!==myName&&<span className="text-xs text-yellow-300 font-bold">Host</span>}
                      </motion.div>
                    ))}
                    {mpLobby.length<2&&<div className="text-center text-xs text-white/30 py-2">Warte auf weitere Spieler…</div>}
                  </div>

                  {/* Host: game settings + start */}
                  {mpIsHost && (
                    <>
                      <div className="rounded-[28px] bg-white/5 border border-white/10 p-4 space-y-3">
                        <div className="text-sm font-black text-center">Spieleinstellungen</div>
                        <div className="grid grid-cols-2 gap-2">
                          <Btn onClick={()=>setGameMode("classic")}className={`rounded-2xl py-3 text-sm font-black ${gameMode==="classic"?"bg-white text-black":"bg-white/10 text-white border border-white/10"}`}>Klassisch</Btn>
                          <Btn onClick={()=>setGameMode("party")}className={`rounded-2xl py-3 text-sm font-black ${gameMode==="party"?"bg-white text-black":"bg-white/10 text-white border border-white/10"}`}>Party</Btn>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white/70">Streak-Ziel:</span>
                          <div className="flex gap-1">{[2,3,4].map(n=><Btn key={n}onClick={()=>setTargetStreak(n)}className={`w-10 h-10 rounded-xl text-sm font-black ${targetStreak===n?"bg-white text-black":"bg-white/10 text-white"}`}>{n}</Btn>)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white/70">Schlucke/Karte:</span>
                          <div className="flex gap-1">{[1,2,3].map(n=><Btn key={n}onClick={()=>setSipsPerCard(n)}className={`w-10 h-10 rounded-xl text-sm font-black ${sipsPerCard===n?"bg-white text-black":"bg-white/10 text-white"}`}>{n}</Btn>)}</div>
                        </div>
                      </div>

                      <Btn onClick={handleStartMpGame}disabled={mpLobby.length<2}
                        className="w-full rounded-[26px] py-7 text-xl font-black bg-white text-black disabled:opacity-40 active:scale-[0.97] transition-all">
                        ▶ Spiel starten ({mpLobby.length} Spieler)
                      </Btn>
                    </>
                  )}

                  {/* Guest: waiting */}
                  {!mpIsHost && mpStatus==="lobby" && (
                    <div className="rounded-[26px] py-6 bg-white/5 border border-white/10 text-center">
                      <motion.div animate={{opacity:[0.5,1,0.5]}}transition={{duration:1.5,repeat:Infinity}}className="text-white/60 font-black">⏳ Host startet das Spiel…</motion.div>
                    </div>
                  )}

                  <Btn onClick={handleLeaveRoom}className="w-full rounded-[26px] py-4 text-sm font-black bg-white/5 text-white/40 border border-white/10">Lobby verlassen</Btn>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(screen==="landing")return(<div className="fixed inset-0 bg-black text-white font-sans overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}><GlobalModals/><div className="mx-auto max-w-md space-y-4 z-10 relative p-5 pt-8"><NavBar onHome={()=>setScreen("home")}onRules={()=>setScreen("rules")}/><div className="rounded-[32px] border border-white/10 bg-black/45 backdrop-blur-2xl p-6 space-y-7 text-center"><KingCard animated/><h1 className="text-5xl font-black tracking-[-0.08em]">ANLEGEN</h1><div className="space-y-4 rounded-[30px] bg-white/5 border border-white/10 p-5"><label className="font-black text-lg">Spielmodus</label><div className="grid grid-cols-2 gap-2"><ModeBtn active={gameMode==="classic"}onClick={()=>{setGameMode("classic");setDeckMode("classic");}}>Klassisch</ModeBtn><ModeBtn active={gameMode==="party"}onClick={()=>{setGameMode("party");setDeckMode("extreme");}}>Party</ModeBtn></div>{gameMode==="party"&&(<div className="grid grid-cols-2 gap-2 pt-2">{Object.keys(PARTY_DESCRIPTIONS).map(mode=>(<div key={mode}className={`relative rounded-2xl border ${partySubMode===mode?"bg-white text-black border-white":"bg-white/10 text-white border-white/10"}`}><Btn onClick={()=>setPartySubMode(mode)}className="w-full py-3 px-2 text-sm font-black rounded-2xl">{PARTY_STYLES[mode]?.emoji} {mode}</Btn><Btn onClick={e=>{e.stopPropagation();setModeInfoOpen(mode);}}className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center border-2 ${partySubMode===mode?"bg-black text-white border-white":"bg-white text-black border-black"} shadow-lg`}><Info size={14}/></Btn></div>))}</div>)}<div className="rounded-2xl bg-black/25 border border-white/10 p-3 text-xs text-white/75">{gameMode==="party"?PARTY_DESCRIPTIONS[partySubMode]:"Klassisch = normales ANLEGEN."}</div></div><div className="space-y-4 rounded-[30px] bg-white/5 border border-white/10 p-5"><label className="font-black flex justify-between text-lg"><span className="flex gap-2"><Users size={18}/>Spieler</span><span className="text-3xl">{playerCount}</span></label><input type="range"min="1"max="10"value={playerCount}onChange={e=>{const n=Number(e.target.value);setPlayerCount(n);setPlayerNames(p=>Array.from({length:n},(_,i)=>p[i]||""));}}className="w-full accent-white"/><div className="flex justify-between text-xs font-black text-white/70"><span>1</span><span>5</span><span>10</span></div></div><div className="space-y-3"><label className="font-black text-lg">Namen</label>{Array.from({length:playerCount},(_,i)=>(<input key={i}value={playerNames[i]||""}placeholder={`Spieler ${i+1}`}onFocus={e=>e.target.select()}onChange={e=>{const n=[...playerNames];n[i]=e.target.value;setPlayerNames(n);}}className="w-full rounded-[22px] placeholder:text-white/35 border border-white/10 bg-white/5 text-white px-5 py-4 font-semibold text-center outline-none text-lg"/>))}</div>{gameMode==="party"&&partySubMode==="Hardcore"&&(<div className="rounded-[30px] bg-red-950/30 p-5 border border-red-400/30 space-y-4"><label className="font-black flex justify-between text-lg"><span>Leben</span><span className="text-3xl">{livesPerPlayer}</span></label><input type="range"min="1"max="5"value={livesPerPlayer}onChange={e=>setLivesPerPlayer(Number(e.target.value))}className="w-full accent-red-400"/></div>)}<div className="space-y-4"><label className="font-black text-lg">Streak zum Abgeben</label><div className="grid grid-cols-3 gap-2">{[2,3,4].map(n=><ModeBtn key={n}active={targetStreak===n}onClick={()=>setTargetStreak(n)}>{n}</ModeBtn>)}</div></div><div className="rounded-[30px] bg-white/5 p-5 border border-white/10 space-y-4"><label className="font-bold flex justify-between"><span>Schlucke/Karte</span><span className="text-2xl">{sipsPerCard}</span></label><input type="range"min="1"max="4"value={sipsPerCard}onChange={e=>setSipsPerCard(Number(e.target.value))}className="w-full accent-white"/></div><Btn onClick={startGame}className="w-full rounded-[26px] py-7 text-xl font-black bg-white text-black active:scale-[0.97]">Spiel starten</Btn></div></div></div>);

  // ── Turn status pill — replaces the old blinking badges with a single,
  // calm, cross-fading indicator: gold "Du bist am Zug" or muted "Spectator".
  function LiveDot(){
    return(<motion.span animate={{scale:[1,1.4,1],opacity:[0.5,1,0.5]}}transition={{duration:2.2,repeat:Infinity,ease:"easeInOut"}}className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"/>);
  }
  function TurnStatusBar(){
    if(!mpActive) return null;
    const amTurn = isMyTurn && !isSpectator;
    return(
      <div className="relative h-[54px]">
        <AnimatePresence mode="wait">
          {amTurn?(
            <motion.div key="turn"
              initial={{opacity:0,y:-8,scale:0.96}}animate={{opacity:1,y:0,scale:1}}exit={{opacity:0,y:-8,scale:0.96}}
              transition={{type:"spring",stiffness:340,damping:26}}
              className="absolute inset-x-0 rounded-[22px] bg-gradient-to-r from-yellow-300 to-amber-400 text-black px-5 py-3 flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(250,204,21,0.3)]">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-black uppercase tracking-wide">Du bist am Zug</span>
              <LiveDot/>
            </motion.div>
          ):(
            <motion.div key="spectator"
              initial={{opacity:0,y:-8,scale:0.96}}animate={{opacity:1,y:0,scale:1}}exit={{opacity:0,y:-8,scale:0.96}}
              transition={{type:"spring",stiffness:340,damping:26}}
              className="absolute inset-x-0 rounded-[22px] bg-white/8 border border-white/15 text-white/80 px-5 py-3 flex items-center justify-center gap-2 backdrop-blur-xl">
              <Eye size={16}className="text-white/50"/>
              <span className="text-sm font-bold">Spectator Mode · <b className="text-white">{players[currentPlayer]}</b> ist dran</span>
              <LiveDot/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── GAME ────────────────────────────────────────────────────────────────
  return(
    <div className="fixed inset-0 bg-black/70 text-white select-none font-sans overflow-hidden"
      style={{paddingTop:"env(safe-area-inset-top,0px)",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
      <BeerFluid level={Math.min(1,discard.length/Math.max(deck.length+discard.length,1))}drinkKey={currentDrink}/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]"/>
      <GlobalModals/>

      <div className="absolute inset-0 overflow-y-auto"style={{WebkitOverflowScrolling:"touch"}}>
        <div className="mx-auto max-w-md space-y-4 z-10 relative px-4 pb-6"style={{paddingTop:"max(1.25rem,env(safe-area-inset-top))"}}>
          <NavBar onHome={()=>setScreen("home")}onRules={()=>setScreen("rules")}/>
          <TurnStatusBar/>
          <div className="flex items-center justify-between gap-4 pt-1">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/60">Am Zug</div>
              <div className="text-3xl font-black truncate">{currentDrinkObj.emoji} {players[currentPlayer]}{mpActive&&players[currentPlayer]===myName?" 👤":""}</div>
            </div>
            <div className="flex gap-2">
              <Btn className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"onClick={()=>setChooseSide(null)}><Trash2 size={20}/></Btn>
              <Btn className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"onClick={startGame}><RefreshCw size={22}/></Btn>
              <Btn className="h-12 w-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"onClick={()=>setShowQR(true)}><QrCode size={20}/></Btn>
            </div>
          </div>
          <PlayerPanel/>
          <StacksView/>
          <ActionPanel/>
        </div>
      </div>
    </div>
  );
}
