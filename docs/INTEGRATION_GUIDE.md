# Integration Guide

## 1. Plain HTML

Copy `wrist-pocket-ui.css` and `fonts/` into one folder and link the bundle:

```html
<link rel="stylesheet" href="wrist-pocket-ui.css">
```

Or link the layers you need, always in this order:

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="components.css">
<link rel="stylesheet" href="header.css">
```

`tokens.css` loads the fonts from `./fonts/`, relative to itself, so keep that folder next to it.

## 2. Vite / npm (how WearView consumes it)

```bash
npm install github:Figarist/wrist-pocket-ui#v1.0.0
```

```ts
// main entry, before your own styles
import 'wrist-pocket-ui/tokens.css';
```

Vite rewrites the `url('./fonts/...')` references and copies the `woff2` files into the build. Pin a tag, never a branch, so a palette change reaches the product only when you bump the dependency.

Your own CSS then uses the tokens directly:

```css
.panel { background: var(--wp-bg-surface); border: 1px solid var(--wp-border-subtle); }
```

## 3. Jekyll / Sass (how wristandpocket.dev consumes it)

1. Copy `scss/_tokens.scss` into the site as `_sass/_wp-tokens.scss` (the file says it is generated; never edit it there).
2. Use the variables in partials:

```scss
@use "wp-tokens" as *;

.card {
  background: $wp-bg-glass;
  border: 1px solid rgba($wp-accent, 0.2);
}
```

3. Optionally expose the custom properties for inline styles and scripts:

```scss
:root { @include wp-css-variables; }
```

Map legacy variable names onto tokens in one place (for example `$accent-cyan: $wp-accent;`) instead of renaming every partial at once.

## 4. Keeping a vendored copy in sync

When a product vendors files instead of installing the package:

* copy them byte-for-byte (no edits in the copy);
* record the package version you copied;
* add a check that compares the copy with the package checkout and fails when they differ.

## 5. Updating

1. Read the release notes of the new tag.
2. Bump the pin (git dependency) or re-copy the files (vendored).
3. Look for removed tokens: `grep -r -- "--wp-" src/` against `tokens.css`.
4. Check the product visually in the browser before shipping.
