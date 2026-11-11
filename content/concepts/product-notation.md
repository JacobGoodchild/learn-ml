---
id: product-notation
title: Product notation, $\prod$
summary: Capital pi means "multiply all of these together", just as capital sigma means "add them all up".
colour: notation
level: 1
needs: [subscripts]
---

## The key formula {#formula}

```formula
\prod_{i=1}^{n} a_i = a_1 \times a_2 \times \cdots \times a_n
```

## Read it aloud {#aloud}

"The product of $a_i$ for $i$ from 1 to $n$." It works exactly like $\sum$ from A-level, but multiplying instead of adding.

## A worked example {#example}

$$\prod_{i=1}^{4} i = 1 \times 2 \times 3 \times 4 = 24 = 4!$$

$$\prod_{i=1}^{3} 0.9 = 0.9^3 = 0.729$$

The second one matters for diffusion. Multiply lots of numbers that are each a little less than 1, and the result shrinks towards 0. That is exactly how $\bar\alpha_n$ works: see [how much of the picture survives](c:alpha-bar-n).

## Quick check {#check}

```check
? Work out $\displaystyle\prod_{i=1}^{3} (i + 1)$.
= 24 ± 0.0001
wrong: Multiply $(1+1)$, $(2+1)$ and $(3+1)$.
hint: $2 \times 3 \times 4$.
answer: $2 \times 3 \times 4 = 24$.
? Roughly what is $0.99^{100}$, that is, $\prod_{i=1}^{100} 0.99$?
- [ ] About 0.99 :: Each factor takes off another 1%, and there are a hundred of them.
- [x] About 0.37 :: Right: close to $e^{-1}$. Many factors just below 1 shrink the product a lot.
- [ ] Exactly 0 :: It gets small, but never exactly 0.
hint: Each factor takes off 1% of what is left.
answer: About $0.366$. A long product of numbers just under 1 drains away steadily.
```

```recall
? What does $\prod_{i=1}^{n} a_i$ mean?
Multiply all the $a_i$ together, from $i = 1$ to $n$.
? What happens when you multiply many numbers that are each slightly less than 1?
The product shrinks steadily towards 0, which is how the picture fades in diffusion.
```
