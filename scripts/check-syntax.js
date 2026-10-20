const { readdirSync, readFileSync } = require("node:fs");
const { join } = require("node:path");
const { Script } = require("node:vm");

function checkJavaScript(source, filename) {
  new Script(source, { filename });
}

const sourcePaths = [
  "script.js",
  ...["scripts", "test"].flatMap(directory =>
    readdirSync(directory)
      .filter(name => name.endsWith(".js"))
      .sort()
      .map(name => join(directory, name))
  )
];

for (const path of sourcePaths) {
  checkJavaScript(readFileSync(path, "utf8"), path);
}

const standalonePath = "flexlab-standalone.html";
const standalone = readFileSync(standalonePath, "utf8");
const scripts = [...standalone.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];

if (scripts.length !== 1) {
  throw new Error(`${standalonePath} must contain exactly one inline script; found ${scripts.length}.`);
}

checkJavaScript(scripts[0][1], `${standalonePath}#inline-script`);
console.log(`JavaScript syntax is valid in ${sourcePaths.length} source files and the standalone build.`);
