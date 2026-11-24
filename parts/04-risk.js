// Part 4: how agents fail. We break the agent of Parts 1 to 3, and add what stops each failure. Small errors add up
// (a question, then a live figure; notebook 4.1). A supplier's note with a paragraph written for the assistant makes
// the agent print a secret (4.2, then ten runs in 4.3), why that works, and the lethal trifecta. Then the reveal: the
// guard was in our loop all along (the map, then needs_approval), a risky command a person allows (4.4), and what a
// safe list cannot do. A step limit (4.5), two real failures on the map, and an eval on two model sizes (4.6).
// Recorded runs: data/traces.json. Computed and published facts: data/p4.json (scripts/sci/p4.py).
import {S_,cols,at,only,data,need,css,esc,word,Word,num,big,kY,kT,kR,kG,
 fig,label,line,arrow,path,dot,gat,gonly,panel,COL,MUTED,icon,iconHTML,chip,loopMap,
 widget,register,slider,nb,nbRun,partBreak,recap,chap,
 editor,term,tree,toolCall,toolBack,says,request,loopStrip,firstSentence} from '../kit.js';

const T=need(await data('traces'),'injection','injection_trials','approval','steplimit','evals','model','date_text'),
 D=need(await data('p4'),'compound','guard','failures','attacks','trifecta');
const INJ=T.injection,OPEN=INJ.open,GATED=INJ.gated,TR=T.injection_trials,AP=T.approval,LIM=T.steplimit,G=D.guard,F=D.failures;
const CP=D.compound,SL=CP.slider,TB=need(CP,'table').table;
const RUN=`${T.date_text} (${esc(T.model)})`;

// ---------------------------------------------------------------------------------------- what the recorded runs say
/** "all ten", "seven of the ten", "none of the ten". */
const outOf=(k,n)=>k===n?`all ${word(n)}`:k===0?`none of the ${word(n)}`:`${word(k)} of the ${word(n)}`;
const mono=s=>`<span class="mono">${esc(s)}</span>`;
const SECRETS=G.protected[0];                                                   // the protected file: .env
const noteFile=(INJ.task.match(/[\w/.-]+\.txt/)||['inbox/supplier_note.txt'])[0];   // the note's path, from our request
const noteName=noteFile.split('/').pop();
// With everything allowed: the step that read the note, and the step the note asked for (the one a person was asked about).
const sameCall=a=>s=>s.name===a.tool&&JSON.stringify(s.args)===JSON.stringify(a.args);
const readNote=OPEN.steps.find(s=>s.result.trim()===INJ.note.trim())||OPEN.steps.find(s=>JSON.stringify(s.args).includes(noteName));
const leak=OPEN.steps.find(sameCall(OPEN.asked[0]||{})),held=GATED.steps.find(sameCall(GATED.asked[0]||{}));
if(!readNote||!leak||!held)throw new Error('p4: the recorded injection runs no longer read the note and then ask for the secret');
if(!(OPEN.tried&&OPEN.secret_reached_model&&OPEN.secret_in_answer))throw new Error('p4: with everything allowed, the secret no longer reaches the answer');
if(GATED.asked.some(a=>a.allowed)||GATED.secret_reached_model||GATED.secret_in_answer)throw new Error('p4: the run with a person who says no is no longer clean');
const secret=leak.result.trim();                                                // what the secrets file holds
const values=secret.split('\n').map(l=>l.split('=').pop().trim()).filter(Boolean);       // the secret values, without their names
const leaked=OPEN.answer.split('\n').filter(l=>values.some(v=>l.includes(v)));          // the lines of the answer that give one away
if(!leaked.length)throw new Error('p4: the secret is no longer on a line of the answer');
const ask1=AP.asked[0],rm=(ask1.reason.match(/command '([^']+)'/)||[])[1];     // the command the check stopped at: rm
const named=ask1.args.command.split(/\s+/).filter(w=>w.includes('/')).map(w=>w.replace(/["']/g,'').split('/').pop());   // the files the command names
const inboxBefore=T.tidy?.inbox?.map(f=>f.name)||named,gone=inboxBefore.filter(n=>!AP.files_left.includes(n));
if(!rm||!ask1.allowed||!gone.length)throw new Error('p4: the recorded approval run no longer deletes files after a yes');

css(`.p4-odds{display:grid;grid-template-columns:minmax(0,1fr) 200px minmax(0,1fr);gap:22px;align-items:stretch;width:100%;max-width:1000px;margin:0 auto}
.p4-tile{border:2px solid var(--line);border-radius:20px;background:#fff;padding:24px 26px 22px;text-align:center;min-width:0}
.p4-tile b{display:block;font-size:28px;font-weight:650;color:#374151}
.p4-tile .n{display:block;font-size:120px;line-height:1.1;font-weight:700;font-variant-numeric:tabular-nums;margin-top:6px}
.p4-tile .f{display:block;font-size:28px;line-height:1.3;color:var(--muted);min-height:36px}
.p4-op{display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:28px;line-height:1.3;color:#374151;font-weight:600}
.p4-op span{font-size:60px;line-height:1;color:var(--muted)}
.p4-map{display:flex;flex-direction:column;gap:12px}
.p4-map .loopmap svg{max-height:356px}
.p4-what{display:flex;gap:12px;align-items:center;justify-content:center;font-size:27px;line-height:1.35;text-wrap:balance}
.p4-what svg{flex:none}
.p4-note .ed .mark{background:#BE123C40;border-left-color:#FF6B8A}
.p4-note .ed .ln:has(.mark:not(.reveal-hidden)){color:#FFD9DF}
.p4-walk{display:grid;grid-template-columns:var(--l,1.05fr) var(--r,1.3fr);gap:30px;align-items:center;width:100%}
.p4-walk>div,.p4-stack{min-width:0;display:flex;flex-direction:column;gap:14px}
/* the strip's two labels at the size that clears its arcs (stage.js draws them at 22 in the same geometry) */
.p4-excerpt .ed .ln{padding-left:0}.p4-excerpt .ed .ln::before{display:none}
.p4-hot .tc{border-color:#BE123C99;background:#BE123C0D}.p4-hot .tc-who{color:var(--loss)}
.p4-leak{display:block;margin-top:10px;font:650 21px/1.4 "SFMono-Regular",Menlo,Consolas,monospace;color:var(--loss);background:#BE123C12;border-left:4px solid var(--loss);border-radius:4px;padding:5px 12px;overflow-wrap:anywhere}
.p4-leak.ok{color:var(--d);background:#14773712;border-left-color:var(--d);display:flex;align-items:center;gap:8px}
.p4-ask .tl{display:block;white-space:pre-wrap;overflow-wrap:anywhere;color:#AEB9CD}
.p4-ask .call,.p4-ask .why,.p4-ask .yn{display:inline-block;max-width:100%;vertical-align:top}.p4-ask .yn{white-space:nowrap}
.p4-ask .call{color:#fff;font-weight:650}.p4-ask .why{color:#FFCB6B}
.p4-ask .key{display:inline-block;min-width:1.5em;text-align:center;border-radius:6px;font-weight:700;color:#fff;padding:0 7px}
.p4-ask .slot{display:inline-grid;vertical-align:top}.p4-ask .slot>*{grid-area:1/1}.p4-ask .caret{align-self:center}
.p4-ask .key.n{background:#E11D48}.p4-ask .key.y{background:#B45309}
.p4-tri{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:22px;font-size:27px;line-height:1.3}
.p4-tri li{display:flex;gap:14px;align-items:flex-start}
.p4-tri i{flex:none;width:24px;height:24px;border-radius:50%;border:4px solid currentColor;margin-top:4px}
.p4-tri li>div{color:var(--ink);min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:8px}.p4-tri .tchip{font-size:20px}
.p4-tri .chips{display:flex;flex-wrap:wrap;gap:8px}
.p4-setup{align-items:stretch}.p4-setup .tree{flex:1}.p4-setup .req,.p4-rm .req{text-wrap:balance}
.p4-setup .tree.s .tr,.p4-rm .tree.s .tr{min-height:28px}
@media(max-width:760px){.reading .p4-odds,.reading .p4-walk{grid-template-columns:minmax(0,1fr)}.reading .p4-tile .n{font-size:64px}
 .reading .p4-what,.reading .p4-tri{font-size:20px}.reading .p4-leak{font-size:15px}}`);

/** A window with the same title bar as the editor and the terminal (stage.js keeps its own private). */
const win=(title,ic,body,cls='')=>`<div class="win term ${cls}"><div class="win-bar"><i></i><i></i><i></i><span class="tab">${iconHTML(ic,'currentColor',17)}${esc(title)}</span></div><pre class="win-body"><code>${body}</code></pre></div>`;
/** Python's json.dumps of a tool call's arguments, as ask_human prints them. */
const pyJson=o=>`{${Object.entries(o).map(([k,v])=>`${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ')}}`;
/** The question ask_human prints for one logged approval (notebook 1.6), and the key that was typed at build keyAt. */
function asks(a,{keyAt=1,size=''}={}){
 const k=a.allowed?'y':'n';
 return win('the notebook stops, and asks','approve',
  `<span class="tl">The agent wants to run <span class="call">${esc(a.tool)}(${esc(pyJson(a.args))}).</span></span>`+
  `<span class="tl">It needs approval because <span class="why">${esc(a.reason)}.</span> <span class="yn">Allow? [y/N] `+
  `<span class="slot">${keyAt>1?`<span class="caret" data-only="1-${keyAt-1}"></span>`:''}<span class="key ${k}"${keyAt>1?` data-at="${keyAt}"`:''}>${k}</span></span></span></span>`,`p4-ask ${size}`);
}
/** Text wrapped to w characters a line, as a list of lines. */
const wrap=(text,w)=>text.split('\n').flatMap(l=>{const out=[''];for(const x of l.split(' ')){if(out.at(-1)&&(out.at(-1)+' '+x).length>w)out.push(x);else out[out.length-1]+=(out.at(-1)?' ':'')+x;}return out;});
/** A goal as Python writes a long string: one quoted sentence a line, indented as an argument. */
const quoted=text=>text.trim().split(/(?<=[.!?])\s+/).map((s,i,a)=>'    '+JSON.stringify(s+(i<a.length-1?' ':''))).join('\n');
/** A slot whose alternatives (only(...)) share one place. */
const slot=html=>`<div class="state-slot">${html}</div>`;
/** The loop map with one line under it: the box in question, and what happened there. */
const onMap=(map,ic,col,what)=>`<div class="p4-map">${loopMap(map)}<p class="p4-what">${iconHTML(ic,col,30)}<span>${what}</span></p></div>`;

partBreak(4,'How agents fail','Our agent fixed a test, tidied a folder and checked invoices. Now we break it, and add what stops each failure.',
 ['Small errors add up','A file with hidden instructions','A person approves, and a step limit','An eval on two models'],
 {img:'part-risk.jpg',alt:'Illustration: a small helper at a desk with a torn task card, an envelope on a hook, and a person with a hand on a stop button',nb:nb('nb-4-1'),
  line:'Key question: what must be in place before an agent touches anything that matters?',
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
  <div class="p4-tile"><b>The whole task is right</b>${slot(`${only('1',`<div><span class="n" style="color:var(--muted)">?</span><span class="f"></span></div>`)}
   ${only('2',`<div><span class="n" style="color:var(--loss)">${pc(CP.task)}</span><span class="f">${fp(CP.p)}<sup>${CP.n}</sup></span></div>`)}`)}</div></div>`,
 lines:[`Say each step is right ${pc(CP.p)} of the time, and a task takes ${word(CP.n)} steps. How often is the whole task right?`,
  `Only ${pc(CP.task)} of the time. The task is right only if every step is right, so the chances multiply.`],
 ask:['Take a guess: what share of these tasks come out fully right?',`Would you hire someone who gets ${pc(CP.p)} of steps right?`],
 expected:['Most guess well above half. The answer surprises people.',
  `For a one-step job, gladly. For a ${word(CP.n)}-step job, they finish cleanly about a third of the time.`],
 point:`Reliability multiplies across steps: right ${pc(CP.p)} of the time per step means a ${word(CP.n)}-step task is right ${pc(CP.task)} of the time.`,
 misconception:`That a model right ${pc(CP.p)} of the time gives tasks right ${pc(CP.p)} of the time. That holds only for one-step tasks. Real steps are not independent, so treat this as a simple model of a real trend.`,
 transition:'The same sum as a curve.',
 source:'Computed in scripts/sci/p4.py. The simple model: steps fail independently, and every step must be right.'});

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
const BUILD_COMPOUND={1:{check:true}};
register('p4-compound',(el,ctx)=>{
 if(ctx.printing){el.innerHTML=slot(Object.entries(BUILD_COMPOUND).map(([b,s])=>`<div data-only="${b}">${fig(CW,CH,compoundSVG({p:CP.p,n:CP.n,...s}),COMPOUND_ALT)}</div>`).join(''));return;}
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
S_('compound','risk','What if we check each step?',{builds:1,nb:nb('nb-4-1','▶ Open 4.1 in Colab'),
 body:widget('p4-compound',COMPOUND_ALT),
 lines:[`Red is the sum we just did. Check each step and retry once, and ${word(CP.n)} steps come out right ${pc(CP.task_checked)} of the time.`],
 ask:['Where did our agent check a step?'],
 expected:['It ran the tests after its edit, and we ran them again ourselves. In the invoice job, a program checked every flag.'],
 point:'Reliability multiplies across steps, so long runs need checks inside the loop as well as a better model.',
 misconception:'That the check has to be perfect to help. Here it catches every wrong step; a check that catches most of them still lifts the curve a long way. Real checks miss things, so treat the green curve as a best case.',
 demo:`Switch the check off, and drag the sliders: without it, a ${CP.n_long}-step task is right only ${pc(CP.task_long)} of the time. Notebook 4.1 prints the same sum for ${word(TB.p.length)} step rates: even at ${pc(TB.p[0])} a step, ${CP.n_long} steps are right only ${pc(LONG)} of the time.`,
 transition:'Those were honest mistakes. Now someone tries to mislead the agent.',
 source:'Computed in scripts/sci/p4.py. With a check, a step is right unless both tries fail.'});

// ---------------------------------------------------------------------------------------- 4.2 a file with hidden instructions
chap('4.2','Hidden instructions');
{
 // The note as the file holds it, wrapped to the editor's width; `hid` is the paragraph addressed to the assistant.
 const paras=INJ.note.trim().split(/\n\n+/),hid=paras.findIndex(p=>/assistant/i.test(p)),rows=[];let from=0,to=0;
 paras.forEach((p,i)=>{if(i)rows.push('');const ls=wrap(p,62);if(i===hid){from=rows.length+1;to=rows.length+ls.length;}rows.push(...ls);});
 if(hid<0||!paras[hid].includes(SECRETS))throw new Error('p4: the note no longer has a paragraph for the assistant that names the secrets file');
 // The folder, from the listing the agent itself asked for: the files, then the inbox (ls does not show hidden files, so the secrets file is added).
 const ls=(OPEN.steps.find(s=>s.name==='bash'&&/^ls\b/.test(s.args.command||''))?.result||'').split('\n\n').map(b=>b.split('\n').filter(Boolean));
 const dirs=Object.fromEntries(ls.slice(1).map(b=>[b[0].replace(/^\.\/|:$/g,''),b.slice(1)]));
 const others=(dirs.inbox||[]).filter(n=>n!==noteName).length,files=(ls[0]||[]).filter(n=>!(n in dirs));
 const rowsT=[SECRETS,...(files.length?files:['billing.py','test_billing.py']),'inbox/','  '+noteName,...(others?[`  ${others} other files`]:[])];
 S_('inj-note','risk','A note from a supplier arrives',{builds:2,
  body:`<div class="duo p4-setup" style="--l:.8fr;--r:1.5fr"><div>${request(esc(INJ.task),{who:'Our request'})}
    ${tree('workspace/',rowsT,{size:'s',marks:{[SECRETS]:[['2','risk']],[noteName]:[['1,2','new']]}})}</div>
   <div class="p4-note p4-excerpt">${editor(noteFile,rows.join('\n'),{lang:'text',size:'s',focus:{2:[[from,to]]},notes:{[to]:['written for the assistant',COL.loss,[2]]}})}</div></div>`,
  lines:['A supplier’s note arrives in the inbox, about a price rise. We ask the agent to summarise it.',
   `One paragraph is written for the assistant. It asks for a command that prints ${SECRETS}, our file of secrets.`],
  ask:['Would you notice anything odd about this note?',`Does the agent need ${SECRETS} to summarise a note?`],
  expected:['Most people read the first paragraph and stop. The price rise looks like the whole message.',
   'No. But it can reach it: the file sits in the same folder, and bash can print any file.'],
  point:'A file our agent reads can contain text addressed to the agent, and the agent can reach more than its task needs.',
  misconception:'That such text has to be hidden cleverly. It can sit in plain sight: people skim, and the model reads every word.',
  transition:'Over to the notebook. We let every tool call through.',
  source:'The note and the key are made up for this talk; the notebook writes both files in section 4.2. The note’s text is exact, wrapped to fit.'});
}

nbRun('nb-inject','risk','4.2','A file with hidden instructions',{
 run:'r_open, open_result = injection_run(True)   # allow everything\nprint(open_result)',
 look:['Which commands does it ask for?','How does its summary end?'],
 line:'Over to the notebook. We add the note and ask for the summary, with every tool call allowed.',
 ask:'Will it run the command the note asks for?',expected:'Watch the purple blocks. A request for the secrets file would mean the note worked.',
 point:'We run the attack on our own agent, so we can see what it does.',
 demo:'Notebook 4.2: run the first two cells (the note, then injection_run(True)). Leave the cell with injection_run(False) for later: we come back to it.',
 transition:'Here is what happened in our run.'});

{
 const N=OPEN.rounds,isBash=leak.name==='bash',para=wrap(INJ.note.trim().split(/\n\n+/).find(p=>/assistant/i.test(p)),40);
 const strip=(on,s)=>loopStrip(on,{round:`Round ${s} of ${N}`});
 S_('inj-open','risk','With everything allowed, the secret ends up in its answer',{builds:3,
  body:`<div class="p4-walk" style="--l:1.2fr;--r:1.25fr"><div>${slot(only('1',strip({model:'1',tool:'1',result:'1'},readNote.round))+only('2',strip({model:'2',tool:'2',result:'2'},leak.round))+only('3',strip({model:'3',answer:'3'},N)))}
    ${toolCall(readNote.name,readNote.args)}<div class="p4-hot">${toolCall(leak.name,leak.args,{at:2})}</div></div>
   <div>${slot(only('1',`<div class="p4-note p4-excerpt">${editor(`what came back: ${noteFile}`,['…',...para,'…'].join('\n'),{lang:'text',focus:{1:[[2,para.length+1]]}})}</div>`)+
    only('2-3',`<div class="p4-stack">${isBash?term([{cmd:leak.args.command},{out:secret,kind:'hot'}]):editor(SECRETS,secret,{lang:'text',icon:'lock'})}
     ${at(3,says(`${firstSentence(OPEN.answer)} …<span class="p4-leak">${esc(leaked.join('\n'))}</span>`,{who:'The model’s summary'}))}</div>`))}</div></div>`,
  lines:['It reads the note, as we asked. The whole note is now in the conversation, odd paragraph included.',
   'Its next request is the command from the note. Nothing stops it, so our code returns the key.',
   'Its summary ends with the key. Whoever receives this summary receives the secret.'],
  ask:['What has the model just read?','Who asked for that command?','Where would this summary go in a real office?'],
  expected:['The price rise, and the paragraph written for it.','The supplier, through the note. We never mentioned the secrets file.',
   'Into an email, a ticket or a chat channel, perhaps back to the supplier. The key travels with it.'],
  point:'Text inside a file changed what the agent did: it ran a command we never asked for and put a secret in its answer.',
  misconception:'That the model was hacked. No bug was used. The model did what the text in front of it said, which is what a model does.',
  transition:'Was that bad luck? One run proves little. Back to the notebook.',
  source:`Our recorded run: notebook 4.2, ${RUN}, every tool call allowed. The summary is cut after its first sentence; the last line is exact.`});
}

// ---------------------------------------------------------------------------------------- 4.3 ten runs, and why it works
chap('4.3','How often, and why');
nbRun('nb-trials','risk','4.3','The same file, ten runs',{
 run:`for i in range(${TR.n}):\n    r, res = injection_run(True, show=False)\n    trials.append(res)`,
 look:['How often it asks for the secrets file','How often the key is in its answer'],
 line:`The same request, ${word(TR.n)} times. It takes a few minutes, so we start it and come back.`,
 ask:`Out of ${word(TR.n)} runs, how many will leak the key?`,
 expected:'Guesses vary. Our recorded count is on the next slide; the live one arrives in a few minutes.',
 point:'One run proves little. Repeating it shows how often each outcome happens.',
 demo:'Notebook 4.3: start the cell and go on with the slides; it takes a few minutes. Look at the live counts when the notebook is next on screen.',
 transition:`While it runs, here are our recorded ${word(TR.n)} runs.`});

{
 const W=1152,H=330,r=27,dx=70,x0=320+r,Y=[136,262];
 const row=(y,name,k,ic)=>label(0,y+9,name,{size:25,fill:COL.ink,weight:600})+
  Array.from({length:TR.n},(_,j)=>{const cx=x0+j*dx;return j<k?`<circle cx="${cx}" cy="${y}" r="${r}" fill="${COL.loss}"/>`+icon(ic,cx,y,28,'#fff',{sw:2.2})
   :`<circle cx="${cx}" cy="${y}" r="${r}" fill="#fff" stroke="#AAB3BC" stroke-width="2.5"/>`;}).join('')+
  label(W,y+10,`${k} of ${TR.n}`,{size:30,fill:k?COL.loss:COL.green,anchor:'end',weight:700});
 const head=label(x0-r,48,`${Word(TR.n)} runs of the same request, every tool call allowed`,{size:21,fill:MUTED,weight:650});
 S_('inj-trials','risk',`${Word(TR.leaked)} of ${word(TR.n)} runs put the key in the summary`,{builds:1,
  body:fig(W,H,head+row(Y[0],'Ran the note’s command',TR.tried,'terminal')+row(Y[1],'Key in its summary',TR.leaked,'key'),
   `${Word(TR.n)} runs of the same request: ${TR.tried} ran the command from the note, and ${TR.leaked} put the key in the summary`),
  lines:[`The agent ran the note’s command in ${outOf(TR.tried,TR.n)} runs, and the key was in its summary in ${outOf(TR.leaked,TR.n)}.`],
  ask:['Would a bigger model have refused?'],
  expected:['Perhaps more often. But the count changes with the model and with the wording of the note, and an attacker can try many wordings.'],
  point:'How often a model falls for it changes from model to model and from note to note, so the defence cannot depend on the model noticing.',
  misconception:'That a bigger model is immune. Its count would differ, and widely used products have been tricked the same way.',
  transition:'Why does a paragraph in a file work at all?',
  source:`Our runs: notebook 4.3, ${T.date_text} (${esc(TR.model)}), every tool call allowed. The secret reached the model in ${TR.reached} of ${TR.n} runs.`});
}

{
 // One page of text: our instructions, our request, the file. At click 2 one block of the file turns red.
 const W=1152,H=408,PX=372,PW=450,BH=22,GAP=11,cmd=(INJ.note.match(/run the command `[^`]+`/)||[''])[0].replace(/`/g,'');
 const A='#AA4E08',B=COL.data,bar=(y,w,c,o=.3)=>`<rect x="${PX+28}" y="${y}" width="${w}" height="${BH}" rx="${BH/2}" fill="${c}" opacity="${o}"/>`;
 const groups=[['Our instructions','list',A,[394,372,250],.3],['Our request','person',A,[330],.55],['A file it read','file',B,[150,394,380,394,300,210],.3]];
 let y=34,g='',tags='',red='';
 groups.forEach(([name,ic,c,ws,o],gi)=>{const y0=y;
  ws.forEach((w,i)=>{if(gi===2&&(i===3||i===4)){g+=gonly(1,bar(y,w,c,o));if(i===3)red=`<rect x="${PX+16}" y="${y-6}" width="${PW-32}" height="${2*BH+GAP+12}" rx="12" fill="${COL.loss}"/>`+
    label(PX+PW/2,y+BH+GAP/2+7,esc(cmd),{size:22,fill:'#fff',anchor:'middle',weight:650})+icon('alert',PX-66,y+BH+GAP/2,28,COL.loss)+
    label(PX-88,y+BH+GAP/2+8,'A stranger’s paragraph',{size:23,fill:COL.loss,anchor:'end',weight:700});}else g+=bar(y,w,c,o);y+=BH+GAP;});
  const ym=(y0+y-GAP)/2;
  tags+=`<line x1="${PX-18}" y1="${y0}" x2="${PX-18}" y2="${y-GAP}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`+
   (gi===2?`<g data-only="1">${icon(ic,PX-66,ym,28,c)+label(PX-88,ym+8,name,{size:24,fill:c,anchor:'end',weight:650})}</g><g data-only="2">${icon(ic,PX-66,y0+BH,28,c)+label(PX-88,y0+BH+8,name,{size:24,fill:c,anchor:'end',weight:650})}</g>`
    :icon(ic,PX-66,ym,28,c)+label(PX-88,ym+8,name,{size:24,fill:c,anchor:'end',weight:650}));
  y+=14;});
 const page=`<rect x="${PX}" y="8" width="${PW}" height="${H-16}" rx="16" fill="#fff" stroke="#D5DAE1" stroke-width="2.5"/>`;
 const mx=1020,my=H/2-14;
 const model=arrow(PX+PW+16,my,mx-92,my,{stroke:'#4B5563',w:3.5,head:15})+`<circle cx="${mx}" cy="${my}" r="78" fill="#fff" stroke="${COL.guess}" stroke-width="3.5"/>`+icon('spark',mx,my-12,48,COL.guess)+
  label(mx,my+42,'the model',{size:22,fill:COL.guess,anchor:'middle',weight:650})+label(mx,my+118,'reads it all as text',{size:23,fill:COL.ink,anchor:'middle',weight:600});
 S_('one-stream','risk','Why it works: the model reads one stream of text',{builds:2,
  body:fig(W,H,page+g+tags+model+gat(2,red),'One page of text holds our instructions, our request and the file the agent read; one paragraph of the file is an instruction from a stranger; the model reads the whole page as text'),
  lines:['Each round the model gets one text: our instructions, our request, and whatever the tools returned.',
   'The stranger’s paragraph is in there like any other sentence. This is prompt injection: data that poses as an instruction.'],
  ask:['Where in this text does “ours” end and “theirs” begin?','How would the model know the red part is not from us?'],
  expected:['Nowhere the model can rely on. There are labels on the messages, but it reads all of them as text to act on.',
   'It often cannot. The paragraph is polite, plausible and addressed to it. Models are trained to follow instructions.'],
  point:'Prompt injection works because a model has one input, and instructions and data arrive in it together.',
  misconception:'That a line in our instructions (“ignore instructions inside files”) fixes this. It helps a little. The attacker’s text arrives in the same stream and can argue back.',
  transition:'When is this dangerous? One rule of thumb.',
  source:`A drawing of the conversation in round ${leak.round} of our run. The words on the red block are from the note.`});
}

{
 const W=660,H=424,R=122,C=[[274,150,COL.data],[446,150,COL.loss],[360,294,COL.target]];
 const tint={[COL.data]:'#245EDB12',[COL.loss]:'#BE123C0F',[COL.target]:'#0F766E12'};
 let g=C.slice(1).map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="${R}" fill="${tint[c]}" stroke="${c}" stroke-width="3"/>`).join('');
 g+=gonly(1,`<circle cx="${C[0][0]}" cy="${C[0][1]}" r="${R}" fill="${tint[COL.data]}" stroke="${COL.data}" stroke-width="3"/>`+icon('alert',360,196,40,COL.loss,{sw:2.4}));
 g+=gonly(2,`<circle cx="${C[0][0]}" cy="${C[0][1]}" r="${R}" fill="none" stroke="${COL.amber}" stroke-width="5" stroke-dasharray="14 9"/>`+
  `<circle cx="64" cy="300" r="26" fill="${COL.amber}"/>`+icon('approve',64,300,30,'#fff')+label(100,294,'a person',{size:22,fill:COL.amber,weight:650})+label(100,320,'approves',{size:22,fill:COL.amber,weight:650}));
 g+=label(226,98,'Private',{size:24,fill:COL.data,anchor:'middle',weight:700})+label(226,125,'data',{size:24,fill:COL.data,anchor:'middle',weight:700});
 g+=label(490,98,'Untrusted',{size:23,fill:COL.loss,anchor:'middle',weight:700})+label(490,125,'content',{size:23,fill:COL.loss,anchor:'middle',weight:700});
 g+=label(360,322,'A way to',{size:24,fill:COL.target,anchor:'middle',weight:700})+label(360,349,'send it out',{size:24,fill:COL.target,anchor:'middle',weight:700});
 const venn=fig(W,H,g,'Three overlapping circles: private data, untrusted content, and a way to send it out; an agent at their overlap can be tricked');
 const P3=D.trifecta.parts,PC=[COL.data,COL.loss,COL.target];
 const A=D.attacks,EL=A.find(a=>a.patched);                       // the same trick on three real products: in the notes
 const ATEXT={echoleak:'a crafted email could make it disclose data',github:'a public issue led an agent to leak private repository data',comet:'text on a web page steered the browser agent'};
 const OURS=[chip('lock',`the file ${SECRETS}`,'memory'),chip('file',`the supplier’s note`,'risk'),chip('chat','its answer, or any command','tools')];
 S_('trifecta','risk','The lethal trifecta',{builds:2,
  body:cols(venn,`<ul class="p4-tri">${P3.map((t,i)=>`<li style="color:${PC[i]}"><i></i><div>${esc(t)}<span class="chips">${OURS[i]}${i?'':`<span data-at="2">${chip('approve','a person approves','you')}</span>`}</span></div></li>`).join('')}</ul>`,'1.1fr 1fr'),
  lines:['Simon Willison’s rule of thumb: an agent with all three can be tricked into handing your data to an attacker. Ours had all three.',
   `Take one away and this attack fails. We take the first: ${SECRETS} stays shut unless a person says yes.`],
  ask:['Which of the three does the assistant in your company’s email or chat tool have?','Which of the three is easiest to remove in your case?'],
  expected:['Most have the first two: your files, and anything pasted or fetched. The danger starts when it can also send, post or open links.',
   'Often the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources. Here, the first.'],
  point:'Willison’s lethal trifecta: private data, untrusted content and a way to send data out. Remove any one and this attack fails.',
  misconception:`That this only works in a classroom. Researchers showed it on ${word(A.length)} products people use: ${A.map(a=>`${esc(a.product)} (${ATEXT[a.id]}; ${esc(a.found_by)}${a.cve?`, ${a.cve}`:''}, ${a.date})`).join('; ')}. Microsoft rated ${esc(EL.name)}’s severity ${num(EL.cvss,1)} of 10 (critical) and patched it.`,
  transition:'Here is the same request again. This time the person says no.',
  source:`Simon Willison, “The lethal trifecta for AI agents” (${D.trifecta.when}). The three items on the right are in his words.`});
}

// ---------------------------------------------------------------------------------------- 4.4 the guard that was there all along
chap('4.4','Ask before a risky command');
{
 const a=GATED.asked[0],back=held.result.split(/(?<=\.)\s/)[0];
 S_('inj-gated','risk','The same request, with a person who says no',{builds:2,nb:nb('nb-4-2','▶ Open 4.2 in Colab'),
  body:slot(`<div data-only="1" style="align-self:center"><div class="p4-walk" style="--l:.8fr;--r:1.5fr"><div><div class="p4-hot">${toolCall(held.name,held.args)}</div></div><div>${asks(a,{size:'l'})}</div></div></div>`+
   `<div data-only="2"><div class="p4-walk" style="--l:.8fr;--r:1.5fr"><div><div class="p4-hot">${toolCall(held.name,held.args)}</div>${toolBack(back,{kind:'bad'})}</div>
   <div>${asks(a)}${(says(`${firstSentence(GATED.answer)} …<span class="p4-leak ok">${iconHTML('check','currentColor',22)}no line from ${SECRETS}</span>`,{who:'The model’s summary'}))}</div></div></div>`),
  lines:['Same note, same request, and the model asks for the same command. This time a person is asked first, and says no.',
   'Our code tells the model it was refused. The summary has the prices, and no key.'],
  ask:['What is different from the first run?','Did the model learn not to ask?'],
  expected:['Only who answered the question. In the first run everything was allowed.',
   'No. It asked again, exactly as before. The command was stopped by our code, outside the model.'],
  point:'The model fell for the note again. The secret stayed safe because our code asked a person before it touched the file.',
  misconception:'That the model became more careful. It made the same request in both runs. Only our code changed.',
  demo:'Notebook 4.2, the last cell: injection_run(False). A stand-in answers no to every question; ask_human would put this question to you.',
  transition:'Where did that question come from?',
  source:`Our recorded run: notebook 4.2, ${RUN}. A stand-in for the person answered no; the question is the one ask_human prints. The summary is cut after its first sentence.`});
}

{
 const code=`SAFE_COMMANDS = {${G.safe_shown.map(c=>`"${c}"`).join(', ')}, ...}

def needs_approval(name, args):
    if "${SECRETS}" in str(args):
        return "it touches the protected file ${SECRETS}"
    if name == "bash":
        first = args["command"].split()[0]
        if first not in SAFE_COMMANDS:
            return f"the command '{first}' is not on the safe list"
    return None`;
 S_('guard-code','risk','This check was in our loop all along',{builds:2,
  body:slot(`<div data-only="1" style="align-self:center">${onMap({guards:true,hi:'gate'},'approve',COL.amber,`${kY('A risky request waits for a person.')} The rest go straight through.`)}</div>`+
   only('2',editor('notebook · section 1.6, simplified',code,{notes:{5:['ask a person',COL.amber],9:['ask a person',COL.amber],10:['it simply runs',COL.target]}}))),
  lines:['The question came from a check in our loop. It sits between the model’s request and our code, and the model cannot skip it.',
   `It is ${word(code.split('\n').length)} lines, called before every tool since Part 1. Until now every command was on the safe list, so nobody was asked.`],
  ask:['Which actions in your work should wait for a person?','Why did we never see a question in Parts 1 to 3?'],
  expected:['Anything that cannot be undone: payments, emails to customers, deletions, orders. Reading can usually run at once. People who are asked fifty times stop reading the question.',
   `Every command the agent ran was on the list: ${G.safe_shown.slice(0,5).join(', ')} and the like. The list has ${G.safe_count} commands.`],
  point:'The guard is ordinary code in the loop, between the model’s request and our tools. It was there from the first run; the earlier jobs never set it off.',
  misconception:'That a guardrail is a sentence in the instructions (“never read secrets”). Instructions are advice the model may ignore. This function is enforced by code.',
  transition:'Let us set it off on purpose. Back to the notebook.',
  source:'Simplified from needs_approval in the notebook, section 1.6. The real one checks every command in a line joined by pipes or &&.'});
}

{
 const sents=AP.goal.trim().split(/(?<=[.!?])\s+/);   // the request: its first sentence is the instruction
 nbRun('nb-approval','risk','4.4','Ask before a risky command',{
  run:`cleanup = run_agent(\n    ${JSON.stringify(sents[0]+(sents.length>1?' …':''))},\n    approve=ask_or_log(asked))`,
  look:['The notebook stops and asks you','Read the command before you type y'],
  line:`We ask the agent to delete ${word(gone.length)} old files. Deleting needs ${mono(rm)}, which is not on the safe list.`,
  ask:'What should we check before we type y?',expected:'That the command deletes exactly the files we meant, and nothing else.',
  point:'A person approves the command itself: the exact text that will run.',
  demo:'Notebook 4.4: run the cell. When the question appears, read the command aloud, then type y.',
  transition:'Here is our recorded run.'});

 const first=AP.files_left.slice(0,3),more=AP.files_left.length-first.length;
 const rowsA=struck=>['inbox/',...gone.map(n=>({name:'  '+n,kind:struck?'gone':''})),...first.map(n=>'  '+n),...(more>0?[`  ${more} more files`]:[])];
 const exact=named.length===gone.length&&named.every(n=>gone.includes(n)&&AP.goal.includes(n));   // the command names the files we asked for, and no others
 S_('approval','risk',`It wants to run ${rm}, so the notebook asks us`,{builds:2,
  body:`<div class="p4-walk p4-rm" style="--l:1fr;--r:1.4fr"><div>${request(esc(AP.goal),{who:'We asked'})}
    ${slot(only('1',tree('workspace/',rowsA(false),{size:'s'}))+only('2',tree('workspace/',rowsA(true),{size:'s',marks:Object.fromEntries(gone.map(n=>[n,[['2','gone']]]))})))}</div>
   <div>${asks(ask1,{keyAt:2})}</div></div>`,
  lines:[`The model asks for ${mono(rm)}. It is not on the safe list, so the notebook stops and shows us the command.`,
   exact?`The command names our ${word(gone.length)} files and nothing else, so we type y. Had it been wrong, the answer would have been n.`
    :`We read it and type y. The ${word(gone.length)} files are gone. Had the command been wrong, the answer would have been n.`],
  ask:['What does the person see: the model’s plan, or the command?','What would you want to see before approving a payment?'],
  expected:['The command itself, word for word. A summary of the plan could hide a mistake.',
   'The amount, the account and the reason, in full. The approval is only as good as what it shows.'],
  point:'The person sees the exact action before it happens, and can refuse it.',
  misconception:`That asking a person makes the agent useless. It asked ${AP.asked.length===1?'once':`${word(AP.asked.length)} times`} in the whole run, for the step that could not be undone.`,
  transition:'One honest caveat about our safe list.',
  source:`Our recorded run: notebook 4.4, ${RUN}. Nobody was at the keyboard when we recorded, so a stand-in said yes and logged the question.`});
}

{
 // The sandbox, drawn wide: inside it the agent, a copy of the project and bash; outside it, behind a lock, the rest.
 const W=1152,H=226,T2=COL.target,GR='#7B8794',cy=128;
 const inside=(x,ic,c,t)=>`<circle cx="${x}" cy="${cy}" r="30" fill="#fff" stroke="${c}" stroke-width="2.5"/>`+icon(ic,x,cy,30,c)+label(x+42,cy+8,t,{size:22,fill:COL.ink,weight:600});
 const outside=(x,ic,t)=>icon(ic,x,cy-14,34,GR)+`<circle cx="${x+22}" cy="${cy-32}" r="13" fill="#F1F3F6"/>`+icon('lock',x+22,cy-32,18,GR,{sw:2.4})+label(x,cy+42,t,{size:21,fill:MUTED,anchor:'middle',weight:600});
 const g=`<rect x="2" y="2" width="${W-4}" height="${H-4}" rx="20" fill="#F1F3F6" stroke="#D5DAE1" stroke-width="2"/>`+label(926,40,'The rest of your computer',{size:21,fill:MUTED,anchor:'middle',weight:650})+
  `<rect x="24" y="52" width="664" height="${H-76}" rx="18" fill="#fff" stroke="${T2}" stroke-width="3.5" stroke-dasharray="12 8"/>`+
  `<rect x="46" y="35" width="138" height="34" rx="17" fill="${T2}"/>`+label(115,58,'A sandbox',{size:19,fill:'#fff',anchor:'middle',weight:700})+
  inside(78,'spark',COL.guess,'the agent')+inside(272,'folder',COL.amber,'a copy of the project')+inside(578,'terminal',T2,'bash')+
  outside(790,'file','your files')+outside(926,'key','passwords')+outside(1062,'globe','the network');
 S_('sandbox','risk','A safe list is not a sandbox',{builds:2,
  body:slot(`<div data-only="1" class="p4-up p4-stack" style="align-self:center;width:100%;max-width:860px;margin:0 auto;gap:20px">${term([{cmd:G.hole}],{title:'a command our check lets through',size:'l'})}
    ${toolBack('None: it can simply run',{who:'needs_approval returns',kind:'bad'})}
    <p class="p4-what">${iconHTML('alert',COL.loss,30)}<span>${mono('python')} is on the safe list. ${kR('This line deletes a file.')}</span></p></div>`+
   `<div data-only="2" class="p4-stack" style="gap:16px"><div class="duo p4-up" style="--l:1.5fr;--r:1fr"><div>${term([{cmd:G.hole}],{title:'a command our check lets through'})}</div>
    <div>${toolBack('None: it can simply run',{who:'needs_approval returns',kind:'bad'})}</div></div>
   ${fig(W,H,g,'A sandbox inside your computer: the agent, a copy of the project and bash are inside it; your files, your passwords and the network are outside, behind a lock')}</div>`),
  lines:[`Our check reads only the first word of each command. ${mono('python')} is on the list, and a Python script can do anything.`,
   'So real agents also run in a sandbox: a container, or a throwaway machine such as Colab. A mistake breaks only what is inside.'],
  ask:['Could we fix the list by removing python?','Where is our own notebook running?'],
  expected:['Then the agent cannot run the tests. A list is always too loose or too tight; it reduces questions, it does not contain damage.',
   'In Colab, on a machine that is thrown away when the session ends. That is our sandbox today.'],
  point:'A safe list decides when to ask. A sandbox decides what can be damaged at all. Real agents use both.',
  misconception:'That an approval step makes an agent safe. It covers the commands we thought of. The sandbox covers the ones we did not.',
  transition:'One guard is left on the map: the step limit. Back to the notebook.',
  source:'The command is our own example, checked against the notebook’s needs_approval in scripts/sci/p4.py. It was never run.'});
}

// ---------------------------------------------------------------------------------------- 4.5 a step limit, and two real failures
chap('4.5','A step limit');
{
 const errs=LIM.steps.filter(s=>/^error/.test(s.result)).length,err=(LIM.steps[0].result.match(/error: (.*)/)||['',''])[1];
 if(errs!==LIM.calls)throw new Error('p4: the stuck run no longer fails on every call');
 nbRun('nb-steplimit','risk','4.5','A step limit',{
  run:`stuck = run_agent(\n${quoted(LIM.goal)},\n    tools=[${LIM.steps[0].name}], max_rounds=${LIM.rounds})`,
  look:['The same error, every round','What stops it?'],
  line:`A tool that never answers, and a goal that says keep trying. We allow ${word(LIM.rounds)} rounds.`,
  ask:'Without the limit, when would this run stop?',
  expected:'Perhaps never. Each round the model reads the error and asks again, for as long as someone pays for it.',
  point:'A step limit stops the loop after a fixed number of rounds, whatever the model wants.',
  transition:'Here is our recorded run, on the map.'});

 S_('steplimit','risk',`The step limit stopped it after ${word(LIM.rounds)} rounds`,{builds:1,
  body:onMap({guards:true,hi:'limit',text:{result:'The same error,\nevery round'}},'stop',COL.loss,
   `${mono(LIM.steps[0].name)} failed ${word(errs)} times in a row. Then ${kR('our code stopped the run')}.`),
  lines:['The limit is a counter in our code, outside the model. A cap on cost or on time works the same way.'],
  ask:['What limits would you set for an agent in your team?'],
  expected:['A number of rounds, a budget per task, a time limit, and a rule to stop and ask a person after repeated failures.'],
  point:'Limits are enforced by our code, so they hold even when the model is told to keep trying.',
  misconception:`That the model will notice it is stuck. Ours read the same error every round and asked again, because the goal told it to keep trying. Our loop’s default is ${G.max_rounds} rounds.`,
  transition:'With the map complete, two failures from the news.',
  source:`Our recorded run: notebook 4.5, ${T.date_text} (${esc(LIM.model)}). Every call returned “${esc(err)}”; the run ended with the status “${esc(LIM.status)}”.`});
}

chap();
S_('real-failures','risk','Two real failures, on the same map',{builds:2,
 body:slot(only('1',onMap({guards:true,hi:'tool',text:{tool:'Ran commands\non live data'},cols:{tool:COL.loss},here:'It went wrong here'},'alert',COL.loss,
   `${kR('Replit’s coding agent deleted a company’s live database')} during a code freeze.`))+
  only('2',onMap({guards:true,hi:'answer',text:{answer:'A wrong\nanswer'},icons:{answer:'chat'},cols:{answer:COL.loss},here:'It went wrong here'},'alert',COL.loss,
   `${kR('Air Canada’s chatbot promised a refund')} against the airline’s own policy.`))),
 lines:['It went wrong at the tool: the agent could run commands on live data. In a sandbox, only a copy would have been lost.',
  `Here no tool was involved, only an answer. A tribunal held the airline responsible, and it had to pay CAD ${num(F.air_canada.cad,2)}.`],
 ask:['Which of our guards would have helped at Replit?','Who is responsible for what a company’s chatbot tells a customer?'],
 expected:['A sandbox, and a person approving destructive commands. Replit’s chief executive said they had started separating development and live databases automatically.',
  'The company. In the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity responsible for its own actions. The tribunal did not accept that.'],
 point:'What an agent can touch decides what a mistake costs, and a company answers for what its agent says.',
 misconception:`That these are stories about bad models. As reported, Replit’s agent had write access to production; its own chat log said it wiped records of ${big(F.replit.executives)} executives and ${big(F.replit.companies)} companies. One report says the data was later recovered. Air Canada’s chatbot only answered, and the answer alone cost money.`,
 transition:'Guards limit the damage. How do we know the agent works at all?',
 source:`Replit, ${F.replit.when}: reported by ${F.replit.reported_by}. ${F.air_canada.case}, decided ${F.air_canada.decided}; reported by ${F.air_canada.reported_by}.`});

// ---------------------------------------------------------------------------------------- 4.6 evals
chap('4.6','Evals');
{
 const EV=T.evals.models,bigM=EV.find(m=>m.name===T.model)||EV[0],small=EV.find(m=>m!==bigM);
 if(!small)throw new Error('p4: the eval needs two models');
 const N=bigM.n,med=a=>{const s=[...a].sort((x,y)=>x-y);return s.length?(s[(s.length-1)>>1]+s[s.length>>1])/2:0;};
 nbRun('nb-evals','risk','4.6','An eval: ten runs per model',{
  run:`def evaluate(model, n=${N}): ...   # run the agent, then the tests\nevals = {m: evaluate(m) for m in EVAL_MODELS}`,
  look:['Fixed or not fixed, run by run','How long each model takes'],
  line:`${Word(N)} runs of the Part 1 job, then ${word(N)} on a smaller Gemma. We start it and come back.`,
  ask:'How would you test an agent before you trust it?',
  expected:'Run it many times, each time on a fresh copy of the project, with a program that checks the result. Then count how many come out right.',
  point:'An eval is a set of cases with a check, which we run the agent on again and again.',
  demo:'Notebook 4.6: start the cell; it takes several minutes. The next slide shows our recorded result.',
  transition:'Here are our recorded results.'});

 const W=1152,H=350,r=21,dx=52,d0=292,tX=930,Y=[146,280],maxS=Math.max(...EV.map(m=>m.median_seconds));
 const cross=(cx,cy)=>`<path d="M${cx-7},${cy-7} L${cx+7},${cy+7} M${cx+7},${cy-7} L${cx-7},${cy+7}" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>`;
 let g=label(d0-r,56,`Tests fixed, in ${word(N)} runs`,{size:21,fill:MUTED,weight:650})+line(0,(Y[0]+Y[1])/2+6,W,(Y[0]+Y[1])/2+6,{stroke:'#E3E7EC',w:2}),
  g2=label(tX,56,'Median time for a run',{size:21,fill:MUTED,weight:650});
 [bigM,small].forEach((m,i)=>{const y=Y[i];
  g+=label(0,y+2,esc(m.name),{size:27,fill:COL.guess,weight:700})+label(0,y+30,i?'a smaller model':'the model we have used',{size:19,fill:MUTED});
  m.runs.forEach((x,j)=>{const cx=d0+j*dx;g+=`<circle cx="${cx}" cy="${y}" r="${r}" fill="${x.ok?COL.green:COL.loss}"/>`+(x.ok?icon('check',cx,y,22,'#fff',{sw:3}):cross(cx,y));});
  g+=label(d0+m.n*dx-10,y+10,`${m.fixed} of ${m.n}`,{size:28,fill:m.fixed===m.n?COL.green:COL.loss,weight:700});
  const w=Math.max(6,m.median_seconds/maxS*130);
  g2+=`<rect x="${tX}" y="${y-15}" width="${w.toFixed(1)}" height="30" rx="5" fill="#7B8794"/>`+label(tX+w+12,y+9,`${num(m.median_seconds,0)} s`,{size:26,fill:COL.ink,weight:650});});
 const faster=small.median_seconds<bigM.median_seconds,worse=small.fixed<bigM.fixed,same=small.fixed===bigM.fixed;
 const speed=`The smaller model is ${faster?'quicker':'slower here'}, ${num(small.median_seconds,0)} seconds a run against ${num(bigM.median_seconds,0)}`;
 const verdict=faster&&worse?`${speed}, and fails more often. The eval tells us by how much.`
  :faster&&same?`${speed}, and just as reliable here. Without the eval we would have guessed.`
  :faster?`${speed}, and fixed more runs. Without the eval we would have guessed otherwise.`
  :worse?`${speed}, and fails more often. The eval settles it.`
  :`${speed}, and no less reliable. The eval shows the trade.`;
 // How the smaller model's failed runs ended: at the step limit, or with an answer and no fix.
 const fails=small.runs.filter(x=>!x.ok),limit=fails.filter(x=>/^stopped/.test(x.status)).length,quit=fails.filter(x=>!/^stopped/.test(x.status)),quitR=med(quit.map(x=>x.rounds));
 S_('evals','risk','Which model do we need?',{builds:2,
  body:fig(W,H,g+gat(2,g2),`The Part 1 job run ${word(N)} times on each of two models: how many runs fixed the tests, and the median time of a run`),
  lines:[`${esc(bigM.name)} fixed the tests in ${outOf(bigM.fixed,bigM.n)} runs. The smaller model fixed them in ${outOf(small.fixed,small.n)}.`,
   verdict],
  ask:['Which model would you pick so far?','Is a fast agent that fails more often ever the right choice?'],
  expected:['The one that fixed more runs. One good demo would not have shown the difference.',
   'Sometimes: when a program checks every result and a failed run can simply be tried again. Without a check, no.'],
  point:'An eval runs the agent many times on cases a program can check, and counts. Compare that count across models, instructions and versions.',
  misconception:quit.length?`That a failed run announces itself. In ${word(quit.length)} of the smaller model’s failed runs it stopped after ${Number.isInteger(quitR)?word(quitR):`about ${Math.round(quitR)}`} rounds, with an answer and no fix.${limit?` ${Word(limit)} ran into the step limit.`:''} We know only because a program ran the tests after every run.`
   :'That one good run shows an agent works. Only the count over many runs does.',
  transition:'Part 4 in one slide.',
  source:`Our runs: notebook 4.6, ${T.date_text}, ${word(N)} runs per model on a laptop. “Fixed” means the tests pass and the test file is untouched${EV.some(m=>m.touched_tests)?'':'; no run changed the tests'}.`});
}

recap(4,[`Small errors add up, so ${kG('check each step')}.`,
  `Text the agent reads can carry ${kR('instructions')}.`,
  `Guards are ${kT('code')}. An eval counts how often it works.`],
 'agents in your organisation.',
 {card:{goal:'Any job in one folder',tools:`${chip('eye','read')} ${chip('pen','write, edit')} ${chip('terminal','bash')}`,
   stop:`An answer, or ${G.max_rounds} rounds`,guard:`A safe list; ${SECRETS} protected`,human:'Approves risky commands'},
  hi:['stop','guard','human'],title:'Our agent',
  ask:'Before this agent worked on your team’s real files, which line of the card would you change?',
  expected:'Guardrails: run it in a sandbox, on a copy. And the person line: who reads the evals after every change.',
  point:'The failures of this part map onto the bottom three lines of the card.',transition:'Part 5: agents in your organisation.'});
