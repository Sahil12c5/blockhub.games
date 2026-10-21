const fs = require('fs');
const path = require('path');

const { buildDriving } = require('./lib/builders/driving-builder.js');
const { buildShooting } = require('./lib/builders/shooting-builder.js');
const { buildPuzzle } = require('./lib/builders/puzzle-builder.js');
const { buildSports } = require('./lib/builders/sports-builder.js');
const { buildGeneral } = require('./lib/builders/general-builder.js');

console.log('Compiling all 5 genre builders into body-variations.js...');

const driving = buildDriving();
const shooting = buildShooting();
const puzzle = buildPuzzle();
const sports = buildSports();
const general = buildGeneral();

const content = `// 50 completely unique 4-sentence bodies per genre family (65-85 words each)
// Every sentence is 100% unique across all variations with 0 shared 6-word runs!

const DRIVING_P1_BODIES = ${JSON.stringify(driving.p1, null, 2)};
const DRIVING_P2_BODIES = ${JSON.stringify(driving.p2, null, 2)};

const SHOOTING_P1_BODIES = ${JSON.stringify(shooting.p1, null, 2)};
const SHOOTING_P2_BODIES = ${JSON.stringify(shooting.p2, null, 2)};

const PUZZLE_P1_BODIES = ${JSON.stringify(puzzle.p1, null, 2)};
const PUZZLE_P2_BODIES = ${JSON.stringify(puzzle.p2, null, 2)};

const SPORTS_P1_BODIES = ${JSON.stringify(sports.p1, null, 2)};
const SPORTS_P2_BODIES = ${JSON.stringify(sports.p2, null, 2)};

const GENERAL_P1_BODIES = ${JSON.stringify(general.p1, null, 2)};
const GENERAL_P2_BODIES = ${JSON.stringify(general.p2, null, 2)};

module.exports = {
  DRIVING_P1_BODIES,
  DRIVING_P2_BODIES,
  SHOOTING_P1_BODIES,
  SHOOTING_P2_BODIES,
  PUZZLE_P1_BODIES,
  PUZZLE_P2_BODIES,
  SPORTS_P1_BODIES,
  SPORTS_P2_BODIES,
  GENERAL_P1_BODIES,
  GENERAL_P2_BODIES
};
`;

const targetFile = path.join(__dirname, 'lib/body-variations.js');
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully written compiled body-variations.js!');
