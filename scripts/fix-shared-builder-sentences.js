const fs = require('fs');
const path = require('path');

// Fix the cross-genre phrases in general-builder.js and sports-builder.js
const genPath = path.join(__dirname, 'lib/builders/general-builder.js');
let genCode = fs.readFileSync(genPath, 'utf8');
genCode = genCode.replace(/Every clean stage completion proves that disciplined timing always triumphs over reckless haste\./g,
  'Navigating through complex platform courses confirms that disciplined jump cadence always triumphs over uncontrolled haste.');
fs.writeFileSync(genPath, genCode, 'utf8');

const sportsPath = path.join(__dirname, 'lib/builders/sports-builder.js');
let sportsCode = fs.readFileSync(sportsPath, 'utf8');
sportsCode = sportsCode.replace(/Consistent precision at the controls turns every competitive encounter into an inspiring masterclass of skill\./g,
  'Synchronized team coordination on the pitch turns every difficult fixture into an inspiring exhibition of athletic skill.');
fs.writeFileSync(sportsPath, sportsCode, 'utf8');

console.log('Fixed shared sentences in general-builder and sports-builder!');
