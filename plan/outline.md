# Outline: The engine of autonomy (IITGN-X, 3 Dec 2026, 65 minutes + Q&A)

Read `AUTHORING.md` first, then `parts/00-opening.js` and `parts/01-what.js` (done; the exemplars). Slide ids in
**bold** are fixed (other parts link to them). Builds are a plan: you may move a click between slides of your part,
but stay inside the part's budget. "#n" refers to row n of `plan/research/verified.md`; use its wording notes.

| Part | Section | File(s) | Data | Clicks (max) | Minutes |
|---|---|---|---|---|---|
| Opening (done) | `open` | `parts/00-opening.js` | metr, facts, traces, apps | 11 | 6 |
| 1 What an agent is (done) | `what` | `parts/01-what.js` | traces | 18 | 10 |
| 2 Inside the engine | `engine` | `parts/02-engine.js` | `p2` | 25 | 12 |
| 3a Agents at work: part break, knowledge work, operations | `work` | `parts/03a-work.js` | `p3a` | 19 | 10 |
| 3b Agents at work: science, India and sustainability, the map | `work` | `parts/03b-work.js` | `p3b` | 19 | 10 |
| 4 When the engine stalls | `risk` | `parts/04-risk.js` | `p4` | 17 | 9 |
| 5 Agents in your organisation | `adopt` | `parts/05-adopt.js` | `p5` | 12 | 6 |
| Wrap (lead author) | `wrap` | `parts/06-wrap.js` | | 4 | 2 |

What the audience already has when your part starts: Part 1 defined the agent (model, tools, loop), the tool call
(the model writes a request, our program runs it), the agent card (goal, model, tools, memory, stops when,
guardrails, person), workflow versus agent, and the autonomy dial (Feng, McDonald and Zhang's five levels, operator to
observer, on a refund task). The opening showed the running example: **three city visits (Delhi, Ahmedabad, Pune),
which order breathes the least PM2.5**, run for real with Gemini 3.8 Flash: three forecasts at once, six sums at once,
answer Pune, Ahmedabad, Delhi (210.2 against 259.9 µg/m³ for the worst order). Reuse that run; do not invent another.

---

## Part 2: Inside the engine (`parts/02-engine.js`, data `p2`, 25 clicks)

`partBreak(2, 'Inside the engine', …, {img:'part-engine.jpg', nb:nb('part-2')})`. Lead: open the bonnet on one real
run: what the model reads each turn, how it picks a tool, how it remembers, and the few patterns most systems use.

1. **`trace-walk`** (6 builds), `chap('2.1','One real run')`. The opening run (`traces.agent.turns`), one event per
   click: the request; turn 1 (its thought summary, shortened, and the three forecast requests); the three results
   (one compact bubble); turn 2 (the six sums, compact); the six results; turn 3, the answer. Beside it a meter that
   grows per click: tokens read and written per turn (`usage`), running cost in ₹ (`cost_inr`), seconds. The story
   line says what to notice (it reread everything each turn; it asked for independent things at once). Fit it: one
   line per event on the left, bars on the right; use `only()` windows if needed.
1b. **`loop-code`** (3). The whole loop as about ten lines of Python (`codeSteps`, simplified `run_agent` from the
   notebook), with think, act and observe marked beside it. Frameworks add retries, logs and permissions around it.
2. **`tool-menu`** (2). What the model actually knows about a tool: name, description, parameters. Copy the real
   `get_air_quality` docstring and parameters from `notebook/agents.py` into `p2.py` (say so in the source line).
   Build 2: a vague description beside it (`get_data(x): gets data`) and why the model would misuse it. Point: the
   description is the only manual the model gets; write it like a note to a new colleague.
3. **`context`** (2). What the model reads every turn: a stacked bar of `traces.context` (instructions, tool menu,
   task, tool results, in tokens) and the growth over turns (`traces.context_turns`). Build 2: "context
   engineering": choosing what goes in. Karpathy's phrase is SECONDARY (#21): attribute in the notes only.
4. **`memory`** (2), `chap('2.2','Memory')`. The context is forgotten when the run ends; notes are not. Real run
   `traces.memory`: an earlier run saved "the user has asthma"; the next run read its notes first, then asked for two
   forecasts, and recommended Pune for that reason. Build 1 the two runs as bubbles; build 2 the three kinds of memory
   as pictures (the context as a desk, notes as a notebook, retrieval from documents as a filing cabinet).
5. **`patterns`** (3), `chap('2.3','Patterns')`. Anthropic's workflow patterns (#19f, plan/research/concepts.md), one
   per click, each a small diagram with a real example: prompt chaining; routing (real: `traces.routing`, four
   customer messages including one in Hindi, each sent to billing, technical or other); parallelisation (real: the
   three forecasts at once).
6. **`patterns-2`** (2). Orchestrator and workers (Anthropic's multi-agent research system #17: a lead agent and
   parallel subagents beat a single agent by 90.2% on their research eval, using about 15 times the tokens of a chat);
   evaluator and optimizer (real: `traces.farm`, a writer drafts a Gujarati WhatsApp advisory from the real forecast, a
   critic checks it against a five-point list, the writer revises; show rounds and verdicts).
7. **`mcp`** (3), `chap('2.4','A common plug')`. Build 1: four models wired to five tools one by one (20 custom
   connectors, drawn). Build 2: MCP in the middle (9 connections). Build 3: what it is and who adopted it: announced
   by Anthropic 25 Nov 2024 (#19e); donated to the Linux Foundation's Agentic AI Foundation on 9 Dec 2025, co-founded
   by Anthropic, Block and OpenAI (#19l). Do not quote server counts (unverified).
8. **`recap-2`** (1). Card: the memory agent (tools read_notes, save_note, forecast; memory: a notes file).

## Part 3a: Agents at work, first half (`parts/03a-work.js`, data `p3a`, 19 clicks)

Every application uses `app()` with its illustration `figures/app-<id>.jpg` (ids as in `data/apps.json`), the
request, a trace of five to eight steps in the three lanes, tool chips, what a person checks (amber), and evidence.
Evidence is either a verified number (#n) or a real run from `traces.json`; where there is none, say in the source
line that the trace is a design, not a deployed system. Steps labels: at most two short lines of about 10 characters.

1. **`part-3`**: `partBreak(3,'Agents at work', …, {img:'part-work.jpg', nb:nb('part-3')})`. Lead: the jobs agents
   already do, in four families (count from `data/apps.json`), each on the same card.
2. **`read-card`** (1). How to read a card, on the opening run as a `lanes()` figure with callouts: amber is you,
   purple the agent deciding, teal tools acting, a filled amber step is a person approving, "×3" calls made at once.
3. `chap('3.1','Knowledge work')`. **`app-coding`** (3). A failing test after yesterday's change: run tests, read
   code, find the cause, edit, rerun, open a pull request, a person reviews and merges. Evidence at build 3 (#16, use
   its suggested framing): vendor-reported SWE-bench Verified rose from 33% (GPT-4o, Aug 2024) to 81% (Claude Opus 4.5,
   Nov 2025); in Feb 2026 OpenAI stopped reporting it as contaminated. Optionally Stack Overflow 2025 (#24): 84% of
   developers use or plan to use AI tools, 23% use agents at least weekly.
4. **`app-research`** (2). A cited market scan. Trace: plan, many searches at once, read pages, write, cite, a person
   checks the key claims. Evidence: our real research run (`traces.research`: two tool calls, an answer with a URL
   after each claim).
5. **`app-analyst`** (3). Real run (`traces.analyst`): last winter's PM2.5 in ten cities; describe the table, run
   pandas, run pandas again to draw, answer. Build 3: the agent's own chart (copy `data/traces/p3-analyst-chart-1.png`
   to `figures/p3a-analyst-chart.png` in `p3a.py`, if it exists; otherwise draw the bars from the numbers in the
   answer) and its headline (which city, how many days over 60 µg/m³). Notes: CAMS model estimates, not stations.
6. **`app-documents`** (2). Invoices: read, match the purchase order, flag mismatches, a person handles exceptions,
   post. A design; tie it to Part 1's workflow slide (mostly a workflow, an agent only for exceptions).
7. `chap('3.2','Operations')`. **`app-support`** (3). The refund (same order 5512, ₹3,200 as Part 1): read, look
   up the order, check policy, refund under a cap or escalate, reply. Evidence at build 3: Klarna (#1: 2.3 million
   conversations in the first month, two-thirds of chats, resolution from 11 to under 2 minutes) and its 2025 turn
   (#2: the CEO said cost had been too dominant and quality fell; it now offers people for some cases).
8. **`app-incident`** (2). A 2 a.m. alert after a deploy: read alert, query logs and metrics, link to the deploy,
   propose a rollback, the on-call engineer approves, roll back, watch metrics, write the note. A design.
9. **`app-browser`** (2). Renewing a trade licence on a government portal: open, fill, upload, check against
   documents, a person confirms before paying, submit. Evidence (#18): on OSWorld people complete 72.36% of tasks; the
   best model in the 2024 paper managed 12.24%; on the OSWorld-Verified leaderboard (Aug 2026) the best single model
   scores 85.96%.

## Part 3b: Agents at work, second half (`parts/03b-work.js`, data `p3b`, 19 clicks)

1. `chap('3.3','Science and engineering')`. **`app-coscientist`** (2). Google's AI co-scientist (19 Feb 2025, built
   on Gemini 2.0, #9): generate, debate, rank in a tournament, evolve, a scientist picks, a lab tests. Evidence: it
   proposed the mechanism Imperial College researchers had found but not yet published; Google's paper says in two
   days.
2. **`app-lab`** (2). Coscientist (Nature, 20 Dec 2023, #10): searched documentation, planned, wrote code for a
   liquid-handling robot and ran palladium-catalysed cross-couplings. FutureHouse's Robin (20 May 2025, #11)
   proposed ripasudil as a candidate for dry age-related macular degeneration (cell experiments; people ran the lab).
3. **`app-evolve`** (2). AlphaEvolve (14 May 2025, #12): propose code, an automatic evaluator scores it, keep the
   best, mutate. Results: 0.7% of Google's worldwide compute recovered; 4×4 complex matrices with 48 multiplications;
   a 23% faster kernel, 1% less Gemini training time. Point: the check is automatic, so it can run unattended.
4. `chap('3.4','India and sustainability')`. **`app-farmer`** (3). A cumin farmer near Mehsana asks by voice, in
   Gujarati, when to irrigate. Trace: speech to text, the forecast (real, `traces.farm.forecast`), crop notes, a
   draft, the critic's check, a voice reply; an extension worker handles pest photos. Build 3: the real Gujarati
   advisory that passed the critic (`traces.farm.rounds`), with its English gist in the notes. Evidence (#13, #14):
   Kisan e-Mitra answers in 11 languages, 95 lakh+ queries, 20,000+ a day (PIB, Sep 2025); Digital Green's
   Farmer.Chat: 1.6 to 3 million farmers, 10+ languages, 6 countries.
5. **`app-air`** (2). A city air-quality desk, every morning: station data, the CAMS forecast, find hotspots, draft an
   advisory for schools and hospitals, an officer approves, send. A design; evidence from our data
   (`traces.analyst`: days over the standard last winter in the worst cities, CAMS estimates).
6. **`app-building`** (2). Campus energy: occupancy, weather forecast and tariff, plan pre-cooling, simulate, the
   facilities manager approves, set the schedule, meter, weekly report. A design.
7. **`app-clinic`** (2). An ambient scribe: listen (with consent), transcribe, draft the note, the doctor reviews and
   signs, file it. Evidence (#15): The Permanente Medical Group, 7,260 physicians and about 2.58 million encounters
   from Oct 2023 to Dec 2024, about 15,800 hours of documentation saved (say "in about 15 months").
8. **`stakes-map`** (3), live figure `p3b-map`. `data/apps.json`: x is how easy the result is to check, y what a
   mistake costs; the four zones and their advice. Build 1: axes and zones; build 2: the fourteen points (coloured by
   family); build 3: the rule (autonomy where checking is cheap, a person where mistakes are costly). Click a point to
   see its `why`. Print: every point labelled. The positions are the speaker's judgement: say so on the slide.
9. **`recap-3`** (1).

## Part 4: When the engine stalls (`parts/04-risk.js`, data `p4`, 17 clicks)

1. **`part-4`**: `partBreak(4, 'When the engine stalls', …, {img:'part-risk.jpg', nb:nb('part-4')})`.
2. **`compound`** (3), live figure `p4-compound`, `chap('4.1','Errors compound')`. Sliders: success per step and
   number of steps; a toggle for "check each step and retry once" (state the simple model on the slide). Build 1 asks:
   95% per step, 20 steps, how often is the whole task right? Build 2: 36%. Build 3: checking changes the curve.
   `p4.py` computes the numbers the slide quotes.
3. **`failures`** (2). Real cases: Replit's agent deleted a production database during a code freeze (Jul 2025, #4,
   secondary); Air Canada was held to what its chatbot promised (Feb 2024, CAD 812.02, #3, secondary); our own agent
   called a failing tool four times until the step limit stopped it (`traces.steplimit`). Build 2: the lesson for each.
4. **`injection`** (3), `chap('4.2','Poisoned inputs')`. The real test: one email in the demo inbox hides an
   instruction to the assistant (`traces.injection.email`, highlight the hidden part in red). Build 2: what the model
   did (`traces.injection_trials`: how often it tried to forward the invoices, and how often it warned about the fake
   bank-details email, per model). Build 3: the same attack in real products: EchoLeak in Microsoft 365 Copilot
   (CVE-2025-32711, Jun 2025, #5), the GitHub MCP server (May 2025, #6), Perplexity Comet (Aug 2025, #8).
5. **`trifecta`** (2). Willison's lethal trifecta (16 Jun 2025, #7): access to private data, exposure to untrusted
   content, the ability to communicate externally. Build 2: our inbox agent had all three; the approval gate on
   send_email cuts the third (`traces.injection.gate`: nothing leaked).
6. **`guardrails`** (3), `chap('4.3','Guardrails')`. Before (least privilege, read-only by default, a sandbox),
   during (approval for irreversible steps, step and budget limits), after (logs of every trace, evals, monitoring).
   One layer per click, as a picture.
7. **`evals`** (2). Measure before you trust: `traces.evals`, the opening task run ten times on two models (right
   answers, mean cost in ₹, seconds). Build 2: what an eval is (ten to a hundred real cases with known answers, run on
   every change) and what this one showed.
8. **`recap-4`** (1).

## Part 5: Agents in your organisation (`parts/05-adopt.js`, data `p5`, 12 clicks)

1. **`part-5`**: `partBreak(5, 'Agents in your organisation', …, {img:'part-adopt.jpg', nb:nb('part-5')})`.
2. **`should-agent`** (3). A decision flowchart (custom SVG, branches): does the path change case by case (no: a
   workflow)? can the result be checked cheaply (no: the agent drafts, a person decides)? can a mistake be undone (no:
   approval before that step)? otherwise let it run with spot checks and logs. It should match the zones of the map.
3. **`ramp`** (2). Start small and climb: shadow mode (it suggests, a person does), copilot (it does, a person
   approves each), autonomy for routine cases with spot checks. Climb a step when the evals say so. A staircase.
4. **`cost`** (3), live figure `p5-cost`. Cost of one task: the model's tokens times the price (real: the opening
   run, `traces.agent.usage`; prices `traces.price`; note #20: Gemini 3.8 Flash's price doubles on 1 Jan 2027), against
   a person's review time (sliders: steps, model, review minutes, cost of an hour). Point: the model is the cheap
   part; checking is the cost, so design tasks that are cheap to check. Agents use about 4 times the tokens of a chat,
   multi-agent systems about 15 times (#17).
5. **`skills`** (2). What changes for a team: writing goals and tool descriptions, reading traces, building evals.
   Evidence: Anthropic Economic Index (Sep 2025, #26), directive use rose from 27% to 39%, and 77% of business API use
   is automation; Gartner (Jun 2025, #23) expects over 40% of agentic AI projects to be cancelled by 2027, for cost,
   unclear value or weak risk controls.
6. **`recap-5`** (1).
