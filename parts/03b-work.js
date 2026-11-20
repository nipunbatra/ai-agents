// Part 3b: agents at work, second half. Science and engineering (Google's AI co-scientist, a robot lab, AlphaEvolve),
// India and sustainability (a Gujarati farm advisory, a city air-quality desk, campus cooling, a clinic scribe), the
// stakes map of every application (a live figure) and the recap of Part 3.
// Numbers: data/p3b.json (scripts/sci/p3b.py: verified.md rows 9 to 15, and figures read from the farm and analyst
// runs), data/apps.json (scripts/sci/apps.py: the map), data/traces.json (the real runs).
import {S_,app,recap,chap,slides,css,esc,num,big,word,Word,kY,kT,kR,kG,only,msg,data,need,
 fig,label,line,arrow,gat,gonly,COL,MUTED,PAPER,icon,iconHTML,widget,register,nb} from '../kit.js';

const D=need(await data('p3b'),'coscientist','lab','robin','evolve','kisan','farmerchat','clinic','farm','air');
const APPS=need(await data('apps'),'apps','families','zones'),T=need(await data('traces'),'date_text','model');

css(`.state-slot>[data-only]:has(>.p3b-adv){align-self:center}.p3b-adv .msg .mb{font-size:24px;line-height:1.6}.p3b-adv .msg .mh em{font-size:17px}
.p3b-memo{color:var(--data);font-weight:650}
.p3b-map{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:center}
.p3b-map svg{max-height:456px}
.p3b-side{display:flex;flex-direction:column;gap:14px;min-width:0}
.p3b-qs{display:flex;flex-direction:column;gap:20px}
.p3b-qs>div{display:grid;grid-template-columns:30px 1fr;gap:12px;align-items:start}
.p3b-qs h3{font-size:22px;margin:0 0 4px}.p3b-qs p{font-size:19px;line-height:1.38;color:#374151}
.p3b-live{display:flex;flex-direction:column;gap:12px}
.p3b-fams{display:flex;flex-direction:column;gap:4px;align-items:flex-start}
.p3b-fams button,.p3b-fams span{display:inline-flex;align-items:center;gap:9px;font:inherit;font-size:17px;line-height:1.2;color:var(--ink);background:transparent;border:1.5px solid transparent;border-radius:999px;padding:3px 12px 3px 6px;cursor:pointer;white-space:nowrap}
.p3b-fams button:hover{border-color:var(--line)}.p3b-fams button[aria-pressed="true"]{border-color:var(--ink);font-weight:650}
.p3b-fams svg,.p3b-card h3 svg{flex:none}
.p3b-card{border:2px solid var(--line);border-left-width:7px;border-radius:12px;background:#fff;padding:9px 14px 11px}
.p3b-card h3{font-size:21px;margin:0 0 4px;display:flex;align-items:center;gap:8px}
.p3b-card p{font-size:18px;line-height:1.36}.p3b-card .p3b-z{margin-top:6px;font-size:17px}
.p3b-judge{display:flex;gap:8px;align-items:flex-start;font-size:16px;line-height:1.3;color:var(--muted)}.p3b-judge svg{flex:none;margin-top:1px}
.p3b-zl{display:flex;flex-direction:column;gap:7px}.p3b-zl p{font-size:16px;line-height:1.3}
.p3b-pt{cursor:pointer;outline:none}.p3b-pt .p3b-ring{opacity:0}.p3b-pt.on .p3b-ring,.p3b-pt:focus-visible .p3b-ring{opacity:1}
.p3b-map.dimfam .p3b-pt:not(.hl){opacity:.16}
@media(max-width:760px){.reading .p3b-map{grid-template-columns:minmax(0,1fr)}}`);

// The lane settings every application card of Part 3 uses (as in 03a), so both halves look the same.
const CARD={laneH:82,fs:17,laneOpts:{gap:4,left:204}};
/** Where lanes() puts step i of n on a card with an illustration (the same arithmetic as figures.js, for CARD). */
const laneAt=(n,i,lane)=>{const {laneH,fs,laneOpts:{gap,left}}=CARD,W=960,r=Math.max(16,Math.min(25,Math.floor((laneH-14-2*(fs+2)-fs*.3)/2)));
 return [left+(W-left-6)/n*(i+.5),4+['you','agent','tools'].indexOf(lane)*(laneH+gap)+r+5,r];};
/** Add SVG to an application slide's trace, shown from click k (a local helper around app()). */
function addToTrace(id,k,svg){
 const s=slides.find(x=>x.id===id),re=/(<div class="diagram-scroll lanes">[\s\S]*?)(<\/svg><\/div>)/;
 if(!s||!re.test(s.body))throw new Error(`${id}: no trace to add to`);
 s.body=s.body.replace(re,(m,a,b)=>a+gat(k,svg)+b);
}
/** Replace an application slide's trace and facts strip with other content from click k. */
function swapAt(id,k,main,strip){
 const s=slides.find(x=>x.id===id),re=/<div class="diagram-scroll lanes">[\s\S]*?<\/svg><\/div>/,facts='<div data-at="2"><div class="facts';
 if(!s||!re.test(s.body)||!s.body.includes(facts))throw new Error(`${id}: no trace or facts to swap`);
 const before=k-1>2?`2-${k-1}`:'2';
 s.body=s.body.replace(re,m=>only(`1-${k-1}`,m)+only(String(k),main)).replace(facts,`<div data-only="${before}"><div class="facts`)+only(String(k),strip);
}

// ---------------------------------------------------------------------------------------- 3.3 science and engineering
chap('3.3','Science and engineering');
const CS=D.coscientist;
app('app-coscientist','Google’s AI co-scientist: several agents, one goal',{...CARD,img:'app-coscientist.jpg',
 alt:'Illustration: three scientists at a whiteboard of molecules, hypothesis cards pinned in a tournament bracket',
 who:'A microbiology team',req:'How do these genetic islands spread across bacteria? Give us testable ideas.',
 names:{you:'Scientists',agent:'Agents'},
 steps:[{lane:'you',icon:'target',t:'Research\ngoal'},{lane:'agent',icon:'spark',t:'Generate\nideas'},{lane:'agent',icon:'chat',t:'Debate\neach idea'},
  {lane:'agent',icon:'scale',t:'Rank in a\ntournament'},{lane:'agent',icon:'refresh',t:'Evolve,\nre-rank'},
  {lane:'you',icon:'approve',t:'Scientist\npicks',kind:'check'},{lane:'tools',icon:'flask',t:'Lab\ntests'}],
 tools:[['search','web search'],['file','papers'],['flask','the team’s lab']],
 check:'Scientists choose which ideas earn lab time, then run the experiments.',
 evidence:{big:`${CS.days} days`,text:'to propose the mechanism an Imperial College team had found but not yet published.'},
 lines:['It splits a research goal across several agents, each with its own job.',
  'The agents generate, debate, rank and refine ideas. The scientists see only the top-ranked ones.'],
 ask:['How would you check whether a new hypothesis is any good?','Where are the checks in this loop?'],
 expected:['Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.',
  'Twice: the agents’ own debate and tournament, which cost little and can be wrong; then the scientists’ lab experiments, which are slower and test the idea directly.'],
 point:'Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.',
 misconception:'That the co-scientist discovered something unknown. It reached, on its own, a result the Imperial team had found but not yet published; the experiments were theirs.',
 transition:'What if the agent could run the experiment too?',
 source:`Google Research blog, ${CS.date} (built on ${CS.model}); the ${word(CS.days)} days are from Google’s paper, arXiv ${CS.arxiv}. Trace simplified; it also searches the literature.`});

const L=D.lab,RB=D.robin;
app('app-lab','A chemistry experiment on a lab robot',{...CARD,img:'app-lab.jpg',
 alt:'Illustration: a robotic arm pipetting liquid into test tubes and a well plate in a bright laboratory',
 who:'A chemistry lab',req:'Plan and run a palladium-catalysed coupling on our liquid-handling robot.',
 names:{you:'Chemist'},
 steps:[{lane:'you',icon:'target',t:'Set the\nreaction'},{lane:'tools',icon:'search',t:'Search\nthe web'},{lane:'tools',icon:'file',t:'Read the\nmanual'},
  {lane:'agent',icon:'list',t:'Plan the\nsteps'},{lane:'agent',icon:'code',t:'Write\nrobot code'},{lane:'you',icon:'approve',t:'Chemist\napproves',kind:'check'},
  {lane:'tools',icon:'robot',t:'Robot\npipettes'},{lane:'tools',icon:'chart',t:'Measure\nthe yield',kind:'done'}],
 tools:[['search','web search'],['file','robot manual'],['robot','liquid handler'],['chart','plate reader']],
 check:'Our design: a chemist approves the plan before the robot runs. Instruments check every result.',
 evidence:{big:'Coscientist',text:`(${L.journal}, ${L.year}) ran these couplings on lab robots. Robin (${RB.year}) proposed a drug for an eye disease.`},
 lines:['A chemistry goal, a web search and the robot’s manual. Can a model turn these into a working experiment?',
  'The one approval comes just before reagents are used.'],
 ask:['What would worry you about letting a model drive lab equipment?','Why put the approval there, and not at the end?'],
 expected:['Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.',
  'Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.'],
 point:'When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.',
 misconception:`That these systems replace the lab team. Robin proposed ${RB.drug} as a candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.`,
 transition:'And when a program can score every attempt, the person can step back further.',
 source:`Coscientist: Boiko, MacKnight, Kline and Gomes, ${L.journal}, ${L.date}. Robin: FutureHouse, ${RB.date}. The approval step is our addition.`});

const E=D.evolve;
app('app-evolve','AlphaEvolve: a program scores every attempt',{...CARD,img:'app-evolve.jpg',
 alt:'Illustration: a tree of code blocks growing upward beside rows of data-centre servers',
 who:'Google’s engineers',req:'Find a better rule for placing jobs on our servers. Our code scores each one.',
 names:{you:'Engineers'},
 steps:[{lane:'you',icon:'target',t:'Goal and\nscorer'},{lane:'agent',icon:'code',t:'Propose\ncode'},{lane:'tools',icon:'terminal',t:'Run and\nscore',kind:'done'},
  {lane:'tools',icon:'database',t:'Keep\nthe best'},{lane:'agent',icon:'branch',t:'Mutate,\nrepeat'},{lane:'tools',icon:'terminal',t:'Score\nagain',kind:'done'},
  {lane:'tools',icon:'database',t:'Keep the\nwinner'},{lane:'you',icon:'approve',t:'Engineers\nreview',kind:'check'}],
 tools:[['terminal','automatic evaluator'],['database','store of programs']],
 check:'Engineers write the scorer, then read the winning code before it ships.',
 evidence:{big:`${num(E.compute_pct,1)}%`,text:`of Google’s worldwide compute recovered by a scheduling rule it found. A Gemini kernel: ${E.kernel_pct}% faster.`},
 lines:['Here the request comes with a scoring program that rates any code the agent writes.',
  'The two green steps: the program checks every attempt. The engineers read only the best one.'],
 ask:['Who has to look at each attempt?','Which problems in your work come with an automatic scorer?'],
 expected:['No person: the program scores each attempt in seconds, day and night.',
  `Scheduling, routing, compression, anything with a test suite or a cost model. AlphaEvolve also multiplied ${E.matrix}×${E.matrix} complex matrices with ${E.mults} multiplications, and its faster kernel cut Gemini’s training time by ${E.training_pct}%.`],
 point:'Because the check is a program, the loop can run without a person looking at each attempt.',
 misconception:'That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the evaluator does much of the work.',
 transition:'From the lab and the data centre to the field: agents in India and sustainability.',
 source:`Google DeepMind blog, ${E.date}.`});

// ---------------------------------------------------------------------------------------- 3.4 India and sustainability
chap('3.4','India and sustainability');
const F=D.farm,K=D.kisan,FC=D.farmerchat;
// The real advisory: the numbers it took from the forecast in teal, from the crop notes in blue.
const advisory=()=>{let h=esc(F.draft);
 for(const x of F.from_forecast)h=h.replace(esc(x),kT(esc(x)));
 for(const x of F.from_notes)h=h.replace(esc(x),`<span class="p3b-memo">${esc(x)}</span>`);
 return `<div class="p3b-adv">${msg('model',`<span lang="gu">${h}</span>`,{note:'passed the critic'})}</div>`;};
// The forecast it read, one cell a day; the coldest night, which the advisory quotes, in teal.
const sun=(cx,cy,c)=>`<circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${c}" stroke-width="2.4"/>`+
 [...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return line(cx+12*Math.cos(a),cy+12*Math.sin(a),cx+17*Math.cos(a),cy+17*Math.sin(a),{stroke:c,w:2.4,extra:'stroke-linecap="round"'});}).join('');
const forecastStrip=()=>{const W=1152,H=84,x0=262,cw=(W-x0)/F.days.length;
 let g=icon('thermo',18,42,30,COL.target)+label(42,36,'Forecast used',{size:20,fill:COL.target,weight:650})+
  label(42,64,`${esc(F.place)}: rain chance ${F.rain_chance_max}%`,{size:18});
 F.days.forEach((d,i)=>{const x=x0+i*cw,lo=d.min_c===F.low_c;
  g+=`<rect x="${(x+4).toFixed(1)}" y="4" width="${(cw-8).toFixed(1)}" height="${H-8}" rx="12" fill="#0F766E0D" stroke="#0F766E33" stroke-width="1.5"/>`+
   sun(x+28,42,COL.target)+label(x+54,36,esc(d.day),{size:19,fill:COL.ink,weight:650})+
   label(x+54,65,`${num(d.max_c,1)}° /`,{size:19,fill:MUTED})+label(x+54+66,65,`${num(d.min_c,1)}°`,{size:19,fill:lo?COL.target:MUTED,weight:lo?700:''});});
 return fig(W,H,g,`The forecast for ${F.place}, ${F.first} to ${F.last}: highest and lowest temperature each day, no rain`);};
const FSTEPS=[{lane:'you',icon:'mic',t:'Voice\nnote'},{lane:'tools',icon:'chat',t:'Speech\nto text'},{lane:'tools',icon:'thermo',t:'Weather\nforecast'},
 {lane:'tools',icon:'notes',t:'Crop\nnotes'},{lane:'agent',icon:'pen',t:'Draft in\nGujarati'},{lane:'agent',icon:'check',t:'Critic\nchecks',kind:'done'},
 {lane:'you',icon:'approve',t:'Agronomist\napproves',kind:'check'},{lane:'tools',icon:'send',t:'Voice\nreply'}];
app('app-farmer',`A farm advisory in Gujarati, by voice`,{...CARD,builds:3,nb:nb('part-3'),img:'app-farmer.jpg',
 alt:'Illustration: a Gujarati farmer in a white turban in a flowering cumin field at sunrise, holding a phone with a voice message',
 who:'A cumin farmer, by voice',req:'Is it time to sow and water my cumin?',
 names:{you:'People'},steps:FSTEPS,
 tools:[['mic','speech to text'],['thermo','weather forecast'],['notes','crop notes'],['send','WhatsApp voice']],
 check:'An agronomist approves each advisory before it goes out.',
 evidence:{big:`${K.answered_m} million+`,text:`questions answered by Kisan e-Mitra. Farmer.Chat serves ${FC.farmers_lo_m} to ${FC.farmers_hi_m} million farmers.`},
 lines:[`A farmer near ${esc(F.place)} sends a voice note in Gujarati. What does an agent need to answer it?`,
  'Two checks before the farmer hears it: a critic model, then an agronomist.',
  'The reply from our run. Teal numbers come from the forecast, blue from the crop notes.'],
 ask:['What could go wrong with an answer to this farmer?','Why both a critic model and an agronomist?','Where did each number in the reply come from?'],
 expected:['The wrong weather, advice meant for another region, or a language the farmer does not read. Hence the forecast, the local crop notes and Gujarati.',
  'The critic catches unsupported claims cheaply. The agronomist owns the advice, because a lost crop cannot be undone, and a photo of a sick plant needs a trained eye.',
  `In English: rain chance ${F.rain_chance_max}% from ${F.first} to ${F.last}, nights down to ${num(F.low_c,1)} °C; cool, dry weather suits cumin, so sow this week and water lightly at once, then every ${F.interval[0]} to ${F.interval[1]} days. It passed all ${word(F.checks)} of the critic’s checks in round ${word(F.rounds)}.`],
 point:'For a farmer the agent works in the farmer’s language, by voice, with local data; a person approves the advice and takes the hard cases.',
 misconception:`That a chatbot alone can advise farmers. Without the forecast and local crop notes it would guess, as the chatbot in the opening did. (Kisan e-Mitra: “more than ${K.answered_lakh} lakh” answers in ${K.languages} languages, over ${big(K.per_day)} a day, per the PIB note.)`,
 demo:'Notebook 3.4: run the writer and the critic; change the place or the crop and watch the checks.',
 transition:'The same loop can watch a whole city’s air.',
 source:`Click 3: our real run (notebook Part 3, ${T.date_text}); crop notes illustrative; voice steps and approval are a design. Kisan e-Mitra: PIB, ${K.date}. Farmer.Chat: Digital Green.`});
{ // the side branch: a photo of a sick plant leaves the voice-note line for an extension worker
 const n=FSTEPS.length,[x0,y,r]=laneAt(n,0,'you'),[x1]=laneAt(n,1,'you'),[x5]=laneAt(n,5,'you'),c=COL.amber,px=x1+30,pw=x5-px-24;
 addToTrace('app-farmer',2,arrow(x1+2,y,px-4,y,{stroke:c,w:2,head:9,dash:'5 4'})+
  `<rect x="${px.toFixed(1)}" y="${y-16}" width="${pw.toFixed(1)}" height="32" rx="16" fill="#fff" stroke="${c}" stroke-width="1.6" stroke-dasharray="5 4"/>`+
  icon('image',px+20,y,20,c)+label(px+38,y+6,'Pest photo: an extension worker',{size:16,fill:c,weight:650}));
}
swapAt('app-farmer',3,advisory(),forecastStrip());

const AQ=D.air,city=n=>AQ.cities.find(c=>c.city===n);
app('app-air','Air-quality alerts for a city',{...CARD,nb:nb('part-3'),img:'app-air.jpg',
 alt:'Illustration: a hazy city skyline, an air-quality sensor pole, a school, and a phone alert with a mask symbol',
 who:'A city air-quality desk',names:{you:'Officer'},req:'Where will PM2.5 cross the standard tomorrow, and whom should we warn?',
 steps:[{lane:'tools',icon:'clock',t:'Every\nmorning'},{lane:'tools',icon:'pin',t:'Station\nreadings'},{lane:'tools',icon:'wind',t:'Air\nforecast'},
  {lane:'agent',icon:'target',t:'Find\nhotspots'},{lane:'agent',icon:'pen',t:'Draft\nadvisory'},{lane:'you',icon:'approve',t:'Officer\napproves',kind:'check'},
  {lane:'tools',icon:'send',t:'Alert\nschools'}],
 tools:[['pin','stations'],['wind','CAMS air forecast'],['database','schools, hospitals'],['send','SMS, WhatsApp']],
 check:'An officer approves every advisory before it is sent.',
 evidence:{label:'From our data',big:`${AQ.cities[0].over} of ${AQ.days}`,
  text:`winter days over ${AQ.standard}&nbsp;µg/m³ in ${AQ.cities[0].city}; Delhi ${city('Delhi').over}, Gandhinagar ${city('Gandhinagar').over}. Model estimates (CAMS).`},
 lines:['Each morning a city’s pollution desk decides where to warn people. Which parts could an agent do?',
  'The agent gathers the data and drafts the alerts. An officer approves each alert before it is sent.'],
 ask:['Who should be warned when PM2.5 spikes?','What would a false alarm cost, and a missed one?'],
 expected:['Schools, hospitals, outdoor workers, people with asthma. Each needs a different message.',
  'Closed schools and lost trust for a false alarm; children breathing bad air for a missed one. The officer owns that decision.'],
 point:'An agent can gather the data and draft the alerts every morning; a person signs each alert, because schools and hospitals act on it.',
 misconception:'That CAMS numbers are station measurements. They are estimates from a model that takes in satellite data; a real desk would check them against its own stations.',
 transition:'Buildings are easier: there, a simulator and a meter check every decision.',
 source:`The trace is our design. Days over the standard, ${AQ.from} to ${AQ.to}: our analyst run (notebook Part 3, ${esc(AQ.model)}) on CAMS estimates via Open-Meteo.`});

app('app-building','Building energy: when to cool the lecture halls',{...CARD,img:'app-building.jpg',
 alt:'Illustration: a campus building with rooftop solar panels and air-conditioning units, and a facilities manager with a tablet',
 who:'A campus facilities team',req:'Keep the lecture halls cool for this week’s classes at the lowest electricity bill.',
 names:{you:'Manager'},
 steps:[{lane:'tools',icon:'calendar',t:'Class\ntimetable'},{lane:'tools',icon:'thermo',t:'Weather,\ntariff'},{lane:'agent',icon:'list',t:'Plan\ncooling'},
  {lane:'tools',icon:'code',t:'Simulate\nthe week',kind:'done'},{lane:'tools',icon:'rupee',t:'Predicted\nbill'},{lane:'you',icon:'approve',t:'Manager\nsigns off',kind:'check'},
  {lane:'tools',icon:'building',t:'Set the\nschedule'},{lane:'tools',icon:'pulse',t:'Meter and\nreport',kind:'done'}],
 tools:[['calendar','timetable'],['thermo','forecast'],['rupee','tariff'],['code','simulator'],['zap','building controls']],
 check:'The manager approves the first schedules, then spot-checks.',
 evidence:{label:'Why it can run',text:'A simulator scores each schedule before it runs, and the meter shows what it saved.'},
 lines:['A campus wants cool lecture halls and a lower electricity bill. What would an agent need to know?',
  'The class timetable, the weather and the hourly tariff decide when to pre-cool, before the peak price.'],
 ask:['Which data would you give it?','Why can this run with less supervision than the air alerts?'],
 expected:['When the rooms are used, how hot it will be, and when power is cheap. Cooling before the peak tariff saves money.',
  'Checking is cheap: the simulator scores a plan before it runs, the meter after. A bad schedule costs some rupees and comfort for a day, and is fixed the next.'],
 point:'When a simulator and a meter check every decision, the agent can run day to day while a person reads the weekly report.',
 transition:'Last, the most personal setting: a doctor’s clinic.',
 source:'The trace is our design.'});

const CL=D.clinic;
app('app-clinic','Clinic notes: a draft from the consultation',{...CARD,img:'app-clinic.jpg',
 alt:'Illustration: a doctor and a patient talking across a desk in a small Indian clinic, a recorder and a tablet on the desk',
 who:'A doctor in a busy clinic',req:'Listen to this consultation, in Gujarati and English, and draft my notes.',
 names:{you:'People'},
 steps:[{lane:'you',icon:'person',t:'Patient\nconsents',kind:'check'},{lane:'tools',icon:'mic',t:'Listen'},{lane:'tools',icon:'file',t:'Transcribe'},
  {lane:'agent',icon:'pen',t:'Draft\nthe note'},{lane:'you',icon:'approve',t:'Doctor edits,\nsigns',kind:'check'},{lane:'tools',icon:'database',t:'File in\nthe record'}],
 tools:[['mic','microphone'],['file','speech to text'],['database','health record']],
 check:'The doctor reads, corrects and signs every note before it is filed.',
 evidence:{big:`About ${big(CL.hours)} hours`,text:`of note-writing saved for ${big(CL.physicians)} doctors over ${CL.encounters_m} million visits, in about ${CL.months} months.`},
 lines:['A doctor in a busy OPD sees patient after patient, then writes the notes. Could an agent listen and draft them?',
  'Two amber steps: the patient’s consent first, the doctor’s signature last.'],
 ask:['What must happen before the recorder is switched on?','Would you let the scribe file notes without the doctor’s signature?'],
 expected:['The patient agrees. Consent is the first step of the trace, and a person gives it.',
  'No: the note goes into a medical record. The time saved comes from editing a draft instead of writing from scratch; the review stays.'],
 point:`The scribe saves writing time and the doctor keeps every decision: Kaiser Permanente’s doctors saved about ${big(CL.hours)} hours of note-writing in about ${CL.months} months.`,
 misconception:'That the scribe makes the diagnosis. It writes down what was said; the doctor decides.',
 transition:`${Word(APPS.apps.length)} jobs so far. Can one picture say how much freedom each should get?`,
 source:`The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, ${CL.from} to ${CL.to}; about ${big(CL.hours)} hours as reported by the AMA.`});

// ---------------------------------------------------------------------------------------- the stakes map (live)
chap();
// Families by shape, in one neutral ink, so the role colours (person, model, tools, risk, checked) keep their meaning.
const SHAPE={knowledge:'circle',ops:'square',science:'triangle',india:'diamond'},INK='#2F3742';
const mark=(fam,x,y,s=10,fill=INK,sw=2.2)=>{const st=`fill="${fill}" stroke="#fff" stroke-width="${sw}" stroke-linejoin="round"`,P=pts=>`<polygon points="${pts.map(([a,b])=>`${(x+a).toFixed(1)},${(y+b).toFixed(1)}`).join(' ')}" ${st}/>`;
 return {circle:`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s}" ${st}/>`,square:`<rect x="${(x-s*.9).toFixed(1)}" y="${(y-s*.9).toFixed(1)}" width="${(s*1.8).toFixed(1)}" height="${(s*1.8).toFixed(1)}" rx="2" ${st}/>`,
  triangle:P([[0,-s*1.2],[s*1.1,s*.8],[-s*1.1,s*.8]]),diamond:P([[0,-s*1.25],[s*1.25,0],[0,s*1.25],[-s*1.25,0]])}[SHAPE[fam]];};
const markHTML=fam=>`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">${mark(fam,12,12.5,8,INK,1.5)}</svg>`;
const ZCOL=z=>z.easy?(z.costly?COL.amber:COL.green):(z.costly?COL.loss:COL.guess);
const ZONE=Object.fromEntries(APPS.zones.map(z=>[z.name,z])),ZA=.075;
/** A colour at alpha a, flattened onto the paper (the halo behind a label inside a tinted zone). */
const flat=(hex,a)=>'#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*a+parseInt(PAPER.slice(i,i+2),16)*(1-a)).toString(16).padStart(2,'0')).join('');
const MW=860,MH=432,PL=64,PR=856,QT=34,QB=388,XM=(PL+PR)/2,YM=(QT+QB)/2,BAND=40;
const MX=v=>PL+22+v*(PR-PL-44),MY=v=>QB-BAND-v*(QB-QT-2*BAND);
// Label offsets [dx, dy, anchor] where the default (to the right) would touch a neighbour; a shorter name where the
// full one cannot fit between its neighbours (the card shows the full name).
const PLACE={farmer:[-20,6,'end'],air:[-20,6,'end'],research:[-20,6,'end'],building:[-20,6,'end'],evolve:[-20,6,'end'],
 coscientist:[20,10,'start'],lab:[18,6,'start'],browser:[108,-16,'start']},SHORT={support:'Support'};
// In the crowded top-right zone every label sits to the right of its marker; Web forms reaches its label by a short leader.
const LEADER={browser:[[11,-3],[104,-21]]};
const n=APPS.apps.length,inZone=(easy,costly)=>APPS.apps.filter(a=>ZONE[a.zone].easy===easy&&ZONE[a.zone].costly===costly).length;
const nCostly=APPS.apps.filter(a=>ZONE[a.zone].costly).length,nApprove=inZone(true,true),nRun=inZone(true,false);
const ALT=`The ${word(n)} applications of Part 3 on two axes, how easy the result is to check and what a mistake costs, in four zones`;
function mapSVG(){
 let g='';
 for(const z of APPS.zones){const x0=z.easy?XM:PL,x1=z.easy?PR:XM,y0=z.costly?QT:YM,y1=z.costly?YM:QB,c=ZCOL(z);
  g+=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${c}" fill-opacity="${ZA}"/>`+
   label(z.easy?PR-12:PL+12,z.costly?QT+27:QB-14,esc(z.name),{size:21,fill:c,weight:700,anchor:z.easy?'end':'start'});}
 g+=`<rect x="${PL}" y="${QT}" width="${PR-PL}" height="${QB-QT}" fill="none" stroke="#C9D0D7" stroke-width="1.5"/>`+
  line(XM,QT,XM,QB,{stroke:'#AAB3BC',w:1.5,dash:'6 6'})+line(PL,YM,PR,YM,{stroke:'#AAB3BC',w:1.5,dash:'6 6'});
 // the axes: questions at clicks 1 and 2, the rule at click 3
 g+=label(PL-8,MY(.92)+6,'a lot',{size:18,anchor:'end'})+label(PL-8,MY(.08)+6,'little',{size:18,anchor:'end'})+
  label(PL,QB+28,'hard',{size:18})+label(PR,QB+28,'easy',{size:18,anchor:'end'});
 g+=gonly('1-2',label(PL,QT-12,'What does a mistake cost?',{size:20,fill:'#374151',weight:650})+label(XM,QB+28,'How easy is it to check the result?',{size:20,fill:'#374151',weight:650,anchor:'middle'}));
 g+=gonly('3',arrow(PL,QB,PL,QT+4,{stroke:COL.amber,w:4,head:15})+arrow(PL,QB,PR-2,QB,{stroke:COL.guess,w:4,head:15})+
  label(PL+8,QT-12,'↑ costlier mistakes: a person stays closer',{size:20,fill:COL.amber,weight:700})+
  label(XM,QB+28,'easier to check: more autonomy →',{size:20,fill:COL.guess,weight:700,anchor:'middle'}));
 // the points, labelled; each one a button
 g+=gat(2,APPS.apps.map(a=>{const x=MX(a.x),y=MY(a.y),[dx,dy,an]=PLACE[a.id]||[20,6,'start'],z=ZONE[a.zone];
  return `<g class="p3b-pt" data-id="${a.id}" data-fam="${a.family}" tabindex="0" role="button" aria-label="${esc(a.name)}: ${esc(a.why)}">`+
   `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="#fff" fill-opacity="0"/>`+
   `<circle class="p3b-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`+mark(a.family,x,y)+
   (LEADER[a.id]?line(x+LEADER[a.id][0][0],y+LEADER[a.id][0][1],x+LEADER[a.id][1][0],y+LEADER[a.id][1][1],{stroke:INK,w:1.5}):'')+
   `<text x="${(x+dx).toFixed(1)}" y="${(y+dy).toFixed(1)}" fill="${COL.ink}" font-size="18" font-weight="600" text-anchor="${an}" style="paint-order:stroke;stroke:${flat(ZCOL(z),ZA)};stroke-width:6px;stroke-linejoin:round">${esc(SHORT[a.id]||a.name)}</text></g>`;}).join(''));
 return g;}
const famHTML=live=>`<div class="p3b-fams">${APPS.families.map(f=>live?`<button type="button" data-fam="${f.id}" aria-pressed="false">${markHTML(f.id)}${esc(f.name)}</button>`:
 `<span style="cursor:default">${markHTML(f.id)}${esc(f.name)}</span>`).join('')}</div>`;
const JUDGE=`<p class="p3b-judge">${iconHTML('person',COL.amber,20)}<span>The positions are my judgement, not measurements.</span></p>`;
const QS=`<div class="p3b-qs"><div>${iconHTML('check',COL.green,30)}<div><h3>Checking</h3><p>Easy: a test passes or fails. Hard: only a lab can tell.</p></div></div>
 <div>${iconHTML('alert',COL.loss,30)}<div><h3>A mistake</h3><p>Cheap: a draft you throw away. Costly: money moved, a patient harmed.</p></div></div></div>`;
const cardHTML=a=>{const z=ZONE[a.zone];
 return `<h3>${markHTML(a.family)}${esc(a.name)}</h3><p>${esc(a.why)}</p><p class="p3b-z" style="color:${ZCOL(z)}"><b>${esc(z.name)}:</b> ${esc(z.advice)}.</p>`;};
register('p3b-map',(el,ctx)=>{
 if(ctx.printing){
  el.innerHTML=`<div class="p3b-map">${fig(MW,MH,mapSVG(),ALT)}<div class="p3b-side">${famHTML(false)}<div class="p3b-zl">${APPS.zones.map(z=>`<p><b style="color:${ZCOL(z)}">${esc(z.name)}:</b> ${esc(z.advice)}.</p>`).join('')}</div>${JUDGE}</div></div>`;return;}
 el.innerHTML=`<div class="p3b-map"><div class="w-fig">${fig(MW,MH,mapSVG(),ALT)}</div><div class="p3b-side"><div class="state-slot">${only('1',QS)}${only('2-3',`<div class="p3b-live">${famHTML(true)}<div class="p3b-card"></div></div>`)}</div>${JUDGE}</div></div>`;
 const box=el.querySelector('.p3b-map'),card=el.querySelector('.p3b-card'),pts=[...el.querySelectorAll('.p3b-pt')],btns=[...el.querySelectorAll('.p3b-fams button')];
 let sel='farmer',fam=null;
 const show=()=>{const a=APPS.apps.find(x=>x.id===sel);
  pts.forEach(p=>{p.classList.toggle('on',p.dataset.id===sel);p.classList.toggle('hl',p.dataset.fam===fam);});
  box.classList.toggle('dimfam',!!fam);btns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fam===fam)));
  card.style.borderLeftColor=ZCOL(ZONE[a.zone]);card.innerHTML=cardHTML(a);};
 const pick=p=>{sel=p.dataset.id;if(fam&&p.dataset.fam!==fam)fam=null;p.blur();show();};
 pts.forEach(p=>{p.addEventListener('click',()=>pick(p));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(p);}});});
 btns.forEach(b=>b.addEventListener('click',()=>{fam=fam===b.dataset.fam?null:b.dataset.fam;b.blur();show();}));
 show();
});
S_('stakes-map','work','How much freedom should each job get?',{builds:3,
 body:widget('p3b-map',ALT),
 lines:['We place each job with two questions: how easily can the result be checked, and what does a mistake cost?',
  `${Word(nCostly)} of the ${word(n)} sit in the top half, where a mistake is costly.`,
  'Each quadrant suggests a level of autonomy. Where would your team’s most repeated task sit?'],
 ask:['Before the points appear: where would you put a coding agent? A clinic scribe?','Which point would you move, and why?','Where does your team’s most repeated task sit?'],
 expected:['Coding: tests make it easy to check, and a merged change can break production, so the right-hand side, just above the middle. The scribe: the doctor can read it, but errors reach patients, so near the top.',
  'Common moves: support higher, because promises bind the company; research further right, because key claims can be spot-checked. Moving a point moves its advice with it.',
  'Most operational work lands top right: let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.'],
 point:'Two questions set the autonomy: how cheaply can the result be checked, and what does a mistake cost?',
 misconception:'That a more capable model moves a job to the bottom right. Capability changes how often mistakes happen; what a mistake costs, and how hard it is to check, stay where they were.',
 demo:'Click a point to read why it sits there; click a family to pick out its jobs.',
 transition:'Part 3 in one slide.',
 source:'Positions: the speaker’s judgement, for discussion (data/apps.json). Shapes mark the four families. The zones split each axis at its middle.'});

recap(3,[`Science: an ${kG('automatic scorer')} lets an agent run unattended.`,
  `India: the same loop works by voice, in Gujarati, with ${kY('a person')} for hard cases.`,
  `The map: ${word(nApprove)} of ${word(n)} jobs need ${kY('approval')} before an ${kR('irreversible')} step; ${word(nRun)} can run on their own.`],
 'Part 4, how agents fail: errors that compound, misleading inputs, and guardrails.',
 {card:{stop:'The check passes, or a step limit',guard:'Approval before any step that cannot be undone',human:'Leads where mistakes are costly; spot-checks the rest'},
  hi:['guard','human'],title:'The map, on the card',
  ask:'Pick one task from your week. Which zone of the map does it fall in?',
  expected:'Most land top right: the agent can do the work if a person approves the irreversible step. That is where Part 5 begins.',
  point:'Two things set how much an agent may do alone: how cheaply its result can be checked, and what a mistake costs.',
  transition:'Even in the right zone, agents fail. Part 4 shows how.'});
