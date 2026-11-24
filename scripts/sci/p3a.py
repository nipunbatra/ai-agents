"""Published numbers for the real jobs of Part 3 that came from the old first half: coding agents, customer support
and computer use. The slides are in parts/03b-work.js (main route) and parts/08-more-apps.js (appendix).

    python3 scripts/sci/p3a.py        writes data/p3a.json

Every value is copied from plan/research/verified.md (row numbers in the comments), with that file's wording. Nothing
here comes from our own runs: those are in data/traces.json (scripts/sci/traces.py), and the slides read them there.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'p3a.json'

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
DESIGN = {  # parameters of the illustrative IT-incident steps; the slide says they are a design
    'incident_hour': '2 a.m.',   # when the alert fires
}

assert KLARNA['minutes_after'] < KLARNA['minutes_before'] and KLARNA['share'] == 'two-thirds'
OUT.write_text(json.dumps({'swe': SWE, 'so': SO, 'klarna': KLARNA, 'osworld': OSW, 'design': DESIGN},
                          indent=1, ensure_ascii=False) + '\n')
print(OUT, f"SWE-bench Verified {SWE['leaderboard_pct']}% of {SWE['tasks']};",
      f"Klarna {KLARNA['share']} of chats; OSWorld-Verified {OSW['best_single']}% (people {OSW['human']}%)")
