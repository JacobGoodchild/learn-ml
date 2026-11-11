---
id: conditional-probability
title: Conditional probability
summary: The probability of A once you already know B has happened, written P(A | B).
colour: probability
level: 0
needs: [probability-basics]
---

You met this in A-level statistics with tree diagrams and Venn diagrams. The bar $\mid$ is read "given".

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Knowing $B$ shrinks the world to just the cases where $B$ happened, and asks what fraction of *those* also have $A$.

**Example.** A card is drawn from a normal pack. $P(\text{king}) = \frac{4}{52}$. But $P(\text{king} \mid \text{picture card}) = \frac{4}{12}$, because once you know it is a picture card there are only 12 cards it could be.

Diffusion models use the same bar for whole distributions, such as $q(x_1 \mid x_0)$. That idea is one step up: [conditional distributions](c:conditional-distribution).
