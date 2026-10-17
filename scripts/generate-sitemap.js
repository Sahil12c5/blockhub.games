const fs = require("fs");
const path = require("path");
const { games } = require("../data/games.js");
const { categories } = require("../data/categories.js");

const BASE_URL = "https://blockhub.games";
const TODAY = new Date().toISOString().split("T")[0];

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

// 1. Generate Sitemap Index (public/sitemap.xml)
const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
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
    <loc>${BASE_URL}/sitemap-games.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>
`;
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

// 4. Generate Games Sitemap with Google Image Metadata (public/sitemap-games.xml)
// Only include indexable games with unique content (content_ready: true) to prevent thin-content penalties
const indexableGames = games.filter((g) => g.content_ready);

let gamesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;
for (const g of indexableGames) {
  gamesXml += `  <url>
    <loc>${BASE_URL}/game/${g.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

  if (g.thumbnail) {
    gamesXml += `
    <image:image>
      <image:loc>${escapeXml(g.thumbnail)}</image:loc>
      <image:title>${escapeXml(g.title)}</image:title>
    </image:image>`;
  }

  gamesXml += `
  </url>
`;
}
gamesXml += `</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap-games.xml"), gamesXml, "utf8");

console.log("Successfully generated sitemap index and 3 sub-sitemaps:");
console.log(`- sitemap.xml (index)`);
console.log(`- sitemap-pages.xml (${staticPages.length} pages)`);
console.log(`- sitemap-categories.xml (${categories.length} categories)`);
console.log(`- sitemap-games.xml (${indexableGames.length} indexed games with image tags)`);

