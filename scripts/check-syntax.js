const { readFileSync } = require("node:fs");
const { Script } = require("node:vm");

function checkJavaScript(source, filename) {
  new Script(source, { filename });
}

for (const path of ["script.js", "test/accessibility.test.js"]) {
  checkJavaScript(readFileSync(path, "utf8"), path);
}

const standalonePath = "flexlab-standalone.html";
const standalone = readFileSync(standalonePath, "utf8");
const scripts = [...standalone.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];

if (scripts.length !== 1) {
  throw new Error(`${standalonePath} must contain exactly one inline script; found ${scripts.length}.`);
}

checkJavaScript(scripts[0][1], `${standalonePath}#inline-script`);
console.log("JavaScript syntax is valid in both FlexLab builds and the test suite.");
