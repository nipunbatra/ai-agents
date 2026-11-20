// Part 3a: agents at work, first half. The part break, how to read a trace (the opening run), knowledge work (coding,
// research, data analysis, invoices) and operations (customer support, IT incidents, web forms), each drawn the
// same way by app(). Real runs: data/traces.json (notebook Part 3). Everything else the slides show, published
// numbers and the parameters of the designs: data/p3a.json (scripts/sci/p3a.py). Positions on the stakes map,
// quoted in the notes: data/apps.json.
import {app,partBreak,chap,slides,S_,only,css,esc,data,need,word,Word,num,big,nb,gat,label,
 COL,ROLE,MUTED,icon,lanes} from '../kit.js';

const APPS=need(await data('apps'),'apps','families'),T=need(await data('traces'),'agent','model','date_text');
const D=need(await data('p3a'),'research','analyst','inbox','opening','swe','so','klarna','osworld','design');
const RS=D.research,AN=D.analyst,INV=D.inbox.invoice,REF=D.inbox.refund,SW=D.swe,KL=D.klarna,OS=D.osworld,DS=D.design;

css(`.p3a-fam{display:block;font-size:19px;line-height:1.3;color:var(--muted);margin-bottom:2px}
.p3a-key{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 26px}
.p3a-key>div{display:flex;align-items:center;gap:10px;font-size:21px;line-height:1.3;min-width:0}
.p3a-key svg{flex:none}
.p3a-chart{display:grid;grid-template-columns:auto minmax(0,1fr);gap:24px;align-items:center}
.p3a-bars{width:580px;max-width:100%;height:auto;display:block}
.p3a-head small{display:block;font-size:16px;letter-spacing:1px;text-transform:uppercase;font-weight:650;color:var(--q);margin-bottom:4px}
.p3a-head b{display:block;font-size:42px;line-height:1.1;font-weight:650;color:var(--q);margin-bottom:6px}
.p3a-head p{font-size:23px;line-height:1.35}
#app-incident .facts.f2{grid-template-columns:1.15fr 1fr 1.15fr}
@media(max-width:760px){.reading .p3a-key,.reading .p3a-chart{grid-template-columns:minmax(0,1fr)}}`);

/** Where an application sits on the stakes map at the end of Part 3, for the notes. */
const where=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No application '+id);
 return `On the stakes map at the end of Part 3: “${a.zone}” (${a.why.replace(/^./,c=>c.toLowerCase()).replace(/\.$/,'')}).`;};
/** A name from apps.json inside a sentence: "Coding" becomes "coding", "IT incidents" stays. */
const lc=s=>s.replace(/^([A-Z])(?![A-Z])/,c=>c.toLowerCase());
/** Every application slide in this half: the same lane height, label size, gap and left margin. */
const CARD={laneH:82,fs:17,laneOpts:{gap:4,left:204}};
/** Where lanes() puts the nodes of an application trace (same arithmetic as figures.js, for drawing on top). */
function geom(steps,{laneH,fs,laneOpts:{gap,left}},W=960){
 const n=steps.length,colW=(W-left-6)/n,lines=Math.max(...steps.map(s=>String(s.t).split('\n').length)),idx={you:0,agent:1,tools:2};
 const r=Math.max(16,Math.min(25,Math.floor((laneH-14-lines*(fs+2)-fs*.3)/2)));
 return {r,x:i=>left+colW*(i+.5),y:i=>4+idx[steps[i].lane]*(laneH+gap)+r+5};
}
/** An arrow through points, in the style of the trace's own arrows; dashed with a label for the path most cases take. */
function route(pts,{dash=false,text='',at=[0,0],halo='#fff'}={}){
 const [hx,hy]=pts.at(-1),[px,py]=pts.at(-2),a=Math.atan2(hy-py,hx-px),h=10,ink='#4B5563';
 return `<path d="M${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')}" fill="none" stroke="${ink}" stroke-width="2.2"${dash?' stroke-dasharray="7 5"':''} stroke-linejoin="round"/>`+
  `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx-h*Math.cos(a-.42)).toFixed(1)},${(hy-h*Math.sin(a-.42)).toFixed(1)} L${(hx-h*Math.cos(a+.42)).toFixed(1)},${(hy-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${ink}"/>`+
  (text?`<text x="${at[0].toFixed(1)}" y="${at[1].toFixed(1)}" fill="${COL.ink}" font-size="17" font-style="italic" text-anchor="middle" style="paint-order:stroke;stroke:${halo};stroke-width:6px;stroke-linejoin:round">${text}</text>`:'');
}
const HALO={agent:'#F3EDF9',tools:'#EBF2F2'};   // the lane tints of figures.js, flattened onto the paper
/** The trace of an application slide, as app() wrote it into the body: [start, end] of its HTML. */
function traceAt(s){const open='<div class="diagram-scroll lanes">',i=s.body.indexOf(open),j=s.body.indexOf('</svg></div>',i);
 if(i<0||j<i)throw new Error(`${s.id}: no trace`);return [i,j];}
/** Draw extra SVG on top of an application slide's trace, after checking that geom() g still matches figures.js. */
function overlay(id,g,svg){const s=slides.find(x=>x.id===id),[i,j]=traceAt(s);
 if(!s.body.slice(i,j).includes(`<circle cx="${g.x(0).toFixed(1)}" cy="${g.y(0)}" r="${g.r}"`))throw new Error(`${id}: the trace geometry no longer matches figures.js`);
 s.body=s.body.slice(0,j)+svg+s.body.slice(j);}
/** Replace the trace of an application slide with other content from click b on. */
function swapTrace(id,b,html){
 const s=slides.find(x=>x.id===id),[i,j0]=traceAt(s),j=j0+'</svg></div>'.length;
 s.body=`${s.body.slice(0,i)}<div class="state-slot">${only(`1-${b-1}`,s.body.slice(i,j))}${only(String(b),html)}</div>${s.body.slice(j)}`;
}

// ---------------------------------------------------------------------------------------- the part break
partBreak(3,'Fourteen applications',`${Word(APPS.apps.length)} applications in ${word(APPS.families.length)} families, each drawn as the same kind of trace. Some are deployed; some are designs.`,
 APPS.families.map(f=>`${f.name}<span class="p3a-fam">${APPS.apps.filter(a=>a.family===f.id).map(a=>lc(a.name)).join(', ')}</span>`),
 {img:'part-work.jpg',alt:'Illustration: a small town of offices, a farm, a lab and a clinic, joined by thin lines to one small spark',nb:nb('part-3'),
  line:'Key question: for each job, how much should the agent do without a person?',
  ask:'Which job in your team would you hand to an agent first?',
  expected:'Answers vary: reports, ticket triage, data clean-up, first drafts. Keep two of them; we place them on a map at the end of the part.',
  point:'Agents already do real work in many fields, and drawing each one the same way lets us compare them.',
  transition:'First, how to read a trace.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- how to read a trace
{
 const [c0,c1]=D.opening.calls_per_turn;
 const OPEN=[{lane:'you',icon:'person',t:'Your\nquestion'},{lane:'agent',icon:'spark',t:'Ask for\nforecasts'},
  {lane:'tools',icon:'sensor',t:'Forecasts',n:c0},{lane:'agent',icon:'spark',t:`Ask for\n${word(c1)} sums`},
  {lane:'tools',icon:'code',t:'Calculator',n:c1},{lane:'agent',icon:'spark',t:'Answer'},{lane:'you',icon:'eye',t:'Read the\nanswer'}];
 /** One node of a trace, small, for the key. */
 const node=(c,ic,{filled=false,n=0}={})=>`<svg viewBox="0 0 58 54" width="52" height="48" aria-hidden="true"><circle cx="26" cy="29" r="20" fill="${filled?c:'#fff'}" stroke="${c}" stroke-width="2.6"/>${icon(ic,26,29,21,filled?'#fff':c)}${n?`<circle cx="43" cy="12" r="11" fill="${c}"/><text x="43" y="16.5" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">×${n}</text>`:''}</svg>`;
 const KEY=[[node(ROLE.you,'person'),'You: the request, and any check'],[node(ROLE.agent,'spark'),'The agent decides'],
  [node(ROLE.tools,'plug'),'A tool acts on the world'],[node(ROLE.you,'approve',{filled:true}),'A person approves'],
  [node(ROLE.tools,'sensor',{n:c0}),`${Word(c0)} calls made at once`],[node(COL.green,'check',{filled:true})+node(COL.loss,'alert'),'Checked, or a risk']];
 const trace=lanes(OPEN,{W:1152,laneH:96,fs:19,gap:6,alt:'The opening run as a trace: you ask, the agent asks for three forecasts at once, then six sums at once, and answers; you read the answer'});
 S_('read-card','work','How to read a trace',{builds:1,
  body:`${trace}
   <div class="p3a-key">${KEY.map(([n,t])=>`<div>${n}<span>${t}</span></div>`).join('')}</div>`,
  lines:['Our opening run, drawn as a trace. Time runs left to right; each row is who acts. Below: the tools, checks and evidence.'],
  ask:['Where in this run did a person have a say?'],
  expected:['Only at the two ends: you asked, and you read the answer. In every trace that follows, look for where the person sits.'],
  point:'Every application in this part is drawn as the same kind of trace, so you can compare who decides, what acts, and where a person checks.',
  transition:'The first family: knowledge work, starting with code.',
  source:`The opening run (${esc(T.model)}, ${T.date_text}): ${word(D.opening.calls)} tool calls in ${word(D.opening.steps)} steps.`});
}

// ---------------------------------------------------------------------------------------- 3.1 knowledge work
chap('3.1','Knowledge work');
app('app-coding','Coding: from a failing test to a pull request',{...CARD,builds:3,factsAt:2,evidenceAt:3,
 img:'app-coding.jpg',alt:'Illustration: a developer at a laptop in the evening, a small helper beside it',
 req:'A test fails since yesterday’s change. Find the cause and fix it.',
 steps:[{lane:'tools',icon:'terminal',t:'Run the\ntests'},{lane:'tools',icon:'file',t:'Read the\ncode',at:1},
  {lane:'agent',icon:'search',t:'Find the\ncause',at:1},{lane:'tools',icon:'pen',t:'Edit the\ncode',at:1},
  {lane:'tools',icon:'terminal',t:'Rerun\nthe tests',kind:'done',at:1},{lane:'tools',icon:'branch',t:'Open a pull\nrequest',at:2},
  {lane:'you',icon:'approve',t:'Review\nand merge',kind:'check',at:2}],
 tools:[['terminal','run tests'],['file','read, edit'],['search','search code'],['branch','pull request']],
 check:'The pull request: is the change right, and do the tests cover it?',
 evidence:{big:`${num(SW.start.pct,0)}% → ${num(SW.mid.pct,0)}%`,text:`on SWE-bench Verified, ${SW.start.date} to ${SW.mid.date}, vendor-reported. In ${SW.dropped} OpenAI said the test is contaminated.`},
 lines:['It works on a copy of the code: run the tests, read, edit, run the tests again.',
  'It stops at a pull request: a proposed change that a person reviews and merges.',
  'How good are coding agents? A public benchmark built from real GitHub issues:'],
 ask:['The tests pass now. Is the job done?','Why stop at a pull request instead of merging the fix itself?','What does a score on this test tell you about your own code?'],
 expected:['Not yet. Passing tests say the failure has gone; whether the fix is the right one is a reviewer’s call.',
  'Merging is the step everyone else depends on. A review takes minutes, and the tests already did most of the checking.',
  `Less than it seems: the ${SW.tasks} tasks come from public Python projects, the scores come from vendors, and the test leaked into training data. Developers use the tools anyway: ${D.so.use_or_plan}% use or plan to use AI tools, and ${num(D.so.agents_weekly,0)}% use agents at least weekly (Stack Overflow, ${D.so.year}).`],
 point:`A coding agent can do most of the work because tests check it in seconds, and a person approves the merge. ${where('coding')}`,
 misconception:`That ${num(SW.mid.pct,0)}% is the record. Anthropic reported ${num(SW.late.pct,1)}% for its restricted ${esc(SW.late.model.replace(/^Claude /,''))} (${SW.late.date}), and the independent leaderboard tops out at ${num(SW.leaderboard_pct,0)}%. All are claims on a test that has leaked; run your own evals (Part 4).`,
 transition:'A research report has no tests to run. How do we check it?',
 source:'Trace: a sketch of how coding agents such as Claude Code or Codex typically work. SWE-bench Verified scores as the vendors published them.'});

app('app-research','Research: a market scan with sources',{...CARD,builds:2,nb:nb('part-3'),
 img:'app-research.jpg',alt:'Illustration: a stack of documents and a magnifying glass, cards flying into a finished report',
 req:'Scan the market for e-rickshaw battery swapping in India. Cite every claim.',
 steps:[{lane:'agent',icon:'list',t:'Plan the\nquestions'},{lane:'tools',icon:'search',t:'Search\nthe web',n:DS.research_searches,at:1},
  {lane:'tools',icon:'globe',t:'Read the\npages',at:1},{lane:'agent',icon:'pen',t:'Write the\nreport',at:1},
  {lane:'agent',icon:'notes',t:'Cite each\nclaim',at:1},{lane:'you',icon:'approve',t:'Check key\nclaims',kind:'check',at:2}],
 tools:[['search','web search'],['globe','read a page'],['file','your documents']],
 check:'The key claims: open each link and read the sentence it supports.',
 evidence:{label:'Our run, on another question',big:`${Word(RS.claims)} claims`,text:`about India’s clean-air programme, each with a link. All ${word(RS.links)} went to one Wikipedia page.`},
 lines:['It plans, searches many sources at once, reads them, and writes a report with a link after each claim.',
  'A person still checks the claims that matter. Our own small run shows why a link alone is not enough.'],
 ask:['Every claim has a link. Can you forward the report to your manager?','Which claims would you check first?'],
 expected:['Not yet. A link says a source exists. Someone has to open it and read the sentence it supports.',
  'The numbers, and the claims a decision rests on. In our run every link went to one Wikipedia page, and that page described the programme’s original 2019 targets. The programme has since been revised, which is exactly why a person opens the link before quoting.'],
 point:`A research agent saves the reading, but its citations still have to be opened, so its report is a draft. ${where('research')}`,
 misconception:'That a citation proves a claim. A model can attach a plausible link to a sentence the page does not support; only reading the source checks it.',
 demo:'Notebook 3.2: the research assistant searches Wikipedia, reads one page, and answers with a link after each claim.',
 transition:'Data analysis is easier to check: the code can be rerun.',
 source:`Trace: a design drawn for this talk; it describes no deployed system. Our run: notebook 3.2 (${esc(T.model)}, ${T.date_text}), ${word(RS.calls)} tool calls.`});

{
 const S=AN.standard;
 app('app-analyst','Data analysis: which city had the worst winter air?',{...CARD,builds:3,nb:nb('part-3'),
  img:'app-analyst.jpg',alt:'Illustration: a laptop showing simple charts, a hazy city skyline in the window',
  req:esc(AN.req_short),
  steps:[{lane:'tools',icon:'database',t:'Describe\nthe table'},{lane:'tools',icon:'code',t:'Count\nwith code',at:1},
   {lane:'agent',icon:'search',t:`Over ${S}, or\n${S} and over?`,at:2},{lane:'tools',icon:'code',t:'Count\nboth ways',at:2},
   {lane:'tools',icon:'chart',t:'Draw the\nchart',at:2},{lane:'agent',icon:'pen',t:'Answer',at:2}],
  tools:[['database','describe table'],['code','run code']],
  check:`The code, and what “over ${S}” means. Rerun it first.`,
  evidence:{label:'Our run',big:`${Word(AN.calls)} tool calls,`,text:`${num(AN.seconds,0)} seconds, ₹${num(AN.cost_inr,2)}. ${Word(AN.failed_runs)} run failed, and it fixed it.`},
  lines:[`Our run on daily PM2.5 for ${word(AN.n_cities)} cities. It first looks at the table, then writes code to count.`,
   `${Word(AN.at_standard)} days sat at exactly ${S}, so it questioned its own definition. It counted both ways, then drew the chart.`,
   'Its chart, redrawn from its numbers, and its answer. Every number can be recomputed.'],
  ask:['It has the counts. What would you check before trusting them?','Why is analysis like this cheap to check?','Would you put this headline in a report as it stands?'],
  expected:[`The definition: does “over the standard” mean above ${S}, or ${S} and above? Days at exactly ${S} change the count.`,
   `Every step is code you can read and rerun. Counting both ways changed ${AN.changed_by_definition.join(' and ')} by a day or two; it kept “above ${S}”.`,
   `After one check: rerun the code and confirm the definition. And say what the data are: model estimates for each city, from CAMS. At the other end, ${AN.fewest_cities.join(' and ')} had ${word(AN.fewest_days)} day each over the standard.`],
  point:`An analysis agent shows its work as code, so anyone can rerun it and check the numbers. ${where('analyst')}`,
  misconception:'That the chart shows measured air. These are CAMS model estimates for each city; no monitoring station was read.',
  demo:`Notebook 3.1: run the analyst, print the code of each run_pandas call, and rerun one by hand. The chart it drew (figures/${AN.chart.file}) is too small to read in a hall, so the slide redraws it from the same numbers.`,
  transition:'Invoices look like analysis, but at the end money moves.',
  source:`Real run (notebook 3.1, ${esc(T.model)}, ${T.date_text}), condensed; request shortened; chart redrawn from its numbers. Data: CAMS model estimates via Open-Meteo.`});
 // its chart, redrawn: horizontal bars, worst first, the answer's city in full colour
 const rows=[...AN.cities].sort((a,b)=>b.days_over-a.days_over),W=580,H=262,L=118,top=34,rh=(H-top-2)/rows.length,bw=W-L-56;
 const bars=label(0,20,`Days over ${S}, redrawn from its numbers`,{size:18,fill:MUTED,weight:650})+rows.map((c,i)=>{
  const y=top+i*rh,w=c.days_over/AN.winter_days*bw,on=c.city===AN.worst;
  return label(L-10,y+rh/2+6,esc(c.city),{size:18,fill:COL.ink,anchor:'end'})+
   `<rect x="${L}" y="${(y+3).toFixed(1)}" width="${Math.max(w,2).toFixed(1)}" height="${(rh-6).toFixed(1)}" rx="3" fill="${COL.data}"${on?'':' opacity=".5"'}/>`+
   label(L+w+7,y+rh/2+6,String(c.days_over),{size:18,fill:COL.ink,weight:on?700:''});}).join('');
 swapTrace('app-analyst',3,`<div class="p3a-chart"><svg class="p3a-bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="Days over ${S} µg/m³ last winter in each of ${word(AN.n_cities)} cities, redrawn from the agent’s numbers">${bars}</svg>
  <div class="p3a-head"><small>Its answer</small><b>${AN.worst_days} of ${AN.winter_days}</b><p>days over ${S} µg/m³ in ${AN.worst}, the worst city on average (${num(AN.worst_mean,1)} µg/m³).</p></div></div>`);
}

{
 const steps=[{lane:'tools',icon:'file',t:'Read the\ninvoice'},{lane:'tools',icon:'database',t:'Find the\norder',at:1},
  {lane:'tools',icon:'scale',t:'Match\nthe lines',at:1},{lane:'agent',icon:'alert',t:'Explain a\nmismatch',kind:'risk',at:1},
  {lane:'you',icon:'approve',t:'Decide the\nexception',kind:'check',at:1},{lane:'tools',icon:'rupee',t:'Post to\naccounts',at:1}];
 app('app-documents','Invoices: mostly a workflow',{...CARD,builds:2,steps,
  img:'app-documents.jpg',alt:'Illustration: invoices flowing into a filing cabinet, a few flagged ones set aside on a tray',
  req:`Post invoice ${esc(INV.id)} from ${esc(INV.from)} (₹${big(INV.amount)}) if it matches our order.`,
  tools:[['file','read invoices'],['database','purchase orders'],['rupee','accounts']],
  check:'Every exception, before any money moves.',
  evidence:{label:'Workflow or agent?',text:'Mostly Part 1’s fixed workflow. The agent only explains the invoices that do not match.'},
  lines:['Read, find the order, match, post. Only a mismatch needs judgement: first the agent’s, then yours.',
   'Most invoices match and never reach the red step. So build a workflow, and call the agent only for exceptions.'],
  ask:['Which of these steps needs a model to decide anything?','What share of your team’s invoices are exceptions?'],
  expected:['Only the red one, explaining a mismatch. The rest is Part 1’s fixed workflow: read, match, post.',
   'Usually a small share. That share is where an agent pays for itself; plain rules handle the rest more cheaply.'],
  point:`Most invoice processing is a fixed workflow; the agent is needed only for the invoices that do not match. ${where('documents')}`,
  misconception:'That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot.',
  transition:'From the back office to the front desk: customer support.',
  source:'Trace: a design drawn for this talk; it describes no deployed system. The invoice is from the notebook’s demo inbox.'});
 // the normal path: out of Match low on its right, along under the solid arrows, into Post low on its left
 const g=geom(steps,CARD),y=g.y(2),dy=13,dx=Math.sqrt(g.r**2-dy**2);
 overlay('app-documents',g,route([[g.x(2)+dx+3,y+dy],[g.x(5)-dx-4,y+dy]],{dash:true,text:'match',at:[(g.x(2)+g.x(5))/2,y+dy+21],halo:HALO.tools}));
}

// ---------------------------------------------------------------------------------------- 3.2 operations
chap('3.2','Operations');
{
 const steps=[{lane:'tools',icon:'mail',t:'Read the\nmessage'},{lane:'tools',icon:'database',t:'Look up\nthe order',at:1},
  {lane:'tools',icon:'file',t:'Check the\npolicy',at:1},{lane:'agent',icon:'scale',t:'Under\nthe cap?',at:1},
  {lane:'you',icon:'approve',t:'Approve if\nover cap',kind:'check',at:2},{lane:'tools',icon:'rupee',t:'Refund',at:2},
  {lane:'tools',icon:'send',t:'Reply',at:2}];
 app('app-support','Customer support: a refund request',{...CARD,builds:3,factsAt:2,evidenceAt:3,nb:nb('part-3'),steps,
  img:'app-support.jpg',alt:'Illustration: a customer with a phone, and a support desk where a small helper types a reply',
  who:'A customer',req:`My ${esc(REF.item)} (order ${REF.order}, ₹${big(REF.amount)}) arrived damaged. I want a refund.`,
  tools:[['database','orders'],['file','refund policy'],['rupee','refund, capped'],['send','reply']],
  check:'Refunds over the cap, and any case the policy does not cover.',
  evidence:{big:`${KL.chats} chats`,text:`in Klarna’s first month (${KL.date}). By ${KL.turn_date} its CEO said quality had fallen.`},
  lines:['The refund from Part 1. The agent reads the message, looks up the order and the policy, and checks the amount against a cap.',
   'Under the cap, it refunds and replies. Over the cap, or if anything is unusual, a person approves first.',
   `Klarna, a payments company, reported that its assistant took ${KL.share} of chats in its first month, and queries were resolved in under ${KL.minutes_after} minutes instead of ${KL.minutes_before}.`],
  ask:['Would you let the agent refund on its own? Up to what amount?','What else should send a case to a person?','Klarna saved money. Why did it put people back in the loop?'],
  expected:['Most people choose a cap: small, clear cases run alone, large or odd ones go to a person. That is Part 1’s autonomy level, set by amount. Keep the cap low: whatever the agent promises, the company has to honour (Air Canada, Part 4).',
   'An angry customer, a repeat claim, a legal threat, anything the policy does not cover.',
   `Its CEO said cost had been too dominant a factor and the result was lower quality; Klarna now offers a person for some cases. Headlines said it was hiring people again; the new staff are freelance, gig-style workers, and total headcount kept falling. Klarna said the assistant did the work of about ${KL.fte} full-time agents.`],
  point:`A support agent can settle small, routine refunds; anything over the cap goes to a person. ${where('support')}`,
  misconception:'That handling two-thirds of the chats solves two-thirds of the job. The remaining third is the hard part, and quality needs its own measure.',
  demo:`Notebook 3.3: the inbox assistant reads this same refund email; its ${esc(D.inbox.gated_tool)} tool waits for your approval.`,
  transition:'Operations at night: an IT incident.',
  source:`Trace: a design drawn for this talk; it describes no deployed system. Klarna: press release (${KL.date}); the CEO’s interview with Bloomberg (${KL.turn_date}), as reported by Entrepreneur.`});
 // the normal path: out of "Under the cap?" low on its right, along the agent lane, down into Refund's top
 const g=geom(steps,CARD),y3=g.y(3),y5=g.y(5),dy=11,dx=Math.sqrt(g.r**2-dy**2);
 overlay('app-support',g,gat(2,route([[g.x(3)+dx+3,y3+dy],[g.x(5),y3+dy],[g.x(5),y5-g.r-6]],{dash:true,text:'yes',at:[g.x(4),y3+dy-7],halo:HALO.agent})));
}

app('app-incident','IT incidents: errors after a deploy',{...CARD,builds:2,
 img:'app-incident.jpg',alt:'Illustration: a dark server room at night, one rack glowing amber, an engineer at a laptop',
 req:'Checkout errors jumped after tonight’s deploy. Find out why, and fix it.',
 steps:[{lane:'tools',icon:'alert',t:'Read the\nalert',kind:'risk'},{lane:'tools',icon:'pulse',t:'Logs and\nmetrics',n:DS.incident_queries,at:1},
  {lane:'agent',icon:'branch',t:'Link to\nthe deploy',at:1},{lane:'agent',icon:'refresh',t:'Propose a\nrollback',at:1},
  {lane:'you',icon:'approve',t:'On-call\napproves',kind:'check',at:2},{lane:'tools',icon:'refresh',t:'Roll\nback',at:2},
  {lane:'tools',icon:'pulse',t:'Watch the\nmetrics',kind:'done',at:2},{lane:'agent',icon:'notes',t:'Write the\nnote',at:2}],
 tools:[['pulse','logs, metrics'],['branch','deploy history'],['refresh','rollback'],['notes','incident note']],
 check:'The rollback, before it runs; the incident note, after.',
 lines:['It reads the alert, queries logs and metrics at once, and links the errors to the deploy.',
  'The on-call engineer approves once. Then it rolls back, checks that the metrics recover, and writes the incident note.'],
 ask:[`At ${DS.incident_hour}, would you let it roll back on its own?`,'What makes that approval quick?'],
 expected:['Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.',
  'The agent has done the reading: the spike, the deploy behind it, and the exact command. The person only judges.'],
 point:`An incident agent reads the alert, logs and metrics and leaves one decision for a person: the rollback. ${where('incident')}`,
 misconception:'That the risky part is the diagnosis. Reading logs is harmless; the rollback is the step that changes production, so that is where the approval goes.',
 transition:'The last operations job happens in a browser.',
 source:'Trace: a design drawn for this talk; it describes no deployed system.'});

app('app-browser','Web forms: renewing a trade licence',{...CARD,builds:2,
 img:'app-browser.jpg',alt:'Illustration: a laptop showing a web form, a small helper pointing, a hand ready to confirm',
 req:'Renew our trade licence on the city portal, using the documents in our folder.',
 steps:[{lane:'tools',icon:'globe',t:'Open the\nportal'},{lane:'tools',icon:'window',t:'Fill the\nform',at:1},
  {lane:'tools',icon:'file',t:'Upload the\ndocuments',at:1},{lane:'agent',icon:'eye',t:'Check the\nentries',at:1},
  {lane:'you',icon:'approve',t:'Confirm\nthe fee',kind:'check',at:2},{lane:'tools',icon:'rupee',t:'Pay',at:2},
  {lane:'tools',icon:'send',t:'Submit',at:2}],
 tools:[['globe','browser'],['window','click, type'],['file','upload']],
 check:'The filled form and the fee, before it pays and submits.',
 evidence:{big:`${num(OS.paper_best,0)}% → ${num(OS.best_single,0)}%`,text:`of OSWorld computer tasks, ${OS.paper_year} to ${OS.best_single_date}: above the ${num(OS.human,0)}% people scored in the original study.`},
 lines:['It reads the screen, clicks, types and uploads, then checks the form against your files.',
  'It stops once, before paying the fee, because payment and submission cannot be undone.'],
 ask:['Where must it stop and ask you?','How good are agents at screens like these? And if the best now beat people on this test, why still confirm?'],
 expected:['Before paying and submitting. Both are final and in your name; everything before them can be redone.',
  `Very good on the test: the best model scored ${num(OS.paper_best,2)}% in the original study, and the best single model now scores ${num(OS.best_single,2)}% on the cleaned-up OSWorld-Verified, above the ${num(OS.human,2)}% people scored. But a benchmark averages over tidy tasks; real portals have timeouts and unusual forms, and one wrong submission is yours to fix. (An agent framework scores ${num(OS.best_framework,2)}%.)`],
 point:`A browser agent can fill any web form a person can, so the final, paying click stays with a person. ${where('browser')}`,
 misconception:'That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee that cannot be clawed back.',
 transition:'That is knowledge work and operations. Next: science, India and sustainability.',
 source:`Trace: a design drawn for this talk; it describes no deployed system. OSWorld: Xie et al. (${OS.paper_year}), and the OSWorld-Verified leaderboard (${OS.best_single_date}).`});
