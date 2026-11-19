# Authoring guide: The engine of autonomy (IITGN-X talk on AI agents, 3 Dec 2026)

Read this whole file before writing a slide. Then read `parts/00-opening.js` and `parts/01-what.js`: they are the
finished exemplars, and every part should read as if the same person wrote it. `plan/outline.md` has the plan of
every part.

## 1. What this deck is

A 65-minute talk (plus Q&A) for working professionals in IIT Gandhinagar's eMasters programme: engineers, managers
and analysts, smart and busy, not ML researchers. High level, with many applications and many figures. One idea runs
through it:

> An agent is a language model that can use tools, in a loop, until a goal is met. **The loop is the engine.** How
> much freedom (autonomy) to give the engine depends on what a mistake costs and how cheaply the result can be checked.

Every concrete run on the slides is real: it was recorded by running `notebook/agents.ipynb` with Gemini on 19 Nov
2026 (`data/traces.json`). Every published number is checked against its primary source
(`plan/research/verified.md`; the URLs go in `SOURCES.md`).

## 2. What you own, and what you must not touch

You own exactly the files named for your part in `plan/outline.md`, typically:

- `parts/NN-name.js`: your slides and your live figures
- `scripts/sci/pN.py`: records or computes every number your slides show that is not already in a shared data file
- `data/pN.json`: written by that script

Shared data you may read but not write: `data/traces.json` (real agent runs), `data/apps.json` (the fourteen
applications and their map positions), `data/metr.json`, `data/facts.json`, and the illustrations in `figures/`.

Do not edit `kit.js`, `widgets.js`, `figures.js`, `lecture.css`, `content.js`, `index.html`, `shared/`, `scripts/*.mjs`,
`notebook/`, another part's files, or anything outside `/Users/nipun/git/ai-agents`. Other authors write other parts at
the same time in this folder. If the kit lacks something, write a local helper in your part file and local styles with
`css('.pN-thing{…}')` (every class name starts with `pN-`). If you believe a kit change is needed, say so in your
report instead of making it.

Do not start, stop or restart any server. The deck is served at `http://127.0.0.1:8795` (no caching). Do not use git.
Do not install packages. Do not call any paid API. Do not read image files (`figures/*.jpg`) with the Read tool; refer
to them by name. You may look at your own slide screenshots in `qa/parts/NN/` (see section 7).

## 3. The shape of a part

1. `partBreak(k, title, lead, how, {line, ask, expected, transition, img, alt, nb})`: the aim in one sentence
   (`line`), a one or two sentence `lead`, three or four steps `how`, and the part's illustration
   (`img: 'part-what.jpg'`, already generated). Its id is `part-k`.
2. Content slides (`S_`, or `app()` in Part 3), with the ids in `plan/outline.md`. Before each group, name the chapter:
   `chap('2.1','A real run')`. The kicker shows it.
3. `recap(k, did, next, {card, hi, ask, expected, point, transition})`: two or three lines of what the part did, beside
   an agent card (`agentCard` slots: goal, model, tools, memory, stop, guard, human). Its id is `recap-k`.

Stay inside your part's click budget. One click is about 30 seconds on stage. If an idea does not fit, put it on an
appendix slide with `O('pN-something', title, {...})` (off the main route).

## 4. The kit (import only from `../kit.js`)

`kit.js` re-exports `shared/author.js`, `widgets.js` and `figures.js`; read all four (they are short) and `lecture.css`.

Slides

- `S_(id, section, title, {builds, body, lines[], ask[], expected[], point, misconception, transition, demo, source, nb})`.
  `lines`, `ask` and `expected` need exactly one entry per build. `lines[k]` is the story line under the slide at click k.
  `nb: nb('part-3')` puts a "▶ Notebook" link top right to that section of the Colab notebook (anchors `part-0` to `part-5`).
- `app(id, title, {img, alt, req, steps, names, tools, check, evidence, builds, factsAt, evidenceAt, lines, ask, expected, ...})`:
  the application slide (Part 3). It lays out the illustration, the request bubble, the three-lane trace (`lanes`) and a
  strip of facts. Steps after the first appear at click 2 unless they set `at`.
- `O(id, title, {...})`: an appendix slide. `partBreak`, `recap`, `chap`, `strip`: section 3.
- Text: `p(s)` (lead, 28px), `ps(s)` (26px), `small(s)` (caption), `takeaway(s)`, `answer(build, s)`, `request(s)`.
  Colour words by role: `kY()` a person (amber), `kA()` the model or agent (purple), `kT()` tools and the world (teal),
  `kR()` risk (red), `kG()` a checked result (green).
- Layout: `cols(left, right, '1fr 1.2fr')`, `at(build, html)` (appears from that click, keeps its space),
  `only('2', html)` / `only('3-4', html)` (shown only then; alternatives share one slot), `table(headers, rows)`,
  classes `.compare` (two columns with coloured top rules: `a` purple, `b` teal, `y` amber, `r` red), `.three`, `.four`,
  `.tiles` / `.tile`, `.steps`.
- Numbers: `num(v, 2)` (true minus sign), `big(12600)`, `word(7)` / `Word(7)` for small counts in prose.
- Code: `codeSteps([[0,'shown from the start'],[2,'shown from click 2'], …])`; `code(text)` for a static block.
- Data: `const D = need(await data('pN'), 'key1', 'key2');` at the top of the file (top-level await works).

Figures

- `figures.js`: `icon(name, cx, cy, size, colour)` and `iconHTML(name, colour, size)` with about 50 stroke icons
  (`ICONS`: person, spark, plug, search, code, terminal, globe, window, file, database, mail, calendar, chart, sensor,
  chat, mic, check, approve, alert, shield, lock, flask, leaf, thermo, building, pulse, rupee, clock, notes, branch,
  server, phone, bot, eye, pin, cart, zap, wind, pen, send, target, list, refresh, stop, tractor, image, robot, money,
  scale, key); `chip(icon, text, role)` a tool chip; `lanes(steps, opts)` the three-lane trace (you, agent, tools and
  world); `loopFig(opts)` the loop; `msg(who, html, {note, at})` a chat bubble of a real trace (`who`: you, model, call,
  tool, thought); `jsonHTML(obj)`; `agentCard(fill, {hi, title, sm})`; `ROLE` colours.
- `widgets.js`: `fig(W, H, inner, alt)` wraps SVG built from `label`, `line`, `arrow`, `path`, `dot`, `rect`, `pill`;
  `panel({...})` gives axes and scales; `bars(items, {...})`, `grid(M, {...})`, `chart(rows, {...})` (flowchart).
  Colours: `COL.target` (teal), `COL.guess` (purple), `COL.loss` (red), `COL.data` (blue), `COL.amber`, `COL.green`,
  `COL.ink`, and `MUTED`, `AX`.
- Inside an SVG, reveals are `gat(build, svg)` and `gonly(build, svg)`. `at()` and `only()` are HTML and break out of
  the SVG.
- SVG text scales with the figure. Size the viewBox to the column it sits in (full width is 1152 units, usable height
  about 450) and keep labels at 17 to 24.
- Illustrations: `illo('app-farmer.jpg', alt)` (all in `figures/`, listed in `plan/images.json`). They are generated
  images; use them as pictures, never as evidence.

Colours mean something everywhere, as on the slides so far: amber is a person, purple is the model, teal is tools and
the world, red is risk, green is a checked result, blue is memory and data. Keep that.

Live figures. A slide that argues about a setting (an autonomy level, a success rate, a number of steps, a price) gets a
control that changes it. Pattern (see `p1-autonomy` in `parts/01-what.js`):

- The slide places `widget('pN-name', 'alt text')`. The part file calls `register('pN-name', (el, ctx) => {…})`.
- First line inside: `if (ctx.printing) { el.innerHTML = <a static figure at a sensible setting>; return; }`.
- Otherwise build `'<div class="w-fig">' + svg + '</div><div class="w-controls">' + buttons + slider(...) + '</div>'`
  and redraw in `show()`. Sliders: `input` → `show()`, `change` → `blur()`. Buttons: toggle `aria-pressed`, `blur()`,
  `show()`. Call `show()` once. Blurring matters: the arrow keys must go back to moving through the slides.

## 5. Numbers

No number is typed into a part file. Every number a slide shows comes from a data file:

- Real runs: `data/traces.json`. Its keys: `alone`, `agent` (with `turns`: thought, calls, results, usage, cost),
  `check` (the six orders), `context`, `context_turns`, `memory`, `routing`, `analyst`, `research`, `inbox`, `farm`,
  `injection`, `injection_trials`, `steplimit`, `evals`, `price`, `date_text`, `model`. Read it before you plan.
- Published numbers: put them in your `scripts/sci/pN.py` as constants with a comment naming the source and the row of
  `plan/research/verified.md` it comes from, and write them to `data/pN.json`. Use only rows marked VERIFIED, or use the
  wording the notes in `verified.md` recommend (for example SWE-bench, Klarna, TPMG, Farmer.Chat). If a number is not
  there, leave it out; do not search the web for new ones.
- Counts in prose come from data too: `${Word(APPS.apps.length)} applications`, never a typed "Fourteen".

## 6. How Nipun wants slides

Pace and structure

- One move per click. A slide makes one point; a click adds one thing.
- Ask first. Where it fits, build 1 poses the question and the next clicks answer it.
- A flowchart (`chart`) or a trace (`lanes`) for any process of more than two steps. Pictures over bullet lists.
- Caveats, credits and "strictly speaking" go in the notes (`point`, `misconception`, `source`), off the slide.
- No non-vegetarian examples (no meat, fish or eggs in any analogy or illustration).

Density (checked by `scripts/density.mjs`)

- A story line is at most 30 words. A state (body + story line + half the SVG labels) is at most 100 words; aim under 70.
  A code block is at most 12 lines.
- The body never repeats the story line. The story line says what to look at or asks the question; the body shows it.
- Nothing may overflow the slide, and no two labels may touch. Leave air around a figure.

Words

- Plain, concrete sentences in the voice of a speaker talking to professionals ("we", "you"). No jargon without a
  one-line meaning. Indian examples where natural (₹, Gujarat, UPI, monsoon, cumin).
- No slogan fragments ("One loop. Every agent."), no forced groups of three, no "X, not Y" endings, no rhetorical
  "It's not just A, it's B", no decorative bold, no emojis, no title case in headings, no hype words ("revolutionary",
  "game-changing", "unlock" except in the talk's given title).
- No em dashes or en dashes anywhere, on slides or in notes. Write ranges as "1 to 4". Curly quotes are fine.
- Shared terms: "agent", "the model", "tool", "the loop", "a trace" (one recorded run), "a step" (one model turn),
  "a tool call", "autonomy", "a guardrail", "an eval" (a test set you run the agent on), "the context" (what the model
  reads each turn). Write "a person" or "you", not "the human".

Notes (the speaker's script; fill them in for every build)

- `ask[k]`: what to ask the audience at click k. `expected[k]`: the answer you hope for.
- `point`: the one sentence the slide exists for. `misconception`: the common wrong belief, when there is one.
- `transition`: the sentence that leads to the next slide. `demo`: what to show live in the notebook, if anything.
- `source`: one short line under the slide: where the example or number comes from (and "illustration: generated").

## 7. Checking your work (required before you report)

From `/Users/nipun/git/ai-agents` (every Bash command should start with `cd /Users/nipun/git/ai-agents;`):

```
node --check parts/NN-name.js
DECK_PART=NN node scripts/verify.mjs          # every click rendered; screenshots in qa/parts/NN/
DECK_PART=NN node scripts/density.mjs         # word counts per click
```

`verify` must print `"passed": true`. `density` must print `over a limit: none`. Then look at the screenshots in
`qa/parts/NN/` (they are small JPEGs of your own slides; read them with the Read tool) at every click, and fix what you
see: text over a figure, labels that touch, a figure too small to read from the back of a room, an answer visible
before its click, a slide that looks empty at build 1. Repeat until a careful reader would find nothing to fix.

Things that have gone wrong before

- `builds` must equal the lengths of `lines`, `ask` and `expected`, or the deck throws.
- A slide must fit at its final build; `at()` keeps the space of hidden things, so check build 1 for big holes.
- `verify` fails on SVG text that crosses the viewBox edge, on any `h2, p, pre, .display, table, li` outside the 60px
  side margins, on content taller than the slide, and on a missing image.
- `register()` throws on a name used twice; a `widget()` with no `register()` throws at mount.
- `table()` does not escape its cells: pass HTML you trust, and escape anything else with `esc()`.
- Model text from traces contains Markdown (`**bold**`, `$\text{PM}_{2.5}$`): strip or shorten it before showing it.
- To view your part in a browser: `http://127.0.0.1:8795/?all&part=NN#slide-id/2`.

## 8. Your report

End with a short report (plain text, no file):

1. The slides in order: id, builds, one line each. The total number of clicks against your budget.
2. The live figures: name, what the control changes.
3. Numbers: which come from traces, which are published (with the `verified.md` row), anything you left out.
4. The last output of `verify` and `density`, and a statement that you looked at every screenshot.
5. Anything you were unsure about, anything left undone, and any kit change you would ask for.
