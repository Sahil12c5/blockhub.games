const fs = require('fs');
const files = ['driving-builder.js', 'shooting-builder.js', 'puzzle-builder.js', 'sports-builder.js', 'general-builder.js'];
const idioms = {};

for (const f of files) {
  const code = fs.readFileSync('./scripts/lib/builders/' + f, 'utf8');
  const lines = code.split(/\r?\n/).filter(l => l.includes('"') && l.trim().startsWith('"'));
  for (const l of lines) {
    const text = l.trim().slice(1, -2);
    const w = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    for (let i = 0; i <= w.length - 4; i++) {
      const g4 = w.slice(i, i + 4).join(' ');
      if (!idioms[g4]) idioms[g4] = new Set();
      idioms[g4].add(f);
    }
  }
}

const shared4 = Object.entries(idioms)
  .filter(([g4, set]) => set.size >= 3)
  .map(([g4, set]) => ({ idiom: g4, count: set.size, files: Array.from(set) }))
  .sort((a, b) => b.count - a.count);

console.log('Top shared 4-word patterns across 3+ builders:', shared4.length);
console.log(shared4.slice(0, 30));
