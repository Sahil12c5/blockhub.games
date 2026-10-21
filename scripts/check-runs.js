const fs = require('fs');
const path = require('path');

const files = [
  'scripts/lib/clean-replacements.js',
  'scripts/lib/puzzle-replacements.js',
  'scripts/lib/sports-replacements.js',
  'scripts/lib/general-replacements.js',
  'scripts/lib/builders/driving-builder.js',
  'scripts/lib/builders/shooting-builder.js',
  'scripts/lib/builders/puzzle-builder.js',
  'scripts/lib/builders/sports-builder.js',
  'scripts/lib/builders/general-builder.js'
];

const runCounts = {};
const runLocations = {};

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const matches = text.match(/"([^"]+)"|'([^']+)'/g) || [];
  for (const m of matches) {
    const raw = m.slice(1, -1);
    if (raw.length > 30) {
      const words = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      const seenInString = new Set();
      for (let i = 0; i <= words.length - 6; i++) {
        seenInString.add(words.slice(i, i + 6).join(' '));
      }
      for (const r of seenInString) {
        runCounts[r] = (runCounts[r] || 0) + 1;
        if (!runLocations[r]) runLocations[r] = new Set();
        runLocations[r].add(path.basename(f));
      }
    }
  }
}

const repeatedRuns = Object.entries(runCounts).filter(([r, c]) => c > 1).sort((a, b) => b[1] - a[1]);
console.log('Total repeated 6-word runs in builders/replacements:', repeatedRuns.length);
console.log('Top 25 repeated runs:');
repeatedRuns.slice(0, 25).forEach(([r, c]) => {
  console.log(c + ' occurrences in ' + Array.from(runLocations[r]).join(', ') + ': ' + r);
});
