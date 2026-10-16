import { getAllGames, getFeaturedGames } from "@/data/games";
import HeroFeatured from "@/components/HeroFeatured";
import HomeGameExplorer from "@/components/HomeGameExplorer";
import AdSlot from "@/components/AdSlot";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { Sparkles, Gamepad2, Zap, ShieldCheck, Cpu } from "lucide-react";

export default function HomePage() {
  const allGames = getAllGames();
  const featuredGames = getFeaturedGames();

  return (
    <div className="space-y-8">
      <WebsiteJsonLd />

      {/* Top Banner AdSense Slot */}
      <AdSlot
        slotId="1000000001"
        format="horizontal"
        className="w-full max-w-5xl mx-auto"
        label="Top Leaderboard Advertisement"
      />

      {/* Hero Strip with Featured Games */}
      <HeroFeatured featuredGames={featuredGames} />

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

      {/* Category Chips & Filterable 16 Game Grid */}
      <HomeGameExplorer allGames={allGames} />

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
            Whether burning rubber through neon street corners in <em>Cyber Drift City 3D</em>, outsmarting tactical enemy patrols in <em>Shadow Strike Ops FPS</em>, competing in penalty shootouts in <em>Super Kick Soccer Champions</em>, or conquering spatial block puzzles in <em>Neon Puzzle Block Master</em>, BlockHub.games brings high-framerate arcade entertainment directly to your fingertips. Bookmark BlockHub today and experience non-stop gaming excitement.
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
              <h3 className="text-xs font-bold text-white mb-0.5">Optimized 60 FPS WebGL</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Engineered for silky-smooth framerates across laptops, Macs, PCs, and school Chromebooks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white mb-0.5">AdSense Safe & Family Friendly</h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Clean, family-friendly gaming experience free of deceptive popups, redirects, or forced wait screens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
