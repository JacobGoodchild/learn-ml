---
id: forward-process
title: The forward (noising) process
summary: The whole chain from clean picture to static, written as one joint distribution built from N small steps.
colour: diffusion
level: 5
needs: [markov-chain, diffusion-step, joint-distribution, x-n-ddpm]
related: [pure-noise-endpoint, alpha-bar-n]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Section 2, the "forward process or diffusion process"
---

```formula
\p{joint-distribution}{q(x_0,\dots,x_N)} = \p{probability-distribution}{q(x_0)}\,\p{diffusion-step}{q(x_1\mid x_0)}\cdots \p{diffusion-step}{q(x_N\mid x_{N-1})}
```

## In words {#aloud}

"The chance of a clean picture together with a particular run of noisy versions is: the chance of the clean picture, times the chance of each noising step given the one before."

## The idea {#idea}

It packs the whole destroying process into one formula, and it works because the process is a [Markov chain](c:markov-chain): each step only needs the previous picture.

To *sample* from it, you do exactly what it says from left to right: pick a real picture ($q(x_0)$), then apply the [noising step](c:diffusion-step) $N$ times.

## Forward and backward {#direction}

This is called the **forward process** because it runs from data to noise. Everything about it is chosen by hand: there is nothing to learn. The interesting part of a diffusion model is a second chain, $p$, that runs the other way, from noise back to pictures. Training makes $p$ match $q$, and once it does, you can start from fresh static and walk backwards to a brand new picture.

The reason for using so many tiny steps is that each tiny step is easy to reverse. One giant leap from picture to static would be impossible to undo; a thousand small nudges can each be undone one at a time.

## Check yourself {#check}

```check
? How many noising-step factors $q(x_n \mid x_{n-1})$ are in the product when $N = 1000$?
= 1000 ± 0.1
wrong: There is one factor for each step from $x_0 \to x_1$ up to $x_{999} \to x_{1000}$.
hint: Steps 1 to $N$.
answer: 1000, one for each step. (Plus the single $q(x_0)$ at the front.)
? Why is the forward process allowed to be a simple product of one-step factors?
- [x] Because it is a Markov chain: each step only depends on the previous one :: Right: the chain rule's long conditions shrink to just the previous step.
- [ ] Because all the pictures are independent :: They are strongly linked: each one is made from the last.
- [ ] Because the network is trained to make it so :: There is no network in the forward process.
hint: What does the chain rule turn into for a short-memory process?
answer: It is a Markov chain, so $q(x_n \mid x_0, \dots, x_{n-1}) = q(x_n \mid x_{n-1})$ and the chain rule collapses to this product.
? Why use a thousand small steps instead of one big one?
- [x] Small steps are each easy to reverse, which is what the model must learn :: Right: undoing a tiny nudge is a much simpler problem than undoing everything at once.
- [ ] Small steps add less noise overall :: The end result is pure noise either way.
- [ ] One big step would not be a normal distribution :: A single jump can still be normal (see the shortcut with $\bar\alpha_n$).
hint: Think about the model's job later on.
answer: The model has to learn to undo each step. Tiny steps are each nearly easy to undo, whereas one huge step would be hopeless to reverse.
```

```recall
? What is the forward process, and is anything in it learned?
The chain that turns a clean picture into noise by repeated small noising steps, $q(x_0)\prod_n q(x_n \mid x_{n-1})$. Nothing in it is learned; it is designed by hand.
? Why does the forward process use many small steps?
So that each step is easy to reverse, which is what the model learns to do.
```
