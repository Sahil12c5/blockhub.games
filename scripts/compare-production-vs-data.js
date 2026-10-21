const fs = require('fs');
const path = require('path');

const passedCsv = fs.readFileSync(path.join(__dirname, '../reports/passed-games.csv'), 'utf8');
const lines = passedCsv.trim().split(/\r?\n/).slice(1);
const passLiveGames = [];
for (const line of lines) {
  const parts = line.split(',');
  const slug = (parts[0] || '').replace(/^"|"$/g, '').trim();
  const status = (parts[8] || '').replace(/^"|"$/g, '').trim();
  if (status === 'PASS_LIVE') passLiveGames.push(slug);
}
console.log('PASS_LIVE games count in passed-games.csv:', passLiveGames.length);

const topContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/top-games-content.json'), 'utf8'));

let matchCount = 0;
let mismatchCount = 0;
const mismatches = [];

for (const slug of passLiveGames) {
  const htmlPath = path.join(__dirname, '../out/game', slug + '.html');
  if (!fs.existsSync(htmlPath)) {
    mismatches.push({
      slug,
      reason: 'HTML file missing in out/game/',
      canonOk: false,
      robotsOk: false,
      aboutOk: false,
    });
    mismatchCount++;
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const tc = topContent[slug];
  if (!tc) {
    mismatches.push({
      slug,
      reason: 'Missing in topContent',
      canonOk: false,
      robotsOk: false,
      aboutOk: false,
    });
    mismatchCount++;
    continue;
  }

  // Canonical check
  const canonMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  const builtCanon = canonMatch ? canonMatch[1] : '';
  const expectedCanon = 'https://blockhub.games/game/' + slug;
  const canonOk = builtCanon === expectedCanon;

  // Robots check
  const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
  const builtRobots = robotsMatch ? robotsMatch[1] : '';
  const expectedRobots = (tc.content_ready && tc.indexable) ? 'index, follow' : 'noindex, follow';
  const robotsOk = builtRobots.toLowerCase().includes('index') && !builtRobots.toLowerCase().includes('noindex');

  // About text check (first 120 chars)
  // In out/game/[slug].html, look for About heading
  // <h2 ...>About ...</h2><div ...>About Text</div>
  const aboutMatch = html.match(/About <!-- -->[\s\S]*?<\/h2><div[^>]*>([\s\S]*?)<\/div>/i) ||
                     html.match(/About [^<]*<\/h2><div[^>]*>([\s\S]*?)<\/div>/i);
  let builtAbout = '';
  if (aboutMatch) {
    builtAbout = aboutMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }
  const expectedAbout = (tc.description || '').replace(/\s+/g, ' ').trim();

  const built120 = builtAbout.slice(0, 120);
  const expected120 = expectedAbout.slice(0, 120);
  const aboutOk = built120 === expected120;

  if (!canonOk || !robotsOk || !aboutOk) {
    mismatches.push({
      slug,
      canonOk,
      robotsOk,
      aboutOk,
      built120,
      expected120,
      builtRobots,
      expectedRobots,
      builtCanon,
      expectedCanon
    });
    mismatchCount++;
  } else {
    matchCount++;
  }
}

console.log('Comparison complete:');
console.log('Matches:', matchCount);
console.log('Mismatches:', mismatchCount);
if (mismatches.length > 0) {
  console.log('Sample mismatches (first 5):');
  console.log(JSON.stringify(mismatches.slice(0, 5), null, 2));
}

// Check alien-memory specifically
const am = mismatches.find(m => m.slug === 'alien-memory');
console.log('\nalien-memory check:');
if (am) {
  console.log('alien-memory was MISMATCHED:', am);
} else {
  console.log('alien-memory was MATCHED between HTML and top-games-content.');
}
