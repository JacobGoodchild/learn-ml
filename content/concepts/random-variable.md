---
id: random-variable
title: Random variables
summary: A number whose value depends on chance. Each time you run the experiment, out comes a value.
colour: probability
level: 1
needs: [probability-basics]
related: [probability-distribution]
entryPoints:
  - label: a number that comes out of chance
    section: idea
  - label: capital X versus small x
    section: letters
---

## The idea {#idea}

A **random variable** is a number that comes out of something random. Roll a dice and call the score $X$. Before you roll, you do not know $X$, but you do know what values it *can* take and how likely each one is.

Examples: the score on a dice, tomorrow's rainfall in millimetres, the brightness of one pixel after noise has been added to it.

## Capital $X$ versus small $x$ {#letters}

Statistics books write the random variable in capitals, $X$, and a particular value it took in lower case, $x$. So "$P(X = 4)$" means "the probability that the dice shows 4".

Diffusion papers drop this habit: they write $x_n$ both for the random noisy picture and for one particular noisy picture. The meaning is always clear from context. When you see $x_n \sim \dots$ or $q(x_n)$, it is being treated as random.

## Example {#example}

Flip two coins and let $X$ be the number of heads. $X$ can be 0, 1 or 2, with probabilities $\frac14$, $\frac12$ and $\frac14$. Each run of the experiment gives one value; run it many times and the values come out in roughly those proportions.

## Check yourself {#check}

```check
? Which of these is a random variable?
- [x] The number of heads when you flip ten coins :: It is a number, and it depends on chance.
- [ ] The number of sides on a dice :: That is always 6. Nothing random about it.
- [ ] "Heads" or "tails" :: Close, but a random variable is a *number*. You could turn this into one by saying heads = 1, tails = 0.
hint: It needs to be a number, and it needs to change from run to run.
answer: The number of heads in ten flips: a number that depends on chance.
? A pixel's brightness is $0.3$ in a clean photo, and then random noise is added. Is the noisy brightness a random variable?
- [x] Yes :: Each time you add fresh noise you get a different number, so it is random.
- [ ] No, because the photo is fixed :: The photo is fixed, but the noise is not, and the result depends on the noise.
hint: Would you get the same number if you added fresh noise again?
answer: Yes. The clean value is fixed, but the noise changes each time, so the noisy value is a random variable.
```

```recall
? In your own words, what is a random variable?
A number whose value depends on chance: each time you run the experiment you get a value, and you know which values are possible and how likely each is.
? Why do diffusion papers happily write $x_n$ for both a random picture and a particular one?
It saves notation. Whether $x_n$ is random or a particular value is clear from how it is used, for example inside $q(x_n)$ or after $\sim$ it is random.
```
