import { useEffect } from "react";
import { motion } from "framer-motion";
import GameNightLogo from "./GameNightLogo";

export default function IntroScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_55%)]" />
      <GameNightLogo size={240} animated />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="relative text-xs font-black uppercase tracking-[0.4em] text-white/40"
      >
        tippen zum überspringen
      </motion.p>
    </motion.div>
  );
}
