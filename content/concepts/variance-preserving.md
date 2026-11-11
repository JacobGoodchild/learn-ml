---
id: variance-preserving
title: Why the spread stays at 1
summary: Each step keeps $\alpha_n$ of the old variance and adds $\beta_n$ of new. They add to 1, so the spread never blows up or shrinks away.
colour: diffusion
level: 4
needs: [diffusion-step, scaling-and-adding]
related: [pure-noise-endpoint]
entryPoints:
  - label: the one-line proof
    section: the-one-line-proof
  - label: without the square roots
    section: try-removing-the-square-roots
---

```formula The one-line proof
\mathrm{Var}(x_n) = \p{alpha-n-ddpm}{\alpha_n}\,\mathrm{Var}(x_{n-1}) + \p{beta-n-ddpm}{\beta_n} = \alpha_n + \beta_n = 1
---
In words: kept share plus new share equals 1, as long as the variance was 1 before the step.
$\p{alpha-n-ddpm}{\alpha_n}\,\mathrm{Var}(x_{n-1})$ :: the old picture, scaled by $\sqrt{\alpha_n}$, keeps $\alpha_n$ of its variance
$\p{beta-n-ddpm}{\beta_n}$ :: the new noise, scaled by $\sqrt{\beta_n}$, brings variance $\beta_n$
```

The two parts are independent, so their variances [add](c:scaling-and-adding). This is why the formula insists $\alpha_n = 1 - \beta_n$, and why it uses square roots.

```visual spread-keeper Try removing the square roots
```

```keypoint Real pictures start below 1
Pixels between $-1$ and $1$ have variance at most 1. Below 1, each step nudges the variance *up* towards 1, never past it. Either way, the end is a bell curve with spread exactly 1.
```

## Check yourself {#check}

```check
? A pixel's value has variance 1. After one step with $\beta_n = 0.3$, what is its variance?
= 1 ± 0.0001
wrong: Use $\alpha_n \times 1 + \beta_n$ with $\alpha_n = 1 - \beta_n$.
hint: $0.7 \times 1 + 0.3$.
answer: $0.7 + 0.3 = 1$.
? Without the square roots, one step with $\beta = 0.5$ gives variance $\alpha^2 + \beta^2$. What is it?
= 0.5 ± 0.0001
wrong: $\alpha = 0.5$; square both and add.
hint: $0.5^2 + 0.5^2$.
answer: $0.25 + 0.25 = 0.5$: the spread halves in one step.
? A pixel starts with variance $0.5$. What happens over many steps?
- [x] It creeps towards 1 :: Right: $\alpha_n \times 0.5 + \beta_n$ is a bit more than $0.5$ each time.
- [ ] It stays at 0.5 :: Only exactly 1 stays put.
- [ ] It shrinks to 0 :: The fresh noise keeps topping it up.
hint: Work out $\alpha_n \times 0.5 + \beta_n$ for a small $\beta_n$.
answer: It rises towards 1.
```

```recall
? Prove in one line that a noising step keeps variance 1.
$\mathrm{Var}(\sqrt{\alpha_n}x_{n-1} + \sqrt{\beta_n}\epsilon_n) = \alpha_n \cdot 1 + \beta_n \cdot 1 = 1$, using independence and $\alpha_n + \beta_n = 1$.
? Why does the spread stay at 1 rather than shrink or grow?
Each step keeps a share $\alpha_n$ of the old variance and adds $\beta_n$ of new; the shares add to 1, and the square roots make the scale factors act on variances correctly.
```
