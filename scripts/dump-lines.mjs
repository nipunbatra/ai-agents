// Titles, story lines (one per build), part-break leads and notes fields, straight from the slide objects. For prose passes.
//   python3 scripts/serve.py   then   node scripts/dump-lines.mjs > qa/lines.md   (DECK_PART=02 for one part)
import fs from 'node:fs';
import puppeteer from 'puppeteer';
const base=process.env.DECK_URL||'http://127.0.0.1:8795';
const executablePath=['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/google-chrome','/usr/bin/chromium'].find(p=>fs.existsSync(p));
const b=await puppeteer.launch({headless:true,executablePath,args:['--no-sandbox']});
try{
 const p=await b.newPage();const part=process.env.DECK_PART||'';await p.goto(`${base}/?all${part?`&part=${part}`:''}`,{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.deckReady,{timeout:30000});
 const rows=await p.evaluate(()=>lecture.allSlides.map(s=>({id:s.id,title:s.title,prompts:s.prompts,notes:s.notes})));
 const strip=x=>String(x??'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
 for(const r of rows){console.log(`## ${r.id}\nT: ${strip(r.title)}`);(r.prompts||[]).forEach((l,i)=>console.log(`L${i+1}: ${strip(l)}`));const n=r.notes||{};
  if(n.point)console.log(`POINT: ${strip(n.point)}`);(n.ask||[]).forEach((a,i)=>a&&console.log(`ASK${i+1}: ${strip(a)} => ${strip((n.expected||[])[i])}`));if(n.misconception)console.log(`MISC: ${strip(n.misconception)}`);if(n.transition)console.log(`TRANS: ${strip(n.transition)}`);console.log('');}
}finally{await b.close();}
