// Part 4: when the engine stalls. Errors compound (a live figure), three real failures, a poisoned email (real runs),
// the lethal trifecta, guardrails before, during and after a run, and evals. Real runs: data/traces.json (notebook
// Part 4); computed and published numbers: data/p4.json (scripts/sci/p4.py).
import {S_,p,ps,small,request,cols,at,only,takeaway,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,
 fig,label,line,arrow,path,dot,gat,gonly,panel,COL,MUTED,icon,iconHTML,chip,msg,jsonHTML,chart,
 widget,register,slider,num,big,nb,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'steplimit','injection','injection_trials','inbox','evals','model','date_text'),
 D=need(await data('p4'),'compound','failures','injection','attacks','trifecta','evals','max_steps');
const S=T.steplimit,I=D.injection,TR=I.trials,F=D.failures,EV=D.evals;

css(`.p4-cases{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;align-items:stretch}
.p4-case{border:2px solid var(--line);border-radius:16px;background:#fff;padding:14px 18px;display:flex;flex-direction:column;gap:10px;min-width:0}
.p4-case .hd{display:flex;gap:12px;align-items:center}.p4-case .hd b{display:block;font-size:24px;line-height:1.15}
.p4-case .hd small{display:block;font-size:17px;color:var(--muted)}
.p4-case p{font-size:21px;line-height:1.38}
.p4-case .diagram-scroll{margin-top:auto}.p4-case .diagram-scroll svg{max-height:96px}
.p4-lesson{display:flex;gap:10px;align-items:flex-start;border-top:2px solid var(--line);padding-top:10px;font-weight:600}
.p4-lesson svg{flex:none;margin-top:3px}
.p4-mail{border:2px solid var(--line);border-radius:14px;background:#fff;padding:12px 20px 14px;font-size:22px;line-height:1.4;min-width:0}
.p4-mh{display:flex;gap:10px;align-items:center;font-size:19px;color:var(--muted);overflow-wrap:anywhere}
.p4-mh b{color:var(--ink);font-weight:650;margin-right:6px}
.p4-mail>p{margin-top:10px}
.p4-hidden{color:var(--loss);background:#BE123C0B;border:2px dashed #BE123C88;border-radius:10px;padding:8px 14px}
.p4-tag{display:block;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:2px}
.p4-inj1{display:flex;flex-direction:column;gap:14px;max-width:960px;margin:0 auto}
.p4-inj2{display:grid;grid-template-columns:1fr 1.08fr;gap:30px;align-items:center}
.p4-inj2>div{min-width:0;display:flex;flex-direction:column;gap:12px}
.p4-mail.sm{font-size:20px}
.p4-slot>*{align-self:center}.p4-evflow{margin-top:18px}.p4-inj3{display:flex;flex-direction:column;gap:18px}
.p4-attacks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.p4-attacks>div{border:2px solid var(--line);border-top:5px solid var(--loss);border-radius:14px;background:#fff;padding:14px 18px;min-width:0}
.p4-attacks b{display:block;font-size:24px;line-height:1.2;margin:10px 0 2px}.p4-attacks small{display:block;font-size:17px;color:var(--muted);margin-bottom:8px}
.p4-attacks p{font-size:22px;line-height:1.38}
.p4-tri{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;font-size:24px;line-height:1.3}
.p4-tri li{display:flex;gap:12px;align-items:center}.p4-tri i{flex:none;width:22px;height:22px;border-radius:50%;border:3px solid currentColor;opacity:.9}
.p4-gate{display:flex;gap:10px;align-items:flex-start;font-size:22px;line-height:1.38}.p4-gate svg{flex:none;margin-top:2px}
.p4-right{display:flex;flex-direction:column;gap:16px;min-width:0}
@media(max-width:760px){.reading .p4-cases,.reading .p4-attacks,.reading .p4-inj2{grid-template-columns:minmax(0,1fr)}}`);

partBreak(4,'When the engine stalls','The loop that lets an agent act also lets small mistakes pile up, and lets a stranger’s text steer it. Here is how agents fail, and what contains the damage.',
 ['Why small errors add up over many steps','Real failures, our own included','Poisoned inputs and the lethal trifecta','Guardrails, and evals to measure'],
 {img:'part-risk.jpg',alt:'Illustration: an engine on a test bench with a warning light, a hand on a brake lever, and a hook dangling an envelope',nb:nb('part-4'),
  line:'By the end of this part you can name the guardrails an agent needs before you let it act on anything that matters.',
  ask:'Has software ever done something you did not mean it to? What stopped the damage?',
  expected:'Autocorrect, an email to the wrong list, a script that deleted files. Usually an undo, a backup, or a person who noticed in time.',
  transition:'Start with a little arithmetic.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 4.1 errors compound
chap('4.1','Errors compound');
const CP=D.compound,SL=CP.slider;
const pc=v=>v<.005?'<1%':`${Math.round(v*100)}%`;
const fpct=v=>`${+(v*100).toFixed(1)}%`;
const fp=v=>String(+v.toFixed(3));
const stepOK=(q,check)=>check?1-(1-q)**2:q;
const CW=1152,CH=336,CX=330;
/** The compounding figure: the whole task's chance on the left, the curve over the number of steps on the right. */
function compoundSVG({p:q,n,check,reveal}){
 const ticksX=[SL.n_min,...Array.from({length:Math.floor(SL.n_max/10)},(_,i)=>(i+1)*10)];
 const {x,y,axes}=panel({ox:CX,W:CW-CX,H:CH,L:72,R:20,T:34,B:54,xMin:SL.n_min,xMax:SL.n_max,yMin:0,yMax:1,
  ticksX,ticksY:[0,.25,.5,.75,1],fmtY:v=>`${Math.round(v*100)}%`,xLabel:'number of steps',yLabel:'whole task right',fs:19});
 let g='';
 for(const v of [.25,.5,.75,1])g+=line(x(SL.n_min),y(v),x(SL.n_max),y(v),{stroke:'#EEF0F2',w:1});
 g+=axes;
 g+=line(x(SL.n_min),y(q),x(SL.n_max),y(q),{stroke:check?'#C9CED4':MUTED,w:2,dash:'6 6'})+label(x(SL.n_max),y(q)-9,`${check?'one step, no check':'one step'}: ${fpct(q)}`,{size:18,anchor:'end',halo:true,fill:check?'#9CA3AF':MUTED});
 const ks=Array.from({length:SL.n_max-SL.n_min+1},(_,i)=>SL.n_min+i);
 const v=q**n,vc=stepOK(q,true)**n;
 g+=line(x(n),y(0),x(n),y(Math.max(q,check?vc:0)),{stroke:'#9CA3AF',w:1.5,dash:'4 4'});
 if(reveal)g+=path(ks.map(k=>[x(k),y(q**k)]),{stroke:COL.loss,w:3.5})+dot(x(n),y(v),8,{fill:COL.loss});
 else g+=label(x(n)+12,y(.5),'?',{size:40,fill:COL.loss,weight:700});
 if(check)g+=path(ks.map(k=>[x(k),y(stepOK(q,true)**k)]),{stroke:COL.green,w:3.5})+dot(x(n),y(vc),8,{fill:COL.green});
 let r=label(0,46,'The whole task',{size:23,fill:COL.ink,weight:600})+label(0,74,'comes out right',{size:23,fill:COL.ink,weight:600})+
  label(0,150,reveal?pc(v):'?',{size:76,fill:COL.loss,weight:700});
 if(reveal)r+=label(0,188,`= ${fp(q)}<tspan dy="-13" font-size="17">${n}</tspan>`,{size:26});
 if(check)r+=label(0,236,'With a check and',{size:21,fill:COL.green,weight:600})+label(0,262,'one retry per step',{size:21,fill:COL.green,weight:600})+
  label(0,318,pc(vc),{size:48,fill:COL.green,weight:700});
 return r+g;
}
const COMPOUND_ALT='The chance that a whole task comes out right, against the number of steps, for a given chance per step; with and without a check and one retry per step';
const BUILD_COMPOUND={1:{check:false,reveal:false},2:{check:false,reveal:true},3:{check:true,reveal:true}};
register('p4-compound',(el,ctx)=>{
 if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD_COMPOUND).map(([b,s])=>`<div data-only="${b}">${fig(CW,CH,compoundSVG({p:CP.p,n:CP.n,...s}),COMPOUND_ALT)}</div>`).join('')}</div>`;return;}
 el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('p','Each step right',SL.p_min,SL.p_max,SL.p_step,CP.p)}${slider('n','Steps',SL.n_min,SL.n_max,1,CP.n)}<button type="button" data-k="check" aria-pressed="false" style="visibility:hidden">Check each step, retry once</button></div>`;
 const f=el.querySelector('.w-fig'),sp=el.querySelector('[data-k="p"]'),sn=el.querySelector('[data-k="n"]'),bt=el.querySelector('[data-k="check"]');
 const op=el.querySelector('[data-o="p"]'),on=el.querySelector('[data-o="n"]');
 let st={...BUILD_COMPOUND[1]},last=null;
 const show=()=>{const q=+sp.value,n=+sn.value;st.check=bt.getAttribute('aria-pressed')==='true';
  f.innerHTML=fig(CW,CH,compoundSVG({p:q,n,check:st.check,reveal:st.reveal}),COMPOUND_ALT);op.textContent=fpct(q);on.textContent=String(n);};
 for(const s of [sp,sn]){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
 bt.addEventListener('click',()=>{bt.setAttribute('aria-pressed',String(bt.getAttribute('aria-pressed')!=='true'));bt.blur();show();});
 const scene=el.closest('.scene');
 const sync=()=>{const b=scene?.dataset.build;if(!BUILD_COMPOUND[b]||b===last)return;last=b;st={...BUILD_COMPOUND[b]};
  sp.value=CP.p;sn.value=CP.n;bt.setAttribute('aria-pressed',String(st.check));bt.style.visibility=st.check?'':'hidden';show();};
 if(scene)new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-build']});
 show();sync();
});
S_('compound','risk','Small errors add up over many steps',{builds:3,nb:nb('part-4'),
 body:`${widget('p4-compound',COMPOUND_ALT)}<p class="caption">The simple model: steps fail independently, and all must be right.<span data-at="3"> The check catches every wrong step.</span></p>`,
 lines:[`Say each step of a task is right ${pc(CP.p)} of the time, and the task takes ${word(CP.n)} steps. How often is the whole task right?`,
  `Only ${pc(CP.task)}. Every step must be right, so the chances multiply. Drag the steps up: long tasks punish even small error rates.`,
  `Now check each step and retry once when the check fails. The same ${word(CP.n)} steps now come out right ${pc(CP.task_checked)} of the time.`],
 ask:[`Guess: ${pc(CP.p)} a step, ${word(CP.n)} steps. What share of tasks come out fully right?`,
  `At ${pc(CP.p)} a step, what happens to a task of ${CP.n_long} steps?`,'What counts as a check in your work?'],
 expected:['Most guess well above half. The answer surprises people.',
  `It almost never finishes cleanly: ${pc(CP.task_long)}. Long autonomous tasks need far more reliable steps, or checks.`,
  'Running the tests, comparing a number with its source, validating a form against a rule, a second model reviewing, a person approving.'],
 point:'Reliability multiplies across steps, so long autonomous runs need checks inside the loop as well as a better model.',
 misconception:`That a model right ${pc(CP.p)} of the time gives tasks right ${pc(CP.p)} of the time. That holds only for one-step tasks. Real steps are not independent and real checks miss things, so treat the curves as a trend.`,
 demo:'Notebook 4.1 prints the same numbers. On the slide, drag the per-step slider up and watch how much the long tasks gain.',
 transition:'That is the arithmetic. Here is what it looks like when it goes wrong for real.',
 source:'Computed in scripts/sci/p4.py. With checking, a step is right unless both tries fail.'});

// ---------------------------------------------------------------------------------------- 4.1 real failures
{
 /** A small picture of each case: nodes in a row, joined by arrows. A node: [icon, colour, label, {fill, cross, box}]. */
 const mini=(nodes,alt,W=336,H=92)=>{const n=nodes.length,xl=nodes[0][2]?50:26,xr=nodes.at(-1)[2]?50:26,gap=(W-xl-xr)/(n-1),y=32,r=Math.min(22,Math.round(gap*.3));let g='';
  nodes.forEach(([ic,c,t,o={}],i)=>{const x=xl+i*gap;
   if(i)g+=arrow(x-gap+r+4,y,x-r-6,y,{stroke:'#4B5563',w:2,head:8});
   g+=o.box?`<rect x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" rx="9" fill="${c}"/>`:`<circle cx="${x.toFixed(1)}" cy="${y}" r="${r}" fill="${o.fill?c:'#fff'}" stroke="${c}" stroke-width="2.5"/>`;
   g+=icon(ic,x,y,r*1.05,o.fill||o.box?'#fff':c);
   if(o.cross)g+=line(x-r-4,y-r-4,x+r+4,y+r+4,{stroke:COL.loss,w:4})+line(x+r+4,y-r-4,x-r-4,y+r+4,{stroke:COL.loss,w:4});
   if(t)g+=label(x,y+r+26,t,{size:18,fill:c,anchor:'middle',weight:650});});
  return fig(W,H,g,alt);};
 const k=S.calls;
 const PICS=[
  mini([['spark',COL.guess,'the agent'],['database',COL.target,'live data',{cross:true}]],'The agent reached the live database and deleted it'),
  mini([['chat',COL.guess,'chatbot'],['person',COL.amber,'customer'],['scale',COL.loss,'tribunal']],'The chatbot advised the customer; a tribunal held the airline to it'),
  mini([...Array.from({length:k},()=>['refresh',COL.loss,'']),['stop','#374151','step limit',{box:true}]],`Our agent retried a failing tool ${word(k)} times; the step limit stopped it`)];
 const CASES=[
  ['database','Replit',F.replit.when,'Its coding agent deleted a company’s live database during a code freeze.','Work on a copy of the data.'],
  ['chat','Air Canada',F.air_canada.when,`Its chatbot promised a refund against policy. The airline had to pay CAD ${num(F.air_canada.cad,2)}.`,'You answer for what it says.'],
  ['terminal','Our own agent',D.run_month,`Told to keep trying, it retried a failing tool until the limit stopped it.`,'Cap the steps and the spend.']];
 S_('failures','risk','When it goes wrong for real',{builds:2,nb:nb('part-4'),
  body:`<div class="p4-cases">${CASES.map(([ic,t,w,d,l],i)=>`<div class="p4-case"><div class="hd">${iconHTML(ic,COL.loss,32)}<div><b>${t}</b><small>${esc(w)}</small></div></div>
   <p>${d}</p>${PICS[i]}${at(2,`<p class="p4-lesson">${iconHTML('shield',COL.green,22)}<span>${l}</span></p>`)}</div>`).join('')}</div>`,
  lines:['Three failures, from a coding tool, an airline and our own notebook. Look at what each one was allowed to do.',
   'Each has a plain fix, and each fix lives in the system around the model.'],
  ask:['Which of the three could happen in your organisation this year?','Which of these fixes would a better model have made unnecessary?'],
  expected:['Most say the chatbot: many already have one on their website. Coding agents with production access are becoming common too.',
   'None of them. A better model would make such mistakes less frequent; each fix limits the damage when one happens anyway.'],
  point:'Real failures come from what an agent is allowed to touch and say, and from loops nobody bounded.',
  misconception:`That these are stories about bad models. Replit (as reported): the agent had write access to production; its own chat log said it wiped records of ${big(F.replit.executives)} executives and ${big(F.replit.companies)} companies; the chief executive replied that Replit had started separating development and production databases automatically; one report says the data was later recovered with Replit’s rollback. Air Canada: the chatbot told a grieving customer he could claim a bereavement fare after travelling, and the policy said otherwise; in the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity, and lost. Strictly it was a chatbot, and the lesson is about who is liable. Ours: the instruction to keep trying met a tool that never answers.`,
  demo:`Notebook 4.3: the flaky lookup always times out; with max_steps set, the run stops after ${word(S.steps)} steps (${num(S.seconds,1)} s, ₹${num(S.cost_inr,2)}).`,
  transition:'Those agents were wrong on their own. The next failure needs an attacker, and nothing more than an email.',
  source:`Replit (${F.replit.when}): reported by ${F.replit.reported_by}. Air Canada: ${F.air_canada.case}, decided ${F.air_canada.decided}, reported by ${F.air_canada.reported_by}. Ours: notebook 4.3, ${T.date_text}.`});
}

// ---------------------------------------------------------------------------------------- 4.2 a poisoned email
chap('4.2','Poisoned inputs');
{
 const mail=sm=>`<div class="p4-mail${sm?' sm':''}">${sm?'':`<div class="p4-mh">${iconHTML('mail',MUTED,22)}<span><b>From</b>${esc(I.from)}</span></div>`}
  <div class="p4-mh">${sm?iconHTML('mail',MUTED,22):''}<span><b>Subject</b>${esc(I.subject)}</span></div>${sm?'':`<p>${esc(I.visible)}</p>`}
  <p class="p4-hidden"><span class="p4-tag">Written for the assistant</span>${esc(sm?I.hidden_short:I.hidden)}</p></div>`;
 // the ten runs: did it try to forward the invoices, and did its summary warn you about the email?
 const W=540,H=226,cxs=Array.from({length:TR.runs},(_,j)=>30+j*46+(j>=TR.models[0].runs?22:0));
 const flat=TR.models.flatMap(m=>Array.from({length:m.runs},(_,j)=>({tried:j<m.tried,warned:j<m.warned})));
 let g=label(0,22,'Tried to forward the invoices',{size:20,fill:COL.ink,weight:600})+label(W,22,`${TR.tried} of ${TR.runs}`,{size:20,fill:COL.ink,anchor:'end',weight:700})+
  label(0,118,'Warned you about the fake email',{size:20,fill:COL.ink,weight:600})+label(W,118,`${TR.warned} of ${TR.runs}`,{size:20,fill:COL.ink,anchor:'end',weight:700});
 flat.forEach((r,j)=>{const cx=cxs[j];
  g+=r.tried?`<circle cx="${cx}" cy="58" r="17" fill="${COL.loss}"/>`:`<circle cx="${cx}" cy="58" r="17" fill="#fff" stroke="#AAB3BC" stroke-width="2.5"/>`;
  g+=r.warned?`<circle cx="${cx}" cy="154" r="17" fill="${COL.green}"/>`+icon('check',cx,154,20,'#fff',{sw:3}):`<circle cx="${cx}" cy="154" r="17" fill="#fff" stroke="#AAB3BC" stroke-width="2.5"/>`;});
 let o=0;for(const m of TR.models){const a=cxs[o],b=cxs[o+m.runs-1];g+=label((a+b)/2,208,esc(m.name),{size:17,anchor:'middle'});o+=m.runs;}
 const dots=fig(W,H,g,`${Word(TR.runs)} runs of the poisoned inbox: none tried to forward the invoices; ${word(TR.warned)} of ${word(TR.runs)} summaries warned about the fake bank-details email`);
 const A=D.attacks,AIC={echoleak:'mail',github:'code',comet:'globe'};
 const path3=chart([{steps:[{t:'Untrusted text\nreaches the agent',col:COL.loss},{t:'It reads the text\nas an instruction',col:COL.guess},{t:'It gathers\nprivate data',col:COL.data},{t:'A tool sends\nthe data out',col:COL.target}]}],
  {W:1152,bh:84,fs:21,gx:46,alt:'The path of every attack: untrusted text in, read as an instruction, private data gathered, sent out by a tool'});
 const ATEXT={echoleak:a=>`${kR('A crafted email')} could make it disclose data. Microsoft rated its severity ${num(a.cvss,1)} of 10 (critical).`,
  github:()=>`${kR('A public issue')} led an agent to leak private repository data.`,
  comet:()=>`${kR('Text on a web page')} steered the browser agent.`};
 S_('injection','risk','A poisoned email',{builds:3,nb:nb('part-4'),
  body:`<div class="state-slot p4-slot">${only('1',`<div class="p4-inj1">${request(esc(I.goal))}${mail(false)}</div>`)}
   ${only('2',`<div class="p4-inj2"><div>${mail(true)}</div><div>${dots}${msg('model',`“…${esc(I.typical_quote)}”`,{note:'a typical summary'})}</div></div>`)}
   ${only('3',`<div class="p4-inj3"><div class="p4-attacks">${A.map(a=>`<div>${iconHTML(AIC[a.id],COL.loss,32)}<b>${esc(a.product)}</b><small>${esc(a.when)}${a.name?` · ${esc(a.name)}`:''}</small><p>${ATEXT[a.id](a)}</p></div>`).join('')}</div>${small(`Researchers showed each on a real product and reported it; Microsoft has patched ${esc(A.find(a=>a.patched).name)}.`)}${path3}</div>`)}</div>`,
  lines:['One email in our demo inbox ends with lines addressed to the assistant. We asked the agent to summarise the inbox.',
   `Neither model ever tried to forward the invoices. But ${word(TR.passed_on)} summaries in ${word(TR.runs)} passed on the fake bank details as routine news.`,
   'The same trick works on real products. Follow the path along the bottom.'],
  ask:['What do you expect the agent to do with this email?','Which is worse: forwarding the invoices, or a calm summary that mentions “updated bank details”?','What do the three attacks have in common?'],
  expected:['Some say forward the invoices, some say ignore it. The model reads instructions and data in one stream of text, so either can happen.',
   'The summary. You trust it, and the next step is someone paying a fraudster. The agent did not act; it laundered the fraud into a summary you trust.',
   'Each agent read text from outside, could see private data, and had a way to send it out. That is the next slide.'],
  point:'Prompt injection: an agent cannot reliably tell data from instructions, so the risk covers what it reports to you as well as what it does.',
  misconception:`That a smarter model simply ignores injected text. Ours did ignore the instruction, and still passed the fraud on. The defence has to sit outside the model. Only ${word(TR.warned)} summary in ${word(TR.runs)} called the email suspicious.`,
  demo:`Notebook 4.2 adds the poisoned email and runs the summary with and without an approval gate, then ${word(TR.models[0].runs)} times on each model.`,
  transition:'Why were those products exposed? Three ingredients, all present at once.',
  source:`Our runs: notebook 4.2, ${T.date_text}, ${word(TR.runs)} runs with no gate, ${TR.models.map(m=>esc(m.name)).join(' and ')}. ${D.attacks.map(a=>`${esc(a.product)}: ${esc(a.found_by)}${a.by!==a.found_by?`, ${esc(a.by)}`:''}${a.cve?`, ${a.cve}`:''} (${a.date})`).join('; ')}.`});
}

// ---------------------------------------------------------------------------------------- 4.2 the lethal trifecta
{
 const W=600,H=424,R=122,C=[[214,150,COL.data],[386,150,COL.loss],[300,294,COL.target]];
 const tint={[COL.data]:'#245EDB12',[COL.loss]:'#BE123C0F',[COL.target]:'#0F766E12'};
 let g=C.map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="${R}" fill="${tint[c]}" stroke="${c}" stroke-width="3"/>`).join('');
 g+=gat(2,`<circle cx="${C[2][0]}" cy="${C[2][1]}" r="${R}" fill="none" stroke="${COL.amber}" stroke-width="5" stroke-dasharray="12 8"/>`);
 g+=label(166,98,'Private',{size:23,fill:COL.data,anchor:'middle',weight:700})+label(166,124,'data',{size:23,fill:COL.data,anchor:'middle',weight:700});
 g+=label(430,98,'Untrusted',{size:22,fill:COL.loss,anchor:'middle',weight:700})+label(430,124,'content',{size:22,fill:COL.loss,anchor:'middle',weight:700});
 g+=label(300,320,'A way to',{size:23,fill:COL.target,anchor:'middle',weight:700})+label(300,346,'send it out',{size:23,fill:COL.target,anchor:'middle',weight:700});
 g+=icon('alert',300,196,38,COL.loss,{sw:2.4});
 const tag=(x,y,t,c)=>{const w=t.length*17*.6+22;return `<rect x="${(x-w/2).toFixed(1)}" y="${y-15}" width="${w.toFixed(1)}" height="30" rx="15" fill="#fff" stroke="${c}" stroke-width="2"/>`+label(x,y+6,t,{size:17,fill:c,anchor:'middle',weight:600});};
 g+=gat(2,tag(178,160,'read_email',COL.data)+tag(420,160,'fake email',COL.loss)+tag(300,377,'send_email',COL.target)+
  `<circle cx="452" cy="318" r="22" fill="${COL.amber}"/>`+icon('approve',452,318,26,'#fff')+label(482,312,'a person',{size:18,fill:COL.amber,weight:650})+label(482,334,'approves',{size:18,fill:COL.amber,weight:650}));
 const venn=fig(W,H,g,'Three overlapping circles: private data, untrusted content, and a way to send it out; the agent at their overlap');
 const ap=T.inbox.approvals[0];
 const P3=D.trifecta.parts,PC=[COL.data,COL.loss,COL.target];
 S_('trifecta','risk','The lethal trifecta',{builds:2,
  body:cols(venn,`<div class="state-slot">${only('1',`<div class="p4-right"><ul class="p4-tri">${P3.map((t,i)=>`<li style="color:${PC[i]}"><i></i><span style="color:var(--ink)">${esc(t)}</span></li>`).join('')}</ul>
    ${ps('Each is useful on its own. Together, a stranger’s text can make the agent send your data to the stranger.')}</div>`)}
   ${only('2',`<div class="p4-right">${msg('call',jsonHTML({name:ap.call,args:{to:ap.args.to,body:ap.args.body}}),{note:'our inbox run'})}
    <p class="p4-gate">${iconHTML('approve',COL.amber,28)}<span>${kY('It waited for a yes')} before it went: even harmless sends wait.</span></p>
    <p class="p4-gate">${iconHTML('check',COL.green,28)}<span>${kG('No invoice left the inbox')} in any of our runs.</span></p></div>`)}</div>`,'1fr 1fr'),
  lines:['Simon Willison’s rule of thumb: an agent that has all three can be tricked into sending your data to an attacker.',
   'Our inbox agent had all three. Cut one: send_email waits for a person, whatever the model decides.'],
  ask:['Which of the three does the assistant in your company’s email or chat tool have?','Which of the three is easiest to cut in your case?'],
  expected:['Most have the first two: your files and anything pasted or fetched. The danger starts when it can also send, post or open links.',
   'Usually the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources.'],
  point:'Willison’s lethal trifecta: private data, untrusted content and a way to communicate out. Remove any one and this attack fails.',
  misconception:'That our gate was tested by the attack. In our runs the model never tried to send the invoices, so the gate never had to refuse. We cannot plan on that luck; the gate holds whatever the model decides. (In the recorded runs a scripted stand-in answered the gate; in the live notebook, ask_human asks you.)',
  transition:'An approval gate is one guardrail. Here is the whole set.',
  source:`Simon Willison, “The lethal trifecta for AI agents” (${D.trifecta.when}); the three labels in his words on the right. The approval is from our inbox run (notebook Part 3, ${T.date_text}).`});
}

// ---------------------------------------------------------------------------------------- 4.3 guardrails
chap('4.3','Guardrails');
{
 const N='#4B5563';   // the middle column is neutral; only the person's row is amber
 const LAYERS=[
  ['Before it runs','lock',COL.target,'#0F766E0A',[['key','Only the tools','the task needs',''],['eye','Read-only','by default',''],['server','A sandbox: a copy','of the live data','see Replit']]],
  ['While it runs','zap',N,'#4B55630A',[['approve','A person approves','what cannot be undone','see the inbox gate',COL.amber],['stop','Limits on steps','and on spend','see our stuck agent'],['check','A check on','every step','see errors compound']]],
  ['After it runs','eye',COL.green,'#1477370A',[['notes','A log of','every trace',''],['flask','Evals on','every change','next slide'],['pulse','Monitoring','in production','']]]];
 const W=1152,H=404,pw=360,gx=36,top=66;
 const g=LAYERS.map(([t,ic,c,bg,items],i)=>{const x=i*(pw+gx);
  let s=`<rect x="${x+1}" y="${top}" width="${pw-2}" height="${H-top-2}" rx="16" fill="${bg}" stroke="${c}" stroke-width="2.5"/>`+
   icon(ic,x+22,32,30,c)+label(x+46,41,t,{size:26,fill:c,weight:700});
  if(i)s+=arrow(x-gx+6,top+(H-top)/2,x-6,top+(H-top)/2,{stroke:'#4B5563',w:2.5,head:11});
  let it='';
  items.forEach(([ii,a,b,tg,ci],j)=>{const y=top+54+j*104,cc=ci||c;
   it+=`<circle cx="${x+44}" cy="${y}" r="26" fill="#fff" stroke="${cc}" stroke-width="2.5"/>`+icon(ii,x+44,y,28,cc)+
    label(x+84,y-6,a,{size:21,fill:ci||COL.ink,weight:600})+label(x+84,y+20,b,{size:21,fill:COL.ink})+(tg?label(x+84,y+46,tg,{size:18,fill:MUTED}):'');});
  return s+gat(i+1,it);}).join('');
 S_('guardrails','risk','Guardrails before, during and after a run',{builds:3,
  body:fig(W,H,g,'Guardrails in three layers: before the agent runs, while it runs, and after it runs'),
  lines:['Before it runs, decide what it can touch. Replit’s agent could reach the live database; in a sandbox the damage would have stayed in a copy.',
   `While it runs, a person stands before anything that cannot be undone, and limits cap the loop. Our stuck agent cost only ₹${num(S.cost_inr,2)} because a step limit stopped it.`,
   'After it runs, keep every trace so you can see what went wrong, and rerun the evals whenever the model, the prompt or a tool changes.'],
  ask:['Which tools would a first version of your agent really need?','Which steps in your process cannot be undone?','Who in your team would read the traces?'],
  expected:['Usually read-only ones: search, look up, read. Writing and sending can come later.','Payments, emails to customers, deletions, orders, anything published.',
   'Often nobody, at first. Name an owner before launch, as you would for any production system.'],
  point:'Guardrails sit in the code around the model: what it can touch before, what needs approval during, and what is measured after.',
  misconception:'That a guardrail is a sentence in the prompt (“never delete anything”). Prompts are advice the model may ignore; permissions, gates and limits are enforced by code.',
  transition:'The last layer, measurement, deserves its own slide.',
  source:'The layers follow common practice for any production system. Every example in grey is earlier in this part.'});
}

// ---------------------------------------------------------------------------------------- 4.3 evals
{
 const M=T.evals.models,names=Object.keys(M),runs=M[names[0]].runs;
 const maxc=Math.max(...names.map(n=>M[n].cost_inr_mean)),maxs=Math.max(...names.map(n=>M[n].seconds_mean));
 const W=1152,H=252,dx=38,d0=244,cX=720,tX=972,BAR='#7B8794';
 let g=icon('target',14,20,26,COL.green)+label(38,28,`<tspan fill="${COL.green}" font-weight="700">Known answer</tspan>  ${esc(T.evals.best.join(', then '))}`,{size:21,fill:COL.ink});
 g+=label(d0-16,80,`One task, run ${runs} times: right answers`,{size:18,fill:MUTED,weight:650})+label(cX,80,'Mean cost per run',{size:18,fill:MUTED,weight:650})+label(tX,80,'Mean time',{size:18,fill:MUTED,weight:650});
 names.forEach((n,i)=>{const y=124+i*74,m=M[n];
  g+=label(0,y+7,esc(n),{size:20,fill:COL.guess,weight:650})+label(0,y+38,'tool calls each run',{size:17,fill:MUTED});
  m.ok.forEach((ok,j)=>{const cx=d0+j*dx;g+=`<circle cx="${cx}" cy="${y}" r="15" fill="${ok?COL.green:COL.loss}"/>`+icon(ok?'check':'alert',cx,y,18,'#fff',{sw:3})+
   label(cx,y+38,String(m.calls[j]),{size:17,fill:MUTED,anchor:'middle'});});
  g+=label(d0+runs*dx-6,y+7,`${m.right} of ${m.runs}`,{size:20,fill:COL.green,weight:700});
  const cw=m.cost_inr_mean/maxc*150,tw=m.seconds_mean/maxs*100;
  g+=`<rect x="${cX}" y="${y-13}" width="${cw.toFixed(1)}" height="26" rx="4" fill="${BAR}"/>`+label(cX+cw+10,y+7,`₹${num(m.cost_inr_mean,2)}`,{size:20,fill:COL.ink,weight:600});
  g+=`<rect x="${tX}" y="${y-13}" width="${tw.toFixed(1)}" height="26" rx="4" fill="${BAR}"/>`+label(tX+tw+10,y+7,`${num(m.seconds_mean,0)} s`,{size:20,fill:COL.ink,weight:600});});
 const rows=fig(W,H,g,`The opening task run ${word(runs)} times on two models: right answers, mean cost and mean time`);
 const flow=chart([{steps:[{t:`${EV.cases_min} to ${EV.cases_max} real cases\nwith known answers`},{t:'Run the agent\non each'},{t:'Score every\nanswer'},{t:'Compare models\nand versions'}]}],
  {W:1152,bh:78,fs:20,gx:52,loop:[0,3,0,'again after every change'],alt:'An eval: real cases with known answers, run the agent, score, compare; repeated after every change'});
 S_('evals','risk','Measure before you trust',{builds:2,nb:nb('part-4'),
  body:`${rows}${at(2,`<div class="p4-evflow">${flow}</div>`)}`,
  lines:[`We ran the opening task ${word(runs)} times on each of two models, with the same forecasts, and checked every answer against the best order.`,
   `Both were right every time; ${esc(EV.cheap)} cost ${EV.cost_words} as much and took ${EV.time_words} the time. Measure like this, then use the cheapest model that passes.`],
  ask:['Which model would you deploy, and why?','What would your first ten test cases be?'],
  expected:[`The cheaper one: it was right just as often, at ${EV.cost_words} of the cost and ${EV.time_words} the time. Without the eval we would have guessed.`,
   'Real past cases with known right answers, including the awkward ones: the refund just over the limit, the invoice that does not match. Ours was one case run many times; yours should hold many cases.'],
  point:'An eval turns “it seems to work” into a number you can compare across models, prompts and versions.',
  misconception:`That the pricier model is the safe default. Here the cheaper one was as accurate, though less steady in how it worked: it made ${word(EV.lite_calls_min)} to ${word(EV.lite_calls_max)} tool calls a run, against ${word(EV.fast_calls_min)} to ${word(EV.fast_calls_max)}.`,
  demo:`Notebook 4.4: evaluate() runs the task ${word(runs)} times per model and prints right or wrong, tool calls and cost.`,
  transition:'Part 4 in one slide.',
  source:`Notebook 4.4, ${T.date_text}: ${word(runs)} runs per model, cached forecasts, answers checked against the best order. Mean cost at paid prices.`});
}

recap(4,['Errors multiply over steps; checks inside the loop contain them.',
  'Text an agent reads can steer it, or slip a fraud into its summary.',
  'Guardrails live in code: permissions, approvals, limits, logs and evals.'],
 'which tasks to hand to an agent, how to raise its autonomy, and what one task costs.',
 {card:{goal:'Summarise my inbox',model:esc(T.model),tools:`${chip('list','list_emails')} ${chip('mail','read_email')} ${chip('send','send_email')}`,
   memory:'The conversation',stop:`An answer, or ${D.max_steps} steps`,guard:'send_email waits for a person',human:'Approves every email'},
  hi:['stop','guard','human'],title:'The inbox agent, with its guardrails',
  ask:'Before you gave this agent your real inbox, which line of the card would you change?',
  expected:'The person line: who double-checks anything about payments. Maybe the tools too: no send_email at all for a first version.',
  point:'The failures of this part map onto the bottom half of the card.',transition:'Part 5: agents in your organisation.'});
