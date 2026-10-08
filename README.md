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

The validation command checks JavaScript syntax in the modular build, the standalone inline script, and the test suite before running the regression tests. The tests verify tab relationships, selected state, panel visibility, and keyboard navigation in both implementations. Pull requests and updates to `main` run the same command in GitHub Actions.

## Files

- `flexlab-standalone.html` — complete one-file version
- `index.html` — semantic interface markup
- `styles.css` — complete responsive visual design
- `script.js` — state, measurements, presets, challenges, and code generation
- `test/accessibility.test.js` — dependency-free tab accessibility regression tests for both implementations
- `preview.png` — desktop preview

## Contributing

Keep the modular and standalone versions behaviorally equivalent:

1. Make interface changes in `index.html`, `styles.css`, and `script.js`.
2. Apply the equivalent markup, styles, and script changes to `flexlab-standalone.html`.
3. Update or add tests when changing an interaction or accessibility contract.
4. Run `npm run validate` and open both versions in a modern browser before submitting a pull request.

Changes should stay dependency-free and preserve the existing learning-tool scope. When changing a Flexbox explanation, confirm it against the standards references below.

## Core references used during design

- MDN: CSS flexible box layout
- MDN: Basic concepts of Flexbox
- MDN: Aligning items in a flex container
- W3C: CSS Flexible Box Layout Module Level 1
