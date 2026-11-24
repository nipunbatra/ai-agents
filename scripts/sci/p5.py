"""Part 5, Agents in your organisation: the numbers its slides quote that are not already in data/traces.json.

    python3 scripts/sci/p5.py        writes data/p5.json

- The cost of one task. Our run cost nothing per token: the model ran on a laptop. The slides work out what the same
  tokens would cost on a hosted model straight from data/traces.json (agent.tokens_read, agent.tokens_written, the
  per-round log and `hosted`, the hosted model's published price), so they follow the run when it is recorded again.
  This file adds only what a run cannot give: the speaker's assumptions about the person who checks the result, and
  the ranges of the two sliders.
- Published numbers: constants with the row of plan/research/verified.md they come from.
The asserts guard what the slides say. Run this again after every new recording of the notebook.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
T = json.loads((ROOT / 'data' / 'traces.json').read_text())
OUT = ROOT / 'data' / 'p5.json'
D = {}

# ---------------------------------------------------------------------------------------- the cost of one task
A, H = T['agent'], T['hosted']
log = A['log']
n_real = len(log)
assert n_real == A['rounds'] and sum(r['read'] for r in log) == A['tokens_read']
first_read = log[0]['read']
growth = (A['tokens_read'] - n_real * first_read) / (n_real * (n_real - 1) / 2)   # extra tokens read per round
written_per_round = A['tokens_written'] / n_real
assert growth > 0                                       # each round rereads everything before it


def tokens(n):
    """Tokens read and written by a run of n rounds: the same model the slide's figure uses (parts/05-adopt.js)."""
    return n * first_read + growth * n * (n - 1) / 2, n * written_per_round


def hosted_inr(n, usd_in=H['usd_in'], usd_out=H['usd_out']):
    i, o = tokens(n)
    return (i * usd_in + o * usd_out) / 1e6 * H['inr_per_usd']


# The speaker's assumptions (not published numbers): five minutes for a person to check one result, at ₹1,000 an hour
# (roughly ₹20 lakh a year over 2,000 working hours). The sliders let the audience change the minutes and the rounds.
REVIEW_MIN, INR_PER_HOUR, ROUNDS_MAX = 5, 1000, 30
model_inr = hosted_inr(n_real)
person_inr = REVIEW_MIN / 60 * INR_PER_HOUR
assert abs(model_inr - A['inr_hosted']) < 0.01          # the figure's token model reproduces the recorded run
assert model_inr < 1                                    # "less than a rupee"
assert model_inr / (model_inr + person_inr) < 0.01      # "the model is under 1% of the cost"
assert n_real < ROUNDS_MAX and hosted_inr(ROUNDS_MAX) < person_inr   # "even 30 rounds cost less than the check"

# The workflow slide's notes: Part 3's agent checked the invoices, and some of them do not match their order.
IV = T['invoices']
assert 0 < IV['problems'] < len(IV['invoices'])         # "the ones that match" and "the ones that do not" both exist
assert sum(c['flagged'] for c in IV['check']) > 0       # "it checked the invoices and flagged some"

# verified.md #20: gemini-3.8-flash costs $0.75 in / $3.75 out per 1M tokens through 31 Dec 2026, rising to
# $1.50 / $7.50 from 1 Jan 2027 (aistudio.google.com/docs/pricing). traces.hosted holds the current price.
PRICE_CHANGE = {'model': 'Gemini 3.8 Flash', 'when': '1 January 2027', 'usd_in': 1.50, 'usd_out': 7.50}
if H['name'] == PRICE_CHANGE['model']:
    assert (PRICE_CHANGE['usd_in'], PRICE_CHANGE['usd_out']) == (2 * H['usd_in'], 2 * H['usd_out'])   # "twice today's price"
    assert hosted_inr(ROUNDS_MAX, PRICE_CHANGE['usd_in'], PRICE_CHANGE['usd_out']) < person_inr

D['cost'] = {
    'review_min': REVIEW_MIN, 'inr_per_hour': INR_PER_HOUR, 'person_inr': round(person_inr, 2),
    'price_change': PRICE_CHANGE,
    'slider': {'rounds_min': 1, 'rounds_max': ROUNDS_MAX, 'review_min': 0, 'review_max': 30},
}

# verified.md #17: Anthropic, "How we built our multi-agent research system", 13 Jun 2025: "agents typically use about
# 4x more tokens than chat interactions, and multi-agent systems use about 15x more tokens than chats".
D['tokens_vs_chat'] = {'agent': 4, 'multi_agent': 15, 'when': 'Jun 2025'}

# ---------------------------------------------------------------------------------------- what changes for a team
# verified.md #23: Gartner press release, 25 Jun 2025: "over 40% of agentic AI projects will be canceled by the end of
# 2027, due to escalating costs, unclear business value or inadequate risk controls".
D['gartner'] = {'when': 'Jun 2025', 'cancelled_pct': 40, 'by': 2027,
                'reasons': ['escalating costs', 'unclear business value', 'inadequate risk controls']}

OUT.write_text(json.dumps(D, indent=1, ensure_ascii=False) + '\n')
print(OUT, sorted(D))
print(f"our run: {n_real} rounds, {A['tokens_read']} read, {A['tokens_written']} written; hosted ₹{model_inr:.2f} "
      f"({H['name']}); a person ₹{person_inr:.0f}; model share {model_inr / (model_inr + person_inr):.2%}")
for n in (1, n_real, 10, ROUNDS_MAX):
    print(n, 'rounds:', [round(x) for x in tokens(n)], f'₹{hosted_inr(n):.2f}')
