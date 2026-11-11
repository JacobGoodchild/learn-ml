---
id: probability-distribution
title: Probability distributions
summary: Every value a random variable can take, and how likely each one is.
colour: probability
level: 1
needs: [random-variable]
related: [probability-density]
---

```keypoint A table of chances
A fair dice: each of 1 to 6 has probability $\frac16$. That list is its **distribution**. The probabilities always add up to 1.
```

```notation The letters $p$ and $q$
$q(x)$ :: how likely the value $x$ is under the distribution $q$
$q$ :: in diffusion: the noising process, and real data
$p$ :: in diffusion: the model we train
$q(x_0)$ :: how likely each real, clean picture is
```

## Check yourself {#check}

```check
? A distribution gives probabilities $0.2$, $0.5$ and $p$ to its only three values. What is $p$?
= 0.3 ± 0.0001
wrong: All the probabilities must add up to 1.
hint: $1 - 0.2 - 0.5$.
answer: $0.3$.
? In diffusion models, what does $q(x_0)$ describe?
- [x] How likely each possible clean picture is :: Right.
- [ ] The model's guess at a clean picture :: The model is $p$.
- [ ] One particular photo :: It is a distribution over all pictures.
hint: Which letter is the model?
answer: The distribution of real clean pictures.
```

```recall
? What two things does a probability distribution tell you?
Every value the random variable can take, and how likely each is. They add up to 1.
? In diffusion models, what is the difference between $q$ and $p$?
$q$ is the noising process (and real data); $p$ is the model we train.
```
