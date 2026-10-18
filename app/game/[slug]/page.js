import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getAllGames,
  getGameBySlug,
  getRelatedGames,
  getMoreCategoryGames,
} from "@/data/games";
import { getHubsForGame, hubs } from "@/data/hubs";
import GamePlayer from "@/components/GamePlayer";

import GameCard from "@/components/GameCard";
import AdSlot from "@/components/AdSlot";
import GameWalkthrough from "@/components/GameWalkthrough";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GameJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import {
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
  Layers,
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
      title: "Game Not Found",
    };
  }

  const title = game.meta_title
    ? { absolute: game.meta_title }
    : `${game.title} - Play Free Online`;
  const description =
    game.meta_description ||
    `Play ${game.title} online for free on BlockHub.games. Enjoy instant ${game.category.toLowerCase()} browser gaming directly in your web browser with zero downloads.`;
  const plainTitle = typeof title === "object" ? title.absolute : title;

  return {
    title,
    description,
    robots: game.content_ready
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        },
    alternates: {
      canonical: `https://blockhub.games/game/${game.slug}`,
    },
    openGraph: {
      title: plainTitle,
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
      title: plainTitle,
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

  // 8 Related Games + 8 More Category Games for deep contextual internal linking
  const relatedGames =
    game.related && game.related.length === 8
      ? game.related.map((s) => getGameBySlug(s)).filter(Boolean)
      : getRelatedGames(game.slug, game.category, 8);
  const moreCategoryGames = getMoreCategoryGames(game.slug, game.category, 8);
  const matchedHubs = getHubsForGame(game);
  const displayHubs = matchedHubs.length > 0 ? matchedHubs : hubs.slice(0, 3);

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
      {/* Schema.org Structured Data */}
      <GameJsonLd game={game} />
      <BreadcrumbJsonLd
        items={[
          {
            label: `${game.category} Games`,
            href: `/category/${game.category.toLowerCase()}`,
          },
          { label: game.title, href: `/game/${game.slug}` },
        ]}
      />

      {/* 1. Breadcrumb Navigation: Home > Category > Game */}
      <Breadcrumbs
        items={[
          {
            label: `${game.category} Games`,
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

      {/* 2. Header with Category Badge, Hub Tags, and H1: {Game Name} - Play Free Online */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Link
              href={`/category/${game.category.toLowerCase()}`}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
            >
              <CategoryIcon className="h-3 w-3" />
              {game.category}
            </Link>
            {matchedHubs.slice(0, 2).map((hub) => (
              <Link
                key={hub.slug}
                href={`/tag/${hub.slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700/80 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <span># {hub.name}</span>
              </Link>
            ))}
            <span className="text-xs text-slate-400">• Free HTML5 Browser Game</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {game.title} - Play Free Online
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

      {/* Smartphone Landscape Hint banner */}
      {!game.orientation || game.orientation === "landscape" ? (
        <div className="sm:hidden flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            📱 <span>Rotate phone horizontally or tap <strong>Fullscreen</strong> for best controls</span>
          </span>
        </div>
      ) : null}

      {/* 3. Game Player Facade + Fullscreen Button Layout (with >150px safe ad margins) */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Sidebar Ad (>150px margin) */}
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

        {/* Center Game Window with Click-to-Play Facade */}
        <div className="w-full max-w-5xl">
          <GamePlayer game={game} />
        </div>

        {/* Right Sidebar Ad (>150px margin) */}
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

      {/* Mid-Page AdSense Slot */}
      <AdSlot
        slotId="2000000004"
        format="horizontal"
        className="w-full max-w-4xl mx-auto my-6"
        label="Mid-Page In-Content Advertisement"
      />

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Editorial Sections */}
        <div className="lg:col-span-8 space-y-8">
          {/* 4. Section "About {Game Name}": 150-300 words of unique content */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-3">
              <Gamepad2 className="h-5 w-5 text-emerald-400" />
              About {game.title}
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {game.description}
            </div>
          </section>

          {/* 5. Section "How to Play": explicit controls (keyboard, mouse, touch) */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              How to Play {game.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.howToPlay}
            </p>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-emerald-400" />
                Controls Guide (Keyboard, Mouse &amp; Touch)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 w-1/3">
                        Input / Key
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Action &amp; In-Game Function
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
            </div>
          </section>

          {/* Official Video Walkthrough Guide */}
          <GameWalkthrough game={game} getAds="true" />

          {/* 6. Section "Tips and Tricks": 3-5 real tips */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Tips and Tricks for {game.title}
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

          {/* 7. Section "Frequently Asked Questions (FAQ)": 3 questions */}
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

        {/* Right Column: Game Specifications & Features */}
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
              <span className="font-semibold text-white">Browser (Desktop &amp; Mobile)</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Price</span>
              <span className="font-bold text-emerald-400">100% Free</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-emerald-400">
                {game.content_ready ? "Verified & Ready" : "Catalog Release"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800 text-xs">
              <span className="text-slate-400">Distributor</span>
              <span className="font-semibold text-slate-300">GameMonetize / GameDistribution</span>
            </div>
            <div className="pt-2 text-xs">
              <span className="text-slate-400 block mb-1.5 font-medium">Explore Topic Hubs</span>
              <div className="flex flex-wrap gap-1.5">
                {displayHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/tag/${hub.slug}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition-colors"
                  >
                    <span>{hub.name}</span>
                  </Link>
                ))}
              </div>
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

      {/* 8. "Related Games": 8 internal links from the same category */}
      <section className="pt-8 border-t border-slate-800 space-y-4">
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

      {/* 9. "More {Category} Games": 8 additional internal links */}
      {moreCategoryGames.length > 0 && (
        <section className="pt-6 border-t border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              More {game.category} Games to Explore
            </h2>
            <Link
              href={`/category/${game.category.toLowerCase()}`}
              className="text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Explore {game.category} catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {moreCategoryGames.map((more) => (
              <GameCard key={more.slug} game={more} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
