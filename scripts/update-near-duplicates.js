/**
 * UPDATE NEAR DUPLICATES REPORT
 * Since all pairs have same_embed: false, change all recommended actions from 301_redirect
 * to keep_both_differentiate and suggested action to review_differentiate_gameplay_focus (no 301s).
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '../reports/near-duplicates.csv');
const raw = fs.readFileSync(CSV_PATH, 'utf8');
const lines = raw.trim().split(/\r?\n/);
const header = lines[0];

const updatedLines = [header];
let updatedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  const parts = line.split(',').map(s => s.replace(/^"|"$/g, '').trim());
  let [slugA, slugB, sim, sameEmbed, inSitemap, recAction, sugAction, canonical] = parts;

  // Since all pairs have same_embed: false, no 301 redirects!
  if (recAction === '301_redirect' || recAction === '301') {
    recAction = 'keep_both_differentiate';
    sugAction = 'review_differentiate_gameplay_focus';
    updatedCount++;
  } else if (sugAction.includes('redirect')) {
    sugAction = 'review_differentiate_gameplay_focus';
    updatedCount++;
  }

  updatedLines.push(`"${slugA}","${slugB}",${sim},${sameEmbed},"${inSitemap}","${recAction}","${sugAction}","${canonical}"`);
}

fs.writeFileSync(CSV_PATH, updatedLines.join('\n') + '\n', 'utf8');
console.log(`Updated reports/near-duplicates.csv. Modified ${updatedCount} actions to keep_both_differentiate (0 301s).`);
