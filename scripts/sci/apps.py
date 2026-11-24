"""The jobs on the stakes map at the end of Part 3, and where the talk places each one: "how easy is the result to
check" (x, 0 hard to 1 easy) against "what does a mistake cost" (y, 0 little to 1 a lot).

    python3 scripts/sci/apps.py        writes data/apps.json

Three groups: our own agent's three jobs (Part 1 and the first half of Part 3), the four real jobs Part 3 shows on
the main route, and the rest (the appendix's jobs, and two placements with no slide of their own, kept so that every
corner of the map has an example). The positions are the speaker's judgement, offered for discussion, not
measurements; the slide says so. Nothing here is a claim about a run. The zone of each point follows from its position
(zone() below), so a moved point changes its advice consistently.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'apps.json'
GROUPS = [('ours', 'Our agent'), ('main', 'Real jobs'), ('more', 'More jobs')]
APPS = [  # id, group, short name, x (easy to check), y (cost of a mistake), why it sits there
    ('fix', 'ours', 'Fix a test', .88, .20, 'The tests pass or fail in seconds, and one changed line is easy to undo.'),
    ('tidy', 'ours', 'Tidy a folder', .70, .34, 'A listing shows where every file went, and a move can be undone.'),
    ('invoices', 'ours', 'Check invoices', .80, .72, 'Rules can check the match, but money moves, so a person approves the payment.'),
    ('coding', 'main', 'Coding agents', .84, .58, 'Tests check each change in seconds, but a merge reaches real users.'),
    ('support', 'main', 'Customer support', .54, .66, 'Nobody reads a reply before it is sent, and a wrong promise costs money.'),
    ('evolve', 'main', 'AlphaEvolve', .95, .08, 'A program scores every attempt, and a poor attempt is thrown away.'),
    ('clinic', 'main', 'Clinic notes', .52, .94, 'The doctor reads every note, and an error can reach a patient.'),
    ('incident', 'more', 'IT incidents', .64, .84, 'Metrics show whether a fix worked; a wrong rollback is an outage.'),
    ('browser', 'more', 'Web forms', .70, .75, 'The form can be read before it is submitted; a submission is final.'),
    ('lab', 'more', 'Robot lab', .70, .56, 'Instruments measure every result; reagents and time cost money.'),
    ('coscientist', 'more', 'Hypotheses', .14, .20, 'Only a lab can check an idea, but an idea alone harms nobody.'),
    ('research', 'more', 'Deep research', .30, .32, 'Every citation must be opened and read to be checked.'),
    ('farmer', 'more', 'Farm advisory', .28, .76, 'Farmers act on it, and a lost crop cannot be undone.'),
]
ZONES = {  # (easy to check, costly mistake): name, advice
    (True, False): ('Let it run', 'act, with spot checks'),
    (True, True): ('Agent acts, a person approves', 'approval before the irreversible step'),
    (False, False): ('Agent drafts, a person decides', 'the output is a draft'),
    (False, True): ('A person leads, the agent assists', 'every output is reviewed'),
}


def zone(x, y):
    return ZONES[(x >= .5, y >= .5)]


apps = [{'id': i, 'group': g, 'name': n, 'x': x, 'y': y, 'why': w, 'zone': zone(x, y)[0]} for i, g, n, x, y, w in APPS]
by = {a['id']: a for a in apps}
assert len(by) == len(apps)
assert all(0 <= a['x'] <= 1 and 0 <= a['y'] <= 1 for a in apps)
assert all(len(a['name']) + len(a['why']) <= 95 for a in apps)   # the line under the map is one line
assert {a['group'] for a in apps} == {g for g, _ in GROUPS}
assert len({a['zone'] for a in apps}) == 4                       # every zone has at least one example
# What the slides say about our own three jobs, and about the four real jobs they show.
assert [a['id'] for a in apps if a['group'] == 'ours'] == ['fix', 'tidy', 'invoices']
assert by['fix']['zone'] == by['tidy']['zone'] == 'Let it run'
assert by['invoices']['zone'] == by['coding']['zone'] == by['clinic']['zone'] == 'Agent acts, a person approves'
assert by['evolve']['zone'] == 'Let it run'
assert by['coding']['y'] > by['fix']['y']        # the same job costs more on a company's real code
assert [a['id'] for a in apps if a['group'] == 'main'] == ['coding', 'support', 'evolve', 'clinic']
OUT.write_text(json.dumps({'groups': [{'id': g, 'name': n} for g, n in GROUPS], 'apps': apps,
                           'zones': [{'easy': k[0], 'costly': k[1], 'name': v[0], 'advice': v[1]} for k, v in ZONES.items()]},
                          indent=1) + '\n')
print(OUT, len(apps), 'jobs', {z: sum(a['zone'] == z for a in apps) for z, _ in ZONES.values()})
