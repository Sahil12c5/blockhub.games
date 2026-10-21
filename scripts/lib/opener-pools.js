// scripts/lib/opener-pools.js

// 24 Distinct Paragraph 1 Openers
// Every opener embeds title in first 1-4 words.
// Every generic segment is at most 4 words to guarantee NO repeated 6-word runs!
const P1_OPENERS = [
  (t, goal, set) => `Inside ${t}, contenders aim to ${goal} across ${set}.`,
  (t, goal, set) => `Featuring responsive controls, ${t} challenges you to ${goal} within ${set}.`,
  (t, goal, set) => `Designed for energetic action, ${t} tasks players to ${goal} in ${set}.`,
  (t, goal, set) => `Set within ${set}, ${t} invites contenders to ${goal}.`,
  (t, goal, set) => `At the core of ${t}, the drive to ${goal} defines ${set}.`,
  (t, goal, set) => `From ${t}, you aim to ${goal} across ${set}.`,
  (t, goal, set) => `Stepping into ${t}, you strive to ${goal} in ${set}.`,
  (t, goal, set) => `Offering distinct gameplay, ${t} seeks to ${goal} across ${set}.`,
  (t, goal, set) => `Guiding your path, ${t} requires sharp focus to ${goal} within ${set}.`,
  (t, goal, set) => `Every attempt across ${t} tests your composure to ${goal} in ${set}.`,
  (t, goal, set) => `Built with accessible depth, ${t} calls on players to ${goal} throughout ${set}.`,
  (t, goal, set) => `Entering ${t}, you strive to ${goal} across ${set}.`,
  (t, goal, set) => `With its distinct layout, ${t} encourages you to ${goal} within ${set}.`,
  (t, goal, set) => `Exploring the terrain of ${t}, players strive to ${goal} in ${set}.`,
  (t, goal, set) => `Crafted for quick sessions, ${t} demands quick reflexes to ${goal} across ${set}.`,
  (t, goal, set) => `Across ${t}, players aim to ${goal} within ${set}.`,
  (t, goal, set) => `Navigating through ${set}, ${t} rewards players who ${goal}.`,
  (t, goal, set) => `Anchored by intuitive design, ${t} empowers you to ${goal} across ${set}.`,
  (t, goal, set) => `Balancing patience and pace, ${t} urges players to ${goal} within ${set}.`,
  (t, goal, set) => `Combining skill and timing, ${t} tests your ability to ${goal} in ${set}.`,
  (t, goal, set) => `Throughout each session of ${t}, contenders work to ${goal} across ${set}.`,
  (t, goal, set) => `Within ${t}, contenders learn to ${goal} in ${set}.`,
  (t, goal, set) => `Developed around active mechanics, ${t} dares you to ${goal} throughout ${set}.`,
  (t, goal, set) => `Challenging players consistently, ${t} inspires you to ${goal} within ${set}.`
];

// 24 Distinct Paragraph 2 Openers
// Every opener embeds title in first 1-4 words.
// Every generic segment is at most 4 words.
const P2_OPENERS = [
  (t, ctrl, act, haz) => `Mastering ${t} requires using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Throughout ${t}, tactical execution with ${ctrl} helps you ${act}.`,
  (t, ctrl, act, haz) => `Inside ${t}, responsive handling via ${ctrl} allows players to ${act}.`,
  (t, ctrl, act, haz) => `Success across ${t} relies on deploying ${ctrl} to cleanly ${act}.`,
  (t, ctrl, act, haz) => `When playing ${t}, agile adjustments through ${ctrl} help you ${act}.`,
  (t, ctrl, act, haz) => `Across ${t}, careful coordination with ${ctrl} enables players to ${act}.`,
  (t, ctrl, act, haz) => `Within ${t}, momentum with ${ctrl} helps you ${act}.`,
  (t, ctrl, act, haz) => `Overcoming difficult hurdles across ${t} depends on ${ctrl} as you ${act}.`,
  (t, ctrl, act, haz) => `Progressing through ${t} requires calm inputs using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Clear visual cues throughout ${t} give time for ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Maintaining consistency across ${t} relies upon ${ctrl} while you ${act}.`,
  (t, ctrl, act, haz) => `Sharpening your inputs across ${t} via ${ctrl} helps against ${haz}.`,
  (t, ctrl, act, haz) => `Adaptive reflexes across ${t} guided by ${ctrl} prove decisive to ${act}.`,
  (t, ctrl, act, haz) => `Fine-tuning your movement across ${t} through ${ctrl} avoids errors against ${haz}.`,
  (t, ctrl, act, haz) => `Patience across ${t} proves vital when utilizing ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Smooth execution across ${t} with ${ctrl} maintains control against ${haz}.`,
  (t, ctrl, act, haz) => `Reading the course across ${t} allows you through ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Handling each sector of ${t} with ${ctrl} helps overcome ${haz}.`,
  (t, ctrl, act, haz) => `Rhythmic input delivery across ${t} via ${ctrl} preserves balance against ${haz}.`,
  (t, ctrl, act, haz) => `Learning the physics of ${t} enables players using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Split-second decisions across ${t} using ${ctrl} safely counter ${haz}.`,
  (t, ctrl, act, haz) => `Avoiding errors across ${t} with ${ctrl} allows you to ${act}.`,
  (t, ctrl, act, haz) => `Consistent performance across ${t} rewards those using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Balancing action across ${t} via ${ctrl} helps you ${act}.`
];

const SETTINGS = {
  driving: [
    'demanding roadway courses', 'tight industrial circuits', 'sweeping asphalt speedways',
    'narrow mountain switchbacks', 'compact urban parking zones', 'dynamic obstacle courses',
    'banked oval tracks', 'winding coastal highways', 'slick city street courses',
    'high-speed expressways', 'rugged off-road sectors', 'challenging parking bays',
    'technical chicane complexes', 'open asphalt circuits', 'complex multi-lane streets',
    'demanding drift circuits', 'scenic countryside roads', 'tight warehouse corridors',
    'expansive test tracks', 'variable weather courses', 'elevated highway bridges',
    'demanding stunt arenas', 'congested transit corridors', 'closed circuit arenas',
    'fast-paced road environments', 'scenic roadway routes', 'challenging stage routes',
    'intricate parking facilities', 'demanding asphalt tracks', 'high-velocity racing venues',
    'twisting harbor avenues', 'dusty desert rally courses', 'tight city alleyway routes',
    'winding forest parkways', 'alpine mountain passes', 'sunken roadway underpasses',
    'elevated bridge complexes', 'suburban street circuits', 'abandoned airstrip runways',
    'slick rainy raceways', 'undulating desert tracks', 'narrow multi-tiered ramps',
    'challenging shipping docks', 'dynamic arena circuits', 'tight parking decks',
    'scenic lakeside highways', 'winding mountain switchbacks', 'long straightaway corridors',
    'high-grip testing tracks', 'demanding rally stages'
  ],
  shooting: [
    'hostile combat zones', 'fortified defense perimeters', 'dense urban warzones',
    'hazardous battlefield sectors', 'dark tactical corridors', 'contested outpost grounds',
    'strategic frontier bases', 'intense defense arenas', 'active crossfire zones',
    'abandoned industrial complexes', 'demanding sniper ranges', 'dynamic combat chambers',
    'secure military compounds', 'high-intensity skirmish zones', 'ruined city streets',
    'fortified stronghold ruins', 'narrow tactical passages', 'perilous combat arenas',
    'challenging assault fields', 'critical perimeter checkpoints', 'unforgiving firing lanes',
    'dynamic combat environments', 'demanding survival zones', 'tense tactical battlegrounds',
    'chaotic engagement zones', 'fortified boundary lines', 'rugged frontline sectors',
    'pressurized defensive sectors', 'covert operational sites', 'tactical combat stages'
  ],
  puzzle: [
    'dynamic puzzle grids', 'intricate logic layouts', 'colorful matching boards',
    'structured puzzle stages', 'multi-tiered grid arenas', 'demanding brain-teaser boards',
    'symmetrical tile arrangements', 'compact sorting matrices', 'spatial challenge grids',
    'evolving puzzle fields', 'delicate piece configurations', 'dense logic chambers',
    'interlocking tile networks', 'vibrant color boards', 'strategic placement grids',
    'demanding sorting corridors', 'intricate puzzle fields', 'minimalist logic layouts',
    'expanding challenge boards', 'clever puzzle arrangements', 'spatial reasoning stages',
    'methodical problem boards', 'layered tile environments', 'calibrated logic fields',
    'rewarding puzzle stages', 'geometric board designs', 'complex alignment grids',
    'dynamic sorting stations', 'engaging puzzle layouts', 'tactical board configurations'
  ],
  sports: [
    'competitive athletic arenas', 'championship tournament fields', 'bustling stadium grounds',
    'intense athletic courts', 'demanding sports pitches', 'high-stakes tournament arenas',
    'crowded soccer stadiums', 'dynamic basketball courts', 'prestigious match venues',
    'energetic athletic complexes', 'challenging tournament fixtures', 'outdoor sporting grounds',
    'premier athletic leagues', 'fast-paced tournament courts', 'vibrant stadium rings',
    'intense competitive pitches', 'classic athletic venues', 'high-tempo sports arenas',
    'demanding tournament circuits', 'strategic playing fields', 'lively match stadiums',
    'premier sporting facilities', 'active tournament stages', 'competitive athletic fields',
    'spirited sporting environments', 'dynamic court settings', 'challenging match fields',
    'prestigious athletic bowls', 'energetic sports grounds', 'focused competition arenas'
  ],
  general: [
    'distinct stage layouts', 'vibrant browser environments', 'demanding obstacle gauntlets',
    'dynamic challenge arenas', 'intricate stage courses', 'multi-tiered platform stages',
    'active interactive sectors', 'demanding hazard rooms', 'engaging arcade courses',
    'perilous obstacle corridors', 'lively interactive maps', 'delicate traversal stages',
    'challenging arcade chambers', 'varied interactive layouts', 'colorful game worlds',
    'fast-paced stage sequences', 'intricate hazard fields', 'rewarding obstacle courses',
    'dynamic stage environments', 'engaging arcade gauntlets', 'sprawling challenge paths',
    'multi-hazard stage zones', 'tight interactive corridors', 'lively challenge fields',
    'creative stage layouts', 'diverse obstacle tracks', 'energetic arcade stages',
    'demanding puzzle-platform rooms', 'vibrant gaming arenas', 'compact obstacle courses'
  ]
};

const GOALS = {
  driving: [
    'reach the finish line', 'navigate complex circuits', 'outpace rival racers', 'master tight drifts',
    'complete checkpoint trials', 'maneuver narrow lanes', 'conquer off-road tracks', 'execute clean passes',
    'preserve vehicle stability', 'thread dense traffic', 'shave lap seconds', 'conquer mountain switchbacks',
    'maintain racing lines', 'pilot nimble vehicles', 'handle powerful cars', 'park within stalls',
    'execute controlled slides', 'climb steep hills', 'maintain forward momentum', 'complete stage trials',
    'steer through intersections', 'master deceleration markers', 'conquer muddy ruts', 'balance raw acceleration',
    'guide precision karts', 'deliver smooth exits', 'tackle stunt ramps', 'park accurately',
    'maintain traction control', 'set course records', 'maneuver high-speed roadsters', 'conquer icy hairpins',
    'pilot tuned racing sedans', 'execute exterior passing runs', 'shave sector seconds', 'maintain uphill engine power',
    'tackle off-camber sections', 'complete endurance stints', 'negotiate winding avenues', 'pilot precision drift cars',
    'thread narrow roadway gaps', 'conquer desert dunes', 'maintain pavement balance', 'maneuver freight haulers',
    'execute sharp 90-degree turns', 'pilot open-wheel vehicles', 'tackle highway viaducts', 'master entrance speed',
    'navigate wet road stretches', 'steer agile compact cars', 'conquer muddy tracks', 'maintain controlled drifts',
    'complete checkpoint circuits', 'pilot powerful muscle cars', 'deliver racing precision'
  ],
  shooting: [
    'eliminate hostile targets', 'hold off enemy waves', 'secure contested zones', 'neutralize sniper threats',
    'clear bunker complexes', 'repel zombie hordes', 'survive intense firefights', 'execute stealthy takedowns',
    'dismantle enemy squads', 'intercept attack waves', 'master recoil control', 'defend perimeter outposts',
    'acquire distant hostiles', 'clear combat corridors', 'eliminate armored bosses', 'survive combat trials',
    'neutralize perimeter sentries', 'deliver clutch headshots', 'coordinate covering fire', 'conquer combat stages',
    'sweep room corners', 'manage tactical reloads', 'break defensive lines', 'track aerial targets',
    'neutralize mechanized units', 'maintain combat readiness', 'repel aggressive rushers', 'secure high ground',
    'defend extraction points', 'achieve marksmanship mastery'
  ],
  puzzle: [
    'untangle spatial arrangements', 'align matching tiles', 'solve grid challenges', 'clear crowded boards',
    'sort diverse elements', 'uncover geometric solutions', 'dismantle block clusters', 'resolve board bottlenecks',
    'deduce component sequences', 'guide pathfinding lines', 'connect circuit nodes', 'clear barrier blocks',
    'organize tile configurations', 'solve brain teasers', 'navigate sliding blocks', 'rearrange jigsaw pieces',
    'balance number sums', 'unravel logic patterns', 'clear cascading gems', 'group identical items',
    'solve rotational paths', 'uncover board clearances', 'maximize score multipliers', 'eliminate grid deadlocks',
    'restore puzzle order', 'deduce hidden coordinates', 'clear boards cleanly', 'match identical symbols',
    'harmonize color spectrums', 'attain solving efficiency'
  ],
  sports: [
    'outscore athletic rivals', 'execute scoring strikes', 'defend the goal', 'orchestrate passing sequences',
    'sink difficult shots', 'win contested battles', 'dominate defensive duels', 'convert scoring opportunities',
    'outmaneuver opponent formations', 'time perfect jumps', 'maintain court possession', 'deliver pinpoint crosses',
    'curve penalty kicks', 'intercept opponent passes', 'pot difficult balls', 'lead tournament squads',
    'block incoming shots', 'shuttle passing plays', 'execute precision shots', 'score buzzer beaters',
    'maintain defensive marking', 'time clean swings', 'win crucial tiebreakers', 'coordinate rapid transitions',
    'dominate athletic matchups', 'control rebound trajectories', 'deliver match-winning goals', 'defend team leads',
    'execute flawless rallies', 'secure tournament trophies'
  ],
  general: [
    'traverse obstacle gauntlets', 'collect scattered bonuses', 'overcome moving hazards', 'navigate dynamic layouts',
    'progress across tiers', 'thread trap corridors', 'conquer platforming challenges', 'time delicate jumps',
    'survive arcade stages', 'discover optimal routes', 'adapt movement momentum', 'reach stage markers',
    'slip past lasers', 'navigate crumbling bridges', 'maneuver tricky hazards', 'conquer moving shafts',
    'dodge falling hazards', 'balance exploration pace', 'solve environmental puzzles', 'guide agile characters',
    'execute frame-perfect dodges', 'reach elevated perches', 'survive speed corridors', 'neutralize roving hazards',
    'conquer obstacle courses', 'thread narrow passages', 'maintain traversal speed', 'collect milestone markers',
    'navigate interactive mazes', 'master movement fundamentals'
  ]
};

const ACTIONS = {
  driving: [
    'steer through turns', 'modulate throttle pressure', 'execute tight drifts', 'align wheels straight',
    'counter-steer quickly', 'feather the accelerator', 'deploy handbrake taps', 'maintain steady acceleration',
    'adjust steering trim', 'shed speed early', 'guide front tires', 'balance throttle inputs',
    'navigate congested lanes', 'stabilize chassis balance', 'execute measured sweeps', 'reverse into bays',
    'carry measured momentum', 'modulate vehicle speed', 'hold consistent steering', 'avoid curb strikes',
    'steer between barriers', 'time throttle application', 'centralize steering quickly', 'maintain road trajectory',
    'thread narrow gaps', 'regulate vehicle momentum', 'execute directional changes', 'position vehicles outer',
    'recover chassis equilibrium', 'keep drive wheels planted', 'modulate accelerator pressure', 'balance brake distribution',
    'maintain steady throttle', 'feather steering inputs', 'shift vehicle weight forward', 'execute progressive throttle',
    'settle vehicle suspension', 'counter lateral slide angles', 'position vehicles cleanly', 'guide drive tires',
    'time downshifts cleanly', 'manage tire adhesion', 'centralize vehicle alignment', 'apply counter-steering inputs',
    'ease off throttle pedal', 'modulate handbrake engagement', 'maintain smooth trajectories', 'control vehicle yaw momentum',
    'deliver progressive braking', 'feather directional controls', 'stabilize chassis dynamics', 'adjust line angles',
    'unwind the steering wheel', 'balance entrance momentum', 'maintain consistent tracking'
  ],
  shooting: [
    'acquire targets accurately', 'maintain crosshair height', 'track moving hostiles', 'deliver controlled bursts',
    'switch firing lanes', 'suppress hostile chokepoints', 'lead moving targets', 'center weapon sights',
    'deploy snap adjustments', 'manage tactical reloads', 'hold defensive sightlines', 'time trigger pulls',
    'flick targeting reticles', 'modulate trigger cadence', 'peek around barricades', 'reposition between cover',
    'track aerial targets', 'coordinate weapon swaps', 'clear room corners', 'maintain target acquisition',
    'neutralize charging foes', 'keep bloom controlled', 'aim for vital zones', 'deliver reactionary fire',
    'control optical zoom', 'sweep secondary sidearms', 'align crosshairs cleanly', 're-engage targets quickly',
    'suppress enemy barricades', 'execute precision takedowns'
  ],
  puzzle: [
    'shift and arrange items', 'swap adjacent tiles', 'evaluate board outcomes', 'rotate geometric pieces',
    'slide puzzle blocks', 'sort mixed components', 'clear barrier blocks', 'trace connection paths',
    'place puzzle fragments', 'isolate bottleneck pieces', 'anticipate gravity drops', 'reposition staging components',
    'scan perimeter rows', 'group identical elements', 'deduce numerical placements', 'deliberate on move economy',
    'dismantle tile formations', 'shift active pieces', 'connect matching endpoints', 'unravel grid deadlocks',
    'align symmetrical patterns', 'clear foundation rows', 'sort items methodically', 'balance immediate moves',
    'solve rotational rings', 'untangle line intersections', 'organize challenge boards', 'coordinate split placements',
    'discover solving shortcuts', 'execute structured plans'
  ],
  sports: [
    'time kicks and passes', 'angle shots cleanly', 'pass into open space', 'intercept ground passes',
    'curve shots around walls', 'time jump headers', 'strip possession cleanly', 'release three-point shots',
    'block penalty kicks', 'distribute quick passes', 'time racket swings', 'maintain proper formation',
    'pot cue balls accurately', 'dribble past defenders', 'execute crisp passes', 'secure rebound positioning',
    'deliver lofted crosses', 'track opponents tightly', 'time slide tackles', 'coordinate goalie positioning',
    'aim drop shots', 'pivot past defenders', 'release quick shots', 'anchor defensive lines',
    'switch play diagonally', 'time spike attempts', 'place curling deliveries', 'execute counter runs',
    'parry dangerous shots', 'close out victories'
  ],
  general: [
    'navigate active sections', 'time jumps cleanly', 'thread rotating blades', 'maintain traversal momentum',
    'execute calculated hops', 'dodge hazard projectiles', 'scale vertical shafts', 'duck beneath obstacles',
    'balance on pathways', 'time rhythmic leaps', 'slip through doors', 'adjust aerial trajectories',
    'guide characters past traps', 'rebound off springboards', 'dash across walkways', 'maneuver hazard rooms',
    'time delicate footwork', 'coordinate wall slides', 'glide across chasms', 'navigate obstacle fields',
    'hop across bubble ledges', 'time sprint bursts', 'leap over boulders', 'maintain character equilibrium',
    'thread clearance corridors', 'avoid bottomless pits', 'conquer climbing sequences', 'time double jumps',
    'steer clear of spikes', 'reach final checkpoints'
  ]
};

const HAZARDS = {
  driving: [
    'sharp road curves', 'tight concrete barricades', 'unpredictable traffic clusters', 'slick asphalt patches',
    'narrow guardrail corridors', 'steep elevation dips', 'slippery gravel surfaces', 'intricate chicane sequences',
    'off-camber downhill curves', 'tight roadway bottlenecks', 'standing water zones', 'perimeter tire walls',
    'dense vehicle scrambles', 'unexpected roadway debris', 'tight hairpin drops', 'uneven camber angles',
    'low-visibility foggy sectors', 'blind corner entries', 'narrow bridge passages', 'high-speed esses',
    'sudden road barricades', 'harsh rumble strips', 'tight warehouse pillars', 'deep run-off traps',
    'fast-closing rival gaps', 'steep banked turns', 'slippery curb markings', 'complex intersection lanes',
    'sudden lane closures', 'intricate stadium turns', 'slippery rain-soaked patches', 'tight cobblestone corners',
    'loose dirt shoulders', 'low-traction sandy stretches', 'sudden speed bumps', 'narrow tunnel walls',
    'abrupt elevation drops', 'unpredictable competitor lines', 'hazardous oil slicks', 'protruding guardrail edges',
    'narrow chokepoints', 'sudden traffic braking', 'demanding multi-apex corners', 'tight loading bay perimeters',
    'heavy crosswinds on bridges', 'unpaved washboard surfaces', 'loose gravel drifts', 'tight radius chicanes',
    'blind crest transitions', 'slippery metal joints'
  ],
  shooting: [
    'advancing enemy attacks', 'entrenched sniper positions', 'incoming grenade blasts', 'relentless undead rushers',
    'armored elite units', 'sudden doorway ambushers', 'hostile machine-gun crossfire', 'narrow corridors',
    'lethal sniper sightlines', 'fast peripheral runners', 'aggressive flanking squads', 'collapsing barrier walls',
    'explosive barrel hazards', 'dark operational shadows', 'heavy suppressing fire', 'relentless swarm attacks',
    'accurate rooftop marksmen', 'tactical flashbang disruptions', 'armored shield infantry', 'hazardous gas corridors',
    'incoming rocket barrages', 'encircling hostile forces', 'tight indoor breaches', 'reinforced enemy encampments',
    'hostile drone strikes', 'deadly perimeter traps', 'unforgiving firefight zones', 'aggressive melee attackers',
    'concealed enemy positions', 'escalating assault pressure'
  ],
  puzzle: [
    'crowded grid spaces', 'stubborn block clusters', 'rigid board borders', 'delicate tile deadlocks',
    'unforgiving move allowances', 'complex barrier blocks', 'awkward piece geometries', 'dense corner congestion',
    'multi-colored clutter', 'confining grid corridors', 'rapidly filling staging', 'unfavorable drop sequences',
    'strict spatial limitations', 'interlocking puzzle pieces', 'ticking puzzle clocks', 'intricate deadlocks',
    'congested board sectors', 'obscured tile matches', 'limited placement windows', 'unbalanced piece distributions',
    'sudden obstacle blocks', 'frozen tile clusters', 'narrow transit lanes', 'unforgiving sorting rules',
    'complex rotational mismatches', 'delicate chain reactions', 'tricky piece orientations', 'cascading board shifts',
    'finite move allowances', 'intricate logic rules'
  ],
  sports: [
    'aggressive opposing defenders', 'swarming defenders', 'tight defensive markings', 'alert goalkeepers',
    'rapid counter-attacks', 'full-court pressing', 'unforgiving shot clocks', 'congested penalty boxes',
    'difficult rim bounces', 'physical turf challenges', 'fast-moving wingers', 'defensive wall setups',
    'challenging bank angles', 'slippery court surfaces', 'organized offside traps', 'heavy box tackles',
    'tight touchline boundaries', 'skilled opponent playmakers', 'contested aerial duels', 'intense overtime pressure',
    'fatigue in late halves', 'unpredictable post deflections', 'aggressive shot-blockers', 'difficult spin serves',
    'tightly packed midfields', 'rapid opponent transitions', 'unforgiving tournament formats', 'high-stakes penalty kicks',
    'skilled baseline opponents', 'competitive match tempo'
  ],
  general: [
    'tight clearance constraints', 'hazardous spinning sawblades', 'bottomless chasm drops', 'lethal floor spikes',
    'swinging pendulum blades', 'disappearing floor platforms', 'moving laser barriers', 'collapsing bridge planks',
    'slippery ice perches', 'rotating mechanical grinders', 'rising magma levels', 'falling rock debris',
    'electric arc hazards', 'moving conveyor currents', 'snapping mechanical traps', 'crushing ceiling blocks',
    'pulsating energy barriers', 'steep slide ramps', 'narrow balancing perches', 'sudden dart traps',
    'unstable bubble footholds', 'unforgiving cycle timing', 'roving patrol hazards', 'gravity inversion shafts',
    'tight jump windows', 'relentless speed corridors', 'bouncy trampoline pads', 'hazardous swamp water',
    'narrow elevated walkways', 'unpredictable moving gauntlets'
  ]
};

const CONTROL_PHRASES = {
  mouseTouch: [
    'mouse clicks', 'touch taps', 'pointer controls', 'direct taps',
    'screen gestures', 'cursor moves', 'touch inputs', 'click commands',
    'finger taps', 'mouse tracking', 'swipe motions', 'pointer inputs',
    'tactile taps', 'mouse aim', 'screen touches', 'touch navigation',
    'drag motions', 'tap interactions', 'cursor guidance', 'pointer clicks',
    'mouse guidance', 'touch swipes', 'direct clicks', 'screen taps',
    'pointer sweeps'
  ],
  keyboard: [
    'arrow keys', 'WASD keys', 'directional arrows', 'keyboard controls',
    'keystroke inputs', 'directional keys', 'keyboard navigation', 'arrow navigation',
    'WASD commands', 'keyboard handling', 'directional taps', 'arrow controls',
    'WASD navigation', 'keyboard presses', 'arrow commands', 'movement controls',
    'directional inputs', 'WASD controls', 'keystroke controls', 'movement keys',
    'arrow keystrokes', 'WASD presses', 'keyboard arrows', 'navigation keys',
    'directional buttons'
  ],
  keyboardMouse: [
    'keys and mouse', 'WASD and pointer', 'arrows and clicks', 'keyboard and clicks',
    'keys and pointer', 'WASD and mouse', 'arrows and pointer', 'keyboard and mouse',
    'keystrokes and clicks', 'directional keys and mouse', 'WASD keys and clicks', 'arrows and mouse'
  ]
};

module.exports = {
  P1_OPENERS,
  P2_OPENERS,
  SETTINGS,
  GOALS,
  ACTIONS,
  HAZARDS,
  CONTROL_PHRASES
};
