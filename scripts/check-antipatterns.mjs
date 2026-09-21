import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const root = process.cwd();
const extensions = new Set([".css", ".html", ".js", ".mjs"]);
const rules = [
  ["unsafe-html-sink", /\b(?:innerHTML|outerHTML)\s*=|\binsertAdjacentHTML\s*\(|\bdocument\.write\s*\(/u, "String-to-DOM sinks are forbidden; construct nodes and use textContent."],
  ["dynamic-code", /\beval\s*\(|\bnew\s+Function\s*\(/u, "Dynamic code execution is forbidden."],
  ["inline-event-handler", /\son[a-z]+\s*=/iu, "Inline event attributes are forbidden; use addEventListener."],
  ["zoom-restriction", /\b(?:maximum-scale\s*=\s*1|user-scalable\s*=\s*no)\b/iu, "Viewport zoom restrictions are forbidden."],
  ["device-sniffing", /\bnavigator\.(?:userAgent|platform)\b/u, "UA/platform sniffing is forbidden."],
  ["js-layout-breakpoint", /\b(?:window\.)?(?:innerWidth|innerHeight)\b|\bscreen\.(?:width|height)\b/u, "JavaScript layout breakpoints are forbidden; use CSS/container queries."],
  ["mouse-touch-specific-handler", /addEventListener\(\s*["'](?:mouse(?:down|up|move|enter|leave)|touch(?:start|move|end|cancel))["']/u, "Mouse/touch-specific handlers are forbidden; use pointer events and keyboard semantics."],
  ["desktop-first-query", /@(?:media|container)[^{\n]*\bmax-width\s*:/iu, "Descending max-width queries are forbidden; use mobile-first ascending queries."],
  ["viewport-unit-trap", /\b100v[wh]\b/iu, "100vh/100vw are forbidden."],
  ["overflow-masking", /\boverflow(?:-[xy])?\s*:\s*(?:hidden|clip)\b/iu, "Overflow masking is forbidden as a layout repair."],
  ["transition-all", /\btransition\s*:\s*all\b/iu, "transition: all is forbidden."],
  ["important", /!important\b/iu, "!important is forbidden."],
  ["physical-horizontal-css", /\b(?:left|right|margin-left|margin-right|padding-left|padding-right|border-left|border-right)\s*:/iu, "Physical left/right CSS is forbidden; use logical properties."],
  ["ambient-nondeterminism", /\bMath\.random\s*\(|\bDate\.now\s*\(|\bnew\s+Date\s*\(/u, "Ambient time/randomness is forbidden in domain behavior."],
  ["broad-lint-suppression", /(?:eslint|stylelint)-disable\b|\bNOLINT(?:NEXTLINE|BEGIN|END)?\b/u, "Inline lint suppressions are forbidden."],
];

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collect(path));
    } else if (extensions.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

const violations = [];
for (const path of await collect(root)) {
  if (relative(root, path) === "scripts/check-antipatterns.mjs") {
    continue;
  }
  const source = await readFile(path, "utf8");
  const lines = source.split(/\r?\n/u);
  lines.forEach((line, index) => {
    for (const [name, pattern, message] of rules) {
      if (pattern.test(line)) {
        violations.push(`${relative(root, path)}:${index + 1}: ${name}: ${message}`);
      }
    }
  });
}

if (violations.length > 0) {
  process.stderr.write(`KeyboardArray anti-pattern violations:\n  ${violations.join("\n  ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("KeyboardArray anti-pattern policy: clean\n");
}
