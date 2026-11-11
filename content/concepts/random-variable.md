---
id: random-variable
title: Random variables
summary: A number whose value depends on chance.
colour: probability
level: 1
needs: [probability-basics]
related: [probability-distribution]
---

```keypoint A number that comes out of chance
Roll a dice and call the score $X$. Before rolling you don't know $X$, but you know which values it can take and how likely each is. That makes $X$ a **random variable**.

The brightness of one pixel after random noise is added is a random variable too.
```

```notation Capital and small letters
$X$ :: the random variable itself
$x$ :: one value it took, as in $P(X = 4)$
$x_n$ :: diffusion papers use one letter for both; the meaning is clear from context
```

```example Two coins
$X$ = number of heads in two flips. It can be 0, 1 or 2, with probabilities $\frac14$, $\frac12$, $\frac14$.
```

## Check yourself {#check}

```check
? Which of these is a random variable?
- [x] The number of heads when you flip ten coins :: Right: a number that depends on chance.
- [ ] The number of sides on a dice :: Always 6. Nothing random.
- [ ] "Heads" or "tails" :: Close, but it has to be a number.
hint: A number that changes from run to run.
answer: The number of heads in ten flips.
? A pixel is $0.3$, then fresh random noise is added. Is the result a random variable?
- [x] Yes :: Fresh noise gives a different number each time.
- [ ] No, because the photo is fixed :: The noise is not fixed.
hint: Would you get the same number with fresh noise?
answer: Yes.
```

```recall
? In your own words, what is a random variable?
A number whose value depends on chance: you know which values are possible and how likely each is, but not which one you will get.
? Why do diffusion papers write $x_n$ for both a random picture and a particular one?
It saves notation; context makes it clear.
```
