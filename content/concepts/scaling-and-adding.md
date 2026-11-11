---
id: scaling-and-adding
title: Scaling and adding random variables
summary: Multiply a random variable by a and its variance is multiplied by a squared. Add independent ones and their variances add.
colour: spread
level: 3
needs: [variance, independence, standard-deviation]
related: [variance-preserving]
entryPoints:
  - label: scaling by a number
    section: scaling
  - label: adding independent noise
    section: adding
---

```formula
\mathrm{Var}(aX) = a^2\,\p{variance}{\mathrm{Var}(X)}, \qquad \mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y)\ \ \text{if } X, Y \text{ are } \p{independence}{\text{independent}}
```

These two rules do most of the work when adding noise.

## Scaling by a number {#scaling}

Multiply every value by $a$ and every distance from the mean is multiplied by $a$ too. Variance is built from *squared* distances, so it is multiplied by $a^2$. The standard deviation is multiplied by $|a|$.

So to multiply a variance by $\alpha$, you multiply the variable by $\sqrt{\alpha}$. That is exactly why the noising step uses $\sqrt{\alpha_n}\,x_{n-1}$ rather than $\alpha_n x_{n-1}$.

## Adding independent noise {#adding}

If $X$ and $Y$ are independent, their variances add. The swings of one do not line up with the swings of the other, so sometimes they cancel and sometimes they pile up, and on average the squared spread is just the sum. (Standard deviations do **not** add: two independent noises with standard deviation 3 and 4 give standard deviation 5, not 7, because $9 + 16 = 25$.)

Means are simpler: $\mathbb{E}[aX + Y] = a\,\mathbb{E}[X] + \mathbb{E}[Y]$ always, independent or not.

## See it {#see}

```visual spread-keeper
```

## Example {#example}

$X$ has variance 1. Make $Y = \sqrt{0.9}\,X + \sqrt{0.1}\,\epsilon$, where $\epsilon$ is independent noise with variance 1. Then $\mathrm{Var}(Y) = 0.9 \times 1 + 0.1 \times 1 = 1$. The spread is unchanged, even though $Y$ is now part picture and part noise.

## Check yourself {#check}

```check
? $\mathrm{Var}(X) = 2$. What is $\mathrm{Var}(3X)$?
= 18 ± 0.0001
wrong: Scaling by $a$ multiplies the variance by $a^2$, not by $a$.
hint: $a^2 \times \mathrm{Var}(X)$ with $a = 3$.
answer: $3^2 \times 2 = 18$.
? Independent $X$ and $Y$ have standard deviations 6 and 8. What is the standard deviation of $X + Y$?
= 10 ± 0.0001
wrong: Standard deviations do not add. Convert to variances, add those, then take the square root.
hint: Variances are 36 and 64.
answer: $36 + 64 = 100$, and $\sqrt{100} = 10$.
? You want to multiply the variance of $X$ by $0.5$. What do you multiply $X$ by?
- [ ] $0.5$ :: That would multiply the variance by $0.25$.
- [x] $\sqrt{0.5}$ :: Right: $(\sqrt{0.5})^2 = 0.5$.
- [ ] $0.25$ :: That shrinks the variance far too much.
hint: The variance is multiplied by the *square* of the scale factor.
answer: $\sqrt{0.5} \approx 0.707$, because $(\sqrt{0.5})^2 = 0.5$.
```

```recall
? What happens to the variance when you multiply a random variable by $a$?
It is multiplied by $a^2$, because variance is built from squared distances.
? Do standard deviations add when you add independent random variables? What does?
No. Variances add. Standard deviations combine like Pythagoras: $\sqrt{\sigma_X^2 + \sigma_Y^2}$.
```
