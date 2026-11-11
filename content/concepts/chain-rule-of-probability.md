---
id: chain-rule-of-probability
title: The chain rule of probability
summary: Any joint distribution can be built one variable at a time: the first, then the second given the first, and so on.
colour: probability
level: 3
needs: [joint-distribution, conditional-distribution, product-notation]
related: [markov-chain]
---

```formula
\p{joint-distribution}{q(x_0, x_1, x_2)} = q(x_0)\;\p{conditional-distribution}{q(x_1 \mid x_0)}\;\p{conditional-distribution}{q(x_2 \mid x_0, x_1)}
```

## In words {#aloud}

"The chance of the whole combination is the chance of the first, times the chance of the second given the first, times the chance of the third given the first two."

## The idea {#idea}

This is the tree diagram from A-level, written as a formula. On a tree, the probability of a path is the product of the probabilities along its branches, and each branch is conditional on everything before it. The chain rule says the same about distributions, for any number of variables:

$$q(x_0, \dots, x_N) = q(x_0) \prod_{n=1}^{N} q(x_n \mid x_0, \dots, x_{n-1})$$

This rule is *always* true. It does not depend on anything special about the variables.

## Example {#example}

Draw two cards without replacement. $P(\text{both aces}) = P(\text{first ace}) \times P(\text{second ace} \mid \text{first ace}) = \frac{4}{52} \times \frac{3}{51} = \frac{1}{221}$.

The auto-regressive slide (slide B) uses exactly this rule to write the probability of a sentence word by word.

## Check yourself {#check}

```check
? $q(a) = 0.5$ and $q(b \mid a) = 0.4$. What is $q(a, b)$?
= 0.2 ± 0.0001
wrong: Multiply the first by the second-given-the-first.
hint: $0.5 \times 0.4$.
answer: $0.5 \times 0.4 = 0.2$.
? When is the chain rule of probability true?
- [x] Always, for any random variables :: Right. It is just the definition of conditional probability used again and again.
- [ ] Only when the variables are independent :: Independence would let you drop the conditions, but the rule holds either way.
- [ ] Only for normal distributions :: It has nothing to do with the shape of the distributions.
hint: It comes straight from $P(A \cap B) = P(A)\,P(B \mid A)$.
answer: Always. It is just the definition of conditional probability, applied repeatedly.
```

```recall
? Write the chain rule for $q(x_0, x_1, x_2)$ and say why it is true.
$q(x_0)\,q(x_1 \mid x_0)\,q(x_2 \mid x_0, x_1)$. It is the definition of conditional probability used repeatedly, like multiplying along a tree diagram.
? Does the chain rule need the variables to be independent?
No, it always holds. Independence (or the Markov property) only lets you simplify the conditions.
```
