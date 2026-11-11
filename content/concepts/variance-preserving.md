---
id: variance-preserving
title: Why the spread stays at 1
summary: Each step keeps α_n of the old variance and adds β_n of new noise. Since α_n + β_n = 1, a picture with spread 1 keeps spread 1.
colour: diffusion
level: 4
needs: [diffusion-step, scaling-and-adding]
related: [pure-noise-endpoint]
entryPoints:
  - label: the one-line proof
    section: proof
  - label: what goes wrong without the square roots
    section: without
---

## The key formula {#formula}

```formula
\mathrm{Var}(x_n) = \p{alpha-n-ddpm}{\alpha_n}\,\mathrm{Var}(x_{n-1}) + \p{beta-n-ddpm}{\beta_n} \;=\; \alpha_n + \beta_n = 1 \quad\text{if } \mathrm{Var}(x_{n-1}) = 1
```

## Read it aloud {#aloud}

"The variance after the step is $\alpha_n$ times the variance before, plus $\beta_n$. If the variance before was 1, the variance after is $\alpha_n + \beta_n$, which is 1."

## The one-line proof {#proof}

Start from the [recipe](c:diffusion-step): $x_n = \sqrt{\alpha_n}\,x_{n-1} + \sqrt{\beta_n}\,\epsilon_n$. The two parts are independent, so their variances add, and each scale factor comes out squared ([scaling and adding](c:scaling-and-adding)):

$$\mathrm{Var}(x_n) = (\sqrt{\alpha_n})^2\,\mathrm{Var}(x_{n-1}) + (\sqrt{\beta_n})^2 \times 1 = \alpha_n\,\mathrm{Var}(x_{n-1}) + \beta_n$$

Put in $\mathrm{Var}(x_{n-1}) = 1$ and use $\alpha_n = 1 - \beta_n$: you get exactly 1. This is why the slide insists $\alpha_n = 1 - \beta_n$. Pixels scaled to the range $-1$ to $1$ have a spread of roughly this size, so every picture along the chain stays on the same scale, and the end point is a bell curve with spread exactly 1. People call this design **variance preserving**.

## What goes wrong without the square roots {#without}

Suppose someone wrote $x_n = \alpha_n x_{n-1} + \beta_n \epsilon_n$ instead. Then the variance would be $\alpha_n^2 + \beta_n^2$, which is *less* than 1 whenever $0 < \beta_n < 1$. Repeat that a thousand times and everything collapses towards 0. Try it below by unticking the box.

```visual spread-keeper
```

## Quick check {#check}

```check
? A pixel's value has variance 1. After one step with $\beta_n = 0.3$, what is its variance?
= 1 ± 0.0001
wrong: Use $\alpha_n \times 1 + \beta_n$ with $\alpha_n = 1 - \beta_n$.
hint: $0.7 \times 1 + 0.3$.
answer: $0.7 + 0.3 = 1$. The spread is preserved.
? Without the square roots, one step with $\beta = 0.5$ would give variance $\alpha^2 + \beta^2$. What is it?
= 0.5 ± 0.0001
wrong: $\alpha = 1 - 0.5 = 0.5$; square both and add.
hint: $0.5^2 + 0.5^2$.
answer: $0.25 + 0.25 = 0.5$. The spread halves in one step, which is why the square roots are needed.
? If a pixel starts with variance $0.5$ (not 1), what happens to its variance over many steps?
- [x] It creeps towards 1 :: Right: $\alpha_n \times 0.5 + \beta_n$ is a bit more than $0.5$. Each step moves it a little closer to 1.
- [ ] It stays at 0.5 :: Only a variance of exactly 1 stays put.
- [ ] It shrinks to 0 :: The fresh noise keeps topping it up.
hint: Work out $\alpha_n \times 0.5 + \beta_n$ for a small $\beta_n$.
answer: It rises towards 1. Variance 1 is the steady value the process heads for, whatever the start.
```

```recall
? Prove in one line that a noising step keeps variance 1.
$\mathrm{Var}(\sqrt{\alpha_n}x_{n-1} + \sqrt{\beta_n}\epsilon_n) = \alpha_n \cdot 1 + \beta_n \cdot 1 = 1$, using independence and $\alpha_n + \beta_n = 1$.
? Why does the spread stay at 1 rather than shrink or grow?
Each step keeps a share $\alpha_n$ of the old variance and adds $\beta_n$ of new; the shares add to 1, and the square roots make the scale factors act on variances correctly.
```
