const fs = require('fs');
const path = require('path');
const top = JSON.parse(fs.readFileSync('data/top-games-content.json', 'utf8'));
const sitemap = fs.readFileSync('public/sitemap-games.xml', 'utf8');

const live = Object.values(top).filter(g => g.status === 'PASS_LIVE' && g.indexable);
console.log('Total live in top:', live.length);

const verifiedLive = [];
for (const g of live) {
  const htmlPath = path.join('.next/server/app/game', g.slug + '.html');
  const inSitemap = sitemap.includes('/game/' + g.slug);
  let robots = 'not found';
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const m = html.match(/name="robots"\s+content="([^"]+)"/i);
    if (m) robots = m[1];
  }
  if (inSitemap && robots === 'index, follow') {
    verifiedLive.push({ slug: g.slug, title: g.title, category: g.category, word_count: g.word_count });
  }
}

console.log('Verified live in sitemap & HTML index, follow:', verifiedLive.length);
console.log('Sample verified live games:', verifiedLive.slice(0, 20));
