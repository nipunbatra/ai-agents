// The opening: the cover, one request sent to a chatbot and to an agent (a real run), the three eras, METR's
// time-horizon chart, and the route of the talk. Numbers: data/metr.json (scripts/sci/metr.py),
// data/facts.json (scripts/sci/facts.py), data/traces.json (scripts/sci/traces.py, from the notebook run).
import {S_,p,ps,small,request,at,only,answer,data,need,meta,css,esc,word,Word,kY,kA,kT,kR,kG,
 fig,label,line,dot,arrow,gat,COL,MUTED,AX,icon,iconHTML,chip,loopFig,nb,PARTS,num} from '../kit.js';

const APPS=need(await data('apps'),'apps','families'),M=need(await data('metr'),'points','trend'),F=need(await data('facts'),'timeline'),T=need(await data('traces'),'alone','agent','check');

css(`.p0-vs{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:start}
.p0-vs>div{border-top:5px solid var(--line);padding-top:10px;min-width:0}
.p0-vs .bot{border-color:var(--muted)}.p0-vs .ag{border-color:var(--q)}
.p0-vs h3{font-size:24px;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.p0-vs .ag h3{color:var(--q)}.p0-vs .bot h3{color:var(--muted)}
.p0-vs blockquote{margin:0;font-size:21px;line-height:1.4;color:#374151}
.p0-vs .verdict{font-size:22px;line-height:1.35;margin-top:8px}
.p0-eras{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.p0-eras>div>div{border:2px solid var(--line);border-radius:16px;background:#fff;padding:14px 18px;height:100%}
.p0-eras h3{font-size:27px;margin:6px 0 2px}.p0-eras .yr{font-size:18px;color:var(--muted);font-weight:650}
.p0-eras ul{margin:10px 0 0;padding-left:20px;font-size:20px;line-height:1.4}.p0-eras li{margin:4px 0}
.p0-eras .e1 h3{color:var(--muted)}.p0-eras .e2 h3{color:var(--p)}.p0-eras .e3 h3{color:var(--q)}
.p0-eras .e3>div{border-color:#8B2CDE66}
.p0-route{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.p0-route>div{border:2px solid var(--line);border-radius:16px;background:#fff;padding:22px 18px 16px;min-width:0;display:flex;flex-direction:column;min-height:330px}
.p0-route b{display:block;font-size:16px;letter-spacing:1px;text-transform:uppercase;color:var(--q);margin:14px 0 6px}
.p0-route p{font-size:24px;line-height:1.3}.p0-route small{display:block;font-size:16px;color:var(--muted);margin-top:auto;padding-top:8px}
@media(max-width:760px){.reading .p0-vs,.reading .p0-eras,.reading .p0-route{grid-template-columns:minmax(0,1fr)}}`);

const MON='Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const when=d=>{const [y,mo]=d.split('-');return `${MON[+mo-1]} ${y}`;};
/** A horizon in minutes, the way the slides say it. */
const dur=min=>min<1?`${Math.round(min*60)} seconds`:min<90?`${Math.round(min)} minutes`:`${num(min/60,min<600?1:0)} hours`;

// ---------------------------------------------------------------------------------------- the cover
S_('title','open',meta.title,{builds:1,
 body:`<div class="cover"><div><h1>${meta.title}</h1><p class="sub">${meta.subtitle}</p>
  ${ps(`A language model that can use tools, in a loop, until a job is done. What that is, where it already works, where it fails, and how to start.`)}
  <p class="who">${meta.series} · ${meta.date}<br>Nipun Batra · IIT Gandhinagar</p></div>
  ${loopFig({W:600,H:450,at:{},labels:{}})}</div>`,
 lines:['The picture on the right is the whole idea. By the end of the talk every part of it will mean something.'],
 ask:['Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them carry out a task for them?'],
 expected:['Most hands go up for the first question and few for the second. That gap is the subject of the talk.'],
 point:'An agent is a model that acts: it uses tools in a loop until a goal is met.',
 transition:'Let us start with one request, sent to two systems.',
 source:`Slides, notebook and sources: ${'github.com/nipunbatra/ai-agents'}`});

// ---------------------------------------------------------------------------------------- one request, two systems
const A=T.agent,C=T.check,best=C.orders[0];
const alone=T.alone.excerpt.trim();
S_('ask-vs-do','open','The same request, two systems',{builds:3,nb:nb('part-1'),
 body:`${request(`Over the next three days I visit Delhi, Ahmedabad and Pune, one city a day. Which order keeps the PM2.5 I breathe lowest?`)}
 <div class="p0-vs"><div class="bot"><h3>${iconHTML('chat','currentColor',24)}A chatbot</h3>
   ${only('2',`<blockquote>“${esc(alone)}”</blockquote>`)}${only('3',`<blockquote>“…the order does not affect your total…”</blockquote><p class="verdict">${kR('A guess.')} It never looked at a forecast.</p>`)}</div>
  <div class="ag"><h3>${iconHTML('spark','currentColor',24)}An agent</h3>
   ${at(3,`<div class="chips">${A.calls_list.map(c=>chip('sensor',esc(c.args.city))).join('')}</div>
   <p class="verdict" style="margin-top:10px">${esc(A.answer_short)}</p>
   <p class="caption" style="margin-top:6px">${word(A.turns[0].calls.length)} forecasts and ${word(A.turns[1].calls.length)} sums · ${num(A.seconds,0)} s · ₹${num(A.cost_inr,2)}</p>`)}</div></div>`,
 lines:['Typed into two systems on '+T.date_text+'. The question needs the next three days of air, which no model has memorised.',
  'The chatbot answers fluently from training data. It sounds sure, and it never looked anything up.',
  `The agent asked for ${word(A.calls_list.length)} forecasts, added up all six orders, and answered with the numbers.`],
 ask:['Which of the two would you trust with this decision, and why?','What did the chatbot get wrong?','What did the agent do that the chatbot could not?'],
 expected:['The one that checks real data. Hold the answer until both have replied.',`It could not know the forecast, so it said the order does not matter. The forecast says the worst order means ${num(C.extra_pct,0)}% more PM2.5 than the best.`,
  'It asked for live data, then reasoned over it. Same model; the difference is the tools and the loop.'],
 point:'Both answers came from the same model. The agent had tools and a loop that used them.',
 misconception:'That agents run on a different, smarter kind of model. Both answers here came from the same model.',
 demo:'Run Part 1 of the notebook live: the model alone, then run_agent with the air-quality tool.',
 transition:'This shift, from answering to acting, happened in about four years.',
 source:`Both replies are real (${esc(T.model)}, ${T.date_text}, notebook Part 1); the request is shortened here. Forecast: CAMS via Open-Meteo.`});

// ---------------------------------------------------------------------------------------- three eras
const ERAS=[['e1','chat','It answers',F.timeline.filter(e=>e.era===1)],['e2','plug','It uses tools',F.timeline.filter(e=>e.era===2)],
 ['e3','bot','It does the job',F.timeline.filter(e=>e.era===3)]];
const yrs=es=>{const a=es[0].date.slice(0,4),b=es.at(-1).date.slice(0,4);return a===b?a:`${a} to ${b}`;};
S_('eras','open','From answering to acting, in four years',{builds:3,
 body:`<div class="p0-eras">${ERAS.map(([c,ic,t,es],i)=>at(i+1,`<div class="${c}"><div>${iconHTML(ic,i===0?MUTED:i===1?COL.target:COL.guess,34)}
  <h3>${t}</h3><span class="yr">${yrs(es)}</span><ul>${es.map(e=>`<li><b>${when(e.date)}</b> · ${esc(e.what)}</li>`).join('')}</ul></div></div>`)).join('')}</div>`,
 lines:['First, a model that answers. You type, it writes back, and the conversation is all it knows.',
  'Then the model learns to ask for tools in a format programs can read, even to operate a screen, and tools get a common plug called MCP.',
  'Now products hand the model a goal and let it work for minutes or hours.'],
 ask:['What could ChatGPT not do at launch that you now take for granted?','Why would a fixed format for tool requests matter so much?','Which of these have you used?'],
 expected:['Look things up, run code, read your files, act on websites.','Because then any program can read the request and carry it out. It is the bridge from text to action.',
  'Many will have used deep research or a coding assistant; few will have let an agent act on a website.'],
 point:'The models improved, and the larger change came from giving them tools and letting them run in a loop.',
 transition:'How long a task can such an agent now finish on its own? Someone measures that.',
 source:'Dates from the companies’ announcements; see SOURCES.md.'});

// ---------------------------------------------------------------------------------------- the time horizon
{
 const W=1100,H=450,L=124,Rr=30,Tp=14,B=52,x0=2019,x1=2026.6,ymin=Math.log10(.5/60),ymax=Math.log10(1800);
 const X=v=>L+(v-x0)/(x1-x0)*(W-L-Rr),Y=min=>H-B-(Math.log10(min)-ymin)/(ymax-ymin)*(H-Tp-B);
 const ticks=[[1/60,'1 second'],[1,'1 minute'],[10,'10 minutes'],[60,'1 hour'],[8*60,'8 hours'],[24*60,'1 day']];
 let axes=line(L,H-B,W-Rr,H-B,{stroke:AX})+line(L,Tp,L,H-B,{stroke:AX});
 for(const [v,t] of ticks)axes+=line(L,Y(v),W-Rr,Y(v),{stroke:'#E5E7EB',w:1})+label(L-10,Y(v)+7,t,{size:18,anchor:'end'});
 for(let yr=2019;yr<=2026;yr++)axes+=line(X(yr),Tp,X(yr),H-B+6,{stroke:'#EEF0F2',w:1})+line(X(yr),H-B,X(yr),H-B+6,{stroke:AX})+label(X(yr),H-B+28,String(yr),{size:19,anchor:'middle'});
 const cut=16*60,lim=label(X(2019.1),Y(cut)-8,'above 16 hours, METR calls its measurement unreliable',{size:16,fill:COL.loss});
 const stage=p=>p.year<2023?1:p.date<'2025-06-01'?2:3;
 const PLACE={'GPT-4':[-12,-14,'end'],'Claude 3.7 Sonnet':[-14,-10,'end'],'GPT-5':[-14,-10,'end'],'Claude Opus 4.6':[-96,-2,'end',1]};
 const draw=k=>M.points.filter(p=>stage(p)===k).map(p=>{const x=X(p.year),y=Y(p.p50),c=p.sota?COL.guess:'#B9A6CF';
  return line(x,Y(Math.max(p.lo,.5/60)),x,Y(Math.min(p.hi,1800)),{stroke:c,w:1.5,extra:'opacity=".45"'})+
   (p.p50>cut?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="#fff" stroke="${c}" stroke-width="2.5"/>`:dot(x,y,p.sota?7:5.5,{fill:c}))+
   (p.label?(([dx,dy,an,lead])=>(lead?line(x+dx+4,y+dy+5,x-5,y-5,{stroke:'#4B5563',w:1.5}):'')+label(x+dx,y+dy,esc(p.name)+' · '+dur(p.p50),{size:17,fill:COL.ink,anchor:an,halo:true}))(PLACE[p.name]||[12,-10,'start']):'');}).join('');
 const t=M.trend,ty=v=>Y(2**(t.slope_per_year*v+t.intercept));
 const trend=line(X(t.x0),ty(t.x0),X(t.x1),ty(t.x1),{stroke:COL.guess,w:2.5,dash:'8 6'})+
  label(X(2023.3),ty(2023.3)+46,`our fit: doubles every ${Math.round(M.doubling_days_since_2023)} days`,{size:19,fill:COL.guess,weight:650,halo:true});
 const g=axes+draw(1)+gat(2,draw(2))+gat(3,draw(3)+trend+line(L,Y(cut),W-Rr,Y(cut),{stroke:COL.loss,w:1.2,dash:'4 5'})+lim);
 const by=Object.fromEntries(M.points.map(p=>[p.name,p]));
 S_('horizon','open','How long a task can an agent finish on its own?',{builds:3,
  body:fig(W,H,g,'METR time horizons: the length of task, in human time, that frontier AI agents complete half the time, by release date, on a log scale'),
  lines:[`METR times how long each task takes a skilled person, then finds the task length an agent finishes half the time. In 2019: about ${dur(by['GPT-2'].p50)}.`,
   `GPT-4 in 2023: about ${dur(by['GPT-4'].p50)}. Claude 3.7 Sonnet in early 2025: about ${dur(by['Claude 3.7 Sonnet'].p50)} of a person’s work.`,
   `In 2026, about ${dur(by['Claude Opus 4.6'].p50)}. Our fit to METR’s data since 2023: the length doubles about every ${Math.round(M.doubling_days_since_2023/30.4)} months.`],
  ask:['What would you guess the number was for the first ChatGPT models?','What kind of tasks take a skilled person an hour?','If the trend held for two more years, what would that mean for your work?'],
  expected:['Under a minute: they could finish only tiny, self-contained steps.','Fixing a small bug, writing a short analysis, cleaning a dataset: tasks with several steps and checks.',
   'Six doublings, so tasks of months. Treat it as a trend line and no more: the tasks are mostly software, and success is only 50%.'],
  point:'Agents are getting better at long tasks fast, and the measure is human working time, which managers understand.',
  misconception:`The 12 hours for Claude Opus 4.6 has a 95% interval of about ${Math.round(by['Claude Opus 4.6'].lo/60)} to ${Math.round(by['Claude Opus 4.6'].hi/60)} hours, and the doubling time is our own fit (METR’s published fits: about 196 days over the whole trend, about 89 days for models since 2024). Also: 50% success on a 12-hour task does not mean it does your 12-hour job. It fails half the time, the tasks are self-contained software tasks, and the 80% horizon is several times shorter.`,
  transition:'So what is inside these agents? Here is today’s route.',
  source:`Vertical axis: length of task (time a skilled person needs) that the agent completes half the time, log scale. METR Time Horizon 1.1 (metr.org/time-horizons), fetched ${M.fetched}; bars are 95% intervals; hollow points are above 16 hours.`});
}

// ---------------------------------------------------------------------------------------- the route
const ROUTE=[['spark','What an agent is','A model, tools and a loop'],
 ['zap','Inside the engine','One real run, step by step'],
 ['building','Agents at work',`${Word(APPS.apps.length)} jobs in ${word(APPS.families.length)} families`],
 ['alert','When the engine stalls','Errors, poisoned inputs, guardrails'],
 ['approve','In your organisation','What to hand over, and how']];
const mins=meta.sections.filter(s=>PARTS.some(pp=>pp[0]===s.id)).map(s=>s.minutes);
S_('route','open','Today’s route',{builds:1,nb:nb('part-0','▶ The notebook'),
 body:`<div class="p0-route">${ROUTE.map(([ic,t,d],i)=>`<div>${iconHTML(ic,COL.guess,44)}<b>Part ${i+1}</b><p><b style="all:unset;font-weight:650">${t}</b></p><p style="font-size:20px;color:#374151;margin-top:10px">${d}</p><small>${mins[i]} minutes</small></div>`).join('')}</div>`,
 lines:['The talk has five parts. You can run everything in a Colab notebook, with a free Gemini key or an open model.'],
 ask:['Which part matters most for your work?'],
 expected:['Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.'],
 point:'A map of the talk, so the audience knows the applications and the risks are coming.',
 transition:'Part 1: what an agent is.',source:`Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb).`});
