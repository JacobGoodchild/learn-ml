---
id: conditional-distribution
title: Conditional distributions
summary: q(y | x) is the distribution of y once you know x. Change x and you get a different distribution.
colour: probability
level: 2
needs: [conditional-probability, probability-distribution]
related: [joint-distribution]
entryPoints:
  - label: the bar means "given"
    section: idea
  - label: a recipe that takes an input
    section: recipe
---

## The key formula {#formula}

```formula
q(\,y \p{conditional-probability}{\mid} x\,)
```

## Read it aloud {#aloud}

"$q$ of $y$ given $x$": the distribution of $y$, when $x$ is already known.

## The bar means "given" {#idea}

This is [conditional probability](c:conditional-probability) from A-level, but for a whole distribution at once instead of one event. Knowing $x$ changes what $y$ is likely to be. For example, the distribution of tomorrow's temperature *given* that today is 30°C is centred much higher than it would be given that today is 5°C.

## A recipe that takes an input {#recipe}

A helpful way to read $q(y \mid x)$: it is a **recipe** for producing a random $y$, and the recipe needs $x$ as an ingredient. Give it a different $x$ and you get a different distribution for $y$.

On slide 19, $q(x_n \mid x_{n-1})$ is the recipe "given the picture after $n-1$ steps, here is how to make the picture after $n$ steps": shrink it slightly and add a little noise.

## A worked example {#example}

Let $y = x + \text{noise}$, with noise from $\mathcal N(0, 1)$. Then $q(y \mid x) = \mathcal N(x, 1)$: once you know $x$, $y$ is a bell curve centred on $x$. If $x = 4$, $y$ is centred on 4; if $x = -2$, it is centred on $-2$.

## Quick check {#check}

```check
? $y = 2x + \epsilon$ with $\epsilon \sim \mathcal N(0, 1)$. You are told $x = 3$. What is the mean of $y$ given $x = 3$?
= 6 ± 0.0001
wrong: Given $x$, the only random part is $\epsilon$, which has mean 0.
hint: $2 \times 3 + 0$.
answer: $\mathbb{E}[y \mid x = 3] = 2 \times 3 + 0 = 6$.
? In $q(x_n \mid x_{n-1})$, which picture is known and which one is random?
- [x] $x_{n-1}$ is known; $x_n$ is random :: Right: the thing after the bar is the given ingredient.
- [ ] $x_n$ is known; $x_{n-1}$ is random :: The bar reads "given": what comes after it is known.
- [ ] Both are random :: Inside this one recipe, the thing after the bar is treated as fixed.
hint: Read the bar as "given".
answer: $x_{n-1}$ is given; the recipe produces a random $x_n$ from it.
```

```recall
? How do you read $q(y \mid x)$, and what does it describe?
"$q$ of $y$ given $x$": the distribution of $y$ once $x$ is known. A recipe for a random $y$ that takes $x$ as an input.
? If $y = x + \epsilon$ with $\epsilon \sim \mathcal N(0, \sigma^2)$, what is $q(y \mid x)$?
$\mathcal N(x, \sigma^2)$: a bell curve centred on $x$ with variance $\sigma^2$.
```
