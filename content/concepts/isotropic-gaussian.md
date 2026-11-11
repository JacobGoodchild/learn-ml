---
id: isotropic-gaussian
title: $\mathcal N(\mu, \sigma^2 I)$: a bell curve on every pixel
summary: A normal distribution for a whole picture: every pixel gets its own independent noise of the same size.
colour: probability
level: 4
needs: [normal-distribution, identity-matrix, image-as-vector, independence]
related: [standard-normal]
entryPoints:
  - label: what the I does
    section: what-the-does
---

```formula A bell curve for every pixel
x \sim \p{normal-distribution}{\mathcal N}\big(\p{expectation}{\mu},\ \p{variance}{\sigma^2}\,\p{identity-matrix}{I}\big)
---
In words: each pixel $x_i$ is drawn from its own bell curve $\mathcal N(\mu_i, \sigma^2)$, independently of the others.
$x$ :: a whole picture, as a vector
$\p{expectation}{\mu}$ :: a whole picture too: the centre each pixel is pulled towards
$\p{variance}{\sigma^2}$ :: the variance on every pixel
$\p{identity-matrix}{I}$ :: same size on every pixel, no two pixels linked
```

```keypoint What the $I$ does
The spread of a vector is described by a matrix. Its diagonal holds each pixel's variance; the rest says which pixels move together. $\sigma^2 I$ has $\sigma^2$ all down the diagonal and zeros elsewhere: equal noise everywhere, and every pixel [independent](c:independence).
```

```example A 3-pixel picture
Mean $\mu = (0.5, -0.2, 0.9)$, variance $\sigma^2 = 0.01$, so each pixel moves by about $\sigma = 0.1$. One draw: $(0.57, -0.26, 0.88)$.
```

## Check yourself {#check}

```check
? $x \sim \mathcal N(\mu, 0.04\,I)$. What is the standard deviation of the noise on any one pixel?
= 0.2 ± 0.0001
wrong: $0.04$ is each pixel's variance. Take the square root.
hint: The number in front of $I$ is the variance.
answer: $\sqrt{0.04} = 0.2$.
? What do the zeros off the diagonal of $\sigma^2 I$ tell you?
- [x] The noise on different pixels is independent :: Right: no two pixels move together.
- [ ] Most pixels get no noise :: Every pixel gets noise: that is the diagonal.
- [ ] The mean is zero :: The mean is $\mu$; the matrix only describes spread.
hint: Off-diagonal entries say how pairs of pixels move together.
answer: No two pixels move together: each pixel's noise is independent.
```

```recall
? Describe in words how to draw a sample from $\mathcal N(\mu, \sigma^2 I)$ for a picture.
For every pixel separately, start at that pixel's mean and add independent normal noise with variance $\sigma^2$.
? What does the identity matrix say about the noise in $\mathcal N(\mu, \sigma^2 I)$?
Every pixel has the same variance $\sigma^2$, and different pixels are independent.
```
