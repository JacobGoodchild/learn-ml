---
id: expectation
title: The mean (expected value)
summary: The long-run average of a random variable, written E[X] or μ. Where the balance point of its distribution sits.
colour: spread
level: 2
needs: [random-variable, probability-distribution]
related: [variance]
entryPoints:
  - label: the long-run average
    section: idea
  - label: the letters E and μ
    section: letters
---

## The key formula {#formula}

```formula
\mathbb{E}[X] = \sum_{x} x \, \p{probability-distribution}{P(X = x)}
```

## Read it aloud {#aloud}

"The expected value of $X$ is each possible value times its probability, all added up."

## The idea {#idea}

If you ran the experiment a huge number of times and averaged the results, you would get very close to $\mathbb{E}[X]$. It is a weighted average: likely values count for more. For a curve-shaped distribution it is the point where the curve would balance.

## The letters $\mathbb{E}$ and $\mu$ {#letters}

$\mathbb{E}$ (a blackboard-bold E) stands for "expected value". The Greek letter $\mu$ ("mu", for mean) is the same thing; people use $\mu$ when they want a short name for it. For continuous variables the sum becomes an integral, $\mathbb{E}[X] = \int x\,f(x)\,\mathrm{d}x$, but the meaning is unchanged.

Watch out: on slides 31 and 42, $\mu_n(\cdot)$ is the mean of the model's step, and on slide 119 $\mu$ is not a mean at all. Each slide page says which applies.

## A worked example {#example}

A fair dice: $\mathbb{E}[X] = \frac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3.5$. You can never roll 3.5, but it is the long-run average.

Noise on the slides always has mean 0: it pushes pixels up as often as down, so on average it does not move them at all.

## Quick check {#check}

```check
? $X$ is 0 with probability $0.5$, 2 with probability $0.25$ and 4 with probability $0.25$. What is $\mathbb{E}[X]$?
= 1.5 ± 0.0001
wrong: Multiply each value by its probability, then add.
hint: $0 \times 0.5 + 2 \times 0.25 + 4 \times 0.25$.
answer: $0 + 0.5 + 1 = 1.5$.
? Noise $\epsilon$ is added to a pixel, and $\mathbb{E}[\epsilon] = 0$. What does that tell you?
- [x] On average the noise does not shift the pixel up or down :: Right: the ups and downs cancel out in the long run.
- [ ] The noise is always 0 :: The *average* is 0. Individual values are not.
- [ ] The noise is small :: The mean says nothing about size. That is the variance's job.
hint: Mean is about the centre, not the spread.
answer: The noise is centred on 0, so it pushes up and down equally on average. How big the pushes are is a separate question, answered by the variance.
```

```recall
? Why is the expected value of a dice roll 3.5 even though you can never roll 3.5?
It is a long-run average, a weighted average of all possible values, not a value the dice can show.
? What does it mean for noise to have mean 0?
On average it pushes values up and down equally, so it does not shift them overall. It says nothing about how big the pushes are.
```
