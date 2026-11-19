"""METR's time-horizon data for the opening chart: how long a task (in human expert time) frontier agents finish with
50% success, by release date.

    ~/base/bin/python scripts/sci/metr.py        writes data/metr.json

Source: METR, "Measuring AI Ability to Complete Long Tasks" (19 Mar 2025) and its time-horizon page
https://metr.org/time-horizons/ ; data file https://metr.org/assets/benchmark_results_1_1.yaml (Time Horizon 1.1),
saved in plan/sources/metr_benchmark_results_1_1.yaml on 19 Nov 2026. Horizons are in minutes. METR notes that
measurements above 16 hours are unreliable with its task suite, and that the tasks are mainly software engineering,
machine learning and cybersecurity.
"""
import json
from datetime import date
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'plan' / 'sources' / 'metr_benchmark_results_1_1.yaml'
OUT = ROOT / 'data' / 'metr.json'
NAMES = {  # METR id: name on the slide
    'gpt2': 'GPT-2', 'davinci_002': 'GPT-3', 'gpt_3_5_turbo_instruct': 'GPT-3.5', 'gpt_4': 'GPT-4',
    'gpt_4o_inspect': 'GPT-4o', 'claude_3_5_sonnet_20240620_inspect': 'Claude 3.5 Sonnet',
    'claude_3_5_sonnet_20241022_inspect': 'Claude 3.5 Sonnet (new)', 'o1_preview': 'o1-preview', 'o1_inspect': 'o1',
    'claude_3_7_sonnet_inspect': 'Claude 3.7 Sonnet', 'o3_inspect': 'o3', 'claude_4_opus_inspect': 'Claude Opus 4',
    'claude_4_1_opus_inspect': 'Claude Opus 4.1', 'gpt_5_2025_08_07_inspect': 'GPT-5', 'gemini_3_pro': 'Gemini 3 Pro',
    'gpt_5_1_codex_max_inspect': 'GPT-5.1-Codex-Max', 'claude_opus_4_5_inspect': 'Claude Opus 4.5',
    'gpt_5_2': 'GPT-5.2', 'claude_opus_4_6_inspect': 'Claude Opus 4.6', 'gpt_5_3_codex': 'GPT-5.3-Codex',
    'gemini_3_1_pro': 'Gemini 3.1 Pro', 'gpt_5_4': 'GPT-5.4', 'claude_mythos_preview_early_inspect': 'Claude Mythos Preview',
    'claude_3_opus_inspect': 'Claude 3 Opus', 'gpt_4_1106_inspect': 'GPT-4 Turbo (Nov 2023)', 'gpt_4_turbo_inspect': 'GPT-4 Turbo'}
LABEL = ['GPT-2', 'GPT-4', 'Claude 3.7 Sonnet', 'GPT-5', 'Claude Opus 4.6']

y = yaml.safe_load(SRC.read_text())
pts = []
for k, v in y['results'].items():
    m = v['metrics']
    rd = v['release_date']
    rd = rd if isinstance(rd, date) else date.fromisoformat(str(rd))
    p50 = m['p50_horizon_length']
    pts.append({'id': k, 'name': NAMES.get(k, k), 'date': rd.isoformat(), 'year': round(rd.year + (rd.timetuple().tm_yday - 1) / 365.25, 3),
                'p50': round(p50['estimate'], 2), 'lo': round(p50.get('ci_low', p50['estimate']), 2),
                'hi': round(p50.get('ci_high', p50['estimate']), 2),
                'p80': round(m['p80_horizon_length']['estimate'], 2), 'sota': bool(m.get('is_sota')),
                'label': NAMES.get(k) in LABEL})
pts.sort(key=lambda p: p['date'])
dbl = y['doubling_time_in_days']
out = {'points': pts, 'doubling_days_since_2023': round(dbl['from_2023_on']['point_estimate'], 1),
       'doubling_ci': [round(dbl['from_2023_on']['ci_low'], 1), round(dbl['from_2023_on']['ci_high'], 1)],
       'doubling_days_all_time': round(dbl['all_time_stitched']['point_estimate'], 1),
       'unreliable_above_hours': 16, 'fetched': '2026-11-19',
       'source': 'METR Time Horizon 1.1, metr.org/time-horizons'}
import math
# The trend line on the slide: METR's doubling time since 2023 as the slope, fitted through the frontier points
# since 2023 that are under 16 hours (log2 of minutes against the year).
slope = 365.25 / out['doubling_days_since_2023']
fit = [p for p in pts if p['sota'] and p['year'] >= 2023 and p['p50'] < 16 * 60]
b = sum(math.log2(p['p50']) - slope * p['year'] for p in fit) / len(fit)
out['trend'] = {'slope_per_year': round(slope, 4), 'intercept': round(b, 4), 'x0': 2023.0, 'x1': 2026.4, 'n_fit': len(fit)}
by = {p['name']: p for p in pts}
assert by['GPT-2']['p50'] < 0.1 and 3.5 < by['GPT-4']['p50'] < 4.5             # seconds, then about 4 minutes
assert 55 < by['Claude 3.7 Sonnet']['p50'] < 65                                 # about an hour (Feb 2025)
assert 700 < by['Claude Opus 4.6']['p50'] < 740                                 # about 12 hours (Feb 2026)
assert all(p['lo'] <= p['p50'] <= p['hi'] for p in pts)
assert all(n in by for n in LABEL)
assert 100 < out['doubling_days_since_2023'] < 160
OUT.write_text(json.dumps(out, indent=1) + '\n')
print(OUT, len(pts), 'models; doubling', out['doubling_days_since_2023'], 'days since 2023')
