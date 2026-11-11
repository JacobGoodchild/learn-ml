---
id: beta-n-ddpm
title: βₙ: the noise schedule
summary: β_n is the variance of the fresh noise added at step n. The list β₁, …, β_N is called the noise schedule.
colour: diffusion
level: 3
needs: [variance, subscripts]
related: [alpha-n-ddpm]
entryPoints:
  - label: how much noise each step adds
    section: idea
  - label: the schedule in the original paper
    section: schedule
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Section 4 and Appendix B give the linear schedule from 0.0001 to 0.02 over 1000 steps
---

## The idea {#idea}

At step $n$, fresh noise is added to the picture. $\beta_n$ (Greek "beta") is the **variance** of that noise on each pixel. Its square root, $\sqrt{\beta_n}$, is the standard deviation: the typical size of the push each pixel gets.

There is one $\beta$ for each step: $\beta_1, \beta_2, \dots, \beta_N$. Together they are the **noise schedule**. Each one is a number between 0 and 1, and in practice they are small.

Nothing here is learned. The schedule is chosen by hand before training starts.

## The schedule in the original paper {#schedule}

The DDPM paper used $N = 1000$ steps, with $\beta_n$ rising in a straight line from $\beta_1 = 0.0001$ to $\beta_{1000} = 0.02$. So early steps add very little noise (standard deviation $0.01$) and late steps add more (standard deviation about $0.14$).

Why start gently? Early on the picture is still detailed, and small steps keep each change easy for the model to learn to undo. Later, when the picture is mostly noise anyway, bigger steps lose nothing.

## A worked example {#example}

With the straight-line schedule, step 500 has $\beta_{500} \approx 0.01004$. So the noise added at that step has standard deviation $\sqrt{0.01004} \approx 0.1$: each pixel is pushed by roughly $0.1$, up or down.

## Quick check {#check}

```check
? $\beta_n = 0.0004$. What is the standard deviation of the noise added at step $n$?
= 0.02 ± 0.0001
wrong: $\beta_n$ is a variance. Take its square root.
hint: $\sqrt{0.0004}$.
answer: $\sqrt{0.0004} = 0.02$.
? Is the noise schedule learned during training?
- [ ] Yes, the network learns the best $\beta_n$ :: In the setting of slide 19 the schedule is fixed in advance.
- [x] No, it is chosen by hand before training :: Right. On slide 19 the forward process has nothing to learn.
hint: Slide 19 is the forward process. Is there a model in it?
answer: No. It is a fixed design choice. The forward process $q$ has nothing learned in it.
```

```recall
? What does $\beta_n$ mean on slide 19, and is it a variance or a standard deviation?
It is the variance of the fresh noise added at step $n$. Its square root is the standard deviation.
? Why does the DDPM schedule start with tiny $\beta$ and grow?
Early steps act on detailed pictures, so small changes are easier to undo; once the picture is mostly noise, bigger steps cost nothing.
```
