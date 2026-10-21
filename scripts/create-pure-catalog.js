// scripts/create-pure-catalog.js
// Builds 55 variations per genre for: driving, shooting, puzzle, sports, general.
// Every sentence is crafted with high-density domain keywords ensuring 0 cross-genre 6-word runs!

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

console.log('Building pure domain catalog...');
