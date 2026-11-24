# The slower deck: brief for the rewrite (Nov 2026)

Nipun's feedback on the deck: the slides are intimidating. There is too much on each slide. He wants:

1. **More slides, fewer things on each.** Slow down.
2. **A live example wherever one helps.** Run it in the notebook, then show it on a slide.
3. **The talk alternates between slides and the notebook**, in step. The deck says when to switch.
4. **No historical context.** No timelines and no "in 2023 ... in 2025".
5. **Natural spoken language.** It should sound like a teacher talking to a room.
6. **Flowcharts where they help**, shown again with "we are here" on the box being discussed.

`parts/00-opening.js` and `parts/01-what.js` are already rewritten this way. Read them first: they are the model for
every other part.

## The shape of a slide now

- **One idea per slide.** Two builds is normal; three is the most. One build is fine.
- **Story line (`lines[k]`): 25 words or fewer**, ideally 12 to 20. Say it the way you would say it out loud.
- **A state (body + story line + half the SVG labels): aim for 50 words or fewer.**
  - `scripts/density.mjs` fails at 75 and warns at 50.
  - If a state is over 50, split the slide.
- **Fewer elements.** Drop secondary captions, extra tiles and "facts strips" where they crowd. Move caveats and
  credits into the notes (`point`, `misconception`, `source`).
- **Bigger type is fine** when a slide has less on it. Do not shrink text to fit more in: split instead.
- **If an old slide had 3 to 6 builds, it is now 2 to 3 slides.**

## Voice

The voice is plain, literal and spoken: "we", "you", short sentences, real numbers.

**Titles** are a plain question or a literal statement. Good examples from Part 1:
- "What can a model not do on its own?"
- "The reply is a request, not an answer"
- "Our run went round three times"
- "Was the agent right?"
- "Some jobs have fixed steps"

**Story lines** say what we did or what happened, or ask the room a question. Good examples:
- "The model replied with a request in a fixed format: which tool, and with which arguments."
- "Doing this by hand, one request at a time, gets tedious. A real task may need ten rounds."
- "Three cities, three days, one city a day. Which order means the cleanest air? What would you answer?"

**Avoid:**
- metaphors (engine, plug, dial, climb, stall);
- aphorisms and slogans;
- "X, not Y" endings used for effect;
- forced groups of three;
- meta lines ("Notice…", "The picture shows…", "Here is the key idea");
- filler ("It is worth noting", "Importantly", "In today's world");
- history and dates as narrative;
- em or en dashes anywhere (write "1 to 4");
- gendered pronouns for people in examples.

Curly quotes are fine.

## The two new helpers (in `kit.js` and `figures.js`; do not edit those files)

### `nbRun(id, section, num, title, {run, look, line, ask, expected, point, transition})`

This is a notebook slide: the moment we switch to the notebook and run section `num` live.
- `run` is the one or two key lines of code (a few lines at most).
- `look` is one or two things to watch for.
- The title becomes "In the notebook: <title>".
- `num` and `title` must match the notebook section exactly (list below).
- The slide right after a notebook slide shows **our recorded run** from `data/traces.json`, so the talk goes on if
  the live run is slow or fails. Its story line usually starts from what happened ("Our run…", "Here is what came
  back…").

Example from Part 1:

```js
nbRun('nb-ask','what','1.3','Ask again, with the tool',{
 run:'reply = chat(messages, tools=[get_air_quality])\nprint(reply["calls"])',
 look:['The reply has no answer in it','What does it ask for?'],
 line:'Back to the notebook. Same question, same model, but now the tool is on offer.',
 ask:'What do you think comes back this time?',expected:'Not an answer. Watch the reply.',
 point:'With a tool on offer, the model can reply with a request instead of an answer.',
 transition:'Here is what came back in our run.'});
```

### `loopMap({hi, at, text, icons, guards, here})`

The agent loop as a flowchart: the talk's map. Its boxes are `goal`, `model`, `ask` (the decision), `tool`, `result`
and `answer`. With `guards:true` it also has the pills `gate` ("A person approves") and `limit` ("Step limit").

- `hi:'model'` (or an array of boxes) highlights that box with a "We are here" tag and fades the rest. Use it on short
  "where are we" slides, with a one-sentence story line, whenever a part moves to a different part of the loop.
- `text:{tool:'Our code runs\nthe calculator'}` relabels a box.
- `at:{tool:2}` reveals a box on click 2.

It is full width, about 420px tall, so give it a slide of its own, or add only a one-line `ps()` under it.

Part 1 builds it up box by box (`loop-map`). After that, the other parts show it with `hi` to say where we are:

| Part | Boxes to highlight |
|---|---|
| 2 | `model` (what it reads), `result` (the context grows), `tool` (MCP) |
| 4 | the failures mapped to boxes; `gate` and `limit` with `guards:true` |
| 5 | the summary |

## The notebook sections (exact numbers and titles; notebook/agents.py is being changed to match)

| Number | Title | Slides |
|---|---|---|
| 1.1 | The model on its own | opening |
| 1.2 | Write a tool | Part 1 |
| 1.3 | Ask again, with the tool | Part 1 |
| 1.4 | Run the request, return the result | Part 1 |
| 1.5 | Put it in a loop | Part 1 |
| 1.6 | Check the answer | Part 1 |
| 2.1 | What the model read each round | Part 2 |
| 2.2 | Notes that outlast a run | Part 2 |
| 2.3 | Routing: one call picks the queue | Part 2 |
| 3.1 | A data analyst | Part 3 |
| 3.2 | A research assistant with sources | Part 3 |
| 3.3 | An inbox assistant that asks first | Part 3 |
| 3.4 | A farm advisory, written and checked | Part 3 |
| 4.1 | Small errors add up | Part 4 |
| 4.2 | An email with hidden instructions | Part 4 |
| 4.3 | The same email, ten runs | Part 4 |
| 4.4 | A step limit | Part 4 |
| 4.5 | An eval: ten runs per model | Part 4 |
| 5.1 | Write your own tool | Part 5 |
| 5.2 | One tool for every agent: MCP | Part 5 |

Notes on the long runs:
- **4.3 and 4.5** take a few minutes. Their notebook slides say so: "start it now, we come back to the result".
- **3.1** (the analyst) takes about a minute.

A "round" is one model turn (Part 1 calls them rounds: "Our run went round three times").

## Time budget, as built (20 Nov 2026): about 85 minutes, then 5 for questions

| Part | Minutes | Main-route slides | Clicks | Notebook stops |
|---|---:|---:|---:|---:|
| Opening | 4 | 5 | 6 | 1 |
| Part 1 | 17 | 21 | 33 | 5 |
| Part 2 | 14 | 19 | 32 | 3 |
| Part 3 | 25 | 33 | 60 | 4 |
| Part 4 | 15 | 21 | 30 | 5 |
| Part 5 | 7 | 11 | 17 | 1 |
| Wrap-up | 3 | 3 | 6 | 0 |
| Total | 85 | 113 | 184 | 19 |

The estimate is about 20 seconds a click plus about a minute per notebook stop. Start 4.3 and 4.5 early, and come back to them.

## Part 3: which applications stay on the main route

There are fourteen applications in all. The main route keeps nine. The other five become appendix slides: the same
`app()` call with `section:'optional', optional:true`. The stakes map at the end still places all fourteen.

- **Main route:**
  - coding;
  - data analysis (notebook 3.1);
  - research (notebook 3.2);
  - customer support, with the inbox assistant run (notebook 3.3);
  - AlphaEvolve;
  - farm advisory (notebook 3.4);
  - air-quality alerts;
  - building energy;
  - clinic notes.
- **Appendix:** invoices, IT incidents, web forms, co-scientist, lab robot.

Each main-route application is two slides at a slower pace:
1. **The task.** The illustration, the request, and the question "what would it need?", with the tools as chips.
2. **What it does.** A trace with fewer steps (five to seven), and who checks what, plus one number of evidence if
   there is one.

For the four notebook applications the order is: the task → the notebook slide → our recorded run (one or two
slides).

## Rules that still hold (see AUTHORING.md)

- **Numbers come from `data/*.json`.** Never type a number that a data file has.
- **Colours mean roles.** Amber is a person, purple the model, teal tools and the world, red risk, green a checked
  result, blue memory and data.
- **No non-vegetarian examples.**
- **`builds` must equal the lengths of `lines`, `ask` and `expected`.**
- **Check your part:**
  - start the server with `python3 scripts/serve.py`; it is already running on port 8795;
  - `DECK_PART=02 node scripts/verify.mjs` must pass;
  - `DECK_PART=02 node scripts/density.mjs` must report nothing over a limit;
  - look at your screenshots in `qa/parts/02/` with the Read tool.
