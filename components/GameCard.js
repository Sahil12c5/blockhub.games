"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, Gamepad2 } from "lucide-react";

export default function GameCard({ game }) {
  const [imgError, setImgError] = useState(false);

  const categoryColors = {
    action: "bg-red-500/20 text-red-400 border-red-500/30",
    racing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    shooting: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    puzzle: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    sports: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    multiplayer: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    adventure: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    arcade: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  };

  const badgeColor =
    categoryColors[game.category.toLowerCase()] ||
    "bg-slate-700/40 text-slate-300 border-slate-600/30";

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg game-card-transition hover:border-emerald-500/50 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      aria-label={`Play ${game.title} online for free`}
    >
      {/* Thumbnail Aspect Ratio Container */}
      <div className="relative aspect-16-9 w-full overflow-hidden bg-slate-950">
        {!imgError ? (
          <Image
            src={game.thumbnail}
            alt={`Play ${game.title} online`}
            width={320}
            height={180}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 p-3 text-center">
            <Gamepad2 className="h-8 w-8 text-emerald-400 mb-1.5 opacity-75" />
            <span className="text-[11px] font-bold text-slate-300 line-clamp-2 px-1 leading-tight">
              {game.title}
            </span>
          </div>
        )}

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Hover Overlay with Pulsing Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/50 transform group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${badgeColor}`}
          >
            {game.category}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {game.title}
        </h3>

        <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">
            Free Game
          </span>
          <span className="font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform text-[10px] sm:text-xs">
            Play →
          </span>
        </div>
      </div>
    </Link>
  );
}
