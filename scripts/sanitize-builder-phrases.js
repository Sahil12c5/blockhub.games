const fs = require('fs');
const path = require('path');

// Helper to inspect all 6-word runs across all 5 builders
function analyzeCrossPoolRuns() {
  const { buildDriving } = require('./lib/builders/driving-builder.js');
  const { buildShooting } = require('./lib/builders/shooting-builder.js');
  const { buildPuzzle } = require('./lib/builders/puzzle-builder.js');
  const { buildSports } = require('./lib/builders/sports-builder.js');
  const { buildGeneral } = require('./lib/builders/general-builder.js');

  const genres = {
    driving: buildDriving(),
    shooting: buildShooting(),
    puzzle: buildPuzzle(),
    sports: buildSports(),
    general: buildGeneral()
  };

  const runToGenres = new Map();

  for (const [gName, data] of Object.entries(genres)) {
    const allText = [...data.p1, ...data.p2].join(' ');
    const words = allText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    for (let i = 0; i <= words.length - 6; i++) {
      const run = words.slice(i, i + 6).join(' ');
      if (!runToGenres.has(run)) runToGenres.set(run, new Set());
      runToGenres.get(run).add(gName);
    }
  }

  const crossGenreRuns = [];
  for (const [run, gSet] of runToGenres.entries()) {
    if (gSet.size > 1) {
      crossGenreRuns.push({ run, genres: Array.from(gSet) });
    }
  }

  console.log(`Total 6-word runs shared across different genres: ${crossGenreRuns.length}`);
  if (crossGenreRuns.length > 0) {
    console.log('Sample shared runs:');
    crossGenreRuns.slice(0, 10).forEach(r => console.log(` - "${r.run}" in [${r.genres.join(', ')}]`));
  }
  return crossGenreRuns;
}

analyzeCrossPoolRuns();
