---
id: standard-deviation
title: Standard deviation
summary: The square root of the variance: spread in the same units as the data.
colour: spread
level: 2
needs: [variance]
related: [normal-distribution]
---

```formula Square root of the variance
\sigma = \sqrt{\p{variance}{\sigma^2}}
---
In words: a typical distance from the mean, in the original units.
$\p{variance}{\sigma^2}$ :: the variance
```

Variances are easier to calculate with; standard deviations are easier to picture. That is why diffusion formulas put variances inside $\mathcal N(\cdot,\cdot)$ but multiply by square roots like $\sqrt{\alpha_n}$.

```example Noise
Noise with variance $0.01$ has standard deviation $0.1$: each pixel gets pushed by about $0.1$.
```

## Check yourself {#check}

```check
? Noise has variance $0.04$. What is its standard deviation?
= 0.2 ± 0.0001
wrong: Take the square root of the variance.
hint: $\sqrt{0.04}$.
answer: $0.2$.
? You double the standard deviation of some noise. What happens to its variance?
- [ ] It doubles :: Variance is the square of the standard deviation.
- [x] It goes up four times :: Right: $(2\sigma)^2 = 4\sigma^2$.
- [ ] It stays the same :: Bigger noise has more spread.
hint: Variance is standard deviation squared.
answer: Four times.
```

```recall
? How are variance and standard deviation related, and when is each one handier?
Standard deviation is the square root of variance. Variance is easier to calculate with (it adds up); standard deviation is easier to picture.
? A step keeps $\sqrt{\alpha_n}$ of the picture. Why a square root?
Multiplying by $\sqrt{\alpha_n}$ multiplies the variance by exactly $\alpha_n$.
```
