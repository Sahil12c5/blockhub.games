import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getGamesByCategory } from "@/data/games";
import CategoryGameExplorer from "@/components/CategoryGameExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import { BreadcrumbJsonLd, CategoryJsonLd } from "@/components/JsonLd";
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
      title: "Category Not Found",
    };
  }

  const title = category.metaTitle || `Free ${category.name} Games Online`;
  const description = category.metaDescription || `Play the best free ${category.name} games online in your browser. Fast HTML5 web games with zero downloads.`;
  const keywords = category.keywords;

  return {
    title: { absolute: title },
    description,
    keywords,
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

function renderIntroWithLinks(text) {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors"
      >
        {match[1]}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
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

  const underlinkedByCategory = {
    action: [
      { slug: "funny-gummy-characters", title: "Funny Gummy Characters" },
      { slug: "mutantblood", title: "Mutantblood" },
      { slug: "stickninja-mission", title: "StickNinja Mission" },
      { slug: "blade-merge", title: "Blade Merge" },
      { slug: "shell-strikers-1", title: "Shell Strikers 1" },
      { slug: "archer-clash", title: "Archer Clash" },
    ],
    adventure: [
      { slug: "terminal-nine", title: "Terminal Nine" },
      { slug: "verdant-wilds", title: "Verdant Wilds" },
      { slug: "voxel-frontier", title: "Voxel Frontier" },
      { slug: "ironwake-tank-combat", title: "IRONWAKE: Tank Combat" },
      { slug: "embercraft", title: "EmberCraft" },
      { slug: "snake-run-eat-and-grow", title: "Snake Run: Eat & Grow" },
    ],
    arcade: [
      { slug: "zaruvane-the-amber-oasis", title: "ZARUVANE - THE AMBER OASIS" },
      { slug: "perfect-landing-plane-pilot", title: "Perfect Landing, Plane Pilot" },
      { slug: "tidy-bot", title: "Tidy Bot" },
      { slug: "swarmfront", title: "Swarmfront" },
      { slug: "bug-crunch", title: "Bug Crunch" },
      { slug: "impostor-dominion", title: "Impostor Dominion" },
      { slug: "final-fight-harbor-justice", title: "Final Fight: Harbor Justice" },
      { slug: "lumen-descent", title: "Lumen Descent" },
    ],
    multiplayer: [
      { slug: "holdem-royale", title: "Holdem Royale" },
      { slug: "hellgate-1993", title: "Hellgate 1993" },
      { slug: "ranch-empire", title: "Ranch Empire" },
      { slug: "1-cut-grass-adventure", title: "+1 Cut Grass Adventure" },
      { slug: "geometry-vibes-3d", title: "Geometry Vibes 3D" },
      { slug: "geometry-vibes-monster", title: "Geometry Vibes Monster" },
    ],
    puzzle: [
      { slug: "tank-push", title: "Tank Push" },
      { slug: "timber-squirrel", title: "Timber Squirrel" },
      { slug: "piecealive", title: "PieceAlive" },
      { slug: "try-again", title: "Try Again" },
      { slug: "treasurebound", title: "TreasureBound" },
      { slug: "word-game-2026", title: "Word Game 2026" },
      { slug: "museum-night-shift", title: "Museum Night Shift" },
      { slug: "pushplush", title: "PushPlush" },
    ],
    racing: [
      { slug: "taiga-expedition", title: "Taiga: Expedition" },
      { slug: "prado-parking-game", title: "Prado Parking Game" },
      { slug: "junkyard-builder-3d", title: "Junkyard Builder 3D" },
      { slug: "racing-portal", title: "Racing Portal" },
      { slug: "impossible-jeep-driver", title: "Impossible Jeep Driver" },
      { slug: "wall-rush-3d", title: "Wall Rush 3D" },
    ],
    shooting: [
      { slug: "hollow-pass", title: "HOLLOW PASS" },
      { slug: "pirate-dodge", title: "Pirate Dodge" },
      { slug: "tactical-response-team", title: "Tactical Response Team" },
      { slug: "alien-wreckage", title: "Alien Wreckage" },
      { slug: "octobeer", title: "Octobeer" },
      { slug: "catchfish-fishing-master", title: "CatchFish - Fishing Master" },
      { slug: "scrap-arms-neo", title: "SCRAP ARMS NEO" },
      { slug: "witchy", title: "Witchy" },
    ],
    sports: [
      { slug: "hurdles", title: "HURDLES" },
      { slug: "pocket-golf", title: "Pocket Golf" },
      { slug: "night-lake", title: "Night Lake" },
      { slug: "9-ball-pool-3d", title: "9 Ball Pool 3D" },
      { slug: "billiard-hustlers", title: "Billiard Hustlers" },
      { slug: "college-basketball-games-today", title: "College Basketball Games Today" },
      { slug: "last-call-drunken-boxer", title: "Last Call: Drunken Boxer" },
      { slug: "super-kick-boxing", title: "Super Kick Boxing" },
    ],
  };

  const moreCategoryGames = underlinkedByCategory[category.slug] || [];

  return (
    <div className="space-y-8">
      {/* Schema.org Structured Data */}
      <BreadcrumbJsonLd
        items={[
          {
            label: `${category.name} Games`,
            href: `/category/${category.slug}`,
          },
        ]}
      />
      <CategoryJsonLd category={category} />

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
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CategoryIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Curated Category
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
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

      {/* Games Grid for This Category with Crawlable Pagination */}
      <section className="space-y-4">
        {category.introParagraph && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            {renderIntroWithLinks(category.introParagraph)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">
            All {category.name} Games
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by Popularity
          </span>
        </div>

        {categoryGames.length > 0 ? (
          <CategoryGameExplorer
            categoryGames={categoryGames}
            categorySlug={category.slug}
            categoryName={category.name}
          />
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

      {/* More Category Games Section */}
      {moreCategoryGames.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-emerald-400" />
            More {category.name} Games to Explore
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {moreCategoryGames.map((item) => (
              <Link
                key={item.slug}
                href={`/game/${item.slug}`}
                className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-colors min-h-[44px] flex items-center"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Explore Other Categories Chips */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Explore Other Game Categories
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-colors min-h-[44px] flex items-center"
              >
                {cat.name} Games →
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
