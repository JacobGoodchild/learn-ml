---
id: probability-density
title: Probability density
summary: For values that can be any real number, probabilities are areas under a curve.
colour: probability
level: 2
needs: [probability-distribution, integration]
related: [normal-distribution]
---

```formula Probability is area
P(a \le X \le b) = \p{integration}{\int_a^b} f(x)\,\mathrm{d}x
---
In words: the chance of landing between $a$ and $b$ is the area under the curve there.
$f(x)$ :: the density: how crowded values are near $x$
```

```keypoint The height is not a probability
One exact value, like a height of exactly 170.000… cm, has probability 0: a strip of zero width has zero area. So we ask about ranges. The curve's height can even exceed 1, as long as the total area is 1.
```

```example A spinner
Any angle from 0 to 360°, all equally likely: $f(x) = \frac{1}{360}$. Chance of 0 to 90°: $90 \times \frac{1}{360} = \frac14$.
```

## Check yourself {#check}

```check
? A density is flat at height $\frac14$ between 0 and 4. What is the probability of landing between 1 and 3?
= 0.5 ± 0.0001
wrong: Probability is area: width times height.
hint: Width 2, height $\frac14$.
answer: $\frac12$.
? A density peaks at height 2. Is something wrong?
- [ ] Yes: probabilities cannot exceed 1 :: The height is not a probability; only areas are.
- [x] No: densities can exceed 1 if the total area is 1 :: Right: a narrow curve must be tall.
hint: Is the height a probability?
answer: Nothing is wrong.
```

```recall
? For a continuous random variable, how do you get the probability of landing between $a$ and $b$?
The area under the density curve between $a$ and $b$.
? Why can a density be bigger than 1?
Its height is not a probability; a narrow peak must be tall so the total area is 1.
```
