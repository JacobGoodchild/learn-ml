# Design system

The site should feel like a well-made textbook: calm, left-aligned, generous space, one accent colour.
All tokens live at the top of `css/site.css`. Change them there, never inline.

## Never

Purple, violet or blue-to-purple; gradients on UI; gradient text; glow, neon, frosted glass; emoji or sparkle
icons anywhere; a big centred headline over three feature cards; filler copy ("Unlock your potential");
Tailwind, shadcn or any UI framework; decorative shimmer or bounce. No badges, confetti, points or streaks.

## Lessons from Jacob's first review (2026-11-11): what read as AI-made

Avoid all of these. They were in the first build and were removed:
- Small grey UPPERCASE letter-spaced "eyebrow" labels above titles ("PROBABILITY · LAYER 3").
- Tiny, low-contrast helper text explaining the UI ("Esc backs up one layer", "or click the symbol", "see the ladder").
  If the UI needs explaining, the UI is wrong. Minimum text size 0.875rem; secondary text uses `--ink-2`, not lighter.
- Pill-shaped chips, coloured left-stripe callout boxes, every formula in its own bordered card.
- A cream/beige page background. The page is white.
- The same template headings on every page ("The key formula", "Read it aloud", "The breakdown").
  Headings now are plain ("In words", "Piece by piece", "Example", "Check yourself") and pages can drop any of them.
- Slide numbers as the main label. Slides are named by their titles.
- Cluttered preview cards. A preview is title, one-line summary, and "Open", like Wikipedia's page previews.

The recursion should feel like an encyclopaedia: a breadcrumb trail above the title, plain blue links,
formula pieces that look like links, and a plain "Your path" list in the left rail.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#ffffff` white | `#17191c` | page (white, as Jacob asked; tinted backgrounds only inside big 3D visuals) |
| `--panel` | `#ffffff` | `#1f2226` | formula panels, cards, menus |
| `--ink` / `--ink-2` / `--ink-3` | near-black / grey / light grey | reversed | text, secondary text, captions |
| `--rule` | `#e2ded5` | `#33373d` | hairlines |
| `--accent` | `#2b4c7e` ink blue | `#8fb0dd` | links, the slide layer, primary buttons, progress bars |

Pure black and white are not used for text or backgrounds (except white panels in light mode).

### Concept families

Every concept has a family (`colour:` in its file). The family colour is used for its formula pieces,
the top rule of its page when you dive in, its card in the layer rail, its dot in the ladder, the preview
card's top edge, and (later) its node in the map. When you click a teal symbol, you land on a teal layer.

| Family | Light | Dark | For |
|---|---|---|---|
| `probability` | `#237068` teal | `#6fc0b5` | random variables, distributions, conditioning |
| `spread` | `#4d7428` green | `#9cc46b` | mean, variance, covariance |
| `linalg` | `#2e5c96` blue | `#84aee6` | vectors, matrices, images as vectors |
| `calculus` | `#9a5c12` ochre | `#deaa5f` | derivatives, integrals, series, ODEs |
| `diffusion` | `#a5462c` rust | `#e7896b` | the diffusion process and its symbols |
| `information` | `#9c3a5e` rose | `#e08aab` | log, KL, ELBO |
| `learning` | `#6f5634` brown | `#c9a878` | networks, training, optimisation |
| `notation` | `#59636e` slate | `#a4adb7` | notation, floor reminders |

Add a family only if a whole group of new concepts needs one; keep it muted and test it in both themes.

## Type

- Prose: **Source Serif 4** (vendored in `vendor/fonts/`), 1.125rem, line-height 1.65, measure about 40rem.
- Small UI labels (nav, eyebrows, buttons, captions in visuals): system sans at 0.75–0.9rem.
- Maths: KaTeX fonts only. All maths goes through KaTeX; never write maths as plain text.
- Headings: semibold serif, never all-caps. Eyebrows (small uppercase labels above titles) use letter-spacing.
- Text size can be changed in settings (small / medium / large): everything is in `rem`/`em`.

## Space and layout

- Desktop: header, then a two-column layer view, with a 15rem layer rail on the left and the page on the right.
  Home, ladder, progress and review are single centred columns, left-aligned text.
- Phone (< 760px): the rail becomes a breadcrumb strip of compact cards at the top of the page; the header is
  not sticky; formulas scroll sideways inside their panel, never the page.
- Formulas sit in white panels with 1rem padding and plenty of margin. Text and formulas must never feel squashed.

## Components

- **Formula panel** (`.formula`): white panel, hairline border, 6px radius. First formula on a page draws in.
- **Piece** (`[data-c]`): the concept colour, a faint underline in that colour, a light tint on hover/focus.
- **Layer rail card**: title, the formula you came from with the clicked piece highlighted, a left edge in the concept colour.
- **Preview card**: summary, ways in, related, "Dive in". Hover on desktop, first tap on phone.
- **Check**: question, option buttons (green edge right, rust edge wrong), feedback in a left-ruled note, Hint and Worked answer buttons.
- **Progress bar**: 6px, light segment = understood, solid accent = remembered. Always with a text label.
- **Status dot**: hollow = not started, half = seen, filled = understood, filled with a ring = remembered, grey = floor.
- **Settings cog** (top right): theme, motion, text size, export/import/reset. Nothing else goes in the page chrome.

## Motion

- Dive: a short, subtle zoom (about 10%) towards the clicked piece with a fade (170ms), and the new layer settles in from the same point (220ms). Keep it subtle: big zooms read as gimmicky.
  Back up is the reverse, and the piece you came from is briefly highlighted.
- First formula on a page draws itself in (staggered fade-and-rise, ~0.5s).
- Big visuals may animate. Nothing else moves.
- `prefers-reduced-motion` (or Motion: Reduced in settings) turns all of this off; "Full" forces it on.
- `manim-web` was tested and not used for formulas (it draws to a canvas, so pieces cannot be clicked; details in CLAUDE.md). Draw-in is KaTeX + CSS.

## Visuals

- SVG for plots, canvas for images. Colours come from CSS variables (`var(--cc)` is the page's concept colour),
  so they work in both themes.
- Numerically honest: axes fixed so that changes in a parameter really show; the maths lives in `js/visuals/maths.js`
  and is checked by `tests/maths.test.mjs`.
- Every visual has an `aria-label` and a caption that says in words what the reader should notice.
- Sliders live inside the visual, never in page chrome.

## Writing voice

Plain English, short paragraphs, one idea per page, like a good teacher. No greetings, no hype, no exclamation marks,
no "Let's dive in". Say what each symbol is the first time it appears. Quick-check feedback is calm ("Right." / "Not quite.")
and explains the likely mistake. Citations only in the collapsed Sources section.
