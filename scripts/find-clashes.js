// scripts/find-clashes.js
const { get6WordRuns } = require('./create-clean-s5');
const spRepl = require('./lib/sports-replacements');
const genRepl = require('./lib/general-replacements');
const puzRepl = require('./lib/puzzle-replacements');
const shootRepl = require('./lib/clean-replacements');
const { buildDriving } = require('./lib/builders/driving-builder');

const dRaw = buildDriving();
// driving arrays
const drivRepl = {
  driving_p1: dRaw.p1,
  driving_p2: dRaw.p2
};

const allGenres = {
  sports: spRepl,
  general: genRepl,
  puzzle: puzRepl,
  shooting: shootRepl,
  driving: drivRepl
};

const gNames = Object.keys(allGenres);

console.log('--- Checking all pairs across replacement arrays ---');
for (let i = 0; i < gNames.length; i++) {
  for (let j = i + 1; j < gNames.length; j++) {
    const g1 = gNames[i], g2 = gNames[j];
    const runs1 = new Map();
    for (const [arrName, arr] of Object.entries(allGenres[g1])) {
      arr.forEach((text, idx) => {
        get6WordRuns(text).forEach(r => runs1.set(r, `${g1}.${arrName}[${idx}]`));
      });
    }

    for (const [arrName, arr] of Object.entries(allGenres[g2])) {
      arr.forEach((text, idx) => {
        get6WordRuns(text).forEach(r => {
          if (runs1.has(r)) {
            console.log(`CLASH [${g1} <-> ${g2}]: "${r}" in ${runs1.get(r)} and ${g2}.${arrName}[${idx}]`);
          }
        });
      });
    }
  }
}
