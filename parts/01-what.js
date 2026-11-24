// Part 1: what an agent is. Slow and hands-on: the model alone, a tool (written and run in the notebook), the reply as a
// request, the loop drawn as a flowchart one box at a time, our real run, a check of its answer, workflow or agent, and
// the five levels of autonomy (a live figure). Each "In the notebook" slide is a live run; the slide after it shows the
// recorded run (data/traces.json, notebook sections 1.2 to 1.6).
import {S_,p,ps,small,request,cols,at,only,takeaway,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,code,
 fig,label,arrow,gat,COL,MUTED,icon,iconHTML,chip,loopFig,loopMap,lanes,msg,jsonHTML,agentCard,chart,
 widget,register,slider,num,big,nb,nbRun,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'agent','check','alone','model','date_text'),A=T.agent,C=T.check;

css(`.p1-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 26px}
.p1-tiles>div{display:flex;gap:16px;align-items:flex-start;border:2px solid var(--line);border-radius:16px;background:#fff;padding:16px 20px;min-width:0}
.p1-tiles>div>svg{flex:none;margin-top:4px}
.p1-tiles b{display:block;font-size:26px;margin-bottom:4px}.p1-tiles p{font-size:23px;line-height:1.35;color:#374151}
.p1-call{display:grid;grid-template-columns:1.2fr 1fr;gap:30px;align-items:center}
.p1-call pre.json{font-size:24px;line-height:1.5;padding-left:10px}.p1-call .msg .mb{font-size:22px}.p1-call .tchip{font-size:21px}
.p1-json{border:1px solid #E1E6EB;border-left:4px solid var(--p);background:#F4F6F8;border-radius:10px;padding:16px 24px}.p1-json pre.json{font-size:25px;line-height:1.5}
.p1-said{font-size:26px;line-height:1.4;display:flex;gap:12px;align-items:flex-start}.p1-said>svg{flex:none;margin-top:4px}
.p1-turns{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:22px}
.p1-turns li{border-left:6px solid var(--q);padding:6px 0 6px 20px;font-size:29px;line-height:1.35}
.p1-turns small{display:block;font-size:21px;color:var(--muted);margin-top:2px}
.p1-turns .chips{margin-top:8px}
.p1-two{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:start}
.p1-two>div{border-top:5px solid var(--line);padding-top:12px;min-width:0}
.p1-two h3{font-size:26px;margin-bottom:12px;display:flex;align-items:center;gap:10px}
.p1-two .bot{border-color:var(--muted)}.p1-two .bot h3{color:var(--muted)}.p1-two .ag{border-color:var(--q)}.p1-two .ag h3{color:var(--q)}
.p1-two blockquote{margin:0;font-size:24px;line-height:1.4;color:#374151}.p1-two .verdict{font-size:24px;line-height:1.4;margin-top:14px}
.p1-levels{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;font-size:27px;line-height:1.3}
.p1-levels li{display:grid;grid-template-columns:52px 210px 1fr;gap:14px;align-items:baseline}
.p1-levels .n{font-size:30px;font-weight:700;color:var(--q);text-align:right}.p1-levels b{color:var(--ink)}.p1-levels span{color:#374151}
.p1-level{font-size:22px;line-height:1.3;margin-top:10px}.p1-level b{color:var(--q)}
.p1-wf{margin-top:16px}.p1-wf .loopfig svg{max-height:330px}.p1-wf .small{margin:6px 0 0}.p1-wf>div>.diagram-scroll:not(.loopfig) svg{max-height:170px}.p1-wf .small{margin:14px 0 16px}
@media(max-width:760px){.reading .p1-tiles,.reading .p1-call,.reading .p1-two{grid-template-columns:minmax(0,1fr)}.reading .p1-turns li{font-size:20px}.reading .p1-levels{font-size:19px}.reading .p1-levels li{grid-template-columns:30px 120px 1fr}}`);

partBreak(1,'What an agent is','A model on its own only writes text. We give it a tool and a loop, and it gets the opening question right.',
 ['What a model can do on its own','Give it a tool','Put it in a loop','How much should it decide alone?'],
 {img:'part-what.jpg',alt:'Illustration: a small helper reaching for tools on a desk',nb:nb('nb-1-1'),
  line:'Key question: what does an agent have that a model on its own does not?',
  ask:'In your own words, what is an AI agent?',expected:'Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we will sharpen them by the end of this part.',
  transition:'Start with what a model is on its own.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 1.1 the model alone
chap('1.1','The model alone');
{
 const W=1152,H=170,y=85;
 const g=`<rect x="20" y="${y-42}" width="300" height="84" rx="16" fill="#AA4E0812" stroke="${COL.amber}" stroke-width="2.5"/>`+
  icon('person',64,y,32,COL.amber)+label(96,y+9,'your words',{size:26,fill:COL.amber,weight:650})+
  arrow(330,y,470,y,{stroke:'#4B5563',w:3})+
  `<circle cx="560" cy="${y}" r="70" fill="#fff" stroke="${COL.guess}" stroke-width="3.5"/>`+icon('spark',560,y-10,44,COL.guess)+label(560,y+40,'a model',{size:22,fill:COL.guess,anchor:'middle',weight:650})+
  arrow(640,y,772,y,{stroke:'#4B5563',w:3})+
  `<rect x="782" y="${y-42}" width="350" height="84" rx="16" fill="#8B2CDE0D" stroke="${COL.guess}" stroke-width="2.5"/>`+
  icon('chat',826,y,32,COL.guess)+label(860,y+9,'likely next words',{size:26,fill:COL.guess,weight:650});
 S_('alone','what','On its own, a model only writes text',{builds:1,
  body:fig(W,H,g,'Your words go into a model, and likely next words come out'),
  lines:['A language model reads text and writes the words most likely to come next. That is all it does.'],
  ask:['If it only predicts words, how did it write a confident answer about Delhi’s air?'],
  expected:['From patterns in its training text: Delhi is often polluted in winter. It sounded right, but nothing checked it.'],
  point:'A language model is a text predictor. Everything an agent adds comes from outside the model.',
  transition:'So what can it not do on its own?'});

 const LIM=[['sensor','Today’s data','It has never seen tomorrow’s forecast or your sales figures.'],
  ['code','Exact sums','It predicts digits, so long arithmetic can slip.'],
  ['send','Acting','It cannot send the email or book the ticket.'],
  ['notes','Memory','It forgets you when the conversation ends.']];
 S_('limits','what','What can a model not do on its own?',{builds:2,
  body:`<div class="p1-tiles">${LIM.map(([ic,t,d],i)=>at(i<2?1:2,`<div>${iconHTML(ic,COL.loss,34)}<div><b>${t}</b><p>${d}</p></div></div>`)).join('')}</div>`,
  lines:['It has not seen today’s data, and it does not really calculate.','It cannot act on anything, and it does not remember you next time.'],
  ask:['Which of these did our question need?','Which of these limits matters most in your job?'],
  expected:['Today’s data: tomorrow’s forecasts. And some exact sums to compare the orders.','Usually live data and acting on systems. Both are fixed the same way: with tools.'],
  point:'Each limit is fixed from outside the model, by giving it tools.',
  misconception:'That newer models “know” current facts. They know their training data, which ends at a cut-off date.',
  transition:'So let us give it a tool.'});
}

// ---------------------------------------------------------------------------------------- 1.2 a tool
chap('1.2','A tool');
S_('tool-fn','what','A tool is an ordinary Python function',{builds:1,
 body:`${code(`@tool
def get_air_quality(city: str, days: int = 3) -> dict:
    """Forecast of PM2.5 for a city: one daily mean per day,
    starting tomorrow."""
    ...   # asks a public forecast service, returns the numbers`)}
  ${small('The <span class="mono">@tool</span> line turns the function’s name, description and arguments into an entry the model can read.')}`,
 lines:['Our tool fetches the PM2.5 forecast for one city. It is plain Python that asks a public forecast service.'],
 ask:['What would you need to write a tool like this for your own work?'],
 expected:['A function that does one thing, such as a database query or an API call, and a clear description of it.'],
 point:'A tool is a normal function. The only new thing is the description the model will read.',
 transition:'Let us write it in the notebook.',
 source:'The forecast comes from CAMS, served free by Open-Meteo. The full function is in the notebook, section 1.2.'});

nbRun('nb-tool','what','1.2','Write a tool',{
 run:'print(json.dumps(get_air_quality.schema, indent=1))',
 look:['A name, a description and two arguments','No Python code: the model will never see the code'],
 line:'We define the tool and print what the model will be shown.',
 ask:'Why might the model not need to see the code?',expected:'It never runs the code. It only needs to know what the tool does and what to pass in.',
 point:'The model reads only a description of the tool. It never sees the code.',
 transition:'This is the entry the model reads.'});

S_('tool-menu','what','The model sees only this entry',{builds:2,
 body:cols(`${only('1',`<div class="p1-json">${jsonHTML({name:'get_air_quality',description:'PM2.5 forecast for a city',parameters:{city:'string, e.g. "Pune"',days:'integer, 1 to 4'}})}</div>`)}
   ${only('2',`<div class="p1-json">${jsonHTML({name:'get_data',description:'Gets data.',parameters:{x:'string'}})}</div>`)}`,
  `${only('1',ps(`${kT('Name')}, ${kT('description')} and ${kT('arguments')}: that is all the model knows about the tool.`))}
   ${only('2',ps(`${kR('Suppose the entry said only this.')} Which tool would the model pick, and what would it pass in?`))}`,'1.35fr 1fr'),
 lines:['This is all the model knows about our tool: a name, a description and two arguments.','A vague entry leaves the model guessing. The description is all it has to go on.'],
 ask:['What does the description tell the model that the name does not?','What would the model do with get_data(x)?'],
 expected:['What comes back, in what units, and from when: daily means, starting tomorrow.','Guess. It might call it for anything, or never. A clear description fixes that.'],
 point:'The description is the only manual the model gets. Say what the tool does and what comes back, with an example.',
 transition:'Now we ask our question again.',
 source:'Simplified from the entry the notebook prints in section 1.2.'});

// ---------------------------------------------------------------------------------------- 1.3 a tool call
chap('1.3','A tool call');
nbRun('nb-ask','what','1.3','Ask again, with the tool',{
 run:'reply = chat(messages, tools=[get_air_quality])\nprint(reply["calls"])',
 look:['The reply has no answer in it','What does it ask for?'],
 line:'Back to the notebook. Same question, same model, but now the tool is on offer.',
 ask:'What do you think comes back this time?',expected:'Not an answer. Watch the reply.',
 point:'With a tool on offer, the model can reply with a request instead of an answer.',
 transition:'Here is what came back in our run.'});

{
 const c0=A.turns[0].calls[0];
 S_('tool-call','what','The reply is a request, not an answer',{builds:2,
  body:`<div class="p1-call"><div>${msg('call',jsonHTML({name:c0.name,args:c0.args}))}</div>
   <div><p class="p1-said">${iconHTML('spark',COL.guess,28)}<span>${kA('The model wrote a request.')} It cannot run anything itself.</span></p>
   ${at(2,`<p class="p1-said" style="margin-top:20px">${iconHTML('sensor',COL.target,28)}<span>It asked for ${word(A.turns[0].calls.length)} cities at once: <span class="chips">${A.turns[0].calls.map(c=>chip('sensor',esc(c.args.city))).join(' ')}</span></span></p>`)}</div></div>`,
  lines:['The model replied with a request in a fixed format: which tool, and with which arguments.',`It asked for all ${word(A.turns[0].calls.length)} cities in one go, because none of the forecasts depends on another.`],
  ask:['Who will actually fetch the forecast: the model or our program?','Why is it safer that the model only writes requests?'],
  expected:['Our program. The model only wrote the request.','Because our program decides which requests to carry out. That is where the safety checks of Part 4 go.'],
  point:'This is function calling: the model writes a structured request, and our code decides whether to run it.',
  misconception:'That the model connects to the internet itself. It never does. Our code does, and only for the tools we gave it.',
  transition:'Back to the notebook.',
  source:`Real request from our run on ${T.date_text} (${esc(T.model)}).`});
}

nbRun('nb-run','what','1.4','Run the request, return the result',{
 run:'result = get_air_quality(**call["args"])\nmessages.append({"role": "tool", "result": result, ...})',
 look:['Real forecast numbers come back','Then we call the model again, with the results'],
 line:'Our code runs each request and adds the result to the conversation. Then we ask the model again.',
 ask:'What will the model do once it has the numbers?',expected:'Use them: compare the orders and answer. Or ask for something else it needs.',
 point:'Our code runs the tool and hands back the result. The model only asked for it.',
 transition:'Here is one result from our run.'});

{
 const r0=A.turns[0].results[0].result;
 S_('tool-result','what','The result goes back into the conversation',{builds:2,
  body:`<div class="p1-call"><div>${msg('tool',jsonHTML({city:r0.city,pm25_daily_mean:r0.pm25_daily_mean}),{note:'returned by our code'})}</div>
   <div><p class="p1-said">${iconHTML('zap',COL.target,28)}<span>${kT('Our code called the forecast service')} and added what came back.</span></p>
   ${at(2,`<p class="p1-said" style="margin-top:20px">${iconHTML('refresh',COL.guess,28)}<span>${kA('Then the model reads everything again')} and decides what to do next.</span></p>`)}</div></div>`,
  lines:[`Delhi’s forecast, as our code got it. Pune and Ahmedabad came back the same way.`,
   'Doing this by hand, one request at a time, gets tedious. A real task may need ten rounds.'],
  ask:['Which day is worst in Delhi?','What should happen automatically instead of by hand?'],
  expected:[`The middle day: ${num(Math.max(...Object.values(r0.pm25_daily_mean)),1)} µg/m³.`,'Ask the model, run what it asks for, hand back the results, and repeat. That repetition is the agent.'],
  point:'One request, one result. An agent repeats this until the model stops asking.',
  transition:'So we put it in a loop.',
  source:`Real result from our run on ${T.date_text}. CAMS forecast via Open-Meteo, in µg/m³.`});
}

// ---------------------------------------------------------------------------------------- 1.4 the loop
chap('1.4','The loop');
S_('loop-map','what','Put it in a loop',{builds:3,
 body:loopMap({at:{ask:2,answer:2,tool:3,result:3}}),
 lines:['You give a goal. The model reads the conversation so far and writes a reply.',
  'If the reply asks for no tool, it is the answer, and we stop.',
  'If it asks for a tool, our code runs it and adds the result. Then the model reads everything again.'],
 ask:['What starts the loop?','When does it stop?','What would make it never stop?'],
 expected:['A goal from a person.','When the model replies without asking for a tool.','A tool that keeps failing, or a goal that is never met. So we always add a step limit (Part 4).'],
 point:'An agent is a model, some tools and this loop. We will come back to this flowchart all through the talk.',
 transition:'This loop is a few lines of Python. Let us run it.'});

nbRun('nb-loop','what','1.5','Put it in a loop',{
 run:'run = run_agent(TASK, [get_air_quality, calculator])',
 look:['Purple blocks are the model, teal blocks are tool results','How many times does it go round?'],
 line:'We give the loop two tools, the forecast and a calculator, and the original question.',
 ask:'How many rounds do you expect?',expected:'At least two: one for the forecasts, one for the sums. Then the answer.',
 point:'The agent decides the steps itself: which tools, in what order, and when to stop.',
 transition:'Here is our recorded run, round by round.'});

{
 const t=A.turns;
 S_('loop-run','what',`Our run went round ${word(t.length)} times`,{builds:3,
  body:`<ol class="p1-turns">${at(1,`<li><b>Round 1</b> · asked for ${word(t[0].calls.length)} forecasts at once<div class="chips">${t[0].calls.map(c=>chip('sensor',esc(c.args.city))).join(' ')}</div></li>`)}
   ${at(2,`<li><b>Round 2</b> · asked the calculator for ${word(t[1].calls.length)} sums, one for each possible order<small>It did no arithmetic itself.</small></li>`)}
   ${at(3,`<li style="border-color:var(--d)"><b>Round 3</b> · answered: ${esc(C.best.order.join(', then '))}<small>${num(A.seconds,0)} seconds of model time, about ₹${num(A.cost_inr,2)}</small></li>`)}</ol>`,
  lines:['First it fetched the three forecasts, all at once.','Then it added up every possible order with the calculator.','Then it stopped asking for tools and answered.'],
  ask:['Who decided to add up six orders?','Why use a calculator instead of doing the sums itself?','How did our code know it was done?'],
  expected:['The model. We never told it how to solve the problem.','A model predicts digits; a calculator computes them. We asked it to use tools for arithmetic.','The reply asked for no tool, so the loop stopped.'],
  point:'The model chose the steps. Our code only ran the tools and kept the conversation.',
  transition:'But was the answer right? We can check: there are only six orders.',
  source:`Real run on ${T.date_text} (${esc(T.model)}): ${word(A.calls)} tool calls in all.`});
}

nbRun('nb-check','what','1.6','Check the answer',{
 run:'for order in permutations(CITIES):\n    print(order, sum(...))',
 look:['Six orders, six totals','Is the agent’s order the lowest?'],
 line:'We work out all six totals ourselves, from the same forecasts the agent saw.',
 ask:'Why check at all, if the agent showed its sums?',expected:'Because an agent can be wrong and sound sure. Checking against something we trust is how we find out.',
 point:'Checking an answer against something you trust is the habit that Part 4 turns into evals.',
 transition:'Here are the six totals.'});

{
 const O=C.orders,W=1100,H=330,L=380,R=110,bh=36,gap=14,max=Math.max(...O.map(o=>o.total));
 const x=v=>L+v/max*(W-L-R);
 let g='';
 O.forEach((o,i)=>{const y=12+i*(bh+gap),best=i===0,worst=i===O.length-1,c=best?COL.green:worst?COL.loss:'#AAB3BC';
  g+=label(L-14,y+bh/2+8,esc(o.order.join(' → ')),{size:23,fill:best?COL.green:worst?COL.loss:COL.ink,anchor:'end',weight:best||worst?700:''})+
   `<rect x="${L}" y="${y}" width="${(x(o.total)-L).toFixed(1)}" height="${bh}" rx="6" fill="${c}"${best||worst?'':' opacity=".7"'}/>`+
   label(x(o.total)+10,y+bh/2+8,num(o.total,1),{size:23,fill:COL.ink,weight:best||worst?700:''});});
 S_('check','what','Was the agent right?',{builds:2,
  body:`${fig(W,H,g,'Total PM2.5 over three days for each of the six possible orders')}
   ${at(2,`<p class="p1-said">${iconHTML('check',COL.green,30)}<span>${kG('Yes.')} The agent picked ${esc(C.best.order.join(', then '))}: the lowest total. The worst order means ${Math.round(C.extra_pct)}% more.</span></p>`)}`,
  lines:['Total PM2.5 over the three days, for each of the six orders, from the same forecasts.','The agent’s order is at the top. The model on its own had said the order does not matter.'],
  ask:['Which order is best, and which is worst?','Was the model on its own right that the order does not matter?'],
  expected:[`Best: ${C.best.order.join(', ')}. Worst: ${C.worst.order.join(', ')}.`,`No. The worst order means ${Math.round(C.extra_pct)}% more PM2.5 than the best.`],
  point:'The agent’s answer matches our own check. The model on its own was wrong.',
  transition:'So, side by side: the same model, twice.',
  source:`Totals in µg/m³, summed over ${C.dates[0]} to ${C.dates.at(-1)} from the CAMS forecast via Open-Meteo, as fetched on ${T.date_text}.`});
}

S_('same-model','what','The same model, two answers',{builds:1,
 body:`<div class="p1-two"><div class="bot"><h3>${iconHTML('chat','currentColor',26)}The model on its own</h3>
   <blockquote>“…the order does not affect your total…”</blockquote><p class="verdict">${kR('A guess.')} It never looked at a forecast.</p></div>
  <div class="ag"><h3>${iconHTML('spark','currentColor',26)}The model with tools, in a loop</h3>
   <div class="chips">${A.calls_list.slice(0,3).map(c=>chip('sensor',esc(c.args.city))).join('')}${chip('code',`${word(A.turns[1].calls.length)} sums`)}</div>
   <p class="verdict">${esc(A.answer_short).replace(/ µg/g,'&nbsp;µg')}</p></div></div>`,
 lines:['Both answers came from the same model. The only difference is the tools and the loop.'],
 ask:['So what is an agent?'],
 expected:['A model that uses tools in a loop until it has done what you asked. Compare with the answers collected at the start of the part.'],
 point:'An agent is a model, tools and a loop. It is not a different, smarter kind of model.',
 misconception:'That agents run on a special model. This one is the same Gemini model as the chatbot reply.',
 transition:'Does every job need this much freedom? Not always.',
 source:`Both replies are real (${esc(T.model)}, ${T.date_text}, notebook 1.1 and 1.5), shortened.`});

// ---------------------------------------------------------------------------------------- 1.5 workflow or agent
chap('1.5','How much freedom');
{
 const wf=chart([{steps:[{t:'Read the\ninvoice',k:'step 1'},{t:'Match the\norder',k:'step 2'},{t:'Post to\naccounts',k:'step 3'}]}],{W:1000,bh:120,fs:28,gx:70,alt:'A fixed workflow of three steps'});
 S_('workflow','what','Some jobs have fixed steps',{builds:1,
  body:`${wf}${ps('The steps never change, so we write them down in advance. A model can still do each step, such as reading the invoice.')}`,
  lines:['Paying an invoice is always the same three steps. A fixed list of steps like this is called a workflow.'],
  ask:['Name one task in your team that always follows the same steps.'],
  expected:['Monthly reports, onboarding checklists, standard approvals.'],
  point:'A workflow fixes the steps in advance; the model fills in each one.',
  transition:'So when is an agent worth it?',
  source:'Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).'});

 const wf2=chart([{steps:[{t:'Read'},{t:'Match'},{t:'Post'}]}],{W:560,bh:100,fs:26,gx:46,alt:'A fixed workflow of three steps'});
 S_('agent-or-workflow','what','When is an agent worth it?',{builds:2,
  body:`<div class="compare p1-wf"><div class="b"><h3 style="color:var(--p)">A workflow</h3>${wf2}${ps('Cheaper, faster, and easy to predict.')}</div>
   <div class="a" data-at="2"><h3 style="color:var(--q)">An agent</h3>${loopFig({W:620,H:470,tools:[],hub:false})}${ps('It picks the next step from what it finds.')}</div></div>`,
  lines:['A workflow follows the steps we wrote down. It is cheaper and easier to predict.','An agent chooses its own steps. Use one only when the steps change from case to case.'],
  ask:['Is processing an invoice a workflow or an agent?','In our air-quality question, what could not be fixed in advance?'],
  expected:['A workflow, mostly. An agent only for the odd invoice that does not match.','How many lookups and sums it needed depended on the question and the data.'],
  point:'Anthropic’s distinction: workflows follow steps written in advance; agents direct their own steps and tool use. If you can draw the flowchart in advance, build a workflow.',
  misconception:'That everything with a language model in it should be an agent. Most systems in production are workflows.',
  transition:'And when it is an agent, how much should it decide without a person?',
  source:'Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).'});
}

// ---------------------------------------------------------------------------------------- 1.6 five levels of autonomy
const LEVELS=[
 ['Operator','You do the work. The agent helps when you ask.',[['you','mail','Read\nemail'],['you','database','Check\norder'],['agent','pen','Draft\nreply'],['you','send','Edit and\nsend'],['you','rupee','Refund']]],
 ['Collaborator','You and the agent work on it together; either can take over.',[['agent','mail','Read\nemail'],['agent','pen','Draft\nreply'],['you','pen','Edit\ntogether'],['tools','database','Look up\norder'],['you','rupee','Refund'],['you','send','Send']]],
 ['Consultant','The agent does the work and asks you for judgement.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['agent','list','Plan'],['you','chat','Answer its\nquestion'],['tools','rupee','Refund'],['tools','send','Send\nreply']]],
 ['Approver','The agent does the work and stops for your approval before money moves.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['tools','file','Check\npolicy'],['agent','pen','Prepare\nrefund'],['you','approve','Approve','check'],['tools','rupee','Refund'],['tools','send','Send\nreply']]],
 ['Observer','The agent runs on its own. You watch the log and can switch it off.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['agent','list','Decide'],['tools','rupee','Refund'],['tools','send','Send\nreply'],['you','eye','Read\nthe log']]]];
const PERSON=['do the work','work alongside it','answer its questions','approve its work','watch the log'];
S_('levels','what','How much should it decide without you?',{builds:2,
 body:`<ol class="p1-levels">${LEVELS.map(([n],i)=>at(i<2?1:2,`<li><span class="n">${i+1}</span><b>${n}</b><span>You ${PERSON[i]}.</span></li>`)).join('')}</ol>`,
 lines:['One paper names five levels by what the person does. At the first two, you do most of the work.','At the top three, the agent does the work, and you answer, approve or watch.'],
 ask:['At which level do most people use ChatGPT today?','Which level would you allow for your team’s work?'],
 expected:['Level 1 or 2: you ask, it helps, you do the rest.','It depends on the task. The next slide and Part 3 come back to this.'],
 point:'Autonomy is a choice you make for each task, separate from how capable the model is.',
 transition:'Here is one task, a refund, at each level.',
 source:'The five levels and their names: Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (arXiv 2506.12469, 2025).'});

const levelFig=k=>{const [name,desc,st]=LEVELS[k-1];
 return `${lanes(st.map(([lane,ic,t,kind])=>({lane,icon:ic,t,kind})),{W:1152,laneH:90,fs:19,gap:4,left:204,alt:`The refund task at level ${k}, ${name}`})}<p class="p1-level"><b>Level ${k} · ${name}.</b> ${desc}</p>`;};
const BUILD_LEVEL={1:1,2:4};   // the level the slider shows at each click; you can still drag it
register('p1-autonomy',(el,ctx)=>{
 if(ctx.printing){el.innerHTML=`<div class="state-slot">${Object.entries(BUILD_LEVEL).map(([b,k])=>`<div data-only="${b}">${levelFig(k)}</div>`).join('')}</div>`;return;}
 el.innerHTML=`<div class="w-fig"></div><div class="w-controls">${slider('lvl','Autonomy level',1,5,1,1)}</div>`;
 const f=el.querySelector('.w-fig'),s=el.querySelector('[data-k="lvl"]'),o=el.querySelector('[data-o="lvl"]');
 const show=()=>{f.innerHTML=levelFig(+s.value);o.textContent=`${s.value} · ${LEVELS[s.value-1][0]}`;};
 s.addEventListener('input',show);s.addEventListener('change',()=>s.blur());
 const scene=el.closest('.scene');
 new MutationObserver(()=>{const k=BUILD_LEVEL[scene.dataset.build];if(k&&+s.value!==k){s.value=k;show();}}).observe(scene,{attributes:true,attributeFilter:['data-build']});
 show();
});
S_('autonomy','what','One refund at five levels',{builds:2,
 body:`${request('A customer asks for a ₹3,200 refund for a damaged mixer grinder.',{who:'The task'})}${widget('p1-autonomy','The refund task at five levels of autonomy, from operator to observer')}`,
 lines:['At level 1 you do the work. The agent only drafts the reply. Drag the slider to see the other levels.',
  'At level 4 the agent does everything up to the refund, then waits for your approval: the amber step.'],
 ask:['At which level does the agent first touch a real system?','Why put the approval just before the refund, and not at the start?'],
 expected:['Level 2: it looks up the order. Reading is low risk.','Because the refund is the step that cannot be undone. Everything before it is cheap to redo.'],
 point:'You choose the level per task. The approval goes just before the step that cannot be undone.',
 misconception:'That a more capable model should automatically get more autonomy. Capability and permission are different questions.',
 demo:'Drag the slider from 1 to 5 and watch the person’s steps move from doing to approving to watching.',
 transition:'Part 1 in one slide.',
 source:'The refund is from the notebook’s demo inbox. Levels: Feng, McDonald and Zhang (2025).'});

const CARD={goal:'Cleanest order for three cities',model:esc(T.model),
 tools:`${chip('sensor','forecast')} ${chip('code','calculator')}`,memory:'The conversation',
 stop:'An answer, or 10 rounds',guard:'Read-only tools',human:'Reads the answer'};
recap(1,['A tool call is a request; our code runs it.','The loop repeats until the model stops asking for tools.','You choose how much it decides alone.'],
 'one run, round by round, and what it costs.',
 {card:CARD,title:'Our agent',ask:'Which line would change if this agent could also book your train tickets?',
  expected:'Tools (a booking tool), guardrails (a spending cap) and the person (approves before paying).',point:'The seven lines of this card come back for every agent in the talk.',transition:'Part 2: one run, step by step.'});
