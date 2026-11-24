// Part 2: inside one run. The run from Part 1 (fix the failing test) opened up: what the model read in each round (a
// bar per round, which only grows), notebook 2.1, the total against the size of the conversation, why we keep the
// context short, and the instructions we wrote in plain English. Then memory: a run's conversation is thrown away, so
// the agent writes NOTES.md in one run (notebook 2.2) and reads it at the start of the next.
// Every number, command and model sentence is from the recorded runs: data/traces.json (scripts/sci/traces.py).
import {S_,request,at,only,data,need,css,esc,word,num,big,
 fig,label,line,gat,gonly,COL,MUTED,iconHTML,chip,nb,nbRun,partBreak,recap,chap,
 editor,term,tree,toolCall,says,statement,loopStrip,isTest,firstSentence,hl} from '../kit.js';

const T=need(await data('traces'),'agent','memory','model','date_text','hosted','system'),A=need(T.agent,'log','steps','tokens_read','inr_hosted'),S=A.steps;
const M=need(T.memory,'first','later','notes'),F=M.first,L=M.later;
const RD=A.log.map(r=>r.read),N=RD.length,LAST=RD.at(-1),TOTAL=A.tokens_read,BLUE=COL.data;
if(N<4)throw new Error('Part 2 draws the run of Part 1 round by round and needs at least four rounds');
const MONO='SFMono-Regular,Menlo,Consolas,monospace';
const sentences=t=>String(t).trim().split(/(?<=[.!?])\s+/);
/** The instructions every run starts with: SYSTEM in notebook/agents.py, section 1.6, as recorded with the runs. */
const SYSTEM=T.system;
/** The files at the top of the project, read from the output of an `ls` step. */
const filesIn=s=>{const out=String(s?.result||''),dirs=new Set([...out.matchAll(/^\.\/([^:/]+):$/gm)].map(m=>m[1]));
 const names=/^ls\b/.test(s?.args?.command||'')?out.split('\n\n')[0].split('\n').map(x=>x.trim()).filter(x=>x&&!x.endsWith('/')&&!dirs.has(x)):[];
 return names.length?names:['README.md','billing.py','test_billing.py'];};

css(`.p2-walk{display:grid;grid-template-columns:1fr 1.4fr;gap:30px;align-items:center;width:100%}
.p2-walk>div{min-width:0;display:flex;flex-direction:column;gap:14px}
.p2-walk.even{grid-template-columns:1fr 1fr}
.p2-why{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;padding:0 5px}
.p2-why>div{border:2px solid var(--line);border-top:6px solid var(--c);border-radius:16px;background:#fff;padding:30px 28px 30px;min-width:0;display:flex;flex-direction:column;gap:14px;min-height:310px}
.p2-why h3{font-size:38px;line-height:1.1;color:var(--c);margin-top:6px}.p2-why p{font-size:27px;line-height:1.36;color:#374151;text-wrap:balance}
.p2-sys .ed .note{font-size:16px;padding:5px 13px}
.p2-runs{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:stretch;width:100%}
.p2-run{position:relative;border:2px solid var(--line);border-radius:18px;background:#fff;padding:18px 20px 20px;min-width:0;display:flex;flex-direction:column;gap:11px}
.p2-run h3{font-size:19px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
.p2-run .it{display:flex;align-items:flex-start;gap:12px;border:2px solid var(--line);border-left:6px solid var(--c);border-radius:12px;padding:10px 14px;font-size:23px;line-height:1.32;background:#fff}
.p2-run .it>svg{flex:none;margin-top:3px}
.p2-run .it.none{border:2px dashed #B8BFC7;color:var(--muted);background:none;flex:1;align-items:center}
.p2-run>.state-slot{flex:1}.p2-items{display:flex;flex-direction:column;gap:11px}
.p2-what{display:flex;align-items:center;justify-content:center;font-size:150px;line-height:1;font-weight:700;color:#D5DAE0}
.p2-gone{position:absolute;inset:-2px;border-radius:18px;background:#FAFAFBB3;display:flex;align-items:flex-start;justify-content:flex-end;padding:11px 12px}
.p2-gone span{display:inline-flex;align-items:center;gap:9px;font-size:20px;font-weight:650;color:#fff;background:var(--loss);border-radius:999px;padding:7px 18px}
.p2-ask{margin-bottom:12px}.p2-ask .req{font-size:25px;line-height:1.36;padding:13px 20px}
.p2-notes .ed .mark{background:#245EDB38;border-left-color:#7FA6FF}
.p2-cmd .term .cmd{white-space:pre-wrap;overflow-wrap:anywhere}
.p2-cmd .term .type{display:inline;white-space:pre-wrap;overflow-wrap:anywhere;width:auto;max-width:none;animation:none}
.p2-hit{font-weight:700;color:#fff;background:#245EDBB3;border-radius:5px;padding:1px 4px}
.p2-kB{color:var(--data);font-weight:700}
@media(max-width:760px){.reading .p2-walk,.reading .p2-walk.even,.reading .p2-why,.reading .p2-runs{grid-template-columns:minmax(0,1fr)}
 .reading .p2-why p,.reading .p2-run .it,.reading .p2-ask .req{font-size:18px}.reading .p2-why>div{min-height:0}}`);

partBreak(2,'Inside one run',`The agent fixed the bug in ${word(A.rounds)} rounds. Now we open that run and look at what the model was given each time.`,
 ['What the model reads each round','Why we keep that short','The instructions we wrote','Notes that outlast a run'],
 {img:'part-engine.jpg',alt:'Illustration: a small helper reading a paper scroll that grows longer at each step',nb:nb('part-2'),
  line:'Key question: what does the model read each round, and how does it remember anything?',
  ask:'Between two rounds, where does the model keep what it has found out so far?',
  expected:'Most will say “in the model”. It keeps nothing. Our code holds the conversation and sends all of it again each round.',
  point:'The model has no state of its own. Everything it knows about the task is in the text our code sends it.',
  transition:'Start with what it reads.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 2.1 what the model reads
chap('2.1','What the model reads');
const added=RD.map((v,i)=>v-(RD[i-1]||0)),NEW=added.at(-1);
/** In words, what a tool call added to the conversation. */
const result=s=>!s?'the result of its last request':isTest(s)?'the test output':s.name==='bash'?`what <span class="mono">${esc(s.args.command)}</span> printed`:
 s.name==='read_file'?`the text of <span class="mono">${esc(s.args.path)}</span>`:'a short note that the file was changed';
{
 const W=1152,base=292,mh=226,pitch=W/N,bw=Math.min(104,pitch*.62),sc=v=>v/LAST*mh,room=Math.floor((pitch-6)/9.7);
 const fit=t=>t.length>room?t.slice(0,room-1)+'…':t,mono=(x,y,t,o)=>label(x,y,esc(fit(t)),o).replace('<text ',`<text style="font-family:${MONO}" `);
 const what=s=>s.name==='bash'?(isTest(s)?'pytest':s.args.command):String(s.args.path||'');
 let g=line(0,base,W,base,{stroke:'#D5DAE0',w:2})+
  `<rect x="0" y="4" width="22" height="22" rx="4" fill="${BLUE}"/>`+label(32,22,'new this round',{size:20,fill:COL.ink})+
  `<rect x="0" y="36" width="22" height="22" rx="4" fill="${BLUE}" opacity=".28"/>`+label(32,54,'read again',{size:20,fill:COL.ink})+label(0,90,'a token is a word, or a piece of one',{size:18,fill:MUTED});
 RD.forEach((v,i)=>{const x=i*pitch+(pitch-bw)/2,cx=x+bw/2,steps=S.filter(s=>s.round===i);let y=base,b='';
  added.slice(0,i+1).forEach((d,j)=>{const h=sc(Math.max(0,d));y-=h;b+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,h-2).toFixed(1)}" rx="3" fill="${BLUE}"${j<i?' opacity=".28"':''}/>`;});
  b+=label(cx,y-12,big(v),{size:25,anchor:'middle',fill:COL.ink,weight:700})+label(cx,base+31,`Round ${i+1}`,{size:22,anchor:'middle',fill:COL.ink,weight:650});
  if(!i)b+=label(cx,base+57,'instructions, tools,',{size:17,anchor:'middle',fill:'#374151'})+label(cx,base+79,'our request',{size:17,anchor:'middle',fill:'#374151'});
  else if(steps.length)b+=mono(cx,base+57,'+ '+steps[0].name,{size:17,anchor:'middle',fill:COL.target,weight:650})+
   mono(cx,base+79,steps.length>1?`and ${steps.length-1} more`:what(steps[0]),{size:16,anchor:'middle',fill:'#374151'});
  g+=label(cx,base+31,`Round ${i+1}`,{size:22,anchor:'middle',fill:'#B8BFC7'})+(i?gat(Math.min(i+1,4),b):b);});
 S_('reread','engine','Each round, the model rereads everything',{builds:4,nb:nb('nb-2-1','▶ Open 2.1 in Colab'),
  body:fig(W,base+90,g,`Tokens the model read in each of the ${word(N)} rounds: ${RD.map(big).join(', ')}. Each bar holds everything in the bar before it, plus one new piece.`),
  lines:[`Round 1. The model reads our instructions, the tool menu and the request: ${big(RD[0])} tokens.`,
   `Round 2 reads all of that again, plus its own first request and ${result(S.find(s=>s.round===1))}.`,
   `Round 3 starts from the top once more. The new part is ${result(S.find(s=>s.round===2))}.`,
   `It goes on like this. Round ${N} reads ${big(LAST)} tokens, and only ${big(NEW)} of them are new.`],
  ask:['What does the model have to work with in round 1?','Why does round 2 read the instructions again?','Does anything ever leave the conversation?',`Which round added the most? Why?`],
  expected:['Only text: our instructions, a description of each tool, and one sentence from us.',
   'The model keeps nothing between rounds. Each round is a new call, and our code sends the whole list of messages again.',
   'No. In our loop the list only grows: every request and every result is added and stays.',
   'The tallest dark piece: a long tool result, such as the test output or a whole file. Short results, such as the note after an edit, add almost nothing.'],
  point:'The conversation is the model’s only memory during a run, and it reads all of it again in every round.',
  misconception:'That the model remembers the earlier rounds. It does not: line 4 of the loop sends everything again, every time.',
  transition:'We can print these numbers ourselves. Over to the notebook.',
  source:`Our recorded run of Part 1, ${T.date_text} (${esc(T.model)}). The dark piece of each bar also holds the model’s own request from the round before.`});
}

nbRun('nb-context','engine','2.1','What the model read each round',{
 run:'for n, r in enumerate(run.log, 1):\n    print(f"round {n}: read {r[\'input\']} tokens")\nprint("total read:", run.tokens_read)',
 look:['The number goes up in every round','The total: how does it compare with the last round?'],
 line:'The notebook kept a count for every round of the run we just watched. We print it.',
 ask:'Guess the total before it prints. Is it closer to the last round’s count, or far above it?',
 expected:'Far above it: the total adds up every round, and each round holds all the ones before.',
 point:'Nothing here is hidden. The loop records what each call to the model read and wrote.',
 transition:'Here is the total from our run.'});

{
 const W=1152,BW=1152,h=74,sc=v=>v/TOTAL*BW,y1=44,y2=y1+h+82,times=TOTAL/LAST;
 let g=label(0,y1-16,'The conversation when the run ended',{size:22,fill:MUTED,weight:650})+
  `<rect x="0" y="${y1}" width="${sc(LAST).toFixed(1)}" height="${h}" rx="8" fill="${BLUE}"/>`+
  label(sc(LAST)+18,y1+h/2+16,big(LAST),{size:46,fill:COL.ink,weight:700})+label(sc(LAST)+18+String(big(LAST)).length*27+10,y1+h/2+15,'tokens',{size:24,fill:MUTED});
 let x=0,b=label(0,y2-16,`What the model read, round by round`,{size:22,fill:MUTED,weight:650});
 RD.forEach((v,i)=>{const w=sc(v);b+=`<rect x="${x.toFixed(1)}" y="${y2}" width="${(w-4).toFixed(1)}" height="${h}" rx="8" fill="${BLUE}" opacity="${(.5+.5*(i+1)/N).toFixed(2)}"/>`+
  label(x+(w-4)/2,y2+h/2+9,String(i+1),{size:25,anchor:'middle',fill:'#fff',weight:700});x+=w;});
 // click 1: the second row is there, and empty. The room guesses before it fills
 const empty=label(0,y2-16,'What the model read, round by round',{size:22,fill:MUTED,weight:650})+
  `<rect x="1.5" y="${y2+1.5}" width="${BW-7}" height="${h-3}" rx="8" fill="none" stroke="#B8BFC7" stroke-width="2.5" stroke-dasharray="9 9"/>`+
  label(0,y2+h+52,'?',{size:46,fill:'#B8BFC7',weight:700})+label(40,y2+h+51,'tokens',{size:24,fill:MUTED});
 b+=label(0,y2+h+52,big(TOTAL),{size:46,fill:COL.ink,weight:700})+label(String(big(TOTAL)).length*27+10,y2+h+51,`tokens, ${num(times,1)} times the conversation`,{size:24,fill:MUTED});
 S_('read-total','engine','How much did it read in all?',{builds:2,nb:nb('nb-2-1','▶ Open 2.1 in Colab'),
  body:fig(W,y2+h+72,g+gonly('1',empty)+gat(2,b),`The conversation at the end was ${big(LAST)} tokens. Over ${word(N)} rounds the model read ${big(TOTAL)} tokens.`),
  lines:[`When the run ended, the whole conversation was ${big(LAST)} tokens long.`,
   `To get there, the model read ${big(TOTAL)} tokens. It read the same text again and again.`],
  ask:['How much do you think the model read to get this far?','What happens to the total if a run takes twice as many rounds?'],
  expected:['Guesses are usually near the size of the conversation. The real number is several times that.',
   'It grows much more than twice, because every extra round rereads all the rounds before it.'],
  point:'The reading adds up faster than the conversation grows. Long runs are mostly rereading.',
  transition:'Does that matter? Yes, for three reasons.',
  source:`Our recorded run of Part 1, ${T.date_text} (notebook 2.1). It wrote ${big(A.tokens_written)} tokens in the same ${word(N)} rounds.`});
}

{
 const WHY=[['rupee',BLUE,'Cost','A hosted model charges for every token it reads, in every round.'],
  ['clock',BLUE,'Time','More to read makes each round slower.'],
  ['search',BLUE,'Attention','In a long text, the one line that matters is easier to miss.']];
 S_('context-short','engine','Why keep the context short?',{builds:1,
  body:`<div class="p2-why">${WHY.map(([ic,c,t,d])=>`<div style="--c:${c}">${iconHTML(ic,c,54)}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`,
  lines:['What the model reads in a round is called its context. We try to keep it short.'],
  ask:['How would you keep it short, in a long job?'],
  expected:['Return short tool results, such as the last lines of a test run. Offer only the tools the job needs. Start a new run for a new job.'],
  point:`Every round pays again, in money and in time, for everything read so far. Our ${word(N)}-round run would cost ₹${num(A.inr_hosted,2)} at the price of ${esc(T.hosted.name)}, a hosted model; Part 5 has the cost slide.`,
  misconception:'That a model with a larger context window solves this. It lets the conversation grow longer, and every round still pays for all of it.',
  transition:'One piece of the context is read first in every round, and we wrote it ourselves.',
  source:''});
}

// the instructions: SYSTEM, a sentence to a line
{
 const rows=sentences(SYSTEM).flatMap(s=>{if(s.length<=64)return [s];const c=s.lastIndexOf(', ',64),cut=c>0?c+1:s.lastIndexOf(' ',64);return [s.slice(0,cut),'  '+s.slice(cut+1)];});
 const iList=rows.findIndex(r=>/listing the files/i.test(r))+1,iTest=rows.findIndex(r=>/run the tests/i.test(r))+1;
 const first=S[0],listed=first?.name==='bash'&&/^ls\b/.test(first.args.command),iEdit=S.findIndex(s=>s.name==='edit_file'),retest=iEdit<0?null:S.slice(iEdit+1).find(isTest);
 S_('instructions','engine','The instructions are plain English',{builds:3,nb:nb('nb-1-6','▶ Open 1.6 in Colab'),
  body:`<div class="p2-sys">${editor('SYSTEM · the instructions every run starts with',rows.join('\n'),{lang:'text',icon:'notes',
   focus:{...(iList?{2:[iList]}:{}),...(iTest?{3:[iTest]}:{})},
   notes:{...(iList&&listed?{[iList]:[`round ${first.round}: ${esc(first.args.command)}`,COL.target,[2]]}:{}),...(iTest&&retest?{[iTest]:[`round ${retest.round}: it ran the tests again`,COL.target,[3]]}:{})}})}</div>`,
  lines:['This is the first thing the model reads in every round. We wrote it, in ordinary sentences.',
   listed?`In Part 1 the agent began with <span class="mono">${esc(first.args.command)}</span>. The request never asked for that. This sentence did.`:'In Part 1 the agent began by looking around. The request never asked for that. This sentence did.',
   retest?`After its edit it ran the tests again, in round ${retest.round}. That habit was written here too.`:'Running the tests after an edit is written here too.'],
  ask:['Who is this text written for?','What would the agent do without this sentence?','Which sentence would you add for your own team?'],
  expected:['The model. Our code puts it at the top of the conversation, before the request.',
   'It might guess at file names, or answer from what it remembers about billing code in general.',
   'Answers vary: never touch the tests, ask before deleting, write in our house style. Each is one more sentence.'],
  point:'Much of what looked like the agent’s good sense in Part 1 was written here. Changing an agent’s behaviour often means editing this text. Builders call it the system prompt.',
  misconception:'That instructions are rules the model must obey. They are text it usually follows. Part 4 shows what happens when other text disagrees with them.',
  transition:'One sentence in there mentions a file called NOTES.md. That is how this agent remembers.',
  source:'From the notebook, section 1.6: the text of SYSTEM, a sentence to a line. The tags are from our recorded run.'});
}

// ---------------------------------------------------------------------------------------- 2.2 notes that outlast a run
chap('2.2','Notes that outlast a run');
const write=F.steps.find(s=>s.name==='write_file')||F.steps.at(-1),noteFile=write.args.path||'NOTES.md';
{
 const told=sentences(F.goal)[0].split(/:\s*/).at(-1).replace(/\.$/,'').replace(/^./,c=>c.toUpperCase());
 const it=(ic,c,t)=>`<div class="it" style="--c:${c}">${iconHTML(ic,c,26)}<span>${t}</span></div>`;
 S_('memory-q','engine','How would it remember you next week?',{builds:2,
  body:`<div class="p2-runs"><div class="p2-run"><h3>This week’s run</h3>${it('notes',MUTED,'Instructions and tools')}${it('person',COL.amber,`“${esc(told)}.”`)}${it('spark',COL.guess,'Its requests and the results')}
    <div class="p2-gone" data-at="2"><span>${iconHTML('stop','#fff',18)}Gone when the run ends</span></div></div>
   <div class="p2-run"><h3>Next week’s run</h3><div class="p2-what" data-only="1">?</div>
    <div class="p2-items" data-only="2">${it('notes',MUTED,'Instructions and tools')}${it('person',COL.amber,'A new request')}<div class="it none">Nothing from this week</div></div></div></div>`,
  lines:['This week we tell the agent two things about our shop. They are now in its conversation.',
   'When a run ends, its conversation is thrown away. The next run starts without any of it.'],
  ask:['Where exactly is that sentence stored?','How would you make the agent remember it?'],
  expected:['In the list of messages inside one run of our loop, and nowhere else. The model itself did not change.',
   'Write it down somewhere the next run will look. For an agent that works in a folder, that is a file.'],
  point:'A run’s conversation is its only memory, and it ends with the run. Anything that should last has to be stored outside it.',
  misconception:'That the model learns from what you tell it. Its weights do not change. It knows only what is in the conversation.',
  transition:'So we ask it to write things down. Over to the notebook.',
  source:`The sentence in quotes is from our first request in notebook 2.2, shortened.`});
}

nbRun('nb-memory','engine','2.2','Notes that outlast a run',{
 run:`first = run_agent("… ${sentences(F.goal).at(-1).replace(/"/g,'\\"')}")\nlater = run_agent("${L.goal.split(' ').slice(0,5).join(' ').replace(/"/g,'\\"')} …")`,
 look:['The first run writes a file','Does the second run read it before it answers?'],
 line:'Two separate runs. The first is told what to remember. The second is only asked a question.',
 ask:'The second run starts with an empty conversation. How could it know about the discount?',
 expected:'Only from the file. Watch its first two requests.',
 point:'Two runs, two conversations. The only thing they share is the project folder.',
 transition:'Here are our two recorded runs.'});

S_('notes-write','engine','The first run wrote its notes to a file',{builds:2,nb:nb('nb-2-2','▶ Open 2.2 in Colab'),
 body:`<div class="p2-walk"><div>${loopStrip({model:'1',tool:'2',result:'2'},{round:`First run · round ${write.round} of ${F.rounds}`})}${toolCall(write.name,write.args)}</div>
  <div><div>${only('1',editor('the text it asks to save',M.notes,{lang:'text',icon:'chat'}))}${only('2',editor(noteFile,M.notes,{lang:'text',icon:'notes'}))}</div>
   ${tree('workspace/',[...filesIn(F.steps[0]),{name:noteFile,at:2}],{marks:{[noteFile]:[['2','new']]},size:'s'})}</div></div>`,
 lines:['We said what to remember. The model asks to write a file, and chooses the words itself.',
  `Our code wrote ${esc(noteFile)} into the project. Then the run ended.`],
 ask:['Which tool is this?','What is left of this run now?'],
 expected:['write_file, one of the four from Part 1. Memory needed no new tool.',`One small text file in the folder, ${word(M.notes.split('\n').filter(l=>l.trim()).length)} lines long.`],
 point:'Saving a note is an ordinary tool call that happens to write a file.',
 transition:'Some days later we start a new run, with a different request.',
 source:`Our recorded run, ${T.date_text} (notebook 2.2): ${F.rounds} rounds, ${num(F.seconds,1)} seconds of model time.`});

{
 const ls=L.steps[0],read=L.steps.find(s=>s.name==='read_file'&&s.args.path===noteFile)||L.steps[1];
 const listing=String(ls.result).split('\n').filter(l=>l.trim()),top=listing.slice(0,4),iNote=top.indexOf(noteFile);
 const rows=[{cmd:ls.args.command||callOf(ls)},...(iNote<0?[{out:top.join('\n')}]:[...(iNote?[{out:top.slice(0,iNote).join('\n')}]:[]),{out:noteFile,kind:'hot'},...(top.length>iNote+1?[{out:top.slice(iNote+1).join('\n')}]:[])]),...(listing.length>top.length?[{out:'…',kind:'dim'}]:[])];
 S_('notes-read','engine','A new run reads the notes first',{builds:2,nb:nb('nb-2-2','▶ Open 2.2 in Colab'),
  body:`<div class="p2-ask">${request(esc(L.goal),{who:'A new request'})}</div>
   <div class="p2-walk"><div><div>${only('1',loopStrip({model:'1',tool:'1',result:'1'},{round:`Second run · round ${ls.round} of ${L.rounds}`}))}${only('2',loopStrip({model:'2',tool:'2',result:'2'},{round:`Second run · round ${read.round} of ${L.rounds}`}))}</div>
    <div>${only('1',toolCall(ls.name,ls.args))}${only('2',toolCall(read.name,read.args))}</div></div>
   <div><div>${only('1',term(rows,{size:'s'}))}${only('2',editor(noteFile,M.notes,{lang:'text',icon:'notes'}))}</div></div></div>`,
  lines:['The request says nothing about rupees or discounts. The run begins by listing the files.',
   `It sees ${esc(noteFile)} and reads it before anything else. That is another sentence of our instructions.`],
  ask:['What does this run know about our shop at this point?','Why did it open the notes before the billing code?'],
  expected:['Nothing yet. Its conversation holds the instructions, the request and a list of file names.',
   `The instructions say: if ${esc(noteFile)} exists, read it before anything else and follow it.`],
  point:'The notes get into the new conversation the way everything else does: a tool reads them and our code adds the result.',
  transition:'Now the notes are in its context. Watch what it does with them.',
  source:`Our recorded run, ${T.date_text} (notebook 2.2). The listing is cut short here.`});
}
function callOf(s){return `${s.name} ${Object.values(s.args).join(' ')}`;}

{
 const run=L.steps.findLast(s=>s.name==='bash'&&!/^ls\b/.test(s.args.command))||L.steps.at(-1),code=L.steps.find(s=>s.name==='read_file'&&s.args.path!==noteFile);
 const NL=M.notes.split('\n'),iDisc=NL.findIndex(l=>/discount/i.test(l))+1,iRup=NL.findIndex(l=>/₹|rupee/i.test(l))+1;
 const usesDisc=/discount_percent\s*=\s*\d+/.test(run.args.command||'');
 const shell=term([{cmd:run.args.command||callOf(run)},{out:String(run.result).trim()||'(no output)',kind:run.exit?'bad':''}]).replace(/discount_percent\s*=\s*\d+/,m=>`<span class="p2-hit">${m}</span>`);
 // the request as the model wrote it, cut short; in single quotes when the command itself holds double quotes
 const cmd=String(run.args.command||callOf(run)).replace(/\s+/g,' '),head=cmd.length>44?cmd.slice(0,43)+'…':cmd;
 const asked=`<div class="tc"><span class="tc-who">${iconHTML('spark',COL.guess,18)}The model asks</span><code>${hl(head.includes('"')&&!head.includes("'")?`bash('${head}')`:`bash(${JSON.stringify(head)})`,'python')}</code></div>`;
 const ans=firstSentence(L.answer).replace(/₹\s?[\d,]+(?:\.\d+)?/,m=>`<b class="p2-kB">${m}</b>`).replace(/\d+\s?(?:%|percent)(?: \w+)? discount/,m=>`<b class="p2-kB">${m}</b>`);
 S_('notes-answer','engine','It answers in rupees, with the school discount',{builds:2,nb:nb('nb-2-2','▶ Open 2.2 in Colab'),
  body:`<div class="p2-walk"><div><div>${only('1',loopStrip({tool:'1',result:'1'},{round:`Second run · round ${run.round} of ${L.rounds}`}))}${only('2',loopStrip({model:'2',answer:'2'},{round:`Second run · round ${L.rounds} of ${L.rounds}`}))}</div>
    <div>${only('1',asked)}${only('2',says(ans))}</div></div>
   <div><div class="p2-cmd">${shell}</div>
    <div class="p2-notes">${editor(noteFile,M.notes,{lang:'text',icon:'notes',focus:{...(iDisc?{1:[iDisc]}:{}),...(iRup?{2:[iRup,...(iDisc?[iDisc]:[])]}:{})}})}</div></div></div>`,
  lines:[usesDisc?`${code?`It reads ${esc(code.args.path)}, then`:'It'} runs the code with a discount. Our request never mentioned one.`:`${code?`It reads ${esc(code.args.path)}, then`:'It'} runs the code to work out the total.`,
   'The answer is in rupees and includes the school discount. Both came from the file.'],
  ask:['Where did the discount in that command come from?','What changed in the model between the two runs?'],
  expected:['From the notes. The request only said that a school was ordering.',
   'Nothing. It is the same model with the same weights. The folder has one more file, and the instructions say to read it.'],
  point:'What the agent remembered from last week is exactly the text of one file, read at the start of the run.',
  misconception:'That the agent now “knows” our shop. Delete the file and the next run knows nothing again.',
  transition:'So what is an agent’s memory?',
  source:`Our recorded run, ${T.date_text} (notebook 2.2): ${L.rounds} rounds, ${L.calls} tool calls, ${num(L.seconds,1)} seconds of model time.`});
}

S_('memory-is','engine','Its memory is a file',{builds:1,
 body:statement(`It remembers by <span class="p2-kB">writing a file</span>, and <span class="p2-kB">reading it</span> at the start of the next run.`,
  'Coding agents do the same, with a file such as <span class="mono">AGENTS.md</span> or <span class="mono">CLAUDE.md</span>.'),
 lines:['Between the two runs the model did not change at all. The folder did.'],
 ask:['What would you put in such a file for your own project?'],
 expected:['How to run the tests, and what never to touch. A person can read the file, correct it, and keep it under version control.'],
 point:'Memory across runs is text stored outside the model and read back into the context. Because it is a file, a person can open it and fix it.',
 misconception:'That more notes are always better. Every line of the notes is read in every round of every run, so the file should stay short.',
 transition:'Part 2 in one slide.'});

recap(2,['Each round, the model rereads the whole conversation.','Its instructions are a paragraph of plain English.','Notes in a file outlast a run.'],
 'the same agent, other jobs.',
 {card:{goal:'Work out a school’s bill',model:esc(T.model),tools:`${chip('eye','read')} ${chip('pen','write, edit')} ${chip('terminal','bash')}`,
   memory:`The conversation, and <span class="p2-kB">${esc(noteFile)}</span>`,stop:'An answer, or 12 rounds',guard:'Works in one folder',human:'Says what to remember'},
  hi:['memory'],title:'Our agent, with notes',
  ask:'Which line of the card changed since Part 1?',
  expected:'Memory: the conversation lasts for one run, and the notes file lasts across runs. The model, the tools and the loop are the same.',
  point:'One run is a conversation that only grows. Instructions start it, and a notes file carries a little of it into the next run.',
  transition:'Part 3: the same agent, other jobs.'});
