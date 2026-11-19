"""The fourteen applications of Part 3: their family, and where the talk places each one on the map of
"how easy is the result to check" (x, 0 hard to 1 easy) against "what does a mistake cost" (y, 0 little to 1 a lot).

    python3 scripts/sci/apps.py        writes data/apps.json

The positions are the speaker's judgement, offered for discussion, not measurements; the slide says so. The zone
of each point follows from its position (zone() below), so a moved point changes its advice consistently.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'apps.json'
FAMILIES = [('knowledge', 'Knowledge work'), ('ops', 'Operations'), ('science', 'Science and engineering'),
            ('india', 'India and sustainability')]
APPS = [  # id, family, short name, x (easy to check), y (cost of a mistake), why it sits there
    ('coding', 'knowledge', 'Coding', .86, .45, 'Tests run in seconds, and a person reviews the pull request.'),
    ('research', 'knowledge', 'Deep research', .30, .30, 'Citations must be opened and read to be checked.'),
    ('analyst', 'knowledge', 'Data analysis', .62, .40, 'The code can be rerun and the numbers recomputed.'),
    ('documents', 'knowledge', 'Invoices', .74, .66, 'Rules check the match, but money moves.'),
    ('support', 'ops', 'Customer support', .48, .56, 'Each reply is easy to read, but promises bind the company.'),
    ('incident', 'ops', 'IT incidents', .56, .82, 'Metrics show whether a fix worked; a wrong rollback is an outage.'),
    ('browser', 'ops', 'Web forms', .66, .70, 'The form can be read before it is submitted; a submission is final.'),
    ('coscientist', 'science', 'Hypotheses', .14, .20, 'Only a lab can check an idea, but an idea alone harms nobody.'),
    ('lab', 'science', 'Robot lab', .70, .50, 'Instruments measure every result; reagents and time cost money.'),
    ('evolve', 'science', 'Algorithm search', .94, .14, 'A program scores every candidate automatically.'),
    ('farmer', 'india', 'Farm advisory', .28, .76, 'Farmers act on it, and a crop lost cannot be undone.'),
    ('air', 'india', 'Air alerts', .44, .64, 'A false alarm or a missed one affects schools and hospitals.'),
    ('building', 'india', 'Building energy', .82, .28, 'Meters and a simulation check a schedule before it runs.'),
    ('clinic', 'india', 'Clinic notes', .52, .92, 'The doctor reads every note, and errors reach patients.'),
]
ZONES = {  # (easy to check, costly mistake): name, advice
    (True, False): ('Let it run', 'act, with spot checks'),
    (True, True): ('Agent acts, a person approves', 'approval before the irreversible step'),
    (False, False): ('Agent drafts, a person decides', 'the output is a draft'),
    (False, True): ('A person leads, the agent assists', 'every output is reviewed'),
}


def zone(x, y):
    return ZONES[(x >= .5, y >= .5)]


apps = [{'id': i, 'family': f, 'name': n, 'x': x, 'y': y, 'why': w, 'zone': zone(x, y)[0]} for i, f, n, x, y, w in APPS]
assert len({a['id'] for a in apps}) == len(apps) == 14
assert all(0 <= a['x'] <= 1 and 0 <= a['y'] <= 1 for a in apps)
assert {a['family'] for a in apps} == {f for f, _ in FAMILIES}
assert len({a['zone'] for a in apps}) == 4                       # every zone has at least one example
OUT.write_text(json.dumps({'families': [{'id': f, 'name': n} for f, n in FAMILIES], 'apps': apps,
                           'zones': [{'easy': k[0], 'costly': k[1], 'name': v[0], 'advice': v[1]} for k, v in ZONES.items()]},
                          indent=1) + '\n')
print(OUT, len(apps), 'apps', {z: sum(a['zone'] == z for a in apps) for z, _ in ZONES.values()})
