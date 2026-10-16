"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

export default function HomeGameExplorer({ allGames }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const categoriesList = [
    { id: "all", name: "All Games", icon: Layers },
    { id: "action", name: "Action", icon: Swords },
    { id: "racing", name: "Racing", icon: Car },
    { id: "shooting", name: "Shooting", icon: Target },
    { id: "puzzle", name: "Puzzle", icon: Brain },
    { id: "sports", name: "Sports", icon: Trophy },
    { id: "multiplayer", name: "Multiplayer", icon: Users },
    { id: "adventure", name: "Adventure", icon: Compass },
    { id: "arcade", name: "Arcade", icon: Gamepad2 },
  ];

  const filteredGames = useMemo(() => {
    let list = [...allGames];

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter(
        (g) => g.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search text
    if (searchFilter.trim().length > 0) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: featured first, then popular
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [allGames, selectedCategory, searchFilter, sortBy]);

  return (
    <section className="space-y-6">
      {/* Category Chips Bar & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? allGames.length
                : allGames.filter(
                    (g) => g.category.toLowerCase() === cat.id.toLowerCase()
                  ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
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
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by title..."
              className="w-40 sm:w-48 rounded-lg bg-slate-900 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-slate-900 text-white">
                Popular
              </option>
              <option value="rating" className="bg-slate-900 text-white">
                Top Rated
              </option>
              <option value="name" className="bg-slate-900 text-white">
                Alphabetical
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Games */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredGames.map((game) => (
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
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
