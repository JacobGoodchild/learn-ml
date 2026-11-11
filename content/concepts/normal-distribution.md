---
id: normal-distribution
title: The normal distribution
summary: The bell curve. Two numbers pin it down completely: where its middle is, and how spread out it is.
colour: probability
level: 3
needs: [probability-density, expectation, variance, standard-deviation, exponential-function]
related: [standard-normal, isotropic-gaussian]
entryPoints:
  - label: the bell curve
    section: shape
  - label: mean and spread
    section: two-numbers
  - label: why the second number is squared
    section: squared
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Uses normal distributions for every noising step
---

```formula
X \sim \p{normal-distribution}{\mathcal N}(\p{expectation}{\mu},\ \p{variance}{\sigma^2})
```

## In words {#aloud}

"$X$ follows a normal distribution with mean $\mu$ and variance $\sigma^2$." The squiggle $\sim$ means "is drawn from" or "follows". The curly $\mathcal N$ stands for *normal*. People also call it a **Gaussian**, after Gauss; the two words mean the same thing.

## Piece by piece {#breakdown}

```breakdown
X \sim \mathcal N(\p{expectation}{\mu},\ \p{variance}{\sigma^2})
---
random-variable | X | A [random variable](c:random-variable): a number that comes out differently each time you "run" it.
expectation | \mu | The **mean**: the centre of the bell, where the curve is highest. Greek *mu*, for "mean".
variance | \sigma^2 | The **variance**: how spread out the values are. Greek *sigma*, squared. Its square root, $\sigma$, is the [standard deviation](c:standard-deviation).
```

## The shape {#shape}

The curve is highest at the mean and falls away symmetrically on both sides. Values near the middle are common; values far out are rare, and get rare *fast*. About 68% of values land within one standard deviation of the mean, and about 95% within two.

The height of the curve is a [probability density](c:probability-density), not a probability. Probabilities are areas under it, and the total area is always exactly 1.

```visual bell-curve
mu=0 sigma=1
```

Try making $\sigma$ bigger. The curve gets wider *and* lower, because the area must stay 1. A bell curve with $\sigma = 2$ is drawn here with exactly twice the width of one with $\sigma = 1$.

## Two numbers are enough {#two-numbers}

Every normal distribution is the same shape, slid sideways and stretched. Sliding is the mean, $\mu$. Stretching is the standard deviation, $\sigma$. Once you know those two numbers, you know everything about the distribution. This is why diffusion models can describe a whole noisy picture with just "a mean" and "a variance".

For the curious, the curve itself is

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}}\,\p{exponential-function}{e^{-\frac{(x-\mu)^2}{2\sigma^2}}}$$

You will not need to use this formula directly. What matters is the shape: the $e^{-(\dots)^2}$ part is what makes it fall away so quickly, and the front part, $\frac{1}{\sigma\sqrt{2\pi}}$, is just whatever makes the area come to 1.

## Why the second number is squared {#squared}

Writing $\mathcal N(\mu, \sigma^2)$ with the variance rather than the standard deviation looks odd at first. The reason is that variances are what *add up* nicely. If you add two independent normal amounts of noise, their variances add, not their standard deviations. Diffusion models add noise again and again, so the variance is the number worth keeping track of. You will see this in action in [why the spread stays at 1](c:variance-preserving).

So: in diffusion, the second slot of $\mathcal N(\cdot, \cdot)$ is **always a variance**. When a formula says $\mathcal N(\dots, \beta_n I)$, the noise has variance $\beta_n$ and standard deviation $\sqrt{\beta_n}$.

## Example {#example}

Adult heights in one country are roughly $\mathcal N(170, 49)$, in centimetres. The mean is 170 cm. The variance is 49, so the standard deviation is $\sqrt{49} = 7$ cm. About 68% of people are between $170 - 7 = 163$ cm and $170 + 7 = 177$ cm, and about 95% between 156 cm and 184 cm.

## Check yourself {#check}

```check
? A variable follows $\mathcal N(5, 16)$. What is its standard deviation?
= 4 ± 0.001
wrong: The second number is the variance, $\sigma^2 = 16$. The standard deviation is its square root.
hint: The second slot holds $\sigma^2$, not $\sigma$.
answer: $\sigma^2 = 16$, so $\sigma = \sqrt{16} = 4$.
? You change a bell curve from $\mathcal N(0, 1)$ to $\mathcal N(0, 4)$. What happens to its peak?
- [ ] It gets taller, because the variance went up :: Variance measures spread, not height. More spread means the same area is shared over a wider range.
- [x] It gets lower, and the curve gets twice as wide :: The area under the curve must stay 1. The standard deviation went from 1 to 2, so the curve is twice as wide and half as tall.
- [ ] It moves to the right :: Moving left or right is the job of the mean, which stayed at 0.
hint: Variance 4 means standard deviation 2. And the total area never changes.
answer: Standard deviation goes from 1 to 2. The curve doubles in width, so to keep area 1 its height halves, from about 0.40 to about 0.20.
? Roughly what fraction of values from any normal distribution land within two standard deviations of the mean?
- [ ] About 68% :: That is the figure for one standard deviation.
- [x] About 95% :: Right: about 95% within $2\sigma$, and about 99.7% within $3\sigma$.
- [ ] About 50% :: Half of the values are below the mean, but that is a different question.
hint: One standard deviation catches about two thirds.
answer: About 95%. This is true for every normal distribution, whatever its mean and variance, because they are all the same shape stretched.
```

```recall
? In $\mathcal N(\mu, \sigma^2)$, which number moves the curve and which one stretches it?
$\mu$, the mean, slides it left and right. $\sigma^2$, the variance, sets the spread; the standard deviation $\sigma$ is its square root.
? Why do diffusion formulas write the variance, not the standard deviation, inside $\mathcal N$?
Because when you add independent noise, variances add. Diffusion adds noise many times, so the variance is the quantity that is easy to keep track of.
? Why does a wider bell curve have to be lower?
The total area under a probability density is always 1, so spreading it out sideways must squash it down.
```
