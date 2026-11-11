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

```formula
\alpha_n = 1 - \p{beta-n-ddpm}{\beta_n}
```

## Which $\alpha$ is this? {#which}

Different authors use the letter $\alpha$ for different things. **Here** $\alpha_n$ is about **one** step. In the fast-sampling methods (DPM-Solver), $\alpha_t$ means the *total* signal scale after many steps, which in this page's terms is $\sqrt{\bar\alpha_n}$. Same letter, different idea.

## Why one minus beta {#idea}

Each step does two things: it shrinks the old picture a little, and it adds a little fresh noise. $\beta_n$ is the share of variance given to new noise; $\alpha_n = 1 - \beta_n$ is the share kept from the old picture. The two shares add up to 1, which is what keeps the overall spread steady (see [why the spread stays at 1](c:variance-preserving)).

## Why the square root {#root}

The step multiplies the old picture by $\sqrt{\alpha_n}$, not $\alpha_n$. Multiplying a random variable by $a$ multiplies its variance by $a^2$ ([scaling rule](c:scaling-and-adding)). So multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.

## Example {#example}

At step 1 of the DDPM schedule, $\beta_1 = 0.0001$, so $\alpha_1 = 0.9999$ and $\sqrt{\alpha_1} \approx 0.99995$. The picture is scaled down by just 0.005%. At the last step, $\beta_{1000} = 0.02$, so $\alpha_{1000} = 0.98$ and $\sqrt{0.98} \approx 0.99$.

## Check yourself {#check}

```check
? $\beta_n = 0.19$. What does the step multiply the old picture by?
= 0.9 ± 0.0001
wrong: First $\alpha_n = 1 - \beta_n$, then take its square root.
hint: $\sqrt{1 - 0.19}$.
answer: $\alpha_n = 0.81$, and $\sqrt{0.81} = 0.9$.
? In DPM-Solver, $\alpha_t$ appears. Is it the same thing as $\alpha_n$ here?
- [ ] Yes, same letter, same meaning :: The letter is reused for a different idea.
- [x] No: there it is the total signal scale after many steps :: Right. In this page's terms it is $\sqrt{\bar\alpha_n}$, not $\alpha_n$.
hint: Look at the "Which α is this?" section.
answer: No. In DPM-Solver, $\alpha_t$ is the overall scale of the clean picture inside $x_t$, which is $\sqrt{\bar\alpha_n}$ here.
```

```recall
? What is $\alpha_n$ in the noising process, and why is the old picture multiplied by $\sqrt{\alpha_n}$?
$\alpha_n = 1 - \beta_n$, the share of variance kept from the previous picture. Multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.
? Why must you be careful with $\alpha$ when reading about DPM-Solver?
There, $\alpha_t$ is the total signal scale over many steps (like $\sqrt{\bar\alpha_n}$), not the one-step $\alpha_n$.
```
