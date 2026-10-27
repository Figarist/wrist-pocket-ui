# Components

All markup below assumes `tokens.css`, `base.css`, `components.css` and `header.css` (or the `wrist-pocket-ui.css` bundle) are loaded. The live versions are in [`../index.html`](../index.html).

## Glass header and W&P mark

```html
<header class="wp-header">
  <a class="wp-brand" href="https://wristandpocket.dev/">
    <span class="wp-mark"><span>W</span>&amp;<span>P</span></span>
  </a>
  <span class="wp-header-divider">/</span>
  <span class="wp-header-title">Page title</span>
  <span class="wp-header-spacer"></span>
  <nav class="wp-nav-tools">
    <a class="wp-nav-tool-link is-active" href="#">Overview</a>
    <a class="wp-nav-tool-link" href="#">Details</a>
  </nav>
  <span class="wp-status-pill"><span class="wp-dot wp-dot-ok"></span>Live</span>
</header>
```

* Height `--wp-header-h` (56 px); `.wp-header-dense` uses `--wp-header-h-dense` (42 px).
* Sticky, `backdrop-filter: blur(12px)` over `--wp-bg-header`.

## Buttons

```html
<button class="wp-btn">Default</button>
<button class="wp-btn wp-btn-primary">Primary</button>
<button class="wp-btn wp-btn-ghost">Ghost</button>
<button class="wp-btn wp-btn-danger">Delete</button>
<button class="wp-btn wp-btn-sm">Small</button>
<button class="wp-btn wp-btn-lg wp-btn-pill">Large pill</button>
<button class="wp-btn" aria-pressed="true">Toggle on</button>
<button class="wp-btn" disabled>Disabled</button>
```

Primary text is `--wp-accent-ink` on `--wp-accent` (12.12:1).

## Cards

```html
<div class="wp-card">Surface card</div>
<div class="wp-card wp-card-elevated">Elevated card</div>
<a class="wp-card wp-card-interactive" href="#">Clickable card</a>
```

## Form fields

```html
<label class="wp-label" for="name">Name</label>
<input class="wp-input" id="name" placeholder="Pixel Pet">

<label class="wp-label" for="size">Watch size</label>
<select class="wp-select" id="size"><option>45 mm</option></select>
```

## Chips

```html
<button class="wp-chip">All</button>
<button class="wp-chip is-active">Round</button>
<button class="wp-chip" aria-pressed="true">Square</button>
```

## Badges

```html
<span class="wp-badge wp-badge-ok">Pass</span>
<span class="wp-badge wp-badge-warn">Warn</span>
<span class="wp-badge wp-badge-err">Fail</span>
<span class="wp-badge wp-badge-info">Info</span>
<span class="wp-badge wp-badge-accent">New</span>
<span class="wp-badge wp-badge-purple">Beta</span>
```

## Status dots

```html
<span class="wp-dot wp-dot-ok"></span>
<span class="wp-dot wp-dot-warn"></span>
<span class="wp-dot wp-dot-err"></span>
<span class="wp-dot wp-dot-off"></span>
```

The short forms `.wp-dot.ok`, `.warn`, `.err`, `.off` are equivalent, so a script can toggle one class.

## Toast

```html
<div class="wp-toast wp-toast-ok is-visible" role="status">
  <span class="wp-dot wp-dot-ok"></span> Saved
</div>
```

Add or remove `.is-visible` to slide it in and out. Use `role="status"` (or `alert` for errors).

## Utilities

* `.wp-sr-only` — visually hidden, still read by screen readers.
* `.wp-mono` — Fira Code at 0.92 em.
