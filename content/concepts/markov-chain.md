---
id: markov-chain
title: Markov chains
summary: A sequence where each step depends only on the one just before it, not on the whole history.
colour: probability
level: 3
needs: [chain-rule-of-probability, conditional-distribution]
related: [forward-process]
entryPoints:
  - label: only the last step matters
    section: idea
  - label: how it shortens the chain rule
    section: shortens
---

## The key formula {#formula}

```formula
\p{conditional-distribution}{q(x_n \mid x_0, \dots, x_{n-1})} = q(x_n \mid x_{n-1})
```

## Read it aloud {#aloud}

"Given everything so far, the next step only depends on the last one."

## Only the last step matters {#idea}

A **Markov chain** is a sequence of random variables with a short memory. To decide where to go next, it only looks at where it is *now*. A board game is a good example: your next square depends on your current square and the dice, not on how you got there.

Diffusion's forward process is built this way on purpose. To make $x_n$, you only need $x_{n-1}$: shrink it a little and add fresh noise. The earlier pictures do not matter.

## How it shortens the chain rule {#shortens}

The [chain rule](c:chain-rule-of-probability) always gives

$$q(x_0, \dots, x_N) = q(x_0)\, q(x_1 \mid x_0)\, q(x_2 \mid x_0, x_1) \cdots$$

For a Markov chain, every condition collapses to just the previous step:

$$q(x_0, \dots, x_N) = q(x_0)\, q(x_1 \mid x_0)\, q(x_2 \mid x_1) \cdots q(x_N \mid x_{N-1})$$

That is the first line of slide 19. Each factor is one small step, so the whole process is described by one simple recipe used $N$ times.

## Quick check {#check}

```check
? Which of these is a Markov chain?
- [x] Your position in a board game after each turn :: Right: the next square depends only on the current square and a fresh dice roll.
- [ ] The words in a sentence, if each word depends on all the words before it :: That uses the whole history, which is the auto-regressive set-up on slide B.
- [ ] The results of separate coin flips, as a list :: Those are fully independent, which is a special (and boring) case: each step does not even depend on the last.
hint: Does the next step need anything except the current one?
answer: The board game. Each move needs only the current square and a dice roll.
? For a Markov chain, what does $q(x_3 \mid x_0, x_1, x_2)$ simplify to?
- [ ] $q(x_3 \mid x_0)$ :: The chain remembers the most recent step, not the first.
- [x] $q(x_3 \mid x_2)$ :: Right: only the step just before matters.
- [ ] $q(x_3)$ :: That would mean $x_3$ ignores even the previous step.
hint: Short memory: one step back.
answer: $q(x_3 \mid x_2)$.
```

```recall
? What makes a sequence a Markov chain?
Each step depends only on the step just before it, not on the rest of the history.
? How does the Markov property turn the chain rule into the first line of slide 19?
Every factor $q(x_n \mid x_0, \dots, x_{n-1})$ becomes $q(x_n \mid x_{n-1})$, so the joint distribution is $q(x_0)$ times one simple step after another.
```
