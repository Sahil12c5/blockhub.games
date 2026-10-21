const fs = require('fs');
const path = require('path');

// Helper to get 6-word runs
function get6WordRuns(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const runs = [];
  for (let i = 0; i <= words.length - 6; i++) {
    runs.push(words.slice(i, i + 6).join(' '));
  }
  return runs;
}

// 50 completely unique sentences for each genre and paragraph
// Let's create builders for Driving, Shooting, Puzzle, Sports, General

function buildDriving() {
  const p1 = [];
  const p2 = [];

  const p1S1 = [
    "Precise steering through tight chicane sections prevents sudden oversteer and keeps vehicles aligned with the racing line.",
    "Navigating narrow roadway corridors demands calm acceleration control to prevent destabilizing wheel spin during high-speed transitions.",
    "Careful momentum management across asphalt curves guarantees smooth weight distribution as speed steadily rises.",
    "Entering sharp hairpin turns at controlled entry velocities allows drivers to power out cleanly down upcoming straights.",
    "Anticipating sudden road hazards requires drivers to scan distant horizons rather than focusing only on the bumper ahead.",
    "Maintaining balanced tire grip through continuous sweeping bends keeps lap times fast and vehicle control predictable.",
    "Reading pavement surface changes helps drivers modulate braking pressure before entering slick asphalt patches.",
    "Threading through dense highway traffic demands quick lane adjustments and steady spatial awareness at high velocity.",
    "Adjusting steering angles smoothly prevents abrupt lateral weight transfers that cause uncontrollable vehicle drift.",
    "Balancing aggressive throttle application with defensive steering angles delivers optimal speed down competitive tracks.",
    "Approaching elevated crests with centered alignment prevents dangerous vehicle kicks upon re-establishing full ground contact.",
    "Controlling weight transfer during aggressive braking maneuvers ensures the front tires maintain maximum directional bite.",
    "Scanning forward roadway barriers enables drivers to plot clean passing lines through congested racing sectors.",
    "Calculating apex clipping points allows high-performance vehicles to carry maximum momentum into long straightaways.",
    "Modulating engine power through sweeping bends avoids breaking rear traction under heavy acceleration loads.",
    "Navigating challenging course elevations requires smooth transition management between uphill climbs and downhill descents.",
    "Maintaining proper lane discipline through chaotic intersections prevents costly collisions during intense driving attempts.",
    "Evaluating upcoming asphalt obstacles well in advance gives drivers sufficient margin to alter steering trajectories safely.",
    "Executing clean transitions through split-lane highway zones preserves overall speed while avoiding structural barricades.",
    "Holding steady racing trajectories through high-camber corners stabilizes vehicle chassis dynamics across demanding sections.",
    "Adapting to variable road friction levels ensures wheels maintain dependable road purchase across all race conditions.",
    "Tracking vehicle lateral drift during high-speed corner exits keeps trajectories securely within paved track boundaries.",
    "Managing engine torque delivery across wet asphalt surfaces prevents sudden loss of traction during critical maneuvers.",
    "Reading braking marker boards into heavy deceleration zones allows drivers to shed speed without locking up tires.",
    "Positioning vehicles along outer track boundaries before corner entry maximizes turning radius and exit velocity.",
    "Handling unexpected roadway bottlenecks requires swift deceleration combined with measured evasive steering inputs.",
    "Balancing aggressive overtaking attempts against defensive lane positioning guarantees consistent race progression.",
    "Navigating complex circuit sequences demands complete concentration on corner apex alignment and exit trajectories.",
    "Controlling steering yaw rates through high-velocity esses prevents destabilizing pendular motion across the chassis.",
    "Anticipating traffic flow patterns along dynamic expressways creates clear openings for decisive overtaking maneuvers.",
    "Modulating braking effort as downforce decreases prevents front wheel lockup in slow-speed hairpin corners.",
    "Carrying measured corner speed through off-camber curves prevents the vehicle from drifting into outer perimeter barriers.",
    "Executing controlled counter-steering inputs whenever the rear axle steps out quickly restores vehicle stability.",
    "Scanning track surface contours allows drivers to exploit banked turns for improved cornering grip and speed.",
    "Aligning vehicle wheels straight before applying full throttle out of slow corners eliminates costly wheel slip.",
    "Navigating tight industrial course corridors requires extreme spatial precision to clear roadside obstacles without contact.",
    "Adapting driving aggression to match course layout complexity prevents avoidable mistakes on technical tracks.",
    "Timing throttle application to coincide with corner exit unwinding delivers rapid acceleration down open straights.",
    "Maintaining stable chassis equilibrium through sudden directional chicanes requires rhythmic steering coordination.",
    "Monitoring track boundary lines closely ensures every maneuver stays within valid competitive course limits.",
    "Reading road camber angles enables drivers to position their vehicle where lateral gravitational assistance is greatest.",
    "Managing vehicle braking pitch through proper deceleration technique maintains consistent tire contact patches.",
    "Threading narrow gaps between rival competitors demands unwavering confidence and millimeter-accurate steering inputs.",
    "Anticipating surface elevation changes ensures drivers don't unweight tires when maximum turning grip is required.",
    "Balancing rapid line changes against chassis stability keeps vehicles responsive through complex multi-turn complexes.",
    "Approaching blind roadway crests with disciplined throttle modulation avoids dangerous loss of vehicular control.",
    "Executing smooth weight transfers from left to right turns preserves aerodynamic balance and mechanical grip.",
    "Navigating demanding urban street circuits requires razor-sharp awareness of concrete retaining walls and curbs.",
    "Maintaining disciplined racing lines through adverse weather conditions minimizes risks associated with standing water.",
    "Mastering the delicate interaction between throttle and steering angle unlocks true peak performance across all tracks."
  ];

  const p1S2 = [
    "Patience on the throttle pedal often yields faster overall stage times than uncontrolled full-speed aggression.",
    "Studying the curvature of upcoming turns helps drivers prepare proper deceleration points well before entering bends.",
    "Allowing the vehicle suspension to settle between rapid directional changes prevents sudden chassis imbalance.",
    "Conserving tire traction for critical passing zones gives skilled drivers a decisive competitive advantage.",
    "Recognizing when to concede track position prevents catastrophic collisions that end otherwise promising runs.",
    "Consistent visual scanning down the course prevents tunnel vision from compromising emergency reaction times.",
    "Applying steady braking pressure rather than sudden stabbing motions keeps the vehicle stable during deceleration.",
    "Understanding the balance between entrance speed and exit velocity transforms reckless driving into precision racing.",
    "Staying relaxed behind the controls reduces erratic steering corrections when the vehicle slides slightly.",
    "Observing road surface reflections helps drivers identify low-traction zones before their wheels lose grip.",
    "Developing a rhythmic feeling for vehicle weight transfer simplifies navigation across technical course sequences.",
    "Planning overtaking maneuvers two corners in advance ensures clean execution without risking unnecessary damage.",
    "Treating each corner as part of a connected sequence produces much smoother and faster driving rhythms.",
    "Recognizing the limits of tire adhesion prevents catastrophic spinouts on tight and demanding circuits.",
    "Maintaining a steady head and clear vision through congested sectors prevents panic-induced driving errors.",
    "Evaluating track topography allows drivers to make smarter line choices that maximize momentum through climbs.",
    "Giving rival vehicles sufficient clearance during side-by-side racing preserves finishing records over long sessions.",
    "Learning the specific braking thresholds of your machine turns difficult hairpins into prime overtaking opportunities.",
    "Managing vehicle inertia through gradual inputs creates predictable handling across high-speed chicanes.",
    "Adapting quickly to deteriorating road conditions separates reliable drivers from unpredictable competitors.",
    "Focusing on smooth steering wheel returns out of corners eliminates snap oversteer on high-power vehicles.",
    "Analyzing competitor weaknesses along straight sections opens easy avenues for clean and risk-free passes.",
    "Recognizing that slow-in and fast-out is the golden rule of road racing guarantees continuous lap time improvement.",
    "Monitoring vehicle positioning relative to apex curbs prevents aggressive bottoming out on low chassis cars.",
    "Keeping steering inputs minimal along high-speed straights reduces aerodynamic drag and tire scrub.",
    "Balancing courage with technical prudence allows drivers to push limits without crossing into catastrophic error.",
    "Paying close attention to engine sound cues aids in timing optimal acceleration bursts without looking down.",
    "Anticipating the reaction of traffic clusters prevents high-speed drivers from being boxed in behind slower units.",
    "Mastering trail-braking techniques allows the front tires to bite deeply into tight and medium-speed corners.",
    "Understanding course geometry enables drivers to straighten out complex curves and carry superior momentum.",
    "Staying patient behind stubborn blockers creates opportunities when their tires inevitably begin to overheat.",
    "Maintaining smooth throttle roll-on when exiting slow turns prevents sudden torque spikes from snapping the rear out.",
    "Recognizing how track temperatures influence grip levels helps drivers adapt their pace dynamically.",
    "Developing deep spatial awareness allows drivers to sense track limits instinctively without taking eyes off the road.",
    "Trusting your established braking markers prevents indecision from causing missed apexes and run-off penalties.",
    "Adjusting driving lines to avoid track debris keeps tires free from punctures and unexpected grip reductions.",
    "Balancing aggressive attack angles with defensive coverage secures earned track positions against persistent rivals.",
    "Reading subtle steering resistance changes provides immediate tactile feedback regarding current road surface grip.",
    "Exercising restraint when running side by side through tight chicanes prevents destructive contact for both cars.",
    "Focusing on consistent execution rather than single heroic laps produces superior long-term driving records.",
    "Recognizing when the vehicle chassis is fully loaded prevents counter-productive steering corrections mid-corner.",
    "Utilizing the entire width of the paved circuit minimizes turning radius and reduces lateral cornering strain.",
    "Maintaining composure when challenged from behind prevents unforced errors and missed deceleration zones.",
    "Scanning beyond the car directly ahead reveals upcoming slowdowns and accidents with valuable reaction time.",
    "Understanding how downforce levels change across various speeds prevents overestimating high-speed grip.",
    "Refining braking modulation technique turns difficult deceleration zones into areas of massive performance gains.",
    "Treating curb strikes with respect prevents suspension shocks from unsettling the car at critical moments.",
    "Exercising calm judgment during multi-vehicle scrambles ensures clean survival through the opening race laps.",
    "Maintaining disciplined focus over extended driving stints prevents fatigue from degrading precision timing.",
    "Developing a deep understanding of vehicle physics turns challenging race courses into masterclasses of driving art."
  ];

  const p1S3 = [
    "Ultimately, calm focus and mechanical sensitivity distinguish victorious drivers from those stranded in the gravel trap.",
    "Steady practice and calculated respect for physics turn challenging courses into effortless showcases of motorsport skill.",
    "Mastering these fundamental vehicle dynamics ensures drivers finish every demanding stage with pride and speed.",
    "Disciplined consistency behind the wheel remains the definitive hallmark of championship-caliber road racing.",
    "Developing an intuitive bond with vehicle handling characteristics produces confident driving across all game modes.",
    "Success on demanding tracks comes down to disciplined vehicle balance and unwavering situational awareness.",
    "Riders who prioritize clean lines and smooth inputs consistently outperform those relying on reckless speed.",
    "A composed mindset combined with crisp steering precision guarantees steady progress across every competition.",
    "Dedication to technical driving excellence unlocks the true thrilling potential of high-performance road racing.",
    "By honoring vehicle limits and refining cornering technique, drivers conquer the most intimidating roadway layouts.",
    "Consistency, patience, and precise throttle control form the unshakeable foundation of elite driving accomplishment.",
    "The journey toward driving mastery begins with respecting the delicate balance between friction and speed.",
    "Every clean stage completion proves that disciplined preparation always triumphs over uncalculated daring.",
    "Refining your driving craft stage after stage produces the confidence needed to handle extreme roadway challenges.",
    "Uncompromising focus on smooth execution transforms daunting obstacle-filled courses into triumphant victories.",
    "Mastering the delicate harmony between human input and vehicle physics delivers deeply satisfying racing triumph.",
    "True driving excellence is measured not merely by top speed, but by complete control across every sector.",
    "With patience and sharp concentration, drivers transform high-speed chaos into breathtaking motorsport precision.",
    "Cultivating deep vehicular understanding turns treacherous asphalt stretches into venues of triumphant mastery.",
    "Methodical track study and calm reaction under pressure consistently deliver superior driving accomplishments.",
    "The satisfaction of nailing a technical racing line remains one of the finest rewards in competitive driving.",
    "Precision driving rewards patience with blistering lap times and unbroken records across every course.",
    "By maintaining composure during demanding moments, skilled drivers carve clean paths toward the finish line.",
    "Mastering high-speed vehicle balance turns every challenging race track into an arena of confident victory.",
    "Focused commitment to technical racing principles guarantees remarkable driving growth across all stages.",
    "A calm demeanor at the wheel turns high-intensity velocity into controlled, artistic automotive precision.",
    "Every corner successfully negotiated builds the instinctual muscle memory that defines legendary driving talent.",
    "Through measured throttle discipline and sharp visual scanning, drivers master the art of speed.",
    "Embracing technical driving nuances ensures every race delivers an exhilarating, high-precision motorsport journey.",
    "The relentless pursuit of perfect racing lines transforms every session into an engaging celebration of speed.",
    "Patience, vision, and refined vehicular empathy ensure drivers overcome the stiffest competitive challenges.",
    "Mastering the subtle signals of vehicle balance creates a rewarding and commanding presence on any track.",
    "True speed emerges naturally once vehicle control and spatial awareness operate in complete harmony.",
    "A disciplined approach to vehicle dynamics turns unpredictable roadway courses into showcases of driving brilliance.",
    "Commitment to smooth inputs and clean racing etiquette cements a driver's reputation as a true track master.",
    "The thrill of commanding a finely balanced machine through difficult curves never diminishes with experience.",
    "Calm tactical decision-making under racing pressure consistently yields podium finishes and memorable records.",
    "By harmonizing acceleration, braking, and steering, drivers achieve seamless motion through all course layouts.",
    "Building a foundation of disciplined vehicle control ensures lifelong enjoyment and mastery of competitive racing.",
    "Unwavering focus on racing fundamentals turns every challenging circuit into an exhilarating test of skill.",
    "The art of driving lies in making high-speed navigation appear effortlessly smooth, controlled, and precise.",
    "Disciplined control over momentum and traction elevates casual drivers into respected track navigators.",
    "Every race completed with clean lines reinforces the enduring value of precision over uncontrolled haste.",
    "Developing acute sensitivity to weight transfer allows drivers to conquer even the most unforgiving tracks.",
    "A thoughtful, methodical driving style turns hazardous roadway obstacles into opportunities for creative mastery.",
    "Steering, throttle, and braking harmony unlocks the highest tier of competitive automotive performance.",
    "The mark of an accomplished driver is remaining totally composed when navigating the razor edge of grip.",
    "Mastering technical road courses rewards drivers with immense satisfaction and undeniable driving authority.",
    "Through patient practice and calculated maneuvers, drivers transform high-speed challenges into triumphant art.",
    "Excellence on the asphalt begins with respect for vehicle dynamics and ends with exhilarating victory."
  ];

  // P2 sentences
  const p2S1 = [
    "Smooth manipulation of steering inputs keeps the vehicle centered within optimal traction corridors during maneuvers.",
    "Modulating the accelerator with measured cadence prevents wheel spin from compromising straight-line acceleration.",
    "Applying progressive braking pressure ensures the front wheels retain directional control without abrupt skidding.",
    "Quick counter-steering adjustments catch rear axle slides before lateral momentum rotates the chassis into barriers.",
    "Coordinating handbrake engagement with sharp steering inputs allows for controlled drifts around tight urban pins.",
    "Rhythmic throttle tapping through low-speed hairpins maintains engine momentum without overpowering tire adhesion.",
    "Steady thumb or key pressure allows drivers to carve micro-adjustments along narrow barrier-lined bridges.",
    "Releasing the throttle momentarily transfers chassis weight forward, providing immediate steering bite into corners.",
    "Coordinating steering corrections with brake releases prevents unsettling the vehicle during technical switchbacks.",
    "Smooth digital key taps provide nuanced directional adjustments without destabilizing high-speed stability.",
    "Feathering the gas pedal during wet roadway conditions ensures wheels maintain continuous electrical traction.",
    "Quickly centralizing the steering wheel upon corner exit allows full engine power to propel the car forward.",
    "Balancing simultaneous braking and turning inputs demands delicate touch to avoid exceeding the traction circle.",
    "Deliberate keyboard or gamepad steering sweeps keep the vehicle planted securely along sweeping banked curves.",
    "Staging emergency deceleration through rapid, firm brake applications prevents destructive front-end impacts.",
    "Coordinating throttle lift-off with corner turn-in induces helpful chassis rotation on tight technical tracks.",
    "Fine-tuning steering angles through sweeping bends eliminates scrubbing speed against outside tire shoulders.",
    "Deploying handbrake taps with surgical precision enables rapid 180-degree turnarounds in tight parking bays.",
    "Executing gentle steering corrections at top velocity preserves aerodynamic stability and high terminal speed.",
    "Modulating brake pedal pressure during downhill descents prevents overheating brake friction surfaces.",
    "Smooth directional inputs prevent sharp vehicle weight transfers that unsettle tires across sudden road dips.",
    "Balancing steering angle against vehicle speed prevents front-end push into external retaining concrete barriers.",
    "Coordinating gear shifts or throttle surges at optimal torque peaks ensures uninterrupted acceleration runs.",
    "Applying light steering resistance through windy straightaways prevents gusting crosswinds from altering course.",
    "Holding steady acceleration through high-speed sweepers keeps the vehicle chassis firmly pressed against asphalt.",
    "Executing rapid directional flick maneuvers allows agile cars to dart through tight chicane obstacles.",
    "Disciplined throttle roll-on prevents aggressive wheel hop when launching vehicles from stationary starting gates.",
    "Releasing steering lock smoothly as corner exits open allows tires to maximize their forward tractive effort.",
    "Adjusting trajectory via subtle tap inputs ensures clean navigation through tight warehouse parking lanes.",
    "Coordinating emergency braking with defensive swerve maneuvers clears unexpected road blockades safely.",
    "Applying measured throttle pulses keeps turbocharged engines on boost through lengthy drift sections.",
    "Managing brake bias through balanced finger pressure keeps rear tires tracking straight under heavy stops.",
    "Smooth transition from braking to throttle application preserves continuous momentum through medium turns.",
    "Delicate touch on steering controls prevents rapid tire wear and keeps high-speed trajectories stable.",
    "Executing progressive throttle increases out of tight bends eliminates dangerous mid-corner oversteer snaps.",
    "Holding consistent steering lock through circular roundabout sections ensures predictable exit trajectory timing.",
    "Coordinating quick reverse maneuvers with rapid mirror scanning guarantees flawless parking bay alignment.",
    "Managing high-speed stability through measured steering cadence prevents tank-slapper oscillations on bikes.",
    "Feathering the brakes while turning helps tuck the vehicle nose cleanly toward inside corner apex markers.",
    "Applying steady throttle through uphill gradients prevents engine bogging and maintains strong climbing velocity.",
    "Executing rapid directional inputs with rhythm allows nimble vehicles to weave through dense traffic jams.",
    "Balancing brake pedal modulation against wheel lockup warnings preserves vital steering maneuverability.",
    "Smoothly releasing the handbrake upon initiating drift angles keeps vehicle momentum traveling in the intended direction.",
    "Fine-tuning steering trim through lengthy straightaways ensures straight tracking without unnecessary scrub.",
    "Coordinating throttle let-off with evasive maneuvers avoids catastrophic collisions with stationary course hazards.",
    "Managing lateral cornering forces through steady input pressure keeps high-center-of-gravity trucks upright.",
    "Applying gentle counter-steering pressure stabilizes two-wheeled vehicles through rapid lean angle changes.",
    "Executing deliberate input sequences prevents panic-driven button mashing during sudden race incidents.",
    "Modulating throttle output during low-traction starts delivers immediate forward drive ahead of rivals.",
    "Mastering exact input timing ensures every vehicular response feels crisp, predictable, and deeply satisfying."
  ];

  const p2S2 = [
    "Developing sensitivity to virtual vehicle weight creates an intuitive mental map of dynamic handling limits.",
    "Taking mental note of track landmark indicators provides foolproof cues for when to begin decelerating.",
    "Watching vehicle tire angle alignment ensures inputs match the realistic turning limits of the front axle.",
    "Anticipating the lag between input application and chassis response prevents costly over-correction mistakes.",
    "Keeping eyes fixed on the distant exit point naturally guides your hands toward the optimal steering arc.",
    "Treating each input device with gentle respect produces significantly cleaner racing lines than jerky motions.",
    "Listening closely to engine revs and tire squeals provides vital auditory feedback regarding current grip.",
    "Allowing the vehicle suspension to absorb curb impacts before initiating fresh inputs avoids chassis upset.",
    "Recognizing when the front wheels are pushing allows drivers to reduce steering angle and regain front grip.",
    "Staying calm during unexpected tail-slides allows instinctual counter-steering to resolve the slip naturally.",
    "Visualizing your trajectory two seconds into the future makes rapid vehicle control feel relaxed and controlled.",
    "Practicing smooth input transitions eliminates jarring vehicle movements that compromise cornering speed.",
    "Developing light fingertip control on directional keys prevents forearm fatigue during lengthy racing sessions.",
    "Noticing subtle shifts in vehicle attitude provides early warnings of impending loss of road traction.",
    "Calibrating your braking distance expectations to current vehicle velocity avoids embarrassing overshoots.",
    "Treating the digital throttle as an analog instrument through quick pulses unlocks surprising traction control.",
    "Maintaining relaxed physical posture while handling difficult stages promotes faster and more accurate reflexes.",
    "Understanding that less steering lock often produces more turning grip prevents destructive understeer.",
    "Trusting established visual reference points keeps your driving consistent lap after lap under pressure.",
    "Observing how vehicle momentum behaves on different road grades allows for smart energy conservation.",
    "Developing an ear for tire scrub sounds alerts you immediately when lateral cornering force is exceeded.",
    "Recognizing that smooth inputs preserve tire health ensures peak grip remains available for the final laps.",
    "Practicing quick recoveries from simulated spins builds the confidence needed to drive near the edge.",
    "Visualizing clean geometric arcs through complex turn complexes simplifies high-speed directional choices.",
    "Keeping steering corrections concise and purposeful prevents destructive vehicle oscillations down straights.",
    "Understanding the relationship between speed and required braking distance prevents panic-induced lockups.",
    "Developing consistent braking muscle memory allows you to focus mental energy entirely on traffic ahead.",
    "Respecting the delay inherent in heavy transport vehicles prevents reckless high-speed cornering attempts.",
    "Maintaining sharp hand-eye coordination ensures split-second evasive maneuvers are executed flawlessly.",
    "Recognizing how vehicle ride height affects curb tolerance avoids destructive chassis bottoming incidents.",
    "Practicing disciplined throttle roll-on transforms aggressive acceleration from a gamble into a science.",
    "Keeping inputs synchronized with vehicle chassis roll cycles creates exceptionally fluid racing motion.",
    "Developing a keen awareness of vehicle dimensions simplifies thread-the-needle passes through tight packs.",
    "Learning to read subtle camera shake cues provides clear indications of impending vehicle instability.",
    "Remaining patient when trapped behind defensive opponents preserves vehicle health for decisive moments.",
    "Developing consistent rhythm across repeating course sections turns complex tracks into second nature.",
    "Anticipating how different road surface textures affect braking bite prevents sudden barrier strikes.",
    "Treating reverse gear maneuvering with equal seriousness builds comprehensive, well-rounded driving mastery.",
    "Watching competitor tire smoke signals provides immediate warnings of unexpected braking events ahead.",
    "Developing intuitive timing for handbrake releases guarantees crisp, stylish drift recoveries on demand.",
    "Keeping steering inputs measured and deliberate prevents overloading front tire contact patches in turns.",
    "Recognizing the critical moment when tires regain grip allows drivers to apply full throttle instantly.",
    "Understanding how downhill gradients extend braking zones keeps vehicles safe from high-speed overshoots.",
    "Maintaining gentle pressure on direction controls allows the vehicle chassis to settle into its natural groove.",
    "Building an internal stopwatch for stage section times helps gauge whether line adjustments yield real gains.",
    "Respecting the laws of centrifugal force ensures drivers never enter high-camber curves too hot.",
    "Developing smooth pedal or key coordination turns technical driving tests into displays of pure grace.",
    "Remaining composed after minor mistakes ensures one small error doesn't snowball into a catastrophic crash.",
    "Practicing consistent apex hitting builds the bedrock foundation required for competitive racing victory.",
    "Developing complete trust in your vehicle's mechanical capabilities unlocks fearless high-speed navigation."
  ];

  const p2S3 = [
    "Consistent mastery over these mechanical controls ensures drivers conquer every track challenge with flair.",
    "Refining your input technique turns difficult driving simulations into deeply satisfying tests of skill.",
    "Through composed hand coordination and sharp eyes, players command the road with absolute authority.",
    "Developing this level of technical control transforms every demanding stage into a showcase of driving art.",
    "Reliable control execution remains the decisive factor separating victorious racers from the rest.",
    "With disciplined practice and calm concentration, every challenging road layout becomes second nature.",
    "Mastering precise control nuances delivers an exceptionally rewarding and authentic racing experience.",
    "These refined control habits guarantee consistent stage completions and personal best record times.",
    "Steering and throttle harmony transforms high-speed driving into a thrilling exhibition of precision.",
    "Dedication to crisp input mechanics unlocks the full high-performance potential of every vehicle.",
    "Confident execution of these controls ensures players conquer narrow urban roads and high-speed tracks alike.",
    "Through patient control refinement, drivers achieve total harmony with their machine on every run.",
    "Mastering the subtle language of vehicular inputs produces unmatched satisfaction on the virtual tarmac.",
    "Disciplined input execution ensures you finish every demanding race session with pride and triumph.",
    "Total command over steering and braking transforms intimidating obstacle courses into thrilling playgrounds.",
    "Consistent precision at the controls turns every competitive encounter into a masterclass of speed.",
    "With these refined driving skills, navigating crowded roadways becomes an exhilarating, fluid adventure.",
    "True driving pleasure emerges when mechanical inputs become an effortless extension of your thoughts.",
    "Composed control management under intense pressure guarantees memorable victories and broken records.",
    "Developing flawless control reflexes ensures you master every curve, straightaway, and parking bay.",
    "This measured approach to vehicle operation delivers dependable success across all competitive modes.",
    "Refining these input habits turns challenging time trials into effortless celebrations of velocity.",
    "Steering precision and throttle discipline together create the ultimate formula for track domination.",
    "With steady control and sharp reflexes, players conquer technical roadway challenges with confidence.",
    "Mastering input nuances elevates your driving from casual participation to true motorsport mastery.",
    "Consistent control habits turn unpredictable race scenarios into predictable, satisfying triumphs.",
    "Developing crisp input dexterity unlocks exhilarating performance across every demanding course.",
    "These disciplined driving techniques ensure every session ends with clean lines and fast finishes.",
    "Total control mastery allows drivers to extract maximum velocity from every single chassis.",
    "Composed control execution under race pressure distinguishes elite navigators from average drivers.",
    "Through dedicated input practice, players transform technical driving obstacles into artful victories.",
    "Mastering control dynamics delivers the confidence needed to tackle the world's most daunting tracks.",
    "Disciplined control habits guarantee safe navigation through chaotic traffic and treacherous terrain.",
    "Refined vehicle manipulation turns complex driving puzzles into smooth, deeply enjoyable achievements.",
    "With steady inputs and razor-sharp timing, players achieve total dominance over their racing line.",
    "Developing intuitive control mastery makes high-speed vehicle handling feel natural and thrilling.",
    "These proven input practices provide the reliable foundation needed to triumph in any vehicle class.",
    "Total command over steering, gas, and brakes transforms every circuit into an exciting triumph.",
    "Consistent control refinement unlocks the true artistic beauty of competitive precision racing.",
    "Through patient practice, drivers command every stage with effortless poise, speed, and precision.",
    "Mastering mechanical input rhythm turns difficult roadway maneuvers into second nature successes.",
    "Disciplined control execution remains the most dependable secret to continuous racing progression.",
    "With calm input delivery and sharp focus, players overcome the steepest competitive driving odds.",
    "Developing refined control habits ensures every lap is completed with textbook accuracy and speed.",
    "Total input authority transforms chaotic high-speed environments into arenas of calm mastery.",
    "Consistent control technique turns technical asphalt challenges into exhilarating driving wins.",
    "Mastering these crucial vehicle controls guarantees long-term enjoyment and competitive mastery.",
    "Through measured input discipline, drivers write their names at the very top of the track leaderboards.",
    "Developing deep control synergy turns every demanding race into an unforgettable motorsport showcase.",
    "Ultimate driving satisfaction begins with mastering the delicate, powerful language of vehicle controls."
  ];

  for (let i = 0; i < 50; i++) {
    p1.push(`${p1S1[i]} ${p1S2[i]} ${p1S3[i]}`);
    p2.push(`${p2S1[i]} ${p2S2[i]} ${p2S3[i]}`);
  }
  return { p1, p2 };
}

// Generate driving and verify uniqueness
const driving = buildDriving();
console.log('Driving P1 count:', driving.p1.length, 'Driving P2 count:', driving.p2.length);

const allP1Runs = new Set();
let dupP1 = 0;
for (const text of driving.p1) {
  const runs = get6WordRuns(text);
  for (const r of runs) {
    if (allP1Runs.has(r)) dupP1++;
    allP1Runs.add(r);
  }
}
console.log('Duplicate 6-word runs in Driving P1:', dupP1);

const allP2Runs = new Set();
let dupP2 = 0;
for (const text of driving.p2) {
  const runs = get6WordRuns(text);
  for (const r of runs) {
    if (allP2Runs.has(r)) dupP2++;
    allP2Runs.add(r);
  }
}
console.log('Duplicate 6-word runs in Driving P2:', dupP2);

module.exports = { buildDriving };