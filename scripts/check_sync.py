"""Check that the slides and the notebook agree, and that no banned wording crept in.

    python3 scripts/check_sync.py

1. Every "In the notebook" slide (nbRun) names a notebook section that exists, with the same title, in notebook order.
2. No metaphors the speaker rejected, no em or en dashes, in any part file.
"""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
nb = (ROOT / 'notebook' / 'agents.py').read_text()
secs = re.findall(r'^# ### (\d\.\d) (.+)$', nb, flags=re.M)
nbmap = dict(secs)
order = re.search(r"const FILES=\[(.*?)\]", (ROOT / 'content.js').read_text()).group(1).replace("'", '').split(',')
bad, used = 0, []
for f in order:
    s = (ROOT / 'parts' / f'{f}.js').read_text()
    for num, title in re.findall(r"nbRun\('[^']+','[^']+','(\d\.\d)','([^']+)'", s):
        used.append(num)
        if num not in nbmap:
            print(f'MISSING notebook section {num} "{title}" ({f})'); bad += 1
        elif nbmap[num] != title:
            print(f'TITLE MISMATCH {num}: slide "{title}" vs notebook "{nbmap[num]}" ({f})'); bad += 1
if used != sorted(used, key=lambda x: tuple(map(int, x.split('.')))):
    print('ORDER differs from the notebook:', used); bad += 1
print(len(used), 'notebook slides; sections with no slide of their own:', [n for n, _ in secs if n not in used])
banned = re.compile(r'\b(engine|bonnet|dial|climb|stall\w*|unlock\w*|crucial|delve|seamless\w*|landscape|journey|harness\w*|game-chang\w*|revolution\w*)\b', re.I)
for f in order:
    for i, line in enumerate((ROOT / 'parts' / f'{f}.js').read_text().split('\n'), 1):
        txt = re.sub(r"'(?:part-engine\.jpg|engine)'|Engine of Autonomy|search engine", '', line)
        if line.lstrip().startswith('//'):
            continue
        for m in banned.finditer(txt):
            print(f'{f}:{i}: "{m.group(0)}"  {line.strip()[:100]}'); bad += 1
        if '—' in line or '–' in line:
            print(f'{f}:{i}: dash  {line.strip()[:100]}'); bad += 1
sys.exit(1 if bad else 0)
