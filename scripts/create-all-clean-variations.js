// scripts/create-all-clean-variations.js
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

// 1. DRIVING
const { buildDriving } = require('./lib/builders/driving-builder');
const { build50UniqueSentences } = require('./create-clean-s5');

const dRaw = buildDriving();
const dP1S5 = build50UniqueSentences('driving', 1);
const dP2S5 = build50UniqueSentences('driving', 2);

const drivingVariations = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  drivingVariations.p1.push(`${dRaw.p1[i]} ${dP1S5[i]}`);
  drivingVariations.p2.push(`${dRaw.p2[i]} ${dP2S5[i]}`);
}

console.log('Driving variations compiled:', drivingVariations.p1.length);
