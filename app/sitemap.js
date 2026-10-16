import { getAllGames } from "@/data/games";
import { categories } from "@/data/categories";

export const dynamic = "force-static";

export default async function sitemap() {
  const baseUrl = "https://blockhub.games";
  const currentDate = "2026-10-15T00:00:00.000Z";

  // Core static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/dmca",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.6,
  }));

  // Dynamic category routes
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic game routes
  const games = getAllGames();
  const gameRoutes = games.map((game) => ({
    url: `${baseUrl}/game/${game.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...gameRoutes];
}
