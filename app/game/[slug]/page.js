import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getAllGames,
  getGameBySlug,
  getRelatedGames,
} from "@/data/games";
import GamePlayer from "@/components/GamePlayer";
import GameCard from "@/components/GameCard";
import AdSlot from "@/components/AdSlot";
import GameWalkthrough from "@/components/GameWalkthrough";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GameJsonLd } from "@/components/JsonLd";
import {
  Star,
  Eye,
  Keyboard,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Gamepad2,
  Swords,
  Car,
  Target,
  Brain,
  Trophy,
  Users,
  Compass,
  Sparkles,
} from "lucide-react";

export function generateStaticParams() {
  const allGames = getAllGames();
  return allGames.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Not Found - BlockHub.games",
    };
  }

  const title = `Play ${game.title} Online for Free | BlockHub.games`;
  const description = `${game.title} - Play unblocked in your browser. ${game.description.slice(
    0,
    140
  )}... Free HTML5 voxel game.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://blockhub.games/game/${game.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://blockhub.games/game/${game.slug}`,
      type: "website",
      images: [
        {
          url: game.thumbnail,
          width: 640,
          height: 360,
          alt: `${game.title} Game Cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = getRelatedGames(game.slug, game.category, 4);

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
  const CategoryIcon = categoryIcons[game.category.toLowerCase()] || Gamepad2;

  return (
    <div className="space-y-6">
      {/* JSON-LD Schema for VideoGame & FAQPage */}
      <GameJsonLd game={game} />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          {
            label: game.category,
            href: `/category/${game.category.toLowerCase()}`,
          },
          { label: game.title },
        ]}
      />

      {/* Top Banner AdSense Slot */}
      <AdSlot
        slotId="2000000001"
        format="horizontal"
        className="w-full max-w-5xl mx-auto"
        label="Top Game Leaderboard Ad"
      />

      {/* Game Header Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href={`/category/${game.category.toLowerCase()}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
            >
              <CategoryIcon className="h-3 w-3" />
              {game.category}
            </Link>
            <span className="text-xs text-slate-400">• Free HTML5 Browser Game</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {game.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            ✓ Free to Play
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            ⚡ Instant WebGL
          </span>
        </div>
      </div>

      {/* Smartphone Landscape Hint banner (visible only on mobile for landscape games) */}
      {!game.orientation || game.orientation === "landscape" ? (
        <div className="sm:hidden flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            📱 <span>Rotate phone horizontally or tap <strong>Fullscreen</strong> for best controls</span>
          </span>
        </div>
      ) : null}

      {/* Game Player & Sidebar Ads Layout */}
      {/* 
        Sidebars:
        - Hidden on mobile/tablets (< 1280px)
        - On wide desktop screens, we ensure AT LEAST 150px margin between sidebar ads and the game canvas.
        - Using pl-[160px] / pr-[160px] wrapper margins guarantee a safe 160px distance!
      */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Sidebar Ad (Hidden on mobile/tablet, >150px margin from canvas) */}
        <aside
          aria-label="Left Sidebar Advertisement"
          className="hidden 2xl:flex flex-col items-center justify-center w-[160px] shrink-0 mr-[160px]"
        >
          <AdSlot
            slotId="2000000002"
            format="vertical"
            label="Sponsored"
            className="w-[160px]"
          />
        </aside>

        {/* Center Game Window (16:9 Responsive) */}
        <div className="w-full max-w-5xl">
          <GamePlayer game={game} />
        </div>

        {/* Right Sidebar Ad (Hidden on mobile/tablet, >150px margin from canvas) */}
        <aside
          aria-label="Right Sidebar Advertisement"
          className="hidden 2xl:flex flex-col items-center justify-center w-[160px] shrink-0 ml-[160px]"
        >
          <AdSlot
            slotId="2000000003"
            format="vertical"
            label="Sponsored"
            className="w-[160px]"
          />
        </aside>
      </div>

      {/* AdSense Slot between Game Canvas and SEO Content */}
      <AdSlot
        slotId="2000000004"
        format="horizontal"
        className="w-full max-w-4xl mx-auto my-6"
        label="Mid-Page In-Content Advertisement"
      />

      {/* Comprehensive SEO Content Section (300-500 words of original content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* About the Game */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-3">
              <Gamepad2 className="h-5 w-5 text-emerald-400" />
              About {game.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>
          </section>

          {/* How to Play */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              How to Play {game.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.howToPlay}
            </p>
          </section>

          {/* Official GameMonetize Video Walkthrough & Tutorial */}
          <GameWalkthrough game={game} getAds="true" />

          {/* Keyboard Controls Table */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <Keyboard className="h-5 w-5 text-emerald-400" />
              Keyboard & Mouse Controls
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-1/3">
                      Key / Button
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Action & Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {game.controls.map((ctrl, index) => (
                    <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">
                        <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 shadow-xs">
                          {ctrl.key}
                        </kbd>
                      </td>
                      <td className="px-4 py-2.5 text-slate-300">{ctrl.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tips & Tricks */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Pro Tips & Survival Strategies
            </h2>
            <ul className="space-y-3">
              {game.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Frequently Asked Questions (FAQ) */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-4">
              {game.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
                >
                  <h3 className="text-sm font-bold text-white mb-1.5 flex items-start gap-2">
                    <span className="text-emerald-400 font-mono">Q:</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column: Game Features & Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Key Game Features Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h3 className="text-base font-bold text-white mb-3">Key Features</h3>
            <ul className="space-y-2.5">
              {game.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Game Quick Info Specifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-3">
            <h3 className="text-base font-bold text-white mb-2">Game Specifications</h3>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Category</span>
              <span className="font-bold text-emerald-400">{game.category}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Engine / Technology</span>
              <span className="font-semibold text-white">WebGL / HTML5</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Platform</span>
              <span className="font-semibold text-white">Browser (Desktop & Mobile)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Price</span>
              <span className="font-bold text-emerald-400">100% Free</span>
            </div>
            <div className="flex justify-between items-center py-1.5 text-xs">
              <span className="text-slate-400">Distributor</span>
              <span className="font-semibold text-slate-300">GameMonetize / GameDistribution</span>
            </div>
          </div>

          {/* Sidebar Advertisement */}
          <AdSlot
            slotId="2000000005"
            format="rectangle"
            label="Advertisement"
            className="w-full"
          />
        </div>
      </div>

      {/* Related Games Grid */}
      <section className="pt-6 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-emerald-400" />
            Related {game.category} Games
          </h2>
          <Link
            href={`/category/${game.category.toLowerCase()}`}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all {game.category} games →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {relatedGames.map((related) => (
            <GameCard key={related.slug} game={related} />
          ))}
        </div>
      </section>
    </div>
  );
}
