# FlexLab — Interactive Flexbox Visualizer

A zero-dependency, responsive Flexbox learning laboratory built with plain HTML, CSS, and JavaScript.

## Features

- Live controls for the core flex container properties
- Per-item controls for `order`, `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`, auto margins, and automatic minimum sizing
- Main-axis and cross-axis overlays
- Visual outlines for detected flex lines
- Actual rendered size measurements for every item
- Approximate pre-flex free-space calculations
- One-click presets for common patterns and edge cases
- Six interactive challenges with automatic checking
- Generated CSS and HTML that can be copied
- Responsive interface suitable for desktop and mobile

## Run it

- Fastest: open `flexlab-standalone.html`. It contains the HTML, CSS, and JavaScript in one file.
- Developer version: open `index.html` directly in a modern browser, or use a local server such as VS Code Live Server.

No package installation or build step is required to use either version.

## Validate changes

The regression tests use Node.js's built-in test runner and require Node.js 20 or newer. From the repository root, run:

```bash
npm run validate
```

The validation command first verifies that the standalone file is the exact generated form of `index.html`, `styles.css`, and `script.js`. It then checks every JavaScript source and runs the regression tests. The tests cover standalone generation, tab relationships, selected state, panel visibility, keyboard navigation, and clipboard feedback. Pull requests and updates to `main` run the same command in GitHub Actions.

## Files

- `flexlab-standalone.html` — complete one-file version
- `index.html` — semantic interface markup
- `styles.css` — complete responsive visual design
- `script.js` — state, measurements, presets, challenges, and code generation
- `scripts/build-standalone.js` — deterministic standalone generator and freshness check
- `scripts/check-syntax.js` — dependency-free syntax validation for every JavaScript source
- `test/accessibility.test.js` — interaction and accessibility regression tests for both implementations
- `test/standalone-build.test.js` — standalone generation and source-marker regression tests
- `preview.png` — desktop preview

## Contributing

Treat `index.html`, `styles.css`, and `script.js` as the source of truth. Do not hand-edit the inlined CSS or JavaScript in `flexlab-standalone.html`.

1. Make interface changes in the modular source files.
2. Run `npm run build:standalone` to regenerate the one-file build.
3. Update or add tests when changing an interaction, generator, or accessibility contract.
4. Run `npm run validate` and open both versions in a modern browser before submitting a pull request.

Changes should stay dependency-free and preserve the existing learning-tool scope. When changing a Flexbox explanation, confirm it against the standards references below.

## Core references used during design

- MDN: CSS flexible box layout
- MDN: Basic concepts of Flexbox
- MDN: Aligning items in a flex container
- W3C: CSS Flexible Box Layout Module Level 1
