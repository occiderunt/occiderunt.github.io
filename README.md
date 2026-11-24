# occiderunt.github.io

The personal home page for [Occiderunt](https://github.com/occiderunt): a student and
developer building local-first, peer-to-peer software.

Plain HTML, CSS, and a small script. No build step, no dependencies, no analytics,
no web fonts.

```
index.html     the page
styles.css     paper and ink, one vermilion accent
script.js      theme toggle, scroll reveals, sticky header
404.html       "this page fell"
assets/        screenshots, favicon, social image
scripts/       Playwright screenshot and QA passes
shots/         local QA output (not published)
```

## Preview

```
python3 -m http.server 8080
```

Then open http://localhost:8080.

## QA

```
node scripts/shot.mjs
```

Renders desktop and phone at 2x, walks the page so reveals and lazy images fire,
toggles night mode, and prints any console errors or horizontal overflow.

## Publish

The site is served from `main` at the repository root by GitHub Pages.
