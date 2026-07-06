"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAppState } from "@/lib/i18n/LanguageProvider";

const ITEMS = [
  { href: "/", key: "nav.home", icon: "🏠" },
  { href: "/online", key: "nav.online", icon: "📡" },
  { href: "/stats", key: "nav.stats", icon: "📊" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useAppState();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-bg/95 backdrop-blur-md">
      <div className="mx-auto max-w-md flex">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative"
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute top-0 h-0.5 w-8 bg-accent rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-lg transition-transform ${active ? "scale-110" : "opacity-60"}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-medium ${active ? "text-white" : "text-muted"}`}>
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
