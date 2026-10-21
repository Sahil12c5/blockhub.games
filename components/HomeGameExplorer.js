"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GameCard from "./GameCard";
import {
  Layers,
  Swords,
  Car,
  Target,
  Brain,
  Trophy,
  Users,
  Compass,
  Gamepad2,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const GAMES_PER_PAGE = 36;

let fullCatalogCache = null;
async function fetchFullCatalog() {
  if (fullCatalogCache) return fullCatalogCache;
  try {
    const res = await fetch("/search-index.json");
    if (res.ok) {
      fullCatalogCache = await res.json();
      return fullCatalogCache;
    }
  } catch (err) {
    console.error("Failed to fetch full catalog:", err);
  }
  return [];
}

// Isolated SearchParams listener inside its own Suspense so main grid is pre-rendered in static HTML
function SearchParamsWatcher({ onPageChange }) {
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams?.get("page") || "1", 10);
  useEffect(() => {
    if (pageParam && !isNaN(pageParam) && pageParam > 1) {
      onPageChange(pageParam);
    }
  }, [pageParam, onPageChange]);
  return null;
}

export default function HomeGameExplorer({
  initialGames = [],
  categoryCounts = {},
  totalGamesCount = 400,
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [catalog, setCatalog] = useState(null);

  const loadCatalogIfNeeded = useCallback(() => {
    if (!catalog && !fullCatalogCache) {
      fetchFullCatalog().then((data) => setCatalog(data));
    } else if (fullCatalogCache && !catalog) {
      setCatalog(fullCatalogCache);
    }
  }, [catalog]);

  const handlePageParamChange = useCallback(
    (page) => {
      setCurrentPage(page);
      loadCatalogIfNeeded();
    },
    [loadCatalogIfNeeded]
  );

  const categoriesList = [
    { id: "all", name: "All Games", icon: Layers, href: "/" },
    { id: "action", name: "Action", icon: Swords, href: "/category/action" },
    { id: "racing", name: "Racing", icon: Car, href: "/category/racing" },
    { id: "shooting", name: "Shooting", icon: Target, href: "/category/shooting" },
    { id: "puzzle", name: "Puzzle", icon: Brain, href: "/category/puzzle" },
    { id: "sports", name: "Sports", icon: Trophy, href: "/category/sports" },
    { id: "multiplayer", name: "Multiplayer", icon: Users, href: "/category/multiplayer" },
    { id: "adventure", name: "Adventure", icon: Compass, href: "/category/adventure" },
    { id: "arcade", name: "Arcade", icon: Gamepad2, href: "/category/arcade" },
  ];

  const isInitialDefaultView =
    selectedCategory === "all" &&
    !searchFilter &&
    sortBy === "popular" &&
    currentPage === 1 &&
    !catalog;

  const filteredGames = useMemo(() => {
    if (isInitialDefaultView) {
      return initialGames;
    }

    const dataSource = catalog || initialGames;
    let list = [...dataSource];

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter(
        (g) => g.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search text
    if (searchFilter.trim().length > 0) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: featured first
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [catalog, initialGames, isInitialDefaultView, selectedCategory, searchFilter, sortBy]);

  // Calculate pagination
  const totalCount = catalog ? filteredGames.length : totalGamesCount;
  const totalPages = Math.max(1, Math.ceil((catalog ? filteredGames.length : totalGamesCount) / GAMES_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedGames = useMemo(() => {
    if (isInitialDefaultView) {
      return initialGames.slice(0, GAMES_PER_PAGE);
    }
    const start = (validPage - 1) * GAMES_PER_PAGE;
    return filteredGames.slice(start, start + GAMES_PER_PAGE);
  }, [filteredGames, initialGames, isInitialDefaultView, validPage]);

  const handleCategoryChange = (catId) => {
    loadCatalogIfNeeded();
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    loadCatalogIfNeeded();
    setSearchFilter(value);
    setCurrentPage(1);
  };

  // Helper for visible page number pills
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, validPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="space-y-6">
      {/* SearchParams listener inside isolated Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsWatcher onPageChange={handlePageParamChange} />
      </Suspense>

      {/* Category Chips Bar & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              categoryCounts[cat.id] ??
              (cat.id === "all" ? totalGamesCount : 50);

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                onMouseEnter={loadCatalogIfNeeded}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isSelected ? "text-slate-950" : "text-emerald-400"
                  }`}
                />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-slate-950/20 text-slate-950 font-black"
                      : "bg-slate-800 text-slate-400 font-semibold"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown & In-Grid Search */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={loadCatalogIfNeeded}
              placeholder="Filter by title..."
              className="w-full md:w-48 rounded-lg bg-slate-900 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                loadCatalogIfNeeded();
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-slate-900 text-white">
                Featured
              </option>
              <option value="name" className="bg-slate-900 text-white">
                A-Z Title
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{(validPage - 1) * GAMES_PER_PAGE + 1}–{Math.min(validPage * GAMES_PER_PAGE, totalCount)}</strong> of <strong className="text-white">{totalCount}</strong> games
        </span>
        {totalPages > 1 && (
          <span>
            Page <strong className="text-white">{validPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Grid of Games (36 per page for optimal DOM size and Core Web Vitals) */}
      {paginatedGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {paginatedGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <p className="text-base font-bold text-white mb-1">
            No games match your search criteria
          </p>
          <p className="text-xs text-slate-400 mb-4">
            Try resetting your filters or browsing all game titles.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchFilter("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Crawlable Pagination Bar with real <a> tags */}
      {totalPages > 1 && (
        <nav aria-label="Game catalog pagination" className="flex items-center justify-center gap-2 pt-6 pb-2">
          {validPage > 1 ? (
            <Link
              href={validPage === 2 ? "/" : `/?page=${validPage - 1}`}
              onClick={() => {
                loadCatalogIfNeeded();
                setCurrentPage(validPage - 1);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/40 text-xs font-semibold text-slate-600 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </span>
          )}

          <div className="flex items-center gap-1">
            {getPageNumbers().map((num) => {
              const isCurrent = num === validPage;
              return (
                <Link
                  key={num}
                  href={num === 1 ? "/" : `/?page=${num}`}
                  onClick={() => {
                    loadCatalogIfNeeded();
                    setCurrentPage(num);
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all border ${
                    isCurrent
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {num}
                </Link>
              );
            })}
          </div>

          {validPage < totalPages ? (
            <Link
              href={`/?page=${validPage + 1}`}
              onClick={() => {
                loadCatalogIfNeeded();
                setCurrentPage(validPage + 1);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/40 text-xs font-semibold text-slate-600 cursor-not-allowed">
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
