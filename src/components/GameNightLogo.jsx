import { useState } from "react";
import { motion } from "framer-motion";

// Shows the real uploaded "GAME NIGHT" logo (public/logo.png) with an
// animated reveal + soft idle glow. Falls back to a hand-drawn SVG
// recreation automatically if logo.png hasn't been added to the project yet,
// so nothing breaks in the meantime.
export default function GameNightLogo({ size = 220, animated = true }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) return <FallbackLogo size={size} animated={animated} />;

  return (
    <motion.div
      style={{ width: size, height: size, position: "relative" }}
      initial={animated ? { opacity: 0, scale: 0.55, y: 24 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 190, damping: 18, duration: 0.9 }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.45) 0%, transparent 70%)" }}
          animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.img
        src="/logo.png"
        alt="Game Night"
        onError={() => setImgFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "contain", position: "relative" }}
        animate={animated ? { rotate: [-2, 2, -2], y: [0, -4, 0] } : {}}
        transition={animated ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : {}}
      />
    </motion.div>
  );
}

// Original hand-drawn recreation — kept as an automatic fallback.
function FallbackLogo({ size, animated }) {
  const ring = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: "easeOut" } },
  };
  const pop = (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.5, y: 12 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 18, delay } },
  });
  const fade = (delay = 0) => ({
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
  });

  return (
    <motion.svg width={size} height={size} viewBox="0 0 512 512" initial={animated ? "hidden" : "show"} animate="show">
      <circle cx="256" cy="256" r="248" fill="#000" />
      <motion.circle cx="256" cy="256" r="238" fill="none" stroke="#D4AF37" strokeWidth="10" variants={ring} />

      <motion.g variants={pop(0.25)} transform="translate(186,168) rotate(-13)">
        <rect x="-46" y="-64" width="92" height="130" rx="12" fill="#fff" />
        <text x="-33" y="-32" fontFamily="Georgia, serif" fontSize="30" fontWeight="700" fill="#111">A</text>
        <text x="-30" y="34" fontFamily="Arial" fontSize="58" fill="#111">♠</text>
      </motion.g>

      <motion.g variants={pop(0.4)} transform="translate(272,164) rotate(11)">
        <rect x="-46" y="-64" width="92" height="130" rx="12" fill="#fff" />
        <text x="-33" y="-32" fontFamily="Georgia, serif" fontSize="30" fontWeight="700" fill="#D42A2A">A</text>
        <text x="-31" y="36" fontFamily="Arial" fontSize="58" fill="#D42A2A">♥</text>
      </motion.g>

      <motion.g variants={pop(0.55)} transform="translate(226,318)">
        <path d="M -48 -36 L 48 -36 L 6 24 L 6 62 L 30 62 L 30 74 L -30 74 L -30 62 L -6 62 L -6 24 Z"
          fill="#D4AF37" stroke="#0A0A0A" strokeWidth="8" strokeLinejoin="round" />
      </motion.g>

      <motion.g variants={pop(0.65)} transform="translate(332,312)">
        <path d="M -32 -34 L 32 -34 L 27 64 L -27 64 Z" fill="#D4AF37" stroke="#0A0A0A" strokeWidth="8" strokeLinejoin="round" />
        <path d="M -30 -18 Q -4 2 -30 22" fill="none" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
        <path d="M -34 -34 Q 0 -50 34 -34 Q 34 -20 0 -22 Q -34 -20 -34 -34 Z" fill="#fff" stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round" />
      </motion.g>

      <motion.g
        variants={pop(0.75)}
        transform="translate(150,340) rotate(-10)"
        animate={animated ? { rotate: [-10, 6, -10] } : {}}
        transition={animated ? { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.4 } : {}}
      >
        <rect x="-26" y="-26" width="52" height="52" rx="10" fill="#0A0A0A" stroke="#D4AF37" strokeWidth="5" />
        <circle cx="-10" cy="-10" r="5" fill="#D4AF37" />
        <circle cx="10" cy="-10" r="5" fill="#D4AF37" />
        <circle cx="-10" cy="10" r="5" fill="#D4AF37" />
        <circle cx="10" cy="10" r="5" fill="#D4AF37" />
        <circle cx="0" cy="0" r="5" fill="#D4AF37" />
      </motion.g>

      <motion.g variants={pop(0.85)} transform="translate(140,382)">
        <circle r="26" fill="#0A0A0A" stroke="#D4AF37" strokeWidth="6" />
        <circle r="16" fill="none" stroke="#D4AF37" strokeWidth="4" strokeDasharray="6 6" />
      </motion.g>

      <motion.text variants={fade(1.05)} x="256" y="440" textAnchor="middle" fontFamily="Arial Black, Arial" fontSize="52" fontWeight="900" fill="#fff" letterSpacing="6">
        GAME
      </motion.text>
      <motion.text variants={fade(1.2)} x="256" y="472" textAnchor="middle" fontFamily="Arial" fontSize="24" fontWeight="700" fill="#D4AF37" letterSpacing="10">
        — NIGHT —
      </motion.text>
    </motion.svg>
  );
}
