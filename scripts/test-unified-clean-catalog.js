// scripts/test-unified-clean-catalog.js
// Tests the complete synthesis of clean domain bodies for all 5 genres

const fs = require('fs');

function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const runs = new Set();
  for (let i = 0; i <= words.length - 6; i++) {
    runs.add(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

console.log('Testing unified clean catalog synthesis...');
