// scripts/verify-all-5-genres-pairwise.js
// Tests pairwise 6-word runs across all 5 genres:
// driving, shooting, puzzle, sports, general

const fs = require('fs');
const { get6WordRuns, build50UniqueSentences } = require('./create-clean-s5');
const { buildDriving } = require('./lib/builders/driving-builder');
const { shooting_p1S3, shooting_p1S4, shooting_p2S2, shooting_p2S3, shooting_p2S4 } = require('./lib/clean-replacements');
const { puzzle_p1S3, puzzle_p1S4, puzzle_p2S2, puzzle_p2S3, puzzle_p2S4 } = require('./lib/puzzle-replacements');
const { sports_p1S3, sports_p1S4, sports_p2S2, sports_p2S3, sports_p2S4 } = require('./lib/sports-replacements');
const { general_p1S3, general_p1S4, general_p2S2, general_p2S3, general_p2S4 } = require('./lib/general-replacements');

function extractArray(fileText, varName) {
  const start = fileText.indexOf('const ' + varName + ' = [');
  if (start === -1) return [];
  const end = fileText.indexOf('];', start);
  const code = fileText.slice(start + ('const ' + varName + ' = ').length, end + 1);
  return eval(code);
}

// 1. DRIVING
const dRaw = buildDriving();
const dP1S5 = build50UniqueSentences('driving', 1);
const dP2S5 = build50UniqueSentences('driving', 2);
const driving = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  driving.p1.push(dRaw.p1[i] + ' ' + dP1S5[i]);
  driving.p2.push(dRaw.p2[i] + ' ' + dP2S5[i]);
}

// 2. SHOOTING
const sText = fs.readFileSync('./scripts/lib/builders/shooting-builder.js', 'utf8');
const sP1S1 = extractArray(sText, 'p1S1');
const sP1S2 = extractArray(sText, 'p1S2');
const sP2S1 = extractArray(sText, 'p2S1');
const sP1S5 = build50UniqueSentences('shooting', 1);
const sP2S5 = build50UniqueSentences('shooting', 2);
const shooting = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  shooting.p1.push(sP1S1[i] + ' ' + sP1S2[i] + ' ' + shooting_p1S3[i] + ' ' + shooting_p1S4[i] + ' ' + sP1S5[i]);
  shooting.p2.push(sP2S1[i] + ' ' + shooting_p2S2[i] + ' ' + shooting_p2S3[i] + ' ' + shooting_p2S4[i] + ' ' + sP2S5[i]);
}

// 3. PUZZLE
const pText = fs.readFileSync('./scripts/lib/builders/puzzle-builder.js', 'utf8');
const pP1S1 = extractArray(pText, 'p1S1');
const pP1S2 = extractArray(pText, 'p1S2');
const pP2S1 = extractArray(pText, 'p2S1');
const pP1S5 = build50UniqueSentences('puzzle', 1);
const pP2S5 = build50UniqueSentences('puzzle', 2);
const puzzle = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  puzzle.p1.push(pP1S1[i] + ' ' + pP1S2[i] + ' ' + puzzle_p1S3[i] + ' ' + puzzle_p1S4[i] + ' ' + pP1S5[i]);
  puzzle.p2.push(pP2S1[i] + ' ' + puzzle_p2S2[i] + ' ' + puzzle_p2S3[i] + ' ' + puzzle_p2S4[i] + ' ' + pP2S5[i]);
}

// 4. SPORTS
const spText = fs.readFileSync('./scripts/lib/builders/sports-builder.js', 'utf8');
const spP1S1 = extractArray(spText, 'p1S1');
const spP1S2 = extractArray(spText, 'p1S2');
const spP2S1 = extractArray(spText, 'p2S1');
const spP1S5 = build50UniqueSentences('sports', 1);
const spP2S5 = build50UniqueSentences('sports', 2);
const sports = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  sports.p1.push(spP1S1[i] + ' ' + spP1S2[i] + ' ' + sports_p1S3[i] + ' ' + sports_p1S4[i] + ' ' + spP1S5[i]);
  sports.p2.push(spP2S1[i] + ' ' + sports_p2S2[i] + ' ' + sports_p2S3[i] + ' ' + sports_p2S4[i] + ' ' + spP2S5[i]);
}

// 5. GENERAL
const gText = fs.readFileSync('./scripts/lib/builders/general-builder.js', 'utf8');
const gP1S1 = extractArray(gText, 'p1S1');
const gP1S2 = extractArray(gText, 'p1S2');
const gP2S1 = extractArray(gText, 'p2S1');
const gP1S5 = build50UniqueSentences('general', 1);
const gP2S5 = build50UniqueSentences('general', 2);
const general = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  general.p1.push(gP1S1[i] + ' ' + gP1S2[i] + ' ' + general_p1S3[i] + ' ' + general_p1S4[i] + ' ' + gP1S5[i]);
  general.p2.push(gP2S1[i] + ' ' + general_p2S2[i] + ' ' + general_p2S3[i] + ' ' + general_p2S4[i] + ' ' + gP2S5[i]);
}

const catalog = { driving, shooting, puzzle, sports, general };
const genres = Object.keys(catalog);

console.log('--- Pairwise cross-genre 6-word run verification ---');
let totalShared = 0;
for (let i = 0; i < genres.length; i++) {
  for (let j = i + 1; j < genres.length; j++) {
    const g1 = genres[i], g2 = genres[j];
    const runs1 = new Set();
    [...catalog[g1].p1, ...catalog[g1].p2].forEach(t => get6WordRuns(t).forEach(r => runs1.add(r)));
    let shared = 0;
    [...catalog[g2].p1, ...catalog[g2].p2].forEach(t => {
      get6WordRuns(t).forEach(r => {
        if (runs1.has(r)) {
          shared++;
          console.log(`Cross [${g1} <-> ${g2}]: "${r}"`);
        }
      });
    });
    console.log(`[${g1} <-> ${g2}]: ${shared} shared runs`);
    totalShared += shared;
  }
}

console.log(`\n========================================`);
console.log(`TOTAL CROSS-GENRE SHARED 6-WORD RUNS: ${totalShared}`);
console.log(`========================================`);
