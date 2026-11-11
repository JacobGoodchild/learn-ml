---
id: proof-symbols
title: ⇔ and ⇒
summary: A double arrow both ways means the two statements are equivalent. A single arrow means the first leads to the second, but not necessarily back.
colour: notation
level: 0
---

From A-level proof: $A \Rightarrow B$ means "if $A$ then $B$". $A \Leftrightarrow B$ means "$A$ if and only if $B$": each implies the other, so they are really the same statement.

In the maths of training diffusion models the arrows are used a little loosely, between *problems* rather than statements:

- $\Longleftrightarrow$ means "solving this problem is exactly the same as solving that one": they have the same best answer.
- $\Rightarrow$ means "which in practice leads us to this one instead": a related, simpler problem, but not exactly the same.

So a chain like $A \Longleftrightarrow B \Rightarrow C$ there says: minimising KL *is* maximising the ELBO, and that in turn *leads to* the score-matching loss people actually train with.
