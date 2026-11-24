"""Published numbers for the real jobs of Part 3 in science, farming and the clinic: AlphaEvolve and clinic notes on
the main route (parts/03b-work.js), the co-scientist and the lab robot in the appendix (parts/09-more-apps.js), and
the two farm services quoted in the notes of the stakes map.

    python3 scripts/sci/p3b.py        writes data/p3b.json

Published values are recorded from plan/research/verified.md (rows 9 to 15, checked 19 Nov 2026), with the wording its
notes recommend; SOURCES.md has the URLs. Nothing published is computed except the roundings the slides say aloud.
Nothing here comes from our own runs.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'p3b.json'
MON = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split()

# ---------------------------------------------------------------------------------------- published (verified.md)
# Row 9, VERIFIED. Google Research blog "Accelerating scientific breakthroughs with an AI co-scientist", 19 Feb 2025,
# "Built on Gemini 2.0". It proposed that cf-PICIs use diverse phage tails, matching unpublished Imperial work. The two
# days are in Google's companion paper (arXiv 2502.18864, section 4.7), not in the blog.
COSCIENTIST = {'date': '19 Feb 2025', 'model': 'Gemini 2.0', 'days': 2, 'arxiv': '2502.18864'}
# Row 10, VERIFIED. Boiko, MacKnight, Kline and Gomes, "Autonomous chemical research with large language models",
# Nature 624, published 20 Dec 2023: "successful reaction optimization of palladium-catalysed cross-couplings".
LAB = {'date': '20 Dec 2023', 'journal': 'Nature', 'year': 2023}
# Row 11, VERIFIED. FutureHouse, Robin, announced 20 May 2025: ripasudil, "a novel therapeutic candidate for dry
# age-related macular degeneration (dAMD)".
ROBIN = {'date': '20 May 2025', 'year': 2025, 'drug': 'ripasudil'}
# Row 12, VERIFIED. Google DeepMind blog, 14 May 2025: "recovers, on average, 0.7% of Google's worldwide compute
# resources"; 4x4 complex-valued matrices with 48 scalar multiplications; a Gemini kernel "sped up ... by 23%",
# "a 1% reduction in Gemini's training time".
EVOLVE = {'date': '14 May 2025', 'compute_pct': 0.7, 'matrix': 4, 'mults': 48, 'kernel_pct': 23, 'training_pct': 1}
# Row 13, VERIFIED. PIB backgrounder of 4 Sep 2025 on Kisan e-Mitra: 11 languages, over 20,000 queries a day, more than
# 95 lakh answered. The notes say to use these, not the later "93 lakh" press figure.
KISAN = {'date': 'Sep 2025', 'languages': 11, 'answered_lakh': 95, 'per_day': 20000}
KISAN['answered_m'] = KISAN['answered_lakh'] / 10     # the slide uses millions, as for Farmer.Chat: 95 lakh = 9.5 million
# Row 14, VERIFIED with a range: Digital Green's own pages disagree, so the notes recommend "10+ languages, 6 countries,
# 1.6 to 3 million farmers" for Farmer.Chat.
FARMERCHAT = {'farmers_lo_m': 1.6, 'farmers_hi_m': 3, 'languages': 10, 'countries': 6}
# Row 15, CORRECTED. The Permanente Medical Group's ambient AI scribes, NEJM Catalyst 2025 (DOI 10.1056/CAT.25.0040):
# 7,260 physicians, 2,576,627 encounters, Oct 2023 to Dec 2024 (63 weeks, so "about 15 months", not a year). About
# 15,791 hours of documentation saved (SECONDARY, AMA; Kaiser says "nearly 16,000"): the slide says "about 15,800".
TPMG = {'physicians': 7260, 'encounters': 2576627, 'hours': 15791, 'from': (2023, 10), 'to': (2024, 12)}

months = (TPMG['to'][0] - TPMG['from'][0]) * 12 + TPMG['to'][1] - TPMG['from'][1] + 1
clinic = {'physicians': TPMG['physicians'], 'encounters_m': round(TPMG['encounters'] / 1e6, 2),
          'hours': int(round(TPMG['hours'], -2)), 'months': months,
          'from': f"{MON[TPMG['from'][1] - 1]} {TPMG['from'][0]}", 'to': f"{MON[TPMG['to'][1] - 1]} {TPMG['to'][0]}"}
assert months == 15 and clinic['hours'] == 15800 and clinic['encounters_m'] == 2.58

OUT.write_text(json.dumps({'coscientist': COSCIENTIST, 'lab': LAB, 'robin': ROBIN, 'evolve': EVOLVE, 'kisan': KISAN,
                           'farmerchat': FARMERCHAT, 'clinic': clinic}, indent=1, ensure_ascii=False) + '\n')
print(OUT, '| AlphaEvolve', EVOLVE['compute_pct'], '% | clinic', clinic['hours'], 'hours in', months, 'months',
      '| co-scientist', COSCIENTIST['days'], 'days')
