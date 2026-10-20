const fs = require('fs');
const content = JSON.parse(fs.readFileSync('./data/top-games-content.json', 'utf8'));

const lines = fs.readFileSync('./reports/near-duplicates.csv', 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('#'));

const header = lines[0];
const dataLines = lines.slice(1);

const pairs = dataLines.map(l => {
  const parts = l.split(',').map(s => s.replace(/^"|"$/g, ''));
  return {
    slug_a: parts[0],
    slug_b: parts[1],
    similarity: parseFloat(parts[2]),
    suggested_action: parts[3]
  };
}).filter(p => p.similarity >= 0.98);

console.log(`Found ${pairs.length} pairs with similarity >= 0.98:\n`);

const results = pairs.map((p, i) => {
  const aIdx = !!content[p.slug_a]?.indexable;
  const bIdx = !!content[p.slug_b]?.indexable;

  let proposedCanonical = '';
  // Rule: Prefer the one already indexable; if neither or both, prefer the cleaner slug (no "-game", shorter, no trailing "-html5")
  if (aIdx && !bIdx) {
    proposedCanonical = p.slug_a;
  } else if (!aIdx && bIdx) {
    proposedCanonical = p.slug_b;
  } else {
    // Both or neither: pick the cleaner slug
    // Strip redundant "-game", "-html5", etc.
    const aClean = p.slug_a.replace(/-game$|-html5$/, '');
    const bClean = p.slug_b.replace(/-game$|-html5$/, '');
    if (p.slug_a.endsWith('-game') && !p.slug_b.endsWith('-game')) {
      proposedCanonical = p.slug_b;
    } else if (!p.slug_a.endsWith('-game') && p.slug_b.endsWith('-game')) {
      proposedCanonical = p.slug_a;
    } else if (p.slug_a.endsWith('-html5')) {
      proposedCanonical = p.slug_b;
    } else if (p.slug_b.endsWith('-html5')) {
      proposedCanonical = p.slug_a;
    } else if (p.slug_a.length <= p.slug_b.length) {
      proposedCanonical = p.slug_a;
    } else {
      proposedCanonical = p.slug_b;
    }
  }

  return {
    index: i + 1,
    slug_a: p.slug_a,
    a_indexable: aIdx,
    slug_b: p.slug_b,
    b_indexable: bIdx,
    similarity: p.similarity,
    proposed_canonical: proposedCanonical
  };
});

console.table(results);
