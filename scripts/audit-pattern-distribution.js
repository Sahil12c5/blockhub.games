const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const { activeSlugs } = require('./generate-varied-prose.js');

console.log(`=== EVALUATING PATTERN DISTRIBUTION ACROSS ${activeSlugs.length} GAMES ===\n`);

let primaryObjectiveCount = 0;
const p1PatternCounts = {};
const p2PatternCounts = {};

const p1Examples = {};
const p2Examples = {};

for (const slug of activeSlugs) {
  const item = topContent[slug];
  if (!item || !item.description) continue;

  const paras = item.description.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (paras.length !== 2) {
    console.error(`ERROR: ${slug} does not have exactly 2 paragraphs (has ${paras.length})`);
  }

  const p1 = paras[0] || '';
  const p2 = paras[1] || '';

  // Check "The primary objective is to"
  if (/the primary objective is to/i.test(p1)) {
    primaryObjectiveCount++;
  }

  // Classify P1 opener
  const p1Sent0 = p1.split(/(?<=[.!?])\s+/)[0] || '';
  let p1Cat = 'Other';
  if (/^\S.*?\b(drops|plunges|thrusts)\s+players\s+into\b/i.test(p1Sent0)) p1Cat = 'Drops into premise';
  else if (/^(step into|enter)\s+(the\s+)?(world|arena|realm)\s+of\b/i.test(p1Sent0)) p1Cat = 'Step into the arena';
  else if (/^in\s+[A-Z0-9].*?,\s*(you|players)\b/i.test(p1Sent0)) p1Cat = 'In [Title], you command';
  else if (/^\S.*?\btests?\s+(your|player)\s+(reflexes|skills|precision|instincts|timing)\b/i.test(p1Sent0)) p1Cat = 'Tests your reflexes';
  else if (/^\S.*?\bdelivers?\s+(fast-paced|intense|dynamic|fluid|exciting)\b/i.test(p1Sent0)) p1Cat = 'Delivers fast-paced';
  else if (/^built\s+around\b/i.test(p1Sent0)) p1Cat = 'Built around controls';
  else if (/^set\s+across\b/i.test(p1Sent0)) p1Cat = 'Set across stages';
  else if (/^\S.*?\bis\s+(an?|the)\s+[a-z]+-?[a-z]*\s+(experience|game|brawler|racer|puzzler|platformer|adventure|simulator|shooter|title)\b/i.test(p1Sent0)) p1Cat = 'Is a dynamic title';
  else if (/^(commanding|guiding|controlling|leading)\s+.*?in\b/i.test(p1Sent0)) p1Cat = 'Commanding the action';

  p1PatternCounts[p1Cat] = (p1PatternCounts[p1Cat] || 0) + 1;
  if (!p1Examples[p1Cat]) p1Examples[p1Cat] = `${item.title}: "${p1Sent0}"`;

  // Classify P2 opener
  const p2Sent0 = p2.split(/(?<=[.!?])\s+/)[0] || '';
  let p2Cat = 'Other';
  if (/^(precision timing|timing your|disciplined timing)\b/i.test(p2Sent0)) p2Cat = 'Precision timing';
  else if (/^success\s+demands\s+a\s+disciplined\s+balance\b/i.test(p2Sent0)) p2Cat = 'Disciplined balance';
  else if (/^hazards\s+throughout\s+(each|the)\s+stage\b/i.test(p2Sent0)) p2Cat = 'Hazards throughout';
  else if (/^studying\s+(obstacle|enemy|stage|opponent)\b/i.test(p2Sent0)) p2Cat = 'Studying obstacle layouts';
  else if (/^maintaining\s+(steady|consistent|forward)\s+momentum\b/i.test(p2Sent0)) p2Cat = 'Maintaining forward momentum';
  else if (/^smooth\s+(keyboard|touch|control)\b/i.test(p2Sent0)) p2Cat = 'Smooth keyboard controls';
  else if (/^keep\s+a\s+(sharp|close)\s+eye\b/i.test(p2Sent0)) p2Cat = 'Keep a sharp eye';
  else if (/^later\s+(challenges|stages|levels)\s+introduce\b/i.test(p2Sent0)) p2Cat = 'Later challenges introduce';
  else if (/^[A-Z][a-z]+ing\b.*?\b(requires|demands|centers on|relies on)\b/i.test(p2Sent0)) p2Cat = '[Gerund phrase] requires';

  p2PatternCounts[p2Cat] = (p2PatternCounts[p2Cat] || 0) + 1;
  if (!p2Examples[p2Cat]) p2Examples[p2Cat] = `${item.title}: "${p2Sent0}"`;
}

console.log('--- PARAGRAPH 1 OPENER PATTERN DISTRIBUTION ---');
for (const [cat, count] of Object.entries(p1PatternCounts)) {
  const pct = (count / activeSlugs.length * 100).toFixed(1);
  const status = pct <= 15 ? 'PASS (<= 15%)' : 'FAIL (> 15%)';
  console.log(`• ${cat.padEnd(28)}: ${String(count).padStart(2)} / ${activeSlugs.length} (${pct.padStart(4)}%) -> ${status}`);
  console.log(`   Sample: ${p1Examples[cat]}`);
}

console.log('\n--- PARAGRAPH 2 OPENER PATTERN DISTRIBUTION ---');
for (const [cat, count] of Object.entries(p2PatternCounts)) {
  const pct = (count / activeSlugs.length * 100).toFixed(1);
  const status = pct <= 15 ? 'PASS (<= 15%)' : 'FAIL (> 15%)';
  console.log(`• ${cat.padEnd(28)}: ${String(count).padStart(2)} / ${activeSlugs.length} (${pct.padStart(4)}%) -> ${status}`);
  console.log(`   Sample: ${p2Examples[cat]}`);
}

console.log('\n--- "THE PRIMARY OBJECTIVE IS TO" FREQUENCY ---');
const primPct = (primaryObjectiveCount / activeSlugs.length * 100).toFixed(1);
const primStatus = primPct <= 10 ? 'PASS (<= 10%)' : 'FAIL (> 10%)';
console.log(`Occurrences: ${primaryObjectiveCount} / ${activeSlugs.length} (${primPct}%) -> ${primStatus}`);
