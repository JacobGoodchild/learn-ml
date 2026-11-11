---
id: diffusion-step
title: One noising step, $q(x_n \mid x_{n-1})$
summary: Shrink the picture by $\sqrt{\alpha_n}$, then add fresh noise of variance $\beta_n$ to every pixel.
colour: diffusion
level: 4
needs: [conditional-distribution, isotropic-gaussian, alpha-n-ddpm, beta-n-ddpm, standard-normal, x-n-ddpm]
related: [variance-preserving, forward-process]
entryPoints:
  - label: as a recipe
    section: as-a-recipe
  - label: an example
    section: one-pixel-one-step
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```formula The step as a distribution
\p{conditional-distribution}{q(x_n \mid x_{n-1})} = \p{isotropic-gaussian}{\mathcal N}\big(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,\p{x-n-ddpm}{x_{n-1}},\ \p{beta-n-ddpm}{\beta_n}\,\p{identity-matrix}{I}\big)
---
In words: the next picture is a bell curve centred on the slightly shrunk current picture.
$\p{x-n-ddpm}{x_{n-1}}$ :: the picture so far (known)
$\p{alpha-n-ddpm}{\sqrt{\alpha_n}}$ :: shrinks it very slightly; this is the centre
$\p{beta-n-ddpm}{\beta_n}$ :: variance of the new noise
$\p{identity-matrix}{I}$ :: every pixel gets its own, independent noise
```

```formula As a recipe
x_n = \sqrt{\alpha_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n, \qquad \p{standard-normal}{\epsilon_n \sim \mathcal N(0, I)}
---
In words: draw standard noise, scale it to variance $\beta_n$, add it on.
$\p{standard-normal}{\epsilon_n}$ :: fresh standard normal noise, one number per pixel
$\sqrt{\beta_n}$ :: turns variance 1 into variance $\beta_n$
```

Both say the same thing. The recipe makes one sample; the $\mathcal N(\dots)$ form describes all the samples it could make.

```example One pixel, one step
A pixel is $x_{n-1} = 0.8$. Take $\beta_n = 0.01$, so $\alpha_n = 0.99$. The computer draws $\epsilon_n = -1.2$:

$$x_n = \sqrt{0.99} \times 0.8 + \sqrt{0.01} \times (-1.2) \approx 0.796 - 0.12 = 0.676$$
```

## Check yourself {#check}

```check
? A pixel has $x_{n-1} = 0.5$, $\beta_n = 0.04$, and the noise draw is $\epsilon_n = 1$. What is $x_n$? (3 decimal places)
= 0.690 ± 0.002
wrong: Use $x_n = \sqrt{1 - \beta_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n$. Both need square roots.
hint: $\sqrt{0.96} \times 0.5 + \sqrt{0.04} \times 1$.
answer: $\sqrt{0.96} \approx 0.980$, so $0.490 + 0.2 = 0.690$.
? What is the *mean* of $x_n$, given $x_{n-1}$?
- [x] $\sqrt{\alpha_n}\,x_{n-1}$ :: Right: the first slot of $\mathcal N$ is the mean.
- [ ] $x_{n-1}$ :: Close, but it is shrunk by $\sqrt{\alpha_n}$ first.
- [ ] $\beta_n$ :: That is the second slot: the variance.
hint: First slot of $\mathcal N$: mean. Second: variance.
answer: $\sqrt{\alpha_n}\,x_{n-1}$.
? Why $\sqrt{\beta_n}\,\epsilon_n$ and not $\beta_n\,\epsilon_n$?
- [x] $\epsilon_n$ has variance 1, and scaling by $\sqrt{\beta_n}$ gives variance $\beta_n$ :: Right: scaling multiplies the variance by the square.
- [ ] To make the noise bigger :: That is a side effect, not the reason.
- [ ] It is a typo :: It is correct; the formula asks for variance $\beta_n$.
hint: Scaling by $a$ multiplies the variance by $a^2$.
answer: We want variance $\beta_n$. Scaling variance-1 noise by $\sqrt{\beta_n}$ gives $(\sqrt{\beta_n})^2 = \beta_n$.
```

```recall
? Write one noising step as a recipe, and say what each part does.
$x_n = \sqrt{\alpha_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n$ with $\epsilon_n \sim \mathcal N(0, I)$: shrink the old picture slightly, then add fresh independent noise of variance $\beta_n$ to every pixel.
? What are the mean and the variance of $x_n$ given $x_{n-1}$?
Mean $\sqrt{\alpha_n}\,x_{n-1}$; variance $\beta_n$ on each pixel, independently ($\beta_n I$).
```
