---
id: joint-distribution
title: Joint distributions
summary: The distribution of several random variables together: how likely each combination is.
colour: probability
level: 2
needs: [probability-distribution, random-variable]
related: [conditional-distribution, chain-rule-of-probability]
---

```formula Several at once
q(x_0, x_1, \dots, x_N)
---
In words: how likely this exact combination of values is, all together.
$x_{0:N}$ :: shorthand for the list $x_0, \dots, x_N$
```

```example Two dice
The joint distribution gives a probability to every pair. $P(6, 6) = \frac{1}{36}$.
```

For adding noise, $q(x_0, \dots, x_N)$ is the whole story in one object: a clean picture and every noisy version of it.

## Check yourself {#check}

```check
? Two fair dice. What is the probability of the pair (6, 6)?
= 0.027778 ± 0.0005
wrong: There are 36 equally likely pairs.
hint: $\frac{1}{36}$.
answer: $\approx 0.0278$.
? In the noising process, what does $q(x_0, \dots, x_N)$ describe?
- [x] A clean picture together with all its noisy versions :: Right.
- [ ] Only the final noisy picture :: That would be $q(x_N)$.
- [ ] The model's prediction :: The model is always called $p$.
hint: It has every $x$ in it.
answer: The whole run at once.
```

```recall
? What is a joint distribution?
The distribution of several random variables together: how likely each combination is.
? What does the shorthand $x_{0:N}$ mean?
The whole list $x_0, x_1, \dots, x_N$.
```
