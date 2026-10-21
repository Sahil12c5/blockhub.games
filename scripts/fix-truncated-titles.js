const fs = require('fs');

const topJsonPath = 'data/top-games-content.json';
const top = JSON.parse(fs.readFileSync(topJsonPath, 'utf8'));

if (top['tung-tung-tung-sahur-vs-bombardino-crocodilo']) {
  top['tung-tung-tung-sahur-vs-bombardino-crocodilo'].meta_title = 'Tung-Tung-Tung Sahur vs Bombardino | BlockHub.games';
}

if (top['crazy-revolution-police-runner-hyper-casual']) {
  top['crazy-revolution-police-runner-hyper-casual'].meta_title = 'Crazy Revolution - Police Runner | BlockHub.games';
}

fs.writeFileSync(topJsonPath, JSON.stringify(top, null, 2), 'utf8');

const topJsContent = 'export const topGamesContent = ' + JSON.stringify(top, null, 2) + ';\nexport default topGamesContent;\n';
fs.writeFileSync('data/top-games-content.js', topJsContent, 'utf8');

// Update reports/shortened-titles.json
const stPath = 'reports/shortened-titles.json';
const stList = JSON.parse(fs.readFileSync(stPath, 'utf8'));

stList.forEach(item => {
  if (item.slug === 'tung-tung-tung-sahur-vs-bombardino-crocodilo') {
    item.original = 'Tung-Tung-Tung Sahur vs Bombardino Crocodilo - Play Free Online';
    item.shortened = 'Tung-Tung-Tung Sahur vs Bombardino | BlockHub.games';
    item.origLen = 61;
    item.newLen = 51;
  }
  if (item.slug === 'crazy-revolution-police-runner-hyper-casual') {
    item.original = 'Crazy Revolution - Police Runner: Hyper Casual - Play Free Online';
    item.shortened = 'Crazy Revolution - Police Runner | BlockHub.games';
    item.origLen = 65;
    item.newLen = 49;
  }
});

fs.writeFileSync(stPath, JSON.stringify(stList, null, 2), 'utf8');
console.log('Successfully updated truncated titles!');
