---
id: alpha-bar-n
title: $\bar\alpha_n$: how much of the picture survives
summary: Multiply the $\alpha$'s up to step $n$. That says how much of the clean picture is left, and lets you jump straight from $x_0$ to $x_n$.
colour: diffusion
level: 5
needs: [alpha-n-ddpm, product-notation, diffusion-step, variance-preserving]
related: [pure-noise-endpoint]
entryPoints:
  - label: the shortcut
    section: jump-straight-to-step
  - label: two steps by hand
    section: two-steps-by-hand
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
  - title: Analytic-DPM
    authors: Bao, Li, Zhu and Zhang, ICLR 2022
    url: https://arxiv.org/abs/2201.06503
---

```formula How much survives $n$ steps
\bar\alpha_n = \p{product-notation}{\prod_{i=1}^{n}} \p{alpha-n-ddpm}{\alpha_i}
---
In words: multiply together the share kept at every step so far.
$\bar\alpha_n$ :: share of the variance that is still the clean picture after $n$ steps
$1 - \bar\alpha_n$ :: share that is noise (sometimes written $\bar\beta_n$)
```

```formula Jump straight to step $n$
x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\p{standard-normal}{\epsilon}
---
In words: no need to run $n$ steps; one formula gets you there.
$\sqrt{\bar\alpha_n}$ :: how much of the clean picture is left
$\p{standard-normal}{\epsilon}$ :: one draw of standard noise
```

This shortcut is what the noising visual uses, and it makes training fast: pick any step, jump straight there.

```example Two steps by hand
$$x_2 = \sqrt{\alpha_2}\big(\sqrt{\alpha_1}\,x_0 + \sqrt{\beta_1}\,\epsilon_1\big) + \sqrt{\beta_2}\,\epsilon_2 = \sqrt{\alpha_1\alpha_2}\,x_0 + \text{noise}$$

The noise variance is $\alpha_2\beta_1 + \beta_2 = 1 - \alpha_1\alpha_2 = 1 - \bar\alpha_2$. Same pattern for any $n$.
```

```keypoint How fast it fades
With a typical schedule: after 100 steps about 95% of the picture's scale is left; after 250, about 72%; after 500, about 28%; after 1000, about 0.6%.
```

```visual noising See it fade
```

## Check yourself {#check}

```check
? $\alpha_1 = 0.9$, $\alpha_2 = 0.8$. What is $\bar\alpha_2$?
= 0.72 ± 0.0001
wrong: Multiply the alphas; don't add them.
hint: $0.9 \times 0.8$.
answer: $0.72$.
? $\bar\alpha_n = 0.64$, $x_0 = 1$ and $\epsilon = 0.5$. What is $x_n$?
= 1.1 ± 0.0001
wrong: Use $x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\epsilon$.
hint: $\sqrt{0.64} = 0.8$ and $\sqrt{0.36} = 0.6$.
answer: $0.8 + 0.3 = 1.1$.
? Why does $\bar\alpha_n$ keep shrinking as $n$ grows?
- [x] It is a product of numbers each a little under 1 :: Right.
- [ ] Because $\beta_n$ shrinks :: In a typical schedule $\beta_n$ grows.
- [ ] A network removes the picture :: There is no network here.
hint: What is each $\alpha_i$ slightly less than?
answer: Each extra factor below 1 makes the product smaller.
```

```recall
? What is $\bar\alpha_n$, and what does it tell you?
The product $\alpha_1\alpha_2\cdots\alpha_n$: the share of variance still from the clean picture after $n$ steps; $1 - \bar\alpha_n$ is noise.
? Write $x_n$ directly in terms of $x_0$.
$x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\epsilon$ with $\epsilon \sim \mathcal N(0, I)$.
? Why is the jump straight from $x_0$ to $x_n$ useful in practice?
Training can pick any step and make $x_n$ in one go.
```
