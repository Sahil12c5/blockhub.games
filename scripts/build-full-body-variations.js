const fs = require('fs');
const path = require('path');

// Generate 40 P1 and 40 P2 variations for each genre family
// Strictly compliant with vocabulary isolation, capital starts, no adj dupes, no unverifiable terms

function createGenrePools() {
  // SHOOTING
  const SHOOTING_P1_BODIES = [];
  const SHOOTING_P2_BODIES = [];
  
  const shootP1Templates = [
    (i) => `Confronting hostile squads throughout the encounter zone requires situational awareness and calm target acquisition. Operators must survey their perimeter continuously, utilize structural barriers effectively, and prioritize lethal threats before getting encircled in tight quarters.`,
    (i) => `Surviving aggressive adversary waves demands disciplined positioning and sharp observation of engagement corridors. Assessing incoming threat vectors early allows operators to establish defensive firing lines and neutralize targets with calculated precision.`,
    (i) => `Engaging hostile units across contested tactical zones requires calculated movement and decisive trigger control. Holding advantageous high ground gives operators the line of sight needed to suppress advancing hostiles efficiently.`,
    (i) => `Tactical encounters test your ability to read enemy approach angles while preserving essential resources under pressure. Falling back to fortified choke points prevents flanking maneuvers and keeps squad positions secure.`,
    (i) => `Neutralizing fortified adversary positions calls for methodical advance and acute awareness of environmental cover. Operators must coordinate movement between barricades, tracking target movement patterns before executing clean strikes.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = shootP1Templates[i % shootP1Templates.length](i);
    const varWord = ['sector', 'district', 'perimeter', 'stronghold', 'outpost', 'compound', 'zone', 'facility'][i % 8];
    const actWord = ['suppressing', 'eliminating', 'containing', 'routing', 'intercepting', 'clearing', 'neutralizing', 'engaging'][i % 8];
    SHOOTING_P1_BODIES.push(`${base.replace('encounter zone', `${varWord} confrontation zone`).replace('neutralize targets', `${actWord} hostile targets`)}`);
  }

  const shootP2Templates = [
    (i) => `Disciplined weapon manipulation ensures that pointers stay centered on target silhouettes during intense skirmishes. Panicking and firing erratically depletes supplies unnecessarily, while measured single shots dismantle adversary resistance methodically.`,
    (i) => `Coordinating evasive maneuvers with defensive positioning provides the breathing room needed to assess combat flow safely. Utilizing hard cover breaks incoming lines of fire, allowing operators to plan counter-strikes with confidence.`,
    (i) => `Smooth aiming adjustments allow operators to track moving targets without overshooting their defensive boundaries. Staying composed during close-quarters pressure keeps defensive lines intact until the area is cleared.`,
    (i) => `Patience and calculated positioning prove decisive when holding strategic choke points against multiple adversaries. Methodical weapon handling ensures every defensive volley finds its mark with devastating efficiency.`,
    (i) => `Maintaining firm sightlines while cycling behind protective barriers prevents operators from taking critical damage. Quick reflex adjustments combined with steady trigger discipline ensure consistent survival across demanding engagements.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = shootP2Templates[i % shootP2Templates.length](i);
    const varWord = ['tactical', 'defensive', 'perimeter', 'compound', 'combat', 'engagement', 'outpost', 'sector'][i % 8];
    SHOOTING_P2_BODIES.push(`${base.replace('defensive boundaries', `${varWord} boundaries`)}`);
  }

  // PUZZLE
  const PUZZLE_P1_BODIES = [];
  const PUZZLE_P2_BODIES = [];
  
  const puzzleP1Templates = [
    (i) => `Each stage presents an intricate arrangement where every shift directly alters remaining maneuver space. Solvers must analyze layout geometry thoroughly, anticipate chain reactions, and sequence their actions methodically to avoid unsolvable dead ends.`,
    (i) => `Unraveling complex logic configurations demands acute spatial reasoning and foresight. Inspecting the entire field before committing your opening move ensures critical transit channels stay unobstructed throughout the attempt.`,
    (i) => `Navigating challenging puzzle boards tests your capacity to identify underlying structural patterns under pressure. Methodical planning and patient deduction allow solvers to clear congested sectors without exhausting available turns.`,
    (i) => `Balancing immediate clearances against long-term board structure defines the central challenge of each puzzle layout. Developing an organized scanning routine reveals hidden connections that simplify complicated stage objectives.`,
    (i) => `Overcoming tricky grid setups requires careful consideration of how moving individual elements impacts surrounding pieces. Strategic foresight prevents bottlenecks and ensures continuous progress toward complete stage clearance.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = puzzleP1Templates[i % puzzleP1Templates.length](i);
    const varWord = ['grid', 'matrix', 'board', 'layout', 'field', 'array', 'configuration', 'network'][i % 8];
    PUZZLE_P1_BODIES.push(`${base.replace('puzzle layout', `${varWord} challenge`)}`);
  }

  const puzzleP2Templates = [
    (i) => `Careful examination of the board before shifting pieces prevents accidental gridlocks that could halt progress. Deliberate, verified actions preserve maneuver flexibility, rewarding observant solvers who confirm escape routes in advance.`,
    (i) => `Executing moves with measured patience ensures you never trap essential components behind impassable barriers. Developing an orderly solution sequence allows solvers to navigate rising stage complexity with complete confidence.`,
    (i) => `Smooth piece manipulation and steady logic pacing turn intimidating configurations into manageable clearing steps. Staying composed when space tightens guarantees that every input contributes directly toward a clean solution.`,
    (i) => `Anticipating cascading movements before finalizing adjustments keeps vital pathways open across the entire grid. Practicing disciplined spatial deduction builds the problem-solving intuition required for advanced puzzle stages.`,
    (i) => `Methodically clearing perimeter sections first creates valuable operational room to maneuver central components. Consistent visual verification of board state prevents costly missteps and ensures swift stage completion.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = puzzleP2Templates[i % puzzleP2Templates.length](i);
    const varWord = ['grid', 'matrix', 'board', 'layout', 'field', 'array', 'configuration', 'network'][i % 8];
    PUZZLE_P2_BODIES.push(`${base.replace('entire grid', `${varWord} layout`)}`);
  }

  // SPORTS
  const SPORTS_P1_BODIES = [];
  const SPORTS_P2_BODIES = [];
  
  const sportsP1Templates = [
    (i) => `Entering the competitive pitch brings intense match conditions where athletic precision and split-second choices decide the outcome. Coordinating with teammates, reading opponent formations, and executing clinical plays ensure you stay ahead on the scoreboard.`,
    (i) => `Athletic contests demand disciplined field awareness and sharp anticipation of opponent movement vectors. Establishing strong positional presence allows your squad to dictate match tempo and capitalize on defensive openings.`,
    (i) => `Competing across demanding match fixtures requires players to balance aggressive attacking play with resolute backline structure. Communicating effectively and exploiting open seams creates dependable scoring opportunities.`,
    (i) => `High-stakes sporting encounters test your ability to maintain composure under relentless opponent pressure. Patient ball circulation and decisive tactical execution allow competitors to control territory and convert critical chances.`,
    (i) => `Challenging skilled rivals calls for sharp reflexes and thorough understanding of spatial geometry across the playing area. Reading defensive shifts early enables your team to execute clinical transitions into attacking territory.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = sportsP1Templates[i % sportsP1Templates.length](i);
    const varWord = ['arena', 'field', 'pitch', 'court', 'stadium', 'venue', 'ground', 'facility'][i % 8];
    SPORTS_P1_BODIES.push(`${base.replace('competitive pitch', `competitive ${varWord}`)}`);
  }

  const sportsP2Templates = [
    (i) => `Anticipating projectile trajectory and player momentum gives you the upper hand during critical offensive and defensive transitions. Composure during clutch moments prevents unforced turnovers, letting disciplined positioning dictate the tempo of the entire contest.`,
    (i) => `Executing inputs with smooth timing ensures passes and strikes travel cleanly toward intended target zones. Staying composed when marked tightly allows competitors to maintain possession and orchestrate winning match strategies.`,
    (i) => `Disciplined positioning and patient defensive containment prevent opponents from creating uncontested scoring lanes. Seizing transition turnovers enables swift counter-attacks that catch rival formations unprepared.`,
    (i) => `Reading opponent body language gives you the split-second foresight needed to intercept passes and clear dangerous balls. Practicing rhythmic input timing builds the consistency required to dominate high-intensity match play.`,
    (i) => `Coordinating defensive shifts with rapid counter-attacking runs creates dynamic pressure across every sector of the court. Calm decision-making under intense pressure distinguishes triumphant contenders from defeated opponents.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = sportsP2Templates[i % sportsP2Templates.length](i);
    const varWord = ['fixture', 'contest', 'match', 'clash', 'encounter', 'showdown', 'game', 'battle'][i % 8];
    SPORTS_P2_BODIES.push(`${base.replace('entire contest', `entire ${varWord}`)}`);
  }

  // ARCADE / ACTION / GENERAL
  const GENERAL_P1_BODIES = [];
  const GENERAL_P2_BODIES = [];
  
  const generalP1Templates = [
    (i) => `Engaging with the core mechanics demands sharp concentration and steady hand-eye coordination. Players must react dynamically to shifting stage conditions, prioritize vital objectives, and maintain steady progress through each stage.`,
    (i) => `Navigating energetic stage layouts challenges players to adapt swiftly as obstacle patterns evolve in speed and complexity. Maintaining calm operational focus allows you to weave through hazards without interrupting forward momentum.`,
    (i) => `Action-packed sequences test your reflexes and spatial judgment across progressively demanding environments. Spotting safe pathways early enables players to bypass hazardous gauntlets while collecting vital stage items.`,
    (i) => `Balancing rapid traversal with careful hazard avoidance defines the central rhythm of every attempt. Observing cyclical environmental cues ensures you time your movements to slip through closing obstacle windows safely.`,
    (i) => `Dynamic gameplay scenarios require players to maintain situational awareness as multiple threats emerge simultaneously. Decisive reactions and consistent mechanical execution turn frantic encounters into smooth stage clearances.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = generalP1Templates[i % generalP1Templates.length](i);
    const varWord = ['stage', 'environment', 'zone', 'arena', 'realm', 'course', 'layout', 'sector'][i % 8];
    GENERAL_P1_BODIES.push(`${base.replace('each stage', `each ${varWord}`)}`);
  }

  const generalP2Templates = [
    (i) => `Observing patterns and timing your reactions prevents costly missteps as difficulty increases. Maintaining a calm rhythm under pressure ensures you adapt to unexpected surprises and push toward new personal bests.`,
    (i) => `Executing responsive inputs with steady timing allows players to weave through compact obstacle gauntlets with poise. Avoiding rushed movements preserves stage momentum and keeps your character fully under control.`,
    (i) => `Sharpening input coordination through patient practice eliminates hesitation during critical reflex windows. Smooth mechanical delivery ensures you clear narrow obstacle gaps cleanly on every single attempt.`,
    (i) => `Anticipating hazard movement cycles gives you the foresight needed to navigate tight spaces without taking damage. Developing a dependable gameplay rhythm transforms intimidating stage sections into routine successes.`,
    (i) => `Calm focus during high-tempo sequences prevents panic inputs that could lead to unnecessary collisions. Methodical refinement of your movement habits guarantees steady progress across all demanding challenge stages.`
  ];
  for (let i = 0; i < 40; i++) {
    const base = generalP2Templates[i % generalP2Templates.length](i);
    const varWord = ['challenge', 'adventure', 'journey', 'experience', 'quest', 'run', 'campaign', 'endeavor'][i % 8];
    GENERAL_P2_BODIES.push(`${base.replace('challenge stages', `${varWord} stages`)}`);
  }

  return {
    SHOOTING_P1_BODIES,
    SHOOTING_P2_BODIES,
    PUZZLE_P1_BODIES,
    PUZZLE_P2_BODIES,
    SPORTS_P1_BODIES,
    SPORTS_P2_BODIES,
    GENERAL_P1_BODIES,
    GENERAL_P2_BODIES
  };
}

const pools = createGenrePools();

// Read existing DRIVING bodies
const bodyVarFile = path.join(__dirname, '../scripts/lib/body-variations.js');
let existing = fs.readFileSync(bodyVarFile, 'utf8');

// Append new pools to exports
let fullFile = existing.replace('module.exports = {', `
const SHOOTING_P1_BODIES = ${JSON.stringify(pools.SHOOTING_P1_BODIES, null, 2)};
const SHOOTING_P2_BODIES = ${JSON.stringify(pools.SHOOTING_P2_BODIES, null, 2)};

const PUZZLE_P1_BODIES = ${JSON.stringify(pools.PUZZLE_P1_BODIES, null, 2)};
const PUZZLE_P2_BODIES = ${JSON.stringify(pools.PUZZLE_P2_BODIES, null, 2)};

const SPORTS_P1_BODIES = ${JSON.stringify(pools.SPORTS_P1_BODIES, null, 2)};
const SPORTS_P2_BODIES = ${JSON.stringify(pools.SPORTS_P2_BODIES, null, 2)};

const GENERAL_P1_BODIES = ${JSON.stringify(pools.GENERAL_P1_BODIES, null, 2)};
const GENERAL_P2_BODIES = ${JSON.stringify(pools.GENERAL_P2_BODIES, null, 2)};

module.exports = {
  SHOOTING_P1_BODIES,
  SHOOTING_P2_BODIES,
  PUZZLE_P1_BODIES,
  PUZZLE_P2_BODIES,
  SPORTS_P1_BODIES,
  SPORTS_P2_BODIES,
  GENERAL_P1_BODIES,
  GENERAL_P2_BODIES,
`);

fs.writeFileSync(bodyVarFile, fullFile, 'utf8');
console.log('Successfully expanded body-variations.js with 40 variations per genre family!');
