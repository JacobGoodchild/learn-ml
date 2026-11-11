---
id: standard-normal
title: The standard normal, $\mathcal N(0, 1)$
summary: The bell curve with mean 0 and variance 1. Every other bell curve is a stretched, shifted copy.
colour: probability
level: 3
needs: [normal-distribution, scaling-and-adding]
related: [isotropic-gaussian]
---

```formula Making any bell curve from the standard one
\epsilon \sim \p{normal-distribution}{\mathcal N}(0, 1) \quad\Longrightarrow\quad \mu + \sigma\,\epsilon \sim \mathcal N(\mu, \sigma^2)
---
In words: stretch standard noise by $\sigma$, shift it by $\mu$.
$\epsilon$ :: standard noise ("epsilon"): mean 0, variance 1
$\sigma$ :: the standard deviation you want
$\mu$ :: the mean you want
```

This is how computers make noise: draw standard normal numbers, then scale and shift. A diffusion model is trained to guess $\epsilon$.

```example One draw
The computer draws $\epsilon = -0.5$. For $\mathcal N(10, 4)$: $10 + 2 \times (-0.5) = 9$.
```

## Check yourself {#check}

```check
? $\epsilon = 1.5$ is a standard normal draw. What is the matching draw from $\mathcal N(3, 0.25)$?
= 3.75 ± 0.0001
wrong: Multiply by the standard deviation, not the variance, then add the mean.
hint: $\sigma = \sqrt{0.25} = 0.5$.
answer: $3 + 0.5 \times 1.5 = 3.75$.
? If $\epsilon \sim \mathcal N(0,1)$, what is the distribution of $\sqrt{\beta}\,\epsilon$?
- [x] $\mathcal N(0, \beta)$ :: Right: the variance is multiplied by $(\sqrt\beta)^2 = \beta$.
- [ ] $\mathcal N(0, \sqrt\beta)$ :: The second slot is a variance.
- [ ] $\mathcal N(\sqrt\beta, 1)$ :: Multiplying does not move the centre.
hint: Variance gets the square of the scale factor.
answer: $\mathcal N(0, \beta)$: exactly how a noising step makes noise of variance $\beta_n$.
```

```recall
? How do you turn a standard normal draw $\epsilon$ into a draw from $\mathcal N(\mu, \sigma^2)$?
$\mu + \sigma\epsilon$.
? What do diffusion papers usually call a standard normal noise sample?
$\epsilon$ (epsilon).
```
