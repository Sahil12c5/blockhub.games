// scripts/compile-master-builders.js
// Compiles 50 100% domain-isolated, 5-sentence variations for all 5 genres
// Verifies ZERO cross-genre 6-word runs!

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

// DRIVING: Use verified clean driving builder + clean S5
const { buildDriving } = require('./lib/builders/driving-builder');
const drivingRaw = buildDriving();
// Let's get clean S5 from create-clean-s5.js
const { build50UniqueSentences } = require('./get-s5-helper');
