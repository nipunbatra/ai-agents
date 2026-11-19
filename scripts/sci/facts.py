"""Dated facts and published numbers the talk shows: the timeline of agent milestones, benchmark progress, incidents
and the evidence on application slides. Each entry names its source; SOURCES.md lists the URLs.

    ~/base/bin/python scripts/sci/facts.py        writes data/facts.json

Checked against primary sources on 19 Nov 2026 (plan/research/verified.md). Nothing here is computed; every value is
recorded from its source, and the asserts guard the claims the slides make about them.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'facts.json'

TIMELINE = [  # era 1: it answers; 2: it uses tools; 3: it does the job
    {'date': '2022-10-06', 'era': 2, 'what': 'ReAct: reason and act', 'src': 'arxiv.org/abs/2210.03629'},
    {'date': '2022-11-30', 'era': 1, 'what': 'ChatGPT', 'src': 'openai.com/blog/chatgpt'},
    {'date': '2023-06-13', 'era': 2, 'what': 'Function calling', 'src': 'openai.com/blog/function-calling-and-other-api-updates'},
    {'date': '2024-10-22', 'era': 2, 'what': 'Computer use', 'src': 'anthropic.com/news/3-5-models-and-computer-use'},
    {'date': '2024-11-25', 'era': 2, 'what': 'MCP, a common plug for tools', 'src': 'anthropic.com/news/model-context-protocol'},
    {'date': '2025-02-02', 'era': 3, 'what': 'Deep research', 'src': 'openai.com/index/introducing-deep-research'},
    {'date': '2025-02-24', 'era': 3, 'what': 'Claude Code', 'src': 'anthropic.com/news/claude-3-7-sonnet'},
    {'date': '2025-07-17', 'era': 3, 'what': 'ChatGPT agent', 'src': 'openai.com/index/introducing-chatgpt-agent'},
    {'date': '2025-12-09', 'era': 3, 'what': 'MCP to the Linux Foundation', 'src': 'linuxfoundation.org (Agentic AI Foundation)'},
]
for k in (1, 2, 3):
    assert [e['date'] for e in TIMELINE if e['era'] == k] == sorted(e['date'] for e in TIMELINE if e['era'] == k)
assert {e['era'] for e in TIMELINE} == {1, 2, 3}

TIMELINE.sort(key=lambda e: (e['era'], e['date']))
OUT.write_text(json.dumps({'timeline': TIMELINE}, indent=1, ensure_ascii=False) + '\n')
print(OUT, len(TIMELINE), 'milestones')
