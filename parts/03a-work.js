// Part 3, first half: the same agent, two other jobs. Nothing in its code changes: the same four tools and the same
// loop; only the request does. 3.1 tidies a messy inbox (ten badly named files into four folders, renamed by date and
// sender); 3.2 checks six supplier invoices against the purchase orders and writes a list of mismatches. Each job is
// set up, run live in the notebook, then shown from our recorded run and checked against what we know to be true.
// Everything shown is data/traces.json (keys tidy and invoices; scripts/sci/traces.py). parts/03b-work.js follows.
import {S_,partBreak,chap,nbRun,nb,data,need,css,esc,at,only,request,word,Word,num,kY,
 COL,iconHTML,editor,term,tree,toolCall,statement,loopStrip,hl} from '../kit.js';

const T=need(await data('traces'),'agent','tidy','invoices','model','date_text'),A=T.agent;
const TD=need(T.tidy,'goal','steps','check','inbox','right','dated','rounds','seconds');
const IV=need(T.invoices,'goal','steps','check','report','invoices','orders','right','problems','rounds','seconds');
const claim=(ok,what)=>{if(!ok)throw new Error(`Part 3 was written for a run in which ${what}. Record it again, or rewrite the slide.`);};

// ---------------------------------------------------------------------------------------- small helpers
const base=p=>String(p).split('/').pop();
const cut=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
const sec=r=>num(r.seconds,0);
const cmdLines=s=>String(s.args.command||'').split('\n').filter(l=>l.trim());
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
/** A request as HTML, with file and folder names in monospace. */
const named=(text,extra=[])=>esc(text).replace(new RegExp(`(${[...extra.map(reEsc),String.raw`[\w-]+\/(?:[\w.\/-]*\w)?`,String.raw`[\w-]+_[\w.-]*\w`,String.raw`[\w-]+\.(?:txt|md|csv|py)\b`].join('|')})`,'g'),'<span class="mono">$1</span>');
const ARROW=`<svg class="p3a-arrow" viewBox="0 0 48 24" width="52" height="26" aria-hidden="true" fill="none" stroke="#8D97A8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h40M33 4l10 8-10 8"/></svg>`;
const tick=ok=>`<span class="p3a-tick ${ok?'ok':'no'}">${iconHTML(ok?'check':'alert','currentColor',20)}</span>`;

css(`.p3a-q .req{font-size:32px;line-height:1.42;padding:24px 32px 26px;border-radius:26px 26px 26px 8px}.p3a-q .req b{font-size:16px;margin-bottom:6px}
.p3a-q .req>svg{width:32px;height:32px;margin-top:4px}.p3a-q .mono{white-space:nowrap;overflow-wrap:normal;font-size:.86em;background:#AA4E0812;border-radius:6px;padding:1px 5px;margin:0 -1px}
.p3a-mess{display:grid;grid-template-columns:minmax(0,.86fr) auto minmax(0,1.14fr);gap:24px;align-items:center;width:100%}
.p3a-mess>div{min-width:0;display:flex;flex-direction:column;gap:18px}
.p3a-mess>div:last-child .tree{font-size:24px;padding:14px 12px 16px}.p3a-mess>div:last-child .tree .tr{padding-top:7px;padding-bottom:7px}.p3a-mess>div:last-child .tree-h{font-size:18px;padding-bottom:10px}
.p3a-name{border:2px dashed #AAB3BC;border-radius:14px;background:#fff;padding:18px 22px 14px;font:22px/1.2 "SFMono-Regular",Menlo,Consolas,monospace;display:flex;align-items:flex-start;white-space:nowrap}
.p3a-name span{display:inline-flex;flex-direction:column;gap:7px}.p3a-name i{font:650 16px/1 var(--font);font-style:normal;letter-spacing:.3px;padding-top:6px}
.p3a-name .d{color:var(--data);font-weight:650}.p3a-name .s{color:var(--noise);font-weight:650}
.p3a-name u{text-decoration:none;border-bottom:3px solid currentColor;padding-bottom:5px}
.p3a-walk{display:grid;grid-template-columns:1fr 1.42fr;gap:30px;align-items:center;width:100%}
.p3a-walk>div,.p3a-walk .state-slot>div{min-width:0;display:flex;flex-direction:column;gap:14px}
.p3a-wrap .win-body{white-space:pre-wrap;overflow-wrap:anywhere}
.p3a-err{display:flex;flex-direction:column;gap:20px;width:100%}
.p3a-err .top{display:grid;grid-template-columns:.9fr 1.25fr;gap:34px;align-items:center}.p3a-err .top>div{min-width:0}
.p3a-ba{display:grid;grid-template-columns:minmax(0,.66fr) auto minmax(0,1.2fr);gap:22px;align-items:stretch;width:100%}.p3a-ba>div{display:flex;min-width:0}.p3a-ba>div>.tree{flex:1}.p3a-ba>div:first-child .tree .tr{padding-top:5.5px;padding-bottom:5.5px}.p3a-ba>.p3a-arrow{align-self:center}
.p3a-ba .tree.s .tr{padding-top:0;padding-bottom:0}.p3a-ba .tree.s .tr.dir{margin-top:4px}
.p3a-chk{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:44px;align-items:center;width:100%}
.p3a-key{border:2px solid var(--line);border-radius:14px;background:#fff;padding:8px 18px 10px;display:grid;grid-template-columns:max-content minmax(0,1fr) 92px 92px;align-items:stretch}
.p3a-key>*{padding:5px 22px 5px 0;min-width:0;border-top:1px solid #EEF0F3;display:flex;align-items:center}.p3a-key>div{justify-content:center;padding-right:0}.p3a-key>b{font:700 16px/1.2 var(--font);letter-spacing:.6px;text-transform:uppercase;color:var(--muted);border-top:0;padding:6px 0 7px}
.p3a-key>b.c{justify-content:center;padding-right:0}
.p3a-key .f{font:19px/1.3 "SFMono-Regular",Menlo,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.p3a-key .k{font-size:20px;line-height:1.24;color:#374151}
.p3a-dot{display:block;width:13px;height:13px;border-radius:50%;border:2.5px solid #C5CCD6;margin:0 auto}.p3a-key .state-slot{place-items:center}
.p3a-tick{display:flex;align-items:center;height:100%}.p3a-tick.ok{color:var(--d)}.p3a-tick.no{color:var(--loss)}.p3a-tick svg{stroke-width:3}
.p3a-nums{display:flex;flex-direction:column;gap:30px}.p3a-nums>div{display:flex;flex-direction:column;gap:4px;border-left:6px solid var(--d);padding-left:20px}
.p3a-nums b{font-size:62px;line-height:1;letter-spacing:-2px;font-weight:700;color:var(--d);font-variant-numeric:tabular-nums}.p3a-nums b small{font-size:30px;letter-spacing:0;font-weight:650}
.p3a-nums span{font-size:25px;line-height:1.3;color:#374151}.p3a-nums .bad{border-color:var(--loss)}.p3a-nums .bad b{color:var(--loss)}
.p3a-nums.run>div{border-color:#AAB3BC}.p3a-nums.run b{color:var(--ink)}
.p3a-job{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.12fr);gap:36px;align-items:center;width:100%}
.p3a-orders{border:2px solid var(--line);border-radius:14px;background:#fff;padding:10px 8px 8px}
.p3a-orders .tree-h{display:flex;align-items:center;gap:8px;font:650 17px/1 var(--font);color:var(--muted);padding:4px 10px 8px;letter-spacing:.3px}
.p3a-orders table{font-size:23px;line-height:1.3}.p3a-orders th{font-size:17px;letter-spacing:.3px;padding:6px 12px}.p3a-orders td{padding:10px 12px;border-top:1px solid #EEF0F3}
.p3a-orders td.n,.p3a-orders th.n{text-align:right;font-variant-numeric:tabular-nums}.p3a-orders td .mono{font-size:.88em}
.p3a-orders tr.hit td{transition:background .3s ease}
.scene:not([data-build="1"]) .p3a-orders tr.hit td{background:#245EDB14}.scene:not([data-build="1"]) .p3a-orders tr.hit td.diff{color:var(--loss);font-weight:700}
.p3a-did{display:grid;grid-template-columns:1.12fr 1fr;gap:38px;align-items:center;width:100%}.p3a-did>div{min-width:0}
.p3a-calls{display:flex;flex-direction:column;gap:6px;margin:0;font:inherit;white-space:normal}.p3a-calls .tc{padding:4px 14px 5px;animation:slidein .35s ease both;animation-delay:calc(var(--i)*.22s)}
.p3a-calls .tc code{font-size:19px}.p3a-calls .tc-who{display:none}.p3a-calls .more{font-size:19px;color:var(--muted);padding:0 16px}
.reveal-hidden .p3a-calls .tc,.p3a-calls .reveal-hidden .tc{animation:none}
.p3a-found{display:flex;flex-direction:column;gap:24px;width:100%}
.p3a-six{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:12px}
.p3a-six>div{position:relative;border:2px solid var(--line);border-top:6px solid #AAB3BC;border-radius:14px;background:#fff;padding:14px 12px 13px 16px;min-width:0;display:flex;flex-direction:column;gap:6px;min-height:126px}
.p3a-six code{font:650 20px/1.2 "SFMono-Regular",Menlo,Consolas,monospace;color:#374151}.p3a-six p{font-size:22px;line-height:1.2;color:var(--muted)}
.p3a-six>div{transition:border-color .3s ease}.scene:not([data-build="1"]) .p3a-six .wrong{border-top-color:var(--loss)}.p3a-six .wrong p{color:var(--loss);font-weight:650}
.p3a-six em{font:650 16px/1 var(--font);font-style:normal;margin-top:auto;display:inline-flex;align-items:center;gap:6px;color:var(--muted)}
.p3a-six em.flag{align-self:flex-start;color:#fff;background:var(--q);border-radius:999px;padding:5px 11px 5px 9px}
.p3a-six .p3a-tick{position:absolute;right:10px;top:9px;height:auto}
.p3a-who{display:flex;align-items:center;gap:14px;font-size:27px;line-height:1.3;background:#AA4E080F;border:2px solid #AA4E0855;border-radius:14px;padding:11px 20px}
.p3a-who svg{flex:none}
.p3a-same{display:flex;flex-direction:column;gap:34px;width:100%}.p3a-same .statement{min-height:0}
.p3a-jobs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.p3a-jobs>div{border:2px solid var(--line);border-top:6px solid var(--noise);border-radius:16px;background:#fff;padding:16px 20px 18px;display:flex;flex-direction:column;gap:8px;min-width:0}
.p3a-jobs h3{font-size:26px;line-height:1.2;display:flex;align-items:center;gap:10px;margin:0}.p3a-jobs p{font-size:22px;line-height:1.3;color:var(--muted)}
@media(max-width:760px){.reading .p3a-mess,.reading .p3a-walk,.reading .p3a-err .top,.reading .p3a-ba,.reading .p3a-chk,.reading .p3a-job,.reading .p3a-did,.reading .p3a-jobs{grid-template-columns:minmax(0,1fr)}
 .reading .p3a-six{grid-template-columns:repeat(2,minmax(0,1fr))}.reading .p3a-q .req{font-size:20px;padding:14px 16px}.reading .p3a-q .mono{white-space:normal;overflow-wrap:anywhere}
 .reading .p3a-arrow{display:none}.reading .p3a-nums b{font-size:40px}.reading .p3a-name{font-size:12px;flex-wrap:wrap}
 .reading .p3a-key{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) 38px 38px;padding:6px 10px}.reading .p3a-key>*{padding-right:8px}.reading .p3a-key .f{font-size:12px}.reading .p3a-key .k{font-size:14px}.reading .p3a-key>b{font-size:11px}
 .reading .p3a-orders table{font-size:15px;min-width:0}.reading .p3a-orders td,.reading .p3a-orders th{padding:6px}.reading .p3a-calls .tc code{font-size:14px}
 .reading .p3a-six code{font-size:15px}.reading .p3a-six p{font-size:16px}.reading .p3a-who{font-size:18px}.reading .p3a-jobs h3{font-size:20px}}`);

partBreak(3,'The same agent, other jobs','From here on the agent’s code does not change. Only the request does.',
 ['Tidy a messy folder','Check invoices against orders','The same loop in real products','How much freedom each job should get'],
 {img:'part-work.jpg',alt:'Illustration: a small town with an office, a farm, a lab and a clinic, joined by thin lines to one small spark',nb:nb('part-3'),
  line:'Key question: what else can the same four tools and loop do, and who checks the result?',
  ask:'Which job in your week is mostly opening files, reading them and filing them?',
  expected:'Expense claims, supplier paperwork, a shared drive, a monthly report. Keep one in mind: the next two jobs are of that kind.',
  point:'The agent from Part 1 was not built for code. It can do any job that can be done by reading files, writing files and running commands.',
  transition:'The first job is a folder nobody has sorted.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 3.1 tidy a messy folder
chap('3.1','Tidy a folder');
const N=TD.inbox.length,FILE=Object.fromEntries(TD.inbox.map(f=>[f.name,f]));
const NAMES=TD.inbox.map(f=>f.name).sort((a,b)=>a<b?-1:a>b?1:0);            // the order ls prints them in
const KINDS=[...new Set(TD.inbox.map(f=>f.kind))];
const KIND_TEXT={delivery_notes:'a delivery note',customer_letters:'a customer’s letter',price_lists:'a price list',receipts:'a payment receipt'};
const kindText=k=>KIND_TEXT[k]||k.replace(/_/g,' ');
const kindName=k=>k.replace(/_/g,' ').replace(/s$/,'');
const TS=TD.steps,of=s=>`Round ${s.round} of ${TD.rounds}`;
{
 const ex=(TD.goal.match(/(\d{4}-\d{2}-\d{2})_([\w-]+)(\.\w+)/)||(base(TD.check[0].now).match(/(\d{4}-\d{2}-\d{2})_([\w-]+)(\.\w+)/))||[]).slice(1);
 claim(ex.length===3,'the request gave an example of a dated file name');
 S_('tidy-mess','work',`${Word(N)} files, and no name says what is inside`,{builds:2,
  body:`<div class="p3a-mess"><div>${tree('inbox/',NAMES)}</div>${ARROW}
   <div>${tree('where they should go',KINDS.map(k=>k+'/'))}
    ${at(2,`<div class="p3a-name"><span class="d"><u>${esc(ex[0])}</u><i>date</i></span><span>_</span><span class="s"><u>${esc(ex[1])}</u><i>sender</i></span><span>${esc(ex[2])}</span></div>`)}</div></div>`,
  lines:[`The shop’s inbox for October. Each file belongs in one of ${word(KINDS.length)} folders, and no name says which.`,
   'We also want each file renamed to its date and its sender.'],
  ask:['Which of these is a complaint from a customer?','Why put the date first in the name?'],
  expected:['Nobody can tell from the names. Someone has to open each file and read it.','Then any file browser lists the folder in date order.'],
  point:`A dull, real office chore: open, read, decide, file and rename. ${Word(N)} times here, and thousands of times in a real office.`,
  transition:'We give this job to the same agent.',
  source:'The inbox is made up for this talk. The notebook creates it (make_workspace).'});
}

S_('tidy-ask','work','We ask in plain words',{builds:1,
 body:`<div class="p3a-q">${request(named(TD.goal,KINDS),{who:'Our request'})}</div>`,
 lines:['We name the folders and give one example. We do not say which file goes where.'],
 ask:['What have we left for the agent to work out?'],
 expected:['What each file is, its date and who sent it. All of that is inside the files, so it will have to read them.'],
 point:'The request describes the result we want. The steps are left to the model.',
 transition:'Over to the notebook.'});

nbRun('nb-tidy','work','3.1','Tidy a messy folder',{
 run:'tidy = run_agent(TIDY_TASK, max_rounds=30)\nprint(sh("ls -R inbox")[1])',
 look:['What does it do before it moves anything?','What does inbox/ look like at the end?'],
 line:'The agent is the one from Part 1, with the same four tools. Only the request is new.',
 ask:'What does it have to do before it can move a single file?',expected:'Open each file and read it. The names tell it nothing.',
 point:'A new job needed a new request. It needed no new code.',
 transition:'Here is our recorded run.'});

{
 const reads=TS.filter(s=>s.name==='read_file'&&FILE[base(s.args.path)]),seen=[...new Set(reads.map(s=>base(s.args.path)))];
 claim(reads.length>=2,'the agent opened the inbox files with read_file');
 const r1=reads[0],r2=reads.find(s=>s!==r1&&FILE[base(s.args.path)].kind==='customer_letters')||reads.at(-1);
 const f1=FILE[base(r1.args.path)],f2=FILE[base(r2.args.path)],plain=f2.kind==='customer_letters'&&!/letter/i.test(f2.text);
 const rounds=new Set(reads.map(s=>s.round)).size;
 const marks=Object.fromEntries(seen.map(n=>[n,[[n===f1.name?'1,2':'2','read']]]));
 const show=(s,f)=>`${toolCall(s.name,s.args)}<div class="p3a-wrap">${editor(s.args.path,f.text,{lang:'text'})}</div>`;
 S_('tidy-reads','work',seen.length===N?'First it reads every file':`First it reads ${word(seen.length)} of the ${word(N)} files`,{builds:2,
  body:`<div class="p3a-walk"><div>${tree('inbox/',NAMES,{marks})}</div><div>${only('1',show(r1,f1))}${only('2',show(r2,f2))}</div></div>`,
  lines:[`A name tells it nothing, so it asks to read the first file. It is ${kindText(f1.kind)}.`,
   `${Word(reads.length)} reads in ${word(rounds)} rounds. This one is ${kindText(f2.kind)}${plain?', and no line in it says so':''}.`],
  ask:['Could it have sorted the files without opening them?',`How does it know that this file is ${kindText(f2.kind)}?`],
  expected:[`No. A name like ${f1.name} says nothing about what is inside.`,`From what the text says${plain?': someone is writing to the shop about something they bought':''}. A rule that searched for a fixed word would miss it.`],
  point:'It reads the way we would, one file at a time, and it sorts by what the text means.',
  transition:'It now knows what every file is. Next it moves them.',
  source:`Our recorded run, ${T.date_text}: rounds ${reads[0].round} to ${reads.at(-1).round} of ${TD.rounds}. Two of the files it read are shown.`});
}

{
 const iBad=TS.findIndex(s=>s.name==='bash'&&s.exit),bad=TS[iBad],retry=bad&&TS[iBad+1]?.name==='bash'?TS[iBad+1]:null;
 const bare=l=>l.replace(/["'\\]/g,'');
 const badLine=bad&&(cmdLines(bad).find(l=>bad.result.includes(l))||cmdLines(bad)[0]);
 const fixLine=retry&&cmdLines(retry).find(l=>l!==badLine&&bare(l)===bare(badLine));
 const size=n=>n<=84?'':n<=100?'s':'xs';
 const asks=(cmd,note)=>`<div class="tc"><span class="tc-who">${iconHTML('spark',COL.guess,18)}The model asks</span><code>${hl(cmd.includes('"')?`bash('${cut(cmd,36)}')`:`bash("${cut(cmd,36)}")`,'python')}</code><small>${note}</small></div>`;
 if(fixLine){
  const err=bad.result.split('\n').find(l=>l.trim())||'',n=cmdLines(bad).length;
  const brackets=/[()]/.test(badLine),quoted=/["']/.test(fixLine)&&!/["']/.test(badLine);
  const gone=(retry.result.match(/No such file/g)||[]).length;
  const long=Math.max(badLine.length,fixLine.length,err.length)+2;
  S_('tidy-error','work','A command fails. It reads the error and tries again',{builds:2,
   body:`<div class="p3a-err"><div class="top"><div>${only('1',loopStrip({tool:'1',result:'1'},{round:of(bad)}))}${only('2',loopStrip({model:'2',tool:'2',result:'2'},{round:of(retry)}))}</div>
     <div>${only('1',asks(badLine,`One of ${word(n)} lines in the same request.`))}${only('2',asks(fixLine,quoted?'The same line, with the name in quotes.':'The same line, corrected.'))}</div></div>
    ${term([{cmd:cut(badLine,112),wrap:false},{out:`exit code ${bad.exit}`,kind:'bad'},{out:cut(err,112),kind:'bad'},{cmd:cut(fixLine,112),at:2,wrap:false},{out:`exit code ${retry.exit}`,kind:retry.exit?'bad':'ok',at:2}],{size:size(long)})}</div>`,
   lines:[`It asks for all the moves in one command. ${brackets?'One file name has brackets, and the shell stops.':'The shell stops with an error.'}`,
    `The error goes back to the model as the result. Next round, ${quoted?'that name is in quotes':'the line is corrected'}.`],
   ask:['What does our code do when a command fails?',quoted?'Who told it to add the quotes?':'Who told it what to change?'],
   expected:[`Nothing special. It returns the exit code and the error text to the model, like any other result.${gone?` (The lines above the bad one had already run, so the retry complained about ${word(gone)} files that were gone. The agent then listed the folder to check.)`:''}`,
    'Nobody, in that round. It read the error message. Our description of the bash tool does ask for quotes around such names, and the first time it left them out.'],
   point:'An error is one more result in the conversation. The loop lets the model read it and try again.',
   misconception:'That an agent has to get every step right. It has to notice when a step went wrong, and here the exit code and the error text told it.',
   transition:'So what does the inbox look like now?',
   source:`Our recorded run, ${T.date_text}: rounds ${bad.round} and ${retry.round} of ${TD.rounds}. Each command had ${n} lines; the one that failed is shown.`});
 }else{
  const mv=TS.find(s=>s.name==='bash'&&/\bmv\b/.test(s.args.command||''));
  claim(mv,'the agent moved the files with mv');
  const ls=cmdLines(mv),shown=ls.slice(0,5).map(l=>cut(l,112)),long=Math.max(...shown.map(l=>l.length))+2;
  S_('tidy-error','work','Then it moves and renames the files',{builds:1,
   body:`<div class="p3a-err"><div class="top"><div>${loopStrip({model:'1',tool:'1'},{round:of(mv)})}</div><div>${asks(ls[0],`${Word(ls.length)} ${ls.length>1?'lines':'line'} in one request.`)}</div></div>
    ${term([...shown.map(l=>({cmd:l,wrap:false})),...(ls.length>shown.length?[{out:'…',kind:'dim'}]:[]),{out:`exit code ${mv.exit}`,kind:mv.exit?'bad':'ok'}],{size:size(long)})}</div>`,
   lines:['Each move puts a file in its folder and gives it the new name, in one step.'],
   ask:['Where did the new names come from?'],
   expected:['From the text of each file: its date and its sender. Nothing in the old names helped.'],
   point:'One shell command does the moving. The work was in knowing where each file belongs.',
   transition:'So what does the inbox look like now?',
   source:`Our recorded run, ${T.date_text}: round ${mv.round} of ${TD.rounds}.`});
 }
}

{
 const placed=TD.check.map(c=>{const [dir,...rest]=c.now.split('/');return {...c,dir,file:rest.join('/')};}).filter(c=>c.file);
 const dirs=[...new Set(placed.map(c=>c.dir))].filter(d=>d!=='inbox').sort((a,b)=>(KINDS.indexOf(a)+1||99)-(KINDS.indexOf(b)+1||99)||(a<b?-1:1));
 const index=!!String(TD.index||'').trim();
 const rows=[...dirs.flatMap(d=>[d+'/',...placed.filter(c=>c.dir===d).map(c=>'  '+c.file).sort()]),...placed.filter(c=>c.dir==='inbox').map(c=>c.file).sort(),...(index?['INDEX.md']:[])];
 const marks=Object.fromEntries([...dirs.map(d=>d+'/'),'INDEX.md'].map(n=>[n,[['2','new']]]));
 S_('tidy-after','work','The inbox, before and after',{builds:2,
  body:`<div class="p3a-ba"><div>${tree('inbox/ before',NAMES)}</div>${ARROW}<div>${tree('inbox/ after',rows,{size:'s',marks})}</div></div>`,
  lines:[`On the left, the inbox as we found it. On the right, the same folder ${sec(TD)} seconds later.`,
   `${Word(dirs.length)} new folders${index?' and an index file':''}. ${placed.length===N?`${Word(N)} files went in and ${word(N)} came out`:`${Word(placed.length)} of the ${word(N)} files are still there`}.`],
  ask:['What do the new names have in common?','What should we check before we trust this?'],
  expected:['Each starts with the date, then the sender. The folder now lists in date order.','That each file is in the right folder, and that nothing was lost or overwritten. A folder can look tidy and still be wrong.'],
  point:'One request, and the whole chore is done: read, decide, move, rename, index.',
  transition:'It looks right. Is it right?',
  source:`Our recorded run, ${T.date_text} (${esc(T.model)}): the folder as the notebook lists it after the run.`});

 const all=TD.right===N&&TD.dated===N;
 S_('tidy-check','work','Did it get it right?',{builds:2,
  body:`<div class="p3a-chk"><div class="p3a-key"><b>File</b><b>What it really is</b><b class="c">Folder</b><b class="c">Name</b>
    ${TD.check.map(c=>`<span class="f">${esc(c.was)}</span><span class="k">${esc(kindName(FILE[c.was].kind))}</span>${[c.right_folder,c.dated_name].map(ok=>`<div>${only('1','<span class="p3a-dot"></span>')}${only('2',tick(ok))}</div>`).join('')}`).join('')}</div>
   <div>${only('1',`<div class="p3a-nums run"><div><b>${TD.rounds} <small>rounds</small></b><span>each one a call to the model</span></div><div><b>${sec(TD)} <small>seconds</small></b><span>of model time</span></div></div>`)}
    ${only('2',`<div class="p3a-nums"><div${TD.right===N?'':' class="bad"'}><b>${TD.right} <small>of ${N}</small></b><span>in the right folder</span></div>
    <div${TD.dated===N?'':' class="bad"'}><b>${TD.dated} <small>of ${N}</small></b><span>named by date and sender</span></div></div>`)}</div></div>`,
  lines:['We wrote these files, so we know what each one really is.',
   `${all?'Every file is in the right folder, with a dated name':`${Word(TD.right)} are in the right folder and ${word(TD.dated)} have a dated name`}.`],
  ask:['How would you check this in a real office, where nobody has an answer key?','Would you run this on your own documents folder tomorrow?'],
  expected:['Check a sample by hand, or sort a small set yourself first and compare. That small labelled set is an eval; Part 4 builds one.',
   'On a copy, yes. It moves and renames real files, so a wrong move matters. Part 4 is about that.'],
  point:'We can count how well it did only because we know the right answers. Keep a small set like this for your own tasks.',
  transition:'The second job involves money.',
  source:`Checked by the notebook (section 3.1) against the list the files were made from. ${esc(T.model)}, ${T.date_text}.`});
}

// ---------------------------------------------------------------------------------------- 3.2 check invoices against orders
chap('3.2','Check invoices');
const NI=IV.invoices.length,IS=IV.steps;
{
 const head=IV.orders.trim().split('\n')[0].split(','),ORD=IV.orders.trim().split('\n').slice(1).map(l=>Object.fromEntries(l.split(',').map((v,i)=>[head[i],v])));
 const x=IV.invoices.find(i=>i.problem==='unit price')||IV.invoices.find(i=>i.problem==='quantity')||IV.invoices[0],o=ORD.find(r=>r.po_number===x.po);
 const L=x.text.replace(/\n$/,'').split('\n'),ln=re=>L.findIndex(l=>re.test(l))+1,lPO=ln(/^Against purchase order/i),lQ=ln(/^Quantity/i),lP=ln(/^Unit price/i);
 const price=o&&x.problem==='unit price',qty=o&&x.problem==='quantity';
 const notes=price?{[lP]:[`the order says Rs ${esc(o.unit_price)}`,COL.loss,[2]]}:qty?{[lQ]:[`the order says ${esc(o.quantity)}`,COL.loss,[2]]}:{};
 S_('invoice-job','work',`${Word(NI)} invoices to check before anything is paid`,{builds:2,
  body:`<div class="p3a-job"><div>${editor(`invoices/${x.number}.txt`,x.text,{lang:'text',focus:{2:[lPO,lQ,lP].filter(Boolean)},notes})}</div>
   <div class="p3a-orders"><div class="tree-h">${iconHTML('database',COL.data,20)}data/purchase_orders.csv</div>
    <table><thead><tr><th>Order</th><th>Item</th><th class="n">Quantity</th><th class="n">Unit price</th></tr></thead><tbody>${ORD.map(r=>`<tr${r===o?' class="hit"':''}><td><span class="mono">${esc(r.po_number)}</span></td><td>${esc(r.item)}</td><td class="n${r===o&&qty?' diff':''}">${esc(r.quantity)}</td><td class="n${r===o&&price?' diff':''}">Rs ${esc(r.unit_price)}</td></tr>`).join('')}</tbody></table></div></div>`,
  lines:['An invoice from a supplier, and the orders the shop placed. Do they match?',
   `${price?`The order says Rs ${esc(o.unit_price)} each. The invoice charges Rs ${x.unit_price}.`:qty?`The order was for ${esc(o.quantity)}. The invoice bills ${x.quantity}.`:'Three lines have to agree with the order.'} ${Word(NI)} invoices need this check.`],
  ask:['What would you compare, and in what order?','Who does this job in your organisation today?'],
  expected:['The order number first, then the quantity and the unit price against that order.','Usually someone in accounts, by eye, near the end of the month. It is slow work, and a tired reader misses things.'],
  point:'Checking one document against another is careful, repetitive work, and a lot of office work looks like it.',
  transition:'Again, all we write is the request.',
  source:'The invoices and the orders are made up for this talk; the notebook creates them. The orders file also names each supplier.'});
}

S_('invoice-ask','work','The request says what “fine” means',{builds:1,
 body:`<div class="p3a-q">${request(named(IV.goal),{who:'Our request'})}</div>`,
 lines:['We ask for a list. We do not ask it to pay or reject anything.'],
 ask:['What did we not ask it to do?'],
 expected:['Pay, reject or write to a supplier. We asked for a report only. That was a choice, and we come back to it.'],
 point:'The request holds the rule and the output we want: a report, and no action.',
 transition:'Over to the notebook.'});

nbRun('nb-invoices','work','3.2','Check invoices against orders',{
 run:'audit = run_agent(INVOICE_TASK, max_rounds=20)\nprint((WORK / "mismatches.md").read_text())',
 look:['How many files does it read?','Which invoices end up in mismatches.md?'],
 line:'Same agent again. We pass the new request, and wait for the file it writes.',
 ask:`How many of the ${word(NI)} do you expect it to flag?`,expected:`We put a problem in ${word(IV.problems)} of them. Watch whether it finds exactly those.`,
 point:'Again there is no new code, only a new request.',
 transition:'Here is our recorded run.'});

{
 const reads=IS.filter(s=>s.name==='read_file'),inv=reads.filter(s=>/(^|\/)invoices\//.test(s.args.path)),writes=IS.filter(s=>s.name==='write_file');
 claim(writes.length&&inv.length,'the agent read the invoices with read_file and wrote its report with write_file');
 const iW=IS.indexOf(writes[0]),wrote=new Set(writes.map(s=>s.args.path)),paths=[...new Set([...reads,...writes].map(s=>s.args.path))];
 const dirs=[...new Set(paths.filter(p=>p.includes('/')).map(p=>p.split('/')[0]))];
 const rows=[...dirs.flatMap(d=>[d+'/',...paths.filter(p=>p.startsWith(d+'/')).map(p=>'  '+p.slice(d.length+1))]),...paths.filter(p=>!p.includes('/')).map(p=>wrote.has(p)?{name:p,at:2}:p)];
 const marks=Object.fromEntries(paths.map(p=>[base(p),wrote.has(p)?[['2','new']]:[['1,2','read']]]));
 const each=new Set(inv.map(s=>s.round)).size===inv.length,unused=['read_file','write_file','edit_file','bash'].filter(t=>!IS.some(s=>s.name===t));
 const list=IS.length<=10?IS.map((s,i)=>[s,i]):[...IS.slice(0,4).map((s,i)=>[s,i]),[null,4],...IS.slice(-4).map((s,i)=>[s,IS.length-4+i])];
 S_('invoice-did','work','It reads everything, then writes one file',{builds:2,
  body:`<div class="p3a-did"><pre class="p3a-calls">${list.map(([s,i],k)=>s?toolCall(s.name,s.args,{max:40,i:i>=iW?0:k,at:i>=iW?2:0}):`<div class="more">… ${IS.length-8} more</div>`).join('')}</pre>
   <div>${tree('workspace/',rows,{marks})}</div></div>`,
  lines:[`It lists the folder, reads the orders, then reads ${inv.length===NI?`all ${word(NI)} invoices`:`${word(inv.length)} of the ${word(NI)} invoices`}${each?', one each round':''}.`,
   `Then ${word(writes.length)} write_file, and it stops: ${IV.rounds} rounds, ${sec(IV)} seconds, and one new file in the project.`],
  ask:['Which of the four tools has it not used so far?','What has changed in the project?'],
  expected:[`${unused.includes('edit_file')?'edit_file. There is nothing here to change: it is only reading.':'Count them in the list on the left.'}`,
   `One new file, ${[...wrote].join(' and ')}. The invoices and the orders file are untouched.`],
  point:'The same loop as the bug fix: look, read what matters, then act once.',
  transition:'What is in the file?',
  source:`Our recorded run, ${T.date_text} (${esc(T.model)}): ${IV.rounds} rounds, ${IV.calls} tool calls, ${num(IV.seconds,1)} seconds of model time.`});

 const flagged=IV.check.filter(c=>c.flagged).length,allRight=IV.right===NI,rep=IV.report.replace(/\s+$/,'').split('\n'),repShown=rep.slice(0,8);
 S_('invoice-found','work',`It flags ${word(flagged)} of the ${word(NI)} invoices`,{builds:3,
  body:`<div class="p3a-found"><div class="p3a-wrap">${editor(writes[0].args.path,[...repShown,...(rep.length>8?['…']:[])].join('\n'),{lang:'text',size:rep.length>4?'s':Math.max(...repShown.map(l=>l.length))<=72?'l':''})}</div>
   <div class="p3a-six" style="--n:${NI}">${IV.check.map(c=>`<div class="${c.problem?'wrong':''}"><span data-at="2">${tick(c.flagged===!!c.problem)}</span><code>${esc(c.invoice)}</code><p data-at="2">${esc(c.problem||'fine')}</p>${c.flagged?`<em class="flag">${iconHTML('spark','#fff',16)}flagged</em>`:''}</div>`).join('')}</div>
   ${at(3,`<div class="p3a-who">${iconHTML('person',COL.amber,30)}<span>${kY('A person')} reads this file and decides what to pay.</span></div>`)}</div>`,
  lines:[`This is the file it wrote, word for word. It names ${word(flagged)} of the ${word(NI)} invoices.`,
   `We put a problem in ${word(IV.problems)} of the invoices. ${allRight?`It flagged those ${word(IV.problems)}, and none of the others.`:`It judged ${word(IV.right)} of the ${word(NI)} correctly.`}`,
   'The agent paid nobody and wrote to nobody. Its whole output is this list.'],
  ask:['Is each line of the report true?','How do we know it missed nothing?','Would you let it reject these invoices itself?'],
  expected:['Check one against the orders table from two slides back. The numbers in the report are the numbers in the files.',
   'Because we made the invoices, and we know which ones are wrong. In real use you would not know, so you check a sample.',
   'Not yet. A wrong rejection annoys a supplier and a wrong payment loses money. A list is cheap to check, and a payment is hard to undo.'],
  point:'A good first job for an agent: it reads and reports, and a person keeps the decision.',
  transition:'That is three jobs. What changed between them?',
  source:`Our recorded run, ${T.date_text}. The file is exactly what the agent wrote; the cards compare it with the problems we put in.`});
}

// ---------------------------------------------------------------------------------------- the same agent
chap();
{
 const JOBS=[['code','Fix a failing test',A],['folder','Tidy a folder',TD],['list','Check invoices',IV]];
 S_('invoice-same-agent','work','What changed between the three jobs?',{builds:1,
  body:`<div class="p3a-same">${statement(`Across ${word(JOBS.length)} jobs, we changed only ${kY('the request')}.`)}
   <div class="p3a-jobs">${JOBS.map(([ic,name,r])=>`<div><h3>${iconHTML(ic,COL.amber,28)}${name}</h3><p>${r.rounds} rounds, ${sec(r)} seconds</p></div>`).join('')}</div></div>`,
  lines:['The model, the four tools and the loop are the ones we built in Part 1.'],
  ask:['So where did the skill for each new job come from?'],
  expected:['From the model, which can already read a letter or compare two numbers, and from our request. The tools only gave it access to the folder.'],
  point:'One general agent did three different jobs. What we wrote for each was a request, and a way to check the result.',
  transition:'The same loop runs inside products you have heard of.',
  source:`All three runs are real (${esc(T.model)}, ${T.date_text}). For the two longer jobs we raised the limit on rounds; nothing else changed.`});
}
