const path = require('path');
const batchNum = process.argv[2] || '2';
const b = require(`./batches/batch-${batchNum}.json`);
b.forEach((g, i) => {
  const num = (parseInt(batchNum, 10) - 1) * 25 + i + 1;
  console.log(`${num}. [${g.slug}] "${g.title}" - Cat: ${g.category}, Sub: ${g.subgenre}`);
  console.log(`   Desc: ${(g.raw_description || '').slice(0, 100)}...`);
});
