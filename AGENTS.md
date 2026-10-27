# AGENTS.md — Wrist & Pocket UI

Operating contract for AI agents and contributors in this repository.

## Identity

* **What:** the public, zero-dependency CSS design system ("obsidian" palette) of Wrist & Pocket Studio.
* **Consumers:** the studio website [wristandpocket.dev](https://wristandpocket.dev) (Jekyll, uses `scss/_tokens.scss`) and [WearView](https://wristandpocket.dev/wearview/) (Vite, imports the CSS through a git dependency). Describe only these two products in this repository.
* **Repository:** https://github.com/Figarist/wrist-pocket-ui (public, MIT).

## Rules

1. **Tokens first.** Colours, radii, shadows, font stacks and motion live only in `tokens.css` as `--wp-*` properties. `base.css`, `components.css` and `header.css` use `var(--wp-*)` and contain no literal colours (the tests enforce it).
2. **Generated files are never edited by hand.** `wrist-pocket-ui.css` and `scss/_tokens.scss` come from `node scripts/build.mjs`. Run it after every source change; `node scripts/build.mjs --check` must pass.
3. **No dependencies, no CDN.** No npm runtime or dev dependencies, no remote fonts, no external scripts in `index.html`. Fonts are local `woff2` with their OFL texts in `fonts/licenses/`.
4. **Contrast.** Readable text pairs must reach WCAG AA (4.5:1); keep the README contrast table in sync (a test checks it). `--wp-text-muted` is decoration only.
5. **Accessibility.** Every interactive component keeps the `:focus-visible` ring and respects `prefers-reduced-motion`.
6. **Class prefix.** Every class is `wp-*`; state classes are `is-*`; ARIA state (`aria-pressed`) is styled the same as the matching `is-*` class.
7. **Language.** Files, code, comments and commit messages are in English.

## Change procedure

1. Edit `tokens.css` / a layer file.
2. `node scripts/build.mjs`.
3. Add or update the demo in `index.html` and the markup in `docs/COMPONENTS.md`.
4. `node --test test/*.test.mjs`.
5. Bump `version` in `package.json` (semver: removing or renaming a token or class is a major change), commit, tag `vX.Y.Z`.
