// Part 2: inside the engine. The opening run replayed turn by turn with its tokens and cost, the loop as a few lines
// of Python, the tool menu, the context, memory, the five patterns and MCP (a live figure). Real runs: data/traces.json
// (notebook Parts 1 to 3); everything else, and the numbers derived from the runs: data/p2.json (scripts/sci/p2.py).
import {S_,ps,small,cols,at,only,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,
 fig,label,line,arrow,gat,gonly,COL,MUTED,icon,iconHTML,chip,loopFig,msg,
 widget,register,slider,num,big,nb,partBreak,recap,chap,highlight} from '../kit.js';

const T=need(await data('traces'),'agent','model','date_text','price','inr_per_usd'),A=T.agent;
const D=need(await data('p2'),'tool','vague','walk','context','memory','patterns','routing','multi','farm','mcp','loop');
const W2=D.walk,WT=W2.turns,PR=T.price['gemini-3.8-flash'];

const BLUE=COL.data;
css(`.p2-walk{display:grid;grid-template-columns:minmax(0,1.42fr) minmax(0,1fr);gap:30px;align-items:start}
.p2-ev{display:flex;flex-direction:column;gap:8px;min-width:0;padding-top:46px}
.p2-row{display:grid;grid-template-columns:78px minmax(0,1fr);gap:10px;align-items:baseline;border-left:5px solid var(--line);padding:6px 12px;border-radius:0 10px 10px 0;font-size:20px;line-height:1.35}
.p2-row .tag{font-size:13px;letter-spacing:.8px;text-transform:uppercase;font-weight:700;white-space:nowrap}
.p2-row.you{border-color:var(--noise)}.p2-row.you .tag{color:var(--noise)}
.p2-row.model{border-color:var(--q)}.p2-row.model .tag{color:var(--q)}
.p2-row.tool{border-color:var(--p)}.p2-row.tool .tag{color:var(--p)}
.p2-row .full{display:none;min-width:0}.p2-row .brief{color:var(--muted)}
.p2-row .th{display:block;font-style:italic;color:#4B5563;margin-bottom:4px}
.p2-row .lbl{color:var(--muted);margin-right:6px}
.p2-row .chips{display:inline-flex}
.p2-fc{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2px 14px;font-variant-numeric:tabular-nums}
.p2-fc b{display:block;font-size:15px;color:var(--p);letter-spacing:.4px}
.p2-sums{display:grid;grid-template-columns:repeat(4,auto);justify-content:start;gap:2px 16px;font:16px/1.4 "SFMono-Regular",Menlo,Consolas,monospace}
.p2-tot{font-variant-numeric:tabular-nums;word-spacing:10px}
.p2-unit{display:block;font-size:15px;color:var(--muted);margin-top:2px}
${[1,2,3,4,5,6].map(k=>`.scene[data-build="${k}"] .p2-row[data-k="${k}"] .full{display:block}.scene[data-build="${k}"] .p2-row[data-k="${k}"] .brief{display:none}.scene[data-build="${k}"] .p2-row[data-k="${k}"]{background:#14171F09}`).join('')}
.p2-code .code{font-size:20px;line-height:1.55;padding:14px 18px}
.p2-tag{display:inline-block;font:650 15px/1.25 var(--font);padding:1px 10px;border-radius:999px;color:#fff;vertical-align:1px}
.p2-tag.agent{background:var(--q)}.p2-tag.tools{background:var(--p)}.p2-tag.done{background:var(--d)}.p2-tag.risk{background:var(--loss)}
.p2-menu{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:30px;align-items:start}
.p2-menu h3{font-size:22px;margin:0 0 8px;display:flex;gap:8px;align-items:center}
.p2-menu pre.json{font-size:18px;line-height:1.5;border:2px solid #0F766E55;background:#fff;border-radius:12px;padding:10px 14px}
.p2-menu .p2-hl{background:#AA4E0817;border-radius:4px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.p2-menu pre.bad{border-color:#BE123C66}
.p2-keys{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px;font-size:22px;line-height:1.35}
.p2-keys code{font:600 19px "SFMono-Regular",Menlo,Consolas,monospace;color:var(--p);display:block;margin-bottom:2px}
.p2-keys li.p2-d code{color:var(--noise)}
.p2-guess{list-style:none;margin:10px 0 8px;padding:0;display:flex;flex-direction:column;gap:6px;font-size:21px;line-height:1.3}
.p2-guess li{display:flex;gap:8px;align-items:flex-start}.p2-guess li>svg{flex:none;margin-top:2px}
.p2-so{font-size:22px;line-height:1.35}
.p2-tips{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.p2-tips>div{border:2px solid var(--line);border-top-width:6px;border-radius:12px;background:#fff;padding:8px 12px;font-size:19px;line-height:1.3;min-width:0}
.p2-tips b{display:block;font-size:14px;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);margin-bottom:3px}
.p2-mem{display:grid;grid-template-columns:minmax(0,1fr) 40px minmax(0,.9fr) 40px minmax(0,1.55fr);gap:6px;align-items:center}
.p2-mem>div{display:flex;flex-direction:column;gap:8px;min-width:0}
.p2-mem .h{font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--muted)}
.p2-mem .msg{font-size:19px}
.p2-note{border:2px solid #245EDB66;background:#245EDB0A;border-radius:12px;padding:8px 14px;font-size:20px;line-height:1.38}
.p2-note b{display:flex;gap:6px;align-items:center;font:600 15px "SFMono-Regular",Menlo,Consolas,monospace;color:var(--data);margin-bottom:4px}
.p2-kB{color:var(--data);font-weight:650}
.p2-pat{display:flex;flex-direction:column;gap:12px}
.p2-pat>div>div{display:grid;grid-template-columns:230px minmax(0,1fr);gap:22px;align-items:center;border-top:2px solid var(--line);padding-top:8px}
.p2-pat h3{font-size:23px;color:var(--q);margin:0 0 2px}.p2-pat p{font-size:19px;line-height:1.3;color:#374151}
.p2-pat small{display:inline-block;margin-top:5px;font-size:13px;letter-spacing:.8px;text-transform:uppercase;font-weight:700;color:var(--d)}
.p2-pat small.dz{color:var(--muted)}
.p2-two h3{font-size:25px;color:var(--q);margin-bottom:4px}
.p2-two p{font-size:20px;line-height:1.38}
.p2-guj{font-size:21px;line-height:1.45;color:#374151;margin:10px 0 6px}
.p2-check{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;font-size:18px;line-height:1.3}
.p2-check li{display:flex;gap:6px;align-items:center}.p2-check li>svg{flex:none}
.p2-facts{display:grid;grid-template-columns:1.2fr 1fr 1.4fr;gap:18px}
.p2-facts>div{border-left:5px solid var(--p);padding:2px 0 2px 14px;font-size:19px;line-height:1.35;min-width:0}
.p2-facts b{display:block;font-size:14px;letter-spacing:.8px;text-transform:uppercase;color:var(--p);margin-bottom:2px}
@media(max-width:760px){.reading .p2-walk,.reading .p2-menu,.reading .p2-mem,.reading .p2-tips,.reading .p2-facts,.reading .p2-check{grid-template-columns:minmax(0,1fr)}
 .reading .p2-pat>div>div{grid-template-columns:minmax(0,1fr)}.reading .p2-mem>svg{transform:rotate(90deg);margin:0 auto}}`);

partBreak(2,'Inside the engine','Open the bonnet on one real run: what the model reads each turn, how it picks a tool, how it remembers, and the few patterns most systems are built from.',
 ['One real run, turn by turn, with its cost','What the model reads: the tool menu and the context','Memory that outlasts a run',`${Word(D.patterns.names.length)} patterns, and a common plug for tools`],
 {img:'part-engine.jpg',alt:'Illustration: an engine in cutaway, three gears turning in a loop, with tool icons around it',nb:nb('part-2'),
  line:'By the end of this part you can read a trace and say what the model saw, and paid for, at each step.',
  ask:'When an agent “thinks”, what do you imagine is going on inside?',
  expected:'Answers vary: it plans, it searches, it reasons. Keep them; the next slides show that each step is the model reading a growing text and writing a short reply.',
  transition:'Start with the run from the opening, one event at a time.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 2.1 one real run
chap('2.1','One real run');
{
 const fc=W2.forecast,sums=W2.sums,cities=Object.keys(fc),[t1,t2,t3]=WT;
 const row=(k,kind,tag,full,brief)=>at(k,`<div class="p2-row ${kind}" data-k="${k}"><span class="tag">${tag}</span><div><div class="full">${full}</div>${brief?`<div class="brief">${brief}</div>`:''}</div></div>`);
 const ev=`<div class="p2-ev">
  ${row(1,'you','You',esc(W2.request),'the request')}
  ${row(2,'model','Turn 1',`<span class="th">thinks “${esc(t1.thought)}”</span><span class="lbl">asks for</span><span class="chips">${t1.calls.map(c=>chip('sensor',esc(c.city))).join('')}</span>`,`${word(t1.calls.length)} forecasts, at once`)}
  ${row(3,'tool','Tools',`<div class="p2-fc">${cities.map(c=>`<span><b>${esc(c)}</b>${fc[c].map(v=>num(v,1)).join(' ')}</span>`).join('')}</div><span class="p2-unit">PM2.5 in µg/m³, the next ${word(fc[cities[0]].length)} days</span>`,`${word(cities.length)} forecasts back`)}
  ${row(4,'model','Turn 2',`<span class="th">thinks “${esc(t2.thought)}”</span><div class="p2-sums">${sums.slice(0,3).map(s=>`<span>${esc(s)}</span>`).join('')}<span>…</span></div>`,`${word(sums.length)} sums, at once`)}
  ${row(5,'tool','Tools',`<span class="p2-tot">${W2.totals.map(v=>num(v,1)).join(' ')}</span>`,`${word(W2.totals.length)} totals back`)}
  ${row(6,'model','Turn 3',esc(W2.answer),'')}</div>`;
 // the meter: tokens read (again or new) and written per turn, and the running totals
 const W=470,H=410,x0=82,bw=W-x0-70,sc=v=>v/W2.max_read*bw,bh=24;
 let g='';
 [[BLUE,.4,'read again'],[BLUE,1,'new to read'],[COL.guess,1,'written']].forEach(([c,o,t],i)=>{const x=[0,150,306][i];
  g+=`<rect x="${x}" y="6" width="18" height="18" rx="3" fill="${c}" opacity="${o}"/>`+label(x+26,22,t,{size:18});});
 WT.forEach((t,i)=>{const y=58+i*96,prev=i?WT[i-1].read:0;let b='';
  if(prev)b+=`<rect x="${x0}" y="${y}" width="${sc(prev).toFixed(1)}" height="${bh}" rx="3" fill="${BLUE}" opacity=".4"/>`;
  b+=`<rect x="${(x0+sc(prev)).toFixed(1)}" y="${y}" width="${sc(t.read-prev).toFixed(1)}" height="${bh}" rx="3" fill="${BLUE}"/>`+label(x0+sc(t.read)+8,y+19,big(t.read),{size:18,fill:COL.ink,weight:600});
  b+=`<rect x="${x0}" y="${y+bh+6}" width="${sc(t.wrote).toFixed(1)}" height="${bh}" rx="3" fill="${COL.guess}"/>`+label(x0+sc(t.wrote)+8,y+2*bh+1,big(t.wrote),{size:18,fill:COL.ink,weight:600});
  g+=label(0,y+34,`Turn ${i+1}`,{size:20,fill:COL.guess,weight:650})+gat(2*i+2,b);});
 g+=line(0,334,W,334,{stroke:'#E5E7EB',w:1.5});
 const tot=(k,read,inr,s)=>gonly(k,[[0,big(read),'tokens read'],[172,`₹${num(inr,2)}`,'cost so far'],[328,`${num(s,1)} s`,'model time']].map(([x,v,c])=>
  label(x,372,v,{size:30,fill:COL.ink,weight:700})+label(x,396,c,{size:17})).join(''));
 let sumRead=0;const cum=WT.map(t=>sumRead+=t.read);
 g+=tot('1',0,0,0)+tot('2-3',cum[0],t1.spent_inr,t1.elapsed)+tot('4-5',cum[1],t2.spent_inr,t2.elapsed)+tot('6',cum[2],t3.spent_inr,t3.elapsed);
 S_('trace-walk','engine','One run, one event at a time',{builds:6,nb:nb('part-2'),
  body:`<div class="p2-walk">${ev}${fig(W,H,g,'Tokens read and written in each turn of the run, with the running count of tokens, cost and seconds')}</div>`,
  lines:['The request from the opening, replayed one event per click. On the right, what each turn read and wrote, and what it cost.',
   `Turn 1: a short thought, then ${word(t1.calls.length)} forecast requests in one go, since none depends on another. It read ${big(t1.read)} tokens to decide that.`,
   `Our code fetches the ${word(cities.length)} forecasts. The model is idle meanwhile; it sees the numbers only when we call it again.`,
   `Turn 2 rereads everything, now ${big(t2.read)} tokens, and asks for ${word(sums.length)} sums at once, one per order.`,
   `${Word(W2.totals.length)} totals come back from the calculator. The model did not add up a single number itself.`,
   `Turn 3 reads ${big(t3.read)} tokens and answers: ${num(t3.elapsed,1)} seconds and ₹${num(t3.spent_inr,2)} in all. The pale blue is text it had already read the turn before.`],
  ask:['What do you expect the model to do first?',`Why ask for all ${word(t1.calls.length)} forecasts at once, instead of one at a time?`,'While the forecasts are fetched, what is the model doing?',
   'Why did turn 2 read far more than turn 1?','Why not let the model add the numbers itself?','Where did most of the cost go: reading or writing?'],
  expected:['Look up the forecasts. It cannot know them.','They do not depend on each other, so one turn is enough. Fewer turns means less rereading, less time and less money. Our instructions also told it to.',
   'Nothing. The model is not running; it is a function we call. Between calls, only our code runs.',
   `It rereads the instructions, the tool menu, the task, its own first turn and the ${word(cities.length)} results. Every turn starts from the full conversation.`,
   'Models predict digits and slip on long sums. A calculator is exact and cheap, so the agent hands arithmetic to a tool.',
   `Here, writing: ${big(A.usage.output)} tokens written cost ${num(A.usage.output*PR.output/(A.usage.input*PR.input),1)} times the ${big(A.usage.input)} read, since a written token costs ${word(PR.output/PR.input)} times as much. In long runs reading takes over, because it is repeated every turn.`],
  point:'An agent run is a few model calls, each rereading the whole conversation, with tools run by our code in between.',
  misconception:'That the model keeps running and “remembers” between turns. It is called afresh each turn and reads everything again.',
  demo:'Notebook 2.1: print each turn’s tokens read and written for your own run.',
  transition:'That replay is driven by a few lines of ordinary code. Here they are, once.',
  source:`Real run, ${T.date_text}, ${esc(T.model)} (notebook Part 1.3). Paid prices: $${PR.input} in, $${PR.output} out per million tokens, thinking counted as output; ₹${T.inr_per_usd} per dollar.`});
}

// ---------------------------------------------------------------------------------------- the loop as code
{
 const MS=D.loop.max_steps,PAD=40;
 const tag=(t,role)=>`<span class="p2-tag ${role}">${t}</span>`;
 const L=[[1,'def run_agent(goal, tools, max_steps='+MS+'):'],[1,'    messages = [goal]'],[1,'    for step in range(max_steps):'],
  [1,'        reply = chat(messages, tools)',tag('think','agent')],[1,'        messages.append(reply)'],
  [3,'        if not reply.calls:',tag('answer','done')],[3,'            return reply.text'],
  [2,'        for call in reply.calls:'],[2,'            result = run_tool(call)',tag('act','tools')],[2,'            messages.append(result)',tag('observe','tools')],
  [3,'    return "stopped: step limit"',tag('limit','risk')]];
 const codeSteps=`<div class="code-steps p2-code"><pre class="code"><code>${L.map(([b,t,tg])=>`<span class="cl" data-at="${b}">${highlight(tg?t.padEnd(PAD):t)}${tg||''}</span>`).join('')}</code></pre></div>`;
 S_('loop-code','engine',`The whole engine, in ${word(L.length)} lines`,{builds:3,nb:nb('part-1'),
  body:cols(codeSteps,loopFig({W:620,H:470,at:{act:2,tools:2,observe:2,loop:2,stop:3},tools:['sensor','code']}),'1.3fr 1fr'),
  lines:['This is the loop, simplified from the notebook. Keep a list of messages; each step, hand the whole list to the model and add its reply.',
   'Act and observe: run every tool it asked for and add each result to the list. A tool that fails returns its error as a result.',
   'Stop when a reply asks for nothing more, or at the step limit. Frameworks wrap these same lines with retries, logging and permissions.'],
  ask:['Which line is the model, and which lines are ordinary code?','Why send an error back to the model instead of crashing?','What would happen with no step limit?'],
  expected:['Only chat() calls the model. Everything else is plain Python that we wrote and can read.',
   'The model can read the error and try something else: another city spelling, another tool. Crashing would end the run.',
   'A model that keeps asking for tools would loop for ever and spend money doing it. The step limit is the first guardrail (Part 4).'],
  point:'An agent is an ordinary loop around one model call. The intelligence is in the model; the control is in your code.',
  misconception:'That agent frameworks contain some deeper machinery. They wrap this loop with conveniences: retries, tracing, memory, permissions.',
  demo:'Notebook 1.3: run_agent is this loop with printing, an approval check, and error handling.',
  transition:'Each step, the model chose a tool from a menu. What exactly is on that menu?',
  source:'Simplified from run_agent in notebook/agents.py (Part 1.3). The real one also asks a person before any tool marked for approval.'});
}

// ---------------------------------------------------------------------------------------- the tool menu
{
 const J=v=>JSON.stringify(v).replace(/([,:])(?=["{\[\d-])/g,'$1 ');
 const hl=s=>esc(s).replace(/(&quot;[^&]*?&quot;)(\s*:)/g,'<span class="jk">$1</span>$2');
 const t=D.tool,pp=t.parameters,ks=Object.keys(pp.properties);
 const real=`<pre class="json">${hl(`{"name": ${J(t.name)},`)}\n <span class="p2-hl">${hl(`"description": ${J(t.description)},`)}</span>\n${hl(` "parameters": {"type": ${J(pp.type)}, "properties": {`)}\n${ks.map((k,i)=>hl(`   ${J(k)}: ${J(pp.properties[k])}${i<ks.length-1?',':'},'}`)).join('\n')}\n${hl(`  "required": ${J(pp.required)}}}`)}</pre>`;
 const v=D.vague,bad=`<pre class="json bad">${hl(J(v))}</pre>`;
 const keys=`<ul class="p2-keys"><li><code>name</code>what the model writes when it wants this tool</li>
   <li class="p2-d"><code>description</code>its only manual: what comes back, in which units, for which days</li>
   <li><code>parameters</code>what to fill in, each with an example or a range</li></ul>`;
 const vague=`<h3 style="color:var(--loss)">${iconHTML('alert',COL.loss,24)}A vague entry</h3>${bad}
   <ul class="p2-guess">${['Which data: air, weather, sales?','What goes in x: a city, a date, a sentence?','How far ahead, in what units?'].map(s=>`<li>${iconHTML('alert',COL.loss,20)}<span>${s}</span></li>`).join('')}</ul>
   <p class="p2-so">${kR('So it calls it for the wrong job, fills x with a sentence, or never calls it.')}</p>`;
 S_('tool-menu','engine','What the model knows about a tool',{builds:2,nb:nb('part-1'),
  body:`<div class="p2-menu"><div><h3 style="color:var(--p)">${iconHTML('sensor',COL.target,24)}The real menu entry</h3>${real}</div>
   <div>${only('1',keys)}${only('2',vague)}</div></div>`,
  lines:[`This is everything the model knows about the forecast tool: a name, a description and ${word(ks.length)} parameters. It never sees our Python code.`,
   `Suppose the entry said only ${v.name}(x): gets data. The model would have to guess. Write each description like a note to a new colleague.`],
  ask:['If you were the model, which part would you read most carefully?','What would a new colleague ask about get_data?'],
  expected:['The description. It says what comes back, in what units, and from when (tomorrow), so the model could match it to the dates of the trip.',
   'Which data, what x means, what comes back. Every question you would ask, the model must guess.'],
  point:'The description is the only manual the model gets. Write it like a note to a new colleague: what it does, what comes back, in what units, with an example.',
  misconception:'That a capable model will work out what a tool does from its name. It cannot see the code; a vague tool gets misused.',
  demo:'Notebook 1.2: print(get_air_quality.schema) shows this entry, built from the docstring and type hints.',
  transition:'The menu is one part of what the model reads every turn. What else is in there?',
  source:'The real entry: get_air_quality’s docstring and type hints in notebook/agents.py, copied into scripts/sci/p2.py. get_data is made up for the slide.'});
}

// ---------------------------------------------------------------------------------------- the context
{
 const C=D.context,P=C.parts,tot=C.total,rest=P.at(-1);
 const SEG={'instructions':[MUTED,1,'instructions'],'tool menu':[COL.target,1,'tool menu'],'task':[COL.amber,1,'your task'],'tool results':[COL.target,.45,'tool results'],'earlier turns':[COL.guess,.7,'its own earlier turns, with formatting']};
 const W=1152,H=226,x0=104,bw=900,sc=v=>v/tot*bw,bh=42;
 let g='';
 C.turns.forEach((v,i)=>{const y=6+i*56;g+=label(0,y+29,`Turn ${i+1}`,{size:21,fill:COL.ink,weight:650});
  if(i<C.turns.length-1)g+=`<rect x="${x0}" y="${y}" width="${sc(v).toFixed(1)}" height="${bh}" rx="4" fill="${BLUE}" opacity=".55"/>`;
  else{let x=x0;for(const s of P){const [c,o]=SEG[s.key];g+=`<rect x="${x.toFixed(1)}" y="${y}" width="${sc(s.tokens).toFixed(1)}" height="${bh}" fill="${c}" opacity="${o}" stroke="#fff" stroke-width="1.5"/>`;x+=sc(s.tokens);}
   g+=label(x0+sc(tot-rest.tokens)+16,y+28,`${SEG[rest.key][2]} · ${big(rest.tokens)} (${Math.round(100*rest.tokens/tot)}%)`,{size:20,fill:'#fff',weight:650});}
  g+=label(x0+sc(v)+10,y+28,`${big(v)} tokens`,{size:20,fill:COL.ink,weight:600});});
 let lx=x0;const ly=196;
 for(const s of P.slice(0,-1)){const [c,o,n]=SEG[s.key],t=`${n} · ${big(s.tokens)}`;
  g+=`<rect x="${lx}" y="${ly-15}" width="18" height="18" rx="3" fill="${c}" opacity="${o}"/>`+label(lx+26,ly,t,{size:19,fill:COL.ink});lx+=26+t.length*10.2+30;}
 const TIPS=[[COL.amber,'Instructions and task','Say the goal, the limits and the format once.'],[COL.target,'Tool menu','Offer only the tools this task needs.'],
  ['#0F766E77','Tool results','Keep the part the next step needs.'],[COL.guess,'Earlier turns','Summarise a long history instead of rereading it.']];
 S_('context','engine','What the model reads, every turn',{builds:2,nb:nb('part-2'),
  body:`${fig(W,H,g,`Tokens read in each of the ${word(C.turns.length)} turns; turn 3 split into instructions, tool menu, task, tool results and the model’s own earlier turns`)}
   ${at(2,`<div class="p2-tips">${TIPS.map(([c,h,t])=>`<div style="border-top-color:${c}"><b>${h}</b>${t}</div>`).join('')}</div>`)}`,
  lines:[`The context is everything the model reads in a turn. Turn 3 read ${num(C.growth,1)} times what turn 1 did. Most of it is the conversation so far.`,
   'Context engineering is deciding what goes in each turn, because every token costs money and time, and buries what matters.'],
  ask:['Which part of the context would you have guessed was biggest?','In a long run, what would you trim first?'],
  expected:['Most guess the instructions or the tool results. It was the conversation so far, which the model rereads every turn.',
   'Old tool results and long histories: summarise them, or keep them in notes and fetch them when needed. Then the tool menu: offer only the tools the task needs.'],
  point:`The model knows only what is in its context this turn, and you pay to send all of it, every turn. The phrase “context engineering” was popularised by Andrej Karpathy (X, ${C.karpathy.date}): filling the context window “with just the right information for the next step”.`,
  misconception:'That a bigger context window solves this. Long contexts cost more, run slower, and models attend less well to what is buried in the middle.',
  demo:'Notebook 2.1: the token count of each part, and the turn-by-turn growth.',
  transition:'The context is wiped when a run ends. So how does an agent remember you next week?',
  source:`Real run, ${T.date_text}. The ${word(P.length-1)} parts were counted separately with Gemini’s token counter; “its own earlier turns” is the rest of turn 3’s ${big(tot)} tokens, formatting included.`});
}

// ---------------------------------------------------------------------------------------- 2.2 memory
chap('2.2','Memory');
{
 const M=D.memory,arr=`<svg viewBox="0 0 40 24" width="40" height="24" aria-hidden="true"><path d="M2 12h30M24 4l10 8-10 8" fill="none" stroke="${BLUE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 const callChips=M.calls.map(c=>c.name==='read_notes'?chip('notes','read_notes','memory'):chip('sensor',esc(c.args.city))).join('');
 const short=s=>esc(s.split(' ').slice(0,8).join(' '))+' …';
 const runs=`<div class="p2-mem">
   <div><span class="h">An earlier run</span>${msg('you',short(M.saved_by))}<div class="chips">${chip('pen','save_note')}</div></div>${arr}
   <div><div class="p2-note"><b>${iconHTML('notes',BLUE,18)}agent_notes.md</b>${esc(M.note)}</div></div>${arr}
   <div><span class="h">A later run</span>${msg('you',esc(M.goal))}${msg('call',`<div class="chips">${callChips}</div>`)}${msg('model',esc(M.answer.split('. ')[0])+'. '+esc(M.answer.split('. ')[1].split(' ').slice(0,3).join(' '))+' …')}</div></div>`;
 // three kinds of memory, drawn
 const W=1152,H=300,B=BLUE,cx=[192,576,960];
 const desk=x=>`<rect x="${x-120}" y="118" width="240" height="12" rx="3" fill="${B}" opacity=".85"/>`+line(x-104,130,x-104,190,{stroke:B,w:5})+line(x+104,130,x+104,190,{stroke:B,w:5})+
  [[-80,62,-8],[-28,54,5],[30,66,-3]].map(([dx,y,r])=>`<g transform="rotate(${r} ${x+dx+28} ${y+28})"><rect x="${x+dx}" y="${y}" width="56" height="${118-y-2}" rx="3" fill="#fff" stroke="${B}" stroke-width="2.5"/>${line(x+dx+10,y+14,x+dx+44,y+14,{stroke:B,w:2})}${line(x+dx+10,y+26,x+dx+38,y+26,{stroke:B,w:2})}</g>`).join('');
 const book=x=>`<rect x="${x-70}" y="20" width="140" height="170" rx="8" fill="#fff" stroke="${B}" stroke-width="3"/>`+
  [0,1,2,3,4,5,6].map(i=>`<circle cx="${x-70}" cy="${36+i*23}" r="6" fill="#fff" stroke="${B}" stroke-width="2.5"/>`).join('')+
  [0,1,2,3].map(i=>line(x-48,98+i*22,x+54,98+i*22,{stroke:'#245EDB55',w:2})).join('')+label(x-48,72,'has asthma',{size:18,fill:B,weight:650});
 const cab=x=>`<rect x="${x-62}" y="16" width="124" height="176" rx="6" fill="#fff" stroke="${B}" stroke-width="3"/>`+
  [0,2].map(i=>`<rect x="${x-50}" y="${28+i*54}" width="100" height="44" rx="4" fill="none" stroke="${B}" stroke-width="2.5"/>${line(x-14,50+i*54,x+14,50+i*54,{stroke:B,w:3})}`).join('')+
  `<rect x="${x-26}" y="48" width="44" height="40" rx="2" fill="#fff" stroke="${B}" stroke-width="2.5"/>${line(x-18,58,x+10,58,{stroke:B,w:2})}${line(x-18,68,x+4,68,{stroke:B,w:2})}`+
  `<rect x="${x-74}" y="80" width="148" height="50" rx="4" fill="#fff" stroke="${B}" stroke-width="3"/>${line(x-16,106,x+16,106,{stroke:B,w:3})}`+icon('search',x+96,52,40,B,{sw:2.4});
 const KINDS=[[desk,'The context: a desk','What it works on now.','Cleared when the run ends.'],[book,'Notes: a notebook','Short facts it saves,','then reads in a later run.'],
  [cab,'Documents: a filing cabinet','A large store it searches,','taking only the pages it needs.']];
 const kinds=fig(W,H,KINDS.map(([f,t,a,b],i)=>f(cx[i])+label(cx[i],232,t,{size:23,fill:B,anchor:'middle',weight:700})+label(cx[i],261,a,{size:20,anchor:'middle',fill:'#374151'})+label(cx[i],287,b,{size:20,anchor:'middle',fill:'#374151'})).join(''),
  'Three kinds of memory: the context as a desk, notes as a notebook, documents as a filing cabinet');
 S_('memory','engine','The context forgets; notes do not',{builds:2,nb:nb('part-2'),
  body:`${only('1',runs)}${only('2',kinds)}`,
  lines:['The context is gone when a run ends. This agent kept a note in a file, and a later run read it first.',
   `Agents use ${word(KINDS.length)} kinds of memory. Which one would hold your company’s policy manual?`],
  ask:['Why did the later run ask for its notes at all?','Which kind of memory would hold your company’s policy manual?'],
  expected:['The read_notes tool says it holds preferences and facts about the user, and the question said “for me”. It asked for the notes and both forecasts in the same turn.',
   'The filing cabinet: documents it searches and quotes (retrieval). Notes are for short facts about a user or a task; the context is only today’s desk.'],
  point:'Memory beyond one run is not in the model. It is text the agent saves with a tool and reads back with a tool.',
  misconception:'That the model learns from your conversations as it goes. Its weights do not change; it remembers only what someone stores and feeds back.',
  demo:'Notebook 2.2: run the two conversations; open agent_notes.md in between.',
  transition:`With tools, a loop and memory, we can build bigger systems. Most are made of ${word(D.patterns.names.length)} patterns.`,
  source:`Real run, ${T.date_text} (notebook Part 2.2): ${word(M.steps)} turns, ${word(M.calls_n)} tool calls. The earlier request and the answer are shortened here. Drawings: made for the slide.`});
}

// ---------------------------------------------------------------------------------------- 2.3 patterns
chap('2.3','Patterns');
{
 const PN=D.patterns.names,t1=WT[0],R=D.routing,dests=[...new Set(R.map(r=>r.route))];
 const box=(x,y,w,h,t,c,{fs=19,fill='#fff'}={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${c}" stroke-width="2.6"/>`+label(x+w/2,y+h/2+fs*.36,t,{size:fs,anchor:'middle',fill:COL.ink});
 const ar=(x1,y1,x2,y2,c='#4B5563')=>arrow(x1,y1,x2,y2,{stroke:c,w:2.4,head:10});
 // prompt chaining: our task, if its steps never changed (a design)
 const chainFig=fig(880,96,box(0,18,190,58,`Get ${word(t1.calls.length)} forecasts`,COL.target)+ar(194,47,236,47)+box(240,18,190,58,`Add up ${word(W2.sums.length)} orders`,COL.target)+ar(434,47,476,47)+
  `<path d="M546 6 L620 47 L546 88 L472 47Z" fill="#fff" stroke="${COL.green}" stroke-width="2.6"/>`+label(546,54,`${word(W2.totals.length)} totals?`,{size:18,anchor:'middle',fill:COL.green,weight:650})+
  ar(624,47,666,47)+box(670,18,206,58,'Write the answer',COL.guess),'Prompt chaining: get the forecasts, add up the orders, check, write the answer');
 // routing: four real customer messages, each sent to its queue by one model call
 const RW=880,RH=142,ry=i=>36+i*29,qy=k=>28+k*40,qx=700;
 let rg=label(505,19,'one model call each',{size:17,fill:COL.guess,weight:650});
 R.forEach((r,i)=>{const y=ry(i)-6,yd=qy(dests.indexOf(r.route))+15;
  rg+=label(0,ry(i),`“${esc(r.message)}”`,{size:18,fill:COL.ink})+icon('spark',474,y,20,COL.guess)+
   `<path d="M488 ${y} C590 ${y} 600 ${yd} ${qx-12} ${yd}" fill="none" stroke="#4B5563" stroke-width="2.2"/>`+`<path d="M${qx-2} ${yd} l-11 -5.5 v11z" fill="#4B5563"/>`;});
 dests.forEach((d,k)=>{rg+=box(qx,qy(k),180,30,d,COL.amber,{fs:18,fill:'#FBF7F3'});});
 const routeFig=fig(RW,RH,rg,`Routing: ${word(R.length)} real customer messages, one in Hindi, each labelled ${dests.join(', ')} by one model call`);
 // parallelisation: the opening run's three forecasts in one turn
 const cities=t1.calls.map(c=>c.city);
 let pg=`<circle cx="44" cy="50" r="30" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon('spark',44,50,30,COL.guess)+label(44,98,'turn 1',{size:17,anchor:'middle',fill:COL.guess});
 cities.forEach((c,i)=>{const y=6+i*31;pg+=ar(78,50,236,y+13)+box(240,y,230,27,`forecast · ${esc(c)}`,COL.target,{fs:17})+ar(474,y+13,620,50);});
 pg+=label(112,100,`×${t1.calls.length} at once`,{size:17,fill:COL.target,weight:650})+`<circle cx="656" cy="50" r="30" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon('spark',656,50,30,COL.guess)+label(700,46,'turn 2 reads',{size:18,fill:COL.guess})+label(700,68,'all three results',{size:18,fill:COL.guess});
 const parFig=fig(880,110,pg,`Parallelisation: ${word(t1.calls.length)} forecast requests made at once in one turn, read together in the next`);
 const ROWS=[['Fixed steps, with a check between them.',false,chainFig],['Sort first, then hand to a specialist.',true,routeFig],['Independent requests, all at once.',true,parFig]];
 const rowP=(k,name,desc,real,f)=>`<div><div><div><h3>${name}</h3><p>${desc}</p><small class="${real?'':'dz'}">${real?'real run':'a design'}</small></div>${at(k,f)}</div></div>`;
 S_('patterns','engine',`${Word(PN.length)} patterns, ${word(ROWS.length)} of them here`,{builds:ROWS.length,nb:nb('part-2'),
  body:`<div class="p2-pat">${ROWS.map(([d,real,f],i)=>rowP(i+1,PN[i],d,real,f)).join('')}</div>`,
  lines:['Most systems are built from a few patterns. Our trip task could even be a fixed chain, because its steps never change.',
   `Routing, on ${word(R.length)} real customer messages: one quick model call picks the queue, including for the message in Hindi.`,
   `Parallelisation: ask for independent things at once. Our agent fetched ${word(t1.calls.length)} forecasts in one turn, and did ${word(W2.sums.length)} sums in the next.`],
  ask:['Where in your work is a fixed sequence of steps with a check in the middle?','Why use a model to route, rather than keywords?','What stops you running everything in parallel?'],
  expected:['Report preparation, invoice processing, onboarding: draft, check, then send.',
   'Keywords miss paraphrases and other languages. “मेरा रिफंड अभी तक नहीं आया” (my refund has not arrived yet) has no English keyword, and still went to billing.',
   'Dependencies: the sums needed the forecasts first. Parallel steps must not need each other’s results.'],
  point:'Workflows built from a few patterns are cheaper and more predictable than a free-running agent. Use the simplest pattern that works.',
  misconception:'That every AI system needs a free-running agent. Chains and routers are workflows, and most production systems are workflows.',
  demo:'Notebook 2.3: route the four messages; add one of your own.',
  transition:`The other ${word(PN.length-ROWS.length)} patterns use several model calls that work together.`,
  source:`The ${word(PN.length)} patterns: Anthropic, “Building effective agents” (${D.patterns.source_date}). Routing: real (${T.date_text}, notebook 2.3); parallel calls: the opening run; the chain is a design.`});
}
{
 const MU=D.multi,F=D.farm,pass=F.rounds.at(-1);
 // orchestrator and workers
 let og=`<circle cx="240" cy="44" r="32" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon('spark',240,44,32,COL.guess)+
  label(194,38,'lead agent',{size:20,fill:COL.guess,weight:700,anchor:'end'})+label(194,62,'plans, then writes',{size:17,fill:'#4B5563',anchor:'end'})+
  arrow(276,44,420,44,{stroke:COL.green,w:2.6,head:11})+icon('check',446,44,30,COL.green,{sw:2.6})+label(446,84,'report',{size:17,fill:COL.green,anchor:'middle',weight:650});
 [110,240,370].forEach(x=>{og+=arrow(240+(x-240)*.25,78,x,144,{stroke:'#4B5563',w:2.2,head:10})+
  `<circle cx="${x}" cy="168" r="24" fill="#fff" stroke="${COL.guess}" stroke-width="2.6"/>`+icon('bot',x,168,24,COL.guess)+
  icon('search',x-22,222,22,COL.target)+label(x-6,229,'search',{size:17,fill:COL.target});});
 og+=label(410,166,'subagents,',{size:17,fill:COL.guess})+label(410,188,'in parallel',{size:17,fill:COL.guess});
 const orch=fig(540,246,og,'A lead agent sends three subagents to search in parallel, then writes the report');
 // evaluator and optimizer: the farm advisory
 const node=(x,ic,t)=>`<circle cx="${x}" cy="56" r="30" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon(ic,x,56,28,COL.guess)+label(x,108,t,{size:18,fill:COL.guess,anchor:'middle',weight:650});
 let eg=node(60,'pen','writer')+arrow(94,56,152,56,{stroke:'#4B5563',w:2.4,head:10})+icon('file',184,56,40,COL.ink)+label(184,108,'draft',{size:18,anchor:'middle'})+
  arrow(214,56,274,56,{stroke:'#4B5563',w:2.4,head:10})+node(310,'list','critic')+arrow(344,56,420,56,{stroke:COL.green,w:2.6,head:11})+icon('send',450,56,30,COL.green)+label(450,108,'pass: send',{size:18,fill:COL.green,anchor:'middle',weight:650})+
  `<path d="M310 118 V140 H10 V56 H20" fill="none" stroke="${COL.loss}" stroke-width="2.2" stroke-dasharray="7 5"/><path d="M29 56 l-11 -5.5 v11z" fill="${COL.loss}"/>`+
  label(170,166,`fail: problems go back, up to ${word(F.max_rounds)} rounds`,{size:17,fill:COL.loss,anchor:'middle'});
 const evalf=fig(540,176,eg,'A writer drafts, a critic checks against a list; on failure the problems go back to the writer');
 const SHORT=F.short;
 const snip=F.snippet.split(' ').slice(0,7).join(' ');
 S_('patterns-2','engine','Patterns with several model calls',{builds:2,nb:nb('part-3'),
  body:`<div class="compare p2-two"><div class="a"><h3>${D.patterns.names[3]}</h3>${orch}
    <p>${kG(`+${num(MU.gain_pct,1)}%`)} over a single agent on Anthropic’s internal research eval, at about ${MU.multi_x}× the tokens of a chat.</p></div>
   ${at(2,`<div class="a"><h3>${D.patterns.names[4]}</h3>${evalf}<p class="p2-guj">“${esc(snip)} …”</p>
    <ul class="p2-check">${SHORT.map(s=>`<li>${iconHTML('check',COL.green,18)}${s}</li>`).join('')}<li>${kG(`round ${F.rounds.length}: ${pass.pass?'passed':'failed'}`)}</li></ul></div>`)}</div>`,
  lines:['Orchestrator and workers: a lead agent splits the job and sends subagents off in parallel. Anthropic measured the gain, and the bill.',
   `Evaluator and optimizer: one call writes, another checks against a list, the writer revises. Our Gujarati farm advisory passed in round ${word(F.rounds.length)}.`],
  ask:['Why would several agents beat one on a research question?','Why use a second model call to check the first, rather than asking the writer to be careful?'],
  expected:['Each subagent explores one direction with a clean context, and they run at the same time. The price is many more tokens.',
   'A separate check with an explicit list catches what the writer misses, and the list is something a person can read and change. It is a cheap eval run on every draft.'],
  point:`Multi-agent systems buy quality with tokens: Anthropic reports agents use about ${MU.agent_x}× the tokens of a chat, multi-agent systems about ${MU.multi_x}×. Worth it only when the task is worth that much.`,
  misconception:'That more agents are always better. For most tasks a single agent, or a workflow, is cheaper and easier to debug.',
  demo:'Notebook 3.4: the writer and critic on today’s forecast; change the checklist and watch the critic fail a draft.',
  transition:`All these patterns need tools. Connecting ${word(D.mcp.n_models)} models to ${word(D.mcp.n_tools)} tools is where the plumbing gets expensive.`,
  source:`Anthropic, “How we built our multi-agent research system” (${MU.date}). Farm advisory: real run, ${T.date_text} (notebook Part 3.4), forecast for ${esc(F.place)}; the checklist is shortened here.`});
}

// ---------------------------------------------------------------------------------------- 2.4 a common plug
chap('2.4','A common plug');
{
 const MC=D.mcp,W=1152,H=250,xm=210,xt=700,xh=455,yc=H/2;
 const ys=(k,n)=>n===1?yc:22+k*(H-44)/(n-1);
 const draw=(n,m,hub)=>{let g='';const rr=Math.max(11,Math.min(22,Math.floor((H-44)/Math.max(n-1,m-1,1)/2)-3));
  const MY=[...Array(n)].map((_,k)=>ys(k,n)),TY=[...Array(m)].map((_,k)=>ys(k,m));
  if(hub){MY.forEach(y=>{g+=line(xm+rr+2,y,xh-70,yc,{stroke:COL.guess,w:2.4});});TY.forEach(y=>{g+=line(xh+70,yc,xt-rr-2,y,{stroke:COL.target,w:2.4});});
   g+=`<rect x="${xh-70}" y="${yc-34}" width="140" height="68" rx="14" fill="#fff" stroke="${COL.ink}" stroke-width="3"/>`+label(xh,yc+9,'MCP',{size:26,fill:COL.ink,anchor:'middle',weight:700});}
  else MY.forEach(y=>TY.forEach(y2=>{g+=line(xm+rr+2,y,xt-rr-2,y2,{stroke:'#9AA3AD',w:1.6});}));
  MY.forEach((y,k)=>{g+=`<circle cx="${xm}" cy="${y}" r="${rr}" fill="#fff" stroke="${COL.guess}" stroke-width="2.6"/>`+icon('spark',xm,y,rr*1.2,COL.guess)+label(xm-rr-12,y+7,MC.models[k],{size:20,fill:COL.guess,anchor:'end',weight:650});});
  TY.forEach((y,k)=>{const [ic,t]=MC.tools[k];g+=`<circle cx="${xt}" cy="${y}" r="${rr}" fill="#fff" stroke="${COL.target}" stroke-width="2.6"/>`+icon(ic,xt,y,rr*1.15,COL.target)+label(xt+rr+12,y+7,t,{size:20,fill:COL.target,weight:650});});
  const c=hub?COL.green:COL.loss,cx=1012;
  g+=label(cx,yc+8,String(hub?n+m:n*m),{size:66,fill:c,anchor:'middle',weight:700})+label(cx,yc+48,hub?'connections':'custom connectors',{size:20,fill:c,anchor:'middle',weight:650})+
   label(cx,yc+74,hub?`${n} models + ${m} tools`:`${n} models × ${m} tools`,{size:18,anchor:'middle'});
  return fig(W,H,g,hub?`${n} models and ${m} tools joined through MCP: ${n+m} connections`:`${n} models wired to ${m} tools one by one: ${n*m} connectors`);};
 const BUILD_HUB={1:false,2:true,3:true};
 register('p2-mcp',(el,ctx)=>{
  if(ctx.printing){el.innerHTML=`<div class="state-slot"><div data-only="1">${draw(MC.n_models,MC.n_tools,false)}</div><div data-only="2-3">${draw(MC.n_models,MC.n_tools,true)}</div></div>`;return;}
  el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('m','Models',1,MC.models.length,1,MC.n_models)}${slider('t','Tools',1,MC.tools.length,1,MC.n_tools)}<button type="button" data-k="hub" aria-pressed="false">With MCP</button></div>`;
  const f=el.querySelector('.w-fig'),sm=el.querySelector('[data-k="m"]'),st=el.querySelector('[data-k="t"]'),bt=el.querySelector('[data-k="hub"]');
  const om=el.querySelector('[data-o="m"]'),ot=el.querySelector('[data-o="t"]');
  const show=()=>{f.innerHTML=draw(+sm.value,+st.value,bt.getAttribute('aria-pressed')==='true');om.textContent=sm.value;ot.textContent=st.value;};
  for(const s of [sm,st]){s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());}
  bt.addEventListener('click',()=>{bt.setAttribute('aria-pressed',String(bt.getAttribute('aria-pressed')!=='true'));bt.blur();show();});
  const scene=el.closest('.scene');
  if(scene)new MutationObserver(()=>{const h=BUILD_HUB[scene.dataset.build];if(h!==undefined&&String(h)!==bt.getAttribute('aria-pressed')){bt.setAttribute('aria-pressed',String(h));show();}}).observe(scene,{attributes:true,attributeFilter:['data-build']});
  show();
 });
 const who=MC.founders.slice(0,-1).join(', ')+' and '+MC.founders.at(-1);
 S_('mcp','engine','One plug instead of a tangle of wires',{builds:3,nb:nb('part-5'),
  body:`${widget('p2-mcp','Models wired to tools one by one, or through one common protocol, MCP')}
   ${at(3,`<div class="p2-facts"><div><b>What it is</b>An open standard for offering tools, data and prompts to any agent that speaks it.</div>
    <div><b>${MC.announced}</b>Anthropic announces MCP and opens the code.</div>
    <div><b>${MC.donated}</b>Given to the Linux Foundation’s new Agentic AI Foundation, co-founded by ${who}.</div></div>`)}`,
  lines:[`${Word(MC.n_models)} models, ${word(MC.n_tools)} tools. Without a standard, every pair needs its own connector: ${MC.custom} pieces of glue code to write and keep working.`,
   `With one common plug, each model and each tool implements it once: ${MC.via} connections. Drag the sliders and watch the gap grow.`,
   'That plug is MCP, the Model Context Protocol. It began at one company and now belongs to a neutral foundation.'],
  ask:['If you add one more tool, how many new connectors do you write?','And with the common plug?','Why would competitors agree to share one standard?'],
  expected:[`One per model: ${MC.n_models} more, and every model vendor has to do it.`,'One: the new tool speaks MCP, and every model that speaks MCP can use it.',
   'Because their customers want every tool to work with every assistant. A neutral owner makes it safe to depend on.'],
  point:'MCP turns an n × m integration problem into n + m: write a tool once, and any agent that speaks MCP can use it.',
  misconception:'That MCP makes tools safe. It standardises the plug, not what flows through it; a poisoned tool result travels just as easily (Part 4).',
  demo:'Notebook Part 5: the forecast tool from this talk, served as an MCP server in a dozen lines.',
  transition:'Part 2 in one slide.',
  source:`Anthropic, “Introducing the Model Context Protocol” (${MC.announced}); Linux Foundation, Agentic AI Foundation (${MC.donated}). Counts on the slide are arithmetic: n × m against n + m.`});
}

recap(2,['Each turn rereads the whole context, and you pay for all of it.','The tool description is the model’s only manual.',
 'Notes outlast a run; a few patterns cover most systems.'],
 'the jobs agents already do, each drawn on the same card.',
 {card:{goal:'Suggest a city, remembering the user',model:esc(T.model),
   tools:`${chip('notes','read_notes','memory')} ${chip('pen','save_note')} ${chip('sensor','forecast')}`,memory:'<span class="p2-kB">A notes file</span>',
   stop:`An answer, or ${D.loop.max_steps} steps`,guard:'Read-only, except adding notes',human:'Says what to remember'},
  hi:['tools','memory'],title:'The memory agent',
  ask:'What would you want this agent to remember about you, and what should it never write down?',
  expected:'Preferences help it; but a health condition is sensitive data. Decide what may be stored, for how long, and who can read the notes.',
  point:'The engine is a loop that rereads its context; tools, memory and patterns are what we build around it.',
  transition:'Part 3: agents at work.'});
