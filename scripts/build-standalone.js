const { readFileSync, writeFileSync } = require("node:fs");

const paths = Object.freeze({
  html: "index.html",
  css: "styles.css",
  javascript: "script.js",
  standalone: "flexlab-standalone.html"
});

const markers = Object.freeze({
  stylesheet: '<link rel="stylesheet" href="styles.css" />',
  script: '<script src="script.js"></script>'
});

function replaceExactlyOnce(source, marker, replacement, label) {
  const firstIndex = source.indexOf(marker);
  if (firstIndex === -1) {
    throw new Error(`${label} marker is missing from ${paths.html}.`);
  }
  if (source.indexOf(marker, firstIndex + marker.length) !== -1) {
    throw new Error(`${label} marker appears more than once in ${paths.html}.`);
  }
  return `${source.slice(0, firstIndex)}${replacement}${source.slice(firstIndex + marker.length)}`;
}

function buildStandalone({ html, css, javascript }) {
  const withStyles = replaceExactlyOnce(
    html,
    markers.stylesheet,
    `<style>\n${css}\n  </style>`,
    "Stylesheet"
  );
  return replaceExactlyOnce(
    withStyles,
    markers.script,
    `<script>\n${javascript}\n  </script>`,
    "Script"
  );
}

function readSources() {
  return {
    html: readFileSync(paths.html, "utf8"),
    css: readFileSync(paths.css, "utf8"),
    javascript: readFileSync(paths.javascript, "utf8")
  };
}

function main(args = process.argv.slice(2)) {
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) {
    throw new Error("Usage: node scripts/build-standalone.js [--check]");
  }

  const generated = buildStandalone(readSources());
  if (args[0] === "--check") {
    const current = readFileSync(paths.standalone, "utf8");
    if (current !== generated) {
      throw new Error(`${paths.standalone} is stale. Run npm run build:standalone and commit the result.`);
    }
    console.log(`${paths.standalone} matches the modular source files.`);
    return;
  }

  writeFileSync(paths.standalone, generated);
  console.log(`Generated ${paths.standalone} from the modular source files.`);
}

if (require.main === module) {
  main();
}

module.exports = { buildStandalone, markers, replaceExactlyOnce };
