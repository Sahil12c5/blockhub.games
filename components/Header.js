"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Compass,
  Swords,
  Car,
  Target,
  Brain,
  Trophy,
  Users,
  Gamepad2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { categories } from "@/data/categories";
import { hubs } from "@/data/hubs";

// Fallback top game slugs for instant Random button
const POPULAR_RANDOM_SLUGS = [
  "ragdoll-survivor",
  "euro-truck-parking",
  "curve-free-kick",
  "screw-nuts-snap-puzzle",
  "stickman-bow-clash",
  "funny-gummy-characters",
  "egg-wars-battle-arena-3d",
  "dinos-rush",
  "shooter-zombie-survival",
  "highway-traffic-racer-3d",
];

let cachedSearchIndex = null;
async function fetchSearchIndex() {
  if (cachedSearchIndex) return cachedSearchIndex;
  try {
    const res = await fetch("/search-index.json");
    if (res.ok) {
      cachedSearchIndex = await res.json();
      return cachedSearchIndex;
    }
  } catch (err) {
    console.error("Search index fetch error:", err);
  }
  return [];
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showHubsDropdown, setShowHubsDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle client-side search filtering on demand
  useEffect(() => {
    let isMounted = true;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      fetchSearchIndex().then((index) => {
        if (!isMounted) return;
        const filtered = index.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q)
        );
        setSearchResults(filtered.slice(0, 6));
        setShowSearchDropdown(true);
      });
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  // Close dropdowns on route change
  useEffect(() => {
    setShowSearchDropdown(false);
    setShowHubsDropdown(false);
    setMobileMenuOpen(false);
  }, [pathname]);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
            aria-label="BlockHub.games Homepage"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Gamepad2 className="h-5 w-5 text-slate-950 font-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                BLOCK<span className="text-emerald-400">HUB</span>
                <span className="ml-1.5 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                  .GAMES
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:inline">
                Free Online Game Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Category & Hubs Links */}
          <nav className="hidden xl:flex items-center gap-1 ml-4" aria-label="Main Navigation">
            <Link
              href="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              All
            </Link>
            {categories.slice(0, 5).map((cat) => {
              const Icon = categoryIcons[cat.slug] || Compass;
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs shadow-emerald-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
                  {cat.name}
                </Link>
              );
            })}

            {/* Hubs Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHubsDropdown(!showHubsDropdown)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  pathname.startsWith("/tag/")
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
                aria-expanded={showHubsDropdown}
                aria-haspopup="true"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Hubs</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showHubsDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-slate-900/98 border border-slate-700/90 shadow-2xl backdrop-blur-2xl p-2 z-50 grid grid-cols-2 gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {hubs.map((hub) => (
                    <Link
                      key={hub.slug}
                      href={`/tag/${hub.slug}`}
                      onClick={() => setShowHubsDropdown(false)}
                      className="px-2.5 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
                    >
                      {hub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>


        {/* Search Bar & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Box - Expands smoothly on mobile */}
          <div className="relative w-36 xs:w-44 sm:w-64 md:w-72">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={fetchSearchIndex}
                placeholder="Search games..."
                className="w-full rounded-full bg-slate-900 border border-slate-700/80 pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                aria-label="Search games"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown - Full width on phone screens */}
            {showSearchDropdown && (
              <div className="fixed inset-x-2 sm:absolute sm:inset-x-auto sm:right-0 sm:left-auto sm:w-80 top-16 sm:top-auto sm:mt-2 bg-slate-900/98 border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">Results ({searchResults.length})</span>
                  <button
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    Close
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {searchResults.map((game) => (
                      <Link
                        key={game.slug}
                        href={`/game/${game.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="h-10 w-14 rounded-md overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={game.thumbnail}
                            alt={game.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                            {game.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {game.category}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              Free
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No games found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Random Game Quick Launch Button */}
          <button
            onClick={() => {
              if (cachedSearchIndex && cachedSearchIndex.length > 0) {
                const randomIndex = Math.floor(Math.random() * cachedSearchIndex.length);
                router.push(`/game/${cachedSearchIndex[randomIndex].slug}`);
              } else {
                const randomIndex = Math.floor(Math.random() * POPULAR_RANDOM_SLUGS.length);
                router.push(`/game/${POPULAR_RANDOM_SLUGS[randomIndex]}`);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all shadow-xs"
            title="Play a Random Game"
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Random</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            >
              <Gamepad2 className="h-4 w-4 text-emerald-400" />
              All Games
            </Link>
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Compass;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Popular Game Hubs in Mobile Drawer */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              Popular Game Hubs
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {hubs.map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/tag/${hub.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                >
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{hub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">

            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About
            </Link>
            <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
