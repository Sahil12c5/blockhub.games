import Link from "next/link";
import { getAllGames, getFeaturedGames, getInitialHomePageCards } from "@/data/games";
import { categories } from "@/data/categories";
import { hubs } from "@/data/hubs";
import HeroFeatured from "@/components/HeroFeatured";
import HomeGameExplorer from "@/components/HomeGameExplorer";
import AdSlot from "@/components/AdSlot";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/JsonLd";
import { Sparkles, Gamepad2, Zap, ShieldCheck, Cpu } from "lucide-react";

export const metadata = {
  alternates: {
    canonical: "https://blockhub.games",
  },
};

export default function HomePage() {
  const allGames = getAllGames();
  const featuredGames = getFeaturedGames().map((g) => ({
    slug: g.slug,
    title: g.title,
    category: g.category,
    thumbnail: g.thumbnail,
    description: g.description?.slice(0, 200) || "",
  }));
  const initialCards = getInitialHomePageCards(36);

  const categoryCounts = { all: allGames.length };
  for (const cat of categories) {
    categoryCounts[cat.slug] = allGames.filter(
      (g) => g.category.toLowerCase() === cat.slug.toLowerCase()
    ).length;
  }

  return (
    <div className="space-y-8">
      <WebsiteJsonLd />
      <OrganizationJsonLd />

      {/* Top Banner AdSense Slot */}
      <AdSlot
        slotId="1000000001"
        format="horizontal"
        className="w-full max-w-5xl mx-auto"
        label="Top Leaderboard Advertisement"
      />

      {/* Hero Strip with Featured Games */}
      <HeroFeatured featuredGames={featuredGames} />

      {/* Trending Game Hubs Quick Links */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Trending Game Hubs
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Curated high-intent collections
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {hubs.map((hub) => (
            <Link
              key={hub.slug}
              href={`/tag/${hub.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 text-xs font-medium transition-all group"
            >
              <span className="text-emerald-400 font-bold group-hover:scale-110 transition-transform">•</span>
              <span>{hub.name} Games</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Divider & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Gamepad2 className="h-6 w-6 text-emerald-400" />
            Free Online HTML5 Games Arcade
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover and play top-rated Action, Racing, Shooting, Puzzle, Sports, Multiplayer, and Adventure browser games.
          </p>
        </div>
      </div>


      {/* Visible Curated SEO Keyword Intro */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
        Welcome to our gaming catalog where you can discover hundreds of free online games across racing, shooting, puzzle, and sports genres. Our lightweight browser games load directly on your desktop or mobile screen with no download required, ensuring seamless entertainment anytime you want a quick play session. Browse our curated library and jump straight into your next favorite title.
      </p>

      {/* Category Chips & Filterable Paginated Game Grid */}
      <HomeGameExplorer
        initialGames={initialCards}
        categoryCounts={categoryCounts}
        totalGamesCount={allGames.length}
      />

      {/* Middle Banner AdSense Slot */}
      <AdSlot
        slotId="1000000002"
        format="horizontal"
        className="w-full max-w-4xl mx-auto my-8"
        label="Mid-Page Sponsored Placement"
      />

      {/* Original Editorial Intro & SEO Content Section (100+ words original) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm space-y-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Welcome to BlockHub.games
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4">
            The Premier Destination for Free Online Browser Games
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Welcome to <strong>BlockHub.games</strong>, your ultimate destination for unblocked, instant-play HTML5 and WebGL web games. We curate the highest-quality collection of online games across all popular genres—including high-speed 3D car racing, tactical first-person shooters, real-time multiplayer arenas, challenging brain-teaser puzzles, competitive sports tournaments, and immersive open-world adventure sandboxes. You will never encounter mandatory desktop installers, paywalls, or laggy plugins. Every title in our library loads instantly on desktop PCs, laptops, Chromebooks, and tablets.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
            Whether testing your precision in <em>Euro Truck Parking</em>, surviving fierce battles in <em>Ragdoll Survivor</em>, scoring curling goals in <em>Curve Free Kick</em>, or solving mechanical brain-teasers in <em>Screw Nuts Snap Puzzle</em>, BlockHub.games brings high-framerate arcade entertainment directly to your browser. Explore our catalog today and enjoy seamless, non-stop gaming.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-0.5">Instant Play, Zero Install</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Click and play within seconds. No downloads, account registrations, or storage usage required.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-0.5">Optimized WebGL Gaming</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Engineered for responsive performance across laptops, Macs, PCs, and school Chromebooks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-0.5">Family Friendly & Secure</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Enjoy a clean, responsive gaming experience free of deceptive downloads, redirects, or forced wait screens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
