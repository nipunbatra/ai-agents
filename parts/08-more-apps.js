// Appendix: more applications from the first half of Part 3 (knowledge work and operations), off the main route:
// invoices, IT incidents and web forms. One application slide each, drawn by app() as on the main route.
// Numbers: data/p3a.json (scripts/sci/p3a.py: the demo invoice, the design parameters, OSWorld from verified.md #18).
// Positions on the stakes map, quoted in the notes: data/apps.json.
import {app,slides,css,esc,data,need,num,big,gat,COL} from '../kit.js';

const APPS=need(await data('apps'),'apps');
const D=need(await data('p3a'),'inbox','osworld','design');
const INV=D.inbox.invoice,OS=D.osworld,DS=D.design;

css(`[data-scene-id="app-incident"] .facts.f2{grid-template-columns:1.15fr 1fr 1.15fr}`);

/** Where an application sits on the stakes map at the end of Part 3, for the notes. */
const where=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No application '+id);
 return `On the stakes map at the end of Part 3: “${a.zone}” (${a.why.replace(/^./,c=>c.toLowerCase()).replace(/\.$/,'')}).`;};
/** Every application slide here: the same lane height, label size, gap and left margin, and off the main route. */
const CARD={laneH:82,fs:17,laneOpts:{gap:4,left:204},section:'optional',optional:true};
/** Where lanes() puts the nodes of an application trace (the same arithmetic as figures.js, for drawing on top). */
function geom(steps,{laneH,fs,laneOpts:{gap,left}},W=960){
 const n=steps.length,colW=(W-left-6)/n,lines=Math.max(...steps.map(s=>String(s.t).split('\n').length)),idx={you:0,agent:1,tools:2};
 const r=Math.max(16,Math.min(25,Math.floor((laneH-14-lines*(fs+2)-fs*.3)/2)));
 return {r,x:i=>left+colW*(i+.5),y:i=>4+idx[steps[i].lane]*(laneH+gap)+r+5};
}
/** A dashed arrow through points, in the style of the trace's own arrows, with a label: the path most cases take. */
function route(pts,{text,at:[tx,ty],halo}){
 const [hx,hy]=pts.at(-1),[px,py]=pts.at(-2),a=Math.atan2(hy-py,hx-px),h=10,ink='#4B5563';
 return `<path d="M${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')}" fill="none" stroke="${ink}" stroke-width="2.2" stroke-dasharray="7 5" stroke-linejoin="round"/>`+
  `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx-h*Math.cos(a-.42)).toFixed(1)},${(hy-h*Math.sin(a-.42)).toFixed(1)} L${(hx-h*Math.cos(a+.42)).toFixed(1)},${(hy-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${ink}"/>`+
  `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" fill="${COL.ink}" font-size="17" font-style="italic" text-anchor="middle" style="paint-order:stroke;stroke:${halo};stroke-width:6px;stroke-linejoin:round">${text}</text>`;
}
/** Draw extra SVG on top of an application slide's trace, after checking that geom() g still matches figures.js. */
function overlay(id,g,svg){
 const s=slides.find(x=>x.id===id),open='<div class="diagram-scroll lanes">',i=s.body.indexOf(open),j=s.body.indexOf('</svg></div>',i);
 if(i<0||j<i)throw new Error(`${id}: no trace`);
 if(!s.body.slice(i,j).includes(`<circle cx="${g.x(0).toFixed(1)}" cy="${g.y(0)}" r="${g.r}"`))throw new Error(`${id}: the trace geometry no longer matches figures.js`);
 s.body=s.body.slice(0,j)+svg+s.body.slice(j);
}

// ---------------------------------------------------------------------------------------- invoices
{
 const steps=[{lane:'tools',icon:'file',t:'Read the\ninvoice'},{lane:'tools',icon:'database',t:'Find the\norder',at:1},
  {lane:'tools',icon:'scale',t:'Match\nthe lines',at:1},{lane:'agent',icon:'alert',t:'Explain a\nmismatch',kind:'risk',at:1},
  {lane:'you',icon:'approve',t:'Decide the\nexception',kind:'check',at:1},{lane:'tools',icon:'rupee',t:'Post to\naccounts',at:1}];
 app('app-documents','Invoices: mostly a workflow',{...CARD,builds:2,steps,
  img:'app-documents.jpg',alt:'Illustration: invoices flowing into a filing cabinet, a few flagged ones set aside on a tray',
  req:`Post invoice ${esc(INV.id)} from ${esc(INV.from)} (₹${big(INV.amount)}) if it matches our order.`,
  tools:[['file','read invoices'],['database','purchase orders'],['rupee','accounts']],
  check:'Every exception, before money moves.',
  evidence:{label:'Workflow or agent?',text:'Mostly a fixed workflow. The agent only explains mismatches.'},
  lines:['Read, find the order, match, post. Only a mismatch needs judgement: first the agent’s, then yours.',
   'Most invoices match and never reach the red step. So build a workflow, and call the agent only then.'],
  ask:['Which of these steps needs a model to decide anything?','What share of your team’s invoices are exceptions?'],
  expected:['Only the red one, explaining a mismatch. The rest is Part 1’s fixed workflow: read, match, post.',
   'Usually a small share. That share is where an agent pays for itself; plain rules handle the rest more cheaply.'],
  point:`Most invoice processing is a fixed workflow; the agent is needed only for the invoices that do not match. ${where('documents')}`,
  misconception:'That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot.',
  transition:'Next in the appendix: an IT incident at night.',
  source:'Trace: a design drawn for this talk; it describes no deployed system. The invoice is from the notebook’s demo inbox.'});
 // the normal path: out of Match low on its right, along under the solid arrows, into Post low on its left
 const g=geom(steps,CARD),y=g.y(2),dy=13,dx=Math.sqrt(g.r**2-dy**2);
 overlay('app-documents',g,route([[g.x(2)+dx+3,y+dy],[g.x(5)-dx-4,y+dy]],{text:'match',at:[(g.x(2)+g.x(5))/2,y+dy+21],halo:'#EBF2F2'}));
}

// ---------------------------------------------------------------------------------------- IT incidents
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
  'The on-call engineer approves once. Then it rolls back and writes the note.'],
 ask:[`At ${DS.incident_hour}, would you let it roll back on its own?`,'What makes that approval quick?'],
 expected:['Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.',
  'The agent has done the reading: the spike, the deploy behind it, and the exact command. The person only judges.'],
 point:`An incident agent reads the alert, logs and metrics and leaves one decision for a person: the rollback. ${where('incident')}`,
 misconception:'That the risky part is the diagnosis. Reading logs is harmless; the rollback is the step that changes production, so that is where the approval goes.',
 transition:'Next in the appendix: a job done in a browser.',
 source:'Trace: a design drawn for this talk; it describes no deployed system.'});

// ---------------------------------------------------------------------------------------- web forms
app('app-browser','Web forms: renewing a trade licence',{...CARD,builds:2,
 img:'app-browser.jpg',alt:'Illustration: a laptop showing a web form, a small helper pointing, a hand ready to confirm',
 req:'Renew our trade licence on the city portal, using the documents in our folder.',
 steps:[{lane:'tools',icon:'globe',t:'Open the\nportal'},{lane:'tools',icon:'window',t:'Fill the\nform',at:1},
  {lane:'tools',icon:'file',t:'Upload the\ndocuments',at:1},{lane:'agent',icon:'eye',t:'Check the\nentries',at:1},
  {lane:'you',icon:'approve',t:'Confirm\nthe fee',kind:'check',at:2},{lane:'tools',icon:'rupee',t:'Pay',at:2},
  {lane:'tools',icon:'send',t:'Submit',at:2}],
 tools:[['globe','browser'],['window','click, type'],['file','upload']],
 check:'The form and the fee, before it pays.',
 evidence:{label:'OSWorld-Verified',big:`${num(OS.best_single,0)}%`,text:`of computer tasks done by the best single model. People scored ${num(OS.human,0)}%.`},
 lines:['It reads the screen, clicks, types and uploads, then checks the form against your files.',
  'It stops once, before paying the fee: payment and submission cannot be undone.'],
 ask:['Where must it stop and ask you?','If the best models now beat people on this test, why still confirm?'],
 expected:['Before paying and submitting. Both are final and in your name; everything before them can be redone.',
  `The test averages over tidy tasks. The best single model scores ${num(OS.best_single,2)}% on OSWorld-Verified, above the ${num(OS.human,2)}% people scored in the original study (where the best model then scored ${num(OS.paper_best,2)}%; an agent framework now scores ${num(OS.best_framework,2)}%). Real portals have timeouts and unusual forms, and one wrong submission is yours to fix.`],
 point:`A browser agent can fill any web form a person can, so the final, paying click stays with a person. ${where('browser')}`,
 misconception:'That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee that cannot be clawed back.',
 transition:'Back to the main route.',
 source:`Trace: a design drawn for this talk; it describes no deployed system. OSWorld: Xie et al. (${OS.paper_year}), and the OSWorld-Verified leaderboard (${OS.best_single_date}).`});
