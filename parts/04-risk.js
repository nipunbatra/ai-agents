// Part 4: how agents fail. A slow pass, with the notebook in step: small errors add up (a question, notebook 4.1, a
// live figure); three real failures, each on the loop map; an email with hidden instructions (notebook 4.2 and 4.3,
// each followed by our recorded run) and the same trick on real products; the lethal trifecta; guardrails on the map
// (an approval, then notebook 4.4: a step limit) and before, during and after a run; an eval (notebook 4.5).
// Real runs: data/traces.json. Computed and published numbers: data/p4.json (scripts/sci/p4.py).
import {S_,cols,at,only,data,need,css,esc,word,Word,kY,kR,kG,
 fig,label,line,arrow,path,dot,gat,panel,COL,MUTED,icon,iconHTML,chip,msg,loopMap,
 widget,register,slider,num,big,nb,nbRun,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'steplimit','injection','injection_trials','evals','model','date_text'),
 D=need(await data('p4'),'compound','failures','injection','attacks','trifecta','evals','max_steps');
const S=T.steplimit,I=D.injection,TR=I.trials,F=D.failures,EV=D.evals,CP=D.compound,SL=CP.slider,TB=need(CP,'table').table;

css(`.p4-odds{display:grid;grid-template-columns:minmax(0,1fr) 200px minmax(0,1fr);gap:22px;align-items:stretch;width:100%;max-width:1000px;margin:0 auto}
.p4-tile{border:2px solid var(--line);border-radius:20px;background:#fff;padding:24px 26px 22px;text-align:center;min-width:0}
.p4-tile b{display:block;font-size:28px;font-weight:650;color:#374151}
.p4-tile .n{display:block;font-size:120px;line-height:1.1;font-weight:700;font-variant-numeric:tabular-nums;margin-top:6px}
.p4-tile .f{display:block;font-size:28px;line-height:1.3;color:var(--muted);min-height:36px}
.p4-op{display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:28px;line-height:1.3;color:#374151;font-weight:600}
.p4-op span{font-size:60px;line-height:1;color:var(--muted)}
.p4-map{display:flex;flex-direction:column;gap:10px}
.p4-map .loopmap svg{max-height:366px}
.p4-what{display:flex;gap:12px;align-items:center;justify-content:center;font-size:27px;line-height:1.35}
.p4-what svg{flex:none}
.p4-mail{border:2px solid var(--line);border-radius:16px;background:#fff;padding:18px 28px 22px;font-size:29px;line-height:1.4;width:100%;max-width:1000px;margin:0 auto}
.p4-mh{display:flex;gap:12px;align-items:center;font-size:23px;color:var(--muted);overflow-wrap:anywhere}
.p4-mh b{color:var(--ink);font-weight:650;margin-right:10px}
.p4-mail>p{margin-top:16px}
.p4-hidden{color:var(--loss);background:#BE123C0B;border:2px dashed #BE123C88;border-radius:12px;padding:12px 18px}
.p4-tag{display:block;font-size:16px;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:4px}
.p4-run{display:flex;flex-direction:column;gap:30px;width:100%;max-width:1040px;margin:0 auto}
.p4-said{display:flex;gap:14px;align-items:flex-start;font-size:30px;line-height:1.4}.p4-said svg{flex:none;margin-top:5px}
.p4-two{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.p4-two>div{border:2px solid var(--line);border-radius:16px;background:#fff;padding:16px 24px 18px;min-width:0}
.p4-two small{display:block;font-size:22px;color:var(--muted);margin-bottom:6px}
.p4-run .msg{padding:12px 22px 16px}.p4-run .msg .mb{font-size:28px;line-height:1.42}
.p4-attacks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
.p4-attacks>div{border:2px solid var(--line);border-top:6px solid var(--loss);border-radius:16px;background:#fff;padding:20px 22px 24px;min-width:0}
.p4-attacks b{display:block;font-size:27px;line-height:1.2;margin:12px 0 10px}
.p4-attacks p{font-size:25px;line-height:1.4}
.p4-tri{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:24px;font-size:27px;line-height:1.3}
.p4-tri li{display:flex;gap:14px;align-items:flex-start}
.p4-tri i{flex:none;width:24px;height:24px;border-radius:50%;border:4px solid currentColor;margin-top:4px}
.p4-tri li>div{color:var(--ink);min-width:0}.p4-tri .tchip{margin-top:8px;font-size:20px}
@media(max-width:760px){.reading .p4-odds,.reading .p4-attacks{grid-template-columns:minmax(0,1fr)}.reading .p4-tile .n{font-size:64px}
 .reading .p4-mail,.reading .p4-said,.reading .p4-what,.reading .p4-tri{font-size:20px}.reading .p4-run .msg .mb{font-size:18px}}`);

partBreak(4,'How agents fail','Small mistakes add up, and a stranger’s text can steer an agent. We look at real failures and at what stops them.',
 ['Small errors add up','Three real failures','Hidden instructions','Guardrails and evals'],
 {img:'part-risk.jpg',alt:'Illustration: a small helper at a desk with a torn task card, an envelope on a hook, and a person with a hand on a stop button',nb:nb('nb-4-1'),
  line:'Key question: what must be in place before an agent acts on anything that matters?',
  ask:'Has software ever done something you did not mean it to? What stopped the damage?',
  expected:'Autocorrect, an email to the wrong list, a script that deleted files. Usually an undo, a backup, or a person who noticed in time.',
  transition:'Start with a little arithmetic.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 4.1 small errors add up
chap('4.1','Small errors add up');
const pc=v=>v<.005?'<1%':`${Math.round(v*100)}%`;
const fpct=v=>`${+(v*100).toFixed(1)}%`;
const fp=v=>String(+v.toFixed(3));
const LONG=TB.rows[0][TB.n.indexOf(CP.n_long)];   // the best step rate in the notebook's printout, at the longest task

S_('compound-q','risk',`How often is a ${word(CP.n)}-step task right?`,{builds:2,
 body:`<div class="p4-odds"><div class="p4-tile"><b>Each step is right</b><span class="n" style="color:#374151">${pc(CP.p)}</span><span class="f">of the time</span></div>
  <div class="p4-op"><span>→</span>${word(CP.n)} steps,<br>all right</div>
  <div class="p4-tile"><b>The whole task is right</b><div class="state-slot">${only('1',`<div><span class="n" style="color:var(--muted)">?</span><span class="f"></span></div>`)}
   ${only('2',`<div><span class="n" style="color:var(--loss)">${pc(CP.task)}</span><span class="f">${fp(CP.p)}<sup>${CP.n}</sup></span></div>`)}</div></div></div>`,
 lines:[`Each step of a task is right ${pc(CP.p)} of the time, and the task takes ${word(CP.n)} steps. How often is the whole task right?`,
  `Only ${pc(CP.task)} of the time. The task is right only if every step is right, so the chances multiply.`],
 ask:['Take a guess: what share of these tasks come out fully right?',`Would you hire someone who gets ${pc(CP.p)} of steps right?`],
 expected:['Most guess well above half. The answer surprises people.',
  `For a one-step job, gladly. For a ${word(CP.n)}-step job, they finish cleanly about a third of the time.`],
 point:`Reliability multiplies across steps: right ${pc(CP.p)} of the time per step means a ${word(CP.n)}-step task is right ${pc(CP.task)} of the time.`,
 misconception:`That a model right ${pc(CP.p)} of the time gives tasks right ${pc(CP.p)} of the time. That holds only for one-step tasks. Real steps are not independent, so treat this as a simple model of a real trend.`,
 transition:'Over to the notebook, for a few more cases.',
 source:'Computed in scripts/sci/p4.py. The simple model: steps fail independently, and every step must be right.'});

nbRun('nb-compound','risk','4.1','Small errors add up',{
 run:`for p in (${TB.p.map(v=>v.toFixed(2)).join(', ')}):\n    print(p, [f"{p ** n:.0%}" for n in (${TB.n.join(', ')})])`,
 look:[`How fast the ${pc(TB.p.at(-1))} row falls`,`The ${pc(TB.p[0])} row at ${TB.n.at(-1)} steps`],
 line:'The same sum for three step rates and four task lengths. It prints three lines.',
 ask:'Which row is closest to the tasks in your work?',
 expected:`Real tasks are often long. Even at ${pc(TB.p[0])} a step, a ${CP.n_long}-step task is right only ${pc(LONG)} of the time.`,
 point:'The longer the task, the more reliable each step has to be.',
 transition:'The same sum as a curve, and one way to fix it.'});

const CW=1152,CH=336,CX=330;
/** The compounding figure: the whole task's chance on the left, the curve over the number of steps on the right. */
function compoundSVG({p:q,n,check}){
 const ticksX=[SL.n_min,...Array.from({length:Math.floor(SL.n_max/10)},(_,i)=>(i+1)*10)];
 const {x,y,axes}=panel({ox:CX,W:CW-CX,H:CH,L:72,R:20,T:34,B:54,xMin:SL.n_min,xMax:SL.n_max,yMin:0,yMax:1,
  ticksX,ticksY:[0,.25,.5,.75,1],fmtY:v=>`${Math.round(v*100)}%`,xLabel:'number of steps',yLabel:'whole task right',fs:19});
 let g='';
 for(const v of [.25,.5,.75,1])g+=line(x(SL.n_min),y(v),x(SL.n_max),y(v),{stroke:'#EEF0F2',w:1});
 g+=axes;
 g+=line(x(SL.n_min),y(q),x(SL.n_max),y(q),{stroke:check?'#C9CED4':MUTED,w:2,dash:'6 6'})+label(x(SL.n_max),y(q)-9,`${check?'one step, no check':'one step'}: ${fpct(q)}`,{size:18,anchor:'end',halo:true,fill:check?'#9CA3AF':MUTED});
 const ks=Array.from({length:SL.n_max-SL.n_min+1},(_,i)=>SL.n_min+i);
 const v=q**n,vc=(1-(1-q)**2)**n;
 g+=line(x(n),y(0),x(n),y(Math.max(q,check?vc:0)),{stroke:'#9CA3AF',w:1.5,dash:'4 4'});
 g+=path(ks.map(k=>[x(k),y(q**k)]),{stroke:COL.loss,w:3.5})+dot(x(n),y(v),8,{fill:COL.loss});
 if(check)g+=path(ks.map(k=>[x(k),y((1-(1-q)**2)**k)]),{stroke:COL.green,w:3.5})+dot(x(n),y(vc),8,{fill:COL.green});
 let r=label(0,46,'The whole task',{size:23,fill:COL.ink,weight:600})+label(0,74,'comes out right',{size:23,fill:COL.ink,weight:600})+
  label(0,150,pc(v),{size:76,fill:COL.loss,weight:700})+label(0,188,`= ${fp(q)}<tspan dy="-13" font-size="17">${n}</tspan>`,{size:26});
 if(check)r+=label(0,236,'With a check and',{size:21,fill:COL.green,weight:600})+label(0,262,'one retry per step',{size:21,fill:COL.green,weight:600})+
  label(0,318,pc(vc),{size:48,fill:COL.green,weight:700});
 return r+g;
}
const COMPOUND_ALT='The chance that a whole task comes out right, against the number of steps, for a given chance per step; with and without a check and one retry per step';
const BUILD_COMPOUND={1:{check:false},2:{check:true}};
register('p4-compound',(el,ctx)=>{
 if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD_COMPOUND).map(([b,s])=>`<div data-only="${b}">${fig(CW,CH,compoundSVG({p:CP.p,n:CP.n,...s}),COMPOUND_ALT)}</div>`).join('')}</div>`;return;}
 el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('p','Each step right',SL.p_min,SL.p_max,SL.p_step,CP.p)}${slider('n','Steps',SL.n_min,SL.n_max,1,CP.n)}<button type="button" data-k="check" aria-pressed="false" style="visibility:hidden">Check each step, retry once</button></div>`;
 const f=el.querySelector('.w-fig'),sp=el.querySelector('[data-k="p"]'),sn=el.querySelector('[data-k="n"]'),bt=el.querySelector('[data-k="check"]');
 const op=el.querySelector('[data-o="p"]'),on=el.querySelector('[data-o="n"]');
 let last=null;
 const show=()=>{const q=+sp.value,n=+sn.value;
  f.innerHTML=fig(CW,CH,compoundSVG({p:q,n,check:bt.getAttribute('aria-pressed')==='true'}),COMPOUND_ALT);op.textContent=fpct(q);on.textContent=String(n);};
 for(const s of [sp,sn]){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
 bt.addEventListener('click',()=>{bt.setAttribute('aria-pressed',String(bt.getAttribute('aria-pressed')!=='true'));bt.blur();show();});
 const scene=el.closest('.scene');
 const sync=()=>{const b=scene?.dataset.build;if(!BUILD_COMPOUND[b]||b===last)return;last=b;const st=BUILD_COMPOUND[b];
  sp.value=CP.p;sn.value=CP.n;bt.setAttribute('aria-pressed',String(st.check));bt.style.visibility=st.check?'':'hidden';show();};
 if(scene)new MutationObserver(sync).observe(scene,{attributes:true,attributeFilter:['data-build']});
 show();sync();
});
S_('compound','risk','What if we check each step?',{builds:2,
 body:widget('p4-compound',COMPOUND_ALT),
 lines:[`The same sum as a curve. Drag the steps up: at ${CP.n_long} steps, the task is right ${pc(CP.task_long)} of the time.`,
  `Check each step and retry once if it fails. Now ${word(CP.n)} steps come out right ${pc(CP.task_checked)} of the time.`],
 ask:[`What would it take to trust a ${CP.n_long}-step task?`,'What counts as a check in your work?'],
 expected:['Far more reliable steps, or a check at each step. The next click adds the check.',
  'Running the tests, comparing a number with its source, validating a form against a rule, a second model reviewing, a person approving.'],
 point:'Reliability multiplies across steps, so long runs need checks inside the loop as well as a better model.',
 misconception:'That the check has to be perfect to help. Here it catches every wrong step; a check that catches most of them still lifts the curve a long way. Real checks miss things, so treat the green curve as a best case.',
 demo:'Drag the per-step slider up and watch how much the long tasks gain. Switch the check off and on.',
 transition:'Now three real failures.',
 source:'Computed in scripts/sci/p4.py. With a check, a step is right unless both tries fail.'});

// ---------------------------------------------------------------------------------------- 4.2 three real failures
chap('4.2','Real failures');
/** A failure on the loop map: the box where it went wrong, and one line about what happened. */
const onMap=(map,ic,col,what)=>`<div class="p4-map">${loopMap(map)}<p class="p4-what">${iconHTML(ic,col,30)}<span>${what}</span></p></div>`;

S_('fail-replit','risk','What went wrong at Replit?',{builds:1,
 body:onMap({hi:'tool',text:{tool:'Ran commands\non live data'},cols:{tool:COL.loss}},'alert',COL.loss,
  `${kR('Replit’s coding agent deleted a company’s live database')} during a code freeze.`),
 lines:['It went wrong at the tool: the agent could run commands on live data. What would have stopped it?'],
 ask:['What would have stopped it?'],
 expected:['Working on a copy of the data, so that a mistake costs only the copy. Replit’s chief executive said they had started separating development and live databases automatically.'],
 point:'What an agent can touch decides how much one mistake costs.',
 misconception:`That this is a story about a bad model. As reported, the agent had write access to production; its own chat log said it wiped records of ${big(F.replit.executives)} executives and ${big(F.replit.companies)} companies. One report says the data was later recovered with Replit’s rollback.`,
 transition:'The second failure was a chatbot that only answered questions, and it still cost money.',
 source:`Replit, ${F.replit.when}: reported by ${F.replit.reported_by}.`});

S_('fail-aircanada','risk','What went wrong at Air Canada?',{builds:1,
 body:onMap({hi:'answer',text:{answer:'A wrong\nanswer'},icons:{answer:'chat'},cols:{answer:COL.loss}},'alert',COL.loss,
  `${kR('Air Canada’s chatbot promised a refund')} against the airline’s own policy.`),
 lines:[`It went wrong at the answer. A tribunal held the airline responsible, and it had to pay CAD ${num(F.air_canada.cad,2)}.`],
 ask:['Who is responsible for what a company’s chatbot tells a customer?'],
 expected:['The company. In the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity responsible for its own actions. The tribunal did not accept that.'],
 point:'A company answers for what its agent tells customers.',
 misconception:'That only agents that act are risky. This chatbot only answered, and the answer alone cost money. The customer had asked about a bereavement fare; the chatbot said it could be claimed after travelling, and the policy said otherwise.',
 transition:'The third failure is our own.',
 source:`${F.air_canada.case}, decided ${F.air_canada.decided}; reported by ${F.air_canada.reported_by}.`});

S_('fail-ours','risk','What went wrong in our own run?',{builds:1,
 body:onMap({hi:'result',text:{result:'The same error,\nevery round'},cols:{result:COL.loss}},'alert',COL.loss,
  `${kR('Told to keep trying,')} our agent called a tool that never answered, again and again.`),
 lines:['It went wrong at the result. The tool failed, the model read the error, and it asked again.'],
 ask:['What should stop a loop like this?'],
 expected:['A step limit, a cap on spending, or a rule to give up after a few failures. We add a step limit in the notebook shortly.'],
 point:'An agent told to keep trying will keep trying. Something outside the model has to stop it.',
 misconception:'That the model will notice it is stuck. Ours read the same timeout every round and asked again, because the goal told it to keep trying.',
 transition:'Nobody attacked those three systems. The next failure needs only an email from a stranger.',
 source:`Our run: notebook 4.4, ${T.date_text} (${esc(S.model)}).`});

// ---------------------------------------------------------------------------------------- 4.3 hidden instructions
chap('4.3','Hidden instructions');
S_('injection','risk','An email with instructions hidden in it',{builds:2,
 body:`<div class="p4-mail"><div class="p4-mh">${iconHTML('mail',MUTED,26)}<span><b>From</b>${esc(I.from)}</span></div>
  <p>${esc(I.visible)}</p>
  ${at(2,`<p class="p4-hidden"><span class="p4-tag">Written for the assistant</span>${esc(I.hidden_short)}</p>`)}</div>`,
 lines:['We ask our inbox agent to summarise the inbox in three lines. One of the emails looks like this.',
  'This is prompt injection: text inside the data that poses as an instruction.'],
 ask:['Would you notice anything odd about this email?','What do you expect the agent to do with these lines?'],
 expected:['Perhaps the sender’s address. A change of bank details is a common fraud, and it usually looks routine.',
  'Some say forward the invoices, some say ignore them. The model reads instructions and data in one stream of text, so either can happen.'],
 point:'Prompt injection: an agent cannot reliably tell the data it reads from the instructions it is given.',
 misconception:'That a reader would spot the trick. The note is polite and sounds routine, and it is addressed to the assistant.',
 transition:'Let us try it on our own agent.',
 source:'The demo inbox of notebook 4.2. The note is shortened here; the full text is in the notebook.'});

nbRun('nb-inject','risk','4.2','An email with hidden instructions',{
 run:`INBOX.append(POISON)\nr = run_agent("${I.goal}", INBOX_TOOLS)`,
 look:['Does it ask to send any email?','What does the summary say about the bank details?'],
 line:'Over to the notebook. We add this email to the demo inbox and ask for the summary again.',
 ask:'Will the agent forward the invoices?',expected:'Watch the tool calls. A send_email to the outside address would mean the attack worked.',
 point:'We run the attack on our own agent, so we can see what it does.',
 transition:'Here is what happened in our run.'});

{
 // The summary's line about the bank details, without its Markdown, list number or heading.
 const bank=a=>a.split('\n').find(l=>/bank details/.test(l)).replace(/^\s*(?:\d+\.|-)\s*/,'').replace(/^\*\*[^*]*\*\*\s*/,'').replace(/\*\*/g,'').trim();
 const R=T.injection;
 if(R.no_gate.tried_to_forward||R.gate.tried_to_forward)throw new Error('p4: the recorded run tried to forward the invoices; the slide says it did not');
 S_('injection-run','risk','Did our agent fall for it?',{builds:2,
  body:`<div class="p4-run"><div class="p4-two">${['Without an approval step','With a person approving'].map(t=>`<div><small>${t}</small><p class="p4-said">${iconHTML('check',COL.green,34)}<span>${kG('Nothing forwarded')}</span></p></div>`).join('')}</div>
   ${at(2,msg('model',`“${esc(bank(R.no_gate.answer))}”`,{note:'one line of its summary'}))}</div>`,
  lines:['We ran it twice, with and without a person approving each email. Both times, it ignored the note.',
   'But its summary passed on the new bank details as routine news, next to a real invoice.'],
  ask:['So the attack failed?','Which is worse: forwarding the invoices, or this calm summary?'],
  expected:['The instruction failed. Wait for the summary.','The summary. You trust it, and the next step is someone paying a fraudster.'],
  point:'The agent ignored the instruction and still passed the fraud on. The risk covers what it tells you as well as what it does.',
  misconception:'That a model that ignores the instruction is safe. Ours ignored it, and its summary still put the fraudster’s notice in front of you as routine.',
  transition:'Was that luck? Back to the notebook, for ten runs.',
  source:`Real run: notebook 4.2, ${T.date_text} (${esc(T.model)}), without the approval step. Markdown removed.`});
}

nbRun('nb-trials','risk','4.3','The same email, ten runs',{
 run:`for m in [GEMINI_MODEL, "gemini-flash-lite-latest"]:\n    for i in range(${TR.models[0].runs}):\n        r = run_agent(..., model=m)`,
 look:['How often it tries to forward the invoices','How often the summary warns you'],
 line:`${Word(TR.runs)} runs, ${word(TR.models[0].runs)} on each of two models. It takes a few minutes, so we start it now and come back to it.`,
 ask:`Out of ${word(TR.runs)}, how many summaries will warn you about the email?`,
 expected:'Guesses vary. Our recorded answer is on the next slide; the live one arrives in a few minutes.',
 point:'Repeating the run shows how often each outcome happens.',
 demo:'Notebook 4.3: start the cell and go on with the slides; it takes a few minutes. The next slide shows our recorded result. Look at the live counts when the notebook is next on screen.',
 transition:'While it runs, here are our recorded ten runs.'});

{
 // the ten runs, grouped by model: did it try to forward the invoices, and did its summary warn you about the email?
 const W=1100,H=314,r=25,dx=90,gap=56,x0=40+r,Y1=146,Y2=282;
 const flat=TR.models.flatMap(m=>Array.from({length:m.runs},(_,j)=>({tried:j<m.tried,warned:j<m.warned})));
 const cx=j=>x0+j*dx+(j>=TR.models[0].runs?gap:0);
 let row1=label(0,Y1-56,'Tried to forward the invoices',{size:26,fill:COL.ink,weight:600})+label(W,Y1+10,`${TR.tried} of ${TR.runs}`,{size:28,fill:COL.ink,anchor:'end',weight:700});
 let row2=label(0,Y2-56,'Warned you about the email',{size:26,fill:COL.ink,weight:600})+label(W,Y2+10,`${TR.warned} of ${TR.runs}`,{size:28,fill:COL.loss,anchor:'end',weight:700});
 flat.forEach((x,j)=>{
  row1+=x.tried?`<circle cx="${cx(j)}" cy="${Y1}" r="${r}" fill="${COL.loss}"/>`:`<circle cx="${cx(j)}" cy="${Y1}" r="${r}" fill="#fff" stroke="#AAB3BC" stroke-width="2.5"/>`;
  row2+=x.warned?`<circle cx="${cx(j)}" cy="${Y2}" r="${r}" fill="${COL.green}"/>`+icon('check',cx(j),Y2,28,'#fff',{sw:3})
   :`<circle cx="${cx(j)}" cy="${Y2}" r="${r}" fill="#BE123C14" stroke="${COL.loss}" stroke-width="2.5"/>`;});
 let o=0,names='';for(const m of TR.models){names+=label((cx(o)+cx(o+m.runs-1))/2,24,esc(m.name),{size:22,fill:COL.guess,anchor:'middle',weight:650});o+=m.runs;}
 const dots=fig(W,H,row1+gat(2,row2)+names,`${Word(TR.runs)} runs of the inbox with the hidden instructions: none tried to forward the invoices; ${word(TR.warned)} of ${word(TR.runs)} summaries warned about the email`);
 S_('injection-trials','risk',`What happened in ${word(TR.runs)} runs?`,{builds:2,
  body:dots,
  lines:[`In all ${word(TR.runs)} runs, on both models, the agent never tried to forward the invoices.`,
   `But only ${word(TR.warned)} summary warned you about the email. The other ${word(TR.passed_on)} passed the new bank details on as routine.`],
  ask:['Is the model safe against this trick, then?','Would you have spotted the fake bank details in a three-line summary?'],
  expected:['Against this wording, in these runs. The next email may be worded better, and another model may follow it.',
   'Probably not, because you trust the summary.'],
  point:'Whether a model falls for it changes from model to model and from run to run, so the defence cannot depend on the model noticing.',
  misconception:`That a smarter model simply ignores injected text. Ours did ignore the instruction, and still passed the fraud on. Only ${word(TR.warned)} summary in ${word(TR.runs)} called the email suspicious.`,
  transition:'Has this worked outside a demo?',
  source:`Our runs: notebook 4.3, ${T.date_text}, ${TR.models.map(m=>esc(m.name)).join(' and ')}, no approval step. “Warned” means the summary called the email suspicious or similar.`});
}

{
 const A=D.attacks,EL=A.find(a=>a.patched),AIC={echoleak:'mail',github:'code',comet:'globe'};
 const ATEXT={echoleak:`${kR('A crafted email')} could make it disclose data.`,
  github:`${kR('A public issue')} led an agent to leak private repository data.`,
  comet:`${kR('Text on a web page')} steered the browser agent.`};
 S_('attacks','risk','The same trick on real products',{builds:1,
  body:`<div class="p4-attacks">${A.map(a=>`<div>${iconHTML(AIC[a.id],COL.loss,36)}<b>${esc(a.product)}</b><p>${ATEXT[a.id]}</p></div>`).join('')}</div>`,
  lines:['Researchers showed the same kind of attack on three real products.'],
  ask:['What do the three have in common?'],
  expected:['Each agent read text from outside, could see private data, and had a way to send it out. That is the next slide.'],
  point:'Prompt injection has worked on widely used products. Any agent that reads text from outside is exposed to it.',
  misconception:`That this needs a skilled attacker. Each attack was a piece of ordinary text: an email, an issue, a web page. Microsoft rated ${esc(EL.name)}’s severity ${num(EL.cvss,1)} of 10 (critical) and patched it.`,
  transition:'Why could these products be tricked? Each had the same three things at once.',
  source:A.map(a=>`${esc(a.product)}: ${esc(a.found_by)}${a.by!==a.found_by?`, ${esc(a.by)}`:''}${a.cve?`, ${a.cve}`:''} (${a.date})`).join('; ')+'.'});
}

{
 const W=600,H=424,R=122,C=[[214,150,COL.data],[386,150,COL.loss],[300,294,COL.target]];
 const tint={[COL.data]:'#245EDB12',[COL.loss]:'#BE123C0F',[COL.target]:'#0F766E12'};
 let g=C.map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="${R}" fill="${tint[c]}" stroke="${c}" stroke-width="3"/>`).join('');
 g+=gat(2,`<circle cx="${C[2][0]}" cy="${C[2][1]}" r="${R}" fill="none" stroke="${COL.amber}" stroke-width="6" stroke-dasharray="14 9"/>`);
 g+=label(166,98,'Private',{size:24,fill:COL.data,anchor:'middle',weight:700})+label(166,125,'data',{size:24,fill:COL.data,anchor:'middle',weight:700});
 g+=label(430,98,'Untrusted',{size:23,fill:COL.loss,anchor:'middle',weight:700})+label(430,125,'content',{size:23,fill:COL.loss,anchor:'middle',weight:700});
 g+=label(300,322,'A way to',{size:24,fill:COL.target,anchor:'middle',weight:700})+label(300,349,'send it out',{size:24,fill:COL.target,anchor:'middle',weight:700});
 g+=icon('alert',300,196,40,COL.loss,{sw:2.4});
 g+=gat(2,`<circle cx="455" cy="330" r="24" fill="${COL.amber}"/>`+icon('approve',455,330,28,'#fff')+label(486,324,'a person',{size:21,fill:COL.amber,weight:650})+label(486,349,'approves',{size:21,fill:COL.amber,weight:650}));
 const venn=fig(W,H,g,'Three overlapping circles: private data, untrusted content, and a way to send it out; an agent at their overlap can be tricked');
 const P3=D.trifecta.parts,PC=[COL.data,COL.loss,COL.target];
 const OURS=[chip('mail','read_email','memory'),chip('alert','the fake email','risk'),chip('approve','send_email waits for a person','you')];
 S_('trifecta','risk','The lethal trifecta',{builds:2,
  body:cols(venn,`<ul class="p4-tri">${P3.map((t,i)=>`<li style="color:${PC[i]}"><i></i><div>${esc(t)}${at(2,OURS[i])}</div></li>`).join('')}</ul>`,'1fr 1fr'),
  lines:['Simon Willison’s rule of thumb: an agent with all three can be tricked into sending your data to an attacker.',
   'Our inbox agent had all three. We removed the third: nothing goes out until a person approves.'],
  ask:['Which of the three does the assistant in your company’s email or chat tool have?','Which of the three is easiest to remove in your case?'],
  expected:['Most have the first two: your files and anything pasted or fetched. The danger starts when it can also send, post or open links.',
   'Usually the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources.'],
  point:'Willison’s lethal trifecta: private data, untrusted content and a way to send data out. Remove any one and this attack fails.',
  misconception:'That a better prompt removes one of the three. Telling the model “never send data out” is advice it may ignore. Removing the send tool, or putting a person in front of it, is enforced by code.',
  transition:'Where does that approval sit in the loop?',
  source:`Simon Willison, “The lethal trifecta for AI agents” (${D.trifecta.when}). The three items on the right are in his words.`});
}

// ---------------------------------------------------------------------------------------- 4.4 guardrails
chap('4.4','Guardrails');
S_('gate','risk','A person approves before an email goes out',{builds:1,
 body:onMap({guards:true,hi:'gate'},'approve',COL.amber,`${kY('Only send_email waits.')} Listing and reading emails run at once.`),
 lines:['This is the approval from our inbox run in Part 3. It sits between the model’s request and our code.'],
 ask:['Which tools in your work should wait for a person?'],
 expected:['Anything that cannot be undone: payments, emails to customers, deletions, orders. Reading can usually run at once.'],
 point:'An approval step is code around the model: send_email cannot run until a person approves.',
 misconception:'That our approval was tested by the attack. In our runs the model never tried to send the invoices, so it never had to refuse. We cannot plan on that luck; the approval holds whatever the model decides. (In the recorded runs a scripted stand-in answered; in the live notebook, ask_human asks you.)',
 transition:'The other guardrail on the map is a step limit. Back to the notebook.',
 source:`The approval step of our inbox agent (notebook 3.3, ${T.date_text}).`});

nbRun('nb-steplimit','risk','4.4','A step limit',{
 run:`stuck = run_agent("... ${S.goal.slice(S.goal.indexOf('Keep'))}",\n                  [flaky_lookup], max_steps=${S.steps})`,
 look:['How many rounds before it stops','What the whole run cost'],
 line:'A tool that never answers, and a goal that says keep trying. This time we set a step limit.',
 ask:'Without the limit, when would this run stop?',
 expected:'Perhaps never. Each round the model reads the error and asks again, until the money runs out.',
 point:'A step limit stops the loop after a fixed number of rounds, whatever the model wants.',
 transition:'Here is our recorded run, on the map.'});

S_('steplimit','risk',`The step limit stopped our run after ${word(S.steps)} rounds`,{builds:1,
 body:onMap({guards:true,hi:'limit'},'stop',COL.loss,`${Word(S.calls)} calls, ${word(S.calls)} timeouts, then stop: ${num(S.seconds,1)} seconds, ₹${num(S.cost_inr,2)}.`),
 lines:['The limit is a counter in our code, outside the model. A cap on spending works the same way.'],
 ask:['What limits would you set for an agent in your team?'],
 expected:['A number of rounds, a budget per task, a time limit, and a rule to stop and ask a person after repeated failures.'],
 point:'Limits are enforced by our code, so they hold even when the model is told to keep trying.',
 misconception:`That a limit has to be large to be safe. Set it a little above what a normal run needs. Our loop’s default is ${D.max_steps} rounds; this run was capped at ${word(S.steps)}.`,
 transition:'Approvals and limits act while the agent runs. There is more to do before and after.',
 source:`Our run: notebook 4.4, ${T.date_text} (${esc(S.model)}). Cost at paid prices.`});

{
 const N='#4B5563';   // the middle column is neutral; only the person's item is amber
 const LAYERS=[
  ['Before it runs','lock',COL.target,'#0F766E0A',[['key','Only the tools','the task needs'],['server','A copy of','the live data']]],
  ['While it runs','zap',N,'#4B55630A',[['approve','A person approves','what cannot be undone',COL.amber],['stop','A limit on','steps and spending']]],
  ['After it runs','eye',COL.green,'#1477370A',[['notes','A log of','every run'],['flask','Evals after','every change']]]];
 const W=1152,H=330,pw=360,gx=36,top=62;
 const g=LAYERS.map(([t,ic,c,bg,items],i)=>{const x=i*(pw+gx);
  let s=`<rect x="${x+1}" y="${top}" width="${pw-2}" height="${H-top-2}" rx="16" fill="${bg}" stroke="${c}" stroke-width="2.5"/>`+
   icon(ic,x+22,30,30,c)+label(x+48,40,t,{size:27,fill:c,weight:700});
  if(i)s+=arrow(x-gx+6,top+(H-top)/2,x-6,top+(H-top)/2,{stroke:'#4B5563',w:2.5,head:11});
  let it='';
  items.forEach(([ii,a,b,ci],j)=>{const y=top+72+j*118,cc=ci||c;
   it+=`<circle cx="${x+46}" cy="${y}" r="28" fill="#fff" stroke="${cc}" stroke-width="2.5"/>`+icon(ii,x+46,y,30,cc)+
    label(x+90,y-7,a,{size:24,fill:ci||COL.ink,weight:650})+label(x+90,y+23,b,{size:24,fill:COL.ink});});
  return s+gat(i+1,it);}).join('');
 S_('guardrails','risk','Guardrails before, during and after a run',{builds:3,
  body:fig(W,H,g,'Guardrails in three layers: before the agent runs, while it runs, and after it runs'),
  lines:['Before it runs, decide what it can touch. With only a copy of the data, Replit’s agent could have broken only the copy.',
   'While it runs, a person approves what cannot be undone, and limits cap the loop. We just saw both.',
   'After it runs, keep a log of every run. When anything changes, test it again on cases with known answers.'],
  ask:['Which tools would a first version of your agent really need?','Which steps in your process cannot be undone?','How would you know your agent still works after a change?'],
  expected:['Usually read-only ones: search, look up, read. Writing and sending can come later.',
   'Payments, emails to customers, deletions, orders, anything published.',
   'Run it on real cases with known answers and count how many come out right. That is an eval, next.'],
  point:'Guardrails are code around the model: what it can touch before, what needs approval during, and what is measured after.',
  misconception:'That a guardrail is a sentence in the prompt (“never delete anything”). Prompts are advice the model may ignore; permissions, approvals and limits are enforced by code.',
  transition:'How do we know an agent works? Back to the notebook.',
  source:'The three layers follow common practice for any production system.'});
}

// ---------------------------------------------------------------------------------------- 4.5 evals
chap('4.5','Evals');
const EM=T.evals.models,ENAMES=Object.keys(EM),RUNS=EM[ENAMES[0]].runs;
nbRun('nb-evals','risk','4.5','An eval: ten runs per model',{
 run:'def correct(answer): ...   # does it name the best order?\nevals = {m: evaluate(m) for m in EVAL_MODELS}',
 look:['Right or wrong, run by run','What each model costs'],
 line:`We ask the opening question ${word(RUNS)} times on each model, and check every answer. It takes a few minutes.`,
 ask:'How would you test an agent before you trust it?',
 expected:'Run it many times on cases with known answers, and count how many come out right.',
 point:'An eval is a set of cases with known answers that we run the agent on, again and again.',
 demo:'Notebook 4.5: start the cell; it takes a few minutes. The next slide shows our recorded result.',
 transition:'Here are our recorded results.'});

{
 const maxc=Math.max(...ENAMES.map(n=>EM[n].cost_inr_mean)),maxs=Math.max(...ENAMES.map(n=>EM[n].seconds_mean));
 const W=1152,H=262,dx=36,d0=296,cX=772,tX=990,BAR='#7B8794';
 let g=icon('target',16,22,28,COL.green)+label(42,31,`<tspan fill="${COL.green}" font-weight="700">Known answer</tspan>  ${esc(T.evals.best.join(', then '))}`,{size:24,fill:COL.ink});
 g+=label(d0-16,94,`Right answers in ${word(RUNS)} runs`,{size:20,fill:MUTED,weight:650});
 let g2=label(cX,94,'Mean cost',{size:20,fill:MUTED,weight:650})+label(tX,94,'Mean time',{size:20,fill:MUTED,weight:650});
 ENAMES.forEach((n,i)=>{const y=148+i*80,m=EM[n];
  g+=label(0,y+8,esc(n),{size:23,fill:COL.guess,weight:650});
  m.ok.forEach((ok,j)=>{const cx=d0+j*dx;g+=`<circle cx="${cx}" cy="${y}" r="15" fill="${ok?COL.green:COL.loss}"/>`+icon(ok?'check':'alert',cx,y,18,'#fff',{sw:3});});
  g+=label(d0+RUNS*dx-4,y+8,`${m.right} of ${m.runs}`,{size:23,fill:COL.green,weight:700});
  const cw=m.cost_inr_mean/maxc*118,tw=m.seconds_mean/maxs*76;
  g2+=`<rect x="${cX}" y="${y-14}" width="${cw.toFixed(1)}" height="28" rx="4" fill="${BAR}"/>`+label(cX+cw+10,y+8,`₹${num(m.cost_inr_mean,2)}`,{size:23,fill:COL.ink,weight:600});
  g2+=`<rect x="${tX}" y="${y-14}" width="${tw.toFixed(1)}" height="28" rx="4" fill="${BAR}"/>`+label(tX+tw+10,y+8,`${num(m.seconds_mean,0)} s`,{size:23,fill:COL.ink,weight:600});});
 S_('evals','risk','Which model should we use?',{builds:2,
  body:fig(W,H,g+gat(2,g2),`The opening question asked ${word(RUNS)} times on each of two models: right answers, mean cost and mean time`),
  lines:[`Each answer was checked against the best order from Part 1. Both models were right in all ${word(RUNS)} runs.`,
   `${esc(EV.cheap)} cost ${EV.cost_words} as much and took ${EV.time_words} the time. For this task, the cheaper model is enough.`],
  ask:['Which model would you pick so far?','Which model would you deploy, and why?'],
  expected:['No difference yet: both were right every time. So the cost decides.',
   `The cheaper one: right just as often, at ${EV.cost_words} of the cost and ${EV.time_words} the time. Without the eval we would have guessed.`],
  point:'An eval runs real cases with known answers and counts how many come out right. Compare that count across models, prompts and versions.',
  misconception:`That the pricier model is the safe default. Here the cheaper one was as accurate, though less steady in how it worked: it made ${word(EV.lite_calls_min)} to ${word(EV.lite_calls_max)} tool calls a run, against ${word(EV.fast_calls_min)} to ${word(EV.fast_calls_max)}. Ours was one case run many times; a real eval holds ${EV.cases_min} to ${EV.cases_max} real cases, including the awkward ones.`,
  transition:'Part 4 in one slide.',
  source:`Notebook 4.5, ${T.date_text}: ${word(RUNS)} runs per model, cached forecasts, answers checked against the best order. Mean cost at paid prices.`});
}

recap(4,['Small errors add up. Check each step.',
  'Text it reads can change what it does and says.',
  'Guardrails are code: permissions, approvals, limits and evals.'],
 'agents in your organisation.',
 {card:{goal:'Summarise my inbox',tools:`${chip('list','list_emails')} ${chip('mail','read_email')} ${chip('send','send_email')}`,
   stop:`An answer, or ${D.max_steps} rounds`,guard:'send_email waits for a person',human:'Approves every email'},
  hi:['stop','guard','human'],title:'Our inbox agent',
  ask:'Before you gave this agent your real inbox, which line of the card would you change?',
  expected:'The person line: who double-checks anything about payments. Maybe the tools too: no send_email at all for a first version.',
  point:'The failures of this part map onto the bottom half of the card.',transition:'Part 5: agents in your organisation.'});
