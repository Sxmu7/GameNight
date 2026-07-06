"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Category } from "@/lib/data/types";
import { useAppState } from "@/lib/i18n/LanguageProvider";
import { gamesByCategory } from "@/lib/data/games";

export default function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const { lang, t } = useAppState();
  const count = gamesByCategory(category.id).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={`/kategorie/${category.id}`}
        className="card flex flex-col justify-between p-4 h-28"
      >
        <span className="text-2xl">{category.icon}</span>
        <div>
          <p className="font-semibold text-sm leading-tight">{category.name[lang]}</p>
          <p className="text-[11px] text-muted mt-0.5">
            {count} {t("category.games.count")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
