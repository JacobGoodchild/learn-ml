---
id: variance
title: Variance
summary: How spread out a random variable is. The average squared distance from the mean.
colour: spread
level: 2
needs: [expectation]
related: [standard-deviation]
entryPoints:
  - label: average squared distance
    section: idea
  - label: why square
    section: why-square
---

```formula
\mathrm{Var}(X) = \p{expectation}{\mathbb{E}}\big[(X - \p{expectation}{\mu})^2\big]
```

## In words {#aloud}

"The variance of $X$ is the expected value of the squared distance between $X$ and its mean $\mu$." It is written $\mathrm{Var}(X)$, or $\sigma^2$ for short.

## Piece by piece {#breakdown}

```breakdown
\mathrm{Var}(X) = \p{expectation}{\mathbb{E}}\big[(X - \p{expectation}{\mu})^2\big]
---
expectation | \mu | The mean of $X$: the centre we measure distances from.
expectation | \mathbb{E}[\dots] | "On average": take the average of whatever is inside the brackets.
variance | (X-\mu)^2 | How far one value lands from the centre, squared.
```

## The idea {#idea}

Two dice games can have the same average but feel completely different: one always pays out about the same, the other swings wildly. Variance measures the swing. Small variance: values cluster near the mean. Large variance: they scatter far.

## Why square {#why-square}

If we just averaged $X - \mu$, the values above and below the mean would cancel and we would always get 0. Squaring makes every distance positive. It also makes variances behave very nicely when you [add independent random variables](c:scaling-and-adding): they simply add up. That property is exactly what the diffusion slides rely on.

The downside is units: if $X$ is in centimetres, the variance is in centimetres squared. Taking the square root fixes this, giving the [standard deviation](c:standard-deviation).

## Example {#example}

$X$ is $-1$ or $+1$, each with probability $\frac12$. The mean is 0. Each value is distance 1 from the mean, squared is 1, so $\mathrm{Var}(X) = 1$.

Now $Y$ is $-3$ or $+3$. Same mean, but $\mathrm{Var}(Y) = 9$: three times as far, nine times the variance.

## Check yourself {#check}

```check
? $X$ is 2 or 6, each with probability $\frac12$. What is $\mathrm{Var}(X)$?
= 4 ± 0.0001
wrong: First find the mean, then average the squared distances from it.
hint: The mean is 4. Each value is 2 away from it.
answer: Mean $= 4$. Squared distances are $(2-4)^2 = 4$ and $(6-4)^2 = 4$, so the average is 4.
? Why can't we measure spread by averaging $X - \mu$ instead?
- [x] It always comes out as 0 :: Right: positive and negative distances cancel exactly, by the definition of the mean.
- [ ] It would be too big :: The problem is the opposite: it cancels to nothing.
- [ ] It would have the wrong units :: The units would be fine. The trouble is that it is always zero.
hint: What is the average of $X$, minus $\mu$?
answer: $\mathbb{E}[X - \mu] = \mathbb{E}[X] - \mu = 0$ for every random variable, so it tells you nothing. Squaring stops the cancelling.
```

```recall
? What does variance measure, and what is its formula in words?
How spread out a random variable is: the average of the squared distance from the mean.
? Give two reasons the distance is squared.
Without squaring, distances above and below the mean cancel to 0. And squared distances make variances of independent variables add up neatly.
```
