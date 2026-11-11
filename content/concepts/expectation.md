---
id: expectation
title: The mean (expected value)
summary: The long-run average of a random variable, written $\mathbb{E}[X]$ or $\mu$.
colour: spread
level: 2
needs: [random-variable, probability-distribution]
related: [variance]
---

```formula Each value times its chance, added up
\mathbb{E}[X] = \sum_{x} x \, \p{probability-distribution}{P(X = x)}
---
In words: a weighted average, where likely values count for more.
$\mathbb{E}$ :: "expected value"; the mean is also called $\mu$
$\p{probability-distribution}{P(X = x)}$ :: how likely the value $x$ is
```

If you ran the experiment many times and averaged the results, you would get close to $\mathbb{E}[X]$. For continuous variables the sum becomes an integral.

```example A dice
$\mathbb{E}[X] = \frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$. You can never roll 3.5, but it is the long-run average.
```

```keypoint Noise has mean 0
The noise in diffusion pushes pixels up as often as down, so on average it moves nothing. How *big* the pushes are is the variance's job.
```

## Check yourself {#check}

```check
? $X$ is 0 with probability $0.5$, 2 with probability $0.25$ and 4 with probability $0.25$. What is $\mathbb{E}[X]$?
= 1.5 ± 0.0001
wrong: Multiply each value by its probability, then add.
hint: $0 \times 0.5 + 2 \times 0.25 + 4 \times 0.25$.
answer: $0 + 0.5 + 1 = 1.5$.
? Noise $\epsilon$ has $\mathbb{E}[\epsilon] = 0$. What does that tell you?
- [x] On average it does not shift the pixel up or down :: Right.
- [ ] The noise is always 0 :: The *average* is 0, not each value.
- [ ] The noise is small :: The mean says nothing about size.
hint: Mean is about the centre, not the spread.
answer: It is centred on 0. Its size is a separate question.
```

```recall
? Why is the expected value of a dice roll 3.5 even though you can never roll 3.5?
It is a long-run weighted average, not a value the dice can show.
? What does it mean for noise to have mean 0?
On average it pushes values up and down equally, so it does not shift them. It says nothing about how big the pushes are.
```
