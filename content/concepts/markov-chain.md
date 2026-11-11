---
id: markov-chain
title: Markov chains
summary: A sequence where each step depends only on the step just before it.
colour: probability
level: 3
needs: [chain-rule-of-probability, conditional-distribution]
related: [forward-process]
entryPoints:
  - label: how it shortens the chain rule
    section: how-it-shortens-the-chain-rule
---

```formula Only the last step matters
\p{conditional-distribution}{q(x_n \mid x_0, \dots, x_{n-1})} = q(x_n \mid x_{n-1})
---
In words: given the whole history, the next step only cares about where you are now.
```

A board game is a Markov chain: your next square depends on your current square and the dice, not on how you got there. Adding noise works the same way: to make $x_n$ you only need $x_{n-1}$.

```formula How it shortens the chain rule
q(x_0, \dots, x_N) = q(x_0)\, q(x_1 \mid x_0)\, q(x_2 \mid x_1) \cdots q(x_N \mid x_{N-1})
---
In words: the [chain rule](c:chain-rule-of-probability) normally conditions on everything so far; here each factor only needs the step before.
```

This is exactly the formula for the whole noising run: one simple step, used $N$ times.

## Check yourself {#check}

```check
? Which of these is a Markov chain?
- [x] Your position in a board game after each turn :: Right: the next square depends only on the current one and a dice roll.
- [ ] Words in a sentence, where each word depends on all earlier words :: That uses the whole history.
- [ ] A list of separate coin flips :: Those do not even depend on the last step.
hint: Does the next step need anything except the current one?
answer: The board game.
? For a Markov chain, what does $q(x_3 \mid x_0, x_1, x_2)$ simplify to?
- [ ] $q(x_3 \mid x_0)$ :: It remembers the most recent step, not the first.
- [x] $q(x_3 \mid x_2)$ :: Right: only the step just before matters.
- [ ] $q(x_3)$ :: That would ignore even the previous step.
hint: Short memory: one step back.
answer: $q(x_3 \mid x_2)$.
```

```recall
? What makes a sequence a Markov chain?
Each step depends only on the step just before it, not on the rest of the history.
? How does the Markov property turn the chain rule into the formula for the noising process?
Every factor $q(x_n \mid x_0, \dots, x_{n-1})$ becomes $q(x_n \mid x_{n-1})$, so the whole run is $q(x_0)$ times one simple step after another.
```
