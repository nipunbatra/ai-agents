# AI agents talk (IITGN-X, 3 Dec 2026): notes for future sessions

- One deck: `index.html` + `content.js` (loads `parts/*.js` in order) + `kit.js` (slide helpers, `app()` for
  application slides, `partBreak`, `recap`) + `figures.js` (icons, three-lane traces `lanes()`, the loop `loopFig()`,
  chat bubbles `msg()`, the agent card) + `widgets.js` (SVG kit, live-figure registry) + `lecture.css`, on the shared
  engine in `shared/` (copied from `dl-summary`; `deck.js` takes the kicker from `meta.kicker`).
- Audience: working professionals (eMasters). High level, many applications, one light technical part (Part 2).
  65 minutes plus Q&A in a 90-minute slot.
- Colours mean roles everywhere: amber a person, purple the model, teal tools and the world, red risk, green a checked
  result, blue memory and data.
- Every number comes from `data/*.json` written by `scripts/sci/*.py`. Real runs: `notebook/agents.py` (percent-format
  source of `notebook/agents.ipynb`, built by `scripts/build_notebook.py`) records `data/traces/*.json` when run with
  `RECORD_DIR=data/traces`; `RECORD_ONLY=a,b` limits which recordings are overwritten. `scripts/sci/traces.py`
  condenses them and asserts what the slides claim (for example that the chatbot said the order does not matter).
  Re-recording changes the story: check the slides' text after it.
- Published numbers: only rows of `plan/research/verified.md` (checked 19 Nov 2026), with its wording notes; URLs in
  `SOURCES.md`.
- Illustrations: `scripts/make_images.py` with prompts in `plan/images.json` (Gemini image model). Do not read image
  files in the main session (they have crashed sessions); have a subagent look at them.
- House rules (from Nipun's other decks): one move per click; story line at most 30 words; a state at most 100 words;
  no em or en dashes; no slogans; no non-vegetarian examples; caveats in the notes. `AUTHORING.md` has them all.
- Voice: plain and literal, like Nipun's CLIP deck (nipunbatra.github.io/attention/clip/). No metaphors (engine,
  plug, dial, climb), no aphorisms, no meta lines. Titles are questions or literal statements. The organisers' session
  title, "The Engine of Autonomy", appears only on the cover's who-line and in the README.
- Check: `python3 scripts/serve.py` (port 8795), then `node scripts/verify.mjs`, `node scripts/density.mjs`,
  `node scripts/export.mjs` (PDFs in `exports/`). One part: `DECK_PART=03a node scripts/verify.mjs`.
- Prose passes: `node scripts/dump-lines.mjs > qa/lines.md` (titles, story lines, notes) and
  `node scripts/dump-text.mjs > qa/text.md` (visible body text and figure labels).
- Gemini prices change on 1 Jan 2027 (3.8 Flash doubles); the cost slides say so.
