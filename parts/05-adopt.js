// Part 5: agents in your organisation. Slow: three questions decide whether a task should be an agent and how much
// freedom it gets (one decision flowchart, shown three times with "we are here" on the question we are at), raising
// autonomy in steps, the cost of one task (our opening run, then a live figure with a person's checking time), the
// work a team takes on, and one notebook run to try this week (5.1). No chapters: the notebook's 5.1 comes last, and a
// kicker "5.1" on the first slides would clash with it.
// Numbers: data/p5.json (scripts/sci/p5.py), data/traces.json (the opening run), data/apps.json (the four zones).
import {S_,at,data,need,css,esc,word,fig,label,line,arrow,gat,COL,MUTED,icon,iconHTML,chip,widget,register,slider,num,big,nb,nbRun,
 partBreak,recap} from '../kit.js';

const T=need(await data('traces'),'agent','model','date_text','evals'),APPS=need(await data('apps'),'apps','zones'),
 D=need(await data('p5'),'cost','tokens_vs_chat','gartner');
const CO=need(D.cost,'steps','input','output','model_inr','models','price_change','review_min','inr_per_hour','model_share','slider'),A=T.agent;

css(`.p5-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
.p5-stats>div{border:2px solid var(--line);border-radius:18px;background:#fff;padding:20px 26px;display:flex;flex-direction:column;gap:6px;min-width:0}
.p5-stats b{font-size:54px;line-height:1.1;color:var(--q);font-variant-numeric:tabular-nums}.p5-stats span{font-size:26px;color:#374151}
.p5-price{display:flex;align-items:baseline;gap:24px;margin-top:34px;padding-left:6px}
.p5-price b{font-size:92px;line-height:1;color:var(--q);font-variant-numeric:tabular-nums}.p5-price span{font-size:30px;line-height:1.35;color:#374151}
.p5-cost .w-controls{gap:10px 34px;font-size:21px;margin-top:22px}.p5-cost .w-controls label{min-width:330px}
.p5-jobs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
.p5-jobs>div{border:2px solid var(--line);border-top-width:6px;border-radius:16px;background:#fff;padding:22px 24px;display:flex;flex-direction:column;gap:12px;min-width:0}
.p5-jobs b{font-size:30px;line-height:1.2}.p5-jobs p{font-size:25px;line-height:1.35;color:#374151}
.p5-quote{margin:0;font-size:38px;line-height:1.3;font-weight:650;border-left:6px solid var(--loss);padding:6px 0 6px 28px}
.p5-quote cite{display:block;font-size:22px;font-style:normal;font-weight:500;color:var(--muted);margin-top:10px}
.p5-why{display:grid;grid-template-columns:max-content 44px 1fr;gap:16px 14px;align-items:center;font-size:28px;line-height:1.3;margin-top:34px;padding-left:34px}
.p5-why .r{color:var(--loss);font-weight:650}.p5-why .g{color:var(--d)}
@media(max-width:760px){.reading .p5-why{grid-template-columns:max-content 24px minmax(0,1fr);font-size:18px;gap:10px 8px;padding-left:0}.reading .p5-why .g{min-width:0;overflow-wrap:anywhere}.reading .p5-stats,.reading .p5-jobs{grid-template-columns:minmax(0,1fr)}.reading .p5-stats b{font-size:34px}.reading .p5-price b{font-size:52px}.reading .p5-price span,.reading .p5-jobs b{font-size:21px}.reading .p5-quote{font-size:24px}.reading .p5-why{font-size:19px;padding-left:0}}`);

partBreak(5,'Agents in your organisation','Three questions decide whether a task should be an agent. Then we look at what it costs.',
 ['Should this task be an agent?','Raise autonomy in steps','What one task costs','What changes for a team'],
 {img:'part-adopt.jpg',alt:'Illustration: colleagues at a table looking at a flowchart on a screen, with a small staircase beside them',nb:nb('nb-5-1'),
  line:'Key question: should a given task in your team go to an agent, and with how much freedom?',
  ask:'Which task in your team would you hand to an agent first? It can be the one you named in Part 3.',
  expected:'Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we will run them through the next three slides.',
  transition:'Take one of those tasks. Three questions decide what to do with it.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- should this be an agent?
// One decision flowchart, drawn three times. here: the question we are at ('q1', 'q2' or 'q3'); it is tinted and
// tagged "We are here", and the other questions fade. wf: the workflow leaf (true, or the click it appears on).
// leaves: {top, bottom}: the zones under the cheap-to-check and the hard-to-check branch (the click each appears on).
const DK='#4B5563',W5=1152,H5=440,QW=210,QH=130,LX=912,LW=240,LH=96;
const zone=(easy,costly)=>APPS.zones.find(z=>z.easy===easy&&z.costly===costly);
const ZC=(easy,costly)=>easy?(costly?COL.amber:COL.green):(costly?COL.loss:COL.guess);
const Q={q1:{x:0,y:151,t:['Do the steps','change from','case to case?']},q2:{x:290,y:151,t:['Can a person','check the result','cheaply?']},
 qa:{x:600,y:39,t:['Is a mistake','costly, or','impossible','to undo?']},qb:{x:600,y:263,t:['Is a mistake','costly, or','impossible','to undo?']}};
const LEAF=[[0,true,true],[112,true,false],[224,false,true],[336,false,false]];   // [y, easy to check, costly]
const WF={x:0,y:336,w:QW,h:LH};
const tag=(cx,cy,t,c)=>{const w=t.length*11.5+36;return `<rect x="${(cx-w/2).toFixed(1)}" y="${cy-17}" width="${w.toFixed(1)}" height="34" rx="17" fill="${c}"/>`+label(cx,cy+7,esc(t),{size:19,fill:'#fff',anchor:'middle',weight:700});};
/** A yes or no centred on (x, y), with a halo so it can sit on its arrow. */
const yesno=(x,y,t)=>label(x,y+7,t,{size:20,fill:DK,anchor:'middle',weight:700,halo:true});
function decide({here,wf=false,leaves={}}){
 const on=k=>k===here||(here==='q3'&&(k==='qa'||k==='qb'));
 const dim=(yes,s,op='.32')=>yes?s:`<g opacity="${op}">${s}</g>`;
 const qbox=k=>{const b=Q[k],hot=on(k),fs=21,lh=fs*1.22,y0=b.y+(QH-(b.t.length-1)*lh)/2+fs*.35;
  return dim(hot,`<rect x="${b.x}" y="${b.y}" width="${QW}" height="${QH}" rx="14" fill="${hot?'#8B2CDE14':'#fff'}" stroke="${hot?COL.guess:DK}" stroke-width="${hot?5:2.5}"/>`+
   b.t.map((t,i)=>label(b.x+QW/2,y0+i*lh,esc(t),{size:fs,fill:COL.ink,anchor:'middle',weight:hot?700:600})).join(''));};
 const leafBox=(x,y,w,h,lines,c)=>{const fs=21,lh=fs*1.2,y0=y+(h-(lines.length-1)*lh)/2+fs*.35;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#fff" stroke="${c}" stroke-width="3"/>`+lines.map((t,i)=>label(x+w/2,y0+i*lh,esc(t),{size:fs,fill:c,anchor:'middle',weight:700})).join('');};
 const A=(x1,y1,x2,y2)=>arrow(x1,y1,x2,y2,{stroke:DK,w:2.6,head:12});
 const branch=(x1,y1,x2,y2,t)=>A(x1,y1,x2,y2)+yesno((x1+x2)/2,(y1+y2)/2,t);
 const cy=k=>Q[k].y+QH/2;
 const out=(k,s)=>dim(on(k),s,'.45');      // the arrows out of the question we are at stay dark
 let g='';
 // Q1: yes goes on to Q2, no to a workflow
 g+=out('q1',A(QW+4,cy('q1'),Q.q2.x-6,cy('q2'))+label((QW+Q.q2.x)/2,cy('q1')-14,'yes',{size:20,fill:DK,anchor:'middle',weight:700}));
 if(wf){const s=out('q1',A(QW/2,Q.q1.y+QH+4,QW/2,WF.y-6)+label(QW/2+14,Q.q1.y+QH+36,'no',{size:20,fill:DK,weight:700}))+
   dim(here==='q1',leafBox(WF.x,WF.y,WF.w,WF.h,['A workflow'],COL.target));
  g+=wf===true?s:gat(wf,s);}
 // Q2: cheap to check goes up, hard to check goes down
 g+=out('q2',branch(Q.q2.x+QW+4,cy('q2')-16,Q.qa.x-6,cy('qa'),'yes')+branch(Q.q2.x+QW+4,cy('q2')+16,Q.qb.x-6,cy('qb'),'no'));
 // Q3 and the four zones of the stakes map
 for(const [k,side] of [['qa','top'],['qb','bottom']]){if(!leaves[side])continue;
  const s=LEAF.filter(([,easy])=>easy===(side==='top')).map(([y,easy,costly])=>{const c=ZC(easy,costly),ty=y+LH/2,sy=cy(k)+(ty<cy(k)?-14:14);
   return branch(Q[k].x+QW+4,sy,LX-6,ty,costly?'yes':'no')+leafBox(LX,y,LW,LH,zone(easy,costly).name.split(', ').map((t,i,a)=>i<a.length-1?t+',':t),c);}).join('');
  g+=leaves[side]===true?s:gat(leaves[side],s);}
 g+=qbox('q1')+qbox('q2')+qbox('qa')+qbox('qb');
 g+=here==='q3'?tag(Q.qa.x+QW/2,(Q.qa.y+QH+Q.qb.y)/2,'We are here',COL.guess):tag(Q[here].x+QW/2,Q[here].y-24,'We are here',COL.guess);
 return fig(W5,H5,g,'A decision flowchart: do the steps change from case to case, can a person check the result cheaply, and is a mistake costly or impossible to undo. It ends in a workflow or in one of the four zones of the stakes map.');
}
const byZone=(easy,costly)=>APPS.apps.filter(a=>a.zone===zone(easy,costly).name).map(a=>a.name).join(', ');

S_('should-agent','adopt','Should this task be an agent?',{builds:2,
 body:decide({here:'q1',wf:2}),
 lines:['Take one task from your team. The first question: do its steps change from case to case?',
  'If you can write the steps down in advance, build a workflow, as we saw in Part 1.'],
 ask:['Take your task from the last slide. Does it follow the same steps every time?','How many of the tasks you named are really workflows?'],
 expected:['Often yes: monthly reports, standard approvals, invoice matching. Those are workflows.',
  'Usually more than half. That is good news: a workflow is cheaper to build and to run, and a model can still do each step.'],
 point:'An agent is worth it only when the steps change from case to case. Otherwise, write the steps down: a workflow.',
 misconception:'That anything with a language model in it should be an agent. Part 1’s invoice was a workflow with a model in one step.',
 transition:'Say the steps do change.',
 source:'Workflow or agent: Anthropic, “Building effective agents” (Dec 2024), as in Part 1.'});

S_('should-check','adopt','Can a person check the result cheaply?',{builds:1,
 body:decide({here:'q2',wf:true}),
 lines:['Then an agent may help. The second question: can someone check its result in a minute or two?'],
 ask:['For your task, how would someone check the result, and how long would it take?'],
 expected:['Cheap to check: code with tests, a total that reconciles, a number with a source to click. Hard to check: a strategy memo, a diagnosis, a legal opinion.'],
 point:'How cheaply a person can check the result is the first of the two axes of the stakes map in Part 3.',
 misconception:'That a result is easy to check because it is easy to read. A fluent memo can take an expert an hour to verify.',
 transition:'And the second axis: what does a mistake cost?'});

S_('should-stakes','adopt','Is a mistake costly, or impossible to undo?',{builds:2,
 body:decide({here:'q3',wf:true,leaves:{top:1,bottom:2}}),
 lines:['Checking is cheap. If a mistake is costly, the agent acts and a person approves. If not, let it run.',
  'Checking is hard. If a mistake is costly, a person leads. If not, the agent only drafts.'],
 ask:['A small refund sent to the wrong customer: costly, or not?','Where does your own task land?'],
 expected:['Cheap to put right, so let it run with spot checks. A large refund is different: a person approves it.',
  `It depends on the task. On Part 3’s map these could run on their own: ${byZone(true,false)}. These needed approval: ${byZone(true,true)}.`],
 point:'The four answers are the four zones of the stakes map in Part 3, in the same words.',
 misconception:'That a more capable model moves a task to a safer zone. It can make checking cheaper, but what a mistake costs stays the same, so the approval before an irreversible step stays.',
 transition:'Even in the right zone, start with less freedom than you plan to give.',
 source:'The four zones are those of the stakes map in Part 3.'});

// ---------------------------------------------------------------------------------------- raise autonomy in steps
{
 const W=1152,H=440,base=436,sw=376,x0=10;
 const STEPS=[['eye',COL.amber,'Shadow mode',['It suggests.','A person does the work.']],
  ['approve',COL.guess,'Act with approval',['It acts. A person','approves each case.']],
  ['zap',COL.green,'Routine cases alone',['A person checks a','sample and the log.']]];
 const tops=[300,200,100],TINTS=['#AA4E080D','#8B2CDE0D','#1477370D'];
 let g='';
 STEPS.forEach(([ic,c,t,sub],i)=>{const x=x0+i*sw,y=tops[i];
  g+=`<rect x="${x}" y="${y}" width="${sw}" height="${base-y}" fill="${TINTS[i]}" stroke="none"/>`+line(x,y,x+sw,y,{stroke:c,w:5})+line(x,y,x,base,{stroke:'#D5DAE0',w:2});
  g+=icon(ic,x+34,y+40,32,c)+label(x+62,y+50,t,{size:27,fill:c,weight:700})+sub.map((s,j)=>label(x+22,y+92+j*29,s,{size:22,fill:COL.ink})).join('');});
 g+=line(x0,base,x0+3*sw,base,{stroke:'#D5DAE0',w:2});
 const curve=(x1,y1,cx,cy,x2,y2,c,dash='')=>{const a=Math.atan2(y2-cy,x2-cx),h=12;
  return `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="3"${dash?` stroke-dasharray="${dash}"`:''}/>`+
   `<path d="M${x2},${y2} L${(x2-h*Math.cos(a-.42)).toFixed(1)},${(y2-h*Math.sin(a-.42)).toFixed(1)} L${(x2-h*Math.cos(a+.42)).toFixed(1)},${(y2-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${c}"/>`;};
 const up=i=>{const xr=x0+(i+1)*sw,y1=tops[i],y2=tops[i+1];
  return curve(xr-70,y1-8,xr-40,y2-40,xr+30,y2-10,COL.green)+label(xr+46,y2-16,'evals pass',{size:21,fill:COL.green,weight:700,halo:true});};
 g+=gat(2,up(0)+up(1)+curve(x0+2.58*sw,tops[2]-8,x0+1.94*sw,tops[2]-146,x0+1.5*sw,tops[1]-6,COL.loss,'7 6')+
  label(x0+2*sw,24,'errors rise: step back',{size:21,fill:COL.loss,anchor:'middle',weight:700,halo:true}));
 S_('ramp','adopt','Raise autonomy in steps',{builds:2,
  body:fig(W,H,g,'Three steps: shadow mode, act with approval, routine cases alone. Move up when the evals pass, and step back when errors rise.'),
  lines:['First it only suggests: shadow mode. Then it acts with approval. Then routine cases run alone.',
   'Move up only when evals on your past cases support it. Step back if errors rise.'],
  ask:['Why start in shadow mode, if the agent could already act?','What would convince you to move up a step?'],
  expected:['Because you learn its error rate on your real cases at no risk: each suggestion can be compared with what the person actually did.',
   'A measured error rate on enough of your own cases, no worse than the team accepts from a person, and a plan for the errors that remain.'],
  point:'Raise autonomy one step at a time, when evals on your own cases support it, and lower it again when errors rise.',
  misconception:'That autonomy is decided once, at launch. It is a setting you revisit as the evals, the model and the stakes change.',
  demo:'For refunds: in shadow mode it drafts a decision and staff decide; then it prepares the refund and staff approve it; then small refunds go through on their own, and staff check a sample.',
  transition:'At every step, someone pays for the model and for the checking. Which costs more?',
  source:'The three steps match Part 1’s levels of autonomy: operator, approver, observer.'});
}

// ---------------------------------------------------------------------------------------- what one task costs
S_('cost','adopt','What did our opening run cost?',{builds:2,
 body:`<div class="p5-stats"><div><b>${A.turns.length}</b><span>rounds</span></div><div><b>${big(CO.input)}</b><span>tokens read</span></div><div><b>${big(CO.output)}</b><span>tokens written</span></div></div>
  ${at(2,`<div class="p5-price"><b>₹${num(CO.model_inr,2)}</b><span>of model time, at the current<br>${esc(T.model)} price</span></div>`)}`,
 lines:[`Back to our opening run: ${word(A.turns.length)} rounds, each rereading the whole conversation. Do you remember what it cost?`,
  'Less than a rupee, as we saw in Part 2. The price is per million tokens, read and written.'],
 ask:['Do you remember what the opening run cost?','Is that the whole cost of the task?'],
 expected:['Less than a rupee. We saw it in Parts 1 and 2.','No. Someone still has to read the answer and decide whether to trust it.'],
 point:'A run like ours costs less than a rupee in model time.',
 misconception:`That agents are cheap at any scale. Agents use about ${word(D.tokens_vs_chat.agent)} times the tokens of a chat, and multi-agent systems about ${word(D.tokens_vs_chat.multi_agent)} times (Anthropic, ${D.tokens_vs_chat.when}).`,
 transition:'Now add the person who checks the answer.',
 source:`Our run on ${T.date_text} (${esc(T.model)}), at Google’s published price in rupees.`});

{
 const SC=CO.slider,KW=1152,KH=250,m0=CO.models[0];
 const tokensAt=n=>[n*CO.first_input+CO.growth*n*(n-1)/2,n*CO.out_per_step];
 const modelINR=(n,m)=>{const [i,o]=tokensAt(n);return (i*m.price.input+o*m.price.output)/1e6*CO.inr_per_usd;};
 const rupees=v=>v<10?num(v,2):big(Math.round(v));
 const share=f=>f>=.995?'all':f<.01?`${num(f*100,1)}%`:`${Math.round(f*100)}%`;
 const costSVG=({steps,minutes})=>{
  const mc=modelINR(steps,m0),pc=minutes/60*CO.inr_per_hour,scale=Math.max(mc,pc,1e-9),bx=600,bw=420;
  const row=(y,ic,c,t,sub,v)=>{const w=Math.max(v/scale*bw,v>0?2:0);
   return `<circle cx="26" cy="${y+26}" r="24" fill="#fff" stroke="${c}" stroke-width="2.5"/>`+icon(ic,26,y+26,26,c)+
    label(66,y+22,t,{size:25,fill:c,weight:700})+label(66,y+52,sub,{size:21})+
    `<rect x="${bx}" y="${y+6}" width="${w.toFixed(1)}" height="42" rx="5" fill="${c}"/>`+label(bx+w+12,y+37,`₹${rupees(v)}`,{size:27,fill:COL.ink,weight:700});};
  return row(8,'spark',COL.guess,'The model',`${esc(m0.name)} · ${steps} round${steps>1?'s':''}`,mc)+
   row(108,'person',COL.amber,'A person checking',`${minutes} minute${minutes===1?'':'s'} at ₹${big(CO.inr_per_hour)} an hour`,pc)+
   line(0,192,KW,192,{stroke:'#E5E7EB',w:1.5})+
   label(0,236,`<tspan font-weight="700">Per task: ₹${rupees(mc+pc)}.</tspan>  <tspan fill="${COL.guess}">The model is ${share(mc/(mc+pc))} of it.</tspan>`,{size:26,fill:COL.ink});};
 const ALT='The cost of one task in rupees: the model’s tokens at the published price, against a person’s minutes spent checking';
 const BUILD={1:{steps:CO.steps,minutes:CO.review_min},2:{steps:SC.steps_max,minutes:CO.review_min}};
 register('p5-cost',(el,ctx)=>{
  if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD).map(([b,s])=>`<div data-only="${b}">${fig(KW,KH,costSVG(s),ALT)}</div>`).join('')}</div>`;return;}
  el.classList.add('p5-cost');
  el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('steps','Rounds',SC.steps_min,SC.steps_max,1,CO.steps)}${slider('min','A person checks',SC.review_min,SC.review_max,1,CO.review_min)}</div>`;
  const f=el.querySelector('.w-fig'),q=k=>el.querySelector(`[data-k="${k}"]`),o=k=>el.querySelector(`[data-o="${k}"]`),sl={steps:q('steps'),min:q('min')};
  let last=null;
  const show=()=>{const s={steps:+sl.steps.value,minutes:+sl.min.value};f.innerHTML=fig(KW,KH,costSVG(s),ALT);o('steps').textContent=String(s.steps);o('min').textContent=`${s.minutes} min`;};
  for(const s of Object.values(sl)){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
  const scene=el.closest('.scene');
  const sync=()=>{const b=scene?.dataset.build;if(!BUILD[b]||b===last)return;last=b;sl.steps.value=BUILD[b].steps;sl.min.value=BUILD[b].minutes;show();};
  if(scene)new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-build']});
  show();sync();
 });
 const f27=CO.models.find(m=>m.id==='flash27'),lite=T.evals.models['Gemini 3.5 Flash-Lite'];
 S_('cost-person','adopt','Now add a person who checks it',{builds:2,
  body:widget('p5-cost',ALT),
  lines:[`A colleague spends ${word(CO.review_min)} minutes checking the answer, at ₹${big(CO.inr_per_hour)} an hour. The model is now ${share(CO.model_share)} of the cost.`,
   `Even a run of ${SC.steps_max} rounds costs less than the check. So the saving is in making results quick to check.`],
  ask:[`What does ${word(CO.review_min)} minutes of a colleague’s time cost your organisation?`,'Where should you spend effort to make an agent cheaper?'],
  expected:[`At ₹${big(CO.inr_per_hour)} an hour, ${word(CO.review_min)} minutes is about ₹${Math.round(CO.person_inr)}. With overheads it is more.`,
   'On making the check quick: tests, totals that reconcile, a source to click, a clear list of changes. A cheaper model matters far less.'],
  point:'For a run like ours the model costs under a rupee and a person’s check costs far more, so results that are quick to check save the most.',
  misconception:`That the model price will stay where it is. From ${CO.price_change}, ${esc(T.model)} costs $${num(f27.price.input,2)} and $${num(f27.price.output,2)} per million tokens in and out, twice today’s price. Even then, a ${SC.steps_max}-round run costs less than the ${word(CO.review_min)}-minute check.`,
  demo:`Drag the rounds slider: each round rereads everything before it, so cost grows faster than the rounds. Drag the checking time down to one minute and the gap narrows. In Part 4’s eval, Flash-Lite cost ₹${num(lite.cost_inr_mean,2)} a run.`,
  transition:'If checking is where the cost is, the people around the agent matter. What changes for them?',
  source:`Tokens: our opening run; each round rereads all before it, fitted to that run. Price: Google, ${T.date_text}. Minutes and hourly cost: illustrative.`});
}

// ---------------------------------------------------------------------------------------- what changes for a team
{
 const JOBS=[['pen',COL.guess,'Write the goal and the tool descriptions','The model knows only what you write.'],
  ['eye',COL.target,'Read the traces','A trace shows which step went wrong.'],
  ['check',COL.green,'Build evals','Past cases with known answers.']];
 S_('skills','adopt','What new work does a team take on?',{builds:1,
  body:`<div class="p5-jobs">${JOBS.map(([ic,c,t,d])=>`<div style="border-top-color:${c}">${iconHTML(ic,c,40)}<b>${t}</b><p>${d}</p></div>`).join('')}</div>`,
  lines:['Every agent in this talk needed people around it, doing this work.'],
  ask:['Who in your team already does work like this for other software?'],
  expected:['Testers, analysts who write specifications, whoever reviews code or audits a process. These skills carry over.'],
  point:'Adopting an agent mostly changes the work around the model: people describe the task and check the results.',
  misconception:'That agents remove the need for expertise. Experts write the instructions and the evals, and check the cases the agent gets wrong.',
  transition:'What happens to projects that skip this work?'});
}
{
 const G=D.gartner;
 const WHY=[['escalating costs','Measure the cost per task'],['unclear business value','Ask first: agent or workflow?'],['inadequate risk controls','Raise autonomy in steps']];
 const ARROW=`<svg viewBox="0 0 44 20" width="44" height="20" aria-hidden="true" fill="none" stroke="${MUTED}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10H39M31 3l8 7-8 7"/></svg>`;
 S_('cancel','adopt','What does Gartner predict for agent projects?',{builds:2,
  body:`<blockquote class="p5-quote">“Over ${G.cancelled_pct}% of agentic AI projects will be canceled by the end of ${G.by}”<cite>Gartner, a prediction</cite></blockquote>
   ${at(2,`<div class="p5-why">${WHY.map(([r,g])=>`<span class="r">${r}</span>${ARROW}<span class="g">${g}</span>`).join('')}</div>`)}`,
  lines:['Gartner, a research firm, made this prediction about companies’ agent projects. What reasons would you guess?',
   'Each of Gartner’s reasons, in its own words, matches a question from this part.'],
  ask:['Why would a company cancel an agent project?','Which of these would end a project in your organisation?'],
  expected:['Cost, no clear benefit, and risk. Collect a few before the click.',
   'Usually unclear value: an agent built where a workflow would do. The first question of this part catches it.'],
  point:'Each reason Gartner gives has an answer in this part: measure the cost, ask whether it needs an agent, and raise autonomy in steps.',
  misconception:`That a prediction is a measurement. This is Gartner’s forecast of what will happen by the end of ${G.by}.`,
  demo:'Gartner’s full sentence: the projects will be canceled “due to escalating costs, unclear business value or inadequate risk controls”.',
  transition:'To end this part, back to the notebook.',
  source:`Gartner press release, ${G.when}. A prediction.`});
}

// ---------------------------------------------------------------------------------------- 5.1 your own tool
nbRun('nb-own-tool','adopt','5.1','Write your own tool',{
 run:'@tool\ndef pm25_standards() -> dict:\n    """India’s 24-hour PM2.5 standard and the WHO guideline."""',
 look:['The docstring: all the model will know about the tool','We add it to the tools. Does the agent call it?'],
 line:'Something to try this week: a tool of your own. Ours returns the PM2.5 limits.',
 ask:'Which function from your own work would you turn into a tool first?',
 expected:'A database lookup, a price list, a policy document, an internal API: anything with a clear input and output.',
 point:'A tool is a function and a description. You can write your first one this week.',
 demo:'If time allows, run 5.1 live: the agent should fetch Delhi’s forecast and the limits, then compare them. If not, leave it for the room to try: there is no recorded run of this section.',
 transition:'Part 5 in one slide.'});

recap(5,['If the steps are fixed, build a workflow.','Raise autonomy only when evals support it.','Checking costs more than the model.'],
 'the talk in one slide, and three things to try on Monday.',
 {card:{goal:'Refunds for damaged orders',model:'Cheapest that passes the evals',tools:`${chip('database','order')} ${chip('file','policy')} ${chip('rupee','refund')}`,
   guard:'Refunds under a set amount',human:'Approves larger refunds'},
  hi:['model','guard','human'],title:'A first agent: refunds',
  ask:'Where on the steps would you start this refund agent, and what eval would move it up?',
  expected:'Shadow mode on last month’s refunds. Move up when it matches the staff’s decisions on nearly all of them, with no large refund wrong.',
  point:'Every decision of this part lands on the agent card: the model, the guardrails and the person.',transition:'To close: the talk in one slide.'});
