const fs = require('fs');
const path = require('path');
const topContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/top-games-content.json'), 'utf8'));

function formatGameTitle(game) {
  const cleanName = (game.title || '').trim();
  let base = (game.meta_title || '').trim();

  // Strip any existing brand suffixes
  base = base
    .replace(/\s*[|–-]\s*BlockHub(\.games)?\s*$/i, '')
    .replace(/\s*[|–-]\s*BlockHub\s*$/i, '')
    .trim();

  if (!base) {
    base = `${cleanName} - Play Free Online`;
  }

  const brand = ' | BlockHub.games';
  const shortBrand = ' | BlockHub';
  const maxLen = 60;

  if (base.length + brand.length <= maxLen) {
    return `${base}${brand}`;
  }
  if (base.length + shortBrand.length <= maxLen) {
    return `${base}${shortBrand}`;
  }

  // Shorten base cleanly to fit brand
  const targetBaseLen = maxLen - brand.length;
  let shortened = base.slice(0, targetBaseLen).trim();
  if (shortened.includes(' ')) {
    const lastSpace = shortened.lastIndexOf(' ');
    if (lastSpace > 12) {
      shortened = shortened.slice(0, lastSpace).trim();
    }
  }
  shortened = shortened.replace(/[–\-:,|]+$/, '').trim();
  const withBrand = `${shortened}${brand}`;
  if (withBrand.length <= maxLen) return withBrand;

  const targetShortBaseLen = maxLen - shortBrand.length;
  let shortBase = base.slice(0, targetShortBaseLen).trim().replace(/[–\-:,|]+$/, '').trim();
  return `${shortBase}${shortBrand}`;
}

const shortenedTitles = [];
let over60Count = 0;
let doubleBrandCount = 0;

for (const [slug, game] of Object.entries(topContent)) {
  const oldTitle = game.meta_title || `${game.title} - Play Free Online | BlockHub.games`;
  const newTitle = formatGameTitle(game);

  if (newTitle.length > 60) {
    over60Count++;
    console.error(`Over 60! (${newTitle.length}): ${newTitle}`);
  }
  if (/BlockHub.*BlockHub/i.test(newTitle)) {
    doubleBrandCount++;
    console.error(`Double brand!: ${newTitle}`);
  }
  if (oldTitle.length > 60 || oldTitle !== newTitle) {
    if (newTitle.length < oldTitle.length || oldTitle.length > 60) {
      shortenedTitles.push({
        slug,
        original: oldTitle,
        shortened: newTitle,
        origLen: oldTitle.length,
        newLen: newTitle.length
      });
    }
  }
}

console.log(`\nResults across ${Object.keys(topContent).length} games:`);
console.log(`- Over 60 chars: ${over60Count}`);
console.log(`- Double brand: ${doubleBrandCount}`);
console.log(`- Shortened/Normalized titles count: ${shortenedTitles.length}`);
console.log('\nSample shortened titles (first 10):');
console.log(JSON.stringify(shortenedTitles.slice(0, 10), null, 2));

fs.writeFileSync(
  path.join(__dirname, '../reports/shortened-titles.json'),
  JSON.stringify(shortenedTitles, null, 2),
  'utf8'
);
