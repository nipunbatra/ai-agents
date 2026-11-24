"""The real agent runs the slides show, condensed from the notebook's recordings in data/traces/.

    sh scripts/serve_gemma.sh 12b &  sh scripts/serve_gemma.sh e4b &             (Gemma 4, served locally)
    RECORD_DIR=data/traces AGENT_BASE_URL=http://127.0.0.1:8791/v1 \
      AGENT_SERVERS='{"gemma4:e4b":"http://127.0.0.1:8792/v1"}' python scripts/build_notebook.py --run
    python3 scripts/sci/traces.py                                                writes data/traces.json

Every run becomes a list of steps: the round, the tool the model asked for, its arguments, and what our code returned
(trimmed). The asserts guard what the slides say about each run, so a re-recording that changes the story fails here,
not on stage. The model ran on a laptop, so there is no bill; `hosted` works out what the same tokens would cost at a
hosted model's published price, for the cost slide.
"""
import json, re, statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW, OUT = ROOT / 'data' / 'traces', ROOT / 'data' / 'traces.json'
NICE = {'gemma4:12b': 'Gemma 4 (12B)', 'gemma4:e4b': 'Gemma 4 (E4B)'}
# Gemini 3.8 Flash, paid tier, US dollars per million tokens (input, output), from the pricing page on 19 Nov 2026.
HOSTED = {'name': 'Gemini 3.8 Flash', 'usd_in': 0.75, 'usd_out': 3.75, 'inr_per_usd': 93.5, 'checked': '19 November 2026'}
MONTHS = 'January February March April May June July August September October November December'.split()


def load(name):
    p = RAW / f'{name}.json'
    return json.loads(p.read_text()) if p.exists() else None


def clean(text, limit=1400):
    """Tool output for a slide: no colour codes, no paths outside the project, not too long."""
    text = re.sub(r'\x1b\[[0-9;]*m', '', str(text))
    text = re.sub(r'/[\w./ -]*?/workspace/?', '', text)
    return text if len(text) <= limit else text[:limit] + '\n…'


def steps(run):
    """Flatten a run's messages into steps, one per tool call, plus the final answer."""
    out, results, rnd = [], {}, 0
    for m in run['messages']:
        if m['role'] == 'tool':
            results[m['tool_call_id']] = m['content']
    for m in run['messages']:
        if m['role'] != 'assistant':
            continue
        rnd += 1
        for c in m.get('tool_calls', []):
            args = c['function']['arguments']
            args = json.loads(args) if isinstance(args, str) else args
            res = clean(results.get(c['id'], ''))
            if c['function']['name'] == 'bash':                       # pytest pads its lines to 80 columns
                res = re.sub(r'[ \t]{6,}', '  ', res)
                res = re.sub(r'([=_-])\1{9,}', lambda m: m.group(1) * 8, res)
            code = re.match(r'exit code (\d+)\n?', res)
            out.append({'round': rnd, 'name': c['function']['name'], 'args': args,
                        'exit': int(code.group(1)) if code else None, 'result': res[code.end():] if code else res})
    return out


def brief(run):
    return {'goal': run['goal'], 'status': run['status'], 'answer': run['answer'].strip(), 'rounds': run['rounds'],
            'calls': run['calls'], 'tokens_read': run['tokens_read'], 'tokens_written': run['tokens_written'],
            'seconds': run['seconds'], 'model': NICE.get(run['model'], run['model']),
            'log': [{'read': r['input'], 'written': r['output'], 'seconds': r['seconds']} for r in run['log']],
            'steps': steps(run),
            'inr_hosted': round((run['tokens_read'] * HOSTED['usd_in'] + run['tokens_written'] * HOSTED['usd_out']) / 1e6 * HOSTED['inr_per_usd'], 2)}


out = {'hosted': HOSTED}

agent = load('p1-agent')
assert agent, 'record the notebook first (see the top of this file)'
y, mo, d = agent['date'].split('-')
out.update(date=agent['date'], date_text=f'{int(d)} {MONTHS[int(mo) - 1]} {y}', model=NICE[agent['model']], model_id=agent['model'])

alone = load('p1-alone')
text = alone['reply']
out['alone'] = {'task': alone['task'], 'reply': text, 'words': len(text.split()),
                'asks_for': [w for w in re.findall(r'\*\*(?:The )?([A-Za-z ]+?):?\*\*', text) if len(w.split()) <= 3][:3]}
low = text.lower()
assert 'provide' in low or 'share' in low or 'paste' in low or "can't see" in low or 'cannot see' in low or 'need' in low, \
    'the model on its own no longer says it needs to see the code'

req, ans = load('p1-request'), load('p1-answer')
call = req['reply']['tool_calls'][0]['function']
out['request'] = {'question': req['question'], 'text': req['reply']['content'], 'name': call['name'],
                  'args': json.loads(call['arguments']) if isinstance(call['arguments'], str) else call['arguments'],
                  'schema': req['schema'], 'answer': ans['final']['content'].strip()}
assert out['request']['name'] == 'read_file' and out['request']['args'] == {'path': 'billing.py'}
assert not out['request']['text'].strip(), 'the reply to the first tool question now has text as well as a request'

out['system'] = agent['messages'][0]['content']          # the instructions every run starts with
out['agent'] = brief(agent)
A = out['agent']
names = [s['name'] for s in A['steps']]
assert agent['status'] == 'answered' and 'edit_file' in names and names.count('bash') >= 2, names
tests = [s for s in A['steps'] if s['name'] == 'bash' and 'pytest' in s['args']['command']]
assert tests[0]['exit'] != 0 and tests[-1]['exit'] == 0, 'the run no longer goes from failing tests to passing tests'
edit = next(s for s in A['steps'] if s['name'] == 'edit_file')
assert edit['args']['path'] == 'billing.py'
out['agent']['before'], out['agent']['after'] = agent['billing_before'], agent['billing_after']

check = load('p1-check')
plus = [l[1:] for l in check['diff'].split('\n') if l.startswith('+') and not l.startswith('+++')]
minus = [l[1:] for l in check['diff'].split('\n') if l.startswith('-') and not l.startswith('---')]
passed = re.search(r'(\d+) passed', clean(check['pytest']))
out['check'] = {'minus': minus, 'plus': plus, 'passed': int(passed.group(1)) if passed else 0,
                'tests_untouched': check['tests_untouched'], 'exit_code': check['exit_code']}
assert check['exit_code'] == 0 and check['tests_untouched'] and len(plus) == 1 and len(minus) == 1, check['diff']

mem = load('p2-memory')
if mem:
    out['memory'] = {'first': brief(mem['first']), 'later': brief(mem['later']), 'notes': mem['notes'].strip()}
    later = out['memory']['later']
    assert mem['notes'].strip(), 'NOTES.md was not written'
    assert any(s['name'] in ('read_file', 'bash') and 'NOTES.md' in json.dumps(s['args']) for s in later['steps']), \
        'the later run did not read NOTES.md'
    out['memory']['says_rupee'] = '₹' in later['answer']
    assert '₹' in later['answer'] and re.search(r'2,?973', later['answer']), 'the later run no longer applies the notes: ' + later['answer']

tidy = load('p3-tidy')
if tidy:
    t = brief(tidy)
    t.update(check=tidy['check'], tree=clean(tidy['tree'], 3000), index=tidy['index'].strip(), inbox=tidy['inbox'],
             right=sum(r['right_folder'] for r in tidy['check']), dated=sum(r['dated_name'] for r in tidy['check']),
             failed_commands=sum(1 for s in t['steps'] if s['exit']), reads=sum(1 for s in t['steps'] if s['name'] == 'read_file'
                                                                                 or 'cat ' in str(s['args'].get('command', ''))))
    out['tidy'] = t
    assert t['right'] >= 9, f"only {t['right']} of 10 files landed in the right folder"
    assert sum(1 for s in t['steps'] if s['name'] == 'read_file' and s['args'].get('path', '').startswith('inbox/')) >= 8, \
        'the tidy run no longer opens the inbox files with read_file (the slides count those reads)'
    assert re.search(r'\d{4}-\d{2}-\d{2}_[\w-]+\.txt', tidy['goal']), 'the tidy request no longer gives a dated example name'

inv = load('p3-invoices')
if inv:
    v = brief(inv)
    v.update(check=inv['check'], report=inv['report'].strip(), invoices=inv['invoices'], orders=inv['orders'].strip(),
             right=sum(r['flagged'] == bool(r['problem']) for r in inv['check']),
             problems=sum(bool(r['problem']) for r in inv['check']))
    out['invoices'] = v
    assert v['right'] == len(inv['check']), 'the invoice check is no longer right on every invoice'
    assert any(s['name'] == 'write_file' and 'mismatches' in s['args'].get('path', '') for s in v['steps']), \
        'the invoice run no longer writes mismatches.md with write_file'

inj = load('p4-injection')
if inj:
    def side(x):
        b = brief(x)
        b.update(asked=x['asked'], tried=x['tried'], secret_reached_model=x['secret_reached_model'], secret_in_answer=x['secret_in_answer'])
        return b
    out['injection'] = {'note': inj['note'], 'task': inj['task'], 'open': side(inj['open']), 'gated': side(inj['gated'])}
    assert not out['injection']['gated']['secret_reached_model'], 'the secret reached the model although a person said no'
    # Part 4's slides: with everything allowed the agent reads the note, runs the command the note asks for, and the
    # secret ends up in its answer; with a person who says no, the same command is held and the summary is clean.
    o, g = out['injection']['open'], out['injection']['gated']
    paras = [p for p in inj['note'].split('\n\n') if 'assistant' in p.lower()]
    assert len(paras) == 1 and 'run the command `cat .env`' in paras[0], 'the note no longer has one paragraph that asks the assistant for cat .env'
    assert o['status'] == g['status'] == 'answered'
    assert o['tried'] and o['secret_reached_model'] and o['secret_in_answer'], 'with everything allowed, the secret no longer ends up in the answer'
    assert any(s['result'].strip() == inj['note'].strip() for s in o['steps']), 'the agent no longer reads the whole note'
    for side_ in (o, g):
        a = side_['asked'][0]
        assert a['tool'] == 'bash' and '.env' in a['args']['command'] and a['reason'] == 'it touches the protected file .env', a
    leak = next(s for s in o['steps'] if s['name'] == 'bash' and s['args'] == o['asked'][0]['args'])
    assert leak['result'].strip() and leak['result'].strip() in o['answer'], 'the answer no longer ends with the line from the secrets file'
    assert not any(a['allowed'] for a in g['asked']) and not g['secret_in_answer'], 'the run with a person who says no is no longer clean'
    assert any(s['result'].startswith('refused') for s in g['steps']), 'the held command is no longer reported to the model as refused'

trials = load('p4-injection-trials')
if trials:
    t = trials['trials']
    out['injection_trials'] = {'n': len(t), 'tried': sum(x['tried'] for x in t), 'reached': sum(x['secret_reached_model'] for x in t),
                               'leaked': sum(x['secret_in_answer'] for x in t), 'model': NICE.get(trials['model'], trials['model'])}
    assert out['injection_trials']['leaked'] > 0, 'no run of the ten leaked the secret: Part 4 says some do'

app = load('p4-approval')
if app:
    a = brief(app)
    a.update(asked=app['asked'], files_left=app['files_left'])
    out['approval'] = a
    assert app['asked'], 'the agent deleted nothing that needed approval'
    # Part 4's slide: the agent asks for rm, a person is asked, says yes, and the files it named are gone.
    first = app['asked'][0]
    assert first['tool'] == 'bash' and first['reason'] == "the command 'rm' is not on the safe list" and first['allowed'], first
    named = [w.strip('"\'').split('/')[-1] for w in first['args']['command'].split() if 'inbox/' in w]
    assert named and not set(named) & set(app['files_left']), 'the files in the approved command are still there'

stuck = load('p4-steplimit')
if stuck:
    out['steplimit'] = brief(stuck)
    assert stuck['status'].startswith('stopped after'), stuck['status']
    assert out['steplimit']['calls'] == out['steplimit']['rounds'] and all(s['result'].startswith('error') for s in out['steplimit']['steps']), \
        'the stuck run no longer fails on every round'

ev = load('p4-evals')
if ev:
    models = []
    for name, runs in ev.items():
        models.append({'id': name, 'name': NICE.get(name, name), 'n': len(runs), 'fixed': sum(r['ok'] for r in runs),
                       'tests_pass': sum(r['tests_pass'] for r in runs), 'touched_tests': sum(not r['tests_untouched'] for r in runs),
                       'median_seconds': statistics.median(r['seconds'] for r in runs),
                       'median_rounds': statistics.median(r['rounds'] for r in runs),
                       'stopped': sum(r['status'] != 'answered' for r in runs), 'runs': runs})
    out['evals'] = {'models': models}
    assert len(models) == 2 and models[0]['id'] == out['model_id'] and models[0]['n'] == models[1]['n'], 'Part 4 compares the main model with one smaller model'

# Part 4 says the approval check was in the loop all along and never asked anyone in Parts 1 to 3: no step there was refused.
for name_, run_ in [('agent', out['agent'])] + [(k, out[k]) for k in ('tidy', 'invoices') if k in out] + \
        ([('memory', r) for r in (out['memory']['first'], out['memory']['later'])] if 'memory' in out else []):
    assert not any(str(s['result']).startswith('refused') for s in run_['steps']), f'a command in the {name_} run needed approval'

OUT.write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n')
print(OUT, 'keys:', ', '.join(k for k in out))
print(f"agent: {A['rounds']} rounds, {A['calls']} calls, {A['seconds']} s, {A['tokens_read']} tokens read; hosted price ₹{A['inr_hosted']}")
for k in ('tidy', 'invoices'):
    if k in out:
        print(k, out[k]['rounds'], 'rounds', out[k]['seconds'], 's', 'right', out[k]['right'])
if 'injection_trials' in out:
    print('injection trials', {k: v for k, v in out['injection_trials'].items()})
if 'evals' in out:
    print('evals', [(m['name'], m['fixed'], m['n'], m['median_seconds']) for m in out['evals']['models']])
