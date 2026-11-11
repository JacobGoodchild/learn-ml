---
id: isotropic-gaussian
title: $\mathcal N(\mu, \sigma^2 I)$: a bell curve on every pixel
summary: A normal distribution for a whole vector, where every entry gets its own independent noise of the same size.
colour: probability
level: 4
needs: [normal-distribution, identity-matrix, image-as-vector, independence]
related: [standard-normal]
entryPoints:
  - label: one bell curve per pixel
    section: idea
  - label: what the I is doing
    section: identity
---

```formula
x \sim \p{normal-distribution}{\mathcal N}\big(\p{expectation}{\mu},\ \p{variance}{\sigma^2}\,\p{identity-matrix}{I}\big)
```

## In words {#aloud}

"The vector $x$ is normally distributed with mean vector $\mu$ and covariance $\sigma^2$ times the identity." In plain terms: every entry $x_i$ of the vector is drawn from its own bell curve $\mathcal N(\mu_i, \sigma^2)$, all independently.

## One bell curve per pixel {#idea}

When $x$ is a picture, the mean $\mu$ is a whole picture too: the "centre" each pixel is pulled towards. Every pixel then gets its own independent wobble of the same size $\sigma^2$. Noise like this has no pattern; it is the fine static you see in the noising visual on slide 19.

The word **isotropic** means "the same in every direction": the noise has no favourite pixel and no favourite direction.

## What the $I$ is doing {#identity}

For a vector, the spread is described by a matrix called the **covariance matrix**. Its diagonal holds the variance of each entry; the rest says how entries move together. Writing $\sigma^2 I$ means:

- the diagonal is all $\sigma^2$: every pixel has variance $\sigma^2$;
- everything else is 0: no two pixels move together, so they are [independent](c:independence).

The covariance matrix gets its own page in Path 2 (slide 42 uses a more general one). For slide 19 you only need the $\sigma^2 I$ case.

## Example {#example}

A tiny 3-pixel "picture" with mean $\mu = (0.5, -0.2, 0.9)$ and $\sigma^2 I$ with $\sigma^2 = 0.01$. One draw might be $(0.57, -0.26, 0.88)$: each pixel nudged by roughly $\sigma = 0.1$, each in its own random direction.

## Check yourself {#check}

```check
? $x \sim \mathcal N(\mu, 0.04\,I)$ for a picture. What is the standard deviation of the noise on any one pixel?
= 0.2 ± 0.0001
wrong: $0.04$ is the variance of each pixel. Take the square root.
hint: The number in front of $I$ is each pixel's variance.
answer: Each pixel has variance $0.04$, so standard deviation $0.2$.
? What do the zeros off the diagonal of $\sigma^2 I$ tell you?
- [x] The noise on different pixels is independent :: Right: no two pixels move together.
- [ ] Most pixels get no noise :: Every pixel gets noise: that is the diagonal.
- [ ] The mean is zero :: The mean is the first slot, $\mu$; the matrix only describes spread.
hint: Off-diagonal entries describe how pairs of entries move together.
answer: That pairs of pixels do not move together: the noise on each pixel is independent of every other.
```

```recall
? Describe in words how to draw a sample from $\mathcal N(\mu, \sigma^2 I)$ for a picture.
For every pixel separately, start at that pixel's mean and add independent normal noise with variance $\sigma^2$.
? What does the identity matrix say about the noise in $\mathcal N(\mu, \sigma^2 I)$?
Every pixel has the same variance $\sigma^2$ (the diagonal), and different pixels are independent (the zeros).
```
