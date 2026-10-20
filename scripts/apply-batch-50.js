/**
 * Merges the 50 regenerated v2-prose games into top-games-content.json and top-games-content.js
 */

const fs = require('fs');
const path = require('path');
const { rawBatch50 } = require('./batches/prose-batch-50.js');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const TOP_JS = path.join(__dirname, '../data/top-games-content.js');

const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

console.log(`Applying ${rawBatch50.length} v2-prose games to content store...`);

let updatedCount = 0;
for (const item of rawBatch50) {
  const slug = item.slug;
  const original = topContent[slug] || {};

  const wc = (item.description || '').trim().split(/\s+/).filter(Boolean).length;

  topContent[slug] = {
    ...original,
    slug: item.slug,
    title: item.title,
    category: item.category,
    subgenre: item.subgenre,
    content_ready: true,
    indexable: false, // Stays noindex until daily release
    release_date: item.slug === 'cargo-truck-simulator-2025' ? 'NONE' : '2026-10-21',
    template_version: 'v2',
    word_count: wc,
    description: item.description,
    howToPlay: item.howToPlay,
    controls: item.controls,
    tips: item.tips,
    faq: item.faq,
    meta_title: item.meta_title,
    meta_description: item.meta_description,
    facts_used: item.facts_used,
    related: original.related || [],
    hub_links: original.hub_links || [],
    raw_description: original.raw_description || '',
    raw_how_to: original.raw_how_to || '',
  };

  updatedCount++;
}

console.log(`Writing updated top-games-content.json (${Object.keys(topContent).length} games)...`);
fs.writeFileSync(TOP_JSON, JSON.stringify(topContent, null, 2), 'utf8');

console.log('Writing updated top-games-content.js...');
const jsCode = `export const topGamesContent = ${JSON.stringify(topContent, null, 2)};\n`;
fs.writeFileSync(TOP_JS, jsCode, 'utf8');

console.log(`Successfully applied ${updatedCount} v2-prose games!`);
