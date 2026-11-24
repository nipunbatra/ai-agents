// The "screens" of the talk: a code editor, a terminal, a diff, a file tree, the model's tool call, and the loop as a
// small strip that lights up where we are. They are plain HTML strings; every reveal uses the engine's data-at and
// data-only, so the builds, the reading view and the PDFs all work, and the motion is CSS that plays when something
// appears (lecture.css; it is switched off for print and for reduced motion).
import {esc} from './shared/author.js';
import {COL} from './widgets.js';
import {iconHTML} from './figures.js';

// ---------------------------------------------------------------------------------------- syntax colouring
const PY_KW=new Set('False None True and as assert break class continue def del elif else except finally for from global if import in is lambda not or pass raise return try while with yield'.split(' '));
const PY_BI=new Set('print len range str int float list dict set sum round open sorted min max any all enumerate zip isinstance input type'.split(' '));
const PY=/("""[\s\S]*?"""|'''[\s\S]*?''')|(#[^\n]*)|([frbFRB]{0,2}"(?:[^"\\\n]|\\.)*"|[frbFRB]{0,2}'(?:[^'\\\n]|\\.)*')|(@[A-Za-z_][\w.]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)/g;
const SH=/(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|((?<=\s)--?[A-Za-z][\w-]*)|(^\s*[\w./-]+|(?<=[|;&]\s*)[\w./-]+)/gm;
const JS_=/("(?:[^"\\\n]|\\.)*")(\s*:)?|(\b-?\d+(?:\.\d+)?\b)|\b(true|false|null)\b/g;
/** Tokens of a piece of code as [class, text] pairs. lang: 'python', 'bash', 'json' or 'text'. */
function tokens(text,lang){
 const out=[];let last=0;const push=(c,t)=>{if(t)out.push([c,t]);};
 const run=(re,kind)=>{for(const t of text.matchAll(re)){push('',text.slice(last,t.index));last=t.index+t[0].length;kind(t);}push('',text.slice(last));};
 if(lang==='python')run(PY,t=>{const [tok,doc,com,str,dec,num,call,word]=t;
  push(doc?'s':com?'c':str?'s':dec?'d':num?'n':call?(PY_KW.has(call)?'k':PY_BI.has(call)?'b':'f'):PY_KW.has(word)?'k':'',tok);});
 else if(lang==='bash')run(SH,t=>{const [tok,com,str,flag,cmd]=t;push(com?'c':str?'s':flag?'d':cmd?'f':'',tok);});
 else if(lang==='json')run(JS_,t=>{const [tok,str,colon,num,lit]=t;if(str){push(colon?'j':'s',str);push('',colon||'');}else push(num?'n':'k',tok);});
 else push('',text);
 return out;
}
/** Coloured code as HTML, one string per line. */
export function hlLines(text,lang='python'){
 const lines=[''];
 for(const [c,t] of tokens(String(text),lang))t.split('\n').forEach((part,i)=>{if(i)lines.push('');if(part)lines[lines.length-1]+=c?`<span class="t-${c}">${esc(part)}</span>`:esc(part);});
 return lines;
}
export const hl=(text,lang='python')=>hlLines(text,lang).join('\n');

// ---------------------------------------------------------------------------------------- windows
const builds=x=>Array.isArray(x)?x.join(','):String(x);
const bar=(title,kind)=>`<div class="win-bar"><i></i><i></i><i></i><span class="tab">${kind?iconHTML(kind,'currentColor',17):''}${esc(title)}</span></div>`;
const wrapAt=(at,html)=>at?`<div data-at="${at}">${html}</div>`:html;

/** A code editor window. o.focus: {build: [line numbers or [from, to] ranges]} dims every other line at that build
 (builds not listed show everything). o.notes: {line: [text, role colour, builds?]} puts a small tag at the end of a
 line. o.size: 's' or 'l'. o.at: the whole window appears at that build. o.from: number of the first line, or o.nums: a number for each line
 (for an excerpt that skips lines). */
export function editor(file,code,{lang='python',focus={},notes={},size='',at=0,from=1,nums=null,bare=false,icon='file'}={}){
 const lit=b=>{const s=new Set();for(const r of focus[b])if(Array.isArray(r))for(let i=r[0];i<=r[1];i++)s.add(i);else s.add(r);return s;};
 const sets=Object.fromEntries(Object.keys(focus).map(b=>[b,lit(b)]));
 const rows=hlLines(String(code).replace(/\n$/,''),lang).map((h,i)=>{const n=nums?nums[i]:i+from;
  const dim=Object.keys(sets).filter(b=>!sets[b].has(n)),on=Object.keys(sets).filter(b=>sets[b].has(n)),note=notes[n];
  return `<span class="ln" data-n="${n}">${h||' '}${dim.length?`<span class="veil" data-only="${dim.join(',')}"></span>`:''}${on.length?`<span class="mark" data-only="${on.join(',')}"></span>`:''}${
   note?`<span class="note" style="--c:${note[1]||COL.guess}"${note[2]?` data-only="${builds(note[2])}"`:''}>${note[0]}</span>`:''}</span>`;}).join('');
 return wrapAt(at,`<div class="win ed${size?' '+size:''}${bare?' bare':''}">${bare?'':bar(file,icon)}<pre class="win-body"><code>${rows}</code></pre></div>`);
}

/** A terminal window. rows: {cmd, at} is a command we see typed; {out, kind, at} is output ('ok', 'bad', 'dim' or
 plain; out may hold several lines). Rows with the same `at` appear together, the output just after the typing. */
export function term(rows,{title='Terminal',size='',at=0}={}){
 let delay=0,cur=null;
 const html=rows.map(r=>{
  if(r.at!==cur){cur=r.at;delay=0;}
  if(r.cmd!==undefined){const n=r.cmd.length,long=r.wrap??n>(size==='s'?72:58);   // a long command wraps and fades in; a short one is typed
   const h=`<span class="tl cmd${long?' long':''}"${r.at?` data-at="${r.at}"`:''}><span class="${long?'out':'type'}" style="--n:${n}">${hl(r.cmd,'bash')}</span></span>`;delay+=long?300:Math.min(1400,n*24)+160;return h;}
  return String(r.out).replace(/\n$/,'').split('\n').map(l=>{const h=`<span class="tl out ${r.kind||''}"${r.at?` data-at="${r.at}"`:''} style="--d:${delay}ms">${esc(l)||' '}</span>`;delay+=55;return h;}).join('');
 }).join('');
 const first=rows[0]?.at||0,idle=first>1?`<span class="tl cmd idle" data-only="1-${first-1}"><span class="caret"></span></span>`:'';
 return wrapAt(at,`<div class="win term${size?' '+size:''}">${bar(title,'terminal')}<pre class="win-body"><code>${idle}${html}</code></pre></div>`);
}

/** A change to a file. rows: [[' ', 'unchanged line'], ['-', 'removed'], ['+', 'added']]. o.plusAt: the added lines
 appear at that build (the removed ones are then struck out). */
export function diff(file,rows,{lang='python',size='',at=0,plusAt=0}={}){
 const cut=Math.min(...rows.filter(r=>r[1].trim()).map(r=>r[1].match(/^ */)[0].length));rows=rows.map(([k,t])=>[k,t.slice(cut)]);
 const html=rows.map(([k,t])=>`<span class="dl ${k==='-'?'minus':k==='+'?'plus':''}"${k==='+'&&plusAt?` data-at="${plusAt}"`:''}><b>${k==='-'?'−':k==='+'?'+':' '}</b>${hl(t,lang)||' '}</span>`).join('');
 return wrapAt(at,`<div class="win dif${size?' '+size:''}">${bar(file,'pen')}<pre class="win-body"><code>${html}</code></pre></div>`);
}

/** The project folder as a tree. rows: ['billing.py', 'inbox/', '  scan_0012.txt'] (two spaces of indent per level, a
 trailing / for a folder) or {name, at, only, kind}. marks: {name: [[builds, kind]]} tags a row at those builds; kind
 is 'read', 'edit', 'new', 'run', 'gone' or 'risk'. */
const MARK={read:['eye','reads',COL.data],edit:['pen','edits',COL.amber],new:['check','new',COL.green],run:['terminal','runs',COL.target],gone:['stop','deleted',COL.loss],risk:['alert','secret',COL.loss]};
export function tree(title,rows,{marks={},size='',at=0}={}){
 const html=rows.map((r,i)=>{const o=typeof r==='string'?{name:r}:r,depth=(o.name.match(/^ */)[0].length)/2,name=o.name.trim(),dir=name.endsWith('/');
  const ms=(marks[name]||[]).map(([b,k])=>`<span class="tm" data-only="${builds(b)}" style="--c:${MARK[k][2]}">${iconHTML(MARK[k][0],'currentColor',16)}${MARK[k][1]}</span><span class="glow" data-only="${builds(b)}" style="--c:${MARK[k][2]}"></span>`).join('');
  return `<div class="tr${dir?' dir':''}${o.kind?' '+o.kind:''}" style="--depth:${depth};--i:${i}"${o.at?` data-at="${o.at}"`:''}${o.only?` data-only="${builds(o.only)}"`:''}>${iconHTML(dir?'folder':'file',dir?COL.amber:'#8A94A6',19)}<span>${esc(name)}</span>${ms}</div>`;}).join('');
 return wrapAt(at,`<div class="tree${size?' '+size:''}"><div class="tree-h">${iconHTML('folder',COL.amber,20)}${esc(title)}</div>${html}</div>`);
}

// ---------------------------------------------------------------------------------------- the agent's messages
/** The model asking for a tool, as one line of code: toolCall('read_file', {path: 'billing.py'}). Long values are cut. */
export function callText(name,args,max=46){
 const short=v=>{const s=String(v).replace(/\s+/g,' ');return s.length>max?s.slice(0,max-1)+'…':s;};
 if(name==='edit_file'||name==='write_file')return `${name}(${JSON.stringify(short(args.path))}, …)`;
 return `${name}(${Object.values(args).map(v=>JSON.stringify(short(v))).join(', ')})`;
}
export function toolCall(name,args,{at=0,who='The model asks',max=46,note='',i=null}={}){
 return wrapAt(at,`<div class="tc"${i===null?'':` style="--i:${i}"`}><span class="tc-who">${iconHTML('spark',COL.guess,18)}${who}</span><code>${hl(callText(name,args,max),'python')}</code>${note?`<small>${note}</small>`:''}</div>`);
}
/** What our code hands back, when it is short. kind: 'ok', 'bad' or plain. */
export const toolBack=(text,{at=0,who='Our code returns',kind=''}={})=>wrapAt(at,`<div class="tb ${kind}"><span class="tb-who">${iconHTML('zap',COL.target,18)}${who}</span><code>${esc(text)}</code></div>`);
/** The model's final words. */
export const says=(text,{at=0,who='The model answers'}={})=>wrapAt(at,`<div class="sa"><span class="sa-who">${iconHTML('chat',COL.guess,18)}${who}</span><p>${text}</p></div>`);
/** One big sentence, for a beat between sections. */
export const statement=(html,sub='')=>`<div class="statement"><p>${html}</p>${sub?`<small>${sub}</small>`:''}</div>`;

// ---------------------------------------------------------------------------------------- the loop as a strip
/** The loop in one line, to show where we are: You → Model → Tool → Result, back round to Model, and out to Answer.
 on: {you, model, tool, result, answer} each a build list ('1', '2,3') at which that stop is lit. o.round: a label. */
let stripId=0;
export function loopStrip(on={},{round=''}={}){
 const N=[['you','You',COL.amber,40,72],['model','Model',COL.guess,150,96],['tool','Tool',COL.target,264,80],['result','Result',COL.data,380,100],['answer','Answer',COL.green,516,108]];
const y=96,h=44,id=`ls-${++stripId}`,GREY='#7B8698';
 const pill=(n,lit)=>{const [,name,c,x,w]=n;
  return `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${lit?c:'#fff'}" stroke="${c}" stroke-width="2.5"/>`+
   `<text x="${x}" y="${y+7.5}" text-anchor="middle" font-size="22" font-weight="${lit?700:600}" fill="${lit?'#fff':c}">${name}</text>`;};
 const mk=(mid,col)=>`<marker id="${mid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${col}"/></marker>`;
 const out=(col,mid,dash)=>`<path d="M${N[1][3]},${y-h/2-5} C${N[1][3]},${y-104} ${N[4][3]},${y-104} ${N[4][3]},${y-h/2-8}" fill="none" stroke="${col}" stroke-width="2.5"${dash?' stroke-dasharray="5 6"':''} marker-end="url(#${mid})"/>`+
  `<text x="${(N[1][3]+N[4][3])/2}" y="${y-40}" text-anchor="middle" font-size="22" font-weight="600" fill="${col}">no tool asked: done</text>`;
 let g=`<defs>${mk(id,GREY)}${mk(id+'g',COL.green)}</defs>`;
 for(const [a,b] of [[0,1],[1,2],[2,3]])g+=`<line x1="${N[a][3]+N[a][4]/2+4}" y1="${y}" x2="${N[b][3]-N[b][4]/2-6}" y2="${y}" stroke="${GREY}" stroke-width="2.5" marker-end="url(#${id})"/>`;
 g+=`<path d="M${N[3][3]},${y+h/2+5} C${N[3][3]},${y+104} ${N[1][3]},${y+104} ${N[1][3]},${y+h/2+8}" fill="none" stroke="${GREY}" stroke-width="2.5" marker-end="url(#${id})"/>`;
 g+=`<text x="${(N[1][3]+N[3][3])/2}" y="${y+56}" text-anchor="middle" font-size="22" font-weight="600" fill="${GREY}">and round again</text>`;
 g+=out(GREY,id,true);
 if(on.answer)g+=`<g data-only="${builds(on.answer)}">${out(COL.green,id+'g',false)}</g>`;
 for(const n of N){g+=`<g opacity=".7">${pill(n,false)}</g>`;if(on[n[0]])g+=`<g class="ls-on" data-only="${builds(on[n[0]])}"><rect class="ls-halo" x="${n[3]-n[4]/2-6}" y="${y-h/2-6}" width="${n[4]+12}" height="${h+12}" rx="${h/2+6}" fill="${n[2]}" opacity=".2"/>${pill(n,true)}</g>`;}
 return `<div class="lstrip">${round?`<span class="ls-round">${round}</span>`:''}<svg viewBox="0 0 576 194" role="img" aria-label="The loop: you, the model, a tool, its result, and the answer">${g}</svg></div>`;
}
import {ICONS} from './figures.js';
const ICON=name=>ICONS[name];

// ---------------------------------------------------------------------------------------- helpers for recorded runs
/** The last n non-empty lines of some tool output. */
export const tailLines=(text,n=4)=>String(text).split('\n').filter(l=>l.trim()).slice(-n).join('\n');
/** Is this step a run of the tests? */
export const isTest=s=>s.name==='bash'&&/pytest/.test(s.args.command||'');
/** Terminal rows for one bash step: the command typed, then the end of its output, red or green by its exit code. */
export const bashRows=(s,{at=0,lines=5,outAt=at}={})=>[{cmd:s.args.command,at},{out:tailLines(s.result,lines)||'(no output)',kind:s.exit?'bad':isTest(s)?'ok':'',at:outAt}];
/** The first sentence of a model's answer, with `code` marks turned into monospace. */
export const firstSentence=text=>esc(String(text).trim().split(/(?<=[.!?])\s+/)[0]).replace(/`([^`]+)`/g,'<span class="mono">$1</span>');
/** A test run for a slide: the command, the progress line, each assertion that failed, and the summary line. */
export function testRows(s,{at=0}={}){
 const ls=s.result.split('\n').map(l=>l.trimEnd()).filter(Boolean),dots=ls.find(l=>/^[.FEsx]+\s*(\[|$)/.test(l)),errs=ls.filter(l=>/^E\s+\w*Error/.test(l)).map(l=>l.replace(/^E\s+/,'E   ')),sum=ls.findLast(l=>/\d+ (passed|failed)/.test(l))||ls.at(-1);
 return [{cmd:s.args.command,at},...(dots?[{out:dots.replace(/\s+\[.*$/,''),kind:'dim',at}]:[]),...errs.map(e=>({out:e,kind:'hot',at})),{out:sum.replace(/^=+\s*|\s*=+$/g,''),kind:s.exit?'bad':'ok',at}];
}
