const fs = require('fs');
const { buildDriving } = require('./lib/builders/driving-builder');
const { buildShooting } = require('./lib/builders/shooting-builder');
const { buildPuzzle } = require('./lib/builders/puzzle-builder');
const { buildSports } = require('./lib/builders/sports-builder');
const { buildGeneral } = require('./lib/builders/general-builder');

function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const runs = new Set();
  for (let i = 0; i <= words.length - 6; i++) {
    runs.add(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

const builders = {
  driving: buildDriving(),
  shooting: buildShooting(),
  puzzle: buildPuzzle(),
  sports: buildSports(),
  general: buildGeneral()
};

// Check within each builder
console.log('--- Checking within-genre 6-word runs in S1-S4 ---');
for (const [genre, data] of Object.entries(builders)) {
  const p1Runs = new Map();
  for (let i = 0; i < data.p1.length; i++) {
    for (const r of get6WordRuns(data.p1[i])) {
      p1Runs.set(r, (p1Runs.get(r) || 0) + 1);
    }
  }
  let p1Dupes = 0;
  for (const [r, count] of p1Runs.entries()) {
    if (count > 1) {
      p1Dupes++;
    }
  }

  const p2Runs = new Map();
  for (let i = 0; i < data.p2.length; i++) {
    for (const r of get6WordRuns(data.p2[i])) {
      p2Runs.set(r, (p2Runs.get(r) || 0) + 1);
    }
  }
  let p2Dupes = 0;
  for (const [r, count] of p2Runs.entries()) {
    if (count > 1) {
      p2Dupes++;
    }
  }

  console.log(`${genre}: P1 dupes = ${p1Dupes}, P2 dupes = ${p2Dupes}`);
}

console.log('--- Checking cross-genre 6-word runs in S1-S4 ---');
const crossRuns = new Map();
for (const [genre, data] of Object.entries(builders)) {
  for (const p of [...data.p1, ...data.p2]) {
    for (const r of get6WordRuns(p)) {
      if (!crossRuns.has(r)) crossRuns.set(r, new Set());
      crossRuns.get(r).add(genre);
    }
  }
}

let crossDupes = 0;
for (const [r, genres] of crossRuns.entries()) {
  if (genres.size > 1) {
    crossDupes++;
    console.log(`Cross-genre run: "${r}" in [${Array.from(genres).join(', ')}]`);
  }
}
console.log(`Total cross-genre 6-word runs in S1-S4: ${crossDupes}`);
