import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(testDir, "../..");
const rendererPath = path.join(repoDir, "refactor-writing/scripts/render-report.mjs");
const skillPath = path.join(repoDir, "refactor-writing/SKILL.md");
const fixtureDir = path.join(testDir, "fixtures");
const generatedFiles = [
  "artifact.css",
  "artifact.js",
  "design-system.html",
  "how-it-works.html",
  "report.html",
  "skill.html"
];
const pageFiles = [
  "report.html",
  "skill.html",
  "how-it-works.html",
  "design-system.html"
];

async function loadFixture(name) {
  return JSON.parse(await readFile(path.join(fixtureDir, name), "utf8"));
}

async function renderFixture(name, mutate = (value) => value, options = {}) {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-test-"));
  const inputPath = path.join(temporaryRoot, "invocation.json");
  const outputDir = options.outputDir ?? path.join(temporaryRoot, "artifact");
  const input = mutate(await loadFixture(name));
  await writeFile(inputPath, `${JSON.stringify(input, null, 2)}\n`, "utf8");

  const result = await execFileAsync(process.execPath, [
    rendererPath,
    "--input",
    inputPath,
    "--output",
    outputDir,
    "--skill",
    skillPath
  ]);

  return { ...result, input, outputDir, temporaryRoot };
}

async function expectRenderFailure(name, mutate, options = {}) {
  await assert.rejects(
    () => renderFixture(name, mutate, options),
    (error) => {
      assert.equal(error.code, 1);
      if (options.message) assert.match(error.stderr, options.message);
      return true;
    }
  );
}

function clone(value) {
  return structuredClone(value);
}

test("multi-finding invocation renders a complete portable artifact", async () => {
  const { outputDir, stdout } = await renderFixture("multi-finding.json");
  assert.deepEqual((await readdir(outputDir)).sort(), generatedFiles);
  assert.match(stdout, /Rendered 4 pages and 2 run-local assets/);
  assert.match(stdout, /Relative-link validation passed/);

  for (const file of pageFiles) {
    const html = await readFile(path.join(outputDir, file), "utf8");
    assert.match(html, /href="\.\/artifact\.css"/);
    assert.match(html, /src="\.\/artifact\.js"/);
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);

    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const link = match[1];
      if (link.startsWith("data:") || link.startsWith("#")) continue;
      assert.match(link, /^\.\/[^./][^/]*$/, `${file} link must be same-folder relative: ${link}`);
      assert.ok(generatedFiles.includes(link.slice(2)), `${file} link must resolve: ${link}`);
    }
  }

  const report = await readFile(path.join(outputDir, "report.html"), "utf8");
  assert.match(report, /without inventing approval&gt;\./);
  assert.match(report, /Questions &amp; exceptions/);
  assert.match(report, /<mark>send it when ready<\/mark>/);
  assert.match(report, /<mark>the release owner will publish it after approval<\/mark>/);
  assert.match(report, /<mark>soon<\/mark>/);
  assert.match(report, /<mark>by 15:00 UTC Thursday<\/mark>/);
  assert.equal((report.match(/<article class="finding reveal">/g) ?? []).length, 2);

  const skillSource = await readFile(skillPath, "utf8");
  const expectedHash = createHash("sha256").update(skillSource).digest("hex");
  const skillPage = await readFile(path.join(outputDir, "skill.html"), "utf8");
  assert.match(skillPage, new RegExp(`SHA-256: ${expectedHash}`));
  assert.ok(skillPage.includes(skillSource.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;")));
});

test("no-change invocation returns the complete unchanged source without findings", async () => {
  const { input, outputDir } = await renderFixture("no-change.json");
  const report = await readFile(path.join(outputDir, "report.html"), "utf8");
  assert.equal((report.match(/<article class="finding reveal">/g) ?? []).length, 0);
  assert.match(report, /No change recommended/);
  assert.ok(report.includes(input.finalOutput.content));
});

test("renderer rejects a missing required field", async () => {
  await expectRenderFailure(
    "multi-finding.json",
    (input) => {
      const changed = clone(input);
      delete changed.title;
      return changed;
    },
    { message: /input\.title must be a non-empty string/ }
  );
});

test("renderer rejects a final heading that conflicts with finding count", async () => {
  await expectRenderFailure(
    "no-change.json",
    (input) => {
      const changed = clone(input);
      changed.finalOutput.heading = "Complete proposed revision";
      return changed;
    },
    { message: /must be "No change recommended"/ }
  );
});

test("renderer rejects a changed-span target that is absent from its context", async () => {
  await expectRenderFailure(
    "multi-finding.json",
    (input) => {
      const changed = clone(input);
      changed.findings[0].original.target = "not present";
      return changed;
    },
    { message: /target must occur exactly/ }
  );
});

test("renderer rejects output inside the reviewed source workspace", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-source-"));
  const outputDir = path.join(temporaryRoot, "generated");
  await expectRenderFailure(
    "no-change.json",
    (input) => {
      const changed = clone(input);
      changed.sourceWorkspace = temporaryRoot;
      return changed;
    },
    {
      outputDir,
      message: /Output folder is inside sourceWorkspace/
    }
  );
});
