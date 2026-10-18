#!/usr/bin/env node
/**
 * Unindex all games that currently have indexable: true but fail the audit.
 * Sets indexable: false in top-games-content.json and top-games-content.js
 * until they pass quality gates.
 */

const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "../data/top-games-content.json");
const jsPath = path.join(__dirname, "../data/top-games-content.js");

// Fix JSON
const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
let unindexed = 0;

for (const slug of Object.keys(data)) {
  if (data[slug].indexable) {
    data[slug].indexable = false;
    unindexed++;
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");
console.log(`Unindexed ${unindexed} games in top-games-content.json`);

// Fix JS (export version)
const jsContent = `export const topGamesContent = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, "utf8");
console.log(`Updated top-games-content.js`);

// Now regenerate sitemap
console.log("\nRegenerating sitemap...");
require("./generate-sitemap.js");
