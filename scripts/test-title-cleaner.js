const fs = require('fs');
const { games } = require('../data/games.js');

const ACRONYMS = new Set([
  '2D', '3D', '4D', 'FPS', 'RPG', 'PVP', 'PVE', 'IO', 'WOMS', 'GTA', 'FNAF',
  'WW2', 'BMX', 'ATV', 'UFO', 'DNA', 'VIP', 'AI', 'HTML5', 'PC', 'VR', 'HD',
  '4X4', '4WD', 'F.E.A.R.', 'CS:GO', 'PUBG', 'MMO', 'RTS'
]);

// Minor words that stay lowercase unless at start or after colon/hyphen
const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'the', 'to', 'up', 'vs', 'via'
]);

function cleanTitle(raw) {
  if (!raw) return '';
  let t = raw.trim();

  // 1. Replace wide gaps (3 or more spaces, or spaces with punctuation)
  // e.g. "Shadow Fist   Kung Fu" -> "Shadow Fist - Kung Fu"
  // "Sandbox Squid Game   Create a Challenge" -> "Sandbox Squid Game: Create a Challenge"
  // "WOMS   World of Master Survivors" -> "WOMS: World of Master Survivors"
  t = t.replace(/\s{3,}/g, ' - ');
  t = t.replace(/\s{2}/g, ' ');

  // Clean weird spacing around colons and hyphens
  t = t.replace(/\s+:\s+/g, ': ');
  t = t.replace(/\s+-\s+/g, ' - ');
  t = t.replace(/\s*:\s*/g, ': ');
  t = t.replace(/\s*-\s*-\s*/g, ' - ');

  // Special colon adjustments for subtitle patterns
  if (t.includes(' - Create a Challenge')) t = t.replace(' - Create a Challenge', ': Create a Challenge');
  if (t.includes(' - World of Master')) t = t.replace(' - World of Master', ': World of Master');
  if (t.includes('HIll')) t = t.replace('HIll', 'Hill');

  // 2. Tokenize and capitalize properly while preserving acronyms
  // Split on spaces while tracking punctuation
  const words = t.split(' ');
  const cleanedWords = words.map((word, idx) => {
    if (!word) return '';

    // Handle compound tokens like "2.5D", "2d", "3d", "io", "offroad"
    // Check if word has leading/trailing punctuation like "(2d)" or "2d:"
    const m = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9'.-]+)([^a-zA-Z0-9]*)$/);
    if (!m) return word;
    const prefix = m[1];
    const core = m[2];
    const suffix = m[3];

    const coreUpper = core.toUpperCase();
    if (ACRONYMS.has(coreUpper)) {
      return prefix + coreUpper + suffix;
    }

    // Check minor word rule (stay lowercase if not first word, unless preceding word ended in colon/hyphen)
    const prevWord = idx > 0 ? words[idx - 1] : '';
    const isAfterPunct = idx === 0 || prevWord.endsWith(':') || prevWord.endsWith('-') || prevWord === '-';
    const coreLower = core.toLowerCase();

    if (!isAfterPunct && MINOR_WORDS.has(coreLower)) {
      return prefix + coreLower + suffix;
    }

    // Capitalize first letter, keep rest as-is if already mixed case, or lowercase rest if all lowercase
    if (core === core.toLowerCase()) {
      return prefix + core.charAt(0).toUpperCase() + core.slice(1) + suffix;
    }

    return prefix + core.charAt(0).toUpperCase() + core.slice(1) + suffix;
  });

  let result = cleanedWords.join(' ');
  // Clean up any remaining double spaces
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

const changes = [];
for (const g of games) {
  const normalized = cleanTitle(g.title);
  if (normalized !== g.title) {
    changes.push({
      slug: g.slug,
      before: g.title,
      after: normalized,
    });
  }
}

console.log(`Total games whose titles will be updated: ${changes.length}`);
console.log('Sample before/after:');
changes.slice(0, 30).forEach(c => {
  console.log(`"${c.before}"  -->  "${c.after}"`);
});
