---
id: scaling-and-adding
title: Scaling and adding random variables
summary: Multiply by $a$ and the variance is multiplied by $a^2$. Add independent ones and their variances add.
colour: spread
level: 3
needs: [variance, independence, standard-deviation]
related: [variance-preserving]
entryPoints:
  - label: scaling
    section: scaling
  - label: adding
    section: adding-independent-noise
---

```formula Scaling
\mathrm{Var}(aX) = a^2\,\p{variance}{\mathrm{Var}(X)}
---
In words: stretch every value by $a$, and the squared distances stretch by $a^2$.
$a$ :: any fixed number
```

```formula Adding independent noise
\mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) \quad \text{if } X, Y \text{ are } \p{independence}{\text{independent}}
---
In words: variances add. Standard deviations do not: $3$ and $4$ combine to $5$, since $9 + 16 = 25$.
```

```keypoint Why diffusion uses $\sqrt{\alpha_n}$
To multiply a variance by $\alpha_n$, multiply the variable by $\sqrt{\alpha_n}$. Then $\sqrt{0.9}\,X + \sqrt{0.1}\,\epsilon$ has variance $0.9 + 0.1 = 1$: part picture, part noise, same spread.
```

```visual spread-keeper See it with 6000 values
```

## Check yourself {#check}

```check
? $\mathrm{Var}(X) = 2$. What is $\mathrm{Var}(3X)$?
= 18 ± 0.0001
wrong: Scaling by $a$ multiplies the variance by $a^2$.
hint: $3^2 \times 2$.
answer: $18$.
? Independent $X$ and $Y$ have standard deviations 6 and 8. What is the standard deviation of $X + Y$?
= 10 ± 0.0001
wrong: Add the variances, then take the square root.
hint: $36 + 64$.
answer: $\sqrt{100} = 10$.
? To multiply the variance of $X$ by $0.5$, what do you multiply $X$ by?
- [ ] $0.5$ :: That multiplies the variance by $0.25$.
- [x] $\sqrt{0.5}$ :: Right: $(\sqrt{0.5})^2 = 0.5$.
- [ ] $0.25$ :: Far too small.
hint: The variance gets the *square* of the scale factor.
answer: $\sqrt{0.5} \approx 0.707$.
```

```recall
? What happens to the variance when you multiply a random variable by $a$?
It is multiplied by $a^2$.
? Do standard deviations add when you add independent random variables? What does?
No. Variances add; standard deviations combine like Pythagoras.
```
