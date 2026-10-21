const fs = require('fs');
const passedCsv = fs.readFileSync('reports/passed-games.csv', 'utf8');
const lines = passedCsv.trim().split(/\r?\n/).slice(1);
const wcMap = {};
for (const line of lines) {
  const parts = line.split(',');
  const slug = parts[0].replace(/"/g, '');
  const wc = parseInt(parts[5].replace(/"/g, ''), 10);
  wcMap[slug] = wc;
}
const gscUrls = [
  'ragdoll-survivor',
  'euro-truck-parking',
  'skyblock-3d',
  'left-dead-last-convoy',
  'referee-simulator-3d',
  'slingshot-shooting-game',
  'dinos-rush',
  'storm-dash',
  'stickman-archery-ragdoll',
  'counter-craft-sniper',
  'destroy-the-ragdoll-sandbox',
  'car-parkour-challenge',
  'zombie-highway-car-game',
  'car-obby-3d',
  'obby-rocket-shopping-cart',
  'cartoon-football',
  'sniper-silent-ridge',
  'bus-mania-parking-puzzle'
];
for (const slug of gscUrls) {
  console.log(`${slug}: ${wcMap[slug]} words`);
}
