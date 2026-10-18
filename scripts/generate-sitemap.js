const fs = require("fs");
const path = require("path");
const { games } = require("../data/games.js");
const { categories } = require("../data/categories.js");
const { hubs } = require("../data/hubs.js");

const BASE_URL = "https://blockhub.games";
const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
const TODAY = localDate.toISOString().split("T")[0];

const staticPages = [
  { url: "", changefreq: "daily", priority: "1.0" },
  { url: "/about", changefreq: "monthly", priority: "0.6" },
  { url: "/contact", changefreq: "monthly", priority: "0.6" },
  { url: "/privacy-policy", changefreq: "monthly", priority: "0.6" },
  { url: "/terms", changefreq: "monthly", priority: "0.6" },
  { url: "/dmca", changefreq: "monthly", priority: "0.6" },
];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const publicDir = path.join(__dirname, "../public");

// Filter only indexable games with unique enriched content (content_ready: true)
const indexableGames = games.filter((g) => g.content_ready);

// 5,000 URL limit per sitemap file (per sitemap protocol & requirements)
const MAX_URLS_PER_SITEMAP = 5000;
const gameSitemapFiles = [];

function generateGameSitemapXml(gameList) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
  for (const g of gameList) {
    xml += `  <url>
    <loc>${BASE_URL}/game/${g.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

    if (g.thumbnail) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(g.thumbnail)}</image:loc>
      <image:title>${escapeXml(g.title)}</image:title>
    </image:image>`;
    }

    xml += `
  </url>
`;
  }
  xml += `</urlset>\n`;
  return xml;
}

if (indexableGames.length > MAX_URLS_PER_SITEMAP) {
  const totalParts = Math.ceil(indexableGames.length / MAX_URLS_PER_SITEMAP);
  for (let i = 0; i < totalParts; i++) {
    const filename = `sitemap-games-${i + 1}.xml`;
    const chunk = indexableGames.slice(i * MAX_URLS_PER_SITEMAP, (i + 1) * MAX_URLS_PER_SITEMAP);
    fs.writeFileSync(path.join(publicDir, filename), generateGameSitemapXml(chunk), "utf8");
    gameSitemapFiles.push(filename);
  }
} else {
  const filename = "sitemap-games.xml";
  fs.writeFileSync(path.join(publicDir, filename), generateGameSitemapXml(indexableGames), "utf8");
  gameSitemapFiles.push(filename);
}

// 1. Generate Sitemap Index (public/sitemap.xml)
let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-hubs.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
`;

for (const gf of gameSitemapFiles) {
  sitemapIndexXml += `  <sitemap>
    <loc>${BASE_URL}/${gf}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
`;
}
sitemapIndexXml += `</sitemapindex>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapIndexXml, "utf8");

// 2. Generate Static Pages Sitemap (public/sitemap-pages.xml)
let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
for (const p of staticPages) {
  pagesXml += `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
}
pagesXml += `</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap-pages.xml"), pagesXml, "utf8");

// 3. Generate Categories Sitemap (public/sitemap-categories.xml)
let categoriesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
for (const cat of categories) {
  categoriesXml += `  <url>
    <loc>${BASE_URL}/category/${cat.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
}
categoriesXml += `</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap-categories.xml"), categoriesXml, "utf8");

// 4. Generate Topic Hubs Sitemap (public/sitemap-hubs.xml)
let hubsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
for (const h of hubs) {
  hubsXml += `  <url>
    <loc>${BASE_URL}/tag/${h.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
}
hubsXml += `</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap-hubs.xml"), hubsXml, "utf8");

console.log("Successfully generated sitemap index and sub-sitemaps:");
console.log(`- sitemap.xml (index)`);
console.log(`- sitemap-pages.xml (${staticPages.length} pages)`);
console.log(`- sitemap-categories.xml (${categories.length} categories)`);
console.log(`- sitemap-hubs.xml (${hubs.length} topic hubs)`);
for (const gf of gameSitemapFiles) {
  console.log(`- ${gf} (${indexableGames.length} indexed games with image tags)`);
}
