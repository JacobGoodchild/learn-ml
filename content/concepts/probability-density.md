---
id: probability-density
title: Probability density
summary: For values that can be any real number, probabilities are areas under a curve called the density.
colour: probability
level: 2
needs: [probability-distribution, integration]
related: [normal-distribution]
entryPoints:
  - label: why one exact value has probability 0
    section: zero
  - label: probability as area
    section: area
---

## Probability as area {#area}

Some random variables can take any value in a range, such as someone's height. For these we use a **probability density** $f(x)$: a curve whose *area* gives probabilities.

$$P(a \le X \le b) = \p{integration}{\int_a^b} f(x)\,\mathrm{d}x$$

The total area under the curve is 1, because $X$ has to land somewhere.

## Why one exact value has probability 0 {#zero}

What is the probability that someone is *exactly* 170.000000… cm tall? The area of a strip of zero width is zero, so the answer is 0. That is not a problem: it just means we always ask about ranges. The height of the curve, $f(x)$, is not a probability; it says how *crowded* values are near $x$. A density can even be bigger than 1, as long as the total area is 1.

## A worked example {#example}

A spinner lands on any angle from 0 to 360 degrees, all equally likely. Its density is flat: $f(x) = \frac{1}{360}$ on that range, so the area is $360 \times \frac{1}{360} = 1$. The probability of landing between 0 and 90 degrees is the area $90 \times \frac{1}{360} = \frac14$.

## Quick check {#check}

```check
? A density is flat at height $\frac{1}{4}$ between 0 and 4. What is the probability of landing between 1 and 3?
= 0.5 ± 0.0001
wrong: Probability is the area: width times height for a flat density.
hint: Area of a rectangle.
answer: Width $3 - 1 = 2$, height $\frac14$, so area $= \frac12$.
? A density curve reaches a height of 2 at its peak. Is something wrong?
- [ ] Yes: probabilities cannot be bigger than 1 :: The height is not a probability. Only areas are.
- [x] No: densities can exceed 1 as long as the total area is 1 :: Right. A very narrow, tall curve can still have area 1.
hint: Is the height of the curve a probability?
answer: Nothing is wrong. A narrow curve must be tall to have area 1. For example a bell curve with standard deviation 0.1 peaks at about 4.
```

```recall
? For a continuous random variable, how do you get the probability of landing between $a$ and $b$?
Take the area under the density curve between $a$ and $b$, that is, integrate the density from $a$ to $b$.
? Why can a density be bigger than 1?
Its height is not a probability; only areas are. A narrow peak has to be tall so that the total area is still 1.
```
