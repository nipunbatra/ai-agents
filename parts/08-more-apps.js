// Appendix: three more jobs, off the main route, one slide each in the layout of Part 3 (job() in parts/03b-work.js):
// invoices at scale as a workflow, an IT incident at night, and a web form filled in a browser.
// Numbers: OSWorld from data/p3a.json (scripts/sci/p3a.py: verified.md row 18); the invoice count from the folder of
// notebook 3.2 (data/traces.json, key invoices). Positions on the stakes map, quoted in the notes: data/apps.json.
import {data,need,num,word,Word} from '../kit.js';
import {job} from './03b-work.js';

const APPS=need(await data('apps'),'apps'),D=need(await data('p3a'),'osworld','design'),T=need(await data('traces'),'invoices');
const OS=D.osworld,DS=D.design,INV=need(T.invoices,'invoices','problems');
const nInv=INV.invoices.length,nBad=INV.problems;
if(!(nBad>0&&nBad<nInv))throw new Error('app-documents: the slide says some invoices, but not all, had a problem');

/** Where a job sits on the stakes map at the end of Part 3, for the notes. */
const where=id=>{const a=APPS.apps.find(x=>x.id===id);if(!a)throw new Error('No job '+id);
 return `On the stakes map at the end of Part 3: “${a.zone}” (${a.why.replace(/^./,c=>c.toLowerCase()).replace(/\.$/,'')}).`;};
const OPT={section:'optional',optional:true};

job('app-documents','Invoices at scale: mostly a workflow',{...OPT,img:'app-documents.jpg',
 alt:'Illustration: invoices flowing into a filing cabinet, a few flagged ones set aside on a tray',
 steps:[['tools','file','Code reads the invoice, finds its order'],['done','scale','Rules compare quantity and price','a program checks'],
  ['agent','alert','The model explains a mismatch'],['you','approve','A person decides, before payment','a person approves']],
 fact:{big:`${Word(nBad)} of ${word(nInv)}`,text:'invoices in our folder had a problem.'},
 lines:['Our agent sent every invoice to the model. At scale, plain code can do most of these steps.',
  'Rules pass the invoices that match. The rest need judgement: the model’s first, then a person’s.'],
 ask:['Which of these steps needs a model to decide anything?','What would it cost to send every invoice through the model?'],
 expected:['Only the third. The others are the same every time: read, look up, compare. That is a workflow.',
  'Model time on every invoice, and a small chance of a slip on each one. Rules are cheaper and do not slip. The model earns its cost on the exceptions.'],
 point:`Most invoice processing is a fixed workflow. A model is needed only for the invoices that do not match. ${where('invoices')}`,
 misconception:'That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot settle.',
 transition:'Next in the appendix: an IT incident at night.',
 source:'The steps are a design for this talk; they describe no deployed system. The count is from the invoices folder of notebook 3.2.'});

job('app-incident','IT incidents: one approval, before the rollback',{...OPT,img:'app-incident.jpg',
 alt:'Illustration: a dark server room at night, one rack glowing amber, an engineer at a laptop',
 steps:[['tools','pulse','Reads the alert, the logs, the metrics'],['agent','branch','Links the errors to tonight’s deploy'],
  ['you','approve','On-call approves the rollback','a person approves'],['done','pulse','Metrics show whether it worked','a program checks']],
 fact:{big:'One decision',text:`is all the engineer on call is woken for, at ${DS.incident_hour}`},
 lines:['Errors jump. The agent reads the alert, the logs and the metrics, and finds the deploy behind them.',
  'A rollback changes production, so the engineer on call approves it. The metrics show if it worked.'],
 ask:[`At ${DS.incident_hour}, would you let it roll back on its own?`,'What makes that approval quick?'],
 expected:['Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.',
  'The agent has done the reading: the jump in errors, the deploy behind it, and the exact command. The person only judges.'],
 point:`An incident agent does the reading and leaves one decision for a person: the rollback. ${where('incident')}`,
 misconception:'That the risky part is the diagnosis. Reading logs is harmless. The rollback changes production, so that is where the approval goes.',
 transition:'Next in the appendix: a job done in a browser.',
 source:'The steps are a design for this talk; they describe no deployed system.'});

job('app-browser','Web forms: it stops before it pays',{...OPT,img:'app-browser.jpg',
 alt:'Illustration: a laptop showing a web form, a small helper pointing, a hand ready to confirm',
 steps:[['tools','globe','Opens the portal, reads the screen'],['tools','window','Clicks, types, uploads the documents'],
  ['agent','eye','Checks the form against your files'],['you','approve','A person confirms the fee','a person approves']],
 fact:{big:`${num(OS.best_single,0)}%`,text:`of computer tasks done by the best single model. People scored ${num(OS.human,0)}%.`},
 lines:['A browser agent uses a website the way you do: it reads the screen, clicks and types.',
  'On this public test the best model now scores above people. It still stops before it pays.'],
 ask:['Where must it stop and ask you?','If the best models now beat people on this test, why still confirm?'],
 expected:['Before paying and submitting. Both are final and in your name; everything before them can be redone.',
  `The test averages over tidy tasks. The best single model scores ${num(OS.best_single,2)}% on OSWorld-Verified, above the ${num(OS.human,2)}% people scored in the original study (where the best model then scored ${num(OS.paper_best,2)}%; an agent framework now scores ${num(OS.best_framework,2)}%). Real portals have timeouts and unusual forms, and one wrong submission is yours to fix.`],
 point:`A browser agent can fill any web form a person can, so the final, paying click stays with a person. ${where('browser')}`,
 misconception:'That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee you cannot get back.',
 transition:'Next in the appendix: two jobs from science.',
 source:`The steps are a design for this talk; they describe no deployed system. OSWorld: Xie et al. (${OS.paper_year}), and the OSWorld-Verified leaderboard (${OS.best_single_date}).`});
