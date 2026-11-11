---
id: diffusion-step
title: One noising step, $q(x_n \mid x_{n-1})$
summary: Take the previous picture, shrink it by $\sqrt{\alpha_n}$, and add fresh noise with variance $\beta_n$ on every pixel.
colour: diffusion
level: 4
needs: [conditional-distribution, isotropic-gaussian, alpha-n-ddpm, beta-n-ddpm, standard-normal, x-n-ddpm]
related: [variance-preserving, forward-process]
entryPoints:
  - label: as a recipe
    section: recipe
  - label: as a distribution
    section: aloud
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Equation 2 (with T, t in place of N, n)
---

```formula
\p{conditional-distribution}{q(x_n \mid x_{n-1})} = \p{isotropic-gaussian}{\mathcal N}\big(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,\p{x-n-ddpm}{x_{n-1}},\ \p{beta-n-ddpm}{\beta_n}\,\p{identity-matrix}{I}\big)
```

## In words {#aloud}

"Given the previous picture $x_{n-1}$, the next picture $x_n$ is normally distributed, centred on $\sqrt{\alpha_n}$ times the previous picture, with variance $\beta_n$ on every pixel, independently."

## Piece by piece {#breakdown}

```breakdown
q(x_n \mid x_{n-1}) = \mathcal N\big(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,\p{x-n-ddpm}{x_{n-1}},\ \p{beta-n-ddpm}{\beta_n}\,\p{identity-matrix}{I}\big)
---
x-n-ddpm | x_{n-1} | The picture so far. It is *given*: we already have it.
alpha-n-ddpm | \sqrt{\alpha_n} | Shrink it very slightly. This is the centre of the new bell curve.
beta-n-ddpm | \beta_n | The variance of the fresh noise.
identity-matrix | I | Same amount of noise on every pixel, and each pixel's noise independent of the others.
```

## As a recipe {#recipe}

The same thing, written as instructions for a computer:

$$x_n = \sqrt{\alpha_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n, \qquad \epsilon_n \sim \mathcal N(0, I)$$

Draw a fresh [standard normal](c:standard-normal) number $\epsilon_n$ for every pixel, scale it by $\sqrt{\beta_n}$ so its variance is $\beta_n$, and add it to the slightly shrunk picture. The two forms say exactly the same thing: the recipe makes a sample, the $\mathcal N(\dots)$ form describes all the samples it could make.

## Example {#example}

One pixel has value $x_{n-1} = 0.8$, and $\beta_n = 0.01$, so $\alpha_n = 0.99$. The computer draws $\epsilon_n = -1.2$. Then

$$x_n = \sqrt{0.99} \times 0.8 + \sqrt{0.01} \times (-1.2) \approx 0.796 - 0.12 = 0.676$$

A different draw of $\epsilon_n$ would give a different $x_n$. On average (since $\epsilon_n$ has mean 0), $x_n$ would be $0.796$.

## Check yourself {#check}

```check
? A pixel has $x_{n-1} = 0.5$, $\beta_n = 0.04$, and the noise draw is $\epsilon_n = 1$. What is $x_n$? (Give 3 decimal places.)
= 0.690 ± 0.002
wrong: Use $x_n = \sqrt{1 - \beta_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n$. Both $\beta_n$ and $\alpha_n$ need square roots.
hint: $\sqrt{0.96} \times 0.5 + \sqrt{0.04} \times 1$.
answer: $\sqrt{0.96} \approx 0.980$, so $0.980 \times 0.5 + 0.2 \times 1 \approx 0.490 + 0.2 = 0.690$.
? In $q(x_n \mid x_{n-1}) = \mathcal N(\sqrt{\alpha_n}\,x_{n-1}, \beta_n I)$, what is the *mean* of $x_n$?
- [x] $\sqrt{\alpha_n}\,x_{n-1}$ :: Right: the first slot of $\mathcal N$ is always the mean.
- [ ] $x_{n-1}$ :: Close, but the old picture is shrunk by $\sqrt{\alpha_n}$ first.
- [ ] $\beta_n$ :: That is in the second slot: the variance.
hint: First slot of $\mathcal N$: mean. Second: variance.
answer: $\sqrt{\alpha_n}\,x_{n-1}$: the slightly shrunk previous picture.
? Why does the recipe use $\sqrt{\beta_n}\,\epsilon_n$ rather than $\beta_n\,\epsilon_n$?
- [x] Because $\epsilon_n$ has variance 1, and multiplying by $\sqrt{\beta_n}$ gives variance $\beta_n$ :: Right: the variance gets multiplied by the square of the scale.
- [ ] To make the noise bigger :: For $\beta_n < 1$, $\sqrt{\beta_n} > \beta_n$, but that is a side effect, not the reason.
- [ ] It is a typo :: It is correct; the formula puts the variance $\beta_n$ inside $\mathcal N$.
hint: Scaling rule for variances.
answer: The formula asks for noise with *variance* $\beta_n$. Since $\epsilon_n$ has variance 1, scaling by $\sqrt{\beta_n}$ gives variance $(\sqrt{\beta_n})^2 = \beta_n$.
```

```recall
? Write one noising step as a recipe, and say what each part does.
$x_n = \sqrt{\alpha_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n$ with $\epsilon_n \sim \mathcal N(0, I)$: shrink the old picture slightly, then add fresh independent noise of variance $\beta_n$ to every pixel.
? What are the mean and the variance of $x_n$ given $x_{n-1}$?
Mean $\sqrt{\alpha_n}\,x_{n-1}$; variance $\beta_n$ on each pixel, independently ($\beta_n I$).
```
