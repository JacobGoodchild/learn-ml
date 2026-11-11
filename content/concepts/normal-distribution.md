---
id: normal-distribution
title: The normal distribution
summary: The bell curve. Two numbers pin it down: where its middle is, and how spread out it is.
colour: probability
level: 3
needs: [probability-density, expectation, variance, standard-deviation, exponential-function]
related: [standard-normal, isotropic-gaussian]
entryPoints:
  - label: the bell curve
    section: stretch-and-slide-it
  - label: why the second number is squared
    section: why-the-second-number-is-squared
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```formula Writing a normal distribution
X \sim \p{normal-distribution}{\mathcal N}(\p{expectation}{\mu},\ \p{variance}{\sigma^2})
---
In words: $X$ is drawn from a bell curve with mean $\mu$ and variance $\sigma^2$. ("Gaussian" means the same thing.)
$\p{random-variable}{X}$ :: a random number
$\sim$ :: "is drawn from"
$\p{expectation}{\mu}$ :: the mean: the centre of the bell
$\p{variance}{\sigma^2}$ :: the variance: how spread out it is. Its square root $\sigma$ is the standard deviation
```

```visual bell-curve Stretch and slide it
mu=0 sigma=1
```

```keypoint Two numbers are enough
Every bell curve is the same shape, slid sideways ($\mu$) and stretched ($\sigma$). About 68% of values land within one $\sigma$ of the mean, about 95% within two. A wider curve is lower, because the area under it is always 1.
```

```keypoint Why the second number is squared
When you add independent noise, **variances** add, not standard deviations. Diffusion adds noise again and again, so the variance is the number worth tracking. So $\mathcal N(\dots, \beta_n I)$ means variance $\beta_n$, standard deviation $\sqrt{\beta_n}$.
```

```example Heights
Adult heights $\approx \mathcal N(170, 49)$ in cm. Mean 170, standard deviation $\sqrt{49} = 7$. So about 68% of people are between 163 and 177 cm.
```

## Check yourself {#check}

```check
? A variable follows $\mathcal N(5, 16)$. What is its standard deviation?
= 4 ± 0.001
wrong: The second number is the variance. Take its square root.
hint: The second slot holds $\sigma^2$.
answer: $\sigma = \sqrt{16} = 4$.
? You change $\mathcal N(0, 1)$ to $\mathcal N(0, 4)$. What happens to the peak?
- [ ] It gets taller :: More spread means the same area over a wider range.
- [x] It gets lower, and the curve gets twice as wide :: Right: standard deviation 1 → 2, so width doubles and height halves.
- [ ] It moves right :: Moving is the mean's job, and the mean stayed 0.
hint: Variance 4 means standard deviation 2. The area never changes.
answer: Twice as wide, half as tall (about 0.40 → 0.20).
? Roughly what fraction of values land within two standard deviations of the mean?
- [ ] About 68% :: That is for one standard deviation.
- [x] About 95% :: Right, for every normal distribution.
- [ ] About 50% :: That is how many are below the mean.
hint: One standard deviation catches about two thirds.
answer: About 95%.
```

```recall
? In $\mathcal N(\mu, \sigma^2)$, which number moves the curve and which one stretches it?
$\mu$, the mean, slides it left and right. $\sigma^2$, the variance, sets the spread; $\sigma$ is its square root.
? Why do diffusion formulas write the variance, not the standard deviation, inside $\mathcal N$?
When you add independent noise, variances add. Diffusion adds noise many times, so variance is easy to track.
? Why does a wider bell curve have to be lower?
The total area under a density is always 1.
```
