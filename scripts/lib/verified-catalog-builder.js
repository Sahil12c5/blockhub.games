// scripts/lib/verified-catalog-builder.js
const fs = require('fs');
const path = require('path');

const { buildDriving } = require('./builders/driving-builder');
const { shooting_p1S3, shooting_p1S4, shooting_p2S2, shooting_p2S3, shooting_p2S4 } = require('./clean-replacements');
const { puzzle_p1S3, puzzle_p1S4, puzzle_p2S2, puzzle_p2S3, puzzle_p2S4 } = require('./puzzle-replacements');
const { sports_p1S3, sports_p1S4, sports_p2S2, sports_p2S3, sports_p2S4 } = require('./sports-replacements');
const { general_p1S3, general_p1S4, general_p2S2, general_p2S3, general_p2S4 } = require('./general-replacements');
const { getBespokeS5 } = require('./bespoke-s5');

function extractArray(fileText, varName) {
  const start = fileText.indexOf('const ' + varName + ' = [');
  if (start === -1) return [];
  const end = fileText.indexOf('];', start);
  const code = fileText.slice(start + ('const ' + varName + ' = ').length, end + 1);
  return eval(code);
}

// 1. Driving
const dRaw = buildDriving();
const dP1S5 = getBespokeS5('driving', 1);
const dP2S5 = getBespokeS5('driving', 2);
const drivingBodies = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  drivingBodies.p1.push(dRaw.p1[i] + ' ' + dP1S5[i]);
  drivingBodies.p2.push(dRaw.p2[i] + ' ' + dP2S5[i]);
}

// 2. Shooting
const sText = fs.readFileSync(path.join(__dirname, 'builders/shooting-builder.js'), 'utf8');
const sP1S1 = extractArray(sText, 'p1S1');
const sP1S2 = extractArray(sText, 'p1S2');
const sP2S1 = extractArray(sText, 'p2S1');
const sP1S5 = getBespokeS5('shooting', 1);
const sP2S5 = getBespokeS5('shooting', 2);
const shootingBodies = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  shootingBodies.p1.push(sP1S1[i] + ' ' + sP1S2[i] + ' ' + shooting_p1S3[i] + ' ' + shooting_p1S4[i] + ' ' + sP1S5[i]);
  shootingBodies.p2.push(sP2S1[i] + ' ' + shooting_p2S2[i] + ' ' + shooting_p2S3[i] + ' ' + shooting_p2S4[i] + ' ' + sP2S5[i]);
}

// 3. Puzzle
const pText = fs.readFileSync(path.join(__dirname, 'builders/puzzle-builder.js'), 'utf8');
const pP1S1 = extractArray(pText, 'p1S1');
const pP1S2 = extractArray(pText, 'p1S2');
const pP2S1 = extractArray(pText, 'p2S1');
const pP1S5 = getBespokeS5('puzzle', 1);
const pP2S5 = getBespokeS5('puzzle', 2);
const puzzleBodies = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  puzzleBodies.p1.push(pP1S1[i] + ' ' + pP1S2[i] + ' ' + puzzle_p1S3[i] + ' ' + puzzle_p1S4[i] + ' ' + pP1S5[i]);
  puzzleBodies.p2.push(pP2S1[i] + ' ' + puzzle_p2S2[i] + ' ' + puzzle_p2S3[i] + ' ' + puzzle_p2S4[i] + ' ' + pP2S5[i]);
}

// 4. Sports
const spText = fs.readFileSync(path.join(__dirname, 'builders/sports-builder.js'), 'utf8');
const spP1S1 = extractArray(spText, 'p1S1');
const spP1S2 = extractArray(spText, 'p1S2');
const spP2S1 = extractArray(spText, 'p2S1');
const spP1S5 = getBespokeS5('sports', 1);
const spP2S5 = getBespokeS5('sports', 2);
const sportsBodies = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  sportsBodies.p1.push(spP1S1[i] + ' ' + spP1S2[i] + ' ' + sports_p1S3[i] + ' ' + sports_p1S4[i] + ' ' + spP1S5[i]);
  sportsBodies.p2.push(spP2S1[i] + ' ' + sports_p2S2[i] + ' ' + sports_p2S3[i] + ' ' + sports_p2S4[i] + ' ' + spP2S5[i]);
}

// 5. General
const gText = fs.readFileSync(path.join(__dirname, 'builders/general-builder.js'), 'utf8');
const gP1S1 = extractArray(gText, 'p1S1');
const gP1S2 = extractArray(gText, 'p1S2');
const gP2S1 = extractArray(gText, 'p2S1');
const gP1S5 = getBespokeS5('general', 1);
const gP2S5 = getBespokeS5('general', 2);
const generalBodies = { p1: [], p2: [] };
for (let i = 0; i < 50; i++) {
  generalBodies.p1.push(gP1S1[i] + ' ' + gP1S2[i] + ' ' + general_p1S3[i] + ' ' + general_p1S4[i] + ' ' + gP1S5[i]);
  generalBodies.p2.push(gP2S1[i] + ' ' + general_p2S2[i] + ' ' + general_p2S3[i] + ' ' + general_p2S4[i] + ' ' + gP2S5[i]);
}

const genreBodies = {
  driving: drivingBodies,
  shooting: shootingBodies,
  puzzle: puzzleBodies,
  sports: sportsBodies,
  general: generalBodies
};

module.exports = { genreBodies };
