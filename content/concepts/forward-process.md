---
id: forward-process
title: The noising process
summary: The whole run from clean picture to static, written as one formula built from $N$ small steps.
colour: diffusion
level: 5
needs: [markov-chain, diffusion-step, joint-distribution, x-n-ddpm]
related: [pure-noise-endpoint, alpha-bar-n]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```formula The whole run in one line
\p{joint-distribution}{q(x_0,\dots,x_N)} = \p{probability-distribution}{q(x_0)}\,\p{diffusion-step}{q(x_1\mid x_0)}\cdots \p{diffusion-step}{q(x_N\mid x_{N-1})}
---
In words: pick a real picture, then apply the same small noising step $N$ times.
$\p{joint-distribution}{q(x_0,\dots,x_N)}$ :: how likely a clean picture and one particular run of noisy versions are, together
$\p{probability-distribution}{q(x_0)}$ :: how likely each clean picture is
$\p{diffusion-step}{q(x_n \mid x_{n-1})}$ :: one noising step
```

It can be a simple product because it is a [Markov chain](c:markov-chain): each step only needs the picture before it.

```keypoint Why so many tiny steps
A model will later learn to undo this, one step at a time. Undoing a tiny nudge is easy. Undoing one giant leap from picture to static would be hopeless.
```

Nothing here is learned: the steps are chosen by hand. This is called the **forward process**; the model runs the **reverse process**, from static back to pictures.

## Check yourself {#check}

```check
? How many step factors $q(x_n \mid x_{n-1})$ are in the product when $N = 1000$?
= 1000 ± 0.1
wrong: One factor per step, from $x_0 \to x_1$ up to $x_{999} \to x_{1000}$.
hint: Steps 1 to $N$.
answer: 1000, plus the single $q(x_0)$ at the front.
? Why can the whole run be written as a simple product of one-step factors?
- [x] It is a Markov chain: each step only depends on the previous one :: Right.
- [ ] All the pictures are independent :: They are strongly linked: each is made from the last.
- [ ] A network makes it so :: There is no network in the noising process.
hint: What does the chain rule become for a short-memory process?
answer: It is a Markov chain, so each long condition shrinks to just the previous step.
? Why use a thousand small steps instead of one big one?
- [x] Small steps are each easy to reverse :: Right: that is what the model has to learn.
- [ ] Small steps add less noise overall :: The end result is pure noise either way.
- [ ] One big step would not be a normal distribution :: One big jump can still be normal.
hint: Think about the model's job later on.
answer: The model learns to undo each step, and tiny steps are much easier to undo.
```

```recall
? What is the forward process, and is anything in it learned?
The chain that turns a clean picture into noise by repeated small noising steps, $q(x_0)\prod_n q(x_n \mid x_{n-1})$. Nothing in it is learned.
? Why does the forward process use many small steps?
So that each step is easy to reverse, which is what the model learns to do.
```
