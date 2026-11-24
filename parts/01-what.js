// Part 1: from a model to an agent. The model alone (it cannot see our files), one tool (written and run in the
// notebook), the reply as a request, who actually touches the folder, four tools, the loop as a flowchart and as code,
// then our recorded run round by round on the terminal, editor and diff screens, and a check of its work.
// Each "In the notebook" slide is a live run; the slide after it shows the recorded run (data/traces.json).
import {S_,ps,small,request,at,only,data,need,css,esc,word,Word,num,big,kY,kA,kT,kR,kG,
 fig,label,arrow,gat,COL,MUTED,icon,iconHTML,chip,loopMap,agentCard,nb,nbRun,partBreak,recap,chap,
 editor,term,diff,tree,toolCall,toolBack,says,statement,loopStrip,callText,tailLines,isTest,bashRows,testRows,firstSentence} from '../kit.js';
import {PROJECT,failRows} from './00-opening.js';

const T=need(await data('traces'),'agent','check','alone','request','model','date_text'),A=T.agent,S=A.steps,Q=T.request;
const iFail=S.findIndex(isTest),iPass=S.findLastIndex(isTest),iEdit=S.findIndex(s=>s.name==='edit_file');
const fail=S[iFail],pass=S[iPass],edit=S[iEdit],before=S.slice(0,iFail),reads=S.slice(iFail+1,iEdit).filter(s=>s.name==='read_file');
const FN=A.before.split('\n'),fnFrom=FN.findIndex(l=>l.startsWith('def invoice_total'))+1,fnCode=FN.slice(fnFrom-1).join('\n').trimEnd();
const bugLine=fnFrom+fnCode.split('\n').findIndex(l=>l===T.check.minus[0]);
const of=s=>`Round ${s.round} of ${A.rounds}`;
const [,got='',want='']=fail.result.match(/assert ([\d.]+) == ([\d.]+)/)||[];   // the first failure: what the code returned, what the test expected
// What the model said when it had no tools: its own first request, and the things it asked us for.
const aloneLead=esc(((T.alone.reply.match(/\*\*(.+?)\*\*/)||[])[1]||T.alone.reply.split('\n')[0]).trim());
const needs=(T.alone.asks_for.length?T.alone.asks_for:['the code','the tests','the error']).map(n=>`<span>${esc(n.toLowerCase())}</span>`).join('');

css(`.p1-two{display:grid;grid-template-columns:.9fr 1.1fr;gap:34px;align-items:start}
.p1-two>div{border-top:5px solid var(--line);padding-top:14px;min-width:0;display:flex;flex-direction:column;gap:14px}
.p1-two h3{font-size:28px;display:flex;align-items:center;gap:10px}.p1-two .sa{padding:14px 18px 18px;gap:10px}.p1-two .sa p{font-size:25px;line-height:1.35}
.p1-two .bot{border-color:var(--muted)}.p1-two .bot h3{color:var(--muted)}.p1-two .ag{border-color:var(--q)}.p1-two .ag h3{color:var(--q)}
.p1-two .verdict{font-size:25px;line-height:1.4}.p1-two .p1-needs{gap:8px;margin-top:10px}.p1-two .p1-needs span{font-size:20px;padding:4px 13px}
.p1-needs{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}.p1-needs span{font-size:29px;border:2px solid var(--line);border-radius:999px;padding:7px 24px;background:#fff}
.p1-alone{display:flex;flex-direction:column;align-items:center;gap:30px}
.p1-alone .sa{padding:26px 36px 32px;gap:14px;border-width:3px;border-radius:22px}.p1-alone .sa p{font-size:34px;line-height:1.3}.p1-alone .sa-who{font-size:17px}
.p1-tools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.p1-tools>div{border:2px solid var(--line);border-left:7px solid var(--c);border-radius:16px;background:#fff;padding:20px 20px 22px;min-width:0;display:grid;grid-template-columns:48px minmax(0,1fr);column-gap:16px;row-gap:6px;align-items:center;position:relative}
.p1-tools>div>svg{grid-row:1/3;align-self:center;width:44px;height:44px}
.p1-tools small{grid-column:2;justify-self:start;max-width:100%;font-size:17px;color:#374151;background:#F1F3F6;border-radius:8px;padding:6px 12px;margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.p1-tools .ring{position:absolute;inset:-8px;border:4px solid #0F766E77;border-radius:22px;pointer-events:none}
.p1-tools code{font:650 29px/1.15 "SFMono-Regular",Menlo,Consolas,monospace;color:var(--c)}.p1-tools p{font-size:25px;line-height:1.3;color:#374151}
#tool-result .sa p,#run-pass .sa p{text-wrap:pretty}
.p1-said{font-size:26px;line-height:1.4;display:flex;gap:12px;align-items:flex-start}.p1-said>svg{flex:none;margin-top:4px}
.p1-checks{display:flex;flex-direction:column;gap:18px}.p1-checks>div{display:grid;grid-template-columns:390px minmax(0,1fr);gap:26px;align-items:center}
.p1-checks h3{font-size:28px;line-height:1.25;display:flex;align-items:center;gap:12px;color:var(--d)}
.p1-checks h3.todo{color:var(--muted);font-weight:600}.p1-checks h3.todo i{flex:none;width:24px;height:24px;margin:0 3px;border:2.5px solid currentColor;border-radius:50%}
.p1-walk{display:grid;grid-template-columns:440px minmax(0,1fr);gap:30px;align-items:center;width:100%}
.p1-walk>div{min-width:0;display:flex;flex-direction:column;gap:14px}
.p1-edit .dif .dl.reveal-hidden{display:none}.p1-edit .dif .win-body{min-height:calc(6.2em + 30px)}
@media(max-width:760px){.reading .p1-two,.reading .p1-tools,.reading .p1-checks>div,.reading .p1-walk{grid-template-columns:minmax(0,1fr)}.reading .p1-tools code{font-size:19px}.reading .p1-tools p,.reading .p1-said{font-size:18px}.reading .p1-alone .sa p{font-size:22px}.reading .p1-needs span{font-size:18px}}`);

partBreak(1,'From a model to an agent','The opening run used an ordinary language model. Now we build what was around it.',
 ['What a model does on its own','A tool, and a request for it','Four tools and a loop','Our run, round by round'],
 {img:'part-what.jpg',alt:'Illustration: a small helper reaching for tools on a desk',nb:nb('nb-1-1'),
  line:'What turns a model that only writes text into something that fixes code?',
  ask:'In your own words, what is an AI agent?',expected:'Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we sharpen them by the end of this part.',
  transition:'Start with what a model is on its own.',source:'Illustration: generated (Gemini image model).'});

// ---------------------------------------------------------------------------------------- 1.1 the model alone
chap('1.1','The model on its own');
{
 const W=1152,H=392,y=112,y2=312,GREY='#7B8698';
 const box=(x,w,ic,text,col,fill)=>`<rect x="${x}" y="${y-56}" width="${w}" height="112" rx="20" fill="${fill}" stroke="${col}" stroke-width="3"/>`+icon(ic,x+52,y,38,col)+label(x+86,y+10,text,{size:29,fill:col,weight:650});
 // what it cannot reach: the same two things the next slides give it, drawn unconnected
 const out=(cx,ic,text)=>`<rect x="${cx-140}" y="${y2-44}" width="280" height="88" rx="18" fill="#fff" stroke="${GREY}" stroke-width="2.5" stroke-dasharray="7 7"/>`+icon(ic,cx-92,y2,32,GREY)+label(cx-62,y2+9,text,{size:26,fill:GREY,weight:650})+
  `<line x1="${576+(cx-576)*.2}" y1="${y+96}" x2="${576+(cx-576)*.62}" y2="${y2-52}" stroke="${GREY}" stroke-width="2.5" stroke-dasharray="3 8" stroke-linecap="round"/>`+
  `<g stroke="${COL.loss}" stroke-width="4" stroke-linecap="round" transform="translate(${576+(cx-576)*.41},${(y+96+y2-52)/2})"><path d="M-9,-9L9,9M9,-9L-9,9"/></g>`;
 const g=box(20,366,'person','your words',COL.amber,'#AA4E0812')+
  `<g class="draw-g">${arrow(398,y,478,y,{stroke:'#4B5563',w:3})}</g>`+
  `<circle cx="576" cy="${y}" r="88" fill="#fff" stroke="${COL.guess}" stroke-width="4"/>`+icon('spark',576,y-14,52,COL.guess)+label(576,y+48,'a model',{size:25,fill:COL.guess,anchor:'middle',weight:650})+
  arrow(674,y,754,y,{stroke:'#4B5563',w:3})+
  box(766,366,'chat','likely next words',COL.guess,'#8B2CDE0D')+
  out(400,'folder','your files')+out(752,'terminal','your terminal');
 S_('alone','what','On its own, a model only writes text',{builds:1,
  body:fig(W,H,g,'Your words go into a model, and likely next words come out. Your files and your terminal are not connected to it.'),
  lines:['A language model reads text and writes the words most likely to come next. That is all it does.'],
  ask:['So what happens if we send it our one-sentence request about the failing tests?'],
  expected:['It can only write text back. It has no way to open a file or run a test. Let us try it.'],
  point:'A language model is a text predictor. Everything an agent adds comes from outside the model.',
  transition:'Let us try it: the same request, sent to the model with nothing else.'});
}

nbRun('nb-alone','what','1.1','The model on its own',{
 run:'reply, info = chat([{"role": "user", "content": TASK}])\nprint(reply["content"])',
 look:['Does it fix anything?','What does it ask us for?'],
 line:'Over to the notebook. We send the one-sentence request to Gemma 4, with nothing else.',
 ask:'Before it answers: what do you expect it to say?',expected:'Something helpful-sounding. Watch whether it can say anything about our actual code.',
 point:'A model on its own can only answer from the text it is given.',
 transition:'Here is what it said when we ran it.'});

{
 S_('alone-said','what','It asks us to paste the code',{builds:2,
  body:`<div class="p1-alone">${says(`${aloneLead}<span class="p1-needs">${needs}</span>`,{who:'The model, on its own'})}
   ${at(2,`<p class="p1-said" style="font-size:32px;align-items:center">${iconHTML('eye',COL.loss,36)}<span>${kR('It cannot see the folder')}, or run the tests.</span></p>`)}</div>`,
  lines:[`Our run: ${big(T.alone.words)} polite words, and not one about our code.`,'It needs two things it does not have: a way to look, and a way to act.'],
  ask:['Is that a bad answer?','What would it need, to do the job itself?'],
  expected:['No, it is an honest one. A model that guessed at code it had never seen would be worse.','A way to read our files and run our tests. In other words, tools.'],
  point:'The model is not the limit here. It has no access to anything.',
  misconception:'That a bigger model would manage. No model can read a file it was never given.',
  transition:'So let us give it a way to read a file.',
  source:`Real reply (${esc(T.model)}, ${T.date_text}, notebook 1.1): its own first request, and the three things it listed.`});
}

// ---------------------------------------------------------------------------------------- 1.2 a tool
chap('1.2','Write a tool');
S_('tool-fn','what','A tool is an ordinary Python function',{builds:2,
 body:editor('notebook · section 1.2',`@tool
def read_file(path: str) -> str:
    """Read a text file in the project and return its contents.

    path: the file's path inside the project, for example "billing.py"
    """
    return inside(path).read_text()`,{focus:{2:[[2,5],7]},notes:{3:['the model reads this',COL.guess,[2]],7:['our code runs this',COL.target,[2]]}}),
 lines:['Seven lines of plain Python. It opens a file in the project and returns the text.','The name, the arguments and the description are for the model. The last line is for us.'],
 ask:['What would a tool look like in your own work?','Which part of this will the model never see?'],
 expected:['A database query, a search of your documents, a call to an internal system: one function that does one thing.','The body. It only gets the name, the arguments and the description.'],
 point:'A tool is a normal function plus a description written for the model.',
 transition:'Let us write it in the notebook, and print what the model will be shown.'});

nbRun('nb-tool','what','1.2','Write a tool',{
 run:'print(json.dumps(read_file.schema, indent=1))',
 look:['A name, a description and one argument','No Python code at all'],
 line:'In the notebook we define the tool, and print the entry the model will see.',
 ask:'Why does the model not need the code?',expected:'It never runs it. It only needs to know what the tool does and what to pass in.',
 point:'The model reads a description of the tool. Our code keeps the tool itself.',
 transition:'This is the entry.'});

S_('tool-menu','what','The model sees only this entry',{builds:2,
 body:`${only('1',editor('what the model is shown',JSON.stringify({name:Q.schema.name,description:Q.schema.description,arguments:{path:'string: the path of the file inside the project'}},null,2),{lang:'json',icon:'list'}))}
  ${only('2',editor('a vague entry',JSON.stringify({name:'get',description:'Gets it.',arguments:{x:'string'}},null,2),{lang:'json',icon:'list'}))}`,
 lines:['A name, a description and one argument. This is everything the model knows about our tool.','Suppose the entry said only this. When would the model use it, and what would it pass in?'],
 ask:['What does the description tell the model that the name does not?','What happens with a vague entry?'],
 expected:['That the file must be inside the project, and that it gets text back.','The model guesses: it may call the tool for anything, or never. A clear description is the cheapest fix there is.'],
 point:'The description is the only manual the model gets.',
 transition:'Now we ask a question about one file, with the tool on offer.',
 source:'Simplified from the entry the notebook prints in section 1.2.'});

// ---------------------------------------------------------------------------------------- 1.3 a tool call
chap('1.3','Ask again, with the tool');
nbRun('nb-ask','what','1.3','Ask again, with the tool',{
 run:'reply, info = chat(messages, tools=[read_file])\nprint(calls(reply))',
 look:['Is there an answer in the reply?','What does it ask for?'],
 line:`Back to the notebook. We ask “${esc(Q.question.split('?')[0])}?” and offer the tool.`,
 ask:'What do you think comes back?',expected:'Not an answer. Watch the reply.',
 point:'With a tool on offer, the model can reply with a request instead of an answer.',
 transition:'Here is what came back in our run.'});

S_('tool-call','what','The reply is a request',{builds:2,
 body:`<div class="duo" style="--l:.8fr;--r:1.5fr"><div>${request(esc(Q.question),{who:'We asked'})}
   ${at(2,`<p class="p1-said">${iconHTML('spark',COL.guess,28)}<span>${kA('The model wrote a request.')} It ran nothing.</span></p>`)}</div>
  <div>${editor('the model’s reply',JSON.stringify({role:'assistant',content:Q.text,tool_calls:[{name:Q.name,arguments:Q.args}]},null,2).replace(/\{\n\s+"name": ("[^"]+"),\n\s+"arguments": \{\n\s+"path": ("[^"]+")\n\s+\}\n\s+\}/,'{ "name": $1,\n      "arguments": { "path": $2 } }'),
   {lang:'json',icon:'chat',focus:{2:[3,5,6]},notes:{3:['no answer text',COL.loss,[2]],5:['a request',COL.guess,[2]]}})}</div></div>`,
 lines:['The reply, as it arrived. It is a small piece of structured text.','Its answer text is empty. Instead it names a tool and the argument to pass.'],
 ask:['Who is going to open the file?','Why is it safer that the model can only ask?'],
 expected:['Our program. The model only wrote the request.','Because our program decides which requests to carry out. Part 4 puts the safety checks exactly there.'],
 point:'This is called function calling: the model writes a structured request, and our code decides whether to run it.',
 misconception:'That the model opens files or goes online itself. It never does. Our code does, and only through the tools we gave it.',
 transition:'So our code runs the request. Back to the notebook.',
 source:`Real reply from our run on ${T.date_text} (${esc(T.model)}), shown without its id field.`});

chap('1.4','Run the request');
nbRun('nb-run','what','1.4','Run the request, return the result',{
 run:'result = read_file(**args)\nmessages.append({"role": "tool", "content": result})\nfinal, info = chat(messages, tools=[read_file])',
 look:['Our code opens the file, not the model','Then we call the model again'],
 line:'Our code runs the request and adds the result to the conversation. Then we call the model again.',
 ask:'What will the model do now that it has the file?',expected:'Answer the question, this time from the real code.',
 point:'Our code runs the tool and hands the result back. The model then reads everything again.',
 transition:'Here is what happened in our run.'});

S_('tool-result','what','Our code reads the file, and the model answers',{builds:2,
 body:`<div class="duo top" style="--l:.9fr;--r:1.5fr"><div>${tree('workspace/',PROJECT.slice(0,3),{marks:{'billing.py':[['1,2','read']]}})}
   ${at(2,says(firstSentence(Q.answer),{who:'The model, with the file'}))}</div>
  <div>${editor('billing.py',fnCode,{from:fnFrom})}</div></div>`,
 lines:['Our code opened billing.py and added its text to the conversation.','Now the model answers, and this time it is talking about our code.'],
 ask:['What changed between the two calls to the model?','Did the model spot the bug?'],
 expected:['Only the conversation: it now contains the file’s text.','Not here. We only asked what the file does. Fixing needs more tools.'],
 point:'One request, one result, one answer. The model’s knowledge of our project is whatever our tools put into the conversation.',
 transition:'Who did what, exactly?',
 source:`Real result and answer from our run on ${T.date_text}. The answer is cut to its first sentence.`});

{
 const X={you:110,model:430,code:760,dir:1050},top=64,W=1152,H=400;
 const who=[['you','You',COL.amber,'person'],['model','The model',COL.guess,'spark'],['code','Our code',COL.target,'zap'],['dir','The folder',COL.data,'folder']];
 const msg=(a,b,y,text,col,{dash=false}={})=>{const x1=X[a]+(X[b]>X[a]?14:-14),x2=X[b]+(X[b]>X[a]?-14:14);
  return arrow(x1,y,x2,y,{stroke:col,w:3.5,head:14,dash:dash?'8 7':''})+label((X[a]+X[b])/2,y-12,text,{size:21,fill:col,anchor:'middle',weight:650,halo:true});};
 let g=who.map(([k,name,c,ic])=>`<line x1="${X[k]}" y1="${top+34}" x2="${X[k]}" y2="${H-8}" stroke="${c}" stroke-width="2" stroke-dasharray="3 7" opacity=".5"/>`+
  `<circle cx="${X[k]}" cy="${top}" r="30" fill="#fff" stroke="${c}" stroke-width="3"/>`+icon(ic,X[k],top,30,c)+label(X[k],top-42,name,{size:23,fill:c,anchor:'middle',weight:700})).join('');
 g+=msg('you','model',150,'a question',COL.amber)+msg('model','code',196,'read_file("billing.py")',COL.guess);
 g+=gat(2,msg('code','dir',242,'opens the file',COL.target)+msg('dir','code',288,'its text',COL.data,{dash:true})+msg('code','model',334,'the text, as a result',COL.target,{dash:true}));
 g+=gat(3,msg('model','you',380,'an answer',COL.guess,{dash:true}));
 S_('actors','what','The model never touches the folder',{builds:3,
  body:fig(W,H,g,'A question goes from you to the model; the model asks our code for a tool; our code reads the folder and returns the text; the model answers'),
  lines:['We asked a question. The model answered with a request, addressed to our code.','Our code opened the file and passed the text back. Only our code touched the folder.','Then the model, with the text in front of it, answered us.'],
  ask:['Which of the four can read a file?','Which arrow would you put a lock on?','How many times was the model called?'],
  expected:['Only our code.','The one from our code to the folder: that is where anything real happens.','Twice: once to get the request, once to get the answer.'],
  point:'The model only ever writes text. Every real action goes through our code, where we can check it.',
  transition:'One tool that reads is not enough to fix a bug. We add three more.'});
}

// ---------------------------------------------------------------------------------------- 1.4 four tools and a loop
chap('1.5','Four tools');
{
 // one real request for each tool, from our recorded runs
 const seen=n=>[fail,...S,...(T.invoices?.steps||[]),...(T.tidy?.steps||[])].find(x=>x.name===n);
 const eg=(n,fallback)=>{const x=seen(n);return x?callText(x.name,x.args,40):fallback;};
 const TOOLS=[['read_file','eye',COL.data,'Read a file.','read_file("billing.py")'],['write_file','file',COL.green,'Create a file, or replace it.','write_file("report.md", …)'],
  ['edit_file','pen',COL.amber,'Change one part of a file.','edit_file("billing.py", …)'],['bash','terminal',COL.target,'Run a command in the terminal.','bash("python -m pytest -q")']];
 S_('four-tools','what','Four tools are enough for a lot',{builds:2,nb:nb('nb-1-5','▶ Open 1.5 in Colab'),
  body:`<div class="p1-tools">${TOOLS.map(([n,ic,c,d,ex],i)=>`<div style="--c:${c}">${iconHTML(ic,c,48)}<code>${n}</code><p>${d}</p><small class="mono">${esc(eg(n,ex))}</small>${i===3?`<span class="ring" data-at="2"></span>`:''}</div>`).join('')}</div>`,
  lines:['Read, write, edit, and run a command. Each one is a short Python function, like the first.','The fourth is the powerful one. Anything you can type in a terminal, the agent can now ask for.'],
  ask:['Which of these four could do damage?','Have you seen this set of tools before?'],
  expected:['Three of them: write, edit and above all bash. Part 4 is about that.','It is, give or take, the core of the coding agents people use at work: Claude Code, Gemini CLI, Codex, Cursor.'],
  point:'Read, write, edit and run: with these four an agent can do most of what a person does at a keyboard.',
  demo:'Notebook 1.5: run the cell that defines write_file, edit_file and bash. It prints the four menu entries.',
  transition:'Doing each request by hand gets tedious, so we put it in a loop.',
  source:'The four tools are defined in the notebook, section 1.5: about forty lines in all.'});
}

chap('1.6','Put it in a loop');
S_('loop-map','what','Put it in a loop',{builds:3,
 body:[['goal','model'],['ask','answer'],['tool','result','model']].map((hi,i)=>only(String(i+1),loopMap({hi,here:''}))).join(''),
 lines:['You give a goal. The model reads the conversation so far and writes a reply.',
  'If the reply asks for no tool, it is the answer, and we stop.',
  'If it asks for a tool, our code runs it and adds the result. Then the model reads everything again.'],
 ask:['What starts the loop?','When does it stop?','What could make it never stop?'],
 expected:['A goal from a person.','When the model replies without asking for a tool.','A tool that keeps failing, or a goal that is never met. So we always add a limit on rounds (Part 4).'],
 point:'An agent is a model, some tools and this loop. We come back to this flowchart all through the talk.',
 transition:'As code, the loop is short.'});

S_('loop-code','what','The loop is eleven lines of Python',{builds:3,
 body:editor('notebook · section 1.6, simplified',`def run_agent(goal, tools=TOOLS, max_rounds=12):
    messages = [instructions, goal]
    for n in range(max_rounds):
        reply = chat(messages, tools)
        messages.append(reply)
        if not reply.tool_calls:
            return reply.content
        for call in reply.tool_calls:
            result = run(call)
            messages.append(result)
    return "stopped: too many rounds"`,{focus:{1:[4,5],2:[6,7],3:[[8,10]]},
  notes:{4:['the model reads everything, and replies',COL.guess,[1]],6:['no tool asked for: that is the answer',COL.green,[2]],9:['our code runs the tool, and adds the result',COL.target,[3]]}}),
 lines:['Each round starts with one call to the model. It gets the whole list of messages, every time.',
  'If the reply asks for no tool, we return it. That is the only normal way out.',
  'Otherwise we run each tool it asked for, add the results to the list, and go round again.'],
 ask:['Which line is the “model” box of the flowchart?','Which line is the diamond?','Where do the results go?'],
 expected:['Line 4: the call to chat.','Line 6: did it ask for a tool?','Into the same list of messages, so the model reads them next round.'],
 point:'An agent is an ordinary loop around one model call. No framework is needed.',
 misconception:'That agents need special software. Frameworks add logging, retries and permissions around these lines.',
 transition:'Let us run it on the failing tests.',
 source:'Simplified from run_agent in the notebook, section 1.6 (the real one also asks for approvals and catches errors).'});

nbRun('nb-loop','what','1.6','Put it in a loop',{
 run:'run = run_agent(TASK)',
 look:['Purple blocks are the model, teal blocks are tool results','How many rounds does it take?'],
 line:'We give the loop our one-sentence request and the four tools, and let it go.',
 ask:'What should a careful programmer do first?',expected:'Look at the project and run the tests, before touching anything. Watch whether the agent does.',
 point:'From here on the model decides the steps: which tool, in what order, and when to stop.',
 transition:'Here is our recorded run, round by round.'});

// ---------------------------------------------------------------------------------------- the run, round by round

S_('run-look','what','First it looks around',{builds:2,
 body:`<div class="p1-walk"><div>${loopStrip({model:'1',tool:'2',result:'2'},{round:of(before[0]||fail)})}${toolCall((before[0]||fail).name,(before[0]||fail).args)}</div>
  <div>${term([{cmd:(before[0]||fail).args.command,at:2},{out:(before[0]||fail).result.trim().split(/\n\s*\n/)[0]+'\n…',at:2}])}</div></div>`,
 lines:['The model’s first reply is a request: list the files. It has never seen this project.','Our code runs the command and adds what it printed to the conversation.'],
 ask:['Why not go straight to the fix?','Who typed that command?'],
 expected:['It does not know what is in the folder. Our instructions also tell it to look before it changes anything.','Nobody. The model wrote it as text, and our code ran it.'],
 point:'Round 1: the model asks, our code runs. The strip on the left shows where we are in the loop.',
 transition:'Now it knows what is there. Next it runs the tests.',
 source:`Our recorded run, ${T.date_text}. The listing is cut short here.`});

S_('run-test','what','It runs the tests, and reads the failure',{builds:2,
 body:`<div class="p1-walk"><div>${loopStrip({model:'1',tool:'2',result:'2'},{round:of(fail)})}${toolCall(fail.name,fail.args)}</div>
  <div>${term(failRows(fail,{at:2}))}</div></div>`,
 lines:['Next request: run the tests. Nobody told it there were tests, or how to run them.','They fail. Each failure shows what the code returned, and what the test expected.'],
 ask:['How did it know the command?','What does the model learn from this output?'],
 expected:['It saw test_billing.py in the listing. The tool’s description also gives pytest as an example.',`Which tests fail and what they expected: ${want} where the code gave ${got}.`],
 point:'A failing test is the best thing an agent can read: it says exactly what is wrong.',
 transition:'It knows what is wrong. Now it needs to see why.',
 source:`Our recorded run, ${T.date_text}: each failing test and its assertion, from the real output.`});

S_('run-read','what','It reads the code',{builds:2,
 body:`<div class="p1-walk"><div>${loopStrip({model:'1',tool:'1',result:'1,2'},{round:reads.length>1?`Rounds ${reads[0].round} and ${reads.at(-1).round} of ${A.rounds}`:of(reads[0])})}${reads.map(s=>toolCall(s.name,s.args)).join('')}</div>
  <div>${editor('billing.py',fnCode,{from:fnFrom,focus:{2:[bugLine]},notes:{[bugLine]:['the bug',COL.loss,[2]]}})}</div></div>`,
 lines:[`It asks for ${reads.length>1?'the code, then the tests':'the code'}, and our code returns the text. It is the read_file we wrote first.`,'This is what the model now has in front of it. Can you see the bug?'],
 ask:['Which tool is this?','Where is the bug?'],
 expected:['read_file, the one we wrote first.','The discount line subtracts the number itself. For 10 percent it takes off 10 rupees, not 10 percent.'],
 point:'The model finds the bug the way we would: by reading the function the failing test points to.',
 transition:'It has seen the bug. Now it asks to change that line.',
 source:`Our recorded run, ${T.date_text}. The highlight is ours; the model saw plain text.`});

S_('run-edit','what','It changes one line',{builds:2,
 body:`<div class="p1-walk p1-edit"><div>${loopStrip({model:'1',tool:'2',result:'2'},{round:of(edit)})}${toolCall('edit_file',edit.args)}</div>
  <div>${diff('billing.py',[[' ',fnCode.split('\n')[bugLine-fnFrom-1]],['-',T.check.minus[0]],['+',T.check.plus[0]],[' ',fnCode.split('\n')[bugLine-fnFrom+1]]],{plusAt:2})}</div></div>`,
 lines:['It asks for an edit: replace this exact line with that one. The red line is the bug.','Our code makes the change. One line of the file is different, and nothing else.'],
 ask:['Why edit one line, and not rewrite the file?','Is the new line right?'],
 expected:['A small change is easier to check, and cannot break the rest. Our instructions ask for the smallest change that does the job.','Yes: multiply by one minus the discount as a fraction.'],
 point:'This is the only request in the run that changes a file. Everything before it was looking.',
 transition:'A careful programmer would now run the tests again. So does the agent.',
 source:`Our recorded run, ${T.date_text}: the real old and new lines.`});

S_('run-pass','what','It runs the tests again, and stops',{builds:2,
 body:`<div class="p1-walk"><div><div>${only('1',loopStrip({tool:'1',result:'1'},{round:of(pass)}))}${only('2',loopStrip({model:'2',answer:'2'},{round:`Round ${A.rounds} of ${A.rounds}`}))}</div>
   <div>${only('1',toolCall(pass.name,pass.args))}${only('2',says(firstSentence(A.answer)))}</div></div>
  <div>${term(testRows(pass),{size:'l'})}</div></div>`,
 lines:[`Same command as before. This time all ${word(T.check.passed)} tests pass.`,`So its next reply asks for no tool. The loop ends: ${word(A.rounds)} rounds, ${num(A.seconds,0)} seconds.`],
 ask:['Who decided to run the tests again?','How did our code know the job was done?'],
 expected:['The model. Our instructions ask it to test after changing code, but it chose when.','The reply contained no request, only text. That is the exit of the loop.'],
 point:'The model chose every step, checked its own work, and decided when to stop. Our code only ran the tools.',
 transition:'It says it is done. Do we believe it?',
 source:`Our recorded run, ${T.date_text} (${esc(T.model)}): ${A.rounds} rounds, ${A.calls} tool calls, ${num(A.seconds,1)} seconds of model time.`});

chap('1.7','Check the work');
nbRun('nb-check','what','1.7','Check the work',{
 run:'sh("python -m pytest -q")\nprint(changes(BILLING, new_billing, "billing.py"))\nprint("Tests untouched:", new_tests == TESTS)',
 look:['Do the tests pass when we run them ourselves?','Did it change the tests to make them pass?'],
 line:'We do not take its word for it. We run the tests ourselves and look at exactly what changed.',
 ask:'How could an agent make failing tests pass without fixing anything?',expected:'By editing the tests, or deleting them. It happens. So we check that the test file is untouched.',
 point:'Check an agent’s work against something you trust. Part 4 turns this habit into evals.',
 transition:'Here is what we found.'});

{
 const ok=T.check.tests_untouched;
 const CHECKS=[['The tests pass',term([{cmd:'python -m pytest -q'},{out:`${T.check.passed} passed`,kind:'ok'}])],
  ['One line changed',diff('billing.py',[['-',T.check.minus[0]],['+',T.check.plus[0]]])],
  ['The tests are untouched',term([{out:`Tests untouched: ${ok?'True':'False'}`,kind:ok?'ok':'bad'}],{title:'notebook · 1.7'})]];
 S_('check','what','Did it really fix it?',{builds:3,
 body:`<div class="p1-checks">${CHECKS.map(([t,screen],i)=>{const k=i+1;
  return `<div><div>${k>1?`<h3 class="todo" data-only="1${k>2?'-'+(k-1):''}"><i></i>${t}</h3>`:''}<h3 data-only="${k}-${CHECKS.length}">${iconHTML('check',COL.green,30)}${t}</h3></div>${k>1?at(k,screen):screen}</div>`;}).join('')}</div>`,
 lines:[`We ran the tests ourselves: ${word(T.check.passed)} pass.`,'We compared the file before and after: exactly one line is different.','And the test file is exactly as it was. The agent changed the code and left the tests alone.'],
 ask:['Why run the tests ourselves?','Why look at the change?','Why check the test file?'],
 expected:['Because the agent’s summary is just text. The test run is evidence.','A passing test can hide an unrelated change somewhere else.','The cheapest way to make a test pass is to change the test.'],
 point:'Three cheap checks, none of which trusts the agent’s own summary.',
 transition:'So: the same model, twice.',
 source:`From the notebook, section 1.7, on our run of ${T.date_text}.`});
}

chap();
S_('same-model','what','The same model, two outcomes',{builds:1,
 body:`<div class="p1-two"><div class="bot"><h3>${iconHTML('chat','currentColor',28)}The model on its own</h3>
   ${says(`${aloneLead}<span class="p1-needs">${needs}</span>`,{who:'It replied'})}<p class="verdict">${kR('It could not see the project.')}</p></div>
  <div class="ag"><h3>${iconHTML('spark','currentColor',28)}With four tools, in a loop</h3>
   ${diff('billing.py',[['-',T.check.minus[0]],['+',T.check.plus[0]]],{size:'s'})}${term(testRows(pass),{size:'s'})}</div></div>`,
 lines:['Both came from the same model. The only difference is the tools and the loop.'],
 ask:['So what is an agent?'],
 expected:['A model that uses tools in a loop until it has done what you asked. Compare with the answers collected at the start of the part.'],
 point:'An agent is a model, tools and a loop. It is not a different, smarter kind of model.',
 misconception:'That agents run on a special model. This is the same Gemma 4 that asked us to paste the code.',
 transition:'One sentence to take away from Part 1.',
 source:`Both runs are real (${esc(T.model)}, ${T.date_text}, notebook 1.1 and 1.6).`});

S_('agent-is','what','What is an agent?',{builds:1,
 body:statement(`An agent is a ${kA('model')} that uses ${kT('tools')} in a ${kY('loop')}.`,'The model writes requests. Our code runs them and returns the results, until the model stops asking.'),
 lines:['That is the whole definition. Everything else today is detail.'],
 ask:['Which of the three did we write ourselves?'],
 expected:['The tools and the loop: about sixty lines of Python. The model we downloaded.'],
 point:'Model, tools, loop.',
 transition:'Part 1 in one slide.'});

const CARD={goal:'Make the failing tests pass',model:esc(T.model),
 tools:`${chip('eye','read')} ${chip('pen','write, edit')} ${chip('terminal','bash')}`,memory:'The conversation',
 stop:`An answer, or 12 rounds`,guard:'Works in one folder',human:'Checks the change'};
recap(1,['A tool call is a request; our code runs it.','The loop repeats until the model stops asking.','Then a person checks the work.'],
 'what the model reads each round, and how it remembers.',
 {card:CARD,title:'Our agent',ask:'Which line would change if this agent worked on your company’s real code?',
  expected:'Guardrails (what it may touch and run) and the person (reviews before anything is merged).',point:'The seven lines of this card come back for every agent in the talk.',transition:'Part 2: inside one run.'});
