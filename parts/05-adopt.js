// Part 5: agents in your organisation. Should this task be an agent (a decision flowchart that ends in the four zones
// of the stakes map), a ramp from shadow mode to autonomy, the cost of one task (a live figure), and what changes for
// a team. Numbers: data/p5.json (scripts/sci/p5.py), data/traces.json (the opening run), data/apps.json (the zones).
import {S_,p,ps,small,cols,at,only,takeaway,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,
 fig,label,line,arrow,gat,COL,MUTED,icon,iconHTML,chip,widget,register,slider,num,big,nb,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'agent','model','date_text','evals'),APPS=need(await data('apps'),'apps','zones'),
 D=need(await data('p5'),'cost','tokens_vs_chat','economic_index','gartner');
const CO=D.cost;

css(`.p5-skills{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.p5-skills>div{border:2px solid var(--line);border-radius:16px;background:#fff;padding:14px 18px;display:flex;gap:14px;align-items:flex-start;min-width:0}
.p5-skills>div>svg{flex:none;margin-top:2px}
.p5-skills b{display:block;font-size:23px;line-height:1.2;margin-bottom:6px}.p5-skills p{font-size:20px;line-height:1.36;color:#374151}
.p5-ev{margin-top:22px}
.p5-cost .w-controls{gap:10px 18px}.p5-cost .w-controls label{min-width:260px}.p5-br{flex-basis:100%;height:0}
@media(max-width:760px){.reading .p5-skills{grid-template-columns:minmax(0,1fr)}}`);

partBreak(5,'Agents in your organisation','You have seen what agents do and how they fail. This part turns that into decisions: which tasks to hand over, how fast to raise autonomy, and what it costs.',
 ['Should this task be an agent at all?','A ramp from suggestions to autonomy','What one task costs','What changes for a team'],
 {img:'part-adopt.jpg',alt:'Illustration: colleagues at a table looking at a flowchart on a screen, with a small staircase beside them',nb:nb('part-5'),
  line:'By the end of this part you can decide, for one task in your team, whether to hand it to an agent and how.',
  ask:'Which task in your team would you hand to an agent first?',
  expected:'Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we will run them through the next slide.',
  transition:'Start with the first decision: does it need an agent at all?',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 5.1 should this be an agent?
chap('5.1','What to hand over');
{
 const W=1152,H=440,DK='#4B5563';
 const zone=(easy,costly)=>APPS.zones.find(z=>z.easy===easy&&z.costly===costly);
 const ZC=(easy,costly)=>easy?(costly?COL.amber:COL.green):(costly?COL.loss:COL.guess);
 const wrap=(s,n)=>{const out=[''];for(const w of s.split(' ')){const k=out.length-1;if(out[k]&&(out[k]+' '+w).length>n)out.push(w);else out[k]+=(out[k]?' ':'')+w;}return out;};
 const box=(x,y,w,h,lines,{stroke=DK,fill='#fff',fs=21,weight=600,color=COL.ink,sub=[],sw=2.5}={})=>{
  const lh=fs*1.2,sh=17*1.2,tot=lines.length*lh+sub.length*sh,y0=y+(h-tot)/2+fs*.8;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`+
   lines.map((t,i)=>label(x+w/2,y0+i*lh,esc(t),{size:fs,fill:color,anchor:'middle',weight})).join('')+
   sub.map((t,i)=>label(x+w/2,y0+lines.length*lh+i*sh+2,esc(t),{size:17,anchor:'middle'})).join('');};
 const yes=(x,y,t,anchor='middle')=>label(x,y,t,{size:19,fill:DK,anchor,weight:700,halo:true});
 /** An arrow with its yes or no beside it: above a level arrow, else on the side away from the boxes (left). */
 const branch=(x1,y1,x2,y2,t)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);let px=dy/L,py=-dx/L;
  if(Math.abs(dy)<4?py>0:px>0){px=-px;py=-py;}
  return arrow(x1,y1,x2,y2,{stroke:DK,w:2.5,head:11})+yes((x1+x2)/2+px*20,(y1+y2)/2+py*20+6,t);};
 const Q=[0,150,226,130],Qw=[300,150,226,130],Qa=[600,46,226,124],Qb=[600,270,226,124];
 const L=900,Lw=252,Lh=104;
 const leaf=(y,easy,costly)=>{const z=zone(easy,costly),c=ZC(easy,costly);
  return box(L,y,Lw,Lh,z.name.split(', ').map((t,i,a)=>i<a.length-1?t+',':t),{stroke:c,fill:'#fff',fs:20,weight:700,color:c,sub:wrap(z.advice,26),sw:3});};
 const mid=b=>[b[0]+b[2],b[1]+b[3]/2];
 // build 1: the three questions and the first answer (a workflow)
 let g=box(...Q,['Does the path','change from','case to case?'])+box(...Qw,['Can a person','check the result','cheaply?'])+
  box(...Qa,['Is a mistake','costly, or hard','to undo?'])+box(...Qb,['Is a mistake','costly, or hard','to undo?']);
 g+=branch(Q[0]+Q[2],Q[1]+Q[3]/2,Qw[0]-4,Qw[1]+Qw[3]/2,'yes');
 g+=branch(Qw[0]+Qw[2],Qw[1]+Qw[3]/2-14,Qa[0]-4,Qa[1]+Qa[3]/2,'yes');
 g+=branch(Qw[0]+Qw[2],Qw[1]+Qw[3]/2+14,Qb[0]-4,Qb[1]+Qb[3]/2,'no');
 const WF=[0,322,226,96];
 g+=arrow(Q[0]+Q[2]/2,Q[1]+Q[3],WF[0]+WF[2]/2,WF[1]-4,{stroke:DK,w:2.5,head:11})+yes(Q[0]+Q[2]/2+12,Q[1]+Q[3]+30,'no','start')+
  box(...WF,['A workflow'],{stroke:COL.target,fs:21,weight:700,color:COL.target,sub:['fixed steps, cheaper'],sw:3});
 // build 2: hard to check
 const lo=[224,336],hi=[0,112];
 const twig=(from,y,t)=>{const [x0,y0]=mid(from);return branch(x0,y0+(y+Lh/2<y0?-12:12),L-4,y+Lh/2,t);};
 g+=gat(2,twig(Qb,lo[0],'yes')+twig(Qb,lo[1],'no')+leaf(lo[0],false,true)+leaf(lo[1],false,false));
 // build 3: cheap to check
 g+=gat(3,twig(Qa,hi[0],'yes')+twig(Qa,hi[1],'no')+leaf(hi[0],true,true)+leaf(hi[1],true,false));
 const byZone=z=>APPS.apps.filter(a=>a.zone===z.name).map(a=>a.name).join(', ');
 S_('should-agent','adopt','Should this task be an agent?',{builds:3,
  body:fig(W,H,g,'A decision flowchart: does the path change case to case, can the result be checked cheaply, and is a mistake costly; it ends in a workflow or one of four zones'),
  lines:['First question: does the path change from case to case? If you can draw the steps in advance, build a workflow. It is cheaper and more predictable.',
   'If it needs an agent, can a person check the result cheaply? If not, the agent drafts and a person decides, or leads when mistakes are costly.',
   'If checking is cheap, ask what a mistake costs. Costly or irreversible: a person approves that step. Otherwise let it run, with spot checks and logs.'],
  ask:['Take your task from the last slide. Does its path change from case to case?','Can someone check its result in a minute or two?','Where does your task land?'],
  expected:['Many “agent” ideas are really workflows: the same steps every time. That is good news: they are cheaper to build and run.',
   'Code with tests, a number with a source: yes. A strategy memo or a diagnosis: no, so the agent drafts.',
   `Most land in one of the four zones of the stakes map. Let it run: ${byZone(zone(true,false))}. Approve: ${byZone(zone(true,true))}.`],
  point:'Two questions decide autonomy: how cheaply can the result be checked, and what does a mistake cost. They are the axes of the stakes map.',
  misconception:'That a more capable model moves a task to a safer zone. It can make some checks cheaper (a second model can review the first), but what a mistake costs stays the same, so the approval before an irreversible step stays.',
  transition:'Even in the right zone, you do not start at full speed.',
  source:'The four leaves are the zones of the stakes map in Part 3, in the same words. Workflow or agent: Anthropic, “Building effective agents” (Dec 2024).'});
}

// ---------------------------------------------------------------------------------------- 5.1 a ramp to autonomy
{
 const W=1152,H=416,base=412,sw=370,x0=8;
 const STEPS=[['eye',COL.amber,'Shadow mode','It suggests; a person does the work.','Refunds: it drafts a decision, staff decide.'],
  ['approve',COL.guess,'Approve each','It acts; a person approves each case.','It prepares the refund; staff approve it.'],
  ['zap',COL.green,'Routine on its own','Spot checks and logs; a person on call.','Small refunds go through, sampled by staff.']];
 const tops=[280,190,100],TINTS=['#AA4E080D','#8B2CDE0D','#1477370D'];
 let g='';
 STEPS.forEach(([ic,c,t,a,b],i)=>{const x=x0+i*sw,y=tops[i];
  g+=`<rect x="${x}" y="${y}" width="${sw}" height="${base-y}" fill="${TINTS[i]}" stroke="none"/>`+line(x,y,x+sw,y,{stroke:c,w:5})+line(x,y,x,base,{stroke:'#D5DAE0',w:2});
  g+=icon(ic,x+34,y+38,30,c)+label(x+60,y+47,t,{size:24,fill:c,weight:700})+label(x+20,y+84,a,{size:19,fill:COL.ink})+label(x+20,y+112,b,{size:17,fill:MUTED});});
 g+=line(x0,base,x0+3*sw,base,{stroke:'#D5DAE0',w:2});
 // build 2: how to move between steps
 const curve=(x1,y1,cx,cy,x2,y2,c,dash='')=>{const a=Math.atan2(y2-cy,x2-cx),h=12;
  return `<path d="M${x1},${y1} Q${cx},${cy} ${x2},${y2}" fill="none" stroke="${c}" stroke-width="3"${dash?` stroke-dasharray="${dash}"`:''}/>`+
   `<path d="M${x2},${y2} L${(x2-h*Math.cos(a-.42)).toFixed(1)},${(y2-h*Math.sin(a-.42)).toFixed(1)} L${(x2-h*Math.cos(a+.42)).toFixed(1)},${(y2-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${c}"/>`;};
 const up=(i)=>{const xr=x0+(i+1)*sw,y1=tops[i],y2=tops[i+1];
  return curve(xr-70,y1-8,xr-40,y2-40,xr+30,y2-10,COL.green)+label(xr+46,y2-16,'evals pass',{size:19,fill:COL.green,weight:700,halo:true});};
 g+=gat(2,up(0)+up(1)+curve(x0+2.58*sw,tops[2]-8,x0+1.94*sw,tops[2]-146,x0+1.5*sw,tops[1]-6,COL.loss,'7 6')+
  label(x0+2*sw,24,'errors rise: step back',{size:19,fill:COL.loss,anchor:'middle',weight:700,halo:true}));
 S_('ramp','adopt','Start small, and climb',{builds:2,
  body:fig(W,H,g,'A staircase of three steps: shadow mode, approve each case, routine cases on their own; climb when the evals pass, step back when errors rise'),
  lines:['Do not start at full autonomy. Start in shadow mode, where it only suggests, then let it act with approval, then let routine cases run.',
   'Climb a step only when the evals on your own past cases say so, and step back down when errors rise.'],
  ask:['Why start in shadow mode, if the agent could already act?','What would convince you to climb a step?'],
  expected:['Because you learn its error rate on your real cases at no risk: every suggestion can be compared with what the person actually did.',
   'A measured error rate on enough real cases, below what the team accepts from a person, and a plan for the errors that remain.'],
  point:'Raise autonomy one step at a time, when evals on your own cases support it, and lower it again when errors rise.',
  misconception:'That autonomy is a one-time decision at launch. It is a setting you revisit as the evals, the model and the stakes change.',
  transition:'At each step, someone pays for the model and for the checking. Which costs more?',
  source:'The steps correspond to Part 1’s dial: operator, approver, observer. The refund is Part 1’s example.'});
}

// ---------------------------------------------------------------------------------------- 5.2 the cost of one task
chap('5.2','Cost and people');
const SC=CO.slider;
const tokensAt=n=>[n*CO.first_input+CO.growth*n*(n-1)/2,n*CO.out_per_step];
const modelINR=(n,m)=>{const [i,o]=tokensAt(n);return (i*m.price.input+o*m.price.output)/1e6*CO.inr_per_usd;};
const rupees=v=>v<10?num(v,2):big(Math.round(v));
const share=f=>f>=.995?'all':f<.01?`${num(f*100,1)}%`:`${Math.round(f*100)}%`;
const KW=1152,KH=262;
function costSVG({steps,model,minutes,hour}){
 const m=CO.models.find(x=>x.id===model),mc=modelINR(steps,m),pc=minutes/60*hour,scale=Math.max(mc,pc,1e-9),bx=560,bw=470;
 const [ti,to]=tokensAt(steps);
 const row=(y,ic,c,t,sub,v)=>{const w=Math.max(v/scale*bw,v>0?2:0);
  return `<circle cx="24" cy="${y+20}" r="22" fill="#fff" stroke="${c}" stroke-width="2.5"/>`+icon(ic,24,y+20,24,c)+
   label(58,y+18,t,{size:23,fill:c,weight:700})+sub.map((s,i)=>label(58,y+46+i*24,s,{size:18})).join('')+
   `<rect x="${bx}" y="${y+4}" width="${w.toFixed(1)}" height="40" rx="5" fill="${c}"/>`+label(bx+w+12,y+33,`₹${rupees(v)}`,{size:26,fill:COL.ink,weight:700});};
 let g=row(10,'spark',COL.guess,'The model',[esc(m.name),`${steps} step${steps>1?'s':''} · ${big(Math.round(ti))} tokens read, ${big(Math.round(to))} written`],mc);
 g+=row(122,'person',COL.amber,'A person checking',[`${minutes} minute${minutes===1?'':'s'} at ₹${big(hour)} an hour`],pc);
 g+=line(0,214,KW,214,{stroke:'#E5E7EB',w:1.5});
 g+=label(0,250,`<tspan font-weight="700">Per task: ₹${rupees(mc+pc)}.</tspan>  <tspan fill="${COL.guess}">The model is ${share(mc/(mc+pc))} of it.</tspan>`,{size:24,fill:COL.ink});
 return g;
}
const COST_ALT='The cost of one task in rupees: the model’s tokens times the price, against a person’s minutes spent checking';
const BUILD_COST={1:{minutes:0},2:{minutes:CO.review_min},3:{minutes:CO.review_min}};
const COST_DEF={steps:CO.steps,model:CO.models[0].id,hour:CO.inr_per_hour};
register('p5-cost',(el,ctx)=>{
 if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD_COST).map(([b,s])=>`<div data-only="${b}">${fig(KW,KH,costSVG({...COST_DEF,...s}),COST_ALT)}</div>`).join('')}</div>`;return;}
 el.classList.add('p5-cost');
 el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('steps','Steps',SC.steps_min,SC.steps_max,1,CO.steps)}
  ${CO.models.map(m=>`<button type="button" data-m="${m.id}" aria-pressed="${m.id===COST_DEF.model}">${esc(m.label)}</button>`).join('')}
  <span class="p5-br"></span>${slider('min','A person checks',SC.review_min,SC.review_max,1,0)}${slider('hour','Cost of an hour',SC.hour_min,SC.hour_max,SC.hour_step,CO.inr_per_hour)}</div>`;
 const f=el.querySelector('.w-fig'),q=k=>el.querySelector(`[data-k="${k}"]`),o=k=>el.querySelector(`[data-o="${k}"]`),btns=[...el.querySelectorAll('[data-m]')];
 const sl={steps:q('steps'),min:q('min'),hour:q('hour')};
 let model=COST_DEF.model,last=null;
 const show=()=>{const s={steps:+sl.steps.value,model,minutes:+sl.min.value,hour:+sl.hour.value};
  f.innerHTML=fig(KW,KH,costSVG(s),COST_ALT);o('steps').textContent=String(s.steps);o('min').textContent=`${s.minutes} min`;o('hour').textContent=`₹${big(s.hour)}`;
  btns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.m===model)));};
 for(const s of Object.values(sl)){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
 btns.forEach(b=>b.addEventListener('click',()=>{model=b.dataset.m;b.blur();show();}));
 const scene=el.closest('.scene');
 const sync=()=>{const b=scene?.dataset.build;if(!BUILD_COST[b]||b===last)return;last=b;
  sl.steps.value=COST_DEF.steps;sl.hour.value=COST_DEF.hour;sl.min.value=BUILD_COST[b].minutes;model=COST_DEF.model;show();};
 if(scene)new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-build']});
 show();sync();
});
{
 const TV=D.tokens_vs_chat,f2027=CO.models.find(m=>m.id==='flash27');
 S_('cost','adopt','What does one task cost?',{builds:3,
  body:`${widget('p5-cost',COST_ALT)}${at(3,takeaway('Checking costs the most, so design results that are quick to check.'))}`,
  lines:[`Our opening run read ${big(CO.input)} tokens and wrote ${big(CO.output)}. At ${esc(T.model)} prices that is ₹${num(CO.model_inr,2)}. The price doubles on ${CO.price_change}.`,
   `Now add a person who spends ${word(CO.review_min)} minutes checking the answer, at ₹${big(CO.inr_per_hour)} an hour. The model is now ${share(CO.model_share)} of the cost.`,
   `Agents use about ${word(TV.agent)} times the tokens of a chat, multi-agent systems about ${word(TV.multi_agent)} times. Drag the steps: the person usually still costs more.`],
  ask:['Guess: what did the opening run cost?','What does five minutes of a colleague’s time cost your organisation?','So where should you spend effort to make an agent cheaper?'],
  expected:['Most guess tens or hundreds of rupees. It is under one rupee.',`At ₹${big(CO.inr_per_hour)} an hour, five minutes is about ₹${Math.round(CO.person_inr)}; with overheads it is more, and the slider goes up to ₹${big(SC.hour_max)} an hour.`,
   'On making the check cheap: tests, totals that reconcile, a citation to click, a clear diff. Squeezing the model price matters far less.'],
  point:'For a run like ours the model costs under a rupee and a person’s check costs far more, so making results quick to check saves the most.',
  misconception:`That model cost is negligible at any scale. Each step rereads everything before it, so long runs grow faster than their steps, and from ${CO.price_change} ${esc(T.model)} costs $${num(f2027.price.input,2)} and $${num(f2027.price.output,2)} per million tokens in and out. Caching and a cheaper model (Part 4’s eval) cut it.`,
  demo:`Drag the steps to the maximum, switch to the January price, then set checking to one minute: the gap narrows. The figure gives every model the same tokens; in Part 4’s eval Flash-Lite used fewer and cost ₹${num(T.evals.models['Gemini 3.5 Flash-Lite'].cost_inr_mean,2)} a run.`,
  transition:'If checking is the cost, the people around the agent matter more. What changes for them?',
  source:`Tokens: the opening run (${T.date_text}); each step rereads all before it, fitted to that run. Prices: Google’s Gemini pricing page, ${T.date_text}. Minutes and hourly cost: illustrative. Anthropic (${TV.when}) for ${TV.agent}× and ${TV.multi_agent}×.`});
}

// ---------------------------------------------------------------------------------------- 5.2 what changes for a team
{
 const E=D.economic_index,G=D.gartner;
 const W=1152,H=180,bx=360,bw=200;
 const bar=(x,y,v,c,t,val)=>`<rect x="${x+bx}" y="${y-16}" width="${bw}" height="30" rx="5" fill="#EEF0F2"/>`+
  `<rect x="${x+bx}" y="${y-16}" width="${(v/100*bw).toFixed(1)}" height="30" rx="5" fill="${c}"/>`+label(x,y+6,t,{size:18,fill:COL.ink})+label(x+bx+bw+10,y+7,val,{size:20,fill:COL.ink,weight:700});
 const ev=label(0,22,`Anthropic reports (Economic Index, ${E.when})`,{size:18,fill:MUTED,weight:650})+
  bar(0,62,E.directive_from,'#C4A5EA','Whole tasks handed over, earlier data',`${E.directive_from}%`)+
  bar(0,108,E.directive_to,COL.guess,`Whole tasks handed over, ${E.when}`,`${E.directive_to}%`)+
  bar(0,154,E.api_automation,COL.guess,'Business API conversations: automation',`${E.api_automation}%`)+
  label(700,22,`Gartner predicts (${G.when})`,{size:18,fill:MUTED,weight:650})+label(700,68,`Agentic AI projects cancelled by end of ${G.by}`,{size:18,fill:COL.ink})+
  `<rect x="700" y="86" width="340" height="30" rx="5" fill="#EEF0F2"/><rect x="700" y="86" width="${(G.cancelled_pct/100*340).toFixed(1)}" height="30" rx="5" fill="${COL.loss}"/>`+
  label(1050,108,`over ${G.cancelled_pct}%`,{size:20,fill:COL.ink,weight:700})+
  label(700,150,'Its reasons: rising costs, unclear business',{size:18,fill:COL.ink})+label(700,172,'value, weak risk controls.',{size:18,fill:COL.ink});
 const SK=[['pen',COL.guess,'Write goals and tools','A tool’s description is the only manual the model gets.'],
  ['eye',COL.target,'Read traces','When a run goes wrong, the trace shows which step, and why.'],
  ['flask',COL.green,'Build evals','Real cases with known answers decide when to trust it.']];
 S_('skills','adopt','What changes for a team',{builds:2,
  body:`<div class="p5-skills">${SK.map(([ic,c,t,d])=>`<div>${iconHTML(ic,c,34)}<div><b>${t}</b><p>${d}</p></div></div>`).join('')}</div>
   ${at(2,`<div class="p5-ev">${fig(W,H,ev,'Evidence: more whole tasks handed to AI, most business API use is automation, and many agent projects expected to be cancelled')}</div>`)}`,
  lines:['The work around the agent becomes part of the job. Someone writes the goal and the tool descriptions, reads the traces, and builds the evals.',
   `The shift has started: people hand over more whole tasks. Gartner also predicts that over ${G.cancelled_pct}% of agentic AI projects will be cancelled by the end of ${G.by}.`],
  ask:['Who in your team already does something like this for other software?','What would keep your project out of the cancelled group?'],
  expected:['Testers, analysts who write specifications, whoever reviews pull requests or audits processes. These skills transfer.',
   'A task that is cheap to check, evals from day one, a measured cost per task, and guardrails a risk team has signed off.'],
  point:'Adopting agents mostly changes the work around the model: people specify the task and check the results.',
  misconception:'That agents remove the need for expertise. They move it from doing each case to defining and checking how cases are done.',
  transition:'Part 5 in one slide.',
  source:`Anthropic Economic Index (${E.when}): “directive” conversations, where people hand over the whole task. Gartner press release (${G.when}): a prediction.`});
}

recap(5,['A workflow when the path is fixed; autonomy where checking is cheap.',
  'Climb from shadow mode as the evals allow.',
  'A person’s checking time usually costs more than the model.'],
 'the talk in one slide, and three things to try on Monday.',
 {card:{goal:'Refunds for damaged orders',model:'Cheapest that passes the evals',tools:`${chip('database','look up order')} ${chip('file','policy')} ${chip('rupee','refund')}`,
   memory:'Case history',stop:'A refund, a hand-off, or a limit',guard:'Refunds under a set amount',human:'Approves larger refunds'},
  hi:['model','guard','human'],title:'A card for a first agent: refunds',
  ask:'Where on the ramp would you start this refund agent, and what eval would move it up a step?',
  expected:'Shadow mode on last month’s refunds; climb when it matches staff decisions on nearly all of them, with no large refund wrong.',
  point:'Every decision of this part lands on the agent card.',transition:'To close: the whole talk in one slide.'});
