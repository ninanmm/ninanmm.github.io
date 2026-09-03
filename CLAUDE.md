# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Mabon Ninan's personal academic website — a Jekyll site served by GitHub Pages at
https://ninanmm.github.io from the `master` branch of `ninanmm/ninanmm.github.io`.

It is a detached fork of the [academicpages](https://github.com/academicpages/academicpages.github.io)
template (itself a fork of Minimal Mistakes). Most of `_includes/`, `_layouts/`, `_sass/`,
and `assets/` is upstream template code; the site owner's actual content lives in
`_config.yml`, `_data/navigation.yml`, `_pages/`, `_publications/`, `_talks/`, `_teaching/`,
and `files/`.

## Commands

Local development (Ruby):

```bash
bundle install
bundle exec jekyll serve -l -H localhost --config _config.yml,_config.dev.yml
```

Serves on `http://localhost:4000` with live reload. **The `--config` overlay is not
optional.** `_includes/base_path` builds every asset URL from `site.url`, so without
`_config.dev.yml` overriding it a local server still loads CSS and JS from
https://ninanmm.github.io — you end up previewing the deployed stylesheet and none of your
local changes appear.

No Ruby on this machine? Docker works and is what the redesign was verified with:

```bash
docker build -t jekyll-site . && docker run --rm -v "$(pwd)":/usr/src/app jekyll-site bundle exec jekyll build --config _config.yml,_config.dev.yml
```

Note that `jekyll serve` rewrites `site.url` to its bind address, so serving from inside a
container yields `http://0.0.0.0:4000` asset URLs that a browser cannot resolve. Build with
the overlay and serve `_site/` statically instead. If `bundle install` fails, delete
`Gemfile.lock` (it is gitignored) and retry. On Debian/Ubuntu you may need
`sudo apt install ruby-dev ruby-bundler nodejs build-essential`.

Local development (Docker, avoids Ruby setup):

```bash
docker build -t jekyll-site . && docker run -p 4000:4000 --rm -v $(pwd):/usr/src/app jekyll-site
```

Rebuild the JS bundle after editing `assets/js/_main.js` or `assets/js/plugins/*`:

```bash
npm install && npm run build:js
```

`npm run build:js` uglifies jQuery + fitvids + magnific-popup + smooth-scroll +
`jquery.greedy-navigation.js` + `_main.js` into `assets/js/main.min.js`, which is the only
script `_includes/scripts.html` loads. **Editing `_main.js` alone has no effect** — the
minified bundle is committed and must be regenerated. `_config.yml` excludes `assets/js/_main.js`
and `assets/js/plugins/` from the build output.

There is no test suite and no linter.

## Deployment

There is **no `.github/workflows/` file** in this repo (`.github/` holds only issue
templates) — but GitHub Pages still builds via its own managed Actions pipeline
(`actions/jekyll-build-pages`, driven by the `github-pages` gem) on every push to
`master`, visible under the repo's Actions tab even with no workflow file checked in.
Consequences:

- Pushing to `master` publishes live. Treat it as a deploy.
- Only plugins in the `whitelist` in `_config.yml` run (jekyll-feed, jekyll-gist,
  jekyll-paginate, jekyll-sitemap, jemoji). Do not add a plugin expecting it to work.
- The `github-pages` gem in the `Gemfile` pins local versions to match Pages.

**A plain `bundle exec jekyll build` succeeding locally does NOT mean the GitHub Pages
build will succeed.** GitHub Pages actually runs `bundle exec github-pages build`, which
loads a much larger plugin set than `_config.yml`'s whitelist implies — in particular
`jekyll-optional-front-matter`, which makes Jekyll parse Liquid in **every** `.md` file in
the source, including root-level docs like `CLAUDE.md` and `DESIGN.md`, whether or not
they have front matter. A plain `jekyll build` does not load that plugin and stays silent.
This already broke a deploy once: `CLAUDE.md` documented this project's own Liquid syntax
in prose (`` `{% if page.talk_type %}` ``), and the unclosed example tag was a real Liquid
syntax error under `github-pages build`, taking the live site down to whatever the last
successful build was. Fixed by excluding every doc file that isn't meant to be a page
(`CLAUDE.md`, `DESIGN.md`, `READMEWeb.md`, `CONTRIBUTING.md`) from `_config.yml`'s
`exclude:` list — but the general rule stands: **before pushing to `master`, verify with
the actual command GitHub Pages runs**:

```bash
docker run --rm -v "$(pwd)":/usr/src/app jekyll-site \
  bundle exec github-pages build --source /usr/src/app --destination /usr/src/app/_site
```

not just `bundle exec jekyll build`. If you add a new root-level `.md`/`.markdown` file
that isn't meant to be a site page, add it to `exclude:` immediately — don't wait to find
out the hard way.

## Front-end architecture (added in the redesign)

`DESIGN.md` is the detailed reference. The essentials:

- `assets/css/main.scss` imports upstream partials, then `_sass/_tokens.scss` →
  `_sass/_theme-override.scss` → `_sass/_academic.scss`, **in that order**. Tokens are CSS
  custom properties; the override layer re-points upstream selectors at them, which is what
  makes light/dark work without forking Minimal Mistakes.
- Site behaviour lives in `assets/js/site.js`, `metrics.js`, `globe.js` — loaded as separate
  files from `_includes/scripts.html`, so editing them takes effect without `npm run build:js`.
- `_includes/head.html` carries an inline pre-paint script that applies the saved theme.
- `.reveal` is inverted: it hides nothing until `site.js` adds `.reveal-ready`. Never make
  content hidden-by-default again — a single script failure would blank the page.
- Watch out: `.greedy-nav button` in `_sass/_navigation.scss` outranks a bare
  `.theme-toggle` class. Selectors are written to work around it.

`IMPLEMENTATION_GUIDE.md` and `DESIGN_SHOWCASE.md` used to sit in the repo root describing a
dark-mode redesign that was never merged (commit `9040945` merged only those two markdown
files; the code is still on `origin/feature/dark-mode-modern-redesign`). They have been
deleted and replaced by `DESIGN.md`. If you see them referenced anywhere, that reference is
stale.

## Architecture

### Content collections

Configured in `_config.yml` under `collections` with `output: true` and
`permalink: /:collection/:path/`:

| Directory | URL | Layout (via `defaults`) |
|---|---|---|
| `_publications/` | `/publications/<permalink>` | `single` |
| `_talks/` | `/talks/<permalink>` | `talk` |
| `_teaching/` | `/teaching/<permalink>` | `single` |
| `_posts/` | `/:categories/:title/` | `single` |

`_portfolio/` is **deliberately disabled** — its collection block and its `defaults` block are
commented out in `_config.yml`, and the "Portfolio" nav entry is commented out in
`_data/navigation.yml`. `_pages/portfolio.html` still exists and renders an empty list.
Re-enabling means uncommenting all three.

Every collection's index is a hand-written page in `_pages/` that loops over the collection —
they are not generated. `_pages/publications.html`, `_pages/talks.html`, `_pages/teaching.html`.
`/teaching/` now renders the `_teaching` collection (it previously hardcoded a summary and
ignored the collection, so new files never appeared).

### The publication category system

`_pages/publications.html` groups publications by iterating `site.publication_category` from
`_config.yml` and, for each, filtering `site.publications` where `post.category` matches the
key. **A publication whose `category:` is not a key in `site.publication_category` renders
nowhere.** Current keys, in the order they render: `conferences`, `manuscripts` ("Journal Articles"),
`books` ("Book Chapters"), `preprints`. A duplicate unused `journals` key was removed.

Publications are rendered by `_includes/publication-card.html`, not the upstream
`archive-single.html`. See DESIGN.md for the full front-matter contract; the fields that
change what renders are `localpdf` (free PDF button), `paperurl`, `doi`, `github` (Code
button + badge), `slidesurl`, `award`, `dataset_note`, `abstract`, `summary`, `venue_short`
and `venue_type`.

PDFs live in `files/` and are served at `/files/<name>.pdf` (`files` is in the `include` list
in `_config.yml`). Seven of the nine papers have a free local copy linked via `localpdf`.

Every paper has an empty `github:` awaiting a repository URL; filling it in is all that is
needed to surface the Code button.

### Navigation, author sidebar, layouts

- Header links come only from `_data/navigation.yml` → `_includes/masthead.html`. Removing an
  entry hides the link but the page stays reachable.
- The left sidebar profile (avatar, bio, and every social/academic icon link) is driven entirely
  by the `author:` block in `_config.yml`, rendered by `_includes/author-profile.html`. A blank
  field means the icon is omitted. Pages opt in with `author_profile: true` (set for all pages
  and collections via `defaults`).
- `_layouts/default.html` is the shell (head, masthead, content, footer, scripts) and wraps
  everything in `_layouts/compress.html` for HTML minification. `single`, `archive`, `splash`,
  `talk`, `archive-taxonomy` all build on it.
- `_includes/head/custom.html` is the place for site-specific `<head>` additions; it currently
  loads academicons CSS and MathJax 3 from CDN. `_includes/footer/custom.html` holds the
  sitemap link.
- `_data/ui-text.yml` holds all UI strings keyed by locale (`en-US`).

### Styling

`assets/css/main.scss` imports the `_sass/` partials in order, then appends a block of
site-specific overrides at the bottom (light background `#f7f9fc`, blue link/heading accents,
carded `.archive__item`, gradient `.author__content`). Sass output is `compressed` per
`_config.yml`. `_sass/_variables.scss` holds the upstream template variables.

Page-level CSS is sometimes inlined in a `<style>` block in the page itself —
`_pages/cv.md` defines its whole `.cv-page` / `.cv-section` / `.cv-card` design that way.
`_pages/cv.md` is also the authoritative long-form CV (publications, talks, service,
co-advised students), duplicating some of `_pages/about.md`; both need updating together
when credentials change. `files/CV.pdf` is the downloadable version.

### Talk map

`/talkmap.html` iframes the pre-generated `talkmap/map.html`. It is regenerated by running
`talkmap.py` (or `talkmap.ipynb`) from inside `_talks/`, which geocodes each talk's `location:`
field via geopy/Nominatim and writes to `../talkmap/`. Requires `getorg` and `geopy`.
The link to it is hidden — `talkmap_link: false` in `_config.yml`.

### markdown_generator/

Optional helper scripts that convert `publications.tsv` / `talks.tsv` into collection markdown.
They are not part of the build. `publications.py` does **not** emit a `category:` field, so
anything it generates is invisible on `/publications/` until you add one (see above).

## Content conventions

- Publication filenames are `YYYY-MM-DD-<Descriptive Title>.md` and contain spaces and colons.
  Always quote these paths in shell commands.
- `future: true` in `_config.yml`, so dated-ahead content publishes. `_posts/2199-01-01-future-post.md`
  is upstream demo content that renders.
- Several `_pages/` and `_posts/` files are leftover template demos not linked from the nav
  (`markdown.md`, `archive-layout-with-content.md`, `non-menu-page.md`, `terms.md`,
  `collection-archive.html`, `page-archive.html`, `_posts/*blog-post-*.md`, `_portfolio/*`).
  They still appear on `/sitemap/`. Leave or delete deliberately, but know they are not the
  owner's content.
- Comments are disabled (`comments.provider` is blank). `_data/comments/` holds upstream
  Staticman demo data.
- Analytics are disabled (`analytics.provider: "false"`, no tracking id).

## Known dead things (still present)

- `assets/js/collapse.js` and `assets/css/collapse.css` are orphaned — nothing references them.
- `_layouts/talk.html` prints venue/location only `{% if page.talk_type %}`, but `_talks/*.md`
  set `type:`, not `talk_type:`. That line never renders. (`/talks/` itself does show venue and
  location; it builds them from the collection directly.)
- Several `_pages/` and `_posts/` files are leftover academicpages demos not linked from the
  nav (`markdown.md`, `archive-layout-with-content.md`, `non-menu-page.md`, `terms.md`,
  `collection-archive.html`, `page-archive.html`, `_posts/*blog-post-*.md`, `_portfolio/*`).
  They still appear on `/sitemap/`.
- `markdown_generator/publications.py` does not emit a `category:`, so anything it generates is
  invisible on `/publications/` until you add one. It also predates every field the new
  publication card uses.

Fixed during the redesign, for reference: the head no longer links favicons that do not exist
(the missing sizes were generated from `images/profile.png`), `images/manifest.json` no longer
says "Minimal Mistakes" or points at absent icons, a root `favicon.ico` answers the browser's
default probe, and `/teaching/` now renders the `_teaching` collection instead of a hardcoded
sentence that ignored it.

## Git

Remote branches: `master` (live), `SavePoint`, `feature/dark-mode-modern-redesign` (the
unmerged redesign described above). Commit and push only when asked — a push to `master`
is a live deploy.
