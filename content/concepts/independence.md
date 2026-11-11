---
id: independence
title: Independence
summary: Two random things are independent if knowing one tells you nothing about the other.
colour: probability
level: 1
needs: [conditional-probability, random-variable]
related: [scaling-and-adding]
---

```formula Knowing B changes nothing about A
P(A \cap B) = P(A)\,P(B) \quad\Longleftrightarrow\quad \p{conditional-probability}{P(A \mid B)} = P(A)
---
In words: for independent events, multiply the probabilities.
```

```keypoint Where diffusion relies on it
Each step's noise is independent of the picture and of all earlier noise, and each pixel's noise is independent of every other pixel's. That is what lets variances add, and one number describe the noise on a million pixels.
```

## Check yourself {#check}

```check
? Two fair coins are flipped. What is the probability both are heads?
= 0.25 ± 0.0001
wrong: Multiply the probabilities.
hint: $\frac12 \times \frac12$.
answer: $\frac14$.
? Which pair is *not* independent?
- [ ] Two separate dice rolls :: One does not affect the other.
- [x] Today's and tomorrow's temperature :: Right: a hot day makes another more likely.
- [ ] Fresh noise on two different pixels :: Designed to be independent.
hint: Does knowing one change your guess about the other?
answer: The temperatures.
```

```recall
? What does it mean for two random variables to be independent?
Knowing one tells you nothing about the other.
? Name two places where adding noise relies on independence.
Each step's noise is independent of the picture and earlier noise; different pixels' noise is independent.
```
