"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import GameCard from "@/components/GameCard";
import { getCategory, gamesByCategory } from "@/lib/data/games";
import { useAppState } from "@/lib/i18n/LanguageProvider";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { lang, t } = useAppState();
  const category = getCategory(params.slug);
  if (!category) return notFound();

  const games = gamesByCategory(category.id);

  return (
    <PageTransition>
      <div className="space-y-4">
        <Link href="/" className="text-xs text-muted">
          ← {t("game.back")}
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">{category.name[lang]}</h1>
            <p className="text-xs text-muted">{category.description[lang]}</p>
          </div>
        </div>

        <div className="space-y-3">
          {games.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
