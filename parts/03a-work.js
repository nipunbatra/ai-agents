// Part 3a: agents at work, first half, at a slower pace. The part break, how to read a trace (the opening run), then
// four jobs. Each job has a task slide (the illustration, the request, the tools it would need) and a slide of what the
// agent does. Three of them run live in the notebook (3.1 the analyst, 3.2 research, 3.3 the inbox), and the slides
// after each notebook slide show our recorded run. Invoices, IT incidents and web forms are in parts/08-more-apps.js.
// Real runs: data/traces.json (notebook Part 3). Published numbers and the figures read from the runs:
// data/p3a.json (scripts/sci/p3a.py). Positions on the stakes map, quoted in the notes: data/apps.json.
import {app,partBreak,chap,slides,S_,at,css,esc,data,need,word,Word,num,big,nb,nbRun,gat,label,request,illo,
 COL,ROLE,MUTED,icon,iconHTML,chip,lanes} from '../kit.js';

const APPS=need(await data('apps'),'apps','families');
const T=need(await data('traces'),'analyst','research','inbox','model','date_text');
const D=need(await data('p3a'),'research','analyst','inbox','opening','swe','so','klarna');
const RS=D.research,AN=D.analyst,REF=D.inbox.refund,SW=D.swe,KL=D.klarna,S=AN.standard;

css(`.p3a-task{display:grid;grid-template-columns:minmax(0,.82fr) minmax(0,1.3fr);gap:46px;align-items:center}
.p3a-task .illo img{max-height:390px;border-radius:18px}
.p3a-task .req{font-size:32px;line-height:1.38;padding:18px 26px;border-radius:22px 22px 22px 6px}
.p3a-task .req b{font-size:16px}
.p3a-need{margin-top:34px}
.p3a-need small,.p3a-head small{display:block;font-size:17px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;margin-bottom:12px}
.p3a-need small{color:var(--p)}
.p3a-need .chips{gap:12px 14px}
.p3a-need .tchip{font-size:25px;padding:6px 18px 6px 12px;border-width:2px}
.p3a-need .tchip .ic{width:28px;height:28px}
.content:has(> .app.p3a-does){justify-content:center;gap:20px}
.p3a-does .lanes svg{max-height:330px}
.p3a-does~[data-at] .facts p{font-size:23px}
.p3a-key{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 26px;margin-top:6px}
.p3a-key>div{display:flex;align-items:center;gap:12px;font-size:24px;line-height:1.3;min-width:0}
.p3a-key svg{flex:none}
.p3a-chart{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:40px;align-items:center}
.p3a-bars{width:100%;height:auto;display:block;max-height:384px}
.p3a-head small{color:var(--q)}
.p3a-head b{display:block;font-size:54px;line-height:1.1;font-weight:700;color:var(--ink);margin-bottom:8px}
.p3a-head p{font-size:27px;line-height:1.38}
.p3a-claims{display:grid;grid-template-columns:auto minmax(0,1fr) auto 150px;gap:30px 24px;align-items:center}
.p3a-claims>b{font-size:17px;letter-spacing:1.2px;text-transform:uppercase;color:var(--q);white-space:nowrap}
.p3a-claims>span{font-size:30px;line-height:1.35}
.p3a-claims .tchip{font-size:19px}
.p3a-claims>[data-at]{grid-column:4;grid-row:1/span 3;align-self:stretch;display:flex}
.p3a-one{display:flex;align-items:center;gap:14px;color:var(--loss);font-size:24px;font-weight:650;line-height:1.25}
.p3a-one::before{content:"";align-self:stretch;width:22px;flex:none;border:3px solid var(--loss);border-left:none;border-radius:0 14px 14px 0;margin:6px 0}
.p3a-stats{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1.25fr);gap:34px}
.p3a-stats>div>div{border-top:6px solid var(--d);padding-top:16px;min-width:0}
.p3a-stats b{display:block;font-size:48px;line-height:1.1;font-weight:700;color:var(--d);margin-bottom:10px}
.p3a-stats p{font-size:27px;line-height:1.35;color:#374151}
.p3a-stats .r{border-color:var(--loss)}.p3a-stats .r b{color:var(--loss)}
.p3a-gate{display:flex;align-items:center;gap:18px;border:2px solid #AA4E0866;background:#AA4E080D;border-radius:16px;padding:12px 18px;margin-top:16px;font-size:25px;line-height:1.35}
.p3a-gate>svg{flex:none}.p3a-gate>div{flex:1;min-width:0}
.p3a-gate small{display:block;font-size:16px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--noise)}
.p3a-gate .mono{font-size:22px}
.p3a-gate>b{flex:none;display:inline-flex;align-items:center;gap:8px;background:var(--noise);color:#fff;border-radius:999px;padding:6px 18px 6px 12px;font-size:22px}
@media(max-width:760px){.reading .p3a-task,.reading .p3a-key,.reading .p3a-chart,.reading .p3a-stats{grid-template-columns:minmax(0,1fr)}
 .reading .p3a-claims{grid-template-columns:minmax(0,1fr)}.reading .p3a-claims>[data-at]{grid-column:auto;grid-row:auto}
 .reading .p3a-task .req{font-size:20px}.reading .p3a-need .tchip{font-size:16px}.reading .p3a-claims>span,.reading .p3a-head p,.reading .p3a-stats p,.reading .p3a-gate{font-size:18px}
 .reading .p3a-gate{flex-wrap:wrap}
 .reading .p3a-head b,.reading .p3a-stats b{font-size:34px}.reading .p3a-key>div{font-size:18px}}`);

/** Where an application sits on the stakes map at the end of Part 3, for the notes. */
const where=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No application '+id);
 return `On the stakes map at the end of Part 3: “${a.zone}” (${a.why.replace(/^./,c=>c.toLowerCase()).replace(/\.$/,'')}).`;};
const times=n=>n===1?'once':n===2?'twice':`${word(n)} times`;
/** The tools a recorded run used, in order of first use, as chips: names must be in the map. */
const usedTools=(run,map)=>[...new Set(run.turns.flatMap(t=>t.calls.map(c=>c.name)))].map(n=>{
 if(!map[n])throw new Error('No chip for tool '+n);return map[n];});

/** The task slide of a job: its illustration, the request, and (at click 2) the tools it would need. Two builds. */
function task(id,title,o){
 S_(id,'work',title,{builds:2,nb:o.nb,
  body:`<div class="p3a-task">${illo(o.img,o.alt)}<div>${request(o.req,{who:o.who||'The request'})}
   ${at(2,`<div class="p3a-need"><small>It would need</small><div class="chips">${o.tools.map(([ic,t,role])=>chip(ic,t,role)).join('')}</div></div>`)}</div></div>`,
  lines:o.lines,ask:o.ask,expected:o.expected,point:o.point,misconception:o.misconception,transition:o.transition,
  source:`${o.source?o.source+' ':''}Illustration: generated.`});
}

/** The slide of what an agent does: app() with no illustration and a wider trace, without the request bubble (the
 task slide just showed it). */
const WIDE={laneH:100,fs:20,laneOpts:{gap:6,left:196}};
function does(id,title,o){
 app(id,title,{...WIDE,...o,req:'·'});
 const s=slides.find(x=>x.id===id),r=request('·',{who:'The request'});
 if(!s.body.includes(r)||!s.body.includes('<div class="app noimg">'))throw new Error(`${id}: app() no longer draws its slide this way`);
 s.body=s.body.replace(r,'').replace('<div class="app noimg">','<div class="app noimg p3a-does">');
}
/** Where lanes() puts the nodes of a trace (the same arithmetic as figures.js, for drawing on top of it). */
function geom(steps,{laneH,fs,laneOpts:{gap,left}},W=1152){
 const n=steps.length,colW=(W-left-6)/n,lines=Math.max(...steps.map(s=>String(s.t).split('\n').length)),idx={you:0,agent:1,tools:2};
 const r=Math.max(16,Math.min(25,Math.floor((laneH-14-lines*(fs+2)-fs*.3)/2)));
 return {r,x:i=>left+colW*(i+.5),y:i=>4+idx[steps[i].lane]*(laneH+gap)+r+5};
}
/** A dashed arrow through points, in the style of the trace's own arrows, with a label: the path most cases take. */
function route(pts,{text='',at:[tx,ty],halo}){
 const [hx,hy]=pts.at(-1),[px,py]=pts.at(-2),a=Math.atan2(hy-py,hx-px),h=10,ink='#4B5563';
 return `<path d="M${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-dasharray="7 5" stroke-linejoin="round"/>`+
  `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx-h*Math.cos(a-.42)).toFixed(1)},${(hy-h*Math.sin(a-.42)).toFixed(1)} L${(hx-h*Math.cos(a+.42)).toFixed(1)},${(hy-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${ink}"/>`+
  `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" fill="${COL.ink}" font-size="20" font-style="italic" text-anchor="middle" style="paint-order:stroke;stroke:${halo};stroke-width:6px;stroke-linejoin:round">${text}</text>`;
}
/** Draw extra SVG on top of a slide's trace, after checking that geom() g still matches figures.js. */
function overlay(id,g,svg){
 const s=slides.find(x=>x.id===id),open='<div class="diagram-scroll lanes">',i=s.body.indexOf(open),j=s.body.indexOf('</svg></div>',i);
 if(i<0||j<i)throw new Error(`${id}: no trace`);
 if(!s.body.slice(i,j).includes(`<circle cx="${g.x(0).toFixed(1)}" cy="${g.y(0)}" r="${g.r}"`))throw new Error(`${id}: the trace geometry no longer matches figures.js`);
 s.body=s.body.slice(0,j)+svg+s.body.slice(j);
}

// ---------------------------------------------------------------------------------------- the part break
partBreak(3,'Agents at work','We look at real jobs one at a time: what the agent does, and where a person checks its work. Some of them we run live.',
 APPS.families.map(f=>f.name),
 {img:'part-work.jpg',alt:'Illustration: a small town of offices, a farm, a lab and a clinic, joined by thin lines to one small spark',nb:nb('part-3'),
  line:'Key question: for each job, how much should the agent do without a person?',
  ask:'Which job in your team would you hand to an agent first?',
  expected:'Answers vary: reports, ticket triage, data clean-up, first drafts. Keep two of them; at the end of the part we place them on a map.',
  point:'Every job gets the same two questions: what does the agent do, and where does a person check it?',
  transition:'Each job is drawn the same way, as a trace. First, how to read one.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- how to read a trace
{
 const [c0,c1]=D.opening.calls_per_turn,rounds=D.opening.calls_per_turn.filter(c=>c>0).length;
 const OPEN=[{lane:'you',icon:'person',t:'Your\nquestion'},{lane:'agent',icon:'spark',t:'Ask for\nforecasts'},
  {lane:'tools',icon:'sensor',t:'Forecasts',n:c0},{lane:'agent',icon:'spark',t:`Ask for\n${word(c1)} sums`},
  {lane:'tools',icon:'code',t:'Calculator',n:c1},{lane:'agent',icon:'spark',t:'Answer'},{lane:'you',icon:'eye',t:'Read the\nanswer'}];
 /** One node of a trace, small, for the key. */
 const node=(c,ic,{filled=false,n=0}={})=>`<svg viewBox="0 0 58 54" width="58" height="54" aria-hidden="true"><circle cx="26" cy="29" r="20" fill="${filled?c:'#fff'}" stroke="${c}" stroke-width="2.6"/>${icon(ic,26,29,21,filled?'#fff':c)}${n?`<circle cx="43" cy="12" r="11" fill="${c}"/><text x="43" y="16.5" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">×${n}</text>`:''}</svg>`;
 const KEY=[[node(ROLE.tools,'sensor',{n:c0}),'Calls made at once'],[node(ROLE.you,'approve',{filled:true}),'A person approves'],
  [node(COL.green,'check',{filled:true}),'A checked result']];
 S_('read-card','work','How to read a trace',{builds:2,
  body:`${lanes(OPEN,{W:1152,laneH:96,fs:19,gap:6,alt:'The opening run as a trace: you ask, the agent asks for three forecasts at once, then six sums at once, and answers; you read the answer'})}
   ${at(2,`<div class="p3a-key">${KEY.map(([n,t])=>`<div>${n}<span>${t}</span></div>`).join('')}</div>`)}`,
  lines:['Our opening run, drawn as a trace. Time runs left to right, and each row shows who acts.',
   'Here a person had a say only at the two ends. In the jobs ahead, watch for the amber circle.'],
  ask:['Who acts most often in this run?','Where in this run did a person have a say?'],
  expected:[`The tools: ${word(D.opening.calls)} calls in ${word(rounds)} rounds. The agent only decides what to ask for.`,
   'Only at the two ends: you asked, and you read the answer. In every trace that follows, look for where the person sits.'],
  point:'Every job in this part is drawn the same way, so you can compare who decides, what acts, and where a person checks.',
  transition:'The first job: fixing code.',
  source:`The opening run (${esc(T.model)}, ${T.date_text}): ${word(D.opening.calls)} tool calls in ${word(D.opening.steps)} rounds.`});
}

// ---------------------------------------------------------------------------------------- 3.1 knowledge work: coding
chap('3.1','Knowledge work');
task('app-coding-task','Coding: a test has started failing',{
 img:'app-coding.jpg',alt:'Illustration: a developer at a laptop in the evening, a small helper beside it',
 who:'A developer',req:'A test started failing after yesterday’s change. Find the cause and fix it.',
 tools:[['terminal','run the tests'],['file','read and edit files'],['search','search the code'],['branch','open a pull request']],
 lines:['What would an agent need for this job? Think of what a developer opens first.',
  'The same tools a developer uses. The last one proposes the change for a person to review.'],
 ask:['What would you open first if you had to fix this yourself?','Which of these tools touches something other people depend on?'],
 expected:['The failing test and its error, then the code that changed yesterday. An agent needs the same: a way to run the tests and to read the files.',
  'Editing changes only the agent’s own copy. The pull request is where the change meets everyone else’s code, so that is where a person comes in.'],
 point:'A coding agent needs the tools a developer already uses: run the tests, read and edit files, search, and propose a change.',
 transition:'Here is what it does with them.'});

does('app-coding','Coding: it stops at a pull request',{builds:3,factsAt:2,evidenceAt:3,
 steps:[{lane:'tools',icon:'terminal',t:'Run the\ntests'},{lane:'agent',icon:'search',t:'Find the\ncause',at:1},
  {lane:'tools',icon:'pen',t:'Edit the\ncode',at:1},{lane:'tools',icon:'terminal',t:'Rerun\nthe tests',kind:'done',at:1},
  {lane:'tools',icon:'branch',t:'Open a pull\nrequest',at:2},{lane:'you',icon:'approve',t:'Review\nand merge',kind:'check',at:2}],
 check:'The change itself, before it is merged.',
 evidence:{label:'SWE-bench Verified',big:`${num(SW.leaderboard_pct,0)}%`,text:`of ${SW.tasks} real GitHub issues fixed, the top independent score.`},
 lines:['It works on its own copy of the code, and it can tell when the fix works: the tests pass.',
  'It does not merge the fix itself. A person reads the change and decides.',
  'How good are coding agents? This is the best-known public test of them.'],
 ask:['The tests pass now. Is the job done?','Why stop at a pull request instead of merging?','What does a score on this test tell you about your own code?'],
 expected:['Not yet. Passing tests say the failure has gone; whether the fix is the right one is a reviewer’s call.',
  'Merging changes the code everyone else depends on. A review takes minutes, and the tests already did most of the checking.',
  `Less than it seems. The ${SW.tasks} tasks come from public Python projects, and the test has leaked into training data. Run your own evals (Part 4). Developers use the tools anyway: ${D.so.use_or_plan}% use or plan to use AI tools, and ${num(D.so.agents_weekly,0)}% use agents at least weekly (Stack Overflow survey, ${D.so.year}).`],
 point:`A coding agent can do most of the work because tests check it in seconds, and a person approves the merge. ${where('coding')}`,
 misconception:`That vendor scores are the ones to quote. Vendors report higher numbers (${num(SW.mid.pct,1)}% for ${esc(SW.mid.model)}, ${num(SW.late.pct,1)}% for the restricted ${esc(SW.late.model)}), and OpenAI has said the test is contaminated and stopped reporting it. The independent leaderboard is the safer number.`,
 transition:'Code has tests. Data analysis has something almost as good: code you can rerun.',
 source:'Trace: a sketch of how coding agents such as Claude Code or Codex typically work. Score: the swebench.com leaderboard.'});

// ---------------------------------------------------------------------------------------- data analysis (notebook 3.1)
{
 const TOOLS=usedTools(T.analyst,{describe_table:['database','describe the table'],run_pandas:['code','run Python code']});
 task('app-analyst-task','Data analysis: which city had the worst winter air?',{
  img:'app-analyst.jpg',alt:'Illustration: a laptop showing simple charts, a hazy city skyline in the window',
  req:esc(AN.req_short),tools:TOOLS,
  lines:[`A table of daily PM2.5 for ${word(AN.n_cities)} Indian cities. What would an agent need to answer this?`,
   `Only ${word(TOOLS.length)} tools. The second runs any code the model writes, so it can count, average and draw.`],
  ask:['How would you answer this yourself?','Why one tool that runs code, instead of one tool for each question?'],
  expected:['Open the table, keep the winter months, count each city’s days over the limit, and draw a bar chart.',
   'Because the questions change. With code it can filter, count and chart whatever the question needs. In a real deployment that code runs in a sandbox.'],
  point:'An analysis agent needs only a way to see the data and a way to run code on it.',
  transition:'Over to the notebook to run it.',
  source:'Data: daily PM2.5 for each city, CAMS model estimates via Open-Meteo.'});
}

nbRun('nb-analyst','work','3.1','A data analyst',{
 run:'tools = [describe_table, run_pandas]\nanalyst = run_agent(question, tools, system=ANALYST)',
 look:['Does it look at the table before it counts?','The code it writes, and the chart it draws'],
 line:'This run takes about a minute, so we start it and watch the code it writes.',
 ask:'What should a careful analyst do before counting anything?',
 expected:'Look at the table: which columns, which cities, which dates. Watch whether the agent does.',
 point:'The agent writes and runs its own code, and we can read every line of it.',
 demo:`Notebook 3.1: run the cells under “A data analyst”. Live, it takes about a minute: our recorded run spent ${num(AN.seconds,0)} seconds in the model, and drawing the chart adds a little. Read out each run_pandas call while it works. If it is slow or fails, move on: the next slides show our recorded run.`,
 transition:'Here is what our recorded run did.'});

does('app-analyst','It looked at the table before it counted',{builds:2,
 steps:[{lane:'tools',icon:'database',t:'Describe\nthe table'},{lane:'tools',icon:'code',t:'Count with\ncode',at:1},
  {lane:'agent',icon:'search',t:`Over ${S}, or\n${S} and over?`,at:2},{lane:'tools',icon:'code',t:'Count\nboth ways',at:2},
  {lane:'tools',icon:'chart',t:'Draw the\nchart',at:2},{lane:'agent',icon:'pen',t:'Answer',at:2}],
 check:`The code, and what “over ${S}” means.`,
 evidence:{label:'Our run',big:`${num(AN.seconds,0)} seconds`,text:`and ₹${num(AN.cost_inr,2)}, in ${word(AN.steps)} rounds.`},
 lines:['First it asked what is in the table: the columns, the cities, the dates. Then it wrote code to count.',
  `${Word(AN.at_standard)} days sat at exactly ${S}, so it questioned its own definition and counted both ways.`],
 ask:['Why look at the table before counting?','What would you check before trusting these counts?'],
 expected:['To learn the column names and the date range. Code written blind fails, or worse, counts the wrong thing.',
  `The definition: does “over the standard” mean above ${S}, or ${S} and above? Counting both ways changed ${AN.changed_by_definition.join(' and ')} by a day or two; it kept “above ${S}”.`],
 point:`An analysis agent shows its work as code, so anyone can rerun it and check the numbers. ${where('analyst')}`,
 misconception:`That code makes the answer right. ${Word(AN.failed_runs)} of its ${word(AN.code_calls)} code runs failed, and it read the error and fixed the code. A wrong definition raises no error at all, so that is what a person checks.`,
 transition:'Here is the chart it drew, and its answer.',
 source:`Real run (notebook 3.1, ${esc(T.model)}, ${T.date_text}): ${word(AN.calls)} tool calls, condensed to its main steps.`});

{
 const rows=[...AN.cities].sort((a,b)=>b.days_over-a.days_over),W=640,H=372,L=134,top=42,rh=(H-top-2)/rows.length,bw=W-L-58;
 const bar=(c,i,full)=>`<rect x="${L}" y="${(top+i*rh+4).toFixed(1)}" width="${Math.max(c.days_over/AN.winter_days*bw,2).toFixed(1)}" height="${(rh-8).toFixed(1)}" rx="3" fill="${COL.data}"${full?'':' opacity=".55"'}/>`;
 const bars=label(0,22,`Days over ${S} µg/m³, out of ${AN.winter_days}`,{size:20,fill:MUTED,weight:650})+rows.map((c,i)=>{
  const y=top+i*rh+rh/2+7,on=c.city===AN.worst,x=L+c.days_over/AN.winter_days*bw;
  return label(L-12,y,esc(c.city),{size:20,fill:COL.ink,anchor:'end'})+bar(c,i,false)+(on?gat(2,bar(c,i,true)):'')+label(x+8,y,String(c.days_over),{size:20,fill:COL.ink});}).join('');
 const [,second,third]=rows;
 S_('analyst-answer','work','Its chart and its answer',{builds:2,
  body:`<div class="p3a-chart"><svg class="p3a-bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Days over ${S} µg/m³ last winter in each of ${word(AN.n_cities)} cities, redrawn from the agent’s numbers">${bars}</svg>
   ${at(2,`<div class="p3a-head"><small>Its answer</small><b>${esc(AN.worst)}</b><p>${AN.worst_days} of ${AN.winter_days} winter days over ${S} µg/m³, and the worst average: ${num(AN.worst_mean,1)} µg/m³.</p></div>`)}</div>`,
  lines:['Its chart, redrawn from its numbers. The top cities were over the limit on most winter days.',
   'Its answer agrees with the chart. Every number came from code, so we can rerun it to check.'],
  ask:['Which city would you have guessed?','Would you put this headline in a report as it stands?'],
  expected:[`Most guess Delhi. ${esc(AN.worst)} comes first, with ${esc(second.city)} and ${esc(third.city)} close behind.`,
   `After one check: rerun the code and confirm the definition of “over ${S}”. And say what the data are: model estimates for each city, from CAMS. At the other end, ${AN.fewest_cities.join(' and ')} had ${word(AN.fewest_days)} day each over the limit.`],
  point:'The answer comes with the code that produced it, so checking it is cheap: rerun and compare.',
  misconception:`That the chart shows measured air. These are CAMS model estimates for each city, ${AN.period}; no monitoring station was read. The agent’s own chart is figures/${AN.chart.file}, too small to read in a hall, so the slide redraws it.`,
  transition:'Research is harder to check. There is no code to rerun, only sources.',
  source:`Real run (notebook 3.1, ${esc(T.model)}, ${T.date_text}), chart redrawn from its numbers. Data: CAMS model estimates via Open-Meteo.`});
}

// ---------------------------------------------------------------------------------------- research (notebook 3.2)
{
 const TOOLS=usedTools(T.research,{search_wikipedia:['search','search Wikipedia'],read_wikipedia:['globe','read a page']});
 task('app-research-task','Research: an answer with sources',{
  img:'app-research.jpg',alt:'Illustration: a stack of documents and a magnifying glass, cards flying into a finished report',
  req:esc(RS.goal),tools:TOOLS,
  lines:['A question about a government programme, and we want a source for every claim. What would an agent need?',
   'A search and a reader. Ours uses Wikipedia; at work it would be the web and your own files.'],
  ask:['Where would you look first for this?','What could go wrong with an answer built from search results?'],
  expected:['A search engine, then the programme’s own pages. An agent needs the same: a search tool, and a way to read what it finds.',
   'It might rest on one weak source, quote an old figure, or attach a link that does not say what the claim says.'],
  point:'A research agent needs a search tool, a way to read, and instructions to cite what it read. Products sold as “deep research” do the same with many more searches, for market scans or literature reviews.',
  transition:'Over to the notebook.'});
}

nbRun('nb-research','work','3.2','A research assistant with sources',{
 run:'tools = [search_wikipedia, read_wikipedia]\nresearch = run_agent(question, tools, system=RESEARCH)',
 look:['Which page does it choose to read?','A link after each claim'],
 line:'We tell it: answer only from what you read, and put a link after each claim.',
 ask:'How many pages do you think it will read?',
 expected:'Most guess several. Watch the tool calls: it may read fewer than you expect.',
 point:'We ask for a link after each claim, so that we can see where each claim came from.',
 transition:'Here is our recorded run.'});

{
 const calls=T.research.turns.flatMap(t=>t.calls),nSearch=calls.filter(c=>c.name==='search_wikipedia').length;
 const reads=calls.filter(c=>c.name==='read_wikipedia'),hits=T.research.turns[0].results[0].result;
 if(!reads.length||!Array.isArray(hits))throw new Error('research trace: expected a search, then a read');
 does('app-research',`Our run read ${word(reads.length)} page${reads.length>1?'s':''}`,{builds:2,
  steps:[{lane:'tools',icon:'search',t:'Search\nWikipedia'},{lane:'agent',icon:'list',t:'Pick a\npage',at:1},
   {lane:'tools',icon:'globe',t:'Read\nthe page',at:1},{lane:'agent',icon:'pen',t:'Answer,\nwith links',at:2},
   {lane:'you',icon:'approve',t:'Open the\nlinks',kind:'check',at:2}],
  check:'Open each link and read what the page says.',
  evidence:{label:'Our run',big:`${num(RS.seconds,0)} seconds`,text:`and ₹${num(RS.cost_inr,2)}, in ${word(RS.steps)} rounds.`},
  lines:[`It searched ${times(nSearch)}, picked ${word(reads.length)} page from the results, and read it.`,
   'Then it answered with a link after each claim, as we asked. Are the links enough?'],
  ask:[`The search returned ${word(hits.length)} titles. Which would you have read?`,'Every claim has a link. Can you forward the answer to your manager?'],
  expected:[`It read “${esc(reads[0].args.title)}”, a general page. The programme had no page of its own among the results.`,
   'Not yet. A link says where to look. Someone has to open it and read the sentence it points to.'],
  point:`A research agent saves the searching and reading, but its answer is a draft until someone checks the sources. ${where('research')}`,
  transition:'Here is its answer, with its links.',
  source:`Real run (notebook 3.2, ${esc(T.model)}, ${T.date_text}): ${word(RS.calls)} tool calls.`});
}

{
 // The claims of its answer: "* **Label:** text (url)". Each is cut to its key phrase, quoted as the model wrote it.
 const CUT={'Start date':/launched in \d{4}/,'Aim':/improve air quality across \d+ Indian cities/,'Target':/an? [\d%]+ to [\d%]+ reduction in .+? by \d{4}/};
 const claims=T.research.answer.split('\n').filter(l=>/^\s*\*/.test(l)&&l.includes('http')).map(l=>{
  const m=l.match(/\*\*(.+?):\*\*\s*(.+?)\s*\((https?:\/\/[^\s)]+)\)/);if(!m)throw new Error('research answer: a claim without a label and link');
  const text=m[2].replace(/\$\\text\{PM\}_\{([\d.]+)\}\$/g,'PM$1'),cut=CUT[m[1]]&&text.match(CUT[m[1]]);
  if(!cut)throw new Error('research answer: no key phrase for '+m[1]);
  return {label:m[1],text:cut[0],url:m[3]};});
 if(claims.length!==RS.claims||new Set(claims.map(c=>c.url)).size!==RS.distinct_links)throw new Error('research answer: claims or links changed');
 const year=claims.at(-1).text.match(/by (\d{4})$/)[1];
 S_('research-links','work','Every claim has a link',{builds:2,
  body:`<div class="p3a-claims">${claims.map(c=>`<b>${esc(c.label)}</b><span>${esc(c.text)}</span>${chip('globe',esc(new URL(c.url).pathname))}`).join('')}
   ${at(2,`<div class="p3a-one">${RS.distinct_links===1?'one page':`${word(RS.distinct_links)} pages`}</div>`)}</div>`,
  lines:['Its answer, cut to the key phrase of each claim. It looks well sourced.',
   `All ${word(RS.links)} links go to one general page. Someone still has to open it and read it.`],
  ask:['Which of these claims would you check before quoting it?','What would a careful researcher add?'],
  expected:[`The target. It is the number a decision would rest on, and it is for ${year}, which has passed. Is it still the target today? The answer cannot tell you.`,
   'A primary source, such as the programme’s own documents, and the date of each figure. A general page is only a starting point.'],
  point:'A link shows where a claim came from. Only reading the source shows whether the claim is right and still current.',
  misconception:'That a citation proves a claim. A model can attach a plausible link to a sentence the page does not support; only reading the source checks it.',
  transition:'From knowledge work to operations: customer support.',
  source:`Real answer (notebook 3.2, ${esc(T.model)}, ${T.date_text}), each claim cut to its key phrase. Every link: ${esc(claims[0].url)}`});
}

// ---------------------------------------------------------------------------------------- 3.2 operations: customer support
chap('3.2','Operations');
{
 const TOOLS=[['database','look up orders'],['file','read the refund policy'],['rupee','refund','risk'],['send','reply to the customer','risk']];
 const nAct=TOOLS.filter(t=>t[2]==='risk').length;
 task('app-support-task','Customer support: the refund from Part 1',{
  img:'app-support.jpg',alt:'Illustration: a customer with a phone, and a support desk where a small helper types a reply',
  who:'A customer',req:`My ${esc(REF.item)} (order ${REF.order}, ₹${big(REF.amount)}) arrived damaged. I want a refund.`,tools:TOOLS,
  lines:['The refund from Part 1, now as a customer’s message. What would an agent need to settle it?',
   `${Word(TOOLS.length-nAct)} of these only read. The ${word(nAct)} in red act: one moves money, one sends a message.`],
  ask:['What would a person on the support desk check first?','Which of these tools would you let it use without asking you?'],
  expected:['The order: was it delivered, and for how much? Then the policy: is damage covered, and is it within the time limit?',
   'Reading, always. Refunds only up to a small amount. Replies perhaps, once you trust its wording.'],
  point:'Reading tools are safe to give an agent. The tools that move money or send messages need limits.',
  transition:'So we put a cap on the refund tool.',
  source:'The refund is from the notebook’s demo inbox.'});
}

{
 const steps=[{lane:'tools',icon:'mail',t:'Read the\nmessage'},{lane:'tools',icon:'database',t:'Look up\nthe order',at:1},
  {lane:'tools',icon:'file',t:'Check the\npolicy',at:1},{lane:'agent',icon:'scale',t:'Under\nthe cap?',at:1},
  {lane:'you',icon:'approve',t:'Approve if\nover cap',kind:'check',at:2},{lane:'tools',icon:'rupee',t:'Refund',at:2},
  {lane:'tools',icon:'send',t:'Reply',at:2}];
 does('app-support','Customer support: refunds up to a cap',{builds:2,steps,
  check:'Refunds over the cap, and any case the policy does not cover.',
  lines:['It reads the message, the order and the policy, then asks: is the amount under the cap?',
   'Under the cap, it refunds and replies by itself. Over the cap, a person approves first.'],
  ask:['What cap would you set, and why?','What else should send a case to a person?'],
  expected:['Most choose a small amount: small, clear cases run alone, large or odd ones go to a person. That is Part 1’s autonomy level, set by amount.',
   'An angry customer, a repeat claim, a legal threat, anything the policy does not cover. Keep the cap low: whatever the agent promises, the company has to honour (Air Canada, Part 4).'],
  point:`A support agent can settle small, routine refunds; anything over the cap goes to a person. ${where('support')}`,
  misconception:'That the cap is something the model remembers to respect. It belongs in the refund tool itself, in our code, so it holds whatever the model writes.',
  transition:'Has anyone run this at scale? One payments company did.',
  source:'Trace: a design drawn for this talk; it describes no deployed system.'});
 // the path most cases take: out of "Under the cap?" low on its right, along the agent lane, down into Refund's top
 const g=geom(steps,WIDE),y3=g.y(3),y5=g.y(5),dy=12,dx=Math.sqrt(g.r**2-dy**2);
 overlay('app-support',g,gat(2,route([[g.x(3)+dx+3,y3+dy],[g.x(5),y3+dy],[g.x(5),y5-g.r-6]],{text:'yes',at:[g.x(4),y3+dy-8],halo:'#F3EDF9'})));
}

S_('support-klarna','work',`Klarna’s assistant took ${KL.share} of its chats`,{builds:2,
 body:`<div class="p3a-stats"><div><div><b>${KL.chats}</b><p>chats handled</p></div></div>
  <div><div><b>under ${KL.minutes_after} min</b><p>per query, down from ${KL.minutes_before}</p></div></div>
  ${at(2,`<div class="r"><b>“Lower quality”</b><p>its CEO’s verdict. Some chats now go to people again.</p></div>`)}</div>`,
 lines:['Klarna, a payments company, put an AI assistant on its customer chats. In its first month:',
  'Its CEO later said the focus on cost had lowered quality. What would you measure besides cost?'],
 ask:[`It handled ${KL.share} of the chats. Is ${KL.share} of the job done?`,'Why do you think quality fell?'],
 expected:['No. The rest are the hard cases, and speed says nothing about whether the customer was helped.',
  `Its CEO said cost had been too dominant a factor in judging it. Klarna now offers a person for some cases; the new staff are freelance, gig-style workers, and total headcount kept falling. Klarna had said the assistant did the work of about ${KL.fte} full-time agents.`],
 point:'Handling a share of the chats is a different thing from helping those customers. Measure quality from the start, and keep a person within reach.',
 misconception:'That “Klarna is hiring people again” means it reversed course. The hires are freelance, gig-style agents, and headcount kept falling.',
 transition:'Now our own inbox assistant, with an approval step built in.',
 source:`Klarna: press release (${KL.date}); its CEO’s interview with Bloomberg (${KL.turn_date}), as reported by Entrepreneur.`});

{
 const I=T.inbox,mails=I.turns[0].results[0].result,nRead=I.turns[1].calls.filter(c=>c.name==='read_email').length;
 const ok=I.approvals.filter(a=>a.allowed),sent=I.sent;
 if(!ok.length||ok[0].call!==D.inbox.gated_tool||!sent.length)throw new Error('inbox trace: expected an approved send');
 nbRun('nb-inbox','work','3.3','An inbox assistant that asks first',{
  run:'@tool(needs_approval=True)\ndef send_email(to, subject, body): ...',
  look:['It reads every email without asking','It stops and asks before it sends'],
  line:`A made-up inbox of ${word(mails.length)} emails, with this refund among them. Sending an email needs a person’s approval.`,
  ask:'Which of its actions should wait for you?',
  expected:'Sending. Reading is safe, but a sent email cannot be taken back.',
  point:'The approval sits in our code, on the tool, so the model cannot skip it.',
  demo:'Notebook 3.3: run the cells under “An inbox assistant that asks first”. When it stops and asks before send_email, read the request out, then type y. If it is slow or fails, move on: the next slide shows our recorded run.',
  transition:'Here is our recorded run.'});

 const steps=[{lane:'tools',icon:'list',t:'List the\ninbox'},{lane:'tools',icon:'mail',t:'Read the\nemails',n:nRead,at:1},
  {lane:'agent',icon:'send',t:'Ask to send\na reply',at:2},{lane:'you',icon:'approve',t:'Approve',kind:'check',at:2},
  {lane:'tools',icon:'send',t:'Send',at:2},{lane:'agent',icon:'notes',t:'Summarise\nthe rest',at:2}];
 const a=ok[0].args;
 S_('inbox-run','work','It asked before it sent',{builds:2,
  body:`${lanes(steps,{W:1152,laneH:96,fs:20,gap:6,left:196,alt:'Our inbox run as a trace: list the inbox, read the emails at once, ask to send a reply, a person approves, send, summarise the rest'})}
   ${at(2,`<div class="p3a-gate">${iconHTML('approve',COL.amber,34)}<div><small>Held for a person</small><span class="mono">${esc(ok[0].call)}</span> to ${esc(a.to)}: “${esc(a.body)}”</div>
    <b>${iconHTML('check','#fff',24)}Approved</b></div>`)}`,
  lines:[`We asked it to reply to Priya and summarise the rest. First it read all ${word(nRead)} emails.`,
   'Then it asked to send one reply. Our code held it until a person approved, and only then sent it.'],
  ask:['It read the refund email too. Did it act on it?','What if the reply had gone to the wrong person?'],
  expected:['No. We did not ask it to; it only mentioned the refund in its summary. Reading it was harmless.',
   'The approval would catch it: you see the address and the text before anything is sent. In Part 4 an email in this inbox tries to trick the agent, and this same step stops it.'],
  point:`The approval step worked: the agent read freely, and the one action with an effect outside, sending, waited for a person. ${Word(ok.length)} approval, ${word(sent.length)} email sent.`,
  transition:'That is knowledge work and operations. Now, jobs outside the office.',
  source:`Real run (notebook 3.3, ${esc(T.model)}, ${T.date_text}): ${word(I.steps)} rounds, ${word(I.calls)} tool calls, ${num(I.seconds,0)} seconds. The inbox is made up for the demo.`});
}
