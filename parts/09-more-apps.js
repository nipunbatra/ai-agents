// Appendix: two more jobs from science, off the main route, one slide each in the layout of Part 3 (job() in
// parts/03b-work.js): Google's AI co-scientist, and a chemistry experiment on a lab robot.
// Numbers: data/p3b.json (scripts/sci/p3b.py: verified.md rows 9 to 11).
import {data,need,word} from '../kit.js';
import {job} from './03b-work.js';

const D=need(await data('p3b'),'coscientist','lab','robin');
const CS=D.coscientist,L=D.lab,RB=D.robin;
const OPT={section:'optional',optional:true};

job('app-coscientist','Google’s AI co-scientist: agents propose, a lab tests',{...OPT,img:'app-coscientist.jpg',
 alt:'Illustration: three scientists at a whiteboard of molecules, hypothesis cards pinned in a tournament bracket',
 steps:[['you','target','Scientists set a research goal'],['agent','spark','Agents generate ideas, and debate them'],
  ['agent','scale','They rank the ideas, improve the best'],['you','flask','Scientists pick; a lab tests','a person decides']],
 fact:{big:`${CS.days} days`,text:'to reach a result that a lab had found but not yet published.'},
 lines:['Several agents share one research goal. They generate ideas, argue about them and rank them.',
  'The scientists see only the top ideas. Only a lab experiment can tell which one is right.'],
 ask:['How would you check whether a new hypothesis is any good?','Where are the checks in this loop?'],
 expected:['Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.',
  'Twice: the agents’ own debate and ranking, which cost little and can be wrong; then the scientists’ lab experiments, which are slower and test the idea directly.'],
 point:'Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.',
 misconception:'That the co-scientist discovered something unknown. It reached, on its own, a result a team at Imperial College London had found but not yet published; the experiments were theirs.',
 transition:'What if the agent could run the experiment too?',
 source:`Google Research blog, ${CS.date} (built on ${CS.model}); the ${word(CS.days)} days are from Google’s paper, arXiv ${CS.arxiv}. The steps are simplified; it also searches the literature.`});

job('app-lab','A lab robot: the model writes the experiment',{...OPT,img:'app-lab.jpg',
 alt:'Illustration: a robotic arm pipetting liquid into test tubes and a well plate in a bright laboratory',
 steps:[['agent','file','Reads the robot’s manual, plans the steps'],['agent','code','Writes the code for the robot'],
  ['you','approve','A chemist approves the plan','a person approves'],['done','chart','Instruments measure the yield','a program checks']],
 fact:{big:'Coscientist',text:`ran palladium-catalysed couplings on lab robots (${L.journal}, ${L.year}).`},
 lines:['The model gets a chemistry goal and the robot’s manual. It plans the reaction and writes the code.',
  'A chemist approves before any reagents are used. Instruments then measure the result.'],
 ask:['What would worry you about letting a model drive lab equipment?','Why put the approval there, and not at the end?'],
 expected:['Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.',
  'Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.'],
 point:'When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.',
 misconception:`That these systems replace the lab team. FutureHouse’s Robin proposed ${RB.drug} as a drug candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.`,
 transition:'Back to the main route.',
 source:`Coscientist: Boiko, MacKnight, Kline and Gomes, ${L.journal}, ${L.date}. Robin: FutureHouse, ${RB.date}. The approval step is our addition.`});
