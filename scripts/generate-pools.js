const fs = require('fs');
const path = require('path');

// Helper to get 6-word runs
function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const runs = [];
  for (let i = 0; i <= words.length - 6; i++) {
    runs.push(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

// Verification function
function verifyPool(name, arr) {
  if (arr.length !== 50) throw new Error(`${name} must have 50 items, got ${arr.length}`);
  const sents = new Set();
  const runs = new Set();
  let wordsTotal = 0;

  for (let i = 0; i < arr.length; i++) {
    const text = arr[i];
    const wCount = text.split(/\s+/).filter(Boolean).length;
    wordsTotal += wCount;
    if (wCount < 60 || wCount > 95) {
      throw new Error(`${name}[${i}] word count out of range: ${wCount} (expected 60-95)`);
    }

    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    for (const s of sentences) {
      if (sents.has(s)) throw new Error(`${name} duplicate sentence: "${s}"`);
      sents.add(s);
    }

    const itemRuns = get6WordRuns(text);
    for (const r of itemRuns) {
      if (runs.has(r)) throw new Error(`${name} duplicate 6-word run: "${r}"`);
      runs.add(r);
    }
  }

  const avgWords = (wordsTotal / arr.length).toFixed(1);
  console.log(`Verified ${name}: 50 items, 0 duplicate sentences, 0 duplicate 6-word runs, avg ${avgWords} words.`);
}

console.log('Building full distinct body variations for all genres...');
