---
id: functions-of-random-variables
title: The mean of a function, E[f(X)]
summary: To average f(X), apply f to each possible value and weight by its probability. The subscript on E says which distribution to average over.
colour: spread
level: 3
needs: [expectation, functions]
related: [conditional-expectation]
entryPoints:
  - label: averaging any quantity
    section: idea
  - label: the subscript under E
    section: subscript
---

```formula
\p{expectation}{\mathbb{E}}_{\p{probability-distribution}{q}}\big[f(X)\big] = \sum_x f(x)\, q(x)
```

## In words {#aloud}

"The expected value, under $q$, of $f$ of $X$": the long-run average of $f(X)$ when $X$ is drawn from $q$.

## Averaging any quantity {#idea}

The [mean](c:expectation) averages $X$ itself. But you can average anything that depends on $X$: its square, its log, how wrong a guess about it is. Apply the function to every possible value, weight each by how likely it is, and add up. For continuous $X$ the sum becomes an integral.

You have already seen one: [variance](c:variance) is $\mathbb{E}[(X - \mu)^2]$, the average of the function $f(x) = (x - \mu)^2$.

## The subscript under $\mathbb{E}$ {#subscript}

When several distributions are around, people write which one to average over underneath: $\mathbb{E}_{q}$ means "with $X$ drawn from $q$". $\mathbb{E}_{q_n(x_n)}$ means "with $x_n$ drawn from the distribution of noisy pictures at step $n$". And $\mathbb{E}_n$ means "with the step $n$ itself chosen at random", usually uniformly from 1 to $N$.

Several in a row, as in $\mathbb{E}_n\,\mathbb{E}_{q_n(x_n)}[\dots]$, means: pick a random step, then a random noisy picture at that step, and average over both.

## Example {#example}

A fair dice, $f(x) = x^2$. $\mathbb{E}[X^2] = \frac{1 + 4 + 9 + 16 + 25 + 36}{6} = \frac{91}{6} \approx 15.17$. Notice this is not $(\mathbb{E}[X])^2 = 3.5^2 = 12.25$: averaging and then squaring is not the same as squaring and then averaging.

## Check yourself {#check}

```check
? $X$ is 1 or 3, each with probability $\frac12$. What is $\mathbb{E}[X^2]$?
= 5 ± 0.0001
wrong: Square each value first, then average.
hint: $\frac{1^2 + 3^2}{2}$.
answer: $\frac{1 + 9}{2} = 5$. (Squaring the mean would give 4, which is different.)
? What does $\mathbb{E}_{q_n(x_n)}[\dots]$ tell you to do?
- [x] Average over noisy pictures $x_n$ drawn from the step-$n$ distribution :: Right: the subscript names what is random and where it comes from.
- [ ] Multiply by $q_n(x_n)$ once :: The weighting by $q_n$ happens inside the average, for every possible $x_n$.
- [ ] Pick the most likely $x_n$ :: An average uses every value, not just the most likely one.
hint: The subscript says which distribution the random thing comes from.
answer: Draw $x_n$ from $q_n$, the distribution of pictures after $n$ noising steps, and average the bracket over all those draws.
```

```recall
? How do you work out $\mathbb{E}_q[f(X)]$?
Apply $f$ to every possible value of $X$, weight each result by its probability under $q$, and add up (or integrate).
? Is $\mathbb{E}[X^2]$ the same as $(\mathbb{E}[X])^2$?
No. In general $\mathbb{E}[X^2]$ is bigger; the difference is exactly the variance.
```
