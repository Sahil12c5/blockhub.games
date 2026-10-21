const fs = require('fs');
const path = require('path');

function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const runs = new Set();
  for (let i = 0; i <= words.length - 6; i++) {
    runs.add(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

function build50UniqueSentences(genre, pNum) {
  const sents = [];
  
  if (genre === 'driving' && pNum === 1) {
    const subjects = [
      'Maintaining steady apex tracking', 'Anticipating rapid elevation dips', 'Scanning distant roadway horizons',
      'Smoothly releasing the steering lock', 'Patience behind stubborn traffic clusters', 'Disciplined deceleration reference points',
      'Observing road friction transitions', 'Reading banking camber angles', 'Holding balanced vehicle equilibrium',
      'Treating curb strikes with caution', 'Carrying measured cornering velocity', 'Defensive positioning into hairpins',
      'Continuous visual scanning down straights', 'Rhythmic throttle application through chicanes', 'Modulating engine power over crests',
      'Allowing vehicle suspension to settle', 'Calibrating deceleration zones accurately', 'Tracking vehicle lateral slip angles',
      'Exercising restraint in tight chicanes', 'Staying relaxed behind steering controls', 'Recognizing tire adhesion thresholds',
      'Planning clean passing lines in advance', 'Giving rival cars sufficient clearance', 'Managing vehicle inertia through turns',
      'Focusing on smooth steering returns', 'Analyzing competitor racing line flaws', 'Monitoring track boundary rumble strips',
      'Keeping steering adjustments minimal', 'Balancing courage with technical prudence', 'Paying attention to engine torque peaks',
      'Mastering trail-braking corner entries', 'Understanding course geometric layout', 'Staying patient behind defensive racers',
      'Developing acute spatial track intuition', 'Trusting established deceleration markers', 'Adjusting lines around track debris',
      'Balancing attack angles with coverage', 'Reading subtle steering resistance changes', 'Focusing on consistent lap execution',
      'Recognizing when chassis is fully loaded', 'Utilizing the entire paved track width', 'Maintaining composure when challenged closely',
      'Scanning beyond immediate front bumpers', 'Understanding high-speed downforce limits', 'Refining brake pedal release speed',
      'Treating high-speed curves with respect', 'Exercising calm judgment in opening laps', 'Maintaining disciplined focus during stints',
      'Developing deep vehicular physics empathy', 'Achieving harmony between throttle and steer'
    ];
    const actions = [
      'ensures drivers keep their tires securely planted', 'prevents sudden chassis instability across transitions',
      'allows vehicles to accelerate cleanly toward straights', 'eliminates unnecessary tire scrub down high-speed runs',
      'guarantees predictable handling throughout technical complexes', 'maintains continuous forward momentum through curves',
      'prevents catastrophic spinouts on slippery asphalt patches', 'keeps vehicle weight evenly distributed across wheels',
      'delivers clinical cornering precision without losing speed', 'protects vehicle suspension geometry from harsh shocks',
      'turns difficult off-camber sections into passing zones', 'secures earned track positions against persistent rivals',
      'provides the reaction time needed for sudden road incidents', 'stabilizes vehicular dynamics through sudden direction shifts',
      'prevents unsettling tire contact patches over blind crests', 'allows drivers to carve textbook arcs through every corner',
      'prevents costly overshoots into deep gravel run-off traps', 'maintains maximum tire contact with paved asphalt surfaces',
      'prevents destructive side contact during close pack racing', 'keeps vehicle handling predictable and remarkably responsive',
      'ensures drivers never exceed available mechanical road grip', 'unlocks rapid overtaking opportunities along connecting straights',
      'preserves vehicle integrity over demanding endurance stints', 'creates exceptionally smooth and fluid racing trajectories',
      'eliminates snap oversteer when exiting slow-speed turns', 'creates effortless avenues for clean and decisive passes',
      'ensures every maneuver respects competitive circuit boundaries', 'reduces aerodynamic drag and scrub along fast straightaways',
      'allows racers to push limits without crossing into disaster', 'delivers optimal acceleration bursts out of tight corners',
      'allows front tires to bite deeply into technical hairpins', 'straightens out complex curves to carry superior speed',
      'creates openings when rival tires inevitably begin to overheat', 'allows drivers to sense track limits instinctively without error',
      'prevents indecision from causing missed corner apex targets', 'keeps tires completely free from punctures and unexpected slips',
      'secures earned track positions against aggressive competitors', 'provides immediate feedback regarding active road friction',
      'produces superior long-term finishing records across seasons', 'prevents counter-productive steering corrections mid-corner',
      'minimizes turning radius and reduces lateral cornering strain', 'prevents unforced errors during intense wheel-to-wheel duels',
      'reveals upcoming roadway slowdowns with valuable warning time', 'prevents overestimating available grip in high-speed turns',
      'turns difficult deceleration zones into massive performance gains', 'prevents suspension shocks from unsettling the vehicle chassis',
      'ensures clean survival through hectic opening corner scrambles', 'prevents driver fatigue from degrading split-second timing',
      'turns challenging circuits into masterclasses of driving art', 'unlocks the true peak performance potential of every vehicle'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'driving' && pNum === 2) {
    const subjects = [
      'Smooth manipulation of the steering wheel', 'Measured accelerator pedal modulation', 'Progressive application of braking force',
      'Quick counter-steering input adjustments', 'Surgical handbrake engagement taps', 'Rhythmic throttle tapping through hairpins',
      'Deliberate digital key or thumb adjustments', 'Temporary throttle lift-off maneuvers', 'Coordinating steering with brake releases',
      'Smooth keyboard directional taps', 'Feathering the gas pedal on wet roads', 'Quickly centralizing steering at corner exits',
      'Delicate simultaneous brake and turn touches', 'Steady gamepad or wheel steering sweeps', 'Staged emergency deceleration inputs',
      'Coordinating throttle release with turn-in', 'Fine-tuning steering angles through bends', 'Deploying handbrake taps with precision',
      'Executing gentle steering trims at high speed', 'Modulating brake pedal pressure downhill', 'Smooth directional inputs over dips',
      'Balancing steering angle against road velocity', 'Coordinating gear shifts at torque peaks', 'Applying light steering resistance in wind',
      'Holding steady acceleration through sweepers', 'Executing rapid flick transitions in chicanes', 'Disciplined throttle roll-on from starts',
      'Releasing steering lock smoothly on exits', 'Nuanced directional adjustments along narrow track boundaries', 'Coordinating emergency braking with swerves',
      'Applying measured throttle pulses during drifts', 'Managing brake bias through balanced pressure', 'Smooth transitions from braking to gas',
      'Delicate touch on directional steering controls', 'Executing progressive throttle increases', 'Holding consistent steering lock in circles',
      'Coordinating reverse maneuvers with mirrors', 'Managing high-speed stability through cadence', 'Feathering brakes while turning toward apexes',
      'Applying steady throttle through steep climbs', 'Executing rapid directional inputs in traffic', 'Balancing pedal modulation against lockups',
      'Smoothly releasing handbrake during drifts', 'Fine-tuning steering trim on straightaways', 'Coordinating throttle let-off with evasions',
      'Managing lateral cornering forces with poise', 'Applying gentle counter-steering pressure', 'Executing deliberate control input sequences',
      'Modulating throttle output during race starts', 'Mastering exact input timing and control'
    ];
    const actions = [
      'keeps vehicles centered within optimal traction corridors', 'prevents wheel spin from compromising straight-line acceleration',
      'ensures front tires retain directional bite without skidding', 'catches rear axle slides before cars spin into perimeter walls',
      'allows for controlled drifts around tight urban hairpin turns', 'maintains engine momentum without overpowering road tire adhesion',
      'allows drivers to carve micro-adjustments along narrow bridges', 'transfers chassis weight forward for immediate cornering grip',
      'prevents unsettling vehicle equilibrium during switchbacks', 'provides nuanced directional adjustments without instability',
      'ensures tires maintain continuous electrical or road traction', 'allows full engine power to propel vehicles forward cleanly',
      'avoids exceeding the dynamic limits of the traction circle', 'keeps vehicles planted securely along sweeping banked curves',
      'prevents destructive front-end impacts with course barriers', 'induces helpful chassis rotation into tight technical apexes',
      'eliminates scrubbing speed against outside tire shoulders', 'enables rapid 180-degree turnarounds in compact parking bays',
      'preserves aerodynamic stability and terminal roadway speed', 'prevents overheating brake friction pads on mountain descents',
      'prevents sharp weight transfers that unsettle tires over dips', 'prevents front-end push into external retaining walls',
      'ensures uninterrupted acceleration runs down long straights', 'prevents gusting crosswinds from altering vehicle trajectory',
      'keeps vehicle chassis firmly pressed against the road surface', 'allows agile cars to dart through tight obstacle chicanes',
      'prevents aggressive wheel hop when launching from starting gates', 'allows tires to maximize forward tractive propulsion effort',
      'provides dependable vehicle stability through complex warehouse loading zones', 'clears unexpected road blockades safely without spinouts',
      'keeps turbocharged engines on boost through lengthy drift arcs', 'keeps rear tires tracking straight under heavy stopping loads',
      'preserves continuous vehicular momentum through medium curves', 'prevents rapid tire wear and keeps high-speed driving stable',
      'eliminates dangerous mid-corner oversteer snaps on exit', 'ensures predictable exit trajectory timing out of roundabouts',
      'guarantees flawless parking bay alignment on the first attempt', 'prevents tank-slapper oscillations on two-wheeled motorbikes',
      'helps tuck vehicle noses cleanly toward inside apex markers', 'prevents engine bogging and maintains strong climbing speed',
      'allows nimble vehicles to weave cleanly through dense traffic', 'preserves vital steering maneuverability during sudden stops',
      'keeps vehicle momentum traveling smoothly in the intended path', 'ensures straight tracking without unnecessary tire scrub',
      'avoids catastrophic collisions with stationary course hazards', 'keeps high-center-of-gravity trucks firmly upright in turns',
      'stabilizes two-wheeled machines through rapid lean transitions', 'prevents panic-driven button mashing during sudden incidents',
      'delivers immediate forward drive ahead of rival competitors', 'ensures every vehicular response feels crisp and fully controlled'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'shooting' && pNum === 1) {
    const subjects = [
      'Maintaining optical scope crosshair discipline', 'Coordinating cover-to-cover bounding maneuvers', 'Tracking adversary weapon reload intervals',
      'Suppressing hostile combat firing emplacements', 'Securing fortified high-ground perches', 'Isolating enemy combat groups methodically',
      'Peeking around corner angles with minimal profile', 'Managing operational tempo during firefights', 'Holding defensive chokepoints with overlapping fire',
      'Scanning elevated sniper perches frequently', 'Targeting high-priority threats first', 'Executing disciplined tactical withdrawals under fire',
      'Engaging moving hostile targets with lead distance', 'Advancing along low-exposure transit corridors', 'Holding fortified trench lines against charges',
      'Sweeping across contested industrial zones', 'Anticipating adversary flanking routes', 'Rotating between protective barricades regularly',
      'Engaging hostile units from maximum effective range', 'Coordinating methodical room breach sequences', 'Surveying distant combat sectors through optics',
      'Neutralizing aggressive strike teams at mid-range', 'Securing vital extraction zones cleanly', 'Defending command outposts against enemy rushes',
      'Tracking movement signatures through smoke screens', 'Coordinating tactical cover fire with squadmates', 'Methodical sightline scanning along walls',
      'Maintaining structured squad spacing under fire', 'Prioritizing dangerous heavy weapon targets', 'Clear communication of enemy contact vectors',
      'Securing tactical bottlenecks with crossfires', 'Engaging hostile infantry with calculated volleys', 'Holding fortified barricades with steady nerves',
      'Anticipating adversary counter-attacks in advance', 'Sweeping through smoke-filled corridors with care', 'Establishing interlocking fields of fire',
      'Advancing through hostile compounds with weapons ready', 'Neutralizing enemy defensive turrets from cover', 'Controlling tactical engagement ranges',
      'Guarding vulnerable squad flanks during breaches', 'Scanning perimeter boundaries for infiltrators', 'Holding fortified high-ground vantage points',
      'Navigating ruined urban plazas from cover to cover', 'Maintaining perimeter security during reloads', 'Engaging enemy squads with measured single shots',
      'Coordinating rapid flank maneuvers around defenses', 'Defending strategic extraction landing zones', 'Monitoring tactical radar indicators for flanks',
      'Mastering room clearance techniques with poise', 'Operating with unwavering tactical marksmanship'
    ];
    const actions = [
      'prevents unexpected ambushes in contested urban sectors', 'minimizes squad exposure against entrenched machine gun nests',
      'allows aggressive operators to push forward without taking fire', 'enables tactical flanking maneuvers across contested combat ground',
      'delivers commanding sightline control over advancing enemy columns', 'allows teams to defeat hostile assault waves systematically',
      'prevents hostile sharpshooters from securing return fire angles', 'guarantees steady progress without walking into enemy crossfires',
      'prevents defensive perimeter lines from collapsing under pressure', 'allows frontline marksmen to neutralize threats before squads move',
      'eliminates heavy adversary weapons before they pin down teammates', 'preserves combat strength for decisive counter-offensive operations',
      'ensures high hit probability on opening ballistic volleys', 'protects squads from elevated enemy sniper observation towers',
      'demands calm tactical nerve and methodical trigger discipline', 'requires acute target discrimination to preserve the initiative',
      'keeps defensive units prepared for sudden rear infiltration attempts', 'disrupts enemy tracking and prevents defenders from being zeroed in',
      'minimizes return fire danger across wide industrial courtyards', 'clears fortified enemy buildings with speed and combat poise',
      'reveals concealed enemy emplacements before contact occurs', 'maintains safe defensive buffers for frontline combat specialists',
      'ensures safe mission completion after intense skirmishes conclude', 'requires unwavering combat discipline against relentless waves',
      'allows operators to anticipate incoming assault waves cleanly', 'keeps hostile units pinned while assault teams reposition',
      'prevents adversary forces from establishing vantage sightlines', 'avoids catastrophic multi-target casualties during bombardments',
      'eliminates incoming danger before barricades are breached', 'ensures instant tactical response across all operational sectors',
      'dismantles aggressive enemy infantry rushes with ease', 'conserves ammunition and ensures pin-point ballistic precision',
      'keeps defensive lines impenetrable against relentless assaults', 'allows defensive teams to fortify barriers well before waves hit',
      'guarantees instant response to sudden close-quarters threats', 'neutralizes hostile flanking attempts across wide open arenas',
      'ensures operators maintain the element of surprise on entry', 'clears the pathway for rapid squad maneuvers across sectors',
      'allows combat specialists to dictate terms and exploit errors', 'prevents adversaries from isolating individual team members',
      'detects stealthy enemy infiltration teams before they strike', 'provides unmatched situational visibility across entire battlefields',
      'demands disciplined bounding movements from barrier to barrier', 'keeps defensive positions completely secure during down times',
      'conserves ammunition supplies and guarantees clean hits', 'breaks stubborn battlefield stalemates decisively on the ground',
      'ensures team survival as enemy reinforcements converge', 'alerts operators to flanking movements before hostiles can fire',
      'allows operators to neutralize fortified strongholds safely', 'distinguishes elite marksmen from fallen battlefield casualties'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'shooting' && pNum === 2) {
    const subjects = [
      'Smooth pointer tracking across target silhouettes', 'Modulating weapon fire with disciplined trigger cadence', 'Calm crosshair alignment in close quarters',
      'Quick mouse or touch flicks onto peripheral targets', 'Coordinating weapon swaps with tactical movement', 'Rhythmic burst firing through medium combat ranges',
      'Steady hand pressure during target tracking', 'Releasing the aim trigger momentarily to reset bloom', 'Coordinating directional evasion with responsive aiming',
      'Smooth key taps or thumb swipes for positioning', 'Feathering fire controls during long-range duels', 'Quickly centralizing crosshairs after sudden turns',
      'Balancing evasive movement against steady aim', 'Deliberate weapon manipulation during sniper standoffs', 'Executing rapid evasive slides with crosshair lock',
      'Coordinating crouch inputs with target acquisition', 'Fine-tuning optical zoom levels on distant snipers', 'Deploying tactical utility items with clean keystrokes',
      'Executing gentle pointer adjustments at extreme ranges', 'Modulating trigger pressure during automatic bursts', 'Smooth directional inputs during camera sweeps',
      'Balancing character velocity against firing stability', 'Coordinating rapid weapon reloading behind cover', 'Applying light control pressure during target tracking',
      'Holding steady aim through high-tempo shootouts', 'Executing rapid target switches with crisp gestures', 'Disciplined trigger control in dark corridors',
      'Releasing ADS view smoothly as combat ranges collapse', 'Adjusting firing stance via subtle key presses', 'Coordinating emergency retreat with suppressing fire',
      'Applying measured aim corrections on moving targets', 'Managing weapon recoil through downward mouse drag', 'Smooth transition from sprinting to weapon aiming',
      'Delicate touch on aiming controls during sniper shots', 'Executing progressive trigger bursts on armored targets', 'Holding consistent pointer tracking in firefights',
      'Coordinating quick weapon reloads with squad cover', 'Managing optical scope drift through breath pauses', 'Feathering directional controls while slicing corners',
      'Suppressive rifle bursts directed toward contested hallway intersections', 'Executing rapid 180-degree turnarounds on flanks', 'Balancing aim speed against precision crosshair tuning',
      'Smoothly tracking descending airborne hostile targets', 'Fine-tuning mouse sensitivity for exact reticle travel', 'Coordinating tactical weapon switches with cover peeks',
      'Managing sustained firing bursts without weapon jamming', 'Applying gentle corrective inputs while walking', 'Executing deliberate firing sequences under pressure',
      'Modulating weapon fire during close-range rushes', 'Mastering exact input timing and crosshair control'
    ];
    const actions = [
      'centers bullet impacts without wasting precious ammunition', 'keeps projectile spread tightly clustered on center mass',
      'ensures clean projectile placement during fast-paced encounters', 'neutralizes peripheral threats before hostiles establish aim',
      'ensures operators always engage with the optimal firearm', 'maintains pinpoint ballistic accuracy without barrel overheating',
      'allows marksmen to track moving hostiles across broad arenas', 'resets weapon recoil and guarantees subsequent rounds strike true',
      'prevents incoming hostile fire from interrupting your focus', 'provides nuanced tactical movement without disrupting sightlines',
      'guarantees each distant shot lands with surgical precision', 'allows instant response to unexpected surprise flank attacks',
      'demands refined fine-motor dexterity under heavy enemy fire', 'keeps reticles perfectly steady during tense sniper duels',
      'dismantles aggressive enemy rushing squads with ease', 'reduces player silhouette while noticeably boosting weapon stability',
      'ensures clear visual acquisition of partially concealed targets', 'creates immediate defensive smoke screens or barrier cover',
      'preserves ballistic precision and prevents overshooting targets', 'maintains controllable grouping on heavily armored adversaries',
      'prevents jarring camera movements that throw off aim lines', 'ensures accuracy is never compromised during rapid advances',
      'guarantees continuous defensive fire when assault waves hit', 'avoids erratic reticle jitter on fast-moving hostile infantry',
      'prevents panic firing from squandering vital resource reserves', 'eliminates multiple hostile threats in rapid, fluid succession',
      'prevents accidental shots from alerting dormant enemy patrols', 'preserves wide peripheral situational awareness during skirmishes',
      'ensures clean sightlines over protective low concrete barricades', 'keeps pursuing hostiles at a safe, manageable distance',
      'keeps crosshairs locked on vital enemy hitboxes consistently', 'keeps continuous automatic fire centered on target silhouettes',
      'ensures the fastest possible draw-to-fire combat response', 'prevents reticle overshooting and keeps critical headshots true',
      'eliminates defensive armor plates with maximum kinetic efficiency', 'guarantees continuous hit registration throughout the duel',
      'guarantees unbroken operational tempo during firefights', 'delivers guaranteed first-round hits on distant enemy sentries',
      'allows operators to clear dangerous room corners with poise', 'restricts hostile infantry advances while safeguarding vulnerable squad perimeters',
      'allows swift defensive responses to surprise rear assaults', 'turns high-tempo firefights into exhibitions of shooting skill',
      'ensures clean hits before enemies touch down on squad flanks', 'ensures physical gestures translate into exact crosshair travel',
      'maximizes damage output against diverse enemy combat units', 'prevents disruptive weapon overheating during intense holdouts',
      'stabilizes reticle alignment when firing across uneven terrain', 'prevents button mashing from compromising combat composure',
      'delivers immediate stopping power against aggressive rushers', 'ensures every gunshot feels crisp, responsive, and lethal'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'puzzle' && pNum === 1) {
    const subjects = [
      'Methodical board analysis prior to making moves', 'Surveying complex logic grids from corner to corner', 'Careful sequencing of tile rearrangements',
      'Evaluating interlocking puzzle mechanisms thoroughly', 'Anticipating cascade chain reactions across cells', 'Isolating bottleneck components early in stages',
      'Tracking multi-step spatial transformations in mind', 'Recognizing repeating geometric tile configurations', 'Balancing immediate point gains with board health',
      'Formulating a structured solution roadmap in advance', 'Scanning grid boundary constraints for open slots', 'Dismantling multi-layered logic structures with care',
      'Forecasting chain-reaction tile descents across congested grids', 'Prioritizing high-impact tile clearing moves', 'Rotating perspective across symmetrical board layouts',
      'Executing clean matching combinations from bottom rows', 'Coordinating multi-piece alignment sequences cleanly', 'Evaluating potential board states three moves ahead',
      'Holding key reserve staging spaces completely open', 'Identifying primary objective pieces before starting', 'Navigating dense match-3 or sorting challenge grids',
      'Resolving delicate board bottlenecks with calculated steps', 'Tracking shifting color palettes across complex boards', 'Protecting critical transit corridors across rows',
      'Analyzing board geometry thoroughly before touching tiles', 'Coordinating deliberate tile swaps across boundaries', 'Methodical grid evaluation without hurried guesswork',
      'Maintaining balanced component distribution on board', 'Prioritizing moves that accomplish dual clearing goals', 'Clear recognition of spatial board limitations',
      'Advancing through layered logic challenge gauntlets', 'Securing clear operational lanes across the challenge field', 'Executing calculated component pairings with poise',
      'Holding back from impulsive matching moves on sight', 'Anticipating tile gravity drop mechanics in advance', 'Sweeping across complex puzzle matrices with care',
      'Establishing clean separation between component types', 'Solving systematically cell by cell across dense logic layouts', 'Neutralizing obstructive barrier blocks early on',
      'Controlling board tempo to deliberate on every move', 'Guarding against premature board lockups with care', 'Scanning perimeter tile rows for subtle alignments',
      'Holding vital clearing combinations in reserve staging', 'Navigating complex tile-matching labyrinths with poise', 'Maintaining structural balance across puzzle boards',
      'Evaluating component placement with rigorous patience', 'Coordinating methodical row and column scan sweeps', 'Solving multi-stage brain teasers with structured logic',
      'Monitoring remaining move limits on challenging boards', 'Mastering complex logic mechanics and piece flow'
    ];
    const actions = [
      'allows solvers to identify critical clearing sequences early', 'reveals hidden spatial connections that simplify hard stages',
      'preserves valuable empty space needed for subsequent clearing', 'ensures every piece placement moves the board toward completion',
      'prevents accidental deadlocks before they compromise corridors', 'allows solvers to dismantle dense challenge clusters calmly',
      'ensures critical clearing pathways remain completely unobstructed', 'simplifies complex logic setups into straightforward challenges',
      'guarantees consistent, sustainable progression across tiers', 'enables players to untangle chaotic board states with poise',
      'reveals non-obvious avenues for relocating stubborn elements', 'demands persistent concentration and disciplined spatial foresight',
      'readies tactical solvers for newly emerging clearing configurations', 'frees up congested grid sectors and restores vital momentum',
      'uncovers elegant solutions that straightforward inspections miss', 'creates favorable cascading rearrangements across upper tiers',
      'clears crowded boards with maximum efficiency and minimal turns', 'avoids exhausting finite movement allowances prematurely',
      'provides the temporary staging area required to reposition blocks', 'prevents wasting turns manipulating irrelevant secondary items',
      'requires disciplined pattern recognition and calculating patience', 'transforms frustrating dead-ends into satisfying, elegant clears',
      'enables rapid identification of valid matching combinations', 'ensures newly spawned puzzle pieces drop into advantageous slots',
      'establishes the optimal path toward complete board resolution', 'clears stubborn cluster arrangements without disrupting setups',
      'replaces trial-and-error habits with true logical mastery', 'prevents localized congestion from spreading across adjacent cells',
      'doubles solving efficiency across challenging puzzle stages', 'ensures solvers never commit to dead-end manipulation paths',
      'requires sharp deductive reasoning and calm mental composure', 'dismantles intricate spatial barriers with minimal move counts',
      'keeps the puzzle field open and flexible for future adjustments', 'allows larger, more impactful clearing combinations to mature',
      'enables clever multi-tiered cascade clears with a single move', 'allows solvers to spot subtle alignments before moves expire',
      'simplifies sorting tasks across all difficulty tiers', 'guarantees steady, error-free progression across long sessions',
      'unlocks the full interactive canvas of the puzzle board', 'allows thinkers to deliberate thoroughly and find optimal paths',
      'ensures continuous solving momentum across extended stages', 'reveals overlooked match opportunities that open central lanes',
      'provides foolproof solutions when board real estate tightens', 'demands sharp visual acumen and calm deductive patience',
      'prevents lopsided congestion from limiting valid moves', 'ensures every action brings the layout closer to total resolution',
      'uncovers hidden matching lines across dense challenge grids', 'requires persistent analytical rigor and structured spatial planning',
      'guides tactical decisions between conservative and bold clears', 'transforms intimidating puzzle designs into rewarding triumphs'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'puzzle' && pNum === 2) {
    const subjects = [
      'Deliberate selection inputs across grid tiles', 'Careful tile manipulation within compact cells', 'Measured cursor adjustments across the puzzle board',
      'Smooth drag-and-drop actions between holding tubes', 'Precise clicking cadence when testing piece alignments', 'Patient touch gestures on mobile puzzle displays',
      'Disciplined input execution across delicate bottlenecks', 'Accurate selector navigation through logic trees', 'Smooth pointer tracking across dense challenge grids',
      'Responsive clicking inputs when sorting colored units', 'Feathering touch commands across narrow grid corridors', 'Quickly centralizing selectors upon finding matches',
      'Balancing deliberate thought against crisp input delivery', 'Deliberate piece placement sweeps across open rows', 'Executing gentle selector taps on delicate switches',
      'Coordinating multi-tile selections with fluid hand motions', 'Fine-tuning piece positioning through nuanced inputs', 'Deploying undo tools through clear interface clicks',
      'Executing subtle cursor micro-adjustments in tight spots', 'Modulating selection speed during high-tempo sorting', 'Smooth directional inputs during grid navigation',
      'Balancing tap precision against fast visual processing', 'Coordinating methodical piece placement with scanning', 'Applying light control pressure during drag maneuvers',
      'Holding steady focus across rapid clearing phases', 'Executing clean drag-and-release actions onto targets', 'Disciplined touch control on sensitive puzzle elements',
      'Releasing held puzzle pieces smoothly into valid slots', 'Adjusting piece orientation via intuitive rotate controls', 'Coordinating rapid matching clicks with visual scans',
      'Applying measured input gestures on intricate mosaics', 'Managing piece manipulation through smooth mouse sweeps', 'Smooth transition from one puzzle quadrant to the next',
      'Delicate touch on interface controls during tricky moves', 'Executing progressive multi-piece sorting sequences', 'Holding consistent input discipline through campaigns',
      'Coordinating quick card flips with memory retention', 'Managing puzzle piece flow through measured drag velocity', 'Feathering selector keys while navigating logic arrays',
      'Applying steady pointer tracking onto matching targets', 'Executing rapid match-and-clear gestures across fields', 'Balancing input speed against careful verification',
      'Smoothly sliding rows and columns into designated slots', 'Fine-tuning mouse sensitivity for exact puzzle travel', 'Coordinating tile swaps with upcoming gravity drops',
      'Managing multi-stage selection sequences through calm inputs', 'Applying gentle corrective clicks to return items', 'Executing deliberate input sequences without mashing',
      'Modulating piece placement rhythm during timed rounds', 'Perfecting deliberate tile moves and piece placement'
    ];
    const actions = [
      'allows solvers to verify intended move pathways before drops', 'prevents accidental component displacements that block corridors',
      'ensures smooth reorganization of pieces without board locks', 'preserves operational flexibility across crowded sectors',
      'enables methodical exploration of clearing paths without waste', 'maintains clean board geometry as pieces shift into place',
      'gives players fine spatial control in delicate bottleneck areas', 'keeps move sequences orderly and structured through all phases',
      'ensures effortless manipulation of fragile logic puzzle items', 'allows for lightning-fast reorganization of units into tubes',
      'prevents misjudging destinations when dragging items across slots', 'ensures immediate responsiveness when confirming valid matching pairs',
      'creates an exceptionally satisfying and fluid puzzle rhythm', 'keeps the working field orderly and avoids premature commitments',
      'ensures fragile card pairs or logic switches toggle cleanly', 'enables rapid creation of extensive cascading clearing chains',
      'prevents releasing elements into incorrect neighboring slots', 'preserves vital move allowances during critical puzzle moments',
      'ensures pinpoint accuracy when working within compact grid cells', 'prevents costly mis-sorting penalties during fast sessions',
      'prevents erratic cursor hops that disrupt planned move sequences', 'ensures match-3 combinations trigger continuously and cleanly',
      'guarantees seamless puzzle clearance without wasted turns', 'avoids dragging pieces into unintended adjacent puzzle cells',
      'prevents fatigue from compromising input accuracy late in runs', 'delivers immediate tactile satisfaction with each solved cluster',
      'prevents double-tapping errors that advance board states early', 'triggers satisfying clearing animations across the grid',
      'guarantees a perfect snug fit into intricate puzzle recesses', 'clears timed puzzle stages with valuable seconds to spare',
      'keeps intricate geometric blocks aligned with millimeter accuracy', 'prevents frantic over-shooting across broad challenge boards',
      'ensures unbroken momentum throughout long problem-solving sessions', 'prevents accidental activations of precious stage booster items',
      'organizes chaotic fields into orderly finished puzzle arrays', 'ensures dependable progression through hundreds of challenge stages',
      'allows instant pairing of identical hidden card symbols', 'keeps physical simulation puzzles predictable and responsive',
      'allows thinkers to traverse complex interactive menus cleanly', 'clears complex spatial grids with surgical cognitive poise',
      'triggers rewarding cascading spectacles across dense tile fields', 'turns technical puzzle tests into exhibitions of mental skill',
      'creates harmonious alignments that clear entire challenge boards', 'ensures every physical gesture produces exact on-screen results',
      'maximizes the cascading rewards of each deliberate tile swap', 'prevents frustrating mis-clicks during multi-piece maneuvers',
      'returns misplaced pieces to inventory before penalties apply', 'prevents interface spamming from compromising mental composure',
      'ensures maximum point efficiency under strict challenge timers', 'ensures every piece snap, clear, and match feels deeply satisfying'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'sports' && pNum === 1) {
    const subjects = [
      'Disciplined field spacing across the playing surface', 'Surveying opposing defensive formations for gaps', 'Careful momentum management across the pitch',
      'Executing clinical set-piece deliveries into the box', 'Anticipating ball trajectory changes off rebounds', 'Maintaining tight defensive marking on attackers',
      'Coordinating tactical wing advances into open space', 'Reading opponent passing intentions before release', 'Balancing aggressive pressing with backline cover',
      'Formulating a structured tactical match game plan', 'Scanning the perimeter of the field for runners', 'Controlling midfield territory through distribution',
      'Anticipating counter-attacking surges from rivals', 'Prioritizing high-percentage passing combinations', 'Rotating squad positions dynamically during attacks',
      'Executing clean tackles at the edge of the box', 'Coordinating synchronized offensive movements forward', 'Evaluating goalkeeper positioning before striking',
      'Holding defensive structure during intense pressure', 'Identifying primary opponent playmakers early on', 'Navigating competitive athletic tournament fixtures',
      'Resolving delicate defensive scrambles near the goal', 'Tracking transition runs across the playing surface', 'Protecting the goal area with resolute aerial strength',
      'Analyzing opponent tactical tendencies before kickoff', 'Coordinating rapid passing triangles in the center', 'Methodical possession retention across the pitch',
      'Maintaining balanced squad distribution in all zones', 'Prioritizing quick transition plays off turnovers', 'Clear recognition of field boundaries during runs',
      'Advancing through tough tournament knockout brackets', 'Winning high-altitude headers against aggressive opposing defenders', 'Executing calculated combination plays in the box',
      'Holding defensive lines with disciplined coordination', 'Anticipating deflection angles off posts and crossbars', 'Sweeping across broad pitch sectors with awareness',
      'Establishing dominance in physical one-on-one duels', 'Advancing step by step through defensive phases', 'Neutralizing opponent aerial threats from corner kicks',
      'Controlling match tempo through calm ball rotation', 'Guarding against sudden backline lapses during breaks', 'Scanning sideline corridors for overlapping fullbacks',
      'Holding decisive set-piece plays in reserve staging', 'Navigating challenging competitive match scenarios', 'Maintaining defensive communication across the squad',
      'Evaluating shooting angles carefully before pulling trigger', 'Coordinating methodical pressing sequences on wings', 'Competing across premier sports arenas with poise',
      'Monitoring match clock constraints during late stages', 'Mastering fundamental team sports dynamics and tactics'
    ];
    const actions = [
      'enables athletes to control match tempo and orchestrate attacks', 'reveals passing lanes that can be exploited for breakthroughs',
      'ensures players maintain energetic balance through full fixtures', 'tests opponent defensive coordination under heavy match pressure',
      'allows observant players to position themselves for loose balls', 'denies rival attackers the space needed to unleash shots',
      'stretches opposing formations and creates central scoring pockets', 'helps alert defenders intercept through-balls before danger grows',
      'guarantees sustainable match control from kickoff to whistle', 'allows athletic squads to overcome physically demanding fixtures',
      'reveals open teammates waiting in advantageous scoring spots', 'requires persistent spatial awareness and clinical distribution',
      'keeps backline defenders prepared to halt fast breaks instantly', 'preserves team possession and gradually breaks down defenses',
      'disrupts opponent defensive schemes and opens fresh attack angles', 'removes danger without conceding costly fouls or penalties',
      'creates overlapping runs that overwhelm opposing defensive lines', 'allows sharp shooters to pick out unprotected corners cleanly',
      'preserves clean sheets through difficult halves of rival pressure', 'allows teams to neutralize central creative threats effectively',
      'demands razor-sharp tactical discipline and physical composure', 'transforms goalmouth chaos into structured counter-attacks',
      'enables rapid exploitation of unsettled opponent defenses', 'prevents opponents from capitalizing on dangerous high crosses',
      'establishes the clear tactical roadmap toward match victory', 'bypasses aggressive pressing traps across congested midfields',
      'frustrates impatient opponents and forces costly defensive errors', 'prevents localized gaps from exposing vulnerable territory',
      'turns defensive stops into immediate scoring opportunities', 'ensures athletes never run out of bounds during attacking sprints',
      'requires unyielding team synergy and clutch performance execution', 'directs rebounds directly into the path of advancing midfielders',
      'unlocks stubborn defensive blocks with style and precision', 'catches opposing attackers in decisive offside traps repeatedly',
      'allows alert strikers to pounce on loose balls in the box', 'maintains overall team shape and defensive compactness',
      'shifts psychological and tactical momentum toward your squad', 'guarantees structured, reliable defensive protection throughout',
      'protects hard-earned leads during late tournament stages', 'allows team captains to dictate the rhythm and flow of play',
      'ensures clean defensive records across grueling league seasons', 'reveals open transition paths that bypass crowded midfields',
      'provides game-winning opportunities when open play deadlocks', 'demands sharp athletic instincts and unwavering team belief',
      'prevents misjudged coverage assignments during rapid opponent surges', 'ensures every shot attempt tests the opposing keeper severely',
      'traps opposing defenders against their own defensive touchlines', 'requires physical stamina, tactical intellect, and grit',
      'guides decisions between maintaining possession and pressing', 'transforms challenging fixtures into triumphant athletic showcases'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'sports' && pNum === 2) {
    const subjects = [
      'Precise directional commands across the playing pitch', 'Timed passing gestures toward open teammates', 'Nuanced strike execution testing rival goalkeepers',
      'Smooth touch manipulation during rapid direction shifts', 'Disciplined defensive positioning inputs in the box', 'Calm shooting adjustments curving past defensive walls',
      'Coordinated tactical gestures switching pace smoothly', 'Accurate trajectory aiming timing defensive challenges', 'Smooth pointer tracking across broad stadium fields',
      'Responsive clicking inputs releasing quick scoring shots', 'Feathering touch commands threading delicate through-balls', 'Quickly centralizing direction controls upon reception',
      'Balancing deliberate movement against crisp passing delivery', 'Deliberate tackle sweeps keeping backlines completely secure', 'Executing gentle touch taps for quick one-touch passes',
      'Coordinating sprint triggers with open field running lanes', 'Fine-tuning shot power through nuanced button holds', 'Deploying skill moves through intuitive swipe gestures',
      'Executing subtle directional micro-adjustments while shielding', 'Modulating sprint velocity during lengthy athletic fixtures', 'Smooth directional inputs preventing player stumbles',
      'Balancing shot power against angle precision on set-pieces', 'Coordinating methodical pass selection with radar checks', 'Applying light control pressure during technical dribbles',
      'Holding steady input discipline through extra time halves', 'Executing clean slide tackles from safe approach angles', 'Disciplined button cadence preventing errant passes',
      'Releasing the sprint command before taking shots on goal', 'Adjusting trajectory via intuitive stick or mouse movement', 'Coordinating rapid passing inputs with teammate runs',
      'Applying measured defensive containment inputs on dribblers', 'Managing goalkeeper dives through responsive lateral controls', 'Smooth transition from defense to attack across midfield',
      'Delicate touch on pass controls chipping defensive lines', 'Executing progressive passing sequences out of the back', 'Holding consistent control rhythm through penalty shootouts',
      'Coordinating quick one-two passes bypassing markers', 'Managing player deceleration through gentle control releases', 'Feathering direction keys while dribbling in tight boxes',
      'Applying steady pointer tracking onto goal corners', 'Executing rapid clearance kicks under goalmouth pressure', 'Balancing control speed against passing delivery accuracy',
      'Smoothly switching active defenders via quick clicks', 'Fine-tuning analog sensitivity for exact athletic motion', 'Coordinating through-ball timing with offside lines',
      'Regulating acceleration sprints through disciplined trigger modulation', 'Applying gentle corrective inputs when shooting off-balance', 'Executing deliberate input sequences without panic',
      'Modulating shot power during clean breakaway chances', 'Honing pitch tactical instincts and athletic execution'
    ];
    const actions = [
      'guides athlete movement with pinpoint accuracy across the field', 'ensures clean delivery toward open teammates under tight marking',
      'delivers clinical finishing power when testing opponent keepers', 'preserves athletic balance when executing sudden direction shifts',
      'prevents erratic touches that surrender possession in danger zones', 'provides the fine calibration needed to curve shots past walls',
      'enables seamless switches between possession and rapid attacks', 'keeps defensive interventions cleanly timed without fouling',
      'allows for effortless passing calibration across broad pitches', 'allows for lightning-fast shot releases inside the penalty box',
      'prevents over-hitting through-balls between opposing center backs', 'ensures instant control without taking heavy or awkward touches',
      'creates an exceptionally fluid and rewarding match rhythm', 'prevents reckless challenges that draw yellow cards or penalties',
      'keeps team momentum moving swiftly forward through defenses', 'enables rapid counter-attacks before opposing defenses recover',
      'prevents sending strikes soaring harmlessly over the crossbar', 'dazzles defenders and creates vital yards of shooting space',
      'ensures pinpoint shielding when holding off physical defenders', 'preserves athletic stamina for decisive late-game match plays',
      'prevents jarring turns that cause players to lose possession', 'turns difficult set-pieces into spectacular scoring finishes',
      'guarantees safe, reliable distribution across all field sectors', 'avoids pushing the ball too far ahead into defender tackling range',
      'prevents fatigue from degrading control accuracy in late stages', 'dispossesses opponents cleanly without conceding dangerous fouls',
      'prevents double-tapping errors that could turn passes into shots', 'stabilizes character balance and noticeably improves accuracy',
      'curves free kicks majestically into top corners of the net', 'unlocks stubborn defenses with surgical passing precision',
      'keeps elusive dribblers from penetrating central goal corridors', 'produces breathtaking, match-winning saves across the line',
      'ensures unbroken team momentum throughout the entire fixture', 'enables delicate chipped through-balls over flat backlines',
      'moves the ball cleanly from goalkeeper hands to striker feet', 'delivers ice-cold conversion rates under intense match pressure',
      'bypasses aggressive markers before they close down shooting lanes', 'avoids sliding carelessly over sideline and touchline boundaries',
      'creates the tiny angles needed for clean strikes on goal', 'ensures penalties find the side netting cleanly and reliably',
      'neutralizes immediate threats safely without taking risks', 'turns competitive fixtures into exhibitions of sporting mastery',
      'keeps your nearest defender pressuring the ball carrier safely', 'ensures physical inputs translate into exact player motion',
      'turns opponent defensive errors into clean breakaway goals', 'prevents premature athletic exhaustion across long match halves',
      'stabilizes athlete stance when shooting while moving at speed', 'prevents button mashing from compromising tactical discipline',
      'guarantees composed, clinical finishes past rushing keepers', 'ensures every pass, tackle, and strike feels crisp and powerful'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else if (genre === 'general' && pNum === 1) {
    const subjects = [
      'Careful spatial navigation through obstacle gauntlets', 'Surveying dynamic challenge layouts for timing gaps', 'Maintaining balanced forward momentum across chasms',
      'Executing deliberate movement inputs across platforms', 'Anticipating moving hazard cycles with sharp timing', 'Observing environmental cue changes on shifting floors',
      'Balancing rapid pace with defensive caution around traps', 'Reading cyclical trap behaviors across chaotic arenas', 'Formulating a clear traversal plan across levels',
      'Scanning the interactive environment for landing pads', 'Throttling avatar running pace through constricted tunnel passages', 'Anticipating sudden trap activations along pathways',
      'Prioritizing stable footing over reckless running speed', 'Rotating camera perspectives to uncover hidden passages', 'Executing clean hops across moving stage footholds',
      'Coordinating multi-stage jump sequences over hurdles', 'Evaluating obstacle heights and collision hitboxes', 'Holding steady concentration during survival runs',
      'Identifying primary objective routes early in stages', 'Navigating vibrant browser gaming worlds with poise', 'Resolving delicate platforming sequences with care',
      'Tracking dynamic moving components across the screen', 'Protecting character health by avoiding risky detours', 'Analyzing obstacle frequency before making leaps',
      'Coordinating rapid evasive maneuvers through traps', 'Methodical stage exploration across secret pathways', 'Maintaining balanced movement pacing on narrow bridges',
      'Prioritizing safe checkpoints to secure hard-earned progress', 'Clear recognition of safe zones gives valuable breathing room', 'Advancing through escalating hazard tiers with focus',
      'Securing clean trajectories over moving obstacles', 'Executing calculated traversal leaps across wide gaps', 'Holding back from impatient dashes into active zones',
      'Anticipating terrain shifts before hazards can strike', 'Sweeping across broad obstacle courses with intuition', 'Establishing consistent rhythm across arcade gauntlets',
      'Progressing methodically through complex challenge maps', 'Neutralizing environmental surprises through reflexes', 'Controlling gameplay tempo before committing to jumps',
      'Guarding against sudden momentum loss in speed corridors', 'Scanning upcoming corridors for impending hazard waves', 'Holding special mobility abilities in reserve staging',
      'Navigating demanding browser arcade titles with poise', 'Maintaining physical composure under intense tempo', 'Evaluating risk against reward when collecting items',
      'Coordinating methodical movement patterns through traps', 'Competing across diverse browser challenge arenas', 'Monitoring countdown limits during timed stage runs',
      'Mastering fundamental arcade traversal mechanics', 'Developing keen environmental empathy on platform levels'
    ];
    const actions = [
      'allows energetic players to thread through without taking damage', 'reveals timing intervals for smooth, uninterrupted traversal',
      'ensures characters clear hazardous gaps with confidence', 'allows players to overcome rising stage tempo across levels',
      'enables nimble contenders to slip through closing barriers', 'keeps alert navigators prepared for sudden terrain changes',
      'prevents accidental collisions with perimeter boundary traps', 'allows players to establish a steady, reliable rhythm throughout',
      'allows gamers to conquer increasingly difficult stages cleanly', 'reveals safe landing zones and bonus collection opportunities',
      'demands nuanced gamepad analog finesse and sharp visual attention', 'keeps players alert and ready to execute evasive maneuvers',
      'preserves life counters through complex challenge sequences', 'uncovers hidden passage routes and safer navigational paths',
      'avoids hazardous falls into bottomless stage chasms below', 'clears intimidating obstacle fields with style and poise',
      'allows players to time every clearance with clinical certainty', 'separates accomplished players from casual contenders',
      'prevents wasting vital time wandering through perilous dead ends', 'demands acute reflex memory and sustained mental engagement',
      'transforms intimidating hazard gauntlets into triumphant clears', 'ensures players stay one step ahead of approaching danger',
      'guarantees consistent progress toward final stage gates', 'establishes the ideal cadence needed for effortless completion',
      'bypasses dense clusters of hazards across energetic fields', 'rewards observant contenders with optimal clearing routes',
      'prevents overshooting compact landing pads on narrow bridges', 'ensures hard-earned stage progress remains completely secure',
      'allows players to survey upcoming challenges without pressure', 'requires continuous reflex calibration and calm mental focus',
      'establishes immediate mastery over difficult stage sectors', 'unlocks challenging stages with flair and undeniable rhythm',
      'prevents mistimed movements into active hazard strike zones', 'allows players to adapt movement arcs well before obstacles hit',
      'preserves forward momentum across demanding obstacle courses', 'turns chaotic arcade gauntlets into deeply satisfying triumphs',
      'guarantees dependable, error-free progression across long runs', 'keeps your character tracking forward cleanly and safely',
      'allows players to deliberate briefly before perilous jumps', 'ensures uninterrupted flow through high-speed arcade corridors',
      'reveals impending hazard waves with valuable seconds to spare', 'provides foolproof escapes when stage space collapses abruptly',
      'requires sharp timing instincts and unwavering concentration', 'prevents erratic input deliveries during intense rounds',
      'ensures players collect valuable items without endangering runs', 'dismantles complex trap networks with calculated ease',
      'requires keen observation, rhythmic timing, and agility', 'guides decisions between cautious exploration and rapid sprints',
      'transforms daunting stages into triumphant, fun adventures', 'turns unpredictable interactive layouts into comfortable ground'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  } else {
    // general p2
    const subjects = [
      'Precise directional commands through hazard corridors', 'Smooth jump inputs over elevated barriers and chasms', 'Nuanced gesture execution dodging sudden obstacles',
      'Responsive touch manipulation landing on compact footholds', 'Disciplined movement positioning inputs on platform edges', 'Calm timing adjustments weaving past hazard pendulums',
      'Coordinated navigational gestures switching movement pace', 'Accurate trajectory aiming keeping jump arcs aligned', 'Smooth pointer tracking across broad puzzle-arcade screens',
      'Responsive clicking inputs triggering quick evasive leaps', 'Feathering touch commands leaping between tight pillars', 'Quickly centralizing direction controls upon touching down',
      'Balancing deliberate movement against crisp jumping delivery', 'Deliberate evasive sweeps preventing collisions with spikes', 'Executing gentle tap inputs for short, controlled hops',
      'Coordinating sprint commands through open safe runway stretches', 'Fine-tuning jump height through measured button presses', 'Deploying special agility moves through swipe gestures',
      'Executing subtle directional micro-adjustments on balance beams', 'Modulating character velocity during lengthy arcade stages', 'Smooth directional inputs preventing jarring camera shifts',
      'Balancing movement speed against precision platform timing', 'Coordinating methodical path selection with visual trap scans', 'Applying light control pressure during high-speed dashes',
      'Holding steady input discipline through intense speed sections', 'Executing clean wall jumps through vertical stage shafts', 'Disciplined button cadence preventing double-jumping errors',
      'Releasing the forward command before touching down on ledges', 'Adjusting trajectory via intuitive controls around corners', 'Coordinating rapid directional inputs with platform tracking',
      'Applying measured deceleration inputs on slippery ice surfaces', 'Managing character descent through float or glide controls', 'Smooth transition from running to leaping over chasms',
      'Delicate touch on movement controls on moving elevator pads', 'Executing progressive jumping sequences across obstacle fields', 'Holding consistent control rhythm through endless runners',
      'Coordinating quick evasive crouches ducking under blades', 'Managing landing deceleration through gentle input releases', 'Feathering direction keys while balancing on rolling logs',
      'Applying steady pointer tracking onto interactive switches', 'Executing rapid directional reversals under ceiling traps', 'Balancing control speed against jumping precision on ledges',
      'Smoothly sliding beneath low barricades via downward inputs', 'Fine-tuning keyboard sensitivity for exact character travel', 'Coordinating jump timing with trampoline bounce pads',
      'Coordinating speed dash bursts through measured inputs', 'Applying gentle corrective inputs recovering from high drops', 'Executing clean directional inputs without frantically pressing keys',
      'Modulating jump duration during multi-hazard obstacle runs', 'Executing fluid jump commands and platforming navigation'
    ];
    const actions = [
      'guides character movement with pinpoint accuracy through hazards', 'ensures clean clearances over elevated barriers and chasms',
      'delivers agile evasive leaps when dodging sudden obstacles', 'preserves character balance when landing on compact footholds',
      'prevents erratic steps that send characters tumbling off ledges', 'delivers the exact spatial calibration needed to weave past pendulums',
      'enables seamless switches between rapid running and micro-steps', 'keeps jump arcs cleanly aligned with moving destination pads',
      'allows for effortless dragging and positioning across screens', 'allows for lightning-fast jump triggers when traps appear',
      'prevents over-shooting narrow landing zones between tight pillars', 'ensures instant stability without skidding forward on ledges',
      'movement produces a remarkably satisfying and unbroken traversal rhythm', 'prevents accidental collisions with static spikes and traps',
      'ensures short, controlled hops across closely spaced obstacles', 'enables rapid traversal through safe runway sections',
      'prevents colliding with low-hanging ceiling obstacle hazards', 'creates vital clearance over wide and treacherous chasms',
      'ensures pinpoint alignment when navigating narrow balance beams', 'preserves momentum for decisive late-game obstacle clears',
      'prevents jarring camera shifts that disrupt depth perception', 'turns difficult obstacle rooms into spectacular stage clears',
      'guarantees safe, dependable traversal across all levels', 'avoids carrying uncontrollable momentum into deadly dead ends',
      'prevents fatigue from degrading timing in high-speed sections', 'propels characters upward through vertical shafts safely',
      'prevents double-jumping errors that exhaust aerial options', 'stabilizes character balance and eliminates unwanted skidding',
      'curves aerial jumps safely around protruding obstacle corners', 'unlocks stubborn challenge stages with effortless ease',
      'keeps agile avatars from sliding off frictionless surfaces', 'produces graceful, safe landings onto compact targets below',
      'ensures unbroken character momentum throughout the entire stage', 'enables subtle adjustments while navigating moving elevators',
      'carries your avatar cleanly across vast multi-tiered fields', 'delivers record-breaking distance scores in running modes',
      'ducks beneath low overhead blades before they make contact', 'avoids stumbling over edge perimeters into bottomless pits',
      'creates the tiny adjustments needed to stay upright on logs', 'ensures switches and portals trigger cleanly and reliably',
      'escapes crushing ceiling traps safely without taking damage', 'turns demanding stages into exhibitions of movement art',
      'maintains continuous forward momentum while slipping under traps', 'ensures physical gestures produce exact on-screen travel',
      'launches characters into breathtaking, high-flying aerial arcs', 'prevents overshooting critical landing ledges on long jumps',
      'stabilizes avatar orientation when recovering from vertical drops', 'prevents key spamming from compromising spatial composure',
      'guarantees composed, clinical clearances past moving traps', 'ensures every step, hop, and slide feels responsive and crisp'
    ];
    for (let i = 0; i < 50; i++) {
      sents.push(`${subjects[i]} ${actions[i]}.`);
    }
  }

  return sents;
}

const pools = ['driving', 'shooting', 'puzzle', 'sports', 'general'];
const compiled = {};

for (const g of pools) {
  const p1S5 = build50UniqueSentences(g, 1);
  const p2S5 = build50UniqueSentences(g, 2);
  compiled[`${g}_p1`] = p1S5;
  compiled[`${g}_p2`] = p2S5;
}

console.log('Testing cross-genre 6-word run overlap in S5...');
const runMap = new Map();
let crossCount = 0;

for (const [poolName, arr] of Object.entries(compiled)) {
  for (const text of arr) {
    const runs = get6WordRuns(text);
    for (const r of runs) {
      if (!runMap.has(r)) runMap.set(r, new Set());
      runMap.get(r).add(poolName.split('_')[0]);
    }
  }
}

for (const [r, set] of runMap.entries()) {
  if (set.size > 1) {
    crossCount++;
    console.log('Cross run:', r, 'in genres:', Array.from(set));
  }
}
console.log('Total cross-genre runs in S5:', crossCount);

module.exports = { build50UniqueSentences, get6WordRuns };
