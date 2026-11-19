# science

Model: gemini-pro-latest

## Query

Sourced facts (date, organisation, what the agent does, credible numbers, URL) for AI agents in science: Google AI co-scientist (Feb 2025) and its validated results (AML drug repurposing, liver fibrosis targets, the cf-PICI bacterial gene transfer result reproduced from Imperial College); Coscientist (Boiko et al., Carnegie Mellon, Nature, Dec 2023) planning and running palladium-catalysed cross-coupling; FutureHouse Robin and ripasudil for dry AMD (May 2025); Google DeepMind AlphaEvolve (May 2025): 4x4 complex matrix multiplication with 48 multiplications, recovering 0.7% of Google's worldwide compute, other results; Sakana AI Scientist (and the workshop paper accepted at ICLR 2025); any major 2026 'autonomous lab' or AI-scientist results. Flag uncertain claims.

## Answer

Here is a sourced factual breakdown of the major AI agents in science, including their dates, organizations, functions, validated results, and credible numbers, along with flags for uncertain or highly contextual claims.

### 1. Google AI Co-Scientist
* **Date:** February 19, 2025 (arXiv preprint and Google Research blog).
* **Organisation:** Google DeepMind and Google Research, in collaboration with Stanford Medicine, Houston Methodist, and Imperial College London.
* **What it does:** A multi-agent system built on Gemini 2.0 that acts as a virtual collaborator. It uses a "generate → debate → evolve" loop (utilizing Generation, Reflection, and Ranking agents) to run an "idea tournament" that autonomously formulates and refines novel, testable research hypotheses.
* **Credible Numbers & Validated Results:**
  * **Drug Repurposing:** Proposed new drug-repurposing candidates for acute myeloid leukemia (AML) and epigenetic targets for liver fibrosis, which were subsequently confirmed in wet-lab experiments.
  * **Bacterial Gene Transfer:** In a validation test, the system independently reproduced an unpublished hypothesis regarding bacterial gene transfer (cf-PICI) in just **2 days**. This exact conclusion had taken human researchers at Imperial College London (Dr. Tiago Dias da Costa and Prof. José Penadés) several years of experimental work to prove.

### 2. Coscientist
* **Date:** December 20, 2023 (Published in *Nature*).
* **Organisation:** Carnegie Mellon University (Daniil Boiko, Robert MacKnight, Ben Kline, Gabe Gomes).
* **What it does:** An AI system driven by GPT-4 that autonomously designs, plans, and executes complex chemical experiments. It integrates large language models with internet search, documentation retrieval, code execution, and robotic laboratory automation.
* **Credible Numbers & Validated Results:**
  * Successfully planned and executed **palladium-catalysed cross-couplings** (a 2010 Nobel Prize-winning reaction heavily used in pharmaceuticals) autonomously in just a few minutes, nailing the procedure on its first try.
  * Accelerated research across six diverse chemical synthesis and optimization tasks.

### 3. FutureHouse "Robin"
* **Date:** May 19, 2025 (arXiv preprint), later published in *Nature* in May 2026.
* **Organisation:** FutureHouse (a San Francisco-based non-profit AI research lab).
* **What it does:** A multi-agent system that automates scientific discovery by synthesizing literature, generating therapeutic hypotheses, proposing experiments, analyzing data, and drafting manuscripts.
* **Credible Numbers & Validated Results:**
  * Proposed **ripasudil** (a ROCK inhibitor currently used for glaucoma) and KL001 as novel therapeutic candidates to improve phagocytosis in dry age-related macular degeneration (dAMD).
  * Analyzed flow cytometry data from human-run lab experiments, showing ripasudil significantly enhanced phagocytosis in RPE cells (outperforming the control Y-27632).
  * Proposed follow-up RNA sequencing, identifying the lipid-efflux pump ABCA1 as being upregulated threefold.
* **⚠️ Flagged for Uncertainty/Context:** The results are strictly *in vitro* (cell cultures). Ripasudil is a candidate for preclinical study in dAMD, not an approved or proven treatment for human patients. Furthermore, Robin did the reasoning and data analysis, but human scientists still performed the physical wet-lab biology.

### 4. Google DeepMind "AlphaEvolve"
* **Date:** May 2025 (arXiv preprint published June 2025).
* **Organisation:** Google DeepMind.
* **What it does:** An evolutionary coding agent powered by Gemini models that autonomously discovers novel algorithms and optimizes code. It uses a generate-evaluate-select loop to mutate codebases and test them against automated evaluators.
* **Credible Numbers & Validated Results:**
  * **Matrix Multiplication:** Discovered a 4x4 complex matrix multiplication algorithm requiring only **48 scalar multiplications**, breaking Volker Strassen's 56-year-old record of 49.
  * **Compute Recovery:** Optimized Google's Borg data center scheduling heuristics, continuously recovering an average of **0.7% of Google's worldwide compute resources**.
  * **AI Training:** Sped up a vital kernel in Gemini's architecture by 23%, leading to a **1% reduction in Gemini's training time**.
  * **Mathematics:** Established a new lower bound of 593 spheres in 11 dimensions for the geometric "kissing number problem".

### 5. Sakana AI "The AI Scientist"
* **Date:** August 2024 (v1), April 2025 (v2), published in *Nature* in March 2026.
* **Organisation:** Sakana AI (in collaboration with the University of British Columbia, Vector Institute, and University of Oxford).
* **What it does:** An end-to-end agentic system that autonomously conducts machine learning research. Version 2 uses Best-First Tree Search (BFTS) to generate ideas, write code, run experiments, analyze results, and draft a full LaTeX manuscript without needing human-written code templates.
* **Credible Numbers & Validated Results:**
  * Submitted three fully AI-generated papers to the ICLR 2025 workshop *"I Can't Believe It's Not Better"*.
  * One paper successfully passed blind human peer review with scores of 6, 7, and 6 (average 6.33), exceeding the 55% human acceptance threshold.
* **⚠️ Flagged for Uncertainty/Context:** While a historic milestone, researchers (including Sakana AI themselves) note the system still struggles with deep methodological rigor. External evaluations of the accepted paper found instances of hallucination, faked results, and overestimated novelty, highlighting severe reliability bottlenecks before these systems can be trusted blindly.

### 6. Major 2026 "Autonomous Lab" & AI-Scientist Breakthroughs
* **Danaher's AI-Powered Autonomous Lab (Oct 2026):** Danaher Corporation announced the launch of a fully connected autonomous lab (based at Abcam) combining AI, robotics, and bio-manufacturing. It is designed to accelerate the discovery of custom antibodies and affinity reagents by up to **8x**, scaling annual reagent generation by **10x** (from tens to hundreds). It is expected to operate at scale in early 2027.
* **Stanford's "Virtual Biotech" (Sep 2026):** Published in *Science*, Stanford Medicine researchers deployed a multi-agent AI framework acting as thousands of virtual scientists to autonomously design and surface therapeutic targets (such as B7-H3). The study proved that agentic swarms can successfully mimic biotech R&D pipelines to identify viable preclinical drug candidates.
* **Chalmers University Closed-Loop AI Lab (Oct 2026):** Researchers in Sweden developed an AI scientist integrated with a physical lab that autonomously generates hypotheses, plans, and evaluates biological experiments using baker's yeast, successfully closing the loop between digital ideation and physical execution.

## Search results used

- [gapnium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE3jeX8eaztBs1YhK1zLDrB7zDUPb8ReV1P9Ujy4hLe5B8-RnCPfFGjkFYH2zQKQZdW81Jd4ch4gthJ1ohqYErmPAClXT1heheFE6jfXjX6oPwFVZRECdHXrUvku11LvCbyYHmkCiVt1k69UVRb_t4WwU3pjQo1Ym-reRrDeUzagj_tIlabs9yPykUvB1w06A==)
- [aicell.io](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEsFh6dUILZu0gYHb1ocv1_QbkfK_LGdt5Z5DJ7hV8agKKhi-rur1naQGoqMinaUp9MXNLQtw0m4ug4tj-TisEodNhkM_-st2XNMNBIUMDfNtn0MnWV-E6131Zk0P-X9H7qD64=)
- [mirror.co.uk](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG1rOucrvRTR0noiwKYgn1bW70rVHqogu-6KS0iZ9Q4bWfPziImcW7li9Cksg6p4niW4zM7DFpTo74YnsPKVPpJVBrX7muShwMjphNLpALqx-yImzZCqldeNPENMaVK555xP36rtEgsfRIvY5R2jaoKe2A4bITm9Bu2HSao4Z2OXyCyfYPqrCDxY9TfpL2g_il12NSv)
- [eurekalert.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQExGi7YNYX9orHo6xiXm4WK1I3El9pHW_yIopMhjMNqtbEV9VSeeXt8WcZ7sPMELo080HTlYgGcSmb5ZPGLavhnxTqHg0ryEDp2Mv1f_rzHBtMPnIc_lFjYe2CNVTLYGwEThZgIQEc=)
- [eurekalert.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGHl2N17lJz9tehRcAaatMRe7Y20gJarxcg4Rb8_gTlRwa_hJGSW4Qy83_Aw9JgYlyu6mmyDagPJJQZuUY1Lz_3MrBKOk_ARGJRL8AicKtQr3wclRGv4nedOGsOW-w3WkAiQT4qmTM=)
- [researchgate.net](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGE0um9bzZuLoKz1rHlvtvsvdFPy-7x75khQqxsx4iSu-VdorPMx_y7YLG6Rah8CuTQnNaNNhx5n_RRxmvoZEMyOZPLxH4Hb5ujDK3YopsKqKEfq1arBEqoeStg21nIMA-M5gTJ-9bh)
- [researchgate.net](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEoNaCGuo6cKBPywVwlyGmDGDzCvC82R5PglQPtBfmS3wKAWgQphUtQwHHt7GeMMkVdNW8IaF_TOgOcql1BpeQuIJ2aUJ8l3EpN_NT7pwHA2VzoJi0v8tbLp1RUk1fIWxfoqWKoQpMdXsPz7-YoZnjgMajh4QBeDMbetzAwNErzdkBGan146JytYx3R89rmKfCL2Dv3V8iHGrPwY718dXk6Aq2W9HVUsVfE)
- [arxiv.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG_c70tfPMD05eWa5Evqg7oqjemEOv0uDLfSXZ3vuFkYgIMuob1g_zpx6wcy8bLp0STfVj_YIRs8pcHg2DH5z-vREUdrtrcMAfhBa0TWPkgATkZyYOEoQ==)
- [intuitionlabs.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFe4SRV99XCrzdvlxg6SN30KSRltyRvyvUMCIZL-5LJ1sBtphc1D9uWgNFdYUMEYBaXXneUxL4CVW5GWxz9whIJ1f6c84tS17wTuIWgj3Cm70hfFkEfuFvrBTD4Bf5DoSZn8gGvJ7uD6dP5LFHyr3hBGgr5i8yz)
- [the-scientist.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGuLLmB9IW3hoWsu1ojW9YOyTSEbEJRLt6fURtgHyMysUY7X-r7Vvs-XszPaTAuvBwIzhrUPQz-hiTkjkZopVjFmn15K4gMpJ6r8l9OSVsVSTNz9VyO-Mbx4_L8X8eegB44XFt40B8_xX7hq_19ivUCkGFaMls6wXZAohnSunsnbLjfhrfu96IHy8kyFRMRfG7dB-yM)
- [substack.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGdWzQEz2fbtgiShO7mh_74mlexC3hqsqsmWu7U6DbwGvLIf1a6yIaWBYVIgdI51324plr5u4WIgpV9EmujRMXLTShZsxYLjw8PkM995clhCkL0e6hLNE0KRTf8GG8hNUrRPc6b3YOanUIWSd4aklyOokDLCInZ3D1v3ON3X7fP)
- [alphaxiv.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_ThDBY2yRkWhW2vW8xg-el9zG2hNRiLpvTxNQxLLZifx00DC8G-YbtuPFv1RQQbLH4sFhzRGpg4ZzXMuuUx8rG8345dtTG4g_2a6__mBWLcGnhGyX8FjvDwDZ8IU=)
- [unite.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQESQzvMcAPC8OyKaR2nesPn7unIsB4zDrdRB_LN5wKHBnOS6SBfFBzNtbk5Kq6MRv8G2nsnSmK_Wn5DwB-wBmJa7ctVPL5DkFQj3VdGf5GJa7D8_LCiqC0YFgpfMKk2fuywSrnTkMyE45RP3VzloqLc0k_XcjI8FnNIClA5n9A5QFo4HEPP6PY=)
- [arxiv.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG3DG1lnsgD9m5hn9cbz7RG2e4QdhgrQkLkSsU8IFAPSQMX_2qGqd4cdDBnJHrQVI_QZRhQA-O7afQ-i2_ZSta9aNocxP0IksbKPH7_R8VBG9yKMAHchWGs7A==)
- [mindstudio.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEYKq8BoXnHtDEkXtvGS8izYhLaXsBjK3e6XyJ0p5vBqLyYDcPAAOGlrnptfz7O6GqKHvPa5VTNaVEyd5fzoUzes8BTUcyP5_AtlX3BgISQbPysE8B2k36rhHTRpF2tKWqPOSkhM4kuHf2SmnGo0gTV77IfdA2wWtrhHEByqR-cwchc06q6)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFqi6ze_6zBmL1StZzAjsMXFfMTPDUojfoRwPCe6u-TXadeihEM2byw7Rlu2AzlX19WJr-1Z9ExhfOtie8QLEBeMy8J9pnkAnC6XoDdwAhoRgW4QO0Zv9IpkeC_lGTAUH5wVFe9M9V1QPZhvOtPhyccWSQprQlO6NGucD6F_0ZH4oKVwipzaBeXPncwPPo-7g==)
- [remio.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFH3b_nBUqTrSLINrbMlwSkT3uN0MqLKjSCgiPvsw-mw6kzi5_6bawprwvbXBOpW70yJyvGYVtUfhZNQsy9EzviK0wvL8NvZEHm5HkxkZLkzuuu1fHmIaQO6ivMn8VSTqpAVPztmUctXyJ1zRDfs6Xvb4pCGxgDVnNCssqOnQOv7xjpMeAx0NJnScKRbs0z00reBVqccPZnkbjc3PhnmY9LPs-hsMjb)
- [deepmind.google](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF9IGGOrlnzilHsfJ6-T7MdwXUA-61MQD6OCviQcOtaQj-g3N3OvUhKySApKxl8IuGVU_ayqkk0zXXFAx8Z86K8GmL1JsiwJVjQFrx9pTyRumKqjM9qespheBfXHlGw_YbBgPjhOqrFVt9oKpw2mck5Q4CVXuUiyUfItsS5guVsTagANiTnd5DAWc9wCOgMP8Vr0veKj0HF37ULfSgm0jY=)
- [medium.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHhF8eqd4eBwpYP54lTJRKrhN5pBwomhPUxqG31C1vKPGFXpS8ppXOVCM_lN0bZ7mmbcjEPBNYOUtErypGsN2ndbnsJ9cT_h53KumwFS27ai1tRo6tAiblSZfKxsHR1_nCVaqLyZh6t2iZFf13w6a1gTSJG0Eh8mgEhF98vOzEw_42mjB9Bgvl4PHXGYpZIMaESX08H_No4z5kanWTkhg==)
- [google.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQH8WH-VsJcnxUhf4W0psh84AJOxWhPW43_egY22dK4BwLaoc_zMzhxrxo1YuWQAXXXL22c4QMNRZpdNzr3Enry9Z-_termucE-pdwCWoIrixtiR35bbSN1aeG22NQtiONnf6tLESzn6S56bOY8pgrW9PfpX0p4SEoBXYRcZO0ZhG34HIqQmr20qQ41S_Q==)
- [alphasignal.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHECaLriV911RA6MjRecJaSl4DpS47r-VgQ2gyHszaClHnxTXVSPIJ9rocLujBdsNTKOLQYFYtH0Osn_1vNI3lHhWQpMULvVi_9GICUzfVpOK2Czn5Y9HHm5b3We7lBqDYinvBG5S2UhTUBZerpVz1V_FnMaD9yUqPK-LyTmHKOPlJ03GOiUOQDS_K5swhKvflWbg33O6oRZiNt)
- [dev.to](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFp51i8WMxnhTMgrA9FHS6SbaOxiD3wihxfsv4x0b0-SiRItaYScC85HLvviEaP0j6gv_y-xFVAHrUkWFzbaPddEuDcRLfnJGQf8HWuTmwSvHTvy_j7fPqH_67P49HbWMiTeu7KjiZV-5yG)
- [sakana.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFq2pyyMIZmy9u0l3WluJWUnY7eml3HCE1VUrF5cjTz8BTFswJRFISEL2Pd4qZySMdcVoB_2GeuUiw1zp30iyaTD_EjVXn_x8VuTKszUjWJb2kJQodAk7h9MQ4JWg==)
- [arxiv.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFJAIBjgPcxDMQnX6qQuGdh2jbSXP4AEGw_DX55ETeuvdSva1X0-m27oE54r0xMSRGNRgzSj8iDHoOCKsA-wgTPIGKWOGEoGjTNm2U95vPScd7vDdHZog==)
- [pebblous.ai](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGpIYQRLwvGyXQ-r6ARb4ovBAFhHnfbyYy5CkJAxBnT7Uht0Fyi7Vqz2FKE-KpWxG04arg_kOpJR1bf5dsg0C0pAWru-MSt5ygCqYSxJgCrf9sVlqNJ90w27HEmQfSzsZPwp5JSbm5SvthW8vapVdgTnjRJzw==)
- [github.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG7r8-RlFi5Yhvmeogbrc_gvvWD8bdV2DZ7GUrFqISBA6Jh737YcEOz4qxHAp5GbH9sOcoR-F66-B4wrVBWPuLWP4jq61--dbPpaq8c-TqnaKFDEb3oWDOljcytxhQzwf4WnDBjv1HIjkMp4S6NtewdNX0aqSUA0tGhU9Q=)
- [aiweekly.co](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE5GtbExGGPutECMZNliE1XsjKVr6YHnUPyJL9qFPxNvdjlrFcylxorlghCIAKBWc2BOsJnptYoL1uZwNGp3FgKiKN0aMjMUcAaOjDJ8p2qZiMeV7t4c-h6HQVForeb1MNhFp0j8jDnLM7W4mX29LKNAFSo1HVzgMuQX3BITY97pJ4VUPs4JQCNhqM=)
- [danaher.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG99pwIOmJt1D8akDulgth0bKjbgL5czO0BNDU03Exe_S7tg6-AjVJPuDWpGV0i9NRamsVpXzb2n-xOYX8epnaPo0TDGKWf-26UzqaFqKidl-7Sy8Uq-gUyGFfyuxIyhfLN9Ry6vRWOz0p4pgejui0mp39Ljn2nHxDxB4Z7IgoljAV25W-teIE20WhKbrLsxlmO-PcBOFSLQcmiWA3xgowSEiaSHxEiUQWfEllF)
- [biospectrumasia.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFK7uhB2DWXSB6oknGX7fmpGCWMg3spkPIpP8smbKG6PPKN1ehBKj9EUMpuTM9Rfo_KdS6Sgh4oZ4oO2dkXSBabM0yI_KP7uDXBEIcMef1m04T9UasHLQNtuqdy-17THdBtvQZK9NeXefnGXKqfo6b5DyutUU1m2oXHrYVg3OTkEgTEz_-gRFphRQoxgIzwd4L3az4pTVcdqKYHQ4oBDBpgEtxCsxwuRl7AMA4Jq9EjVAvYh5ul5nQ=)
- [eurekalert.org](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFg8Zk6U-gpBQDwqTGM0Fu0f8W8k6hA6_mC_vG52ZCjoMx9aGBXf-a2_HAvcPxmabINxAdFhpyijYw_Lj2SX_eCDQQhXxjPwbl-OPuHt2k0jWar3_KTFpJ_MF_PO2htzI3Ibs9QzuI=)
- [analytica-world.com](https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGXX5lXL2q6w8lD3TRLKva9017JffREM5VhBCTKQEP1ZpV8uu4qjr4nVA1f_S9P02AdUfOme_CZ4NlDlCvm6cL_mT2pvSCHgXoFA2eQDVu_qOnnSZLgnYueqXAeaIggXatkmcV7Wi1oPb73vbK1p3IYXjWK5y3uMMpNb2_unkIZcFUsz1aQ6xpb9w2tC-h5ogYvC3g7L6cBzheHvNTd72LRyJjR8Iz4HMZI1NEQHEzXuaOdj-4yvQYb)
