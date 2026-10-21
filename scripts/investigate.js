const fs = require('fs');
const { execSync } = require('child_process');

const csv = execSync('git show f2fefb3~1:reports/indexable-games.csv', { encoding: 'utf8' });
const lines = csv.trim().split(/\r?\n/).slice(1);
const slugs = lines.map(l => l.split(',')[0].replace(/"/g, ''));
console.log('Total live slugs in f2fefb3~1:', slugs.length);

const brandSlugs = [
  'fall-skibidi-toilet',
  'skibidi-titans-hide-and-seek',
  'skibidi-vent-jumper',
  'barbee-fashion-influencer',
  'super-basketball-bluey',
  'labubu-wheelie-challenge',
  'labubu-auto-adventure',
  'fireboy-and-watergirl-online',
  'hard-neon-paccoman'
];

console.log('Brand slugs in the 155:');
brandSlugs.forEach(b => {
  if (slugs.includes(b)) {
    console.log(' - ' + b);
  }
});
