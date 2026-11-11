---
id: image-as-vector
title: A picture as a vector
summary: A picture is a long list of numbers, one per colour per pixel, so it can be treated as one vector.
colour: linalg
level: 1
needs: [vectors]
---

```formula A picture, written as one column
x_0 = \begin{pmatrix} \text{red of pixel 1} \\ \text{green of pixel 1} \\ \text{blue of pixel 1} \\ \vdots \\ \text{blue of the last pixel} \end{pmatrix}
---
In words: list every colour value of every pixel in one long column.
$d$ :: the number of entries (the **dimension**): width × height × 3
```

```keypoint Why bother
Once a picture is a vector, "add noise" is just "add a random vector", and "fade the picture" is just multiplying by a number. Pixel values are usually rescaled from 0–255 to $-1$ to $1$, the same scale as standard noise.
```

```example A 64 × 64 colour picture
$64 \times 64 = 4096$ pixels, times 3 colours: $d = 12288$.
```

## Check yourself {#check}

```check
? A greyscale picture (one number per pixel) is 28 by 28. What is $d$?
= 784 ± 0.1
wrong: One number per pixel: width times height.
hint: $28 \times 28$.
answer: $784$.
? A red value is 255 on the 0–255 scale. What is it on the $-1$ to $1$ scale?
= 1 ± 0.001
wrong: The scale maps 0 to $-1$ and 255 to $1$.
hint: $v/127.5 - 1$.
answer: $1$.
```

```recall
? How does a colour picture become a vector, and what is its dimension?
List the red, green and blue value of every pixel in one column; dimension = width × height × 3.
? Why are pixel values rescaled to $-1$ to $1$?
So clean pictures and standard noise live on a similar scale.
```
