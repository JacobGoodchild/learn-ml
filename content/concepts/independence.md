---
id: independence
title: Independence
summary: Two random things are independent if knowing one tells you nothing about the other.
colour: probability
level: 1
needs: [conditional-probability, random-variable]
related: [scaling-and-adding]
---

```formula
P(A \cap B) = P(A)\,P(B) \quad\Longleftrightarrow\quad \p{conditional-probability}{P(A \mid B)} = P(A)
```

## The idea {#idea}

You met independent events at A-level: two coin flips do not affect each other, so you multiply their probabilities. Random variables work the same way. $X$ and $Y$ are **independent** if learning the value of $Y$ does not change the distribution of $X$ at all.

## Why it matters here {#why}

The noise added to a picture is chosen so that:

- the noise in each step is independent of the picture and of all earlier noise, and
- the noise on each pixel is independent of the noise on every other pixel.

Independence is what lets us add variances together and describe the noise on a million pixels with a single number.

## Check yourself {#check}

```check
? Two fair coins are flipped. What is the probability both are heads?
= 0.25 ± 0.0001
wrong: For independent events, multiply the probabilities.
hint: $\frac12 \times \frac12$.
answer: $\frac12 \times \frac12 = \frac14$.
? Which pair is *not* independent?
- [ ] Two separate dice rolls :: One roll does not affect the other.
- [x] Today's temperature and tomorrow's temperature :: Right: a hot day today makes a hot day tomorrow more likely.
- [ ] Fresh random noise on two different pixels :: The noise generator is designed so that these are independent.
hint: Does knowing one change your guess about the other?
answer: Today's and tomorrow's temperatures. Knowing one changes what you expect for the other.
```

```recall
? What does it mean for two random variables to be independent?
Knowing the value of one tells you nothing about the other; the distribution of one does not change when you learn the other.
? Name two places where the diffusion forward process relies on independence.
Each step's noise is independent of the picture and of earlier noise; and the noise on different pixels is independent.
```
