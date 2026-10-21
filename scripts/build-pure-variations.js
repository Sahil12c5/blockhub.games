// scripts/build-pure-variations.js
// Generates 60 unique 5-sentence variations for P1 and P2 across 5 genres:
// driving, shooting, puzzle, sports, general.
// Asserts ZERO cross-genre 6-word runs and ZERO within-genre duplicate sentences!

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

console.log('Generating pure variations...');
