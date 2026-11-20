// Every slide's visible words at its last build: title, story line per build, body text and SVG labels. For a prose pass.
//   python3 scripts/serve.py   then   node scripts/dump-text.mjs > qa/text.md
import fs from 'node:fs';
import puppeteer from 'puppeteer';
const base=process.env.DECK_URL||'http://127.0.0.1:8795';
const executablePath=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>fs.existsSync(p));
const b=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox']});
try{
 const p=await b.newPage();await p.setViewport({width:1280,height:800});
 await p.goto(`${base}/?all`,{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.deckReady,{timeout:30000});
 const slides=await p.evaluate(()=>lecture.allSlides.map(s=>({id:s.id,builds:s.builds})));
 for(const s of slides){
  const lines=[];
  for(let k=1;k<=s.builds;k++){await p.evaluate((id,k)=>lecture.goTo(id,k),s.id,k);
   lines.push(await p.evaluate(()=>{const sc=document.querySelector('.scene.current'),vis=el=>el.checkVisibility({opacityProperty:true,visibilityProperty:true});
    const l=[...sc.querySelectorAll('.prompt [data-only]')].find(vis);return l?l.textContent.trim():'';}));}
  const t=await p.evaluate(()=>{const sc=document.querySelector('.scene.current'),vis=el=>el.checkVisibility({opacityProperty:true,visibilityProperty:true});
   const title=(sc.querySelector('h2,.title,h1')||{}).textContent||'';let body=[],svg=[];
   const tw=document.createTreeWalker(sc.querySelector('.content'),NodeFilter.SHOW_TEXT);
   for(let n;(n=tw.nextNode());){const el=n.parentElement,x=n.textContent.trim();if(!x||!el||el.closest('pre,.katex,.act-strip')||!vis(el))continue;(el.closest('svg')?svg:body).push(x);}
   return {title:title.trim(),body:body.join(' | '),svg:svg.join(' | ')};});
  console.log(`## ${s.id}\nTITLE: ${t.title}\nLINES: ${[...new Set(lines.filter(Boolean))].join(' // ')}\nBODY: ${t.body}\nSVG: ${t.svg}\n`);
 }
}finally{await b.close();}
