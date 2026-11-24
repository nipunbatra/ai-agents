// Part 3b: agents at work, second half, at the slow pace. A turn to science and to India, then five applications,
// each in two steps: the task (the illustration, the request, and what it would need), then what the agent does and
// who checks it. AlphaEvolve; a farm advisory in Gujarati (run live in notebook 3.4, then our recorded run: the reply
// and the critic's verdict); air-quality alerts; building energy; clinic notes. Then the stakes map of every
// application (a live figure in three clicks) and the recap of Part 3. The co-scientist and the lab robot are in the
// appendix (parts/09-more-apps.js).
// Numbers: data/p3b.json (scripts/sci/p3b.py: verified.md rows 12 to 15, and figures read from the farm and analyst
// runs), data/apps.json (the map), data/traces.json (the farm run's checklist and verdict).
import {S_,app,recap,chap,css,esc,num,big,word,kY,kT,kG,at,msg,jsonHTML,data,need,illo,request,chip,
 label,line,arrow,gat,gonly,fig,COL,icon,widget,register,nbRun} from '../kit.js';

const D=need(await data('p3b'),'evolve','kisan','farmerchat','clinic','farm','air');
const APPS=need(await data('apps'),'apps','families','zones'),T=need(await data('traces'),'farm','date_text','model');
const E=D.evolve,F=D.farm,K=D.kisan,FC=D.farmerchat,AQ=D.air,CL=D.clinic;
const APP=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No application '+id);return a;};

css(`.p3b-turn{display:grid;grid-template-columns:auto auto;justify-content:center;gap:56px}
.p3b-turn h3{font-size:24px;line-height:1.2;margin:0 0 14px;padding-top:12px;border-top:5px solid var(--line);white-space:nowrap}
.p3b-turn .row{display:flex;gap:20px}
.p3b-turn .illo{width:184px}.p3b-turn .illo img{width:184px;height:184px;object-fit:cover;border-radius:16px}
.p3b-turn figcaption{font-size:23px;line-height:1.25;color:var(--ink);text-align:left}
.p3b-task{display:grid;grid-template-columns:400px minmax(0,1fr);gap:46px;align-items:center}
.p3b-task .illo img{max-height:400px;border-radius:18px}
.p3b-task .req{font-size:31px;line-height:1.35;padding:16px 24px;border-radius:20px 20px 20px 6px}.p3b-task .req b{font-size:16px}
.p3b-need{margin-top:36px}
.p3b-need>small{display:block;font-size:17px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--p);margin-bottom:14px}
.p3b-need .chips{gap:12px}.p3b-need .tchip{font-size:25px;padding:6px 18px 6px 12px}
.p3b-adv{width:100%;max-width:1040px;margin:0 auto}
.p3b-adv .msg{padding:12px 26px 18px}.p3b-adv .msg .mb{font-size:31px;line-height:1.65}.p3b-adv .msg .mh em{font-size:17px}
.p3b-adv .kT,.p3b-memo{border-radius:6px;padding:0 5px}.p3b-adv .kT{background:#0F766E14}.p3b-memo{color:var(--data);font-weight:650;background:#245EDB14}
.p3b-crit{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(0,1fr);gap:40px;align-items:center}
.p3b-rules{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:18px}
.p3b-rules li{display:flex;gap:16px;align-items:center;font-size:28px;line-height:1.3}
.p3b-tick{flex:none;width:34px}
.p3b-crit .msg .mb pre.json{font-size:28px;line-height:1.5}
.p3b-map .diagram-scroll svg{max-height:392px}
.p3b-pt{cursor:pointer;outline:none}.p3b-pt .p3b-ring{opacity:0}.p3b-pt.on .p3b-ring,.p3b-pt:focus-visible .p3b-ring{opacity:1}
.p3b-why{font-size:23px;line-height:1.35;min-height:32px;margin-top:14px;padding-left:16px;border-left:6px solid var(--line)}
.p3b-why b{font-weight:650}
.scene[data-build="1"] .p3b-z,.scene[data-build="2"] .p3b-z{visibility:hidden}
.scene[data-build="2"] .p3b-why{border-left-color:var(--line)!important}
@media(max-width:760px){.reading .p3b-turn,.reading .p3b-task,.reading .p3b-crit{grid-template-columns:minmax(0,1fr)}.reading .p3b-turn .row{flex-wrap:wrap}
 .reading .p3b-task .req{font-size:20px}.reading .p3b-need .tchip{font-size:17px}.reading .p3b-adv .msg .mb{font-size:20px}.reading .p3b-rules li{font-size:19px}.reading .p3b-why{font-size:18px}}`);

/** The first slide of an application: its illustration, the request, and the question “What would it need?”, whose
 answer (the tools, as chips) appears at click 2. need: [[icon, text, role]]; role 'memory' for stored data. */
function task(id,title,o){
 S_(id,'work',title,{builds:2,
  body:`<div class="p3b-task">${illo(o.img,o.alt)}<div>${request(o.req,{who:o.who})}
   <div class="p3b-need"><small>What would it need?</small>${at(2,`<div class="chips">${o.need.map(([ic,t,r])=>chip(ic,t,r)).join('')}</div>`)}</div></div></div>`,
  lines:o.lines,ask:o.ask,expected:o.expected,point:o.point,misconception:o.misconception,transition:o.transition,
  source:o.source||'Illustration: generated.'});
}
/** The second slide's trace settings: full width, no illustration. The last `late` steps (the person's check and
 what follows it) appear at click 2 with the facts strip; the rest are there from click 1. app() always draws the
 request bubble; the task slide has just shown it, so on these slides it is hidden and the trace gets the room. */
const TRACE={laneH:104,fs:20,laneOpts:{gap:4,left:204}};
const steps=(list,late)=>list.map((s,i)=>i<list.length-late?{...s,at:1}:s);
const TRACES=['app-evolve','app-farmer','app-air','app-building','app-clinic'].map(id=>`[data-scene-id="${id}"]`).join(',');
css(`:is(${TRACES}) .content{justify-content:center}:is(${TRACES}) .app-main>.req{display:none}:is(${TRACES}) .lanes svg{max-height:330px}:is(${TRACES}) .facts{margin-top:10px}`);

// ---------------------------------------------------------------------------------------- the turn
chap();
{
 const fam=id=>APPS.families.find(f=>f.id===id).name;
 const THUMB=[['science',[['evolve','app-evolve.jpg','a tree of code blocks beside data-centre servers']]],
  ['india',[['farmer','app-farmer.jpg','a farmer with a phone in a cumin field'],['air','app-air.jpg','a hazy city, a sensor pole and a school'],
   ['building','app-building.jpg','a campus building with solar panels'],['clinic','app-clinic.jpg','a doctor and a patient in a small clinic']]]];
 S_('work-beyond','work','Outside the office, who checks the work?',{builds:1,
  body:`<div class="p3b-turn">${THUMB.map(([f,items])=>`<div><h3>${fam(f)}</h3><div class="row">${items.map(([id,img,alt])=>
   illo(img,`Illustration: ${alt}`,{cap:esc(APP(id).name)})).join('')}</div></div>`).join('')}</div>`,
  lines:['First a science project at Google DeepMind, then jobs in India. For each one, watch who checks the result.'],
  ask:['In your own work, who checks a result before anyone acts on it?'],
  expected:['Sometimes a program, such as a test or a reconciliation. Often a colleague or a manager. Every job next has one or the other, or both.'],
  point:'From here on we ask one thing of each job: what checks the result, a program or a person?',
  transition:'First, a job where a program checks every attempt.',
  source:'Illustrations: generated.'});
}

// ---------------------------------------------------------------------------------------- 3.3 science
chap('3.3','Science and engineering');
const EVREQ='Find a better rule for placing jobs on our servers. Our code scores any rule.';
task('app-evolve-task','AlphaEvolve: a better rule for Google’s servers',{img:'app-evolve.jpg',
 alt:'Illustration: a tree of code blocks growing upward beside rows of data-centre servers',
 who:'Google’s engineers',req:EVREQ,
 need:[['terminal','run the code'],['target','the scoring program'],['database','the best attempts so far','memory']],
 lines:['Google’s engineers want a better rule for placing jobs on their servers. They already have code that scores any rule.',
  'With these, it can try a rule, see its score and try again, without waiting for a person.'],
 ask:['What would an agent need to work on this?','Who has to look at each attempt?'],
 expected:['A way to run code, the scoring program, and somewhere to keep what worked.',
  'Nobody. The scoring program rates each attempt in seconds, so no person has to read them.'],
 point:'This job comes with its own check: a program that scores any rule.',
 transition:'So what does the agent do with it?'});

app('app-evolve','AlphaEvolve: a program scores every attempt',{...TRACE,
 who:'Google’s engineers',req:EVREQ,names:{you:'Engineers'},
 steps:steps([{lane:'you',icon:'target',t:'Goal and\nscorer'},{lane:'agent',icon:'code',t:'Write a\nnew rule'},
  {lane:'tools',icon:'terminal',t:'Run and\nscore it',kind:'done'},{lane:'tools',icon:'database',t:'Keep the\nbest'},
  {lane:'agent',icon:'branch',t:'Change the\nbest, repeat'},{lane:'you',icon:'approve',t:'Read the\nwinner',kind:'check'}],1),
 check:'Engineers write the scorer and read the winner.',
 evidence:{big:`${num(E.compute_pct,1)}%`,text:'of Google’s worldwide compute recovered by its rule.'},
 lines:['The agent writes a rule, the program scores it, and the best rules are kept and changed again, over and over.',
  'Nobody reads each attempt, so it can try far more than a team could check.'],
 ask:['How many attempts could it make in a day?','Which problems in your work come with a scorer like this?'],
 expected:['Far more than any person could read: each one is scored in seconds, day and night.',
  'Scheduling, routing, compression: anything with a test suite or a cost model.'],
 point:'Because the check is a program, the loop can run without a person looking at each attempt.',
 misconception:`That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the scorer does much of the work. The same loop found a way to multiply ${E.matrix}×${E.matrix} complex matrices with ${E.mults} multiplications, and a faster kernel that cut Gemini’s training time by ${E.training_pct}%.`,
 transition:'Most jobs have no scorer like that. A farmer’s question is one of them.',
 source:`Google DeepMind blog, ${E.date}. The trace is simplified.`});

// ---------------------------------------------------------------------------------------- 3.4 India and sustainability
chap('3.4','India and sustainability');
task('app-farmer-task',`A voice note from a farmer near ${esc(F.place)}`,{img:'app-farmer.jpg',
 alt:'Illustration: a farmer in a white turban in a flowering cumin field at sunrise, holding a phone with a voice message',
 who:'A cumin farmer, by voice',req:'Is it time to sow and water my cumin?',
 need:[['mic','speech to text'],['thermo','weather forecast'],['notes','crop notes','memory'],['send','a voice reply']],
 lines:[`A farmer near ${esc(F.place)} asks this in a voice note, in Gujarati. The answer depends on this week’s weather.`,
  'The forecast and the crop notes give it facts. Without them it would guess, as the model on its own did.'],
 ask:['What would it need to answer well?','What could go wrong with the answer?'],
 expected:['The weather for the next few days, what cumin needs, and Gujarati both ways.',
  'The wrong weather, advice meant for another region, or a reply the farmer cannot read. Bad advice can cost a season’s crop.'],
 point:'The agent answers from the local forecast and crop notes, in the farmer’s own language.',
 transition:'In the notebook we build the middle part of this job.'});

nbRun('nb-farm','work','3.4','A farm advisory, written and checked',{
 run:'draft = write(feedback)\nverdict = critique(draft)',
 look:['The draft: in Gujarati, with numbers from the forecast','The verdict: a pass, or a list of problems'],
 line:`One call writes the advisory from the real forecast. A second call checks it against ${word(F.checks)} rules.`,
 ask:'What should happen if the draft breaks a rule?',
 expected:'The checker sends back the problems, and the writer tries again.',
 point:'A second call that checks the first against a fixed list is a cheap check you can always add.',
 transition:'This is what our run wrote.'});

// The real advisory: the numbers it took from the forecast in teal, the one from the crop notes in blue.
{
 let h=esc(F.draft);
 for(const x of F.from_forecast)h=h.replace(esc(x),kT(esc(x)));
 for(const x of F.from_notes)h=h.replace(esc(x),`<span class="p3b-memo">${esc(x)}</span>`);
 const low=F.days.find(d=>d.min_c===F.low_c).day;
 S_('farm-reply','work','The advisory our run wrote',{builds:1,
  body:`<div class="p3b-adv">${msg('model',`<span lang="gu">${h}</span>`,{note:`round ${word(F.rounds)}`})}</div>`,
  lines:['The teal numbers come from the forecast. The blue one comes from the crop notes.'],
  ask:['Who here reads Gujarati? Does it sound like something a farmer would act on?'],
  expected:[`In English: no rain from ${F.first} to ${F.last} (chance ${F.rain_chance_max}%), nights down to ${num(F.low_c,1)} °C on ${low}. Cool, dry weather suits cumin, so sow this week and water lightly at once, then every ${F.interval[0]} to ${F.interval[1]} days.`],
  point:'Every number in the advice comes from a source we gave it: the forecast or the crop notes.',
  transition:'Before anyone sends it, the second call checks it.',
  source:`Our run (notebook 3.4, ${esc(T.model)}, ${T.date_text}). Forecast: ${esc(F.source)}. The crop notes are illustrative, not agronomic advice.`});
}

{
 const RULES=T.farm.checklist,V=T.farm.rounds.at(-1).verdict;
 if(RULES.length!==F.checks||!V.pass)throw new Error('farm-critic: the recorded verdict no longer matches data/p3b.json');
 const empty=`<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true"><circle cx="17" cy="17" r="13" fill="none" stroke="#AAB3BC" stroke-width="2.5"/></svg>`;
 const tick=`<svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true"><circle cx="17" cy="17" r="15" fill="${COL.green}"/>${icon('check',17,17,20,'#fff',{sw:3})}</svg>`;
 S_('farm-critic','work','Did the draft pass the checks?',{builds:2,
  body:`<div class="p3b-crit"><ul class="p3b-rules">${RULES.map(r=>`<li><div class="p3b-tick"><div data-only="1">${empty}</div><div data-only="2">${tick}</div></div><span>${esc(r.replace(/^./,c=>c.toUpperCase()))}</span></li>`).join('')}</ul>
   ${at(2,msg('model',jsonHTML(V),{note:'the critic'}))}</div>`,
  lines:[`The second call, the critic, read the draft against these ${word(F.checks)} rules. Which one is hardest to check?`,
   `All ${word(F.checks)} passed in round ${word(F.rounds)}. Any problems would have gone back to the writer.`],
  ask:['Which rule is hardest for a model to check?','Is a pass from the critic enough to send it to farmers?'],
  expected:['The last one: “says nothing the forecast or crop notes do not support”. It needs judgement, and the critic is a model too.',
   'No. The critic is a model checking a model. Someone who knows farming should approve the advice, because a farmer’s crop depends on it.'],
  point:'A checking call catches broken rules cheaply, but it is a model too, so it should not be the last check.',
  transition:'So where would a person come in?',
  source:`The critic’s real reply, from our run (notebook 3.4, ${T.date_text}).`});
}

app('app-farmer','Who checks the advice before a farmer hears it?',{...TRACE,
 who:'A cumin farmer, by voice',req:'Is it time to sow and water my cumin?',names:{you:'People'},
 steps:steps([{lane:'you',icon:'mic',t:'Voice\nnote'},{lane:'tools',icon:'chat',t:'Speech\nto text'},{lane:'tools',icon:'thermo',t:'Forecast,\ncrop notes'},
  {lane:'agent',icon:'pen',t:'Draft in\nGujarati'},{lane:'agent',icon:'check',t:'Critic\nchecks',kind:'done'},
  {lane:'you',icon:'approve',t:'Agronomist\napproves',kind:'check'},{lane:'tools',icon:'send',t:'Voice\nreply'}],2),
 check:'An agronomist approves each advisory.',
 evidence:{big:`${K.answered_m} million+`,text:'questions answered by Kisan e-Mitra, the government’s farmer chatbot.'},
 lines:['Our notebook ran the middle: the draft and the critic. A real service adds the voice at both ends.',
  'The critic is a model too. Bad advice can cost a farmer the season’s crop, so an agronomist approves.'],
 ask:['Which steps did our notebook leave out?','Why both a critic and an agronomist?'],
 expected:['The voice at both ends: speech to text coming in, a voice reply going out.',
  'The critic catches broken rules cheaply. The agronomist answers for the advice, and a photo of a sick plant needs a trained eye.'],
 point:'For a farmer, the agent works by voice, in Gujarati, from local data, and a person approves the advice.',
 misconception:`That a chatbot alone can advise farmers. Without the forecast and the crop notes it would guess, as the model on its own did in the opening. (Kisan e-Mitra: more than ${K.answered_lakh} lakh answers in ${K.languages} languages, over ${big(K.per_day)} a day, per PIB. Digital Green’s Farmer.Chat serves ${FC.farmers_lo_m} to ${FC.farmers_hi_m} million farmers.)`,
 transition:'The same loop can watch a city’s air.',
 source:`The trace is our design; the draft and the critic are our run (notebook 3.4). Kisan e-Mitra: PIB, ${K.date}.`});

const AQREQ='Where will PM2.5 cross the standard tomorrow, and whom should we warn?',top=AQ.cities[0],city=n=>AQ.cities.find(c=>c.city===n);
task('app-air-task','Whom should a city warn about tomorrow’s air?',{img:'app-air.jpg',
 alt:'Illustration: a hazy city skyline, an air-quality sensor pole, a school, and a phone alert with a mask symbol',
 who:'A city air-quality desk',req:AQREQ,
 need:[['pin','station readings'],['wind','an air forecast'],['database','schools and hospitals','memory'],['send','SMS and WhatsApp']],
 lines:['Every morning a city’s pollution desk decides where to warn people. The answer changes from day to day.',
  'Most of this job is gathering and drafting, every morning. That is the part an agent can take.'],
 ask:['What would it need?','Which part of this job is the same every morning?'],
 expected:['Station readings, a forecast, a list of schools and hospitals, and a way to send the alerts.',
  'Collecting the numbers, finding the hotspots, drafting the messages. The decision to send is not routine.'],
 point:'The routine part of the desk’s morning is data gathering and drafting.',
 transition:'So what would the agent do, and who approves the alerts?'});

app('app-air','Air-quality alerts, every morning',{...TRACE,
 who:'A city air-quality desk',req:AQREQ,names:{you:'Officer'},
 steps:steps([{lane:'tools',icon:'clock',t:'Every\nmorning'},{lane:'tools',icon:'pin',t:'Station\nreadings'},{lane:'tools',icon:'wind',t:'Air\nforecast'},
  {lane:'agent',icon:'target',t:'Find\nhotspots'},{lane:'agent',icon:'pen',t:'Draft\nalerts'},
  {lane:'you',icon:'approve',t:'Officer\napproves',kind:'check'},{lane:'tools',icon:'send',t:'Alert\nschools'}],2),
 check:'An officer approves every alert before it is sent.',
 evidence:{label:'Our analyst run',big:`${top.over} of ${AQ.days}`,text:`winter days over ${AQ.standard}&nbsp;µg/m³ in ${esc(top.city)}.`},
 lines:['Each morning it gathers the readings and the forecast, finds the hotspots and drafts the alerts.',
  'A false alarm closes schools; a missed one harms children. A person makes that call.'],
 ask:['Should the alerts go out on their own?','Why should a person make that call, and not the agent?'],
 expected:['No. Schools and hospitals act on them, and a wrong alert costs trust.',
  `Someone has to answer for a closed school or a missed warning, and the forecast is only an estimate. (In our analyst run Delhi was over the standard on ${city('Delhi').over} days, Gandhinagar on ${city('Gandhinagar').over}.)`],
 point:'An agent can do the daily gathering and drafting; a person approves each alert, because schools and hospitals act on it.',
 misconception:'That CAMS numbers are station measurements. They are estimates from a model that takes in satellite data; a real desk would check them against its own stations.',
 transition:'Buildings are easier to check: a simulator and a meter do it.',
 source:`The trace is our design. Days over the standard, ${AQ.from} to ${AQ.to}: our analyst run (notebook 3.1, ${esc(AQ.model)}) on CAMS estimates via Open-Meteo.`});

const BREQ='Keep the lecture halls cool for this week’s classes, at the lowest electricity bill.';
task('app-building-task','When should a campus cool its lecture halls?',{img:'app-building.jpg',
 alt:'Illustration: a campus building with rooftop solar panels and air-conditioning units, and a facilities manager with a tablet',
 who:'A campus facilities team',req:BREQ,
 need:[['calendar','class timetable','memory'],['thermo','weather forecast'],['rupee','hourly tariff'],['code','a simulator'],['zap','building controls']],
 lines:['A campus wants cool lecture halls and a lower electricity bill. Power costs more at some hours than at others.',
  'With the timetable, forecast and tariff, it can cool rooms early, before the price goes up.'],
 ask:['What would it need to know?','How could it save money without making anyone hot?'],
 expected:['When the rooms are used, how hot it will be, and when power is cheap.',
  'Cool the halls before the peak tariff, and skip the rooms nobody is using.'],
 point:'The savings come from timing: cool before the price goes up, and only the rooms in use.',
 transition:'And who checks the plan?'});

app('app-building','Building energy: a schedule for the week',{...TRACE,
 who:'A campus facilities team',req:BREQ,names:{you:'Manager'},
 steps:steps([{lane:'tools',icon:'calendar',t:'Timetable'},{lane:'tools',icon:'thermo',t:'Forecast,\ntariff'},{lane:'agent',icon:'list',t:'Plan the\ncooling'},
  {lane:'tools',icon:'code',t:'Simulate\nthe week',kind:'done'},{lane:'you',icon:'approve',t:'Manager\napproves',kind:'check'},
  {lane:'tools',icon:'building',t:'Set the\nschedule'},{lane:'tools',icon:'pulse',t:'Meter\nreports',kind:'done'}],3),
 check:'The manager approves each plan at first, then spot-checks.',
 evidence:{label:'Programs check',text:'The simulator before it runs, the meter after.'},
 lines:['The agent plans when to cool each hall. A simulator checks the plan’s comfort and cost before anything runs.',
  'A bad schedule costs a warm afternoon, and is fixed the next day.'],
 ask:['Who checks the plan before it runs?','Why can this run with less supervision than the air alerts?'],
 expected:['A program: the simulator works out comfort and cost for the week.',
  'Checking is cheap, before and after, and a bad schedule costs some rupees and some comfort for a day, then is fixed the next.'],
 point:'When a simulator and a meter check every decision, the agent can run day to day while a person reads the weekly report.',
 transition:'Last, a clinic, where every note is about a patient.',
 source:'The trace is our design.'});

const CREQ='Listen to this consultation, in Gujarati and English, and draft my notes.';
task('app-clinic-task','Could an agent write a doctor’s notes?',{img:'app-clinic.jpg',
 alt:'Illustration: a doctor and a patient talking across a desk in a small Indian clinic, a recorder and a tablet on the desk',
 who:'A doctor in a busy clinic',req:CREQ,
 need:[['mic','a microphone'],['file','speech to text'],['database','the health record','memory']],
 lines:['A doctor sees patient after patient, then writes the notes. Could an agent listen and draft them?',
  'And one thing that is not a tool: the patient’s permission to record.'],
 ask:['What would it need?','What must happen before the recorder is switched on?'],
 expected:['A microphone, speech to text that handles two languages, and the patient’s record.',
  'The patient agrees. Consent comes first, and a person gives it.'],
 point:'Before any tool runs, a person has to agree to be recorded.',
 transition:'So what does it do with the recording?'});

app('app-clinic','Clinic notes: from the consultation to the record',{...TRACE,
 who:'A doctor in a busy clinic',req:CREQ,names:{you:'People'},
 steps:steps([{lane:'you',icon:'person',t:'Patient\nconsents',kind:'check'},{lane:'tools',icon:'mic',t:'Listen'},{lane:'tools',icon:'file',t:'Transcribe'},
  {lane:'agent',icon:'pen',t:'Draft\nthe note'},{lane:'you',icon:'approve',t:'Doctor edits,\nsigns',kind:'check'},{lane:'tools',icon:'database',t:'File in\nthe record'}],2),
 check:'The doctor reads, corrects and signs every note.',
 evidence:{big:`About ${big(CL.hours)} hours`,text:`of note-writing saved for ${big(CL.physicians)} doctors in about ${CL.months} months.`},
 lines:['The patient agrees first. Then it listens, transcribes, and drafts the note.',
  'Editing a draft is quicker than writing one, even when the doctor signs every note.'],
 ask:['Would you let it file the note straight into the record?','What would you measure to know whether it helps?'],
 expected:['No. The note goes into a medical record, and its errors reach patients.',
  `Time spent on notes, and the errors found when the doctor reviews. Across ${CL.encounters_m} million visits, Kaiser Permanente counted about ${big(CL.hours)} hours saved, with the review kept.`],
 point:`The scribe saves writing time and the doctor keeps every decision: Kaiser Permanente’s doctors saved about ${big(CL.hours)} hours in about ${CL.months} months.`,
 misconception:'That the scribe makes the diagnosis. It writes down what was said; the doctor decides.',
 transition:'Each job so far got a different amount of freedom. Can one picture show why?',
 source:`The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, ${CL.from} to ${CL.to}; about ${big(CL.hours)} hours as reported by the AMA. The trace is our design.`});

// ---------------------------------------------------------------------------------------- the stakes map (live)
chap();
// One plain marker for every job; the zone colours keep their roles: green (checked, let it run), amber (a person
// approves), purple (the agent drafts), red (risk: a person leads).
const INK='#2F3742',ZA=.075;
const ZCOL=z=>z.easy?(z.costly?COL.amber:COL.green):(z.costly?COL.loss:COL.guess);
const ZONE=Object.fromEntries(APPS.zones.map(z=>[z.name,z]));
const MW=1152,MH=392,PL=104,PR=1138,QT=36,QB=350,XM=(PL+PR)/2,YM=(QT+QB)/2,BAND=34;
const MX=v=>PL+24+v*(PR-PL-48),MY=v=>QB-BAND-v*(QB-QT-2*BAND);
// Label offsets [dx, dy, anchor]; the default sits to the right of the marker. Short names where the full one would
// reach a neighbour (the line under the map gives the full name).
const PLACE={farmer:[-18,7,'end'],air:[-18,7,'end'],browser:[-18,7,'end'],building:[-18,7,'end'],evolve:[-18,7,'end']},SHORT={support:'Support'};
const n=APPS.apps.length,inZone=(easy,costly)=>APPS.apps.filter(a=>ZONE[a.zone].easy===easy&&ZONE[a.zone].costly===costly).length;
const nApprove=inZone(true,true),nRun=inZone(true,false);
const ALT=`The ${word(n)} applications of Part 3 on two axes, how easy the result is to check and what a mistake costs, in four zones`;
function mapSVG(){
 let g='';
 // click 3: the four zones, their names and the lines between them
 g+=gat(3,APPS.zones.map(z=>{const x0=z.easy?XM:PL,x1=z.easy?PR:XM,y0=z.costly?QT:YM,y1=z.costly?YM:QB,c=ZCOL(z);
  return `<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${c}" fill-opacity="${ZA}"/>`+
   label(z.easy?PR-14:PL+14,z.costly?QT+28:QB-14,esc(z.name),{size:22,fill:c,weight:700,anchor:z.easy?'end':'start'});}).join('')+
  line(XM,QT,XM,QB,{stroke:'#AAB3BC',w:1.5,dash:'6 6'})+line(PL,YM,PR,YM,{stroke:'#AAB3BC',w:1.5,dash:'6 6'}));
 g+=`<rect x="${PL}" y="${QT}" width="${PR-PL}" height="${QB-QT}" fill="none" stroke="#C9D0D7" stroke-width="1.5"/>`;
 // the axes: two questions at clicks 1 and 2, the rule they give at click 3
 g+=label(PL-10,MY(.95)+7,'a lot',{size:20,anchor:'end'})+label(PL-10,MY(.05)+7,'little',{size:20,anchor:'end'})+
  label(PL,QB+32,'hard',{size:20})+label(PR,QB+32,'easy',{size:20,anchor:'end'});
 g+=gonly('1-2',label(PL,QT-12,'What does a mistake cost?',{size:23,fill:'#374151',weight:650})+
  label(XM,QB+32,'How easy is it to check the result?',{size:23,fill:'#374151',weight:650,anchor:'middle'}));
 g+=gonly('3',arrow(PL,QB,PL,QT+4,{stroke:COL.amber,w:4,head:15})+arrow(PL,QB,PR-2,QB,{stroke:COL.guess,w:4,head:15})+
  label(PL+10,QT-12,'↑ costlier mistakes: a person stays closer',{size:22,fill:COL.amber,weight:700})+
  label(XM,QB+32,'easier to check: more autonomy →',{size:22,fill:COL.guess,weight:700,anchor:'middle'}));
 // click 1 only: what each question means, in the empty plot
 const ex=(y,ic,c,head,text)=>icon(ic,XM-370,y-8,30,c)+label(XM-342,y,`<tspan font-weight="700" fill="${COL.ink}">${head}</tspan> ${text}`,{size:24,fill:'#374151'});
 g+=gonly('1',ex(YM-30,'check',COL.green,'Checking.','Easy: a test passes or fails. Hard: only a lab can tell.')+
  ex(YM+34,'alert',COL.loss,'A mistake.','Cheap: a draft you throw away. Costly: money moved.'));
 // click 2: the points, labelled; each one a button
 g+=gat(2,APPS.apps.map(a=>{const x=MX(a.x),y=MY(a.y),[dx,dy,an]=PLACE[a.id]||[18,7,'start'];
  return `<g class="p3b-pt" data-id="${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)}: ${esc(a.why)}">`+
   `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="#fff" fill-opacity="0"/>`+
   `<circle class="p3b-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`+
   `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${INK}" stroke="#fff" stroke-width="2"/>`+
   `<text x="${(x+dx).toFixed(1)}" y="${(y+dy).toFixed(1)}" fill="${COL.ink}" font-size="21" font-weight="600" text-anchor="${an}">${esc(SHORT[a.id]||a.name)}</text></g>`;}).join(''));
 return g;}
const why=a=>{const z=ZONE[a.zone];return `<b>${esc(a.name)}.</b> ${esc(a.why)} <span class="p3b-z" style="color:${ZCOL(z)}"><b>${esc(z.name)}.</b></span>`;};
register('p3b-map',(el,ctx)=>{
 const a0=APP('farmer');
 el.innerHTML=`<div class="p3b-map"><div class="w-fig">${fig(MW,MH,mapSVG(),ALT)}</div>${at(2,`<p class="p3b-why" style="border-left-color:${ZCOL(ZONE[a0.zone])}">${why(a0)}</p>`)}</div>`;
 if(ctx.printing)return;
 const card=el.querySelector('.p3b-why'),pts=[...el.querySelectorAll('.p3b-pt')];
 let sel=a0.id;
 const show=()=>{const a=APP(sel);pts.forEach(p=>p.classList.toggle('on',p.dataset.id===sel));
  card.style.borderLeftColor=ZCOL(ZONE[a.zone]);card.innerHTML=why(a);};
 const pick=p=>{sel=p.dataset.id;p.blur();show();};
 pts.forEach(p=>{p.addEventListener('click',()=>pick(p));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(p);}});});
 show();
});
S_('stakes-map','work','How much freedom should each job get?',{builds:3,
 body:widget('p3b-map',ALT),
 lines:['Two questions place each job: how easily can the result be checked, and what does a mistake cost?',
  'Every job from this part, and a few from the appendix. Which one would you move?',
  'Each corner suggests how much freedom to give. Where would your team’s most repeated task sit?'],
 ask:['Before the points appear: where would you put a coding agent? A clinic scribe?','Which point would you move, and why?','Where does your team’s most repeated task sit?'],
 expected:['Coding: tests make it easy to check, and a merged change can break production, so the right-hand side, just above the middle. The scribe: the doctor can read it, but errors reach patients, so near the top.',
  'Common moves: support higher, because promises bind the company; research further right, because key claims can be spot-checked. Moving a point moves its advice with it.',
  `Most operational work lands top right: ${word(nApprove)} of the ${word(n)} jobs are there. Let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.`],
 point:'Two questions set the autonomy: how cheaply can the result be checked, and what does a mistake cost?',
 misconception:'That a more capable model moves a job to the bottom right. Capability changes how often mistakes happen; what a mistake costs, and how hard it is to check, stay where they were.',
 demo:'Click a point to read why it sits there. The positions are the speaker’s judgement, not measurements: invite the room to move them.',
 transition:'Part 3 in one slide.',
 source:'Positions: the speaker’s judgement, for discussion (data/apps.json). The zones split each axis at its middle.'});

recap(3,[`A ${kG('program')} that checks the result lets the agent work with little supervision.`,
  `A costly mistake means ${kY('a person')} approves the step that cannot be undone.`,
  `On the map: ${word(nApprove)} of ${word(n)} jobs need ${kY('approval')}, ${word(nRun)} can ${kG('run on their own')}.`],
 'how agents fail, and the guardrails that catch them.',
 {card:{stop:'The check passes',guard:'Approval before an irreversible step',human:'Leads where mistakes cost most'},
  hi:['guard','human'],title:'On the card',
  ask:'Pick one task from your week. Which zone of the map does it fall in?',
  expected:'Most land top right: the agent can do the work if a person approves the step that cannot be undone. That is where Part 5 begins.',
  point:'Two things set how much an agent may do alone: how cheaply its result can be checked, and what a mistake costs.',
  transition:'Even in the right zone, agents fail. Part 4 shows how.'});
