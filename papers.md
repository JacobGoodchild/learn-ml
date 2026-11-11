# Learn ML — source papers for the Tsinghua lecture

Tsinghua-group and VAE-slide IDs were verified on arXiv; the well-known core papers (DDPM, Song SDE, DDIM, Salimans & Ho, Kingma & Welling, DPM-Solver++) are from memory, so open each link once to confirm. Claude Code: read the relevant paper before writing any concept page
that uses its formulas, and check every formula against it, down to subscripts.
These are free to read; link them in each page's collapsible Sources section.
Do not copy passages or figures from them onto the site. Explain in our own words and redraw visuals.

## Core diffusion papers (cited on the slides)

| Paper | Authors, venue | arXiv | Used for |
|---|---|---|---|
| Denoising Diffusion Probabilistic Models (DDPM) | Ho, Jain, Abbeel — NeurIPS 2020 | 2006.11239 | Slides 19, 31: forward process, noise prediction, training loss |
| Score-Based Generative Modeling through Stochastic Differential Equations | Song, Sohl-Dickstein, Kingma, Kumar, Ermon, Poole — ICLR 2021 | 2011.13456 | Slides 19, 25: SDE/ODE view, reverse SDE, probability-flow ODE |
| Denoising Diffusion Implicit Models (DDIM) | Song, Meng, Ermon — ICLR 2021 | 2010.02502 | Slide 25: DDIM sampling |
| Progressive Distillation for Fast Sampling of Diffusion Models | Salimans, Ho — ICLR 2022 | 2202.00512 | Slide 25: "DDIM = first-order ODE solver" |

## Tsinghua group papers (the lecture's own work)

| Paper | Authors, venue | arXiv | Used for |
|---|---|---|---|
| Analytic-DPM: an Analytic Estimate of the Optimal Reverse Variance in DPMs | Bao, Li, Zhu, Zhang — ICLR 2022 (Outstanding Paper) | 2201.06503 | Slides 31, 42, 154 |
| Estimating the Optimal Covariance with Imperfect Mean in DPMs (Extended Analytic-DPM) | Bao, Li, Sun, Zhu, Zhang — ICML 2022 | 2206.07309 | Slides 42, ~43 (SN-DPM, NPR-DPM, FID table) |
| DPM-Solver: A Fast ODE Solver for DPM Sampling in Around 10 Steps | Lu, Zhou, Bao, Chen, Li, Zhu — NeurIPS 2022 | 2206.00927 | Slides 54, 56, 78, 154 |
| DPM-Solver++: Fast Solver for Guided Sampling of DPMs | Lu, Zhou, Bao, Chen, Li, Zhu — 2022 | 2211.01095 | Probably in the unphotographed slides 57–77; the "multistep" scheduler on slide 78 |
| ProlificDreamer: High-Fidelity and Diverse Text-to-3D Generation with Variational Score Distillation | Wang, Lu, Wang, Bao, Li, Su, Zhu — NeurIPS 2023 | 2305.16213 | Slide 119 |
| Equivariant Energy-Guided SDE for Inverse Molecular Design (EEGSDE) | Bao, Zhao, Hao, Li, Li, Zhu — ICLR 2023 | 2209.15408 | EEGSDE slide |
| EGSDE: Unpaired Image-to-Image Translation via Energy-Guided SDEs | Zhao, Bao, Li, Zhu — NeurIPS 2022 | 2207.06635 | Slide 154 |
| One Transformer Fits All Distributions in Multi-Modal Diffusion at Scale (UniDiffuser) | Bao, Nie, Xue, Li, Pu, Wang, Yue, Cao, Su, Zhu — ICML 2023 | 2303.06555 | Slide 154 |

## Background papers cited on the VAE slide

| Paper | Authors, venue | arXiv | Used for |
|---|---|---|---|
| Auto-Encoding Variational Bayes | Kingma, Welling — ICLR 2014 (slide says 2013) | 1312.6114 | Slide A |
| SUMO: Unbiased Estimation of Log Marginal Probability for Latent Variable Models | Luo, Beatson, Norouzi, Zhu, Duvenaud, Adams, Chen — ICLR 2020 | 2004.00353 | Slide A (mention only) |
| A Spectral Approach to Gradient Estimation for Implicit Distributions | Shi, Sun, Zhu — ICML 2018 | 1806.02925 | Slide A (mention only) |
| Nonparametric Score Estimators | Zhou, Shi, Zhu — ICML 2020 | 2005.10099 | Slide A (mention only) |

## Other links

- Tsinghua diffusion group's list of related work: https://ml.cs.tsinghua.edu.cn/diffusion/RelatedWork
- DPM-Solver code: https://github.com/LuChengTHU/dpm-solver
- Extended Analytic-DPM code: https://github.com/baofff/Extended-Analytic-DPM
- ProlificDreamer project page: https://ml.cs.tsinghua.edu.cn/prolificdreamer/

## Priority for the first build

Slides 19 → 31 → 25 → 42 form one connected story ("how diffusion works and why its variance
matters"). Build that path fully first. DPM-Solver (54, 56, 78) is the second path.
VAE / auto-regressive slides are the third (they share KL divergence, ELBO and conditional
probability with the first path, so much of their tree will already exist).
ProlificDreamer and EEGSDE are the hardest and come last.
