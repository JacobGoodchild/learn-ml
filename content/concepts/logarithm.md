---
id: logarithm
title: Logarithms
summary: The log undoes the exponential. It turns multiplying into adding, which is why probabilities are so often logged.
colour: calculus
level: 0
needs: [exponential-function]
---

From A-level Maths: $\log x$ is the power you raise $e$ to in order to get $x$. On the slides, $\log$ always means the natural log, the one you write $\ln$.

The rule that matters most here:

$$\log(ab) = \log a + \log b, \qquad \log\frac{a}{b} = \log a - \log b$$

Probabilities of long chains are products of many small numbers, which quickly become too small for a computer to store. Taking the log turns the product into a sum of manageable numbers. That is why slide 31 is full of $\log p$ and $\log q$.

Two more facts used later: $\log 1 = 0$, and $\log x$ is negative when $0 < x < 1$, so the log of a probability is never positive.
