"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import GameCard from "./GameCard";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

const GAMES_PER_PAGE = 36;

function CategorySearchParamsWatcher({ onPageChange }) {
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams?.get("page") || "1", 10);
  useEffect(() => {
    if (pageParam && !isNaN(pageParam) && pageParam > 1) {
      onPageChange(pageParam);
    }
  }, [pageParam, onPageChange]);
  return null;
}

export default function CategoryGameExplorer({ categoryGames = [], categorySlug = "", categoryName = "" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const sortedGames = useMemo(() => {
    const list = [...categoryGames];
    if (sortBy === "name") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [categoryGames, sortBy]);

  const totalCount = sortedGames.length;
  const totalPages = Math.ceil(totalCount / GAMES_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedGames = useMemo(() => {
    const start = (validPage - 1) * GAMES_PER_PAGE;
    return sortedGames.slice(start, start + GAMES_PER_PAGE);
  }, [sortedGames, validPage]);

  function getPageNumbers() {
    const pages = [];
    const delta = 2;
    for (
      let i = Math.max(1, validPage - delta);
      i <= Math.min(totalPages, validPage + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  }

  return (
    <div className="space-y-6">
      <Suspense fallback={null}>
        <CategorySearchParamsWatcher onPageChange={handlePageChange} />
      </Suspense>

      {/* Sorting bar & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="text-slate-400">
          Showing <strong className="text-white">{(validPage - 1) * GAMES_PER_PAGE + 1}–{Math.min(validPage * GAMES_PER_PAGE, totalCount)}</strong> of <strong className="text-white">{totalCount}</strong> {categoryName} games
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
          >
            <option value="popular">Popularity</option>
            <option value="rating">Top Rated</option>
            <option value="name">A–Z Title</option>
          </select>
        </div>
      </div>

      {/* Game Cards Grid (36 games per page for optimal DOM & Core Web Vitals) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {paginatedGames.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>

      {/* Crawlable Pagination Bar with real <a href> links */}
      {totalPages > 1 && (
        <nav aria-label={`${categoryName} games pagination`} className="flex items-center justify-center gap-2 pt-6 pb-2">
          {validPage > 1 ? (
            <Link
              href={validPage === 2 ? `/category/${categorySlug}` : `/category/${categorySlug}?page=${validPage - 1}`}
              onClick={() => setCurrentPage(validPage - 1)}
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
                  href={num === 1 ? `/category/${categorySlug}` : `/category/${categorySlug}?page=${num}`}
                  onClick={() => setCurrentPage(num)}
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
              href={`/category/${categorySlug}?page=${validPage + 1}`}
              onClick={() => setCurrentPage(validPage + 1)}
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
    </div>
  );
}
