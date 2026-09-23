import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import process from "node:process";

const root = new URL("../", import.meta.url);
const checkedRoots = ["src", "e2e"];
const checkedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".html"]);
const forbidden = [
  [/@ts-ignore\b/u, "@ts-ignore is forbidden; fix or encode the type invariant."],
  [/@ts-expect-error\b/u, "@ts-expect-error is forbidden; model the boundary explicitly."],
  [/@ts-nocheck\b/u, "@ts-nocheck is forbidden."],
  [/biome-ignore\b/u, "Biome suppression comments are forbidden."],
  [/eslint-disable\b/u, "ESLint suppression comments are forbidden."],
  [/prettier-ignore\b/u, "Formatter suppression comments are forbidden."],
];

const filesUnder = async (path) => {
  const entries = await readdir(new URL(`${path}/`, root), { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const child = join(path, entry.name);
      if (entry.isDirectory()) {
        return filesUnder(child);
      }
      if (checkedExtensions.has(extname(entry.name))) {
        return [child];
      }
      return [];
    }),
  );
  return nested.flat();
};

const paths = (await Promise.all(checkedRoots.map(filesUnder))).flat();
const sources = await Promise.all(
  paths.map(async (path) => ({
    path,
    source: await readFile(new URL(path, root), "utf8"),
  })),
);

const violations = [];
for (const { path, source } of sources) {
  for (const [index, line] of source.split("\n").entries()) {
    for (const [pattern, message] of forbidden) {
      if (pattern.test(line)) {
        violations.push(`${relative(".", path)}:${index + 1}: ${message}`);
      }
    }
  }
}

const packageJson = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
for (const group of ["dependencies", "devDependencies", "optionalDependencies"]) {
  for (const [name, version] of Object.entries(packageJson[group] ?? {})) {
    if (/^(?:\^|~|>|<|=|\*|latest$|next$)/u.test(version)) {
      violations.push(
        `package.json: ${group}.${name} must use an exact reproducible version, got "${version}"`,
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `Repository anti-pattern policy violations:\n${violations.map((violation) => `  ${violation}`).join("\n")}\n`,
  );
  process.exitCode = 1;
} else {
  process.stdout.write("Repository anti-pattern policy: clean\n");
}
