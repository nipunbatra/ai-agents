import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://127.0.0.1:8795/?all&part='+(process.argv[2]||'00'),{waitUntil:'networkidle0'});await new Promise(r=>setTimeout(r,2500));
console.log(errs.slice(0,5).join('\n')||'no errors', await p.evaluate(()=>!!window.deckReady));await b.close();
