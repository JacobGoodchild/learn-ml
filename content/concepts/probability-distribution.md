---
id: probability-distribution
title: Probability distributions
summary: The full list of what a random variable can be and how likely each value is.
colour: probability
level: 1
needs: [random-variable]
related: [probability-density]
entryPoints:
  - label: a table of chances
    section: idea
  - label: the letters p and q
    section: letters
---

## The idea {#idea}

A **probability distribution** describes a random variable completely: every value it can take, and how likely each one is. For a fair dice it is a little table: each of 1 to 6 has probability $\frac16$. The probabilities always add up to 1.

## The letters $p$ and $q$ {#letters}

The slides name distributions with lower-case letters. $q(x)$ means "the distribution $q$, and specifically how likely the value $x$ is under it". On the diffusion slides:

- $q$ is always the **noising process** we choose, the one that destroys pictures.
- $p$ is always the **model** we train to undo it.

So $q(x_0)$ is "the distribution of real, clean pictures", that is, how likely each possible picture is to turn up in the data.

## A worked example {#example}

Roll two dice and add them. The total can be 2 to 12. There are 36 equally likely outcomes, and 6 of them give 7, so the probability of 7 is $\frac{6}{36} = \frac16$. Listing every total with its probability gives the whole distribution.

## Quick check {#check}

```check
? A distribution gives probabilities $0.2$, $0.5$ and $p$ to the only three possible values. What is $p$?
= 0.3 ± 0.0001
wrong: The probabilities of all the possible values must add up to exactly 1.
hint: What must all the probabilities add up to?
answer: $0.2 + 0.5 + p = 1$, so $p = 0.3$.
? On the diffusion slides, what does $q(x_0)$ describe?
- [x] How likely each possible clean picture is :: Right. $x_0$ is a clean picture and $q$ is the data side of things.
- [ ] The model's guess at a clean picture :: The model is always called $p$.
- [ ] One particular photo :: $q(x_0)$ is a whole distribution over pictures, not one picture.
hint: Which letter is the model?
answer: The distribution of real clean pictures: how likely each picture is to appear in the training data.
```

```recall
? What two things does a probability distribution tell you about a random variable?
Every value it can take, and how likely each value is. The probabilities add up to 1.
? On the diffusion slides, what is the difference between $q$ and $p$?
$q$ is the noising process we design (and the real data); $p$ is the model we train to reverse it.
```
