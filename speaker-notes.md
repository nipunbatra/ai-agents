# AI agents: speaker notes

Planned main route: 85 minutes, including student responses. Optional slides are outside this budget.

## Pacing

| Part | Minutes |
|---|---:|
| Opening | 4 |
| Part 1 · What an agent is | 17 |
| Part 2 · One run, step by step | 14 |
| Part 3 · Agents at work | 25 |
| Part 4 · How agents fail | 15 |
| Part 5 · Agents in your organisation | 7 |
| Wrap-up | 3 |

## title: AI agents

**Build 1:** Today we build a small agent together, look at where agents are used, and see how they go wrong.

- Ask: Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them do a task for them, start to finish?
- Expected: Most hands go up for the first question and few for the second. That gap is what today is about.

**Point here:** An agent is a model that uses tools in a loop until a goal is met. We will build one live.

**Transition:** Let us start with a question.

**Source:** Slides, notebook and sources: github.com/nipunbatra/ai-agents

## question: Let us start with a question

**Build 1:** Three cities, three days, one city a day. Which order means the cleanest air?

- Ask: Take a guess: which order would you choose, and how would you decide?
- Expected: Most people say “visit Delhi when its air is best”, but nobody in the room knows tomorrow’s forecast. You would need to look it up.

**Point here:** The answer depends on data nobody in the room has: the air-quality forecast for the next three days.

**Common misconception:** That the order cannot matter. It matters because each city’s pollution changes from day to day.

**Transition:** Let us ask a model, the way most people use one: just the question.

**Source:** PM2.5 is fine dust in the air, in micrograms per cubic metre. Higher is worse.

## nb-alone: In the notebook

**Build 1:** Over to the notebook. We send the question to a Gemini model, with nothing else.

- Ask: Before it answers: what do you expect it to say?
- Expected: Something confident. Watch whether it mentions any forecast numbers.

**Point here:** A model on its own can only answer from what it learned in training.

**Notebook:** Notebook 1.1: run the cells under “The model on its own”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what it said when we ran it.

## alone-said: What did the model say?

**Build 1:** Our run on 19 November 2026. It wrote 222 words, and this is the key sentence.

- Ask: Is this answer right?
- Expected: It sounds reasonable, but it is wrong: each city’s air changes from day to day, so the order changes the total.

**Build 2:** It answered from what it learned in training. It had no way to know the next three days.

- Ask: What would it need to get it right?
- Expected: Tomorrow’s forecast for each city, and a way to add up the totals. In other words, tools.

**Point here:** A model on its own is confident even when it has no data. By the end of Part 1 the same model will get this right.

**Common misconception:** That a newer model would know. No model can know the next three days from its training data.

**Transition:** Here is the plan.

**Source:** Real reply (Gemini 3.8 Flash, 19 November 2026, notebook 1.1), shortened to its key sentence. Your run will word it differently.

## route: Today’s plan

**Build 1:** Five parts. When a slide says “In the notebook”, we switch over and run the code live.

- Ask: Which part matters most for your work?
- Expected: Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.

**Point here:** A map of the talk, and the rhythm: a few slides, then a run in the notebook.

**Transition:** Part 1: what an agent is.

**Source:** Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb). Open it in Colab from the link at the top right.

## part-1: Part 1 · What an agent is

**Build 1:** Key question: what does an agent have that a model on its own does not?

- Ask: In your own words, what is an AI agent?
- Expected: Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we will sharpen them by the end of this part.

**Transition:** Start with what a model is on its own.

**Source:** Illustration: generated (Gemini image model).

## alone: On its own, a model only writes text

**Build 1:** A language model reads text and writes the words most likely to come next. That is all it does.

- Ask: If it only predicts words, how did it write a confident answer about Delhi’s air?
- Expected: From patterns in its training text: Delhi is often polluted in winter. It sounded right, but nothing checked it.

**Point here:** A language model is a text predictor. Everything an agent adds comes from outside the model.

**Transition:** So what can it not do on its own?

## limits: What can a model not do on its own?

**Build 1:** It has not seen today’s data, and it does not really calculate.

- Ask: Which of these did our question need?
- Expected: Today’s data: tomorrow’s forecasts. And some exact sums to compare the orders.

**Build 2:** It cannot act on anything, and it does not remember you next time.

- Ask: Which of these limits matters most in your job?
- Expected: Usually live data and acting on systems. Both are fixed the same way: with tools.

**Point here:** Each limit is fixed from outside the model, by giving it tools.

**Common misconception:** That newer models “know” current facts. They know their training data, which ends at a cut-off date.

**Transition:** So let us give it a tool.

## tool-fn: A tool is an ordinary Python function

**Build 1:** Our tool fetches the PM2.5 forecast for one city. It is plain Python that asks a public forecast service.

- Ask: What would you need to write a tool like this for your own work?
- Expected: A function that does one thing, such as a database query or an API call, and a clear description of it.

**Point here:** A tool is a normal function. The only new thing is the description the model will read.

**Transition:** Let us write it in the notebook.

**Source:** The forecast comes from CAMS, served free by Open-Meteo. The full function is in the notebook, section 1.2.

## nb-tool: In the notebook

**Build 1:** We define the tool and print what the model will be shown.

- Ask: Why might the model not need to see the code?
- Expected: It never runs the code. It only needs to know what the tool does and what to pass in.

**Point here:** The model reads only a description of the tool. It never sees the code.

**Notebook:** Notebook 1.2: run the cells under “Write a tool”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** This is the entry the model reads.

## tool-menu: The model sees only this entry

**Build 1:** This is all the model knows about our tool: a name, a description and two arguments.

- Ask: What does the description tell the model that the name does not?
- Expected: What comes back, in what units, and from when: daily means, starting tomorrow.

**Build 2:** A vague entry leaves the model guessing. The description is all it has to go on.

- Ask: What would the model do with get_data(x)?
- Expected: Guess. It might call it for anything, or never. A clear description fixes that.

**Point here:** The description is the only manual the model gets. Say what the tool does and what comes back, with an example.

**Transition:** Now we ask our question again.

**Source:** Simplified from the entry the notebook prints in section 1.2.

## nb-ask: In the notebook

**Build 1:** Back to the notebook. Same question, same model, but now the tool is on offer.

- Ask: What do you think comes back this time?
- Expected: Not an answer. Watch the reply.

**Point here:** With a tool on offer, the model can reply with a request instead of an answer.

**Notebook:** Notebook 1.3: run the cells under “Ask again, with the tool”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what came back in our run.

## tool-call: The reply is a request, not an answer

**Build 1:** The model replied with a request in a fixed format: which tool, and with which arguments.

- Ask: Who will actually fetch the forecast: the model or our program?
- Expected: Our program. The model only wrote the request.

**Build 2:** It asked for all three cities in one go, because none of the forecasts depends on another.

- Ask: Why is it safer that the model only writes requests?
- Expected: Because our program decides which requests to carry out. That is where the safety checks of Part 4 go.

**Point here:** This is function calling: the model writes a structured request, and our code decides whether to run it.

**Common misconception:** That the model connects to the internet itself. It never does. Our code does, and only for the tools we gave it.

**Transition:** Back to the notebook.

**Source:** Real request from our run on 19 November 2026 (Gemini 3.8 Flash).

## nb-run: In the notebook

**Build 1:** Our code runs each request and adds the result to the conversation. Then we ask the model again.

- Ask: What will the model do once it has the numbers?
- Expected: Use them: compare the orders and answer. Or ask for something else it needs.

**Point here:** Our code runs the tool and hands back the result. The model only asked for it.

**Notebook:** Notebook 1.4: run the cells under “Run the request, return the result”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is one result from our run.

## tool-result: The result goes back into the conversation

**Build 1:** Delhi’s forecast, as our code got it. Pune and Ahmedabad came back the same way.

- Ask: Which day is worst in Delhi?
- Expected: The middle day: 162.4 µg/m³.

**Build 2:** Doing this by hand, one request at a time, gets tedious. A real task may need ten rounds.

- Ask: What should happen automatically instead of by hand?
- Expected: Ask the model, run what it asks for, hand back the results, and repeat. That repetition is the agent.

**Point here:** One request, one result. An agent repeats this until the model stops asking.

**Transition:** So we put it in a loop.

**Source:** Real result from our run on 19 November 2026. CAMS forecast via Open-Meteo, in µg/m³.

## loop-map: Put it in a loop

**Build 1:** You give a goal. The model reads the conversation so far and writes a reply.

- Ask: What starts the loop?
- Expected: A goal from a person.

**Build 2:** If the reply asks for no tool, it is the answer, and we stop.

- Ask: When does it stop?
- Expected: When the model replies without asking for a tool.

**Build 3:** If it asks for a tool, our code runs it and adds the result. Then the model reads everything again.

- Ask: What would make it never stop?
- Expected: A tool that keeps failing, or a goal that is never met. So we always add a step limit (Part 4).

**Point here:** An agent is a model, some tools and this loop. We will come back to this flowchart all through the talk.

**Transition:** This loop is a few lines of Python. Let us run it.

## nb-loop: In the notebook

**Build 1:** We give the loop two tools, the forecast and a calculator, and the original question.

- Ask: How many rounds do you expect?
- Expected: At least two: one for the forecasts, one for the sums. Then the answer.

**Point here:** The agent decides the steps itself: which tools, in what order, and when to stop.

**Notebook:** Notebook 1.5: run the cells under “Put it in a loop”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run, round by round.

## loop-run: Our run went round three times

**Build 1:** First it fetched the three forecasts, all at once.

- Ask: Who decided to add up six orders?
- Expected: The model. We never told it how to solve the problem.

**Build 2:** Then it added up every possible order with the calculator.

- Ask: Why use a calculator instead of doing the sums itself?
- Expected: A model predicts digits; a calculator computes them. We asked it to use tools for arithmetic.

**Build 3:** Then it stopped asking for tools and answered.

- Ask: How did our code know it was done?
- Expected: The reply asked for no tool, so the loop stopped.

**Point here:** The model chose the steps. Our code only ran the tools and kept the conversation.

**Transition:** But was the answer right? We can check: there are only six orders.

**Source:** Real run on 19 November 2026 (Gemini 3.8 Flash): nine tool calls in all.

## nb-check: In the notebook

**Build 1:** We work out all six totals ourselves, from the same forecasts the agent saw.

- Ask: Why check at all, if the agent showed its sums?
- Expected: Because an agent can be wrong and sound sure. Checking against something we trust is how we find out.

**Point here:** Checking an answer against something you trust is the habit that Part 4 turns into evals.

**Notebook:** Notebook 1.6: run the cells under “Check the answer”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here are the six totals.

## check: Was the agent right?

**Build 1:** Total PM2.5 over the three days, for each of the six orders, from the same forecasts.

- Ask: Which order is best, and which is worst?
- Expected: Best: Pune, Ahmedabad, Delhi. Worst: Ahmedabad, Delhi, Pune.

**Build 2:** The agent’s order is at the top. The model on its own had said the order does not matter.

- Ask: Was the model on its own right that the order does not matter?
- Expected: No. The worst order means 24% more PM2.5 than the best.

**Point here:** The agent’s answer matches our own check. The model on its own was wrong.

**Transition:** So, side by side: the same model, twice.

**Source:** Totals in µg/m³, summed over 2026-11-20 to 2026-11-22 from the CAMS forecast via Open-Meteo, as fetched on 19 November 2026.

## same-model: The same model, two answers

**Build 1:** Both answers came from the same model. The only difference is the tools and the loop.

- Ask: So what is an agent?
- Expected: A model that uses tools in a loop until it has done what you asked. Compare with the answers collected at the start of the part.

**Point here:** An agent is a model, tools and a loop. It is not a different, smarter kind of model.

**Common misconception:** That agents run on a special model. This one is the same Gemini model as the chatbot reply.

**Transition:** Does every job need this much freedom? Not always.

**Source:** Both replies are real (Gemini 3.8 Flash, 19 November 2026, notebook 1.1 and 1.5), shortened.

## workflow: Some jobs have fixed steps

**Build 1:** Paying an invoice is always the same three steps. A fixed list of steps like this is called a workflow.

- Ask: Name one task in your team that always follows the same steps.
- Expected: Monthly reports, onboarding checklists, standard approvals.

**Point here:** A workflow fixes the steps in advance; the model fills in each one.

**Transition:** So when is an agent worth it?

**Source:** Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).

## agent-or-workflow: When is an agent worth it?

**Build 1:** A workflow follows the steps we wrote down. It is cheaper and easier to predict.

- Ask: Is processing an invoice a workflow or an agent?
- Expected: A workflow, mostly. An agent only for the odd invoice that does not match.

**Build 2:** An agent chooses its own steps. Use one only when the steps change from case to case.

- Ask: In our air-quality question, what could not be fixed in advance?
- Expected: How many lookups and sums it needed depended on the question and the data.

**Point here:** Anthropic’s distinction: workflows follow steps written in advance; agents direct their own steps and tool use. If you can draw the flowchart in advance, build a workflow.

**Common misconception:** That everything with a language model in it should be an agent. Most systems in production are workflows.

**Transition:** And when it is an agent, how much should it decide without a person?

**Source:** Workflow and agent as defined in Anthropic, “Building effective agents” (19 Dec 2024).

## levels: How much should it decide without you?

**Build 1:** One paper names five levels by what the person does. At the first two, you do most of the work.

- Ask: At which level do most people use ChatGPT today?
- Expected: Level 1 or 2: you ask, it helps, you do the rest.

**Build 2:** At the top three, the agent does the work, and you answer, approve or watch.

- Ask: Which level would you allow for your team’s work?
- Expected: It depends on the task. The next slide and Part 3 come back to this.

**Point here:** Autonomy is a choice you make for each task, separate from how capable the model is.

**Transition:** Here is one task, a refund, at each level.

**Source:** The five levels and their names: Feng, McDonald and Zhang, “Levels of Autonomy for AI Agents” (arXiv 2506.12469, 2025).

## autonomy: One refund at five levels

**Build 1:** At level 1 you do the work. The agent only drafts the reply. Drag the slider to see the other levels.

- Ask: At which level does the agent first touch a real system?
- Expected: Level 2: it looks up the order. Reading is low risk.

**Build 2:** At level 4 the agent does everything up to the refund, then waits for your approval: the amber step.

- Ask: Why put the approval just before the refund, and not at the start?
- Expected: Because the refund is the step that cannot be undone. Everything before it is cheap to redo.

**Point here:** You choose the level per task. The approval goes just before the step that cannot be undone.

**Common misconception:** That a more capable model should automatically get more autonomy. Capability and permission are different questions.

**Notebook:** Drag the slider from 1 to 5 and watch the person’s steps move from doing to approving to watching.

**Transition:** Part 1 in one slide.

**Source:** The refund is from the notebook’s demo inbox. Levels: Feng, McDonald and Zhang (2025).

## recap-1: Part 1 in one slide

**Build 1:** Next: one run, round by round, and what it costs.

- Ask: Which line would change if this agent could also book your train tickets?
- Expected: Tools (a booking tool), guardrails (a spending cap) and the person (approves before paying).

**Point here:** The seven lines of this card come back for every agent in the talk.

**Transition:** Part 2: one run, step by step.

## part-2: Part 2 · One run, step by step

**Build 1:** Key question: what does the model read each round, and what does that cost?

- Ask: When an agent “thinks”, what do you imagine is going on?
- Expected: Answers vary: it plans, it searches, it reasons. Keep them. This part shows that each round is the model reading a growing text and writing a short reply.

**Transition:** First, where we are in the loop.

**Source:** Illustration: generated (Gemini image model).

## map-model: Where are we in the loop?

**Build 1:** This part is about one box: each round, the model reads the whole conversation again.

- Ask: By round 3 of our run, what is in “the conversation”?
- Expected: Our instructions, the tool menu, the question, and every request and result so far.

**Point here:** The model keeps nothing between rounds. Our code sends it the whole conversation every time.

**Transition:** We replay the opening run, one round per slide.

## trace-walk: Round 1: three forecasts at once

**Build 1:** Round 1. The model reads our instructions, the tool menu and your question: 284 tokens.

- Ask: What does the model have to work with in round 1?
- Expected: Only text: our instructions, the menu of tools, and the question. No forecasts yet.

**Build 2:** It replies with three forecast requests at once, since none depends on another.

- Ask: Why ask for all three at once?
- Expected: None depends on another, so one round is enough, and each round saved is one less rereading of the whole conversation. Our instructions also asked for this. Builders call it parallelisation.

**Point here:** A round is one model call. It reads text and writes text; nothing else happens inside it.

**Common misconception:** That the model keeps running between rounds. Each round is a new call; between calls, only our code runs.

**Transition:** Our code fetches the three forecasts. Then round 2.

**Source:** Real run, 19 November 2026, Gemini 3.8 Flash (notebook 1.5). A token is a word or a piece of a word. Pale blue is text the round before had already read.

## trace-walk-2: Round 2: six sums at once

**Build 1:** Our code added the three forecasts. Round 2 reads everything again from the top: 1,020 tokens.

- Ask: Why did round 2 read so much more than round 1?
- Expected: It rereads all of round 1, plus its own requests and the three forecasts. The model keeps nothing between rounds; we send it everything again.

**Build 2:** It asks the calculator for six sums at once, one for each possible order.

- Ask: Could it have asked for the sums in round 1?
- Expected: No. The sums need the forecasts, and those came back only after round 1.

**Point here:** Every round starts from the full conversation. The pale part of the bar is text the model already read once.

**Transition:** Six totals come back. Round 3.

**Source:** Real run, 19 November 2026, Gemini 3.8 Flash (notebook 1.5). A token is a word or a piece of a word. Pale blue is text the round before had already read.

## trace-walk-3: Round 3: the answer, and what the run cost

**Build 1:** The six totals are added. Round 3 reads 2,464 tokens, 8.7 times what round 1 read.

- Ask: If the run had ten rounds, what would round 10 read?
- Expected: Everything from rounds 1 to 9 again. The reading grows every round, which is why long runs get slow and expensive.

**Build 2:** This time it asks for no tool. The reply is the answer, so the loop stops.

- Ask: What did round 3 have that round 2 did not?
- Expected: The six totals. With every number it needed, it could answer without another tool.

**Build 3:** That was the whole run. Where did the money go: reading or writing?

- Ask: Where did most of the cost go: reading or writing?
- Expected: Here, writing: the 1,466 tokens written cost 1.9 times the 3,768 read, because a written token costs five times as much. In long runs reading takes over, because it repeats every round.

**Point here:** Our run was three model calls, each rereading the whole conversation, with our code running tools in between.

**Transition:** All of this rereading is done by a few lines of ordinary Python.

**Source:** Real run, 19 November 2026, Gemini 3.8 Flash (notebook 1.5). A token is a word or a piece of a word. Pale blue is text the round before had already read. Paid prices: $0.75 in, $3.75 out per million tokens, thinking counted as output; ₹93.5 per dollar.

## loop-code: The loop in eleven lines of Python

**Build 1:** The list called messages is the conversation. Each round, chat() sends all of it to the model, and we add the reply.

- Ask: Which line is the model, and which lines are ordinary code?
- Expected: Only chat() calls the model. Everything else is plain Python that we wrote and can read.

**Build 2:** If the reply asks for no tool, it is the answer, and the function returns it.

- Ask: Which box of the flowchart is this?
- Expected: “Did it ask for a tool?” The answer is just whether the reply has any requests in it.

**Build 3:** Otherwise our code runs each tool and adds the result to the list. Then round again, up to a step limit.

- Ask: What would happen with no step limit?
- Expected: A model that keeps asking for tools would loop for ever and spend money doing it. The step limit is the first guardrail (Part 4).

**Point here:** An agent is an ordinary loop around one model call. Our code runs the tools, keeps the list of messages and decides when to stop.

**Common misconception:** That agent frameworks contain some deeper machinery. They wrap this loop with retries, logging, memory and permissions.

**Notebook:** Notebook 1.5: run_agent is this loop, with printing, an approval check, and errors sent back to the model instead of crashing.

**Transition:** What fills all that reading? We can count it.

**Source:** Simplified from run_agent in notebook/agents.py. The real one also asks a person before any tool marked for approval, and returns a failing tool’s error to the model as its result.

## nb-context: In the notebook

**Build 1:** Back to the notebook. We count the tokens read in each round, and in each part.

- Ask: Which part of the conversation do you expect to be the biggest?
- Expected: Most guess the tool menu or the forecasts. Hold on to that guess.

**Point here:** We can count exactly what the model read, round by round and part by part.

**Notebook:** Notebook 2.1: run the cells under “What the model read each round”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here are the counts from our run.

## context: What did round 3 read?

**Build 1:** Round 3 read 2,464 tokens. The four parts we counted come to only 645. What is the rest?

- Ask: What do you think fills the long grey bar?
- Expected: Its own earlier replies: the requests from rounds 1 and 2, with the formatting around each message.

**Build 2:** The rest is the model’s own earlier replies, sent back to it each round: 74% of what it read.

- Ask: In a long run, what would you trim first?
- Expected: Old replies and old results: summarise them, or keep them in notes. Then the tool menu: offer only the tools the task needs.

**Point here:** The biggest part of the context was the conversation so far, which the model rereads every round.

**Transition:** What does all this rereading cost?

**Source:** Real run, 19 November 2026 (notebook 2.1). The four parts were counted one by one with Gemini’s token counter, so they are approximate. “Its own earlier replies” is the rest of round 3’s 2,464 tokens, formatting included.

## context-cost: Why keep the context short?

**Build 1:** We pay for every token the model reads. Each round pays again for everything before it.

- Ask: What happens to this total if a run takes twenty rounds?
- Expected: It grows much faster than the conversation itself, because each round rereads all the rounds before.

**Build 2:** So we choose what goes into each round. People call this context engineering.

- Ask: Which of these would help in your own chats with ChatGPT or Gemini?
- Expected: Starting a fresh chat for a new topic, instead of one endless conversation. It is the same idea.

**Point here:** Context engineering is choosing what the model reads each round. Every token costs money, and a long context hides what matters. Andrej Karpathy described it (X, 25 Jun 2025) as filling the context window “with just the right information for the next step”.

**Common misconception:** That a bigger context window solves this. A longer context costs more each round, and models attend less well to what is buried in the middle.

**Transition:** One more question about the context: how would an agent remember you next week?

**Source:** Real run, 19 November 2026: the tokens read in each of its three rounds.

## memory-q: How would it remember you next week?

**Build 1:** When a run ends, its conversation is gone. Next week the model starts from nothing.

- Ask: How would you make it remember this?
- Expected: Write it down somewhere, and read it back next time.

**Build 2:** We give it two more tools. A note written in one run can then be read in any later run.

- Ask: Where would a real product keep these notes?
- Expected: In a database or a document store, one per user. In the notebook, a small text file.

**Point here:** Memory that outlasts a run is text that one tool saves and another reads back. The model itself does not change.

**Common misconception:** That the model learns from your conversations as it goes. Its weights do not change; it remembers only what someone stores and feeds back.

**Transition:** Over to the notebook to try it.

## nb-memory: In the notebook

**Build 1:** Two separate runs: the first is told about the asthma, the second is asked a question.

- Ask: The second run starts with an empty conversation. How could it know about the asthma?
- Expected: Only by reading its notes. Watch for read_notes in its first round.

**Point here:** Two runs, two conversations. Only the file connects them.

**Notebook:** Notebook 2.2: run the cells under “Notes that outlast a run”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what happened in our run.

## memory: The second run read its notes first

**Build 1:** Our first run saved one line to a file. Then the run ended, and its conversation was gone.

- Ask: What exactly was saved?
- Expected: One sentence of text: “User has asthma and prioritizes air quality over weather for travel advice.” Nothing about the model changed.

**Build 2:** The second run started empty. In one round, it read its notes and both forecasts.

- Ask: Why did it read its notes at all?
- Expected: The read_notes tool says it holds facts about the user, and the question said “for me”. It asked for the notes and both forecasts in the same round.

**Point here:** Memory across runs is a file the agent writes with one tool and reads with another.

**Transition:** Tools, a loop and notes are the parts. Builders put them together in a few common patterns.

**Source:** Real run, 19 November 2026 (notebook 2.2): two rounds, with three tool calls at once in the first. The first request and the answer are shortened here.

## patterns: A chain runs the same steps every time

**Build 1:** The simplest pattern is a chain, like Part 1’s workflow: fixed steps in a fixed order, with a check between them.

- Ask: What would break this chain?
- Expected: A question of a different shape: four cities, or weather instead of air. The chain does only the steps we wrote.

**Point here:** Prompt chaining is the first of the five patterns in Anthropic’s guide. The guide advises the simplest pattern that does the job.

**Common misconception:** That every AI system needs a free-running agent. Chains and routers are workflows, and most systems in production are workflows.

**Transition:** The second pattern sorts things before anyone works on them. Back to the notebook.

**Source:** The five patterns: Anthropic, “Building effective agents” (19 Dec 2024). This chain is a design, not a recorded run.

## nb-route: In the notebook

**Build 1:** Four customer messages, one in Hindi. One short model call picks the queue for each.

- Ask: Why use a model to sort these, and not a list of keywords?
- Expected: Keywords miss new wording and other languages. Watch the message in Hindi.

**Point here:** Routing: one cheap model call decides who handles a request.

**Notebook:** Notebook 2.3: run the cells under “Routing: one call picks the queue”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is where each message went in our run.

## routing: Each message went to one queue

**Build 1:** Our four messages. Which queue should each one go to: billing, technical or other?

- Ask: Where would you send each one?
- Expected: Most of the room will agree with the model. Sorting is easy for a person, and now cheap for a model too.

**Build 2:** One short model call per message picked the queue. The Hindi message has no English keyword, and still went to billing.

- Ask: What would a keyword rule have done with the Hindi message?
- Expected: Missed it: there is no word like “refund” in English in it. The model read it as a refund that has not arrived, and sent it to billing.

**Point here:** Sort first, then hand each request to the right specialist: a person, a cheaper model, or a narrower agent.

**Transition:** The last two patterns use several model calls that work together.

**Source:** Real run, 19 November 2026 (notebook 2.3). The messages are written for the notebook. English gloss of the Hindi message: ours.

## patterns-2: Several model calls can work together

**Build 1:** A lead call splits the job, and helpers work on the parts in parallel, each with its own context.

- Ask: Why would several helpers beat one agent on a research question?
- Expected: Each helper explores one direction with a clean context, and they run at the same time. The price is many more tokens.

**Build 2:** One call writes, another checks it against a list, and the writer revises. Part 3’s farm advisory works this way.

- Ask: Why use a second call to check the first, rather than asking the writer to be careful?
- Expected: A separate check with an explicit list catches what the writer misses, and a person can read and change the list. It is a small eval run on every draft.

**Point here:** Several model calls can do better than one, at a price in tokens: Anthropic reports agents use about 4× the tokens of a chat, and multi-agent systems about 15×. Anthropic calls these two patterns “Orchestrator and workers” and “Evaluator and optimizer”.

**Common misconception:** That more agents are always better. For most tasks a single agent, or a workflow, is cheaper and easier to debug.

**Notebook:** Notebook 3.4 (Part 3): the writer and critic on today’s forecast.

**Transition:** Every pattern here runs tools. Back to the loop, at the tool step.

**Source:** Anthropic, “How we built our multi-agent research system” (13 Jun 2025).

## map-tool: Where are we in the loop?

**Build 1:** Now the box where our code runs a tool. So far, each tool was a Python function we wrote.

- Ask: If Gemini, Claude and ChatGPT should all use your company’s database, how many times do you write that tool?
- Expected: Once for each, unless they share a standard. The next slide counts the cost.

**Point here:** Tools connect an agent to your systems. Writing and connecting them is most of the work in practice.

**Transition:** The next slide counts the connectors.

## mcp: How many connectors do we need?

**Build 1:** Four models and five tools. Without a standard, every pair needs its own connector: 20.

- Ask: If you add one more tool, how many new connectors do you write?
- Expected: One per model: 4 more, and every model vendor has to do it.

**Build 2:** MCP, the Model Context Protocol, is that standard. Each model and each tool implements it once: 9.

- Ask: And with MCP?
- Expected: One: the new tool speaks MCP, and every model that speaks MCP can use it.

**Point here:** MCP turns an n × m problem into n + m: write a tool once, and any agent that speaks MCP can use it.

**Common misconception:** That MCP makes tools safe. It standardises how tools are connected; a tool result with hidden instructions travels through it just as easily (Part 4).

**Notebook:** Drag the sliders: add a tool and watch the count without MCP jump by the number of models. Notebook 5.2 serves our forecast tool over MCP.

**Transition:** Part 2 in one slide.

**Source:** Counts on the slide are arithmetic: n × m against n + m. MCP is an open standard; the specification is at modelcontextprotocol.io.

## recap-2: Part 2 in one slide

**Build 1:** Next: agents at work, and who checks them.

- Ask: What would you want this agent to remember about you, and what should it never write down?
- Expected: Preferences help it, but a health condition is sensitive data. Decide what may be stored, for how long, and who can read the notes.

**Point here:** An agent is a loop that rereads its context each round; tools, memory and patterns are built around it.

**Transition:** Part 3: agents at work.

## p2-memory-kinds: Three kinds of memory (optional)

**Build 1:** Agents use three kinds of memory. Which one would hold your company’s policy manual?

- Ask: Which kind of memory would hold your company’s policy manual?
- Expected: Documents: the agent searches them and quotes the parts it needs (retrieval). Notes hold short facts about a user or a task; the context holds only this run.

**Point here:** The context is cleared after each run; notes and documents are stored outside the model and read back with tools.

**Source:** Drawings: made for the slide.

## part-3: Part 3 · Agents at work

**Build 1:** Key question: for each job, how much should the agent do without a person?

- Ask: Which job in your team would you hand to an agent first?
- Expected: Answers vary: reports, ticket triage, data clean-up, first drafts. Keep two of them; at the end of the part we place them on a map.

**Point here:** Every job gets the same two questions: what does the agent do, and where does a person check it?

**Transition:** Each job is drawn the same way, as a trace. First, how to read one.

**Source:** Illustration: generated (Gemini image model).

## read-card: How to read a trace

**Build 1:** Our opening run, drawn as a trace. Time runs left to right, and each row shows who acts.

- Ask: Who acts most often in this run?
- Expected: The tools: nine calls in two rounds. The agent only decides what to ask for.

**Build 2:** Here a person had a say only at the two ends. In the jobs ahead, watch for the amber circle.

- Ask: Where in this run did a person have a say?
- Expected: Only at the two ends: you asked, and you read the answer. In every trace that follows, look for where the person sits.

**Point here:** Every job in this part is drawn the same way, so you can compare who decides, what acts, and where a person checks.

**Transition:** The first job: fixing code.

**Source:** The opening run (Gemini 3.8 Flash, 19 November 2026): nine tool calls in three rounds.

## app-coding-task: Coding: a test has started failing

**Build 1:** What would an agent need for this job? Think of what a developer opens first.

- Ask: What would you open first if you had to fix this yourself?
- Expected: The failing test and its error, then the code that changed yesterday. An agent needs the same: a way to run the tests and to read the files.

**Build 2:** The same tools a developer uses. The last one proposes the change for a person to review.

- Ask: Which of these tools touches something other people depend on?
- Expected: Editing changes only the agent’s own copy. The pull request is where the change meets everyone else’s code, so that is where a person comes in.

**Point here:** A coding agent needs the tools a developer already uses: run the tests, read and edit files, search, and propose a change.

**Transition:** Here is what it does with them.

**Source:** Illustration: generated.

## app-coding: Coding: it stops at a pull request

**Build 1:** It works on its own copy of the code, and it can tell when the fix works: the tests pass.

- Ask: The tests pass now. Is the job done?
- Expected: Not yet. Passing tests say the failure has gone; whether the fix is the right one is a reviewer’s call.

**Build 2:** It does not merge the fix itself. A person reads the change and decides.

- Ask: Why stop at a pull request instead of merging?
- Expected: Merging changes the code everyone else depends on. A review takes minutes, and the tests already did most of the checking.

**Build 3:** How good are coding agents? This is the best-known public test of them.

- Ask: What does a score on this test tell you about your own code?
- Expected: Less than it seems. The 500 tasks come from public Python projects, and the test has leaked into training data. Run your own evals (Part 4). Developers use the tools anyway: 84% use or plan to use AI tools, and 23% use agents at least weekly (Stack Overflow survey, 2025).

**Point here:** A coding agent can do most of the work because tests check it in seconds, and a person approves the merge. On the stakes map at the end of Part 3: “Agent acts, a person approves” (tests run in seconds; merging is the step a person approves).

**Common misconception:** That vendor scores are the ones to quote. Vendors report higher numbers (80.9% for Claude Opus 4.5, 93.9% for the restricted Claude Mythos Preview), and OpenAI has said the test is contaminated and stopped reporting it. The independent leaderboard is the safer number.

**Transition:** Code has tests. Data analysis has something almost as good: code you can rerun.

**Source:** Trace: a sketch of how coding agents such as Claude Code or Codex typically work. Score: the swebench.com leaderboard.

## app-analyst-task: Data analysis: which city had the worst winter air?

**Build 1:** A table of daily PM2.5 for ten Indian cities. What would an agent need to answer this?

- Ask: How would you answer this yourself?
- Expected: Open the table, keep the winter months, count each city’s days over the limit, and draw a bar chart.

**Build 2:** Only two tools. The second runs any code the model writes, so it can count, average and draw.

- Ask: Why one tool that runs code, instead of one tool for each question?
- Expected: Because the questions change. With code it can filter, count and chart whatever the question needs. In a real deployment that code runs in a sandbox.

**Point here:** An analysis agent needs only a way to see the data and a way to run code on it.

**Transition:** Over to the notebook to run it.

**Source:** Data: daily PM2.5 for each city, CAMS model estimates via Open-Meteo. Illustration: generated.

## nb-analyst: In the notebook

**Build 1:** This run takes about a minute, so we start it and watch the code it writes.

- Ask: What should a careful analyst do before counting anything?
- Expected: Look at the table: which columns, which cities, which dates. Watch whether the agent does.

**Point here:** The agent writes and runs its own code, and we can read every line of it.

**Notebook:** Notebook 3.1: run the cells under “A data analyst”. Live, it takes about a minute: our recorded run spent 37 seconds in the model, and drawing the chart adds a little. Read out each run_pandas call while it works. If it is slow or fails, move on: the next slides show our recorded run.

**Transition:** Here is what our recorded run did.

## app-analyst: It looked at the table before it counted

**Build 1:** First it asked what is in the table: the columns, the cities, the dates. Then it wrote code to count.

- Ask: Why look at the table before counting?
- Expected: To learn the column names and the date range. Code written blind fails, or worse, counts the wrong thing.

**Build 2:** Three days sat at exactly 60, so it questioned its own definition and counted both ways.

- Ask: What would you check before trusting these counts?
- Expected: The definition: does “over the standard” mean above 60, or 60 and above? Counting both ways changed Ahmedabad and Mumbai by a day or two; it kept “above 60”.

**Point here:** An analysis agent shows its work as code, so anyone can rerun it and check the numbers. On the stakes map at the end of Part 3: “Let it run” (the code can be rerun and the numbers recomputed).

**Common misconception:** That code makes the answer right. One of its five code runs failed, and it read the error and fixed the code. A wrong definition raises no error at all, so that is what a person checks.

**Transition:** Here is the chart it drew, and its answer.

**Source:** Real run (notebook 3.1, Gemini 3.8 Flash, 19 November 2026): six tool calls, condensed to its main steps.

## analyst-answer: Its chart and its answer

**Build 1:** Its chart, redrawn from its numbers. The top cities were over the limit on most winter days.

- Ask: Which city would you have guessed?
- Expected: Most guess Delhi. Kolkata comes first, with Patna and Delhi close behind.

**Build 2:** Its answer agrees with the chart. Every number came from code, so we can rerun it to check.

- Ask: Would you put this headline in a report as it stands?
- Expected: After one check: rerun the code and confirm the definition of “over 60”. And say what the data are: model estimates for each city, from CAMS. At the other end, Bengaluru and Chennai had one day each over the limit.

**Point here:** The answer comes with the code that produced it, so checking it is cheap: rerun and compare.

**Common misconception:** That the chart shows measured air. These are CAMS model estimates for each city, November 2025 to February 2026; no monitoring station was read. The agent’s own chart is figures/p3a-analyst-chart.png, too small to read in a hall, so the slide redraws it.

**Transition:** Research is harder to check. There is no code to rerun, only sources.

**Source:** Real run (notebook 3.1, Gemini 3.8 Flash, 19 November 2026), chart redrawn from its numbers. Data: CAMS model estimates via Open-Meteo.

## app-research-task: Research: an answer with sources

**Build 1:** A question about a government programme, and we want a source for every claim. What would an agent need?

- Ask: Where would you look first for this?
- Expected: A search engine, then the programme’s own pages. An agent needs the same: a search tool, and a way to read what it finds.

**Build 2:** A search and a reader. Ours uses Wikipedia; at work it would be the web and your own files.

- Ask: What could go wrong with an answer built from search results?
- Expected: It might rest on one weak source, quote an old figure, or attach a link that does not say what the claim says.

**Point here:** A research agent needs a search tool, a way to read, and instructions to cite what it read. Products sold as “deep research” do the same with many more searches, for market scans or literature reviews.

**Transition:** Over to the notebook.

**Source:** Illustration: generated.

## nb-research: In the notebook

**Build 1:** We tell it: answer only from what you read, and put a link after each claim.

- Ask: How many pages do you think it will read?
- Expected: Most guess several. Watch the tool calls: it may read fewer than you expect.

**Point here:** We ask for a link after each claim, so that we can see where each claim came from.

**Notebook:** Notebook 3.2: run the cells under “A research assistant with sources”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run.

## app-research: Our run read one page

**Build 1:** It searched once, picked one page from the results, and read it.

- Ask: The search returned five titles. Which would you have read?
- Expected: It read “Air pollution in India”, a general page. The programme had no page of its own among the results.

**Build 2:** Then it answered with a link after each claim, as we asked. Are the links enough?

- Ask: Every claim has a link. Can you forward the answer to your manager?
- Expected: Not yet. A link says where to look. Someone has to open it and read the sentence it points to.

**Point here:** A research agent saves the searching and reading, but its answer is a draft until someone checks the sources. On the stakes map at the end of Part 3: “Agent drafts, a person decides” (citations must be opened and read to be checked).

**Transition:** Here is its answer, with its links.

**Source:** Real run (notebook 3.2, Gemini 3.8 Flash, 19 November 2026): two tool calls.

## research-links: Every claim has a link

**Build 1:** Its answer, cut to the key phrase of each claim. It looks well sourced.

- Ask: Which of these claims would you check before quoting it?
- Expected: The target. It is the number a decision would rest on, and it is for 2024, which has passed. Is it still the target today? The answer cannot tell you.

**Build 2:** All three links go to one general page. Someone still has to open it and read it.

- Ask: What would a careful researcher add?
- Expected: A primary source, such as the programme’s own documents, and the date of each figure. A general page is only a starting point.

**Point here:** A link shows where a claim came from. Only reading the source shows whether the claim is right and still current.

**Common misconception:** That a citation proves a claim. A model can attach a plausible link to a sentence the page does not support; only reading the source checks it.

**Transition:** From knowledge work to operations: customer support.

**Source:** Real answer (notebook 3.2, Gemini 3.8 Flash, 19 November 2026), each claim cut to its key phrase. Every link: https://en.wikipedia.org/wiki/Air_pollution_in_India

## app-support-task: Customer support: the refund from Part 1

**Build 1:** The refund from Part 1, now as a customer’s message. What would an agent need to settle it?

- Ask: What would a person on the support desk check first?
- Expected: The order: was it delivered, and for how much? Then the policy: is damage covered, and is it within the time limit?

**Build 2:** Two of these only read. The two in red act: one moves money, one sends a message.

- Ask: Which of these tools would you let it use without asking you?
- Expected: Reading, always. Refunds only up to a small amount. Replies perhaps, once you trust its wording.

**Point here:** Reading tools are safe to give an agent. The tools that move money or send messages need limits.

**Transition:** So we put a cap on the refund tool.

**Source:** The refund is from the notebook’s demo inbox. Illustration: generated.

## app-support: Customer support: refunds up to a cap

**Build 1:** It reads the message, the order and the policy, then asks: is the amount under the cap?

- Ask: What cap would you set, and why?
- Expected: Most choose a small amount: small, clear cases run alone, large or odd ones go to a person. That is Part 1’s autonomy level, set by amount.

**Build 2:** Under the cap, it refunds and replies by itself. Over the cap, a person approves first.

- Ask: What else should send a case to a person?
- Expected: An angry customer, a repeat claim, a legal threat, anything the policy does not cover. Keep the cap low: whatever the agent promises, the company has to honour (Air Canada, Part 4).

**Point here:** A support agent can settle small, routine refunds; anything over the cap goes to a person. On the stakes map at the end of Part 3: “Agent acts, a person approves” (small refunds are easy to check; a person approves anything over the cap).

**Common misconception:** That the cap is something the model remembers to respect. It belongs in the refund tool itself, in our code, so it holds whatever the model writes.

**Transition:** Has anyone run this at scale? One payments company did.

**Source:** Trace: a design drawn for this talk; it describes no deployed system.

## support-klarna: Klarna’s assistant took two-thirds of its chats

**Build 1:** Klarna, a payments company, put an AI assistant on its customer chats. In its first month:

- Ask: It handled two-thirds of the chats. Is two-thirds of the job done?
- Expected: No. The rest are the hard cases, and speed says nothing about whether the customer was helped.

**Build 2:** Its CEO later said the focus on cost had lowered quality. What would you measure besides cost?

- Ask: Why do you think quality fell?
- Expected: Its CEO said cost had been too dominant a factor in judging it. Klarna now offers a person for some cases; the new staff are freelance, gig-style workers, and total headcount kept falling. Klarna had said the assistant did the work of about 700 full-time agents.

**Point here:** Handling a share of the chats is a different thing from helping those customers. Measure quality from the start, and keep a person within reach.

**Common misconception:** That “Klarna is hiring people again” means it reversed course. The hires are freelance, gig-style agents, and headcount kept falling.

**Transition:** Now our own inbox assistant, with an approval step built in.

**Source:** Klarna: press release (Feb 2024); its CEO’s interview with Bloomberg (May 2025), as reported by Entrepreneur.

## nb-inbox: In the notebook

**Build 1:** A made-up inbox of four emails, with this refund among them. Sending an email needs a person’s approval.

- Ask: Which of its actions should wait for you?
- Expected: Sending. Reading is safe, but a sent email cannot be taken back.

**Point here:** The approval sits in our code, on the tool, so the model cannot skip it.

**Notebook:** Notebook 3.3: run the cells under “An inbox assistant that asks first”. When it stops and asks before send_email, read the request out, then type y. If it is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run.

## inbox-run: It asked before it sent

**Build 1:** We asked it to reply to Priya and summarise the rest. First it read all four emails.

- Ask: It read the refund email too. Did it act on it?
- Expected: No. We did not ask it to; it only mentioned the refund in its summary. Reading it was harmless.

**Build 2:** Then it asked to send one reply. Our code held it until a person approved, and only then sent it.

- Ask: What if the reply had gone to the wrong person?
- Expected: The approval would catch it: you see the address and the text before anything is sent. In Part 4 an email in this inbox tries to trick the agent, and this same step stops it.

**Point here:** The approval step worked: the agent read freely, and the one action with an effect outside, sending, waited for a person. One approval, one email sent.

**Transition:** That is knowledge work and operations. Now, jobs outside the office.

**Source:** Real run (notebook 3.3, Gemini 3.8 Flash, 19 November 2026): four rounds, six tool calls, 16 seconds. The inbox is made up for the demo.

## work-beyond: Outside the office, who checks the work?

**Build 1:** First a science project at Google DeepMind, then jobs in India. For each one, watch who checks the result.

- Ask: In your own work, who checks a result before anyone acts on it?
- Expected: Sometimes a program, such as a test or a reconciliation. Often a colleague or a manager. Every job next has one or the other, or both.

**Point here:** From here on we ask one thing of each job: what checks the result, a program or a person?

**Transition:** First, a job where a program checks every attempt.

**Source:** Illustrations: generated.

## app-evolve-task: AlphaEvolve: a better rule for Google’s servers

**Build 1:** Google’s engineers want a better rule for placing jobs on their servers. They already have code that scores any rule.

- Ask: What would an agent need to work on this?
- Expected: A way to run code, the scoring program, and somewhere to keep what worked.

**Build 2:** With these, it can try a rule, see its score and try again, without waiting for a person.

- Ask: Who has to look at each attempt?
- Expected: Nobody. The scoring program rates each attempt in seconds, so no person has to read them.

**Point here:** This job comes with its own check: a program that scores any rule.

**Transition:** So what does the agent do with it?

**Source:** Illustration: generated.

## app-evolve: AlphaEvolve: a program scores every attempt

**Build 1:** The agent writes a rule, the program scores it, and the best rules are kept and changed again, over and over.

- Ask: How many attempts could it make in a day?
- Expected: Far more than any person could read: each one is scored in seconds, day and night.

**Build 2:** Nobody reads each attempt, so it can try far more than a team could check.

- Ask: Which problems in your work come with a scorer like this?
- Expected: Scheduling, routing, compression: anything with a test suite or a cost model.

**Point here:** Because the check is a program, the loop can run without a person looking at each attempt.

**Common misconception:** That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the scorer does much of the work. The same loop found a way to multiply 4×4 complex matrices with 48 multiplications, and a faster kernel that cut Gemini’s training time by 1%.

**Transition:** Most jobs have no scorer like that. A farmer’s question is one of them.

**Source:** Google DeepMind blog, 14 May 2025. The trace is simplified.

## app-farmer-task: A voice note from a farmer near Mehsana

**Build 1:** A farmer near Mehsana asks this in a voice note, in Gujarati. The answer depends on this week’s weather.

- Ask: What would it need to answer well?
- Expected: The weather for the next few days, what cumin needs, and Gujarati both ways.

**Build 2:** The forecast and the crop notes give it facts. Without them it would guess, as the model on its own did.

- Ask: What could go wrong with the answer?
- Expected: The wrong weather, advice meant for another region, or a reply the farmer cannot read. Bad advice can cost a season’s crop.

**Point here:** The agent answers from the local forecast and crop notes, in the farmer’s own language.

**Transition:** In the notebook we build the middle part of this job.

**Source:** Illustration: generated.

## nb-farm: In the notebook

**Build 1:** One call writes the advisory from the real forecast. A second call checks it against five rules.

- Ask: What should happen if the draft breaks a rule?
- Expected: The checker sends back the problems, and the writer tries again.

**Point here:** A second call that checks the first against a fixed list is a cheap check you can always add.

**Notebook:** Notebook 3.4: run the cells under “A farm advisory, written and checked”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** This is what our run wrote.

## farm-reply: The advisory our run wrote

**Build 1:** The teal numbers come from the forecast. The blue one comes from the crop notes.

- Ask: Who here reads Gujarati? Does it sound like something a farmer would act on?
- Expected: In English: no rain from 19 Nov to 23 Nov (chance 0%), nights down to 16.4 °C on 22 Nov. Cool, dry weather suits cumin, so sow this week and water lightly at once, then every 8 to 10 days.

**Point here:** Every number in the advice comes from a source we gave it: the forecast or the crop notes.

**Transition:** Before anyone sends it, the second call checks it.

**Source:** Our run (notebook 3.4, Gemini 3.8 Flash, 19 November 2026). Forecast: Open-Meteo forecast. The crop notes are illustrative, not agronomic advice.

## farm-critic: Did the draft pass the checks?

**Build 1:** The second call, the critic, read the draft against these five rules. Which one is hardest to check?

- Ask: Which rule is hardest for a model to check?
- Expected: The last one: “says nothing the forecast or crop notes do not support”. It needs judgement, and the critic is a model too.

**Build 2:** All five passed in round one. Any problems would have gone back to the writer.

- Ask: Is a pass from the critic enough to send it to farmers?
- Expected: No. The critic is a model checking a model. Someone who knows farming should approve the advice, because a farmer’s crop depends on it.

**Point here:** A checking call catches broken rules cheaply, but it is a model too, so it should not be the last check.

**Transition:** So where would a person come in?

**Source:** The critic’s real reply, from our run (notebook 3.4, 19 November 2026).

## app-farmer: Who checks the advice before a farmer hears it?

**Build 1:** Our notebook ran the middle: the draft and the critic. A real service adds the voice at both ends.

- Ask: Which steps did our notebook leave out?
- Expected: The voice at both ends: speech to text coming in, a voice reply going out.

**Build 2:** The critic is a model too. Bad advice can cost a farmer the season’s crop, so an agronomist approves.

- Ask: Why both a critic and an agronomist?
- Expected: The critic catches broken rules cheaply. The agronomist answers for the advice, and a photo of a sick plant needs a trained eye.

**Point here:** For a farmer, the agent works by voice, in Gujarati, from local data, and a person approves the advice.

**Common misconception:** That a chatbot alone can advise farmers. Without the forecast and the crop notes it would guess, as the model on its own did in the opening. (Kisan e-Mitra: more than 95 lakh answers in 11 languages, over 20,000 a day, per PIB. Digital Green’s Farmer.Chat serves 1.6 to 3 million farmers.)

**Transition:** The same loop can watch a city’s air.

**Source:** The trace is our design; the draft and the critic are our run (notebook 3.4). Kisan e-Mitra: PIB, Sep 2025.

## app-air-task: Whom should a city warn about tomorrow’s air?

**Build 1:** Every morning a city’s pollution desk decides where to warn people. The answer changes from day to day.

- Ask: What would it need?
- Expected: Station readings, a forecast, a list of schools and hospitals, and a way to send the alerts.

**Build 2:** Most of this job is gathering and drafting, every morning. That is the part an agent can take.

- Ask: Which part of this job is the same every morning?
- Expected: Collecting the numbers, finding the hotspots, drafting the messages. The decision to send is not routine.

**Point here:** The routine part of the desk’s morning is data gathering and drafting.

**Transition:** So what would the agent do, and who approves the alerts?

**Source:** Illustration: generated.

## app-air: Air-quality alerts, every morning

**Build 1:** Each morning it gathers the readings and the forecast, finds the hotspots and drafts the alerts.

- Ask: Should the alerts go out on their own?
- Expected: No. Schools and hospitals act on them, and a wrong alert costs trust.

**Build 2:** A false alarm closes schools; a missed one harms children. A person makes that call.

- Ask: Why should a person make that call, and not the agent?
- Expected: Someone has to answer for a closed school or a missed warning, and the forecast is only an estimate. (In our analyst run Delhi was over the standard on 109 days, Gandhinagar on 21.)

**Point here:** An agent can do the daily gathering and drafting; a person approves each alert, because schools and hospitals act on it.

**Common misconception:** That CAMS numbers are station measurements. They are estimates from a model that takes in satellite data; a real desk would check them against its own stations.

**Transition:** Buildings are easier to check: a simulator and a meter do it.

**Source:** The trace is our design. Days over the standard, Nov 2025 to Feb 2026: our analyst run (notebook 3.1, Gemini 3.8 Flash) on CAMS estimates via Open-Meteo.

## app-building-task: When should a campus cool its lecture halls?

**Build 1:** A campus wants cool lecture halls and a lower electricity bill. Power costs more at some hours than at others.

- Ask: What would it need to know?
- Expected: When the rooms are used, how hot it will be, and when power is cheap.

**Build 2:** With the timetable, forecast and tariff, it can cool rooms early, before the price goes up.

- Ask: How could it save money without making anyone hot?
- Expected: Cool the halls before the peak tariff, and skip the rooms nobody is using.

**Point here:** The savings come from timing: cool before the price goes up, and only the rooms in use.

**Transition:** And who checks the plan?

**Source:** Illustration: generated.

## app-building: Building energy: a schedule for the week

**Build 1:** The agent plans when to cool each hall. A simulator checks the plan’s comfort and cost before anything runs.

- Ask: Who checks the plan before it runs?
- Expected: A program: the simulator works out comfort and cost for the week.

**Build 2:** A bad schedule costs a warm afternoon, and is fixed the next day.

- Ask: Why can this run with less supervision than the air alerts?
- Expected: Checking is cheap, before and after, and a bad schedule costs some rupees and some comfort for a day, then is fixed the next.

**Point here:** When a simulator and a meter check every decision, the agent can run day to day while a person reads the weekly report.

**Transition:** Last, a clinic, where every note is about a patient.

**Source:** The trace is our design.

## app-clinic-task: Could an agent write a doctor’s notes?

**Build 1:** A doctor sees patient after patient, then writes the notes. Could an agent listen and draft them?

- Ask: What would it need?
- Expected: A microphone, speech to text that handles two languages, and the patient’s record.

**Build 2:** And one thing that is not a tool: the patient’s permission to record.

- Ask: What must happen before the recorder is switched on?
- Expected: The patient agrees. Consent comes first, and a person gives it.

**Point here:** Before any tool runs, a person has to agree to be recorded.

**Transition:** So what does it do with the recording?

**Source:** Illustration: generated.

## app-clinic: Clinic notes: from the consultation to the record

**Build 1:** The patient agrees first. Then it listens, transcribes, and drafts the note.

- Ask: Would you let it file the note straight into the record?
- Expected: No. The note goes into a medical record, and its errors reach patients.

**Build 2:** Editing a draft is quicker than writing one, even when the doctor signs every note.

- Ask: What would you measure to know whether it helps?
- Expected: Time spent on notes, and the errors found when the doctor reviews. Across 2.58 million visits, Kaiser Permanente counted about 15,800 hours saved, with the review kept.

**Point here:** The scribe saves writing time and the doctor keeps every decision: Kaiser Permanente’s doctors saved about 15,800 hours in about 15 months.

**Common misconception:** That the scribe makes the diagnosis. It writes down what was said; the doctor decides.

**Transition:** Each job so far got a different amount of freedom. Can one picture show why?

**Source:** The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, Oct 2023 to Dec 2024; about 15,800 hours as reported by the AMA. The trace is our design.

## stakes-map: How much freedom should each job get?

**Build 1:** Two questions place each job: how easily can the result be checked, and what does a mistake cost?

- Ask: Before the points appear: where would you put a coding agent? A clinic scribe?
- Expected: Coding: tests make it easy to check, and a merged change can break production, so the right-hand side, just above the middle. The scribe: the doctor can read it, but errors reach patients, so near the top.

**Build 2:** Every job from this part, and a few from the appendix. Which one would you move?

- Ask: Which point would you move, and why?
- Expected: Common moves: support higher, because promises bind the company; research further right, because key claims can be spot-checked. Moving a point moves its advice with it.

**Build 3:** Each corner suggests how much freedom to give. Where would your team’s most repeated task sit?

- Ask: Where does your team’s most repeated task sit?
- Expected: Most operational work lands top right: seven of the fourteen jobs are there. Let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.

**Point here:** Two questions set the autonomy: how cheaply can the result be checked, and what does a mistake cost?

**Common misconception:** That a more capable model moves a job to the bottom right. Capability changes how often mistakes happen; what a mistake costs, and how hard it is to check, stay where they were.

**Notebook:** Click a point to read why it sits there. The positions are the speaker’s judgement, not measurements: invite the room to move them.

**Transition:** Part 3 in one slide.

**Source:** Positions: the speaker’s judgement, for discussion (data/apps.json). The zones split each axis at its middle.

## recap-3: Part 3 in one slide

**Build 1:** Next: how agents fail, and the guardrails that catch them.

- Ask: Pick one task from your week. Which zone of the map does it fall in?
- Expected: Most land top right: the agent can do the work if a person approves the step that cannot be undone. That is where Part 5 begins.

**Point here:** Two things set how much an agent may do alone: how cheaply its result can be checked, and what a mistake costs.

**Transition:** Even in the right zone, agents fail. Part 4 shows how.

## part-4: Part 4 · How agents fail

**Build 1:** Key question: what must be in place before an agent acts on anything that matters?

- Ask: Has software ever done something you did not mean it to? What stopped the damage?
- Expected: Autocorrect, an email to the wrong list, a script that deleted files. Usually an undo, a backup, or a person who noticed in time.

**Transition:** Start with a little arithmetic.

**Source:** Illustration: generated (Gemini image model).

## compound-q: How often is a twenty-step task right?

**Build 1:** Each step of a task is right 95% of the time, and the task takes twenty steps. How often is the whole task right?

- Ask: Take a guess: what share of these tasks come out fully right?
- Expected: Most guess well above half. The answer surprises people.

**Build 2:** Only 36% of the time. The task is right only if every step is right, so the chances multiply.

- Ask: Would you hire someone who gets 95% of steps right?
- Expected: For a one-step job, gladly. For a twenty-step job, they finish cleanly about a third of the time.

**Point here:** Reliability multiplies across steps: right 95% of the time per step means a twenty-step task is right 36% of the time.

**Common misconception:** That a model right 95% of the time gives tasks right 95% of the time. That holds only for one-step tasks. Real steps are not independent, so treat this as a simple model of a real trend.

**Transition:** Over to the notebook, for a few more cases.

**Source:** Computed in scripts/sci/p4.py. The simple model: steps fail independently, and every step must be right.

## nb-compound: In the notebook

**Build 1:** The same sum for three step rates and four task lengths. It prints three lines.

- Ask: Which row is closest to the tasks in your work?
- Expected: Real tasks are often long. Even at 99% a step, a 50-step task is right only 61% of the time.

**Point here:** The longer the task, the more reliable each step has to be.

**Notebook:** Notebook 4.1: run the cells under “Small errors add up”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** The same sum as a curve, and one way to fix it.

## compound: What if we check each step?

**Build 1:** The same sum as a curve. Drag the steps up: at 50 steps, the task is right 8% of the time.

- Ask: What would it take to trust a 50-step task?
- Expected: Far more reliable steps, or a check at each step. The next click adds the check.

**Build 2:** Check each step and retry once if it fails. Now twenty steps come out right 95% of the time.

- Ask: What counts as a check in your work?
- Expected: Running the tests, comparing a number with its source, validating a form against a rule, a second model reviewing, a person approving.

**Point here:** Reliability multiplies across steps, so long runs need checks inside the loop as well as a better model.

**Common misconception:** That the check has to be perfect to help. Here it catches every wrong step; a check that catches most of them still lifts the curve a long way. Real checks miss things, so treat the green curve as a best case.

**Notebook:** Drag the per-step slider up and watch how much the long tasks gain. Switch the check off and on.

**Transition:** Now three real failures.

**Source:** Computed in scripts/sci/p4.py. With a check, a step is right unless both tries fail.

## fail-replit: What went wrong at Replit?

**Build 1:** It went wrong at the tool: the agent could run commands on live data. What would have stopped it?

- Ask: What would have stopped it?
- Expected: Working on a copy of the data, so that a mistake costs only the copy. Replit’s chief executive said they had started separating development and live databases automatically.

**Point here:** What an agent can touch decides how much one mistake costs.

**Common misconception:** That this is a story about a bad model. As reported, the agent had write access to production; its own chat log said it wiped records of 1,206 executives and 1,196 companies. One report says the data was later recovered with Replit’s rollback.

**Transition:** The second failure was a chatbot that only answered questions, and it still cost money.

**Source:** Replit, Jul 2025: reported by The Register and Tom’s Hardware.

## fail-aircanada: What went wrong at Air Canada?

**Build 1:** It went wrong at the answer. A tribunal held the airline responsible, and it had to pay CAD 812.02.

- Ask: Who is responsible for what a company’s chatbot tells a customer?
- Expected: The company. In the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity responsible for its own actions. The tribunal did not accept that.

**Point here:** A company answers for what its agent tells customers.

**Common misconception:** That only agents that act are risky. This chatbot only answered, and the answer alone cost money. The customer had asked about a bereavement fare; the chatbot said it could be claimed after travelling, and the policy said otherwise.

**Transition:** The third failure is our own.

**Source:** Moffatt v. Air Canada, 2024 BCCRT 149, decided 14 Feb 2024; reported by law-firm summaries of the decision.

## fail-ours: What went wrong in our own run?

**Build 1:** It went wrong at the result. The tool failed, the model read the error, and it asked again.

- Ask: What should stop a loop like this?
- Expected: A step limit, a cap on spending, or a rule to give up after a few failures. We add a step limit in the notebook shortly.

**Point here:** An agent told to keep trying will keep trying. Something outside the model has to stop it.

**Common misconception:** That the model will notice it is stuck. Ours read the same timeout every round and asked again, because the goal told it to keep trying.

**Transition:** Nobody attacked those three systems. The next failure needs only an email from a stranger.

**Source:** Our run: notebook 4.4, 19 November 2026 (Gemini 3.8 Flash).

## injection: An email with instructions hidden in it

**Build 1:** We ask our inbox agent to summarise the inbox in three lines. One of the emails looks like this.

- Ask: Would you notice anything odd about this email?
- Expected: Perhaps the sender’s address. A change of bank details is a common fraud, and it usually looks routine.

**Build 2:** This is prompt injection: text inside the data that poses as an instruction.

- Ask: What do you expect the agent to do with these lines?
- Expected: Some say forward the invoices, some say ignore them. The model reads instructions and data in one stream of text, so either can happen.

**Point here:** Prompt injection: an agent cannot reliably tell the data it reads from the instructions it is given.

**Common misconception:** That a reader would spot the trick. The note is polite and sounds routine, and it is addressed to the assistant.

**Transition:** Let us try it on our own agent.

**Source:** The demo inbox of notebook 4.2. The note is shortened here; the full text is in the notebook.

## nb-inject: In the notebook

**Build 1:** Over to the notebook. We add this email to the demo inbox and ask for the summary again.

- Ask: Will the agent forward the invoices?
- Expected: Watch the tool calls. A send_email to the outside address would mean the attack worked.

**Point here:** We run the attack on our own agent, so we can see what it does.

**Notebook:** Notebook 4.2: run the cells under “An email with hidden instructions”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what happened in our run.

## injection-run: Did our agent fall for it?

**Build 1:** We ran it twice, with and without a person approving each email. Both times, it ignored the note.

- Ask: So the attack failed?
- Expected: The instruction failed. Wait for the summary.

**Build 2:** But its summary passed on the new bank details as routine news, next to a real invoice.

- Ask: Which is worse: forwarding the invoices, or this calm summary?
- Expected: The summary. You trust it, and the next step is someone paying a fraudster.

**Point here:** The agent ignored the instruction and still passed the fraud on. The risk covers what it tells you as well as what it does.

**Common misconception:** That a model that ignores the instruction is safe. Ours ignored it, and its summary still put the fraudster’s notice in front of you as routine.

**Transition:** Was that luck? Back to the notebook, for ten runs.

**Source:** Real run: notebook 4.2, 19 November 2026 (Gemini 3.8 Flash), without the approval step. Markdown removed.

## nb-trials: In the notebook

**Build 1:** Ten runs, five on each of two models. It takes a few minutes, so we start it now and come back to it.

- Ask: Out of ten, how many summaries will warn you about the email?
- Expected: Guesses vary. Our recorded answer is on the next slide; the live one arrives in a few minutes.

**Point here:** Repeating the run shows how often each outcome happens.

**Notebook:** Notebook 4.3: start the cell and go on with the slides; it takes a few minutes. The next slide shows our recorded result. Look at the live counts when the notebook is next on screen.

**Transition:** While it runs, here are our recorded ten runs.

## injection-trials: What happened in ten runs?

**Build 1:** In all ten runs, on both models, the agent never tried to forward the invoices.

- Ask: Is the model safe against this trick, then?
- Expected: Against this wording, in these runs. The next email may be worded better, and another model may follow it.

**Build 2:** But only one summary warned you about the email. The other nine passed the new bank details on as routine.

- Ask: Would you have spotted the fake bank details in a three-line summary?
- Expected: Probably not, because you trust the summary.

**Point here:** Whether a model falls for it changes from model to model and from run to run, so the defence cannot depend on the model noticing.

**Common misconception:** That a smarter model simply ignores injected text. Ours did ignore the instruction, and still passed the fraud on. Only one summary in ten called the email suspicious.

**Transition:** Has this worked outside a demo?

**Source:** Our runs: notebook 4.3, 19 November 2026, Gemini 3.8 Flash and Gemini 3.5 Flash-Lite, no approval step. “Warned” means the summary called the email suspicious or similar.

## attacks: The same trick on real products

**Build 1:** Researchers showed the same kind of attack on three real products.

- Ask: What do the three have in common?
- Expected: Each agent read text from outside, could see private data, and had a way to send it out. That is the next slide.

**Point here:** Prompt injection has worked on widely used products. Any agent that reads text from outside is exposed to it.

**Common misconception:** That this needs a skilled attacker. Each attack was a piece of ordinary text: an email, an issue, a web page. Microsoft rated EchoLeak’s severity 9.3 of 10 (critical) and patched it.

**Transition:** Why could these products be tricked? Each had the same three things at once.

**Source:** Microsoft 365 Copilot: Aim Labs, Microsoft, CVE-2025-32711 (11 Jun 2025); GitHub MCP server: Invariant Labs (26 May 2025); Perplexity Comet: Brave (20 Aug 2025).

## trifecta: The lethal trifecta

**Build 1:** Simon Willison’s rule of thumb: an agent with all three can be tricked into sending your data to an attacker.

- Ask: Which of the three does the assistant in your company’s email or chat tool have?
- Expected: Most have the first two: your files and anything pasted or fetched. The danger starts when it can also send, post or open links.

**Build 2:** Our inbox agent had all three. We removed the third: nothing goes out until a person approves.

- Ask: Which of the three is easiest to remove in your case?
- Expected: Usually the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources.

**Point here:** Willison’s lethal trifecta: private data, untrusted content and a way to send data out. Remove any one and this attack fails.

**Common misconception:** That a better prompt removes one of the three. Telling the model “never send data out” is advice it may ignore. Removing the send tool, or putting a person in front of it, is enforced by code.

**Transition:** Where does that approval sit in the loop?

**Source:** Simon Willison, “The lethal trifecta for AI agents” (16 Jun 2025). The three items on the right are in his words.

## gate: A person approves before an email goes out

**Build 1:** This is the approval from our inbox run in Part 3. It sits between the model’s request and our code.

- Ask: Which tools in your work should wait for a person?
- Expected: Anything that cannot be undone: payments, emails to customers, deletions, orders. Reading can usually run at once.

**Point here:** An approval step is code around the model: send_email cannot run until a person approves.

**Common misconception:** That our approval was tested by the attack. In our runs the model never tried to send the invoices, so it never had to refuse. We cannot plan on that luck; the approval holds whatever the model decides. (In the recorded runs a scripted stand-in answered; in the live notebook, ask_human asks you.)

**Transition:** The other guardrail on the map is a step limit. Back to the notebook.

**Source:** The approval step of our inbox agent (notebook 3.3, 19 November 2026).

## nb-steplimit: In the notebook

**Build 1:** A tool that never answers, and a goal that says keep trying. This time we set a step limit.

- Ask: Without the limit, when would this run stop?
- Expected: Perhaps never. Each round the model reads the error and asks again, until the money runs out.

**Point here:** A step limit stops the loop after a fixed number of rounds, whatever the model wants.

**Notebook:** Notebook 4.4: run the cells under “A step limit”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run, on the map.

## steplimit: The step limit stopped our run after four rounds

**Build 1:** The limit is a counter in our code, outside the model. A cap on spending works the same way.

- Ask: What limits would you set for an agent in your team?
- Expected: A number of rounds, a budget per task, a time limit, and a rule to stop and ask a person after repeated failures.

**Point here:** Limits are enforced by our code, so they hold even when the model is told to keep trying.

**Common misconception:** That a limit has to be large to be safe. Set it a little above what a normal run needs. Our loop’s default is 10 rounds; this run was capped at four.

**Transition:** Approvals and limits act while the agent runs. There is more to do before and after.

**Source:** Our run: notebook 4.4, 19 November 2026 (Gemini 3.8 Flash). Cost at paid prices.

## guardrails: Guardrails before, during and after a run

**Build 1:** Before it runs, decide what it can touch. With only a copy of the data, Replit’s agent could have broken only the copy.

- Ask: Which tools would a first version of your agent really need?
- Expected: Usually read-only ones: search, look up, read. Writing and sending can come later.

**Build 2:** While it runs, a person approves what cannot be undone, and limits cap the loop. We just saw both.

- Ask: Which steps in your process cannot be undone?
- Expected: Payments, emails to customers, deletions, orders, anything published.

**Build 3:** After it runs, keep a log of every run. When anything changes, test it again on cases with known answers.

- Ask: How would you know your agent still works after a change?
- Expected: Run it on real cases with known answers and count how many come out right. That is an eval, next.

**Point here:** Guardrails are code around the model: what it can touch before, what needs approval during, and what is measured after.

**Common misconception:** That a guardrail is a sentence in the prompt (“never delete anything”). Prompts are advice the model may ignore; permissions, approvals and limits are enforced by code.

**Transition:** How do we know an agent works? Back to the notebook.

**Source:** The three layers follow common practice for any production system.

## nb-evals: In the notebook

**Build 1:** We ask the opening question ten times on each model, and check every answer. It takes a few minutes.

- Ask: How would you test an agent before you trust it?
- Expected: Run it many times on cases with known answers, and count how many come out right.

**Point here:** An eval is a set of cases with known answers that we run the agent on, again and again.

**Notebook:** Notebook 4.5: start the cell; it takes a few minutes. The next slide shows our recorded result.

**Transition:** Here are our recorded results.

## evals: Which model should we use?

**Build 1:** Each answer was checked against the best order from Part 1. Both models were right in all ten runs.

- Ask: Which model would you pick so far?
- Expected: No difference yet: both were right every time. So the cost decides.

**Build 2:** Gemini 3.5 Flash-Lite cost about a quarter as much and took half the time. For this task, the cheaper model is enough.

- Ask: Which model would you deploy, and why?
- Expected: The cheaper one: right just as often, at about a quarter of the cost and half the time. Without the eval we would have guessed.

**Point here:** An eval runs real cases with known answers and counts how many come out right. Compare that count across models, prompts and versions.

**Common misconception:** That the pricier model is the safe default. Here the cheaper one was as accurate, though less steady in how it worked: it made four to fourteen tool calls a run, against seven to nine. Ours was one case run many times; a real eval holds 10 to 100 real cases, including the awkward ones.

**Transition:** Part 4 in one slide.

**Source:** Notebook 4.5, 19 November 2026: ten runs per model, cached forecasts, answers checked against the best order. Mean cost at paid prices.

## recap-4: Part 4 in one slide

**Build 1:** Next: agents in your organisation.

- Ask: Before you gave this agent your real inbox, which line of the card would you change?
- Expected: The person line: who double-checks anything about payments. Maybe the tools too: no send_email at all for a first version.

**Point here:** The failures of this part map onto the bottom half of the card.

**Transition:** Part 5: agents in your organisation.

## part-5: Part 5 · Agents in your organisation

**Build 1:** Key question: should a given task in your team go to an agent, and with how much freedom?

- Ask: Which task in your team would you hand to an agent first? It can be the one you named in Part 3.
- Expected: Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we will run them through the next three slides.

**Transition:** Take one of those tasks. Three questions decide what to do with it.

**Source:** Illustration: generated (Gemini image model).

## should-agent: Should this task be an agent?

**Build 1:** Take one task from your team. The first question: do its steps change from case to case?

- Ask: Take your task from the last slide. Does it follow the same steps every time?
- Expected: Often yes: monthly reports, standard approvals, invoice matching. Those are workflows.

**Build 2:** If you can write the steps down in advance, build a workflow, as we saw in Part 1.

- Ask: How many of the tasks you named are really workflows?
- Expected: Usually more than half. That is good news: a workflow is cheaper to build and to run, and a model can still do each step.

**Point here:** An agent is worth it only when the steps change from case to case. Otherwise, write the steps down: a workflow.

**Common misconception:** That anything with a language model in it should be an agent. Part 1’s invoice was a workflow with a model in one step.

**Transition:** Say the steps do change.

**Source:** Workflow or agent: Anthropic, “Building effective agents” (Dec 2024), as in Part 1.

## should-check: Can a person check the result cheaply?

**Build 1:** Then an agent may help. The second question: can someone check its result in a minute or two?

- Ask: For your task, how would someone check the result, and how long would it take?
- Expected: Cheap to check: code with tests, a total that reconciles, a number with a source to click. Hard to check: a strategy memo, a diagnosis, a legal opinion.

**Point here:** How cheaply a person can check the result is the first of the two axes of the stakes map in Part 3.

**Common misconception:** That a result is easy to check because it is easy to read. A fluent memo can take an expert an hour to verify.

**Transition:** And the second axis: what does a mistake cost?

## should-stakes: Is a mistake costly, or impossible to undo?

**Build 1:** Checking is cheap. If a mistake is costly, the agent acts and a person approves. If not, let it run.

- Ask: A small refund sent to the wrong customer: costly, or not?
- Expected: Cheap to put right, so let it run with spot checks. A large refund is different: a person approves it.

**Build 2:** Checking is hard. If a mistake is costly, a person leads. If not, the agent only drafts.

- Ask: Where does your own task land?
- Expected: It depends on the task. On Part 3’s map these could run on their own: Data analysis, Algorithm search, Building energy. These needed approval: Coding, Invoices, Customer support, IT incidents, Web forms, Robot lab, Clinic notes.

**Point here:** The four answers are the four zones of the stakes map in Part 3, in the same words.

**Common misconception:** That a more capable model moves a task to a safer zone. It can make checking cheaper, but what a mistake costs stays the same, so the approval before an irreversible step stays.

**Transition:** Even in the right zone, start with less freedom than you plan to give.

**Source:** The four zones are those of the stakes map in Part 3.

## ramp: Raise autonomy in steps

**Build 1:** First it only suggests: shadow mode. Then it acts with approval. Then routine cases run alone.

- Ask: Why start in shadow mode, if the agent could already act?
- Expected: Because you learn its error rate on your real cases at no risk: each suggestion can be compared with what the person actually did.

**Build 2:** Move up only when evals on your past cases support it. Step back if errors rise.

- Ask: What would convince you to move up a step?
- Expected: A measured error rate on enough of your own cases, no worse than the team accepts from a person, and a plan for the errors that remain.

**Point here:** Raise autonomy one step at a time, when evals on your own cases support it, and lower it again when errors rise.

**Common misconception:** That autonomy is decided once, at launch. It is a setting you revisit as the evals, the model and the stakes change.

**Notebook:** For refunds: in shadow mode it drafts a decision and staff decide; then it prepares the refund and staff approve it; then small refunds go through on their own, and staff check a sample.

**Transition:** At every step, someone pays for the model and for the checking. Which costs more?

**Source:** The three steps match Part 1’s levels of autonomy: operator, approver, observer.

## cost: What did our opening run cost?

**Build 1:** Back to our opening run: three rounds, each rereading the whole conversation. Do you remember what it cost?

- Ask: Do you remember what the opening run cost?
- Expected: Less than a rupee. We saw it in Parts 1 and 2.

**Build 2:** Less than a rupee, as we saw in Part 2. The price is per million tokens, read and written.

- Ask: Is that the whole cost of the task?
- Expected: No. Someone still has to read the answer and decide whether to trust it.

**Point here:** A run like ours costs less than a rupee in model time.

**Common misconception:** That agents are cheap at any scale. Agents use about four times the tokens of a chat, and multi-agent systems about fifteen times (Anthropic, Jun 2025).

**Transition:** Now add the person who checks the answer.

**Source:** Our run on 19 November 2026 (Gemini 3.8 Flash), at Google’s published price in rupees.

## cost-person: Now add a person who checks it

**Build 1:** A colleague spends five minutes checking the answer, at ₹1,000 an hour. The model is now 0.9% of the cost.

- Ask: What does five minutes of a colleague’s time cost your organisation?
- Expected: At ₹1,000 an hour, five minutes is about ₹83. With overheads it is more.

**Build 2:** Even a run of 30 rounds costs less than the check. So the saving is in making results quick to check.

- Ask: Where should you spend effort to make an agent cheaper?
- Expected: On making the check quick: tests, totals that reconcile, a source to click, a clear list of changes. A cheaper model matters far less.

**Point here:** For a run like ours the model costs under a rupee and a person’s check costs far more, so results that are quick to check save the most.

**Common misconception:** That the model price will stay where it is. From 1 January 2027, Gemini 3.8 Flash costs $1.50 and $7.50 per million tokens in and out, twice today’s price. Even then, a 30-round run costs less than the five-minute check.

**Notebook:** Drag the rounds slider: each round rereads everything before it, so cost grows faster than the rounds. Drag the checking time down to one minute and the gap narrows. In Part 4’s eval, Flash-Lite cost ₹0.18 a run.

**Transition:** If checking is where the cost is, the people around the agent matter. What changes for them?

**Source:** Tokens: our opening run; each round rereads all before it, fitted to that run. Price: Google, 19 November 2026. Minutes and hourly cost: illustrative.

## skills: What new work does a team take on?

**Build 1:** Every agent in this talk needed people around it, doing this work.

- Ask: Who in your team already does work like this for other software?
- Expected: Testers, analysts who write specifications, whoever reviews code or audits a process. These skills carry over.

**Point here:** Adopting an agent mostly changes the work around the model: people describe the task and check the results.

**Common misconception:** That agents remove the need for expertise. Experts write the instructions and the evals, and check the cases the agent gets wrong.

**Transition:** What happens to projects that skip this work?

## cancel: What does Gartner predict for agent projects?

**Build 1:** Gartner, a research firm, made this prediction about companies’ agent projects. What reasons would you guess?

- Ask: Why would a company cancel an agent project?
- Expected: Cost, no clear benefit, and risk. Collect a few before the click.

**Build 2:** Each of Gartner’s reasons, in its own words, matches a question from this part.

- Ask: Which of these would end a project in your organisation?
- Expected: Usually unclear value: an agent built where a workflow would do. The first question of this part catches it.

**Point here:** Each reason Gartner gives has an answer in this part: measure the cost, ask whether it needs an agent, and raise autonomy in steps.

**Common misconception:** That a prediction is a measurement. This is Gartner’s forecast of what will happen by the end of 2027.

**Notebook:** Gartner’s full sentence: the projects will be canceled “due to escalating costs, unclear business value or inadequate risk controls”.

**Transition:** To end this part, back to the notebook.

**Source:** Gartner press release, Jun 2025. A prediction.

## nb-own-tool: In the notebook

**Build 1:** Something to try this week: a tool of your own. Ours returns the PM2.5 limits.

- Ask: Which function from your own work would you turn into a tool first?
- Expected: A database lookup, a price list, a policy document, an internal API: anything with a clear input and output.

**Point here:** A tool is a function and a description. You can write your first one this week.

**Notebook:** If time allows, run 5.1 live: the agent should fetch Delhi’s forecast and the limits, then compare them. If not, leave it for the room to try: there is no recorded run of this section.

**Transition:** Part 5 in one slide.

## recap-5: Part 5 in one slide

**Build 1:** Next: the talk in one slide, and three things to try on Monday.

- Ask: Where on the steps would you start this refund agent, and what eval would move it up?
- Expected: Shadow mode on last month’s refunds. Move up when it matches the staff’s decisions on nearly all of them, with no large refund wrong.

**Point here:** Every decision of this part lands on the agent card: the model, the guardrails and the person.

**Transition:** To close: the talk in one slide.

## summary: The talk, on the loop from Part 1

**Build 1:** Part 1: a model asks for tools, and our code runs them. Part 2: each round, it rereads the whole conversation.

- Ask: Which box did your own work touch today?
- Expected: Most people say the tools: the data and systems their team already has.

**Build 2:** Part 3: agents do useful work where a person can check the answer cheaply.

- Ask: Which of the applications we saw could you check in a minute or two?
- Expected: Coding with tests, data analysis with a check, building energy with a meter reading.

**Build 3:** Part 4: errors add up, so add an approval and a step limit. Part 5: give more freedom only as evals allow.

- Ask: Which of these two guards would your first agent need?
- Expected: Both. The step limit always; the approval before anything that cannot be undone.

**Point here:** The whole talk sits on the loop from Part 1.

**Transition:** So what can you do this week?

## monday: Three things to try on Monday

**Build 1:** None of these needs a budget or a new team. You can start on Monday morning.

- Ask: Which task in your team would you write the card for?
- Expected: Reconciliations, weekly reports, ticket triage, document checks.

**Build 2:** Scan to open the notebook. Every run today came from it.

- Ask: Who has a laptop open? Try the first cell now.
- Expected: A few will open it. Promise help after the session.

**Point here:** Three next steps: run the notebook, describe one task as an agent card, and collect the test cases before building.

**Transition:** Thank you.

## thanks: Thank you. Questions?

**Build 1:** Thank you for your time. What would you like to ask?

- Ask: Which application did we not cover that you would like to see?
- Expected: Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Run each through the three questions of Part 5.

**Point here:** Close, and open the floor.

**Source:** Nipun Batra, IIT Gandhinagar · nipunbatra.github.io

## glossary: Glossary: the loop (optional)

**Build 1:** The words of Part 1.

- Ask: Which of these words did you hear for the first time today?
- Expected: Usually round and token.

**Point here:** The vocabulary of the talk, a few words per term.

## glossary-2: Glossary: what the model reads (optional)

**Build 1:** The words of Parts 1 and 2.

- Ask: Which of these does your team already pay for, or use?
- Expected: Tokens, through an API bill; workflows, through existing automation.

**Point here:** The vocabulary of the talk, a few words per term.

## glossary-3: Glossary: running it safely (optional)

**Build 1:** The words of Parts 1, 4 and 5.

- Ask: Which of these does your organisation already have a policy for?
- Expected: Usually none of them yet. Guardrails and evals are where to start.

**Point here:** The vocabulary of the talk, a few words per term.

## mcp-code: The air-quality tool as an MCP server (optional)

**Build 1:** What changes for the agent when the tool moves behind MCP?

- Ask: What changes for the agent when the tool moves behind MCP?
- Expected: Nothing about how it calls the tool. What changes is that any agent that supports MCP can use it without new code.

**Point here:** An MCP server is about as small as the tool itself. Notebook section 5.2, “One tool for every agent: MCP”, has it.

**Source:** Model Context Protocol Python SDK (pip install mcp), github.com/modelcontextprotocol/python-sdk.

## further: Further reading (optional)

**Build 1:** Where to go next.

- Ask: Which one would you read first?
- Expected: Building effective agents for anyone building one; the lethal trifecta for anyone deploying agents near private data.

**Point here:** Where to go next.

## app-documents: Invoices: mostly a workflow (optional)

**Build 1:** Read, find the order, match, post. Only a mismatch needs judgement: first the agent’s, then yours.

- Ask: Which of these steps needs a model to decide anything?
- Expected: Only the red one, explaining a mismatch. The rest is Part 1’s fixed workflow: read, match, post.

**Build 2:** Most invoices match and never reach the red step. So build a workflow, and call the agent only then.

- Ask: What share of your team’s invoices are exceptions?
- Expected: Usually a small share. That share is where an agent pays for itself; plain rules handle the rest more cheaply.

**Point here:** Most invoice processing is a fixed workflow; the agent is needed only for the invoices that do not match. On the stakes map at the end of Part 3: “Agent acts, a person approves” (rules check the match, but money moves).

**Common misconception:** That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot.

**Transition:** Next in the appendix: an IT incident at night.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. The invoice is from the notebook’s demo inbox. Illustration: generated.

## app-incident: IT incidents: errors after a deploy (optional)

**Build 1:** It reads the alert, queries logs and metrics at once, and links the errors to the deploy.

- Ask: At 2 a.m., would you let it roll back on its own?
- Expected: Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.

**Build 2:** The on-call engineer approves once. Then it rolls back and writes the note.

- Ask: What makes that approval quick?
- Expected: The agent has done the reading: the spike, the deploy behind it, and the exact command. The person only judges.

**Point here:** An incident agent reads the alert, logs and metrics and leaves one decision for a person: the rollback. On the stakes map at the end of Part 3: “Agent acts, a person approves” (metrics show whether a fix worked; a wrong rollback is an outage).

**Common misconception:** That the risky part is the diagnosis. Reading logs is harmless; the rollback is the step that changes production, so that is where the approval goes.

**Transition:** Next in the appendix: a job done in a browser.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. Illustration: generated.

## app-browser: Web forms: renewing a trade licence (optional)

**Build 1:** It reads the screen, clicks, types and uploads, then checks the form against your files.

- Ask: Where must it stop and ask you?
- Expected: Before paying and submitting. Both are final and in your name; everything before them can be redone.

**Build 2:** It stops once, before paying the fee: payment and submission cannot be undone.

- Ask: If the best models now beat people on this test, why still confirm?
- Expected: The test averages over tidy tasks. The best single model scores 85.96% on OSWorld-Verified, above the 72.36% people scored in the original study (where the best model then scored 12.24%; an agent framework now scores 90.19%). Real portals have timeouts and unusual forms, and one wrong submission is yours to fix.

**Point here:** A browser agent can fill any web form a person can, so the final, paying click stays with a person. On the stakes map at the end of Part 3: “Agent acts, a person approves” (the form can be read before it is submitted; a submission is final).

**Common misconception:** That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee that cannot be clawed back.

**Transition:** Back to the main route.

**Source:** Trace: a design drawn for this talk; it describes no deployed system. OSWorld: Xie et al. (2024), and the OSWorld-Verified leaderboard (Aug 2026). Illustration: generated.

## app-coscientist: Google’s AI co-scientist: several agents, one goal (optional)

**Build 1:** It splits a research goal across several agents. They generate ideas, argue about them and rank them.

- Ask: How would you check whether a new hypothesis is any good?
- Expected: Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.

**Build 2:** The scientists see only the top ideas. Only a lab experiment can tell which is right.

- Ask: Where are the checks in this loop?
- Expected: Twice: the agents’ own debate and ranking, which cost little and can be wrong; then the scientists’ lab experiments, which are slower and test the idea directly.

**Point here:** Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.

**Common misconception:** That the co-scientist discovered something unknown. It reached, on its own, a result a team at Imperial College London had found but not yet published; the experiments were theirs.

**Transition:** What if the agent could run the experiment too?

**Source:** Google Research blog, 19 Feb 2025 (built on Gemini 2.0); the two days are from Google’s paper, arXiv 2502.18864. Trace simplified; it also searches the literature. Illustration: generated.

## app-lab: A chemistry experiment on a lab robot (optional)

**Build 1:** A chemistry goal and the robot’s manual. Can a model turn these into a working experiment?

- Ask: What would worry you about letting a model drive lab equipment?
- Expected: Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.

**Build 2:** The one approval comes just before reagents are used: the step that costs money.

- Ask: Why put the approval there, and not at the end?
- Expected: Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.

**Point here:** When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.

**Common misconception:** That these systems replace the lab team. FutureHouse’s Robin proposed ripasudil as a drug candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.

**Transition:** Back to the main route: the stakes map of Part 3.

**Source:** Coscientist: Boiko, MacKnight, Kline and Gomes, Nature, 20 Dec 2023. Robin: FutureHouse, 20 May 2025. The approval step is our addition. Illustration: generated.
