---
id: beta-n-ddpm
title: $\beta_n$: the noise schedule
summary: $\beta_n$ is how much noise step $n$ adds. The list $\beta_1, \dots, \beta_N$ is the noise schedule.
colour: diffusion
level: 3
needs: [variance, subscripts]
related: [alpha-n-ddpm]
entryPoints:
  - label: a typical schedule
    section: a-typical-schedule
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```notation What $\beta_n$ is
$\beta_n$ :: the **variance** of the noise added at step $n$
$\sqrt{\beta_n}$ :: its standard deviation: the typical size of the push each pixel gets
$\beta_1, \dots, \beta_N$ :: one value per step: the noise schedule, chosen by hand, never learned
```

```keypoint A typical schedule
$N = 1000$ steps, with $\beta_n$ rising in a straight line from $0.0001$ to $0.02$. Early steps push each pixel by about $0.01$; late steps by about $0.14$.

Start gentle, because early on the picture is detailed and small changes are easier to undo. Later the picture is mostly noise, so bigger steps lose nothing.
```

## Check yourself {#check}

```check
? $\beta_n = 0.0004$. What is the standard deviation of the noise added at step $n$?
= 0.02 ± 0.0001
wrong: $\beta_n$ is a variance. Take its square root.
hint: $\sqrt{0.0004}$.
answer: $\sqrt{0.0004} = 0.02$.
? Is the noise schedule learned during training?
- [ ] Yes, the network learns the best $\beta_n$ :: The schedule is fixed before training starts.
- [x] No, it is chosen by hand :: Right. Adding noise has nothing to learn.
hint: Is there a model anywhere in the noising process?
answer: No. It is a fixed design choice.
```

```recall
? What does $\beta_n$ mean in the noising process, and is it a variance or a standard deviation?
It is the variance of the fresh noise added at step $n$. Its square root is the standard deviation.
? Why does a typical schedule start with tiny $\beta$ and grow?
Early steps act on detailed pictures, so small changes are easier to undo; once the picture is mostly noise, bigger steps cost nothing.
```
