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

The talk builds one small agent and then uses it: an open model (Gemma 4), four tools (`read_file`, `write_file`,
`edit_file`, `bash`) and a loop of about twenty lines, working on a small project folder. It moves between the slides
and the notebook. A slide titled **"In the notebook"** names a numbered section (1.1, 1.2, …); the notebook has the
same section, and the slide after it shows our own recorded run of it.

| Part | |
|---|---|
| Opening | Two failing tests, a one-sentence request, and an agent that fixes the code |
| 1 · From a model to an agent | The model on its own; one tool; the reply as a request; four tools; the loop as a flowchart and as code; the bug-fix run round by round; checking its work |
| 2 · Inside one run | What the model reads each round; the instructions; notes that outlast a run |
| 3 · The same agent, other jobs | Tidy a messy folder; check supplier invoices against orders; the same loop in real products; how much freedom each job should get |
| 4 · How agents fail | Errors that add up; a file with hidden instructions; approvals, a safe list and a sandbox; a step limit; an eval on two model sizes |
| 5 · Agents in your organisation | Workflow or agent; should this task be an agent; raising autonomy in steps; cost; what changes for a team |

## The notebook

`notebook/agents.ipynb` builds the agent from scratch in plain Python, with no framework, and runs every example in
the talk. It uses Google's open model **Gemma 4** through [Ollama](https://ollama.com), so it needs no key and no
account: in Colab, choose a T4 GPU and run the cells (the first one installs Ollama and downloads the model, about
8 GB). On a laptop, install Ollama and run the same notebook. To use a hosted model instead, set
`BACKEND = "gemini"` and supply a Gemini API key.

Three examples to follow along with, all with the same four tools:

1. **Fix a failing test** (Part 1): the agent runs the tests, reads the code, changes one line, and runs them again.
2. **Tidy a messy folder** (3.1): ten badly named files, sorted into folders and renamed by date and sender.
3. **Check invoices against orders** (3.2): six supplier invoices, three with a problem, flagged with the reason.

## How it is built

The slides are one HTML page (`index.html`) on a small engine in `shared/`, with the talk in `parts/*.js` and the
figures drawn as SVG and HTML (`figures.js`, `widgets.js`, and the editor, terminal, diff and file-tree screens in
`stage.js`). No number is typed into a slide: every number comes from a JSON
file in `data/`, written by a script in `scripts/sci/` that checks it. The real agent runs come from the notebook
(`data/traces/`), and published numbers were checked against primary sources (`SOURCES.md`).

```bash
python3 scripts/serve.py                      # http://127.0.0.1:8795/
```

```bash
node scripts/verify.mjs && node scripts/density.mjs && node scripts/export.mjs
```

To re-record the runs the slides show (Gemma 4 served locally by llama.cpp; the numbers on the slides follow):

```bash
sh scripts/serve_gemma.sh 12b & sh scripts/serve_gemma.sh e4b &
RECORD_DIR=data/traces AGENT_BASE_URL=http://127.0.0.1:8791/v1 AGENT_SERVERS='{"gemma4:e4b":"http://127.0.0.1:8792/v1"}' python3 scripts/build_notebook.py --run
python3 scripts/sci/traces.py && python3 scripts/check_sync.py
```

`AUTHORING.md` describes the conventions; `plan/slow-deck.md` is the brief for the current deck: the story, the data, the
screen components (`stage.js`) and the voice.

## Credits

Illustrations generated with Google's Gemini image model (prompts in `plan/images.json`). Air-quality data: CAMS via
Open-Meteo (CC BY 4.0). Slide engine adapted from the ES 667 Deep Learning lectures.
