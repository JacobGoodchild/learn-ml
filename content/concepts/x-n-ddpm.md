---
id: x-n-ddpm
title: $x_0$ to $x_N$: the picture at each step
summary: $x_0$ is a clean picture from the data. $x_n$ is the same picture after $n$ steps of noise. $x_N$ is the last one.
colour: diffusion
level: 2
needs: [image-as-vector, subscripts, random-variable]
related: [forward-process]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: The paper writes T for the number of steps and t for the step; this site writes N and n
---

## The idea {#idea}

Every $x$ in the noising process is a whole picture, stored as a [vector](c:image-as-vector). The subscript says how many noising steps it has been through.

```notation
$x_0$ :: a clean picture, drawn from the real data (photos of dogs, say). Its distribution, $q(x_0)$, is "what real pictures look like".
$x_n$ :: the picture after $n$ steps of noise. Each step adds a little more.
$x_{n-1}$ :: the picture one step earlier than $x_n$.
$x_N$ :: the very last picture, after all $N$ steps. In practice it is pure static.
```

All of them, apart from $x_0$, are [random variables](c:random-variable): add fresh noise and you get a different $x_n$. Even $x_0$ is random in the sense that it is drawn at random from the data.

## How many steps? {#how-many}

In the original paper, $N = 1000$. That sounds like a lot, but each step is tiny. The first step adds noise with a standard deviation of just $0.01$ to pixels that range from $-1$ to $1$.

```visual noising
```

## Check yourself {#check}

```check
? In the noising process, what is $x_{n-1}$?
- [x] The picture one noising step before $x_n$ :: Right: one step less noisy.
- [ ] The picture with one pixel removed :: The subscript counts steps, not pixels.
- [ ] A clean picture :: Only $x_0$ is clean.
hint: The subscript counts noising steps.
answer: The picture after $n - 1$ steps: one step less noisy than $x_n$.
? If $N = 1000$, how many pictures are there in the list $x_0, x_1, \dots, x_N$?
= 1001 ± 0.1
wrong: Remember to count $x_0$ as well as $x_1$ to $x_{1000}$.
hint: From 0 to 1000 inclusive.
answer: $1000 + 1 = 1001$: the clean picture plus one for each step.
```

```recall
? In the noising process, what are $x_0$, $x_n$ and $x_N$?
$x_0$ is a clean picture from the data; $x_n$ is it after $n$ noising steps; $x_N$ is the final picture after all $N$ steps, which is essentially pure noise.
? Each step of noise is tiny. Why does the picture still disappear completely by $x_N$?
Because there are many steps ($N = 1000$ in the paper). Each one shrinks the picture a little and adds a little noise, and the effect builds up until nothing of the picture is left.
```
