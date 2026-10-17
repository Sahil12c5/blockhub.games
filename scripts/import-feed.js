const fs = require("fs");
const path = require("path");

const FEED_URL = "https://gamemonetize.com/feed.php?format=0&page=1";
const TARGET_GAMES_FILE = path.join(__dirname, "../data/games.js");

// Map feed categories to our portal's 8 core categories
const CATEGORY_MAP = {
  Action: "Action",
  Boys: "Action",
  "3D": "Action",
  Racing: "Racing",
  Shooting: "Shooting",
  Puzzle: "Puzzle",
  Sports: "Sports",
  Soccer: "Sports",
  Multiplayer: "Multiplayer",
  ".IO": "Multiplayer",
  "2 Player": "Multiplayer",
  Adventure: "Adventure",
  Arcade: "Arcade",
  Hypercasual: "Arcade",
  Stickman: "Action",
  Clicker: "Arcade",
  Girls: "Arcade",
  Cooking: "Arcade",
  AI: "Puzzle",
};

// Target count of top games per category to keep static export fast, high quality and well-balanced
const TARGET_PER_CATEGORY = 200;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function cleanHtml(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/Web\s*Dev\s*https?:\/\/\S+/gi, "")
    .replace(/Developer\s*website\s*https?:\/\/\S+/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPageWithRetry(page, maxRetries = 4) {
  const url = `https://gamemonetize.com/feed.php?format=0&page=${page}`;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "BlockHubGames/1.0 (+https://blockhub.games)",
        },
      });
      if (response.status === 429) {
        console.warn(`[Page ${page}] Rate limited (429). Retrying in 4s... (attempt ${attempt}/${maxRetries})`);
        await sleep(4000);
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`[Page ${page}] Fetch failed (${err.message}). Retrying in 3s...`);
      await sleep(3000);
    }
  }
  return [];
}

async function run() {
  console.log(`Starting import: targeting ${TARGET_PER_CATEGORY} games per category (Total: ${TARGET_PER_CATEGORY * 8})...`);

  const categoryBuckets = {
    Action: [],
    Racing: [],
    Shooting: [],
    Puzzle: [],
    Sports: [],
    Multiplayer: [],
    Adventure: [],
    Arcade: [],
  };

  const usedSlugs = new Set();
  let page = 1;
  const maxPages = 15;

  while (page <= maxPages) {
    const isCompleted = Object.values(categoryBuckets).every(
      (bucket) => bucket.length >= TARGET_PER_CATEGORY
    );
    if (isCompleted) {
      console.log("All categories reached their target count!");
      break;
    }

    console.log(`Fetching feed page ${page}...`);
    let rawGames = [];
    try {
      rawGames = await fetchPageWithRetry(page);
    } catch (e) {
      console.error(`Failed to fetch page ${page}:`, e.message);
      break;
    }

    if (!Array.isArray(rawGames) || rawGames.length === 0) {
      console.log(`No more games found on page ${page}. Ending fetch.`);
      break;
    }

    console.log(`Page ${page}: received ${rawGames.length} games. Filtering and categorizing...`);

    for (const item of rawGames) {
      if (!item.title || !item.url || !item.thumb) continue;

      let mappedCategory = CATEGORY_MAP[item.category];
      const tags = (item.tags || "").toLowerCase();

      // Tag-based fallback/refinement
      if (!mappedCategory) {
        if (tags.includes("multiplayer") || tags.includes("2 player") || tags.includes(".io") || tags.includes("io games") || tags.includes("pvp")) {
          mappedCategory = "Multiplayer";
        } else if (tags.includes("racing") || tags.includes("driving") || tags.includes("car")) {
          mappedCategory = "Racing";
        } else if (tags.includes("shooting") || tags.includes("gun") || tags.includes("sniper")) {
          mappedCategory = "Shooting";
        } else if (tags.includes("sports") || tags.includes("football") || tags.includes("soccer") || tags.includes("basketball")) {
          mappedCategory = "Sports";
        } else if (tags.includes("adventure") || tags.includes("rpg")) {
          mappedCategory = "Adventure";
        } else if (tags.includes("puzzle") || tags.includes("match 3") || tags.includes("brain")) {
          mappedCategory = "Puzzle";
        } else if (tags.includes("action") || tags.includes("fighting")) {
          mappedCategory = "Action";
        } else {
          mappedCategory = "Arcade";
        }
      } else if (
        mappedCategory !== "Multiplayer" &&
        categoryBuckets["Multiplayer"].length < TARGET_PER_CATEGORY &&
        (tags.includes("multiplayer") || tags.includes("2 player") || tags.includes("2-player") || tags.includes(".io") || tags.includes("io games") || tags.includes("pvp") || tags.includes("co-op"))
      ) {
        mappedCategory = "Multiplayer";
      }

      if (!categoryBuckets[mappedCategory]) continue;
      if (categoryBuckets[mappedCategory].length >= TARGET_PER_CATEGORY) continue;

      let slug = slugify(item.title);
      if (!slug) slug = `game-${item.id}`;
      if (usedSlugs.has(slug)) {
        slug = `${slug}-${item.id}`;
      }
      usedSlugs.add(slug);

    let cleanDesc = cleanHtml(item.description);
    if (!cleanDesc || cleanDesc.length < 50) {
      cleanDesc = `${item.title} is an exciting and engaging ${mappedCategory} browser game. Play instantly online for free at BlockHub.games with no downloads required. Test your skills, beat your high scores, and enjoy smooth unblocked gameplay.`;
    }

    const cleanInstructions = cleanHtml(item.instructions) || "Use mouse, touch, or arrow keys to play.";

    const playsNumber = (Math.random() * (450 - 50) + 50).toFixed(1);
    const ratingNumber = (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1);

    const width = parseInt(item.width, 10) || 800;
    const height = parseInt(item.height, 10) || 600;
    const orientation = height > width ? "portrait" : "landscape";

    const gameObj = {
      slug,
      title: item.title.trim(),
      category: mappedCategory,
      featured: categoryBuckets[mappedCategory].length === 0, // 1st game in each category is featured
      rating: parseFloat(ratingNumber),
      plays: `${playsNumber}K`,
      thumbnail: item.thumb.trim(),
      iframeUrl: item.url.trim(),
      width,
      height,
      orientation,
      description: cleanDesc,
      howToPlay: cleanInstructions,
      controls: [
        { key: "Mouse / Touch", action: "Navigate, aim and select in-game actions" },
        { key: "W A S D / Arrow Keys", action: "Move character or steer vehicle" },
        { key: "Spacebar", action: "Jump, shoot, or activate secondary skill" },
      ],
      tips: [
        "Learn the game rhythm early to dodge obstacles effortlessly.",
        "Take advantage of power-ups and collectibles to multiply your score.",
        "Play in Fullscreen mode for the most immersive arcade experience.",
      ],
      features: [
        "Instant browser play with fast loading and zero downloads.",
        "Fully responsive 16:9 gameplay optimized for desktop and mobile.",
        "High quality graphics and smooth 60 FPS performance.",
      ],
      faq: [
        {
          q: `Is ${item.title} free to play on BlockHub.games?`,
          a: `Yes, ${item.title} is 100% free to play directly in your web browser with no downloads or installation.`,
        },
        {
          q: `Can I play ${item.title} on mobile devices?`,
          a: `Yes, ${item.title} is designed with responsive HTML5 technology and runs on desktop, tablets, and mobile phones.`,
        },
      ],
    };

    categoryBuckets[mappedCategory].push(gameObj);
  }

    console.log(
      `Current progress: ` +
        Object.keys(categoryBuckets)
          .map((k) => `${k}: ${categoryBuckets[k].length}/${TARGET_PER_CATEGORY}`)
          .join(", ")
    );

    page++;
    await sleep(1500); // 1.5s delay to be gentle with rate limits
  }

  // Combine into single array
  const allFinalGames = [];
  for (const cat of Object.keys(categoryBuckets)) {
    console.log(`Category "${cat}": ${categoryBuckets[cat].length} games selected.`);
    allFinalGames.push(...categoryBuckets[cat]);
  }

  console.log(`Total games prepared for portal: ${allFinalGames.length}`);

  const fileContent = `/**
 * ============================================================================
 * BLOCKHUB.GAMES - MASTER GAMES DATABASE (/data/games.js)
 * Synchronized with GameMonetize Feed
 * ============================================================================
 */

export const games = ${JSON.stringify(allFinalGames, null, 2)};

export function getAllGames() {
  return games;
}

export function getFeaturedGames() {
  return games.filter((game) => game.featured);
}

export function getGameBySlug(slug) {
  return games.find((game) => game.slug.toLowerCase() === slug.toLowerCase());
}

export function getGamesByCategory(category) {
  return games.filter(
    (game) => game.category.toLowerCase() === category.toLowerCase()
  );
}

export function getRelatedGames(currentSlug, category, limit = 4) {
  return games
    .filter(
      (game) =>
        game.category.toLowerCase() === category.toLowerCase() &&
        game.slug.toLowerCase() !== currentSlug.toLowerCase()
    )
    .slice(0, limit);
}
`;

  fs.writeFileSync(TARGET_GAMES_FILE, fileContent, "utf8");
  console.log(`Successfully written ${allFinalGames.length} games to ${TARGET_GAMES_FILE}!`);
}

run().catch(console.error);
