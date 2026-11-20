// Appendix (off the main route; shown with ?all, in the reading view and in the PDFs): a glossary, the tool from the
// talk as an MCP server, and further reading.
import {O,table,code,small,esc,kA,kT,kY,kR,kG} from '../kit.js';

const TERMS=[
 ['Agent','A model that uses tools in a loop until a goal is met.'],
 ['Tool','A function the agent may ask to run, such as a search.'],
 ['Tool call','The model’s written request to run a tool; your code runs it.'],
 ['The loop','Think, act, observe, until it answers or a limit stops it.'],
 ['Context','Everything the model reads on one turn.'],
 ['Token','About three quarters of a word; prices are per million.'],
 ['Autonomy level','How much the agent decides without a person.'],
 ['Guardrail','A limit your code enforces: permissions, approvals, budgets.'],
 ['Prompt injection','Text in data that poses as an instruction to the agent.'],
 ['Eval','Real cases with known answers, run before and after every change.'],
 ['MCP','A common way to offer tools to any agent.']];
O('glossary','Glossary: the loop',{
 body:`<div class="tight">${table(['Term','Meaning'],TERMS.slice(0,6).map(([t,d])=>[`<b>${t}</b>`,d]))}</div>`,
 ask:['Which of these words did you hear for the first time today?'],expected:['Usually context and token.'],
 point:'The vocabulary of the talk in one place.'});
O('glossary-2','Glossary: running it safely',{
 body:`<div class="tight">${table(['Term','Meaning'],TERMS.slice(6).map(([t,d])=>[`<b>${t}</b>`,d]))}</div>`,
 ask:['Which of these does your organisation already have a policy for?'],expected:['Usually none of them yet; guardrails and evals are where to start.'],
 point:'The words for Parts 4 and 5.'});

O('mcp-code','The air-quality tool as an MCP server',{
 body:`${code(`from mcp.server.fastmcp import FastMCP
mcp = FastMCP("air-quality")

@mcp.tool()
def get_air_quality(city: str, days: int = 3) -> dict:
    """Forecast of daily mean PM2.5 for a city, starting tomorrow."""
    ...   # the same body as in the notebook, Part 1.2
mcp.run()`)}${small(`With the official Python SDK (<span class="mono">pip install mcp</span>). Any agent that speaks MCP can now discover and call this tool: the function, its name and its docstring become the menu entry, exactly as with the notebook’s <span class="mono">@tool</span>.`)}`,
 ask:['What changes for the agent when the tool moves behind MCP?'],expected:['Nothing about how it calls the tool; what changes is that every MCP-capable agent can use it without new code.'],
 point:'Writing an MCP server is as small as writing the tool itself.',source:'Model Context Protocol Python SDK, github.com/modelcontextprotocol/python-sdk.'});

const READ=[
 ['Anthropic, “Building effective agents” (2024)','Part 2’s patterns'],
 ['Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (2025)','The five levels of autonomy'],
 ['METR, “Measuring AI Ability to Complete Long Tasks” (2025)','The opening chart'],
 ['Simon Willison, “The lethal trifecta for AI agents” (2025)','Part 4’s risk'],
 ['Anthropic, “How we built our multi-agent research system” (2025)','Agent teams and their cost'],
 ['This talk’s notebook','Every run, in plain Python']];
O('further','Further reading',{
 body:`<div class="tight">${table(['Read','For'],READ.map(([a,b])=>[a,b]))}</div>${small('Links: SOURCES.md in the repository.')}`,
 ask:['Which one would you read first?'],expected:['Building effective agents for builders; the lethal trifecta for anyone deploying agents near data.'],
 point:'Where to go next.'});
