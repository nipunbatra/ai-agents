// The wrap-up: the talk on the loop flowchart (one line per part, with the parts' boxes highlighted), three things to
// try on Monday (with the notebook's QR code), and the closing slide. QR codes: data/qr.json (scripts/sci/qr.cjs).
import {S_,at,only,data,need,css,esc,COL,iconHTML,loopMap,nb,SITE,REPO} from '../kit.js';

const Q=need(await data('qr'),'slides','notebook');

css(`.w6-monday{display:grid;grid-template-columns:1.55fr 1fr;gap:40px;align-items:center}
.w6-mon{display:flex;flex-direction:column;gap:18px}
.w6-mon>div{display:grid;grid-template-columns:48px 1fr;gap:16px;align-items:start;border:2px solid var(--line);border-radius:16px;background:#fff;padding:16px 22px}
.w6-mon h3{font-size:28px;margin:0 0 4px}.w6-mon p{font-size:23px;line-height:1.35;color:#374151}
.w6-qr{display:flex;gap:56px;justify-content:center;align-items:flex-start}
.w6-qr figure{margin:0;text-align:center}.w6-qr svg{width:240px;height:240px;display:block;margin:0 auto 10px}
.w6-repo{text-align:center;margin-top:10px}
.w6-qr figcaption{font-size:24px;color:var(--ink)}.w6-qr figcaption small{display:block;font-size:20px;color:var(--muted)}
@media(max-width:760px){.reading .w6-monday{grid-template-columns:minmax(0,1fr)}.reading .w6-qr{flex-direction:column;align-items:center}.reading .w6-mon h3{font-size:21px}.reading .w6-mon p{font-size:18px}}`);

const qr=(k,color=COL.ink)=>`<svg viewBox="-2 -2 ${Q[k].size+4} ${Q[k].size+4}" role="img" aria-label="QR code for ${esc(Q[k].url)}"><rect x="-2" y="-2" width="${Q[k].size+4}" height="${Q[k].size+4}" fill="#fff"/><path d="${Q[k].path}" fill="${color}"/></svg>`;

// ---------------------------------------------------------------------------------------- the talk on one map
const SUM=[{hi:['model','tool'],here:{model:'Part 2',tool:'Part 1'},name:'Parts 1 and 2'},{hi:'answer',here:'Part 3',name:'Part 3'},{hi:['gate','limit'],here:{gate:'Parts 4 and 5',limit:'Part 4'},guards:true,name:'Parts 4 and 5'}];
S_('summary','wrap','The talk, on the loop from Part 1',{builds:3,
 body:SUM.map(({name,...o},i)=>only(String(i+1),loopMap({...o,alt:`The agent loop as a flowchart, with ${name} highlighted`}))).join(''),
 lines:['Part 1: a model asks for tools, and our code runs them. Part 2: each round, it rereads the whole conversation.',
  'Part 3: agents do useful work where a person can check the answer cheaply.',
  'Part 4: errors add up, so add an approval and a step limit. Part 5: give more freedom only as evals allow.'],
 ask:['Which box did your own work touch today?','Which of the applications we saw could you check in a minute or two?','Which of these two guards would your first agent need?'],
 expected:['Most people say the tools: the data and systems their team already has.','Coding with tests, data analysis with a check, building energy with a meter reading.','Both. The step limit always; the approval before anything that cannot be undone.'],
 point:'The whole talk sits on the loop from Part 1.',
 transition:'So what can you do this week?'});

// ---------------------------------------------------------------------------------------- three things for Monday
const MON=[['code',COL.target,'Run the notebook','Your own question, with a free Gemini key.'],
 ['notes',COL.guess,'Write one agent card','Pick a task you repeat every week.'],
 ['check',COL.green,'Collect test cases first','Real past cases with known answers.']];
S_('monday','wrap','Three things to try on Monday',{builds:2,nb:nb('part-0','▶ The notebook'),
 body:`<div class="w6-monday"><div class="w6-mon">${MON.map(([ic,c,t,d])=>`<div>${iconHTML(ic,c,38)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>
  ${at(2,`<div class="w6-qr"><figure>${qr('notebook')}<figcaption>The notebook<small>Opens in Colab</small></figcaption></figure></div>`)}</div>`,
 lines:['None of these needs a budget or a new team. You can start on Monday morning.',
  'Scan to open the notebook. Every run today came from it.'],
 ask:['Which task in your team would you write the card for?','Who has a laptop open? Try the first cell now.'],
 expected:['Reconciliations, weekly reports, ticket triage, document checks.','A few will open it. Promise help after the session.'],
 point:'Three next steps: run the notebook, describe one task as an agent card, and collect the test cases before building.',
 transition:'Thank you.'});

// ---------------------------------------------------------------------------------------- thanks
S_('thanks','wrap','Thank you. Questions?',{builds:1,
 body:`<div class="w6-qr"><figure>${qr('slides')}<figcaption>These slides<small>${esc(SITE.replace('https://',''))}</small></figcaption></figure>
  <figure>${qr('notebook')}<figcaption>The notebook<small>Opens in Colab</small></figcaption></figure></div>
  <p class="caption w6-repo">Slides, notebook, data and sources: ${esc(REPO.replace('https://',''))}</p>`,
 lines:['Thank you for your time. What would you like to ask?'],
 ask:['Which application did we not cover that you would like to see?'],
 expected:['Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Run each through the three questions of Part 5.'],
 point:'Close, and open the floor.',transition:'',
 source:'Nipun Batra, IIT Gandhinagar · nipunbatra.github.io'});
