# Wrist & Pocket UI

[![Vanilla CSS](https://img.shields.io/badge/Pure_Vanilla-CSS3-blue?style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=for-the-badge)](https://github.com/Figarist/wrist-pocket-ui)
[![WCAG AA/AAA](https://img.shields.io/badge/Contrast-WCAG_AA%2FAAA-brightgreen?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![100% Offline](https://img.shields.io/badge/Offline-100%25_Ready-yellow?style=for-the-badge)](https://github.com/Figarist/wrist-pocket-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)](LICENSE)

> **The dark "obsidian" design system of [Wrist & Pocket Studio](https://wristandpocket.dev).**
> It powers exactly two public products: the studio website **[wristandpocket.dev](https://wristandpocket.dev)** and **[WearView](https://wristandpocket.dev/wearview/)**, the in-browser 3D smartwatch previewer for Wear OS screens.

---

## Why

Wear OS games are dark, small, and glanceable, and so is everything around them. This package keeps the website and WearView on one palette, one type pairing and one set of components instead of three hand-copied colour lists.

1. **One source of truth.** Every colour, radius, shadow and font stack is a `--wp-*` custom property in [`tokens.css`](tokens.css). The single-file bundle and the Sass partial are generated from it.
2. **Zero dependencies, fully offline.** Plain CSS, no CDN, no web-font service. Outfit and Fira Code ship as local `woff2` files with their OFL licenses. Works from `file://`.
3. **Measured contrast.** Every documented text pair passes WCAG AA, most pass AAA, and a test fails the build if a token change breaks a pair or this table.

---

## Quick start

### Plain HTML (single file)

Copy `wrist-pocket-ui.css` and the `fonts/` folder next to each other, then:

```html
<link rel="stylesheet" href="wrist-pocket-ui.css">

<header class="wp-header">
  <a class="wp-brand" href="/"><span class="wp-mark"><span>W</span>&amp;<span>P</span></span></a>
  <span class="wp-header-divider">/</span>
  <span class="wp-header-title">My page</span>
</header>

<main style="padding: 24px">
  <div class="wp-card">
    <span class="wp-badge wp-badge-ok">Ready</span>
    <p>Small screens. Real worlds.</p>
    <button class="wp-btn wp-btn-primary">Open</button>
  </div>
</main>
```

### Pick only the layers you need

`tokens.css` → `base.css` → `components.css` → `header.css`, in that order. Only `tokens.css` is required.

### npm / Vite (git dependency)

```bash
npm install github:Figarist/wrist-pocket-ui#v1.0.0
```

```ts
import 'wrist-pocket-ui/tokens.css'; // fonts resolve from the package
```

### Sass / Jekyll

Vendor `scss/_tokens.scss` into your `_sass/` folder, then:

```scss
@use "tokens" as *;

:root { @include wp-css-variables; }      // optional: expose --wp-* to plain CSS
.card { background: $wp-bg-surface; border-color: rgba($wp-accent, 0.2); }
```

More in [docs/INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md).

---

## Palette and contrast

Ratios use the W3C formula $\text{Contrast} = \frac{L_1 + 0.05}{L_2 + 0.05}$ and are checked by `npm test`.

| Text token | Background token | Ratio | WCAG |
|---|---|---|:---:|
| `--wp-text-primary` `#f2f0eb` | `--wp-bg-app` `#0c1016` | **16.74:1** | AAA |
| `--wp-text-secondary` `#bcc6d5` | `--wp-bg-surface` `#111923` | **10.26:1** | AAA |
| `--wp-text-tertiary` `#8d9ab0` | `--wp-bg-surface-elevated` `#151d28` | **5.96:1** | AA |
| `--wp-accent` `#72e0d6` | `--wp-bg-app` `#0c1016` | **12.12:1** | AAA |
| `--wp-accent-ink` `#0c1016` | `--wp-accent` `#72e0d6` | **12.12:1** | AAA |
| `--wp-accent-purple` `#c49bfc` | `--wp-bg-app` `#0c1016` | **8.57:1** | AAA |
| `--wp-ok` `#32d583` | `--wp-bg-surface` `#111923` | **9.25:1** | AAA |
| `--wp-warn` `#ddc7a0` | `--wp-bg-surface` `#111923` | **10.74:1** | AAA |
| `--wp-err` `#ff7a8a` | `--wp-bg-surface` `#111923` | **7.08:1** | AAA |
| `--wp-info` `#7aaef5` | `--wp-bg-surface` `#111923` | **7.75:1** | AAA |

`--wp-text-muted` (`#57627a`, 3.12:1 on `--wp-bg-app`) is for disabled states, separators and decoration only, never for text a reader must read.

---

## Components

* `.wp-btn` — buttons (`-primary`, `-ghost`, `-danger`, `-sm`, `-lg`, `-pill`, `.is-active` / `aria-pressed`).
* `.wp-card` — surfaces (`-elevated`, `-interactive`).
* `.wp-input`, `.wp-select`, `.wp-label` — form fields.
* `.wp-chip` — filters and toggles (`.is-active` / `aria-pressed`).
* `.wp-badge` — status labels (`-ok`, `-warn`, `-err`, `-info`, `-accent`, `-purple`).
* `.wp-dot` — status dots (`-ok`, `-warn`, `-err`, `-off`).
* `.wp-toast` — corner notifications (`.is-visible`, `-ok`, `-warn`, `-err`).
* `.wp-header` — sticky glass header with the two-colour **W&P** mark (`-dense`, `.wp-status-pill`, `.wp-nav-tool-link`).

Copy-paste markup for each is in [docs/COMPONENTS.md](docs/COMPONENTS.md). The living styleguide is [`index.html`](index.html), published at [sivochka.com/wrist-pocket-ui](https://sivochka.com/wrist-pocket-ui/).

---

## Repository layout

```
wrist-pocket-ui/
├── tokens.css            # Layer 1: --wp-* tokens + @font-face (source of truth)
├── base.css              # Layer 2: reset, body, focus ring, scrollbars, .wp-sr-only
├── components.css        # Layer 3: buttons, cards, inputs, chips, badges, dots, toasts
├── header.css            # Layer 3: glass header and W&P mark
├── wrist-pocket-ui.css   # generated bundle of the four files above
├── scss/_tokens.scss     # generated Sass variables + wp-css-variables mixin
├── fonts/                # Outfit + Fira Code woff2, OFL 1.1 texts in fonts/licenses/
├── scripts/build.mjs     # zero-dependency generator (node scripts/build.mjs [--check])
├── test/                 # node --test: freshness, token use, contrast, README table
├── index.html            # living styleguide
└── docs/                 # ARCHITECTURE, COMPONENTS, INTEGRATION_GUIDE
```

## Development

```bash
node scripts/build.mjs          # regenerate wrist-pocket-ui.css and scss/_tokens.scss
node --test test/*.test.mjs               # freshness, undefined tokens, literal colours, contrast
```

Change tokens only in `tokens.css`, rebuild, run the tests, update the table above if a ratio moved, and tag a new version (`vX.Y.Z`) so consumers can pin it.

---

## Documentation

* [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, token naming, generation pipeline.
* [docs/COMPONENTS.md](docs/COMPONENTS.md) — every component with markup.
* [docs/INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md) — plain HTML, Vite, Jekyll/Sass, keeping a vendored copy in sync.
* [AGENTS.md](AGENTS.md) — rules for AI agents working in this repository.

## License

Code: [MIT](LICENSE). Fonts: [SIL Open Font License 1.1](fonts/licenses/) (Outfit, Fira Code).
