"use client";

import { useState } from "react";
import { Video, ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

/**
 * GameMonetize Video Walkthrough Component
 * Embeds official gameplay walkthrough videos directly from GameMonetize's video engine.
 */
export default function GameWalkthrough({ game, getAds = "true" }) {
  const [isOpen, setIsOpen] = useState(true);

  // Extract game ID from GameMonetize iframe URL (e.g., https://html5.gamemonetize.co/<gameid>/)
  const match = game.iframeUrl?.match(/gamemonetize\.(?:co|com)\/([a-zA-Z0-9]+)\/?/);
  const gameId = match ? match[1] : null;

  if (!gameId) {
    return null;
  }

  const encodedGame = encodeURIComponent(game.title);
  const encodedColor = encodeURIComponent("#3f007c");
  const walkthroughSrc = `https://gamemonetize.video/index.php?domain=blockhub.games&gameid=${encodeURIComponent(
    gameId
  )}&game=${encodedGame}&getads=${encodeURIComponent(getAds)}&color=${encodedColor}`;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{game.title} Video Walkthrough</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Official Guide
              </span>
            </h2>
            {game.category?.toLowerCase() === "puzzle" ? (
              <p className="text-xs text-slate-400 mt-0.5">
                Watch step-by-step puzzle solutions and walkthrough instructions for {game.title}.
              </p>
            ) : game.category?.toLowerCase() === "strategy" || game.subgenre === "tower-defense" ? (
              <p className="text-xs text-slate-400 mt-0.5">
                Watch tactical maneuvers and complete walkthrough preview for {game.title}.
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5">
                Watch a gameplay preview of {game.title} and see the action in real time.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse walkthrough video" : "Expand walkthrough video"}
        >
          {isOpen ? (
            <>
              <span>Hide Video</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4 text-purple-400" />
              <span>Watch Video</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-2xl">
          <iframe
            id="gamemonetize-walkthrough"
            title={`${game.title} Video Walkthrough Tutorial`}
            src={walkthroughSrc}
            className="w-full h-full border-0"
            scrolling="no"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
          />
        </div>
      )}
    </section>
  );
}
