// The opening: the cover (the whole run, replayed in a terminal), two failing tests, the one-sentence request, the
// agent fixing it, and the plan. Everything shown is the recorded run: data/traces.json (scripts/sci/traces.py).
import {S_,ps,request,at,only,data,need,meta,css,esc,word,Word,num,kG,kA,
 COL,iconHTML,nb,PARTS,term,diff,tree,toolCall,callText,statement,tailLines,isTest,testRows,hl} from '../kit.js';

const T=need(await data('traces'),'agent','check','alone','model','date_text'),A=T.agent;
const tests=A.steps.filter(isTest),fail=tests[0],pass=tests.at(-1);
const failed=(fail.result.match(/(\d+) failed/)||[])[1]||'2';
/** The project, as the agent first finds it. */
export const PROJECT=['README.md','billing.py','test_billing.py','data/','  purchase_orders.csv','inbox/','  10 files, badly named','invoices/','  6 supplier invoices'];
/** Terminal rows for a failing test run: the command, each failing test's name with its assertion, and the summary. */
export function failRows(s,{at=0,cmd=s.args.command}={}){
 const base=testRows(s,{at}),rows=[];let name='';
 for(const l of s.result.split('\n').map(x=>x.trimEnd())){
  const h=l.match(/^_{3,}\s+(\S+)\s+_{3,}$/);if(h){name=h[1];continue;}
  if(name&&/^E\s+\w*Error/.test(l)){rows.push({out:`____ ${name} ____`,at},{out:l.replace(/^E\s+/,'E   '),kind:'hot',at});name='';}
 }
 return rows.length?[{cmd,at},...rows,base.at(-1)]:[{cmd,at},...base.slice(1)];
}

css(`.p0-cover{display:grid;grid-template-columns:1fr 1.12fr;gap:40px;align-items:center}
.p0-cover h1{font-size:76px;line-height:1;letter-spacing:-2.6px;margin-bottom:16px}
.p0-cover .sub{font-size:30px;line-height:1.3;color:var(--q);text-wrap:balance}.p0-cover .term .out.dim{opacity:.9}.p0-cover .who{font-size:21px;color:var(--muted);margin-top:30px;line-height:1.5}
.scene#title>header h2{display:none}
.p0-broken{align-items:stretch}.p0-broken .win{flex:1;display:flex;flex-direction:column}.p0-broken .win-body{flex:1}
.p0-q{display:flex;justify-content:center}
.p0-q .req{width:fit-content;max-width:900px;font-size:46px;line-height:1.25;padding:34px 44px 38px;border-radius:30px 30px 30px 8px;gap:18px;text-wrap:balance}.p0-q .req b{font-size:17px;margin-bottom:8px}.p0-q .req>svg{width:34px;height:34px;margin-top:0}
.p0-calls{display:flex;flex-direction:column;gap:10px;counter-reset:call}
.p0-calls .tc{flex-direction:row;align-items:center;gap:12px;padding:8px 14px;counter-increment:call;animation:slidein .35s ease both;animation-delay:calc(var(--i)*.42s)}
.p0-calls .tc::before{content:counter(call);flex:none;width:28px;height:28px;border-radius:50%;background:var(--q);color:#fff;font:700 16px/28px var(--font);text-align:center}
.p0-calls .tc code{font-size:18px;white-space:pre}.p0-calls .tc-who{display:none}
.p0-watch .state-slot{align-items:center}.p0-watch .state-slot>div{display:flex;flex-direction:column;gap:16px}
.reveal-hidden .p0-calls .tc{animation:none}
.p0-route{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.p0-route>div{border:2px solid var(--line);border-top:6px solid var(--q);border-radius:16px;background:#fff;padding:22px 18px 18px;min-width:0;display:flex;flex-direction:column;gap:12px;min-height:250px}
.p0-route b{font-size:16px;letter-spacing:1px;text-transform:uppercase;color:var(--q)}
.p0-route p{font-size:26px;line-height:1.25;font-weight:650;text-wrap:balance}.p0-route small{font-size:18px;color:var(--muted);margin-top:auto}
.p0-nb{display:flex;align-items:center;gap:14px;font-size:24px;line-height:1.35;margin-top:26px;color:#374151}
@media(max-width:760px){.reading .p0-cover,.reading .p0-route{grid-template-columns:minmax(0,1fr)}.reading .p0-cover h1{font-size:44px}.reading .p0-q .req{font-size:24px;padding:18px 20px}.reading .p0-calls .tc code{white-space:pre-wrap;font-size:14px}}`);

// ---------------------------------------------------------------------------------------- the cover
const replay=[{cmd:'python -m pytest -q'},{out:testRows(fail).at(-1).out,kind:'bad'},{cmd:'agent "fix the failing tests"'},
 ...A.steps.map(s=>({out:'  → '+callText(s.name,s.args,34),kind:'dim'})),{out:testRows(pass).at(-1).out,kind:'ok'}];
S_('title','open',meta.title,{builds:1,
 body:`<div class="p0-cover"><div><h1>${meta.title}</h1><p class="sub">${meta.subtitle}</p>
  <p class="who">${meta.series} · ${meta.date}<br>Session: The Engine of Autonomy<br>Nipun Batra · IIT Gandhinagar</p></div>
  ${term(replay,{title:'a real run, replayed',size:'s'})}</div>`,
 lines:['Today we build this: a small agent that finds a bug and fixes it. Then we give it other jobs, and try to break it.'],
 ask:['Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them finish a whole task for them?'],
 expected:['Most hands go up for the first question and few for the second. That gap is what today is about.'],
 point:'An agent is a model that uses tools in a loop until a goal is met. We will build one live.',
 transition:'Start with a real problem.',
 source:`The terminal replays our recorded run (${esc(T.model)}, ${T.date_text}). Slides and notebook: github.com/nipunbatra/ai-agents`});

// ---------------------------------------------------------------------------------------- a real problem
S_('broken','open','A small project, and two failing tests',{builds:2,
 body:`<div class="duo p0-broken" style="--l:.8fr;--r:1.5fr"><div>${tree('workspace/',PROJECT,{marks:{'test_billing.py':[['2','run']]}})}</div>
  <div>${term(failRows(fail,{at:2,cmd:'python -m pytest -q'}),{size:'l'})}</div></div>`,
 lines:['This folder belongs to a small stationery shop: its billing code, some tests, an inbox and some invoices.',
  `We run the tests. ${Word(+failed)} of ${word(T.check.passed)} fail, and we do not know why yet.`],
 ask:['What would you do first if this were your project?','What do the two failing tests have in common?'],
 expected:['Read the error, then open the code it points to. Remember that order: the agent will do the same.','Both involve a discount. The two tests without a discount pass.'],
 point:'A real, small problem: the code runs, but two tests say the answers are wrong.',
 transition:'We could debug it ourselves. Instead we ask in one sentence.',
 source:`Real output from our run on ${T.date_text}. The project is made up for this talk; the notebook creates it.`});

S_('the-ask','open','We ask in one sentence',{builds:1,
 body:`<div class="p0-q">${request(esc(A.goal),{who:'Our request'})}</div>`,
 lines:['We do not say which file, which test, or what is wrong.'],
 ask:['Could a chatbot do this, if we typed this sentence into it?'],
 expected:['No: it cannot see the folder or run anything. Hold that thought; we try it in a few minutes.'],
 point:'The request names a goal. It gives no steps.',
 transition:'Here is what happened when we gave that sentence to an agent.'});

S_('watch','open',`${num(A.seconds,0)} seconds later, the tests pass`,{builds:2,
 body:`<div class="duo p0-watch" style="--l:1.05fr;--r:1.2fr"><div class="p0-calls">${A.steps.map((s,i)=>toolCall(s.name,s.args,{max:40,i})).join('')}</div>
  <div>${only('1',term(testRows(fail),{size:'s',title:'Terminal · before'}))}
   ${only('2',diff('billing.py',[['-',T.check.minus[0]],['+',T.check.plus[0]]],{size:'s'})+term(testRows(pass),{size:'s',title:`Terminal · ${num(A.seconds,0)} seconds later`}))}</div></div>`,
 lines:[`The agent made ${word(A.calls)} requests, one after another. Nobody told it which ones.`,
  `It changed one line of the billing code, and all ${word(T.check.passed)} tests pass.`],
 ask:['Read the six requests. What is it doing?','Is the new line right?'],
 expected:['Looking around, running the tests, reading the code, changing it, and running the tests again. What a careful programmer does.',
  'Yes. A 10 percent discount should take off 10 percent of the amount. The old line took off the number 10.'],
 point:'Given a goal and a few tools, the model chose the steps itself and checked its own work.',
 misconception:'That this needed a huge model in a data centre. This run used an open model, Gemma 4, on a laptop.',
 transition:'How does that work? That is the plan for today.',
 source:`Our recorded run: ${esc(T.model)}, ${T.date_text}, ${A.rounds} rounds, ${num(A.seconds,1)} seconds of model time on a laptop.`});

// ---------------------------------------------------------------------------------------- the plan
const ICON=['spark','zap','building','alert','approve'];
const mins=meta.sections.filter(s=>PARTS.some(pp=>pp[0]===s.id)).map(s=>s.minutes);
S_('route','open','Today’s plan',{builds:1,nb:nb('part-0','▶ The notebook'),
 body:`<div class="p0-route">${PARTS.map(([,name],i)=>`<div>${iconHTML(ICON[i],COL.guess,40)}<b>Part ${i+1}</b><p>${name}</p><small>${mins[i]} minutes</small></div>`).join('')}</div>
  <p class="p0-nb">${iconHTML('code',COL.target,30)}<span>The notebook runs in Colab on an open model, Gemma 4. It needs no key.</span></p>`,
 lines:['Five parts. When a slide says “In the notebook”, we switch over and run the code.'],
 ask:['Which part matters most for your work?'],
 expected:['Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.'],
 point:'A map of the talk, and its rhythm: a few slides, then a run in the notebook.',
 transition:'Part 1: from a model to an agent.',source:'Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb). Open it in Colab from the link at the top right.'});
