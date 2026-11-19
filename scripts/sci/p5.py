"""Part 5, Agents in your organisation: the numbers its slides quote that are not already in data/traces.json.

    python3 scripts/sci/p5.py        writes data/p5.json

- The cost of one task (live figure p5-cost): the opening run's tokens (data/traces.json, agent) times the price
  per million tokens (traces.price, from Google's pricing page on 19 Nov 2026), in rupees at traces.inr_per_usd,
  against a person's minutes spent checking it. The token model is stated on the slide: each step rereads everything
  before it, so the tokens read grow by a fixed amount per step; that amount is fitted so that our three-step run
  costs exactly what it cost.
- Published numbers: constants with their source and the row of plan/research/verified.md they come from.
- The speaker's settings (review minutes, the cost of an hour, slider ranges) are assumptions, labelled as such.
The asserts guard what the slides say.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
T = json.loads((ROOT / 'data' / 'traces.json').read_text())
OUT = ROOT / 'data' / 'p5.json'
D = {}

# ---------------------------------------------------------------------------------------- the cost of one task
A, PRICE, INR = T['agent'], T['price'], T['inr_per_usd']
turns = A['turns']
n_real = len(turns)
first_in = turns[0]['usage']['input']
growth = (A['usage']['input'] - n_real * first_in) / (n_real * (n_real - 1) / 2)   # extra tokens read per step
out_per_step = A['usage']['output'] / n_real
assert growth > 0


def tokens(n):
    """Tokens read and written by a run of n steps under the slide's model."""
    return n * first_in + growth * n * (n - 1) / 2, n * out_per_step


def cost_inr(n, price):
    i, o = tokens(n)
    return (i * price['input'] + o * price['output']) / 1e6 * INR


# verified.md #20: gemini-3.8-flash costs $0.75 in / $3.75 out per 1M tokens through 31 Dec 2026, rising to
# $1.50 / $7.50 from 1 Jan 2027 (aistudio.google.com/docs/pricing). The current prices are in traces.price.
FLASH_2027 = {'input': 1.50, 'output': 7.50}
assert FLASH_2027['input'] == 2 * PRICE['gemini-3.8-flash']['input'] and FLASH_2027['output'] == 2 * PRICE['gemini-3.8-flash']['output']
MODELS = [
    {'id': 'flash', 'name': 'Gemini 3.8 Flash', 'label': '3.8 Flash', 'price': PRICE['gemini-3.8-flash']},
    {'id': 'flash27', 'name': 'Gemini 3.8 Flash from 1 Jan 2027', 'label': '3.8 Flash from 1 Jan', 'price': FLASH_2027},
    {'id': 'lite', 'name': 'Gemini 3.5 Flash-Lite', 'label': '3.5 Flash-Lite', 'price': PRICE['gemini-3.5-flash-lite']},
]

# The speaker's assumptions (not published numbers): five minutes for a person to check one answer, at ₹1,000 an hour
# (roughly ₹20 lakh a year over 2,000 working hours). The sliders let the audience change both.
REVIEW_MIN, INR_PER_HOUR = 5, 1000
model_inr = cost_inr(n_real, MODELS[0]['price'])
person_inr = REVIEW_MIN / 60 * INR_PER_HOUR
assert abs(model_inr - A['cost_inr']) < 0.01            # the fitted model reproduces the real run's cost
D['cost'] = {
    'steps': n_real, 'first_input': first_in, 'growth': round(growth, 2), 'out_per_step': round(out_per_step, 2),
    'input': A['usage']['input'], 'output': A['usage']['output'], 'inr_per_usd': INR,
    'models': MODELS, 'price_change': '1 January 2027',
    'review_min': REVIEW_MIN, 'inr_per_hour': INR_PER_HOUR,
    'model_inr': round(model_inr, 3), 'person_inr': round(person_inr, 2),
    'model_share': round(model_inr / (model_inr + person_inr), 4),
    'slider': {'steps_min': 1, 'steps_max': 30, 'review_min': 0, 'review_max': 30, 'hour_min': 250, 'hour_max': 5000,
               'hour_step': 250},
}
assert D['cost']['model_share'] < 0.01                  # "the model is under 1% of the cost"
# Even a long run (30 steps) at the 2027 price stays below five minutes of a person's time at the default rate.
assert cost_inr(30, FLASH_2027) < person_inr

# verified.md #17: Anthropic, "How we built our multi-agent research system", 13 Jun 2025: "agents typically use about
# 4x more tokens than chat interactions, and multi-agent systems use about 15x more tokens than chats".
D['tokens_vs_chat'] = {'agent': 4, 'multi_agent': 15, 'when': 'Jun 2025'}

# ---------------------------------------------------------------------------------------- what changes for a team
# verified.md #26: Anthropic Economic Index, report of 15 Sep 2025: directive use (the user hands over the whole task)
# "jumped from 27% to 39%"; "77% of API transcripts show automation patterns".
D['economic_index'] = {'when': 'Sep 2025', 'directive_from': 27, 'directive_to': 39, 'api_automation': 77}
# verified.md #23: Gartner press release, 25 Jun 2025: "over 40% of agentic AI projects will be canceled by the end of
# 2027, due to escalating costs, unclear business value or inadequate risk controls".
D['gartner'] = {'when': 'Jun 2025', 'cancelled_pct': 40, 'by': 2027}

OUT.write_text(json.dumps(D, indent=1, ensure_ascii=False) + '\n')
print(OUT, sorted(D))
print({k: v for k, v in D['cost'].items() if k != 'models'})
for n in (1, 3, 10, 30):
    print(n, [round(cost_inr(n, m['price']), 2) for m in MODELS], [round(x) for x in tokens(n)])
