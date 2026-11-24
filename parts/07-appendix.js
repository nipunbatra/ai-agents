// Appendix (off the main route; shown with ?all, in the reading view and in the PDFs): the words of the talk in three
// short slides, MCP in one slide (the read_file tool of Part 1, published as a server), and further reading.
import {O,table,small,nb,css,iconHTML,COL,editor} from '../kit.js';

css(`.p7-gloss th:first-child{width:300px}.p7-gloss td:first-child{white-space:nowrap}
.p7-any{display:flex;flex-direction:column;gap:12px}
.p7-any small{font-size:16px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--q)}
.p7-any div{display:flex;align-items:center;gap:12px;border:2px solid #8B2CDE66;background:#8B2CDE0D;border-radius:14px;padding:14px 18px;font-size:25px;font-weight:600}
@media(max-width:760px){.reading .p7-any div{font-size:19px}}`);

// ---------------------------------------------------------------------------------------- the words of the talk
const GLOSS=[
 ['glossary','Glossary: the agent','The four words of Part 1.',[
  ['Agent','A model that uses tools in a loop.'],
  ['Tool','A function our code runs when the model asks.'],
  ['Tool call','The model’s request for a tool, with its arguments.'],
  ['The loop','Call the model, run its requests, repeat until it answers.']]],
 ['glossary-2','Glossary: one run','The four words of Part 2.',[
  ['A round','One call to the model, and the requests it makes.'],
  ['Context','Everything the model reads in one round.'],
  ['Token','A piece of a word. Hosted models charge per million.'],
  ['Notes','A file the agent writes, and a later run reads.']]],
 ['glossary-3','Glossary: keeping it safe','The words of Part 4.',[
  ['Guardrail','A limit that our code enforces.'],
  ['Approval','A person says yes before a request runs.'],
  ['Sandbox','A place where the agent can do no lasting harm.'],
  ['Prompt injection','Text in a file that poses as an instruction.'],
  ['Eval','The same job run many times, each run checked.']]]];
const GASK=[['Which of these four did we write ourselves today?','The tools and the loop. The model we downloaded, and the tool calls are what it wrote.'],
 ['Which of these grows during a run?','The context: every result is added to it, and the model rereads all of it each round. The notes are the only one that lasts after the run.'],
 ['Which of these does your organisation already have a policy for?','Usually approvals, for people. Guardrails and evals for agents are where to start.']];
GLOSS.forEach(([id,title,line,terms],i)=>O(id,title,{
 body:`<div class="p7-gloss">${table(['Term','Meaning'],terms.map(([t,d])=>[`<b>${t}</b>`,d]))}</div>`,
 lines:[line],ask:[GASK[i][0]],expected:[GASK[i][1]],point:'The vocabulary of the talk, a few words per term.'}));

// ---------------------------------------------------------------------------------------- MCP in one slide
const AGENTS=['Our notebook’s agent','A coding agent','A chat assistant'];
O('mcp-server','MCP publishes a tool once, for any agent',{nb:nb('nb-5-2','▶ Open 5.2 in Colab'),
 body:`<div class="duo" style="--l:1.55fr;--r:.8fr"><div>${editor('server.py',`from mcp.server.fastmcp import FastMCP

mcp = FastMCP("workspace")

@mcp.tool()
def read_file(path: str) -> str:
    """Read a text file in the project."""
    return inside(path).read_text()

mcp.run()`,{notes:{3:['a name for the server',COL.target],5:['it was @tool',COL.guess],10:['waits for requests',COL.target]}})}</div>
  <div class="p7-any"><small>Any agent that supports MCP</small>${AGENTS.map(a=>`<div>${iconHTML('spark',COL.guess,28)}${a}</div>`).join('')}</div></div>`,
 lines:['This is read_file from Part 1, published as an MCP server. Any agent that supports MCP can now call it.'],
 ask:['What changes for the model when the tool moves behind MCP?'],
 expected:['Nothing. It still reads a name, a description and the arguments, and still writes a request. What changes is who can use the tool: any agent, with no new code.'],
 point:'MCP, the Model Context Protocol, is a shared standard for offering tools to agents. A server is about as short as the tool itself.',
 misconception:'That MCP makes a tool safe. It only publishes it. Which requests run, and which wait for a person, is still decided in the agent’s loop.',
 source:'Model Context Protocol: modelcontextprotocol.io. Python SDK: pip install mcp.'});

// ---------------------------------------------------------------------------------------- further reading
const READ=[
 ['Anthropic, “Building effective agents” (2024)','Workflows and agents'],
 ['Simon Willison, “The lethal trifecta for AI agents” (2025)','Hidden instructions'],
 ['Feng and others, “Levels of Autonomy for AI Agents” (2025)','How much freedom'],
 ['Anthropic, “How we built our multi-agent research system” (2025)','Agent teams and cost'],
 ['modelcontextprotocol.io','MCP']];
O('further','Further reading',{
 body:`<div>${table(['Read','For'],READ.map(([a,b])=>[a,b]))}</div>${small('Links: SOURCES.md in the repository.')}`,
 lines:['Five things to read next.'],
 ask:['Which one would you read first?'],expected:['Building effective agents for anyone building one; the lethal trifecta for anyone who lets an agent near private data.'],
 point:'Where to go next.'});
