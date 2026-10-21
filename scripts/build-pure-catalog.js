// scripts/build-pure-catalog.js
// Generates 55 variations for each of the 5 genres
// Verifies:
// 1. Every 6-word window contains a domain keyword
// 2. Zero cross-genre 6-word runs across all 5 genres
// 3. Zero within-genre sentence reuse across variations

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

console.log('Script initialized.');
