# concepts

Model: gemini-pro-latest

## Query

Definitions with sources: (1) Anthropic 'Building effective agents' (Dec 2024): the definition of workflows versus agents and the five workflow patterns (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer), with one-line descriptions as written; (2) levels of autonomy for AI agents, e.g. Feng, McDonald and Zhang 'Levels of Autonomy for AI Agents' (Knight First Amendment Institute, 2025): the five levels and user roles (operator, collaborator, consultant, approver, observer); also any SAE-style level frameworks for agents; (3) 'context engineering' (who coined/popularised it, June 2025: Tobi Lutke, Andrej Karpathy quotes); (4) Model Context Protocol: what it standardises (tools, resources, prompts), adoption numbers (number of servers, which companies adopted: OpenAI March 2025, Google, Microsoft); (5) AGENTS.md and Anthropic Agent Skills; (6) Karpathy's 'autonomy slider' idea from his June 2025 YC talk 'Software Is Changing (Again)'. Exact wording where possible, with URLs.

## Answer

Here are the definitions, sources, and exact details for the six AI and agentic concepts you requested, reflecting the state of the industry through 2026:

### 1. Anthropic's "Building effective agents" (Dec 2024)
In their December 2024 guide, Anthropic drew a strict architectural distinction between workflows and agents:
*   **Workflows** are systems where LLMs and tools are orchestrated through predefined code paths.
*   **Agents** are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.

Anthropic outlined **five workflow patterns** to build these systems, described as follows:
1.  **Prompt chaining:** Breaks tasks into sequential subtasks, with validation gates between steps.
2.  **Routing:** Routes inputs to specialized prompts or tools based on the task.
3.  **Parallelization:** Running multiple LLM calls simultaneously (either sectioning a task or running multiple variations).
4.  **Orchestrator-workers:** A central LLM orchestrator breaks down a task and delegates to worker LLMs.
5.  **Evaluator-optimizer:** One LLM generates a response, and another evaluates and provides feedback in a loop.
*(Source: [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents))*

### 2. Levels of Autonomy for AI Agents (2025)
The most widely cited framework is **"Levels of Autonomy for AI Agents"** by K. J. Kevin Feng, David W. McDonald, and Amy X. Zhang, published by the Knight First Amendment Institute in July 2025 (and arXiv in June 2025). Their core argument is that an agent's autonomy is a deliberate design decision, separate from its underlying capability. 

They define five levels based on the user's role:
*   **Level 1 (Operator):** The user drives most decisions and planning; the AI helps like a copilot but doesn't act without the user.
*   **Level 2 (Collaborator):** The user and the AI work on the job together; the user can edit or take over at any point.
*   **Level 3 (Consultant):** The AI plans and does most of the work, coming to the user for expertise and preferences (steered by feedback).
*   **Level 4 (Approver):** The AI works on its own and only comes to the user when stuck, needs access, or wants sign-off on predefined actions.
*   **Level 5 (Observer):** The AI runs fully on its own. The user can watch and switch it off (via an emergency off-switch) but doesn't steer it.

*SAE-style frameworks:* In addition to the Feng et al. paper, the **Cloud Security Alliance (CSA)** published an *"Agentic AI Autonomy Levels and Control Framework"* in 2026, which maps these escalating levels of autonomy directly to enterprise security risks and required guardrails.

### 3. "Context Engineering" (June 2025)
Context engineering is the practice of curating and maintaining the optimal set of tokens (instructions, retrieved documents, tool definitions, memory) during LLM inference. The term went mainstream in June 2025 via two major tech figures:
*   **Tobi Lütke (CEO of Shopify)** popularized it on June 19, 2025, stating he preferred it over prompt engineering because it *"describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM"*.
*   **Andrej Karpathy** endorsed the term on June 25, 2025, defining it as *"the delicate art and science of filling the context window with just the right information for the next step"*.

### 4. Model Context Protocol (MCP)
Introduced by Anthropic in November 2024 and dubbed the "USB-C for AI," MCP is an open standard that solves the "N×M" integration problem. It standardizes three core primitives:
1.  **Tools:** Executable functions and actions (e.g., querying a database, calling an API).
2.  **Resources:** Data access (e.g., file contents, database records, system configurations).
3.  **Prompts:** Reusable templates and workflows.

**Adoption & Numbers:** 
*   **Companies:** OpenAI adopted MCP deeply into its Responses API in March/April 2025. Google (Gemini Code Assist) and Microsoft (GitHub Copilot, Copilot Studio) followed shortly after. In December 2025, Anthropic donated MCP to the Agentic AI Foundation (under the Linux Foundation).
*   **Scale:** By 2026, there are over 20,000 public MCP servers listed on directories like MCP.so and Glama.ai (with "tens of thousands of community-built MCP servers" in the wild). Local MCP servers see tens of millions of downloads per month (e.g., 67 million downloads in April 2026 alone).

### 5. AGENTS.md and Anthropic Agent Skills
These are two complementary standards for giving AI agents context, both now hosted by the Linux Foundation's Agentic AI Foundation:
*   **AGENTS.md:** A cross-vendor standard file placed in a repository to provide "always-on" project context. It tells any visiting AI agent *"here's how we do things around here"* (e.g., tech stack, code conventions, architecture notes, and files not to touch).
*   **Anthropic Agent Skills (`SKILL.md`):** An open format for giving agents on-demand procedural expertise. A skill is a directory containing a `SKILL.md` file (metadata and instructions) and optional `scripts/`, `references/`, and `assets/` folders. It relies on **progressive disclosure**: the agent loads only the ~100-token metadata at startup, and only reads the full instructions and resources if it decides the skill is relevant to the user's prompt, saving massive amounts of context window space.

### 6. Karpathy's "Autonomy Slider" (June 2025 YC Talk)
In his June 17, 2025 keynote at the Y Combinator AI Startup School titled **"Software Is Changing (Again)"** (often referred to as his Software 3.0 talk), Andrej Karpathy argued against letting AI agents run fully autonomous. Instead, he advocated for a fast "generation-verification loop" where humans keep the AI on a "tight leash". 

To achieve this, he introduced the concept of the **autonomy slider**. 
*   **Exact wording:** *"You are in charge of the autonomy slider. And depending on the complexity of the task at hand, you can tune the amount of autonomy that you're willing to delegate."*
*   **Implementation:** He demonstrated this using Cursor AI's graduated shortcuts as a literal slider: `Tab` completion (minimal assistance) → `Cmd+K` (targeted edits) → `Cmd+L` (file-level planning) → `Cmd+I` (maximum autonomy agent mode). 
*(Source: [YC AI Startup School 2025 Keynote](https://www.youtube.com/watch?v=Egeuql3Lrzg&vl=en) / [Latent Space Writeup](https://www.latent.space/))*

## Search results used

- [anthropic.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHT-UGd0VYjz15-81Qzeg3c6X6wkzxm0F3btfm6daeeRu947L0YS5Uvs-6xKweyyWNZiP9gXpZxDkGtmJb4ilRtih-YfWgxPs10TFnSCOSBuYTj6XL50adrlJGdWS1ESEYcptpWXCK7MHG08VZsnDsc5L4=)
- [huggingface.co](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF1ufG-Ay0lAkOil0rHs9565p4fKlTKAcHXTXJpaPxAsrRyabpmX2ZfeLHBhVs5-SmNxp9eHV9cis6cheM9f-JBma_aL8r8gS3PYMGPexdDClV5P1m7GsAUC4VzTyQcOVqlGzoiw9_ePNJHPuNvBg2pXJcanveKDl06Bk03ZJMpOO98cDlMmvWF6lZlxjWxM2RbeIArZOs=)
- [youtube.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGnWldpY-JKV8GUb_R4kT4zFto17SD0F9Q1cjvBPRcbEs7CzgNpfm9X1NBXg3yRLFokqS2rFg4iyzAqNVnXf_Gom77kRjdnuz84dC37jIJv01chMfF6EDllpXdcOw7iz46T)
- [knightcolumbia.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGSfxxKjQvUgGFDzT9sx1w16g1zFcMDPyVbK5Zy47S_ElIe5QFkTvKkTsnBisSLPw-mC45DCtrG0XUmJfdZ6wntHgVooOOhGp10-RC4NTvM7DLNinuiRVMeEVYMXyDaqhfgDLvwsRIzhEIkIAZmBsKxG23ymJs4fDrnfDE=)
- [aim-consulting.co.uk](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGwaUi1rYbCLl1sYFwB__CVXjHVXoSST1MPuh2PRMIAz_N6oikwtlEpCgSosjt6M5AjVfymhGaA44-2DZK2fgWY7VRm-jHq_Cbl4LBDhDdszW2pSrMyU__xXa5jS1udRHHNXWeGtxLhGkQB-bCdvMjVaup8X0SFecB9guyZ)
- [uxcel.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEJlhv6n45wqawphFc7K3vfij7MGO_-2ou-sYiJZLX4B87hK1upYDppRrv85VUHpDYVmt2dQtjSWDOLX9JNTymFXlcQj9RHfYIqg09Mvm6X3UL1gEAMC4dPZxNtgkSAWxUkpwyicMK0)
- [taskade.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGl91PCIdWsOe9NOeps6nsNKrN0Z4EeLiiLN9wTRnGjCvTlSDWeFcYCrYf96XaxPBCoOWJO5x07E8vJo9DYJszQEWES2yLZBnMwhV5av7U9tLQgP-THexchhRKU696WNB1HnF6G8AR3ax9obzhQiGSUrmo=)
- [masaischool.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFl_HobAgeftcgE6Dgjav30iaWtFzD-BxUJh6SOA7s7r9dgIdqzZKTOMyoZ4VKqA5x9N5w5IwbSPRia7dEH_vLdt0bIbcmGuusEguQdmnam5AKroXevJgL0rSTB1j-vfEkpdku5MTWOVXyw6sBPlE0dbunV)
- [parallel.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFZlWyfnO9DLjCIqALleLSSrQUYdoxBsOTynb1TuIuXf7T1vdhyXE7HYYetAKfEoGaHcAg4v0Jp4WNSxv049pK5Dhs9xL-OMqg1_IID399rdyWiuMzSvBwmiI7LJBmYmohMRXDqiQVKwhr8Da5zGQ==)
- [wikipedia.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGxR-ZvubgKQ8XZqP_mg41KI7MJVbsPdqN5PXrlzPAovM5ePu-g7sx6sIKwRdZX1_hSvBavAQGeJjOXtbCX2Hgp3edk637xyJDpdPLAy5Q4VQ06g4cyW6RnqYjZXFMgMsLlJZmK6-GfMElh)
- [truto.one](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNZZMy3tEWpLgF7nmmmerFQMc9wAPT5XW0oHRCMO_4jM-hw04XY0rNFGwNtaxyhgULJ-_ds1uhTSulVX_fqYGIHoZ9pTWLWP60Myt_dSNFkQ9zqkh9zkM7I0LF7utb8rDPR6cp7RjUM4Aa5NQ4C1BcjQDVf1YbYqnvTJCzscsUJFc5VdB_ckzc3idYRw==)
- [val.id](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE4r7mUhu9bemJy-76aCQwlaBZIOyalCRol9oWoljPwxQPLjFDswmbkhE-CndnGmKz7qDwNnBU7qjIofxr2bqBEnZlkaqD6g8qo-CJAZDJIyndZ)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHLVWKi3FIKw75fYin5cMtmFEu02lIusuhcCrf-voYwtscSPyVGz8nJQQinkeKDAbQtlr6BXQJiyDi4bFYwlWlzudssekTHRL_WDz4QZYKHynttF8vWTcBMeEjmDyOxBiAc2VTxoUU8hePQgL6EMJpPknx67B8rQ-IS-zI2JO08mj0ACY9ija1ao9s8AVQiJJj-mp4ZcCcVouhyZSUPH8cufr9dV_E=)
- [techtarget.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEEzT4YBdIZwiKnqouRw1JVAs-ITO8cmKvYhNCnAud_j9CpkFM2spxGNICE_M3l7UlzrRdES_GyAwZcIHASiaWze8_UDS9NAwWItdrctAfA4o-RxygZXrulsViI-3t7dDIGTOpx1XmsL9VyQX_ZvifJxzON7kLZkTaOfevCIuL5Jzz13wdJStbHv9TmVsEDtI4mOqJn7Z8=)
- [walma.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHTesU70b1qc37nHEfuTj2FjA65maFxRMyKnaiWW-gh7nGFxA3kL4XxTroV2-HLnKvBlxC59WcvJQqmFFH5GmzZf_n-FCQx1n6OlEqtIfvKWbwJaDA=)
- [nordicapis.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG50Ewf_KGCv0gMqfEhM4vo7PXCa9qxGZwDlOp5PU4qMnhS5SRZU47ikJgJodu_r13KInKIz2vSAmkToolgbz7gzSZHg9lT82SbyYkJelDyKPwxtykcJDBzZr26lkBO6nN_27N6oQKYcAMQ)
- [redhat.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFTU256lG7ZpEEXDkHBsr9xeaJ_KPouNWfKjHgda26HOe-uOde28aVtKSPBB00bELGpILZb35r8d7vz4eZvhpHCywGV9fS6r5ycOTC-EWLAvV8Vx9mdI6MDsCn9TYMDhyXRrVxWGy15dE1ks75cgSJqBvkj3rT3QXOi5dOdNCddyPcH8rAgntw=)
- [aiagentslab.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHTp-tLBnUgTYQa9AmeGy6pMLPofD80KStgp3hgjhl62XuQ44zRK0X2yjvGZ2nxIN3H5_nL0qasbOXM48U6y5sOOvzF1VFn3kX5MtCZW6B9etKBBfjSMhTeq-uuA7ux2knUEd4Une99XtIwzjdTEEU7)
- [onlinelearningportal.website](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqntxcjWsumgpXH5NNcmaWD61X0ECgqrbzR1Ac3tJ0CSgnJVFrKgHSWPgszgOPS56oB_PvWLX3n8Sez8O1poG2-xdPBVWeuUEE4tIfE-tl2rQebO3ycX-24yiSNLsStNgl9YPYpvE9wcDoXCzI2SSogK52mZZHNkaR_j0fSU5pUVI=)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEZJT-HCxeXAfYa-bMTO37HeLSQOnncGT6CHyHBjmasaQYT9G_Lc4DdG_YoDORqN69DeQrZrhVaijIXG3a4QClmp0_z2fHIOH7H56DzLIR0pAMpdBv4g5clmxUA6q24zNgNfGTjZSeKk0QAvFeLBJmv1ZUCNj6z-I7osKrXYA==)
- [skillsdirectory.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGen98ZUqgXo-wDdms_Oe6rR6fSHNUb7bypb_5IfPhIng0o7i478uQmBm-n_nkMQ1kMmvgLdM4pKG4WdDHpx4IselHfOAOZcZPIIPmDRZrkecLcmmxVUZu3yTVddxgLYvUJEDC9_Ph2-JMyaikprizy1gj2bzu4nfVR)
- [nxdevsolutions.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEmnKkDOf6oA6XW5FL-_TZ402GfPrQGIYktADkLSKB6Ubf2fgK3sjwm6wBHW2EaWVoNl232F4AINKMDRYrpoxLEf9IY_Tb5XRYhYWRYKvWczFwviOQ5ppzYItbs31V8nWJlVfgizPfOFR6UTlsxLDm7)
- [substack.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE0oufdeZQSGQbWv-fZxdMNivXVKzm3JOD_v5BKEyGj7atDi4ZvJ2BaUdxCPQRtQqqjQQX6_d3fyA9qS6Qp0RkU5E3Aw6pxTPHxe4kv98A-s2_K9invps-dzkMjUdwl0JMviiFbsJCBYigT1hBt6PSlYkUKlzISfIziiSkO3kM=)
- [alexandrudan.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE0ifqsp72nPHFdebD0OiXTr-mRO5r666dXXyjuDUb0nBc9IcV1jPEolFIwJQ3OmjOVo3SPE35EZot9-bYUvMIPFvh8fRm2z4qc0HYCNDev_A6biTxasRjTQZUo)
- [aibuilderclub.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFd0NxF4mztwGFTNO8cjTtsfjESGLOeN4YdSiE3ZchwAHphiRa4pPolXYtf1Aa--AX94OpTcS3Zm_zrtNuhQqMW2-PRrobERSd_bCQPWRR1DFHjSfCX1_faZXxrIJAbIyAKtWdE1Q1KE--aWSDc9gzBgA==)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGDOSlljCtdVca6z-pml3g4AOc6B51q16GX5RmqBjVWy5Xa7_SG9cFxuaAAiWab1S2fN-ybxJ_tWXqA1AGOm7r5aTeUHV_ncV01YcaJAI2LknLbK7Oaew4UIV4lvtAWDng-Qln-KqtfWtHaJDiVCicjCaBx3ZBwDx0UQslt3ND_NqO-ykFVMwJO80w=)
