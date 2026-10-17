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
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

// Static core portal routes
for (const p of staticPages) {
  xml += `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
}

// Category archive routes
for (const cat of categories) {
  xml += `  <url>
    <loc>${BASE_URL}/category/${cat.slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// All 1,600 game detail routes with Google Image metadata
for (const g of games) {
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

const targetFile = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(targetFile, xml, "utf8");

const totalUrls = staticPages.length + categories.length + games.length;
console.log(`Generated ${targetFile} successfully with ${totalUrls} total URLs (${games.length} games)!`);
