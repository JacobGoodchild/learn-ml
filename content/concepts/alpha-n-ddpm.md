---
id: alpha-n-ddpm
title: $\alpha_n = 1 - \beta_n$: how much one step keeps
summary: $\alpha_n$ is one minus $\beta_n$. The step multiplies the old picture by $\sqrt{\alpha_n}$, which keeps a share $\alpha_n$ of its variance.
colour: diffusion
level: 3
needs: [beta-n-ddpm, standard-deviation]
related: [alpha-bar-n]
entryPoints:
  - label: why one minus beta
    section: idea
  - label: why the square root
    section: root
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Defines α_t := 1 − β_t
---

## The key formula {#formula}

```formula
\alpha_n = 1 - \p{beta-n-ddpm}{\beta_n}
```

## Which $\alpha$ is this? {#which}

The letter $\alpha$ means different things on different slides. **Here** (slides 19, 31 and 42) $\alpha_n$ is about **one** step. On slide 54 (DPM-Solver), $\alpha_t$ is the *total* signal scale after many steps, which in this page's terms is $\sqrt{\bar\alpha_n}$. They are different ideas with the same letter.

## Why one minus beta {#idea}

Each step does two things: it shrinks the old picture a little, and it adds a little fresh noise. $\beta_n$ is the share of variance given to new noise; $\alpha_n = 1 - \beta_n$ is the share kept from the old picture. The two shares add up to 1, which is what keeps the overall spread steady (see [why the spread stays at 1](c:variance-preserving)).

## Why the square root {#root}

The slide multiplies the old picture by $\sqrt{\alpha_n}$, not $\alpha_n$. Multiplying a random variable by $a$ multiplies its variance by $a^2$ ([scaling rule](c:scaling-and-adding)). So multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.

## A worked example {#example}

At step 1 of the DDPM schedule, $\beta_1 = 0.0001$, so $\alpha_1 = 0.9999$ and $\sqrt{\alpha_1} \approx 0.99995$. The picture is scaled down by just 0.005%. At the last step, $\beta_{1000} = 0.02$, so $\alpha_{1000} = 0.98$ and $\sqrt{0.98} \approx 0.99$.

## Quick check {#check}

```check
? $\beta_n = 0.19$. What does the step multiply the old picture by?
= 0.9 ± 0.0001
wrong: First $\alpha_n = 1 - \beta_n$, then take its square root.
hint: $\sqrt{1 - 0.19}$.
answer: $\alpha_n = 0.81$, and $\sqrt{0.81} = 0.9$.
? On slide 54, $\alpha_t$ appears again. Is it the same thing?
- [ ] Yes, same letter, same meaning :: The slides reuse the letter for a different idea.
- [x] No: there it is the total signal scale after many steps :: Right. In slide 19's terms it is $\sqrt{\bar\alpha_n}$, not $\alpha_n$.
hint: Look at the "Which α is this?" section.
answer: No. On slide 54, $\alpha_t$ is the overall scale of the clean picture inside $x_t$, which is $\sqrt{\bar\alpha_n}$ here.
```

```recall
? What is $\alpha_n$ on slide 19, and why is the old picture multiplied by $\sqrt{\alpha_n}$?
$\alpha_n = 1 - \beta_n$, the share of variance kept from the previous picture. Multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.
? Why must you be careful with $\alpha$ when moving from slide 19 to slide 54?
On slide 54, $\alpha_t$ is the total signal scale over many steps (like $\sqrt{\bar\alpha_n}$), not the one-step $\alpha_n$.
```
