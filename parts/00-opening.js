// The opening: the cover, the question the whole talk returns to, the model on its own (run live in notebook 1.1,
// then the recorded reply), and the plan. Numbers: data/traces.json (scripts/sci/traces.py, from the notebook run).
import {S_,p,ps,request,at,data,need,meta,css,esc,word,kR,kA,
 COL,iconHTML,loopFig,nb,nbRun,PARTS} from '../kit.js';

const T=need(await data('traces'),'alone','agent','check','date_text','model');

css(`.p0-q .req{font-size:34px;line-height:1.35;padding:22px 28px;border-radius:22px 22px 22px 6px}
.p0-q .req b{font-size:16px}
.p0-said blockquote{margin:0;font-size:32px;line-height:1.4;color:#374151;border-left:5px solid var(--muted);padding:6px 0 6px 24px}
.p0-said .verdict{font-size:28px;line-height:1.4;margin-top:22px}
.p0-route{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.p0-route>div{border:2px solid var(--line);border-radius:16px;background:#fff;padding:20px 16px 16px;min-width:0;display:flex;flex-direction:column;gap:10px;min-height:210px}
.p0-route b{font-size:16px;letter-spacing:1px;text-transform:uppercase;color:var(--q)}
.p0-route p{font-size:25px;line-height:1.3;font-weight:650}.p0-route small{font-size:17px;color:var(--muted);margin-top:auto}
.p0-nb{display:flex;align-items:center;gap:14px;font-size:24px;line-height:1.35;margin-top:22px;color:#374151}
@media(max-width:760px){.reading .p0-route{grid-template-columns:minmax(0,1fr)}.reading .p0-q .req{font-size:22px}.reading .p0-said blockquote{font-size:21px}.reading .p0-said .verdict{font-size:19px}}`);

// ---------------------------------------------------------------------------------------- the cover
S_('title','open',meta.title,{builds:1,
 body:`<div class="cover"><div><h1>${meta.title}</h1><p class="sub">${meta.subtitle}</p>
  <p class="who">${meta.series} · ${meta.date}<br>Session: The Engine of Autonomy<br>Nipun Batra · IIT Gandhinagar</p></div>
  ${loopFig({W:600,H:450,at:{},labels:{}})}</div>`,
 lines:['Today we build a small agent together, look at where agents are used, and see how they go wrong.'],
 ask:['Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them do a task for them, start to finish?'],
 expected:['Most hands go up for the first question and few for the second. That gap is what today is about.'],
 point:'An agent is a model that uses tools in a loop until a goal is met. We will build one live.',
 transition:'Let us start with a question.',
 source:'Slides, notebook and sources: github.com/nipunbatra/ai-agents'});

// ---------------------------------------------------------------------------------------- the question
const TASK='Over the next three days I visit Delhi, Ahmedabad and Pune, one city a day, in any order. Which order keeps the PM2.5 I breathe lowest?';
S_('question','open','Let us start with a question',{builds:1,
 body:`<div class="p0-q">${request(TASK,{who:'The question'})}</div>`,
 lines:['Three cities, three days, one city a day. Which order means the cleanest air?'],
 ask:['Take a guess: which order would you choose, and how would you decide?'],
 expected:['Most people say “visit Delhi when its air is best”, but nobody in the room knows tomorrow’s forecast. You would need to look it up.'],
 point:'The answer depends on data nobody in the room has: the air-quality forecast for the next three days.',
 misconception:'That the order cannot matter. It matters because each city’s pollution changes from day to day.',
 transition:'Let us ask a model, the way most people use one: just the question.',
 source:'PM2.5 is fine dust in the air, in micrograms per cubic metre. Higher is worse.'});

nbRun('nb-alone','open','1.1','The model on its own',{
 run:'reply = chat([{"role": "user", "text": TASK}])\nprint(reply["text"])',
 look:['Does it look anything up?','What does it say about the order?'],
 line:'Over to the notebook. We send the question to a Gemini model, with nothing else.',
 ask:'Before it answers: what do you expect it to say?',expected:'Something confident. Watch whether it mentions any forecast numbers.',
 point:'A model on its own can only answer from what it learned in training.',
 transition:'Here is what it said when we ran it.'});

S_('alone-said','open','What did the model say?',{builds:2,
 body:`<div class="p0-said"><blockquote>“${esc(T.alone.excerpt.trim())}”</blockquote>
  ${at(2,`<p class="verdict">${kR('It never looked at a forecast.')} And the order does matter: the worst order means ${Math.round(T.check.extra_pct)}% more PM2.5 than the best.</p>`)}</div>`,
 lines:[`Our run on ${T.date_text}. It wrote ${T.alone.words} words, and this is the key sentence.`,
  'It answered from what it learned in training. It had no way to know the next three days.'],
 ask:['Is this answer right?','What would it need to get it right?'],
 expected:['It sounds reasonable, but it is wrong: each city’s air changes from day to day, so the order changes the total.',
  'Tomorrow’s forecast for each city, and a way to add up the totals. In other words, tools.'],
 point:'A model on its own is confident even when it has no data. By the end of Part 1 the same model will get this right.',
 misconception:'That a newer model would know. No model can know the next three days from its training data.',
 transition:'Here is the plan.',
 source:`Real reply (${esc(T.model)}, ${T.date_text}, notebook 1.1), shortened to its key sentence. Your run will word it differently.`});

// ---------------------------------------------------------------------------------------- the plan
const ROUTE=[['spark'],['zap'],['building'],['alert'],['approve']];
const mins=meta.sections.filter(s=>PARTS.some(pp=>pp[0]===s.id)).map(s=>s.minutes);
S_('route','open','Today’s plan',{builds:1,nb:nb('part-0','▶ The notebook'),
 body:`<div class="p0-route">${ROUTE.map(([ic],i)=>`<div>${iconHTML(ic,COL.guess,40)}<b>Part ${i+1}</b><p>${PARTS[i][1]}</p><small>${mins[i]} minutes</small></div>`).join('')}</div>
  <p class="p0-nb">${iconHTML('code',COL.target,30)}<span>We switch between these slides and a notebook. You can run it too, with a free Gemini key.</span></p>`,
 lines:['Five parts. When a slide says “In the notebook”, we switch over and run the code live.'],
 ask:['Which part matters most for your work?'],
 expected:['Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.'],
 point:'A map of the talk, and the rhythm: a few slides, then a run in the notebook.',
 transition:'Part 1: what an agent is.',source:'Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb). Open it in Colab from the link at the top right.'});
