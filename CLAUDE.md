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

## Jacob's design rules (from his reviews, 2026-11-11). These override anything older in this file or the docs.

1. **This is a site that teaches ML, not a write-up of a lecture.** The slides in `slides.md` are only a
   reference for what to build. Never mention slides, slide numbers, "the lecture", "the speaker" or "the paper says"
   in the site's text or UI. Pages are **topics** with teaching titles ("Adding noise to a picture").
   (Internal ids like `slide-19` and the file folder name can stay; they never show.)
2. **Intuitive teaching, not an academic homepage.** Say what a formula is *for* and what it *does* before
   anything else. Short, clear, concise sentences that actually mean something. No repetition: never show the
   same formula twice, never restate the summary. If a sentence does not teach, cut it. Text overload is a bug.
3. **Textbook bands.** Formulas, key points, examples, notation and visuals sit in bands with a word on the
   side ("Formula", "Key point", "Example", "Notation", "Try it"). A formula band has a plain title saying what
   the formula is, the formula, one line "In words", and a symbol list right underneath it. Symbol
   definitions go **next to the formula they belong to**, never in a table at the bottom of the page.
4. **Top of every page:** title, a one-line summary, and two small progress bars: *Understood* and *Remembered*.
   Nothing else. No status sentences, no duplicate bars, no progress text in the header.
5. **Sidebar:** only "On this page", listing the bands and sections by meaningful names
   ("One step of noise", "Watch a picture dissolve"). The layer path is the breadcrumb above the title.
6. **Practice questions are compact and sit at the end, just above Sources.** Recall questions are not shown
   on the page; they live in Review.
7. **Look:** white background (tinted backgrounds only inside big 3D visuals). No small grey uppercase labels,
   no tiny helper text explaining the UI, no pill chips, no coloured side stripes, no boxed formulas. Minimum
   text size about 0.875rem, secondary text dark enough to read easily. Wikipedia-style blue links and page
   previews (title, one-line summary, "Open").
8. **Diving should feel like an encyclopaedia:** breadcrumb trail, plain links, a short and subtle zoom.

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
- **Formula animation:** tested `manim-web` 0.41.0 on 2026-11-11. Its self-contained browser bundle
  (`dist/manim-web.browser.js`, 2.8 MB; the npm package is 25 MB) rendered slide 19's transition formula with a
  `Write` animation in ~1.4 s, no errors, in headless Chromium. **Not adopted for formulas**: it draws to a canvas,
  so formula pieces cannot be clickable DOM elements (the core of the site), and 2.8 MB per page is heavy on a phone.
  Formula draw-in and highlights are KaTeX + CSS (staggered fade/rise of the first formula's parts). manim-web
  stays an option for one standalone big visual, loaded only on that page and vendored into `vendor/` if used.
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
- [x] Concept map plan for all 13 slides (`docs/concept-map.md`)
- [x] Content format doc (`docs/content-format.md`)
- [x] Engine: content loader + Markdown/front-matter parser
- [x] Engine: slide mode with clickable formula pieces
- [x] Engine: diving with zoom transition, layer rail, back-up with scroll restore, URL state
- [x] Engine: preview cards (hover on desktop, tap-tap on phone)
- [x] Engine: ladder mode (topological order of a slide's tree)
- [x] Engine: quick checks with marking, hints, worked answers
- [x] Engine: progress saving, export/import, reset
- [x] Engine: review mode with spaced repetition + "due" count in header
- [x] Engine: progress tracking (per concept, per slide bar, header line, Progress page, Next up)
- [x] Design system: themes, concept colours, typography, settings cog (`docs/design.md`)
- [x] Path 1: slide 19 fully clickable, every concept under it written down to the floor
- [x] Path 1 visuals: bell curve with sliders; noising slider (real, numerically checked)
- [x] Spec every big visual (`docs/visuals.md`)
- [x] Tests: maths checks for visuals (`tests/`), headless screenshots desktop + phone, both themes
- [x] Update CLAUDE.md for a cold start; summary for Jacob

### Phase 1 — Path 1 polish (Fable)
- [ ] Text-cutting pass on all 33 Path 1 concept pages under Jacob's design rule 2 (half the words; titled formula bands)
      Done so far (use these as the model): `diffusion-step`, `beta-n-ddpm`, `alpha-n-ddpm`, `x-n-ddpm`,
      `forward-process`, `pure-noise-endpoint`, `isotropic-gaussian`, `markov-chain`, `normal-distribution`,
      `variance-preserving`, `alpha-bar-n`. The other 22 still need it.
- [ ] Re-read every Path 1 page against DDPM paper once; fix anything off
- [ ] Big visual V1 (noising real images) and V2 (bell curve / sampling) built to spec in `docs/visuals.md`
- [ ] Jacob's feedback round on slide 19 (see Ask Jacob)

### Phase 2 — Path 2: slides 31, 25, 42 ("how diffusion is trained, and why the variance matters")
- [x] Slide 31 formulas checked against Analytic-DPM (see Correctness log)
- [x] Already written but NOT yet listed in `course.json` (add them when slide 31 lands): `logarithm`, `functions`,
      `derivative`, `proof-symbols` (floor), `functions-of-random-variables`, `marginalisation`.
      They pass `tests/content.test.mjs` apart from the "not listed in any course yet" notes.
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
- [x] Resolve CHECK items for the EEGSDE slide against arXiv 2209.15408 (done 2026-11-11, see Correctness log)
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

- 2026-11-11, slide 19 vs DDPM (Ho et al. 2020, arXiv 2006.11239), checked against text extracted
  from the arXiv PDF with `pdftotext`: confirmed α_t := 1 − β_t, ᾱ_t := ∏_{s=1}^t α_s,
  q(x_t|x_0) = N(x_t; √ᾱ_t x_0, (1 − ᾱ_t) I) (eq. 4), and T = 1000 with β rising linearly from
  β_1 = 10⁻⁴ to β_T = 0.02 (Sec. 4 and Appendix B). The forward step q(x_t|x_{t−1}) = N(x_t; √(1−β_t) x_{t−1}, β_t I)
  is eq. 2. Text extraction drops the square-root sign on that line, so the √ is read from context and
  matches the slide. The slide uses N for the number of steps and n for the step index; DDPM uses T and t.
- 2026-11-11, EEGSDE CHECK items (Bao, Zhao et al., arXiv 2209.15408, eq. 4 and the text below it, from `pdftotext`):
  the coefficient is 1/√β_{t|0}, **no bar**. β_{t|0} is the noise variance of q(z_t|z_0), since
  ε_t = (z_t − √α_{t|0} z_0)/√β_{t|0}. The overline is the **centre of mass**, (1/M) Σ_{i=1}^M ∇_{x_i}(·),
  the average over the M atoms. Subtracting it keeps x_t in the zero-CoM subspace as time runs backwards.
  The slide's transcription is correct on both points.

- 2026-11-11, slide 31 vs Analytic-DPM (Bao et al. 2022, arXiv 2201.06503, `pdftotext`): eq. 4 is
  min L_vb ⇔ min KL(q(x_{0:N})‖p(x_{0:N})) over {μ_n, σ_n²}; −L_vb is the slide's E_q log p(x_{0:N})/q(x_{1:N}|x_0).
  Eq. 5 is the reweighted objective min E_n β̄_n E_{q_n(x_n)} ‖s_n(x_n) − ∇log q_n(x_n)‖² (= E‖ε + √β̄_n s_n(x_n)‖² + c),
  matching the slide. The paper's eq. 3 writes μ_n(x_n) = μ̃_n(x_n, (x_n + β̄_n s_n(x_n))/√ᾱ_n) for a general forward
  process; for the DDPM forward process this simplifies (checked by hand) to the slide's (x_n + β_n s_n(x_n))/√α_n.
  Footnote 1 confirms s_n(x_n) = −ε̂_n(x_n)/√β̄_n. Handcrafted choices in the paper: σ_n² = β_n or β̃_n = β̄_{n−1}β_n/β̄_n.

## Ask Jacob

- Speaker credit: the summer-school programme should be checked before naming the lecturer anywhere.
- Is the dog image strip on slide 19 worth recreating with a real photo? Currently a drawn test image is noised.

## Progress log

- 2026-11-11 (Opus, session 1): started 13:35 UTC. Repo was empty. Vendored KaTeX 0.16.11 and Source Serif 4.
  Deadline for this session: 14:30 ("half two"; earlier messages said 15:30 and then half four by mistake).
- 13:40–14:00: engine, design system, slide 19 and all 33 concept pages under it, three real visuals, maths tests,
  docs (concept map, content format, design, visuals). GitHub Pages is live at https://jacobgoodchild.github.io/learn-ml/
  (deploys from `main`, root). Fixed: tap-to-preview on phones (mouse-compat events were hiding the card).
- 14:00–14:10: tests (`sh tests/run-all.sh`: visual maths, progress/spaced-repetition rules, content lint, all passing),
  manim-web tested and rejected for formulas, keyboard previews fixed, slide 31 checked against Analytic-DPM,
  six Path 2 groundwork pages written (see Phase 2). Session ended at 14:30 (Jacob's actual deadline was half two).
- 14:15–14:30: Jacob's review: site looked AI-made (tiny grey text, cream background, slide numbers, unpolished
  recursion). Redesigned: white page, darker/larger secondary text, no eyebrows/pills/stripes, formulas unboxed,
  Wikipedia-style breadcrumb above titles, plain "Your path" rail, minimal preview card, no slide numbers, plainer
  headings, home lists finished slides first. Rules recorded in `docs/design.md` ("Lessons from Jacob's first review").
- 14:45–15:15: Jacob's second review: stop referencing slides, teach instead; textbook bands; two bars at the top;
  contents-only sidebar; practice at the end; far less text. Did: rules above; every slide mention removed from all
  39 concept pages and the UI ("Topics" not "Slides"; topic titles in `course.json`); formula bands with titles,
  "In words" and symbol lists (new `formula` fence syntax, see `docs/content-format.md`); `keypoint`, `example`, `note`
  bands; older concept pages are merged automatically (formula + "In words" + "Piece by piece" become one band, so no
  formula is shown twice); recall hidden from pages; noise topic rewritten in about a third of the words.
- **Next session:** first, a text-cutting pass over every concept page under rule 2 (most are still too long:
  aim for half the words, give every formula band a title). Then Phase 1 (Path 1 polish), then Phase 2 from
  "Write slide 31 file". Run `sh tests/run-all.sh` before every push. To preview locally: `python3 -m http.server` in the repo root, open http://localhost:8000.
