// The agent-specific figures of the talk: an icon set, the three-lane trace card every application uses, the loop
// drawn as an engine, chat bubbles for real traces, tool chips and the agent card.
// Colours carry meaning everywhere: amber is a person, purple is the model, teal is tools and the world,
// red is risk, green is a checked result, blue is memory and data.
import {esc} from './shared/author.js';
import {COL,MUTED,label,arrow,gat,fig} from './widgets.js';

export const ROLE={you:COL.amber,agent:COL.guess,tools:COL.target,risk:COL.loss,done:COL.green,memory:COL.data};
const TINT={you:'#AA4E0812',agent:'#8B2CDE10',tools:'#0F766E10'};
const HALO={you:'#F4EEEA',agent:'#F3EDF9',tools:'#EBF2F2'};   // the tints above, flattened onto the paper
const DARK='#4B5563';

/** Stroke icons on a 24 × 24 grid (round caps, no fill), drawn in the colour they are given. */
export const ICONS={
 person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
 spark:'<path d="M12 3l1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/><path d="M19 3v4M21 5h-4"/>',
 plug:'<path d="M9 2v6M15 2v6M12 18v4"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
 code:'<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
 terminal:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 9l4 3-4 3M12 15h6"/>',
 globe:'<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/>',
 window:'<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20"/><path d="M5.5 5.5h.01M8 5.5h.01"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
 mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/>',
 calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 chart:'<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-3"/>',
 sensor:'<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2"/>',
 chat:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
 mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 approve:'<circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2"/><path d="M15 17l2 2 5-5"/>',
 alert:'<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 flask:'<path d="M9 2h6M10 2v6L4.5 18.5A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.8-3L14 8V2"/><path d="M7 15h10"/>',
 leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.5-.6 4.4-1.6 5.8-3.9"/>',
 thermo:'<path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>',
 pulse:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
 rupee:'<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3c6.7 0 6.7-10 0-10"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 notes:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h5"/>',
 branch:'<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v7M18 15.5V11a3 3 0 0 0-3-3h-4"/><path d="M13 5.5L10.5 8 13 10.5"/>',
 server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
 bot:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><path d="M9 13v2M15 13v2"/>',
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
 cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6"/>',
 zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
 wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
 pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 refresh:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
 stop:'<rect x="5" y="5" width="14" height="14" rx="2"/>',
 tractor:'<circle cx="7" cy="17" r="4"/><circle cx="18" cy="18" r="3"/><path d="M3 13V7h7l2 6M12 13h7v2M10 7V4"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>',
 robot:'<path d="M12 22v-6M8 22h8M12 16l-4-6 6-5M14 5l3 3M8 10H4"/><circle cx="12" cy="16" r="1.5"/>',
 money:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
 scale:'<path d="M12 3v18M7 21h10M4 7h16M4 7l-2.5 6a3 3 0 0 0 5 0zM20 7l-2.5 6a3 3 0 0 0 5 0z"/>',
 key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3M14 9l2 2"/>',
};
/** One icon centred at (cx, cy), `size` units wide. */
export function icon(name,cx,cy,size=28,color=COL.ink,{sw=2,fill='none'}={}){
 const d=ICONS[name];if(d==null)throw new Error('No icon '+name);
 const s=size/24;
 return `<g transform="translate(${(cx-size/2).toFixed(1)},${(cy-size/2).toFixed(1)}) scale(${s.toFixed(4)})" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
}
/** An icon as inline HTML, for text and chips. */
export const iconHTML=(name,color='currentColor',size=26)=>`<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
/** A tool as a chip with its icon: chip('search','web search'). role picks the colour. */
export const chip=(ic,text,role='tools')=>`<span class="tchip ${role}">${iconHTML(ic,ROLE[role]||role,22)}${text}</span>`;

// ---------------------------------------------------------------------------------------- the trace card
const LANES=[['you','You','person'],['agent','Agent','spark'],['tools','Tools and world','plug']];
/** The trace of one task as three lanes: you (amber), the agent (purple), tools and the world (teal). Time runs left
 to right. steps: [{lane, icon, t, at, kind, n}]; t may hold '\n'; kind 'check' fills a person's step (an approval),
 'risk' draws it red, 'done' green; n adds a "×n" badge (n calls at once); at reveals the step and its incoming
 arrow from that click. names relabels lanes: {tools:'Lab robot'}. */
export function lanes(steps,{W=1152,laneH=108,left=172,fs=18,r=25,names={},alt='The trace of a task in three lanes',gap=8,first=0}={}){
 const n=steps.length,colW=(W-left-6)/n,top=4,lines=Math.max(...steps.map(s=>String(s.t).split('\n').length));
 r=Math.max(16,Math.min(r,Math.floor((laneH-14-lines*(fs+2)-fs*.3)/2)));
 const laneY=k=>top+LANES.findIndex(l=>l[0]===k)*(laneH+gap);
 let g='';
 for(const [k,name,ic] of LANES){const y=laneY(k),c=ROLE[k];
  g+=`<rect x="0" y="${y}" width="${W}" height="${laneH}" rx="14" fill="${TINT[k]}"/>`;
  g+=icon(ic,24,y+laneH/2,26,c)+label(46,y+laneH/2+7,esc(names[k]||name),{size:19,fill:c,weight:650});
 }
 const pos=steps.map((s,i)=>{if(!LANES.some(l=>l[0]===s.lane))throw new Error('Unknown lane '+s.lane);return [left+colW*(i+.5),laneY(s.lane)+r+5];});
 // Two passes: every arrow first, then nodes and labels on top, the labels with a halo in the lane's colour, so an
 // arrow never runs over text. Each piece still appears at its step's click.
 // Labels hang below the nodes, so an arrow that changes lane leaves the node's right side, turns halfway to the next
 // column, and enters the next node from its left: it never runs through a label or along another arrow.
 const elbow=(pts)=>{const [hx,hy]=pts.at(-1),[px,py]=pts.at(-2),a=Math.atan2(hy-py,hx-px),h=10;
  return `<path d="M${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' L')}" fill="none" stroke="${DARK}" stroke-width="2.2" stroke-linejoin="round"/>`+
   `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx-h*Math.cos(a-.42)).toFixed(1)},${(hy-h*Math.sin(a-.42)).toFixed(1)} L${(hx-h*Math.cos(a+.42)).toFixed(1)},${(hy-h*Math.sin(a+.42)).toFixed(1)}Z" fill="${DARK}"/>`;};
 steps.forEach((s,i)=>{if(i<=first)return;const [x0,y0]=pos[i-1],[x,y]=pos[i];
  const a=Math.abs(y-y0)<1?arrow(x0+r+5,y0,x-r-7,y,{stroke:DARK,w:2.2,head:10})
   :elbow([[x0+r+4,y0],[(x0+x)/2,y0],[(x0+x)/2,y],[x-r-6,y]]);   // turn halfway between the columns, so a round trip never shares a line
  g+=s.at?gat(s.at,a):a;});
 steps.forEach((s,i)=>{
  const [x,y]=pos[i],c=s.kind==='risk'?COL.loss:s.kind==='done'?COL.green:ROLE[s.lane];let b='';
  const filled=s.kind==='check'||s.kind==='done';
  b+=`<circle cx="${x.toFixed(1)}" cy="${y}" r="${r}" fill="${filled?c:'#fff'}" stroke="${c}" stroke-width="2.6"/>`;
  b+=icon(s.icon,x,y,r*1.05,filled?'#fff':c);
  if(s.n)b+=`<g><circle cx="${(x+r*.85).toFixed(1)}" cy="${y-r*.85}" r="12" fill="${c}"/>${label(x+r*.85,y-r*.85+5,'×'+s.n,{size:13,fill:'#fff',anchor:'middle',weight:700})}</g>`;
  String(s.t).split('\n').forEach((t,j)=>{b+=`<text x="${x.toFixed(1)}" y="${(y+r+fs+1+j*(fs+2)).toFixed(1)}" fill="${COL.ink}" font-size="${fs}" text-anchor="middle" style="paint-order:stroke;stroke:${HALO[s.lane]};stroke-width:6px;stroke-linejoin:round">${esc(t)}</text>`;});
  g+=s.at?gat(s.at,b):b;
 });
 return fig(W,top+3*laneH+2*gap+2,g,alt,'lanes');
}

// ---------------------------------------------------------------------------------------- the loop as an engine
/** The agent loop: think (the model) → act (tools) → observe (results) → think again, until it answers.
 o.at: {loop, act, observe, stop, tools} reveal builds; o.size scales; o.tools: icons around Act. */
export function loopFig({W=620,H=470,at={},tools=['search','database','mail','code','globe'],labels={},hub=true,stopText='answer',toolSize=24}={}){
 const cx=W/2-40,cy=Math.max(H/2+8,232),R=150,st=[['think',-90,'spark',COL.guess,labels.think||'Think'],['act',30,'zap',COL.target,labels.act||'Act'],['observe',150,'eye',COL.target,labels.observe||'Observe']];
 const P=a=>[cx+R*Math.cos(a*Math.PI/180),cy+R*Math.sin(a*Math.PI/180)];
 let g='';
 const arc=(a0,a1,col)=>{const [x0,y0]=P(a0+19),[x1,y1]=P(a1-21),[hx,hy]=P(a1-19);
  const tang=Math.atan2(hy-y1,hx-x1),h=14;
  return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)}" fill="none" stroke="${col}" stroke-width="4"/>`+
   `<path d="M${hx.toFixed(1)},${hy.toFixed(1)} L${(hx-h*Math.cos(tang-.45)).toFixed(1)},${(hy-h*Math.sin(tang-.45)).toFixed(1)} L${(hx-h*Math.cos(tang+.45)).toFixed(1)},${(hy-h*Math.sin(tang+.45)).toFixed(1)}Z" fill="${col}"/>`;};
 const wrap=(k,s)=>at[k]?gat(at[k],s):s;
 g+=wrap('act',arc(-90,30,DARK));g+=wrap('observe',arc(30,150,DARK));g+=wrap('loop',arc(150,270,DARK));
 if(hub)g+=wrap('loop',icon('target',cx,cy-14,40,COL.amber)+label(cx,cy+30,'the goal',{size:20,fill:COL.amber,anchor:'middle',weight:600}));
 for(const [k,a,ic,c,name] of st){const [x,y]=P(a),b=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="44" fill="#fff" stroke="${c}" stroke-width="3.5"/>`+icon(ic,x,y-6,34,c)+
   label(x,y+(a===-90?-56:70),name,{size:24,fill:c,anchor:'middle',weight:700});g+=k==='think'?b:wrap(k,b);}
 if(tools?.length){const [ax,ay]=P(30);const t=tools.map((ic,i)=>{const a=(-40+i*28)*Math.PI/180,x=ax+92*Math.cos(a)+8,y=ay+92*Math.sin(a);return icon(ic,x,y,toolSize,COL.target);}).join('');g+=wrap('tools',t);}
 if(at.stop!==undefined){const [tx,ty]=P(-90),x1=tx+50,x2=W-14;
  g+=gat(at.stop,arrow(x1,ty,x2-70,ty,{stroke:COL.green,w:3,head:13})+icon('check',x2-46,ty,30,COL.green,{sw:2.6})+label(x2-46,ty+38,stopText,{size:20,fill:COL.green,anchor:'middle',weight:650}));}
 return fig(W,H,g,'The agent loop: think, act, observe, repeated until the goal is reached','loopfig');
}

// ---------------------------------------------------------------------------------------- messages of a real trace
/** One message of a trace as a chat bubble. who: 'you', 'model', 'call', 'tool', 'thought'. */
export function msg(who,html,{note='',at=0}={}){
 const head={you:['person','You'],model:['spark','Model'],call:['spark','Model asks for a tool'],tool:['plug','Tool result'],thought:['spark','Model thinks']}[who];
 const b=`<div class="msg ${who}"><div class="mh">${iconHTML(head[0],'currentColor',20)}<span>${head[1]}</span>${note?`<em>${note}</em>`:''}</div><div class="mb">${html}</div></div>`;
 return at?`<div data-at="${at}">${b}</div>`:b;
}
/** JSON for a slide: keys teal, strings dark, numbers blue. */
export function jsonHTML(obj,indent=1){
 const s=indent?JSON.stringify(obj,null,indent):JSON.stringify(obj).replace(/([,:])(?=["{\d-])/g,'$1 ');
 return `<pre class="json">${esc(s).replace(/(&quot;[^&]*?&quot;)(\s*:)/g,'<span class="jk">$1</span>$2').replace(/:\s(-?\d+(?:\.\d+)?)/g,': <span class="jn">$1</span>')}</pre>`;
}

// ---------------------------------------------------------------------------------------- the agent card
export const SLOTS=[['goal','Goal'],['model','Model'],['tools','Tools'],['memory','Memory'],['stop','Stops when'],['guard','Guardrails'],['human','Person']];
/** An agent's card, the way the talk describes every agent: fill holds HTML per slot; hi tints slots. */
export function agentCard(fill,{hi=[],title='',sm=false,dim=false}={}){
 for(const k of Object.keys(fill))if(!SLOTS.some(s=>s[0]===k))throw new Error('Unknown agent-card slot '+k);
 return `<div class="acard${sm?' sm':''}${dim?' dimrest':''}">${title?`<h3>${title}</h3>`:''}<dl>${SLOTS.filter(([k])=>fill[k]!=null).map(([k,name])=>
  `<dt class="s-${k}${hi.includes(k)?' hi':''}">${name}</dt><dd${hi.includes(k)?' class="hi"':''}>${fill[k]}</dd>`).join('')}</dl></div>`;
}
