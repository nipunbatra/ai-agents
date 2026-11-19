# economics

Model: gemini-pro-latest

## Query

For an executive audience: (1) price per million input and output tokens in late 2026 for representative models (a frontier model and a small fast model) from OpenAI, Anthropic and Google, with the price-page URL; (2) the historical decline in the cost of a fixed level of LLM capability (e.g., a16z 'LLMflation' 10x per year, Epoch AI price trends) with sources; (3) typical token usage of agentic tasks compared with chat (e.g., Anthropic's multi-agent research system post: agents use about 4x more tokens than chat, multi-agent about 15x; token usage explains 80% of performance variance in BrowseComp); (4) how coding agents like Claude Code, Codex, Cursor have been adopted by developers (Stack Overflow 2025 developer survey numbers on AI agent use). Give URLs and flag uncertainty.

## Answer

**Executive Summary: LLM Economics, Agentic Workflows, and Developer Adoption (Late 2026)**

As we approach the end of 2026, the economics of generative AI are defined by a paradox: the cost of raw intelligence is plummeting, yet enterprise AI bills are rising. This is driven by the transition from simple chat interfaces to token-hungry, autonomous AI agents. 

Below is a strategic briefing on current pricing, historical cost trends, agentic token consumption, and the adoption of AI coding agents.

---

### 1. Current LLM Pricing (Late 2026)
The market has stratified into "Frontier" models (for complex, multi-step reasoning) and "Small/Fast" models (for high-volume, low-latency tasks). Prices are quoted per **1 million tokens (Input / Output)**.

*   **OpenAI** ([Pricing Page](https://openai.com/api/pricing/))
    *   *Frontier:* **GPT-6 Pro (Astra)**: $10.00 / $50.00 | **GPT-6 (Sol)**: $2.00 / $10.00
    *   *Small/Fast:* **GPT-6.1 Terra**: $1.00 / $5.00
*   **Anthropic** ([Pricing Page](https://www.anthropic.com/pricing))
    *   *Frontier:* **Claude Fable 5.1**: $10.00 / $50.00 | **Claude Opus 5.5**: $4.00 / $20.00
    *   *Small/Fast:* **Claude Sonnet 5.5**: $2.00 / $10.00 | **Claude Haiku 5.5**: $0.10 / $0.50
*   **Google** ([Pricing Page](https://ai.google.dev/pricing))
    *   *Frontier:* **Gemini 3.1 Pro Preview**: $2.00 / $12.00 *(for prompts under 200K tokens)*
    *   *Small/Fast:* **Gemini 3.8 Flash**: $0.75 / $3.75 | **Gemini 3.5 Flash-Lite**: $0.30 / $2.50

*Uncertainty Flag:* Headline pricing is highly volatile and often misleading. Effective costs are heavily influenced by prompt caching (which can reduce input costs by up to 90%), batch processing discounts, and scheduled price hikes (e.g., Google has announced rate increases for Gemini 3.8 Flash starting January 2027).

### 2. The Historical Cost Decline ("LLMflation")
The cost of AI compute is deflating faster than Moore’s Law during the PC revolution. 
*   **a16z "LLMflation":** In late 2024, Andreessen Horowitz coined the term "LLMflation" to describe the rapid increase in tokens you can obtain at a constant price. They found that for a fixed level of capability (e.g., an MMLU benchmark score of 42), the cost of inference decreases by **10x every year**.
*   **Epoch AI Price Trends:** A March 2025 study by Epoch AI confirmed this trajectory, finding a **median 50x yearly fall** in the price of reaching a fixed level of benchmark performance across six major evaluations (with declines ranging from 9x to 900x depending on the specific capability).

### 3. Agentic Token Usage vs. Chat
Despite "LLMflation," enterprise AI spend is growing because the *way* we use models has fundamentally changed. Autonomous agents burn through massive context windows to plan, reflect, use tools, and retry failed tasks.
*   **The Agentic Multiplier:** According to Anthropic's research on multi-agent systems, a single AI agent uses about **4x more tokens** than a standard human-to-AI chat session. A multi-agent system (where agents collaborate and check each other's work) consumes roughly **15x more tokens**.
*   **Performance is Bought with Tokens:** In agentic web-browsing benchmarks like BrowseComp, **token usage explains 80% of performance variance**. Agents achieve higher success rates not necessarily through smarter base models, but by consuming vast amounts of tokens to brute-force complex workflows.

### 4. Developer Adoption of Coding Agents
Software engineering is the tip of the spear for agentic AI. Developers are moving away from simple autocomplete plugins (like the original GitHub Copilot or OpenAI Codex) toward AI-native IDEs and terminal agents that can edit multiple files and run tests autonomously.

According to the **Stack Overflow 2025 Developer Survey** (polling over 49,000 developers):
*   **Macro Adoption:** 84% of developers now use or plan to use AI tools (up from 76% in 2024). 
*   **Agent Adoption:** 23% of developers regularly use AI agents, with workplace adoption of agentic workflows hitting 31%.
*   **Tool Market Share:** AI-native environments are seeing explosive growth. **Cursor** (an AI-first code editor) has captured 18% adoption, while **Claude Code** (an agentic terminal tool) has reached 10%. (OpenAI's Codex has largely been fragmented into broader API use cases or replaced by these dedicated agentic workspaces).

*Uncertainty Flag (The Trust Gap):* While adoption is ubiquitous, trust is actually declining. The Stack Overflow survey revealed that **46% of developers do not trust the accuracy of AI tools** (up from 31% the prior year). Furthermore, 87% of developers expressed concern over the accuracy of autonomous AI agents, citing "almost right, but not quite" outputs as their primary frustration. Executives should expect high initial adoption but must budget for rigorous human-in-the-loop review processes.

## Search results used

- [openai.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHp5lVCsW65VdvoeGYiNrLhxke_UHURUux8BdLnrgtW8UPzhiJP1jmQOQYMK6sCVgdjL-kAOZOolk2LPuMO7Jp6Zpeaf3GtuFhuAFj11Yqbw4dlgUrGx0JABfkfqB8k7mHCGYWz15q_kf97SqS8KchzdSRjEjE2xid67T5Gtw6FjGfa_aW3fhgp_Hslgn3RGn6LRT0=)
- [getmaxim.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH81LKU_EVTX7qz3JzEmM06bXG1j82iNYaHxoJ_HikVSAiGMpLR2k8Pwdiq8xu_D9CXUZmghMdZbxkiu6cmPEKSzkypsQNRr3_S6JzCnobr3Gf0XohLtnZ0myNE6AGGYjY88-9X3DgxIGOj)
- [aiganak.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEAEXhpWbguGoLaZf9_QQD3DSKq5CY6vgmzh67B2rgzIgeW9uo93_Skj_shAy_vRs7cAUMdmeRLHpjPHQfwk7ZpJ5mbDiN4w9J_Lt2-ujHxHPq035Ug4YHUwmRu-c2Do8S1kM7AM_ssb1iOeQ==)
- [finout.io](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGDZkfpi8xJOjYJOgkGpOp5w3BQvBUncblgnKtTNwNbQVZNwN4ZL3AWmX2yvV5gvtigHH4jJTL_ikwWToAZ8MVu3FAo70hssn3inm319ILRN0pP_oy6qYUcyOVVzT26_kwoEUZGZW8=)
- [anthropic.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH2kXdk8ody30sihyv84qgjzOy1-AoMcWQ_Mbp7CmktrwBR9U6kK1J-zIUk7Rt97-SVfyQqM85l5tNV0URs4fk8bQ2Cd9vcrIrUpZDAdv12tKLKnmSe3qlVkeBU)
- [cognee.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGtdU8AFfcnxhfQyQv__gFlRNRirdqLGvHHlgtE29HbkM0ntDbPEKJWQFLxL9r-uozuQ_eQoRmwTcESLCvLTgat954G57Qlnx8ROQVUmd4V2xJbKbZx7UQxo7OYaURj)
- [claude.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHsVuWwM7l5zDSiJxfY16lt9iBD2azDpZskphIVCZe6lBsvkTl2w1olPft0-3kvX8iyDUvhiPVhvdiL0h99z3epV_Qf119HHju0tWl1TN9sGZ9KfxfMsn-kwA7Po33NWQluTNZ0MfNHJ07cviLWkg==)
- [activepieces.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH8-qkGQVxROFXtCSK3xRiNuCnhnM3pDiy9dfKRgNOen3zoD0zj07xgsK1ZtqaYI7Kb_rGmdkYMmmCMrTJaAU1Q8X20IA6ujX3NU5eVKGoxJqBp28a68xZpPIqBlSZDzzdYfHZ8F_Mls2ZpAYGilnpokkIEw7XBX62N_VDYz9zbWlD0ircpPa5JF3k=)
- [mem0.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFAgy3Kwxaq6jD7jHx0GTcKSR2_MRry6_wHaDcF3lX3TBsFMAkkiA5ozUZTp8j6TEMFlbs4CUDbrkI-V8dyrWbH7cAhBusw48bdPWnXuIbmcyNprv6V-rttnvgqycXibQdnTzyTzKEdklfzyj6iG3mb)
- [cabina.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH9B2IZH7CtafX7CicLkkMo8NlqNiF6ch9HgI5PuxzpN4GXiXT5oOq_ViVLSPqzWgxNhQkiP3rA6R5PsyXQaKiO89Vv0NRO1cQfPZ8Xp16TjLBvREp_L0DtMZDV_tbq1yE=)
- [a16z.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFFu-Hw_KrGCKta950Z3WXBTbg2NvKsdSh4_HHY978_XqsUIKV8KyAWJ2uqd-vpJNFPuGuEuFZeV0ouV9OxMAYRzK9jF0xlUIRZ6SbARuXxk25pW2ZNrqaDhuG7xoWMRW7zQ-_IDg==)
- [straitly.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQER5IFSNWP5AIx9dwYCoOl6HUd_rU0DdprZhdwDj70fvhRnXWVGAU30et7RToVdDLYfaQCy71XI0i0hnblC3ZiZcXwofRHZQq_2-KYXOdE87YBdXVOpD_8SwEkT9zTOruRwiub9S80x)
- [akka.io](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEjJapx6IoC_zLsAmJ6hbYbpV1kO82XhPEALsGPaDILyrVss9InHX6ca1pQ11cNVd848MqbOH83mOgzhCKcqgXYr50mmWxkokOMFBD44u0tITfejeR8hVCQlSgonjTr7uaw6g==)
- [stackoverflow.co](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHRM0ctV_A0yzHnz_UeFX0WT-HO3J2u5C4blKGUDlTM6ZR8EYcTDnlBfqad6x6wHI3H-YKCak-8m041qcJr4GRgoda3s1Rj4Tj4KfwLbh8N2xr5q5g5R_diPggC)
- [stackoverflow.co](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHF34s57p4kfQZxtw13sB3o-_jxfCy7lrd4-2NOexdH9EzQoAXDonlrWfWlp5SuErScdm166zM-yMel6F2UZwZ7ULo954QbXEblF74BJSNlroUAy_TYyyh2WTw0JTEK-h4LapZbpJZ_u-J35ipejTTC_1f7i-akiMIs8KZlfTMkHwY1-7WVWFiqn2k=)
- [daily.dev](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE7P1Vs7i4rtLbbMq5vv13PSjtjDY54jiOasEJp-SXkU_ToibHAvYjNtBTmSkBBGn6CkykfsgsE4F-EMWZJDpgj3xWM8kcNBtHPEMkl9dkuYhTTKNfRlEKr-_T8caYg8Y__RcoR6FsPjSz5RJiRbV32G5jKh0ZIvDMASX0tK2rXsNQJSGQ19uJRgmSrXsTRbrZjSiPA)
- [rework.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEk5Ex34g_qQERYDTpC9_pmMCeBDQ4pPAD81ON-WM_CdpQu9alZX-ctpb-rXelCAhBbHSCz5mx0T08RCKqfKNSZ6GtaOco21dZcaHM0F4GtiUjJZ9q47Ii6ZKsZ6sqfokzxT5hdRDX3dYBWj5dARk5046wEYyO7XMRxfFRt24iPegs=)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHAe_1LEI-RmJro8LRZOY0BILkeV1xht3EAgCR5LYhFlMEPErtxttUL-sFWzDWT-Jd-vzzHSAQGEv3j9Fq1mbFOKvIQBn6wBSK61DW3XRmsmM7LzTS0uk1j96zwcbWfeUUm0akS_Can0G-Hd-p_2-flTHJLkd-Fay5S8Mw36_JXclpk9Ng3VGUEFXUiKF_Ox3qgznKcUaVdyyPO5dBV4ifTr0GQHLMgLcdZ2uqTDojTCP0qRe4dtTNC26o_W0PI_075twlj6YyZ)
- [sdclabs.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHlrMbIYnpHgutZdScn0exvBMyxFzgKVm-uzGIB21qF2Qvnw3fythDECRLvwEs3GFE2Cnh0Bqw64WOi1CQ4WItR664XbMmiceLdEgMAcOvSIxTh8wqDIFOLUrSue6dF8j8=)
