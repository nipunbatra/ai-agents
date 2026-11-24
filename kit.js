// The authoring kit of the agents talk. Every part file in parts/ imports from here and from nowhere else:
// the talk's meta, the one slide list, the slide helpers, the route strip, the application slide and the agent card.
// AUTHORING.md explains how to use it.
import {at,esc,m,highlight,code} from './shared/author.js';
import {iconHTML,chip,lanes,agentCard,ROLE} from './figures.js';
export * from './shared/author.js';
export * from './widgets.js';
export * from './figures.js';

export const meta={
 id:'ai-agents',kicker:'IITGN-X',title:'AI agents',series:'IITGN-X Residency Program',
 subtitle:'Language models that use tools in a loop',date:'3 December 2026',minutes:85,
 sections:[
  {id:'open',title:'Opening',minutes:4},
  {id:'what',title:'Part 1 · What an agent is',minutes:17},
  {id:'engine',title:'Part 2 · One run, step by step',minutes:14},
  {id:'work',title:'Part 3 · Agents at work',minutes:25},
  {id:'risk',title:'Part 4 · How agents fail',minutes:15},
  {id:'adopt',title:'Part 5 · Agents in your organisation',minutes:7},
  {id:'wrap',title:'Wrap-up',minutes:3},
  {id:'optional',title:'Appendix · More depth',minutes:0},
 ]};
/** The five parts: [section id, short name for the route strip]. */
export const PARTS=[['what','What an agent is'],['engine','One run, step by step'],['work','Agents at work'],['risk','How agents fail'],['adopt','In your organisation']];
export const REPO='https://github.com/nipunbatra/ai-agents';
export const SITE='https://nipunbatra.github.io/ai-agents/';
export const COLAB='https://colab.research.google.com/github/nipunbatra/ai-agents/blob/main/notebook/agents.ipynb';
/** The top-right link of a slide to a section of the notebook: nb('part-3'). */
export const nb=(anchor,label='▶ Notebook')=>({href:`${COLAB}#scrollTo=${anchor}`,label});

/** A notebook slide: the moment we switch to the notebook and run one numbered section live. The notebook's section
 has the same number and title (notebook/agents.py, anchor nb-1-2 for '1.2'), and the slide after it shows our
 recorded run, so the talk goes on even if the live run is slow or fails.
 nbRun(id, section, '1.2', 'Write a tool', {run: 'the key line or two', look: ['what to watch for'], line, ask,
 expected, point, transition, demo}). */
export function nbRun(id,section,num,title,o){
 if(!/^\d\.\d$/.test(num))throw new Error(`${id}: notebook section must look like 1.2`);
 if(!Array.isArray(o.look)||!o.look.length||o.look.length>2)throw new Error(`${id}: look needs one or two entries`);
 S_(id,section,'In the notebook',{builds:1,nb:nb('nb-'+num.replace('.','-'),`▶ Open ${num} in Colab`),
  body:`<div class="nbrun"><div class="nb-head">${iconHTML('code','#fff',30)}<span class="nb-num">${num}</span><span class="nb-title">${title}</span></div>
   <div class="nb-rows">${o.run?`<div class="nb-row"><small>We run</small>${code(o.run)}</div>`:''}
   <div class="nb-row"><small>Look for</small><ul>${o.look.map(x=>`<li>${x}</li>`).join('')}</ul></div></div></div>`,
  lines:[o.line],ask:[o.ask],expected:[o.expected],point:o.point||'',transition:o.transition||'',
  demo:o.demo||`Notebook ${num}: run the cells under “${title}”. If the run is slow or fails, move on: the next slide shows our recorded run.`,
  source:o.source||''});
}

/** A data file written by a script in scripts/sci/. Slides never type a number; they read it from here. */
export async function data(name){
 const r=await fetch(new URL(`data/${name}.json`,import.meta.url),{cache:'no-store'});
 if(!r.ok)throw new Error(`data/${name}.json is missing: run its script in scripts/sci/`);
 return r.json();
}
/** Guard for part files: a readable error if a number the slide needs is not in its data file. */
export const need=(obj,...keys)=>{for(const k of keys)if(obj?.[k]===undefined)throw new Error(`Data key missing: ${k}`);return obj;};

// ---------------------------------------------------------------------------------------- small text helpers
export const R=String.raw;
export const p=s=>`<p class="lead">${s}</p>`;
export const ps=s=>`<p class="small">${s}</p>`;
export const small=s=>`<p class="caption">${s}</p>`;
/** Colour a word by its role: a person (amber), the model (purple), tools and the world (teal), risk (red), a checked result (green). */
export const kY=s=>`<span class="kY">${s}</span>`,kA=s=>`<span class="kA">${s}</span>`,kT=s=>`<span class="kT">${s}</span>`,kR=s=>`<span class="kR">${s}</span>`,kG=s=>`<span class="kG">${s}</span>`;
/** Code that appears a line per click: rows of [build, line]; build 0 shows the line from the start. */
export const codeSteps=rows=>`<pre class="code code-steps"><code>${rows.map(([b,l])=>`<span class="cl"${b?` data-at="${b}"`:''}>${highlight(l)||' '}</span>`).join('')}</code></pre>`;
export const takeaway=s=>`<div class="takeaway"><b>Takeaway.</b> ${s}</div>`;
/** The answer to a question the slide asks, shown from click b on. */
export const answer=(b,s)=>at(b,`<div class="answer">${s}</div>`);
/** A person's request, as a speech bubble. */
export const request=(s,{who='You'}={})=>`<div class="req">${iconHTML('person',ROLE.you,26)}<div><b>${who}</b>${s}</div></div>`;
/** Styles that belong to one part: css('.p3-key{color:var(--q)}'). Start every class name with the part, pN-. */
export const css=text=>{const el=document.createElement('style');el.textContent=text;document.head.append(el);};
const WORDS='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(' ');
/** A small count in words: word(6) is 'six'; Word(6) starts a sentence. */
export const word=n=>WORDS[n]??String(n),Word=n=>word(n).replace(/^./,c=>c.toUpperCase());
/** A figure from figures/ as an illustration, with optional caption. */
export const illo=(name,alt,{cls='',cap=''}={})=>`<figure class="illo ${cls}"><img src="figures/${name}" alt="${esc(alt)}" loading="eager">${cap?`<figcaption>${cap}</figcaption>`:''}</figure>`;

// ---------------------------------------------------------------------------------------- slides
export const slides=[];
let chapter=null;
/** Name the chapter shown in the kicker of the slides that follow: chap('3.1','Knowledge work'). chap() clears it. */
export const chap=(k,title)=>{chapter=k?[k,title]:null;};
/** One slide. o: {builds, body, lines[], ask[], expected[], point, misconception, transition, source, nb, optional, demo}.
 lines, ask and expected need one entry per build. */
export function S_(id,section,title,o){
 const builds=o.builds||1;
 for(const k of ['lines','ask','expected'])if(!Array.isArray(o[k])||o[k].length!==builds)throw new Error(`${id}: ${k} needs ${builds} entries`);
 if(!meta.sections.some(s=>s.id===section))throw new Error(`${id}: unknown section ${section}`);
 if(slides.some(s=>s.id===id))throw new Error(`Slide id used twice: ${id}`);
 const ch=section==='optional'||section==='open'||section==='wrap'||o.nochap?null:chapter;
 slides.push({id,section,title,builds,body:o.body,prompts:o.lines,chapter:ch?`${ch[0]} ${ch[1]}`:'',notebook:o.nb||null,
  notes:{ask:o.ask,expected:o.expected,point:o.point||'',misconception:o.misconception||'',transition:o.transition||'',demo:o.demo||''},
  source:o.source||'',optional:!!o.optional});
}
/** An appendix slide: off the main route, shown with ?all and in the reading and print views. */
export const O=(id,title,o)=>S_(id,'optional',title,{...o,optional:true,lines:o.lines||o.ask});

/** The route strip: where part k sits among the five. */
export const strip=k=>`<div class="act-strip" role="img" aria-label="Part ${k} of ${PARTS.length}">${PARTS.map((t,i)=>`<span class="${i+1<k?'done':i+1===k?'now':''}">${i+1} · ${t[1]}</span>`).join('')}</div>`;
/** The slide that opens part k: its aim (lead), three or four steps, and an illustration. id part-k.
 o: {line, ask, expected, transition, img, alt, nb}. */
export function partBreak(k,title,lead,how,o){
 chapter=null;
 const text=`${p(lead)}<ol class="steps">${how.map(x=>`<li>${x}</li>`).join('')}</ol>`;
 S_(`part-${k}`,PARTS[k-1][0],`Part ${k} · ${title}`,{builds:1,nochap:true,nb:o.nb,
  body:`<div class="part-break">${strip(k)}${o.img?`<div class="columns" style="grid-template-columns:1.25fr 1fr">${`<div>${text}</div>`}${illo(o.img,o.alt||'')}</div>`:text}</div>`,
  lines:[o.line],ask:[o.ask],expected:[o.expected],transition:o.transition,point:o.point||'',source:o.source||''});
}
/** The slide that closes part k: what the part did (two or three lines) beside an agent card. id recap-k.
 o: {card, hi, title, ask, expected, point, transition}. */
export function recap(k,did,next,o){
 S_(`recap-${k}`,PARTS[k-1][0],`Part ${k} in one slide`,{builds:1,nochap:true,
  body:`<div class="part-break">${strip(k)}<div class="columns" style="grid-template-columns:1fr 1.1fr;align-items:center"><ol class="steps">${did.map(x=>`<li>${x}</li>`).join('')}</ol>${o.card?agentCard(o.card,{hi:o.hi||[],title:o.title||'',dim:o.dim}):(o.right||'')}</div></div>`,
  lines:[`<b>Next:</b> ${next}`],ask:[o.ask],expected:[o.expected],point:o.point||'',transition:o.transition});
}

/** An application slide, the same shape every time: an illustration, the request, the trace in three lanes, and a
 strip of facts (tools, what a person checks, evidence). o: {img, alt, req, steps, names, tools:[[icon, text]],
 check, evidence:{big, text}, builds, factsAt, evidenceAt, lines, ask, expected, point, source, nb, laneOpts}.
 Steps after the first appear at click 2 unless they set their own `at`. */
export function app(id,title,o){
 const builds=o.builds||2,factsAt=o.factsAt??2,evAt=o.evidenceAt??factsAt;
 const steps=o.steps.map((s,i)=>i===0||s.at!==undefined?s:{...s,at:2});
 const trace=lanes(steps,{names:o.names||{},W:o.img?960:1152,laneH:o.laneH||100,fs:o.fs||18,...(o.laneOpts||{}),alt:`The trace of the task: ${title}`});
 const facts=[
  o.tools?`<div class="f-tools"><small>Tools</small><div class="chips">${o.tools.map(([ic,t])=>chip(ic,t)).join('')}</div></div>`:'',
  o.check?`<div class="f-check"><small>A person checks</small><p>${o.check}</p></div>`:'',
  o.evidence?at(evAt,`<div class="f-ev"><small>${o.evidence.label||'Evidence'}</small><p>${o.evidence.big?`<b>${o.evidence.big}</b> `:''}${o.evidence.text}</p></div>`):''].filter(Boolean);
 const right=`${request(o.req,{who:o.who||'The request'})}${trace}`;
 const src=o.img&&!/Illustration/.test(o.source||'')?`${o.source||''}${o.source?' ':''}Illustration: generated.`:o.source;
 S_(id,o.section||'work',title,{...o,builds,source:src,
  body:`<div class="app${o.img?'':' noimg'}">${o.img?illo(o.img,o.alt||''):''}<div class="app-main">${right}</div></div>${at(factsAt,`<div class="facts f${facts.length}">${facts.join('')}</div>`)}`});
}
export {esc,agentCard};
