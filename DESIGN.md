# Design and front-end notes

This replaces `IMPLEMENTATION_GUIDE.md` and `DESIGN_SHOWCASE.md`, which described a
dark-mode redesign that was never merged. Those files documented code that did not
exist on `master` — the implementation is still sitting on the unmerged branch
`origin/feature/dark-mode-modern-redesign` — so they have been removed rather than
left to mislead. Everything below describes what is actually in the repository.

## Layers

`assets/css/main.scss` imports the upstream Minimal Mistakes partials first, then
three site partials, in this order. **Do not reorder them.**

| Partial | Role |
|---|---|
| `_sass/_tokens.scss` | All colour, type, spacing and motion values as CSS custom properties, defined three times: bare `:root` (light), `:root[data-theme="dark"]`, and a `prefers-color-scheme: dark` block guarded by `:not([data-theme="light"])`. |
| `_sass/_theme-override.scss` | Re-points upstream selectors (masthead, sidebar, archive items, footer, code, tables) at those tokens. This is what makes dark mode work without forking the upstream partials. |
| `_sass/_academic.scss` | The new components: hero, metric tiles, publication cards, badges, chips, timeline, research areas, globe. |

Light is the bare `:root` default so the page is correct before any JS runs.

## Theme switching

An inline script in `_includes/head.html` runs before first paint and applies the
saved theme from `localStorage`, which is what prevents a flash of the wrong colours.
`assets/js/site.js` handles the toggle button (`_includes/theme-toggle.html`, injected
into the masthead), the `Ctrl/Cmd+Shift+L` shortcut, and persistence. With no stored
preference the site follows the operating system.

One gotcha worth knowing: `_sass/_navigation.scss` styles `.greedy-nav button`, which
is more specific than a bare `.theme-toggle` class and will silently resize and
reposition the toggle. `_academic.scss` therefore targets `.greedy-nav button.theme-toggle`,
and the override layer excludes the toggle from the hamburger rule with
`> button:not(.theme-toggle)`.

## Scroll reveal is inverted on purpose

`.reveal` on its own does nothing. `site.js` adds `.reveal-ready` to `<html>` only after
confirming it has an `IntersectionObserver` and that motion is allowed, and only that
class applies the hidden state. So if the script is blocked, fails, or never runs, every
element is still visible. The earlier arrangement (hidden by default, revealed by JS)
meant one script failure left the page blank.

Reveal is used only on decorative elements — the research tiles and the globe. Publication,
talk and teaching cards are never hidden, because they are the content people came for.

## Publication cards

`_includes/publication-card.html` renders one entry from the `publications` collection.
Front matter it reads:

```yaml
title, permalink, date, authors, venue, venue_short, venue_type, award,
topics, summary, abstract, citation, keywords,
localpdf     # free copy hosted in /files — renders the "Free PDF" button
paperurl     # publisher link
doi          # renders the DOI button
github       # code repo — renders the Code button and a "Code available" badge
slidesurl
dataset_note # renders a "Public dataset" badge
```

Every link is optional and only renders when present. `authors` is a plain string; the
template bolds "Mabon Ninan" within it. `venue_type` drives the filter chips on
`/publications/`; `category` still drives which section a paper appears in, and a
`category` not listed under `publication_category` in `_config.yml` renders **nowhere**.

`github:` is present but empty on every paper, awaiting repository URLs. Fill it in and
the Code button and badge appear automatically.

## Metrics

`_data/metrics.yml` holds the numbers. Counts derived from repository content are filled
in; the Google Scholar figures are deliberately blank, and a tile whose value is blank is
skipped rather than rendered as a zero or a placeholder.

`assets/js/metrics.js` refreshes citations, h-index and i10 at runtime from **OpenAlex**,
keyed on the ORCID in `_config.yml`. Scholar itself is not used: it has no API, blocks
automated requests, and sends no CORS headers, so a browser-side Scholar fetch cannot
work. The fetch is a progressive enhancement with a 24-hour cache — if it fails or returns
nothing, the values from `_data/metrics.yml` stand.

## Globe

`assets/js/globe.js` is a dependency-free canvas globe (no three.js, no geodata): a
graticule wireframe, arcs from the home pin to each location, and pins scaled by count.
It reads fallback pins from `_data/globe.yml` and upgrades to live visitor data when
`visitor_api` is set. See `cloudflare/README.md` to deploy the (free) backend.

Details that matter if you edit it: the initial rotation is centred on the mean longitude
of the pins and `TILT` is **positive** to bring the northern-hemisphere cluster to the
middle of the disc — a negative tilt pushes every pin against the top edge. Far-side pins
are drawn faintly rather than skipped, so the globe never looks empty mid-rotation. It
pauses when scrolled out of view or the tab is hidden, and renders a single static frame
under `prefers-reduced-motion`.

## Cache busting

`_includes/head.html` and `_includes/scripts.html` append `?v={{ site.time }}` to the
stylesheet and the three site scripts. Without it a returning visitor keeps running the
previously cached copy, which is an easy way to convince yourself a fix did not deploy.

`assets/js/main.min.js` is a committed uglify bundle and is deliberately *not* where site
behaviour lives — see CLAUDE.md.

## Local preview

Use the dev config overlay, or you will be previewing the deployed stylesheet:

```bash
bundle exec jekyll serve --config _config.yml,_config.dev.yml
```

`_includes/base_path` builds every asset URL from `site.url`, so without the overlay a
local server still pulls CSS and JS from https://ninanmm.github.io.
