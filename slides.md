# Learn ML — Tsinghua slide transcriptions

Source: Tsinghua University International Summer School on Generative AI, July 2025.
One lecture, one speaker, about 3 hours, roughly 154 slides. The slides present the work of
Tsinghua's machine learning group (TSAIL, Prof. Jun Zhu's lab): Analytic-DPM, DPM-Solver,
ProlificDreamer, EEGSDE, UniDiffuser. Speaker name: check the summer school programme
before crediting a specific person.

## Rules for using this file

- Formulas are copied **exactly** from the photos, including subscripts, bars, hats and tildes.
  Every formula has been cross-checked against the original paper (see `papers.md`).
  Anything uncertain is marked **CHECK**.
- Prose is paraphrased, not copied. The site must explain everything in its own words.
- The original photos must **never** be committed to the repo or shown on the site.
  Diagrams are described here so they can be redrawn as proper visuals.
- Slide numbers come from the slide footers where visible. Unnumbered slides are estimated.
- "Concepts needed" is a first draft of what each slide depends on. It seeds the concept map
  and will be refined.

## Notation warning (important for the whole site)

The same symbol means different things on different slides. The concept map must key nodes
by **meaning**, not by symbol, and every slide page should say which meaning applies.

| Symbol | Slides 19, 31, 42 (DDPM / Analytic-DPM) | Slides 54, 56 (DPM-Solver) | Slide 119 (ProlificDreamer) | EEGSDE slide |
|---|---|---|---|---|
| $\alpha$ | $\alpha_n = 1-\beta_n$, how much of the old image is kept in **one** step | $\alpha_t$ = total signal scale at time $t$ (equals $\sqrt{\bar\alpha_n}$ in DDPM terms) | — | polarizability (a molecule property) |
| $\sigma$ | $\sigma_n^2$ = variance of the model's reverse step | $\sigma_t$ = total noise scale at time $t$ | $\sigma_t$ = noise scale | — |
| $\mu$ | $\mu_n(\cdot)$ = mean of the reverse step | — | $\mu$ = a **distribution** over 3D scenes | dipole moment |
| $\bar\beta_n$ | $1-\bar\alpha_n$, where $\bar\alpha_n=\prod_{i=1}^{n}\alpha_i$ (total noise variance after $n$ steps) | — | — | — |
| $n$ | step index | Taylor-series term index | — | — |

Also: slides 19–42 use a discrete step $n = 0,1,\dots,N$; slides 25, 54, 56 use continuous time $t\in[0,T]$.

---

## Slide A — Typical Examples: Variational Auto-Encoder (VAE)
*Early in the lecture (unnumbered). Part 1: deep generative models overview.*

**Text (paraphrased):** Variational Bayesian inference for probabilistic models using neural networks (Kingma & Welling).
All parameters are learned together using SGD with variance reduction. The group lists its own follow-up work:
SUMO (unbiased estimation) and implicit variational inference.

**Formula:**
$$q(\mathbf{z}\mid\mathbf{x};\phi) \approx p(\mathbf{z}\mid\mathbf{x};\theta)$$

**Diagram (redraw):** Two small graphs side by side. Left: shaded node $x$ with a dashed red arrow up to node $z$, labelled $q(z\mid x;\phi)$ (the "inference path", encoder). Right: node $z$ with a solid arrow down to shaded node $x$ (the "generation path", decoder). Shaded = observed data.

**Citations on slide:** Kingma & Welling (slide says ICLR 2013; the paper appeared at ICLR 2014, arXiv Dec 2013). SUMO (Luo et al., ICLR 2020). Implicit variational inference (Shi et al., ICML 2018; Zhou et al., ICML 2020). Right edge of the slide is cut off in the photo.

**Concepts needed:** probability, conditional probability, latent variable, encoder/decoder, approximate posterior, parameters $\theta,\phi$, SGD, variance, KL divergence, ELBO.

---

## Slide B — Basics of Auto-Regressive DGMs
*Early in the lecture (unnumbered). DGM = deep generative model.*

**Formulas:**
$$\mathbf{x} = (x_1, x_2, \dots, x_d)$$
$$p(\mathbf{x}) = \prod_{i=1}^{d} p(x_i \mid x_1, x_2, \dots, x_{i-1}) = \prod_{i=1}^{d} p(x_i \mid \mathbf{x}_{<i})$$
$$\text{where } \mathbf{x}_{<i} = (x_1, x_2, \dots, x_{i-1})^{\top}$$

**Diagram (redraw):** Nodes $X_1, X_2, X_3, X_4$ in a row. Every node has an arrow to every node after it: $X_1\to X_2$, $X_1\to X_3$, $X_1\to X_4$, $X_2\to X_3$, $X_2\to X_4$, $X_3\to X_4$. Shows "each value depends on all earlier ones".

**Concepts needed:** vectors, sequences, product notation $\prod$, conditional probability, chain rule of probability, transpose. Good link: this is how language models generate text one token at a time.

---

## Slide 19 — Diffusion Probabilistic Models (DPMs)

**Text (paraphrased):** The diffusion process gradually adds noise to data. It is described by a Markov chain.

**Formulas:**
$$q(x_0,\dots,x_N) = q(x_0)\,q(x_1\mid x_0)\cdots q(x_N\mid x_{N-1})$$
$$\text{Transition of diffusion: } q(x_n\mid x_{n-1}) = \mathcal{N}\!\left(\sqrt{\alpha_n}\,x_{n-1},\ \beta_n I\right), \qquad \alpha_n = 1-\beta_n$$
$$x_N \approx \mathcal{N}(0, I)$$

**Diagram (redraw):** Blue circles $x_0 \to x_1 \to x_2 \to \cdots \to x_N$. Below, a strip of 8 images of a dog getting noisier left to right until pure colour static. Redraw with our own images (public-domain photo or generated), as an interactive noising slider.

**Citations on slide:** Demo images from Song et al., ICLR 2021. Ho et al., DDPM, NeurIPS 2020. Song et al., Score-based generative modeling through SDEs, ICLR 2021.

**Concepts needed:** image as a vector, normal distribution, mean and variance, $\mathcal{N}(\mu,\sigma^2 I)$ notation, identity matrix $I$, conditional probability, Markov chain, joint distribution as a product, $\alpha_n,\beta_n$ noise schedule.

---

## Slide 25 — Two Types of Diffusion Probabilistic Models
*Subtitle: Diffusion SDEs and Diffusion ODEs (Song et al., 2021)*

**Diffusion SDE:**
$$\mathrm{d}\boldsymbol{x}_t = \left[f(t)\boldsymbol{x}_t + \frac{g^2(t)}{\sigma_t}\boldsymbol{\epsilon}_\theta(\boldsymbol{x}_t,t)\right]\mathrm{d}t + g(t)\,\mathrm{d}\bar{\boldsymbol{w}}_t, \qquad \boldsymbol{x}_T \sim \mathcal{N}(\boldsymbol{0}, \tilde\sigma^2\boldsymbol{I})$$
Sampling with **DDPM** is equivalent to a **first-order** discretisation of diffusion SDEs (Song et al., 2021).

**Diffusion ODE:**
$$\frac{\mathrm{d}\boldsymbol{x}_t}{\mathrm{d}t} = f(t)\boldsymbol{x}_t + \frac{g^2(t)}{2\sigma_t}\boldsymbol{\epsilon}_\theta(\boldsymbol{x}_t,t), \qquad \boldsymbol{x}_T \sim \mathcal{N}(\boldsymbol{0}, \tilde\sigma^2\boldsymbol{I})$$
Sampling with **DDIM** is equivalent to a **first-order** discretisation of diffusion ODEs (Salimans et al., 2022).

**Notes:** Checked against DPM-Solver paper eqs. (2.5) and (2.7). $\bar{\boldsymbol w}_t$ is a reverse-time Wiener process (random kicks, time running backwards). $\boldsymbol\epsilon_\theta$ is the noise-prediction network. "First-order discretisation" = Euler's method.

**Concepts needed:** derivative, differential equation, ODE vs SDE, Euler's method, random walk / Brownian motion, noise prediction network, $f(t), g(t)$ (drift and diffusion coefficients), time running backwards from $T$ to $0$.

---

## Slide 31 — Diffusion Probabilistic Models (DPMs): training

**Text (paraphrased):** We want the real noising process $q$ to match the model $p$. This is done by minimising their KL divergence, which is the same as maximising the ELBO.

**Formulas:**
$$q(x_0,\dots,x_N) \approx p(x_0,\dots,x_N), \qquad p(x_{n-1}\mid x_n) = \mathcal{N}\!\left(\mu_n(x_n),\ \sigma_n^2 I\right)$$

Labels above the main line: "min KL", "max ELBO", "Reweighted ELBO (Score matching)".
$$\min_{\mu_n(\cdot),\,\sigma_n^2} KL\big(q(x_{0:N})\,\|\,p(x_{0:N})\big) \;\Longleftrightarrow\; \max_{\mu_n(\cdot),\,\sigma_n^2} \mathbb{E}_q \log\frac{p(x_{0:N})}{q(x_{1:N}\mid x_0)} \;\Rightarrow\; \min_{s_n(\cdot)} \mathbb{E}_n\,\bar\beta_n\,\mathbb{E}_{q_n(x_n)}\big\|s_n(x_n) - \nabla\log q_n(x_n)\big\|^2$$

Callout box pointing at the last step: DDPM only optimises the model **mean**, and uses a handcrafted model variance, e.g. $\sigma_n^2 = \beta_n$. Red text: **Suboptimal!**

$$\text{Parameterisation of } \mu_n(\cdot):\quad \mu_n(x_n) = \frac{1}{\sqrt{\alpha_n}}\big(x_n + \beta_n\,s_n(x_n)\big)$$

**Notes:** Matches Analytic-DPM paper (eq. 4–5). $s_n$ is the learned score, $s_n(x_n)\approx\nabla\log q_n(x_n)$. Relation to noise prediction: $s_n(x_n) = -\hat\epsilon_n(x_n)/\sqrt{\bar\beta_n}$. "Suboptimal!" is exactly the problem Analytic-DPM (slide 42) solves.

**Concepts needed:** KL divergence, log, expectation $\mathbb{E}$, ELBO, min/max of a function, $\Leftrightarrow$ vs $\Rightarrow$, gradient $\nabla$, score function $\nabla\log q$, norm $\|\cdot\|^2$, mean squared error, score matching, weighting $\bar\beta_n$.

---

## Slide 42 — Extensions of Analytic-DPMs
*Slide title says "Analytical-DPMs".*

**Formulas:**
$$q(x_0,\dots,x_N) \approx p(x_0,\dots,x_N), \qquad p(x_{n-1}\mid x_n) = \mathcal{N}\!\left(\mu_n(x_n),\ \Sigma_n(x_n)\right)$$
$$\min_{\mu_n(\cdot),\,\Sigma_n(\cdot)} KL\big(q(x_{0:N})\,\|\,p(x_{0:N})\big) \;\Longleftrightarrow\; \max_{\mu_n(\cdot),\,\Sigma_n(\cdot)} \mathbb{E}_q \log\frac{p(x_{0:N})}{q(x_{1:N}\mid x_0)}$$

Green box — **(Analytic-DPM)** Suppose $\Sigma_n(x_n) = \sigma_n^2$. The optimal solution is:
$$\mu_n^*(x_n) = \frac{1}{\sqrt{\alpha_n}}\left(x_n - \frac{\beta_n}{\sqrt{\bar\beta_n}}\,\mathbf{E}_{q(x_0\mid x_n)}[\epsilon_n]\right)$$
$$\sigma_n^{*2} = \frac{\beta_n}{\alpha_n}\left(1 - \frac{\beta_n}{\bar\beta_n}\,\mathbf{E}_{q_n(x_n)}\frac{\big\|\mathbf{E}_{q(x_0\mid x_n)}[\epsilon_n]\big\|^2}{d}\right)$$

Left of box: Noise prediction network: $\hat\epsilon_n(x_n) \approx \mathbf{E}_{q(x_0\mid x_n)}[\epsilon_n]$

Blue callout (the limitations this "extension" fixes): isotropic variance is simple; it doesn't depend on the state $x_n$; it assumes the mean is optimal.

**Notes:** $d$ = number of dimensions (pixels). I checked algebraically that this $\sigma_n^{*2}$ equals the paper's form $\tilde\beta_n + \frac{\beta_n^2}{\bar\beta_n\alpha_n}\big(1 - \mathbf{E}\|\mathbf{E}[\epsilon_n]\|^2/d\big)$ with $\tilde\beta_n = \frac{\bar\beta_{n-1}}{\bar\beta_n}\beta_n$. The "extension" is Bao et al., ICML 2022 (state-dependent diagonal covariance: SN-DPM and NPR-DPM).

**Concepts needed:** covariance, isotropic vs diagonal, "optimal" (argmin), conditional expectation, noise prediction, $\bar\beta_n$, dimension $d$.

---

## Slide ~43 — Extensions of Analytic-DPMs: results (panorama photo, unreadable)

Only visible from the back of the room. Readable: a bullet saying both NPR-DPM and SN-DPM beat Analytic-DPM when the number of steps is small, giving higher efficiency; then a table of sample-quality (FID) results against number of timesteps (columns roughly 10, 25, 50, 100, 200, 1000).
**Do not transcribe numbers from the photo.** Take the table from Bao et al., ICML 2022 (arXiv 2206.07309) if needed.

**Concepts needed:** FID (a score for image quality, lower is better), sampling steps vs speed trade-off.

---

## Slide 54 — Observation 2: Simplifying by log-SNR
*Subtitle: A simple exponentially weighted integral. Footer: DPM-Solver.*

**Left column:**
$$q_{0t}(\boldsymbol{x}_t\mid\boldsymbol{x}_0) = \mathcal{N}\!\left(\boldsymbol{x}_t \mid \alpha(t)\boldsymbol{x}_0,\ \sigma^2(t)\boldsymbol{I}\right)$$
($\alpha(t)$ and $\sigma^2(t)$ are boxed.) Arrow down to: signal-to-noise ratio $\alpha_t^2/\sigma_t^2$.
$$\text{Define } \lambda_t := \log(\alpha_t/\sigma_t) \quad \text{(half of log-SNR)}$$
We can prove that (boxed):
$$f(t) = \frac{\mathrm{d}\log\alpha_t}{\mathrm{d}t}, \qquad g^2(t) = -2\sigma_t^2\frac{\mathrm{d}\lambda_t}{\mathrm{d}t}$$

**Right column:** exact solution of the diffusion ODE from time $s$ to time $t$:
$$\boldsymbol{x}_t = e^{\int_s^t f(\tau)\mathrm{d}\tau}\,\boldsymbol{x}_s + \int_s^t \left(e^{\int_\tau^t f(r)\mathrm{d}r}\,\frac{g^2(\tau)}{2\sigma_\tau}\,\boldsymbol{\epsilon}_\theta(\boldsymbol{x}_\tau,\tau)\right)\mathrm{d}\tau$$
Arrow down, labelled "change-of-variable formula (from $t$ to $\lambda$)":
$$\boldsymbol{x}_t = \frac{\alpha_t}{\alpha_s}\boldsymbol{x}_s - \alpha_t\int_{\lambda_s}^{\lambda_t} e^{-\lambda}\,\hat{\boldsymbol{\epsilon}}_\theta(\hat{\boldsymbol{x}}_\lambda,\lambda)\,\mathrm{d}\lambda$$
Labels: first part "Linear term — exactly computed"; second part "Nonlinear term — exponentially weighted integral".

**Notes:** Checked against DPM-Solver paper (Lu et al., 2022) eqs. (2.8)–(3.4). Hats mean "the same thing written as a function of $\lambda$ instead of $t$". Remember $\alpha_t$ here is NOT the $\alpha_n$ of slide 19 (see notation table).

**Concepts needed:** exponential and log, integration, integrating factor (first-order linear ODE solution — Further Maths), substitution / change of variable in integrals, signal-to-noise ratio, why exact computation beats approximation.

---

## Slide 56 — Designing High-Order Solvers for Diffusion ODEs
*Subtitle: Foundation of DPM-Solver.*

**Text (paraphrased):** From the analysis, given $\tilde{\boldsymbol x}_{t_{i-1}}$ at time $t_{i-1}$, the exact solution at time $t_i$ is:
$$\boldsymbol{x}_{t_{i-1}\to t_i} = \frac{\alpha_{t_i}}{\alpha_{t_{i-1}}}\tilde{\boldsymbol{x}}_{t_{i-1}} - \alpha_{t_i}\int_{\lambda_{t_{i-1}}}^{\lambda_{t_i}} e^{-\lambda}\,\hat{\boldsymbol{\epsilon}}_\theta(\hat{\boldsymbol{x}}_\lambda,\lambda)\,\mathrm{d}\lambda$$
(the $\hat{\boldsymbol\epsilon}_\theta$ term is boxed.)

Taylor expansion:
$$\hat{\boldsymbol{\epsilon}}_\theta(\hat{\boldsymbol{x}}_\lambda,\lambda) = \sum_{n=0}^{k-1}\frac{(\lambda-\lambda_{t_{i-1}})^n}{n!}\,\hat{\boldsymbol{\epsilon}}_\theta^{(n)}(\hat{\boldsymbol{x}}_{\lambda_{t_{i-1}}},\lambda_{t_{i-1}}) + \mathcal{O}\big((\lambda-\lambda_{t_{i-1}})^k\big)$$

Substituting gives:
$$\boldsymbol{x}_{t_{i-1}\to t_i} = \frac{\alpha_{t_i}}{\alpha_{t_{i-1}}}\tilde{\boldsymbol{x}}_{t_{i-1}} - \alpha_{t_i}\sum_{n=0}^{k-1}\underbrace{\hat{\boldsymbol{\epsilon}}_\theta^{(n)}(\hat{\boldsymbol{x}}_{\lambda_{t_{i-1}}},\lambda_{t_{i-1}})}_{\text{Derivatives}}\;\underbrace{\int_{\lambda_{t_{i-1}}}^{\lambda_{t_i}} e^{-\lambda}\frac{(\lambda-\lambda_{t_{i-1}})^n}{n!}\,\mathrm{d}\lambda}_{\text{Coefficients}} + \mathcal{O}(h_i^{k+1})$$

**Notes:** $h_i = \lambda_{t_i}-\lambda_{t_{i-1}}$ (step size in $\lambda$). $\hat{\boldsymbol\epsilon}_\theta^{(n)}$ = $n$-th derivative w.r.t. $\lambda$. The "Coefficients" integrals can be done exactly by integration by parts. $k=1$ gives DPM-Solver-1, which is the same as DDIM. Strong A-level link: Taylor/Maclaurin series (Further Maths), big-O error.

**Concepts needed:** Taylor series, factorial, sigma notation, $n$-th derivative, big-O notation, order of a numerical method, integration by parts, step size.

---

## Slide 78 — DPM-Solver in the Diffusers library
*Subtitle: Very easy to use in Stable Diffusion.*

**Code (Python, as shown; boxed lines are 2, 8 and 13):**
```python
from diffusers import StableDiffusionPipeline
from diffusers import DPMSolverMultistepScheduler

steps = 10

scheduler = DPMSolverMultistepScheduler.from_config("./stable-diffusion-v1-5", subfolder="scheduler")

pipe = StableDiffusionPipeline.from_pretrained(
    "./stable-diffusion-v1-5",
    scheduler=scheduler,
)
pipe = pipe.to("cuda")

prompt = "a photo of an astronaut riding a horse on mars"

images = pipe(prompt, num_inference_steps=steps, num_images_per_prompt=5).images

for i, image in enumerate(images):
    image.save(f"dpm_{steps}_{i}.png")
```

**Notes:** The point: swapping in DPM-Solver is a 3-line change, and 10 steps is enough. Explain in plain English (what a pipeline, scheduler and GPU are). No need to run it on the site.

**Concepts needed:** sampling steps, scheduler = the solver, text-to-image, GPU.

---

## Slide 119 — Variational Score Distillation (VSD)
*Subtitle: Simulate Wasserstein gradient flow by particles. Footer: ProlificDreamer.*

**Text (paraphrased):** Training a whole extra generative model to represent the distribution $\mu(\theta\mid y)$ is hard and expensive. Instead, use a handful of samples $\{\theta^{(i)}\}_{i=1}^n$ ("particles") to stand in for the distribution $\mu$.

**Diagram (redraw — great Fable visual):** A contour map with two bright high-density peaks. About 12 red dots (particles) scattered around it, each with a short black arrow showing which way it moves, mostly towards the peaks.

**Theorem 2 (paraphrased):** Start from a distribution $\mu_0$. Follow the Wasserstein gradient flow that minimises the VSD objective, giving distributions $\{\mu_\tau\}_{\tau\ge 0}$ that end at the optimum, $\mu_\infty = \mu^*$. You can sample $\theta_\tau$ from $\mu_\tau$ by first sampling $\theta_0 \sim \mu_0(\theta_0\mid y)$ and then running this ODE:
$$\frac{\mathrm{d}\theta_\tau}{\mathrm{d}\tau} = -\mathbb{E}_{t,\epsilon,c}\left[\omega(t)\Big(\underbrace{-\sigma_t\nabla_{\boldsymbol{x}_t}\log p_t(\boldsymbol{x}_t\mid y)}_{\text{score of noisy real images}} - \underbrace{\big(-\sigma_t\nabla_{\boldsymbol{x}_t}\log q_t^{\mu_\tau}(\boldsymbol{x}_t\mid c, y)\big)}_{\text{score of noisy rendered images}}\Big)\frac{\partial g(\theta_\tau, c)}{\partial\theta_\tau}\right]$$
where $q_t^{\mu_\tau}$ is the noisy distribution at diffusion time $t$ for the current $\mu_\tau$ (ODE time $\tau$).

**Notes:** Context: text-to-3D. $\theta$ = parameters of a 3D scene (a NeRF), $c$ = camera angle, $y$ = text prompt, $g(\theta,c)$ = render the scene from camera $c$. Here $\mu$ is a **distribution**, not a mean. "Wasserstein gradient flow" is far beyond A-level — the site should explain it as "moving a cloud of particles downhill together", with the contour visual doing the work. Original theorem: ProlificDreamer paper, Theorem 2.

**Concepts needed:** gradient descent, particles representing a distribution, score function, rendering, partial derivative, chain rule, expectation over several variables, ODE.

---

## Slide ~120s–130s — Equivariant Energy-guided SDE (EEGSDE)
*Unnumbered in photo. Citation on slide: Bao & Zhao et al., ICLR 2023.*

**Diagram (redraw):**
- Top-left dashed box: a 3D molecule and the same molecule rotated by $R$. Both go into an energy function $E$ (green box), giving $E(\boldsymbol z, c, t) = E(R\boldsymbol z, c, t)$, labelled **Invariant Energy**.
- Top-right dashed box, "Condition $c$": either a target structure as a fingerprint (a small ring molecule turned into a row of coloured squares) or a quantum property (polarizability $\alpha$, dipole moment $\mu$, …, heat capacity $C_v$).
- Bottom: 5 molecule pictures left to right, going from a jumbled cloud of atoms to a clean molecule. Blue arrows from "Invariant Energy" feed into every step.

**Formula along the bottom:**
$$\boldsymbol{z}_T \;\longrightarrow\; \mathrm{d}\boldsymbol{z} = \Big[f(t)\boldsymbol{z} + g(t)^2\Big(\frac{1}{\sqrt{\beta_{t|0}}}\boldsymbol{\epsilon}_\theta(\boldsymbol{z},t) + \underbrace{\big(\nabla_{\boldsymbol x}E(\boldsymbol z,c,t) - \overline{\nabla_{\boldsymbol x}E(\boldsymbol z,c,t)},\ \nabla_{\boldsymbol h}E(\boldsymbol z,c,t)\big)}_{\text{Equivariant Energy Guidance}}\Big)\Big]\mathrm{d}t + g(t)\,\mathrm{d}(\tilde{\boldsymbol w}_x, \tilde{\boldsymbol w}_h) \;\longrightarrow\; \boldsymbol{z}_0$$

**CHECK:** whether it is $\beta_{t|0}$ or $\bar\beta_{t|0}$ (the photo looks like no bar; compare with the paper). The overline on the second $\nabla_{\boldsymbol x}E$ means its average over atoms (subtracting it keeps the molecule's centre of mass fixed) — confirm against the paper.

**Notes:** $\boldsymbol z = (\boldsymbol x, \boldsymbol h)$: atom positions $\boldsymbol x$ and atom features $\boldsymbol h$. Same SDE as slide 25 plus an extra "energy" push towards molecules with the wanted property. Rotating the molecule shouldn't change its energy (invariance), so the push rotates with it (equivariance).

**Concepts needed:** reverse SDE (slide 25), energy function, gradient as "push downhill", rotation matrices, invariance vs equivariance, conditioning, mean/centre of mass.

---

## Slide 154 — Summary
*Footer: DPM-Solver.*

**Text (paraphrased):**
- Diffusion models are strong at image generation, image-to-image translation, cross-modal inference, reinforcement learning and more.
- Analytic-DPM: proves analytic formulas for the optimal mean and variance, giving a **20–80×** speed-up.
- DPM-Solver: a much simpler exact form of the diffusion ODE solution; good samples in about **10** steps, nearly converged by **20**.
- A unified diffusion model for cross-modal inference (UniDiffuser), and an energy-guided SDE for image-to-image translation (EGSDE).
- More of the group's work (molecular design, RL, backbone architectures): https://ml.cs.tsinghua.edu.cn/diffusion/RelatedWork

---

## Lecture outline (what the slide numbers tell us)

| Slides | Part | Photographed |
|---|---|---|
| 1–~18 | Deep generative models overview (VAE, auto-regressive, probably GANs and flows) | A, B |
| 19–31 | Diffusion basics: forward process, SDE/ODE view, training by KL/ELBO | 19, 25, 31 |
| 32–~45 | Analytic-DPM and its extension (optimal variance → fast sampling) | 42, ~43 |
| ~46–~80 | DPM-Solver (fast ODE solver), maybe DPM-Solver++, using it in practice | 54, 56, 78 |
| ~80–153 | Applications: UniDiffuser, EGSDE, ProlificDreamer (text-to-3D), EEGSDE (molecules) | 119, EEGSDE |
| 154 | Summary | 154 |

Gaps between photos are filled from the papers in `papers.md`.
