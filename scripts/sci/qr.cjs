// QR codes for the closing slides, as SVG path data: the slides' address and the notebook's address.
//   NODE_PATH=/path/to/node_modules node scripts/sci/qr.cjs      writes data/qr.json (needs the npm package qrcode)
const QR=require('qrcode'),fs=require('fs'),path=require('path');
const OUT=path.join(__dirname,'..','..','data','qr.json');
const LINKS={slides:'https://nipunbatra.github.io/ai-agents/',notebook:'https://colab.research.google.com/github/nipunbatra/ai-agents/blob/main/notebook/agents.ipynb'};
const out={};
for(const [k,url] of Object.entries(LINKS)){
 const q=QR.create(url,{errorCorrectionLevel:'M'}),n=q.modules.size,d=q.modules.data;let p='';
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(d[y*n+x])p+=`M${x} ${y}h1v1h-1z`;
 out[k]={url,size:n,path:p};
}
fs.writeFileSync(OUT,JSON.stringify(out)+'\n');console.log(OUT,Object.fromEntries(Object.entries(out).map(([k,v])=>[k,v.size])));
