---
id: chain-rule-of-probability
title: The chain rule of probability
summary: Build any joint distribution one variable at a time, each given everything before it.
colour: probability
level: 3
needs: [joint-distribution, conditional-distribution, product-notation]
related: [markov-chain]
---

```formula One variable at a time
\p{joint-distribution}{q(x_0, x_1, x_2)} = q(x_0)\;\p{conditional-distribution}{q(x_1 \mid x_0)}\;\p{conditional-distribution}{q(x_2 \mid x_0, x_1)}
---
In words: the first, times the second given the first, times the third given the first two.
```

This is a tree diagram written as a formula, and it is **always** true. A [Markov chain](c:markov-chain) is the special case where each condition shrinks to just the previous step.

```example Two aces
$P(\text{both aces}) = \frac{4}{52} \times \frac{3}{51} = \frac{1}{221}$.
```

## Check yourself {#check}

```check
? $q(a) = 0.5$ and $q(b \mid a) = 0.4$. What is $q(a, b)$?
= 0.2 ± 0.0001
wrong: Multiply the first by the second-given-the-first.
hint: $0.5 \times 0.4$.
answer: $0.2$.
? When is the chain rule of probability true?
- [x] Always :: Right: it is just conditional probability used repeatedly.
- [ ] Only for independent variables :: It holds either way.
- [ ] Only for normal distributions :: Shape does not matter.
hint: It comes from $P(A \cap B) = P(A)\,P(B \mid A)$.
answer: Always.
```

```recall
? Write the chain rule for $q(x_0, x_1, x_2)$ and say why it is true.
$q(x_0)\,q(x_1 \mid x_0)\,q(x_2 \mid x_0, x_1)$: conditional probability used repeatedly, like a tree diagram.
? Does the chain rule need the variables to be independent?
No, it always holds.
```
