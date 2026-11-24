"""Part 4, How agents fail: the numbers its slides quote that are not in data/traces.json.

    python3 scripts/sci/p4.py        writes data/p4.json

Three kinds of fact:
- computed here: the compounding of errors (a simple model, stated on the slide);
- read from the notebook's source (notebook/agents.py): the loop's default round limit, the safe list and the
  protected files, and one command the safe list lets through (checked here against the real needs_approval);
- published: the failures and attacks on the slides, each a constant with its source and the row of
  plan/research/verified.md it comes from (rows marked SECONDARY say "reported by" on the slide).
Everything about our own runs (the note, the approvals, the step limit, the eval) is in data/traces.json.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'data' / 'p4.json'
D = {}

# ---------------------------------------------------------------------------------------- 4.1 errors compound
# The simple model on the slide: a task needs n steps; each step is right with probability p, independently; the task
# is right only if every step is right, so P(task) = p ** n. "Check each step and retry once": a check catches every
# wrong step and the step is tried once more, so a step is right with probability 1 - (1 - p) ** 2.
P, N, N_LONG = 0.95, 20, 50


def task(p, n, check=False):
    step = 1 - (1 - p) ** 2 if check else p
    return step ** n


D['compound'] = {
    'p': P, 'n': N, 'task': round(task(P, N), 4), 'step_checked': round(1 - (1 - P) ** 2, 4),
    'task_checked': round(task(P, N, True), 4), 'n_long': N_LONG, 'task_long': round(task(P, N_LONG), 4),
    'slider': {'p_min': 0.80, 'p_max': 0.995, 'p_step': 0.005, 'n_min': 1, 'n_max': 50},
}
# The three-line printout of notebook 4.1 (notebook/agents.py): the whole task's chance for three step rates and four
# task lengths. The notebook slide builds its code from these lists, and its notes quote the rows.
SRC = (ROOT / 'notebook' / 'agents.py').read_text()
loop = re.search(r'for p in \(([\d., ]+)\):\n\s+print\(.*for n in \(([\d, ]+)\)', SRC)
assert loop, 'notebook 4.1 no longer prints the table of step rates and task lengths'
TABLE_P, TABLE_N = [float(x) for x in loop.group(1).split(',')], [int(x) for x in loop.group(2).split(',')]
D['compound']['table'] = {'p': TABLE_P, 'n': TABLE_N,
                          'rows': [[round(task(p, n), 4) for n in TABLE_N] for p in TABLE_P]}
assert P in TABLE_P and N in TABLE_N and N_LONG in TABLE_N
assert round(task(P, N) * 100) == 36                     # the slide's answer to "95% a step, 20 steps"
assert round(task(P, N, True) * 100) == 95               # checking brings it back to about 95%
assert task(P, N_LONG) < 0.1

# ---------------------------------------------------------------------------------------- the guard in our loop
# The real needs_approval, run here on the commands the slides talk about. The slide shows a simplified version of it.
m = re.search(r'^SAFE_COMMANDS = .*?^def ask_human', SRC, re.S | re.M)
assert m, 'needs_approval is no longer where section 1.6 had it'
ns = {'json': json, 're': re}
exec(m.group(0).rsplit('def ask_human', 1)[0], ns)
safe, protected, needs_approval = ns['SAFE_COMMANDS'], ns['PROTECTED'], ns['needs_approval']
# The few safe commands the simplified code on the slide lists, in the order people meet them in Parts 1 to 3.
SHOWN = ['ls', 'cat', 'grep', 'mkdir', 'mv', 'python', 'pytest']
assert set(SHOWN) <= safe and 'rm' not in safe and protected == ['.env']
# A command the safe list lets through although it deletes a file: python is on the list. Never run here.
HOLE = '''python -c "import os; os.remove('billing.py')"'''
assert needs_approval('bash', {'command': HOLE}) is None
assert needs_approval('bash', {'command': 'rm billing.py'}) == "the command 'rm' is not on the safe list"
assert needs_approval('bash', {'command': 'cat .env'}) == 'it touches the protected file .env'
assert needs_approval('read_file', {'path': '.env'}) == 'it touches the protected file .env'
rounds = re.search(r'def run_agent\(.*max_rounds=(\d+)', SRC)
D['guard'] = {'safe_shown': SHOWN, 'safe_count': len(safe), 'protected': protected, 'hole': HOLE,
              'max_rounds': int(rounds.group(1))}

# ---------------------------------------------------------------------------------------- real failures
D['failures'] = {
    # verified.md #4 (SECONDARY: The Register, Tom's Hardware). Lemkin's posts from 18 Jul 2025; the agent's own chat
    # output said it wiped records for 1,206 executives and 1,196+ companies; Masad's reply on X about 20 Jul 2025.
    # verified.md notes on #4 (SECONDARY): one report says Lemkin later recovered the data with Replit's rollback,
    # although the agent had said rollback was impossible.
    'replit': {'when': 'Jul 2025', 'executives': 1206, 'companies': 1196,
               'reported_by': 'The Register and Tom’s Hardware'},
    # verified.md #3 (SECONDARY: law-firm summaries; CanLII returned 403). Moffatt v. Air Canada, 2024 BCCRT 149,
    # decided 14 Feb 2024; CAD 812.02 in all (650.88 damages, 36.14 interest, 125 fees).
    'air_canada': {'when': 'Feb 2024', 'decided': '14 Feb 2024', 'cad': 812.02, 'case': 'Moffatt v. Air Canada, 2024 BCCRT 149',
                   'reported_by': 'law-firm summaries of the decision'},
}
assert abs(650.88 + 36.14 + 125 - D['failures']['air_canada']['cad']) < 0.005

# ---------------------------------------------------------------------------------------- real attacks
# verified.md #5: CVE-2025-32711, published by Microsoft 11 Jun 2025, "M365 Copilot Information Disclosure
# Vulnerability", CVSS 3.1 score 9.3 (critical). "Zero-click" is Aim Labs' framing (SECONDARY, SiliconANGLE): notes only.
# verified.md #6: Invariant Labs, 26 May 2025, GitHub MCP server: a malicious public issue made an agent leak private
# repository data into a public pull request. VERIFIED.
# verified.md #8: Brave, 20 Aug 2025, indirect prompt injection in Perplexity Comet. VERIFIED.
D['attacks'] = [
    # found_by: the researchers who showed the attack. Only EchoLeak is recorded as patched (Microsoft published the CVE).
    {'id': 'echoleak', 'product': 'Microsoft 365 Copilot', 'when': 'Jun 2025', 'date': '11 Jun 2025', 'name': 'EchoLeak',
     'cve': 'CVE-2025-32711', 'cvss': 9.3, 'by': 'Microsoft', 'found_by': 'Aim Labs', 'patched': True},
    {'id': 'github', 'product': 'GitHub MCP server', 'when': 'May 2025', 'date': '26 May 2025', 'by': 'Invariant Labs',
     'found_by': 'Invariant Labs'},
    {'id': 'comet', 'product': 'Perplexity Comet', 'when': 'Aug 2025', 'date': '20 Aug 2025', 'by': 'Brave', 'found_by': 'Brave'},
]

# verified.md #7: Simon Willison, "The lethal trifecta for AI agents", 16 Jun 2025. His three ingredients, verbatim.
D['trifecta'] = {'when': '16 Jun 2025', 'parts': ['Access to your private data', 'Exposure to untrusted content',
                                                  'The ability to externally communicate']}

OUT.write_text(json.dumps(D, indent=1, ensure_ascii=False) + '\n')
print(OUT, sorted(D))
print('compound', D['compound'])
print('guard', D['guard'])
