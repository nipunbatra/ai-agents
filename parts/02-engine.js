// Part 2: one run, step by step. Slow: the loop map with "we are here" on the model, the opening run one round per
// slide (what the model read, how many tokens, what it wrote), the loop as Python, notebook 2.1 and the parts of the
// context, why to keep it short, memory (a question, notebook 2.2, our recorded run), three patterns (a chain,
// routing with notebook 2.3, several model calls together) and MCP (the map on the tool box, then n × m against n + m).
// Real runs: data/traces.json; everything else, and the numbers derived from the runs: data/p2.json (scripts/sci/p2.py).
import {S_,O,ps,small,request,at,data,need,css,esc,word,Word,kG,highlight,
 fig,label,line,arrow,gat,gonly,COL,MUTED,icon,iconHTML,chip,loopMap,msg,chart,
 widget,register,slider,num,big,nb,nbRun,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'agent','model','date_text','price','inr_per_usd'),A=T.agent;
const D=need(await data('p2'),'walk','context','memory','patterns','routing','routing_gloss','multi','mcp','loop');
const W2=D.walk,WT=W2.turns,PR=T.price['gemini-3.8-flash'],BLUE=COL.data;
const RD=WT.map(t=>t.read),n1=WT[0].calls.length,n2=WT[1].calls.length;

css(`.p2-round{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:start}
.p2-h{font-size:16px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--muted);margin:0 0 10px}
.p2-conv{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.p2-conv li{display:flex;align-items:center;gap:12px;background:#fff;border:2px solid var(--line);border-left:6px solid var(--c);border-radius:10px;padding:6px 14px;font-size:24px;line-height:1.3}
.p2-conv li>svg{flex:none}.p2-conv li.old{opacity:.5}
.p2-conv .new{margin-left:auto;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--data)}
.p2-wrote{margin-top:26px}.p2-wrote .msg{font-size:23px;line-height:1.4}.p2-wrote .tchip{font-size:20px}
.p2-sum{font:600 19px "SFMono-Regular",Menlo,Consolas,monospace}
.p2-stat{display:flex;gap:44px;margin-top:8px}
.p2-stat div{font-size:19px;color:var(--muted)}.p2-stat b{display:block;font-size:40px;line-height:1.15;color:var(--ink);font-variant-numeric:tabular-nums}
.p2-code .code{font-size:23px;line-height:1.6;padding:16px 24px}
.p2-tag{display:inline-block;font:650 17px/1.3 var(--font);padding:2px 12px;border-radius:999px;color:#fff;vertical-align:2px}
.p2-tag.agent{background:var(--q)}.p2-tag.tools{background:var(--p)}.p2-tag.done{background:var(--d)}.p2-tag.risk{background:var(--loss)}.p2-tag.memory{background:var(--data)}
.p2-eq{font-size:54px;font-weight:650;font-variant-numeric:tabular-nums;text-align:center;color:var(--data)}
.p2-eq span{color:var(--muted);font-weight:400;margin:0 14px}.p2-eq b{color:var(--ink)}
.p2-eqc{text-align:center;margin-top:4px}
.p2-tips{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;margin-top:34px}
.p2-tips>div{display:flex;gap:14px;align-items:flex-start;border:2px solid var(--line);border-top:6px solid var(--c);border-radius:14px;background:#fff;padding:16px 18px;font-size:24px;line-height:1.35;min-width:0}
.p2-tips>div>svg{flex:none;margin-top:3px}
.p2-q .req{font-size:32px;line-height:1.4;padding:22px 28px;border-radius:22px 22px 22px 6px}
.p2-two-tools{display:flex;gap:40px;margin-top:30px;font-size:24px;align-items:center}
.p2-two-tools>div{display:flex;gap:12px;align-items:center}.p2-two-tools .tchip{font-size:22px}
.p2-mem{display:grid;grid-template-columns:minmax(0,1fr) 44px minmax(0,.95fr) 44px minmax(0,1.25fr);gap:8px;align-items:center}
.p2-mem>div{display:flex;flex-direction:column;gap:10px;min-width:0}
.p2-mem .msg,.p2-mem .req{font-size:22px}.p2-mem .tchip{font-size:19px}
.p2-note{border:2px solid #245EDB66;background:#245EDB0A;border-radius:12px;padding:10px 16px;font-size:23px;line-height:1.38}
.p2-note b{display:flex;gap:6px;align-items:center;font:600 16px "SFMono-Regular",Menlo,Consolas,monospace;color:var(--data);margin-bottom:4px}
.p2-kB{color:var(--data);font-weight:650}
.p2-two h3{font-size:27px;color:var(--q);margin-bottom:8px}
.p2-two .caption{margin-top:6px;font-size:21px;color:#374151}
@media(max-width:760px){.reading .p2-round,.reading .p2-mem,.reading .p2-tips{grid-template-columns:minmax(0,1fr)}
 .reading .p2-mem>svg{transform:rotate(90deg);margin:0 auto}.reading .p2-eq{font-size:22px;overflow-wrap:anywhere}.reading .p2-eq span{margin:0 4px}.reading .p2-q .req{font-size:22px}.reading .p2-two-tools{flex-direction:column;align-items:flex-start;gap:12px}}`);

partBreak(2,'One run, step by step','We replay the opening run one round at a time, and look at what the model reads.',
 ['What the model reads each round','Notes that outlast a run','A few common patterns','MCP: one way to connect tools'],
 {img:'part-engine.jpg',alt:'Illustration: a small helper reading a paper scroll that grows longer at each step, with tools handing it results',nb:nb('part-2'),
  line:'Key question: what does the model read each round, and what does that cost?',
  ask:'When an agent “thinks”, what do you imagine is going on?',
  expected:'Answers vary: it plans, it searches, it reasons. Keep them. This part shows that each round is the model reading a growing text and writing a short reply.',
  transition:'First, where we are in the loop.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 2.1 what the model reads
chap('2.1','What the model reads');
S_('map-model','engine','Where are we in the loop?',{builds:1,
 body:loopMap({hi:'model'}),
 lines:['This part is about one box: each round, the model reads the whole conversation again.'],
 ask:['By round 3 of our run, what is in “the conversation”?'],
 expected:['Our instructions, the tool menu, the question, and every request and result so far.'],
 point:'The model keeps nothing between rounds. Our code sends it the whole conversation every time.',
 transition:'We replay the opening run, one round per slide.'});

// the opening run, one round per slide: what it read, how many tokens, what it wrote
{
 const MAXR=Math.max(...RD);
 const bars=k=>{const W=560,H=262,base=212,mh=168,cw=124,xs=[22,218,414];
  let g=line(0,base,W,base,{stroke:'#D5DAE0',w:2});
  RD.forEach((v,i)=>{const x=xs[i],cx=x+cw/2,cur=i===k-1;
   g+=label(cx,base+34,`Round ${i+1}`,{size:23,anchor:'middle',fill:cur?COL.guess:i<k?COL.ink:'#B8BFC7',weight:cur?700:500});
   if(i>=k)return;
   const h=v/MAXR*mh,prev=cur&&i?RD[i-1]/MAXR*mh:0;
   if(prev)g+=`<rect x="${x}" y="${(base-prev).toFixed(1)}" width="${cw}" height="${prev.toFixed(1)}" fill="${BLUE}" opacity=".35"/>`;
   g+=`<rect x="${x}" y="${(base-h).toFixed(1)}" width="${cw}" height="${(h-prev).toFixed(1)}" rx="3" fill="${BLUE}" opacity="${cur?1:.35}"/>`;
   g+=label(cx,base-h-12,big(v),{size:cur?30:23,anchor:'middle',fill:cur?COL.ink:MUTED,weight:cur?700:500});});
  return fig(W,H,g,`Tokens the model read in each round, up to round ${k}`);};
 // what the model read: round 1 reads three new pieces; each later round rereads everything before, plus two new pieces
 const NEW=[[['file',MUTED,'Our instructions'],['list',COL.target,'The tool menu'],['person',COL.amber,'Your question']],
  [['spark',COL.guess,`Its ${word(n1)} forecast requests`],['sensor',COL.target,`The ${word(n1)} forecasts`]],
  [['spark',COL.guess,`Its ${word(n2)} sums`],['code',COL.target,`The ${word(n2)} totals`]]];
 const conv=k=>`<p class="p2-h">What it read</p><ol class="p2-conv">${k>1?`<li class="old" style="--c:#245EDB88">${iconHTML('refresh',BLUE,24)}<span>Everything round ${k-1} read</span></li>`:''}
  ${NEW[k-1].map(([ic,c,t])=>`<li style="--c:${c}">${iconHTML(ic,c,24)}<span>${t}</span>${k>1?'<span class="new">new</span>':''}</li>`).join('')}</ol>`;
 const wrote=(b,html)=>at(b,`<div class="p2-wrote"><p class="p2-h">It wrote</p>${html}</div>`);
 const round=(k,id,title,o)=>S_(id,'engine',title,{...o,nb:nb('nb-2-1'),
  body:`<div class="p2-round"><div>${conv(k)}${o.wrote}</div><div><p class="p2-h">Tokens read</p>${bars(k)}${o.right||''}</div></div>`});
 const src=`Real run, ${T.date_text}, ${esc(T.model)} (notebook 1.5). A token is a word or a piece of a word. Pale blue is text the round before had already read.`;

 round(1,'trace-walk',`Round 1: ${word(n1)} forecasts at once`,{builds:2,
  wrote:wrote(2,msg('call',`<div class="chips">${WT[0].calls.map(c=>chip('sensor',esc(c.city))).join('')}</div>`)),
  lines:[`Round 1. The model reads our instructions, the tool menu and your question: ${big(RD[0])} tokens.`,
   `It replies with ${word(n1)} forecast requests at once, since none depends on another.`],
  ask:['What does the model have to work with in round 1?',`Why ask for all ${word(n1)} at once?`],
  expected:['Only text: our instructions, the menu of tools, and the question. No forecasts yet.',
   'None depends on another, so one round is enough, and each round saved is one less rereading of the whole conversation. Our instructions also asked for this. Builders call it parallelisation.'],
  point:'A round is one model call. It reads text and writes text; nothing else happens inside it.',
  misconception:'That the model keeps running between rounds. Each round is a new call; between calls, only our code runs.',
  transition:`Our code fetches the ${word(n1)} forecasts. Then round 2.`,source:src});

 round(2,'trace-walk-2',`Round 2: ${word(n2)} sums at once`,{builds:2,
  wrote:wrote(2,msg('call',`<div class="chips">${W2.sums.map(s=>chip('code',`<span class="p2-sum">${esc(s.replace(/ /g,''))}</span>`)).join('')}</div>`)),
  lines:[`Our code added the ${word(n1)} forecasts. Round 2 reads everything again from the top: ${big(RD[1])} tokens.`,
   `It asks the calculator for ${word(n2)} sums at once, one for each possible order.`],
  ask:['Why did round 2 read so much more than round 1?','Could it have asked for the sums in round 1?'],
  expected:[`It rereads all of round 1, plus its own requests and the ${word(n1)} forecasts. The model keeps nothing between rounds; we send it everything again.`,
   'No. The sums need the forecasts, and those came back only after round 1.'],
  point:'Every round starts from the full conversation. The pale part of the bar is text the model already read once.',
  transition:`${Word(n2)} totals come back. Round 3.`,source:src});

 const ans=W2.answer.split(', against')[0]+'.',inCost=A.usage.input*PR.input,outCost=A.usage.output*PR.output;
 round(3,'trace-walk-3','Round 3: the answer, and what the run cost',{builds:3,
  wrote:wrote(2,msg('model',esc(ans))),
  right:at(3,`<div class="p2-stat"><div><b>${num(A.seconds,1)} s</b>model time</div><div><b>₹${num(A.cost_inr,2)}</b>the whole run</div></div>`),
  lines:[`The ${word(n2)} totals are added. Round 3 reads ${big(RD[2])} tokens, ${num(D.context.growth,1)} times what round 1 read.`,
   'This time it asks for no tool. The reply is the answer, so the loop stops.',
   'That was the whole run. Where did the money go: reading or writing?'],
  ask:['If the run had ten rounds, what would round 10 read?','What did round 3 have that round 2 did not?','Where did most of the cost go: reading or writing?'],
  expected:['Everything from rounds 1 to 9 again. The reading grows every round, which is why long runs get slow and expensive.',
   `The ${word(n2)} totals. With every number it needed, it could answer without another tool.`,
   `Here, writing: the ${big(A.usage.output)} tokens written cost ${num(outCost/inCost,1)} times the ${big(A.usage.input)} read, because a written token costs ${word(PR.output/PR.input)} times as much. In long runs reading takes over, because it repeats every round.`],
  point:`Our run was ${word(WT.length)} model calls, each rereading the whole conversation, with our code running tools in between.`,
  transition:'All of this rereading is done by a few lines of ordinary Python.',
  source:`${src} Paid prices: $${PR.input} in, $${PR.output} out per million tokens, thinking counted as output; ₹${T.inr_per_usd} per dollar.`});
}

// the loop as code: each line tied to a box of the flowchart
{
 const MS=D.loop.max_steps,PAD=38;
 const tag=(t,role)=>`<span class="p2-tag ${role}">${t}</span>`;
 const L=[[1,'def run_agent(goal, tools, max_steps='+MS+'):'],[1,'    messages = [goal]'],[1,'    for step in range(max_steps):'],
  [1,'        reply = chat(messages, tools)',tag('The model reads the conversation, replies','agent')],[1,'        messages.append(reply)'],
  [2,'        if not reply.calls:',tag('Did it ask for a tool?','agent')],[2,'            return reply.text',tag('No: it answers','done')],
  [3,'        for call in reply.calls:'],[3,'            result = run_tool(call)',tag('Our code runs the tool','tools')],
  [3,'            messages.append(result)',tag('The result is added to the conversation','memory')],
  [3,'    return "stopped: step limit"',tag('Step limit','risk')]];
 const steps=`<div class="code-steps p2-code"><pre class="code"><code>${L.map(([b,t,tg])=>`<span class="cl" data-at="${b}">${highlight(tg?t.padEnd(PAD):t)}${tg||''}</span>`).join('')}</code></pre></div>`;
 S_('loop-code','engine',`The loop in ${word(L.length)} lines of Python`,{builds:3,nb:nb('nb-1-5'),
  body:steps,
  lines:['The list called messages is the conversation. Each round, chat() sends all of it to the model, and we add the reply.',
   'If the reply asks for no tool, it is the answer, and the function returns it.',
   'Otherwise our code runs each tool and adds the result to the list. Then round again, up to a step limit.'],
  ask:['Which line is the model, and which lines are ordinary code?','Which box of the flowchart is this?','What would happen with no step limit?'],
  expected:['Only chat() calls the model. Everything else is plain Python that we wrote and can read.',
   '“Did it ask for a tool?” The answer is just whether the reply has any requests in it.',
   'A model that keeps asking for tools would loop for ever and spend money doing it. The step limit is the first guardrail (Part 4).'],
  point:'An agent is an ordinary loop around one model call. Our code runs the tools, keeps the list of messages and decides when to stop.',
  misconception:'That agent frameworks contain some deeper machinery. They wrap this loop with retries, logging, memory and permissions.',
  demo:'Notebook 1.5: run_agent is this loop, with printing, an approval check, and errors sent back to the model instead of crashing.',
  transition:'What fills all that reading? We can count it.',
  source:'Simplified from run_agent in notebook/agents.py. The real one also asks a person before any tool marked for approval, and returns a failing tool’s error to the model as its result.'});
}

nbRun('nb-context','engine','2.1','What the model read each round',{
 run:'for m in run.messages:\n    if m["role"] == "model": print(m["usage"]["input"])',
 look:['The count grows every round','Then a count of each part: which is biggest?'],
 line:'Back to the notebook. We count the tokens read in each round, and in each part.',
 ask:'Which part of the conversation do you expect to be the biggest?',
 expected:'Most guess the tool menu or the forecasts. Hold on to that guess.',
 point:'We can count exactly what the model read, round by round and part by part.',
 transition:'Here are the counts from our run.'});

{
 const C=D.context,P=C.parts,tot=C.total,rest=P.at(-1),known=P.slice(0,-1),sumKnown=known.reduce((s,x)=>s+x.tokens,0),pct=Math.round(100*rest.tokens/tot);
 const NAME={'instructions':['Our instructions',MUTED],'tool menu':['The tool menu',COL.target],'task':['Your question',COL.amber],'tool results':['The tool results',COL.target]};
 const W=1152,rh=48,gap=16,x0=330,bw=640,max=Math.max(...P.map(s=>s.tokens)),sc=v=>v/max*bw;
 let g='';
 known.forEach((s,i)=>{const y=i*(rh+gap),[n,c]=NAME[s.key];
  g+=label(x0-18,y+rh/2+9,n,{size:25,anchor:'end',fill:COL.ink})+`<rect x="${x0}" y="${y}" width="${sc(s.tokens).toFixed(1)}" height="${rh}" rx="5" fill="${c}"/>`+
   label(x0+sc(s.tokens)+14,y+rh/2+9,big(s.tokens),{size:25,fill:COL.ink,weight:650});});
 const y5=known.length*(rh+gap),wr=sc(rest.tokens);
 g+=gonly('1',`${label(x0-18,y5+rh/2+9,'The rest',{size:25,anchor:'end',fill:MUTED})}<rect x="${x0}" y="${y5}" width="${wr.toFixed(1)}" height="${rh}" rx="5" fill="#C9CFD6"/>${label(x0+wr+14,y5+rh/2+10,'?',{size:30,fill:MUTED,weight:700})}`);
 g+=gat(2,`${label(x0-18,y5+rh/2+9,'Its own earlier replies',{size:25,anchor:'end',fill:COL.guess,weight:700})}<rect x="${x0}" y="${y5}" width="${wr.toFixed(1)}" height="${rh}" rx="5" fill="${COL.guess}"/>${label(x0+wr+14,y5+rh/2+9,`${big(rest.tokens)} · ${pct}%`,{size:25,fill:COL.ink,weight:700})}`);
 S_('context','engine','What did round 3 read?',{builds:2,nb:nb('nb-2-1'),
  body:fig(W,y5+rh+4,g,`The ${big(tot)} tokens read in round 3, by part: ${known.map(s=>NAME[s.key][0].toLowerCase()).join(', ')}, and the model’s own earlier replies`),
  lines:[`Round 3 read ${big(tot)} tokens. The ${word(known.length)} parts we counted come to only ${big(sumKnown)}. What is the rest?`,
   `The rest is the model’s own earlier replies, sent back to it each round: ${pct}% of what it read.`],
  ask:['What do you think fills the long grey bar?','In a long run, what would you trim first?'],
  expected:['Its own earlier replies: the requests from rounds 1 and 2, with the formatting around each message.',
   'Old replies and old results: summarise them, or keep them in notes. Then the tool menu: offer only the tools the task needs.'],
  point:'The biggest part of the context was the conversation so far, which the model rereads every round.',
  transition:'What does all this rereading cost?',
  source:`Real run, ${T.date_text} (notebook 2.1). The ${word(known.length)} parts were counted one by one with Gemini’s token counter, so they are approximate. “Its own earlier replies” is the rest of round 3’s ${big(tot)} tokens, formatting included.`});

 const sum=RD.reduce((s,v)=>s+v,0);
 const TIPS=[['list',COL.target,'Offer only the tools the task needs.'],['file',COL.target,'Keep only the part of a result the next step needs.'],
  ['notes',COL.guess,'Summarise a long history instead of resending it.']];
 S_('context-cost','engine','Why keep the context short?',{builds:2,
  body:`<div class="p2-eq">${RD.map(big).join('<span>+</span>')}<span>=</span><b>${big(sum)}</b></div><p class="caption p2-eqc">tokens read over the ${word(RD.length)} rounds</p>
   ${at(2,`<div class="p2-tips">${TIPS.map(([ic,c,t])=>`<div style="--c:${c}">${iconHTML(ic,c,28)}<span>${t}</span></div>`).join('')}</div>`)}`,
  lines:['We pay for every token the model reads. Each round pays again for everything before it.',
   'So we choose what goes into each round. People call this context engineering.'],
  ask:['What happens to this total if a run takes twenty rounds?','Which of these would help in your own chats with ChatGPT or Gemini?'],
  expected:['It grows much faster than the conversation itself, because each round rereads all the rounds before.',
   'Starting a fresh chat for a new topic, instead of one endless conversation. It is the same idea.'],
  point:`Context engineering is choosing what the model reads each round. Every token costs money, and a long context hides what matters. Andrej Karpathy described it (X, ${D.context.karpathy.date}) as filling the context window “with just the right information for the next step”.`,
  misconception:'That a bigger context window solves this. A longer context costs more each round, and models attend less well to what is buried in the middle.',
  transition:'One more question about the context: how would an agent remember you next week?',
  source:`Real run, ${T.date_text}: the tokens read in each of its ${word(RD.length)} rounds.`});
}

// ---------------------------------------------------------------------------------------- 2.2 memory
chap('2.2','Memory');
{
 const M=D.memory;
 S_('memory-q','engine','How would it remember you next week?',{builds:2,
  body:`<div class="p2-q">${request(esc(M.saved_by),{who:'You, this week'})}</div>
   ${at(2,`<div class="p2-two-tools"><div>${chip('pen','save_note','memory')}<span>writes a note to a file</span></div><div>${chip('notes','read_notes','memory')}<span>reads the file back</span></div></div>`)}`,
  lines:['When a run ends, its conversation is gone. Next week the model starts from nothing.',
   'We give it two more tools. A note written in one run can then be read in any later run.'],
  ask:['How would you make it remember this?','Where would a real product keep these notes?'],
  expected:['Write it down somewhere, and read it back next time.','In a database or a document store, one per user. In the notebook, a small text file.'],
  point:'Memory that outlasts a run is text that one tool saves and another reads back. The model itself does not change.',
  misconception:'That the model learns from your conversations as it goes. Its weights do not change; it remembers only what someone stores and feeds back.',
  transition:'Over to the notebook to try it.'});
}

nbRun('nb-memory','engine','2.2','Notes that outlast a run',{
 run:'run_agent(REMEMBER, [read_notes, save_note])\nrun_agent(QUESTION, [read_notes, save_note, get_air_quality])',
 look:['The first run writes a note to a file','Does the second run read it before it answers?'],
 line:'Two separate runs: the first is told about the asthma, the second is asked a question.',
 ask:'The second run starts with an empty conversation. How could it know about the asthma?',
 expected:'Only by reading its notes. Watch for read_notes in its first round.',
 point:'Two runs, two conversations. Only the file connects them.',
 transition:'Here is what happened in our run.'});

{
 const M=D.memory,arr=`<svg viewBox="0 0 44 24" width="44" height="24" aria-hidden="true"><path d="M2 12h32M26 4l10 8-10 8" fill="none" stroke="${BLUE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 const callChips=M.calls.map(c=>c.name==='read_notes'?chip('notes','read_notes','memory'):chip('sensor',esc(c.args.city))).join('');
 const firstWords=(s,n)=>esc(s.split(' ').slice(0,n).join(' '))+' …';
 const [a1,a2]=M.answer.split('. ');
 S_('memory','engine','The second run read its notes first',{builds:2,nb:nb('nb-2-2'),
  body:`<div class="p2-mem">
   <div><p class="p2-h">First run</p>${request(firstWords(M.saved_by,6),{who:'You'})}<div class="chips">${chip('pen','save_note','memory')}</div></div>${arr}
   <div><div class="p2-note"><b>${iconHTML('notes',BLUE,18)}agent_notes.md</b>${esc(M.note)}</div></div>
   ${at(2,arr)}
   ${at(2,`<p class="p2-h">Second run</p>${msg('call',`<div class="chips">${callChips}</div>`)}${msg('model',`${esc(a1)}. ${firstWords(a2,3)}`)}`)}</div>`,
  lines:['Our first run saved one line to a file. Then the run ended, and its conversation was gone.',
   'The second run started empty. In one round, it read its notes and both forecasts.'],
  ask:['What exactly was saved?','Why did it read its notes at all?'],
  expected:[`One sentence of text: “${esc(M.note)}” Nothing about the model changed.`,
   'The read_notes tool says it holds facts about the user, and the question said “for me”. It asked for the notes and both forecasts in the same round.'],
  point:'Memory across runs is a file the agent writes with one tool and reads with another.',
  transition:`Tools, a loop and notes are the parts. Builders put them together in a few common patterns.`,
  source:`Real run, ${T.date_text} (notebook 2.2): ${word(M.steps)} rounds, with ${word(M.calls_n)} tool calls at once in the first. The first request and the answer are shortened here.`});
}

// ---------------------------------------------------------------------------------------- 2.3 patterns
chap('2.3','Patterns');
const PN=D.patterns.names;
S_('patterns','engine','A chain runs the same steps every time',{builds:1,
 body:`${chart([{steps:[{k:'tool',col:COL.target,t:`Get ${word(n1)}\nforecasts`},{k:'tool',col:COL.target,t:`Add up ${word(n2)}\norders`},
   {k:'check',col:COL.green,t:`${Word(W2.totals.length)} totals\nback?`},{k:'model',col:COL.guess,hi:true,t:'Write the\nanswer'}]}],
   {W:1100,bh:140,fs:29,gx:64,alt:'A chain: get the forecasts, add up the orders, check the totals came back, then the model writes the answer'})}
  <div style="margin-top:30px">${ps('If every question had this shape, only the last step would need the model.')}</div>`,
 lines:['The simplest pattern is a chain, like Part 1’s workflow: fixed steps in a fixed order, with a check between them.'],
 ask:['What would break this chain?'],
 expected:['A question of a different shape: four cities, or weather instead of air. The chain does only the steps we wrote.'],
 point:`Prompt chaining is the first of the ${word(PN.length)} patterns in Anthropic’s guide. The guide advises the simplest pattern that does the job.`,
 misconception:'That every AI system needs a free-running agent. Chains and routers are workflows, and most systems in production are workflows.',
 transition:'The second pattern sorts things before anyone works on them. Back to the notebook.',
 source:`The ${word(PN.length)} patterns: Anthropic, “Building effective agents” (${D.patterns.source_date}). This chain is a design, not a recorded run.`});

{
 const R=D.routing,GL=D.routing_gloss,dests=[...new Set(R.map(r=>r.route))],hindi=R.find(r=>GL[r.message]);
 const orList=dests.slice(0,-1).join(', ')+' or '+dests.at(-1);
 nbRun('nb-route','engine','2.3','Routing: one call picks the queue',{
  run:'for message in tickets:\n    print(route(message), "←", message)',
  look:['One short model call for each message','Where does the message in Hindi go?'],
  line:`${Word(R.length)} customer messages, one in Hindi. One short model call picks the queue for each.`,
  ask:'Why use a model to sort these, and not a list of keywords?',
  expected:'Keywords miss new wording and other languages. Watch the message in Hindi.',
  point:'Routing: one cheap model call decides who handles a request.',
  transition:'Here is where each message went in our run.'});

 const RO=[...R].sort((a,b)=>dests.indexOf(a.route)-dests.indexOf(b.route));   // grouped by queue: no arrows cross
 const W=1152,sx=724,qx=920,qw=220,qh=46;let yy=40,g1='';const rows=[];
 for(const r of RO){g1+=label(0,yy,`“${esc(r.message)}”`,{size:26,fill:COL.ink});rows.push({r,y:yy-9});
  if(GL[r.message]){g1+=label(18,yy+32,esc(GL[r.message]),{size:21,fill:MUTED});yy+=32;}
  yy+=66;}
 const H=yy-34,qy={};
 dests.forEach(d=>{const ys=rows.filter(o=>o.r.route===d).map(o=>o.y);qy[d]=ys.reduce((a,b)=>a+b,0)/ys.length;});
 const seen={};let g2='';
 for(const o of rows){const k=seen[o.r.route]=(seen[o.r.route]??-1)+1,n=rows.filter(q=>q.r.route===o.r.route).length,yd=qy[o.r.route]+(n>1?(k-(n-1)/2)*12:0);
  g2+=icon('spark',sx-24,o.y,24,COL.guess)+`<path d="M${sx-6} ${o.y} C${sx+100} ${o.y} ${qx-100} ${yd} ${qx-12} ${yd}" fill="none" stroke="#4B5563" stroke-width="2.4"/>`+`<path d="M${qx-1} ${yd} l-12 -6 v12z" fill="#4B5563"/>`;}
 dests.forEach(d=>{g2+=`<rect x="${qx}" y="${qy[d]-qh/2}" width="${qw}" height="${qh}" rx="10" fill="#FBF7F3" stroke="${COL.amber}" stroke-width="2.6"/>`+label(qx+qw/2,qy[d]+8,esc(d),{size:24,anchor:'middle',fill:COL.ink,weight:650});});
 S_('routing','engine','Each message went to one queue',{builds:2,nb:nb('nb-2-3'),
  body:fig(W,H,g1+gat(2,g2),`Routing: ${word(R.length)} customer messages, one in Hindi, each sent to ${orList} by one model call`),
  lines:[`Our ${word(R.length)} messages. Which queue should each one go to: ${orList}?`,
   `One short model call per message picked the queue. The Hindi message has no English keyword, and still went to ${hindi.route}.`],
  ask:['Where would you send each one?','What would a keyword rule have done with the Hindi message?'],
  expected:['Most of the room will agree with the model. Sorting is easy for a person, and now cheap for a model too.',
   `Missed it: there is no word like “refund” in English in it. The model read it as a refund that has not arrived, and sent it to ${hindi.route}.`],
  point:'Sort first, then hand each request to the right specialist: a person, a cheaper model, or a narrower agent.',
  transition:'The last two patterns use several model calls that work together.',
  source:`Real run, ${T.date_text} (notebook 2.3). The messages are written for the notebook. English gloss of the Hindi message: ours.`});
}

{
 const MU=D.multi;
 let og=`<circle cx="240" cy="44" r="32" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon('spark',240,44,32,COL.guess)+
  label(192,38,'lead call',{size:21,fill:COL.guess,weight:700,anchor:'end'})+label(192,63,'splits the job',{size:19,fill:'#4B5563',anchor:'end'})+
  arrow(276,44,420,44,{stroke:COL.green,w:2.6,head:11})+icon('check',446,44,30,COL.green,{sw:2.6})+label(446,86,'report',{size:19,fill:COL.green,anchor:'middle',weight:650});
 [110,240,370].forEach(x=>{og+=arrow(240+(x-240)*.25,78,x,142,{stroke:'#4B5563',w:2.2,head:10})+
  `<circle cx="${x}" cy="168" r="24" fill="#fff" stroke="${COL.guess}" stroke-width="2.6"/>`+icon('bot',x,168,24,COL.guess)+
  icon('search',x-22,222,22,COL.target)+label(x-6,229,'search',{size:18,fill:COL.target});});
 og+=label(412,166,'helpers,',{size:19,fill:COL.guess})+label(412,190,'in parallel',{size:19,fill:COL.guess});
 const orch=fig(540,246,og,'A lead call sends three helpers to search in parallel, then writes the report');
 const node=(x,ic,t)=>`<circle cx="${x}" cy="56" r="30" fill="#fff" stroke="${COL.guess}" stroke-width="3"/>`+icon(ic,x,56,28,COL.guess)+label(x,110,t,{size:20,fill:COL.guess,anchor:'middle',weight:650});
 const eg=node(60,'pen','writer')+arrow(94,56,152,56,{stroke:'#4B5563',w:2.4,head:10})+icon('file',184,56,40,COL.ink)+label(184,110,'draft',{size:20,anchor:'middle'})+
  arrow(214,56,274,56,{stroke:'#4B5563',w:2.4,head:10})+node(310,'list','critic')+arrow(344,56,420,56,{stroke:COL.green,w:2.6,head:11})+icon('send',450,56,30,COL.green)+label(450,110,'pass: send',{size:20,fill:COL.green,anchor:'middle',weight:650})+
  `<path d="M310 122 V146 H10 V56 H20" fill="none" stroke="${COL.loss}" stroke-width="2.2" stroke-dasharray="7 5"/><path d="M29 56 l-11 -5.5 v11z" fill="${COL.loss}"/>`+
  label(170,174,'fail: the problems go back to the writer',{size:19,fill:COL.loss,anchor:'middle'});
 const evalf=fig(540,186,eg,'A writer drafts, a critic checks the draft against a list; on failure the problems go back to the writer');
 S_('patterns-2','engine','Several model calls can work together',{builds:2,nb:nb('nb-3-4'),
  body:`<div class="compare p2-two"><div class="a"><h3>${PN[3]}</h3>${orch}
    <p class="caption">${kG(`+${num(MU.gain_pct,1)}%`)} on Anthropic’s research eval<br>About ${MU.multi_x}× the tokens of a chat</p></div>
   ${at(2,`<div class="a"><h3>Writer and critic</h3>${evalf}</div>`)}</div>`,
  lines:['A lead call splits the job, and helpers work on the parts in parallel, each with its own context.',
   'One call writes, another checks it against a list, and the writer revises. Part 3’s farm advisory works this way.'],
  ask:['Why would several helpers beat one agent on a research question?','Why use a second call to check the first, rather than asking the writer to be careful?'],
  expected:['Each helper explores one direction with a clean context, and they run at the same time. The price is many more tokens.',
   'A separate check with an explicit list catches what the writer misses, and a person can read and change the list. It is a small eval run on every draft.'],
  point:`Several model calls can do better than one, at a price in tokens: Anthropic reports agents use about ${MU.agent_x}× the tokens of a chat, and multi-agent systems about ${MU.multi_x}×. Anthropic calls these two patterns “${PN[3]}” and “${PN[4]}”.`,
  misconception:'That more agents are always better. For most tasks a single agent, or a workflow, is cheaper and easier to debug.',
  demo:'Notebook 3.4 (Part 3): the writer and critic on today’s forecast.',
  transition:'Every pattern here runs tools. Back to the loop, at the tool step.',
  source:`Anthropic, “How we built our multi-agent research system” (${MU.date}).`});
}

// ---------------------------------------------------------------------------------------- 2.4 MCP
chap('2.4','MCP');
S_('map-tool','engine','Where are we in the loop?',{builds:1,
 body:loopMap({hi:'tool'}),
 lines:['Now the box where our code runs a tool. So far, each tool was a Python function we wrote.'],
 ask:['If Gemini, Claude and ChatGPT should all use your company’s database, how many times do you write that tool?'],
 expected:['Once for each, unless they share a standard. The next slide counts the cost.'],
 point:'Tools connect an agent to your systems. Writing and connecting them is most of the work in practice.',
 transition:'The next slide counts the connectors.'});

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
  g+=label(cx,yc+8,String(hub?n+m:n*m),{size:66,fill:c,anchor:'middle',weight:700})+label(cx,yc+48,hub?'connections':'connectors',{size:20,fill:c,anchor:'middle',weight:650})+
   label(cx,yc+74,hub?`${n} models + ${m} tools`:`${n} models × ${m} tools`,{size:18,anchor:'middle'});
  return fig(W,H,g,hub?`${n} models and ${m} tools joined through MCP: ${n+m} connections`:`${n} models wired to ${m} tools one by one: ${n*m} connectors`);};
 const BUILD_HUB={1:false,2:true};
 register('p2-mcp',(el,ctx)=>{
  if(ctx.printing){el.innerHTML=`<div class="state-slot"><div data-only="1">${draw(MC.n_models,MC.n_tools,false)}</div><div data-only="2">${draw(MC.n_models,MC.n_tools,true)}</div></div>`;return;}
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
 S_('mcp','engine','How many connectors do we need?',{builds:2,nb:nb('nb-5-2'),
  body:widget('p2-mcp','Models wired to tools one by one, or through one shared standard, MCP'),
  lines:[`${Word(MC.n_models)} models and ${word(MC.n_tools)} tools. Without a standard, every pair needs its own connector: ${MC.custom}.`,
   `MCP, the Model Context Protocol, is that standard. Each model and each tool implements it once: ${MC.via}.`],
  ask:['If you add one more tool, how many new connectors do you write?','And with MCP?'],
  expected:[`One per model: ${MC.n_models} more, and every model vendor has to do it.`,'One: the new tool speaks MCP, and every model that speaks MCP can use it.'],
  point:'MCP turns an n × m problem into n + m: write a tool once, and any agent that speaks MCP can use it.',
  misconception:'That MCP makes tools safe. It standardises how tools are connected; a tool result with hidden instructions travels through it just as easily (Part 4).',
  demo:'Drag the sliders: add a tool and watch the count without MCP jump by the number of models. Notebook 5.2 serves our forecast tool over MCP.',
  transition:'Part 2 in one slide.',
  source:'Counts on the slide are arithmetic: n × m against n + m. MCP is an open standard; the specification is at modelcontextprotocol.io.'});
}

recap(2,['Each round rereads the whole conversation, and we pay for it.','Notes saved with a tool outlast a run.',
 'Patterns and MCP are built around the same loop.'],
 'agents at work, and who checks them.',
 {card:{goal:'Suggest a city',model:esc(T.model),
   tools:`${chip('notes','read_notes','memory')} ${chip('pen','save_note')} ${chip('sensor','forecast')}`,memory:'<span class="p2-kB">A notes file</span>',
   stop:`An answer, or ${D.loop.max_steps} rounds`,guard:'Writes only notes',human:'Says what to remember'},
  hi:['tools','memory'],title:'The memory agent',
  ask:'What would you want this agent to remember about you, and what should it never write down?',
  expected:'Preferences help it, but a health condition is sensitive data. Decide what may be stored, for how long, and who can read the notes.',
  point:'An agent is a loop that rereads its context each round; tools, memory and patterns are built around it.',
  transition:'Part 3: agents at work.'});

// ---------------------------------------------------------------------------------------- appendix: kinds of memory
{
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
 const KINDS=[[desk,'The context','What it reads this round.','Cleared when the run ends.'],[book,'Notes','Short facts it saves,','then reads in a later run.'],
  [cab,'Documents','A large store it searches,','taking only the pages it needs.']];
 O('p2-memory-kinds','Three kinds of memory',{builds:1,
  body:fig(W,H,KINDS.map(([f,t,a,b],i)=>f(cx[i])+label(cx[i],232,t,{size:23,fill:B,anchor:'middle',weight:700})+label(cx[i],261,a,{size:20,anchor:'middle',fill:'#374151'})+label(cx[i],287,b,{size:20,anchor:'middle',fill:'#374151'})).join(''),
   'Three kinds of memory: the context, notes and documents'),
  lines:[`Agents use ${word(KINDS.length)} kinds of memory. Which one would hold your company’s policy manual?`],
  ask:['Which kind of memory would hold your company’s policy manual?'],
  expected:['Documents: the agent searches them and quotes the parts it needs (retrieval). Notes hold short facts about a user or a task; the context holds only this run.'],
  point:'The context is cleared after each run; notes and documents are stored outside the model and read back with tools.',
  source:'Drawings: made for the slide.'});
}
