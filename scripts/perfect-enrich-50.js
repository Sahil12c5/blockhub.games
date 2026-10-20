const fs = require('fs');
const path = require('path');
const { validateQualityGates, validateCatalogPatterns } = require('./lib/validator.js');
const { isNearDuplicate } = require('./lib/near-duplicates.js');
const topContent = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/top-games-content.json'), 'utf8'));
const allSlugs = Object.keys(topContent);

let { batchPart1 } = require('./batches/batch-50-part1.js');
let { batchPart2 } = require('./batches/batch-50-part2.js');

// Specific enrichments and fixes
const expansions = {
  "3d-police-car-parking": {
    addP2: " Carefully feathering the brake pedal while reversing preserves flawless vehicle paint and avoids structural penalties."
  },
  "a-survival-legend": {
    addP1: " Every neighborhood presents narrow chokepoints and abandoned debris that complicate evasive routing during intense monster surges.",
    addP2: " Upgrading health resilience alongside weapon output guarantees your survivor endures prolonged late-stage skirmishes."
  },
  "advance-car-game-parking": {
    addP1: " Winter conditions severely reduce tire grip, demanding that drivers treat every turn with extreme caution.",
    addP2: " Avoiding sudden accelerator thrusts prevents wheels from spinning fruitlessly across frozen asphalt patches."
  },
  "american-truck-driver-game": {
    addP1: " Each delivery contract tests your endurance across winding expressways and complex multi-lane highway junctions.",
    addP2: " Maintaining safe following buffers prevents dangerous emergency braking situations when traffic slows abruptly."
  },
  "american-truck-racing-simulator": {
    addP1: " Competitors will aggressively protect their racing lines, forcing you to find creative overtaking opportunities.",
    addP2: " Hitting each intermediate gate with seconds to spare guarantees qualification for the next urban circuit."
  },
  "angry-zombies-war-game": {
    p2Opener: "Smooth control inputs and calculated projectile arcs determine how efficiently you clear each stronghold with minimal skull ammo.",
    addP1: " Evaluating timber angles and stone density before releasing each shot prevents wasting limited ammunition on sturdy barriers.",
    addP2: " Toppling top-heavy watchtowers creates devastating secondary debris cascades that crush fortified ghouls underneath."
  },
  "animal-racing-idle-park": {
    addP1: " Each animal species possesses unique movement traits that excel across specific terrain types.",
    addP2: " Enhancing base endurance attributes allows your animal team to sustain peak racing velocity across demanding final stretches."
  },
  "anti-terrorist-shooting-game": {
    addP1: " Tactical missions require methodical room clearing and sweeping perimeter zones to neutralize hostile armed insurgent cells.",
    addP2: " Monitoring ammunition counters ensures you never engage advancing hostiles with a depleted primary weapon magazine."
  },
  "apocalypse-rush": {
    addP1: " Relentless wasteland raiders attack from both flanks, requiring defenders to maintain continuous firing lines around the vehicle.",
    addP2: " Combining rapid primary fire with timed area special attacks keeps defensive perimeters clear of dangerous melee runners."
  },
  "authentic-footballthe-brazil-world-cup": {
    addP1: " International stadium crowds react dynamically to every dangerous scoring opportunity and crucial defensive interception on the pitch.",
    addP2: " Delivering accurate driven crosses into the penalty box allows agile forwards to execute clinical headers past diving goalkeepers."
  },
  "ball-chain-blast": {
    addP1: " Linking extensive chains across diverse sports spheres clears stubborn blockers and creates massive cascading combo drops.",
    addP2: " Strategic planning before drawing each chain connection guarantees continuous combo flow without prematurely exhausting moves."
  },
  "ballio": {
    addP1: " Calculating the parabolic flight path of the soccer ball requires complete concentration as glove speeds vary.",
    addP2: " Timing your upward launch to meet the glove at its lowest travel point provides the widest margin for contact."
  },
  "basket-ball-for-two-player": {
    addP1: " Bouncing spheres collide unpredictably off backboards and rims, creating frantic rebounding scramble opportunities.",
    addP2: " Timing your single jump input cleanly at the peak of the ball's bounce tips loose rebounds directly into the hoop."
  },
  "basket-fill-ball-puzzle": {
    addP1: " Guiding multiple colorful athletic balls through complex gravity mazes demands acute trajectory visualization and spatial planning.",
    addP2: " Creating steady downward inclines prevents bouncing spheres from stalling along flat obstacle ledges before reaching baskets."
  },
  "basketball-park": {
    addP1: " Each consecutive clean basket without rim contact extends your session and builds substantial high score multipliers.",
    addP2: " Steady release mechanics and accounting for subtle distance variations keep your scoring streak alive through challenging rounds."
  },
  "battle-tung-tung-sahur-2player": {
    fixText: true,
    addP1: " In Battle Tung-Tung Sahur 2Player, players enter a fierce territorial brawl centered around a valuable prize chest. Designed specifically for competitive two-player duels on a shared keyboard, both fighters wield traditional wooden sticks to pummel rivals, disrupt opponent positioning, and claim control of the central treasure. Victory belongs to whichever warrior manages to stay within the treasure chest capture zone for twenty cumulative seconds. Combatants must balance aggressive lunges with defensive spacing to keep opponents from dominating the scoring area.",
    addP2: " Keep a sharp eye on opponent approach angles to intercept strikes before they push you out of the scoring area. Player One maneuvers with WASD keys and strikes with S, while Player Two moves with Arrow Keys and unleashes stick blows using Down Arrow. When a rival begins accumulating capture seconds near the chest, delivering well-timed stick hits sends them tumbling backward across the stage, resetting their territorial advantage. Combining relentless strikes with resolute defensive positioning ensures your stick fighter claims the chest and secures local head-to-head dominance."
  },
  "battle-wheels": {
    fixText: true,
    addP1: " In Battle Wheels, players command armored battle cars in explosive gladiatorial combat where two customized machines collide until one driver suffers a catastrophic roof impact. Brawling drivers must balance their cars, launch off arena ramps, and land directly atop opponent chassis to crush rival drivers and claim round victories. Winning three rounds secures overall match victory and propels your contender through five ranked competitive circuits spanning Bronze, Silver, Gold, Diamond, and ultimate Obsidian tiers. Physics-based aerial bounces reward drivers who master chassis tilt while flying across ramp gaps.",
    addP2: " Later challenges introduce fierce opponents with reinforced roofs and higher aerial agility. Drivers utilize WASD or Arrow Keys to tilt vehicle chassis forward and backward, adjusting balance to shield their exposed driver cockpit while aiming heavy tires at rival drivers. Cash earned from match victories can be reinvested in the garage to improve car durability, increase wheel traction, and acquire destructive new battle machines. Clashing in two-player mode on a shared keyboard produces hilarious physics-driven aerial wipeouts and unpredictable mid-air collisions. Adapting your tilt timing guarantees consistent driver crushing across every league match."
  },
  "beep-out": {
    addP1: " Untangling congested toy-town traffic grids requires patient sequence analysis before sending cars rolling down open avenues.",
    addP2: " Freeing bottleneck intersections early creates the necessary staging room to move multi-passenger vehicles out cleanly."
  },
  "bike-obby-draw-pencil": {
    addP1: " Sketching smooth pencil paths bridges hazardous platform chasms, allowing your motorcycle to maintain steady forward speed.",
    addP2: " Maintaining balanced momentum prevents your motorcycle from tipping backward when riding up steep custom-drawn ramps."
  },
  "bikkings-brothers-to-valhalla": {
    addP1: " Navigating high-speed hovercrafts across waterborne Viking arenas demands fast reflexes and assertive offensive maneuvering.",
    addP2: " Upgrading shield durability and weapon fire rate ensures your crew dominates both relic gathering races and football matches."
  },
  "blacktop-police-chase": {
    addP1: " Weaving through congested city avenues allows getaway drivers to break pursuing police lines and slip into hidden alleys.",
    addP2: " Executing timely handbrake drifts around tight city corners prevents high-speed collisions with concrete roadside dividers."
  },
  "block-tower-smash": {
    addP1: " Smashing through multi-tiered spinning block cylinders creates spectacular visual destruction when timing plunges accurately.",
    addP2: " Timing your drop releases carefully ensures you bounce safely in place rather than striking hazardous dark platform blocks."
  },
  "blocky-zombie-shooting": {
    addP1: " Voxel streets swarm with relentless undead hordes, requiring defenders to combine active kiting with accurate defensive shooting.",
    addP2: " Placing craftable barricades across narrow alleyways buys crucial seconds to reload primary firearms safely."
  },
  "brain-jam": {
    addP1: " Calculating vehicular movement sequences in advance prevents sliding cars into deadlock positions within crowded lots.",
    addP2: " Shifting large blocking trucks out of primary exit channels clears the final corridor for the red car to escape."
  },
  "break-a-lucky-egg-brainrots": {
    addP1: " Gathering rare character drops from cracked eggs demands rapid arena traversal and defensive perimeter awareness.",
    addP2: " Coordinating item transport with tactical sprints ensures you deposit valuable treasures before rivals can strike."
  },
  "bubble-pop-fairyland": {
    addP1: " Clearing colorful bubble formations unlocks rewarding coin bonuses and activates satisfying cascade chain reactions.",
    addP2: " Banking shots off lateral arena boundaries allows players to reach sheltered color clusters near the ceiling."
  },
  "bubble-shooter-crystal-hunt": {
    meta_title: "Bubble Shooter Crystal Hunt - Arcade Match | BlockHub",
    addP1: " Gathering embedded magical crystals rewards substantial score multipliers as you pop connected color clusters.",
    addP2: " Halting the steady downward advance of the bubble ceiling requires consistent aim and rapid shot execution."
  },
  "bubble-shooter-pro-2026": {
    addP1: " Procedural stage layouts challenge your spatial planning on every shot, demanding sharp bank shots and cluster clears.",
    addP2: " Conserving limited shot ammunition while severing top-level anchor bubbles guarantees victory across tough stages."
  },
  "bubble-shooter-squirrel-rescue": {
    addP1: " Rescuing baby squirrels trapped in canopy bubbles requires precise aiming angles through crowded forest branches.",
    addP2: " Deploying explosive bomb power-ups clears stubborn blocker tiles and frees multiple trapped squirrels in one shot."
  },
  "bubble-shooting-pro-fun": {
    addP1: " Classic arcade matching mechanics deliver relaxing yet challenging puzzle fun across cheerful colored bubble stages.",
    addP2: " Clearing outer wing clusters opens up unobstructed central lines of sight toward high-value ceiling anchors."
  },
  "bubble-war": {
    addP1: " Competing in real-time bubble battles demands rapid aim adjustment and relentless combo clearance against rivals.",
    addP2: " Sending disruptive junk bubbles onto opponent boards creates decisive pressure during fast-paced multiplayer duels."
  },
  "bubblehead-ball": {
    addP1: " Exaggerated head dimensions produce hilarious aerial bounces and thrilling goal-line header saves during intense duels.",
    addP2: " Balancing offensive breakaways with firm defensive positioning ensures you maintain scoring leads until match clocks expire."
  },
  "bus-mania-parking-puzzle": {
    addP1: " Directing buses along designated arrow vectors untangles crowded depot terminals and boards waiting passenger queues.",
    addP2: " Dispatching matching colored buses systematically prevents passenger platforms from overflowing during peak transit stages."
  },
  "bus-transport-footbal-players": {
    addP1: " Navigating team coaches through city traffic requires patience, careful lane changes, and smooth acceleration inputs.",
    addP2: " Delivering sports teams punctually to stadium venues demands anticipatory braking and disciplined cornering along transit routes."
  },
  "capybara-winter-curse": {
    fixText: true,
    addP1: " Built around challenges of frostbound survival, Capybara Winter Curse drops defenders into a frozen wilderness where an ancient winter curse has transformed peaceful capybara communities into aggressive zombie creatures. Taking up an experimental snowball launcher, players must traverse snowbanks, dodge infected mutants, and neutralize cursed rodents before the affliction spreads worldwide. The climactic showdown pits defenders against a colossal giant capybara zombie boss whose sweeping attacks and massive health pool require supreme combat agility. Weaving between frozen boulders and iced pine trees keeps your hero out of reach of charging infected rodents.",
    addP2: " Later challenges introduce aggressive mutant waves that close in rapidly across open snowfields. Players maneuver across frozen terrain using WASD keys, track approaching targets with mouse aiming, and tap left-click to discharge rapid-fire snowball salvos. When confronting the giant capybara boss, circling around frozen pine trees and maintaining perimeter spacing prevents devastating ground slams. Sustaining rapid snowball fire, dodging lurching zombies, and landing critical hits against the boss restores peace to the winter wilderness. Preserving agility across slippery snow trails ensures complete victory over the ancient winter plague."
  },
  "car-destruction-king": {
    addP1: " Fortified derby cars deliver bone-crushing impacts against rival machines in chaotic destruction arenas.",
    addP2: " Protecting your front radiator while executing devastating side T-bone strikes guarantees high derby survival ratings."
  },
  "car-driving-master": {
    fixText: true,
    addP1: " Set across challenging courses and realistic urban thoroughfares, Car Driving Master puts drivers in control of finely tuned performance vehicles exploring a detailed metropolis. Across sprawling avenues and busy highway corridors, drivers encounter realistic intersections, commercial parking plazas, and suburban boulevards. Your mission is to complete demanding route trials, maintain disciplined road positioning, and execute clean parking maneuvers without traffic incidents. Cruising through busy avenues with realistic vehicle physics demands steady steering adjustments and attentive traffic observation.",
    addP2: " Precision timing and disciplined execution keep you ahead when merging onto high-speed parkways or easing into narrow garages. Drivers must read traffic flows, observe right-of-way rules at complex intersections, and adjust braking distances when slowing down behind commuter vehicles. When easing into tight parking spots, utilizing gentle throttle taps and alternating between drive and reverse gears prevents costly fender collisions with high curbs or light poles. Mastering highway cruising and precision parking trials establishes your standing as a true vehicular master. Checking blind spots before changing expressway lanes ensures safe arrival at every mission checkpoint."
  },
  "car-driving-school-game": {
    addP1: " Obeying traffic signals and street signs develops real-world road discipline across diverse driving academy trials.",
    addP2: " Executing smooth parallel parking maneuvers between safety cones guarantees high marks from driving instructors."
  },
  "car-obby-3d": {
    addP1: " Sky-high floating platforms challenge your vehicle balance with swinging hammers and moving chasm bridges.",
    addP2: " Activating consumable boost abilities at crucial moments clears wide floating gaps and bypasses deadly crusher hazards."
  },
  "car-parking-driving-game": {
    addP1: " Precision parking trials demand surgical vehicular alignment across tight commercial garages and narrow alleys.",
    addP2: " Switching between dynamic camera views allows drivers to confirm bumper spacing before bringing vehicles to a final stop."
  },
  "car-parking-game-parking-jam": {
    fixText: true,
    addP1: " Car Parking Game: Parking Jam is a dynamic puzzle title challenging drivers to untangle crowded lots without touching adjacent barriers. Drivers must pilot individual cars through narrow avenues without colliding with parked vehicles, concrete barriers, or pedestrian walkways. Every level presents an intricate spatial layout, challenging players to identify the correct departure sequence and safely maneuver each car into its designated exit bay. Spatial reasoning proves essential when calculating turnaround radius and reversing between concrete pillars.",
    addP2: " Maintaining forward momentum and adjusting steering angles carefully prevents costly fender impacts against concrete dividers. Using W or Up Arrow to move forward, S or Down Arrow to back up, and A and D to turn, drivers must weave through tight gaps with inches of clearance on either side. Oversteering or misjudging clearance leads to sudden fender impacts that damage your vehicle and force a stage restart. Methodically clearing outer vehicles first opens wide turnaround corridors, allowing trapped inner cars to escape the jam cleanly. Patient multi-point turns resolve even the most congested commercial lot layouts."
  },
  "car-parking-simulator-3": {
    meta_description: "Command compact cars and heavy commercial trucks in Car Parking Simulator 3 on BlockHub.games. Master precision obstacle parking trials free online today.",
    addP1: " Piloting vehicles ranging from compact cars to heavy commercial trucks tests your adaptability across diverse parking courses.",
    addP2: " Modulating throttle inputs carefully when backing large trucks into loading bays ensures clean, collision-free parking results."
  },
  "car-parkour-challenge": {
    addP1: " Elevated stunt tracks test your nerve with vertical loops, narrow balance beams, and wide gap jumps.",
    addP2: " Sticking clean landings off high-risk mega ramps rewards disciplined throttle control and mid-air pitch adjustments."
  },
  "car-smash-obby-3d": {
    addP1: " Destructible stunt cars shed body panels upon impact, creating thrilling high-stakes obstacle course runs.",
    addP2: " Reaching intermediate checkpoints guarantees that mechanical wipeouts do not erase hard-earned course headway."
  },
  "car-sort": {
    addP1: " Managing road capacity carefully while sorting cars into matching color garages prevents premature lot gridlocks.",
    addP2: " Creating dedicated buffer bays by emptying single garages facilitates smooth sorting across multi-color stages."
  },
  "cargo-truck-simulator-2025": {
    addP1: " Hauling heavy recovery loads across rugged off-road terrain demands steady engine torque and careful path selection.",
    addP2: " Descending steep rocky switchbacks with loaded trailers requires measured braking to prevent hazardous jackknife slides."
  },
  "cars-vs-zombies": {
    addP1: " Armored battle cars smash through relentless zombie swarms across ruined post-apocalyptic arena tracks.",
    addP2: " Equipping front ramming armor and nitro boosters in the garage allows drivers to plow through dense enemy hordes."
  },
  "cartoon-football": {
    addP1: " Guiding young prodigies Yuki and Rina through academy drills refines passing vision and clinical goal-scoring accuracy.",
    addP2: " Curling shots around defensive training mannequins and into upper net corners secures professional league selection."
  },
  "cat-girl-skater": {
    addP1: " Cruising sunny park paths on a skateboard requires timing ollies over benches, low rails, and fallen branches.",
    addP2: " Maintaining fluid skating momentum while gathering scattered treats ensures high score ratings on every park run."
  },
  "challenge-the-football": {
    addP1: " Striking penalty shots past moving defensive barriers and goalkeeper dummies tests timing and shooting accuracy.",
    addP2: " Curling driven shots into top net corners earns premium score multipliers and extends trial session timers."
  }
};

function applyExpansions(batch) {
  for (const item of batch) {
    const exp = expansions[item.slug];
    if (!exp) continue;

    if (exp.meta_title) item.meta_title = exp.meta_title;
    if (exp.meta_description) item.meta_description = exp.meta_description;

    if (exp.fixText) {
      item.description = (exp.addP1 + "\n\n" + exp.addP2).trim();
      continue;
    }

    const paras = item.description.trim().split(/\n\s*\n/);
    let p1 = paras[0] || '';
    let p2 = paras[1] || '';

    if (exp.p2Opener) {
      // replace first sentence of p2
      const sents = p2.split(/(?<=[.!?])\s+/);
      sents[0] = exp.p2Opener;
      p2 = sents.join(' ');
    }

    if (exp.addP1) {
      p1 = p1.trim() + exp.addP1;
    }
    if (exp.addP2) {
      p2 = p2.trim() + exp.addP2;
    }

    item.description = (p1 + "\n\n" + p2).trim();
  }
}

applyExpansions(batchPart1);
applyExpansions(batchPart2);

fs.writeFileSync(
  path.join(__dirname, 'batches/batch-50-part1.js'),
  '/**\n * PROSE BATCH 50 - PART 1 (GAMES 1 TO 25)\n */\n\nconst batchPart1 = ' + JSON.stringify(batchPart1, null, 2) + ';\n\nmodule.exports = { batchPart1 };\n',
  'utf8'
);

fs.writeFileSync(
  path.join(__dirname, 'batches/batch-50-part2.js'),
  '/**\n * PROSE BATCH 50 - PART 2 (GAMES 26 TO 50)\n */\n\nconst batchPart2 = ' + JSON.stringify(batchPart2, null, 2) + ';\n\nmodule.exports = { batchPart2 };\n',
  'utf8'
);

console.log('Successfully applied expansions to batchPart1 and batchPart2!');
