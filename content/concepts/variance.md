---
id: variance
title: Variance
summary: How spread out a random variable is: the average squared distance from the mean.
colour: spread
level: 2
needs: [expectation]
related: [standard-deviation]
entryPoints:
  - label: why square
    section: why-square
---

```formula Average squared distance from the mean
\mathrm{Var}(X) = \p{expectation}{\mathbb{E}}\big[(X - \p{expectation}{\mu})^2\big]
---
In words: how far values typically land from the centre, measured in squared units. Often written $\sigma^2$.
$\p{expectation}{\mathbb{E}[\dots]}$ :: "on average"
$\p{expectation}{\mu}$ :: the mean: the centre we measure from
$(X - \mu)^2$ :: how far one value lands, squared
```

```keypoint Why square
Without squaring, distances above and below the mean cancel to 0. Squaring makes them all positive, and it makes variances of independent things simply [add up](c:scaling-and-adding). Diffusion models rely on exactly this.
```

```example Same mean, different spread
$X$ is $-1$ or $+1$: variance $1$. $Y$ is $-3$ or $+3$: variance $9$. Three times as far, nine times the variance.
```

## Check yourself {#check}

```check
? $X$ is 2 or 6, each with probability $\frac12$. What is $\mathrm{Var}(X)$?
= 4 ± 0.0001
wrong: Find the mean first, then average the squared distances from it.
hint: The mean is 4. Each value is 2 away.
answer: $(2-4)^2 = (6-4)^2 = 4$, so the variance is 4.
? Why not measure spread by averaging $X - \mu$?
- [x] It always comes out as 0 :: Right: the ups and downs cancel exactly.
- [ ] It would be too big :: The opposite: it cancels to nothing.
- [ ] It would have the wrong units :: The units are fine; it is always zero.
hint: What is the average of $X$, minus $\mu$?
answer: $\mathbb{E}[X - \mu] = 0$ for every random variable.
```

```recall
? What does variance measure, and what is its formula in words?
How spread out a random variable is: the average squared distance from the mean.
? Give two reasons the distance is squared.
Without squaring, distances cancel to 0. And squared distances make variances of independent variables add up neatly.
```
