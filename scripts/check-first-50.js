const fs = require('fs');
const facts = JSON.parse(fs.readFileSync('scripts/scratch-first-50-facts.json', 'utf8'));
const { checkTrademark } = require('./lib/trademark.js');
const nearDupesRaw = fs.readFileSync('reports/near-duplicates.csv', 'utf8');

const nearDupesMap = new Map();
nearDupesRaw.trim().split(/\r?\n/).slice(1).forEach(line => {
  const parts = line.split(',');
  const sA = parts[0].replace(/"/g, '');
  const sB = parts[1].replace(/"/g, '');
  const canon = parts[7] ? parts[7].replace(/"/g, '') : '';
  const action = parts[5] ? parts[5].replace(/"/g, '') : '';
  nearDupesMap.set(sA, { other: sB, canon, action });
  nearDupesMap.set(sB, { other: sA, canon, action });
});

facts.forEach(f => {
  const tm = checkTrademark({ title: f.title, slug: f.slug });
  if (tm.flagged) {
    console.log('TM Flagged:', f.slug, '->', tm.term, '| blocksIndex:', tm.blocksIndex);
  }
  if (nearDupesMap.has(f.slug)) {
    const nd = nearDupesMap.get(f.slug);
    console.log('Near Dupe:', f.slug, '-> other:', nd.other, '| canonical:', nd.canon, '| action:', nd.action, '| isCanonical:', nd.canon === f.slug);
  }
});
