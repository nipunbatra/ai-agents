// Part 1: what an agent is. The model alone, a tool call (real), the loop (real run), the seven questions of the agent
// card, workflow or agent, and the autonomy dial (a live figure). Real runs: data/traces.json (notebook Part 1).
import {S_,p,ps,small,request,cols,at,only,answer,takeaway,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,
 fig,label,arrow,gat,COL,MUTED,icon,iconHTML,chip,loopFig,lanes,msg,jsonHTML,agentCard,chart,
 widget,register,slider,num,nb,partBreak,recap,chap} from '../kit.js';

const T=need(await data('traces'),'agent','check','model','date_text'),A=T.agent,C=T.check;

css(`.p1-tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.p1-tiles>div{border:2px solid var(--line);border-radius:14px;background:#fff;padding:12px 14px;min-width:0}
.p1-tiles b{display:block;font-size:21px;margin:8px 0 4px}.p1-tiles p{font-size:19px;line-height:1.35;color:#374151}
.p1-flow{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:18px;align-items:start}
.p1-flow>div{display:flex;flex-direction:column;gap:12px;min-width:0}
.p1-flow pre.json{font-size:20px;line-height:1.45}.p1-flow .msg.model .mb{font-size:21px}
.p1-flow p{display:flex;gap:10px;align-items:flex-start;font-size:21px;line-height:1.35}.p1-flow p>svg{flex:none;margin-top:2px}
.p1-who{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:18px;font-size:24px;line-height:1.35}
.p1-who li{display:flex;gap:14px;align-items:flex-start}.p1-who li>svg{flex:none;margin-top:2px}
.p1-turns{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
.p1-turns li{border-left:5px solid var(--q);padding:4px 0 4px 14px;font-size:22px;line-height:1.35}
.p1-turns small{display:block;font-size:18px;color:var(--muted)}
.p1-level{font-size:21px;line-height:1.3;margin-top:10px}
.p1-level b{color:var(--q)}
.p1-wf .loopfig svg{max-height:380px}.p1-wf>div>.diagram-scroll:not(.loopfig) svg{max-height:170px}.p1-wf .small{margin:14px 0 16px}
.msgs pre.json{font-size:17px}
@media(max-width:760px){.reading .p1-tiles{grid-template-columns:1fr 1fr}}`);

partBreak(1,'What an agent is','A language model only writes text. Give it tools and a loop, and it can act. This part builds that picture, then asks how much freedom to give it.',
 ['What a model can and cannot do alone','How a model asks for a tool','The loop that makes it an agent','How much autonomy to give it'],
 {img:'part-what.jpg',alt:'Illustration: a small helper reaching for tools on a desk',nb:nb('part-1'),
  line:'By the end of this part you can say, in one sentence, what makes a chatbot an agent.',
  ask:'In your own words, what is an AI agent?',expected:'Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we will sharpen them.',
  transition:'Start with what a model is on its own.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 1.1 the model alone
chap('1.1','The model alone');
{
 const W=1152,H=150,y=70;
 const g=`<rect x="20" y="${y-38}" width="300" height="76" rx="14" fill="#AA4E0812" stroke="${COL.amber}" stroke-width="2.5"/>`+
  icon('person',62,y,30,COL.amber)+label(92,y+8,'your words',{size:24,fill:COL.amber,weight:650})+
  arrow(330,y,470,y,{stroke:'#4B5563',w:3})+
  `<circle cx="560" cy="${y}" r="62" fill="#fff" stroke="${COL.guess}" stroke-width="3.5"/>`+icon('spark',560,y-8,40,COL.guess)+label(560,y+36,'a model',{size:20,fill:COL.guess,anchor:'middle',weight:650})+
  arrow(632,y,772,y,{stroke:'#4B5563',w:3})+
  `<rect x="782" y="${y-38}" width="350" height="76" rx="14" fill="#8B2CDE0D" stroke="${COL.guess}" stroke-width="2.5"/>`+
  icon('chat',824,y,30,COL.guess)+label(856,y+8,'likely next words',{size:24,fill:COL.guess,weight:650});
 const LIM=[['sensor','Today’s data','It has never seen tomorrow’s forecast or your sales figures.'],
  ['code','Exact sums','It predicts digits; long arithmetic slips.'],
  ['send','Acting','It cannot send the email or book the ticket.'],
  ['notes','Memory','It forgets you when the conversation ends.']];
 S_('alone','what','On its own, a model only writes text',{builds:2,
  body:`${fig(W,H,g,'Your words go into a model, and likely next words come out')}
   ${at(2,`<div class="p1-tiles">${LIM.map(([ic,t,d])=>`<div>${iconHTML(ic,COL.loss,30)}<b>${t}</b><p>${d}</p></div>`).join('')}</div>`)}`,
  lines:['A model reads text and writes the most likely next words. However clever it sounds, that is all it does.',
   'So on its own it cannot see today’s data, cannot be trusted with long sums, cannot act, and forgets you.'],
  ask:['If a model only predicts words, how did it write a correct-looking answer about Delhi’s air?','Which of these limits matters most in your job?'],
  expected:['From patterns in its training text: Delhi is usually polluted in winter. Plausible, unchecked.','Usually live data and acting on systems. Both are fixed the same way: with tools.'],
  point:'A language model is a text predictor. Everything an agent adds comes from outside the model.',
  misconception:'That newer models “know” current facts. They know their training data, which ends at a cut-off date.',
  transition:'So how does a text predictor get at a forecast? It asks.'});
}

// ---------------------------------------------------------------------------------------- 1.2 a tool call
chap('1.2','A tool call');
{
 const c0=A.turns[0].calls[0],r0=A.turns[0].results[0].result;
 S_('tool-call','what','A tool call is a request written as text',{builds:3,nb:nb('part-1'),
  body:`<div class="p1-flow"><div>${msg('call',jsonHTML({name:c0.name,args:c0.args}),{note:'written by the model'})}
    <p>${iconHTML('spark',COL.guess,26)}<span>${kA('The model writes a request.')} It cannot run anything itself.</span></p></div>
   ${at(2,`<div>${msg('tool',jsonHTML({city:r0.city,pm25_daily_mean:r0.pm25_daily_mean}),{note:'returned by our code'})}
    <p>${iconHTML('plug',COL.target,26)}<span>${kT('Our program runs it')} against a real forecast service.</span></p></div>`)}
   ${at(3,`<div>${msg('model',esc(A.answer_short),{note:'the answer'})}
    <p>${iconHTML('eye',COL.guess,26)}<span>${kA('The model reads the result')} and answers.</span></p></div>`)}</div>`,
  lines:['Given an air-quality tool, the model’s first reply is not an answer. It is a request, in a format a program can read.',
   'Our code, not the model, calls the forecast service. The result goes back into the conversation.',
   'Now the model has facts to reason over, and it answers with them.'],
  ask:['Who actually fetched the forecast: the model or our program?','Why is it safer that the model only writes requests?','What else could a tool be?'],
  expected:['Our program. The model only wrote the request.','Because our program decides which requests to carry out. That is where guardrails live (Part 4).',
   'Anything with an interface: a database query, sending an email, a calculator, a search, a robot arm.'],
  point:'Function calling: the model writes a structured request, your code executes it and returns the result.',
  misconception:'That the model connects to the internet itself. It never does; your code does, and only for the tools you gave it.',
  demo:'Notebook 1.2: print the request, run get_air_quality by hand, hand back the result.',
  transition:'Do that over and over, automatically, and you have an agent.',
  source:`Real request and result from the run on ${T.date_text} (${esc(T.model)}); one of the ${word(A.turns[0].calls.length)} requests it made at once.`});
}

// ---------------------------------------------------------------------------------------- 1.3 the loop
chap('1.3','The loop');
{
 const t=A.turns,sums=t[1].calls.length;
 S_('the-loop','what','The loop is the engine',{builds:3,nb:nb('part-1'),
  body:cols(loopFig({W:620,H:470,at:{act:1,tools:1,observe:2,loop:2,stop:3},tools:['sensor','code','database','mail','globe']}),
   `<ol class="p1-turns">${at(1,`<li><b>Turn 1</b> · asks for ${word(t[0].calls.length)} forecasts at once<small>${num(t[0].usage.input,0)} tokens read</small></li>`)}
    ${at(2,`<li><b>Turn 2</b> · asks for ${word(sums)} sums, one per order<small>${num(t[1].usage.input,0)} tokens read</small></li>`)}
    ${at(3,`<li style="border-color:var(--d)"><b>Turn 3</b> · answers: ${esc(C.best.order.join(', then '))}<small>${num(t[2].usage.input,0)} tokens read · ${word(A.calls)} tool calls in all</small></li>`)}</ol>`,'1.15fr 1fr'),
  lines:['Think: the model reads everything so far and decides what to do. Act: our code runs the tools it asked for.',
   'Observe: the results join the conversation, and the model thinks again, now with more facts.',
   `It stops when it answers, or when a limit is hit. Our run went round ${word(t.length-1)} times, then answered.`],
  ask:['What decides whether the loop goes round again?','Why did it ask for six sums in one go?','What would make the loop never stop?'],
  expected:['The model: if its reply contains a tool request, the loop continues; if not, that reply is the answer.',
   'They do not depend on each other, so it asked for all of them at once. We told it to (Part 2).','A tool that keeps failing, or a goal that is never met. So we always set a step limit (Part 4).'],
  point:'An agent is a model, tools and a loop: think, act, observe, until done.',
  demo:'Notebook 1.3: run_agent prints each turn in these colours.',
  transition:'Seven questions describe any agent. Here they are for this one.',
  source:`The turns of the real run on ${T.date_text}: ${num(A.seconds,0)} seconds of model time, about ₹${num(A.cost_inr,2)} at paid prices.`});
}

// ---------------------------------------------------------------------------------------- 1.4 the agent card
const CARD={goal:'The cleanest order for three city visits',model:esc(T.model),
 tools:`${chip('sensor','forecast')} ${chip('code','calculator')}`,memory:'The conversation',
 stop:'An answer, or 10 steps',guard:'Read-only tools',human:'Reads the answer'};
S_('agent-card','what','Seven questions describe any agent',{builds:2,
 body:cols(`${only('1',agentCard(CARD,{hi:['goal','model','tools'],dim:true,title:'The agent we just ran'}))}${only('2',agentCard(CARD,{hi:['memory','stop','guard','human'],dim:true,title:'The agent we just ran'}))}`,
  `${at(1,ps('What does it do, and with what?'))}${at(2,`<div style="margin-top:18px">${ps('What could go wrong, and who stops it?')}</div>`)}`,'1.6fr 1fr'),
 lines:['Goal, model and tools make an agent work. Here they are for the run we just watched.',
  'The other four make it safe to use. We will come back to each of them, and to this card, for every application.'],
 ask:['Which of the seven would you check first before letting an agent near your work?','Which of these four is missing from most demos you have seen?'],
 expected:['Usually tools and guardrails: what can it touch, and what can it change?','Guardrails and the person. Demos show the happy path.'],
 point:'The agent card: goal, model, tools, memory, stopping rule, guardrails, person.',
 transition:'Not every job needs this much freedom. Sometimes a fixed workflow is better.'});

// ---------------------------------------------------------------------------------------- 1.5 workflow or agent
chap('1.4','How much autonomy');
{
 const wf=chart([{steps:[{t:'Read the\ninvoice',k:'step 1'},{t:'Match the\norder',k:'step 2'},{t:'Post to\naccounts',k:'step 3'}]}],{W:560,bh:110,fs:22,gx:46,alt:'A fixed workflow of three steps'});
 S_('workflow','what','A workflow or an agent?',{builds:3,
  body:`<div class="compare p1-wf"><div class="b"><h3 style="color:var(--p)">A workflow</h3>${wf}${ps('You fix the steps in advance. The model fills in each one.')}
    ${at(3,takeaway('If you can draw the flowchart in advance, build a workflow. Use an agent when the next step depends on what it finds.'))}</div>
   ${at(2,`<div class="a"><h3 style="color:var(--q)">An agent</h3>${loopFig({W:620,H:470,tools:[],hub:false})}</div>`)}</div>`,
  lines:['A workflow: the steps are written down in advance, like an invoice that is always read, matched and posted.',
   'An agent: the model chooses the next step each time, as ours did when it decided to add up six orders.',
   'Workflows are cheaper and more predictable. Pay for an agent only when the path really varies.'],
  ask:['Is processing an invoice a workflow or an agent?','What in our air-quality task could not be fixed in advance?','Name one task in your team that is really a workflow.'],
  expected:['A workflow, mostly; an agent only for the odd invoice that does not match.','How many lookups and sums were needed depended on the request and the data.','Monthly reports, onboarding checklists, standard approvals.'],
  point:'Anthropic’s distinction: workflows follow predefined code paths; agents direct their own process and tool use.',
  misconception:'That everything with a language model in it should be an agent. Most production systems are workflows.',
  transition:'And when it is an agent, how much freedom do we give it?',
  source:'Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).'});
}

// ---------------------------------------------------------------------------------------- 1.6 the autonomy dial

const LEVELS=[
 ['Operator','You do the work. The agent helps when you ask.',[['you','mail','Read\nemail'],['agent','pen','Draft\nreply'],['you','database','Check\norder'],['you','rupee','Refund'],['you','send','Send']]],
 ['Collaborator','You and the agent work on it together; either can take over.',[['agent','mail','Read\nemail'],['agent','pen','Draft\nreply'],['you','pen','Edit\ntogether'],['tools','database','Look up\norder'],['you','rupee','Refund'],['you','send','Send']]],
 ['Consultant','The agent does the work and asks you for judgement.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['agent','list','Plan'],['you','chat','Answer its\nquestion'],['tools','rupee','Refund'],['tools','send','Send\nreply']]],
 ['Approver','The agent does the work and stops for your sign-off before money moves.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['tools','file','Check\npolicy'],['agent','pen','Prepare\nrefund'],['you','approve','Approve','check'],['tools','rupee','Refund'],['tools','send','Send\nreply']]],
 ['Observer','The agent runs on its own. You watch the log and can switch it off.',[['tools','mail','Read\nemail'],['tools','database','Look up\norder'],['tools','file','Check\npolicy'],['tools','rupee','Refund'],['tools','send','Send\nreply'],['you','eye','Read\nthe log']]]];
const levelFig=k=>{const [name,desc,st]=LEVELS[k-1];
 return `${lanes(st.map(([lane,ic,t,kind])=>({lane,icon:ic,t,kind})),{W:1152,laneH:96,fs:18,alt:`The refund task at level ${k}, ${name}`})}<p class="p1-level"><b>Level ${k} · ${name}.</b> ${desc}</p>`;};
const BUILD_LEVEL={1:1,2:4,3:5};   // the level the dial shows at each click; you can still drag it
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
S_('autonomy','what','Autonomy is a dial you set',{builds:3,
 body:`${request('A customer says the mixer grinder (order 5512, ₹3,200) arrived damaged and asks for a refund.',{who:'The task'})}${widget('p1-autonomy','The refund task at five levels of autonomy, from operator to observer')}`,
 lines:['The same refund at five settings of the dial. At level 1 you do the work, and the agent drafts when asked.',
  'At level 4 the agent does everything up to the refund, then waits for your approval. Notice where the amber step sits.',
  'At level 5 you only read the log. Which level would you allow for refunds in your company?'],
 ask:['At which level does the agent first touch a real system?','Why put the approval just before the refund, and not at the start?','What would make you move this dial up a notch?'],
 expected:['Level 2: it looks up the order. Reading is low risk.','Because the refund is the step that cannot be undone. Everything before it is cheap to redo.',
  'Evidence: a test set of past refunds it handles correctly, and a cap on the amount (Part 5).'],
 point:'Autonomy is a design decision, separate from how capable the model is. You choose the level per task.',
 misconception:'That a more capable model should automatically get more autonomy. Capability and permission are different questions.',
 demo:'Drag the dial from 1 to 5 and watch the person’s steps move from doing to approving to watching.',
 transition:'Part 1 in one slide.',
 source:'The five levels and their names: Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (arXiv 2506.12469, 2025). The refund is from the notebook’s demo inbox.'});

recap(1,['A tool call is text that a program carries out.','An agent loops: think, act, observe, until done.','Autonomy is a dial you set for each task.'],
 'one real run, step by step, with what the model read and what it cost.',
 {card:CARD,title:'The agent card, filled in for our run',ask:'Which line of the card would change if this agent could also book your train tickets?',
  expected:'Tools (a booking tool), guardrails (a spending cap) and the person (approve before paying).',point:'The vocabulary for the rest of the talk.',transition:'Part 2: inside the engine.'});
