# Learn ML — working notes for Claude

**Start here.** Read this whole file, including the progress log, then carry on from the first
unticked item in the checklist. The full original brief is in `docs/brief.md`; the slide
transcriptions are in `slides.md`; the papers are in `papers.md`.

## Project rules (short form of the brief)

- Personal learning site for Jacob (UK sixth-former: A-level Maths, Further Maths, Physics, CS).
  Built around **recursion**: every piece of every formula can be clicked to dive one layer down.
- The site is a **concept map** (directed graph of nodes) seen through different views
  (slide mode, diving, ladder, review, progress, map). Not a set of pages.
- Content lives in data files under `content/` (format: `docs/content-format.md`). Adding a course
  means adding data files, never changing engine code. Shared concepts live in `content/concepts/`.
- Symbols change meaning between slides. Node ids are keyed by **meaning** (`alpha-n-ddpm`,
  not `alpha`). Every slide page says which meaning applies.
- **Correctness is non-negotiable.** Before writing a page that uses a paper's formula, open the paper
  and check every symbol down to subscripts. Visuals must be numerically honest; maths they compute
  has automated checks in `tests/`.
- Writing: plain English, short paragraphs, one idea per page, say what each symbol is the first time
  it appears, all maths in KaTeX. No greetings, hype, exclamation marks. Citations only in the
  collapsed Sources section.
- Design (`docs/design.md`): calm textbook look, light default + dark mode, one accent, muted concept
  colours. **Banned:** purple/violet, gradients, glow, frosted glass, emoji, sparkle icons, hero
  headline + 3 cards, filler copy, Tailwind/UI frameworks.
- Tech: static site, GitHub Pages from `main` root, no build step, plain ES modules, libraries vendored
  in `vendor/`. Original slide photos must never enter the repo.
- Progress in `localStorage` (wrapped in try/catch). No gamification.
- Work on `main`, commit and push often. Don't spawn subagents.

## Key decisions

- **Content format:** one Markdown file per concept with a small YAML-subset front-matter, plus
  fenced blocks for formulas, checks, recall questions and visuals. Parsed in the browser by
  `js/content.js` (no build step). Each course has `content/courses/<id>/course.json` listing its
  slides and the concept files it uses; the engine loads all listed files at start-up.
- **Clickable formula pieces:** the macro `\p{concept-id}{latex}` expands to KaTeX's
  `\htmlData{c=concept-id}{...}` (KaTeX runs with `trust` limited to `\htmlData`). The engine then
  colours and wires every `[data-c]` element.
- **URL state:** `#/dive/<root>/<id>@<pieceIndex>/<id>@<pieceIndex>...` — each layer records which
  piece (by order on the parent page) it was opened from, so the rail can highlight it and the
  browser back button works. Optional `:section` suffix opens an entry point.
- **Formula animation:** `manim-web` exists on npm (v0.41) but is a large, young dependency and was
  not tested this session for time. Draw-in and highlight effects are KaTeX + CSS (staggered fade/rise
  of top-level formula parts). A Fable session may try manim-web for one big visual; record result here.
- **Progress levels:** seen (opened), understood (every quick-check question answered correctly),
  remembered (every recall question answered correctly at least 7 days after "understood", and none
  overdue). Spaced repetition boxes: 1, 3, 7, 14, 30 days; wrong answer → back to box 1.
  Recall answers are self-marked (reveal, then "I had it" / "I didn't").
- **Floor concepts** (`level: 0`) are things Jacob already knows. They have short pages, are shown with
  a "floor" marker, and are not counted in progress.
- **Fonts:** Source Serif 4 (vendored woff2) for prose, system sans for small UI labels, KaTeX fonts for maths.

## Checklist

### Phase 0 — Foundations (Opus session 1)
- [x] Look at repo; write CLAUDE.md
- [ ] Concept map plan for all 13 slides (`docs/concept-map.md`)
- [ ] Content format doc (`docs/content-format.md`)
- [ ] Engine: content loader + Markdown/front-matter parser
- [ ] Engine: slide mode with clickable formula pieces
- [ ] Engine: diving with zoom transition, layer rail, back-up with scroll restore, URL state
- [ ] Engine: preview cards (hover on desktop, tap-tap on phone)
- [ ] Engine: ladder mode (topological order of a slide's tree)
- [ ] Engine: quick checks with marking, hints, worked answers
- [ ] Engine: progress saving, export/import, reset
- [ ] Engine: review mode with spaced repetition + "due" count in header
- [ ] Engine: progress tracking (per concept, per slide bar, header line, Progress page, Next up)
- [ ] Design system: themes, concept colours, typography, settings cog (`docs/design.md`)
- [ ] Path 1: slide 19 fully clickable, every concept under it written down to the floor
- [ ] Path 1 visuals: bell curve with sliders; noising slider (real, numerically checked)
- [ ] Spec every big visual (`docs/visuals.md`)
- [ ] Tests: maths checks for visuals (`tests/`), headless screenshots desktop + phone, both themes
- [ ] Update CLAUDE.md for a cold start; summary for Jacob

### Phase 1 — Path 1 polish (Fable)
- [ ] Re-read every Path 1 page against DDPM paper once; fix anything off
- [ ] Big visual V1 (noising real images) and V2 (bell curve / sampling) built to spec in `docs/visuals.md`
- [ ] Jacob's feedback round on slide 19 (see Ask Jacob)

### Phase 2 — Path 2: slides 31, 25, 42 ("how diffusion is trained, and why the variance matters")
- [ ] Write slide 31 file with tagged pieces; concepts: log, expectation of a function, KL divergence, ELBO,
      min/max, ⇔ vs ⇒, gradient, score function, norm, MSE, score matching, weighting by β̄ₙ, reverse step
      p(x_{n-1}|x_n), μₙ parameterisation, noise prediction ε̂ₙ, score ↔ noise relation
- [ ] Write slide 25 file; concepts: derivative as rate, ODE, Euler's method, Brownian motion / Wiener process,
      SDE, drift f(t) and diffusion g(t), reverse-time process, probability-flow ODE, DDPM ≈ SDE Euler,
      DDIM ≈ ODE Euler, continuous time t vs step n
- [ ] Write slide 42 file; concepts: covariance matrix, isotropic vs diagonal, argmin / optimal, conditional
      expectation E_{q(x0|xn)}[εₙ], optimal mean μₙ*, optimal variance σₙ*², dimension d, why handcrafted
      variance is suboptimal, state-dependent covariance (SN-DPM / NPR-DPM)
- [ ] Slide ~43: FID concept + steps-vs-quality trade-off (numbers only from Bao et al. ICML 2022 table)
- [ ] Visuals for Path 2 (score field, SDE vs ODE paths, Euler steps, KL between two bells)

### Phase 3 — Path 3: DPM-Solver (slides 54, 56, 78)
- [ ] Slide 54: SNR, log-SNR λₜ, αₜ/σₜ (DPM-Solver meaning), f(t), g²(t) identities, integrating factor,
      change of variable, linear vs nonlinear term, exponentially weighted integral
- [ ] Slide 56: Taylor series, factorial, n-th derivative, big-O, order of a method, integration by parts,
      step size hᵢ, DPM-Solver-k, DPM-Solver-1 = DDIM
- [ ] Slide 78: pipeline, scheduler = solver, GPU, num_inference_steps (plain-English code walk-through)
- [ ] Visuals: Taylor approximation explorer, solver-order comparison

### Phase 4 — VAE and auto-regressive slides (A, B)
- [ ] Slide A: latent variable, encoder/decoder, approximate posterior, θ and φ, SGD, ELBO for VAEs (reuse KL/ELBO)
- [ ] Slide B: chain rule of probability (exists), x_{<i}, transpose, link to language models
- [ ] Visuals: latent space explorer, auto-regressive next-token demo

### Phase 5 — ProlificDreamer and EEGSDE (slide 119, EEGSDE slide)
- [ ] Resolve CHECK items for the EEGSDE slide against arXiv 2209.15408 (β vs β̄, overline meaning) — record here
- [ ] Slide 119: particles, Wasserstein gradient flow (as "moving a cloud downhill"), rendering g(θ,c),
      NeRF, partial derivatives, VSD update
- [ ] EEGSDE: energy function, rotation matrices, invariance vs equivariance, centre of mass, guidance
- [ ] Visuals: particles flowing to high density; molecule rotating with energy invariant
- [ ] Slide 154 summary page linking to all paths

### Phase 6 — Map mode
- [ ] Vendor `3d-force-graph`; 3D map of all nodes clustered by family, `needs` links, lit when understood
- [ ] Clicking a node opens it with a sensible layer stack (shortest `needs` path from its nearest slide)
- [ ] 2D fallback for phones / low power

### Phase 7 — Polish
- [ ] Accessibility pass (keyboard, focus, alt text, screen-reader labels on formula pieces)
- [ ] Performance pass (lazy-load concept bodies if the map grows past ~150 nodes)
- [ ] Final screenshot round, both themes, desktop + phone

## Correctness log

- Slide 19 formulas checked against DDPM (Ho et al. 2020, arXiv 2006.11239): forward transition
  q(x_t|x_{t-1}) = N(√(1−β_t) x_{t−1}, β_t I), ᾱ_t = ∏ α_s, q(x_t|x_0) = N(√ᾱ_t x_0, (1−ᾱ_t) I),
  linear schedule β from 10⁻⁴ to 0.02 over T = 1000. The slide writes N for steps and n for the index.

## Ask Jacob

- Speaker credit: the summer-school programme should be checked before naming the lecturer anywhere.
- Is the dog image strip on slide 19 worth recreating with a real photo? Currently a drawn test image is noised.

## Progress log

- 2026-11-11 (Opus, session 1): started. Repo was empty. Vendored KaTeX 0.16.11 and Source Serif 4.
