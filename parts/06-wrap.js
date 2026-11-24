// The wrap-up: the talk on the loop flowchart (one click and one plain line per part, with that part's boxes
// highlighted; the lines follow what Parts 1 to 5 now show), three things to try on Monday (all three on screen, the ones still to come dim, beside the notebook's
// QR code), and the closing slide.
// QR codes: data/qr.json (scripts/sci/qr.cjs).
import {S_,only,data,need,css,esc,COL,loopMap,nb,SITE,REPO} from '../kit.js';

const Q=need(await data('qr'),'slides','notebook');

css(`.w6-monday{display:grid;grid-template-columns:1.6fr 1fr;gap:44px;align-items:center}
.w6-mon{display:flex;flex-direction:column;gap:16px}
.w6-mon>div{display:grid;grid-template-columns:54px 1fr;gap:18px;align-items:center;border:2px solid var(--line);border-left:6px solid var(--c);border-radius:16px;background:#fff;padding:18px 24px}
.w6-mon>div{transition:opacity .38s ease}.scene[data-build="1"] .w6-mon>div:nth-child(n+2),.scene[data-build="2"] .w6-mon>div:nth-child(n+3){opacity:.3}
.w6-mon .n{width:50px;height:50px;border-radius:50%;background:var(--c);color:#fff;font-size:27px;font-weight:700;display:flex;align-items:center;justify-content:center}
.w6-mon h3{font-size:29px;line-height:1.2;margin:0 0 4px}.w6-mon p{font-size:23px;line-height:1.35;color:#374151}
.w6-qr{display:flex;gap:64px;justify-content:center;align-items:flex-start}
.w6-qr figure{margin:0;text-align:center}.w6-qr svg{width:250px;height:250px;display:block;margin:0 auto 12px}
.w6-monday .w6-qr svg{width:290px;height:290px}
.w6-repo{text-align:center;margin-top:14px}
.w6-qr figcaption{font-size:25px;font-weight:650;color:var(--ink)}.w6-qr figcaption small{display:block;font-size:20px;font-weight:400;color:var(--muted);margin-top:2px}
@media(max-width:760px){.reading .w6-monday{grid-template-columns:minmax(0,1fr)}.reading .w6-qr{flex-direction:column;align-items:center}.reading .w6-mon h3{font-size:21px}.reading .w6-mon p{font-size:18px}}`);

const qr=(k,color=COL.ink)=>`<svg viewBox="-2 -2 ${Q[k].size+4} ${Q[k].size+4}" role="img" aria-label="QR code for ${esc(Q[k].url)}"><rect x="-2" y="-2" width="${Q[k].size+4}" height="${Q[k].size+4}" fill="#fff"/><path d="${Q[k].path}" fill="${color}"/></svg>`;

// ---------------------------------------------------------------------------------------- the talk on one map
// One build per part: the boxes that part was about, tagged with the part's name. The two guards appear with Part 4.
const SUM=[{hi:['ask','tool'],here:{ask:'',tool:'Part 1'}},{hi:['model','result'],here:{model:'Part 2',result:''}},{hi:'goal',here:'Part 3'},
 {hi:['gate','limit'],here:{gate:'Part 4',limit:'Part 4'},guards:true},{hi:['gate','answer'],here:{gate:'',answer:'Part 5'},guards:true}];
S_('summary','wrap','The whole talk, on one loop',{builds:5,
 body:SUM.map((o,i)=>only(String(i+1),loopMap({...o,alt:`The agent loop as a flowchart, with the boxes of Part ${i+1} highlighted`}))).join(''),
 lines:['Part 1: the model writes a request and our code runs the tool, again and again, until the model stops asking.',
  'Part 2: each round the model rereads the whole conversation, which only grows. To remember across runs, it writes notes to a file.',
  'Part 3: the same loop, given a new goal, tidied a folder and checked invoices. Real products run this loop too.',
  'Part 4: a file carried hidden instructions, so a person approves risky requests. A step limit ends long runs. Evals count how often it works.',
  'Part 5: if the steps are fixed, write a workflow. Otherwise give an agent freedom in steps, and count the person who checks.'],
 ask:['Who runs the tool: the model, or our code?','What does the model remember from one run to the next?','What did we change between the three jobs?','Which of these two guards would your first agent need?','Which box costs the most?'],
 expected:['Our code. The model only writes the request.','Nothing, unless something was written to a file that the next run reads.','Only the sentence that states the goal. The tools and the loop stayed the same.',
  'Both. The step limit always; the approval before anything that cannot be undone.','The last one: a person’s time to check the answer costs far more than the model.'],
 point:'The whole talk sits on the loop from Part 1.',
 transition:'So what can you do on Monday?'});

// ---------------------------------------------------------------------------------------- three things for Monday
const MON=[[COL.target,'Run the notebook','In Colab, with no key.'],
 [COL.amber,'Give it a task from your own work','One sentence, in section 5.1.'],
 [COL.green,'Write down the checks first','How will you know it is right?']];
S_('monday','wrap','Three things to try on Monday',{builds:3,nb:nb('part-0','▶ The notebook'),
 body:`<div class="w6-monday"><div class="w6-mon">${MON.map(([c,t,d],i)=>`<div style="--c:${c}"><span class="n">${i+1}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>
  <div class="w6-qr"><figure>${qr('notebook')}<figcaption>The notebook<small>Opens in Colab</small></figcaption></figure></div></div>`,
 lines:['First, run the notebook. Every run you saw today came from it, on an open model, with no key and no bill.',
  'Then change one sentence in section 5.1, and give the agent a task from your own work.',
  'But before you run it, write down how you will check the result. Those checks are your first evals.'],
 ask:['Who has a laptop open? Scan the code and run the first cell now.','Which task from your week would you type in?','For that task, what would a correct result look like?'],
 expected:['A few will open it. Promise help after the session.','Reconciliations, weekly reports, sorting a shared folder, checking one document against another.',
  'A total that matches, a test that passes, a list with nothing missing. If nobody can say, the task is not ready for an agent.'],
 point:'Three next steps, none of which needs a budget: run the notebook, give the agent your own task, and write the checks first.',
 transition:'Thank you.'});

// ---------------------------------------------------------------------------------------- thanks
S_('thanks','wrap','Thank you. Questions?',{builds:1,
 body:`<div class="w6-qr"><figure>${qr('slides')}<figcaption>These slides<small>${esc(SITE.replace('https://',''))}</small></figcaption></figure>
  <figure>${qr('notebook')}<figcaption>The notebook<small>Opens in Colab</small></figcaption></figure></div>
  <p class="caption w6-repo">Slides, notebook, data and sources: ${esc(REPO.replace('https://',''))}</p>`,
 lines:['Thank you for your time. What would you like to ask?'],
 ask:['Which job in your own team would you like to talk through?'],
 expected:['Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Run each through the three questions of Part 5.'],
 point:'Close, and open the floor.',transition:'',
 source:'Nipun Batra, IIT Gandhinagar · nipunbatra.github.io'});
