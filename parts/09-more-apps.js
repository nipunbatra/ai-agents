// Appendix: more applications from Part 3 (science), off the main route: Google's AI co-scientist and a chemistry
// experiment on a lab robot. Each is one app() slide, drawn the same way as the main-route applications.
// Numbers: data/p3b.json (scripts/sci/p3b.py: verified.md rows 9 to 11).
import {app,data,need,word} from '../kit.js';

const D=need(await data('p3b'),'coscientist','lab','robin');
const CS=D.coscientist,L=D.lab,RB=D.robin;
/** The lane settings of an application slide with an illustration (as in Part 3a). */
const CARD={laneH:82,fs:17,laneOpts:{gap:4,left:204},section:'optional',optional:true};

app('app-coscientist','Google’s AI co-scientist: several agents, one goal',{...CARD,img:'app-coscientist.jpg',
 alt:'Illustration: three scientists at a whiteboard of molecules, hypothesis cards pinned in a tournament bracket',
 who:'A microbiology team',req:'How do genetic islands spread across bacteria? Give us testable ideas.',
 names:{you:'Scientists',agent:'Agents'},
 steps:[{lane:'you',icon:'target',t:'Research\ngoal'},{lane:'agent',icon:'spark',t:'Generate\nideas'},{lane:'agent',icon:'chat',t:'Debate\neach idea'},
  {lane:'agent',icon:'scale',t:'Rank the\nideas'},{lane:'agent',icon:'refresh',t:'Improve,\nrank again'},
  {lane:'you',icon:'approve',t:'Scientist\npicks',kind:'check'},{lane:'tools',icon:'flask',t:'Lab\ntests'}],
 tools:[['search','web search'],['file','papers']],
 check:'Scientists pick which ideas get lab time.',
 evidence:{big:`${CS.days} days`,text:'to reach a result a lab had found but not yet published.'},
 lines:['It splits a research goal across several agents. They generate ideas, argue about them and rank them.',
  'The scientists see only the top ideas. Only a lab experiment can tell which is right.'],
 ask:['How would you check whether a new hypothesis is any good?','Where are the checks in this loop?'],
 expected:['Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.',
  'Twice: the agents’ own debate and ranking, which cost little and can be wrong; then the scientists’ lab experiments, which are slower and test the idea directly.'],
 point:'Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.',
 misconception:'That the co-scientist discovered something unknown. It reached, on its own, a result a team at Imperial College London had found but not yet published; the experiments were theirs.',
 transition:'What if the agent could run the experiment too?',
 source:`Google Research blog, ${CS.date} (built on ${CS.model}); the ${word(CS.days)} days are from Google’s paper, arXiv ${CS.arxiv}. Trace simplified; it also searches the literature.`});

app('app-lab','A chemistry experiment on a lab robot',{...CARD,img:'app-lab.jpg',
 alt:'Illustration: a robotic arm pipetting liquid into test tubes and a well plate in a bright laboratory',
 who:'A chemistry lab',req:'Plan and run a palladium-catalysed coupling on our liquid-handling robot.',
 names:{you:'Chemist'},
 steps:[{lane:'you',icon:'target',t:'Set the\nreaction'},{lane:'tools',icon:'file',t:'Read the\nmanual'},
  {lane:'agent',icon:'list',t:'Plan the\nsteps'},{lane:'agent',icon:'code',t:'Write\nrobot code'},{lane:'you',icon:'approve',t:'Chemist\napproves',kind:'check'},
  {lane:'tools',icon:'robot',t:'Robot\npipettes'},{lane:'tools',icon:'chart',t:'Measure\nthe yield',kind:'done'}],
 tools:[['file','robot manual'],['robot','liquid handler'],['chart','plate reader']],
 check:'A chemist approves the plan; instruments check every result.',
 evidence:{big:'Coscientist',text:`ran these couplings on lab robots, as reported in ${L.journal}.`},
 lines:['A chemistry goal and the robot’s manual. Can a model turn these into a working experiment?',
  'The one approval comes just before reagents are used: the step that costs money.'],
 ask:['What would worry you about letting a model drive lab equipment?','Why put the approval there, and not at the end?'],
 expected:['Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.',
  'Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.'],
 point:'When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.',
 misconception:`That these systems replace the lab team. FutureHouse’s Robin proposed ${RB.drug} as a drug candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.`,
 transition:'Back to the main route: the stakes map of Part 3.',
 source:`Coscientist: Boiko, MacKnight, Kline and Gomes, ${L.journal}, ${L.date}. Robin: FutureHouse, ${RB.date}. The approval step is our addition.`});
