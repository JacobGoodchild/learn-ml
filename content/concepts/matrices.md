---
id: matrices
title: Matrices
summary: A grid of numbers. Multiplying a vector by a matrix transforms it, as in Wx + b.
colour: linalg
level: 0
needs: [vectors]
---

From Further Maths: a **matrix** is a rectangular grid of numbers. Multiplying a vector by a matrix gives a new vector, and this is how rotations, stretches and the layers of a neural network ($W\mathbf{x} + \mathbf{b}$) are written.

$$\begin{pmatrix} 2 & 0 \\ 0 & 3 \end{pmatrix}\begin{pmatrix} 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}$$

In probability, matrices also turn up as a way to describe the spread of a random vector. For adding noise, the only matrix you need is the simplest one, the [identity matrix](c:identity-matrix).
