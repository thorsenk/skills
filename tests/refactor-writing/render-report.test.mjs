import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, symlink, writeFile } from "node:fs/promises";
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

test("renderer rejects an output directory that is a symbolic link", async (context) => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-symlink-"));
  const targetDir = path.join(temporaryRoot, "target");
  const outputDir = path.join(temporaryRoot, "artifact-link");
  await mkdir(targetDir);
  try {
    await symlink(targetDir, outputDir, "dir");
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      context.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  await expectRenderFailure(
    "no-change.json",
    (input) => input,
    {
      outputDir,
      message: /Output folder must not be a symbolic link/
    }
  );
});

test("renderer rejects a generated destination that is a symbolic link", async (context) => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-destination-"));
  const outputDir = path.join(temporaryRoot, "artifact");
  const targetFile = path.join(temporaryRoot, "outside-report.html");
  await mkdir(outputDir);
  await writeFile(targetFile, "must remain unchanged", "utf8");
  try {
    await symlink(targetFile, path.join(outputDir, "report.html"), "file");
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      context.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  await expectRenderFailure(
    "no-change.json",
    (input) => input,
    {
      outputDir,
      message: /Generated destination must be a regular file or absent/
    }
  );
  assert.equal(await readFile(targetFile, "utf8"), "must remain unchanged");
});

test("renderer resolves a symlinked output ancestor before source containment", async (context) => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-effective-"));
  const sourceWorkspace = path.join(temporaryRoot, "reviewed-source");
  const outputAlias = path.join(temporaryRoot, "output-alias");
  await mkdir(sourceWorkspace);
  try {
    await symlink(sourceWorkspace, outputAlias, "dir");
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      context.skip(`symbolic links are unavailable: ${error.code}`);
      return;
    }
    throw error;
  }

  await expectRenderFailure(
    "no-change.json",
    (input) => {
      const changed = clone(input);
      changed.sourceWorkspace = sourceWorkspace;
      return changed;
    },
    {
      outputDir: path.join(outputAlias, "generated"),
      message: /inside sourceWorkspace after effective path resolution/
    }
  );
});

test("renderer preserves an unrelated retired raster in an existing output folder", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-retired-"));
  const outputDir = path.join(temporaryRoot, "artifact");
  const rasterPath = path.join(outputDir, "hero-dotted-wave.png");
  await mkdir(outputDir);
  await writeFile(rasterPath, "unowned reference", "utf8");

  const { stderr } = await renderFixture("no-change.json", (input) => input, { outputDir });
  assert.equal(await readFile(rasterPath, "utf8"), "unowned reference");
  assert.match(stderr, /preserved unowned file hero-dotted-wave\.png/);
});

test("renderer leaves prior output unchanged when input validation fails", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "refactor-writing-prior-"));
  const outputDir = path.join(temporaryRoot, "artifact");
  const reportPath = path.join(outputDir, "report.html");
  await mkdir(outputDir);
  await writeFile(reportPath, "previous complete report", "utf8");

  await expectRenderFailure(
    "no-change.json",
    (input) => {
      const changed = clone(input);
      changed.finalOutput.heading = "Complete proposed revision";
      return changed;
    },
    {
      outputDir,
      message: /must be "No change recommended"/
    }
  );
  assert.equal(await readFile(reportPath, "utf8"), "previous complete report");
});

function withRepeatedOriginal(input, occurrence) {
  const changed = clone(input);
  changed.findings[0].original = {
    text: "<first> term & <second> term",
    target: "term"
  };
  if (occurrence !== undefined) changed.findings[0].original.occurrence = occurrence;
  return changed;
}

test("renderer requires occurrence when a changed-span target repeats", async () => {
  await expectRenderFailure(
    "multi-finding.json",
    (input) => withRepeatedOriginal(input),
    {
      message: /input\.findings\[0\]\.original\.target matched 2 times; occurrence must be an integer from 1 through 2/
    }
  );
});

test("renderer marks the selected one-based target occurrence", async () => {
  const first = await renderFixture(
    "multi-finding.json",
    (input) => withRepeatedOriginal(input, 1)
  );
  const firstReport = await readFile(path.join(first.outputDir, "report.html"), "utf8");
  assert.match(firstReport, /&lt;first&gt; <mark>term<\/mark> &amp; &lt;second&gt; term/);

  const second = await renderFixture(
    "multi-finding.json",
    (input) => withRepeatedOriginal(input, 2)
  );
  const secondReport = await readFile(path.join(second.outputDir, "report.html"), "utf8");
  assert.match(secondReport, /&lt;first&gt; term &amp; &lt;second&gt; <mark>term<\/mark>/);
});

test("renderer rejects invalid or out-of-range target occurrences", async (context) => {
  for (const occurrence of [0, -1, 1.5, "2", 3]) {
    await context.test(`occurrence ${JSON.stringify(occurrence)}`, async () => {
      await expectRenderFailure(
        "multi-finding.json",
        (input) => withRepeatedOriginal(input, occurrence),
        {
          message: /occurrence must be an integer from 1 through 2/
        }
      );
    });
  }
});

test("renderer accepts occurrence 1 for a unique changed-span target", async () => {
  const { outputDir } = await renderFixture(
    "multi-finding.json",
    (input) => {
      const changed = clone(input);
      changed.findings[0].original.occurrence = 1;
      return changed;
    }
  );
  const report = await readFile(path.join(outputDir, "report.html"), "utf8");
  assert.match(report, /<mark>send it when ready<\/mark>/);
});

test("production reveal is one-shot at the lower viewport boundary", async () => {
  const runtime = await readFile(
    path.join(repoDir, "refactor-writing/assets/report/artifact.js"),
    "utf8"
  );
  const specification = await readFile(
    path.join(repoDir, "refactor-writing/references/report-design-system.md"),
    "utf8"
  );

  assert.match(runtime, /observer\?\.unobserve\(entry\.target\)/);
  assert.match(runtime, /rootMargin: `0px 0px -\$\{REVEAL_VIEWPORT_OFFSET \* 100\}% 0px`/);
  assert.match(specification, /reveals once/i);
  assert.match(specification, /remains visible after\s+leaving the viewport/i);
});

test("catalog entries expose complete primitive, component, and pattern contracts", async () => {
  const catalog = await readFile(
    path.join(repoDir, "refactor-writing/assets/report/design-system.html"),
    "utf8"
  );
  const css = await readFile(
    path.join(repoDir, "refactor-writing/assets/report/artifact.css"),
    "utf8"
  );
  const renderer = await readFile(rendererPath, "utf8");
  const requiredLabels = {
    primitive: [
      "Selector",
      "Tokens",
      "States",
      "Responsive",
      "Accessibility",
      "Fallback",
      "Valid",
      "Invalid"
    ],
    component: [
      "Profile",
      "Selector",
      "Purpose",
      "Anatomy",
      "Tokens",
      "Variants / states",
      "Responsive",
      "Accessibility",
      "Fallbacks",
      "Valid",
      "Invalid"
    ],
    pattern: [
      "Problem",
      "Sequence",
      "Variation",
      "Responsive",
      "Accessibility / resilience",
      "Invalid"
    ]
  };
  const expectedCounts = { primitive: 8, component: 9, pattern: 6 };
  const foundCounts = { primitive: 0, component: 0, pattern: 0 };
  const contractPattern = /<article\b([^>]*data-contract-kind="(primitive|component|pattern)"[^>]*)>([\s\S]*?)<\/article>/g;

  for (const match of catalog.matchAll(contractPattern)) {
    const [, attributes, kind, body] = match;
    foundCounts[kind] += 1;
    const labels = [...body.matchAll(/<dt>([^<]+)<\/dt>/g)].map((entry) => entry[1].trim());
    for (const label of requiredLabels[kind]) {
      assert.ok(labels.includes(label), `${kind} contract is missing ${label}`);
    }

    if (kind !== "pattern") {
      const selector = attributes.match(/data-selector="([^"]+)"/)?.[1];
      assert.ok(selector, `${kind} contract must expose data-selector`);
      for (const candidate of selector.split(",").map((value) => value.trim())) {
        if (candidate.startsWith(".")) {
          assert.ok(
            css.includes(candidate) || renderer.includes(candidate),
            `${kind} selector is not implemented: ${candidate}`
          );
        } else {
          assert.ok(
            new RegExp(`<${candidate}(?:\\s|>)`).test(renderer) || css.includes(`${candidate} {`),
            `${kind} element selector is not implemented: ${candidate}`
          );
        }
      }
    }

    if (kind === "component") {
      assert.doesNotMatch(
        body,
        /\b(?:loading|disabled|menu|tooltip|disclosure|form[- ]field)\b/i,
        "component contract must not claim an unsupported state"
      );
    }
  }

  assert.deepEqual(foundCounts, expectedCounts);
});

test("spotlight instrument presents unchanged production values as radii", async () => {
  const catalog = await readFile(
    path.join(repoDir, "refactor-writing/assets/report/design-system.html"),
    "utf8"
  );
  const css = await readFile(
    path.join(repoDir, "refactor-writing/assets/report/artifact.css"),
    "utf8"
  );

  assert.match(catalog, /spotlight radii/i);
  assert.match(catalog, /220px radius/);
  assert.match(catalog, /120px radius/);
  assert.doesNotMatch(catalog, /spotlight diameters?/i);
  assert.match(css, /--spotlight-card-size:\s*220px/);
  assert.match(css, /--spotlight-control-size:\s*120px/);
  assert.match(css, /--spotlight-size:\s*var\(--spotlight-card-size\)/);
  assert.match(css, /--spotlight-size:\s*var\(--spotlight-control-size\)/);
});
