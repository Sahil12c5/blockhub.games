// scripts/build-and-verify-all-genres.js
// Compiles 55 variations for driving, shooting, puzzle, sports, and general.
// Asserts ZERO cross-genre 6-word runs and ZERO within-genre duplicates!

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
const { buildDriving } = require('./lib/builders/driving-builder');
const drivingRaw = buildDriving();

// Let's create an automated test to inspect drivingRaw
console.log('Driving variations loaded:', drivingRaw.p1.length, drivingRaw.p2.length);
