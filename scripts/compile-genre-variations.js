// scripts/compile-genre-variations.js
// Compiles 55 pristine, 100% genre-isolated 5-sentence bodies for P1 and P2
// Genres: driving, shooting, puzzle, sports, general

const fs = require('fs');
const path = require('path');

function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const runs = new Set();
  for (let i = 0; i <= words.length - 6; i++) {
    runs.add(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

// DRIVING BUILDER
const driving = require('./lib/builders/driving-builder').buildDriving();
// Let's inspect driving: driving has 50 items for p1S1..p1S4, and we have clean S5 in create-clean-s5.js!
// Let's create a complete, self-contained generator for all 5 genres.
console.log('Building genre variations generator...');
