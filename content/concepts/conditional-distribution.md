---
id: conditional-distribution
title: Conditional distributions
summary: $q(y \mid x)$ is the distribution of $y$ once you know $x$.
colour: probability
level: 2
needs: [conditional-probability, probability-distribution]
related: [joint-distribution]
---

```formula The bar means "given"
q(\,y \p{conditional-probability}{\mid} x\,)
---
In words: a recipe for a random $y$ that takes $x$ as an ingredient. Change $x$, get a different distribution.
$x$ :: known
$y$ :: random
```

```example Noise around a value
$y = x + \epsilon$ with $\epsilon \sim \mathcal N(0, 1)$. Then $q(y \mid x) = \mathcal N(x, 1)$: a bell curve centred wherever $x$ is.
```

In the noising process, $q(x_n \mid x_{n-1})$ is the recipe: given the current picture, make the next one.

## Check yourself {#check}

```check
? $y = 2x + \epsilon$ with $\epsilon \sim \mathcal N(0, 1)$, and $x = 3$. What is the mean of $y$?
= 6 ± 0.0001
wrong: Given $x$, only $\epsilon$ is random, and it has mean 0.
hint: $2 \times 3 + 0$.
answer: $6$.
? In $q(x_n \mid x_{n-1})$, which picture is known?
- [x] $x_{n-1}$ :: Right: what comes after the bar is given.
- [ ] $x_n$ :: The bar reads "given": the thing after it is known.
- [ ] Neither :: Inside the recipe, the thing after the bar is fixed.
hint: Read the bar as "given".
answer: $x_{n-1}$.
```

```recall
? How do you read $q(y \mid x)$, and what does it describe?
"$q$ of $y$ given $x$": the distribution of $y$ once $x$ is known.
? If $y = x + \epsilon$ with $\epsilon \sim \mathcal N(0, \sigma^2)$, what is $q(y \mid x)$?
$\mathcal N(x, \sigma^2)$.
```
