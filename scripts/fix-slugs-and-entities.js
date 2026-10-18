#!/usr/bin/env node
/**
 * Fix corrupt slugs (-amp-, -mdash-, -ndash-) and HTML entities in titles.
 * Updates data/top-games-content.json, data/top-games-content.js, data/games.js,
 * and adds 301 redirects to public/_redirects.
 */

const fs = require("fs");
const path = require("path");

const TOP_JSON = path.join(__dirname, "../data/top-games-content.json");
const TOP_JS = path.join(__dirname, "../data/top-games-content.js");
const GAMES_JS = path.join(__dirname, "../data/games.js");
const REDIRECTS = path.join(__dirname, "../public/_redirects");

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;amp;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&times;/g, "x")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

const slugRenames = {
  "bus-amp-subway-rush": "bus-and-subway-rush",
  "good-guys-amp-bad-boys-zombie-survival-gui": "good-guys-and-bad-boys-zombie-survival-gui",
  "snack-amp-warp": "snack-and-warp",
  "ship-amp-fish": "ship-and-fish",
  "balloon-pop-pop-amp-blast": "balloon-pop-pop-and-blast",
  "snake-run-eat-amp-grow": "snake-run-eat-and-grow",
  "win-magic-amp-devil": "win-magic-and-devil",
  "crazy-aunty-slap-amp-punch": "crazy-aunty-slap-and-punch",
  "giant-crusher-destroy-amp-grow": "giant-crusher-destroy-and-grow",
  "heaven-amp-hell-idle": "heaven-and-hell-idle",
  "catchfish-mdash-fishing-master": "catchfish-fishing-master",
  "merge-plants-ndash-defense-zombies": "merge-plants-defense-zombies",
  "ball-packing-master-puzzle-ndash-fill-box": "ball-packing-master-puzzle-fill-box"
};

// 1. Update top-games-content.json
console.log("Updating top-games-content.json...");
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, "utf8"));
const newTopContent = {};

for (const [key, val] of Object.entries(topContent)) {
  const newKey = slugRenames[key] || key;
  val.slug = newKey;
  if (val.title) val.title = decodeHtmlEntities(val.title);
  if (val.meta_title) val.meta_title = decodeHtmlEntities(val.meta_title);
  if (val.description) val.description = decodeHtmlEntities(val.description);
  newTopContent[newKey] = val;
}

fs.writeFileSync(TOP_JSON, JSON.stringify(newTopContent, null, 2), "utf8");
fs.writeFileSync(TOP_JS, `export const topGamesContent = ${JSON.stringify(newTopContent, null, 2)};\n`, "utf8");
console.log("Updated top-games-content.json and top-games-content.js");

// 2. Update data/games.js
console.log("Updating data/games.js...");
let gamesContent = fs.readFileSync(GAMES_JS, "utf8");

for (const [oldSlug, newSlug] of Object.entries(slugRenames)) {
  gamesContent = gamesContent.replaceAll(`"slug": "${oldSlug}"`, `"slug": "${newSlug}"`);
}
gamesContent = gamesContent.replaceAll(`"CatchFish &mdash; Fishing Master"`, `"CatchFish - Fishing Master"`);
gamesContent = gamesContent.replaceAll(`"Bus &amp; Subway Rush"`, `"Bus & Subway Rush"`);
gamesContent = gamesContent.replaceAll(`"Bus &amp;amp; Subway Rush"`, `"Bus & Subway Rush"`);

fs.writeFileSync(GAMES_JS, gamesContent, "utf8");
console.log("Updated data/games.js");

// 3. Update public/_redirects
console.log("Updating public/_redirects...");
let redirectsContent = fs.readFileSync(REDIRECTS, "utf8");

for (const [oldSlug, newSlug] of Object.entries(slugRenames)) {
  const redirectLine = `/game/${oldSlug} /game/${newSlug} 301`;
  if (!redirectsContent.includes(`/game/${oldSlug} `)) {
    redirectsContent += `${redirectLine}\n`;
  }
}

fs.writeFileSync(REDIRECTS, redirectsContent, "utf8");
console.log("Updated public/_redirects");

console.log("Done fixing slugs and entities!");
