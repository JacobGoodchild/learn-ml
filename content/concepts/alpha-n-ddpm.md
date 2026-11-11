---
id: alpha-n-ddpm
title: $\alpha_n = 1 - \beta_n$: how much one step keeps
summary: $\alpha_n$ is the share of the picture a step keeps. The step multiplies the picture by $\sqrt{\alpha_n}$.
colour: diffusion
level: 3
needs: [beta-n-ddpm, standard-deviation]
related: [alpha-bar-n]
entryPoints:
  - label: why the square root
    section: why-the-square-root
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```formula Keep plus new adds to one
\alpha_n = 1 - \p{beta-n-ddpm}{\beta_n}
---
In words: whatever share of the variance isn't new noise is kept from the old picture.
$\alpha_n$ :: share kept from the previous picture
$\p{beta-n-ddpm}{\beta_n}$ :: share given to new noise
```

```keypoint Why the square root
The step multiplies the picture by $\sqrt{\alpha_n}$, not $\alpha_n$. Multiplying by $a$ multiplies the variance by $a^2$ ([scaling rule](c:scaling-and-adding)), so $\sqrt{\alpha_n}$ keeps exactly $\alpha_n$ of the variance.
```

```note Same letter, different meaning
In faster sampling methods (DPM-Solver), $\alpha_t$ means the *total* signal kept after many steps, which here is $\sqrt{\bar\alpha_n}$. Always check which one a formula means.
```

## Check yourself {#check}

```check
? $\beta_n = 0.19$. What does the step multiply the old picture by?
= 0.9 ± 0.0001
wrong: First $\alpha_n = 1 - \beta_n$, then take its square root.
hint: $\sqrt{1 - 0.19}$.
answer: $\alpha_n = 0.81$, and $\sqrt{0.81} = 0.9$.
? In DPM-Solver, $\alpha_t$ appears. Is it the same as $\alpha_n$ here?
- [ ] Yes :: The letter is reused for a different idea.
- [x] No: there it is the total signal kept after many steps :: Right. Here that would be $\sqrt{\bar\alpha_n}$.
hint: See the note on this page.
answer: No. There $\alpha_t$ is the overall scale of the clean picture, which is $\sqrt{\bar\alpha_n}$ here.
```

```recall
? What is $\alpha_n$ in the noising process, and why is the old picture multiplied by $\sqrt{\alpha_n}$?
$\alpha_n = 1 - \beta_n$, the share of variance kept. Multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.
? Why must you be careful with $\alpha$ when reading about DPM-Solver?
There, $\alpha_t$ is the total signal scale over many steps (like $\sqrt{\bar\alpha_n}$), not the one-step $\alpha_n$.
```
