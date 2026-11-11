# Concept map plan

Every concept needed for all 13 transcribed slides, down to the floor. Nodes are keyed by **meaning**,
never by symbol (see the notation warning in `slides.md`). Families decide colour (see `docs/design.md`).

- **Status:** ✓ = written (file exists in `content/concepts/`), blank = planned.
- **Level:** 0 = floor (A-level, already known: short reminder page, not counted in progress).
  Higher numbers sit higher up the ladder. Levels are rough; the ladder order comes from `needs`.
- `needs` = one layer down (the recursion). `related` = sideways comparison.
- When writing a planned node, add it to the course's `concepts` list in `course.json`.

Families: `probability` (teal), `spread` (green), `linalg` (blue), `calculus` (ochre),
`diffusion` (rust), `information` (rose), `learning` (brown), `notation` (slate).

---

## Floor (level 0)

| id | title | family | needs | status |
|---|---|---|---|---|
| probability-basics | Probability | probability | — | ✓ |
| conditional-probability | Conditional probability (events) | probability | probability-basics | ✓ |
| vectors | Vectors | linalg | — | ✓ |
| matrices | Matrices | linalg | vectors | ✓ |
| identity-matrix | The identity matrix, I | linalg | matrices | ✓ |
| integration | Integration as area | calculus | — | ✓ |
| exponential-function | The exponential function | calculus | — | ✓ |
| subscripts | Subscripts and sequences | notation | — | ✓ |
| logarithm | Logarithms (log = ln on the slides) | calculus | exponential-function | |
| derivative | Derivatives as rates of change | calculus | — | |
| chain-rule-calculus | The chain rule (calculus) | calculus | derivative | |
| integration-by-substitution | Integration by substitution | calculus | integration | |
| integration-by-parts | Integration by parts | calculus | integration, derivative | |
| integrating-factor | First-order linear ODEs and integrating factors | calculus | derivative, exponential-function | |
| maclaurin-series | Maclaurin series | calculus | derivative, factorial | |
| factorial | Factorials | notation | — | |
| sigma-notation | Sigma notation, Σ | notation | subscripts | |
| proof-symbols | ⇔ and ⇒ | notation | — | |
| transpose | The transpose of a vector | linalg | vectors | |
| rotation-matrix | Rotation matrices | linalg | matrices | |
| functions | Functions as machines (input → output) | notation | — | |

## Path 1 — slide 19 (built)

| id | title | family | lvl | needs | related | status |
|---|---|---|---|---|---|---|
| random-variable | Random variables | probability | 1 | probability-basics | probability-distribution | ✓ |
| probability-distribution | Probability distributions | probability | 1 | random-variable | probability-density | ✓ |
| probability-density | Probability density | probability | 2 | probability-distribution, integration | normal-distribution | ✓ |
| expectation | The mean (expected value) | spread | 2 | random-variable, probability-distribution | variance | ✓ |
| variance | Variance | spread | 2 | expectation | standard-deviation | ✓ |
| standard-deviation | Standard deviation | spread | 2 | variance | normal-distribution | ✓ |
| independence | Independence | probability | 1 | conditional-probability, random-variable | scaling-and-adding | ✓ |
| scaling-and-adding | Scaling and adding random variables | spread | 3 | variance, independence, standard-deviation | variance-preserving | ✓ |
| normal-distribution | The normal distribution | probability | 3 | probability-density, expectation, variance, standard-deviation, exponential-function | standard-normal, isotropic-gaussian | ✓ |
| standard-normal | The standard normal N(0,1) | probability | 3 | normal-distribution, scaling-and-adding | isotropic-gaussian | ✓ |
| image-as-vector | An image as a vector | linalg | 1 | vectors | — | ✓ |
| isotropic-gaussian | N(μ, σ²I) | probability | 4 | normal-distribution, identity-matrix, image-as-vector, independence | standard-normal | ✓ |
| conditional-distribution | Conditional distributions | probability | 2 | conditional-probability, probability-distribution | joint-distribution | ✓ |
| joint-distribution | Joint distributions | probability | 2 | probability-distribution, random-variable | conditional-distribution, chain-rule-of-probability | ✓ |
| product-notation | Product notation ∏ | notation | 1 | subscripts | — | ✓ |
| chain-rule-of-probability | Chain rule of probability | probability | 3 | joint-distribution, conditional-distribution, product-notation | markov-chain | ✓ |
| markov-chain | Markov chains | probability | 3 | chain-rule-of-probability, conditional-distribution | forward-process | ✓ |
| x-n-ddpm | x₀ … x_N (picture at step n) | diffusion | 2 | image-as-vector, subscripts, random-variable | forward-process | ✓ |
| beta-n-ddpm | βₙ, the noise schedule | diffusion | 3 | variance, subscripts | alpha-n-ddpm | ✓ |
| alpha-n-ddpm | αₙ = 1 − βₙ (one step) | diffusion | 3 | beta-n-ddpm, standard-deviation | alpha-bar-n | ✓ |
| diffusion-step | One noising step q(xₙ∣xₙ₋₁) | diffusion | 4 | conditional-distribution, isotropic-gaussian, alpha-n-ddpm, beta-n-ddpm, standard-normal, x-n-ddpm | variance-preserving, forward-process | ✓ |
| variance-preserving | Why the spread stays at 1 | diffusion | 4 | diffusion-step, scaling-and-adding | pure-noise-endpoint | ✓ |
| alpha-bar-n | ᾱₙ and the jump from x₀ to xₙ | diffusion | 5 | alpha-n-ddpm, product-notation, diffusion-step, variance-preserving | pure-noise-endpoint | ✓ |
| forward-process | The forward (noising) process | diffusion | 5 | markov-chain, diffusion-step, joint-distribution, x-n-ddpm | pure-noise-endpoint, alpha-bar-n | ✓ |
| pure-noise-endpoint | Why x_N ≈ N(0, I) | diffusion | 6 | alpha-bar-n, standard-normal, isotropic-gaussian, variance-preserving | forward-process | ✓ |

**Slide 19 pieces → nodes**

| Piece | Node |
|---|---|
| $q(x_0,\dots,x_N)$ | forward-process |
| $q(x_0)$ | probability-distribution |
| $q(x_1\mid x_0)$, $q(x_N\mid x_{N-1})$, $q(x_n\mid x_{n-1})$ | diffusion-step |
| $\mathcal N$ | isotropic-gaussian |
| $\sqrt{\alpha_n}$, $\alpha_n = 1-\beta_n$ | alpha-n-ddpm |
| $x_{n-1}$, $x_N$ | x-n-ddpm |
| $\beta_n$ | beta-n-ddpm |
| $I$ | identity-matrix |
| $\mathcal N(0, I)$ | pure-noise-endpoint |
| "diffusion process", "Markov chain" (text) | forward-process, markov-chain |

## Path 2 — slides 31, 25, 42, ~43

| id | title | family | lvl | needs | related |
|---|---|---|---|---|---|
| functions-of-random-variables | The mean of f(X): E[f(X)] | spread | 3 | expectation, functions | — |
| marginalisation | Marginal distributions: summing out | probability | 3 | joint-distribution, integration | — |
| bayes-rule | Bayes' rule | probability | 2 | conditional-probability | posterior-x0 |
| neural-network | A neural network as a function with knobs θ | learning | 2 | matrices, functions | — |
| argmin | min, max and "the best choice" | notation | 1 | functions | — |
| kl-divergence | KL divergence | information | 4 | logarithm, functions-of-random-variables, probability-distribution | elbo |
| elbo | The ELBO | information | 5 | kl-divergence, chain-rule-of-probability, marginalisation | kl-divergence |
| reverse-step | The model's step p(xₙ₋₁∣xₙ) | diffusion | 5 | conditional-distribution, isotropic-gaussian, forward-process, neural-network | diffusion-step |
| mu-n-reverse | μₙ(·), the reverse step's mean | diffusion | 5 | reverse-step | optimal-mean |
| sigma-n-reverse | σₙ², the reverse step's variance | diffusion | 5 | reverse-step, variance | optimal-variance |
| q-matches-p | Making q and p match (min KL ⇔ max ELBO) | information | 6 | kl-divergence, elbo, proof-symbols, argmin | — |
| partial-derivative | Partial derivatives | calculus | 1 | derivative | gradient |
| gradient | The gradient ∇ | calculus | 2 | partial-derivative, vectors | — |
| score-function | The score ∇log q(x) | probability | 4 | gradient, logarithm, probability-density | — |
| norm-squared | ‖v‖², squared length | linalg | 1 | vectors | — |
| mean-squared-error | Mean squared error | learning | 3 | norm-squared, functions-of-random-variables | — |
| marginal-q-n | qₙ(xₙ): all noisy pictures at step n | diffusion | 5 | alpha-bar-n, marginalisation | — |
| beta-bar-n | β̄ₙ = 1 − ᾱₙ | diffusion | 5 | alpha-bar-n | — |
| score-network | sₙ(·), the learned score | learning | 5 | neural-network, score-function, marginal-q-n | noise-prediction |
| score-matching | Score matching (reweighted ELBO) | learning | 6 | score-network, mean-squared-error, beta-bar-n | elbo |
| mean-parameterisation | μₙ(xₙ) = (xₙ + βₙ sₙ(xₙ))/√αₙ | diffusion | 6 | mu-n-reverse, score-network, alpha-n-ddpm | — |
| noise-prediction | The noise-prediction network ε̂ / ε_θ | learning | 5 | neural-network, standard-normal, alpha-bar-n | score-network |
| score-noise-relation | sₙ = −ε̂ₙ/√β̄ₙ | diffusion | 6 | score-network, noise-prediction, beta-bar-n | — |
| handcrafted-variance | Why σₙ² = βₙ is suboptimal | diffusion | 6 | sigma-n-reverse, beta-n-ddpm | optimal-variance |
| continuous-time | From steps n to time t | diffusion | 3 | x-n-ddpm, subscripts | — |
| ode | Differential equations (ODEs) | calculus | 1 | derivative | sde |
| euler-method | Euler's method | calculus | 2 | ode | order-of-method |
| brownian-motion | Brownian motion / Wiener process | probability | 4 | standard-normal, independence | — |
| sde | Stochastic differential equations | calculus | 5 | ode, brownian-motion | — |
| drift-diffusion-coefficients | f(t) and g(t) | diffusion | 5 | sde, alpha-bar-n | — |
| reverse-time | Running time backwards (dw̄) | diffusion | 6 | sde, score-function | — |
| reverse-sde | The diffusion SDE (slide 25) | diffusion | 7 | reverse-time, noise-prediction, score-noise-relation | probability-flow-ode |
| probability-flow-ode | The diffusion ODE (slide 25) | diffusion | 7 | reverse-sde, ode | reverse-sde |
| sigma-tilde-prior | x_T ∼ N(0, σ̃²I) | diffusion | 6 | pure-noise-endpoint, continuous-time | — |
| ddpm-is-euler-sde | DDPM = first-order SDE solver | diffusion | 8 | euler-method, reverse-sde | ddim-is-euler-ode |
| ddim-is-euler-ode | DDIM = first-order ODE solver | diffusion | 8 | euler-method, probability-flow-ode | ddpm-is-euler-sde |
| covariance-matrix | The covariance matrix Σ | spread | 4 | variance, matrices, independence | isotropic-gaussian |
| isotropic-vs-diagonal | Isotropic vs diagonal covariance | spread | 5 | covariance-matrix, isotropic-gaussian | — |
| conditional-expectation | Conditional expectation E_{q(x₀∣xₙ)}[·] | spread | 4 | expectation, conditional-distribution | — |
| posterior-x0 | q(x₀∣xₙ): which clean pictures could be behind this one | diffusion | 6 | bayes-rule, alpha-bar-n | — |
| noise-prediction-is-mean | Why ε̂ₙ ≈ E[εₙ ∣ xₙ] | learning | 6 | noise-prediction, conditional-expectation, mean-squared-error | — |
| dimension-d | The dimension d | linalg | 1 | image-as-vector | — |
| optimal-mean | μₙ*: the best reverse mean (Analytic-DPM) | diffusion | 7 | conditional-expectation, mean-parameterisation, argmin, posterior-x0 | — |
| optimal-variance | σₙ*²: the best reverse variance (Analytic-DPM) | diffusion | 8 | optimal-mean, norm-squared, dimension-d, beta-bar-n, noise-prediction-is-mean | handcrafted-variance |
| state-dependent-covariance | Σₙ(xₙ): SN-DPM and NPR-DPM | diffusion | 9 | optimal-variance, isotropic-vs-diagonal | — |
| sampling-steps | Fewer sampling steps: speed vs quality | diffusion | 6 | reverse-step | — |
| fid | FID, a score for image quality | learning | 5 | normal-distribution, covariance-matrix, neural-network | — |

**Slide 31 pieces:** $q(\cdot)\approx p(\cdot)$ → q-matches-p; $p(x_{n-1}\mid x_n)$ → reverse-step; $\mu_n(x_n)$ → mu-n-reverse;
$\sigma_n^2$ → sigma-n-reverse; $KL(\cdot\|\cdot)$ → kl-divergence; $\min$ → argmin; $\Leftrightarrow$, $\Rightarrow$ → proof-symbols;
$\mathbb E_q\log\frac{p}{q}$ → elbo; $\mathbb E_n\,\bar\beta_n$ → beta-bar-n; $s_n(x_n)$ → score-network; $\nabla\log q_n(x_n)$ → score-function;
$q_n(x_n)$ → marginal-q-n; $\|\cdot\|^2$ → mean-squared-error; "Suboptimal!" → handcrafted-variance;
$\mu_n(x_n)=\frac{1}{\sqrt{\alpha_n}}(x_n+\beta_n s_n(x_n))$ → mean-parameterisation.

**Slide 25 pieces:** $\mathrm d\boldsymbol x_t$, $\frac{\mathrm d\boldsymbol x_t}{\mathrm dt}$ → sde / ode; $f(t)$, $g(t)$ → drift-diffusion-coefficients;
$\sigma_t$ → sigma-t-dpm (Path 3 node, explained early); $\boldsymbol\epsilon_\theta$ → noise-prediction; $\mathrm d\bar{\boldsymbol w}_t$ → reverse-time;
$\boldsymbol x_T\sim\mathcal N(\boldsymbol 0,\tilde\sigma^2\boldsymbol I)$ → sigma-tilde-prior; "DDPM … first-order" → ddpm-is-euler-sde; "DDIM … first-order" → ddim-is-euler-ode.

**Slide 42 pieces:** $\Sigma_n(x_n)$ → state-dependent-covariance; $\sigma_n^2$ (in "Suppose") → sigma-n-reverse; $\mu_n^*$ → optimal-mean;
$\sigma_n^{*2}$ → optimal-variance; $\mathbf E_{q(x_0\mid x_n)}[\epsilon_n]$ → conditional-expectation (with posterior-x0 inside);
$\hat\epsilon_n(x_n)$ → noise-prediction-is-mean; $d$ → dimension-d; $\bar\beta_n$ → beta-bar-n; blue callout → isotropic-vs-diagonal.

**Slide ~43:** fid, sampling-steps. Numbers only from Bao et al., ICML 2022.

## Path 3 — DPM-Solver, slides 54, 56, 78

| id | title | family | lvl | needs | related |
|---|---|---|---|---|---|
| alpha-t-dpm | α_t: total signal scale (DPM-Solver meaning) | diffusion | 5 | alpha-bar-n, continuous-time | alpha-n-ddpm |
| sigma-t-dpm | σ_t: total noise scale (DPM-Solver meaning) | diffusion | 5 | beta-bar-n, continuous-time | sigma-n-reverse |
| q-0t | q₀ₜ(xₜ∣x₀) = N(αₜx₀, σₜ²I) | diffusion | 6 | alpha-t-dpm, sigma-t-dpm, isotropic-gaussian | alpha-bar-n |
| snr | Signal-to-noise ratio αₜ²/σₜ² | diffusion | 6 | alpha-t-dpm, sigma-t-dpm | — |
| log-snr | λₜ = log(αₜ/σₜ), half the log-SNR | diffusion | 6 | snr, logarithm | — |
| f-g-identities | f = d log αₜ/dt, g² = −2σₜ² dλₜ/dt | diffusion | 7 | drift-diffusion-coefficients, log-snr, chain-rule-calculus | — |
| exact-ode-solution | The exact solution from s to t | calculus | 8 | integrating-factor, probability-flow-ode | — |
| change-of-variable-lambda | Changing variable from t to λ | calculus | 8 | integration-by-substitution, log-snr | — |
| hat-notation | Hats: the same thing as a function of λ | notation | 7 | log-snr, functions | — |
| linear-nonlinear-terms | Linear term (exact) vs nonlinear term | diffusion | 8 | exact-ode-solution | — |
| exp-weighted-integral | The exponentially weighted integral | calculus | 9 | change-of-variable-lambda, exponential-function, hat-notation | — |
| taylor-series | Taylor series about a point | calculus | 2 | maclaurin-series | — |
| big-o | Big-O error | notation | 2 | functions | order-of-method |
| order-of-method | Order of a numerical method | calculus | 3 | big-o, euler-method | — |
| step-size-h | hᵢ = λ_{tᵢ} − λ_{tᵢ₋₁} | diffusion | 7 | log-snr | — |
| nth-derivative-eps | ε̂^{(n)}: derivatives of the network output | calculus | 8 | hat-notation, derivative | — |
| dpm-solver-k | DPM-Solver-k update | diffusion | 10 | taylor-series, exp-weighted-integral, order-of-method, nth-derivative-eps, integration-by-parts, step-size-h | — |
| dpm-solver-1-ddim | DPM-Solver-1 is DDIM | diffusion | 11 | dpm-solver-k, ddim-is-euler-ode | — |
| finite-differences | Estimating derivatives from earlier steps | calculus | 3 | derivative | — |
| multistep-solver | Multistep (DPM-Solver++) | diffusion | 11 | dpm-solver-k, finite-differences | — |
| pipeline-scheduler | Pipelines and schedulers (the solver as a plug-in) | learning | 4 | sampling-steps | — |
| gpu | What a GPU is for | learning | 1 | — | — |
| text-conditioning | Text-to-image: conditioning on a prompt | learning | 5 | conditional-distribution, neural-network | — |

**Slide 54 pieces:** $q_{0t}$ → q-0t; boxed $\alpha(t)$, $\sigma^2(t)$ → alpha-t-dpm, sigma-t-dpm; SNR → snr; $\lambda_t$ → log-snr;
$f(t)=\dots$, $g^2(t)=\dots$ → f-g-identities; right column first line → exact-ode-solution; arrow label → change-of-variable-lambda;
$\hat{\boldsymbol\epsilon}_\theta(\hat{\boldsymbol x}_\lambda,\lambda)$ → hat-notation; "Linear term"/"Nonlinear term" → linear-nonlinear-terms, exp-weighted-integral.

**Slide 56 pieces:** $\tilde{\boldsymbol x}_{t_{i-1}}$ → dpm-solver-k (the approximate value so far); Taylor line → taylor-series; $n!$ → factorial;
$\sum$ → sigma-notation; $\hat{\boldsymbol\epsilon}_\theta^{(n)}$ → nth-derivative-eps; $\mathcal O(\cdot)$ → big-o; "Coefficients" → integration-by-parts; $h_i$ → step-size-h.
Note: $n$ here is the Taylor term index, not a diffusion step.

**Slide 78 pieces (code lines):** `StableDiffusionPipeline` → pipeline-scheduler; `DPMSolverMultistepScheduler` → multistep-solver;
`steps = 10` / `num_inference_steps` → sampling-steps; `"cuda"` → gpu; `prompt` → text-conditioning.

## Path 4 — slides A (VAE) and B (auto-regressive)

| id | title | family | lvl | needs | related |
|---|---|---|---|---|---|
| latent-variable | Latent variables z | probability | 3 | random-variable, joint-distribution | — |
| graphical-model | Drawing models as graphs (shaded = observed) | notation | 2 | conditional-distribution | markov-chain |
| encoder-decoder | Encoder and decoder | learning | 4 | neural-network, latent-variable | — |
| parameters-theta-phi | θ and φ: the knobs of each network | learning | 3 | neural-network | — |
| approximate-posterior | q(z∣x;φ) ≈ p(z∣x;θ) | probability | 5 | bayes-rule, latent-variable, parameters-theta-phi | posterior-x0 |
| sgd | Stochastic gradient descent | learning | 4 | gradient, functions-of-random-variables | gradient-descent |
| gradient-descent | Gradient descent | learning | 3 | gradient | sgd |
| vae-elbo | The VAE's ELBO | information | 6 | elbo, approximate-posterior, encoder-decoder | elbo |
| autoregressive | Auto-regressive models | probability | 4 | chain-rule-of-probability, product-notation | markov-chain |
| x-less-than-i | x_{<i}: everything before i | notation | 1 | subscripts, transpose | — |
| next-token | Language models: one token at a time | learning | 5 | autoregressive, neural-network | — |

## Path 5 — slide 119 (ProlificDreamer) and EEGSDE

| id | title | family | lvl | needs | related |
|---|---|---|---|---|---|
| nerf-scene | θ: a 3D scene stored as numbers (NeRF) | learning | 4 | neural-network | — |
| rendering | g(θ, c): rendering from a camera | learning | 5 | nerf-scene, functions | — |
| distribution-over-scenes | μ(θ∣y): a distribution over scenes (μ is NOT a mean here) | probability | 5 | probability-distribution, text-conditioning | — |
| particles | Particles: a cloud of samples standing in for a distribution | probability | 4 | probability-distribution | — |
| wasserstein-flow | Moving a cloud of particles downhill together | probability | 8 | particles, gradient-descent, kl-divergence | — |
| vsd-update | The VSD update (Theorem 2) | diffusion | 10 | wasserstein-flow, score-function, rendering, chain-rule-calculus, partial-derivative | — |
| two-scores | Score of noisy real images minus score of noisy rendered images | diffusion | 8 | score-function, noise-prediction | — |
| omega-t | ω(t): weighting over time | diffusion | 6 | functions-of-random-variables | beta-bar-n |
| centre-of-mass | Centre of mass and the zero-CoM space | linalg | 2 | vectors | — |
| molecule-z | z = (x, h): positions and features | linalg | 3 | vectors, centre-of-mass | — |
| invariance-equivariance | Invariance vs equivariance | linalg | 4 | rotation-matrix, functions | — |
| energy-function | Energy functions: low energy = wanted | learning | 4 | functions, gradient | — |
| beta-t-given-0 | β_{t∣0}: noise variance from z₀ to z_t (no bar) | diffusion | 6 | sigma-t-dpm, beta-bar-n | beta-bar-n |
| energy-guidance | Energy guidance in the reverse SDE | diffusion | 9 | reverse-sde, energy-function, invariance-equivariance, centre-of-mass | text-conditioning |
| molecule-properties | Quantum properties (α polarizability, μ dipole moment, C_v) | notation | 2 | — | — |

**Slide 119 pieces:** $\theta_\tau$ → particles; $\frac{\mathrm d\theta_\tau}{\mathrm d\tau}$ → wasserstein-flow; $\mathbb E_{t,\epsilon,c}$ → functions-of-random-variables;
$\omega(t)$ → omega-t; the two underbraced scores → two-scores; $\frac{\partial g(\theta_\tau,c)}{\partial\theta_\tau}$ → rendering + partial-derivative; $\mu_\tau$, $\mu^*$ → distribution-over-scenes.

**EEGSDE pieces:** $\mathrm d\boldsymbol z$ → energy-guidance (built on reverse-sde); $\beta_{t|0}$ → beta-t-given-0;
$\nabla_{\boldsymbol x}E - \overline{\nabla_{\boldsymbol x}E}$ → centre-of-mass + energy-guidance; $E(\boldsymbol z,c,t)=E(R\boldsymbol z,c,t)$ → invariance-equivariance;
$\alpha$, $\mu$ in the condition box → molecule-properties (warn: not the diffusion α or a mean).

## Slide 154 (summary)

No new concepts. Links to: optimal-variance (Analytic-DPM, "20–80×"), dpm-solver-k ("~10 steps"), energy-guidance (EGSDE / EEGSDE),
plus short planned nodes `unidiffuser` and `egsde` (one paragraph each, Path 5).
