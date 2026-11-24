// Part 5: agents in your organisation. A workflow or an agent, on one invoice (the invoices that match follow steps we
// write; the ones that do not go to an agent or a person: click 2); three questions on one decision flowchart, the whole
// chart on screen from the start and "We are here" on the question we are at; how much freedom, as three steps raised
// one at a time; what the bug fix cost (nothing per token on a laptop, then the same tokens at a hosted price, then a
// person's minutes of checking, as a live figure); the work a team takes on; Gartner's prediction; and the notebook
// section to try afterwards (5.1; 5.2 is named in its notes and linked from its source line).
// Numbers: data/traces.json (the recorded runs and the hosted price), data/p5.json (scripts/sci/p5.py: the speaker's
// assumptions and the published numbers), data/apps.json (the four zones of Part 3's stakes map).
import {S_,only,data,need,css,esc,word,Word,kY,kA,kT,kG,fig,label,line,arrow,gat,COL,MUTED,icon,iconHTML,chip,widget,register,slider,num,big,nb,nbRun,
 partBreak,recap,chap,loopStrip} from '../kit.js';

const T=need(await data('traces'),'agent','hosted','model','date_text','invoices'),APPS=need(await data('apps'),'apps','zones'),
 D=need(await data('p5'),'cost','tokens_vs_chat','gartner');
const A=need(T.agent,'rounds','tokens_read','tokens_written','inr_hosted','log'),H=need(T.hosted,'name','usd_in','usd_out','inr_per_usd','checked'),
 CO=need(D.cost,'review_min','inr_per_hour','person_inr','price_change','slider');
const IV=need(T.invoices,'check','invoices','problems'),NI=IV.invoices.length,FLAGGED=IV.check.filter(c=>c.flagged).length;   // Part 3's invoice job (scripts/sci/p5.py checks both counts)
const MODEL=T.model.replace(/\s*\(.*\)$/,'');           // "Gemma 4", without the size
const EV=T.evals?.models?.[0];                          // Part 4's eval, once it is recorded
const CHEAP=A.inr_hosted<1;                             // "less than a rupee": checked in scripts/sci/p5.py
const DK='#4B5563';

css(`.p5-wf .p5-later{transition:opacity .38s ease}.scene[data-build="1"] .p5-wf .p5-later{opacity:.3}
.p5-wf .ls-halo{transform-origin:center;transform-box:fill-box;animation:halo 1.8s ease-in-out infinite}
/* the loop strip is drawn here at 1.35 times its own size, so its two edge labels are set back to 17 units (23px on
   screen, the size of this figure's own labels); at the strip's 22 units they are 30px here and run into the arc */
.p5-bill{border:2px solid var(--line);border-radius:18px;background:#fff;padding:22px 30px 14px;flex:1;display:flex;flex-direction:column;justify-content:space-between}
.p5-bill small{display:block;font-size:16px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--muted);margin-bottom:4px}
.p5-bill div{display:flex;justify-content:space-between;align-items:baseline;gap:20px;font-size:29px;padding:17px 0;border-top:2px dotted var(--line)}
.p5-bill div:first-of-type{border-top:0}.p5-bill b{font:650 40px/1 "SFMono-Regular",Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.p5-pay{display:flex;flex-direction:column;gap:18px}
.p5-pay>div{border:2px solid var(--line);border-left:6px solid var(--c);border-radius:16px;background:#fff;padding:16px 26px;display:grid;grid-template-columns:250px minmax(0,1fr);gap:8px;align-items:center;flex:1}
.p5-pay b{font-size:76px;line-height:1;color:var(--c);font-variant-numeric:tabular-nums;letter-spacing:-1.5px;display:grid}.p5-pay b>span{grid-area:1/1}
.p5-pay small{display:block;font-size:16px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--c);margin-bottom:3px}
.p5-pay p{font-size:24px;line-height:1.3;color:#374151;text-wrap:balance}
.p5-cost .w-controls{display:flex;flex-wrap:wrap;gap:10px 44px;font-size:22px;margin-top:20px;padding:14px 22px;border:2px solid var(--line);border-radius:14px;background:#fff}
.p5-cost .w-controls label{min-width:330px}
.p5-jobs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.p5-jobs>div{border:2px solid var(--line);border-top:6px solid var(--c);border-radius:16px;background:#fff;padding:26px 24px 22px;display:flex;flex-direction:column;gap:12px;min-width:0;min-height:300px}
.p5-jobs b{font-size:31px;line-height:1.2;margin-top:4px}.p5-jobs p{font-size:24px;line-height:1.35;color:#374151;text-wrap:pretty}
.p5-jobs small{margin-top:auto;align-self:flex-start;font-size:17px;font-weight:650;color:var(--c);border:1.5px solid var(--c);border-radius:999px;padding:3px 13px}
.p5-quote{margin:0;font-size:38px;line-height:1.3;font-weight:650;border-left:6px solid var(--loss);padding:6px 0 6px 28px}
.p5-quote cite{display:block;font-size:22px;font-style:normal;font-weight:500;color:var(--muted);margin-top:10px}
.p5-why{display:grid;grid-template-columns:max-content 44px 1fr;gap:16px 14px;align-items:center;font-size:28px;line-height:1.3;margin-top:34px;padding-left:34px}
.p5-why .r{color:var(--loss);font-weight:650;display:grid}.p5-why .r>span{grid-area:1/1}.p5-why .r>span:first-child{font-weight:500;opacity:.75}.p5-why .g{color:var(--d)}.p5-why svg{display:block}
@media(max-width:760px){.reading .p5-jobs{grid-template-columns:minmax(0,1fr)}.reading .p5-pay p{font-size:18px}
 .reading .p5-jobs b{font-size:21px}.reading .p5-jobs p,.reading .p5-bill div{font-size:19px}.reading .p5-jobs>div{min-height:0}.reading .p5-bill b{font-size:24px}
 .reading .p5-pay>div{grid-template-columns:120px minmax(0,1fr)}.reading .p5-pay b{font-size:38px}.reading .p5-quote{font-size:24px}
 .reading .p5-why{grid-template-columns:max-content 24px minmax(0,1fr);font-size:18px;gap:10px 8px;padding-left:0}.reading .p5-why .g{min-width:0;overflow-wrap:anywhere}}`);

partBreak(5,'Agents in your organisation','You have seen one small agent do three jobs, and fail. Now, what a team decides before it uses one.',
 ['A workflow or an agent?','How much freedom?','What one task costs','What changes for a team'],
 {img:'part-adopt.jpg',alt:'Illustration: colleagues at a table looking at a flowchart on a screen, with a small staircase beside them',nb:nb('nb-5-1'),
  line:'Key question: should a given task in your team go to an agent, and with how much freedom?',
  ask:'Which task in your team would you hand to an agent first?',
  expected:'Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we run them through the next two slides.',
  transition:'First: does the task need an agent at all?',source:'Illustration: generated (Gemini image model).'});

// The chapters of this part carry no number: 5.1 and 5.2 are sections of the notebook (your own task, your own tool).
// ---------------------------------------------------------------------------------------- a workflow or an agent?
chap('A workflow or an agent?','');
{
 // One invoice, two routes. The top row is a workflow: pills drawn to the scale of the loop strip under it (stage.js),
 // whose pill size and type size are read from the strip itself, so the two rows stay matched if the strip changes.
 // Click 2 adds the route for an invoice that does not match: down to the person and the model of the loop.
 const W=1152,H=400,X0=372,GREY='#7B8698';
 const strip=loopStrip({you:'2',model:'2'}),vb=strip.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)||[0,576,174],VW=+vb[1],VH=+vb[2];
 const you=(strip.match(/<g opacity="\.7"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/)||[0,4,60,72,44]).slice(1).map(Number);
 const k=(W-X0)/VW,SY=H-VH*k,ph=you[3]*k,fs=+(strip.match(/font-size="(\d+)"[^>]*>You</)||[0,21])[1]*k;
 const youX=X0+(you[0]+you[2]/2)*k,youTop=SY+you[1]*k,y2=youTop+ph/2,y1=ph/2+14;
 const PILLS=[['Invoice',COL.data,0],['Read',COL.target,1],['Match',COL.target,1],['Pay',COL.target,1]];
 const ws=PILLS.map(([t])=>t.length*fs*.58+ph*.8),xs=[X0,X0+ws[0]+56,X0+ws[0]+ws[1]+112,W-ws[3]];
 let g='';
 PILLS.forEach(([t,c,lit],i)=>{const x=xs[i],w=ws[i];
  if(i)g+=arrow(xs[i-1]+ws[i-1]+7,y1,x-8,y1,{stroke:GREY,w:3.2,head:15});
  g+=`<g${lit?'':' opacity=".7"'}><rect x="${x.toFixed(1)}" y="${(y1-ph/2).toFixed(1)}" width="${w.toFixed(1)}" height="${ph.toFixed(1)}" rx="${(ph/2).toFixed(1)}" fill="${lit?c:'#fff'}" stroke="${c}" stroke-width="3.2"/>`+
   label(x+w/2,y1+fs*.36,t,{size:fs.toFixed(1),fill:lit?'#fff':c,anchor:'middle',weight:lit?700:600})+'</g>';});
 g+=label((xs[2]+ws[2]+xs[3])/2,y1-16,'it matches',{size:22,fill:DK,anchor:'middle',weight:700});
 const head=(y,ic,c,t,sub)=>icon(ic,17,y-13,32,c,{sw:2.2})+label(46,y-2,t,{size:32,fill:c,weight:700})+label(0,y+34,sub,{size:23,fill:'#374151'});
 g+=head(y1,'list',COL.target,'A workflow','We write the steps.');
 g+=`<g class="p5-later">${head(y2,'spark',COL.guess,'An agent','The model chooses each step.')}`+
  strip.slice(strip.indexOf('<svg'),strip.lastIndexOf('</svg>')+6).replace('<svg ',`<svg x="${X0}" y="${SY.toFixed(1)}" width="${W-X0}" height="${(VH*k).toFixed(1)}" overflow="visible" `)+'</g>';
 const xm=xs[2]+ws[2]/2,yk=(y1+ph/2+youTop)/2-22;
 g+=gat(2,`<path d="M${xm.toFixed(1)},${(y1+ph/2+6).toFixed(1)} V${yk.toFixed(1)} H${youX.toFixed(1)}" fill="none" stroke="${DK}" stroke-width="3.2" stroke-linejoin="round"/>`+
  arrow(youX,yk,youX,youTop-9,{stroke:DK,w:3.2,head:15})+label((xm+youX)/2,yk-13,'it does not match',{size:22,fill:DK,anchor:'middle',weight:700}));
 S_('workflow','adopt','A workflow or an agent?',{builds:2,
  body:fig(W,H,g,'One invoice, two routes. If it matches its order it is read, matched and paid: a workflow, whose steps we write. If it does not match, it goes to a person and an agent: the loop, where the model chooses each step.','p5-wf'),
  lines:['An invoice that matches its order is read, matched and paid. Those steps never change, so we write them once, as code.',
   'One that does not match needs judgement: what is wrong, and what next? That goes to an agent, or to a person.'],
  ask:['Name a job in your team that follows the same steps every time.','In Part 3 our agent checked the invoices. Which part of that job would you now write as a workflow?'],
  expected:['Monthly reports, standard approvals, payroll runs, matching invoices to orders.',
   `Reading each invoice and comparing it with its order: the same steps for all ${word(NI)}. The ${word(IV.problems)} that do not match are where the judgement is, and that goes to an agent or a person.`],
  point:'A workflow has steps we fix in advance. An agent chooses each step after reading the last result.',
  misconception:'That a workflow cannot use a model. A model can do one step, such as reading the invoice, while our code still fixes the order of the steps.',
  demo:`Part 3 had no workflow, so the agent did the whole job: it checked the ${word(NI)} invoices and flagged ${word(FLAGGED)}. A team that pays invoices every week writes the matching down once, and keeps the agent, or a person, for the ones that fail. The bug fix of Part 1 could not be written down: each step depended on what the last one found.`,
  transition:'So the first question about any task is this one.',
  source:'Workflows and agents: Anthropic, “Building effective agents” (Dec 2024).'});
}

// ---------------------------------------------------------------------------------------- should this be an agent?
// One decision flowchart, drawn once per click. The whole chart is on screen from the start; the question we are at
// ('q1', 'q2' or 'q3') is tinted and tagged "We are here", and the rest is faint. The workflow leaf is lit at q1, the
// four zones of Part 3's stakes map (data/apps.json, in the same words) at q3.
const W5=1152,H5=396,QW=220,QH=120,LX=910,LW=242,LH=86,FAINT='.45';
const zone=(easy,costly)=>APPS.zones.find(z=>z.easy===easy&&z.costly===costly);
const ZC=(easy,costly)=>easy?(costly?COL.amber:COL.green):(costly?COL.loss:COL.guess);
const Q={q1:{x:0,y:138,t:['Do the steps','change from','case to case?']},q2:{x:296,y:138,t:['Can a person','check the result','cheaply?']},
 qa:{x:606,y:38,t:['Is a mistake','costly, or','impossible','to undo?']},qb:{x:606,y:238,t:['Is a mistake','costly, or','impossible','to undo?']}};
const LEAF=[[5,true,true],[105,true,false],[205,false,true],[305,false,false]];   // [y, easy to check, costly]
const WF={x:0,y:305,w:QW,h:LH};
const tag=(cx,cy,t,c)=>{const w=t.length*11.5+36;return `<rect x="${(cx-w/2).toFixed(1)}" y="${cy-17}" width="${w.toFixed(1)}" height="34" rx="17" fill="${c}"/>`+label(cx,cy+7,esc(t),{size:19,fill:'#fff',anchor:'middle',weight:700});};
function decide(here){
 const on=k=>k===here||(here==='q3'&&(k==='qa'||k==='qb'));
 const dim=(lit,s)=>lit?s:`<g opacity="${FAINT}">${s}</g>`;
 const qbox=k=>{const b=Q[k],hot=on(k),fs=21,lh=fs*1.22,y0=b.y+(QH-(b.t.length-1)*lh)/2+fs*.35;
  return dim(hot,`<rect x="${b.x}" y="${b.y}" width="${QW}" height="${QH}" rx="14" fill="${hot?'#8B2CDE14':'#fff'}" stroke="${hot?COL.guess:DK}" stroke-width="${hot?5:2.5}"/>`+
   b.t.map((t,i)=>label(b.x+QW/2,y0+i*lh,esc(t),{size:fs,fill:COL.ink,anchor:'middle',weight:hot?700:600})).join(''));};
 const leafBox=(x,y,w,h,lines,c)=>{const fs=21,lh=fs*1.2,y0=y+(h-(lines.length-1)*lh)/2+fs*.35;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" stroke="${c}" stroke-width="3"/>`+lines.map((t,i)=>label(x+w/2,y0+i*lh,esc(t),{size:fs,fill:c,anchor:'middle',weight:700})).join('');};
 // an arrow with its yes or no beside it, on the outer side, so the word never sits on the line
 const branch=(x1,y1,x2,y2,t)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),s=dy>0?-1:1,nx=s*dy/L,ny=-s*dx/L,off=dy?21:15;
  return arrow(x1,y1,x2,y2,{stroke:DK,w:2.6,head:12})+label((x1+x2)/2+nx*off,(y1+y2)/2+ny*off+7,t,{size:20,fill:DK,anchor:'middle',weight:700});};
 const cy=k=>Q[k].y+QH/2;
 let g='';
 // Q1: yes goes on to Q2, no to a workflow
 g+=dim(here==='q1',branch(QW+4,cy('q1'),Q.q2.x-6,cy('q2'),'yes')+arrow(QW/2,Q.q1.y+QH+4,QW/2,WF.y-6,{stroke:DK,w:2.6,head:12})+
  label(QW/2+14,(Q.q1.y+QH+WF.y)/2+7,'no',{size:20,fill:DK,weight:700})+leafBox(WF.x,WF.y,WF.w,WF.h,['A workflow'],COL.target));
 // Q2: cheap to check goes up, hard to check goes down
 g+=dim(here==='q2',branch(Q.q2.x+QW+4,cy('q2')-16,Q.qa.x-6,cy('qa'),'yes')+branch(Q.q2.x+QW+4,cy('q2')+16,Q.qb.x-6,cy('qb'),'no'));
 // Q3 and the four zones of the stakes map
 g+=dim(here==='q3',LEAF.map(([y,easy,costly])=>{const kq=easy?'qa':'qb',c=ZC(easy,costly),ty=y+LH/2;
  return branch(Q[kq].x+QW+4,cy(kq)+(ty<cy(kq)?-14:14),LX-6,ty,costly?'yes':'no')+leafBox(LX,y,LW,LH,zone(easy,costly).name.split(', ').map((t,i,a)=>i<a.length-1?t+',':t),c);}).join(''));
 g+=qbox('q1')+qbox('q2')+qbox('qa')+qbox('qb');
 g+=here==='q3'?tag(Q.qa.x+QW/2,(Q.qa.y+QH+Q.qb.y)/2,'We are here',COL.guess):tag(Q[here].x+QW/2,Q[here].y-25,'We are here',COL.guess);
 return fig(W5,H5,g,'A decision flowchart: do the steps change from case to case, can a person check the result cheaply, and is a mistake costly or impossible to undo. It ends in a workflow or in one of the four zones of the stakes map.');
}
const byZone=(easy,costly)=>APPS.apps.filter(a=>a.zone===zone(easy,costly).name).map(a=>a.name).join(', ')||'none';

S_('should-agent','adopt','Should this task be an agent?',{builds:3,
 body:['q1','q2','q3'].map((q,i)=>only(String(i+1),decide(q))).join(''),
 lines:['Take one task from your team. First question: do its steps change from case to case? If not, write a workflow.',
  'If they do, an agent may help. Second question: can a person check its result in a minute or two?',
  'Third: is a mistake costly, or impossible to undo? Your answers lead to one of the four corners of Part 3’s map.'],
 ask:['Take the task you named a minute ago. Does it follow the same steps every time?',
  'How did we check each of our three jobs today, and how long did it take?',
  'Our agent edits a file in a test folder, or it pays a supplier. Which mistake is costly?'],
 expected:['Often yes: monthly reports, standard approvals, matching invoices. That is good news: a workflow is cheaper to build and to run.',
  'The bug fix: run the tests and read a one-line change. The folder: list it. The invoices: compare with the orders. Seconds each. A strategy memo or a diagnosis would take an expert an hour.',
  `The payment. A wrong edit can be undone in a second; money that has left cannot. On Part 3’s map these could run on their own: ${byZone(true,false)}. These needed approval: ${byZone(true,true)}.`],
 point:'Three questions place a task: do the steps change, can a person check the result cheaply, and what does a mistake cost?',
 misconception:'That a more capable model moves a task to a safer box. It can make mistakes rarer, but what a mistake costs stays the same, so the approval before a step that cannot be undone stays.',
 demo:'Read the third click as two pairs. Cheap to check: if a mistake is costly the agent acts and a person approves; if not, let it run. Hard to check: if a mistake is costly a person leads; if not, the agent only drafts.',
 transition:'A person approves: that is something our own code arranges. How often should it ask?',
 source:'The four boxes on the right are the four zones of the stakes map in Part 3.'});

// ---------------------------------------------------------------------------------------- how much freedom
chap('How much freedom?','');
{
 // Three settings of the approval check in our loop (needs_approval, notebook 1.6; Part 4 showed its code), as three
 // steps: a person decides (amber), our code decides from a list (teal), every request of the model runs (purple).
 // Click 2 puts two arrows at each riser: up when the evals pass, back down when errors rise.
 const W=1152,H=384,base=380,sw=384,tops=[204,112,20],TINTS=['#AA4E0812','#0F766E12','#8B2CDE12'];
 const STEPS=[['approve',COL.amber,'Always ask',['A person approves','every request.']],
  ['list',COL.target,'Ask when it is risky',['Safe commands run.','A person approves the rest.']],
  ['zap',COL.guess,'Never ask',['Every request runs.','A person checks a sample.']]];
 let g='';
 STEPS.forEach(([ic,c,t,sub],i)=>{const x=i*sw,y=tops[i];
  g+=`<rect x="${x}" y="${y}" width="${sw}" height="${base-y}" fill="${TINTS[i]}" stroke="none"/>`+line(x,y,x+sw,y,{stroke:c,w:5})+(i?line(x,y,x,base,{stroke:'#D5DAE0',w:2}):'');
  g+=icon(ic,x+38,y+42,34,c)+label(x+68,y+53,t,{size:30,fill:c,weight:700})+sub.map((s,j)=>label(x+22,y+94+j*30,s,{size:23,fill:COL.ink})).join('');});
 g+=line(0,base,3*sw,base,{stroke:'#D5DAE0',w:2});
 g+=tag(sw+22+78,tops[1]+178,'our notebook',COL.target);
 const riser=i=>{const xr=(i+1)*sw,ya=tops[i]-14,yb=tops[i+1]+6,ym=(ya+yb)/2+8;
  return arrow(xr-36,ya,xr-36,yb,{stroke:COL.green,w:3.4,head:15})+label(xr-56,ym,'evals pass',{size:23,fill:COL.green,anchor:'end',weight:700})+
   arrow(xr-212,yb,xr-212,ya,{stroke:COL.loss,w:3.4,head:15,dash:'7 6'})+label(xr-232,ym,'errors rise',{size:23,fill:COL.loss,anchor:'end',weight:700});};
 g+=gat(2,riser(0)+riser(1));
 S_('freedom','adopt','Give an agent more freedom in steps',{builds:2,nb:nb('nb-1-6','▶ Open 1.6 in Colab'),
  body:fig(W,H,g,'Three steps: always ask, ask when it is risky, never ask. Our notebook is on the middle step. At each step up: move up when the evals pass, and step back down when errors rise.'),
  lines:['Before a request runs, our code can ask a person: always, when it is risky, or never. Our notebook asked when it was risky.',
   'Start on the bottom step. Move up when evals on your own past cases pass. Step back when errors rise.'],
  ask:['What happened in Part 4 when the agent asked to delete files?','What would convince you to move up a step?'],
  expected:['The loop stopped and asked us first. rm is not on the list of safe commands, so it could not run until a person answered.',
   `A measured success rate on enough of your own past cases, and a plan for the errors that remain.${EV?` Part 4 showed the method on a small scale: ${word(EV.n)} runs of one job, each checked by the tests.`:' Part 4 showed the method on a small scale: the same job run many times, each run checked by the tests.'}`],
  point:'How much freedom an agent has is a setting in our own code. Raise it one step at a time, when evals on your own cases support it, and take it back when errors rise.',
  misconception:'That the model decides how much freedom it has, or that freedom is decided once, at launch. The list is in our code, and it is a setting you revisit as the evals, the model and the stakes change.',
  demo:'The setting is the function needs_approval in notebook 1.6, the one Part 4 showed. Start on the bottom step even if the agent could already work alone: a person stops every wrong request, so you learn its error rate on your real cases at no risk.',
  transition:'On every step, someone pays for the model and for the checking. Which costs more?',
  source:'The middle step is SAFE_COMMANDS and needs_approval in the notebook, section 1.6.'});
}

// ---------------------------------------------------------------------------------------- what one task costs
chap('What one task costs','');
S_('cost','adopt','What did the bug fix cost?',{builds:2,
 body:`<div class="duo" style="--l:.9fr;--r:1.1fr;align-items:stretch"><div><div class="p5-bill"><small>The bug fix</small>
   <div><span>rounds</span><b>${A.rounds}</b></div><div><span>tokens read</span><b>${big(A.tokens_read)}</b></div><div><span>tokens written</span><b>${big(A.tokens_written)}</b></div></div></div>
  <div class="p5-pay"><div style="--c:${COL.target}"><b>₹0</b><div><small>On our laptop</small><p>${esc(MODEL)}, an open model</p></div></div>
   <div style="--c:${COL.guess}"><b><span data-only="1">₹ ?</span><span data-only="2">₹${num(A.inr_hosted,2)}</span></b><div><small>On a hosted model</small><p>${esc(H.name)}, same tokens</p></div></div></div></div>`,
 lines:[`The bug fix took ${word(A.rounds)} rounds. ${esc(MODEL)} ran on a laptop, so we paid nothing per token. What would a hosted model charge?`,
  `${CHEAP?'Less than a rupee.':`About ₹${num(A.inr_hosted,0)}.`} Hosted models charge per million tokens, read and written.`],
 ask:['Guess: what would the same run cost on a hosted model?','Is that the whole cost of the task?'],
 expected:['Take three guesses before the click.','No. Someone still has to check the result.'],
 point:CHEAP?'One run of our agent costs less than a rupee in model time, even at a hosted price.':'The model’s price for one run is small, and easy to work out from the tokens.',
 misconception:`That agents are as cheap as a chat. Agents typically use about ${word(D.tokens_vs_chat.agent)} times more tokens than chat interactions (Anthropic, ${D.tokens_vs_chat.when}). Every round rereads the whole conversation.`,
 demo:'A run on your own machine is not free either: someone bought the laptop. But there is no bill per token, and no file leaves the machine.',
 transition:'Now add the person who checks the result.',
 source:`Our recorded run (${esc(T.model)}, ${T.date_text}). Hosted price: ${esc(H.name)}, $${num(H.usd_in,2)} and $${num(H.usd_out,2)} per million tokens read and written, at ₹${H.inr_per_usd} to the dollar (checked ${H.checked}).`});

{
 const SC=CO.slider,KW=1152,KH=262,n0=A.rounds,first=A.log[0].read;
 // Each round rereads everything before it, so the tokens read grow by a fixed amount per round, fitted so that a run
 // of our length reads exactly what ours read (scripts/sci/p5.py checks this against agent.inr_hosted).
 const growth=n0>1?(A.tokens_read-n0*first)/(n0*(n0-1)/2):0,perRound=A.tokens_written/n0;
 const hostedINR=n=>((n*first+growth*n*(n-1)/2)*H.usd_in+n*perRound*H.usd_out)/1e6*H.inr_per_usd;
 const rupees=v=>v<10?num(v,2):big(Math.round(v));
 const share=f=>f>=.995?'all':f<.01?`${num(f*100,1)}%`:`${Math.round(f*100)}%`;
 const costSVG=({rounds,minutes})=>{
  const mc=hostedINR(rounds),pc=minutes/60*CO.inr_per_hour,scale=Math.max(mc,pc,1e-9),bx=540,bw=490;
  const row=(y,ic,c,t,sub,v)=>{const w=Math.max(v/scale*bw,v>0?3:0);
   return `<circle cx="30" cy="${y+31}" r="28" fill="#fff" stroke="${c}" stroke-width="2.8"/>`+icon(ic,30,y+31,29,c)+
    label(76,y+25,t,{size:28,fill:c,weight:700})+label(76,y+57,sub,{size:22,fill:'#4B5563'})+
    `<rect x="${bx}" y="${y+5}" width="${w.toFixed(1)}" height="52" rx="6" fill="${c}"/>`+label(bx+w+14,y+42,`₹${rupees(v)}`,{size:31,fill:COL.ink,weight:700});};
  return row(2,'spark',COL.guess,'A hosted model',`${esc(H.name)} · ${rounds} round${rounds>1?'s':''}`,mc)+
   row(96,'person',COL.amber,'A person checking',`${minutes} minute${minutes===1?'':'s'} at ₹${big(CO.inr_per_hour)} an hour`,pc)+
   line(0,188,KW,188,{stroke:'#DDE2E8',w:2})+
   label(0,238,`<tspan font-weight="700">Per task: ₹${rupees(mc+pc)}.</tspan>  <tspan fill="${COL.guess}" font-weight="650">The model is ${share(mc/(mc+pc))} of it.</tspan>`,{size:30,fill:COL.ink});};
 const ALT='The cost of one task in rupees: the model’s tokens at a hosted price, against a person’s minutes spent checking';
 const BUILD={1:{rounds:n0,minutes:CO.review_min},2:{rounds:SC.rounds_max,minutes:CO.review_min}};
 register('p5-cost',(el,ctx)=>{
  if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD).map(([b,s])=>`<div data-only="${b}">${fig(KW,KH,costSVG(s),ALT)}</div>`).join('')}</div>`;return;}
  el.classList.add('p5-cost');
  el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('rounds','Rounds',SC.rounds_min,SC.rounds_max,1,n0)}${slider('min','A person checks',SC.review_min,SC.review_max,1,CO.review_min)}</div>`;
  const f=el.querySelector('.w-fig'),q=k=>el.querySelector(`[data-k="${k}"]`),o=k=>el.querySelector(`[data-o="${k}"]`),sl={rounds:q('rounds'),min:q('min')};
  let last=null;
  const show=()=>{const s={rounds:+sl.rounds.value,minutes:+sl.min.value};f.innerHTML=fig(KW,KH,costSVG(s),ALT);o('rounds').textContent=String(s.rounds);o('min').textContent=`${s.minutes} min`;};
  for(const s of Object.values(sl)){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
  const scene=el.closest('.scene');
  const sync=()=>{const b=scene?.dataset.build;if(!BUILD[b]||b===last)return;last=b;sl.rounds.value=BUILD[b].rounds;sl.min.value=BUILD[b].minutes;show();};
  if(scene)new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-build']});
  show();sync();
 });
 const mc=hostedINR(n0),pc=CO.review_min/60*CO.inr_per_hour,PC=CO.price_change,cheaper=hostedINR(SC.rounds_max)<pc;
 S_('cost-person','adopt','Now add the person who checks it',{builds:2,
  body:widget('p5-cost',ALT),
  lines:[`A colleague spends ${word(CO.review_min)} minutes checking the result, at ₹${big(CO.inr_per_hour)} an hour. The model is now ${share(mc/(mc+pc))} of the cost.`,
   cheaper?`Even a run of ${SC.rounds_max} rounds costs less than the check. So the saving is in making results quick to check.`
    :`A run of ${SC.rounds_max} rounds costs more than the check. For long runs, watch the tokens as well as the checking.`],
  ask:[`What does ${word(CO.review_min)} minutes of a colleague’s time cost your organisation?`,'Where should you spend effort to make an agent cheaper?'],
  expected:[`At ₹${big(CO.inr_per_hour)} an hour, ${word(CO.review_min)} minutes is about ₹${Math.round(CO.person_inr)}. With overheads it is more.`,
   'On making the check quick: tests, totals that reconcile, a short list of what changed. That is what we did in Part 1. A cheaper model matters far less.'],
  point:'For a run like ours the model costs very little and a person’s check costs far more, so results that are quick to check save the most.',
  misconception:H.name===PC.model?`That the hosted price will stay where it is. From ${PC.when}, ${esc(H.name)} costs $${num(PC.usd_in,2)} and $${num(PC.usd_out,2)} per million tokens read and written, twice today’s price. Even then, a ${SC.rounds_max}-round run costs less than the ${word(CO.review_min)}-minute check.`
   :'That the model’s price decides whether an agent pays for itself. The person’s time decides it.',
  demo:'Drag the rounds slider: each round rereads everything before it, so the cost grows faster than the rounds. Drag the checking time down to one minute, and the two bars come closer.',
  transition:'If checking is where the cost is, the people around the agent matter. What changes for them?',
  source:`Tokens: our recorded run; for other lengths, each round rereads all before it, fitted to that run. Price: ${esc(H.name)}, checked ${H.checked}. Minutes and hourly cost: the speaker’s assumptions.`});
}

// ---------------------------------------------------------------------------------------- what changes for a team
chap('What changes for a team','');
{
 const JOBS=[['pen',COL.guess,'Write the goal','And describe each tool. The model knows only what you write.','1.2'],
  ['eye',COL.target,'Read the runs','A run shows which round went wrong.','2.1'],
  ['check',COL.green,'Build the evals','Past cases with known answers, run many times.','4.6']];
 S_('skills','adopt','What changes for a team?',{builds:1,
  body:`<div class="p5-jobs">${JOBS.map(([ic,c,t,d,n])=>`<div style="--c:${c}">${iconHTML(ic,c,44)}<b>${t}</b><p>${d}</p><small>Notebook ${n}</small></div>`).join('')}</div>`,
  lines:['Someone on the team does these three jobs. Today we did all three, for one small agent.'],
  ask:['Who in your team already does work like this for other software?'],
  expected:['Testers, analysts who write specifications, whoever reviews code or audits a process. These skills carry over.'],
  point:'Adopting an agent mostly changes the work around the model: people describe the task and check the results.',
  misconception:'That agents remove the need for expertise. Experts write the instructions and the evals, and check the cases the agent gets wrong.',
  transition:'What happens to projects that skip this work?'});
}
{
 const G=need(D.gartner,'cancelled_pct','by','when','reasons');
 const FIX=['Count the cost per task, checking included','Ask first: a workflow or an agent?','Raise freedom in steps'];
 const ARROW=`<svg viewBox="0 0 44 20" width="44" height="20" aria-hidden="true" fill="none" stroke="${MUTED}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10H39M31 3l8 7-8 7"/></svg>`;
 S_('cancel','adopt','What does Gartner predict for agent projects?',{builds:2,
  body:`<blockquote class="p5-quote">“Over ${G.cancelled_pct}% of agentic AI projects will be canceled by the end of ${G.by}”<cite>Gartner, a prediction</cite></blockquote>
   <div class="p5-why">${G.reasons.map((r,i)=>`<span class="r"><span data-only="1">Reason ${word(i+1)}?</span><span data-only="2">${esc(r)}</span></span><span data-at="2">${ARROW}</span><span class="g" data-at="2">${FIX[i]}</span>`).join('')}</div>`,
  lines:['Gartner, a research firm, made this prediction about companies’ agent projects, and gave three reasons. What would you guess?',
   'Each of Gartner’s three reasons, in its own words, matches a question from this part.'],
  ask:['Why would a company cancel an agent project?','Which of these would end a project in your organisation?'],
  expected:['Cost, no clear benefit, and risk. Collect a few before the click.',
   'Usually unclear value: an agent built where a workflow would do. The first question of this part catches it.'],
  point:'Each reason Gartner gives has an answer in this part: count the cost, ask whether the task needs an agent, and raise freedom in steps.',
  misconception:`That a prediction is a measurement. This is Gartner’s forecast of what will happen by the end of ${G.by}.`,
  demo:'Gartner’s full sentence: the projects will be canceled “due to escalating costs, unclear business value or inadequate risk controls”.',
  transition:'That is the talk. One thing to run yourself, after today.',
  source:`Gartner press release, ${G.when}. A prediction.`});
}

// ---------------------------------------------------------------------------------------- 5.1 and 5.2: your turn
chap();
nbRun('nb-own-task','adopt','5.1','Give it your own task',{
 run:'mine = run_agent(\n    "How much do we owe each supplier in total, going by "\n    "the invoices in invoices/? Answer in rupees.")',
 look:['Change the sentence to a task from your own work','Before you run it: how will you check the result?'],
 line:'After the talk, section 5.1 is yours. Change one sentence, and the same agent does a different job.',
 ask:'Which task from your own week would you type here?',
 expected:'A report to draft, a folder to sort, a file to check against another. Ask of each one: how would I check the result?',
 point:'A new job for this agent is one new sentence. Deciding how to check the result is the real work.',
 demo:'Notebook 5.1, after the talk or now if there is time. The cell first makes a fresh copy of the project, so nothing from earlier runs is left over. There is no recorded run of this section. Section 5.2, Write your own tool, comes straight after it: a function, a description and @tool above it give the agent a fifth tool, today’s date, which no model knows on its own. The appendix shows the same idea as an MCP server.',
 transition:'Part 5 in one slide.',
 source:`Next in the notebook: <a href="${nb('nb-5-2').href}" target="_blank" rel="noopener">5.2 Write your own tool</a>.`});

recap(5,[`If the steps are fixed, write a ${kT('workflow')}.`,`More freedom when the ${kG('evals')} pass.`,`${kY('Checking')} costs more than the ${kA('model')}.`],
 'the talk in one slide, and three things to try on Monday.',
 {card:{goal:'Make the failing tests pass',model:'The smallest that passes our evals',tools:`${chip('eye','read')} ${chip('pen','write, edit')} ${chip('terminal','bash')}`,guard:'Safe commands run; the rest wait',human:'Reviews every change'},
  hi:['model','guard','human'],title:'Our agent, in a team',
  ask:'Which three lines of this card did Part 5 fill in?',
  expected:'The model (the smallest that passes the evals), the guardrails (which requests wait for a person) and the person (who reviews before anything is merged).',
  point:'Every decision of this part lands on the agent card: the model, the guardrails and the person.',transition:'To close: the talk in one slide.'});
