---
id: standard-deviation
title: Standard deviation
summary: The square root of the variance. A measure of spread in the same units as the data.
colour: spread
level: 2
needs: [variance]
related: [normal-distribution]
---

## The key formula {#formula}

```formula
\sigma = \sqrt{\p{variance}{\sigma^2}}
```

## The idea {#idea}

The **standard deviation** $\sigma$ (Greek "sigma") is the square root of the [variance](c:variance). It measures spread in the original units, so it is the number you can picture: "a typical distance from the mean".

On a bell curve, one standard deviation either side of the mean catches about 68% of the values.

## Where you will see each one {#where}

Variances are easier to calculate with; standard deviations are easier to picture. The slides write variances inside $\mathcal N(\cdot,\cdot)$ and standard deviations as *multipliers*. For example a noising step keeps $\sqrt{\alpha_n}$ of the old picture: that square root is turning a variance into a standard deviation.

## A worked example {#example}

Heights with variance 49 cm² have standard deviation 7 cm. Noise with variance $\beta = 0.01$ has standard deviation $\sqrt{0.01} = 0.1$, so a typical pixel gets pushed by about $0.1$.

## Quick check {#check}

```check
? Noise has variance $0.04$. What is its standard deviation?
= 0.2 ± 0.0001
wrong: Take the square root of the variance.
hint: $\sqrt{0.04}$.
answer: $\sqrt{0.04} = 0.2$.
? To make random noise twice as big (standard deviation doubled), what happens to its variance?
- [ ] It doubles :: Variance is the square of the standard deviation.
- [x] It goes up four times :: Right: $(2\sigma)^2 = 4\sigma^2$.
- [ ] It stays the same :: Bigger noise has more spread.
hint: Variance is standard deviation squared.
answer: $(2\sigma)^2 = 4\sigma^2$, so four times the variance.
```

```recall
? How are variance and standard deviation related, and when is each one handier?
Standard deviation is the square root of variance. Variance is easier to calculate with (it adds up); standard deviation is easier to picture (same units as the data).
? A step keeps $\sqrt{\alpha_n}$ of the picture. Why a square root?
Because $\alpha_n$ is a variance-sized quantity, and multiplying a variable by $\sqrt{\alpha_n}$ multiplies its variance by $\alpha_n$.
```
