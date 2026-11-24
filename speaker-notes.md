# AI agents: speaker notes

Planned main route: 80 minutes, including student responses. Optional slides are outside this budget.

## Pacing

| Part | Minutes |
|---|---:|
| Opening | 4 |
| Part 1 · From a model to an agent | 22 |
| Part 2 · Inside one run | 10 |
| Part 3 · The same agent, other jobs | 16 |
| Part 4 · How agents fail | 17 |
| Part 5 · Agents in your organisation | 8 |
| Wrap-up | 3 |

## title: AI agents

**Build 1:** Today we build this: a small agent that finds a bug and fixes it. Then we give it other jobs, and try to break it.

- Ask: Who here has used ChatGPT, Gemini or Claude this week? Who has let one of them finish a whole task for them?
- Expected: Most hands go up for the first question and few for the second. That gap is what today is about.

**Point here:** An agent is a model that uses tools in a loop until a goal is met. We will build one live.

**Transition:** Start with a real problem.

**Source:** The terminal replays our recorded run (Gemma 4 (12B), 24 November 2026). Slides and notebook: github.com/nipunbatra/ai-agents

## broken: A small project, and two failing tests

**Build 1:** This folder belongs to a small stationery shop: its billing code, some tests, an inbox and some invoices.

- Ask: What would you do first if this were your project?
- Expected: Read the error, then open the code it points to. Remember that order: the agent will do the same.

**Build 2:** We run the tests. Two of four fail, and we do not know why yet.

- Ask: What do the two failing tests have in common?
- Expected: Both involve a discount. The two tests without a discount pass.

**Point here:** A real, small problem: the code runs, but two tests say the answers are wrong.

**Transition:** We could debug it ourselves. Instead we ask in one sentence.

**Source:** Real output from our run on 24 November 2026. The project is made up for this talk; the notebook creates it.

## the-ask: We ask in one sentence

**Build 1:** We do not say which file, which test, or what is wrong.

- Ask: Could a chatbot do this, if we typed this sentence into it?
- Expected: No: it cannot see the folder or run anything. Hold that thought; we try it in a few minutes.

**Point here:** The request names a goal. It gives no steps.

**Transition:** Here is what happened when we gave that sentence to an agent.

## watch: 10 seconds later, the tests pass

**Build 1:** The agent made six requests, one after another. Nobody told it which ones.

- Ask: Read the six requests. What is it doing?
- Expected: Looking around, running the tests, reading the code, changing it, and running the tests again. What a careful programmer does.

**Build 2:** It changed one line of the billing code, and all four tests pass.

- Ask: Is the new line right?
- Expected: Yes. A 10 percent discount should take off 10 percent of the amount. The old line took off the number 10.

**Point here:** Given a goal and a few tools, the model chose the steps itself and checked its own work.

**Common misconception:** That this needed a huge model in a data centre. This run used an open model, Gemma 4, on a laptop.

**Transition:** How does that work? That is the plan for today.

**Source:** Our recorded run: Gemma 4 (12B), 24 November 2026, 7 rounds, 10.2 seconds of model time on a laptop.

## route: Today’s plan

**Build 1:** Five parts. When a slide says “In the notebook”, we switch over and run the code.

- Ask: Which part matters most for your work?
- Expected: Most will say Part 3 or Part 5. Promise both, and say that Part 4 is the one to remember.

**Point here:** A map of the talk, and its rhythm: a few slides, then a run in the notebook.

**Transition:** Part 1: from a model to an agent.

**Source:** Notebook: github.com/nipunbatra/ai-agents (notebook/agents.ipynb). Open it in Colab from the link at the top right.

## part-1: Part 1 · From a model to an agent

**Build 1:** What turns a model that only writes text into something that fixes code?

- Ask: In your own words, what is an AI agent?
- Expected: Answers vary: a bot that does tasks, an assistant that uses apps. Collect two or three; we sharpen them by the end of this part.

**Transition:** Start with what a model is on its own.

**Source:** Illustration: generated (Gemini image model).

## alone: On its own, a model only writes text

**Build 1:** A language model reads text and writes the words most likely to come next. That is all it does.

- Ask: So what happens if we send it our one-sentence request about the failing tests?
- Expected: It can only write text back. It has no way to open a file or run a test. Let us try it.

**Point here:** A language model is a text predictor. Everything an agent adds comes from outside the model.

**Transition:** Let us try it: the same request, sent to the model with nothing else.

## nb-alone: In the notebook

**Build 1:** Over to the notebook. We send the one-sentence request to Gemma 4, with nothing else.

- Ask: Before it answers: what do you expect it to say?
- Expected: Something helpful-sounding. Watch whether it can say anything about our actual code.

**Point here:** A model on its own can only answer from the text it is given.

**Notebook:** Notebook 1.1: run the cells under “The model on its own”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what it said when we ran it.

## alone-said: It asks us to paste the code

**Build 1:** Our run: 290 polite words, and not one about our code.

- Ask: Is that a bad answer?
- Expected: No, it is an honest one. A model that guessed at code it had never seen would be worse.

**Build 2:** It needs two things it does not have: a way to look, and a way to act.

- Ask: What would it need, to do the job itself?
- Expected: A way to read our files and run our tests. In other words, tools.

**Point here:** The model is not the limit here. It has no access to anything.

**Common misconception:** That a bigger model would manage. No model can read a file it was never given.

**Transition:** So let us give it a way to read a file.

**Source:** Real reply (Gemma 4 (12B), 24 November 2026, notebook 1.1): its own first request, and the three things it listed.

## tool-fn: A tool is an ordinary Python function

**Build 1:** Seven lines of plain Python. It opens a file in the project and returns the text.

- Ask: What would a tool look like in your own work?
- Expected: A database query, a search of your documents, a call to an internal system: one function that does one thing.

**Build 2:** The name, the arguments and the description are for the model. The last line is for us.

- Ask: Which part of this will the model never see?
- Expected: The body. It only gets the name, the arguments and the description.

**Point here:** A tool is a normal function plus a description written for the model.

**Transition:** Let us write it in the notebook, and print what the model will be shown.

## nb-tool: In the notebook

**Build 1:** In the notebook we define the tool, and print the entry the model will see.

- Ask: Why does the model not need the code?
- Expected: It never runs it. It only needs to know what the tool does and what to pass in.

**Point here:** The model reads a description of the tool. Our code keeps the tool itself.

**Notebook:** Notebook 1.2: run the cells under “Write a tool”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** This is the entry.

## tool-menu: The model sees only this entry

**Build 1:** A name, a description and one argument. This is everything the model knows about our tool.

- Ask: What does the description tell the model that the name does not?
- Expected: That the file must be inside the project, and that it gets text back.

**Build 2:** Suppose the entry said only this. When would the model use it, and what would it pass in?

- Ask: What happens with a vague entry?
- Expected: The model guesses: it may call the tool for anything, or never. A clear description is the cheapest fix there is.

**Point here:** The description is the only manual the model gets.

**Transition:** Now we ask a question about one file, with the tool on offer.

**Source:** Simplified from the entry the notebook prints in section 1.2.

## nb-ask: In the notebook

**Build 1:** Back to the notebook. We ask “What does billing.py do?” and offer the tool.

- Ask: What do you think comes back?
- Expected: Not an answer. Watch the reply.

**Point here:** With a tool on offer, the model can reply with a request instead of an answer.

**Notebook:** Notebook 1.3: run the cells under “Ask again, with the tool”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what came back in our run.

## tool-call: The reply is a request

**Build 1:** The reply, as it arrived. It is a small piece of structured text.

- Ask: Who is going to open the file?
- Expected: Our program. The model only wrote the request.

**Build 2:** Its answer text is empty. Instead it names a tool and the argument to pass.

- Ask: Why is it safer that the model can only ask?
- Expected: Because our program decides which requests to carry out. Part 4 puts the safety checks exactly there.

**Point here:** This is called function calling: the model writes a structured request, and our code decides whether to run it.

**Common misconception:** That the model opens files or goes online itself. It never does. Our code does, and only through the tools we gave it.

**Transition:** So our code runs the request. Back to the notebook.

**Source:** Real reply from our run on 24 November 2026 (Gemma 4 (12B)), shown without its id field.

## nb-run: In the notebook

**Build 1:** Our code runs the request and adds the result to the conversation. Then we call the model again.

- Ask: What will the model do now that it has the file?
- Expected: Answer the question, this time from the real code.

**Point here:** Our code runs the tool and hands the result back. The model then reads everything again.

**Notebook:** Notebook 1.4: run the cells under “Run the request, return the result”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what happened in our run.

## tool-result: Our code reads the file, and the model answers

**Build 1:** Our code opened billing.py and added its text to the conversation.

- Ask: What changed between the two calls to the model?
- Expected: Only the conversation: it now contains the file’s text.

**Build 2:** Now the model answers, and this time it is talking about our code.

- Ask: Did the model spot the bug?
- Expected: Not here. We only asked what the file does. Fixing needs more tools.

**Point here:** One request, one result, one answer. The model’s knowledge of our project is whatever our tools put into the conversation.

**Transition:** Who did what, exactly?

**Source:** Real result and answer from our run on 24 November 2026. The answer is cut to its first sentence.

## actors: The model never touches the folder

**Build 1:** We asked a question. The model answered with a request, addressed to our code.

- Ask: Which of the four can read a file?
- Expected: Only our code.

**Build 2:** Our code opened the file and passed the text back. Only our code touched the folder.

- Ask: Which arrow would you put a lock on?
- Expected: The one from our code to the folder: that is where anything real happens.

**Build 3:** Then the model, with the text in front of it, answered us.

- Ask: How many times was the model called?
- Expected: Twice: once to get the request, once to get the answer.

**Point here:** The model only ever writes text. Every real action goes through our code, where we can check it.

**Transition:** One tool that reads is not enough to fix a bug. We add three more.

## four-tools: Four tools are enough for a lot

**Build 1:** Read, write, edit, and run a command. Each one is a short Python function, like the first.

- Ask: Which of these four could do damage?
- Expected: Three of them: write, edit and above all bash. Part 4 is about that.

**Build 2:** The fourth is the powerful one. Anything you can type in a terminal, the agent can now ask for.

- Ask: Have you seen this set of tools before?
- Expected: It is, give or take, the core of the coding agents people use at work: Claude Code, Gemini CLI, Codex, Cursor.

**Point here:** Read, write, edit and run: with these four an agent can do most of what a person does at a keyboard.

**Notebook:** Notebook 1.5: run the cell that defines write_file, edit_file and bash. It prints the four menu entries.

**Transition:** Doing each request by hand gets tedious, so we put it in a loop.

**Source:** The four tools are defined in the notebook, section 1.5: about forty lines in all.

## loop-map: Put it in a loop

**Build 1:** You give a goal. The model reads the conversation so far and writes a reply.

- Ask: What starts the loop?
- Expected: A goal from a person.

**Build 2:** If the reply asks for no tool, it is the answer, and we stop.

- Ask: When does it stop?
- Expected: When the model replies without asking for a tool.

**Build 3:** If it asks for a tool, our code runs it and adds the result. Then the model reads everything again.

- Ask: What could make it never stop?
- Expected: A tool that keeps failing, or a goal that is never met. So we always add a limit on rounds (Part 4).

**Point here:** An agent is a model, some tools and this loop. We come back to this flowchart all through the talk.

**Transition:** As code, the loop is short.

## loop-code: The loop is eleven lines of Python

**Build 1:** Each round starts with one call to the model. It gets the whole list of messages, every time.

- Ask: Which line is the “model” box of the flowchart?
- Expected: Line 4: the call to chat.

**Build 2:** If the reply asks for no tool, we return it. That is the only normal way out.

- Ask: Which line is the diamond?
- Expected: Line 6: did it ask for a tool?

**Build 3:** Otherwise we run each tool it asked for, add the results to the list, and go round again.

- Ask: Where do the results go?
- Expected: Into the same list of messages, so the model reads them next round.

**Point here:** An agent is an ordinary loop around one model call. No framework is needed.

**Common misconception:** That agents need special software. Frameworks add logging, retries and permissions around these lines.

**Transition:** Let us run it on the failing tests.

**Source:** Simplified from run_agent in the notebook, section 1.6 (the real one also asks for approvals and catches errors).

## nb-loop: In the notebook

**Build 1:** We give the loop our one-sentence request and the four tools, and let it go.

- Ask: What should a careful programmer do first?
- Expected: Look at the project and run the tests, before touching anything. Watch whether the agent does.

**Point here:** From here on the model decides the steps: which tool, in what order, and when to stop.

**Notebook:** Notebook 1.6: run the cells under “Put it in a loop”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run, round by round.

## run-look: First it looks around

**Build 1:** The model’s first reply is a request: list the files. It has never seen this project.

- Ask: Why not go straight to the fix?
- Expected: It does not know what is in the folder. Our instructions also tell it to look before it changes anything.

**Build 2:** Our code runs the command and adds what it printed to the conversation.

- Ask: Who typed that command?
- Expected: Nobody. The model wrote it as text, and our code ran it.

**Point here:** Round 1: the model asks, our code runs. The strip on the left shows where we are in the loop.

**Transition:** Now it knows what is there. Next it runs the tests.

**Source:** Our recorded run, 24 November 2026. The listing is cut short here.

## run-test: It runs the tests, and reads the failure

**Build 1:** Next request: run the tests. Nobody told it there were tests, or how to run them.

- Ask: How did it know the command?
- Expected: It saw test_billing.py in the listing. The tool’s description also gives pytest as an example.

**Build 2:** They fail. Each failure shows what the code returned, and what the test expected.

- Ask: What does the model learn from this output?
- Expected: Which tests fail and what they expected: 531.0 where the code gave 578.2.

**Point here:** A failing test is the best thing an agent can read: it says exactly what is wrong.

**Transition:** It knows what is wrong. Now it needs to see why.

**Source:** Our recorded run, 24 November 2026: each failing test and its assertion, from the real output.

## run-read: It reads the code

**Build 1:** It asks for the code, then the tests, and our code returns the text. It is the read_file we wrote first.

- Ask: Which tool is this?
- Expected: read_file, the one we wrote first.

**Build 2:** This is what the model now has in front of it. Can you see the bug?

- Ask: Where is the bug?
- Expected: The discount line subtracts the number itself. For 10 percent it takes off 10 rupees, not 10 percent.

**Point here:** The model finds the bug the way we would: by reading the function the failing test points to.

**Transition:** It has seen the bug. Now it asks to change that line.

**Source:** Our recorded run, 24 November 2026. The highlight is ours; the model saw plain text.

## run-edit: It changes one line

**Build 1:** It asks for an edit: replace this exact line with that one. The red line is the bug.

- Ask: Why edit one line, and not rewrite the file?
- Expected: A small change is easier to check, and cannot break the rest. Our instructions ask for the smallest change that does the job.

**Build 2:** Our code makes the change. One line of the file is different, and nothing else.

- Ask: Is the new line right?
- Expected: Yes: multiply by one minus the discount as a fraction.

**Point here:** This is the only request in the run that changes a file. Everything before it was looking.

**Transition:** A careful programmer would now run the tests again. So does the agent.

**Source:** Our recorded run, 24 November 2026: the real old and new lines.

## run-pass: It runs the tests again, and stops

**Build 1:** Same command as before. This time all four tests pass.

- Ask: Who decided to run the tests again?
- Expected: The model. Our instructions ask it to test after changing code, but it chose when.

**Build 2:** So its next reply asks for no tool. The loop ends: seven rounds, 10 seconds.

- Ask: How did our code know the job was done?
- Expected: The reply contained no request, only text. That is the exit of the loop.

**Point here:** The model chose every step, checked its own work, and decided when to stop. Our code only ran the tools.

**Transition:** It says it is done. Do we believe it?

**Source:** Our recorded run, 24 November 2026 (Gemma 4 (12B)): 7 rounds, 6 tool calls, 10.2 seconds of model time.

## nb-check: In the notebook

**Build 1:** We do not take its word for it. We run the tests ourselves and look at exactly what changed.

- Ask: How could an agent make failing tests pass without fixing anything?
- Expected: By editing the tests, or deleting them. It happens. So we check that the test file is untouched.

**Point here:** Check an agent’s work against something you trust. Part 4 turns this habit into evals.

**Notebook:** Notebook 1.7: run the cells under “Check the work”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is what we found.

## check: Did it really fix it?

**Build 1:** We ran the tests ourselves: four pass.

- Ask: Why run the tests ourselves?
- Expected: Because the agent’s summary is just text. The test run is evidence.

**Build 2:** We compared the file before and after: exactly one line is different.

- Ask: Why look at the change?
- Expected: A passing test can hide an unrelated change somewhere else.

**Build 3:** And the test file is exactly as it was. The agent changed the code and left the tests alone.

- Ask: Why check the test file?
- Expected: The cheapest way to make a test pass is to change the test.

**Point here:** Three cheap checks, none of which trusts the agent’s own summary.

**Transition:** So: the same model, twice.

**Source:** From the notebook, section 1.7, on our run of 24 November 2026.

## same-model: The same model, two outcomes

**Build 1:** Both came from the same model. The only difference is the tools and the loop.

- Ask: So what is an agent?
- Expected: A model that uses tools in a loop until it has done what you asked. Compare with the answers collected at the start of the part.

**Point here:** An agent is a model, tools and a loop. It is not a different, smarter kind of model.

**Common misconception:** That agents run on a special model. This is the same Gemma 4 that asked us to paste the code.

**Transition:** One sentence to take away from Part 1.

**Source:** Both runs are real (Gemma 4 (12B), 24 November 2026, notebook 1.1 and 1.6).

## agent-is: What is an agent?

**Build 1:** That is the whole definition. Everything else today is detail.

- Ask: Which of the three did we write ourselves?
- Expected: The tools and the loop: about sixty lines of Python. The model we downloaded.

**Point here:** Model, tools, loop.

**Transition:** Part 1 in one slide.

## recap-1: Part 1 in one slide

**Build 1:** Next: what the model reads each round, and how it remembers.

- Ask: Which line would change if this agent worked on your company’s real code?
- Expected: Guardrails (what it may touch and run) and the person (reviews before anything is merged).

**Point here:** The seven lines of this card come back for every agent in the talk.

**Transition:** Part 2: inside one run.

## part-2: Part 2 · Inside one run

**Build 1:** Key question: what does the model read each round, and how does it remember anything?

- Ask: Between two rounds, where does the model keep what it has found out so far?
- Expected: Most will say “in the model”. It keeps nothing. Our code holds the conversation and sends all of it again each round.

**Point here:** The model has no state of its own. Everything it knows about the task is in the text our code sends it.

**Transition:** Start with what it reads.

**Source:** Illustration: generated (Gemini image model).

## reread: Each round, the model rereads everything

**Build 1:** Round 1. The model reads our instructions, the tool menu and the request: 508 tokens.

- Ask: What does the model have to work with in round 1?
- Expected: Only text: our instructions, a description of each tool, and one sentence from us.

**Build 2:** Round 2 reads all of that again, plus its own first request and what ls -R printed.

- Ask: Why does round 2 read the instructions again?
- Expected: The model keeps nothing between rounds. Each round is a new call, and our code sends the whole list of messages again.

**Build 3:** Round 3 starts from the top once more. The new part is the test output.

- Ask: Does anything ever leave the conversation?
- Expected: No. In our loop the list only grows: every request and every result is added and stays.

**Build 4:** It goes on like this. Round 7 reads 1,655 tokens, and only 80 of them are new.

- Ask: Which round added the most? Why?
- Expected: The tallest dark piece: a long tool result, such as the test output or a whole file. Short results, such as the note after an edit, add almost nothing.

**Point here:** The conversation is the model’s only memory during a run, and it reads all of it again in every round.

**Common misconception:** That the model remembers the earlier rounds. It does not: line 4 of the loop sends everything again, every time.

**Transition:** We can print these numbers ourselves. Over to the notebook.

**Source:** Our recorded run of Part 1, 24 November 2026 (Gemma 4 (12B)). The dark piece of each bar also holds the model’s own request from the round before.

## nb-context: In the notebook

**Build 1:** The notebook kept a count for every round of the run we just watched. We print it.

- Ask: Guess the total before it prints. Is it closer to the last round’s count, or far above it?
- Expected: Far above it: the total adds up every round, and each round holds all the ones before.

**Point here:** Nothing here is hidden. The loop records what each call to the model read and wrote.

**Notebook:** Notebook 2.1: run the cells under “What the model read each round”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is the total from our run.

## read-total: How much did it read in all?

**Build 1:** When the run ended, the whole conversation was 1,655 tokens long.

- Ask: How much do you think the model read to get this far?
- Expected: Guesses are usually near the size of the conversation. The real number is several times that.

**Build 2:** To get there, the model read 8,400 tokens. It read the same text again and again.

- Ask: What happens to the total if a run takes twice as many rounds?
- Expected: It grows much more than twice, because every extra round rereads all the rounds before it.

**Point here:** The reading adds up faster than the conversation grows. Long runs are mostly rereading.

**Transition:** Does that matter? Yes, for three reasons.

**Source:** Our recorded run of Part 1, 24 November 2026 (notebook 2.1). It wrote 221 tokens in the same seven rounds.

## context-short: Why keep the context short?

**Build 1:** What the model reads in a round is called its context. We try to keep it short.

- Ask: How would you keep it short, in a long job?
- Expected: Return short tool results, such as the last lines of a test run. Offer only the tools the job needs. Start a new run for a new job.

**Point here:** Every round pays again, in money and in time, for everything read so far. Our seven-round run would cost ₹0.67 at the price of Gemini 3.8 Flash, a hosted model; Part 5 has the cost slide.

**Common misconception:** That a model with a larger context window solves this. It lets the conversation grow longer, and every round still pays for all of it.

**Transition:** One piece of the context is read first in every round, and we wrote it ourselves.

## instructions: The instructions are plain English

**Build 1:** This is the first thing the model reads in every round. We wrote it, in ordinary sentences.

- Ask: Who is this text written for?
- Expected: The model. Our code puts it at the top of the conversation, before the request.

**Build 2:** In Part 1 the agent began with ls -R. The request never asked for that. This sentence did.

- Ask: What would the agent do without this sentence?
- Expected: It might guess at file names, or answer from what it remembers about billing code in general.

**Build 3:** After its edit it ran the tests again, in round 6. That habit was written here too.

- Ask: Which sentence would you add for your own team?
- Expected: Answers vary: never touch the tests, ask before deleting, write in our house style. Each is one more sentence.

**Point here:** Much of what looked like the agent’s good sense in Part 1 was written here. Changing an agent’s behaviour often means editing this text. Builders call it the system prompt.

**Common misconception:** That instructions are rules the model must obey. They are text it usually follows. Part 4 shows what happens when other text disagrees with them.

**Transition:** One sentence in there mentions a file called NOTES.md. That is how this agent remembers.

**Source:** From the notebook, section 1.6: the text of SYSTEM, a sentence to a line. The tags are from our recorded run.

## memory-q: How would it remember you next week?

**Build 1:** This week we tell the agent two things about our shop. They are now in its conversation.

- Ask: Where exactly is that sentence stored?
- Expected: In the list of messages inside one run of our loop, and nowhere else. The model itself did not change.

**Build 2:** When a run ends, its conversation is thrown away. The next run starts without any of it.

- Ask: How would you make the agent remember it?
- Expected: Write it down somewhere the next run will look. For an agent that works in a folder, that is a file.

**Point here:** A run’s conversation is its only memory, and it ends with the run. Anything that should last has to be stored outside it.

**Common misconception:** That the model learns from what you tell it. Its weights do not change. It knows only what is in the conversation.

**Transition:** So we ask it to write things down. Over to the notebook.

**Source:** The sentence in quotes is from our first request in notebook 2.2, shortened.

## nb-memory: In the notebook

**Build 1:** Two separate runs. The first is told what to remember. The second is only asked a question.

- Ask: The second run starts with an empty conversation. How could it know about the discount?
- Expected: Only from the file. Watch its first two requests.

**Point here:** Two runs, two conversations. The only thing they share is the project folder.

**Notebook:** Notebook 2.2: run the cells under “Notes that outlast a run”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here are our two recorded runs.

## notes-write: The first run wrote its notes to a file

**Build 1:** We said what to remember. The model asks to write a file, and chooses the words itself.

- Ask: Which tool is this?
- Expected: write_file, one of the four from Part 1. Memory needed no new tool.

**Build 2:** Our code wrote NOTES.md into the project. Then the run ended.

- Ask: What is left of this run now?
- Expected: One small text file in the folder, three lines long.

**Point here:** Saving a note is an ordinary tool call that happens to write a file.

**Transition:** Some days later we start a new run, with a different request.

**Source:** Our recorded run, 24 November 2026 (notebook 2.2): 3 rounds, 3.8 seconds of model time.

## notes-read: A new run reads the notes first

**Build 1:** The request says nothing about rupees or discounts. The run begins by listing the files.

- Ask: What does this run know about our shop at this point?
- Expected: Nothing yet. Its conversation holds the instructions, the request and a list of file names.

**Build 2:** It sees NOTES.md and reads it before anything else. That is another sentence of our instructions.

- Ask: Why did it open the notes before the billing code?
- Expected: The instructions say: if NOTES.md exists, read it before anything else and follow it.

**Point here:** The notes get into the new conversation the way everything else does: a tool reads them and our code adds the result.

**Transition:** Now the notes are in its context. Watch what it does with them.

**Source:** Our recorded run, 24 November 2026 (notebook 2.2). The listing is cut short here.

## notes-answer: It answers in rupees, with the school discount

**Build 1:** It reads billing.py, then runs the code with a discount. Our request never mentioned one.

- Ask: Where did the discount in that command come from?
- Expected: From the notes. The request only said that a school was ordering.

**Build 2:** The answer is in rupees and includes the school discount. Both came from the file.

- Ask: What changed in the model between the two runs?
- Expected: Nothing. It is the same model with the same weights. The folder has one more file, and the instructions say to read it.

**Point here:** What the agent remembered from last week is exactly the text of one file, read at the start of the run.

**Common misconception:** That the agent now “knows” our shop. Delete the file and the next run knows nothing again.

**Transition:** So what is an agent’s memory?

**Source:** Our recorded run, 24 November 2026 (notebook 2.2): 5 rounds, 4 tool calls, 6.9 seconds of model time.

## memory-is: Its memory is a file

**Build 1:** Between the two runs the model did not change at all. The folder did.

- Ask: What would you put in such a file for your own project?
- Expected: How to run the tests, and what never to touch. A person can read the file, correct it, and keep it under version control.

**Point here:** Memory across runs is text stored outside the model and read back into the context. Because it is a file, a person can open it and fix it.

**Common misconception:** That more notes are always better. Every line of the notes is read in every round of every run, so the file should stay short.

**Transition:** Part 2 in one slide.

## recap-2: Part 2 in one slide

**Build 1:** Next: the same agent, other jobs.

- Ask: Which line of the card changed since Part 1?
- Expected: Memory: the conversation lasts for one run, and the notes file lasts across runs. The model, the tools and the loop are the same.

**Point here:** One run is a conversation that only grows. Instructions start it, and a notes file carries a little of it into the next run.

**Transition:** Part 3: the same agent, other jobs.

## part-3: Part 3 · The same agent, other jobs

**Build 1:** Key question: what else can the same four tools and loop do, and who checks the result?

- Ask: Which job in your week is mostly opening files, reading them and filing them?
- Expected: Expense claims, supplier paperwork, a shared drive, a monthly report. Keep one in mind: the next two jobs are of that kind.

**Point here:** The agent from Part 1 was not built for code. It can do any job that can be done by reading files, writing files and running commands.

**Transition:** The first job is a folder nobody has sorted.

**Source:** Illustration: generated (Gemini image model).

## tidy-mess: Ten files, and no name says what is inside

**Build 1:** The shop’s inbox for October. Each file belongs in one of four folders, and no name says which.

- Ask: Which of these is a complaint from a customer?
- Expected: Nobody can tell from the names. Someone has to open each file and read it.

**Build 2:** We also want each file renamed to its date and its sender.

- Ask: Why put the date first in the name?
- Expected: Then any file browser lists the folder in date order.

**Point here:** A dull, real office chore: open, read, decide, file and rename. Ten times here, and thousands of times in a real office.

**Transition:** We give this job to the same agent.

**Source:** The inbox is made up for this talk. The notebook creates it (make_workspace).

## tidy-ask: We ask in plain words

**Build 1:** We name the folders and give one example. We do not say which file goes where.

- Ask: What have we left for the agent to work out?
- Expected: What each file is, its date and who sent it. All of that is inside the files, so it will have to read them.

**Point here:** The request describes the result we want. The steps are left to the model.

**Transition:** Over to the notebook.

## nb-tidy: In the notebook

**Build 1:** The agent is the one from Part 1, with the same four tools. Only the request is new.

- Ask: What does it have to do before it can move a single file?
- Expected: Open each file and read it. The names tell it nothing.

**Point here:** A new job needed a new request. It needed no new code.

**Notebook:** Notebook 3.1: run the cells under “Tidy a messy folder”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run.

## tidy-reads: First it reads every file

**Build 1:** A name tells it nothing, so it asks to read the first file. It is a payment receipt.

- Ask: Could it have sorted the files without opening them?
- Expected: No. A name like 20261019_093211.txt says nothing about what is inside.

**Build 2:** Ten reads in ten rounds. This one is a customer’s letter, and no line in it says so.

- Ask: How does it know that this file is a customer’s letter?
- Expected: From what the text says: someone is writing to the shop about something they bought. A rule that searched for a fixed word would miss it.

**Point here:** It reads the way we would, one file at a time, and it sorts by what the text means.

**Transition:** It now knows what every file is. Next it moves them.

**Source:** Our recorded run, 24 November 2026: rounds 2 to 11 of 19. Two of the files it read are shown.

## tidy-error: A command fails. It reads the error and tries again

**Build 1:** It asks for all the moves in one command. One file name has brackets, and the shell stops.

- Ask: What does our code do when a command fails?
- Expected: Nothing special. It returns the exit code and the error text to the model, like any other result. (The lines above the bad one had already run, so the retry complained about three files that were gone. The agent then listed the folder to check.)

**Build 2:** The error goes back to the model as the result. Next round, that name is in quotes.

- Ask: Who told it to add the quotes?
- Expected: Nobody, in that round. It read the error message. Our description of the bash tool does ask for quotes around such names, and the first time it left them out.

**Point here:** An error is one more result in the conversation. The loop lets the model read it and try again.

**Common misconception:** That an agent has to get every step right. It has to notice when a step went wrong, and here the exit code and the error text told it.

**Transition:** So what does the inbox look like now?

**Source:** Our recorded run, 24 November 2026: rounds 13 and 14 of 19. Each command had 10 lines; the one that failed is shown.

## tidy-after: The inbox, before and after

**Build 1:** On the left, the inbox as we found it. On the right, the same folder 50 seconds later.

- Ask: What do the new names have in common?
- Expected: Each starts with the date, then the sender. The folder now lists in date order.

**Build 2:** Four new folders and an index file. Ten files went in and ten came out.

- Ask: What should we check before we trust this?
- Expected: That each file is in the right folder, and that nothing was lost or overwritten. A folder can look tidy and still be wrong.

**Point here:** One request, and the whole chore is done: read, decide, move, rename, index.

**Transition:** It looks right. Is it right?

**Source:** Our recorded run, 24 November 2026 (Gemma 4 (12B)): the folder as the notebook lists it after the run.

## tidy-check: Did it get it right?

**Build 1:** We wrote these files, so we know what each one really is.

- Ask: How would you check this in a real office, where nobody has an answer key?
- Expected: Check a sample by hand, or sort a small set yourself first and compare. That small labelled set is an eval; Part 4 builds one.

**Build 2:** Every file is in the right folder, with a dated name.

- Ask: Would you run this on your own documents folder tomorrow?
- Expected: On a copy, yes. It moves and renames real files, so a wrong move matters. Part 4 is about that.

**Point here:** We can count how well it did only because we know the right answers. Keep a small set like this for your own tasks.

**Transition:** The second job involves money.

**Source:** Checked by the notebook (section 3.1) against the list the files were made from. Gemma 4 (12B), 24 November 2026.

## invoice-job: Six invoices to check before anything is paid

**Build 1:** An invoice from a supplier, and the orders the shop placed. Do they match?

- Ask: What would you compare, and in what order?
- Expected: The order number first, then the quantity and the unit price against that order.

**Build 2:** The order says Rs 150 each. The invoice charges Rs 165. Six invoices need this check.

- Ask: Who does this job in your organisation today?
- Expected: Usually someone in accounts, by eye, near the end of the month. It is slow work, and a tired reader misses things.

**Point here:** Checking one document against another is careful, repetitive work, and a lot of office work looks like it.

**Transition:** Again, all we write is the request.

**Source:** The invoices and the orders are made up for this talk; the notebook creates them. The orders file also names each supplier.

## invoice-ask: The request says what “fine” means

**Build 1:** We ask for a list. We do not ask it to pay or reject anything.

- Ask: What did we not ask it to do?
- Expected: Pay, reject or write to a supplier. We asked for a report only. That was a choice, and we come back to it.

**Point here:** The request holds the rule and the output we want: a report, and no action.

**Transition:** Over to the notebook.

## nb-invoices: In the notebook

**Build 1:** Same agent again. We pass the new request, and wait for the file it writes.

- Ask: How many of the six do you expect it to flag?
- Expected: We put a problem in three of them. Watch whether it finds exactly those.

**Point here:** Again there is no new code, only a new request.

**Notebook:** Notebook 3.2: run the cells under “Check invoices against orders”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run.

## invoice-did: It reads everything, then writes one file

**Build 1:** It lists the folder, reads the orders, then reads all six invoices, one each round.

- Ask: Which of the four tools has it not used so far?
- Expected: edit_file. There is nothing here to change: it is only reading.

**Build 2:** Then one write_file, and it stops: 10 rounds, 19 seconds, and one new file in the project.

- Ask: What has changed in the project?
- Expected: One new file, mismatches.md. The invoices and the orders file are untouched.

**Point here:** The same loop as the bug fix: look, read what matters, then act once.

**Transition:** What is in the file?

**Source:** Our recorded run, 24 November 2026 (Gemma 4 (12B)): 10 rounds, 9 tool calls, 18.8 seconds of model time.

## invoice-found: It flags three of the six invoices

**Build 1:** This is the file it wrote, word for word. It names three of the six invoices.

- Ask: Is each line of the report true?
- Expected: Check one against the orders table from two slides back. The numbers in the report are the numbers in the files.

**Build 2:** We put a problem in three of the invoices. It flagged those three, and none of the others.

- Ask: How do we know it missed nothing?
- Expected: Because we made the invoices, and we know which ones are wrong. In real use you would not know, so you check a sample.

**Build 3:** The agent paid nobody and wrote to nobody. Its whole output is this list.

- Ask: Would you let it reject these invoices itself?
- Expected: Not yet. A wrong rejection annoys a supplier and a wrong payment loses money. A list is cheap to check, and a payment is hard to undo.

**Point here:** A good first job for an agent: it reads and reports, and a person keeps the decision.

**Transition:** That is three jobs. What changed between them?

**Source:** Our recorded run, 24 November 2026. The file is exactly what the agent wrote; the cards compare it with the problems we put in.

## invoice-same-agent: What changed between the three jobs?

**Build 1:** The model, the four tools and the loop are the ones we built in Part 1.

- Ask: So where did the skill for each new job come from?
- Expected: From the model, which can already read a letter or compare two numbers, and from our request. The tools only gave it access to the folder.

**Point here:** One general agent did three different jobs. What we wrote for each was a request, and a way to check the result.

**Transition:** The same loop runs inside products you have heard of.

**Source:** All three runs are real (Gemma 4 (12B), 24 November 2026). For the two longer jobs we raised the limit on rounds; nothing else changed.

## work-real: Real products run the same loop

**Build 1:** Our loop once more, and the four tools it can ask for.

- Ask: What would we change to turn our agent into a support agent?
- Expected: Only the tools: an order lookup, a refund and a reply in place of files and a terminal. The model and the loop stay.

**Build 2:** Real products keep this loop. What changes is the set of tools.

- Ask: What tools would an agent need in your team?
- Expected: Usually three or four: look something up, change a record, send a message. Each is one function, like read_file.

**Point here:** An agent product is the same loop, with tools chosen for one job.

**Common misconception:** That each product is a different kind of AI. The loop is the one we wrote; the tools and the checks around it differ.

**Transition:** First, the product closest to what we built.

## app-coding: Coding agents work the way ours did

**Build 1:** Claude Code, Codex and Cursor work as our agent did: read, edit, run the tests, repeat.

- Ask: What does a product add to our sixty lines?
- Expected: A stronger model, more tools (search, git, a browser), permissions and logs. The loop is the same.

**Build 2:** How good are they? This public test gives an agent real issues from open-source projects.

- Ask: Does that score mean an agent can do most of a developer’s job?
- Expected: No. The 500 tasks are small fixes with the tests already written, and the test has leaked into training data: OpenAI stopped reporting it in Feb 2026. Vendors report higher scores (93.9% for the restricted Claude Mythos Preview); the independent leaderboard is the safer number. GPT-4o scored 33.2% in Aug 2024. Run your own evals (Part 4).

**Point here:** A coding agent can do much of the work because tests check each change in seconds, and a person approves the merge.

**Common misconception:** That the score measures a developer’s job. It measures small, well-described fixes that come with tests.

**Transition:** Next, a job with no tests: answering customers.

**Source:** SWE-bench Verified (500 tasks): the top score on the independent swebench.com leaderboard. The steps are a sketch of how coding agents work. Illustration: generated.

## app-support: Customer support: it answers the routine chats

**Build 1:** A support agent reads the message, looks up the order and the policy, and replies.

- Ask: Which of these steps can go wrong without anyone seeing?
- Expected: The reply. It goes to the customer at once, so the customer is the first person to read it.

**Build 2:** Answers took under 2 minutes, down from 11. Later, Klarna’s CEO said quality had dropped.

- Ask: It handled two-thirds of the chats. Is two-thirds of the job done?
- Expected: No. Those 2.3 million chats were the routine ones. In May 2025 Klarna’s CEO told Bloomberg that cost had been too dominant a factor, and the result was lower quality. Klarna offers a person again for some cases, with freelance staff, while its headcount keeps falling. Klarna had said the assistant did the work of 700 full-time agents, with 25% fewer repeat inquiries.

**Point here:** A support agent settles routine chats quickly. Nobody reads each reply first, so its quality has to be measured another way.

**Common misconception:** That Klarna went back to people. The new staff are freelance, and total headcount kept falling.

**Transition:** Now a job where a program checks every attempt.

**Source:** Klarna press release (Feb 2024); its CEO’s interview with Bloomberg (May 2025), as reported by Entrepreneur. The steps are a sketch of a typical support agent. Illustration: generated.

## app-evolve: AlphaEvolve: a program scores every attempt

**Build 1:** Which server should each job run on? Google’s engineers wrote a program that scores any rule.

- Ask: Who has to read each attempt?
- Expected: Nobody. The program scores every rule, so the loop does not wait for a person. Engineers read the winner before it is used.

**Build 2:** It tries far more rules than a team could read. The best one now runs in Google’s data centres.

- Ask: Which problems in your work come with a scorer like this?
- Expected: Scheduling, routing, packing: anything with a cost that a program can compute.

**Point here:** When a program can score the result, the loop can run without a person looking at each attempt.

**Common misconception:** That AlphaEvolve is a smarter model. It is a loop around existing Gemini models, and the scorer does much of the work. It also found a way to multiply 4×4 complex matrices with 48 multiplications, and a faster kernel that cut Gemini’s training time by 1%.

**Transition:** Most jobs have no scorer. In a clinic, the check is a doctor.

**Source:** Google DeepMind blog, 14 May 2025. The steps are simplified. Illustration: generated.

## app-clinic: Clinic notes: the doctor signs every note

**Build 1:** An AI scribe listens to the visit and drafts the note. The doctor corrects it and signs.

- Ask: Would you let it file the note straight into the record?
- Expected: No. The note goes into a medical record, and an error in it can reach the patient.

**Build 2:** Correcting a draft is quicker than writing a note. The doctor still reads every one.

- Ask: What would you measure, to know whether it helps?
- Expected: Time spent on notes, and what the doctor corrects. Across 2.58 million visits (Oct 2023 to Dec 2024), The Permanente Medical Group counted about 15,800 hours saved, with the doctor’s review kept.

**Point here:** The scribe saves writing time, and the doctor keeps every decision.

**Common misconception:** That the scribe makes the diagnosis. It writes down what was said; the doctor decides.

**Transition:** Four jobs. Who checked the work in each?

**Source:** The Permanente Medical Group (Kaiser Permanente), NEJM Catalyst 2025, Oct 2023 to Dec 2024; the hours as reported by the AMA. The steps are a sketch. Illustration: generated.

## who-checks: Who checked the work?

**Build 1:** Four jobs, and the same loop in each. Take a guess for each one.

- Ask: Before the answers appear: who checked each one?
- Expected: Coding: the tests, then a person. Support: nobody, before the reply went out. AlphaEvolve: a program. The clinic: the doctor, every time.

**Build 2:** Each job got a different amount of freedom. Two questions explain why.

- Ask: Why not have a person read everything, as in the clinic?
- Expected: It would cost what the agent saves. A person’s check is worth paying for when a mistake is costly, as in a medical record.

**Point here:** The loop was the same in all four jobs. What differed was who checked the result, and how often.

**Transition:** The two questions, as a map.

**Source:** Illustrations: generated.

## stakes-map: How much freedom should each job get?

**Build 1:** Two questions place a job: how easy is its result to check, and what does a mistake cost?

- Ask: Before the points appear: where would you put fixing a test? Paying an invoice?
- Expected: Fixing a test: bottom right. The tests check it in seconds, and one line is easy to change back. Paying an invoice: the match is easy to check, but money leaves, so top right.

**Build 2:** Our own three jobs first. All are easy to check. A mistake on the invoices costs the most.

- Ask: Why do the invoices sit higher than the folder?
- Expected: A file in the wrong folder can be moved back. A payment to the wrong supplier is hard to get back. So the agent may write the report, and a person approves the payment.

**Build 3:** Now the real jobs. The grey ones are further examples. Which point would you move?

- Ask: Which point would you move, and why?
- Expected: Common moves: customer support higher, because a wrong promise binds the company; deep research further right, because its key claims can be spot-checked. Coding agents sit above our own test fix: the check is the same, but a merge reaches real users. The grey points are the appendix’s jobs and two more. One of those, farm advisory, is already large: the government’s Kisan e-Mitra chatbot has answered more than 95 lakh farmer questions in 11 languages (PIB, Sep 2025).

**Build 4:** Each corner suggests how much freedom to give. Where would your team’s most repeated task sit?

- Ask: Where does your team’s most repeated task sit?
- Expected: Most operational work lands top right: seven of the thirteen jobs here. Let the agent do the work, with approval before the step that cannot be undone. Part 5 starts there.

**Point here:** Two questions set how much freedom a job gets: how cheaply can its result be checked, and what does a mistake cost?

**Common misconception:** That a more capable model moves a job to the bottom right. A better model makes fewer mistakes. What a mistake costs, and how hard the result is to check, stay the same.

**Notebook:** Click a point to read why it sits there; click it again to hide the line. The positions are the speaker’s judgement, not measurements: invite the room to move them.

**Transition:** Part 3 in one slide.

**Source:** Positions: the speaker’s judgement, for discussion (data/apps.json). The zones split each axis at its middle.

## recap-3: Part 3 in one slide

**Build 1:** Next: how agents fail.

- Ask: Pick one task from your week. Which corner of the map does it fall in?
- Expected: Most land top right: the agent can do the work if a person approves the step that cannot be undone. That is where Part 5 begins.

**Point here:** How much an agent may do alone depends on two things: how cheaply its result can be checked, and what a mistake costs.

**Transition:** Even in the right corner, agents fail. Part 4 shows how.

## part-4: Part 4 · How agents fail

**Build 1:** Key question: what must be in place before an agent touches anything that matters?

- Ask: Has software ever done something you did not mean it to? What stopped the damage?
- Expected: Autocorrect, an email to the wrong list, a script that deleted files. Usually an undo, a backup, or a person who noticed in time.

**Transition:** Start with a little arithmetic.

**Source:** Illustration: generated (Gemini image model).

## compound-q: How often is a twenty-step task right?

**Build 1:** Say each step is right 95% of the time, and a task takes twenty steps. How often is the whole task right?

- Ask: Take a guess: what share of these tasks come out fully right?
- Expected: Most guess well above half. The answer surprises people.

**Build 2:** Only 36% of the time. The task is right only if every step is right, so the chances multiply.

- Ask: Would you hire someone who gets 95% of steps right?
- Expected: For a one-step job, gladly. For a twenty-step job, they finish cleanly about a third of the time.

**Point here:** Reliability multiplies across steps: right 95% of the time per step means a twenty-step task is right 36% of the time.

**Common misconception:** That a model right 95% of the time gives tasks right 95% of the time. That holds only for one-step tasks. Real steps are not independent, so treat this as a simple model of a real trend.

**Transition:** The same sum as a curve.

**Source:** Computed in scripts/sci/p4.py. The simple model: steps fail independently, and every step must be right.

## compound: What if we check each step?

**Build 1:** Red is the sum we just did. Check each step and retry once, and twenty steps come out right 95% of the time.

- Ask: Where did our agent check a step?
- Expected: It ran the tests after its edit, and we ran them again ourselves. In the invoice job, a program checked every flag.

**Point here:** Reliability multiplies across steps, so long runs need checks inside the loop as well as a better model.

**Common misconception:** That the check has to be perfect to help. Here it catches every wrong step; a check that catches most of them still lifts the curve a long way. Real checks miss things, so treat the green curve as a best case.

**Notebook:** Switch the check off, and drag the sliders: without it, a 50-step task is right only 8% of the time. Notebook 4.1 prints the same sum for three step rates: even at 99% a step, 50 steps are right only 61% of the time.

**Transition:** Those were honest mistakes. Now someone tries to mislead the agent.

**Source:** Computed in scripts/sci/p4.py. With a check, a step is right unless both tries fail.

## inj-note: A note from a supplier arrives

**Build 1:** A supplier’s note arrives in the inbox, about a price rise. We ask the agent to summarise it.

- Ask: Would you notice anything odd about this note?
- Expected: Most people read the first paragraph and stop. The price rise looks like the whole message.

**Build 2:** One paragraph is written for the assistant. It asks for a command that prints .env, our file of secrets.

- Ask: Does the agent need .env to summarise a note?
- Expected: No. But it can reach it: the file sits in the same folder, and bash can print any file.

**Point here:** A file our agent reads can contain text addressed to the agent, and the agent can reach more than its task needs.

**Common misconception:** That such text has to be hidden cleverly. It can sit in plain sight: people skim, and the model reads every word.

**Transition:** Over to the notebook. We let every tool call through.

**Source:** The note and the key are made up for this talk; the notebook writes both files in section 4.2. The note’s text is exact, wrapped to fit.

## nb-inject: In the notebook

**Build 1:** Over to the notebook. We add the note and ask for the summary, with every tool call allowed.

- Ask: Will it run the command the note asks for?
- Expected: Watch the purple blocks. A request for the secrets file would mean the note worked.

**Point here:** We run the attack on our own agent, so we can see what it does.

**Notebook:** Notebook 4.2: run the first two cells (the note, then injection_run(True)). Leave the cell with injection_run(False) for later: we come back to it.

**Transition:** Here is what happened in our run.

## inj-open: With everything allowed, the secret ends up in its answer

**Build 1:** It reads the note, as we asked. The whole note is now in the conversation, odd paragraph included.

- Ask: What has the model just read?
- Expected: The price rise, and the paragraph written for it.

**Build 2:** Its next request is the command from the note. Nothing stops it, so our code returns the key.

- Ask: Who asked for that command?
- Expected: The supplier, through the note. We never mentioned the secrets file.

**Build 3:** Its summary ends with the key. Whoever receives this summary receives the secret.

- Ask: Where would this summary go in a real office?
- Expected: Into an email, a ticket or a chat channel, perhaps back to the supplier. The key travels with it.

**Point here:** Text inside a file changed what the agent did: it ran a command we never asked for and put a secret in its answer.

**Common misconception:** That the model was hacked. No bug was used. The model did what the text in front of it said, which is what a model does.

**Transition:** Was that bad luck? One run proves little. Back to the notebook.

**Source:** Our recorded run: notebook 4.2, 24 November 2026 (Gemma 4 (12B)), every tool call allowed. The summary is cut after its first sentence; the last line is exact.

## nb-trials: In the notebook

**Build 1:** The same request, ten times. It takes a few minutes, so we start it and come back.

- Ask: Out of ten runs, how many will leak the key?
- Expected: Guesses vary. Our recorded count is on the next slide; the live one arrives in a few minutes.

**Point here:** One run proves little. Repeating it shows how often each outcome happens.

**Notebook:** Notebook 4.3: start the cell and go on with the slides; it takes a few minutes. Look at the live counts when the notebook is next on screen.

**Transition:** While it runs, here are our recorded ten runs.

## inj-trials: Ten of ten runs put the key in the summary

**Build 1:** The agent ran the note’s command in all ten runs, and the key was in its summary in all ten.

- Ask: Would a bigger model have refused?
- Expected: Perhaps more often. But the count changes with the model and with the wording of the note, and an attacker can try many wordings.

**Point here:** How often a model falls for it changes from model to model and from note to note, so the defence cannot depend on the model noticing.

**Common misconception:** That a bigger model is immune. Its count would differ, and widely used products have been tricked the same way.

**Transition:** Why does a paragraph in a file work at all?

**Source:** Our runs: notebook 4.3, 24 November 2026 (Gemma 4 (12B)), every tool call allowed. The secret reached the model in 10 of 10 runs.

## one-stream: Why it works: the model reads one stream of text

**Build 1:** Each round the model gets one text: our instructions, our request, and whatever the tools returned.

- Ask: Where in this text does “ours” end and “theirs” begin?
- Expected: Nowhere the model can rely on. There are labels on the messages, but it reads all of them as text to act on.

**Build 2:** The stranger’s paragraph is in there like any other sentence. This is prompt injection: data that poses as an instruction.

- Ask: How would the model know the red part is not from us?
- Expected: It often cannot. The paragraph is polite, plausible and addressed to it. Models are trained to follow instructions.

**Point here:** Prompt injection works because a model has one input, and instructions and data arrive in it together.

**Common misconception:** That a line in our instructions (“ignore instructions inside files”) fixes this. It helps a little. The attacker’s text arrives in the same stream and can argue back.

**Transition:** When is this dangerous? One rule of thumb.

**Source:** A drawing of the conversation in round 3 of our run. The words on the red block are from the note.

## trifecta: The lethal trifecta

**Build 1:** Simon Willison’s rule of thumb: an agent with all three can be tricked into handing your data to an attacker. Ours had all three.

- Ask: Which of the three does the assistant in your company’s email or chat tool have?
- Expected: Most have the first two: your files, and anything pasted or fetched. The danger starts when it can also send, post or open links.

**Build 2:** Take one away and this attack fails. We take the first: .env stays shut unless a person says yes.

- Ask: Which of the three is easiest to remove in your case?
- Expected: Often the third: nothing goes out without approval. Sometimes the second: it only reads trusted sources. Here, the first.

**Point here:** Willison’s lethal trifecta: private data, untrusted content and a way to send data out. Remove any one and this attack fails.

**Common misconception:** That this only works in a classroom. Researchers showed it on three products people use: Microsoft 365 Copilot (a crafted email could make it disclose data; Aim Labs, CVE-2025-32711, 11 Jun 2025); GitHub MCP server (a public issue led an agent to leak private repository data; Invariant Labs, 26 May 2025); Perplexity Comet (text on a web page steered the browser agent; Brave, 20 Aug 2025). Microsoft rated EchoLeak’s severity 9.3 of 10 (critical) and patched it.

**Transition:** Here is the same request again. This time the person says no.

**Source:** Simon Willison, “The lethal trifecta for AI agents” (16 Jun 2025). The three items on the right are in his words.

## inj-gated: The same request, with a person who says no

**Build 1:** Same note, same request, and the model asks for the same command. This time a person is asked first, and says no.

- Ask: What is different from the first run?
- Expected: Only who answered the question. In the first run everything was allowed.

**Build 2:** Our code tells the model it was refused. The summary has the prices, and no key.

- Ask: Did the model learn not to ask?
- Expected: No. It asked again, exactly as before. The command was stopped by our code, outside the model.

**Point here:** The model fell for the note again. The secret stayed safe because our code asked a person before it touched the file.

**Common misconception:** That the model became more careful. It made the same request in both runs. Only our code changed.

**Notebook:** Notebook 4.2, the last cell: injection_run(False). A stand-in answers no to every question; ask_human would put this question to you.

**Transition:** Where did that question come from?

**Source:** Our recorded run: notebook 4.2, 24 November 2026 (Gemma 4 (12B)). A stand-in for the person answered no; the question is the one ask_human prints. The summary is cut after its first sentence.

## guard-code: This check was in our loop all along

**Build 1:** The question came from a check in our loop. It sits between the model’s request and our code, and the model cannot skip it.

- Ask: Which actions in your work should wait for a person?
- Expected: Anything that cannot be undone: payments, emails to customers, deletions, orders. Reading can usually run at once. People who are asked fifty times stop reading the question.

**Build 2:** It is ten lines, called before every tool since Part 1. Until now every command was on the safe list, so nobody was asked.

- Ask: Why did we never see a question in Parts 1 to 3?
- Expected: Every command the agent ran was on the list: ls, cat, grep, mkdir, mv and the like. The list has 27 commands.

**Point here:** The guard is ordinary code in the loop, between the model’s request and our tools. It was there from the first run; the earlier jobs never set it off.

**Common misconception:** That a guardrail is a sentence in the instructions (“never read secrets”). Instructions are advice the model may ignore. This function is enforced by code.

**Transition:** Let us set it off on purpose. Back to the notebook.

**Source:** Simplified from needs_approval in the notebook, section 1.6. The real one checks every command in a line joined by pipes or &&.

## nb-approval: In the notebook

**Build 1:** We ask the agent to delete two old files. Deleting needs rm, which is not on the safe list.

- Ask: What should we check before we type y?
- Expected: That the command deletes exactly the files we meant, and nothing else.

**Point here:** A person approves the command itself: the exact text that will run.

**Notebook:** Notebook 4.4: run the cell. When the question appears, read the command aloud, then type y.

**Transition:** Here is our recorded run.

## approval: It wants to run rm, so the notebook asks us

**Build 1:** The model asks for rm. It is not on the safe list, so the notebook stops and shows us the command.

- Ask: What does the person see: the model’s plan, or the command?
- Expected: The command itself, word for word. A summary of the plan could hide a mistake.

**Build 2:** The command names our two files and nothing else, so we type y. Had it been wrong, the answer would have been n.

- Ask: What would you want to see before approving a payment?
- Expected: The amount, the account and the reason, in full. The approval is only as good as what it shows.

**Point here:** The person sees the exact action before it happens, and can refuse it.

**Common misconception:** That asking a person makes the agent useless. It asked once in the whole run, for the step that could not be undone.

**Transition:** One honest caveat about our safe list.

**Source:** Our recorded run: notebook 4.4, 24 November 2026 (Gemma 4 (12B)). Nobody was at the keyboard when we recorded, so a stand-in said yes and logged the question.

## sandbox: A safe list is not a sandbox

**Build 1:** Our check reads only the first word of each command. python is on the list, and a Python script can do anything.

- Ask: Could we fix the list by removing python?
- Expected: Then the agent cannot run the tests. A list is always too loose or too tight; it reduces questions, it does not contain damage.

**Build 2:** So real agents also run in a sandbox: a container, or a throwaway machine such as Colab. A mistake breaks only what is inside.

- Ask: Where is our own notebook running?
- Expected: In Colab, on a machine that is thrown away when the session ends. That is our sandbox today.

**Point here:** A safe list decides when to ask. A sandbox decides what can be damaged at all. Real agents use both.

**Common misconception:** That an approval step makes an agent safe. It covers the commands we thought of. The sandbox covers the ones we did not.

**Transition:** One guard is left on the map: the step limit. Back to the notebook.

**Source:** The command is our own example, checked against the notebook’s needs_approval in scripts/sci/p4.py. It was never run.

## nb-steplimit: In the notebook

**Build 1:** A tool that never answers, and a goal that says keep trying. We allow four rounds.

- Ask: Without the limit, when would this run stop?
- Expected: Perhaps never. Each round the model reads the error and asks again, for as long as someone pays for it.

**Point here:** A step limit stops the loop after a fixed number of rounds, whatever the model wants.

**Notebook:** Notebook 4.5: run the cells under “A step limit”. If the run is slow or fails, move on: the next slide shows our recorded run.

**Transition:** Here is our recorded run, on the map.

## steplimit: The step limit stopped it after four rounds

**Build 1:** The limit is a counter in our code, outside the model. A cap on cost or on time works the same way.

- Ask: What limits would you set for an agent in your team?
- Expected: A number of rounds, a budget per task, a time limit, and a rule to stop and ask a person after repeated failures.

**Point here:** Limits are enforced by our code, so they hold even when the model is told to keep trying.

**Common misconception:** That the model will notice it is stuck. Ours read the same error every round and asked again, because the goal told it to keep trying. Our loop’s default is 12 rounds.

**Transition:** With the map complete, two failures from the news.

**Source:** Our recorded run: notebook 4.5, 24 November 2026 (Gemma 4 (12B)). Every call returned “TimeoutError: the warehouse service did not answer”; the run ended with the status “stopped after 4 rounds”.

## real-failures: Two real failures, on the same map

**Build 1:** It went wrong at the tool: the agent could run commands on live data. In a sandbox, only a copy would have been lost.

- Ask: Which of our guards would have helped at Replit?
- Expected: A sandbox, and a person approving destructive commands. Replit’s chief executive said they had started separating development and live databases automatically.

**Build 2:** Here no tool was involved, only an answer. A tribunal held the airline responsible, and it had to pay CAD 812.02.

- Ask: Who is responsible for what a company’s chatbot tells a customer?
- Expected: The company. In the tribunal’s words, Air Canada “in effect” suggested the chatbot was a separate legal entity responsible for its own actions. The tribunal did not accept that.

**Point here:** What an agent can touch decides what a mistake costs, and a company answers for what its agent says.

**Common misconception:** That these are stories about bad models. As reported, Replit’s agent had write access to production; its own chat log said it wiped records of 1,206 executives and 1,196 companies. One report says the data was later recovered. Air Canada’s chatbot only answered, and the answer alone cost money.

**Transition:** Guards limit the damage. How do we know the agent works at all?

**Source:** Replit, Jul 2025: reported by The Register and Tom’s Hardware. Moffatt v. Air Canada, 2024 BCCRT 149, decided 14 Feb 2024; reported by law-firm summaries of the decision.

## nb-evals: In the notebook

**Build 1:** Ten runs of the Part 1 job, then ten on a smaller Gemma. We start it and come back.

- Ask: How would you test an agent before you trust it?
- Expected: Run it many times, each time on a fresh copy of the project, with a program that checks the result. Then count how many come out right.

**Point here:** An eval is a set of cases with a check, which we run the agent on again and again.

**Notebook:** Notebook 4.6: start the cell; it takes several minutes. The next slide shows our recorded result.

**Transition:** Here are our recorded results.

## evals: Which model do we need?

**Build 1:** Gemma 4 (12B) fixed the tests in all ten runs. The smaller model fixed them in six of the ten.

- Ask: Which model would you pick so far?
- Expected: The one that fixed more runs. One good demo would not have shown the difference.

**Build 2:** The smaller model is quicker, 8 seconds a run against 11, and fails more often. The eval tells us by how much.

- Ask: Is a fast agent that fails more often ever the right choice?
- Expected: Sometimes: when a program checks every result and a failed run can simply be tried again. Without a check, no.

**Point here:** An eval runs the agent many times on cases a program can check, and counts. Compare that count across models, instructions and versions.

**Common misconception:** That a failed run announces itself. In three of the smaller model’s failed runs it stopped after two rounds, with an answer and no fix. One ran into the step limit. We know only because a program ran the tests after every run.

**Transition:** Part 4 in one slide.

**Source:** Our runs: notebook 4.6, 24 November 2026, ten runs per model on a laptop. “Fixed” means the tests pass and the test file is untouched; no run changed the tests.

## recap-4: Part 4 in one slide

**Build 1:** Next: agents in your organisation.

- Ask: Before this agent worked on your team’s real files, which line of the card would you change?
- Expected: Guardrails: run it in a sandbox, on a copy. And the person line: who reads the evals after every change.

**Point here:** The failures of this part map onto the bottom three lines of the card.

**Transition:** Part 5: agents in your organisation.

## part-5: Part 5 · Agents in your organisation

**Build 1:** Key question: should a given task in your team go to an agent, and with how much freedom?

- Ask: Which task in your team would you hand to an agent first?
- Expected: Weekly reports, ticket triage, reconciliations, first drafts. Keep two answers: we run them through the next two slides.

**Transition:** First: does the task need an agent at all?

**Source:** Illustration: generated (Gemini image model).

## workflow: A workflow or an agent?

**Build 1:** An invoice that matches its order is read, matched and paid. Those steps never change, so we write them once, as code.

- Ask: Name a job in your team that follows the same steps every time.
- Expected: Monthly reports, standard approvals, payroll runs, matching invoices to orders.

**Build 2:** One that does not match needs judgement: what is wrong, and what next? That goes to an agent, or to a person.

- Ask: In Part 3 our agent checked the invoices. Which part of that job would you now write as a workflow?
- Expected: Reading each invoice and comparing it with its order: the same steps for all six. The three that do not match are where the judgement is, and that goes to an agent or a person.

**Point here:** A workflow has steps we fix in advance. An agent chooses each step after reading the last result.

**Common misconception:** That a workflow cannot use a model. A model can do one step, such as reading the invoice, while our code still fixes the order of the steps.

**Notebook:** Part 3 had no workflow, so the agent did the whole job: it checked the six invoices and flagged three. A team that pays invoices every week writes the matching down once, and keeps the agent, or a person, for the ones that fail. The bug fix of Part 1 could not be written down: each step depended on what the last one found.

**Transition:** So the first question about any task is this one.

**Source:** Workflows and agents: Anthropic, “Building effective agents” (Dec 2024).

## should-agent: Should this task be an agent?

**Build 1:** Take one task from your team. First question: do its steps change from case to case? If not, write a workflow.

- Ask: Take the task you named a minute ago. Does it follow the same steps every time?
- Expected: Often yes: monthly reports, standard approvals, matching invoices. That is good news: a workflow is cheaper to build and to run.

**Build 2:** If they do, an agent may help. Second question: can a person check its result in a minute or two?

- Ask: How did we check each of our three jobs today, and how long did it take?
- Expected: The bug fix: run the tests and read a one-line change. The folder: list it. The invoices: compare with the orders. Seconds each. A strategy memo or a diagnosis would take an expert an hour.

**Build 3:** Third: is a mistake costly, or impossible to undo? Your answers lead to one of the four corners of Part 3’s map.

- Ask: Our agent edits a file in a test folder, or it pays a supplier. Which mistake is costly?
- Expected: The payment. A wrong edit can be undone in a second; money that has left cannot. On Part 3’s map these could run on their own: Fix a test, Tidy a folder, AlphaEvolve. These needed approval: Check invoices, Coding agents, Customer support, Clinic notes, IT incidents, Web forms, Robot lab.

**Point here:** Three questions place a task: do the steps change, can a person check the result cheaply, and what does a mistake cost?

**Common misconception:** That a more capable model moves a task to a safer box. It can make mistakes rarer, but what a mistake costs stays the same, so the approval before a step that cannot be undone stays.

**Notebook:** Read the third click as two pairs. Cheap to check: if a mistake is costly the agent acts and a person approves; if not, let it run. Hard to check: if a mistake is costly a person leads; if not, the agent only drafts.

**Transition:** A person approves: that is something our own code arranges. How often should it ask?

**Source:** The four boxes on the right are the four zones of the stakes map in Part 3.

## freedom: Give an agent more freedom in steps

**Build 1:** Before a request runs, our code can ask a person: always, when it is risky, or never. Our notebook asked when it was risky.

- Ask: What happened in Part 4 when the agent asked to delete files?
- Expected: The loop stopped and asked us first. rm is not on the list of safe commands, so it could not run until a person answered.

**Build 2:** Start on the bottom step. Move up when evals on your own past cases pass. Step back when errors rise.

- Ask: What would convince you to move up a step?
- Expected: A measured success rate on enough of your own past cases, and a plan for the errors that remain. Part 4 showed the method on a small scale: ten runs of one job, each checked by the tests.

**Point here:** How much freedom an agent has is a setting in our own code. Raise it one step at a time, when evals on your own cases support it, and take it back when errors rise.

**Common misconception:** That the model decides how much freedom it has, or that freedom is decided once, at launch. The list is in our code, and it is a setting you revisit as the evals, the model and the stakes change.

**Notebook:** The setting is the function needs_approval in notebook 1.6, the one Part 4 showed. Start on the bottom step even if the agent could already work alone: a person stops every wrong request, so you learn its error rate on your real cases at no risk.

**Transition:** On every step, someone pays for the model and for the checking. Which costs more?

**Source:** The middle step is SAFE_COMMANDS and needs_approval in the notebook, section 1.6.

## cost: What did the bug fix cost?

**Build 1:** The bug fix took seven rounds. Gemma 4 ran on a laptop, so we paid nothing per token. What would a hosted model charge?

- Ask: Guess: what would the same run cost on a hosted model?
- Expected: Take three guesses before the click.

**Build 2:** Less than a rupee. Hosted models charge per million tokens, read and written.

- Ask: Is that the whole cost of the task?
- Expected: No. Someone still has to check the result.

**Point here:** One run of our agent costs less than a rupee in model time, even at a hosted price.

**Common misconception:** That agents are as cheap as a chat. Agents typically use about four times more tokens than chat interactions (Anthropic, Jun 2025). Every round rereads the whole conversation.

**Notebook:** A run on your own machine is not free either: someone bought the laptop. But there is no bill per token, and no file leaves the machine.

**Transition:** Now add the person who checks the result.

**Source:** Our recorded run (Gemma 4 (12B), 24 November 2026). Hosted price: Gemini 3.8 Flash, $0.75 and $3.75 per million tokens read and written, at ₹93.5 to the dollar (checked 19 November 2026).

## cost-person: Now add the person who checks it

**Build 1:** A colleague spends five minutes checking the result, at ₹1,000 an hour. The model is now 0.8% of the cost.

- Ask: What does five minutes of a colleague’s time cost your organisation?
- Expected: At ₹1,000 an hour, five minutes is about ₹83. With overheads it is more.

**Build 2:** Even a run of 30 rounds costs less than the check. So the saving is in making results quick to check.

- Ask: Where should you spend effort to make an agent cheaper?
- Expected: On making the check quick: tests, totals that reconcile, a short list of what changed. That is what we did in Part 1. A cheaper model matters far less.

**Point here:** For a run like ours the model costs very little and a person’s check costs far more, so results that are quick to check save the most.

**Common misconception:** That the hosted price will stay where it is. From 1 January 2027, Gemini 3.8 Flash costs $1.50 and $7.50 per million tokens read and written, twice today’s price. Even then, a 30-round run costs less than the five-minute check.

**Notebook:** Drag the rounds slider: each round rereads everything before it, so the cost grows faster than the rounds. Drag the checking time down to one minute, and the two bars come closer.

**Transition:** If checking is where the cost is, the people around the agent matter. What changes for them?

**Source:** Tokens: our recorded run; for other lengths, each round rereads all before it, fitted to that run. Price: Gemini 3.8 Flash, checked 19 November 2026. Minutes and hourly cost: the speaker’s assumptions.

## skills: What changes for a team?

**Build 1:** Someone on the team does these three jobs. Today we did all three, for one small agent.

- Ask: Who in your team already does work like this for other software?
- Expected: Testers, analysts who write specifications, whoever reviews code or audits a process. These skills carry over.

**Point here:** Adopting an agent mostly changes the work around the model: people describe the task and check the results.

**Common misconception:** That agents remove the need for expertise. Experts write the instructions and the evals, and check the cases the agent gets wrong.

**Transition:** What happens to projects that skip this work?

## cancel: What does Gartner predict for agent projects?

**Build 1:** Gartner, a research firm, made this prediction about companies’ agent projects, and gave three reasons. What would you guess?

- Ask: Why would a company cancel an agent project?
- Expected: Cost, no clear benefit, and risk. Collect a few before the click.

**Build 2:** Each of Gartner’s three reasons, in its own words, matches a question from this part.

- Ask: Which of these would end a project in your organisation?
- Expected: Usually unclear value: an agent built where a workflow would do. The first question of this part catches it.

**Point here:** Each reason Gartner gives has an answer in this part: count the cost, ask whether the task needs an agent, and raise freedom in steps.

**Common misconception:** That a prediction is a measurement. This is Gartner’s forecast of what will happen by the end of 2027.

**Notebook:** Gartner’s full sentence: the projects will be canceled “due to escalating costs, unclear business value or inadequate risk controls”.

**Transition:** That is the talk. One thing to run yourself, after today.

**Source:** Gartner press release, Jun 2025. A prediction.

## nb-own-task: In the notebook

**Build 1:** After the talk, section 5.1 is yours. Change one sentence, and the same agent does a different job.

- Ask: Which task from your own week would you type here?
- Expected: A report to draft, a folder to sort, a file to check against another. Ask of each one: how would I check the result?

**Point here:** A new job for this agent is one new sentence. Deciding how to check the result is the real work.

**Notebook:** Notebook 5.1, after the talk or now if there is time. The cell first makes a fresh copy of the project, so nothing from earlier runs is left over. There is no recorded run of this section. Section 5.2, Write your own tool, comes straight after it: a function, a description and @tool above it give the agent a fifth tool, today’s date, which no model knows on its own. The appendix shows the same idea as an MCP server.

**Transition:** Part 5 in one slide.

**Source:** Next in the notebook: 5.2 Write your own tool.

## recap-5: Part 5 in one slide

**Build 1:** Next: the talk in one slide, and three things to try on Monday.

- Ask: Which three lines of this card did Part 5 fill in?
- Expected: The model (the smallest that passes the evals), the guardrails (which requests wait for a person) and the person (who reviews before anything is merged).

**Point here:** Every decision of this part lands on the agent card: the model, the guardrails and the person.

**Transition:** To close: the talk in one slide.

## summary: The whole talk, on one loop

**Build 1:** Part 1: the model writes a request and our code runs the tool, again and again, until the model stops asking.

- Ask: Who runs the tool: the model, or our code?
- Expected: Our code. The model only writes the request.

**Build 2:** Part 2: each round the model rereads the whole conversation, which only grows. To remember across runs, it writes notes to a file.

- Ask: What does the model remember from one run to the next?
- Expected: Nothing, unless something was written to a file that the next run reads.

**Build 3:** Part 3: the same loop, given a new goal, tidied a folder and checked invoices. Real products run this loop too.

- Ask: What did we change between the three jobs?
- Expected: Only the sentence that states the goal. The tools and the loop stayed the same.

**Build 4:** Part 4: a file carried hidden instructions, so a person approves risky requests. A step limit ends long runs. Evals count how often it works.

- Ask: Which of these two guards would your first agent need?
- Expected: Both. The step limit always; the approval before anything that cannot be undone.

**Build 5:** Part 5: if the steps are fixed, write a workflow. Otherwise give an agent freedom in steps, and count the person who checks.

- Ask: Which box costs the most?
- Expected: The last one: a person’s time to check the answer costs far more than the model.

**Point here:** The whole talk sits on the loop from Part 1.

**Transition:** So what can you do on Monday?

## monday: Three things to try on Monday

**Build 1:** First, run the notebook. Every run you saw today came from it, on an open model, with no key and no bill.

- Ask: Who has a laptop open? Scan the code and run the first cell now.
- Expected: A few will open it. Promise help after the session.

**Build 2:** Then change one sentence in section 5.1, and give the agent a task from your own work.

- Ask: Which task from your week would you type in?
- Expected: Reconciliations, weekly reports, sorting a shared folder, checking one document against another.

**Build 3:** But before you run it, write down how you will check the result. Those checks are your first evals.

- Ask: For that task, what would a correct result look like?
- Expected: A total that matches, a test that passes, a list with nothing missing. If nobody can say, the task is not ready for an agent.

**Point here:** Three next steps, none of which needs a budget: run the notebook, give the agent your own task, and write the checks first.

**Transition:** Thank you.

## thanks: Thank you. Questions?

**Build 1:** Thank you for your time. What would you like to ask?

- Ask: Which job in your own team would you like to talk through?
- Expected: Common asks: HR screening, legal contracts, sales outreach, manufacturing quality. Run each through the three questions of Part 5.

**Point here:** Close, and open the floor.

**Source:** Nipun Batra, IIT Gandhinagar · nipunbatra.github.io

## glossary: Glossary: the agent (optional)

**Build 1:** The four words of Part 1.

- Ask: Which of these four did we write ourselves today?
- Expected: The tools and the loop. The model we downloaded, and the tool calls are what it wrote.

**Point here:** The vocabulary of the talk, a few words per term.

## glossary-2: Glossary: one run (optional)

**Build 1:** The four words of Part 2.

- Ask: Which of these grows during a run?
- Expected: The context: every result is added to it, and the model rereads all of it each round. The notes are the only one that lasts after the run.

**Point here:** The vocabulary of the talk, a few words per term.

## glossary-3: Glossary: keeping it safe (optional)

**Build 1:** The words of Part 4.

- Ask: Which of these does your organisation already have a policy for?
- Expected: Usually approvals, for people. Guardrails and evals for agents are where to start.

**Point here:** The vocabulary of the talk, a few words per term.

## mcp-server: MCP publishes a tool once, for any agent (optional)

**Build 1:** This is read_file from Part 1, published as an MCP server. Any agent that supports MCP can now call it.

- Ask: What changes for the model when the tool moves behind MCP?
- Expected: Nothing. It still reads a name, a description and the arguments, and still writes a request. What changes is who can use the tool: any agent, with no new code.

**Point here:** MCP, the Model Context Protocol, is a shared standard for offering tools to agents. A server is about as short as the tool itself.

**Common misconception:** That MCP makes a tool safe. It only publishes it. Which requests run, and which wait for a person, is still decided in the agent’s loop.

**Source:** Model Context Protocol: modelcontextprotocol.io. Python SDK: pip install mcp.

## further: Further reading (optional)

**Build 1:** Five things to read next.

- Ask: Which one would you read first?
- Expected: Building effective agents for anyone building one; the lethal trifecta for anyone who lets an agent near private data.

**Point here:** Where to go next.

## app-documents: Invoices at scale: mostly a workflow (optional)

**Build 1:** Our agent sent every invoice to the model. At scale, plain code can do most of these steps.

- Ask: Which of these steps needs a model to decide anything?
- Expected: Only the third. The others are the same every time: read, look up, compare. That is a workflow.

**Build 2:** Rules pass the invoices that match. The rest need judgement: the model’s first, then a person’s.

- Ask: What would it cost to send every invoice through the model?
- Expected: Model time on every invoice, and a small chance of a slip on each one. Rules are cheaper and do not slip. The model earns its cost on the exceptions.

**Point here:** Most invoice processing is a fixed workflow. A model is needed only for the invoices that do not match. On the stakes map at the end of Part 3: “Agent acts, a person approves” (rules can check the match, but money moves, so a person approves the payment).

**Common misconception:** That “AI invoice processing” means an agent reads every invoice and decides. Usually plain rules do the matching, and the model reads only what the rules cannot settle.

**Transition:** Next in the appendix: an IT incident at night.

**Source:** The steps are a design for this talk; they describe no deployed system. The count is from the invoices folder of notebook 3.2. Illustration: generated.

## app-incident: IT incidents: one approval, before the rollback (optional)

**Build 1:** Errors jump. The agent reads the alert, the logs and the metrics, and finds the deploy behind them.

- Ask: At 2 a.m., would you let it roll back on its own?
- Expected: Most say no: a wrong rollback is a second outage. Waking someone to approve one prepared step is the usual compromise.

**Build 2:** A rollback changes production, so the engineer on call approves it. The metrics show if it worked.

- Ask: What makes that approval quick?
- Expected: The agent has done the reading: the jump in errors, the deploy behind it, and the exact command. The person only judges.

**Point here:** An incident agent does the reading and leaves one decision for a person: the rollback. On the stakes map at the end of Part 3: “Agent acts, a person approves” (metrics show whether a fix worked; a wrong rollback is an outage).

**Common misconception:** That the risky part is the diagnosis. Reading logs is harmless. The rollback changes production, so that is where the approval goes.

**Transition:** Next in the appendix: a job done in a browser.

**Source:** The steps are a design for this talk; they describe no deployed system. Illustration: generated.

## app-browser: Web forms: it stops before it pays (optional)

**Build 1:** A browser agent uses a website the way you do: it reads the screen, clicks and types.

- Ask: Where must it stop and ask you?
- Expected: Before paying and submitting. Both are final and in your name; everything before them can be redone.

**Build 2:** On this public test the best model now scores above people. It still stops before it pays.

- Ask: If the best models now beat people on this test, why still confirm?
- Expected: The test averages over tidy tasks. The best single model scores 85.96% on OSWorld-Verified, above the 72.36% people scored in the original study (where the best model then scored 12.24%; an agent framework now scores 90.19%). Real portals have timeouts and unusual forms, and one wrong submission is yours to fix.

**Point here:** A browser agent can fill any web form a person can, so the final, paying click stays with a person. On the stakes map at the end of Part 3: “Agent acts, a person approves” (the form can be read before it is submitted; a submission is final).

**Common misconception:** That beating the people’s score makes it safe to let it submit. The score is an average; your portal has timeouts, odd forms and a fee you cannot get back.

**Transition:** Next in the appendix: two jobs from science.

**Source:** The steps are a design for this talk; they describe no deployed system. OSWorld: Xie et al. (2024), and the OSWorld-Verified leaderboard (Aug 2026). Illustration: generated.

## app-coscientist: Google’s AI co-scientist: agents propose, a lab tests (optional)

**Build 1:** Several agents share one research goal. They generate ideas, argue about them and rank them.

- Ask: How would you check whether a new hypothesis is any good?
- Expected: Only an experiment can tell. Until then an idea costs nothing, which is why the agents can afford to generate many.

**Build 2:** The scientists see only the top ideas. Only a lab experiment can tell which one is right.

- Ask: Where are the checks in this loop?
- Expected: Twice: the agents’ own debate and ranking, which cost little and can be wrong; then the scientists’ lab experiments, which are slower and test the idea directly.

**Point here:** Agents can generate and filter ideas cheaply; checking them still takes a scientist and a lab.

**Common misconception:** That the co-scientist discovered something unknown. It reached, on its own, a result a team at Imperial College London had found but not yet published; the experiments were theirs.

**Transition:** What if the agent could run the experiment too?

**Source:** Google Research blog, 19 Feb 2025 (built on Gemini 2.0); the two days are from Google’s paper, arXiv 2502.18864. The steps are simplified; it also searches the literature. Illustration: generated.

## app-lab: A lab robot: the model writes the experiment (optional)

**Build 1:** The model gets a chemistry goal and the robot’s manual. It plans the reaction and writes the code.

- Ask: What would worry you about letting a model drive lab equipment?
- Expected: Safety and cost: wrong reagents, wasted materials, a damaged instrument. The robot does exactly what the code says.

**Build 2:** A chemist approves before any reagents are used. Instruments then measure the result.

- Ask: Why put the approval there, and not at the end?
- Expected: Measuring is cheap and automatic; spending reagents is not. Approve before the costly step, then let the instruments check the result.

**Point here:** When instruments measure every result, an agent can run the experiment; a person approves before materials are spent.

**Common misconception:** That these systems replace the lab team. FutureHouse’s Robin proposed ripasudil as a drug candidate for dry age-related macular degeneration, a common cause of lost sight in old age; people ran the cell experiments.

**Transition:** Back to the main route.

**Source:** Coscientist: Boiko, MacKnight, Kline and Gomes, Nature, 20 Dec 2023. Robin: FutureHouse, 20 May 2025. The approval step is our addition. Illustration: generated.
