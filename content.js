// The talk, assembled from its parts in order. Each file in parts/ adds its slides to the one list in kit.js.
// ?part=03 loads that one part on its own, for work on a single part: ?all&part=03.
import {meta,slides,mount as mountWidgets} from './kit.js';
const FILES=['00-opening','01-what','02-engine','03a-work','03b-work','04-risk','05-adopt','06-wrap','07-appendix','08-more-apps','09-more-apps'];
const one=new URLSearchParams(location.search).get('part');
if(one&&!FILES.some(f=>f.startsWith(one+'-')))throw new Error('No part '+one);
for(const f of FILES)if(!one||f.startsWith(one+'-'))await import(`./parts/${f}.js`);
export {meta,slides};
export const mount=(stage,ctx)=>mountWidgets(stage,ctx,{});
