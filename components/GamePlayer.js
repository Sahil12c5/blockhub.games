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
  Play,
} from "lucide-react";

export default function GamePlayer({ game }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const isPlaceholderUrl =
    !game.iframeUrl ||
    game.iframeUrl === "PASTE_GAMEMONETIZE_EMBED_URL_HERE" ||
    game.iframeUrl.includes("PASTE_");

  // Track fullscreen state change across standard & vendor-prefixed APIs
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Suppress Monetag and floating third-party ad overlays while in Fullscreen mode
  useEffect(() => {
    if (!isFullscreen) {
      document.documentElement.classList.remove("game-fullscreen-active");
      document.body.classList.remove("game-fullscreen-active");
      return;
    }

    document.documentElement.classList.add("game-fullscreen-active");
    document.body.classList.add("game-fullscreen-active");

    const suppressAds = () => {
      const selectors = [
        '[class*="monetag"]',
        '[id*="monetag"]',
        '[class*="inpage"]',
        '[id*="inpage"]',
        '[class*="ipp-"]',
        '[id*="ipp-"]',
        '[class*="zone-"]',
        '[data-zone]',
        'div[style*="position: fixed"]',
        'div[style*="position:fixed"]',
      ];

      document.querySelectorAll(selectors.join(",")).forEach((el) => {
        if (containerRef.current && containerRef.current.contains(el)) return;
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("opacity", "0", "important");
        el.style.setProperty("pointer-events", "none", "important");
      });
    };

    suppressAds();

    const observer = new MutationObserver((mutations) => {
      let shouldSuppress = false;
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (containerRef.current && containerRef.current.contains(node)) return;
            shouldSuppress = true;
          }
        });
      }
      if (shouldSuppress) {
        suppressAds();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    observer.observe(document.documentElement, { childList: true });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("game-fullscreen-active");
      document.body.classList.remove("game-fullscreen-active");
    };
  }, [isFullscreen]);

  const handleToggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFs) {
        if (!isPlaying) {
          setIsPlaying(true);
        }
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        } else {
          // Fallback for browsers/devices without requestFullscreen on div
          setIsFullscreen(true);
        }

        // On mobile devices, attempt to lock to landscape for horizontal games if supported
        if (
          typeof screen !== "undefined" &&
          screen.orientation &&
          screen.orientation.lock &&
          aspectMode === "standard"
        ) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
        if (
          typeof screen !== "undefined" &&
          screen.orientation &&
          screen.orientation.unlock
        ) {
          screen.orientation.unlock();
        }
      }
    } catch (err) {
      console.error("Fullscreen API error:", err);
      // Fallback toggle if native call throws
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleReloadGame = () => {
    setIsPlaying(true);
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
        isFullscreen && typeof document !== "undefined" && !document.fullscreenElement
          ? "fixed inset-0 z-[99999] rounded-none border-0 w-screen h-screen"
          : isTheater
          ? "max-w-6xl mx-auto"
          : aspectMode === "portrait"
          ? "max-w-md mx-auto"
          : "w-full"
      }`}
    >
      {/* Smartphone adaptive canvas container */}
      <div
        className={`game-canvas-area relative w-full bg-slate-950 flex items-center justify-center overflow-hidden transition-all ${
          isFullscreen
            ? "w-full h-full"
            : aspectMode === "portrait"
            ? "h-[540px] xs:h-[580px] sm:h-[620px] max-h-[82vh]"
            : "w-full aspect-16-9 min-h-[220px] xs:min-h-[260px] sm:min-h-[420px] max-h-[85vh]"
        }`}
        style={
          !isFullscreen && isHorizontalGame && deviceOrientation === "landscape"
            ? { height: "calc(100svh - 120px)", maxHeight: "calc(100svh - 120px)" }
            : undefined
        }
      >
        {!isPlaying ? (
          /* Click-to-Play Facade (Core Web Vitals & LCP Optimizer) */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group">
            {/* Background Thumbnail Image with Gradient Backdrop */}
            {game.thumbnail ? (
              <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-950">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  width="960"
                  height="540"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover scale-105 filter blur-[2px] brightness-[0.35] group-hover:scale-110 group-hover:brightness-[0.45] transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
              </div>
            ) : (
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 voxel-grid-bg" />
            )}

            {/* Click to Play Center Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                id="play-game-button"
                className="group/btn relative flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 mb-4 cursor-pointer"
                aria-label={`Play ${game.title} Now`}
              >
                <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping opacity-60 pointer-events-none" />
                <Play className="h-10 w-10 sm:h-11 sm:w-11 fill-slate-950 ml-1 transition-transform group-hover/btn:scale-110" />
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2 backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Ready to Play • Instant Browser Play
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white max-w-lg mb-2 drop-shadow-md">
                {game.title}
              </h3>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 backdrop-blur-sm">
                  ⚡ Zero Downloads
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 backdrop-blur-sm">
                  🎮 Touch &amp; Keyboard
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-400 font-bold backdrop-blur-sm">
                  100% Free
                </span>
              </div>
            </div>
          </div>
        ) : isPlaceholderUrl ? (
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
            loading="lazy"
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
              • Instant WebGL
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
