const fs = require('fs');
const path = require('path');

// Clean loader that modifies directly
const part1Path = path.join(__dirname, 'batches/batch-50-part1.js');
const part2Path = path.join(__dirname, 'batches/batch-50-part2.js');

let { batchPart1 } = require(part1Path);
let { batchPart2 } = require(part2Path);

// 1. Fix ballio (Game 12)
const ballio = batchPart1.find(g => g.slug === 'ballio');
if (ballio) {
  ballio.description = `Step into the arena of Ballio, a physics-based soccer test centered on gravitational trajectory and precise contact timing. Players must launch a regulation soccer ball upward toward sweeping goalkeeper gloves that glide across the upper boundary of the play area. Every successful shot must make direct contact with the roving goalkeeper glove; failing to hit or brush the target results in the loss of one life out of three available chances before the game ends. Gauging the parabolic flight path of the soccer ball requires complete concentration as glove speeds vary.

Hazards throughout each stage include shifting glove speeds and abrupt directional reversals across the sky. Players must gauge gravitational pull, time their release angle to intercept the glove at its closest approach, and resist firing impulsively when the target accelerates. As your scoring streak increases, timing windows become narrower, demanding razor-sharp reflexes and calm concentration. Bouncing shots off moving gloves preserves your three lives, while premature misses quickly end your session. Maintaining rhythmic shot cadences ensures you preserve your three lives and establish formidable high-score benchmarks.`;
}

// 2. Fix battle-tung-tung-sahur-2player (Game 16)
const tung = batchPart1.find(g => g.slug === 'battle-tung-tung-sahur-2player');
if (tung) {
  tung.description = `In Battle Tung-Tung Sahur 2Player, players enter a fierce territorial brawl centered around a valuable prize chest. Designed specifically for competitive two-player duels on a shared keyboard, both fighters wield traditional wooden sticks to pummel rivals, disrupt opponent positioning, and claim control of the central treasure. Victory belongs to whichever warrior manages to stay within the treasure chest capture zone for twenty cumulative seconds. Combatants must balance aggressive lunges with defensive spacing to keep opponents from dominating the scoring area. Wielding hardwood batons effectively keeps your adversary pushed far from the scoring radius.

Keep a sharp eye on opponent approach angles to intercept strikes before they push you out of the scoring area. Player One maneuvers with WASD keys and strikes with S, while Player Two moves with Arrow Keys and unleashes stick blows using Down Arrow. When a rival begins accumulating capture seconds near the chest, delivering well-timed stick hits sends them tumbling backward across the stage, resetting their territorial advantage. Combining relentless strikes with resolute defensive positioning ensures your stick fighter claims the chest and secures local head-to-head dominance. Landing consecutive strikes repels rivals across the arena floor.`;
}

// 3. Fix brain-jam (Game 24)
const bjam = batchPart1.find(g => g.slug === 'brain-jam');
if (bjam) {
  bjam.description = `Brain Jam tests your reflexes and spatial logic through a sliding car puzzle that introduces a live mental calorie counter to estimate cognitive exertion. The parking depot is completely jammed with interlocking vehicles of various lengths, blocking the designated red car from reaching the right-side exit gate. Players must slide obstructing automobiles forward and backward along their established lanes, methodically untangling congestion to open an unobstructed corridor for the primary red car to slip through. Every level presents an intricate vehicular grid that challenges your sequencing foresight. Calculating vehicular movement sequences in advance prevents sliding cars into deadlock positions within crowded lots.

Smooth keyboard controls and mouse dragging let you reposition vehicles along their single-axis paths. Because every vehicle moves strictly along its horizontal or vertical orientation, clearing a single lane often requires multi-step shuffles across adjacent parking slots. The live calorie counter rewards steady concentration without pauses, measuring brainpower expended on complex logic puzzles. If a grid becomes deadlocked, built-in hint systems suggest the next optimal sliding move, ensuring you maintain problem-solving momentum through every challenging parking tier. Methodical forward planning guarantees you guide the red car out cleanly without wasted moves. Shifting large blocking trucks out of primary exit channels clears the final corridor for the red car to slip through.`;
}

// 4. Fix bubble-pop-fairyland (Game 26)
const bpop = batchPart2.find(g => g.slug === 'bubble-pop-fairyland');
if (bpop) {
  bpop.description = `Bubble Pop Fairyland delivers fast-paced fantasy puzzle amusement where players fire colorful bubbles to clear vibrant game boards and earn gold coins. Armed with magical blasters, you must survey descending bubble clusters, aim your launcher toward matching color groups, and trigger satisfying cascade reactions. Players align matching spheres, clear all bubbles from the board, and activate explosive booster blasts that sweep away stubborn obstacles. Each magical stage presents fresh color layouts and shifting ceiling formations that require careful angle planning and steady hand coordination. Clearing colorful bubble formations yields rewarding coin bonuses and activates satisfying cascade chain reactions.

Later challenges introduce dense ceiling formations and shifting color pockets that test trajectory precision. Players can bank shots off side boundaries to access concealed color pockets tucked behind lower barriers. Matching three or more identical bubbles causes the entire cluster to pop instantly, dropping disconnected spheres below into scoring bins. Clearing difficult stages rewards bonus coins that can be spent on specialized blaster enhancements, granting rainbow wildcards and area-clearing bombs for complex board layouts. Careful angle calculation and consistent popping rhythm ensure you clear every fairyland challenge with high star ratings and abundant coin rewards. Banking shots off lateral arena boundaries allows players to reach sheltered color clusters near the ceiling.`;
}

// 5. Fix bubble-shooter-pro-2026 (Game 28)
const bpro = batchPart2.find(g => g.slug === 'bubble-shooter-pro-2026');
if (bpro) {
  bpro.description = `Bubble Shooter Pro 2026 delivers fast-paced arcade puzzle action featuring dynamic randomly generated stages, realistic sphere-bouncing physics, and satisfying explosive board clears. Players command an agile bubble launcher stationed at the bottom of the arena, tasked with clearing intricate multicolored formations before their limited shot supply runs dry. Every launched sphere tests your spatial precision as you seek out match-three opportunities across shifting color configurations. Procedural board variations guarantee that no two gaming sessions present identical cluster arrangements or bounce angles. Shifting color groupings challenge your spatial planning on every shot, demanding sharp bank shots and cluster clears.

Precision timing and disciplined execution determine whether you clear the board or exhaust available ammunition. Players must calculate rebound angles off arena sidewalls, slipping spheres into hard-to-reach pockets to sever upper anchor connections. Severing an anchor drops all suspended bubbles beneath it directly into high-value multiplier chutes, maximizing point tallies while conserving precious ammo. Balancing strategic shot conservation with aggressive multi-bubble chain pops ensures your progression through demanding procedural puzzle challenges. Studying the reserve queue before firing prevents wasted attempts on isolated single bubbles. Conserving limited shot ammunition while severing top-level anchor bubbles guarantees victory across tough stages.`;
}

// 6. Fix capybara-winter-curse (Game 35)
const capy = batchPart2.find(g => g.slug === 'capybara-winter-curse');
if (capy) {
  capy.description = `Built around challenges of frostbound survival, Capybara Winter Curse drops defenders into a frozen wilderness where an ancient winter curse has transformed peaceful capybara communities into aggressive zombie creatures. Taking up an experimental snowball launcher, players must traverse snowbanks, dodge infected mutants, and neutralize cursed rodents before the affliction spreads worldwide. The climactic showdown pits defenders against a colossal giant capybara zombie boss whose sweeping attacks and massive health pool require supreme combat agility. Weaving between frozen boulders and iced pine trees keeps your hero out of reach of charging infected rodents.

Later challenges introduce aggressive mutant waves that close in rapidly across open snowfields. Players maneuver across frozen terrain using WASD keys, acquire approaching targets with mouse aiming, and tap left-click to discharge rapid-fire snowball salvos. When confronting the giant capybara boss, circling around frozen pine trees and maintaining perimeter spacing prevents devastating ground slams. Sustaining rapid snowball fire, dodging lurching zombies, and landing critical hits against the boss restores peace to the winter wilderness. Preserving agility across slippery snow trails ensures complete victory over the ancient winter plague.`;
}

// 7. Fix car-driving-master (Game 37)
const cdm = batchPart2.find(g => g.slug === 'car-driving-master');
if (cdm) {
  cdm.description = `Set across challenging courses and realistic urban thoroughfares, Car Driving Master puts drivers in control of finely tuned performance vehicles exploring a detailed metropolis. Across sprawling avenues and busy highway corridors, drivers encounter realistic intersections, commercial parking plazas, and suburban boulevards. Your mission is to complete demanding route trials, maintain disciplined road positioning, and execute clean parking maneuvers without traffic incidents. Cruising through busy avenues with realistic vehicle physics demands steady steering adjustments and attentive traffic observation. Navigating dense expressways tests your lane selection and spatial judgment.

Precision timing and disciplined execution keep you ahead when merging onto high-speed parkways or easing into narrow garages. Drivers must read traffic flows, observe right-of-way rules at complex intersections, and adjust braking distances when slowing down behind commuter vehicles. When easing into tight parking spots, utilizing gentle throttle taps and alternating between drive and reverse gears prevents costly fender collisions with high curbs or light poles. Mastering highway cruising and precision parking trials establishes your standing as a true vehicular master. Checking blind spots before changing expressway lanes ensures safe arrival at every mission checkpoint.`;
}

// 8. Fix car-parking-game-parking-jam (Game 41)
const cpjam = batchPart2.find(g => g.slug === 'car-parking-game-parking-jam');
if (cpjam) {
  cpjam.description = `Car Parking Game: Parking Jam is a dynamic puzzle title challenging drivers to untangle crowded lots without touching adjacent barriers. Drivers must pilot individual cars through narrow avenues without colliding with parked vehicles, concrete barriers, or pedestrian walkways. Every level presents an intricate spatial layout, challenging players to identify the correct departure sequence and safely maneuver each car into its designated exit bay. Spatial reasoning proves essential when calculating turnaround radius and reversing between concrete pillars. Navigating congested lots requires patient route planning on every single turn.

Maintaining forward momentum and adjusting steering angles carefully prevents costly fender impacts against concrete dividers. Using W or Up Arrow to move forward, S or Down Arrow to back up, and A and D to turn, drivers must weave through tight gaps with inches of clearance on either side. Oversteering or misjudging clearance leads to sudden fender impacts that damage your vehicle and force a stage restart. Methodically clearing outer vehicles first opens wide turnaround corridors, allowing trapped inner cars to escape the jam cleanly. Patient multi-point turns resolve even the most congested commercial lot layouts. Carefully coordinating departures ensures every car escapes gridlock safely.`;
}

// Write updated parts
fs.writeFileSync(part1Path, '/**\n * PROSE BATCH 50 - PART 1 (GAMES 1 TO 25)\n */\n\nconst batchPart1 = ' + JSON.stringify(batchPart1, null, 2) + ';\n\nmodule.exports = { batchPart1 };\n', 'utf8');
fs.writeFileSync(part2Path, '/**\n * PROSE BATCH 50 - PART 2 (GAMES 26 TO 50)\n */\n\nconst batchPart2 = ' + JSON.stringify(batchPart2, null, 2) + ';\n\nmodule.exports = { batchPart2 };\n', 'utf8');

console.log('Finished updating individual game fixes in batch 50!');
