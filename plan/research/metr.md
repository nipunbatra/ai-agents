# metr

Model: gemini-pro-latest

## Query

METR's "time horizon" research on AI agents (paper "Measuring AI Ability to Complete Long Tasks", March 2025, and every later update METR published through November 2026). For a chart I need, for each model METR measured: model name, public release date, 50%-success time horizon in minutes (with confidence interval if given). Include the original set (GPT-2, GPT-3, GPT-3.5, GPT-4, GPT-4o, Claude 3.5 Sonnet, o1, Claude 3.7 Sonnet) and every newer model METR reported (o3, Claude 4 family, GPT-5, GPT-5.1-Codex-Max, Gemini 3, Claude Opus 4.5 and later, anything in 2026). Give METR's stated doubling time (overall since 2019 and since 2024) and the exact URLs where the numbers are published. Also the 80%-success horizons if reported. Say clearly when a number is uncertain or you could not find it.

## Answer

Based on METR’s (Model Evaluation and Threat Research) publications from their initial March 2025 paper "Measuring AI Ability to Complete Long Tasks" through their final updates in late 2026, here is the compiled data for their "time horizon" metric. 

The **time horizon** is defined as the task duration (measured by how long it takes a human expert) at which an AI agent is predicted to succeed with a specific probability (usually 50% or 80%).

### 1. METR's Stated Doubling Times
*   **Overall (Since 2019):** In their original March 2025 paper, METR found that the 50% time horizon had been consistently exponentially increasing with a doubling time of **~7 months**.
*   **Since 2024 (Accelerated):** In later updates, METR noted that the trend accelerated. For models released after January 1, 2024, the line of best fit showed a doubling time of **105 days (approx. 3.5 months)**.

### 2. Exact URLs for the Data
*   **Original March 2025 Paper:** `https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/`
*   **Live/Updated Interactive Chart (TH 1.1):** `https://metr.org/time-horizons/`

### 3. Model Data: 50% Time Horizons
*Note: METR's interactive chart plots all these models visually. However, exact numerical point estimates and confidence intervals (CIs) were only explicitly written out in the text of their reports for certain models. I have clearly indicated below where exact numbers could not be found in the text.*

**The Original Set (Pre-March 2025)**
*   **GPT-2, GPT-3, GPT-3.5:** *(Exact numbers not explicitly written in text, but plotted on the chart in the 4-second to 36-second range).*
*   **GPT-4:** 4 minutes.
*   **GPT-4o:** 7 minutes.
*   **Claude 3.5 Sonnet (Old):** 11 minutes.
*   **o1-preview:** 20 minutes.
*   **o1:** 39 minutes.
*   **Claude 3.7 Sonnet:** Added April 4, 2025. 60 minutes (METR also reported a 55-minute point estimate specifically on their GAC task suite).

**Newer Models (Mid-2025 to Late 2026)**
*   **o3:** Added April 16, 2025. **120 minutes** (2.0 hours).
*   **GPT-5 (gpt-5-thinking):** Added August 6, 2025. **137 minutes** (2 hours 17 minutes).
*   **GPT-5.1-Codex-Max:** Added November 19, 2025. **162 minutes** (2 hours 42 minutes). *95% CI: 75 minutes to 350 minutes*.
*   **Claude Opus 4.5:** Added December 19, 2025. **289 minutes** (4 hours 49 minutes). *95% CI: 1 hour 49 minutes to 20 hours 25 minutes*.
*   **Claude Opus 4.6:** Added February 20, 2026. **719 minutes** (11 hours 59 minutes). *(Note: METR noted this dropped to 7h 11m when excluding public tasks)*.
*   **Gemini 3 Pro:** Added February 3, 2026. *(Exact minute estimate not found in text; plotted between Opus 4.5 and Opus 4.6)*.
*   **GPT-5.2 (high):** Added February 4, 2026. *(Exact minute estimate not found in text)*.
*   **GPT-5.3-Codex (high):** Added February 20, 2026. *(Exact minute estimate not found in text)*.
*   **GPT-5.4 (xhigh):** Added April 10, 2026. *(Exact minute estimate not found in text)*.
*   **Gemini 3.1 Pro:** Added April 15, 2026. *(Exact minute estimate not found in text)*.
*   **Claude Mythos Preview (early):** Added May 8, 2026. *(Exact 50% minute estimate not found in text)*. METR noted that by early 2026, the most capable shared models had 50% time horizons between **16 and 20 hours**. 

*Uncertainty Warning:* By May 2026, METR explicitly placed a disclaimer on their chart stating: *"Measurements above 16 hrs are unreliable with our current task suite,"* as the benchmark had begun to heavily saturate.

### 4. 80%-Success Time Horizons
METR tracks the 80% success horizon but notes it is highly sensitive to the hardest tasks of a given duration. 
*   **General Rule:** METR states that a model's 80% time horizon is typically **4 to 8 times shorter** than its 50% time horizon. 
*   **Chronological Lag:** The 80% horizon historically trails the 50% horizon by about **8 months** (e.g., it took about 9 months for the 80% horizon to reach the 1-hour mark after Claude 3.7 Sonnet hit the 50% 1-hour mark).
*   **Specific 80% Data Points:** While exact 80% numbers for every model are omitted from their text summaries, METR reported that the most capable shared models in Feb-Mar 2026 (around the era of Opus 4.6 / Mythos Preview) had an 80% time horizon of **between 3 and 4 hours**.

## Search results used

- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEMnrQdjgt4eNPnGa80Re-_Duy752OPwGAXySaSxkqTpKmELQc4kOq2BuSkrmaD1-OE9tWFV8hC7g1Qco0J_SeQmU1XDLYdhFnazb2iv0-mJzkWhT3a2jP67YITPZJlrQbbaOErWIbUd5xJpPygd12QulR7jBsXp53RE1n3t9HgvYm9mg==)
- [casrai.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFGkPrhSvj3yUp2dQ5VTbf201Ww6kfa3v8TJCmIHKYbE9zBKO8VGnDYFYvtc4d9Q1P_KDw8AsfhU9RQdE1VzDn5_4nnJmuRxTjF0wFGrdpjT94YH-bzYuWiIzZTk8fnDbyt)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHFvw4cutm3X2DECHBB4MmRYCCiw3ntyORMwXkE52m-upxet-5RiutHpjzNd_butQKos0JbG9HE-XKYO5fuk-_dovpIuIEEDZF1Ufm7v4nIU18bnJRUCSXtxEcjftrzuxS0HZx_nVN88uBUlGI=)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG86QfvIBjCgVOrhHoM2pV3MG29za8kOStOuLyEcvuONvzdrSp8S7R1--oMop258tMHZy9cu0DD5EL-Mu2dKroAJ6cD6foOWVIH2ZzpLTq4ureouUdY)
- [lesswrong.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEwC5xKTdjrXBZn-c0FCTG1McmAp53yJJmzJPwpXlWqurvVDrVRN4Ofz3KYkTv9w6fPe99JSrPXUD347l483U001U-dsG_hvYdqmtJUeylJLtNiCwsBms8fMd2u0HtrrvV85NitboB98HsMn42W0AjdUvkbOfzWBgr-JWrQ_2xZ-fgL3Ht1X8MmSRQ4b2WPtCbovjaLkObt9MD3Q77bkw==)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFbutmEm6yCM4xD8A2iz2lmiielziAbdmZtrFL_2hwvzRzrX4xZh8YLHh6vbPJji2XimSdoECt9Ln_v0T3f1MxjdYmfapOOG1l1O4DNb_r_rRCqcEsiIpIA0ayAkvbiKy_IKQGD0Q==)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHRwBDeIrqBo9tg2cn9YhXHReJphjIlSdiU7pohyKExryj9HcVnJ_v-SBuVdVvpHCJLehFFKJYKJQL9HYNQgHbZuhRnRPrMpgNO0hgFJnC686jNcZ-qVB5YuA0Ix7aLHw==)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGF63zoH30Kw_UdkEZz2qJMkLAl4qpWtL5lWgTWxM3kK0oTZ5NK1q9xKsMR3wNBaVsL4zmVVZc96QRrgP3N6x044oLq-EYS-RI9yUhNCTqQyrskN_2WIDq0umBGlTHpisoFXATF8H_WfxJ-9qo=)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEjTwWCd1Jc1wmeOyW3DRZFTLxHcxRdSOqtijxFGM5MjjB0FjjS_7Qhhyl8dLJ2fD-yTmG_5x1whkbG2-UUHRiGcAPv8kATvU_4AhrKGi0qsAjK5V254TbKZcLRUNGUEZ5UtOCpt-z-7GZhsYRJhXgVzQ==)
- [metr.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEb88hyRFQIzgZyY7beFk3Cd1U8U-AJmiDkhponrVRUKCRrU5p6f_Jnl6QI7yXQ4M-Gx-g0UD4pstJrxqtmLiTF9fSqVzxnhnmDpM7W3sL6wWGVuSxJCB_SWl75vN68Ijm80ptJZsofI94vidEtcw2TbafHoFA9j9EpU_4_hNazYYQGlP7-u0FObQjX_7wFSw==)
- [epoch.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF9jMtymhw0-waqG4_kiPAt4N0_ujOdmjUt2L5qvsDKaoc_zMsA3iuzikmtcdH379vxkxAvBTk-uaHDs3IwdxFCvzjBPetseq7BJ3WKQYltkKjfK_GMnpQd9xaEtWTz6H_Zk9Jf)
