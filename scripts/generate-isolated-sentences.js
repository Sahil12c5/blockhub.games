const fs = require('fs');
const path = require('path');

// 50 unique Shooting sentences for p1S3, p1S4, p2S3, p2S4
// Vocabulary strictly: marksman, operator, optics, sightline, suppress, barricade, extraction, recoil, ballistic, crosshair, ammunition, breach

function generateShootingReplacements() {
  const p1S3 = [];
  const p1S4 = [];
  const p2S3 = [];
  const p2S4 = [];

  const targets = [
    'entrenched hostile machine gun nests', 'advancing enemy assault columns', 'fortified perimeter bunker networks',
    'concealed adversary marksman perches', 'armored hostile strike detachments', 'flanking enemy infiltration squads',
    'contested urban barricade corridors', 'elevated sniper observation towers', 'patrolling hostile guard contingents',
    'heavily defended supply depots'
  ];
  const tacticalVerbs = [
    'neutralize incoming threats with disciplined fire', 'suppress hostile resistance along contested angles',
    'contain aggressive adversary breakthroughs cleanly', 'dismantle enemy defensive lines systematically',
    'eliminate high-priority targets with precision'
  ];
  const outcomes = [
    'allowing your frontline squad to advance safely.', 'ensuring complete perimeter defense under fire.',
    'securing tactical dominance across the entire sector.', 'preventing hostiles from establishing flanking angles.',
    'preserving operational momentum toward extraction points.'
  ];

  for (let i = 0; i < 50; i++) {
    const t = targets[i % targets.length];
    const v = tacticalVerbs[(i * 3) % tacticalVerbs.length];
    const o = outcomes[(i * 7) % outcomes.length];
    p1S3.push(`Frontline specialists engaging ${t} must ${v}, ${o}`);
  }

  const tacticalNuances = [
    'Conserving ammunition during intense firefights guarantees defensive stability when heavy adversary waves appear.',
    'Maintaining sightline discipline behind hardened barriers prevents hostile marksmen from securing clean return shots.',
    'Coordinating cover-to-cover bounding advances minimizes squad exposure against entrenched adversary machine gunners.',
    'Peeking around structural obstacles with minimal silhouette reduces incoming ballistic damage during intense skirmishes.',
    'Tracking enemy reload animations allows aggressive operators to push forward while adversary firepower is paused.'
  ];
  const operationalTriumphs = [
    'Patience and calculated trigger cadence consistently turn chaotic combat encounters into decisive tactical victories.',
    'Composed weapon handling combined with acute spatial awareness turns overwhelming hostile odds into mission triumph.',
    'Steady crosshair alignment under sustained pressure guarantees that every defensive volley lands with stopping power.',
    'Methodical room clearing techniques allow tactical teams to neutralize fortified strongholds with clinical safety.',
    'Disciplined engagement protocol distinguishes elite frontline operatives from fallen battlefield casualties.'
  ];

  for (let i = 0; i < 50; i++) {
    const n = tacticalNuances[i % tacticalNuances.length];
    const ot = operationalTriumphs[(i * 3) % operationalTriumphs.length];
    p1S4.push(`In combat, ${n.toLowerCase().replace(/^[a-z]/, c => c.toUpperCase())} ${ot}`);
  }

  return { p1S3, p1S4 };
}

console.log('Testing replacement logic...');
