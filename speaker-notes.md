# The engine of autonomy: speaker notes

Planned main route: 65 minutes, including student responses. Optional slides are outside this budget.

## Pacing

| Part | Minutes |
|---|---:|
| Opening | 6 |
| Part 1 · What an agent is | 10 |
| Part 2 · Inside the engine | 12 |
| Part 3 · Agents at work | 20 |
| Part 4 · When the engine stalls | 9 |
| Part 5 · Agents in your organisation | 6 |
| Wrap-up | 2 |

## title: The engine of autonomy

**Build 1:** The picture on the right is the whole idea. By the end of the talk every part of it will mean something.

- Ask: Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them carry out a task for them?
- Expected: Most hands go up for the first question and few for the second. That gap is the subject of the talk.

**Point here:** An agent is a model that acts: it uses tools in a loop until a goal is met.

**Transition:** Let us start with one request, sent to two systems.

**Source:** Slides, notebook and sources: github.com/nipunbatra/ai-agents

## ask-vs-do: The same request, two systems

**Build 1:** Typed into two systems on 19 November 2026. The question needs the next three days of air, which no model has memorised.

- Ask: Which of the two would you trust with this decision, and why?
- Expected: The one that checks real data. Hold the answer until both have replied.

**Build 2:** The chatbot answers fluently from training data. It sounds sure, and it never looked anything up.

- Ask: What did the chatbot get wrong?
- Expected: It could not know the forecast, so it said the order does not matter. The forecast says the worst order means 24% more PM2.5 than the best.

**Build 3:** The agent asked for three forecasts, added up all six orders, and answered with the numbers.

- Ask: What did the agent do that the chatbot could not?
- Expected: It asked for live data, then reasoned over it. Same model; the difference is the tools and the loop.

**Point here:** Both answers came from the same model. The agent had tools and a loop that used them.

**Common misconception:** That agents run on a different, smarter kind of model. Both answers here came from the same model.

**Notebook:** Run Part 1 of the notebook live: the model alone, then run_agent with the air-quality tool.

**Transition:** This shift, from answering to acting, happened in about four years.

**Source:** Both replies are real (Gemini 3.8 Flash, 19 November 2026, notebook Part 1); the request is shortened here. Forecast: CAMS via Open-Meteo.

## eras: From answering to acting, in four years

**Build 1:** First, a model that answers. You type, it writes back, and the conversation is all it knows.

- Ask: What could ChatGPT not do at launch that you now take for granted?
- Expected: Look things up, run code, read your files, act on websites.

**Build 2:** Then the model learns to ask for tools in a format programs can read, even to operate a screen, and tools get a common plug called MCP.

- Ask: Why would a fixed format for tool requests matter so much?
- Expected: Because then any program can read the request and carry it out. It is the bridge from text to action.

**Build 3:** Now products hand the model a goal and let it work for minutes or hours.

- Ask: Which of these have you used?
- Expected: Many will have used deep research or a coding assistant; few will have let an agent act on a website.

**Point here:** The models improved, and the larger change came from giving them tools and letting them run in a loop.

**Transition:** How long a task can such an agent now finish on its own? Someone measures that.

**Source:** Dates from the companies’ announcements; see SOURCES.md.

## horizon: How long a task can an agent finish on its own?

**Build 1:** METR times how long each task takes a skilled person, then finds the task length an agent finishes half the time. In 2019: about 3 seconds.

- Ask: What would you guess the number was for the first ChatGPT models?
- Expected: Under a minute: they could finish only tiny, self-contained steps.

**Build 2:** GPT-4 in 2023: about 4 minutes. Claude 3.7 Sonnet in early 2025: about 60 minutes of a person’s work.

- Ask: What kind of tasks take a skilled person an hour?
- Expected: Fixing a small bug, writing a short analysis, cleaning a dataset: tasks with several steps and checks.

**Build 3:** In 2026, about 12 hours. Our fit to METR’s data since 2023: the length doubles about every 4 months.

- Ask: If the trend held for two more years, what would that mean for your work?
- Expected: Six doublings, so tasks of months. Treat it as a trend line and no more: the tasks are mostly software, and success is only 50%.

**Point here:** Agents are getting better at long tasks fast, and the measure is human working time, which managers understand.

**Common misconception:** The 12 hours for Claude Opus 4.6 has a 95% interval of about 5 to 61 hours, and the doubling time is our own fit (METR’s published fits: about 196 days over the whole trend, about 89 days for models since 2024). Also: 50% success on a 12-hour task does not mean it does your 12-hour job. It fails half the time, the tasks are self-contained software tasks, and the 80% horizon is several times shorter.

**Transition:** So what is inside these agents? Here is today’s route.

**Source:** Vertical axis: length of task (time a skilled person needs) that the agent completes half the time, log scale. METR Time Horizon 1.1 (metr.org/time-horizons), fetched 2026-11-19; bars are 95% intervals; hollow points are above 16 hours.

## route: Today’s route

**Build 1:** The talk has five parts. You can run everything in a Colab notebook, with a free Gemini key or an open model.

- Ask: Which part matters most for your work?
- Expected: Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.

**Point here:** A map of the talk, so the audience knows the applications and the risks are coming.

**Transition:** Part 1: what an agent is.

**Source:** Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb).

## part-1: Part 1 · What an agent is

**Build 1:** By the end of this part you can say, in one sentence, what makes a chatbot an agent.

- Ask: In your own words, what is an AI agent?
- Expected: Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we will sharpen them.

**Transition:** Start with what a model is on its own.

**Source:** Illustration: generated (Gemini image model).

## alone: On its own, a model only writes text

**Build 1:** A model reads text and writes the most likely next words. However clever it sounds, that is all it does.

- Ask: If a model only predicts words, how did it write a correct-looking answer about Delhi’s air?
- Expected: From patterns in its training text: Delhi is usually polluted in winter. Plausible, unchecked.

**Build 2:** So on its own it cannot see today’s data, cannot be trusted with long sums, cannot act, and forgets you.

- Ask: Which of these limits matters most in your job?
- Expected: Usually live data and acting on systems. Both are fixed the same way: with tools.

**Point here:** A language model is a text predictor. Everything an agent adds comes from outside the model.

**Common misconception:** That newer models “know” current facts. They know their training data, which ends at a cut-off date.

**Transition:** So how does a text predictor get at a forecast? It asks.

## tool-call: A tool call is a request written as text

**Build 1:** Given an air-quality tool, the model replies with a request, written in a format a program can read.

- Ask: Who actually fetched the forecast: the model or our program?
- Expected: Our program. The model only wrote the request.

**Build 2:** Our code calls the forecast service and puts the result back into the conversation.

- Ask: Why is it safer that the model only writes requests?
- Expected: Because our program decides which requests to carry out. That is where guardrails live (Part 4).

**Build 3:** Now the model has facts to reason over, and it answers with them.

- Ask: What else could a tool be?
- Expected: Anything with an interface: a database query, sending an email, a calculator, a search, a robot arm.

**Point here:** Function calling: the model writes a structured request, your code executes it and returns the result.

**Common misconception:** That the model connects to the internet itself. It never does; your code does, and only for the tools you gave it.

**Notebook:** Notebook 1.2: print the request, run get_air_quality by hand, hand back the result.

**Transition:** Do that over and over, automatically, and you have an agent.

**Source:** Real request and result from the run on 19 November 2026 (Gemini 3.8 Flash); one of the three requests it made at once.

## the-loop: The loop is the engine

**Build 1:** Think: the model reads everything so far and decides what to do. Act: our code runs the tools it asked for.

- Ask: What decides whether the loop goes round again?
- Expected: The model: if its reply contains a tool request, the loop continues; if not, that reply is the answer.

**Build 2:** Observe: the results join the conversation, and the model thinks again, now with more facts.

- Ask: Why did it ask for six sums in one go?
- Expected: They do not depend on each other, so it asked for all of them at once. We told it to (Part 2).

**Build 3:** It stops when it answers, or when a limit is hit. Our run took three turns: two rounds of tool calls, then the answer.

- Ask: What would make the loop never stop?
- Expected: A tool that keeps failing, or a goal that is never met. So we always set a step limit (Part 4).

**Point here:** An agent is a model, tools and a loop: think, act, observe, until done.

**Notebook:** Notebook 1.3: run_agent prints each turn in these colours.

**Transition:** Seven questions describe any agent. Here they are for this one.

**Source:** The turns of the real run on 19 November 2026: 21 seconds of model time, about ₹0.78 at paid prices.

## agent-card: Seven questions describe any agent

**Build 1:** Goal, model and tools make an agent work. Here they are for the run we just watched.

- Ask: Which of the seven would you check first before letting an agent near your work?
- Expected: Usually tools and guardrails: what can it touch, and what can it change?

**Build 2:** The other four make it safe to use. Parts 3 to 5 come back to each of them.

- Ask: Which of these four is missing from most demos you have seen?
- Expected: Guardrails and the person. Demos show the happy path.

**Point here:** The agent card: goal, model, tools, memory, stopping rule, guardrails, person.

**Transition:** Not every job needs this much freedom. Sometimes a fixed workflow is better.

## workflow: A workflow or an agent?

**Build 1:** A workflow: the steps are written down in advance, like an invoice that is always read, matched and posted.

- Ask: Is processing an invoice a workflow or an agent?
- Expected: A workflow, mostly; an agent only for the odd invoice that does not match.

**Build 2:** An agent: the model chooses the next step each time, as ours did when it decided to add up six orders.

- Ask: What in our air-quality task could not be fixed in advance?
- Expected: How many lookups and sums were needed depended on the request and the data.

**Build 3:** Workflows are cheaper and more predictable. Pay for an agent only when the path really varies.

- Ask: Name one task in your team that is really a workflow.
- Expected: Monthly reports, onboarding checklists, standard approvals.

**Point here:** Anthropic’s distinction: workflows follow predefined code paths; agents direct their own process and tool use.

**Common misconception:** That everything with a language model in it should be an agent. Most production systems are workflows.

**Transition:** And when it is an agent, how much freedom do we give it?

**Source:** Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).

## autonomy: Autonomy is a dial you set

**Build 1:** The same refund at three of the five settings; you can drag the dial to the others. At level 1 you do the work.

- Ask: At which level does the agent first touch a real system?
- Expected: Level 2: it looks up the order. Reading is low risk.

**Build 2:** At level 4 the agent does everything up to the refund, then waits for your approval. Notice where the amber step sits.

- Ask: Why put the approval just before the refund, and not at the start?
- Expected: Because the refund is the step that cannot be undone. Everything before it is cheap to redo.

**Build 3:** At level 5 you only read the log. Which level would you allow for refunds in your company?

- Ask: What would make you move this dial up a notch?
- Expected: Evidence: a test set of past refunds it handles correctly, and a cap on the amount (the support example in Part 3).

**Point here:** Autonomy is a design decision, separate from how capable the model is. You choose the level per task.

**Common misconception:** That a more capable model should automatically get more autonomy. Capability and permission are different questions.

**Notebook:** Drag the dial from 1 to 5 and watch the person’s steps move from doing to approving to watching.

**Transition:** Part 1 in one slide.

**Source:** The five levels and their names: Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (arXiv 2506.12469, 2025). The refund is from the notebook’s demo inbox.

## recap-1: Part 1 in one slide

**Build 1:** Next: one real run, step by step, with what the model read and what it cost.

- Ask: Which line of the card would change if this agent could also book your train tickets?
- Expected: Tools (a booking tool), guardrails (a spending cap) and the person (approve before paying).

**Point here:** The vocabulary for the rest of the talk.

**Transition:** Part 2: inside the engine.

## part-2: Part 2 · Inside the engine

**Build 1:** By the end of this part you can read a trace and say what the model saw, and paid for, at each step.

- Ask: When an agent “thinks”, what do you imagine is going on inside?
- Expected: Answers vary: it plans, it searches, it reasons. Keep them; the next slides show that each step is the model reading a growing text and writing a short reply.

**Transition:** Start with the run from the opening, one event at a time.

**Source:** Illustration: generated (Gemini image model).

## trace-walk: One run, one event at a time

**Build 1:** The opening request, replayed one event per click. On the right: tokens read and written per turn (a token is about ¾ of a word), and the cost.

- Ask: What do you expect the model to do first?
- Expected: Look up the forecasts. It cannot know them.

**Build 2:** Turn 1: a short thought, then three forecast requests in one go, since none depends on another. It read 284 tokens to decide that.

- Ask: Why ask for all three forecasts at once, instead of one at a time?
- Expected: They do not depend on each other, so one turn is enough, and each turn saved is one fewer reread of the whole conversation. Our instructions also asked for this.

**Build 3:** Our code fetches the three forecasts. The model is idle meanwhile; it sees the numbers only when we call it again.

- Ask: While the forecasts are fetched, what is the model doing?
- Expected: Nothing. The model is not running; it is a function we call. Between calls, only our code runs.

**Build 4:** Turn 2 rereads everything, now 1,020 tokens, and asks for six sums at once, one per order.

- Ask: Why did turn 2 read far more than turn 1?
- Expected: It rereads the instructions, the tool menu, the task, its own first turn and the three results. Every turn starts from the full conversation.

**Build 5:** Six totals come back from the calculator. The model did not add up a single number itself.

- Ask: Why not let the model add the numbers itself?
- Expected: Models predict digits and slip on long sums. A calculator is exact and cheap, so the agent hands arithmetic to a tool.

**Build 6:** Turn 3 reads 2,464 tokens and answers: 20.7 seconds and ₹0.78 in all. The pale blue is text it had already read the turn before.

- Ask: Where did most of the cost go: reading or writing?
- Expected: Here, writing: 1,466 tokens written cost 1.9 times the 3,768 read, since a written token costs five times as much. In long runs reading takes over, because it is repeated every turn.

**Point here:** An agent run is a few model calls, each rereading the whole conversation, with tools run by our code in between. This one took three turns: two rounds of tool calls, then the answer.

**Common misconception:** That the model keeps running and “remembers” between turns. It is called afresh each turn and reads everything again.

**Notebook:** Notebook 2.1: print each turn’s tokens read and written for your own run.

**Transition:** That replay is driven by a few lines of ordinary code. Here they are, once.

**Source:** Real run, 19 November 2026, Gemini 3.8 Flash (notebook Part 1.3). Paid prices: $0.75 in, $3.75 out per million tokens, thinking counted as output; ₹93.5 per dollar.

## loop-code: The whole engine, in eleven lines

**Build 1:** This is the loop, simplified from the notebook. Keep a list of messages; each step, hand the whole list to the model and add its reply.

- Ask: Which line is the model, and which lines are ordinary code?
- Expected: Only chat() calls the model. Everything else is plain Python that we wrote and can read.

**Build 2:** Act and observe: run every tool it asked for and add each result to the list. A tool that fails returns its error as a result.

- Ask: Why send an error back to the model instead of crashing?
- Expected: The model can read the error and try something else: another city spelling, another tool. Crashing would end the run.

**Build 3:** Stop when a reply asks for nothing more, or at the step limit. Frameworks wrap these same lines with retries, logging and permissions.

- Ask: What would happen with no step limit?
- Expected: A model that keeps asking for tools would loop for ever and spend money doing it. The step limit is the first guardrail (Part 4).

**Point here:** An agent is an ordinary loop around one model call. Our code runs the tools, keeps the list of messages and decides when to stop.

**Common misconception:** That agent frameworks contain some deeper machinery. They wrap this loop with conveniences: retries, tracing, memory, permissions.

**Notebook:** Notebook 1.3: run_agent is this loop with printing, an approval check, and error handling.

**Transition:** Each step, the model chose a tool from a menu. What exactly is on that menu?

**Source:** Simplified from run_agent in notebook/agents.py (Part 1.3). The real one also asks a person before any tool marked for approval.

## tool-menu: What the model knows about a tool

**Build 1:** This is everything the model knows about the forecast tool: a name, a description and two parameters. It never sees our Python code.

- Ask: If you were the model, which part would you read most carefully?
- Expected: The description. It says what comes back, in what units, and from when (tomorrow), so the model could match it to the dates of the trip.

**Build 2:** Suppose the entry said only get_data(x): gets data. The model would have to guess. Write each description like a note to a new colleague.

- Ask: What would a new colleague ask about get_data?
- Expected: Which data, what x means, what comes back. Every question you would ask, the model must guess.

**Point here:** The description is the only manual the model gets. Write it like a note to a new colleague: what it does, what comes back, in what units, with an example.

**Common misconception:** That a capable model will work out what a tool does from its name. It cannot see the code; a vague tool gets misused.

**Notebook:** Notebook 1.2: print(get_air_quality.schema) shows this entry, built from the docstring and type hints.

**Transition:** The menu is one part of what the model reads every turn. What else is in there?

**Source:** The real entry, from get_air_quality’s docstring and type hints in notebook/agents.py (copied into scripts/sci/p2.py), laid out with line breaks and with “Pune” in single quotes. get_data is made up.

## context: What the model reads, every turn

**Build 1:** The context is everything the model reads in a turn. Turn 3 read 8.7 times what turn 1 did. Most of it is the conversation so far.

- Ask: Which part of the context would you have guessed was biggest?
- Expected: Most guess the instructions or the tool results. It was the conversation so far, which the model rereads every turn.

**Build 2:** Context engineering is deciding what goes in each turn. Every token is paid for, and too much text buries what matters.

- Ask: In a long run, what would you trim first?
- Expected: Old tool results and long histories: summarise them, or keep them in notes and fetch them when needed. Then the tool menu: offer only the tools the task needs.

**Point here:** The model knows only what is in its context this turn, and you pay to send all of it, every turn. Andrej Karpathy described context engineering (X, 25 Jun 2025) as filling the context window “with just the right information for the next step”.

**Common misconception:** That a bigger context window solves this. Long contexts cost more per turn, and models attend less well to what is buried in the middle.

**Notebook:** Notebook 2.1: the token count of each part, and the turn-by-turn growth.

**Transition:** The context is wiped when a run ends. So how does an agent remember you next week?

**Source:** Real run, 19 November 2026. The four parts were counted separately with Gemini’s token counter; “its own earlier turns” is the rest of turn 3’s 2,464 tokens, formatting included.

## memory: The context forgets; notes do not

**Build 1:** When a run ends, its context is gone. This agent kept a note in a file; a later run asked for it alongside the forecasts.

- Ask: Why did the later run ask for its notes at all?
- Expected: The read_notes tool says it holds preferences and facts about the user, and the question said “for me”. It asked for the notes and both forecasts in the same turn.

**Build 2:** Agents use three kinds of memory. Which one would hold your company’s policy manual?

- Ask: Which kind of memory would hold your company’s policy manual?
- Expected: The filing cabinet: documents it searches and quotes (retrieval). Notes are for short facts about a user or a task; the context is only today’s desk.

**Point here:** Memory that outlasts a run is text the agent saves with a tool and reads back with a tool; the model itself does not change.

**Common misconception:** That the model learns from your conversations as it goes. Its weights do not change; it remembers only what someone stores and feeds back.

**Notebook:** Notebook 2.2: run the two conversations; open agent_notes.md in between.

**Transition:** With tools, a loop and memory, we can build bigger systems. Most are made of five patterns.

**Source:** Real run, 19 November 2026 (notebook Part 2.2): two turns: one round of tool calls (three at once), then the answer. The earlier request and the answer are shortened here. Drawings: made for the slide.

## patterns: Five patterns, three of them here

**Build 1:** Most systems are built from a few patterns. A fixed trip, always three named cities and six sums, could be a chain; ours let the model choose.

- Ask: Where in your work is a fixed sequence of steps with a check in the middle?
- Expected: Report preparation, invoice processing, onboarding: draft, check, then send.

**Build 2:** Routing, on four real customer messages: one quick model call picks the queue, including for the message in Hindi.

- Ask: Why use a model to route, rather than keywords?
- Expected: Keywords miss paraphrases and other languages. “मेरा रिफंड अभी तक नहीं आया” (my refund has not arrived yet) has no English keyword, and still went to billing.

**Build 3:** Parallelisation: ask for independent things at once. Our agent fetched three forecasts in one turn, and did six sums in the next.

- Ask: What stops you running everything in parallel?
- Expected: Dependencies: the sums needed the forecasts first. Parallel steps must not need each other’s results.

**Point here:** Workflows built from a few patterns are cheaper and more predictable than a free-running agent. Use the simplest pattern that works.

**Common misconception:** That every AI system needs a free-running agent. Chains and routers are workflows, and most production systems are workflows.

**Notebook:** Notebook 2.3: route the four messages; add one of your own.

**Transition:** The other two patterns use several model calls that work together.

**Source:** The five patterns: Anthropic, “Building effective agents” (19 Dec 2024). Routing: real (19 November 2026, notebook 2.3); parallel calls: the opening run; the chain is a design.

## patterns-2: Patterns with several model calls

**Build 1:** Orchestrator and workers: a lead agent splits the job and sends subagents off in parallel. Anthropic measured both the gain and the extra tokens.

- Ask: Why would several agents beat one on a research question?
- Expected: Each subagent explores one direction with a clean context, and they run at the same time. The price is many more tokens.

**Build 2:** Evaluator and optimizer: one call writes, another checks against a list, the writer revises. Our Gujarati farm advisory passed in round one.

- Ask: Why use a second model call to check the first, rather than asking the writer to be careful?
- Expected: A separate check with an explicit list catches what the writer misses, and the list is something a person can read and change. It is a cheap eval run on every draft.

**Point here:** Multi-agent systems buy quality with tokens: Anthropic reports agents use about 4× the tokens of a chat, multi-agent systems about 15×. Use them for tasks valuable enough to pay for that.

**Common misconception:** That more agents are always better. For most tasks a single agent, or a workflow, is cheaper and easier to debug.

**Notebook:** Notebook 3.4: the writer and critic on today’s forecast; change the checklist and watch the critic fail a draft.

**Transition:** All these patterns need tools. Connecting four models to five tools is where the plumbing gets expensive.

**Source:** Anthropic, “How we built our multi-agent research system” (13 Jun 2025). Farm advisory: real run, 19 November 2026 (notebook Part 3.4), forecast for Mahesāna; the checklist is shortened here.

## mcp: One plug instead of a tangle of wires

**Build 1:** Four models, five tools. Without a standard, every pair needs its own connector: 20 pieces of glue code to write and keep working.

- Ask: If you add one more tool, how many new connectors do you write?
- Expected: One per model: 4 more, and every model vendor has to do it.

**Build 2:** With one common plug, each model and each tool implements it once: 9 connections. Drag the sliders and watch the gap grow.

- Ask: And with the common plug?
- Expected: One: the new tool speaks MCP, and every model that speaks MCP can use it.

**Build 3:** That plug is MCP, the Model Context Protocol. It began at one company and now belongs to a neutral foundation.

- Ask: Why would competitors agree to share one standard?
- Expected: Because their customers want every tool to work with every assistant. A neutral owner makes it safe to depend on.

**Point here:** MCP turns an n × m integration problem into n + m: write a tool once, and any agent that speaks MCP can use it.

**Common misconception:** That MCP makes tools safe. It standardises how tools are connected; a poisoned tool result travels through it just as easily (Part 4).

**Notebook:** Notebook Part 5: the forecast tool from this talk, served as an MCP server in a dozen lines.

**Transition:** Part 2 in one slide.

**Source:** Anthropic, “Introducing the Model Context Protocol” (25 Nov 2024); Linux Foundation, Agentic AI Foundation (9 Dec 2025). Counts on the slide are arithmetic: n × m against n + m.

## recap-2: Part 2 in one slide

**Build 1:** Next: the jobs agents already do, each drawn on the same card.

- Ask: What would you want this agent to remember about you, and what should it never write down?
- Expected: Preferences help it; but a health condition is sensitive data. Decide what may be stored, for how long, and who can read the notes.

**Point here:** The engine is a loop that rereads its context; tools, memory and patterns are what we build around it.

**Transition:** Part 3: agents at work.

## part-3: Part 3 · Agents at work

**Build 1:** By the end of this part you can say, for any job, how much freedom its agent should get.

- Ask: Which job in your team would you hand to an agent first?
- Expected: Answers vary: reports, ticket triage, data clean-up, first drafts. Keep two of them; we place them on a map at the end of the part.

**Point here:** Agents already do real work in many fields, and drawing each one the same way lets us compare them.

**Transition:** First, how to read a trace.

**Source:** Illustration: generated (Gemini image model).

## read-card: How to read a trace

**Build 1:** The opening run, drawn as a trace. Time runs left to right; the row says who acts. Under each one: tools, checks, evidence.

- Ask: Where in this run did a person have a say?
- Expected: Only at the two ends: you asked, and you read the answer. In every trace that follows, look for where the person sits.

**Point here:** Every application in this part is drawn as the same kind of trace, so you can compare who decides, what acts, and where a person checks.

**Transition:** The first family: knowledge work, starting with code.

**Source:** The opening run (Gemini 3.8 Flash, 19 November 2026): nine tool calls in three steps.

## app-coding: Coding: from a failing test to a pull request

**Build 1:** It works on a copy of your code: run the tests, read, edit, run them again.

- Ask: The tests pass now. Is the job done?
- Expected: Not yet. Passing tests say the failure has gone; whether the fix is the right one is a reviewer’s call.

**Build 2:** It stops at a pull request: a proposed change that a person reviews and merges.

- Ask: Why stop at a pull request instead of merging the fix itself?
- Expected: Merging is the step everyone else depends on. A review takes minutes, and the tests already did most of the checking.

**Build 3:** How good are coding agents? Look at a public test built from real GitHub issues.

- Ask: What does a score on this test tell you about your own code?
- Expected: Less than it seems: the 500 tasks come from public Python projects, the scores come from vendors, and the test leaked into training data. Developers use the tools anyway: 84% use or plan to use AI tools, and 23% use agents at least weekly (Stack Overflow, 2025).

**Point here:** A coding agent can do most of the work because tests check it in seconds, and a person approves the merge. On the stakes map at the end of Part 3: “Agent acts, a person approves” (tests run in seconds; merging is the step a person approves).

**Common misconception:** That 81% is the record. Anthropic reported 93.9% for its restricted Mythos Preview (Apr 2026), and the independent leaderboard tops out at 79%. All are claims on a test that has leaked; run your own evals (Part 4).

**Transition:** Code comes with tests. Research does not.

**Source:** Trace: a sketch of how coding agents such as Claude Code or Codex typically work. SWE-bench Verified scores as the vendors published them. Illustration: generated.

## app-research: Research: a market scan with sources

**Build 1:** It plans, searches many sources at once, reads, and writes a report with a link after each claim.

- Ask: Every claim has a link. Can you forward the report to your manager?
- Expected: Not yet. A link says a source exists. Someone has to open it and read the sentence it supports.

**Build 2:** A person checks the claims that matter. A small run of ours shows why a link alone is not enough.

- Ask: Which claims would you check first?
- Expected: The numbers, and the claims a decision rests on. In our run every link went to one Wikipedia page, and that page described the programme’s original 2019 targets. The programme has since been revised, which is exactly why a person opens the link before quoting.

**Point here:** A research agent saves the reading, but its citations still have to be opened, so its report is a draft. On the stakes map at the end of Part 3: “Agent drafts, a person decides” (citations must be opened and read to be checked).

**Common misconception:** That a citation proves a claim. A model can attach a plausible link to a sentence the page does not support; only reading the source checks it.

**Notebook:** Notebook 3.2: the research assistant searches Wikipedia, reads one page, and answers with a link after each claim.

**Transition:** Data analysis is easier to check: the code can be rerun.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. Our run: notebook 3.2 (Gemini 3.8 Flash, 19 November 2026), two tool calls. Illustration: generated.

## app-analyst: Data analysis: a real run on last winter’s air

**Build 1:** A real run on daily PM2.5 for ten cities. It looks at the table, then writes code to count.

- Ask: It has the counts. What would you check before trusting them?
- Expected: The definition: does “over the standard” mean above 60, or 60 and above? Days at exactly 60 change the count.

**Build 2:** Then it doubted its own definition: three days sat at exactly 60. It counted both ways, then drew the chart.

- Ask: Why is analysis like this cheap to check?
- Expected: Every step is code you can read and rerun. Counting both ways changed Ahmedabad and Mumbai by a day or two; it kept “above 60”.

**Build 3:** Its chart, redrawn from its numbers, and its answer. All of it can be recomputed.

- Ask: Would you put this headline in a report as it stands?
- Expected: After one check: rerun the code and confirm the definition. And say what the data are: model estimates for each city, from CAMS. At the other end, Bengaluru and Chennai had one day each over the standard.

**Point here:** An analysis agent shows its work as code, so anyone can rerun it and check the numbers. On the stakes map at the end of Part 3: “Let it run” (the code can be rerun and the numbers recomputed).

**Common misconception:** That the chart shows measured air. These are CAMS model estimates for each city; no monitoring station was read.

**Notebook:** Notebook 3.1: run the analyst, print the code of each run_pandas call, and rerun one by hand. The chart it drew (figures/p3a-analyst-chart.png) is too small to read in a hall, so the slide redraws it from the same numbers.

**Transition:** Invoices look like analysis, but at the end money moves.

**Source:** Real run (notebook 3.1, Gemini 3.8 Flash, 19 November 2026), condensed; request shortened; chart redrawn from its numbers. Data: CAMS model estimates via Open-Meteo. Illustration: generated.

## app-documents: Invoices: mostly a workflow

**Build 1:** Read, find the order, match, post. Only a mismatch needs judgement: the agent’s, then yours.

- Ask: Which of these steps needs a model to decide anything?
- Expected: Only the red one, explaining a mismatch. The rest is Part 1’s fixed workflow: read, match, post.

**Build 2:** Most invoices take the dashed path and never reach the red step. Build the workflow, and call the agent for exceptions.

- Ask: What share of your team’s invoices are exceptions?
- Expected: Usually a small share. That share is where an agent pays for itself; plain rules handle the rest more cheaply.

**Point here:** Most invoice processing is a fixed workflow; the agent is needed only for the invoices that do not match. On the stakes map at the end of Part 3: “Agent acts, a person approves” (rules check the match, but money moves).

**Common misconception:** That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot.

**Transition:** From the back office to the front desk: customer support.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. The invoice is from the notebook’s demo inbox. Illustration: generated.

## app-support: Customer support: a refund request

**Build 1:** Part 1’s refund again. The agent reads, looks up the order and the policy, then checks a cap.

- Ask: Would you let the agent refund on its own? Up to what amount?
- Expected: Most people choose a cap: small, clear cases run alone, large or odd ones go to a person. That is Part 1’s autonomy dial, set by amount. Keep the cap low: whatever the agent promises, the company has to honour (Air Canada, Part 4).

**Build 2:** Under the cap it refunds and replies. Over it, or if anything is unusual, a person approves first.

- Ask: What else should send a case to a person?
- Expected: An angry customer, a repeat claim, a legal threat, anything the policy does not cover.

**Build 3:** Klarna reported that its assistant took two-thirds of chats in the first month, and errands took under 2 minutes instead of 11.

- Ask: Klarna saved money. Why did it put people back in the loop?
- Expected: Its CEO said cost had been too dominant a factor and the result was lower quality; Klarna now offers a person for some cases. Headlines said it was hiring people again; the new staff are freelance, gig-style workers, and total headcount kept falling. Klarna said the assistant did the work of about 700 full-time agents.

**Point here:** A support agent can settle small, routine refunds; anything over the cap goes to a person. On the stakes map at the end of Part 3: “Agent acts, a person approves” (small refunds are easy to check; a person approves anything over the cap).

**Common misconception:** That handling two-thirds of the chats solves two-thirds of the job. The remaining third is the hard part, and quality needs its own measure.

**Notebook:** Notebook 3.3: the inbox assistant reads this same refund email; its send_email tool waits for your approval.

**Transition:** Operations at night: an IT incident.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. Klarna: press release (Feb 2024); the CEO’s interview with Bloomberg (May 2025), as reported by Entrepreneur. Illustration: generated.

## app-incident: IT incidents: an alert in the night

**Build 1:** It reads the alert, queries logs and metrics at once, and ties the errors to the deploy.

- Ask: At 2 a.m., would you let it roll back on its own?
- Expected: Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.

**Build 2:** One approval from the on-call engineer. Then it rolls back, watches the metrics recover, and writes the note.

- Ask: What makes that approval quick?
- Expected: The agent has done the reading: the spike, the deploy behind it, and the exact command. The person only judges.

**Point here:** An incident agent does the night’s reading and leaves one decision for a person: the rollback. On the stakes map at the end of Part 3: “Agent acts, a person approves” (metrics show whether a fix worked; a wrong rollback is an outage).

**Common misconception:** That the risky part is the diagnosis. Reading logs is harmless; the rollback is the step that changes production, so that is where the approval goes.

**Transition:** The last operations job happens in a browser.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. Illustration: generated.

## app-browser: Web forms: renewing a trade licence

**Build 1:** It reads the screen, clicks, types and uploads, then checks the form against your files.

- Ask: Where must it stop and ask you?
- Expected: Before paying and submitting. Both are final and in your name; everything before them can be redone.

**Build 2:** It stops once, before the fee: paying and submitting are final.

- Ask: How good are agents at screens like these? And if the best now beat people on this test, why still confirm?
- Expected: Very good on the test: the best model scored 12.24% in the original study, and the best single model now scores 85.96% on the cleaned-up OSWorld-Verified, above the 72.36% people scored. But a benchmark averages over tidy tasks; real portals have timeouts and unusual forms, and one wrong submission is yours to fix. (An agent framework scores 90.19%.)

**Point here:** A browser agent can fill any web form a person can, so the final, paying click stays with a person. On the stakes map at the end of Part 3: “Agent acts, a person approves” (the form can be read before it is submitted; a submission is final).

**Common misconception:** That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee that cannot be clawed back.

**Transition:** That is knowledge work and operations. Next: science, India and sustainability.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. OSWorld: Xie et al. (2024), and the OSWorld-Verified leaderboard (Aug 2026). Illustration: generated.

## app-coscientist: A co-scientist that argues with itself

**Build 1:** Google’s AI co-scientist takes a research goal and hands it to several agents, each with its own job.

- Ask: How would you check whether a new hypothesis is any good?
- Expected: Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.

**Build 2:** The agents generate, debate, rank and refine. A scientist sees only the winners.

- Ask: Where are the checks in this loop?
- Expected: Twice: the agents’ own debate and tournament, which are cheap and imperfect, then the scientist and the lab, which are slow and real.

**Point here:** Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.

**Common misconception:** That the co-scientist discovered something unknown. It reached, on its own, a result the Imperial team had found but not yet published; the experiments were theirs.

**Transition:** What if the agent could run the experiment too?

**Source:** Google Research blog, 19 Feb 2025 (built on Gemini 2.0); the two days are from Google’s paper, arXiv 2502.18864. Trace simplified; it also searches the literature. Illustration: generated.

## app-lab: A robot lab runs the experiment

**Build 1:** A chemistry goal, a web search and the robot’s manual. Can a model turn these into a real experiment?

- Ask: What would worry you about letting a model drive lab equipment?
- Expected: Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.

**Build 2:** Notice where the one approval sits: just before reagents are spent.

- Ask: Why put the approval there, and not at the end?
- Expected: Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.

**Point here:** When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.

**Common misconception:** That these systems replace the lab team. Robin proposed ripasudil as a candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.

**Transition:** And when a program can score every attempt, the person can step back further.

**Source:** Coscientist: Boiko, MacKnight, Kline and Gomes, Nature, 20 Dec 2023. Robin: FutureHouse, 20 May 2025. The approval step is our addition. Illustration: generated.

## app-evolve: AlphaEvolve: the check is a program

**Build 1:** This time the request arrives with its own judge: a program that rates any code the agent writes.

- Ask: Who has to look at each attempt?
- Expected: No person: the program scores each attempt in seconds, day and night.

**Build 2:** Notice the two green steps: the program checks every attempt. The engineers read only the winner.

- Ask: Which problems in your work come with an automatic scorer?
- Expected: Scheduling, routing, compression, anything with a test suite or a cost model. AlphaEvolve also multiplied 4×4 complex matrices with 48 multiplications, and its faster kernel cut Gemini’s training time by 1%.

**Point here:** Because the check is a program, the loop can run without a person looking at each attempt.

**Common misconception:** That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the evaluator does much of the work.

**Transition:** From the lab and the data centre to the field: agents in India and sustainability.

**Source:** Google DeepMind blog, 14 May 2025. Illustration: generated.

## app-farmer: A farm advisory in Gujarati, by voice

**Build 1:** A farmer near Mehsana sends a voice note in Gujarati. What does an agent need to answer him well?

- Ask: What could go wrong with an answer to this farmer?
- Expected: The wrong weather, advice meant for another region, or a language he does not read. Hence the forecast, the local crop notes and Gujarati.

**Build 2:** Two checks before anyone hears it: a critic model, then an agronomist.

- Ask: Why both a critic model and an agronomist?
- Expected: The critic catches unsupported claims cheaply. The agronomist owns the advice, because a lost crop cannot be undone, and a photo of a sick plant needs a trained eye.

**Build 3:** Our real run’s reply: teal numbers from the forecast, blue from the crop notes.

- Ask: Where did each number in the reply come from?
- Expected: In English: rain chance 0% from 19 Nov to 23 Nov, nights down to 16.4 °C; cool, dry weather suits cumin, so sow this week and water lightly at once, then every 8 to 10 days. It passed all five of the critic’s checks in round one.

**Point here:** For a farmer the agent works in his language, by voice, with local data; a person approves the advice and takes the hard cases.

**Common misconception:** That a chatbot alone can advise farmers. Without the forecast and local crop notes it would guess, as the chatbot in the opening did. (Kisan e-Mitra: “more than 95 lakh” answers in 11 languages, over 20,000 a day, per the PIB note.)

**Notebook:** Notebook 3.4: run the writer and the critic; change the place or the crop and watch the checks.

**Transition:** The same loop can watch a whole city’s air.

**Source:** Click 3: our real run (notebook Part 3, 19 November 2026); crop notes illustrative; voice steps and approval are a design. Kisan e-Mitra: PIB, Sep 2025. Farmer.Chat: Digital Green. Illustration: generated.

## app-air: A city air-quality desk, every morning

**Build 1:** Every morning a city’s pollution desk decides where to warn people. Which parts could an agent do?

- Ask: Who should be warned when PM2.5 spikes?
- Expected: Schools, hospitals, outdoor workers, people with asthma. Each needs a different message.

**Build 2:** The agent does the daily gathering and drafting. Why keep a person for the last step?

- Ask: What would a false alarm cost, and a missed one?
- Expected: Closed schools and lost trust for a false alarm; children breathing bad air for a missed one. The officer owns that decision.

**Point here:** An agent can do the gathering and drafting every morning; a person signs an alert that changes what a whole city does.

**Common misconception:** That CAMS numbers are station measurements. They are estimates from a model that takes in satellite data; a real desk would check them against its own stations.

**Transition:** Buildings are easier: there, a simulator and a meter check every decision.

**Source:** The trace is our design. Days over the standard, Nov 2025 to Feb 2026: our analyst run (notebook Part 3, Gemini 3.8 Flash) on CAMS estimates via Open-Meteo. Illustration: generated.

## app-building: Cooling a campus for less

**Build 1:** A campus wants cool lecture halls and a smaller electricity bill. What would an agent need to know?

- Ask: Which data would you give it?
- Expected: When the rooms are used, how hot it will be, and when power is cheap. Cooling before the peak tariff saves money.

**Build 2:** Classes, weather and the hourly tariff decide when to pre-cool, ahead of the peak price.

- Ask: Why can this run with less supervision than the air alerts?
- Expected: Checking is cheap: the simulator scores a plan before it runs, the meter after. A bad schedule costs some rupees and comfort for a day, and is fixed the next.

**Point here:** When a simulator and a meter check every decision, the agent can run day to day while a person reads the weekly report.

**Transition:** Last, the most personal setting: a doctor’s clinic.

**Source:** The trace is our design. Illustration: generated.

## app-clinic: A scribe in the clinic

**Build 1:** A doctor spends much of the evening writing notes. Could an agent listen and write them instead?

- Ask: What must happen before the recorder is switched on?
- Expected: The patient agrees. Consent is the first step of the trace, and a person gives it.

**Build 2:** Notice the two amber steps: the patient’s consent first, the doctor’s signature last.

- Ask: Would you let the scribe file notes without the doctor’s signature?
- Expected: No: the note goes into a medical record. The time saved comes from editing a draft instead of writing from scratch; the review stays.

**Point here:** The scribe saves writing time and the doctor keeps every decision: Kaiser Permanente’s doctors saved about 15,800 hours of note-writing in about 15 months.

**Common misconception:** That the scribe makes the diagnosis. It writes down what was said; the doctor decides.

**Transition:** Fourteen jobs so far. Can one picture say how much freedom each should get?

**Source:** The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, Oct 2023 to Dec 2024; about 15,800 hours as reported by the AMA. Illustration: generated.

## stakes-map: How much freedom should each job get?

**Build 1:** Two questions place every job: how easily can the result be checked, and what does a mistake cost?

- Ask: Before the points appear: where would you put a coding agent? A clinic scribe?
- Expected: Coding: tests make it easy to check, and a merged change can break production, so the right-hand side, just above the middle. The scribe: the doctor can read it, but errors reach patients, so near the top.

**Build 2:** Nine of the fourteen sit in the top half, where a mistake is costly.

- Ask: Which point would you move, and why?
- Expected: Common moves: support higher, because promises bind the company; research further right, because key claims can be spot-checked. Moving a point moves its advice with it.

**Build 3:** Read the two arrows together. Where would your team’s most repeated task sit?

- Ask: Where does your team’s most repeated task sit?
- Expected: Most operational work lands top right: let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.

**Point here:** Two questions set the autonomy: how cheaply can the result be checked, and what does a mistake cost?

**Common misconception:** That a more capable model moves a job to the bottom right. Capability changes how often mistakes happen; what a mistake costs, and how hard it is to check, stay where they were.

**Notebook:** Click a point to read why it sits there; click a family to pick out its jobs.

**Transition:** Part 3 in one slide.

**Source:** Positions: the speaker’s judgement, for discussion (data/apps.json). Shapes mark the four families. The zones split each axis at its middle.

## recap-3: Part 3 in one slide

**Build 1:** Next: Part 4, when the engine stalls: errors that compound, inputs that lie, and guardrails.

- Ask: Pick one task from your week. Which zone of the map does it fall in?
- Expected: Most land top right: the agent can do the work if a person approves the irreversible step. That is where Part 5 begins.

**Point here:** Part 3 in one rule: give autonomy where checking is cheap, keep a person where mistakes are costly.

**Transition:** Even in the right zone, agents fail in ways worth knowing. Part 4.

## part-4: Part 4 · When the engine stalls

**Build 1:** By the end of this part you can name the guardrails an agent needs before you let it act on anything that matters.

- Ask: Has software ever done something you did not mean it to? What stopped the damage?
- Expected: Autocorrect, an email to the wrong list, a script that deleted files. Usually an undo, a backup, or a person who noticed in time.

**Transition:** Start with a little arithmetic.

**Source:** Illustration: generated (Gemini image model).

## compound: Small errors add up over many steps

**Build 1:** Say each step of a task is right 95% of the time, and the task takes twenty steps. How often is the whole task right?

- Ask: Guess: 95% a step, twenty steps. What share of tasks come out fully right?
- Expected: Most guess well above half. The answer surprises people.

**Build 2:** Only 36%. Every step must be right, so the chances multiply. Drag the steps up: long tasks punish even small error rates.

- Ask: At 95% a step, what happens to a task of 50 steps?
- Expected: It almost never finishes cleanly: 8%. Long autonomous tasks need far more reliable steps, or checks.

**Build 3:** Now check each step and retry once when the check fails. The same twenty steps now come out right 95% of the time.

- Ask: What counts as a check in your work?
- Expected: Running the tests, comparing a number with its source, validating a form against a rule, a second model reviewing, a person approving.

**Point here:** Reliability multiplies across steps, so long autonomous runs need checks inside the loop as well as a better model.

**Common misconception:** That a model right 95% of the time gives tasks right 95% of the time. That holds only for one-step tasks. Real steps are not independent and real checks miss things, so treat the curves as a trend.

**Notebook:** Notebook 4.1 prints the same numbers. On the slide, drag the per-step slider up and watch how much the long tasks gain.

**Transition:** That is the arithmetic. Here is what it looks like when it goes wrong for real.

**Source:** Computed in scripts/sci/p4.py. With checking, a step is right unless both tries fail.

## failures: When it goes wrong for real

**Build 1:** Three failures, from a coding tool, an airline and our own notebook. Look at what each one was allowed to do.

- Ask: Which of the three could happen in your organisation this year?
- Expected: Most say the chatbot: many already have one on their website. Coding agents with production access are becoming common too.

**Build 2:** Each has a plain fix, and each fix lives in the system around the model.

- Ask: Which of these fixes would a better model have made unnecessary?
- Expected: None of them. A better model would make such mistakes less frequent; each fix limits the damage when one happens anyway.

**Point here:** Real failures come from what an agent is allowed to touch and say, and from loops nobody bounded.

**Common misconception:** That these are stories about bad models. Replit (as reported): the agent had write access to production; its own chat log said it wiped records of 1,206 executives and 1,196 companies; the chief executive replied that Replit had started separating development and production databases automatically; one report says the data was later recovered with Replit’s rollback. Air Canada: the chatbot told a grieving customer he could claim a bereavement fare after travelling, and the policy said otherwise; in the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity, and lost. Strictly it was a chatbot, and the lesson is about who is liable. Ours: the instruction to keep trying met a tool that never answers.

**Notebook:** Notebook 4.3: the flaky lookup always times out; with max_steps set, the run stops after four steps (13.2 s, ₹0.23).

**Transition:** Those agents were wrong on their own. The next failure needs an attacker, and nothing more than an email.

**Source:** Replit (Jul 2025): reported by The Register and Tom’s Hardware. Air Canada: Moffatt v. Air Canada, 2024 BCCRT 149, decided 14 Feb 2024, reported by law-firm summaries of the decision. Ours: notebook 4.3, 19 November 2026.

## injection: A poisoned email

**Build 1:** One email in our demo inbox ends with lines addressed to the assistant. We asked the agent to summarise the inbox.

- Ask: What do you expect the agent to do with this email?
- Expected: Some say forward the invoices, some say ignore it. The model reads instructions and data in one stream of text, so either can happen.

**Build 2:** Neither model ever tried to forward the invoices. But nine summaries in ten passed on the fake bank details as routine news.

- Ask: Which is worse: forwarding the invoices, or a calm summary that mentions “updated bank details”?
- Expected: The summary. You trust it, and the next step is someone paying a fraudster. The agent did not act; it laundered the fraud into a summary you trust.

**Build 3:** The same trick works on real products. Follow the path along the bottom.

- Ask: What do the three attacks have in common?
- Expected: Each agent read text from outside, could see private data, and had a way to send it out. That is the next slide.

**Point here:** Prompt injection: an agent cannot reliably tell data from instructions, so the risk covers what it reports to you as well as what it does.

**Common misconception:** That a smarter model simply ignores injected text. Ours did ignore the instruction, and still passed the fraud on. The defence has to sit outside the model. Only one summary in ten called the email suspicious.

**Notebook:** Notebook 4.2 adds the poisoned email and runs the summary with and without an approval gate, then five times on each model.

**Transition:** Why were those products exposed? Three ingredients, all present at once.

**Source:** Our runs: notebook 4.2, 19 November 2026, ten runs with no gate, Gemini 3.8 Flash and Gemini 3.5 Flash-Lite. Microsoft 365 Copilot: Aim Labs, Microsoft, CVE-2025-32711 (11 Jun 2025); GitHub MCP server: Invariant Labs (26 May 2025); Perplexity Comet: Brave (20 Aug 2025).

## trifecta: The lethal trifecta

**Build 1:** Simon Willison’s rule of thumb: an agent that has all three can be tricked into sending your data to an attacker.

- Ask: Which of the three does the assistant in your company’s email or chat tool have?
- Expected: Most have the first two: your files and anything pasted or fetched. The danger starts when it can also send, post or open links.

**Build 2:** Our inbox agent had all three. Cut one: send_email waits for a person, whatever the model decides.

- Ask: Which of the three is easiest to cut in your case?
- Expected: Usually the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources.

**Point here:** Willison’s lethal trifecta: private data, untrusted content and a way to communicate out. Remove any one and this attack fails.

**Common misconception:** That our gate was tested by the attack. In our runs the model never tried to send the invoices, so the gate never had to refuse. We cannot plan on that luck; the gate holds whatever the model decides. (In the recorded runs a scripted stand-in answered the gate; in the live notebook, ask_human asks you.)

**Transition:** An approval gate is one guardrail. Here is the whole set.

**Source:** Simon Willison, “The lethal trifecta for AI agents” (16 Jun 2025); the three labels in his words on the right. The approval is from our inbox run (notebook Part 3, 19 November 2026).

## guardrails: Guardrails before, during and after a run

**Build 1:** Before it runs, decide what it can touch. Replit’s agent could reach the live database; in a sandbox the damage would have stayed in a copy.

- Ask: Which tools would a first version of your agent really need?
- Expected: Usually read-only ones: search, look up, read. Writing and sending can come later.

**Build 2:** While it runs, a person stands before anything that cannot be undone, and limits cap the loop. Our stuck agent cost only ₹0.23 because a step limit stopped it.

- Ask: Which steps in your process cannot be undone?
- Expected: Payments, emails to customers, deletions, orders, anything published.

**Build 3:** After it runs, keep every trace so you can see what went wrong, and rerun the evals whenever the model, the prompt or a tool changes.

- Ask: Who in your team would read the traces?
- Expected: Often nobody, at first. Name an owner before launch, as you would for any production system.

**Point here:** Guardrails sit in the code around the model: what it can touch before, what needs approval during, and what is measured after.

**Common misconception:** That a guardrail is a sentence in the prompt (“never delete anything”). Prompts are advice the model may ignore; permissions, gates and limits are enforced by code.

**Transition:** The last layer, measurement, deserves its own slide.

**Source:** The layers follow common practice for any production system. Every example in grey is earlier in this part.

## evals: Measure before you trust

**Build 1:** We ran the opening task ten times on each of two models, with the same forecasts, and checked every answer against the best order.

- Ask: Which model would you deploy, and why?
- Expected: The cheaper one: it was right just as often, at about a quarter of the cost and half the time. Without the eval we would have guessed.

**Build 2:** Both were right every time; Gemini 3.5 Flash-Lite cost about a quarter as much and took half the time. Measure like this, then use the cheapest model that passes.

- Ask: What would your first ten test cases be?
- Expected: Real past cases with known right answers, including the awkward ones: the refund just over the limit, the invoice that does not match. Ours was one case run many times; yours should hold many cases.

**Point here:** An eval turns “it seems to work” into a number you can compare across models, prompts and versions.

**Common misconception:** That the pricier model is the safe default. Here the cheaper one was as accurate, though less steady in how it worked: it made four to fourteen tool calls a run, against seven to nine.

**Notebook:** Notebook 4.4: evaluate() runs the task ten times per model and prints right or wrong, tool calls and cost.

**Transition:** Part 4 in one slide.

**Source:** Notebook 4.4, 19 November 2026: ten runs per model, cached forecasts, answers checked against the best order. Mean cost at paid prices.

## recap-4: Part 4 in one slide

**Build 1:** Next: which tasks to hand to an agent, how to raise its autonomy, and what one task costs.

- Ask: Before you gave this agent your real inbox, which line of the card would you change?
- Expected: The person line: who double-checks anything about payments. Maybe the tools too: no send_email at all for a first version.

**Point here:** The failures of this part map onto the bottom half of the card.

**Transition:** Part 5: agents in your organisation.

## part-5: Part 5 · Agents in your organisation

**Build 1:** By the end of this part you can decide, for one task in your team, whether to hand it to an agent and how.

- Ask: Which task in your team would you hand to an agent first?
- Expected: Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we will run them through the next slide.

**Transition:** Start with the first decision: does it need an agent at all?

**Source:** Illustration: generated (Gemini image model).

## should-agent: Should this task be an agent?

**Build 1:** First question: does the path change from case to case? If you can draw the steps in advance, build a workflow. It is cheaper and more predictable.

- Ask: Take your task from the last slide. Does its path change from case to case?
- Expected: Many “agent” ideas are really workflows: the same steps every time. That is good news: they are cheaper to build and run.

**Build 2:** If it needs an agent, can a person check the result cheaply? If not, the agent drafts and a person decides, or leads when mistakes are costly.

- Ask: Can someone check its result in a minute or two?
- Expected: Code with tests, a number with a source: yes. A strategy memo or a diagnosis: no, so the agent drafts.

**Build 3:** If checking is cheap, ask what a mistake costs. Costly or irreversible: a person approves that step. Otherwise let it run, with spot checks and logs.

- Ask: Where does your task land?
- Expected: Most land in one of the four zones of the stakes map. Let it run: Data analysis, Algorithm search, Building energy. Approve: Coding, Invoices, Customer support, IT incidents, Web forms, Robot lab, Clinic notes.

**Point here:** Two questions decide autonomy: how cheaply can the result be checked, and what does a mistake cost. They are the axes of the stakes map.

**Common misconception:** That a more capable model moves a task to a safer zone. It can make some checks cheaper (a second model can review the first), but what a mistake costs stays the same, so the approval before an irreversible step stays.

**Transition:** Even in the right zone, you do not start at full speed.

**Source:** The four leaves are the zones of the stakes map in Part 3, in the same words. Workflow or agent: Anthropic, “Building effective agents” (Dec 2024).

## ramp: Start small, and climb

**Build 1:** Do not start at full autonomy. Start in shadow mode, where it only suggests, then let it act with approval, then let routine cases run.

- Ask: Why start in shadow mode, if the agent could already act?
- Expected: Because you learn its error rate on your real cases at no risk: every suggestion can be compared with what the person actually did.

**Build 2:** Climb a step only when the evals on your own past cases say so, and step back down when errors rise.

- Ask: What would convince you to climb a step?
- Expected: A measured error rate on enough real cases, below what the team accepts from a person, and a plan for the errors that remain.

**Point here:** Raise autonomy one step at a time, when evals on your own cases support it, and lower it again when errors rise.

**Common misconception:** That autonomy is a one-time decision at launch. It is a setting you revisit as the evals, the model and the stakes change.

**Transition:** At each step, someone pays for the model and for the checking. Which costs more?

**Source:** The steps correspond to Part 1’s dial: operator, approver, observer. The refund is Part 1’s example.

## cost: What does one task cost?

**Build 1:** Our opening run read 3,768 tokens and wrote 1,466. At Gemini 3.8 Flash prices that is ₹0.78. The price doubles on 1 January 2027.

- Ask: Guess: what did the opening run cost?
- Expected: Most guess tens or hundreds of rupees. It is under one rupee.

**Build 2:** Now add a person who spends five minutes checking the answer, at ₹1,000 an hour. The model is now 0.9% of the cost.

- Ask: What does five minutes of a colleague’s time cost your organisation?
- Expected: At ₹1,000 an hour, five minutes is about ₹83; with overheads it is more, and the slider goes up to ₹5,000 an hour.

**Build 3:** Agents use about four times the tokens of a chat, multi-agent systems about fifteen times. Drag the steps: the person usually still costs more.

- Ask: So where should you spend effort to make an agent cheaper?
- Expected: On making the check cheap: tests, totals that reconcile, a citation to click, a clear diff. Squeezing the model price matters far less.

**Point here:** For a run like ours the model costs under a rupee and a person’s check costs far more, so making results quick to check saves the most.

**Common misconception:** That model cost is negligible at any scale. Each step rereads everything before it, so long runs grow faster than their steps, and from 1 January 2027 Gemini 3.8 Flash costs $1.50 and $7.50 per million tokens in and out. Caching and a cheaper model (Part 4’s eval) cut it.

**Notebook:** Drag the steps to the maximum, switch to the January price, then set checking to one minute: the gap narrows. The figure gives every model the same tokens; in Part 4’s eval Flash-Lite used fewer and cost ₹0.18 a run.

**Transition:** If checking is the cost, the people around the agent matter more. What changes for them?

**Source:** Tokens: the opening run (19 November 2026); each step rereads all before it, fitted to that run. Prices: Google’s Gemini pricing page, 19 November 2026. Minutes and hourly cost: illustrative. Anthropic (Jun 2025) for 4× and 15×.

## skills: What changes for a team

**Build 1:** The work around the agent becomes part of the job. Someone writes the goal and the tool descriptions, reads the traces, and builds the evals.

- Ask: Who in your team already does something like this for other software?
- Expected: Testers, analysts who write specifications, whoever reviews pull requests or audits processes. These skills transfer.

**Build 2:** The shift has started: people hand over more whole tasks. Gartner also predicts that over 40% of agentic AI projects will be cancelled by the end of 2027.

- Ask: What would keep your project out of the cancelled group?
- Expected: A task that is cheap to check, evals from day one, a measured cost per task, and guardrails a risk team has signed off.

**Point here:** Adopting agents mostly changes the work around the model: people specify the task and check the results.

**Common misconception:** That agents remove the need for expertise. They move it from doing each case to defining and checking how cases are done.

**Transition:** Part 5 in one slide.

**Source:** Anthropic Economic Index (Sep 2025): “directive” conversations, where people hand over the whole task. Gartner press release (Jun 2025): a prediction.

## recap-5: Part 5 in one slide

**Build 1:** Next: the talk in one slide, and three things to try on Monday.

- Ask: Where on the ramp would you start this refund agent, and what eval would move it up a step?
- Expected: Shadow mode on last month’s refunds; climb when it matches staff decisions on nearly all of them, with no large refund wrong.

**Point here:** Every decision of this part lands on the agent card.

**Transition:** To close: the whole talk in one slide.

## summary: The talk in one slide

**Build 1:** The whole talk around the picture we started with. The loop is the engine; your design decides how far it may run.

- Ask: Which of the five will you remember on Monday morning?
- Expected: Most remember Part 3 (where it works) or Part 4 (what goes wrong). Point back to the map of 14 jobs.

**Point here:** The whole talk in five sentences.

**Transition:** And what to do next.

## monday: Three things to try on Monday

**Build 1:** Small steps you can take this week, none of which needs a budget or a vendor.

- Ask: Which task in your team would you write the card for?
- Expected: Reconciliations, weekly reports, ticket triage, document checks.

**Build 2:** Scan this to open the notebook. Every run in this talk came from it.

- Ask: Who has a laptop open? Try the first cell now.
- Expected: A few will open it; promise help after the session.

**Point here:** Concrete next steps: run it, describe one task as an agent card, and write the evals first.

**Transition:** Thank you.

## thanks: Thank you. Questions?

**Build 1:** Questions, and examples from your own work, are very welcome.

- Ask: Which application did we not cover that you would like to see?
- Expected: Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Map each onto the card and the two axes.

**Point here:** Close, and open the floor.

**Source:** Nipun Batra, IIT Gandhinagar · nipunbatra.github.io

## glossary: Glossary: the loop (optional)

**Build 1:** Which of these words did you hear for the first time today?

- Ask: Which of these words did you hear for the first time today?
- Expected: Usually context and token.

**Point here:** The vocabulary of the talk in one place.

## glossary-2: Glossary: running it safely (optional)

**Build 1:** Which of these does your organisation already have a policy for?

- Ask: Which of these does your organisation already have a policy for?
- Expected: Usually none of them yet; guardrails and evals are where to start.

**Point here:** The words for Parts 4 and 5.

## mcp-code: The air-quality tool as an MCP server (optional)

**Build 1:** What changes for the agent when the tool moves behind MCP?

- Ask: What changes for the agent when the tool moves behind MCP?
- Expected: Nothing about how it calls the tool; what changes is that every MCP-capable agent can use it without new code.

**Point here:** Writing an MCP server is as small as writing the tool itself.

**Source:** Model Context Protocol Python SDK, github.com/modelcontextprotocol/python-sdk.

## further: Further reading (optional)

**Build 1:** Which one would you read first?

- Ask: Which one would you read first?
- Expected: Building effective agents for builders; the lethal trifecta for anyone deploying agents near data.

**Point here:** Where to go next.
