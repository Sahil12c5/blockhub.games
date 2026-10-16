import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getGamesByCategory } from "@/data/games";
import GameCard from "@/components/GameCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import {
  Swords,
  Car,
  Target,
  Brain,
  Trophy,
  Users,
  Compass,
  Gamepad2,
  Sparkles,
} from "lucide-react";

export function generateStaticParams() {
  return categories.map((cat) => ({
    name: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const category = getCategoryBySlug(name);

  if (!category) {
    return {
      title: "Category Not Found - BlockHub.games",
    };
  }

  const title = `Free ${category.name} Games Online - Play Now | BlockHub.games`;
  const description = `Play the best free ${category.name} games unblocked in your browser. Fast 60 FPS HTML5 web games with zero downloads.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://blockhub.games/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://blockhub.games/category/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }) {
  const { name } = await params;
  const category = getCategoryBySlug(name);

  if (!category) {
    notFound();
  }

  const categoryGames = getGamesByCategory(category.slug);

  const categoryIcons = {
    action: Swords,
    racing: Car,
    shooting: Target,
    puzzle: Brain,
    sports: Trophy,
    multiplayer: Users,
    adventure: Compass,
    arcade: Gamepad2,
  };
  const CategoryIcon = categoryIcons[category.slug] || Gamepad2;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: `${category.name} Games` }]} />

      {/* Top Banner AdSense Slot */}
      <AdSlot
        slotId="3000000001"
        format="horizontal"
        className="w-full max-w-5xl mx-auto"
        label="Category Top Advertisement"
      />

      {/* Category Hero Header & Original SEO Content */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CategoryIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Curated Category
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {category.headline}
          </h1>

          {/* 100+ words original SEO introductory text */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
            {category.description}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{categoryGames.length}</strong> games
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Free to Play</span>
            <span>•</span>
            <span>No Downloads Needed</span>
          </div>
        </div>
      </section>

      {/* Games Grid for This Category */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">
            All {category.name} Games
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by Popularity
          </span>
        </div>

        {categoryGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {categoryGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
            No games found in this category yet. Check back soon!
          </div>
        )}
      </section>

      {/* Mid Page AdSlot */}
      <AdSlot
        slotId="3000000002"
        format="horizontal"
        className="w-full max-w-4xl mx-auto my-8"
        label="Sponsored Placement"
      />

      {/* Explore Other Categories Chips */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Explore Other Voxel Categories
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
              >
                {cat.name} Games →
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
