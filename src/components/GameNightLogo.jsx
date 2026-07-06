import { motion } from "framer-motion";

// Recreated version of the uploaded "GAME NIGHT" circular badge — black
// background, gold ring, fanned aces, martini + beer glass, dice + chip,
// "GAME — NIGHT —" wordmark. Built as SVG so every element can be animated
// individually for the intro sequence.
export default function GameNightLogo({ size = 220, animated = true }) {
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
    <motion.svg
      width={size} height={size} viewBox="0 0 512 512"
      initial={animated ? "hidden" : "show"}
      animate="show"
    >
      <circle cx="256" cy="256" r="248" fill="#000" />
      <motion.circle
        cx="256" cy="256" r="238" fill="none" stroke="#D4AF37" strokeWidth="10"
        variants={ring}
      />

      <motion.g variants={pop(0.25)} transform="translate(190,150) rotate(-14)">
        <rect x="-42" y="-58" width="84" height="118" rx="10" fill="#fff" />
        <text x="-32" y="-30" fontFamily="Georgia, serif" fontSize="26" fontWeight="700" fill="#000">A</text>
        <text x="-24" y="14" fontFamily="Arial" fontSize="40" fill="#000">♠</text>
      </motion.g>

      <motion.g variants={pop(0.4)} transform="translate(266,146) rotate(10)">
        <rect x="-42" y="-58" width="84" height="118" rx="10" fill="#fff" />
        <text x="-32" y="-30" fontFamily="Georgia, serif" fontSize="26" fontWeight="700" fill="#D42A2A">A</text>
        <text x="-24" y="16" fontFamily="Arial" fontSize="40" fill="#D42A2A">♥</text>
      </motion.g>

      <motion.g variants={pop(0.55)} transform="translate(228,300)">
        <path d="M -46 -34 L 46 -34 L 4 22 L 4 58 L 26 58 L 26 68 L -26 68 L -26 58 L -4 58 L -4 22 Z" fill="none" stroke="#D4AF37" strokeWidth="7" strokeLinejoin="round" />
      </motion.g>

      <motion.g variants={pop(0.65)} transform="translate(330,300)">
        <path d="M -30 -46 L 30 -46 L 26 60 L -26 60 Z" fill="none" stroke="#D4AF37" strokeWidth="7" strokeLinejoin="round" />
        <path d="M -30 -30 Q -6 -10 -30 8" fill="none" stroke="#D4AF37" strokeWidth="6" />
        <ellipse cx="0" cy="-46" rx="30" ry="8" fill="#D4AF37" />
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
