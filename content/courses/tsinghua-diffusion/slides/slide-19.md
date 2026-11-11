---
id: slide-19
title: Diffusion probabilistic models: adding noise
number: 19
summary: A diffusion model starts by destroying pictures. It adds a little noise, again and again, until only static is left. This slide writes that process down.
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: The forward process and the noise schedule used in the visual (β from 0.0001 to 0.02 over 1000 steps)
  - title: Score-Based Generative Modeling through Stochastic Differential Equations
    authors: Song, Sohl-Dickstein, Kingma, Kumar, Ermon and Poole, ICLR 2021
    url: https://arxiv.org/abs/2011.13456
    note: The slide's demo images come from this paper; they are not reproduced here
---

The slide makes one claim: the [diffusion process](c:forward-process) gradually adds noise to data, and it is described by a [Markov chain](c:markov-chain). Click any part of a formula to open the idea behind it.

```formula The whole noising process, as one chain
\p{forward-process}{q(x_0,\dots,x_N)} = \p{probability-distribution}{q(x_0)}\,\p{diffusion-step}{q(x_1\mid x_0)}\cdots \p{diffusion-step}{q(x_N\mid x_{N-1})}
```

```formula One step of noise (the "transition")
\p{diffusion-step}{q(x_n\mid x_{n-1})} = \p{isotropic-gaussian}{\mathcal{N}}\!\left(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,\p{x-n-ddpm}{x_{n-1}},\ \p{beta-n-ddpm}{\beta_n}\, \p{identity-matrix}{I}\right), \qquad \p{alpha-n-ddpm}{\alpha_n = 1-\beta_n}
```

```formula Where it ends up
\p{x-n-ddpm}{x_N} \approx \p{pure-noise-endpoint}{\mathcal{N}(0, I)}
```

## What the slide is saying {#reading}

Take a clean picture, $\p{x-n-ddpm}{x_0}$. Make a slightly noisier copy, $x_1$. Make a slightly noisier copy of *that*, $x_2$, and so on for $N$ steps. Each copy only depends on the one just before it, which is what makes this a [Markov chain](c:markov-chain). After enough steps the picture is gone and what is left looks like a draw from a standard bell curve for every pixel.

The model's real job comes later: learning to run this chain **backwards**, turning static into pictures. That is slide 31. This slide is only the forward, destroying half, which has no learning in it at all.

```visual noising
```

## Which meaning each symbol has here {#notation}

Some of these letters mean something different on later slides. On this slide:

```notation
$n$ :: the step number, counting $0, 1, 2, \dots, N$. Later slides (25, 54, 56) use continuous time $t$ instead.
$N$ :: the total number of steps. In the original paper $N = 1000$.
$\alpha_n$ :: how much of the previous picture one step keeps (as a variance). Not the $\alpha_t$ of slide 54, which is a total over many steps.
$\beta_n$ :: how much new noise one step adds (as a variance).
$q$ :: the noising process we chose. The model, $p$, appears on slide 31.
$I$ :: the identity matrix: every pixel gets its own independent noise of the same size.
```
