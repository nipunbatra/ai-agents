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

| Part | |
|---|---|
| Opening | One request sent to a chatbot and to an agent (a real run); three eras of AI assistants; METR's measure of how long a task agents can finish |
| 1 · What an agent is | A model, tools and a loop; the agent card; workflow or agent; the autonomy dial (operator to observer) |
| 2 · Inside the engine | One real run step by step, with tokens and cost; the tool menu; the context; memory; five patterns; MCP |
| 3 · Agents at work | Fourteen applications in four families (knowledge work, operations, science, India and sustainability), and where each sits on a map of "what a mistake costs" against "how easy the result is to check" |
| 4 · When the engine stalls | Errors that compound; real failures; prompt injection and the lethal trifecta; guardrails; evals |
| 5 · In your organisation | Should this be an agent; a ramp to autonomy; the cost of a task; what changes for a team |

## The notebook

`notebook/agents.ipynb` builds an agent from scratch in plain Python (no framework) and runs every example in the
talk: the air-quality trip planner, a data analyst on ten Indian cities' PM2.5, a research assistant that cites
Wikipedia, an inbox assistant with an approval gate, a Gujarati farm advisory with a writer and a critic, a poisoned
email, a step limit, and an evaluation over ten runs. Choose the backend in the first cell:

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

`AUTHORING.md` describes the conventions; `plan/outline.md` the plan of every part.

## Credits

Illustrations generated with Google's Gemini image model (prompts in `plan/images.json`). Air-quality data: CAMS via
Open-Meteo (CC BY 4.0). Slide engine adapted from the ES 667 Deep Learning lectures.
