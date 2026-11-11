---
id: marginalisation
title: Marginal distributions
summary: To get the distribution of one variable from a joint distribution, add up (integrate) over all values of the others.
colour: probability
level: 3
needs: [joint-distribution, integration]
related: [marginal-q-n]
---

## The key formula {#formula}

```formula
\p{probability-distribution}{q(y)} = \sum_{x} \p{joint-distribution}{q(x, y)}
```

## Read it aloud {#aloud}

"The chance of $y$ on its own is the chance of $y$ together with $x$, added up over every possible $x$."

## The idea {#idea}

A joint distribution tells you about combinations. Sometimes you only care about one of the variables. To forget the other one, add up over all its values: this "sums it out". The result is called the **marginal** distribution, because in old tables these totals were written in the margin.

For continuous variables the sum is an integral, $q(y) = \int q(x, y)\,\mathrm{d}x$.

## A worked example {#example}

A table of weather and umbrella-carrying: $P(\text{rain}, \text{umbrella}) = 0.25$, $P(\text{rain}, \text{no umbrella}) = 0.05$, $P(\text{dry}, \text{umbrella}) = 0.1$, $P(\text{dry}, \text{no umbrella}) = 0.6$. The marginal chance of carrying an umbrella is $0.25 + 0.1 = 0.35$, whatever the weather.

On slide 31, $q_n(x_n)$ is a marginal: all noisy pictures at step $n$, with the clean picture they came from summed out.

## Quick check {#check}

```check
? Using the table above, what is the marginal probability of rain?
= 0.3 ± 0.0001
wrong: Add up every entry where it rains, whatever happens with the umbrella.
hint: $0.25 + 0.05$.
answer: $0.25 + 0.05 = 0.3$.
? What does "summing out" a variable do?
- [x] Removes it, leaving the distribution of the others :: Right: you add over all its values, so it no longer appears.
- [ ] Sets it to zero :: You add over all its values, not just zero.
- [ ] Makes the variables independent :: Marginalising does not change how the variables relate; it just stops tracking one of them.
hint: What is left after you add over every value of $x$?
answer: It removes that variable: adding over all its values leaves the distribution of what remains.
```

```recall
? How do you get a marginal distribution from a joint one?
Add up (or integrate) the joint distribution over every value of the variables you want to forget.
? On slide 31, why is $q_n(x_n)$ a marginal?
It is the distribution of noisy pictures at step $n$ with the original clean picture summed out.
```
