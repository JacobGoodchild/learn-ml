# Content format

All content is data. Adding a concept, a slide or a whole course means adding files here. The engine
(`js/`) never needs to change for new content.

```
content/
  courses.json                         list of course ids, e.g. ["tsinghua-diffusion"]
  concepts/<concept-id>.md             one file per concept, shared by every course
  courses/<course-id>/course.json      the course: title, outline, which slides and concepts it uses
  courses/<course-id>/slides/<slide-id>.md
```

The engine loads `courses.json`, then each `course.json`, then every slide and concept file listed there.
A concept used by two courses is one file, listed in both `concepts` arrays.

## course.json

```json
{
  "title": "Full title",
  "short": "Short title for headers",
  "description": "One paragraph, Markdown allowed.",
  "slides": ["slide-19"],
  "outline": [ { "id": "slide-19", "number": "19", "title": "…", "part": "Diffusion basics" } ],
  "concepts": ["random-variable", "variance", "…"]
}
```

- `slides`: slide files that exist and are built (`slides/<id>.md`).
- `outline`: the whole lecture in order, including slides not built yet (shown greyed out on the home page).
- `concepts`: every concept file this course uses. **Add new concept ids here**, or they will not load.

## Concept and slide files

Each file is Markdown with front-matter between `---` lines.

```markdown
---
id: normal-distribution            # must match the file name
title: The normal distribution     # may contain inline maths: $\beta_n$: the noise schedule
summary: One line. Shown in previews, the ladder, "Built on" lists.
colour: probability                # family: probability | spread | linalg | calculus | diffusion | information | learning | notation
level: 3                           # 0 = floor (already known, not counted in progress)
needs: [probability-density, variance]   # one layer down: the recursion links
related: [standard-normal]               # sideways: worth comparing
entryPoints:                             # 2–3 ways in; section = a heading id in this file
  - label: the bell curve
    section: shape
  - label: why the second number is squared
    section: squared
sources:                                 # shown only in the collapsed Sources section
  - title: Denoising Diffusion Probabilistic Models
    authors: Ho, Jain and Abbeel, NeurIPS 2020
    url: https://arxiv.org/abs/2006.11239
    note: What this source was used for
---
```

Slide files use the same front-matter plus `number:` (shown as "Slide 19"). They have no `colour`, `level` or checks.

The front-matter parser is a small YAML subset: `key: value`, `key: [a, b]`, and lists of one-level maps as above.
No nested lists, no multi-line strings. Quote a value only if it starts with `[` or contains `: ` you want kept.

### Body

Ordinary Markdown: `## Heading {#section-id}` (the id is what `entryPoints.section` and URLs use), paragraphs,
`- lists`, `1. lists`, `**bold**`, `*italic*`, `` `code` ``, `[text](https://…)`, and `> notes`. Inline maths `$…$`,
display maths `$$…$$` on its own lines.

**Concept links.** `[text](c:concept-id)` makes a clickable link that dives into that concept, as a new layer.

**Clickable formula pieces.** Inside any maths, `\p{concept-id}{latex}` makes that piece clickable and colours it
with the concept's family colour. Example:

```latex
\p{diffusion-step}{q(x_n\mid x_{n-1})} = \p{isotropic-gaussian}{\mathcal N}\big(\p{alpha-n-ddpm}{\sqrt{\alpha_n}}\,x_{n-1}, \p{beta-n-ddpm}{\beta_n} I\big)
```

Rules for pieces:
- Link to the concept for **this slide's meaning** of the symbol (`alpha-n-ddpm` vs `alpha-t-dpm`).
- Do not nest `\p` inside `\p`.
- Every `needs` entry is also listed automatically under "Built on", so every need is reachable even if no
  formula piece points at it.
- Pieces are numbered in page order; the URL records which piece you clicked (`variance@3`). If you reorder
  a page, old bookmarks still open the right concept but may highlight a different piece in the rail.
- Macros available: `\p`, `\E` (= `\mathbb{E}`), `\N` (= `\mathcal{N}`).

### Fenced blocks

**Formula** (display maths in a panel; the first formula on a page draws itself in). Optional label after the word:

````
```formula The whole noising process, as one chain
q(x_0,\dots,x_N) = …
```
````

**Breakdown** (the formula, then one row per piece; hovering a row highlights that piece). Rows are
`concept-id | latex of the piece | explanation (Markdown)`:

````
```breakdown
X \sim \mathcal N(\p{expectation}{\mu},\ \p{variance}{\sigma^2})
---
expectation | \mu | The mean: the centre of the bell.
variance | \sigma^2 | The variance: how spread out it is.
```
````

**Quick check.** Each `?` starts a question. Options use `- [x]` (right) / `- [ ]` (wrong), then `::` and
the explanation shown when chosen (for wrong options: the likely mistake). Or a numeric answer `= value ± tolerance`
with `wrong:` text. `hint:` and `answer:` (worked answer) are optional but expected. Text may continue on following lines.

````
```check
? A variable follows $\mathcal N(5, 16)$. What is its standard deviation?
= 4 ± 0.001
wrong: The second number is the variance. Take its square root.
hint: The second slot holds $\sigma^2$.
answer: $\sigma = \sqrt{16} = 4$.
? Which one is right?
- [x] This one :: Why it is right.
- [ ] That one :: The mistake someone choosing this probably made.
hint: …
answer: …
```
````

A concept counts as **understood** when every check question on its page has been answered correctly (retries allowed).

**Recall** (spaced-repetition questions; `?` then the answer on the following lines). Questions should test
understanding ("why…?"), not only recall of a formula:

````
```recall
? Why does a wider bell curve have to be lower?
Because the total area is always 1.
```
````

Recall ids are `<concept-id>#r<index>`, so **append** new recall questions rather than inserting them in the middle,
or saved review history will attach to the wrong question.

**Visual.** `name` must be in `js/visuals/index.js`; options are `key=value` lines. Unknown names show a placeholder
that points at `docs/visuals.md`, so a page can reference a visual before it is built.

````
```visual bell-curve
mu=0 sigma=1
```
````

**Notation table** (a "which meaning applies here" box): one row per line, `symbol :: meaning`.

````
```notation
$\alpha_n$ :: how much one step keeps. Not the $\alpha_t$ of slide 54.
```
````

## Generated sections

The engine adds these to every page, so do not write them by hand:
- **Built on** — from `needs`.
- **What this unlocks** — every node whose `needs` (or slide pieces) include this one.
- **Worth comparing** — from `related`.
- **Sources** — from `sources`, collapsed.

## Page recipe (a toolkit, not a checklist)

Use the sections a concept needs, usually in this order, with these heading ids so entry points stay predictable:
`formula` (the key formula), `aloud` (read it aloud), `breakdown`, the idea sections, `example` (a worked example
with real numbers), `check` (quick check, 2–3 questions), then the `recall` block. Say what every symbol is the
first time it appears. No citations in the main text.
