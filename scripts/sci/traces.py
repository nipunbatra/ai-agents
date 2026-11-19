"""The real agent runs the slides show, condensed from the notebook's recordings in data/traces/.

    RECORD_DIR=data/traces ~/base/bin/python scripts/build_notebook.py --run     (records data/traces/*.json)
    python3 scripts/sci/traces.py                                                writes data/traces.json

Costs are recomputed here from the token counts and the paid prices on the Gemini pricing page on 19 Nov 2026
(gemini-3.8-flash: $0.75 in, $3.75 out per 1M tokens; gemini-3.5-flash-lite: $0.30 and $2.50; thinking counts as
output). The free tier costs nothing. Rupees at 93.5 per dollar (19 Nov 2026). The asserts guard what the slides
say about each run, so a re-recording that changes the story fails here, not on stage.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW, OUT = ROOT / 'data' / 'traces', ROOT / 'data' / 'traces.json'
PRICES = {'gemini-3.8-flash': (0.75, 3.75), 'gemini-3.5-flash-lite': (0.30, 2.50), 'gemini-3-flash-preview': (0.50, 3.00)}
INR = 93.5
NICE = {'gemini-3.8-flash': 'Gemini 3.8 Flash', 'gemini-3.5-flash-lite': 'Gemini 3.5 Flash-Lite'}


def load(name):
    p = RAW / f'{name}.json'
    return json.loads(p.read_text()) if p.exists() else None


def price(model):
    return next((v for k, v in PRICES.items() if str(model).startswith(k)), None)


def cost(usage, model):
    pin, pout = price(model)
    return usage['input'] / 1e6 * pin + usage['output'] / 1e6 * pout


def nice(model):
    return next((v for k, v in NICE.items() if str(model).startswith(k)), str(model))


def short(s, n):
    s = re.sub(r'\s+', ' ', str(s)).strip()
    return s if len(s) <= n else s[:n].rsplit(' ', 1)[0] + ' …'


def turns(run):
    """The run as turns: what the model thought, asked for and said, with its tokens, and the results it got back."""
    out = []
    for m in run['messages']:
        if m['role'] == 'model':
            out.append({'thought': short(m['thought'], 260), 'calls': [{'name': c['name'], 'args': c['args']} for c in m['calls']],
                        'text': m['text'], 'usage': m['usage'], 'seconds': m['seconds'], 'model': m['model'],
                        'cost_inr': round(cost(m['usage'], m['model']) * INR, 4), 'results': []})
        elif m['role'] == 'tool' and out:
            out[-1]['results'].append({'name': m['name'], 'result': m['result']})
    return out


def summary(run):
    t = turns(run)
    model = t[-1]['model']
    c = sum(cost(x['usage'], x['model']) for x in t)
    return {'goal': run['goal'], 'answer': run['answer'], 'status': run['status'], 'steps': run['steps'],
            'calls': run['calls'], 'seconds': run['seconds'], 'usage': run['usage'], 'model': nice(model),
            'cost_usd': round(c, 5), 'cost_inr': round(c * INR, 3), 'turns': t}


D = {}
alone, agent, check = load('p1-alone'), load('p1-agent'), load('p1-check')
D['date'] = agent['date']
y, mo, d = agent['date'].split('-')
D['date_text'] = f"{int(d)} {'January February March April May June July August September October November December'.split()[int(mo) - 1]} {y}"
D['model'] = nice(alone['model'])
D['price'] = {k: {'input': v[0], 'output': v[1]} for k, v in PRICES.items()}
D['inr_per_usd'] = INR

# 1. The model alone: it claims the order does not matter, which the forecast contradicts.
first = alone['reply'].split('###')[1].split('\n', 1)[1].strip().split('\n')[0]
D['alone'] = {'task': alone['task'], 'excerpt': re.sub(r'\*\*', '', first), 'words': len(alone['reply'].split()),
              'usage': alone['usage'], 'cost_inr': round(cost(alone['usage'], alone['model']) * INR, 3)}
assert 'does not affect' in D['alone']['excerpt'], D['alone']['excerpt']

# 2. The agent: three forecasts at once, six sums at once, the best order.
A = summary(agent)
fc, orders = check['forecast'], check['orders']
best, worst = orders[0], orders[-1]
assert [c['name'] for c in A['turns'][0]['calls']] == ['get_air_quality'] * 3
assert len(A['turns'][1]['calls']) == 6 and all(c['name'] == 'calculator' for c in A['turns'][1]['calls'])
assert all(A['answer'].find(a) < A['answer'].find(b) for a, b in zip(best['order'], best['order'][1:]))
assert str(best['total']) in A['answer']
A['calls_list'] = A['turns'][0]['calls']
day = lambda i, c: fc[c][i]
A['answer_short'] = (f"{best['order'][0]} first, then {best['order'][1]}, then {best['order'][2]}: "
                     f"{best['total']} µg/m³ over three days, against {worst['total']} for the worst order.")
D['agent'] = A
D['check'] = {'dates': check['dates'], 'forecast': fc, 'orders': orders, 'best': best, 'worst': worst,
              'extra_pct': round(100 * (worst['total'] / best['total'] - 1), 1)}

# 3. What the model read: the context, by kind, in tokens.
D['context'] = load('p2-context')
D['context_turns'] = [x['usage']['input'] for x in A['turns']]
assert D['context_turns'] == sorted(D['context_turns'])                    # the context grows every turn

mem = load('p2-memory')
if mem:
    D['memory'] = summary(mem)
    assert any(c['name'] == 'read_notes' for c in D['memory']['turns'][0]['calls'])
D['routing'] = load('p2-routing')

for key, name in [('analyst', 'p3-analyst'), ('research', 'p3-research'), ('inbox', 'p3-inbox'), ('steplimit', 'p4-steplimit')]:
    run = load(name)
    if run:
        D[key] = summary(run)
        if name == 'p3-inbox':
            D[key]['approvals'] = run['approvals']
            D[key]['sent'] = run['sent']
D['analyst_charts'] = sorted(p.name for p in RAW.glob('p3-analyst-chart-*.png'))
if 'steplimit' in D:
    assert D['steplimit']['status'].startswith('stopped')

farm = load('p3-farm')
if farm:
    D['farm'] = farm

ev = load('p4-evals')
ALIAS = {'gemini-flash-latest': 'gemini-3.8-flash'}      # what each alias ran on that day (from the eval rows when present)
if ev:
    for m, rows in ev['results'].items():
        if rows and rows[0].get('model') and price(rows[0]['model']):
            ALIAS[m] = rows[0]['model']
ALIAS.setdefault('gemini-flash-lite-latest', 'gemini-3.5-flash-lite')
inj, trials = load('p4-injection'), load('p4-injection-trials')
if inj:
    D['injection'] = {'email': inj['email'], 'no_gate': {k: inj['no_gate'][k] for k in ('answer', 'tried_to_forward', 'leaked')},
                      'gate': {k: inj['gate'][k] for k in ('answer', 'tried_to_forward', 'leaked')}}
    assert not inj['gate']['leaked']                                          # the gate always holds
if trials:
    D['injection_trials'] = {nice(ALIAS.get(m, m)): {'runs': len(r), 'tried': sum(x['tried_to_forward'] for x in r),
                             'warned': sum(x['warned'] for x in r), 'answers': [x['answer'] for x in r]} for m, r in trials.items()}

if ev:
    E = {}
    for m, rows in ev['results'].items():
        model = ALIAS.get(m, rows[0].get('model', m))
        costs = [cost({'input': r['input'], 'output': r['output']}, model) for r in rows]
        E[nice(model)] = {'runs': len(rows), 'right': sum(r['ok'] for r in rows), 'calls': [r['calls'] for r in rows],
                          'cost_inr_mean': round(sum(costs) / len(costs) * INR, 3), 'seconds_mean': round(sum(r['seconds'] for r in rows) / len(rows), 1),
                          'ok': [r['ok'] for r in rows]}
    D['evals'] = {'best': ev['best'], 'models': E}

OUT.write_text(json.dumps(D, indent=1, ensure_ascii=False) + '\n')
print(OUT, sorted(D))
