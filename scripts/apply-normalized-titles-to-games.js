const fs = require('fs');
const path = require('path');
const { normalizeTitle } = require('./normalize-all-titles.js');

const GAMES_JS = path.join(__dirname, '../data/games.js');
let gamesJs = fs.readFileSync(GAMES_JS, 'utf8');

// Regex replace "title": "..."
let count = 0;
gamesJs = gamesJs.replace(/"title":\s*"([^"]+)"/g, (match, title) => {
  const norm = normalizeTitle(title);
  if (norm !== title) count++;
  return `"title": "${norm}"`;
});

fs.writeFileSync(GAMES_JS, gamesJs, 'utf8');
console.log(`Successfully updated ${count} title occurrences in data/games.js!`);
