/**
 * PULL BACK UNREVIEWED RELEASES & SANITIZE CATALOG DATA
 * Reverts the unreviewed bulk-released games to PASS_SCHEDULED / indexable: false.
 * Blocks all brand-like titles (Skibidi Toilet, Barbee, Bluey, Labubu, Fireboy & Watergirl, Paccoman).
 * Retains exactly the 153 clean vetted live games.
 * Fixes alien-memory content with clean memory puzzle prose and click/tap controls.
 * Formats meta_titles to <= 60 chars with no duplicate brands.
 */

const fs = require('fs');
const path = require('path');
const { checkTrademark } = require('./lib/trademark.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');
const ND_PATH = path.join(__dirname, '../reports/near-duplicates.csv');

const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

// 1. Identify non-canonical near-duplicates
// Although all same_embed=false and actions are keep_both_differentiate,
// in data, the secondary non-canonical variant remains noindex (PASS_NOINDEX_NEAR_DUPE) unless vetted.
const ndRaw = fs.readFileSync(ND_PATH, 'utf8');
const ndLines = ndRaw.trim().split(/\r?\n/).slice(1);
const nonCanonicalNearDupes = new Set();
for (const line of ndLines) {
  const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
  const [slugA, slugB, sim, sameEmbed, inSitemap, recAction, sugAction, canonical] = parts;
  if (canonical) {
    if (slugA && slugA !== canonical) nonCanonicalNearDupes.add(slugA);
    if (slugB && slugB !== canonical) nonCanonicalNearDupes.add(slugB);
  }
}
console.log(`Loaded ${nonCanonicalNearDupes.size} non-canonical near-duplicates.`);

// 2. Load the 155 original live slugs
const exact155List = JSON.parse(fs.readFileSync(path.join(__dirname, './lib/exact-155-live.json'), 'utf8'));
const ORIGINAL_155_SLUGS = new Set(exact155List);
console.log(`Original live catalog count: ${ORIGINAL_155_SLUGS.size}`);

// Helper to format title <= 60 chars without double brand
function formatGameTitle(game) {
  const brand = "BlockHub.games";
  const title = (game.title || "").trim();
  const rawMeta = (game.meta_title || "").trim();

  let cleanedMeta = rawMeta
    .replace(/\s*\|\s*BlockHub\s*\|\s*BlockHub\.games/gi, "")
    .replace(/\s*\|\s*BlockHub\.games/gi, "")
    .replace(/\s*\|\s*BlockHub/gi, "")
    .trim();

  let bestTitle = title;
  if (cleanedMeta && !cleanedMeta.toLowerCase().includes(title.toLowerCase())) {
    bestTitle = `${title} - ${cleanedMeta}`;
  } else if (cleanedMeta) {
    bestTitle = cleanedMeta;
  }

  let finalTitle = `${bestTitle} | ${brand}`;
  if (finalTitle.length <= 60) return finalTitle;

  const minTitle = `${title} | ${brand}`;
  if (minTitle.length <= 60) return minTitle;

  const maxTitleLen = 60 - ` | ${brand}`.length;
  const truncated = title.slice(0, maxTitleLen).trim();
  return `${truncated} | ${brand}`;
}

// 3. Process each game
let liveCount = 0;
let scheduledCount = 0;
let blockedTmCount = 0;
let blockedNdCount = 0;

for (const [slug, item] of Object.entries(topContent)) {
  // Format title
  item.meta_title = formatGameTitle(item);

  // Check trademark
  const tmRes = checkTrademark(item);
  const isTrademarkBlocked = tmRes.flagged && tmRes.blocksIndex;

  if (isTrademarkBlocked) {
    item.status = 'BLOCKED_TRADEMARK';
    item.indexable = false;
    item.release_date = 'NONE';
    blockedTmCount++;
    continue;
  }

  // Is it one of the clean vetted live games?
  if (ORIGINAL_155_SLUGS.has(slug)) {
    item.status = 'PASS_LIVE';
    item.indexable = true;
    item.release_date = item.release_date || '2026-10-21';
    liveCount++;
    continue;
  }

  // Unreviewed releases:
  const isNdBlocked = nonCanonicalNearDupes.has(slug);
  if (isNdBlocked) {
    item.status = 'PASS_NOINDEX_NEAR_DUPE';
    item.indexable = false;
    item.release_date = 'NONE';
    blockedNdCount++;
    continue;
  }

  // Otherwise PASS_SCHEDULED
  item.status = 'PASS_SCHEDULED';
  item.indexable = false;
  scheduledCount++;
}

// 4. Specifically fix alien-memory
if (topContent['alien-memory']) {
  const am = topContent['alien-memory'];
  am.description = "Alien Memory is an engaging cosmic brain-teaser where players flip and match pairs of colorful extraterrestrial cards across progressive puzzle boards. Featuring playful alien illustrations, futuristic spacecraft, and cosmic symbols, each round challenges your visual recall and concentration under timed grid layouts. Your objective is to systematically reveal hidden cards, memorize their positions, and clear matching pairs in the fewest moves possible to earn maximum points and advance through progressively larger card grids.\n\nSuccess in Alien Memory relies on methodical memory strategies rather than hasty guessing. Contenders click or tap cards to flip them face up, tracking alien faces and cosmic icons to pair them off cleanly as new matches are uncovered. Later stages expand the card grid and introduce tighter clearance timers that test your mental composure and rapid recall. Steady observation, disciplined spatial mapping across grid quadrants, and calm focus ensure you achieve flawless clears and high-scoring streaks throughout every otherworldly trial.";
  am.howToPlay = "Click or tap cards to flip them face up and reveal the hidden alien symbol. Find and match identical card pairs to remove them from the board. Clear the full grid before the countdown timer expires.";
  am.controls = [
    { key: "Mouse Left Click", action: "Select and flip alien cards to reveal hidden symbols" },
    { key: "Touch Tap", action: "Tap cards directly on mobile touchscreen displays to reveal pairs" },
    { key: "R Key", action: "Restart the current memory stage with a fresh card shuffle" },
    { key: "UI Guidance", action: "Access hint functions and mute sound effects via on-screen buttons" }
  ];
  am.tips = [
    "Focus on memorizing card positions quadrant by quadrant rather than flipping randomly across the board.",
    "Keep track of already revealed alien symbols so you can immediately complete pairs when their match appears.",
    "Work calmly during early turns to build an accurate mental map of the grid before clearance timers run low."
  ];
  am.faq = [
    {
      q: "What is the main objective in Alien Memory?",
      a: "In Alien Memory, players flip cards to find and match pairs of identical extraterrestrial icons, clearing the entire board in the fewest moves possible."
    },
    {
      q: "How do you control and play Alien Memory?",
      a: "Click with a mouse on desktop or tap cards on mobile touchscreen devices to reveal hidden symbols and pair matching cards."
    },
    {
      q: "Is Alien Memory free to play online?",
      a: "Yes, Alien Memory is completely free to play directly in web browsers on BlockHub.games with no downloads or installation required."
    }
  ];
  am.meta_title = "Alien Memory - Play Free Online | BlockHub.games";
  am.meta_description = "Play Alien Memory free online at BlockHub.games! Match extraterrestrial card pairs, test your recall, and clear progressive puzzle grids in your browser.";
  am.word_count = am.description.split(/\s+/).filter(Boolean).length;
}

console.log('\n=== CATALOG SANITIZATION COMPLETE ===');
console.log(`Live Indexable Games (PASS_LIVE)       : ${liveCount}`);
console.log(`Scheduled Games (PASS_SCHEDULED)       : ${scheduledCount}`);
console.log(`Blocked Trademarks (BLOCKED_TRADEMARK) : ${blockedTmCount}`);
console.log(`Near-Duplicates (PASS_NOINDEX_NEAR_DUPE): ${blockedNdCount}`);
console.log(`Total games in topContent              : ${Object.keys(topContent).length}`);

// Write back to JSON and JS
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');
const jsExport = `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`;
fs.writeFileSync(TOP_JS, jsExport, 'utf8');
console.log('Successfully updated data/top-games-content.json and data/top-games-content.js!');
