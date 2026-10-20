const { readFileSync } = require("node:fs");
const test = require("node:test");
const assert = require("node:assert/strict");

const { buildStandalone, markers } = require("../scripts/build-standalone.js");

test("the committed standalone build matches the modular source files", () => {
  const generated = buildStandalone({
    html: readFileSync("index.html", "utf8"),
    css: readFileSync("styles.css", "utf8"),
    javascript: readFileSync("script.js", "utf8")
  });

  assert.equal(generated, readFileSync("flexlab-standalone.html", "utf8"));
});

test("generation preserves JavaScript replacement tokens literally", () => {
  const html = `before ${markers.stylesheet} middle ${markers.script} after`;
  const css = "body::before { content: \"$& $` $\u0027 $$\"; }\n";
  const javascript = "const $$ = value => `$& ${value}`;\n";

  const generated = buildStandalone({ html, css, javascript });

  assert.ok(generated.includes(css));
  assert.ok(generated.includes(javascript));
});

test("generation rejects missing source markers", () => {
  for (const [html, message] of [
    [markers.script, /Stylesheet marker is missing/],
    [markers.stylesheet, /Script marker is missing/]
  ]) {
    assert.throws(() => buildStandalone({ html, css: "", javascript: "" }), message);
  }
});

test("generation rejects duplicate source markers", () => {
  for (const [html, message] of [
    [`${markers.stylesheet}\n${markers.stylesheet}\n${markers.script}`, /Stylesheet marker appears more than once/],
    [`${markers.stylesheet}\n${markers.script}\n${markers.script}`, /Script marker appears more than once/]
  ]) {
    assert.throws(() => buildStandalone({ html, css: "", javascript: "" }), message);
  }
});
