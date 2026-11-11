---
id: image-as-vector
title: An image as a vector
summary: A picture is a long list of numbers, one for each colour of each pixel, so it can be treated as a single vector.
colour: linalg
level: 1
needs: [vectors]
---

## The idea {#idea}

A colour picture that is 64 pixels wide and 64 tall has $64 \times 64 = 4096$ pixels, and each pixel has three numbers (red, green, blue). Write all of them in one long column and the picture becomes a vector with $4096 \times 3 = 12288$ entries.

$$x_0 = \begin{pmatrix} \text{red of pixel 1} \\ \text{green of pixel 1} \\ \text{blue of pixel 1} \\ \vdots \\ \text{blue of pixel 4096} \end{pmatrix}$$

The number of entries is called the **dimension**, $d$. Slide 42 uses $d$ directly.

## Scaling the numbers {#scale}

Diffusion models usually rescale each pixel value from the range 0–255 to the range $-1$ to $1$. That way a clean picture and pure noise (which mostly lands between about $-2$ and $2$) live on a similar scale.

## Why bother? {#why}

Once a picture is a vector, everything you know about vectors works on it. "Add noise to the picture" is just "add a random vector". "Scale the picture by $0.9$" is just multiplying the vector by $0.9$. The formulas on slide 19 are written for whole pictures at once, but they act on every entry separately.

## Quick check {#check}

```check
? A greyscale picture (one number per pixel) is 28 pixels by 28 pixels. What is its dimension $d$?
= 784 ± 0.1
wrong: Count one number per pixel: width times height.
hint: $28 \times 28$.
answer: $28 \times 28 = 784$.
? A pixel's red value is 255 on the 0–255 scale. What is it on the $-1$ to $1$ scale?
= 1 ± 0.001
wrong: The scale maps 0 to $-1$ and 255 to $1$.
hint: Use $v/127.5 - 1$.
answer: $255/127.5 - 1 = 1$.
```

```recall
? How does a colour picture become a vector, and what is its dimension?
List the red, green and blue values of every pixel in one long column. The dimension is width × height × 3.
? Why are pixel values rescaled to the range $-1$ to $1$?
So that clean pictures and standard normal noise live on a similar scale.
```
