---
id: subscripts
title: Subscripts and sequences
summary: x with a small number underneath, like x sub n, means the n-th item in a list.
colour: notation
level: 0
---

From A-level sequences: $u_1, u_2, u_3, \dots$ is a list, and $u_n$ is the $n$-th term. Diffusion uses the same idea with $x_0, x_1, \dots, x_N$: one picture for each step of the noising process. $x_{n-1}$ is the one just before $x_n$.

Sometimes the subscript goes on Greek letters too, as in $\alpha_n$ and $\beta_n$. That just means there is a separate number for each step: $\beta_1, \beta_2, \dots, \beta_N$.

Watch out: some explanations swap the step number $n$ for a continuous time $t$, so $x_t$ instead of $x_n$. Same idea, smoother clock.
