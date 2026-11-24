# The deck, third version: brief for every part (24 Nov 2026)

Nipun's verdict on the second version: "okayish at best". The opening example (an air-quality trip) was boring. He
asked for:

- **A realistic agent**: one that runs `bash`, reads a file, writes a file, edits a file.
- **Three examples people can follow** in a notebook that really runs, on an open model (Gemma 4, in Colab).
- **Slides he does not have to modify**: beautiful flow, beautiful intuitions, animations, not a lot of text, code
  nicely highlighted.

Earlier feedback still holds: slow, one idea per slide; the talk alternates with the notebook; no history; plain,
spoken language; a loop map with "we are here".

`parts/00-opening.js` and `parts/01-what.js` are written this way. **Read them first.** They are the model for every
other part.

## The story

One small project folder (a stationery shop's `workspace/`) and one small agent: an open model, four tools
(`read_file`, `write_file`, `edit_file`, `bash`) and a loop. Everything on the slides is a recorded run of the
notebook (`data/traces.json`).

| Part | What happens | Notebook |
|---|---|---|
| Opening | Two tests fail. We ask in one sentence. An agent fixes it. | |
| 1 · From a model to an agent | The model alone; one tool; the reply is a request; four tools; the loop; the bug-fix run round by round; we check its work. | 1.1 to 1.7 |
| 2 · Inside one run | What the model reads each round (it only grows); the instructions; notes that outlast a run (`NOTES.md`). | 2.1, 2.2 |
| 3 · The same agent, other jobs | Tidy a messy folder; check invoices against orders. Then the same loop in industry, and how much freedom each job should get. | 3.1, 3.2 |
| 4 · How agents fail | Small errors add up; a file with hidden instructions; ask before a risky command; a step limit; an eval on two model sizes. | 4.1 to 4.6 |
| 5 · Agents in your organisation | Workflow or agent; should this task be an agent; raising autonomy in steps; cost; what changes for a team; your turn. | 5.1, 5.2 |

The three examples people follow: **A** fix a failing test (Part 1), **F** tidy a messy folder (3.1), **E** check
supplier invoices against purchase orders (3.2).

## The notebook sections (exact numbers and titles)

| Number | Title |
|---|---|
| 1.1 | The model on its own |
| 1.2 | Write a tool |
| 1.3 | Ask again, with the tool |
| 1.4 | Run the request, return the result |
| 1.5 | Four tools |
| 1.6 | Put it in a loop |
| 1.7 | Check the work |
| 2.1 | What the model read each round |
| 2.2 | Notes that outlast a run |
| 3.1 | Tidy a messy folder |
| 3.2 | Check invoices against orders |
| 4.1 | Small errors add up |
| 4.2 | A file with hidden instructions |
| 4.3 | The same file, ten runs |
| 4.4 | Ask before a risky command |
| 4.5 | A step limit |
| 4.6 | An eval: ten runs per model |
| 5.1 | Give it your own task |
| 5.2 | Write your own tool |

4.3 and 4.6 take minutes; their notebook slides say "start it and come back".

`notebook/agents.py` is the source. Read the section you are making slides for, so the slide's `run` lines and
wording match the real code.

## The data: `data/traces.json` (written by `scripts/sci/traces.py`)

Every run is condensed to the same shape:

```
{goal, status, answer, rounds, calls, tokens_read, tokens_written, seconds, model, inr_hosted,
 log:   [{read, written, seconds}]            one entry per round
 steps: [{round, name, args, exit, result}]}  one entry per tool call; exit is the shell exit code for bash
```

Top-level keys:

- `model`, `date_text`, `hosted` (a hosted model's price, for the cost slide);
- `alone`, `request`, `agent` (+ `before`, `after`), `check`: Part 1;
- `memory` `{first, later, notes}`: Part 2;
- `tidy` (+ `check`, `tree`, `index`, `inbox`, `right`, `dated`, `failed_commands`): 3.1;
- `invoices` (+ `check`, `report`, `invoices`, `orders`, `right`, `problems`): 3.2;
- `injection` `{note, task, open, gated}` (each side a run + `asked`, `tried`, `secret_reached_model`,
  `secret_in_answer`), `injection_trials` `{n, tried, reached, leaked}`: 4.2, 4.3;
- `approval` (+ `asked`, `files_left`): 4.4;
- `steplimit`: 4.5;
- `evals.models[]` `{name, n, fixed, touched_tests, median_seconds, median_rounds, stopped, runs}`: 4.6.

**Never type a number, a command or a model's words that the data holds.** The runs will be recorded once more before
the talk, and the slides must follow. Where a sentence depends on how a run went, build it from the data (counts with
`word()`, conditions in code), and add an assert to `scripts/sci/traces.py` for any claim that could turn false.

## The screens (`stage.js`, exported through `kit.js`): compose slides from these

| Helper | What it draws |
|---|---|
| `editor(file, code, {lang, focus, notes, size, at, from})` | A dark code editor. `focus: {2: [4, [6, 8]]}` dims all other lines at build 2. `notes: {4: ['text', colour, [builds]]}` puts a small tag at the end of a line. `lang`: `python`, `json`, `bash`, `text`. |
| `term(rows, {title, size})` | A terminal. Rows: `{cmd, at}` is typed; `{out, kind, at}` is output (`ok`, `bad`, `dim`, `hot`). |
| `testRows(step, {at})`, `bashRows(step, {at, lines})` | Terminal rows for a recorded `bash` step. |
| `diff(file, rows, {plusAt, size})` | A change: rows `[' ', text]`, `['-', text]`, `['+', text]`. |
| `tree(title, rows, {marks, size})` | The project folder. `marks: {'billing.py': [['2', 'read']]}` tags a row at those builds (`read`, `edit`, `new`, `run`, `gone`, `risk`). |
| `toolCall(name, args, {at, note, max})` | The model's request as a purple card. |
| `toolBack(text, {kind})`, `says(text, {who})` | A short result; the model's words. `firstSentence(answer)` trims an answer. |
| `loopStrip({model: '1', tool: '2', result: '2'}, {round})` | The loop as a strip that lights up where we are. |
| `statement(html, sub)` | One big sentence, for a beat between sections. |
| `loopMap({hi, guards, text, cols, here})` | The full flowchart (figures.js), with "We are here". |
| `nbRun(id, section, '3.1', 'Tidy a messy folder', {run, look, line, ...})` | An "In the notebook" slide. |

Layout classes: `.duo` (two columns; set `--l` and `--r`), `.duo.top`. Sizes for windows: `''` (21px), `'s'` (18px),
`'xs'` (16px, avoid), `'l'` (24px).

Motion is automatic: things fade and rise when they appear, terminal commands type, output follows, diff lines slide
in, tree tags pop. Do not add JavaScript animation. Everything must still read as a still picture (the PDF).

## What a good slide looks like here

- **One idea, one screen.** A slide is usually a short title, one or two screens, and a story line. Two builds.
- **Show the real thing.** The command the model wrote, the output that came back, the file as it was.
- **Very little text on the slide.** Aim for 40 words a click state; `density.mjs` fails at 75. The story line is at
  most 25 words, ideally 12 to 18.
- **Fill the slide.** A lone 150px object in the middle of the slide looks unfinished. Use the larger window size,
  put two screens side by side, or use `statement()`.
- **Nothing under 16px on screen**, and code must never be cut off at the right edge of a window (`verify` fails on
  it: use fewer characters per line, a smaller size, or a wider column).
- **A run is walked in rounds**: `loopStrip` + `toolCall` on the left, the screen on the right, as in Part 1's
  `run-*` slides.

## Voice

Plain, literal, spoken: "we", "you", short sentences, real numbers. Titles are a plain question or a literal
statement ("It runs the tests, and reads the failure"). No metaphors, no slogans, no "X, not Y" flourishes, no forced
triples, no meta lines ("Notice…"), no filler, no history as narrative, no em or en dashes, no gendered pronouns for
people in examples. Call a model turn a "round". Say "a person approves".

## Rules that still hold (AUTHORING.md)

- Colours mean roles: amber a person, purple the model, teal tools and the world, red risk, green a checked result,
  blue memory and data.
- `builds` must equal the lengths of `lines`, `ask` and `expected`.
- Published numbers only from `plan/research/verified.md`, worded as verified.
- Check your part: `DECK_PART=02 node scripts/verify.mjs` must pass, `DECK_PART=02 node scripts/density.mjs` must
  report nothing over a limit, and you must look at your screenshots in `qa/parts/02/`. The server is on port 8795.
