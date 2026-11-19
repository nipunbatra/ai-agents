# swebench

Model: gemini-pro-latest

## Query

SWE-bench Verified: release date, who made it (OpenAI Preparedness with the SWE-bench authors), number of tasks (500), what one task is. Then the history of the best reported score: a list of (date, model or system, % resolved, source URL) from August 2024 (about 33% with GPT-4o) to November 2026, picking the points where the state of the art rose. Also current best scores with dates for OSWorld (and the human baseline, about 72%), Terminal-Bench, tau-bench / tau2-bench, GAIA and SWE-bench Pro if they are standard now. Flag uncertain numbers.

## Answer

### SWE-bench Verified Overview
* **Release Date:** August 13, 2024
* **Creators:** OpenAI's Preparedness team in collaboration with the original SWE-bench authors (Princeton-NLP).
* **Number of Tasks:** 500
* **What one task is:** An agent is given a real-world software issue from a GitHub repository along with the codebase. The task is to autonomously generate a code patch that resolves the described problem. The solution is then objectively graded by running the repository's existing unit tests to ensure the fix works and doesn't break other functionality.

### SWE-bench Verified SOTA History (Aug 2024 – Nov 2026)
*Note: In February 2026, OpenAI stopped using SWE-bench Verified as a primary metric, citing data contamination and flawed tests that rejected correct solutions, and the industry largely migrated to SWE-bench Pro.*

Here is the progression of the State of the Art (SOTA) on the SWE-bench Verified leaderboard:
* (August 13, 2024, GPT-4o, ~33%, https://openai.com/index/introducing-swe-bench-verified/)
* (June 12, 2025, TRAE, 75.2%, https://www.swebench.com/)
* (August 4, 2025, Claude 4 Sonnet with EPAM AI/Run Developer Agent, 76.8%, https://www.swebench.com/)
* (September 28, 2025, Doubao-Seed-Code with TRAE, 78.8%, https://www.swebench.com/)
* (December 5, 2025, Claude 4.5 Opus with Sonar Foundation Agent, 79.2%, https://www.swebench.com/)
* (January 2026, GPT-5.2-Codex, 80.0%, https://qcode.cc/)
* (February 23, 2026, Unspecified SOTA, 80.9%, https://openai.com/research/why-swe-bench-verified-no-longer-measures-frontier-coding-capabilities)

---

### Current Best Scores on Standard Agent Benchmarks (as of November 2026)

**OSWorld (Computer-Use Agents)**
* **Human Baseline:** ~72.4% (72.36%)
* **OSWorld-Verified (v1):** 90.19% by Intelligence-Indeed Agent (October 2026).
* **OSWorld 2.0:** 86.0% by Claude Fable 5 (August 31, 2026) on the official leaderboard.
* ⚠️ *Uncertainty Flag:* OSWorld 2.0 scoring is highly fragmented. While the official board lists 86.0% for Claude Fable 5, Anthropic self-reports an 81.8% *partial* score for Claude Opus 5.5 (September 22, 2026), and the official board lists Claude Opus 5 at 44.33% for *binary* (full) completion. Always check if a vendor is quoting partial vs. binary completion.

**Terminal-Bench (Terminal/CLI Agents)**
* **Terminal-Bench 4.0 (Current):** 71.2% by Copilot Fusion (max) with GitHub Copilot (November 17, 2026).
* **Terminal-Bench 2.1 (Legacy):** 87.4% by GPT-6 Astra (high) with Codex (September 3, 2026).

**tau-bench / tau2-bench (Customer Service & Tool-Calling Agents)**
* **tau2-bench (Overall):** 87.9% by Qwen3.5-397B-A17B (March 2, 2026).
* **tau3-Banking (tau-knowledge):** 55.2% by Qwen 3.8 Max (July 19, 2026).

**GAIA (General AI Assistants / Agentic Search)**
* **Human Baseline:** ~92%
* **Current Best:** 95.1% by Sage-A1.5 and Agents-A1-4B (November 18, 2026).
* ⚠️ *Uncertainty Flag:* The top scores are vendor self-reports, not independently verified runs. Furthermore, because the top AI models have now surpassed the 92% human baseline, the benchmark is widely considered saturated and highly susceptible to training data contamination.

**SWE-bench Pro (Advanced Coding Agents)**
*SWE-bench Pro is now the industry standard after the deprecation of SWE-bench Verified.*
* **Scale AI Official Board (Public Dataset):** 61.5% by Muse Spark 1.1 (October 7, 2026), followed by GPT-5.4 (xHigh) at 59.1%.
* ⚠️ *Uncertainty Flag:* There is a massive discrepancy between standardized evaluations and vendor self-reports. For example, Anthropic's system card self-reports a score of 93.0% for Claude Fable 5.2 (November 9, 2026). These self-reported numbers use custom agent scaffolding and are not directly comparable to the standardized Scale AI leaderboard.

## Search results used

- [openai.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFQNdun5vQH2rQG1foepCQUe8J-5g3RhGVzBRme9nzEUo1roqAfGaVwLKLW7Cm89ybvt5vAmhCrpedEapd-OVXkWMkbAF1P6COTR1h0fp4Ixin6lzi_m27K4odA2snRy0VT_4_emQZrthd62cwnRA==)
- [pypi.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHetG2Yeq-Tl7JAxy_9yEZSHbH6StynwT6MAlTjoM-4LQ0FJIN0egJy0Q09vGvHjifZIv-ZNqXPkYTZxiWv2hOqMONRhXKA5_rE015xxbrBi_R0cwoRp6Q7XVGimXCt)
- [openai.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHihCz7hdPdPhb4vk0gJKu_PAkMTDmpPlFhCJpxMFQ5NqaE5bm7NrZc5LJhtQ1h-l8jEWLx8yvUJfbk7RpwJKkfzeJizCtsx5-5royzWA2ljuTogSk6sSu0Uf5xpbQesZRElrR09H1Qwf1_hZKbrjAMpjWCDg==)
- [latent.space](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFLA-DFz0qlBhvGnUoYQjHUsH5v8KQGNAQldZ0oxCfKAj52R3X99poSXNN-fjxOVIwg1FoKLtseKvbLdVvHl5kjRxXfyXY1Cf3-JK22OmsA1GvldFu9P9oInTbcIelPIRyJx4hfELa8hl316l3rxA8XJsDJe78qTjHpfQ==)
- [verdent.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFaRLG5tAcmH2ldy1aYXhwzn6vK__cahANV1xbHmOb1DCRGyPfrz75P32bGUE5N_CAR_5DChPsYWm3JS5j8B9PhE0eaupKfu-GBsvDz3sQ9-6Rqq8-ifcQe-iOea7xdckaJaP_Ylfymdnz4lSQu)
- [benchmarkingagents.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHZBe4JuVeMgotwQ_diZSqiJh3P60KosLJCDpOM12WiLtCzlITdbFJjdPHLv4QUPHnZC6Eq-SdKVPJw5r9fjYKRL8lGNol8KaKwYiIzm3xUiCvV0EXpfaifh9yTXMHcsg==)
- [openai.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHNvV7JDiOUdyh_7SbM6hgFsSr1IApdfVr6TXaOb2MbeLTm0NiVFGXaPZjOgNN8nJTwNmlzJPlxZJN2lWyic-ikeumC8cyo0vMWgJaZC8PMg8cj_7n7oN6sD6MVV5HVpFdb2zh-ZX326rs-xYlMxhCeRursoHlTESkjDyr0)
- [swebench.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFOtFWzDNCL-0aaZsYdJQTMHItgCgROLXN5ngjX2HNu988WvL-qTmgfhh0X4ZNbtiz3BGnEGgLwiHOHpWz95Kj1uxU3_5WLYiQ_xzYjGB4k)
- [qcode.cc](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEKftxk9YzxhtQtJIS6aI_mrdaXbV5AFRU1N4Lk9axR3u8UC_x6nmky7L3HL94mxTHgN6TFbOLBGUDnKJzjO6GMIIj_fTvSu49qngx5XJDzQQPxNhAd85HJHg6R194o0PS0fyX0)
- [presenc.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGxBl_Wri5xj9fx-bvu-Zxo2Oiqv5oWQ7w5cYJtaS-qP5y6C-n56pafEeLnU3XOYdooAay-r8hd0MIRXRavQoZ2nveEzMGPoFH_tTE4sB_kDI0YCOl9f9vw-sNyXRg38B4p98cC3VkHYQxYx7x_4OSwfFJu4GEH4Q==)
- [xlang.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFFa4L5ODOw34KogQiEYoS_1OMcEhlfNDExsSjPsxYfa7AdowS4VDBolKNOPbQMyN7HRQyccTG8Xf242LNymbXMe9uNfDuOgXUEtUPY6kx1ZddI)
- [pointer.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHI6VtOk-2941WO6mCMgMMjoZdfYyBKx45VZMrjI7y7szKOJTuMcqAlIC06NeyEHE9YNp0SMG8zYCJYRqo3GlMNeh5DQolGJgpb0mjLMHafjGIBjzv-gw==)
- [tbench.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEFU-8mPZkH7EcyNi7DAtDI5oJKPp3fAjJpeMfLvgLxgd_3TtrlKBycctciYONlk54hqYDC1PFkwY-oY1RaoEF2jl7p8Fbb3dhI1IQT)
- [tbench.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHujbG3Br69MGrgEh7k4ZG5gU_I7fBmotMj6GFxrvAfIyhtvqvc3a_f_A5EaROAu6B9oXpMqR5Je48rO6A0RgZ4UVfcAyKiZb9wSyt2YjmmSFEhEaC-AvQd)
- [developersdigest.tech](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFe0GzNzkwznKe8qC7f5V05wcnkoe8kSitpa6_--42S2rmptdBhYm28QMrg1KqwWs7kgKySl9T8wbVOxZdc2SkX1bALUXHNupJh0rNnbYNVeBZF79-F9qYOE111RyLdfn0JcssbcHTjoRuLvXU=)
- [taubench.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQElqDV-Rero4T7tHQmf5aGstvqdqGE0BZ5a5SBuKGQF99-CjOk-xVnTsfs80wfXcu5kIeLg_mNAlgXzIexyQfl9QLpPAZAYof75KKJDBIw9hBUvIxpqJg==)
- [benchlm.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFp-rOwtcwOpBq4VSMJSGK_znLUtBPYNIjk4cLzjkq50d-IXVIhdMGF-Ke0okEADZkm5KLL2UG8GEKhSdAxpbvoLzxJZQr8jCF42sLHlCn_hZTL9nb1totk)
- [qaskills.sh](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE8kYbh1yVjGTn1-PQbV8nz2QwmrHSDaXNi_FqfTXurxH42PfIwsj8Kq_BfUAvpcI1FNDry_rtfOXPUopFwuwTys2v6MhtuiyWIP55k1nS0PR6tVA9ms9nDxIGn0QrqTL-mgfBfAChgS6uwQGWJaRW0IbdDW3gw)
- [decodethefuture.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHr8LcK_a4wgEa1oqraE_bplY3wvbbuy4kNHD2ErMmi9DAsjpsj-mEPXWXMGqOmXakoDa3O1JgRBZMtDxqEdUc2pp47AVNySSD4VZx7E3jMCkQb7IodStnVEuR2pY4GmQMoaiSm7ilnMZX-SMle7g==)
- [morphllm.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFX-CGEByr_r7a65RHidTU0kgs_i0oodeeqWFsSmS23dkdvNGtakI7OfauKmHFwMM2ahUdKfez0KjiPma_f-7N5zQ5UD3qo9YqcJB__4Jf6AAFL6_L3uKEiAEIgWQ==)
- [codingfleet.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGV-OpqoB3X3EnZHQbPYrB6BoeiQCON4hft0oUMaq6R2EvHKEQ_zxeQJqIhHwKBOg2nj4iuFsqYiNKRv9dPoxD4OUTx2m8JZSrT8XyfkIXV9uppOBc7R2nUZxAbrH8zhQNztmFnTggGy8n372gRBRg75jA=)
