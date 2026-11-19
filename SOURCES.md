# Sources

Every published number in the talk, with its source. Checked on 19 November 2026; the full table, with quotes and the
status of each check, is in `plan/research/verified.md`. Where only a secondary source could be read, the slide's
source line says "reported by".

## Real agent runs (recorded for this talk)

All runs on the slides were recorded on 19 Nov 2026 by running `notebook/agents.ipynb` with Gemini through the Gemini
API (`gemini-flash-latest`, which ran **Gemini 3.8 Flash** that day, and `gemini-flash-lite-latest`, which ran **Gemini
3.5 Flash-Lite**). The raw recordings are in `data/traces/`; `scripts/sci/traces.py` condenses them into
`data/traces.json` and checks what the slides say about them.

- Air-quality forecasts: CAMS (Copernicus Atmosphere Monitoring Service) via the Open-Meteo air-quality API,
  https://open-meteo.com/en/docs/air-quality-api (CC BY 4.0).
- Weather forecast for Mehsana: Open-Meteo forecast API, https://open-meteo.com/en/docs.
- The ten-city PM2.5 table (Jan 2025 to Oct 2026): CAMS estimates via Open-Meteo, built by
  `scripts/sci/make_aq_csv.py`. Model estimates, not station readings.
- Wikipedia (research agent): https://en.wikipedia.org (CC BY-SA 4.0).
- Prices for the cost figures: Gemini API pricing page (now at https://ai.google.dev/gemini-api/docs/pricing, which
  redirects to AI Studio), 19 Nov 2026: Gemini 3.8 Flash $0.75 per 1M input tokens and $3.75 per 1M output tokens
  (rising to $1.50 and $7.50 on 1 Jan 2027); Gemini 3.5 Flash-Lite $0.30 and $2.50. Both have a free tier.
- Exchange rate: ₹93.5 per US dollar (open.er-api.com, 19 Nov 2026).

## Opening

- METR, "Measuring AI Ability to Complete Long Tasks" (19 Mar 2025),
  https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/ ; Time Horizon 1.1 (29 Jan 2026),
  https://metr.org/blog/2026-01-29-time-horizon-1-1/ ; data https://metr.org/assets/benchmark_results_1_1.yaml
  (saved in `plan/sources/`), page https://metr.org/time-horizons/ . Doubling time since 2023: 128.7 days.
- Timeline: ReAct, https://arxiv.org/abs/2210.03629 (6 Oct 2022); ChatGPT, https://openai.com/index/chatgpt/
  (30 Nov 2022); function calling, https://openai.com/index/function-calling-and-other-api-updates/ (13 Jun 2023);
  computer use, https://www.anthropic.com/news/3-5-models-and-computer-use (22 Oct 2024); Model Context Protocol,
  https://www.anthropic.com/news/model-context-protocol (25 Nov 2024); deep research,
  https://openai.com/index/introducing-deep-research/ (2 Feb 2025); Claude Code,
  https://www.anthropic.com/news/claude-3-7-sonnet (24 Feb 2025); ChatGPT agent,
  https://openai.com/index/introducing-chatgpt-agent/ (17 Jul 2025); MCP to the Agentic AI Foundation,
  https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation
  (9 Dec 2025).

## Part 1 and 2

- Workflows and agents, and the five patterns: Anthropic, "Building effective agents" (19 Dec 2024),
  https://www.anthropic.com/engineering/building-effective-agents
- Levels of autonomy (operator, collaborator, consultant, approver, observer): Feng, McDonald and Zhang, "Levels of
  Autonomy for AI Agents" (2025), https://arxiv.org/abs/2506.12469
- Multi-agent research system (about 4 times the tokens of chat for an agent, about 15 times for a multi-agent system;
  90.2% better than a single agent on Anthropic's research eval): https://www.anthropic.com/engineering/multi-agent-research-system
  (13 Jun 2025).
- "Context engineering" as described by Andrej Karpathy (25 Jun 2025), reported by Simon Willison,
  https://simonwillison.net/2025/Jun/27/context-engineering/

## Part 3

- SWE-bench Verified: https://openai.com/index/introducing-swe-bench-verified/ (13 Aug 2024; GPT-4o 33.2%); Claude Opus
  4.5 reported 80.9% (Nov 2025); OpenAI's "Why SWE-bench Verified no longer measures frontier coding capabilities"
  (23 Feb 2026), https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/
- Stack Overflow Developer Survey 2025, AI section: https://survey.stackoverflow.co/2025/ai
- Klarna AI assistant (27 Feb 2024): https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/ ;
  May 2025 interview (Bloomberg, 8 May 2025), reported by Entrepreneur and PYMNTS.
- OSWorld: https://arxiv.org/abs/2404.07972 (people 72.36%, best model 12.24% in 2024); leaderboard https://os-world.github.io/
- Google AI co-scientist (19 Feb 2025): https://research.google/blog/accelerating-scientific-breakthroughs-with-an-ai-co-scientist/ ;
  paper https://arxiv.org/abs/2502.18864
- Coscientist, Nature 624, 570 to 578 (20 Dec 2023): https://www.nature.com/articles/s41586-023-06792-0
- FutureHouse Robin (20 May 2025): https://www.futurehouse.org/research-announcements/demonstrating-end-to-end-scientific-discovery-with-robin-a-multi-agent-system
- AlphaEvolve (14 May 2025): https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
- Kisan e-Mitra: PIB backgrounder (Sep 2025), https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/sep/doc202594627701.pdf
- Digital Green Farmer.Chat: https://www.digitalgreen.org/about ; https://www.digitalgreen.org/insights/v2-launch-performance
- The Permanente Medical Group ambient AI scribes (NEJM Catalyst 2025, DOI 10.1056/CAT.25.0040), via
  https://divisionofresearch.kaiserpermanente.org/ai-assisted-notetaking-gains-steady-support-from-kaiser-permanente-physicians/

## Part 4 and 5

- Replit production database deletion (Jul 2025), reported by The Register,
  https://www.theregister.com/2025/07/22/replit_saastr_response/
- Moffatt v. Air Canada, 2024 BCCRT 149 (14 Feb 2024), https://www.canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html ;
  reported by https://barrysookman.com/2024/02/16/moffatt-v-air-canada-a-misrepresentation-by-an-ai-chatbot/
- EchoLeak, CVE-2025-32711 (11 Jun 2025): https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-32711
- GitHub MCP prompt injection (26 May 2025): https://invariantlabs.ai/blog/mcp-github-vulnerability
- Perplexity Comet prompt injection (20 Aug 2025): https://brave.com/blog/comet-prompt-injection/
- The lethal trifecta (16 Jun 2025): https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Gartner on agentic AI projects (25 Jun 2025): https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
- Anthropic Economic Index (15 Sep 2025): https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

## Illustrations

The part-opening and application illustrations in `figures/part-*.jpg` and `figures/app-*.jpg` were generated with
Google's Gemini image model (`gemini-3-pro-image`) from the prompts in `plan/images.json` (`scripts/make_images.py`).
They are pictures, not evidence.
