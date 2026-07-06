"use client";

import PageTransition from "@/components/PageTransition";
import RandomButton from "@/components/RandomButton";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/lib/data/games";
import { useAppState } from "@/lib/i18n/LanguageProvider";

export default function HomePage() {
  const { t } = useAppState();

  return (
    <PageTransition>
      <div className="space-y-6">
        <RandomButton />

        <div>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">
            {t("home.categories.title")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted pt-2">{t("footer.responsible")}</p>
      </div>
    </PageTransition>
  );
}
