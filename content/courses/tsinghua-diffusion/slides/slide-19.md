---
id: slide-19
title: Adding noise to a picture
number: 19
summary: Before a model can turn noise into pictures, we need a precise way of turning pictures into noise.
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
  - title: Score-Based Generative Modeling through Stochastic Differential Equations
    authors: Song, Sohl-Dickstein, Kingma, Kumar, Ermon and Poole, ICLR 2021
    url: https://arxiv.org/abs/2011.13456
---

Take a picture and add a tiny amount of random noise. Do it again, a thousand times. The picture slowly dissolves into static.

```formula One step of noise
\p{diffusion-step}{q(x_n\mid x_{n-1})} = \p{isotropic-gaussian}{\mathcal{N}}\!\left(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,\p{x-n-ddpm}{x_{n-1}},\ \p{beta-n-ddpm}{\beta_n}\, \p{identity-matrix}{I}\right)
---
In words: shrink the picture very slightly, then add a little noise to every pixel.
$\p{x-n-ddpm}{x_{n-1}}$ :: the picture so far
$\p{x-n-ddpm}{x_n}$ :: the next picture, slightly noisier
$\p{beta-n-ddpm}{\beta_n}$ :: how much noise this step adds, e.g. $0.01$
$\p{alpha-n-ddpm}{\alpha_n}$ :: how much of the picture this step keeps: $\alpha_n = 1 - \beta_n$
$\p{identity-matrix}{I}$ :: the same amount of noise on every pixel, independently
```

```visual noising Watch a picture dissolve
```

```formula The whole run, step by step
\p{forward-process}{q(x_0,\dots,x_N)} = \p{probability-distribution}{q(x_0)}\,\p{diffusion-step}{q(x_1\mid x_0)}\cdots \p{diffusion-step}{q(x_N\mid x_{N-1})}
---
$\p{probability-distribution}{q(x_0)}$ :: how likely each real, clean picture is
$N$ :: the number of steps, usually $1000$
```

Each step only looks at the picture just before it, so the whole run is a [Markov chain](c:markov-chain): one simple step, repeated.

```formula Where it ends up
\p{x-n-ddpm}{x_N} \approx \p{pure-noise-endpoint}{\mathcal{N}(0, I)}
---
$\p{x-n-ddpm}{x_N}$ :: the last picture
$\p{pure-noise-endpoint}{\mathcal{N}(0, I)}$ :: pure static: every pixel a fresh bell-curve value with mean 0 and variance 1
```

```keypoint Why destroy pictures
Every picture ends up as the same kind of static. So if a model learns to undo one small step, it can start from fresh static and work backwards to a brand new picture.
```
