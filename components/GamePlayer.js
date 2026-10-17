"use client";

import { useState, useRef, useEffect } from "react";
import {
  Maximize,
  Minimize,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Code2,
  Gamepad2,
  Tv,
} from "lucide-react";

export default function GamePlayer({ game }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const isPlaceholderUrl =
    !game.iframeUrl ||
    game.iframeUrl === "PASTE_GAMEMONETIZE_EMBED_URL_HERE" ||
    game.iframeUrl.includes("PASTE_");

  // Track fullscreen state change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen API error:", err);
    }
  };

  const handleReloadGame = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Allow user to manually toggle aspect ratio if a game plays better vertically on their phone
  const defaultIsPortrait =
    game.orientation === "portrait" ||
    (game.height && game.width && game.height > game.width);

  const [aspectMode, setAspectMode] = useState(
    defaultIsPortrait ? "portrait" : "standard"
  );
  const [deviceOrientation, setDeviceOrientation] = useState("portrait");

  // Track window/device orientation on smartphones
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        const isLandscape = window.innerWidth > window.innerHeight;
        setDeviceOrientation(isLandscape ? "landscape" : "portrait");
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Compute container height/aspect classes based on game type and screen size
  const isHorizontalGame = aspectMode === "standard";

  return (
    <div
      ref={containerRef}
      className={`game-player-fullscreen relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300 ${
        isTheater
          ? "max-w-6xl mx-auto"
          : aspectMode === "portrait"
          ? "max-w-md mx-auto"
          : "w-full"
      }`}
    >
      {/* Smartphone adaptive canvas container */}
      <div
        className={`game-canvas-area relative w-full bg-slate-950 flex items-center justify-center overflow-hidden transition-all ${
          aspectMode === "portrait"
            ? "h-[540px] xs:h-[580px] sm:h-[620px] max-h-[82vh]"
            : "w-full aspect-16-9 min-h-[260px] xs:min-h-[300px] sm:min-h-[420px] max-h-[88vh]"
        }`}
        style={
          isHorizontalGame && deviceOrientation === "landscape" && !isFullscreen
            ? { height: "calc(100svh - 90px)", maxHeight: "100svh" }
            : undefined
        }
      >
        {isPlaceholderUrl ? (
          // Developer & Demo Embed Window when URL is not yet swapped
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 voxel-grid-bg">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <Gamepad2 className="h-8 w-8 animate-bounce" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              <Sparkles className="h-3 w-3" />
              Game Embed Ready • {aspectMode === "portrait" ? "Vertical Phone Canvas" : "16:9 Canvas"}
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-white max-w-lg mb-2">
              {game.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6">
              This game is pre-configured and waiting for your GameMonetize or GameDistribution iframe link in{" "}
              <code className="text-emerald-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">
                /data/games.js
              </code>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] text-slate-300">
                <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Slug: <strong className="text-white">{game.slug}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] text-slate-300">
                <span>Category: <strong className="text-emerald-400">{game.category}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* Production Iframe Window with Mobile-first touch viewport */
          <iframe
          key={reloadKey}
          ref={iframeRef}
          id="gamemonetize-game"
          src={game.iframeUrl}
          title={game.title}
          className="w-full h-full border-0 select-none block inset-0 touch-none"
          allow="autoplay; fullscreen; keyboard; gamepad; screen-wake-lock; accelerometer; gyroscope"
          allowFullScreen
          loading="eager"
          scrolling="no"
        />
        )}
        {/* Floating Exit Fullscreen Button (Appears only during fullscreen on hover/tap) */}
        {isFullscreen && (
          <button
            onClick={handleToggleFullscreen}
            className="absolute top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold border border-slate-700/80 backdrop-blur-md shadow-lg transition-all active:scale-95 group focus:outline-none"
            title="Exit Fullscreen (or press Esc)"
            aria-label="Exit Fullscreen"
          >
            <Minimize className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold">Exit Fullscreen</span>
          </button>
        )}
      </div>

      {/* Control Bar Below Game Window (Hidden completely in Fullscreen mode) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-xs font-bold text-slate-300 truncate">
              {game.title}
            </span>
            <span className="text-[10px] text-slate-400 hidden md:inline shrink-0">
              • 1080p WebGL
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Fit Toggle Button (Phone screen switcher) */}
            <button
              onClick={() =>
                setAspectMode(aspectMode === "portrait" ? "standard" : "portrait")
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
              title={
                aspectMode === "portrait"
                  ? "Switch to Wide / 16:9 Screen"
                  : "Switch to Vertical / Phone Screen"
              }
              aria-label="Toggle Fit Mode"
            >
              <span>{aspectMode === "portrait" ? "↔️ Wide" : "↕️ Vertical"}</span>
            </button>

            {/* Reload Game Button */}
            <button
              onClick={handleReloadGame}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none"
              title="Reload game iframe"
              id="reload-game-button"
              aria-label="Reload Game"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden xs:inline sm:inline">Reload</span>
            </button>

            {/* Theater Mode Toggle (Desktop only) */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors focus:outline-none hidden md:flex"
              title="Toggle Theater Mode"
            >
              <Tv className="h-3.5 w-3.5 text-slate-400" />
              <span>Theater</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={handleToggleFullscreen}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 focus:outline-none"
              title="Enter Fullscreen"
              id="fullscreen-game-button"
              aria-label="Fullscreen"
            >
              <Maximize className="h-3.5 w-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
