# Brief: Learn ML (repo `learn-ml`) — foundation session

You are building **Learn ML**, a personal learning website hosted on GitHub Pages. This session
(Opus) lays the foundations: the plan, the architecture, the engine, the design system and one
fully working example path. Later sessions (Fable) will fill in content and build the big
interactive visuals, working from the checklist you leave in `CLAUDE.md`.

Read this whole brief before writing any code. Then read `slides.md` and `papers.md` in the repo root.

---

## 1. Who it is for, and the problem it solves

The owner is a UK sixth-form student (A-level Maths, Further Maths, Physics, Computer Science).
In July 2025 he attended a 3-hour postgraduate lecture on diffusion models at Tsinghua University's
Generative AI summer school and photographed the hardest slides. `slides.md` contains clean, checked
transcriptions of those 13 slides. `papers.md` lists the papers behind them.

His problem: every time he tries to learn from the slides, it slips away. To understand KL divergence
he needs to know what each symbol means, and for $\mathbb{E}$ he needs expectation, and for that he
needs averages of random things… It is recursive. So the site is built around **recursion**:
if you don't understand something, you dive one layer down, and keep going until you hit something
you already know.

What he knows (the "floor"): A-level Maths and Further Maths content, vectors, matrices, $Wx+b$,
basic programming. What he does NOT know: the normal distribution beyond the idea of a bell curve,
variance rules ($\mathrm{Var}(X)$ isn't on his spec), anything past A-level. Everything above the
floor needs its own node.

He uses it on a **monitor or laptop first**, and on his **phone on the bus** second. Design for
desktop; make sure it works on a phone.

---

## 2. The core idea: one concept map, many views

**Do not build this as a set of pages.** Build it as a **map of concepts** (a directed graph),
and make every feature a different way of looking at that map.

### Concept nodes
Each concept (normal distribution, conditional probability, KL divergence, the score function,
Euler's method, Taylor series, $\alpha_n$ in DDPM, …) is one node, stored as data. Each node has:

- `id`, `title`, one-line `summary`
- `needs`: the concepts one layer below it (the recursion links)
- `related`: sideways links (same level, worth comparing)
- `entryPoints`: 2–3 different ways in, each a short label plus which section of the page it opens.
  For example, for the normal distribution: "the bell curve", "mean and spread", "why the second number is squared".
- `colour`: the concept's colour (see section 6)
- `level`: rough depth, so floor concepts can be marked as known
- `content`: the page itself (see section 4)
- `recall`: 2–3 spaced-repetition questions (see section 3)
- `sources`: paper references for the collapsible Sources section

### Slides are entry points, not pages
Each transcribed slide is a "top" node. Every formula on it is broken into **pieces**, and every
piece (a symbol, a sub-expression, a whole term) links to the concept node that explains it.
Do this by tagging the LaTeX, e.g. with KaTeX's `\htmlData` / `\htmlClass`, so pieces are clickable
in place inside the rendered formula.

### Symbols mean different things on different slides
See the notation table at the top of `slides.md`. $\alpha$, $\sigma$, $\mu$ and $n$ all change
meaning between slides. Pieces must link to the concept for **that slide's meaning**, and the page
must say which meaning applies. Never assume a symbol has one meaning site-wide.

### It must be reusable
Courses are just sets of nodes plus entry slides. The Tsinghua lecture is the first course.
Adding a new course or topic later (assembly, calculus, another lecture) must mean adding data
files, not changing engine code. Shared concepts (logs, derivatives, the normal distribution) are
shared between courses. Keep content in data files (Markdown with front-matter, or JSON) under a
clear folder structure, and document the format in `docs/content-format.md`.

---

## 3. The ways to explore it

All modes use the same engine: diving, the layer rail and previews work identically everywhere,
and switching mode never loses your place.

**Slide mode (the main way in).** Like Wikipedia with the hard stuff first. The slide is rebuilt
cleanly (title, formulas in KaTeX, redrawn diagrams). Every tagged piece of every formula is clickable.

**Diving (the heart of the site).** It must feel like going *down into layers*, not hopping between pages.
- When you click a piece, the formula stays. The view zooms into that piece and the new layer opens out of it.
  Going back zooms out again. Use a short, smooth transition (respect `prefers-reduced-motion`).
- A **layer rail** shows the stack of layers you're in: one small card per layer, showing the formula
  you came from with the clicked piece highlighted. Click any card to jump straight back to that layer.
  On desktop it sits down the left side; on a phone it becomes a compact breadcrumb strip.
- When you finish a lower layer, "back up" returns you exactly where you were, scroll position included.
- The URL reflects the current stack, so browser back/forward work and a layer can be bookmarked.

**Preview card.** Hover a piece (desktop) or tap once (phone) to see: the one-line summary, the
entry points, related concepts, and a "Dive in" action. A second tap on a phone dives in.

**Ladder mode.** Walk the map bottom-up, from the floor to a chosen slide, in a sensible order
(a topological sort of the `needs` graph, restricted to that slide's tree).

**Map mode (built later, but design the data for it now).** The whole concept map in 3D. Nodes cluster
by topic area, links show `needs`, finished nodes light up, slides are the bright destinations.
Clicking a node opens it as a layer, with a sensible layer stack. Use the `3d-force-graph` library.
Provide a 2D fallback for phones and low-power devices. This is a Fable task: leave it unticked in
the checklist, but make sure the data supports it.

**Review mode.** His real problem is forgetting. Each node has 2–3 recall questions. After he marks
a node as understood, its questions come back after about 1 day, 3 days, 1 week, 2 weeks, 1 month
(simple spaced repetition; move a question back to the start if he gets it wrong). A small
"due today" count appears in the header when anything is due. Questions should test understanding,
not just recite formulas ("why does the spread stay at 1?", not only "write the formula").

**Progress tracking.** He wants to see overall progress and progress per section, in a way he'll
actually check, not a dashboard he ignores. Keep it honest, calm and useful:

- **Three levels per concept, earned, not clicked:** *seen* (opened the page), *understood* (passed its
  quick check), *remembered* (got its recall questions right at least a week later). No manual "mark as done".
  A remembered concept that becomes overdue for review drops back to *understood* until reviewed.
- **Per slide:** each slide shows how much of the tree underneath it is understood and remembered, as a
  thin bar or ring on the slide card and in slide mode. Clicking it shows that slide's tree with done
  and not-done concepts marked, so the gaps are obvious.
- **Per course and overall:** one short line in the header area, e.g. "34 of 87 concepts understood,
  12 remembered, 5 reviews due", that opens a **Progress page**.
- **The Progress page:** per-course and per-slide bars; the concepts due for review; and, most importantly,
  **"Next up"**: the single best concept to learn next (the lowest unfinished concept on the path to the
  slide he's working towards), so he never has to decide where to start.
- Everywhere else reflects the same state: ticks in ladder mode, markers in the layer rail and previews,
  and lit-up nodes in the map.
- **No gamification clutter:** no badges, confetti, points, streak-guilt or "Great job!" messages.

**Progress** is saved in the browser (`localStorage`, wrapped in try/catch so the site works without it).
Include export/import of progress as a file in the settings menu, so he can move it between laptop and phone.

---

## 4. What a concept page contains

A toolkit, not a checklist. Use only the sections a concept actually needs; most pages will use most of them.

1. **The key formula**, if there is one.
2. **Read it aloud**: the formula in plain English.
3. **The breakdown**: each piece highlighted in turn, each one clickable to dive deeper.
4. **An interactive visual**, where it genuinely helps understanding.
5. **A worked example** with real numbers.
6. **What this unlocks**: links back up to the slides and concepts that use this idea.
7. **A quick check**: 2–3 questions with instant marking, a hint, and a worked answer.
   Wrong answers explain the likely mistake.
8. **Recall questions** (feed review mode).
9. **Sources**: a collapsed section at the bottom with paper links and credits.
   Citations never appear in the main text ("Zhang et al., 2021" scattered through the page is banned).

### Writing style
- Plain English, short paragraphs, generous spacing. Text and formulas must never feel squashed.
- One idea per page. If a page needs two ideas, it should be two nodes.
- Small steps between layers. Two rungs that are "too close together" for an expert are fine.
- Write like a good teacher, not a product. No greetings, no hype, no "Let's dive in!", no exclamation marks.
- Always say what each symbol is the first time it appears on a page.
- All maths in KaTeX. Never plain-text maths.

---

## 5. Correctness (non-negotiable)

A learning site that teaches a slightly wrong formula is worse than no site.

- Before writing any page that uses a formula from a paper, open that paper (links in `papers.md`)
  and check every formula against it, down to subscripts, bars, hats and tildes.
- Resolve every item marked **CHECK** in `slides.md` against the paper and record what you found in `CLAUDE.md`.
- Visuals must be numerically honest: a bell curve with $\sigma=2$ must actually have that spread.
  Write small automated checks for any maths the visuals compute.
- Keep checking efficient: one careful pass per page, not repeated re-reading.

---

## 6. Design

**It must not look AI-generated.** This matters as much as anything else in this brief.

Banned:
- Purple, violet or blue-to-purple gradients; gradient text; glowing or neon effects; frosted glass.
- Emoji anywhere, including as icons. Sparkle icons.
- A big centred headline with three feature cards under it.
- Filler copy ("The only ML course you'll ever need", "Unlock your potential", "Select an option to dive in").
- The default Tailwind/shadcn look. Do not use Tailwind or a UI framework.

Wanted:
- Calm, minimalist, lots of white space, left-aligned text. Think a well-made textbook, not a landing page.
- A light theme as default with a proper dark mode. Off-white background, white panels, one accent colour.
  Pure `#000`/`#fff` only where needed.
- **Concept colours**: each concept (or concept family) has its own colour, used consistently in formulas,
  visuals, the layer rail and the map. When you dive into a teal symbol, the layer you land in is teal-accented.
  Keep the palette muted and readable in both themes.
- A clean, readable typeface for prose (not Inter everywhere), KaTeX's maths font for maths.
- **Controls stay out of the way.** Less-used options (theme, motion, text size, export/import progress,
  reset) live in a dropdown from a **settings cog in the top right**. The page itself should not be
  cluttered with buttons and sliders. Sliders belong inside visuals that need them.
- Animation is saved for moments that earn it: the dive transition, a formula appearing for the first time,
  a piece being highlighted, and the big visuals. Nothing shimmers for decoration.

**Formula animation.** For the "formula draws itself in" effect, first try the `manim-web` library
(a browser port of 3Blue1Brown's Manim with KaTeX support). It is new, so test it early on one formula.
If it is unreliable, build simple draw-in and highlight effects with KaTeX plus CSS instead. Record the decision.

---

## 7. Tech

- Static site for GitHub Pages, served straight from the **main branch root**. No build step if at all possible.
  Plain HTML, CSS and JavaScript (ES modules). No frameworks.
- **Vendor libraries into the repo** (KaTeX, 3d-force-graph, manim-web if used) rather than loading from a CDN,
  so the site keeps working if a CDN changes.
- Desktop-first responsive layout that also works at phone width with no sideways scrolling.
- Accessible: keyboard navigation for diving and backing up, visible focus, alt text for visuals,
  reduced-motion support.
- Test in a headless browser at desktop and phone widths, in both themes. Take screenshots and look at them.
- Original slide photos must never be added to the repo. Redraw diagrams as SVG or canvas visuals.
  If a picture genuinely can't be redrawn, list it in `CLAUDE.md` under "Ask Jacob" and move on.

---

## 8. How to work

- **Work directly on the `main` branch.** Do not create branches or pull requests.
- **Commit and push often**, with clear messages, so nothing is lost if the session stops.
- Keep a **`CLAUDE.md`** in the repo root containing:
  - the project rules from this brief (short form),
  - key decisions you made and why,
  - a **checklist of every remaining task**, one tick box each, in build order, grouped into phases,
  - a **Progress log** (date, what was done, what's next),
  - an **"Ask Jacob"** section for anything only he can answer.
  Future sessions will be told: "Read CLAUDE.md, including the progress log, and carry on from the first unticked item."
  Make that instruction enough on its own.
- **Usage limits:** unless told otherwise, if you hit a usage limit, schedule a wake-up for shortly after the
  limit resets, and when you wake, re-read `CLAUDE.md` and carry on from the first unticked item.
  Keep doing this until the work for this session is done or the deadline passes.
- **Deadline:** stop starting new work at **[DEADLINE — Jacob fills this in]**. Before stopping,
  update the progress log and checklist, and push.
- Don't spawn subagents. Keep screenshot review to focused rounds.

---

## 9. This session's scope (Opus: foundations)

Do these in order, ticking them off in `CLAUDE.md` as you go:

1. **Look at the repo** as it is now. Then write `CLAUDE.md` with the full checklist (sections 2–7 broken
   into concrete tasks, grouped into phases: Foundations, Path 1, Path 2, Path 3, Map, Polish).
2. **Plan the concept map** in `docs/concept-map.md`: every concept needed for all 13 slides, with `needs` and
   `related` links, down to the floor. Expect roughly 60–100 nodes. Mark which slide pieces link to which node.
   Use the "Concepts needed" lists in `slides.md` as a starting point, and the papers to fill gaps.
3. **Write `docs/content-format.md`**: the data format for nodes, slides and courses.
4. **Build the engine**: slide mode, clickable formula pieces, diving with the zoom transition, the layer rail,
   back-up, URL state, preview cards, ladder mode, quick checks, progress saving, export/import,
   review mode with spaced repetition, and progress tracking (per concept, per slide, overall,
   the Progress page and "Next up").
5. **Build the design system**: themes, concept colours, typography, spacing, the settings cog menu.
   Write it up in `docs/design.md` so Fable follows it.
6. **Build one complete vertical slice: Path 1.** Slide 19 fully working, with every piece clickable and every
   concept underneath it written properly, all the way down to the floor. Visuals can be simple placeholders
   where a big Fable visual is planned, but simple visuals that help (a bell curve with sliders, for example)
   should be real.
7. **Spec every big visual** in `docs/visuals.md`: what it shows, what the user controls, what they should
   notice, and which concept it belongs to. Fable builds these later. Categories include probability
   (distributions, sampling), noising and denoising real images, score fields, SDE vs ODE paths, Euler and
   Taylor-based solvers, loss landscapes in 3D, particles flowing to high density (slide 119), neural networks,
   and the 3D concept map. The final list should come from the slides, not just this paragraph.
8. **Test** at desktop and phone widths, in both themes. Fix what's broken.
9. **Update `CLAUDE.md`** so the next session can start cold. Make sure the next phases are clearly broken
   into tasks: Path 1 polish → Path 2 (slides 31, 25, 42) → Path 3 (DPM-Solver: 54, 56, 78) → VAE and
   auto-regressive slides → ProlificDreamer and EEGSDE → 3D map → polish.
10. **Finish** with a short plain-English summary for Jacob (no jargon): what was built, what's next, and
    anything in "Ask Jacob". Include, step by step, how to switch on GitHub Pages for the repo
    (Settings → Pages → deploy from the `main` branch, root folder) and where the live site will be.

Quality over quantity: one path that is genuinely excellent is the goal of this session.
