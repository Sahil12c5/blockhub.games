"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Flame, Star, Trophy, Sparkles, ChevronRight } from "lucide-react";

export default function HeroFeatured({ featuredGames = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!featuredGames || featuredGames.length === 0) return null;

  const current = featuredGames[activeTab] || featuredGames[0];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Featured Game Spotlight */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Flame className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400 animate-pulse" />
                FEATURED SPOTLIGHT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                100% Free HTML5
              </span>
            </div>

            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {current.title}
            </h2>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl">
              {current.description}
            </p>

            {/* Quick Feature Badges */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                🎮 {current.category}
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                ⚡ 60 FPS WebGL
              </span>
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                🚀 Instant Play
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4">
            <Link
              href={`/game/${current.slug}`}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition-all transform active:scale-95 shadow-lg shadow-emerald-500/25 emerald-glow-hover"
            >
              <Play className="h-4 w-4 fill-current ml-0.5" />
              PLAY NOW FOR FREE
            </Link>

            <Link
              href={`/category/${current.category.toLowerCase()}`}
              className="w-full xs:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700/80 transition-colors"
            >
              Explore {current.category}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase & Selector Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Main Visual Display (LCP candidate with high priority) */}
          <div className="relative aspect-16-9 w-full rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl group">
            <Image
              src={current.thumbnail}
              alt={current.title}
              width={640}
              height={360}
              priority
              fetchPriority="high"
              loading="eager"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-bold text-white bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-700">
                {current.category}
              </span>
              <Link
                href={`/game/${current.slug}`}
                className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-md hover:bg-emerald-500/20 transition-colors"
              >
                Launch Game <Play className="h-3 w-3 fill-current" />
              </Link>
            </div>
          </div>

          {/* Quick Selector Pills */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {featuredGames.slice(0, 4).map((game, idx) => (
              <button
                key={game.slug}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-center p-1.5 rounded-lg border text-left transition-all ${
                  activeTab === idx
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="relative h-10 w-full rounded overflow-hidden mb-1">
                  <Image
                    src={game.thumbnail}
                    alt={game.title}
                    width={80}
                    height={45}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold truncate w-full text-center">
                  {game.title.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
