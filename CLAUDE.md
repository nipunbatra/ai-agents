# AI agents talk (IITGN-X, 3 Dec 2026): notes for future sessions

- One deck: `index.html` + `content.js` (loads `parts/*.js` in order) + `kit.js` (slide helpers, `app()` for
  application slides, `partBreak`, `recap`) + `figures.js` (icons, three-lane traces `lanes()`, the loop `loopFig()`,
  chat bubbles `msg()`, the agent card) + `widgets.js` (SVG kit, live-figure registry) + `lecture.css`, on the shared
  engine in `shared/` (copied from `dl-summary`; `deck.js` takes the kicker from `meta.kicker`).
- Audience: working professionals (eMasters). About 80 minutes plus Q&A in a 90-minute slot.
- Third version (24 Nov 2026). Nipun found v1 too dense, v2 "okayish at best" with a boring example (an air-quality
  trip). v3 is built around one small, realistic agent: Gemma 4, four tools (`read_file`, `write_file`, `edit_file`,
  `bash`), a loop, on a made-up shop project. Three examples he chose: fix a failing test (Part 1), tidy a messy
  folder (3.1), check invoices against orders (3.2). `plan/slow-deck.md` is the brief: read it before editing a part.
- What he wants from slides: slow, one idea per slide, very little text, beautiful flow and intuitions, code nicely
  highlighted, animations, and nothing he has to fix himself. The talk alternates with the notebook through `nbRun`
  slides whose numbers match the notebook's sections; `loopMap` and `loopStrip` show "we are here".
- Screens (`stage.js`): `editor`, `term`, `diff`, `tree`, `toolCall`, `says`, `loopStrip`, `statement`. Motion is CSS
  that plays when an element appears; print and reduced motion show the final state.
- Colours mean roles everywhere: amber a person, purple the model, teal tools and the world, red risk, green a checked
  result, blue memory and data.
- Every number comes from `data/*.json`. The runs: `notebook/agents.py` (percent-format source of
  `notebook/agents.ipynb`, built by `scripts/build_notebook.py`; sections 1.1 to 5.2, anchors `nb-1-1` …) records
  `data/traces/*.json` when run with `RECORD_DIR=data/traces`; `scripts/sci/traces.py` condenses them into
  `data/traces.json` and asserts what the slides claim. Recording uses Gemma 4 served by llama.cpp
  (`scripts/serve_gemma.sh`; model files in an HF cache on the external SSD, because the internal disk is full);
  the notebook itself defaults to Ollama. Re-recording changes the story: slides must build sentences from the data.
- The notebook's Colab path (Ollama + `gemma4:12b` on a T4) has not been run from here; only the local path has.
- Published numbers: only rows of `plan/research/verified.md` (checked 19 Nov 2026), with its wording notes; URLs in
  `SOURCES.md`.
- Illustrations: `scripts/make_images.py` with prompts in `plan/images.json` (Gemini image model). Do not read image
  files in the main session (they have crashed sessions); have a subagent look at them.
- House rules (from Nipun's other decks): one move per click; story line at most 25 words; a state at most 75 words (aim 50);
  no em or en dashes; no slogans; no non-vegetarian examples; caveats in the notes. `AUTHORING.md` has them all.
- Voice: plain, literal and spoken, like Nipun's CLIP deck (nipunbatra.github.io/attention/clip/); no history. No metaphors (engine,
  plug, dial, climb), no aphorisms, no meta lines. Titles are questions or literal statements. The organisers' session
  title, "The Engine of Autonomy", appears only on the cover's who-line and in the README.
- Check: `python3 scripts/check_sync.py`; `python3 scripts/serve.py` (port 8795), then `node scripts/verify.mjs`, `node scripts/density.mjs`,
  `node scripts/export.mjs` (PDFs in `exports/`). One part: `DECK_PART=03a node scripts/verify.mjs`.
- Prose passes: `node scripts/dump-lines.mjs > qa/lines.md` (titles, story lines, notes) and
  `node scripts/dump-text.mjs > qa/text.md` (visible body text and figure labels).
- The cost slide prices our tokens at a hosted model (`traces.hosted`, Gemini 3.8 Flash on 19 Nov 2026; its price
  doubles on 1 Jan 2027).
