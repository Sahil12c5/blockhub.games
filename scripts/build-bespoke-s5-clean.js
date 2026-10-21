const fs = require('fs');
const path = require('path');

// 1. Load all builder 6-word runs
const builderRuns = new Set();
const files = [
  'scripts/lib/clean-replacements.js',
  'scripts/lib/puzzle-replacements.js',
  'scripts/lib/sports-replacements.js',
  'scripts/lib/general-replacements.js',
  'scripts/lib/builders/driving-builder.js',
  'scripts/lib/builders/shooting-builder.js',
  'scripts/lib/builders/puzzle-builder.js',
  'scripts/lib/builders/sports-builder.js',
  'scripts/lib/builders/general-builder.js',
  'scripts/lib/opener-pools.js'
];

for (const f of files) {
  const full = path.join(__dirname, '../', f);
  if (fs.existsSync(full)) {
    const text = fs.readFileSync(full, 'utf8');
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    for (let i = 0; i <= words.length - 6; i++) {
      builderRuns.add(words.slice(i, i + 6).join(' '));
    }
  }
}
console.log('Builder runs loaded:', builderRuns.size);

// 2. Load arrays from generate-bespoke-s5.js
const srcFile = fs.readFileSync(path.join(__dirname, 'generate-bespoke-s5.js'), 'utf8');

function getArr(name) {
  const token = 'const ' + name + ' = [';
  const start = srcFile.indexOf(token);
  if (start === -1) throw new Error('Missing ' + name);
  const end = srcFile.indexOf('];', start);
  const code = srcFile.slice(start + token.length - 1, end + 1);
  return eval(code);
}

const dP1_S = getArr('dP1_S');
const dP1_P = getArr('dP1_P');
const dP2_S = getArr('dP2_S');
const dP2_P = getArr('dP2_P');

const sP1_S = getArr('sP1_S');
const sP1_P = getArr('sP1_P');
const sP2_S = getArr('sP2_S');
const sP2_P = getArr('sP2_P');

const pP1_S = getArr('pP1_S');
const pP1_P = getArr('pP1_P');
const pP2_S = getArr('pP2_S');
const pP2_P = getArr('pP2_P');

const spP1_S = getArr('spP1_S');
const spP1_P = getArr('spP1_P');
const spP2_S = getArr('spP2_S');
const spP2_P = getArr('spP2_P');

const gP1_S = getArr('gP1_S');
const gP1_P = getArr('gP1_P');
const gP2_S = getArr('gP2_S');
const gP2_P = getArr('gP2_P');

// Genre-specific replacements to eliminate cross-genre and builder collisions:
function fixArray(arr, map) {
  return arr.map(text => {
    let res = text;
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(k, 'gi'), v);
    }
    return res;
  });
}

// Driving fixes
const dP1_P_fixed = fixArray(dP1_P, {
  "builds the instinctual muscle memory that": "cultivates the instinctive motor memory that",
  "allows drivers to carve micro-adjustments": "enables pilots to execute fine steering corrections",
  "provides immediate tactile feedback regarding current track grip": "delivers immediate sensory feedback regarding active road grip"
});
const dP2_P_fixed = fixArray(dP2_P, {
  "allows drivers to carve micro-adjustments": "enables pilots to execute fine steering corrections",
  "provides immediate tactile feedback regarding current": "provides instant sensory feedback regarding active",
  "pressure prevents unforced errors during intense": "pressure averts costly blunders throughout frantic"
});

// Shooting fixes
const sP1_P_fixed = fixArray(sP1_P, {
  "builds an unbeatable foundation for enduring combat excellence": "forges an unbreakable frontline footing for lasting tactical triumph",
  "produces relentless, clockwork consistency over extended shootouts": "yields unflinching operational regularity across grueling shootouts",
  "delivers the fine margins required to conquer grueling combat trials": "yields the decisive tactical edge needed to conquer grueling combat trials",
  "builds the instinctual reflex memory that defines legendary marksmen": "cultivates the innate reaction recall that defines legendary marksmen",
  "establishes total tactical command over the most demanding combat maps": "secures supreme tactical mastery across the most grueling combat maps",
  "prevents unforced tactical errors under high-pressure scenarios": "averts careless operational mistakes under intense combat scenarios"
});
const sP2_P_fixed = fixArray(sP2_P, {
  "enables rapid defensive reactions against surprise line breaches": "allows instant counter-measures against unexpected hostile breaches",
  "ensures clean survival through hectic multi-adversary scrambles": "guarantees clean extraction amidst frenzied multi-adversary scrambles",
  "ensures every single keystroke translates into crisp combat motion": "confirms each trigger press converts into crisp combat motion",
  "prevents mental fatigue from degrading split-second reflex speed": "prevents cognitive strain from dulling split-second reaction speed",
  "prevents unforced errors during intense one-on-one combat duels": "averts careless blunders during intense one-on-one combat duels"
});

// Puzzle fixes
const pP1_S_fixed = fixArray(pP1_S, {
  "Tracking shifting color palettes across complex challenge fields": "Observing dynamic chromatic hues across intricate challenge fields",
  "Securing clear operational lanes across the challenge matrix": "Establishing open maneuvering paths across the challenge matrix",
  "Holding back from impulsive matching moves on first sight": "Refraining from hasty combination swaps on first glance",
  "Holding vital clearing combinations in reserve staging areas": "Retaining key elimination clusters in reserve staging areas"
});
const pP1_P_fixed = fixArray(pP1_P, {
  "builds an unbeatable foundation for enduring deductive excellence": "establishes a sturdy deductive groundwork for lasting analytical excellence",
  "produces relentless, clockwork consistency over extended sessions": "yields steady analytical regularity across prolonged sessions",
  "delivers the fine margins required to conquer grueling brain teasers": "delivers the sharp mental clarity needed to conquer grueling brain teasers",
  "builds the deep spatial intuition that defines legendary thinkers": "cultivates the profound spatial perception that defines legendary thinkers",
  "allows thinkers to untangle chaotic board states with total poise": "enables strategists to resolve convoluted tile layouts with complete poise",
  "evaluating potential downstream board states several turns ahead": "analyzing future board formations several sequential turns ahead"
});
const pP2_P_fixed = fixArray(pP2_P, {
  "ensures every physical gesture translates into clean board action": "guarantees each physical tap converts into clean board action",
  "clears stubborn cluster arrangements without disrupting setups": "removes dense clustered groups without upsetting established setups"
});

// Sports fixes
const spP1_S_fixed = fixArray(spP1_S, {
  "Monitoring match clock constraints during late-game moments": "Watching match countdown limits during clutch late-game moments"
});
const spP1_P_fixed = fixArray(spP1_P, {
  "builds an unbeatable foundation for enduring athletic supremacy": "lays a rock-solid athletic bedrock for enduring competitive supremacy",
  "delivers the fine margins required to capture league championships": "yields the clutch edge required to capture league championships"
});
const spP2_P_fixed = fixArray(spP2_P, {
  "enables rapid defensive reactions against surprise line breaks": "allows agile blocking movements against sudden offensive line breaks",
  "ensures clean survival through hectic multi-player scrambles": "secures clean defense through frenzied multi-player scrambles",
  "prevents physical fatigue from degrading split-second timing": "prevents bodily exhaustion from hampering split-second shot timing",
  "unlocks the true peak performance potential of every athlete": "unleashes the full championship potential of every roster athlete"
});

// General fixes
const gP1_P_fixed = fixArray(gP1_P, {
  "builds an unbeatable foundation for enduring arcade excellence": "creates an exceptionally robust platform for lasting arcade excellence",
  "produces silky smooth stage times that withstand fierce competition": "delivers remarkably fluid stage times that surpass fierce competition",
  "produces relentless, clockwork consistency over extended runs": "yields steadfast procedural consistency across prolonged runs",
  "ensures crisp directional responsiveness through every leap": "maintains sharp directional control across every single leap",
  "builds the deep spatial intuition that defines platforming masters": "fosters the acute platforming intuition that defines arcade masters",
  "delivers the fine margins required to conquer grueling arcade trials": "provides the razor-thin margin needed to conquer grueling arcade trials",
  "unlocks the full athletic potential of your agile avatar": "unleashes the complete athletic prowess of your agile avatar"
});
const gP2_P_fixed = fixArray(gP2_P, {
  "delivers predictable, confidence-inspiring handling at high speeds": "provides steady, confidence-boosting handling at high traversal speeds",
  "ensures clean survival through hectic multi-hazard obstacle scrambles": "guarantees flawless survival through chaotic multi-hazard obstacle scrambles",
  "ensures every single keystroke translates into crisp avatar motion": "confirms each precise keystroke converts into fluid avatar motion",
  "prevents finger fatigue from degrading split-second reflex speed": "prevents weariness from blunting split-second twitch speed"
});

function hasRun(text, runSet) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  for (let i = 0; i <= words.length - 6; i++) {
    const r = words.slice(i, i + 6).join(' ');
    if (runSet.has(r)) return r;
  }
  return null;
}

const OUT_DATA = { driving: {}, shooting: {}, puzzle: {}, sports: {}, general: {} };
const globalRuns = new Set();
// Add all builder runs to globalRuns
for (const r of builderRuns) globalRuns.add(r);

const allCollisions = [];
function generateSet(genre, pNum, subjects, predicates) {
  const sents = [];
  for (let i = 0; i < 50; i++) {
    const cand = `${subjects[i]} ${predicates[i]}.`;
    const col = hasRun(cand, globalRuns);
    if (col) {
      allCollisions.push({ genre, pNum, i, col, cand });
    }
    const words = cand.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    for (let w = 0; w <= words.length - 6; w++) {
      globalRuns.add(words.slice(w, w + 6).join(' '));
    }
    sents.push(cand);
  }
  return sents;
}

console.log('Generating Driving...');
OUT_DATA.driving.p1 = generateSet('driving', 1, dP1_S, dP1_P_fixed);
OUT_DATA.driving.p2 = generateSet('driving', 2, dP2_S, dP2_P_fixed);

console.log('Generating Shooting...');
OUT_DATA.shooting.p1 = generateSet('shooting', 1, sP1_S, sP1_P_fixed);
OUT_DATA.shooting.p2 = generateSet('shooting', 2, sP2_S, sP2_P_fixed);

console.log('Generating Puzzle...');
OUT_DATA.puzzle.p1 = generateSet('puzzle', 1, pP1_S_fixed, pP1_P_fixed);
OUT_DATA.puzzle.p2 = generateSet('puzzle', 2, pP2_S, pP2_P_fixed);

console.log('Generating Sports...');
OUT_DATA.sports.p1 = generateSet('sports', 1, spP1_S_fixed, spP1_P_fixed);
OUT_DATA.sports.p2 = generateSet('sports', 2, spP2_S, spP2_P_fixed);

console.log('Generating General...');
OUT_DATA.general.p1 = generateSet('general', 1, gP1_S, gP1_P_fixed);
OUT_DATA.general.p2 = generateSet('general', 2, gP2_S, gP2_P_fixed);

console.log('\n--- COLLISION REPORT ---');
console.log('Total collisions:', allCollisions.length);
if (allCollisions.length > 0) {
  console.log(JSON.stringify(allCollisions, null, 2));
  process.exit(1);
}

console.log('\nALL 500 SENTENCES VERIFIED WITH ZERO 6-WORD COLLISIONS ACROSS ALL SETS AND BUILDERS!');

const fileCode = `// scripts/lib/bespoke-s5.js
// 500 bespoke, pristine S5 sentences (5 genres x 2 paragraphs x 50 variations)
// 100% verified to have ZERO 6-word overlap with ANY builder, replacement file, or other S5 sentence!

const BESPOKE_S5 = ${JSON.stringify(OUT_DATA, null, 2)};

function getBespokeS5(genre, pNum) {
  const pKey = pNum === 1 ? 'p1' : 'p2';
  return BESPOKE_S5[genre][pKey];
}

module.exports = { getBespokeS5, BESPOKE_S5 };
`;

fs.writeFileSync(path.join(__dirname, 'lib/bespoke-s5.js'), fileCode, 'utf8');
console.log('Successfully wrote scripts/lib/bespoke-s5.js!');
