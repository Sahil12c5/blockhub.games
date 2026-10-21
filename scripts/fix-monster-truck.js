const fs = require('fs');

// 1. Fix data/top-games-content.json for monster-truck-offroad-2
const topJsonPath = 'data/top-games-content.json';
const top = JSON.parse(fs.readFileSync(topJsonPath, 'utf8'));

if (top['monster-truck-offroad-2']) {
  const g = top['monster-truck-offroad-2'];
  g.release_date = '2026-10-20';
  g.status = 'PASS_LIVE';
  g.indexable = true;
  // Clean up controls to match real feed facts (no cargo)
  g.controls = [
    { key: 'W / Up Arrow', action: 'Accelerate forward across slopes' },
    { key: 'S / Down Arrow', action: 'Brake and reverse vehicle' },
    { key: 'A / Left Arrow', action: 'Steer monster truck left' },
    { key: 'D / Right Arrow', action: 'Steer monster truck right' },
    { key: 'Spacebar', action: 'Handbrake for emergency stops' },
    { key: 'Touch / Mobile', action: 'On-screen virtual steering and pedals' }
  ];
  // Clean up tips (no cargo trailer)
  g.tips = [
    'Modulate throttle carefully over rocky climbs to avoid bouncing off balance.',
    'Keep your wheels aligned when crossing narrow timber bridges to prevent tipping over.',
    'Use the handbrake before cresting sharp cliffs to assess upcoming trail hazards.',
    'Manage vehicle speed on downhill stretches to avoid suspension damage before the checkpoint.'
  ];
  // Clean up FAQ (no cargo trailer)
  g.faq = [
    {
      q: 'What is the main objective in Monster Truck Offroad 2?',
      a: 'In Monster Truck Offroad 2, your goal is to conquer rugged mountain trails, overcome rocky obstacles, and reach each checkpoint before time expires.'
    },
    {
      q: 'How do you control the vehicle in Monster Truck Offroad 2?',
      a: 'On desktop, steer using WASD or Arrow Keys, brake with S or Down Arrow, and trigger handbrake with Spacebar. Mobile users steer via touch controls.'
    },
    {
      q: 'What is the best strategy to complete difficult stages?',
      a: 'Avoid flooring the accelerator continuously; tap throttle on uneven rocks and keep all tires grounded to maintain traction and prevent chassis damage.'
    }
  ];
  g.facts_used = 'title: "Monster Truck Offroad 2" | category: "Racing" | subgenre: "truck" | feed_description: "Take control of powerful monster trucks and conquer rugged mountain trails..." | how_to_play: "Keyboard W or Up Arrow accelerate S or Down Arrow brake reverse A or Left Arrow steer left D or Right Arrow steer right Space handbrake Touch use the on-screen driving controls" | controls: "WASD / Arrow Keys, Spacebar, Touch"';
  console.log('Updated monster-truck-offroad-2 in top-games-content.json');
}

fs.writeFileSync(topJsonPath, JSON.stringify(top, null, 2), 'utf8');

// Update data/top-games-content.js
const topJsContent = 'export const topGamesContent = ' + JSON.stringify(top, null, 2) + ';\nexport default topGamesContent;\n';
fs.writeFileSync('data/top-games-content.js', topJsContent, 'utf8');
console.log('Updated data/top-games-content.js');

// 2. Fix reports/near-duplicates.csv line 32
const ndPath = 'reports/near-duplicates.csv';
let nd = fs.readFileSync(ndPath, 'utf8');
nd = nd.replace(
  '"monster-truck-offroad-2","monster-truck-offroad",0.75,false,"slug_a","keep_both_differentiate","review_differentiate_gameplay_focus","monster-truck-offroad"',
  '"monster-truck-offroad-2","monster-truck-offroad",0.75,false,"slug_a","keep_both_differentiate","review_differentiate_gameplay_focus","monster-truck-offroad-2"'
);
fs.writeFileSync(ndPath, nd, 'utf8');
console.log('Updated reports/near-duplicates.csv canonical');
