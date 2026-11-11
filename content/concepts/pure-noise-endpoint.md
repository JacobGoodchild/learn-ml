---
id: pure-noise-endpoint
title: Why it ends as pure noise
summary: After enough steps almost nothing of the picture survives, so the last picture is just standard noise.
colour: diffusion
level: 6
needs: [alpha-bar-n, standard-normal, isotropic-gaussian, variance-preserving]
related: [forward-process]
sources:
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
---

```formula The last picture
\p{x-n-ddpm}{x_N} \approx \p{isotropic-gaussian}{\mathcal N}(\p{standard-normal}{0},\ \p{identity-matrix}{I})
---
In words: every pixel of the last picture is a fresh standard bell-curve value.
$0$ :: mean 0 on every pixel
$I$ :: variance 1 on every pixel, all independent
```

```formula Why: the jump from $x_0$ to $x_N$
x_N = \p{alpha-bar-n}{\sqrt{\bar\alpha_N}}\,x_0 + \sqrt{1 - \bar\alpha_N}\,\epsilon
---
In words: the clean picture is scaled by almost nothing, the noise by almost 1.
$\p{alpha-bar-n}{\sqrt{\bar\alpha_N}}$ :: about $0.006$ with a typical schedule: the picture is wiped out
$\sqrt{1 - \bar\alpha_N}$ :: about $1$: what is left is just the noise $\epsilon$
```

```keypoint Why this matters
Every picture, a dog or a car or a face, ends up as the same kind of static. So to make a new picture, start from fresh static (easy to draw) and run the process backwards.
```

## Check yourself {#check}

```check
? If $\bar\alpha_N = 0.0001$, by what factor is the clean picture scaled inside $x_N$?
= 0.01 ± 0.0001
wrong: The picture is scaled by the square root of $\bar\alpha_N$.
hint: $\sqrt{0.0001}$.
answer: $\sqrt{0.0001} = 0.01$: only 1% of the picture's scale remains.
? Two very different pictures are each noised for all $N$ steps. What are they now?
- [x] The same kind of static: standard normal noise :: Right: the starting picture is almost completely forgotten.
- [ ] Faded versions of their pictures :: About 0.6% of the scale is left, far too little to see.
- [ ] Identical :: Both are random static, but different random draws.
hint: How big is $\sqrt{\bar\alpha_N}$?
answer: Both are (almost exactly) fresh samples of $\mathcal N(0, I)$.
```

```recall
? Why is $x_N$ approximately $\mathcal N(0, I)$, whatever the starting picture?
Because $\bar\alpha_N$ is tiny, so $x_N = \sqrt{\bar\alpha_N}x_0 + \sqrt{1 - \bar\alpha_N}\epsilon$ is almost exactly $\epsilon$.
? Why is it useful that the noising process forgets its starting point?
Generation can start from fresh $\mathcal N(0, I)$ noise, which is easy to draw, and run the learned reverse process back to a new picture.
```
