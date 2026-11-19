"""Part 2 (Inside the engine): every number and quoted text its slides show that is not read straight from
data/traces.json, and the few values derived from the real runs.

    python3 scripts/sci/p2.py        writes data/p2.json

Inputs: data/traces.json (the runs recorded with the notebook on 19 Nov 2026, scripts/sci/traces.py) and
notebook/agents.py (the real tool and the agent loop). Published numbers come from plan/research/verified.md; each
constant names its row. The asserts guard what the slides say, so a re-recording that changes the story fails here.
"""
import ast
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'p2.json'
NOTEBOOK = (ROOT / 'notebook' / 'agents.py').read_text()
T = json.loads((ROOT / 'data' / 'traces.json').read_text())

MON = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()


def day(iso):
    y, m, d = iso.split('-')
    return f'{int(d)} {MON[int(m) - 1]} {y}'


def plain(s):
    """Model text without Markdown, on one line."""
    return re.sub(r'\s+', ' ', re.sub(r'\*\*|\*|`', '', s)).strip()


D = {}

# ---------------------------------------------------------------------------------------- 2.1 the tool menu
# The menu entry the model reads for the forecast tool. Copied from notebook/agents.py (get_air_quality, Part 1.2):
# the first paragraph of its docstring is the description, the "name: text" lines describe the parameters, and the
# type hints give the types. The notebook's @tool decorator turns exactly these into the schema below.
TOOL_DOC = '''Forecast of fine-dust pollution (PM2.5, in micrograms per cubic metre) for a city: one daily mean per day, starting tomorrow.

city: the city's name, for example "Pune"
days: how many days ahead, from 1 to 4'''
TOOL_ARGS = [('city', 'string', True), ('days', 'integer', False)]   # (name, JSON type, required): city: str, days: int = 3


def schema(name, doc, args):
    desc, _, rest = doc.partition('\n\n')
    arg_doc = dict(re.findall(r'^\s*(\w+):\s*(.+)$', rest, flags=re.M))
    return {'name': name, 'description': ' '.join(desc.split()),
            'parameters': {'type': 'object',
                           'properties': {a: {'type': t, 'description': arg_doc.get(a, '')} for a, t, _ in args},
                           'required': [a for a, _, req in args if req]}}


# Guard: the copy above must match the notebook's function, docstring and signature.
fn = next(n for n in ast.walk(ast.parse(NOTEBOOK)) if isinstance(n, ast.FunctionDef) and n.name == 'get_air_quality')
assert ast.get_docstring(fn) == TOOL_DOC, 'get_air_quality docstring changed in notebook/agents.py'
assert [a.arg for a in fn.args.args] == [a for a, _, _ in TOOL_ARGS]
assert len(fn.args.defaults) == 1                                   # days has a default, so only city is required
D['tool'] = schema('get_air_quality', TOOL_DOC, TOOL_ARGS)
# The bad example on the slide: a tool whose menu entry says almost nothing (made up for the slide).
D['vague'] = {'name': 'get_data', 'description': 'Gets data.',
              'parameters': {'type': 'object', 'properties': {'x': {'type': 'string'}}, 'required': ['x']}}

# ---------------------------------------------------------------------------------------- 2.1 one real run, turn by turn
A = T['agent']
turns = []
spent, secs = 0.0, 0.0
for t in A['turns']:
    spent += t['cost_inr']
    secs += t['seconds']
    title = re.search(r'\*\*(.+?)\*\*', t['thought'])
    turns.append({'read': t['usage']['input'], 'wrote': t['usage']['output'], 'thinking': t['usage']['thinking'],
                  'seconds': t['seconds'], 'cost_inr': t['cost_inr'], 'spent_inr': round(spent, 3),
                  'elapsed': round(secs, 1), 'thought': title.group(1) if title else '',
                  'calls': [c['args'] for c in t['calls']], 'results': [r['result'] for r in t['results']]})
assert [t['read'] for t in turns] == T['context_turns']
assert abs(turns[-1]['spent_inr'] - A['cost_inr']) < 0.002 and abs(turns[-1]['elapsed'] - A['seconds']) < 0.15
assert len(turns[0]['calls']) == 3 and len(turns[1]['calls']) == 6 and not turns[2]['calls']
D['walk'] = {'turns': turns, 'request': A['goal'], 'answer': A['answer_short'],
             'forecast': {r['city']: list(r['pm25_daily_mean'].values()) for r in turns[0]['results']},
             'sums': [c['expression'] for c in turns[1]['calls']], 'totals': turns[1]['results'],
             'max_read': max(t['read'] for t in turns)}
assert min(D['walk']['totals']) == T['check']['best']['total']

# ---------------------------------------------------------------------------------------- 2.1 the context
# What the model read in its last turn: the four parts the notebook counted separately (count_tokens, Part 2.1), and
# the rest of turn 3's input, which is the model's own earlier turns (its requests, carried back with their thought
# signatures) plus the formatting around each message. The parts were counted one by one, so they are approximate.
C = T['context']
rest = T['context_turns'][-1] - sum(C.values())
assert rest > 0
D['context'] = {'parts': [{'key': k, 'tokens': v} for k, v in C.items()] + [{'key': 'earlier turns', 'tokens': rest}],
                'turns': T['context_turns'], 'total': T['context_turns'][-1],
                'growth': round(T['context_turns'][-1] / T['context_turns'][0], 1)}
# Karpathy's phrase "context engineering", X post of 25 Jun 2025: SECONDARY (verified.md row 21, quoted by Simon
# Willison). The slide does not quote it; the speaker notes attribute it.
D['context']['karpathy'] = {'date': day('2025-06-25'),
                            'quote': 'the delicate art and science of filling the context window with just the right information for the next step'}

# ---------------------------------------------------------------------------------------- 2.2 memory
# The earlier run (notebook Part 2.2) was not recorded; its request is copied from the notebook, and the note it saved
# is what the later run read back (traces.memory).
MEM_REQUEST = 'Remember this: I have asthma, so for travel advice I care about air quality more than weather.'
assert MEM_REQUEST in NOTEBOOK
M = T['memory']
first = M['turns'][0]
note = next(r['result'] for r in first['results'] if r['name'] == 'read_notes')
assert [c['name'] for c in first['calls']][0] == 'read_notes' and 'asthma' in note
D['memory'] = {'saved_by': MEM_REQUEST, 'note': note.strip().lstrip('- ').strip(), 'goal': M['goal'],
               'calls': [{'name': c['name'], 'args': c['args']} for c in first['calls']],
               'forecast': {r['result']['city']: list(r['result']['pm25_daily_mean'].values())[0]
                            for r in first['results'] if r['name'] == 'get_air_quality'},
               'answer': plain(M['answer']).split(' - ')[0].strip().rstrip(':') + '.', 'steps': M['steps'], 'calls_n': M['calls']}
assert 'Pune' in D['memory']['answer'] and 'asthma' in D['memory']['answer']

# ---------------------------------------------------------------------------------------- 2.3 patterns
# Anthropic, "Building effective agents", 19 Dec 2024 (verified.md row 19f): the five workflow patterns.
D['patterns'] = {'source_date': day('2024-12-19'), 'names': ['Prompt chaining', 'Routing', 'Parallelisation',
                                                              'Orchestrator and workers', 'Evaluator and optimizer']}
D['routing'] = T['routing']
assert len(D['routing']) == 4 and any(re.search(r'[ऀ-ॿ]', r['message']) for r in D['routing'])
# Anthropic, "How we built our multi-agent research system", 13 Jun 2025 (verified.md row 17, VERIFIED):
# a lead agent with subagents beat a single agent by 90.2% on their internal research eval; agents use about 4x the
# tokens of a chat, multi-agent systems about 15x.
D['multi'] = {'date': day('2025-06-13'), 'gain_pct': 90.2, 'agent_x': 4, 'multi_x': 15}
F = T['farm']
draft = F['rounds'][-1]['draft']
D['farm'] = {'checklist': F['checklist'], 'rounds': [{'pass': r['verdict']['pass'], 'problems': len(r['verdict']['problems'])}
                                                     for r in F['rounds']],
             'snippet': draft.split(' અને ')[0], 'words': len(draft.split()), 'place': F['forecast']['place'],
             'max_rounds': 3,                                       # notebook Part 3.4: at most three rounds
             # the checklist as the slide shows it, shortened (the full wording is in the speaker notes)
             'short': ['in Gujarati', 'under 80 words', 'a forecast number', 'one clear action', 'nothing unsupported']}
assert '80 words' in F['checklist'][1] and len(D['farm']['short']) == len(F['checklist'])
assert F['rounds'][-1]['verdict']['pass'] and len(D['farm']['checklist']) == 5
assert 'for i in range(3):' in NOTEBOOK

# ---------------------------------------------------------------------------------------- 2.4 MCP
# Announced by Anthropic on 25 Nov 2024 (verified.md row 19e); donated to the Linux Foundation's Agentic AI Foundation
# on 9 Dec 2025, which Anthropic, Block and OpenAI co-founded (row 19l). Server counts are not verified: not shown.
MODELS = ['Gemini', 'Claude', 'GPT', 'Llama', 'Qwen', 'Mistral']   # model families, for the wiring picture only
TOOLS = [['sensor', 'forecast'], ['database', 'database'], ['mail', 'email'], ['calendar', 'calendar'],
         ['file', 'files'], ['search', 'web search'], ['terminal', 'code runner'], ['chart', 'dashboard']]
N_MODELS, N_TOOLS = 4, 5                                            # the picture on the slide
D['mcp'] = {'announced': day('2024-11-25'), 'donated': day('2025-12-09'), 'founders': ['Anthropic', 'Block', 'OpenAI'],
            'models': MODELS, 'tools': TOOLS, 'n_models': N_MODELS, 'n_tools': N_TOOLS,
            'custom': N_MODELS * N_TOOLS, 'via': N_MODELS + N_TOOLS}

# ---------------------------------------------------------------------------------------- the loop, as code
# notebook/agents.py, Part 1.3: run_agent. The slide shows it simplified; this checks the lines it keeps exist.
for s in ['def run_agent(goal, tools', 'for step in range(1, max_steps + 1):', 'reply = chat(messages, tools',
          'messages.append(reply)', 'if not reply["calls"]:', 'for c in reply["calls"]:', 'result = fn(**c["args"])',
          'result = {"error"', 'stopped after {max_steps} steps']:
    assert s in NOTEBOOK, s
D['loop'] = {'max_steps': int(re.search(r'def run_agent\([^)]*max_steps=(\d+)', NOTEBOOK).group(1))}

OUT.write_text(json.dumps(D, indent=1, ensure_ascii=False) + '\n')
print(OUT, sorted(D))
