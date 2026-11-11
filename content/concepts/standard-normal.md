---
id: standard-normal
title: The standard normal, $\mathcal N(0, 1)$
summary: The bell curve with mean 0 and variance 1. Every other normal distribution is a stretched and shifted copy of it.
colour: probability
level: 3
needs: [normal-distribution, scaling-and-adding]
related: [isotropic-gaussian]
---

```formula
\epsilon \sim \p{normal-distribution}{\mathcal N}(0, 1) \quad\Longrightarrow\quad \mu + \sigma\,\epsilon \sim \mathcal N(\mu, \sigma^2)
```

## In words {#aloud}

"If $\epsilon$ is a standard normal, then $\mu$ plus $\sigma$ times $\epsilon$ is normal with mean $\mu$ and variance $\sigma^2$."

## The idea {#idea}

The **standard normal** is the simplest bell curve: centred at 0, with spread 1. You can make any other normal distribution from it: stretch by $\sigma$ (which [multiplies the variance](c:scaling-and-adding) by $\sigma^2$), then shift by $\mu$.

This is how computers make noise. They produce standard normal numbers, then scale and shift them. The slides always call these raw noise numbers $\epsilon$ (Greek "epsilon"), and later slides train a network to guess $\epsilon$.

## Example {#example}

A computer draws $\epsilon = -0.5$. To turn it into a sample from $\mathcal N(10, 4)$, multiply by $\sigma = 2$ and add $\mu = 10$: $10 + 2 \times (-0.5) = 9$.

## Check yourself {#check}

```check
? $\epsilon = 1.5$ is a standard normal draw. What is the matching draw from $\mathcal N(3, 0.25)$?
= 3.75 ± 0.0001
wrong: Multiply by the standard deviation (not the variance), then add the mean.
hint: The standard deviation is $\sqrt{0.25} = 0.5$.
answer: $3 + 0.5 \times 1.5 = 3.75$.
? If $\epsilon \sim \mathcal N(0,1)$, what is the distribution of $\sqrt{\beta}\,\epsilon$?
- [x] $\mathcal N(0, \beta)$ :: Right: scaling by $\sqrt\beta$ multiplies the variance by $\beta$.
- [ ] $\mathcal N(0, \sqrt\beta)$ :: The second slot is a variance, and scaling by $\sqrt\beta$ multiplies the variance by $(\sqrt\beta)^2 = \beta$.
- [ ] $\mathcal N(\sqrt\beta, 1)$ :: Multiplying does not move the centre away from 0.
hint: The variance is multiplied by the square of the scale factor.
answer: $\mathcal N(0, \beta)$. This is exactly how a noising step makes noise of variance $\beta_n$.
```

```recall
? How do you turn a standard normal draw $\epsilon$ into a draw from $\mathcal N(\mu, \sigma^2)$?
Multiply by the standard deviation $\sigma$, then add the mean $\mu$: $\mu + \sigma\epsilon$.
? What do the diffusion slides usually call a standard normal noise sample?
$\epsilon$ (epsilon).
```
