---
id: identity-matrix
title: The identity matrix, I
summary: The matrix with 1s down the diagonal and 0s elsewhere. Multiplying by it changes nothing.
colour: linalg
level: 0
needs: [matrices]
---

$$I = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{pmatrix}$$

It is the matrix version of the number 1: $I\mathbf{v} = \mathbf{v}$ for every vector $\mathbf{v}$. Its size matches whatever it is used with; for a picture with $d$ numbers in it, $I$ is $d \times d$.

**How the slides use it.** In $\mathcal N(\mu, \beta_n I)$, the $I$ says two things about the noise: every pixel gets noise of the *same* size, $\beta_n$ (the 1s on the diagonal), and the noise on different pixels is *unrelated* (the 0s everywhere else). The page on [isotropic Gaussians](c:isotropic-gaussian) explains why.
