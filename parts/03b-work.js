// Part 3, second half: where the same loop is used in the real world, and how much freedom each job should get.
// A turn from our small agent to real products (the same loop, other tools), then four real jobs, one light slide
// each: the illustration, what the agent does in four steps (a check is a filled step: green for a program, amber for
// a person), and one published number. Then who checked the work in each, the stakes map (axes, our own three jobs,
// the real jobs, the zones) and the recap of Part 3. More jobs are in the appendix (parts/08 and 09), drawn by job().
// Numbers: data/p3a.json and data/p3b.json (scripts/sci/p3a.py, p3b.py: rows of plan/research/verified.md), and
// data/apps.json (scripts/sci/apps.py: the map). Nothing here is read from a run except the model's name.
import {S_,recap,chap,css,esc,num,big,word,kY,kA,kT,kG,kR,data,need,illo,iconHTML,
 label,line,arrow,gat,gonly,fig,COL,chip,widget,register,loopStrip} from '../kit.js';

const A=need(await data('p3a'),'swe','klarna'),B=need(await data('p3b'),'evolve','clinic','kisan');
const APPS=need(await data('apps'),'apps','zones'),MODEL=need(await data('traces'),'model').model;
const SW=A.swe,KL=A.klarna,E=B.evolve,CL=B.clinic,K=B.kisan;
const APP=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No job '+id);return a;};

css(`.p3b-turn{display:flex;flex-direction:column;align-items:center;gap:30px;width:100%}
.p3b-turn .lstrip{width:640px;max-width:100%}
.p3b-sets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;width:100%}
.p3b-sets>div{border:2px solid var(--line);border-top:6px solid var(--p);border-radius:16px;background:#fff;padding:16px 20px 18px;min-width:0;display:flex;flex-direction:column;gap:10px}
.p3b-sets h3{font-size:25px;line-height:1.2;display:flex;align-items:center;gap:10px;margin:0}
.p3b-sets ul{list-style:none;margin:0;padding:0;font-size:23px;line-height:1.42;color:var(--p)}
.p3b-sets li{display:flex;align-items:center;gap:10px}.p3b-sets li::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:var(--p);opacity:.55}
.p3b-sets .mono{font-size:21px;font-weight:650}
.scene[data-build="1"] .p3b-sets>div.later{border:2px dashed var(--line);background:none}
.p3b-job{display:grid;grid-template-columns:400px minmax(0,1fr);gap:50px;align-items:center;width:100%}
.p3b-job .illo img{max-height:400px;border-radius:18px}
.p3b-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
.p3b-steps li{display:flex;align-items:center;gap:16px;font-size:27px;line-height:1.25;position:relative;min-height:48px}
.p3b-steps li>i{flex:none;width:48px;height:48px;border-radius:50%;border:2.6px solid var(--c);background:#fff;display:grid;place-items:center;position:relative;z-index:1}
.p3b-steps li.chk>i{background:var(--c)}.p3b-steps li.chk>span{font-weight:650}
.p3b-steps li:not(:last-child)::after{content:"";position:absolute;left:22.7px;top:50%;height:calc(100% + 14px);width:2.6px;background:#C9D0D7}
.p3b-steps .tag{margin-left:auto;flex:none;font:650 16px/1 var(--font);color:#fff;background:var(--t,var(--c));border-radius:999px;padding:6px 12px 7px;white-space:nowrap}
.p3b-num{display:flex;align-items:center;gap:24px;margin-top:24px;padding-top:20px;border-top:2px solid var(--line)}
.p3b-num b{flex:none;font-size:58px;line-height:1;font-weight:700;letter-spacing:-1.5px;color:var(--d);font-variant-numeric:tabular-nums;white-space:nowrap}
.p3b-num b small{display:block;font-size:20px;line-height:1;letter-spacing:0;font-weight:650;margin-bottom:5px}
.p3b-num p{font-size:24px;line-height:1.35;color:#374151;text-wrap:balance}
.p3b-who{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px;width:100%}
.p3b-who>div{display:flex;flex-direction:column;gap:12px;min-width:0}
.p3b-who .illo img{max-height:none;border-radius:18px}
.p3b-who h3{font-size:24px;line-height:1.2;margin:2px 0 0;font-weight:650;color:#374151}
.p3b-who p{font-size:23px;line-height:1.3;color:#374151}.p3b-who p b{display:block;font-size:26px;font-weight:650;color:var(--c)}
.p3b-map .diagram-scroll svg{max-height:424px}
.p3b-pt{cursor:pointer;outline:none}.p3b-pt .p3b-ring{opacity:0}.p3b-pt.on .p3b-ring,.p3b-pt:focus-visible .p3b-ring{opacity:1}
.p3b-why{font-size:22px;line-height:1.3;min-height:29px;margin-top:4px;padding-left:14px;border-left:5px solid var(--line);visibility:hidden;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.p3b-why.on{visibility:visible}.p3b-why b{font-weight:650}
@media(max-width:760px){.reading .p3b-sets,.reading .p3b-job,.reading .p3b-who{grid-template-columns:minmax(0,1fr)}.reading .p3b-turn .lstrip{width:100%}
 .reading .p3b-steps li{font-size:19px}.reading .p3b-steps .tag{display:none}.reading .p3b-num{flex-direction:column;align-items:flex-start;gap:8px}.reading .p3b-num b{font-size:40px}
 .reading .p3b-num p,.reading .p3b-who p,.reading .p3b-sets ul{font-size:18px}.reading .p3b-why{white-space:normal}.reading .p3b-who .illo img{max-height:220px;width:auto}}`);

// ---------------------------------------------------------------------------------------- one job, one slide
const ROLEC={agent:COL.guess,tools:COL.target,you:COL.amber,done:COL.green,risk:COL.loss};
/** One real job on one slide: its illustration; what happens, in three or four steps; and one number at click 2.
 steps: [[role, icon, text, tag]]; role is 'agent' (purple), 'tools' (teal), 'you' (a person, amber) or 'done' (a
 program's check, green). A step with a tag is a check: its badge is filled, and the tag says who checks
 ('a program checks'); a tag [text, role] takes another role's colour. fact: {big, pre, text}. */
export function job(id,title,o){
 const row=([role,ic,text,tag])=>{const c=ROLEC[role],[tt,tr]=Array.isArray(tag)?tag:[tag,role],fill=!!tag&&tr===role;
  return `<li${fill?' class="chk"':''} style="--c:${c}"><i>${iconHTML(ic,fill?'#fff':c,26)}</i><span>${text}</span>${tt?`<em class="tag" style="--t:${ROLEC[tr]};font-style:normal">${tt}</em>`:''}</li>`;};
 const f=o.fact;
 S_(id,o.section||'work',title,{builds:2,optional:o.optional,nb:o.nb,
  body:`<div class="p3b-job">${illo(o.img,o.alt)}<div><ol class="p3b-steps">${o.steps.map(row).join('')}</ol>
   <div class="p3b-num" data-at="2"><b>${f.pre?`<small>${f.pre}</small>`:''}${f.big}</b><p>${f.text}</p></div></div></div>`,
  lines:o.lines,ask:o.ask,expected:o.expected,point:o.point,misconception:o.misconception,transition:o.transition,
  source:`${o.source} Illustration: generated.`});
}

// ---------------------------------------------------------------------------------------- the turn
chap('3.3','Real products');
{
 const SETS=[['terminal','Our agent',['read_file','write_file','edit_file','bash'],1],['code','Coding agents',['the same four','search','git']],
  ['chat','A support desk',['order lookup','refund','reply']],['mic','A clinic',['microphone','transcript','health record']]];
 S_('work-real','work','Real products run the same loop',{builds:2,
  body:`<div class="p3b-turn">${loopStrip({model:'1',tool:'1,2',result:'1'})}
   <div class="p3b-sets">${SETS.map(([ic,name,tools,ours])=>`<div${ours?'':' class="later"'}><h3${ours?'':' data-at="2"'}>${iconHTML(ic,COL.target,28)}${name}</h3>
    <ul${ours?'':' data-at="2"'}>${tools.map(t=>`<li>${ours?`<span class="mono">${t}</span>`:t}</li>`).join('')}</ul></div>`).join('')}</div></div>`,
  lines:['Our loop once more, and the four tools it can ask for.',
   'Real products keep this loop. What changes is the set of tools.'],
  ask:['What would we change to turn our agent into a support agent?','What tools would an agent need in your team?'],
  expected:['Only the tools: an order lookup, a refund and a reply in place of files and a terminal. The model and the loop stay.',
   'Usually three or four: look something up, change a record, send a message. Each is one function, like read_file.'],
  point:'An agent product is the same loop, with tools chosen for one job.',
  misconception:'That each product is a different kind of AI. The loop is the one we wrote; the tools and the checks around it differ.',
  transition:'First, the product closest to what we built.'});
}

// ---------------------------------------------------------------------------------------- four real jobs
job('app-coding','Coding agents work the way ours did',{img:'app-coding.jpg',
 alt:'Illustration: a developer at a laptop in the evening, a small helper beside it',
 steps:[['agent','spark','Reads the issue and the code'],['tools','pen','Edits the files'],
  ['done','check','Runs the tests after each change','a program checks'],['you','approve','A person reviews and merges','a person approves']],
 fact:{big:`${num(SW.leaderboard_pct,0)}%`,text:`of ${SW.tasks} real GitHub issues fixed, on a public test.`},
 lines:['Claude Code, Codex and Cursor work as our agent did: read, edit, run the tests, repeat.',
  'How good are they? This public test gives an agent real issues from open-source projects.'],
 ask:['What does a product add to our sixty lines?','Does that score mean an agent can do most of a developer’s job?'],
 expected:['A stronger model, more tools (search, git, a browser), permissions and logs. The loop is the same.',
  `No. The ${SW.tasks} tasks are small fixes with the tests already written, and the test has leaked into training data: OpenAI stopped reporting it in ${SW.dropped}. Vendors report higher scores (${num(SW.late.pct,1)}% for the restricted ${esc(SW.late.model)}); the independent leaderboard is the safer number. ${esc(SW.start.model)} scored ${num(SW.start.pct,1)}% in ${SW.start.date}. Run your own evals (Part 4).`],
 point:'A coding agent can do much of the work because tests check each change in seconds, and a person approves the merge.',
 misconception:'That the score measures a developer’s job. It measures small, well-described fixes that come with tests.',
 transition:'Next, a job with no tests: answering customers.',
 source:`SWE-bench Verified (${SW.tasks} tasks): the top score on the independent swebench.com leaderboard. The steps are a sketch of how coding agents work.`});

job('app-support','Customer support: it answers the routine chats',{img:'app-support.jpg',
 alt:'Illustration: a customer with a phone, and a support desk where a small helper types a reply',
 steps:[['agent','chat','Reads the customer’s message'],['tools','database','Looks up the order and the policy'],
  ['agent','send','Answers routine questions itself',['nobody reads it first','risk']],['you','person','A person takes the hard cases']],
 fact:{big:KL.share.replace(/^./,c=>c.toUpperCase()),text:'of Klarna’s customer chats, in its assistant’s first month.'},
 lines:['A support agent reads the message, looks up the order and the policy, and replies.',
  `Answers took under ${KL.minutes_after} minutes, down from ${KL.minutes_before}. Later, Klarna’s CEO said quality had dropped.`],
 ask:['Which of these steps can go wrong without anyone seeing?',`It handled ${KL.share} of the chats. Is ${KL.share} of the job done?`],
 expected:['The reply. It goes to the customer at once, so the customer is the first person to read it.',
  `No. Those ${KL.chats} chats were the routine ones. In ${KL.turn_date} Klarna’s CEO told Bloomberg that cost had been too dominant a factor, and the result was lower quality. Klarna offers a person again for some cases, with freelance staff, while its headcount keeps falling. Klarna had said the assistant did the work of ${KL.fte} full-time agents, with ${KL.repeat_drop_pct}% fewer repeat inquiries.`],
 point:'A support agent settles routine chats quickly. Nobody reads each reply first, so its quality has to be measured another way.',
 misconception:'That Klarna went back to people. The new staff are freelance, and total headcount kept falling.',
 transition:'Now a job where a program checks every attempt.',
 source:`Klarna press release (${KL.date}); its CEO’s interview with Bloomberg (${KL.turn_date}), as reported by Entrepreneur. The steps are a sketch of a typical support agent.`});

job('app-evolve','AlphaEvolve: a program scores every attempt',{img:'app-evolve.jpg',
 alt:'Illustration: a tree of code blocks growing upward beside rows of data-centre servers',
 steps:[['you','target','Engineers write a scoring program'],['agent','code','It writes a rule for placing jobs'],
  ['done','check','The program scores the rule','a program checks'],['agent','refresh','It keeps the best, and tries again']],
 fact:{big:`${num(E.compute_pct,1)}%`,text:'of Google’s worldwide computing recovered, on average.'},
 lines:['Which server should each job run on? Google’s engineers wrote a program that scores any rule.',
  'It tries far more rules than a team could read. The best one now runs in Google’s data centres.'],
 ask:['Who has to read each attempt?','Which problems in your work come with a scorer like this?'],
 expected:['Nobody. The program scores every rule, so the loop does not wait for a person. Engineers read the winner before it is used.',
  'Scheduling, routing, packing: anything with a cost that a program can compute.'],
 point:'When a program can score the result, the loop can run without a person looking at each attempt.',
 misconception:`That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the scorer does much of the work. It also found a way to multiply ${E.matrix}×${E.matrix} complex matrices with ${E.mults} multiplications, and a faster kernel that cut Gemini’s training time by ${E.training_pct}%.`,
 transition:'Most jobs have no scorer. In a clinic, the check is a doctor.',
 source:`Google DeepMind blog, ${E.date}. The steps are simplified.`});

job('app-clinic','Clinic notes: the doctor signs every note',{img:'app-clinic.jpg',
 alt:'Illustration: a doctor and a patient talking across a desk in a small Indian clinic, a recorder and a tablet on the desk',
 steps:[['you','person','The patient agrees to be recorded'],['tools','mic','It listens, and transcribes the visit'],
  ['agent','pen','It drafts the note'],['you','approve','The doctor corrects and signs','a person checks']],
 fact:{pre:'about',big:big(CL.hours),text:`hours of note-writing saved for ${big(CL.physicians)} doctors, in about ${CL.months} months.`},
 lines:['An AI scribe listens to the visit and drafts the note. The doctor corrects it and signs.',
  'Correcting a draft is quicker than writing a note. The doctor still reads every one.'],
 ask:['Would you let it file the note straight into the record?','What would you measure, to know whether it helps?'],
 expected:['No. The note goes into a medical record, and an error in it can reach the patient.',
  `Time spent on notes, and what the doctor corrects. Across ${CL.encounters_m} million visits (${CL.from} to ${CL.to}), The Permanente Medical Group counted about ${big(CL.hours)} hours saved, with the doctor’s review kept.`],
 point:'The scribe saves writing time, and the doctor keeps every decision.',
 misconception:'That the scribe makes the diagnosis. It writes down what was said; the doctor decides.',
 transition:'Four jobs. Who checked the work in each?',
 source:`The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, ${CL.from} to ${CL.to}; the hours as reported by the AMA. The steps are a sketch.`});

// ---------------------------------------------------------------------------------------- who checked?
chap('3.4','How much freedom?');
{
 const WHO=[['coding','app-coding.jpg',COL.green,'The tests',`then ${kY('a person')}`],['support','app-support.jpg',COL.loss,'Nobody','before it is sent'],
  ['evolve','app-evolve.jpg',COL.green,'A program','every attempt'],['clinic','app-clinic.jpg',COL.amber,'The doctor','every note']];
 S_('who-checks','work','Who checked the work?',{builds:2,
  body:`<div class="p3b-who">${WHO.map(([id,img,c,who,when])=>`<div>${illo(img,`Illustration: ${APP(id).name}`)}<h3>${esc(APP(id).name)}</h3><p data-at="2" style="--c:${c}"><b>${who}</b>${when}</p></div>`).join('')}</div>`,
  lines:['Four jobs, and the same loop in each. Take a guess for each one.','Each job got a different amount of freedom. Two questions explain why.'],
  ask:['Before the answers appear: who checked each one?','Why not have a person read everything, as in the clinic?'],
  expected:['Coding: the tests, then a person. Support: nobody, before the reply went out. AlphaEvolve: a program. The clinic: the doctor, every time.',
   'It would cost what the agent saves. A person’s check is worth paying for when a mistake is costly, as in a medical record.'],
  point:'The loop was the same in all four jobs. What differed was who checked the result, and how often.',
  transition:'The two questions, as a map.',source:'Illustrations: generated.'});
}

// ---------------------------------------------------------------------------------------- the stakes map (live)
// Our own three jobs are purple, the four real jobs of this part dark, the appendix's and two more grey. The zone
// colours keep their roles: green (checked, let it run), amber (a person approves), purple (the agent drafts), red
// (risk: a person leads).
const ZA=.075,ZCOL=z=>z.easy?(z.costly?COL.amber:COL.green):(z.costly?COL.loss:COL.guess);
const ZONE=Object.fromEntries(APPS.zones.map(z=>[z.name,z]));
const MW=1152,MH=424,PL=104,PR=1138,QT=36,QB=382,XM=(PL+PR)/2,YM=(QT+QB)/2,BAND=34;
const MX=v=>PL+24+v*(PR-PL-48),MY=v=>QB-BAND-v*(QB-QT-2*BAND);
// How each group is drawn: [marker radius, marker colour, label size, label weight, label colour, the click it appears on].
const LOOK={ours:[10,COL.guess,22,700,COL.guess,2],main:[9,'#2F3742',21,650,COL.ink,3],more:[7,'#8D97A8',19,500,'#5B6472',3]};
// Label offsets [dx, dy, anchor]; the default sits to the right of the marker.
const LEFT=[-19,7,'end'],PLACE={browser:LEFT,farmer:LEFT,evolve:LEFT,lab:LEFT};
const inZone=(easy,costly)=>APPS.apps.filter(a=>ZONE[a.zone].easy===easy&&ZONE[a.zone].costly===costly).length;
const nJobs=APPS.apps.length,nApprove=inZone(true,true);
const ALT=`${nJobs} jobs on two axes, how easy the result is to check and what a mistake costs, in four zones`;
function mapSVG(){
 let g='';
 // click 4: the four zones, their names and the lines between them
 g+=gat(4,APPS.zones.map(z=>{const x0=z.easy?XM:PL,x1=z.easy?PR:XM,y0=z.costly?QT:YM,y1=z.costly?YM:QB,c=ZCOL(z);
  return `<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" fill="${c}" fill-opacity="${ZA}"/>`+
   label(z.easy?PR-14:PL+14,z.costly?QT+28:QB-14,esc(z.name),{size:22,fill:c,weight:700,anchor:z.easy?'end':'start'});}).join('')+
  line(XM,QT,XM,QB,{stroke:'#AAB3BC',w:1.5,dash:'6 6'})+line(PL,YM,PR,YM,{stroke:'#AAB3BC',w:1.5,dash:'6 6'}));
 g+=`<rect x="${PL}" y="${QT}" width="${PR-PL}" height="${QB-QT}" fill="none" stroke="#C9D0D7" stroke-width="1.5"/>`;
 // the axes: two questions at clicks 1 to 3, the rule they give at click 4
 g+=label(PL-10,MY(.95)+7,'a lot',{size:20,anchor:'end'})+label(PL-10,MY(.05)+7,'little',{size:20,anchor:'end'})+
  label(PL,QB+32,'hard',{size:20})+label(PR,QB+32,'easy',{size:20,anchor:'end'});
 g+=gonly('1-3',label(PL,QT-12,'What does a mistake cost?',{size:23,fill:'#374151',weight:650})+
  label(XM,QB+32,'How easy is the result to check?',{size:23,fill:'#374151',weight:650,anchor:'middle'}));
 g+=gonly('4',arrow(PL,QB,PL,QT+4,{stroke:COL.amber,w:4,head:15})+arrow(PL,QB,PR-2,QB,{stroke:COL.guess,w:4,head:15})+
  label(PL+10,QT-12,'↑ a costlier mistake: a person stays closer',{size:22,fill:COL.amber,weight:700})+
  label(XM,QB+32,'easier to check: more freedom →',{size:22,fill:COL.guess,weight:700,anchor:'middle'}));
 // click 1 only: one example at each end of each axis
 const ex=(x,y,t,anchor='start')=>label(x,y,t,{size:21,fill:'#374151',anchor});
 g+=gonly('1',ex(PL+16,MY(.95)+7,'money has moved')+ex(PL+16,MY(.05)+7,'a draft you can delete')+
  ex(PL+56,QB+32,'only a lab can tell')+ex(PR-56,QB+32,'a test passes or fails','end'));
 // clicks 2 and 3: the points, labelled; each one a button
 g+=APPS.apps.map(a=>{const x=MX(a.x),y=MY(a.y),[dx,dy,an]=PLACE[a.id]||[19,7,'start'],[r,c,fs,fw,tc,click]=LOOK[a.group];
  return gat(click,`<g class="p3b-pt" data-id="${a.id}" tabindex="0" role="button" aria-label="${esc(a.name)}: ${esc(a.why)}">`+
   `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="#fff" fill-opacity="0"/>`+
   `<circle class="p3b-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r+5}" fill="none" stroke="${COL.ink}" stroke-width="2.5"/>`+
   `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${c}" stroke="#fff" stroke-width="2"/>`+
   `<text x="${(x+dx).toFixed(1)}" y="${(y+dy).toFixed(1)}" fill="${tc}" font-size="${fs}" font-weight="${fw}" text-anchor="${an}" style="paint-order:stroke;stroke:#FAFAFB;stroke-width:5px;stroke-linejoin:round">${esc(a.name)}</text></g>`);}).join('');
 return g;}
const why=a=>`<b>${esc(a.name)}.</b> ${esc(a.why)}`;
register('p3b-map',(el,ctx)=>{
 el.innerHTML=`<div class="p3b-map"><div class="w-fig">${fig(MW,MH,mapSVG(),ALT)}</div><p class="p3b-why" aria-live="polite"></p></div>`;
 if(ctx.printing)return;
 const card=el.querySelector('.p3b-why'),pts=[...el.querySelectorAll('.p3b-pt')];
 let sel=null;
 const show=()=>{pts.forEach(p=>p.classList.toggle('on',p.dataset.id===sel));card.classList.toggle('on',!!sel);if(!sel)return;
  const a=APP(sel);card.style.borderLeftColor=ZCOL(ZONE[a.zone]);card.innerHTML=why(a);};
 const pick=p=>{sel=sel===p.dataset.id?null:p.dataset.id;p.blur();show();};
 pts.forEach(p=>{p.addEventListener('click',()=>pick(p));p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(p);}});});
});
S_('stakes-map','work','How much freedom should each job get?',{builds:4,
 body:widget('p3b-map',ALT),
 lines:['Two questions place a job: how easy is its result to check, and what does a mistake cost?',
  'Our own three jobs first. All are easy to check. A mistake on the invoices costs the most.',
  'Now the real jobs. The grey ones are further examples. Which point would you move?',
  'Each corner suggests how much freedom to give. Where would your team’s most repeated task sit?'],
 ask:['Before the points appear: where would you put fixing a test? Paying an invoice?','Why do the invoices sit higher than the folder?',
  'Which point would you move, and why?','Where does your team’s most repeated task sit?'],
 expected:['Fixing a test: bottom right. The tests check it in seconds, and one line is easy to change back. Paying an invoice: the match is easy to check, but money leaves, so top right.',
  'A file in the wrong folder can be moved back. A payment to the wrong supplier is hard to get back. So the agent may write the report, and a person approves the payment.',
  `Common moves: customer support higher, because a wrong promise binds the company; deep research further right, because its key claims can be spot-checked. Coding agents sit above our own test fix: the check is the same, but a merge reaches real users. The grey points are the appendix’s jobs and two more. One of those, farm advisory, is already large: the government’s Kisan e-Mitra chatbot has answered more than ${K.answered_lakh} lakh farmer questions in ${K.languages} languages (PIB, ${K.date}).`,
  `Most operational work lands top right: ${word(nApprove)} of the ${word(nJobs)} jobs here. Let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.`],
 point:'Two questions set how much freedom a job gets: how cheaply can its result be checked, and what does a mistake cost?',
 misconception:'That a more capable model moves a job to the bottom right. A better model makes fewer mistakes. What a mistake costs, and how hard the result is to check, stay the same.',
 demo:'Click a point to read why it sits there; click it again to hide the line. The positions are the speaker’s judgement, not measurements: invite the room to move them.',
 transition:'Part 3 in one slide.',
 source:'Positions: the speaker’s judgement, for discussion (data/apps.json). The zones split each axis at its middle.'});

recap(3,[`${kA('One agent')} did three jobs.`,
  `Real products run the ${kA('same loop')} with ${kT('other tools')}.`,
  `Easy checks allow ${kG('more freedom')}. Costly mistakes need ${kY('a person')}.`],
 'how agents fail.',
 {card:{goal:'Changes with the job',model:esc(MODEL),tools:`${chip('eye','read')} ${chip('pen','write, edit')} ${chip('terminal','bash')}`,
   memory:'The conversation, and notes',stop:'An answer, or a round limit',guard:'Approval before risky steps',human:'Closer when mistakes cost more'},
  hi:['goal','guard','human'],title:'Our agent',
  ask:'Pick one task from your week. Which corner of the map does it fall in?',
  expected:'Most land top right: the agent can do the work if a person approves the step that cannot be undone. That is where Part 5 begins.',
  point:'How much an agent may do alone depends on two things: how cheaply its result can be checked, and what a mistake costs.',
  transition:'Even in the right corner, agents fail. Part 4 shows how.'});
