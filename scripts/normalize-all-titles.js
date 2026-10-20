const fs = require('fs');
const path = require('path');

const GAMES_JS = path.join(__dirname, '../data/games.js');
const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');

const { rawGames, games } = require('../data/games.js');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const ACRONYMS = new Set([
  '2D', '3D', '4D', 'FPS', 'RPG', 'PVP', 'PVE', 'IO', 'WOMS', 'GTA', 'FNAF',
  'WW2', 'BMX', 'ATV', 'UFO', 'DNA', 'VIP', 'AI', 'HTML5', 'PC', 'VR', 'HD',
  '4X4', '4WD', 'F.E.A.R.', 'CS:GO', 'PUBG', 'MMO', 'RTS'
]);

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'or', 'the', 'to', 'up', 'vs', 'via', 'with'
]);

function normalizeTitle(raw) {
  if (!raw) return '';
  let t = raw.trim();

  // 1. Collapse multiple spaces & replace stray gaps
  // e.g. "Shadow Fist   Kung Fu" -> "Shadow Fist - Kung Fu"
  t = t.replace(/\s{3,}/g, ' - ');
  t = t.replace(/\s{2}/g, ' - ');

  // Standardize punctuation spacing
  t = t.replace(/\s+:\s*/g, ': ');
  t = t.replace(/\s*:\s+/g, ': ');
  t = t.replace(/\s+-\s*/g, ' - ');
  t = t.replace(/\s*-\s+/g, ' - ');
  t = t.replace(/:\s*:\s*/g, ': ');
  t = t.replace(/-\s*-\s*/g, ' - ');

  // Fix subtitle formatting
  if (t.includes(' - Create a Challenge')) t = t.replace(' - Create a Challenge', ': Create a Challenge');
  if (t.includes(' - World of Master')) t = t.replace(' - World of Master', ': World of Master');
  if (t.includes('HIll')) t = t.replace('HIll', 'Hill');
  if (t.includes('Io') && !t.includes('Lion')) t = t.replace(/\bIo\b/, 'IO');

  // Tokenize and capitalize properly while preserving acronyms
  const words = t.split(' ');
  const cleaned = words.map((w, idx) => {
    if (!w) return '';

    // Match prefix, core alphanumeric, suffix
    const m = w.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9'.-]+)([^a-zA-Z0-9]*)$/);
    if (!m) return w;
    const prefix = m[1];
    const core = m[2];
    const suffix = m[3];

    const coreUpper = core.toUpperCase();
    if (ACRONYMS.has(coreUpper)) {
      return prefix + coreUpper + suffix;
    }

    const coreLower = core.toLowerCase();
    const prevWord = idx > 0 ? words[idx - 1] : '';
    const isFirstInClause = idx === 0 || prevWord.endsWith(':') || prevWord.endsWith('-') || prevWord === '-';

    if (!isFirstInClause && MINOR_WORDS.has(coreLower)) {
      return prefix + coreLower + suffix;
    }

    return prefix + core.charAt(0).toUpperCase() + core.slice(1) + suffix;
  });

  return cleaned.join(' ').replace(/\s+/g, ' ').trim();
}

console.log('--- SCANNING TITLES FOR NORMALIZATION ---');

const changedList = [];
const titleMap = new Map();

for (const g of games) {
  const norm = normalizeTitle(g.title);
  if (norm !== g.title) {
    changedList.push({
      slug: g.slug,
      before: g.title,
      after: norm,
    });
  }
  titleMap.set(g.slug, norm);
}

console.log(`Found ${changedList.length} titles changed in games.js!`);

// Save changed list for reporting
fs.writeFileSync(
  path.join(__dirname, '../reports/title-changes.json'),
  JSON.stringify(changedList, null, 2),
  'utf8'
);

module.exports = {
  normalizeTitle,
  changedList,
  titleMap,
};
