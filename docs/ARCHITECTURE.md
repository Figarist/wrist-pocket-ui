# Architecture

> **Version:** 1.0.0 · **Status:** stable · **Consumers:** wristandpocket.dev, WearView

## 1. Layers

```
┌───────────────────────────────────────────────────────────────┐
│ Layer 4: Product layouts (site hub grid, WearView 3D stage)   │  lives in each product
├───────────────────────────────────────────────────────────────┤
│ Layer 3: Components (.wp-btn, .wp-card, .wp-header, ...)      │  components.css, header.css
├───────────────────────────────────────────────────────────────┤
│ Layer 2: Base (reset, body, focus ring, scrollbars)           │  base.css
├───────────────────────────────────────────────────────────────┤
│ Layer 1: Tokens (--wp-* colours, radii, shadows, fonts)       │  tokens.css
└───────────────────────────────────────────────────────────────┘
```

Each layer depends only on the layers below it. Products may load Layer 1 alone (WearView does, because it owns its reset and layout) or all four.

## 2. The obsidian palette

Blue-black surfaces instead of pure black, so the glowing accents and the watch screenshots read as light sources:

| Role | Tokens |
|---|---|
| Page and wells | `--wp-bg-app` `#0c1016`, `--wp-bg-sunken` `#0a0e14` |
| Surfaces | `--wp-bg-surface` `#111923` → `-elevated` `#151d28` → `-hover` `#1c2634` → `-active` `#243347` |
| Glass | `--wp-bg-glass`, `--wp-bg-glass-hover`, `--wp-bg-header`, `--wp-bg-overlay` |
| Borders | `--wp-border-subtle` `#222d3b`, `-medium` `#303b4b`, `-hover` `#3c4b5e`, `-strong` (14 % white) |
| Text | `--wp-text-bright` `#fff`, `-primary` `#f2f0eb` (warm, never harsh white), `-secondary`, `-tertiary`, `-muted` |
| Brand | `--wp-accent` `#72e0d6` (teal; `-ink` is the text colour on it), `--wp-accent-purple` `#c49bfc` |
| Selection | `--wp-selection*` (purple) for picked items, so selection never looks like a primary action |
| Status | `--wp-ok`, `--wp-warn`, `--wp-err`, `--wp-info`, each with `-bg` and `-border` |

The **W&P mark** is the brand in two letters: `W` in `--wp-accent`, `&` in `--wp-text-primary`, `P` in `--wp-accent-purple`.

## 3. Naming

* `--wp-<group>-<role>[-<state>]`: `--wp-bg-surface-hover`, `--wp-accent-border`.
* Translucent companions use the suffixes `-bg` (fill, 8–14 %) and `-border` (35–42 %).
* Classes are `wp-<block>[-<modifier>]`; states are `is-*` plus the matching ARIA attribute.

## 4. Generation pipeline

```
tokens.css ─┬─────────────────────────────► scss/_tokens.scss   ($wp-* + @mixin wp-css-variables)
base.css    │
components.css ─┬─ scripts/build.mjs ─────► wrist-pocket-ui.css (single-file bundle)
header.css  ────┘
```

`scripts/build.mjs` is plain Node with no dependencies. `--check` mode writes nothing and exits non-zero when a generated file is stale; `test/build.test.mjs` runs the same check, verifies that every `var(--wp-*)` exists, that no layer above tokens has a literal colour, and that the contrast pairs and the README table agree.

## 5. Typography

* **Outfit** (300–800, variable) for UI and headings, **Fira Code** (300–700, variable) for numbers, metrics and code.
* Both are Latin subsets; the stacks fall back to IBM Plex Sans and system fonts, which cover Cyrillic and CJK.
* `font-display: swap`, local files only.

## 6. Motion

`--wp-transition-fast` (0.15 s) for hover and focus, `--wp-transition-med` (0.25 s) for toasts and panels. Under `prefers-reduced-motion: reduce` component transitions and the interactive card lift are switched off.
