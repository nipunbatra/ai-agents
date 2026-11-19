"""Part 3a (agents at work, first half): the numbers its slides show that are not already in a shared data file.

    python3 scripts/sci/p3a.py        writes data/p3a.json and figures/p3a-analyst-chart.png

Three kinds of number live here:
- from our own runs (data/traces.json, recorded from notebook/agents.ipynb on 19 Nov 2026): parsed below, with
  asserts that the slide's reading of each run matches what the model actually wrote;
- published numbers, copied from plan/research/verified.md (row numbers in the comments), with that file's wording;
- the few parameters of the illustrative traces (designs, not deployed systems), kept here so the part file types
  no number at all.
"""
import json
import re
import shutil
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'p3a.json'
T = json.loads((ROOT / 'data' / 'traces.json').read_text())

# ---------------------------------------------------------------------------------------- the research run (3.2)
R = T['research']
claims = [ln for ln in R['answer'].splitlines() if ln.lstrip().startswith('*') and 'http' in ln]
urls = [u for ln in claims for u in re.findall(r'https?://[^\s)]+', ln)]
assert len(claims) == len(urls) >= 2, 'each claim should carry exactly one link'
research = {'calls': R['calls'], 'steps': R['steps'], 'claims': len(claims), 'links': len(urls),
            'distinct_links': len(set(urls)), 'seconds': R['seconds'], 'cost_inr': R['cost_inr'],
            'tools': [c['name'] for t in R['turns'] for c in t['calls']], 'goal': R['goal']}
assert research['distinct_links'] == 1          # the slide says every claim pointed to the same page
assert 'wikipedia' in urls[0]

# ---------------------------------------------------------------------------------------- the analyst run (3.1)
A = T['analyst']
turns = A['turns']
first = turns[1]['results'][0]['result']        # the table of averages and days over the standard
rows = re.findall(r'^(\w+)\s+([\d.]+)\s+(\d+)\s+(\d+)\s*$', first, re.M)
cities = [{'city': c, 'mean': float(m), 'days_over': int(d), 'days': int(n)} for c, m, d, n in rows]
assert len(cities) == len(turns[0]['results'][0]['result']['cities']) == 10
std = int(re.search(r'Standard \((\d+) µg/m³\)', A['answer']).group(1))
assert all(f"> {std}" in c['args']['code'] or f">= {std}" in c['args']['code'] or f"== {std}" in c['args']['code']
           for c in [t['calls'][0] for t in turns[1:6]])
worst = max(cities, key=lambda c: c['mean'])
most = max(cities, key=lambda c: c['days_over'])
fewest = min(c['days_over'] for c in cities)
assert worst['city'] == most['city'] == 'Kolkata'
assert f"**{worst['city']}** had the worst air quality on average" in A['answer'] and str(worst['mean']) in A['answer']
assert f"**{worst['days_over']}**" in A['answer']
at_std = int(turns[3]['results'][0]['result'])  # winter days (all cities) at exactly the standard
failed = sum('no variable called answer' in str(r['result']) for t in turns for r in t.get('results', []))
both = turns[4]['results'][0]['result']          # the counts with > and with >=: they differ for two cities
changed = [ln.split()[0] for ln in both.splitlines()[2:] if len(ln.split()) == 3 and ln.split()[1] != ln.split()[2]]
assert changed == ['Ahmedabad', 'Mumbai'], changed
code_calls = sum(c['name'] == 'run_pandas' for t in turns for c in t['calls'])
chart_src = ROOT / 'data' / 'traces' / T['analyst_charts'][0]   # kept for the notes; the slide redraws it as SVG
chart_out = ROOT / 'figures' / 'p3a-analyst-chart.png'
shutil.copyfile(chart_src, chart_out)
w, h = struct.unpack('>II', chart_src.read_bytes()[16:24])
analyst = {'calls': A['calls'], 'steps': A['steps'], 'seconds': A['seconds'], 'cost_inr': A['cost_inr'],
           'code_calls': code_calls, 'failed_runs': failed, 'standard': std, 'at_standard': at_std,
           'changed_by_definition': changed, 'cities': cities, 'n_cities': len(cities),
           'winter_days': worst['days'], 'worst': worst['city'], 'worst_mean': worst['mean'],
           'worst_days': worst['days_over'], 'fewest_days': fewest,
           'fewest_cities': [c['city'] for c in cities if c['days_over'] == fewest],
           'period': re.search(r'\((\w+ \d{4} to \w+ \d{4})\)', A['goal']).group(1),
           # the request as the slide shows it, shortened (the source line says so)
           'req_short': 'Which city had the worst air last winter? Chart each city’s days over the limit.',
           'chart': {'file': chart_out.name, 'w': w, 'h': h}}
assert 'worst air' in A['goal'] and 'exceed the 24-hour standard' in A['goal'] and 'bar chart' in A['goal']

# ---------------------------------------------------------------------------------------- the demo inbox (3.3)
I = T['inbox']
mails = {r['result']['id']: r['result'] for r in I['turns'][1]['results']}
inv = re.search(r'invoice (\S+) for ₹([\d,]+) for (\w+) deliveries, due on (.+)\.', mails['e2']['body'])
ref = re.search(r'(.+?) \(order (\d+), ₹([\d,]+)\)', mails['e3']['body'])
sender = re.search(r'(\w+) sent invoice', I['answer']).group(1)
inbox = {'invoice': {'id': inv.group(1), 'amount': int(inv.group(2).replace(',', '')), 'month': inv.group(3),
                     'due': inv.group(4), 'from': sender},
         'refund': {'order': ref.group(2), 'amount': int(ref.group(3).replace(',', '')),
                    'item': re.search(r'damaged (.+)$', ref.group(1)).group(1)},
         'approvals': len(I['approvals']), 'gated_tool': I['approvals'][0]['call']}
assert inbox['refund'] == {'order': '5512', 'amount': 3200, 'item': 'mixer grinder'}   # the same order as Part 1

# ---------------------------------------------------------------------------------------- the opening run
G = T['agent']
opening = {'calls_per_turn': [len(t['calls']) for t in G['turns']], 'steps': G['steps'], 'calls': G['calls']}

# ---------------------------------------------------------------------------------------- published numbers
SWE = {  # verified.md #16a, #16b, #16c, with the framing its notes recommend: vendor-reported, then contaminated
    'tasks': 500,                                               # #16a: 500 human-verified tasks
    'start': {'pct': 33.2, 'model': 'GPT-4o', 'date': 'Aug 2024'},            # #16a
    'mid': {'pct': 80.9, 'model': 'Claude Opus 4.5', 'date': 'Nov 2025'},     # #16b
    'late': {'pct': 93.9, 'model': 'Claude Mythos Preview', 'date': 'Apr 2026'},  # #16b: restricted model
    'leaderboard_pct': 79.2,                                    # #16b: the independent swebench.com leaderboard
    'dropped': 'Feb 2026',                                      # #16c: OpenAI stops reporting it (contaminated)
}
SO = {'use_or_plan': 84, 'agents_weekly': 23.1, 'year': 2025}   # #24, Stack Overflow developer survey 2025
KLARNA = {  # #1 (VERIFIED, press release 27 Feb 2024) and #2 (SECONDARY: Bloomberg via Entrepreneur, 8 May 2025)
    'date': 'Feb 2024', 'chats': '2.3 million', 'share': 'two-thirds', 'fte': 700,
    'minutes_before': 11, 'minutes_after': 2, 'repeat_drop_pct': 25, 'turn_date': 'May 2025'}
OSW = {  # #18: OSWorld paper (arXiv 2404.07972) and the OSWorld-Verified leaderboard (data of 7 Aug 2026)
    'human': 72.36, 'paper_best': 12.24, 'paper_year': '2024',
    'best_single': 85.96, 'best_single_date': 'Aug 2026', 'best_framework': 90.19}
assert SWE['start']['pct'] < SWE['leaderboard_pct'] < SWE['mid']['pct'] < SWE['late']['pct']
assert OSW['paper_best'] < OSW['human'] < OSW['best_single'] < OSW['best_framework']

# ---------------------------------------------------------------------------------------- the designs
DESIGN = {  # parameters of the illustrative traces; the slides say these are designs
    'research_searches': 6,      # searches the research design sends at once
    'incident_queries': 2,       # logs and metrics, queried at once
    'incident_hour': '2 a.m.',   # when the alert fires
}

OUT.write_text(json.dumps({'research': research, 'analyst': analyst, 'inbox': inbox, 'opening': opening,
                           'swe': SWE, 'so': SO, 'klarna': KLARNA, 'osworld': OSW, 'design': DESIGN},
                          indent=1, ensure_ascii=False) + '\n')
print(OUT, f"research {research['claims']} claims/{research['distinct_links']} page;",
      f"analyst {worst['city']} {worst['mean']} µg/m³, {worst['days_over']}/{worst['days']} days over {std};",
      f"chart {w}×{h} → {chart_out.relative_to(ROOT)}")
