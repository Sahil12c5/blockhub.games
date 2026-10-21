const fs = require('fs');
const path = require('path');

function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const runs = [];
  for (let i = 0; i <= words.length - 6; i++) {
    runs.push(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

// DRIVING BUILDER
const { buildDriving } = require('./build-distinct-bodies-v2.js');
const driving = buildDriving();

// Let's ensure each sentence is rich (~23-26 words)
function expandDriving(d) {
  // Let's check current word count
  return d;
}

// Let's create builders for Shooting, Puzzle, Sports, General with 50 distinct items each.
