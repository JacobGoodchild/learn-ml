# Visuals spec

Every big visual the site needs, taken from the slides. Each is a module in `js/visuals/<name>.js` that exports
`default function (el, opts)` and is registered in `js/visuals/index.js`. Pages embed one with
```` ```visual <name> ````. Until a visual is built, that block shows a quiet placeholder.

**Rules for every visual** (see also `docs/design.md`):
- Numerically honest. All maths in `js/visuals/maths.js` (or a sibling pure module), with checks in `tests/`.
- Colours from CSS variables only, so both themes work. `var(--cc)` is the page's concept colour.
- Controls inside the visual. Works by keyboard (native range inputs are fine). Works at 360px wide.
- An `aria-label` describing what is shown, and a caption that says what to notice in words.
- Respect reduced motion: anything that plays on its own gets a play/pause button and starts paused when motion is reduced.
- Libraries: vendor them into `vendor/`. 3D: `3d-force-graph` for the map; for 3D surfaces prefer a small hand-written
  WebGL/canvas projection over adding three.js twice (3d-force-graph already bundles three.js; reuse it if needed).

Status: **built** (works now), **simple** (built as a small version; a bigger Fable version is specced), **planned**.

---

### V1 `noising` — a picture dissolving into noise · simple
- **Concepts:** x-n-ddpm, alpha-bar-n, pure-noise-endpoint. **Slide:** 19 (replaces the dog strip).
- **Now:** a drawn 96×96 test picture, slider for step n (0–1000, DDPM linear schedule), readouts of βₙ, αₙ, ᾱₙ,
  √ᾱₙ and √(1−ᾱₙ), a small chart of picture-share and noise-share against n, "New noise" button.
- **Fable version:** a strip of 8 thumbnails at chosen steps (like the slide) above the big view; choice of 3 public-domain
  photos (store small, ≤ 64 KB each, credit in Sources); a toggle between the linear and the cosine schedule so the
  reader sees the cosine schedule keeps the picture longer; a per-pixel histogram that turns into a bell curve.
- **Notice:** most of the picture vanishes in the middle third of the steps, not evenly; by n = 1000 nothing is left.
- **Checks:** schedule endpoints, ᾱ monotone, closed form equals stepping (already in `tests/maths.test.mjs`).

### V2 `bell-curve` — mean and spread · built
- **Concepts:** normal-distribution (also usable on variance, standard-deviation, standard-normal).
- **Controls:** μ (−3…3), σ (0.5…2.5). Fixed axes −6…6. Shaded ±1σ band, dashed N(0,1) reference.
- **Notice:** σ = 2 is exactly twice as wide and half as tall as σ = 1; the area stays 1.
- **Fable addition:** a "draw 200 samples" button that drops dots into a histogram under the curve, to connect density and sampling.

### V3 `spread-keeper` — why the spread stays at 1 · built
- **Concepts:** scaling-and-adding, variance-preserving.
- **Controls:** β (0…1), checkbox "use the square roots". 6000 samples, histogram, measured variance vs rule.
- **Notice:** with the roots the histogram sits exactly on N(0,1) for any β; without them it shrinks.

### V4 `pixel-journeys` — one pixel's value through the whole chain · planned
- **Concepts:** forward-process, pure-noise-endpoint, markov-chain.
- **Shows:** 40 lines, each the value of one pixel from n = 0 to N, starting from a few different clean values
  (e.g. −0.8, 0.1, 0.9). Right edge: the histogram of final values with N(0,1) overlaid.
- **Controls:** schedule (linear / cosine), number of lines, "replay".
- **Notice:** the lines start in separate bunches and end mixed together: the chain forgets where it started.

### V5 `markov-walk` — short memory · planned
- **Concepts:** markov-chain, chain-rule-of-probability.
- **Shows:** a board-game-like chain of squares and a token that moves by dice; a toggle to show "the history it ignores".
- **Notice:** to predict the next square you only need the current one.

### V6 `kl-two-bells` — KL divergence between two normal distributions · planned
- **Concepts:** kl-divergence (slide 31, 42).
- **Controls:** mean and spread of q and of p. Readouts KL(q‖p) and KL(p‖q), computed in closed form.
- **Notice:** KL is 0 only when the curves match; it is not symmetric.
- **Checks:** closed form vs numerical integral.

### V7 `elbo-gap` — the ELBO as a lower bound · planned
- **Concepts:** elbo, q-matches-p, vae-elbo (slides 31, A).
- **Shows:** a bar for log p(x), a bar for the ELBO under it, the gap labelled as a KL; a slider moves q closer to the true posterior.
- **Notice:** pushing the ELBO up closes the gap; maximising the ELBO and minimising KL are the same move.

### V8 `score-field` — the score as arrows pointing uphill · planned
- **Concepts:** score-function, marginal-q-n, score-matching (slide 31), two-scores (slide 119).
- **Shows:** a 2D density made of 2–3 Gaussian blobs as contour lines, with a grid of arrows ∇log q. A slider for the
  noise level n blurs the density (exact: mixture convolved with N(0, β̄ₙ I)) and the arrows change.
- **Notice:** arrows point towards higher density; at high noise they all point to the middle, gently.
- **Checks:** analytic gradient vs finite differences.

### V9 `reverse-sampling` — making new points by running backwards · planned
- **Concepts:** reverse-step, sampling-steps, optimal-variance, handcrafted-variance (slides 31, 42, ~43).
- **Shows:** 2D toy data (two rings or a spiral). 500 points start as noise and step backwards to the data using the
  exact score of the toy distribution. Toggle variance: handcrafted βₙ, handcrafted β̃ₙ, optimal (Analytic-DPM formula).
  Slider: number of steps (10…1000).
- **Notice:** with few steps the handcrafted variances blur the result; the optimal variance stays sharp.

### V10 `sde-vs-ode` — jittery paths and smooth paths · planned
- **Concepts:** reverse-sde, probability-flow-ode, ddpm-is-euler-sde, ddim-is-euler-ode (slide 25).
- **Shows:** 1D: time on the x-axis (T → 0), value on the y-axis. Same starting points; SDE paths wiggle, ODE paths are smooth.
  Both end with the same distribution (histograms at t = 0 match).
- **Controls:** number of paths, "same random seed" toggle, step count.

### V11 `euler-steps` — Euler's method · planned
- **Concepts:** euler-method, order-of-method, ode.
- **Shows:** dy/dx = f(x, y) with a known exact solution; Euler's straight-line steps on top; the error at the end.
- **Controls:** step size. Readout of error; halving the step halves the error (first order).

### V12 `taylor-explorer` — Taylor approximations of growing order · planned
- **Concepts:** taylor-series, big-o, dpm-solver-k (slide 56).
- **Shows:** a smooth curve (e.g. the network output along λ, faked by a known function) and its order-1, 2, 3 Taylor approximations about λ_{t_{i−1}}.
- **Controls:** order k, step size h. Readout of error ~ h^{k+1}.

### V13 `solver-race` — DDIM vs DPM-Solver-2/3 · planned
- **Concepts:** dpm-solver-k, dpm-solver-1-ddim, multistep-solver (slides 56, 78, 154).
- **Shows:** the 2D toy from V9 sampled with 5, 10, 20 steps by DDIM and by DPM-Solver-2/3 side by side.
- **Notice:** at 10 steps the higher-order solver is already close to the 1000-step answer.
- **Checks:** DPM-Solver-1 output equals DDIM output to rounding error.

### V14 `log-snr` — αₜ, σₜ and λₜ · planned
- **Concepts:** alpha-t-dpm, sigma-t-dpm, snr, log-snr, exp-weighted-integral (slide 54).
- **Shows:** curves of αₜ and σₜ (with αₜ² + σₜ² = 1), then λₜ; a toggle shows e^{−λ} as the weighting in the integral.
- **Notice:** λ runs from large (clean) to very negative (noise) and is a better clock than t.

### V15 `loss-landscape` — a 3D loss surface and gradient descent · planned
- **Concepts:** mean-squared-error, gradient, gradient-descent, sgd, score-matching.
- **Shows:** a 3D surface for a two-parameter model; a ball steps downhill; SGD version wobbles.
- **Controls:** learning rate, noisy vs full gradient. Drag to rotate.

### V16 `tiny-network` — a neural network as a function with knobs · planned
- **Concepts:** neural-network, noise-prediction, parameters-theta-phi.
- **Shows:** a 1-input, 4-hidden, 1-output network as a diagram; sliders for a few weights; the output curve updates.

### V17 `covariance-ellipses` — isotropic vs diagonal vs full · planned
- **Concepts:** covariance-matrix, isotropic-vs-diagonal, state-dependent-covariance (slide 42).
- **Shows:** 2D samples and their 1σ ellipse. Isotropic: circle; diagonal: axis-aligned ellipse; full: tilted.

### V18 `optimal-variance-curve` — σₙ*² between β̃ₙ and βₙ · planned
- **Concepts:** optimal-variance, handcrafted-variance (slide 42).
- **Shows:** for a toy data set where E‖E[εₙ∣xₙ]‖² is known exactly, plot βₙ, β̃ₙ and σₙ*² against n.
- **Notice:** the optimal value always lies between the two handcrafted choices.
- **Checks:** formula from Bao et al. 2022 (both forms in `slides.md`, slide 42 notes).

### V19 `fid-tradeoff` — quality against number of steps · planned
- **Concepts:** fid, sampling-steps (slide ~43).
- **Shows:** a line chart, values **only** from Bao et al., ICML 2022 (arXiv 2206.07309) tables, with the table cited in Sources.

### V20 `particle-flow` — particles flowing to high density · planned (big Fable visual)
- **Concepts:** particles, wasserstein-flow, vsd-update (slide 119).
- **Shows:** a contour map with two bright peaks; 12–50 particles with arrows, moving together towards the peaks
  while repelling each other (so they spread over both peaks). Toggle "single-particle, no repulsion" to show
  everyone collapsing to one peak (the mode-seeking behaviour VSD avoids).
- **Controls:** play/pause, number of particles, step size.

### V21 `molecule-rotate` — invariance and equivariance · planned
- **Concepts:** invariance-equivariance, energy-function, energy-guidance, centre-of-mass (EEGSDE slide).
- **Shows:** a small 3D molecule (balls and sticks) the reader can rotate; a readout of its energy that does not change;
  gradient arrows on each atom that rotate with the molecule.

### V22 `latent-space` — what a VAE's latent space looks like · planned
- **Concepts:** latent-variable, encoder-decoder (slide A).
- **Shows:** a 2D grid of latent points decoded to tiny shapes by a fixed hand-made decoder; drag a point to see its decoding.

### V23 `next-token` — generating one token at a time · planned
- **Concepts:** autoregressive, next-token (slide B).
- **Shows:** a tiny hand-made bigram/trigram model; click to sample the next word; shows p(xᵢ ∣ x₍<ᵢ₎) as bars.

### V24 `concept-map-3d` — the whole map in 3D · planned (Map mode)
- **Concepts:** all. Uses vendored `3d-force-graph`.
- **Shows:** nodes coloured by family, clustered by family; links are `needs`; understood nodes lit, floor nodes dim,
  slides large and bright. Click a node to open it with the shortest slide → node layer stack (the ladder already
  computes this with `pathTo` in `js/app.js`). 2D canvas fallback on phones / low power.
