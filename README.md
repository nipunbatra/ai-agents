# AI agents: language models that use tools in a loop

A talk for the **IITGN-X Residency Program** (eMasters, IIT Gandhinagar), 3 December 2026, by Nipun Batra, with a
companion notebook. The session is listed as “The Engine of Autonomy: Unlocking the True Power of AI Agents”.

- **Slides:** https://nipunbatra.github.io/ai-agents/ (arrow keys or space to step; `F` to present; `N` for notes)
- **Read as notes:** https://nipunbatra.github.io/ai-agents/?reading
- **PDF:** [exports/ai-agents.pdf](exports/ai-agents.pdf) (one page per slide) and
  [exports/ai-agents-builds.pdf](exports/ai-agents-builds.pdf) (one page per click)
- **Notebook:** [notebook/agents.ipynb](notebook/agents.ipynb) ·
  [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/nipunbatra/ai-agents/blob/main/notebook/agents.ipynb)

## What the talk covers

The talk moves between the slides and the notebook. A slide titled **"In the notebook"** names a numbered section
(1.1, 1.2, …); the notebook has the same section, and the slide after it shows our own recorded run of it, so the
talk can go on even if a live run is slow.

| Part | |
|---|---|
| Opening | A question about three cities' air, sent to a model on its own (notebook 1.1); the plan |
| 1 · What an agent is | What a model cannot do alone; write a tool; the reply as a request; the loop as a flowchart, built one box at a time; check the agent's answer; workflow or agent; five levels of autonomy |
| 2 · One run, step by step | The opening run round by round, with tokens and cost; the loop in Python; the context; notes as memory; routing and other patterns; MCP |
| 3 · Agents at work | Nine applications on the main route (four of them run live) and five more in the appendix, placed on a map of "how easy is the result to check" against "what does a mistake cost" |
| 4 · How agents fail | Errors that add up; real failures, each placed on the loop's flowchart; prompt injection and the lethal trifecta; approvals and step limits; evals |
| 5 · Agents in your organisation | Should this task be an agent; raising autonomy in steps; the cost of a task; what changes for a team |

## The notebook

`notebook/agents.ipynb` builds an agent from scratch in plain Python (no framework) and runs every example in the
talk: the air-quality question, a data analyst on ten Indian cities' PM2.5, a research assistant that cites
Wikipedia, an inbox assistant that asks before sending, a Gujarati farm advisory with a writer and a checker, an email
with hidden instructions, a step limit, and an eval over ten runs. Its sections are numbered like the slides. Choose
the backend in the first cell:

- `BACKEND = "gemini"` (default): a free Gemini API key from https://aistudio.google.com/apikey , stored in Colab's
  Secrets as `GEMINI_API_KEY`. Runs on a CPU runtime.
- `BACKEND = "open"`: Qwen 2.5 (3B) from Hugging Face on a free Colab T4 GPU. No key.

## How it is built

The slides are one HTML page (`index.html`) on a small engine in `shared/`, with the talk in `parts/*.js` and the
figures drawn as SVG (`figures.js`, `widgets.js`). No number is typed into a slide: every number comes from a JSON
file in `data/`, written by a script in `scripts/sci/` that checks it. The real agent runs come from the notebook
(`data/traces/`), and published numbers were checked against primary sources (`SOURCES.md`).

```bash
python3 scripts/serve.py                      # http://127.0.0.1:8795/
```

```bash
node scripts/verify.mjs && node scripts/density.mjs && node scripts/export.mjs
```

To re-record the runs (needs `GEMINI_API_KEY`; changes the numbers on the slides):

```bash
RECORD_DIR=data/traces python3 scripts/build_notebook.py --run && python3 scripts/sci/traces.py
```

`AUTHORING.md` describes the conventions; `plan/slow-deck.md` the current shape of the deck (slower, with notebook
slides and the loop flowchart as a map).

## Credits

Illustrations generated with Google's Gemini image model (prompts in `plan/images.json`). Air-quality data: CAMS via
Open-Meteo (CC BY 4.0). Slide engine adapted from the ES 667 Deep Learning lectures.
