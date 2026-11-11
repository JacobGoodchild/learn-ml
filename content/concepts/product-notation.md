---
id: product-notation
title: Product notation, $\prod$
summary: Capital pi means "multiply all of these together", like $\sum$ means "add them up".
colour: notation
level: 1
needs: [subscripts]
---

```formula Multiply them all
\prod_{i=1}^{n} a_i = a_1 \times a_2 \times \cdots \times a_n
---
In words: "the product of $a_i$ for $i$ from 1 to $n$".
```

```keypoint Many numbers just under 1
$\prod_{i=1}^{100} 0.99 = 0.99^{100} \approx 0.37$. Multiply lots of numbers slightly below 1 and the result drains away. That is how the picture [fades](c:alpha-bar-n).
```

## Check yourself {#check}

```check
? Work out $\displaystyle\prod_{i=1}^{3} (i + 1)$.
= 24 ± 0.0001
wrong: Multiply $(1+1)$, $(2+1)$ and $(3+1)$.
hint: $2 \times 3 \times 4$.
answer: $24$.
? Roughly what is $0.99^{100}$?
- [ ] About 0.99 :: There are a hundred factors, each taking off 1%.
- [x] About 0.37 :: Right.
- [ ] Exactly 0 :: Small, but never exactly 0.
hint: Each factor takes off 1% of what is left.
answer: About $0.366$.
```

```recall
? What does $\prod_{i=1}^{n} a_i$ mean?
Multiply all the $a_i$ together, from $i = 1$ to $n$.
? What happens when you multiply many numbers slightly less than 1?
The product shrinks steadily towards 0.
```
