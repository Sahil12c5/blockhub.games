const fs = require('fs');
const path = require('path');
const { validateQualityGates, get6WordRuns } = require('./lib/validator.js');

const batchNum = process.argv[2] || '1';
const metaPath = path.join(__dirname, 'batches', `batch-${batchNum}.json`);
const prosePath = path.join(__dirname, 'batches', `prose-batch-${batchNum}.js`);

if (!fs.existsSync(metaPath) || !fs.existsSync(prosePath)) {
  console.error(`Missing files for batch ${batchNum}`);
  process.exit(1);
}

const metaList = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const proseMap = require(prosePath);

console.log(`=== VALIDATING BATCH ${batchNum} (${metaList.length} games) ===\n`);

let passedCount = 0;
let failedCount = 0;

for (const game of metaList) {
  const text = proseMap[game.slug];
  if (!text) {
    console.log(`[MISSING] ${game.slug}`);
    failedCount++;
    continue;
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const paras = text.trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const fullData = {
    ...game,
    description: text,
    word_count: words,
  };

  const res = validateQualityGates(fullData);
  const relevantErrors = res.errors.filter(e => 
    !e.startsWith('meta_') && 
    !e.startsWith('related_') && 
    !e.startsWith('insufficient_controls') && 
    !e.startsWith('insufficient_strategic_tips') &&
    !e.startsWith('similarity_exceeded')
  );

  if (relevantErrors.length > 0) {
    console.log(`[FAIL] ${game.slug} (${words}w, ${paras.length}p):`);
    relevantErrors.forEach(e => console.log(`   - ${e}`));
    failedCount++;
  } else {
    passedCount++;
  }
}

console.log(`\nBatch ${batchNum} Result: ${passedCount} passed, ${failedCount} failed / ${metaList.length} total.`);
process.exit(failedCount > 0 ? 1 : 0);
