---
id: joint-distribution
title: Joint distributions
summary: The distribution of several random variables together, written q(x, y): how likely each combination is.
colour: probability
level: 2
needs: [probability-distribution, random-variable]
related: [conditional-distribution, chain-rule-of-probability]
---

```formula
q(x_0, x_1, \dots, x_N)
```

## In words {#aloud}

"$q$ of $x_0$, $x_1$, up to $x_N$": how likely each possible *combination* of all of them is.

## The idea {#idea}

A single distribution tells you about one random variable. A **joint** distribution tells you about several at once, including how they relate. Rolling two dice, the joint distribution gives a probability to every pair, such as (3, 5).

On slide 19, $q(x_0, \dots, x_N)$ is the whole noising story in one object: a clean picture *and* every noisy version of it, together. It answers "how likely is this clean picture, followed by exactly these noisy versions?"

## Shorthand {#shorthand}

Later slides shorten $x_0, x_1, \dots, x_N$ to $x_{0:N}$ ("$x$ from 0 to $N$"). It means the same list.

## Check yourself {#check}

```check
? Two fair dice are rolled. Under their joint distribution, what is the probability of the pair (6, 6)?
= 0.027778 ± 0.0005
wrong: There are 36 equally likely pairs.
hint: $\frac{1}{36}$.
answer: $\frac{1}{6} \times \frac{1}{6} = \frac{1}{36} \approx 0.0278$.
? What does $q(x_0, \dots, x_N)$ describe on slide 19?
- [x] A clean picture together with all its noisy versions :: Right: the whole chain, as one combined random object.
- [ ] Only the final noisy picture :: That would be $q(x_N)$.
- [ ] The model's prediction :: The model is $p$, on slide 31.
hint: It has every $x$ in it.
answer: The joint distribution of the clean picture and every noisy version of it: the whole forward process at once.
```

```recall
? What is a joint distribution?
The distribution of several random variables together: how likely each combination of values is.
? What does the shorthand $x_{0:N}$ mean?
The whole list $x_0, x_1, \dots, x_N$.
```
