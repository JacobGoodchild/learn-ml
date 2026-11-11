---
id: pure-noise-endpoint
title: Why $x_N$ ends as pure noise
summary: After enough steps the surviving share of the picture, $\bar\alpha_N$, is almost zero, so $x_N$ is just standard normal noise, whatever picture you started with.
colour: diffusion
level: 6
needs: [alpha-bar-n, standard-normal, isotropic-gaussian, variance-preserving]
related: [forward-process]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: Section 4 chooses the schedule so that the signal-to-noise ratio at x_T is as small as possible
---

```formula
\p{x-n-ddpm}{x_N} \approx \p{isotropic-gaussian}{\mathcal N}(\p{standard-normal}{0},\ \p{identity-matrix}{I})
```

## In words {#aloud}

"After all $N$ steps, the picture is approximately a standard normal sample on every pixel: mean 0, variance 1, independent."

## Why it is true {#why}

From the [shortcut](c:alpha-bar-n):

$$x_N = \sqrt{\bar\alpha_N}\,x_0 + \sqrt{1 - \bar\alpha_N}\,\epsilon$$

With the DDPM schedule, $\bar\alpha_{1000} \approx 0.00004$. So the picture is multiplied by $\sqrt{0.00004} \approx 0.006$, which wipes it out, and the noise is multiplied by $\sqrt{0.99996} \approx 1$. What is left is almost exactly $\epsilon$, a standard normal sample.

The "$\approx$" is honest: a tiny trace of the picture is still there. It is far too small to see or to matter.

## Why this matters {#matters}

This is the whole point of the forward process. The end of the chain no longer depends on which picture you started with. Every picture, a dog, a car, a face, ends up as the same kind of static.

So to *make* a new picture, you can run the process backwards from a fresh sample of $\mathcal N(0, I)$, which a computer can draw instantly. 

## Check yourself {#check}

```check
? If $\bar\alpha_N = 0.0001$, by what factor is the clean picture scaled inside $x_N$?
= 0.01 ± 0.0001
wrong: The picture is scaled by the square root of $\bar\alpha_N$.
hint: $\sqrt{0.0001}$.
answer: $\sqrt{0.0001} = 0.01$: only 1% of the picture's scale remains.
? Two very different pictures are each noised for all $N$ steps. What can you say about $x_N$ for each?
- [x] Both look like the same kind of static: standard normal noise :: Right: the starting picture has been almost completely forgotten.
- [ ] They still look like faded versions of their pictures :: After all $N$ steps, about 0.6% of the scale is left, far too little to see.
- [ ] They become identical :: They are both random static, but different random draws.
hint: How big is $\sqrt{\bar\alpha_N}$?
answer: Both are (almost exactly) fresh samples of $\mathcal N(0, I)$. The process has forgotten where it started.
```

```recall
? Why is $x_N$ approximately $\mathcal N(0, I)$, whatever the starting picture?
Because $\bar\alpha_N$ is tiny, so $x_N = \sqrt{\bar\alpha_N}x_0 + \sqrt{1 - \bar\alpha_N}\epsilon$ is almost exactly $\epsilon$.
? Why is it useful that the forward process forgets its starting point?
Generation can start from fresh $\mathcal N(0, I)$ noise, which is easy to draw, and run the learned reverse process back to a new picture.
```
