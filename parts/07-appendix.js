// Appendix (off the main route; shown with ?all, in the reading view and in the PDFs): a glossary in three short
// slides, the tool from the talk as an MCP server (notebook 5.2), and further reading.
import {O,table,code,small,nb} from '../kit.js';

// Three short glossary slides: each meaning is a few words, so each slide stays light.
const GLOSS=[
 ['glossary','Glossary: the loop','The words of Part 1.',[
  ['Agent','A model that uses tools in a loop.'],
  ['Tool','A function the model can ask to run.'],
  ['Tool call','The model’s request to run a tool.'],
  ['The loop','Ask, run the tools, repeat until it answers.'],
  ['Round','One model turn.']]],
 ['glossary-2','Glossary: what the model reads','The words of Parts 1 and 2.',[
  ['Context','Everything the model reads in one round.'],
  ['Token','A piece of a word. Prices are per million.'],
  ['Workflow','Steps fixed in advance.'],
  ['MCP','A shared standard for offering tools to agents.']]],
 ['glossary-3','Glossary: running it safely','The words of Parts 1, 4 and 5.',[
  ['Autonomy level','How much the agent decides without a person.'],
  ['Shadow mode','The agent suggests; a person does the work.'],
  ['Guardrail','A limit your code enforces.'],
  ['Prompt injection','Text in the data posing as an instruction.'],
  ['Eval','Past cases with known answers.']]]];
const GASK=[['Which of these words did you hear for the first time today?','Usually round and token.'],
 ['Which of these does your team already pay for, or use?','Tokens, through an API bill; workflows, through existing automation.'],
 ['Which of these does your organisation already have a policy for?','Usually none of them yet. Guardrails and evals are where to start.']];
GLOSS.forEach(([id,title,line,terms],i)=>O(id,title,{
 body:`<div>${table(['Term','Meaning'],terms.map(([t,d])=>[`<b>${t}</b>`,d]))}</div>`,
 lines:[line],ask:[GASK[i][0]],expected:[GASK[i][1]],point:'The vocabulary of the talk, a few words per term.'}));

O('mcp-code','The air-quality tool as an MCP server',{nb:nb('nb-5-2','▶ Open 5.2 in Colab'),
 body:`${code(`from mcp.server.fastmcp import FastMCP
mcp = FastMCP("air-quality")

@mcp.tool()
def get_air_quality(city: str, days: int = 3) -> dict:
    """Forecast of daily mean PM2.5 for a city, starting tomorrow."""
    ...   # the same body as in 1.2

mcp.run()`)}${small('Its name and docstring become the entry the model reads, as with the notebook’s <span class="mono">@tool</span>.')}`,
 ask:['What changes for the agent when the tool moves behind MCP?'],
 expected:['Nothing about how it calls the tool. What changes is that any agent that supports MCP can use it without new code.'],
 point:'An MCP server is about as small as the tool itself. Notebook section 5.2, “One tool for every agent: MCP”, has it.',
 source:'Model Context Protocol Python SDK (pip install mcp), github.com/modelcontextprotocol/python-sdk.'});

const READ=[
 ['Anthropic, “Building effective agents” (2024)','Workflows and agents'],
 ['Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (2025)','The five levels'],
 ['Simon Willison, “The lethal trifecta for AI agents” (2025)','The risk in Part 4'],
 ['Anthropic, “How we built our multi-agent research system” (2025)','Agent teams'],
 ['modelcontextprotocol.io','MCP']];
O('further','Further reading',{
 body:`<div>${table(['Read','For'],READ.map(([a,b])=>[a,b]))}</div>${small('Links: SOURCES.md in the repository.')}`,
 lines:['Where to go next.'],
 ask:['Which one would you read first?'],expected:['Building effective agents for anyone building one; the lethal trifecta for anyone deploying agents near private data.'],
 point:'Where to go next.'});
