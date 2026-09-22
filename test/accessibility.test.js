const { readFileSync } = require("node:fs");
const test = require("node:test");
const assert = require("node:assert/strict");

const implementations = [
  ["modular", readFileSync("index.html", "utf8"), readFileSync("script.js", "utf8")],
  ["standalone", readFileSync("flexlab-standalone.html", "utf8"), readFileSync("flexlab-standalone.html", "utf8")]
];

for (const [name, html, script] of implementations) {
  test(`${name} tabs expose accessible relationships`, () => {
    assert.match(html, /role="tablist"/);
    assert.equal((html.match(/role="tab"/g) || []).length, 4);
    assert.equal((html.match(/role="tabpanel"/g) || []).length, 4);

    for (const section of ["container", "item", "challenges", "guide"]) {
      assert.match(html, new RegExp(`id="${section}Tab"[^>]+aria-controls="${section}Panel"`));
      assert.match(html, new RegExp(`id="${section}Panel"[^>]+aria-labelledby="${section}Tab"`));
    }
  });

  test(`${name} tabs support standard keyboard navigation`, () => {
    for (const key of ["ArrowLeft", "ArrowRight", "Home", "End"]) {
      assert.match(script, new RegExp(`event\\.key.{0,80}${key}|${key}.{0,80}event\\.key`, "s"));
    }
    assert.match(script, /button\.setAttribute\("aria-selected", String\(isActive\)\)/);
    assert.match(script, /panel\.hidden = !isActive/);
    assert.match(script, /activateTab\(tabs\[nextIndex\], true\)/);
  });
}
