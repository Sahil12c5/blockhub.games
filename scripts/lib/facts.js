/**
 * BLOCKHUB.GAMES - FACTS EXTRACTION & GENRE PATTERNS
 * Decodes HTML entities, sanitizes publisher text, extracts concrete facts,
 * and supplies genre-level ground truths when facts are thin.
 */

const { checkBlocklist } = require("./blocklist.js");

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&times;/g, "x")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function cleanText(text) {
  if (!text) return "";
  const decoded = decodeHtmlEntities(text);
  return decoded
    .replace(/<[^>]*>?/gm, " ")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(poki|crazygames|y8|friv|unblocked|gamemonetize)\b/gi, "")
    .replace(/\benter the arena\b/gi, "step into the combat zone")
    .replace(/\bstandout free online (racing )?game\b/gi, "exciting online title")
    .replace(/\bhigh-velocity speed\b/gi, "rapid momentum")
    .replace(/\btesting your skills and strategic execution\b/gi, "testing your tactical timing")
    .replace(/\bzero latency\b/gi, "immediate responsiveness")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectSubgenre(title, category, desc) {
  const combined = `${title} ${desc} ${category}`.toLowerCase();

  if (combined.includes("parking") || combined.includes("park the")) return "parking";
  if (combined.includes("truck") || combined.includes("cargo") || combined.includes("trailer")) return "truck";
  if (combined.includes("drift") || combined.includes("drifting")) return "drift";
  if (combined.includes("bike") || combined.includes("motorcycle") || combined.includes("moto") || combined.includes("quad")) return "moto";
  if (combined.includes("sniper") || combined.includes("headshot") || combined.includes("rifle")) return "sniper";
  if (combined.includes("zombie") || combined.includes("undead")) return "zombie";
  if (combined.includes("fps") || combined.includes("shooter") || combined.includes("gun") || combined.includes("warzone")) return "fps";
  if (combined.includes("stickman") || combined.includes("ragdoll") || combined.includes("stick")) return "stickman";
  if (combined.includes("match 3") || combined.includes("match-3") || combined.includes("bubble")) return "match3";
  if (combined.includes("sort") || combined.includes("sorting") || combined.includes("screw") || combined.includes("nuts")) return "sort";
  if (combined.includes("jigsaw") || combined.includes("puzzle") || combined.includes("brain") || combined.includes("math")) return "puzzle";
  if (combined.includes("football") || combined.includes("soccer") || combined.includes("penalty") || combined.includes("kick")) return "soccer";
  if (combined.includes("basketball") || combined.includes("dunk") || combined.includes("hoop")) return "basketball";
  if (combined.includes("runner") || combined.includes("run") || combined.includes("dash") || combined.includes("obby")) return "runner";
  if (combined.includes("tower defense") || combined.includes("defense") || combined.includes("plants")) return "tower-defense";
  if (combined.includes("idle") || combined.includes("clicker") || combined.includes("tycoon")) return "clicker";
  if (combined.includes("fight") || combined.includes("brawl") || combined.includes("boxing") || combined.includes("combat") || combined.includes("karate")) return "fighter";

  return (category || "Arcade").toLowerCase();
}

const GENRE_FACTS = {
  parking: {
    objectives: [
      "maneuver vehicles through structured layouts and park cleanly into designated bays",
      "guide cars along compact obstacle courses without scraping surrounding barriers",
      "align your tires within marked parking slots while reversing around tight curbs",
      "steer vehicles into narrow stalls while avoiding concrete dividers and posts",
    ],
    hazards: [
      "tight concrete barriers, safety cones, and narrow garage corridors demand precise alignment",
      "blind corners and protruding curbs can clip bumpers if approached with excessive speed",
      "reversing angles become increasingly acute across advanced multi-story garage stages",
      "compact clearance zones leave almost zero margin for steering miscalculations",
    ],
    tactics: [
      "feathering the throttle gently and checking corner clearance avoids costly barrier collisions",
      "switching camera perspectives frequently ensures front and rear tires align cleanly",
      "braking completely before engaging reverse gear prevents accidental momentum drift",
      "patience and steady steering inputs consistently produce top parking ratings",
    ],
  },
  truck: {
    objectives: [
      "transport heavy cargo across challenging highway and rural routes to delivery zones",
      "haul loaded trailers through winding mountain passes without shedding fragile freight",
      "navigate massive commercial vehicles through dense traffic to reach unloading docks",
      "deliver industrial freight on schedule while keeping heavy machinery fully under control",
    ],
    hazards: [
      "heavy vehicle momentum and wide trailer swings increase risk around sharp road bends",
      "steep downhill gradients can overheat brakes if speed is not checked early",
      "narrow rural lanes leave minimal breathing room when passing oncoming traffic",
      "slick roadway surfaces cause sudden loss of traction during rapid deceleration",
    ],
    tactics: [
      "braking early before approaching intersections and swinging wide prevents jackknifing",
      "holding a disciplined speed on downhill slopes preserves steering control",
      "monitoring trailer tracking through side mirrors ensures clean corner clearances",
      "smooth throttle application prevents wheels from spinning on muddy inclines",
    ],
  },
  drift: {
    objectives: [
      "initiate controlled oversteer through tight corners and link scoring drift multipliers",
      "slide high-powered sports cars across serpentine tracks while maintaining angle",
      "chain consecutive drift transitions through sweeping bends to maximize point tallies",
      "pilot customized drift machines through demanding asphalt circuits with flair",
    ],
    hazards: [
      "over-rotating or striking track guardrails immediately breaks your multiplier chain",
      "entering corners with insufficient speed will cause the chassis to straighten prematurely",
      "narrow track runoffs punish delayed counter-steering during rapid switchbacks",
      "uneven pavement transitions can disrupt rear tire grip unexpectedly mid-slide",
    ],
    tactics: [
      "counter-steering smoothly and pulsing the throttle sustains optimal slide momentum",
      "tapping the handbrake slightly before the apex initiates the cleanest drift angle",
      "feathering steering inputs mid-corner keeps the vehicle poised for the next turn",
      "maintaining balanced tire grip improves control over high-speed slide angles",
    ],
  },
  moto: {
    objectives: [
      "navigate steep ramps, rough terrain, and obstacle courses on two wheels",
      "pilot nimble dirt bikes across rugged cross-country tracks to the finish line",
      "balance motorbikes over perilous jumps, wooden scaffolding, and metal containers",
      "complete trials stages swiftly while keeping your rider safely balanced upright",
    ],
    hazards: [
      "severe drop-offs and uneven landing angles can easily unseat your rider",
      "excessive forward lean over jump crests risks violent end-over-end crashes",
      "slippery log bridges and angled boulders test your balance at low speeds",
      "rapid acceleration on steep inclines can cause the front tire to flip backward",
    ],
    tactics: [
      "aligning your wheels parallel to downhill slopes absorbs impact and maintains speed",
      "shifting rider weight backward during takeoff provides maximum elevation",
      "easing off the throttle across washboard bumps maintains consistent tire contact",
      "pre-loading suspension before steep lips yields cleaner flight trajectories",
    ],
  },
  sniper: {
    objectives: [
      "identify mission targets through long-range optics and execute clean precision shots",
      "acquire high-value marks from concealed vantage perches and clear hostile outposts",
      "neutralize guarded threats across sprawling compounds with single-shot accuracy",
      "scout tactical perimeters, adjust zoom magnification, and eliminate hostile snipers",
    ],
    hazards: [
      "moving marks, wind variations, and counter-snipers punish delayed trigger pulls",
      "firing from exposed positions alerts surrounding guards and draws heavy retaliatory fire",
      "limited ammunition magazines leave you defenseless if shots are wasted recklessly",
      "distant objectives obscured by weather haze test your visual acquisition limits",
    ],
    tactics: [
      "scanning elevated rooftops first and leading walking targets ensures single-shot takedowns",
      "reloading between hostile waves prevents getting caught with an empty chamber",
      "holding your breath before breaking the trigger stabilizes reticle sway",
      "prioritizing high-threat radio operators stops reinforcements from being summoned",
    ],
  },
  zombie: {
    objectives: [
      "fend off relentless undead hordes and hold fortified survival perimeters",
      "scavenge vital supplies across infected ruins while repelling aggressive swarms",
      "eliminate mutated walkers and defend barricaded safe zones from breach",
      "survive escalating waves of infected attackers through smart positioning",
    ],
    hazards: [
      "swarming clusters can pin you against walls if you linger in dead-end corridors",
      "fast-running infected and projectile spitters disrupt organized defensive lines",
      "dimly lit corridors hide lurkers until they close into lethal striking distance",
      "running dry on ammunition mid-wave forces dangerous sprints through open territory",
    ],
    tactics: [
      "circling the perimeter in wide loops and targeting headshots conserves vital ammunition",
      "saving explosive ordnance and environmental hazard traps for dense mobs maximises kills",
      "prioritizing fast-running variants prevents defensive pockets from crumbling",
      "reloading while backpedaling keeps an active safety buffer between you and the horde",
    ],
  },
  fps: {
    objectives: [
      "neutralize hostile combatants across dynamic corridors and secure objectives",
      "clear structured combat sectors alongside squad mates using cover mechanics",
      "infiltrate enemy territory, breach fortified rooms, and extract mission data",
      "dominate fast-paced tactical skirmishes through sharp reticle reflexes",
    ],
    hazards: [
      "uncovered sightlines and sudden flanking maneuvers leave players open to crossfire",
      "choke point doorways and high vantage angles favor entrenched defenders",
      "aggressive grenade throws can flush you out of previously secure masonry cover",
      "slow reload animations leave you vulnerable if initiated out in the open",
    ],
    tactics: [
      "slicing corners methodically and reloading only behind solid cover preserves your life",
      "keeping reticles pre-aimed at chest height reduces reaction time in room breaches",
      "listening for enemy footsteps reveals incoming flanking paths early",
      "using flash utility before entering blind corners disorients waiting opponents",
    ],
  },
  stickman: {
    objectives: [
      "guide a stickman fighter through martial arts clashes and agility trials",
      "command stylized stick warriors in duels against rival combatants",
      "navigate acrobatic stick figures across lethal obstacle courses filled with traps",
      "unleash fluid martial arts combos to triumph over waves of stick adversaries",
    ],
    hazards: [
      "rapid enemy strikes and erratic ragdoll physics create unpredictable combat scenarios",
      "environmental spikes, falling blades, and swinging pendulums punish mistimed hops",
      "swarming enemy fighters can trap your avatar in endless stagger animations",
      "narrow platforms require pinpoint landings to avoid fatal falls into the abyss",
    ],
    tactics: [
      "studying opponent telegraph animations lets you time defensive blocks and heavy counter-hits",
      "alternating light jabs with sweeping low kicks breaks through opponent guards",
      "using wall-jump momentum allows you to bypass crowded ground choke points",
      "saving special meter bars for multi-adversary confrontations clears the arena fast",
    ],
  },
  match3: {
    objectives: [
      "swap adjacent tiles to form matching rows of three or more identical symbols",
      "clear colored board pieces systematically to complete target stage objectives",
      "trigger cascading chain reactions by aligning high-value gem combinations",
      "solve vibrant grid puzzles within allocated move limits to conquer new stages",
    ],
    hazards: [
      "finite move limits and locked board tiles require thoughtful spatial planning",
      "stone blockers and chained pieces cut off active board flow across central columns",
      "making hasty top-row moves often wastes valuable turns without triggering cascades",
      "unfavorable initial tile distributions test your ability to engineer combo openings",
    ],
    tactics: [
      "focusing matches on the lower rows triggers cascading combos that clear wide board sections",
      "combining two adjacent special power-ups unleashes massive quadrant-clearing blasts",
      "prioritizing objective tiles over random matches preserves precious move counters",
      "surveying the entire board before committing a turn reveals hidden 4-in-a-row opportunities",
    ],
  },
  sort: {
    objectives: [
      "organize colored elements and scattered items into matching collection containers",
      "separate mixed puzzle pieces systematically until every holder holds uniform elements",
      "transfer liquid or solid layers between test tubes to solve color sorting logic",
      "clear crowded bottleneck trays by grouping identical items into organized sets",
    ],
    hazards: [
      "crowded holder slots can create irreversible deadlocks if items are moved hastily",
      "burying an essential color beneath another piece locks future moves across that column",
      "limited temporary storage receptacles restrict shuffling options on higher tiers",
      "prematurely committing items before calculating secondary drops causes fatal jams",
    ],
    tactics: [
      "keeping at least one buffer slot open and consolidating one item group at a time avoids traps",
      "calculating two steps ahead ensures transferring a piece does not isolate an underlying item",
      "working from the most congested containers first opens up valuable maneuvering space",
      "resetting the layout promptly if a dead end is reached saves time on complex stages",
    ],
  },
  puzzle: {
    objectives: [
      "decipher mechanical riddles, manipulate pieces, and reveal sequential paths",
      "solve progressive brain teasers by analyzing interactive board elements and switches",
      "rearrange spatial tiles and activate mechanisms to guide objects to goal markers",
      "unravel multi-stage logic challenges through methodical trial and deduction",
    ],
    hazards: [
      "multi-stage logic locks and tricky spatial configurations punish uncalculated moves",
      "one-way gates and pressure plates can seal off intended routes if triggered prematurely",
      "misinterpreting environmental symbol clues leads down incorrect puzzle branches",
      "complex interlocking gears require precise rotational sequencing to activate",
    ],
    tactics: [
      "surveying the entire puzzle mechanism before acting helps you reverse-engineer the solution",
      "breaking multi-layer puzzles down into independent mini-steps simplifies execution",
      "taking advantage of undo options lets you test prospective hypotheses without penalty",
      "noticing subtle color-coded pathways highlights intended structural alignments",
    ],
  },
  soccer: {
    objectives: [
      "outmaneuver opposing defensive lines and curl accurate shots past the goalkeeper",
      "execute pinpoint crossing passes and volley the ball into the top corner netting",
      "dribble past rival defenders and test the opposing keeper with low driven strikes",
      "coordinate team attack sequences and convert scoring chances from inside the box",
    ],
    hazards: [
      "alert defensive backs and agile keepers cut down open shooting angles rapidly",
      "tight offside traps and aggressive tackling backlines limit your shooting windows",
      "shifting wind angles and diving goalkeepers make clean shots harder to place",
      "stout defensive formations force you to look for narrow passing corridors",
    ],
    tactics: [
      "timing kick power gauges in the sweet spot and applying side-spin bends shots into corners",
      "holding off defenders before unleashing shots creates the space needed to score",
      "passing to open teammates on the flanks stretches compact central defenses",
      "faking shots with quick ball cuts throws sliding defenders off balance",
    ],
  },
  basketball: {
    objectives: [
      "calibrate shooting trajectories to sink consecutive swishes through the basket",
      "time elevation jump shots cleanly over outstretched defensive fingertips",
      "execute dynamic dribble drives toward the paint and finish with rim-rattling dunks",
      "rack up shooting streak multipliers by dropping balls through the net from downtown",
    ],
    hazards: [
      "contested defensive blocks and moving backboards alter clean shooting arcs",
      "tight shot clocks induce rushed releases that clang off back rims",
      "physical interior post defenders disrupt driving layups with heavy body contact",
      "drifting side-to-side during release pulls shooting trajectories off center",
    ],
    tactics: [
      "releasing the ball at the apex of the jump arc maximizes shot probability and streak bonuses",
      "using pump fakes draws over-eager defenders into the air, opening uncontested lanes",
      "tracking ball bounce angles off the rim lets you secure offensive rebounds consistently",
      "finding a steady shooting rhythm elevates percentage accuracy beyond the arc",
    ],
  },
  runner: {
    objectives: [
      "sprint along obstacle-laden tracks while dodging hazards and collecting route bonuses",
      "guide athletic avatars through endless corridors filled with hurdles, barriers, and turns",
      "leap over gaping chasms and slide beneath low barricades at accelerating velocities",
      "navigate high-speed parkour trails across urban rooftops and forest paths",
    ],
    hazards: [
      "speed ramps and sudden barricades give you only split seconds to execute lane changes",
      "blind corners hide sudden pit drops that require instant upward leaps",
      "overlapping obstacles like low fences placed right after high walls test reflex speed",
      "tunnel vision on score tokens can lure runners directly into fatal collision courses",
    ],
    tactics: [
      "looking several hurdles ahead rather than at your avatar gives you time to time your leaps",
      "defaulting to center track lanes keeps both left and right escape routes open",
      "using short taps for small hops and sustained holds for long leaps preserves landing control",
      "memorizing repeating obstacle sequences builds instinctive muscle memory over time",
    ],
  },
  "tower-defense": {
    objectives: [
      "position defensive towers strategically along pathways to stop incoming enemy waves",
      "erect an impenetrable network of ballistic, energy, and slowing turrets",
      "safeguard core territorial bases against diverse waves of attacking military units",
      "optimize defensive turret networks to eliminate armored creep forces before exit portals",
    ],
    hazards: [
      "armored creep types and fast scout swarms exploit weaknesses in defensive coverage",
      "airborne fliers bypass ground maze pathing and fly directly toward base targets",
      "elemental immunities render certain damage types useless against specific boss waves",
      "finite resource gold makes overspending on redundant base towers a risky pitfall",
    ],
    tactics: [
      "combining slowing towers with heavy area-of-effect artillery creates deadly choke points",
      "clustering primary damage units around switchbacks exposes enemies to multiple volleys",
      "investing in high-tier towers yields far superior damage per coin than spamming weak turrets",
      "checking upcoming wave previews allows proactive adjustments to tower damage types",
    ],
  },
  clicker: {
    objectives: [
      "tap to harvest resources and scale up compounding automated production facilities",
      "generate exponential wealth by scaling tiered multipliers and industrial generators",
      "click rapidly to build capital reserves and automate revenue across corporate branches",
      "manage capital investments wisely to trigger compounding passive revenue surges",
    ],
    hazards: [
      "escalating development costs slow down progress unless passive revenue is balanced wisely",
      "over-focusing on manual tap power becomes inefficient as automated tiers scale",
      "inflationary milestones stall output if prestige multipliers are delayed too long",
      "misallocating capital into low-multiplier nodes delays key tier breakthroughs",
    ],
    tactics: [
      "reinvesting early profits directly into passive generators yields compounding exponential growth",
      "timing prestige resets when bonus multiplier thresholds double baseline earnings speeds progression",
      "triggering temporary frenzy boosts when all passive facilities run at peak multiplies rewards",
      "targeting major milestone markers grants valuable percentage-based passive bonuses",
    ],
  },
  fighter: {
    objectives: [
      "trade martial strikes with tough rivals inside the ring to deplete their life gauge",
      "execute fluid martial combos and counter-attacks against aggressive combatants",
      "duck, parry, and strike decisively to claim championship belts in tournament brawls",
      "master diverse fighter arsenals featuring heavy sweeps, aerial kicks, and quick jabs",
    ],
    hazards: [
      "aggressive opponent combo chains can trap you in the corner if you fail to block",
      "whiffing heavy attacks leaves extended recovery frames where enemies punish easily",
      "unpredictable enemy grapples bypass standard standing block stances",
      "depleting stamina through reckless swinging prevents timely evasive dashes",
    ],
    tactics: [
      "baiting missed heavy punches and retaliating with quick combo starters controls the round",
      "mixing up high strikes and low sweep attacks keeps opposing defenses off balance",
      "dashing backward out of corner pressure resets combat spacing to your advantage",
      "observing rival wind-up animations provides the tell needed to execute clean parries",
    ],
  },
  racing: {
    objectives: [
      "pilot high-performance vehicles along winding circuits and cross the finish line in first",
      "accelerate down asphalt tracks, navigate chicanes, and draft past rival racers",
      "master tight apex cornering to post record lap times across competitive championships",
      "control tuned racing cars through rainy streets and desert raceways to victory",
    ],
    hazards: [
      "tight chicanes, rival traffic, and loss of traction test vehicle handling limits",
      "braking too late into hairpin corners sends cars skidding wide into gravel traps",
      "aggressive competitor collisions can spin vehicles out during high-speed straights",
      "oil slicks and wet track patches severely degrade braking efficiency",
    ],
    tactics: [
      "braking before corner entry and accelerating through the apex produces fastest lap splits",
      "drafting closely behind lead vehicles reduces aerodynamic drag for straightaway passes",
      "feathering steering inputs prevents tires from scrubbing off valuable forward momentum",
      "choosing optimal racing lines preserves speed through linked S-curve sequences",
    ],
  },
  arcade: {
    objectives: [
      "navigate dynamic arcade stages, overcome obstacle courses, and rack up high scores",
      "guide colorful characters through inventive trials filled with collectible bonuses",
      "react swiftly to shifting stage hazards while completing sequential challenge targets",
      "tackle energetic arcade missions that test your hand-eye coordination and timing",
    ],
    hazards: [
      "speeding hazards, shifting platforms, and reactive obstacles demand steady concentration",
      "accelerating stage timers push players into hasty, uncalculated errors",
      "erratic bouncing hazards require split-second evasive adjustments",
      "deceptive platform placements test your spatial depth perception",
    ],
    tactics: [
      "observing repetitive hazard cycles allows you to move safely during clear intervals",
      "prioritizing safe positioning over risky bonus item pickups keeps runs alive longer",
      "establishing a steady input cadence helps navigate tightly clustered obstacles",
      "replaying early segments hones the muscle memory required for later boss stages",
    ],
  },
};

function parseControlsFromHowTo(howToPlay, subgenre, category, rawDesc = "") {
  const cleaned = cleanText(howToPlay);
  const rows = [];

  const catLower = (category || "").toLowerCase();
  const subLower = (subgenre || "").toLowerCase();
  const isVehicle = ["car", "parking", "truck", "drift", "racing", "moto"].some(
    (k) => subLower.includes(k) || catLower.includes(k)
  );
  const isShooter =
    ["fps", "sniper", "shooter", "zombie"].some((k) => subLower.includes(k)) ||
    catLower === "shooting";
  const isPuzzle =
    ["puzzle", "match3", "sort", "merge"].some((k) => subLower.includes(k)) ||
    catLower === "puzzle";
  const isRunner = subLower.includes("runner") || subLower.includes("obby");
  const isSports =
    ["soccer", "football", "basketball"].some((k) => subLower.includes(k)) ||
    catLower === "sports";
  const isClicker = subLower.includes("clicker") || subLower.includes("idle");
  const isFighter =
    subLower.includes("fighter") ||
    subLower.includes("combat") ||
    subLower.includes("stickman");

  // Check explicit real inputs from instructions if present
  const dashPairs = [
    ...cleaned.matchAll(
      /([A-Z0-9\s/]+)\s*[-:]\s*([a-zA-Z\s,]+)(?=[A-Z0-9\s/]+[-:]|$)/g
    ),
  ];
  if (dashPairs.length >= 2 && !cleaned.toLowerCase().includes("to play")) {
    for (const match of dashPairs.slice(0, 5)) {
      const k = match[1].trim();
      const a = match[2].trim();
      if (k.length > 0 && k.length < 25 && a.length > 2 && a.length < 60) {
        if (!isShooter && /\b(aim|shoot|target|fire)\b/i.test(a)) continue;
        rows.push({
          key: k.toUpperCase(),
          action: a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(),
        });
      }
    }
  }

  // If real controls text explicitly specified valid rows, ensure mobile row and return
  if (rows.length >= 3) {
    if (
      !rows.some(
        (r) =>
          r.key.toLowerCase().includes("touch") ||
          r.key.toLowerCase().includes("mobile")
      )
    ) {
      rows.push({
        key: "Touch / Mobile",
        action: isPuzzle
          ? "Tap and drag pieces directly on screen"
          : "On-screen virtual controls",
      });
    }
    return rows;
  }

  // Generate game-type specific controls (NEVER generic rows!)
  if (isVehicle) {
    if (subLower === "parking") {
      rows.push({ key: "WASD / Arrow Keys", action: "Steer, accelerate, and reverse vehicle" });
      rows.push({ key: "Spacebar", action: "Engage handbrake for sharp maneuvering and full stops" });
      rows.push({ key: "C Key", action: "Toggle camera perspective to inspect parking clearances" });
      rows.push({ key: "Touch / Mobile", action: "Virtual steering wheel and accelerator/brake pedals" });
    } else if (subLower === "drift") {
      rows.push({ key: "WASD / Arrow Keys", action: "Accelerate, steer, and counter-steer through corners" });
      rows.push({ key: "Spacebar", action: "Initiate handbrake drift and break rear tire traction" });
      rows.push({ key: "Shift", action: "Activate nitro boost down straightaways" });
      rows.push({ key: "Touch / Mobile", action: "On-screen steering buttons and handbrake tap icon" });
    } else if (subLower === "truck") {
      rows.push({ key: "WASD / Arrow Keys", action: "Drive forward, steer trailer, and brake" });
      rows.push({ key: "Spacebar", action: "Apply emergency air brakes for heavy cargo momentum" });
      rows.push({ key: "C Key", action: "Switch between cabin and third-person trailer views" });
      rows.push({ key: "Touch / Mobile", action: "Virtual steering wheel and throttle pedals" });
    } else if (subLower === "moto") {
      rows.push({ key: "W / S or Up / Down", action: "Accelerate forward and apply brakes" });
      rows.push({ key: "A / D or Left / Right", action: "Tilt rider forward and backward to maintain balance" });
      rows.push({ key: "Spacebar", action: "Bunny hop over low hurdles and track gaps" });
      rows.push({ key: "Touch / Mobile", action: "On-screen lean arrows and throttle buttons" });
    } else {
      rows.push({ key: "WASD / Arrow Keys", action: "Accelerate, brake, and steer along the track" });
      rows.push({ key: "Spacebar", action: "Engage handbrake to initiate corner slides" });
      rows.push({ key: "Shift", action: "Trigger nitro boost on straightaways" });
      rows.push({ key: "Touch / Mobile", action: "Virtual steering and pedal controls" });
    }
  } else if (isShooter) {
    rows.push({ key: "WASD / Arrow Keys", action: "Navigate character and strafe between cover" });
    rows.push({ key: "Mouse Move", action: "Aim reticle and survey the surroundings" });
    rows.push({ key: "Left Click", action: "Fire primary weapon" });
    rows.push({ key: "Right Click / Spacebar", action: "Aim down sights (ADS) or jump over obstacles" });
    rows.push({ key: "R Key", action: "Reload weapon ammunition magazine" });
    rows.push({ key: "Touch / Mobile", action: "Virtual movement analog stick and on-screen fire buttons" });
  } else if (isRunner) {
    rows.push({ key: "A / D or Left / Right", action: "Switch running lanes to dodge oncoming barriers" });
    rows.push({ key: "W / Up Arrow / Spacebar", action: "Leap over hurdles and track pits" });
    rows.push({ key: "S / Down Arrow", action: "Slide beneath low-hanging obstacles" });
    rows.push({ key: "Touch / Mobile", action: "Swipe left/right to change lanes; swipe up to jump and down to slide" });
  } else if (isPuzzle) {
    rows.push({ key: "Left Click / Mouse Drag", action: "Select, drag, and position puzzle elements" });
    rows.push({ key: "R Key", action: "Reset the current stage layout to try an alternative route" });
    rows.push({ key: "U / Spacebar", action: "Undo previous move or rotate selected piece" });
    rows.push({ key: "Touch / Mobile", action: "Tap and drag items directly on touch displays" });
  } else if (isSports) {
    rows.push({ key: "WASD / Arrow Keys", action: "Position player and set run trajectory" });
    rows.push({ key: "Spacebar / Action Key", action: "Charge shot power meter or pass to teammates" });
    rows.push({ key: "Shift", action: "Sprint for quick bursts of speed" });
    rows.push({ key: "Touch / Mobile", action: "Swipe toward goal or hoop to control shot arc and velocity" });
  } else if (isClicker) {
    rows.push({ key: "Left Click", action: "Click repeatedly to generate base currency and resources" });
    rows.push({ key: "Mouse Cursor", action: "Navigate production menus and buy automated generators" });
    rows.push({ key: "Touch / Mobile", action: "Tap screen rapidly to gather items and activate boosts" });
  } else if (isFighter) {
    rows.push({ key: "A / D or Left / Right", action: "Advance, retreat, and maintain combat spacing" });
    rows.push({ key: "W / Spacebar", action: "Jump or evade low sweeping strikes" });
    rows.push({ key: "J / Primary Attack", action: "Execute light strikes and combo openers" });
    rows.push({ key: "K / Heavy Attack", action: "Unleash heavy attacks or special abilities" });
    rows.push({ key: "Touch / Mobile", action: "Virtual movement pad and on-screen strike buttons" });
  } else {
    rows.push({ key: "A / D or Left / Right", action: "Move character horizontally across the stage" });
    rows.push({ key: "Spacebar / Up Arrow", action: "Jump across gaps and scale elevated platforms" });
    rows.push({ key: "Shift / Action Key", action: "Sprint or trigger character ability" });
    rows.push({ key: "Touch / Mobile", action: "On-screen directional arrows and jump button" });
  }

  return rows;
}

function extractRealDetails(rawDesc, rawHowTo, title, category, subgenre) {
  const desc = cleanText(rawDesc || "");
  const howTo = cleanText(rawHowTo || "");

  // Extract clean sentences from publisher text that describe actual gameplay
  const sentences = desc
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => {
      if (s.length < 20 || s.length > 180) return false;
      const lower = s.toLowerCase();
      if (
        lower.includes("click to play") ||
        lower.includes("subscribe") ||
        lower.includes("visit our") ||
        lower.includes("html5 game") ||
        lower.includes("free online") ||
        lower.includes("unblocked") ||
        lower.includes("poki") ||
        lower.includes("crazygames") ||
        checkBlocklist(s).length > 0
      ) {
        return false;
      }
      return true;
    });

  return {
    hasDetails: sentences.length > 0,
    sentences,
    howTo,
    desc,
  };
}

function extractGameFacts(game, offset = 0) {
  const rawTitle = game.title || "";
  const title = decodeHtmlEntities(rawTitle).trim();
  const rawDesc = cleanText(game.raw_description || game.description || "");
  const rawHowTo = cleanText(game.raw_how_to || game.howToPlay || "");
  const category = (game.category || "Arcade").trim();
  const subgenre = detectSubgenre(title, category, rawDesc);

  const wordCount = rawDesc.split(/\s+/).filter(Boolean).length;
  const isThinFacts = rawDesc.length < 60 || wordCount < 10;

  // Retrieve ground truth facts with hashing for massive subgenre diversity
  const genreData =
    GENRE_FACTS[subgenre] ||
    GENRE_FACTS[category.toLowerCase()] ||
    GENRE_FACTS.arcade;
  const hash = Math.abs(
    (title.charCodeAt(0) || 1) * 31 +
      title.length * 7 +
      (game.slug.charCodeAt(1) || 3) * 13 +
      offset * 5
  );

  const genreKnowledge = {
    objective: Array.isArray(genreData.objectives)
      ? genreData.objectives[hash % genreData.objectives.length]
      : genreData.objective ||
        "navigate interactive stages and complete core objectives",
    hazard: Array.isArray(genreData.hazards)
      ? genreData.hazards[(hash + 1) % genreData.hazards.length]
      : genreData.hazard ||
        "dynamic obstacles and course constraints test your reflexes",
    tactics: Array.isArray(genreData.tactics)
      ? genreData.tactics[(hash + 2) % genreData.tactics.length]
      : genreData.tactic ||
        "careful observation and disciplined timing preserve your momentum",
  };

  const controls = parseControlsFromHowTo(rawHowTo, subgenre, category, rawDesc);
  const realDetails = extractRealDetails(rawDesc, rawHowTo, title, category, subgenre);

  return {
    hasSufficientInfo: true,
    isThinFacts,
    title,
    rawTitle,
    slug: game.slug,
    category,
    subgenre,
    rawDesc,
    rawHowTo,
    genreKnowledge,
    controls,
    realDetails,
  };
}

module.exports = {
  decodeHtmlEntities,
  cleanText,
  detectSubgenre,
  GENRE_FACTS,
  parseControlsFromHowTo,
  extractRealDetails,
  extractGameFacts,
};
