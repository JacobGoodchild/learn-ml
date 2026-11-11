---
id: x-n-ddpm
title: $x_0$ to $x_N$: the picture at each step
summary: $x_0$ is a clean picture. $x_n$ is the same picture after $n$ steps of noise.
colour: diffusion
level: 2
needs: [image-as-vector, subscripts, random-variable]
related: [forward-process]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```notation The pictures along the way
$x_0$ :: a clean picture from the data
$x_n$ :: the picture after $n$ noising steps
$x_{n-1}$ :: one step earlier, slightly less noisy
$x_N$ :: the last picture: pure static ($N$ is usually $1000$)
```

Each $x$ is a whole picture stored as a [vector](c:image-as-vector). Apart from $x_0$, each one is random: add fresh noise and you get a different $x_n$.

```visual noising Slide through the steps
```

## Check yourself {#check}

```check
? What is $x_{n-1}$?
- [x] The picture one noising step before $x_n$ :: Right: one step less noisy.
- [ ] The picture with one pixel removed :: The subscript counts steps, not pixels.
- [ ] A clean picture :: Only $x_0$ is clean.
hint: The subscript counts noising steps.
answer: The picture after $n - 1$ steps.
? If $N = 1000$, how many pictures are in the list $x_0, x_1, \dots, x_N$?
= 1001 ± 0.1
wrong: Count $x_0$ as well as $x_1$ to $x_{1000}$.
hint: From 0 to 1000 inclusive.
answer: $1000 + 1 = 1001$.
```

```recall
? In the noising process, what are $x_0$, $x_n$ and $x_N$?
$x_0$ is a clean picture; $x_n$ is it after $n$ noising steps; $x_N$ is the final picture, essentially pure noise.
? Each step of noise is tiny. Why does the picture still disappear completely by $x_N$?
There are many steps. Each shrinks the picture a little and adds a little noise, and the effect builds up.
```
