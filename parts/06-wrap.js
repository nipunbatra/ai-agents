// The wrap-up: the talk in one slide, three things to try on Monday, and the closing slide with QR codes.
// QR codes: data/qr.json (scripts/sci/qr.cjs).
import {S_,p,ps,small,at,data,need,css,esc,word,Word,kY,kA,kT,kR,kG,COL,iconHTML,loopFig,nb,SITE} from '../kit.js';

const Q=need(await data('qr'),'slides','notebook'),APPS=need(await data('apps'),'apps');

css(`.w6-sum{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:center}
.w6-sum ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.w6-sum li{display:grid;grid-template-columns:74px 1fr;gap:10px;align-items:start;font-size:22px;line-height:1.32}
.w6-sum li b{font-size:16px;letter-spacing:1px;color:var(--q);padding-top:4px;white-space:nowrap}
.w6-monday{display:grid;grid-template-columns:1.5fr 1fr;gap:34px;align-items:center}
.w6-mon{display:flex;flex-direction:column;gap:14px}
.w6-mon>div{display:grid;grid-template-columns:46px 1fr;gap:14px;align-items:start;border:2px solid var(--line);border-radius:16px;background:#fff;padding:12px 18px}
.w6-mon h3{font-size:24px;margin:0 0 4px}.w6-mon p{font-size:20px;line-height:1.36;color:#374151}
.w6-qr{display:flex;gap:44px;justify-content:center;align-items:flex-start}
.w6-qr figure{margin:0;text-align:center}.w6-qr svg{width:220px;height:220px;display:block;margin:0 auto 8px}
.w6-qr figcaption{font-size:22px;color:var(--ink)}.w6-qr figcaption small{display:block;font-size:20px;color:var(--muted)}
@media(max-width:760px){.reading .w6-sum,.reading .w6-monday{grid-template-columns:minmax(0,1fr)}.reading .w6-qr{flex-direction:column;align-items:center}}`);

const qr=(k,color=COL.ink)=>`<svg viewBox="-2 -2 ${Q[k].size+4} ${Q[k].size+4}" role="img" aria-label="QR code for ${esc(Q[k].url)}"><rect x="-2" y="-2" width="${Q[k].size+4}" height="${Q[k].size+4}" fill="#fff"/><path d="${Q[k].path}" fill="${color}"/></svg>`;

const SUM=[['1',`An agent is ${kA('a model')}, ${kT('tools')} and a loop.`],
 ['2','Each turn it rereads its context; tools and memory are text it reads.'],
 ['3',`It works best where results are ${kG('cheap to check')}.`],
 ['4',`Errors compound, and text the agent reads can carry hidden instructions; ${kR('guardrails')} are code you write.`],
 ['5',`Start with a workflow, measure with evals, then raise ${kA('autonomy')}.`]];
S_('summary','wrap','Summary',{builds:1,
 body:`<div class="w6-sum">${loopFig({W:600,H:450,at:{},tools:['sensor','code','mail','database','globe'],toolSize:32})}<ol>${SUM.map(([k,t])=>`<li><b>PART ${k}</b><span>${t}</span></li>`).join('')}</ol></div>`,
 lines:['The loop from the first slide, with one line from each part.'],
 ask:['Which of the five will you remember on Monday morning?'],
 expected:['Most remember Part 3 (where it works) or Part 4 (what goes wrong). Point back to the map of '+APPS.apps.length+' jobs.'],
 point:'The whole talk in five sentences.',transition:'And what to do next.'});

const MON=[['play','Run the notebook','Open it in Colab, paste a free Gemini key, and watch the loop on your own question.'],
 ['list','Fill in one agent card','Pick a task you repeat every week. Write its goal, tools, stopping rule and the step a person must approve.'],
 ['check','Write ten test cases first','Ten real examples with known answers. Run them before and after every change.']];
const ICON={play:'zap',list:'notes',check:'check'};
S_('monday','wrap','Three things to try on Monday',{builds:2,nb:nb('part-0','▶ The notebook'),
 body:`<div class="w6-monday"><div class="w6-mon">${MON.map(([k,t,d],i)=>`<div>${iconHTML(ICON[k],[COL.guess,COL.target,COL.green][i],34)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>
  ${at(2,`<div class="w6-qr"><figure>${qr('notebook')}<figcaption>The notebook<small>Colab · Gemini key or an open model</small></figcaption></figure></div>`)}</div>`,
 lines:['Three small steps for this week.',
  'Scan to open the notebook. Every run in this talk came from it.'],
 ask:['Which task in your team would you write the card for?','Who has a laptop open? Try the first cell now.'],
 expected:['Reconciliations, weekly reports, ticket triage, document checks.','A few will open it; promise help after the session.'],
 point:'Concrete next steps: run it, describe one task as an agent card, and write the evals first.',
 transition:'Thank you.'});

S_('thanks','wrap','Thank you. Questions?',{builds:1,
 body:`<div class="w6-qr"><figure>${qr('slides')}<figcaption>These slides<small>${esc(SITE.replace('https://',''))}</small></figcaption></figure>
  <figure>${qr('notebook')}<figcaption>The notebook<small>notebook/agents.ipynb in the same repository</small></figcaption></figure></div>
  ${small(`Slides, notebook, data and sources: github.com/nipunbatra/ai-agents. Every agent run shown was recorded with the notebook.`)}`,
 lines:['Slides, notebook, data and sources are in one repository.'],
 ask:['Which application did we not cover that you would like to see?'],
 expected:['Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Map each onto the card and the two axes.'],
 point:'Close, and open the floor.',transition:'',
 source:`Nipun Batra, IIT Gandhinagar · nipunbatra.github.io`});
