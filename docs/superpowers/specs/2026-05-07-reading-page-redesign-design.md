# /reading page redesign — design

**Date:** 2026-05-07
**Author:** wenjie@pixo.video (with Claude)
**Status:** Approved for planning

## Summary

Redesign the `/reading` page from a long-form vertical scroll of five chapter spreads into a typographic, single-leaf-at-a-time tabbed page. The five chapters of the reading (Heart, Head, Life, Fate, Mounts) are presented behind five silk ribbons hanging from the top edge of the page. The palm chart is removed from this page; the leaf carries the reading on its own. The preamble holds the post-load opening state; the colophon appears after Mounts has been read.

## Goals

- Replace the current scroll-driven manuscript with a deliberate, page-turn experience: one leaf, one chapter, no internal scroll.
- Make the reading feel like turning to numbered pages in a book of celestial diagrams, not scrolling a feed.
- Preserve the existing voice, data shape, and API integration. The redesign is presentational, not a model change.
- Keep the manuscript aesthetic from `.impeccable.md` intact: gold-leaf accent threading both themes, IM Fell English / EB Garamond, no AI tells.

## Non-goals

- No changes to `/api/read` or the `Reading` schema in `lib/reading.ts`.
- No changes to the landing page or its `InteractivePalm` narrative.
- No new content writing; existing chapter copy is reused (minor trimming only if a chapter does not fit a single viewport).
- No changes to `PalmTracing` or `ChapterSpread` themselves — they're simply not rendered by `/reading` anymore.

## Page architecture

The page is a small state machine driven by two inputs: the API call and the active-line URL parameter.

### States

1. **Consulting** — entered on mount. The API call is in flight. Five blank silk ribbons silk-draw themselves into the top edge of the page (SVG stroke draw, staggered ~140ms each). No labels yet. Below the ribbons, marginalia reads *"Consulting the chart…"* with three slow gold dots (reuse the existing `Dot` pattern). The preamble is hidden.
2. **Opened** — entered when the API resolves. Each ribbon's label inks in one by one (staggered ~180ms): `I · Linea Mensalis`, `II · Linea Cephalica`, `III · Linea Vitalis`, `IV · Linea Saturni`, `V · Montes manus`. The preamble fades in below the ribbons as the centered opening leaf. No ribbon is active yet.
3. **Reading** — entered when the user activates a ribbon (click, Enter, or arriving at `/reading?line=…`). The active ribbon slides ~12px down (drop-down "pulled out" feel), turns gold; the others stay parchment-colored. The leaf cross-fades from preamble (or previous chapter) to the chosen chapter.

Transitions:

- Activating the same ribbon a second time, clicking the small `← back to opening` marginalia in the leaf footer, or removing the `?line=` query param returns to the preamble leaf (still in Opened state).
- Once the user has activated the Mounts ribbon at least once during the current page mount, the closing colophon fades in *below* the leaf area and remains visible thereafter, including on subsequent leaves. The `mountsSeen` flag is component-mount-scoped (not persisted across refresh): a hard refresh that lands on `?line=fate` does not show the colophon until Mounts is opened again. The colophon includes the "Read another hand" CTA that routes to `/`.

### Error path

If the API call fails:

- Stay in Consulting visually for the silk-draw, then enter a small Error state in place of the leaf: marginalia *"An interruption"* + the existing italic error copy + a "Try another photograph" link back to `/`.
- Ribbon labels are not inked in (there's no reading to label).

### Direct-hit / refresh path

Behavior matches the existing page: if there is no pending file in `consumePendingFile()` and we are not in dev `?mock=1`, redirect to `/`. Refreshing on `/reading?line=fate` does this same check first; if a reading is generated, the page lands directly in the Reading state with Fate active.

## Layout

```
┌──────────────────────────────────────────────────────────┐
│  Header (existing)                                        │
│                                                           │
│   ▌ ▌ ▌ ▌ ▌      ← five silk ribbons hanging from the    │
│   I II III IV V    top edge of the page, ~88px wide       │
│                                                           │
│              ─── celestial rule ───                       │
│                                                           │
│         [ a single leaf, centered, max-width ~64ch ]      │
│                                                           │
│         (preamble in italic, OR a chapter)                │
│                                                           │
│              ─── celestial rule ───                       │
│                                                           │
│   [colophon — appears only after V has been opened]       │
└──────────────────────────────────────────────────────────┘
```

- Page background, header, theme toggle, and `StarField` ambient backdrop are unchanged.
- Ribbon row is positioned ~24–48px below the header. Each ribbon is ~88px wide, ~120px tall, with a small deckled bottom edge (hand-cut feel) drawn as an SVG path — not a CSS clip-path.
- A single celestial rule sits below the ribbons, separating them from the leaf region.
- The leaf region is centered, `max-width: 64ch`, with generous padding. It is the only region that changes when ribbons are activated.

### Ribbon visual

- Hangs from the top edge: a tall narrow trapezoid in `var(--surface)` over `var(--bg)` with a 1px `var(--rule)` border, and a faint inner shadow toward the top to suggest the ribbon is tucked behind the page edge.
- The active ribbon is offset down ~12px and has its background tinted toward `var(--accent-soft)`, with the numeral and label in `var(--accent)` (gold). Inactive ribbons sit higher and use `var(--ink-soft)`.
- Numeral (`I`–`V`) sits at the top in IM Fell English italic.
- Latin name (`Linea Mensalis`, etc.) reads vertically along the ribbon body — `writing-mode: vertical-rl` with `text-orientation: mixed`. This is the visual signature of the ribbon and grounds the manuscript metaphor.
- The bottom deckled edge has a quiet 1px line motif beneath it — a thread tail.

## Chapter leaf composition

Each chapter leaf is one centered typographic still-life. Top to bottom inside the `max-width: 64ch` column:

1. Marginalia overline: `Chapter II — Linea Cephalica` (uses the existing `.marginalia` style).
2. Display heading: `The Head Line` — IM Fell English, large, `clamp(2.4rem, 5vw, 3.6rem)`.
3. Italic subtitle: `Of the lantern carried into rooms` — EB Garamond italic.
4. Body: two paragraphs, EB Garamond, `1.18rem`, `line-height: 1.65`. The first paragraph opens with a drop cap that reuses the existing `DropCap` styling.
5. A pull-quote floated to the right margin at desktop widths (uses the existing `Note in the margin` pattern). On smaller screens, it falls below the body as a centered blockquote.
6. A small figure footnote across the bottom: `Fig. II — the head line and its chain · origin chain · ascending slope · deep terminus`. Inline marginalia, single line.
7. A small `← back to opening` marginalia link in the leaf footer.

The leaf is sized to fit comfortably in a single ~900px-tall viewport. The two-paragraph constraint plus the existing chapter copy keeps it on a single screen for I–IV. The Mounts chapter's existing copy is slightly long for one screen — see *Content adjustments* below.

## Content adjustments

The chapter copy in `lib/reading.ts` is reused as-is for I–IV. For V (Mounts), the two existing paragraphs are slightly trimmed at the data layer so the leaf fits on a single screen alongside the figure footnote and pull-quote. We trim copy to fit the layout; we do not add scroll to fit copy.

The preamble and colophon strings in `lib/reading.ts` are reused verbatim.

## Components

### New (added under `components/`)

- **`RibbonNav`** — the five-ribbon navigation. Renders SVG ribbons with the silk-draw animation. Props: `lines: { id, numeral, latin }[]`, `activeLine: LineId | null`, `onChange: (id: LineId | null) => void`, `phase: "consulting" | "opened" | "reading"`. Owns ARIA `role="tablist"` semantics, arrow-key navigation, and the silk-draw + label-ink-in animations.
- **`ChapterLeaf`** — renders a single chapter as a one-screen typographic composition. Props: `chapter: Chapter`. ARIA `role="tabpanel"`, `aria-labelledby` referencing the active ribbon.
- **`OpeningLeaf`** — renders the preamble as the "no ribbon selected" leaf. Props: `text: string`. ARIA `role="region"` with `aria-label="Preamble"` (not a `tabpanel`, since no ribbon is active).
- **`ClosingLeaf`** — renders the colophon + the "Read another hand" CTA. Props: `text: string`, `onAgain: () => void`.
- **`ErrorLeaf`** — renders the error state in place of the leaf. Props: `message: string`, `onRetry: () => void`. Marginalia *"An interruption"*, the italic error copy, and a "Try another photograph" link back to `/`.

### Reused (unchanged)

- `Header`
- `StarField`
- `MarginNote` (used inside `ChapterLeaf` for the figure footnote)
- `consumePendingFile`
- `getReading()`, `Reading`, `Chapter` types in `lib/reading.ts`
- `LINE_LORE` and `PALM_LINES` (referenced for the `numeral` + `latin` ribbon labels — single source of truth)

### Retired on this page (still used elsewhere)

- `PalmTracing` — used on the landing page narrative; not rendered by `/reading` anymore.
- `ChapterSpread` — replaced by `ChapterLeaf`. Still kept in the repo for reference; it can be removed in a follow-up if no other page references it.

### `app/reading/page.tsx` becomes an orchestrator

The page file's responsibility shrinks to:

- Owning the API call to `/api/read` (existing logic, including the `?mock=1` dev path and the `consumePendingFile` redirect).
- Owning the page state machine: `consulting | opened | reading`, plus an `activeLine: LineId | null` and a `mountsSeen: boolean` flag for whether the colophon should be shown.
- Syncing `activeLine` to the URL via `?line=heart|head|life|fate|mounts` (parsed from `useSearchParams`, written via `router.replace`). On mount with `?line=…` already set, the page enters Reading state for that line as soon as the API returns. Browser back/forward navigates between leaves naturally.
- Rendering `<Header /> + <StarField /> + <RibbonNav /> + (<OpeningLeaf /> | <ChapterLeaf /> | <ErrorLeaf />) + <ClosingLeaf? />`.

The existing `Preamble`, `Colophon`, and `Divider` helpers inside `app/reading/page.tsx` are removed; they are replaced by `OpeningLeaf` and `ClosingLeaf`.

## Data flow

- On mount, `consumePendingFile()` returns the uploaded image (or null → redirect home, unchanged).
- `POST /api/read` is called with the image FormData.
- While in flight, the page is in Consulting state.
- On success, the page transitions to Opened; the preamble shows (unless `?line=…` is set, in which case it transitions directly to Reading for that line).
- On error, the page enters Error state in place of the leaf; ribbons remain unlabeled.

The `Reading` data is held by the orchestrator and looked up by line id when rendering `ChapterLeaf`. The mapping from `LineId` → chapter index uses the order in `lib/reading.ts` (Heart=0, Head=1, Life=2, Fate=3, Mounts=4) — this is already the canonical order in `Reading.chapters` and `LINE_LORE`.

## URL state

- `/reading` → preamble leaf (after Opened).
- `/reading?line=heart|head|life|fate|mounts` → that chapter leaf (after Opened).
- Invalid `?line=` value is treated as if it were absent.
- The first time a user activates a ribbon, `router.replace` writes the param. Returning to the preamble removes the param via `router.replace`. We use `replace` rather than `push` for ribbon switches so the back button steps out of `/reading` rather than walking through every chapter the user clicked.

## Motion

All motion uses the existing `--ease-celestial` cubic-bezier.

- **Silk-draw (Consulting):** each ribbon's outline strokes itself in over ~900ms, staggered ~140ms between ribbons. Reuses the existing `stroke-draw` keyframes and `--len`/`stroke-dashoffset` pattern.
- **Label ink-in (entering Opened):** each ribbon's numeral + Latin label fades in with a tiny y-offset over ~480ms, staggered ~180ms.
- **Preamble fade-in (entering Opened):** ~600ms opacity + 8px y-offset.
- **Ribbon activation:** the active ribbon translates down ~12px and the active color crossfades over ~360ms.
- **Leaf cross-fade:** outgoing leaf fades to 0 over ~280ms; incoming leaf fades in from `opacity: 0; translateY(8px)` over ~360ms with a ~120ms overlap so there is no blank moment.
- **Colophon entry:** ~600ms opacity + 8px y-offset, the first time Mounts is opened.
- **Reduced motion (`prefers-reduced-motion: reduce`):** silk-draw and ink-in collapse to a 200ms opacity fade. Leaf cross-fades shorten to 120ms. The 12px ribbon offset on activation is preserved (it's spatial, not animation) but its transition collapses to instant.

## Accessibility

- `RibbonNav` is `role="tablist"` with `aria-orientation="horizontal"`. Each ribbon is a `role="tab"` with `aria-selected`, `aria-controls` pointing to the leaf region's id, and a stable `id` so `aria-labelledby` on the leaf can refer back.
- Leaf region (`ChapterLeaf` or `OpeningLeaf`) is `role="tabpanel"` with `tabIndex={0}` and (when a ribbon is active) `aria-labelledby` pointing at that ribbon.
- Keyboard: Arrow Left/Right move focus across ribbons; Home/End jump to first/last; Enter/Space activate the focused ribbon. Tab moves focus from ribbons to the leaf region.
- Color contrast for active vs. inactive ribbons must clear WCAG AA in both light and dark themes. Active ribbon's gold-on-tinted-surface is the danger zone; we'll verify and adjust `--accent` opacity / surface tint at implementation time if needed.
- The `← back to opening` link is a real `<button>` with focus-visible styles.
- Vertical text on ribbons: the `aria-label` on each ribbon is set to a horizontal phrasing (`"Chapter II — The Head Line"`) so screen readers read it normally.

## Responsive behavior

- **Desktop (≥ 768px):** as drawn above. Leaf at `max-width: 64ch`. Pull-quote floats right of the body.
- **Tablet (~ 640–768px):** ribbons stay across the top, slightly narrower (~72px). Pull-quote drops below the body as a centered blockquote.
- **Mobile (< 640px):** five ribbons in a fixed-width gutter would crush. Adapt: the ribbon row becomes a horizontal scrolling strip with snap-points across the top edge of the page. Activating a ribbon scrolls it to center. The active ribbon is still visually distinct (offset down + gold). Leaf below adapts to a single column; pull-quote falls below body. Touch swipe on the leaf is *not* a chapter-switch gesture (avoid surprising horizontal-scroll conflicts); ribbon taps are the only switch affordance.

## Theming

- Light theme: silk ribbons read as cream silk over parchment, with deep ink labels and a gold active state.
- Dark theme: silk ribbons read as a richer indigo silk over the midnight surface, with vellum labels and the same gold active state. Both themes use the existing `--surface`, `--rule`, `--accent` tokens — no new color tokens added.

## Testing & verification

- Manual: walk every state on both themes (Consulting → Opened → Reading I–V → return to opening → re-open Mounts → confirm colophon stays). Verify on desktop, tablet, mobile widths. Verify with `prefers-reduced-motion: reduce` toggled. Verify keyboard-only navigation reaches and activates every ribbon. Verify `?line=…` deep links land correctly on refresh and after the API resolves.
- Dev preview: `/reading?mock=1&line=fate` should land directly on the Fate leaf with the colophon hidden until Mounts is opened.
- Type checking: existing `tsc` config is sufficient; new components are typed.
- No new tests are added in this redesign — the project does not currently have a test harness, and the redesign is presentational.

## Risks & open considerations

- **Mounts trim:** trimming the existing chapter copy is a small writing call. If the trim feels lossy, the alternative is to give Mounts a slightly taller leaf with a quiet inner scroll *only* on Mounts. Default is to trim.
- **Vertical text on ribbons:** browser support for `writing-mode: vertical-rl` + `text-orientation: mixed` is universal, but font hinting on IM Fell English may render less crisply rotated. Verify at implementation time and fall back to a shorter horizontal label (`Mensalis`) if rotation looks off.
- **Mobile horizontal ribbon strip:** on phones the ribbons risk feeling like generic chips rather than ribbons. Plan to keep the deckled bottom edge and the vertical Latin label even at small sizes; if it crushes badly, drop the Latin label on mobile and keep only the numeral + English name (the screen-reader label still carries the Latin).

## Out of scope (explicit)

- Changes to `/api/read`, `Reading` schema, or chapter data structure.
- Replacing the landing page or its narrative.
- A separate "share this chapter" feature beyond the URL deep-link being copyable.
- Removing `PalmTracing` or `ChapterSpread` from the codebase (they remain available; the redesign just stops importing them from `/reading`).
