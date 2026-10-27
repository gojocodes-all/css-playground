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

  test(`${name} copy feedback reflects the actual result`, () => {
    assert.match(script, /return document\.execCommand\("copy"\)/);
    assert.match(script, /copied = copyWithFallback\(text\)/);
    assert.match(script, /if \(copied\)/);
    assert.match(script, /selectCodeOutput\(\)/);
    assert.match(script, /Copy failed\. Code selected; use your browser's copy command\./);
  });

  test(`${name} honors the reduced-motion preference in application state`, () => {
    assert.match(html, /id="animateCheck"[^>]+aria-describedby="animateMotionHelp"/);
    assert.match(html, /id="animateMotionHelp"[^>]+hidden/);
    assert.match(script, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
    assert.match(script, /animate: !reducedMotionQuery\.matches/);
    assert.match(script, /state\.animate = !reducedMotionQuery\.matches/);
    assert.match(script, /animateCheck"\)\.disabled = reducedMotionQuery\.matches/);
    assert.match(script, /reducedMotionQuery\.addEventListener\("change", handleReducedMotionChange\)/);
  });
}

test("reduced-motion styles remove nonessential interface motion", () => {
  const styles = readFileSync("styles.css", "utf8");
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /scroll-behavior: auto/);
  assert.match(styles, /\.flex-stage\.animate \.flex-item[\s\S]+transition: none/);
  assert.match(styles, /\.live-pill span[\s\S]+animation: none/);
});
