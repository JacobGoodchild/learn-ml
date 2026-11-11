---
id: alpha-bar-n
title: $\bar\alpha_n$: how much of the picture survives
summary: Multiply all the $\alpha$'s up to step $n$. That product says how much of the clean picture is left, and lets you jump straight from $x_0$ to $x_n$.
colour: diffusion
level: 5
needs: [alpha-n-ddpm, product-notation, diffusion-step, variance-preserving]
related: [pure-noise-endpoint]
entryPoints:
  - label: the shortcut from x₀ to xₙ
    section: shortcut
  - label: two steps by hand
    section: two-steps
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Equation 4, q(x_t | x_0) = N(√ᾱ_t x_0, (1 − ᾱ_t) I)
  - title: Analytic-DPM
    authors: Bao, Li, Zhu and Zhang, ICLR 2022
    url: https://arxiv.org/abs/2201.06503
    note: Writes β̄_n = 1 − ᾱ_n, the notation slide 31 uses
---

```formula
\bar\alpha_n = \p{product-notation}{\prod_{i=1}^{n}} \p{alpha-n-ddpm}{\alpha_i}, \qquad q(x_n \mid x_0) = \p{isotropic-gaussian}{\mathcal N}\big(\sqrt{\bar\alpha_n}\,x_0,\ (1-\bar\alpha_n)\,I\big)
```

This does not appear on slide 19 itself, but it is the key to understanding why $x_N \approx \mathcal N(0, I)$, and slides 31 and 42 use it constantly.

## In words {#aloud}

"Alpha-bar $n$ is the product of all the alphas up to $n$. Given the clean picture, the picture after $n$ steps is centred on $\sqrt{\bar\alpha_n}$ times the clean picture, with variance $1 - \bar\alpha_n$ on each pixel."

## Two steps by hand {#two-steps}

Do two steps of the [recipe](c:diffusion-step), starting from $x_0$:

$$x_2 = \sqrt{\alpha_2}\big(\sqrt{\alpha_1}\,x_0 + \sqrt{\beta_1}\,\epsilon_1\big) + \sqrt{\beta_2}\,\epsilon_2 = \sqrt{\alpha_1\alpha_2}\,x_0 + \underbrace{\sqrt{\alpha_2\beta_1}\,\epsilon_1 + \sqrt{\beta_2}\,\epsilon_2}_{\text{noise}}$$

The picture part is scaled by $\sqrt{\alpha_1\alpha_2} = \sqrt{\bar\alpha_2}$. The noise part is two independent noises added, so its variance is $\alpha_2\beta_1 + \beta_2 = \alpha_2(1 - \alpha_1) + (1 - \alpha_2) = 1 - \alpha_1\alpha_2 = 1 - \bar\alpha_2$. The pattern carries on for any $n$.

## The shortcut from $x_0$ to $x_n$ {#shortcut}

So you never need to run the steps one by one. To get the picture after 600 steps, compute $\bar\alpha_{600}$ once and use

$$x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\epsilon, \qquad \epsilon \sim \mathcal N(0, I)$$

This is how the noising visual on slide 19 works, and it is what makes training fast: pick a random $n$, jump straight there.

Notice the two shares again: $\bar\alpha_n$ of the variance is picture, $1 - \bar\alpha_n$ is noise. They add to 1, as the [variance-preserving](c:variance-preserving) design promised. Slide 31 gives the noise share its own name: $\bar\beta_n = 1 - \bar\alpha_n$.

## How fast the picture fades {#fade}

With the DDPM schedule ($\beta$ from $0.0001$ to $0.02$ over 1000 steps):

```notation
$n = 100$ :: $\bar\alpha_n \approx 0.897$, so about 95% of the picture's scale is left ($\sqrt{0.897} \approx 0.947$).
$n = 250$ :: $\bar\alpha_n \approx 0.524$: picture and noise roughly balanced.
$n = 500$ :: $\bar\alpha_n \approx 0.079$: only about 28% of the picture's scale left.
$n = 1000$ :: $\bar\alpha_n \approx 0.00004$: about 0.6% left. Pure noise, for all practical purposes.
```

```visual noising
```

## Check yourself {#check}

```check
? $\alpha_1 = 0.9$, $\alpha_2 = 0.8$. What is $\bar\alpha_2$?
= 0.72 ± 0.0001
wrong: $\bar\alpha_2$ is the product of the alphas, not their sum or average.
hint: $0.9 \times 0.8$.
answer: $0.9 \times 0.8 = 0.72$.
? With $\bar\alpha_n = 0.64$, a pixel was $x_0 = 1$ and the noise draw is $\epsilon = 0.5$. What is $x_n$?
= 1.1 ± 0.0001
wrong: Use $x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\epsilon$.
hint: $\sqrt{0.64} = 0.8$ and $\sqrt{0.36} = 0.6$.
answer: $0.8 \times 1 + 0.6 \times 0.5 = 0.8 + 0.3 = 1.1$.
? Why does $\bar\alpha_n$ keep shrinking as $n$ grows?
- [x] It is a product of numbers each a little less than 1 :: Right: each extra factor takes away a bit more.
- [ ] Because $\beta_n$ shrinks :: In the DDPM schedule $\beta_n$ actually grows.
- [ ] Because the network learns to remove the picture :: There is no network in the forward process.
hint: What is $\alpha_i$ always slightly less than?
answer: Each $\alpha_i = 1 - \beta_i$ is a little under 1, and multiplying by more of them can only make the product smaller.
```

```recall
? What is $\bar\alpha_n$, and what does it tell you?
The product $\alpha_1\alpha_2\cdots\alpha_n$. It is the share of variance that is still the clean picture after $n$ steps; $1 - \bar\alpha_n$ is the share that is noise.
? Write $x_n$ directly in terms of $x_0$.
$x_n = \sqrt{\bar\alpha_n}\,x_0 + \sqrt{1 - \bar\alpha_n}\,\epsilon$ with $\epsilon \sim \mathcal N(0, I)$, so $q(x_n \mid x_0) = \mathcal N(\sqrt{\bar\alpha_n}x_0, (1 - \bar\alpha_n)I)$.
? Why is the jump straight from $x_0$ to $x_n$ useful in practice?
It lets training pick any step $n$ and make $x_n$ in one go, instead of running $n$ separate noising steps.
```
