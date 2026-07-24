#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rename,
  rm,
  writeFile
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.resolve(scriptDir, "../assets/report");
const ownedFiles = [
  "artifact.css",
  "artifact.js",
  "design-system.html",
  "report.html",
  "skill.html",
  "how-it-works.html"
];

const help = `Usage:
  node render-report.mjs --input invocation.json --output invocation-folder --skill SKILL.md [--allow-inside-source]

Input JSON:
{
  "title": "Short report title",
  "sourcePath": "/path/or/descriptive/source",
  "sourceWorkspace": "/optional/reviewed/workspace",
  "skillStatus": "Current and structurally valid; not installed",
  "verdict": "Direct evidence-based verdict",
  "scope": "What was reviewed",
  "protectedMeaning": ["Meaning that must survive"],
  "evidenceBoundaries": [{"label":"Reviewed source","detail":"What it established"}],
  "findings": [{
    "title": "Finding title",
    "original": {"text":"Exact original context","target":"exact target","occurrence":1},
    "proposal": {"text":"Exact proposed context","target":"exact target","occurrence":1},
    "evidence": "Traceable evidence basis",
    "changed": "What changed",
    "whyItMatters": "Why it matters",
    "whyBetter": "Why the proposal is better",
    "preserved": "What remains intact",
    "status": "Recommended — not applied"
  }],
  "finalOutput": {"heading":"Complete proposed revision","content":"Full copy-ready document"},
  "method": {"decisionSummary":"How candidates were tested","noChangeReason":"How the no-change branch was evaluated"},
  "redactions": ["Optional disclosed redaction"],
  "assumptions": ["Optional unresolved assumption"]
}

Use "No change recommended" as finalOutput.heading when findings is empty. The renderer rejects output inside sourceWorkspace unless --allow-inside-source is explicit.`;

function parseArgs(argv) {
  const args = { allowInsideSource: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--allow-inside-source") {
      args.allowInsideSource = true;
      continue;
    }
    if (["--input", "--output", "--skill"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      args[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  for (const key of ["input", "output", "skill"]) {
    if (!args[key]) throw new Error(`Missing --${key}`);
  }
  return args;
}

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function copyIcon(attributes = "") {
  return `<svg class="icon icon--sm"${attributes ? ` ${attributes}` : ""} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="12" height="12" rx="1"></rect><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"></path></svg>`;
}

function checkIcon(attributes = "") {
  return `<svg class="icon icon--sm"${attributes ? ` ${attributes}` : ""} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6"></path></svg>`;
}

function copyButton(label, target) {
  return `<button class="copy-button" type="button" data-copy-target="${target}">${copyIcon("data-copy-icon")}${checkIcon("data-check-icon hidden")} ${escapeHtml(label)}</button>`;
}

function requireString(object, key, context = "input") {
  if (typeof object?.[key] !== "string" || !object[key].trim()) {
    throw new Error(`${context}.${key} must be a non-empty string`);
  }
  return object[key];
}

function requireStringArray(value, context, allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new Error(`${context} must be ${allowEmpty ? "an" : "a non-empty"} array of non-empty strings`);
  }
  return value;
}

function highlightExact(entry, context) {
  const text = requireString(entry, "text", context);
  const target = requireString(entry, "target", context);
  const matches = [];
  let searchFrom = 0;
  while (searchFrom <= text.length - target.length) {
    const index = text.indexOf(target, searchFrom);
    if (index < 0) break;
    matches.push(index);
    searchFrom = index + target.length;
  }
  if (matches.length === 0) throw new Error(`${context}.target must occur exactly in ${context}.text`);

  const occurrence = entry.occurrence;
  const maximum = matches.length;
  if (
    (maximum > 1 && occurrence === undefined)
    || (occurrence !== undefined && (!Number.isInteger(occurrence) || occurrence < 1 || occurrence > maximum))
  ) {
    throw new Error(`${context}.target matched ${maximum} times; occurrence must be an integer from 1 through ${maximum}`);
  }

  const index = matches[(occurrence ?? 1) - 1];
  return `${escapeHtml(text.slice(0, index))}<mark>${escapeHtml(target)}</mark>${escapeHtml(text.slice(index + target.length))}`;
}

function inside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function validate(data) {
  for (const key of ["title", "sourcePath", "skillStatus", "verdict", "scope"]) requireString(data, key);
  requireStringArray(data.protectedMeaning, "input.protectedMeaning");
  if (!Array.isArray(data.evidenceBoundaries) || data.evidenceBoundaries.length === 0) throw new Error("input.evidenceBoundaries must be non-empty");
  data.evidenceBoundaries.forEach((item, index) => {
    requireString(item, "label", `input.evidenceBoundaries[${index}]`);
    requireString(item, "detail", `input.evidenceBoundaries[${index}]`);
  });
  if (!Array.isArray(data.findings)) throw new Error("input.findings must be an array");
  data.findings.forEach((finding, index) => {
    const context = `input.findings[${index}]`;
    for (const key of ["title", "evidence", "changed", "whyItMatters", "whyBetter", "preserved", "status"]) requireString(finding, key, context);
    highlightExact(finding.original, `${context}.original`);
    highlightExact(finding.proposal, `${context}.proposal`);
  });
  const expectedHeading = data.findings.length === 0 ? "No change recommended" : "Complete proposed revision";
  if (requireString(data.finalOutput, "heading", "input.finalOutput") !== expectedHeading) {
    throw new Error(`input.finalOutput.heading must be "${expectedHeading}" for this findings count`);
  }
  requireString(data.finalOutput, "content", "input.finalOutput");
  requireString(data.method, "decisionSummary", "input.method");
  requireString(data.method, "noChangeReason", "input.method");
  requireStringArray(data.redactions ?? [], "input.redactions", true);
  requireStringArray(data.assumptions ?? [], "input.assumptions", true);
}

async function lstatIfPresent(filePath) {
  try {
    return await lstat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function resolveEffectivePath(filePath) {
  const absolute = path.resolve(filePath);
  const direct = await lstatIfPresent(absolute);
  if (direct) {
    return {
      absolute,
      effective: await realpath(absolute),
      exists: true,
      stats: direct
    };
  }

  const suffix = [];
  let ancestor = absolute;
  let ancestorStats = null;
  while (!ancestorStats) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) throw new Error(`Unable to resolve an existing ancestor for ${absolute}`);
    suffix.unshift(path.basename(ancestor));
    ancestor = parent;
    ancestorStats = await lstatIfPresent(ancestor);
  }

  return {
    absolute,
    effective: path.join(await realpath(ancestor), ...suffix),
    exists: false,
    stats: null
  };
}

async function validateOutputBoundary(data, outputDir, allowInsideSource) {
  const output = await resolveEffectivePath(outputDir);
  if (output.exists && output.stats.isSymbolicLink()) {
    throw new Error("Output folder must not be a symbolic link");
  }
  if (output.exists && !output.stats.isDirectory()) {
    throw new Error("Output folder must be a directory or absent");
  }
  if (!data.sourceWorkspace || allowInsideSource) return;

  const sourcePath = path.resolve(data.sourceWorkspace);
  const sourceStats = await lstatIfPresent(sourcePath);
  if (!sourceStats) {
    if (inside(output.absolute, sourcePath)) {
      throw new Error("Output folder is inside sourceWorkspace; sourceWorkspace does not exist, so only lexical containment could be checked. Choose an external folder or pass --allow-inside-source after explicit user authorization");
    }
    return;
  }

  const effectiveSource = await realpath(sourcePath);
  if (inside(output.effective, effectiveSource)) {
    throw new Error("Output folder is inside sourceWorkspace after effective path resolution; choose an external folder or pass --allow-inside-source after explicit user authorization");
  }
}

async function assertOwnedDestinationsSafe(outputDir) {
  for (const name of ownedFiles) {
    const destination = path.join(outputDir, name);
    const stats = await lstatIfPresent(destination);
    if (stats && (!stats.isFile() || stats.isSymbolicLink())) {
      throw new Error(`Generated destination must be a regular file or absent: ${name}`);
    }
  }
}

function page({ title, current, brand, body }) {
  const nav = [["report.html", "Report", "report"], ["skill.html", "SKILL.md", "skill"], ["how-it-works.html", "How it works", "method"], ["design-system.html", "System", "system"]]
    .map(([href, label, key]) => `<a href="./${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const themes = ["dark", "mid", "light"].map((theme) => `<button class="theme-option" type="button" data-theme-option="${theme}" aria-pressed="${theme === "light"}">${theme[0].toUpperCase()}${theme.slice(1)}</button>`).join("");
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <link rel="icon" href="data:,">
  <title>${escapeHtml(title)}</title>
  <script>(()=>{let t="light";try{const s=localStorage.getItem("refactor-writing-theme");if(["dark","mid","light"].includes(s))t=s}catch{}document.documentElement.dataset.theme=t;document.documentElement.classList.replace("no-js","js")})()</script>
  <link rel="stylesheet" href="./artifact.css">
</head>
<body>
  <header class="topbar">
    <a class="brand" href="./report.html">${escapeHtml(brand)}</a>
    <nav aria-label="Artifact navigation">${nav}</nav>
    <div class="theme-switcher" role="group" aria-label="Color mode">${themes}</div>
  </header>
  ${body}
  <footer class="page-footer"><span>${escapeHtml(brand)}</span><span>Self-contained writing refactor artifact</span></footer>
  <script src="./artifact.js"></script>
</body>
</html>
`;
}

function list(items, emptyText) {
  const values = items?.length ? items : [emptyText];
  return `<div class="fact-list">${values.map((item) => `<div class="fact"><p>${escapeHtml(item)}</p></div>`).join("")}</div>`;
}

function renderReport(data) {
  const findings = data.findings.map((finding, index) => `<article class="finding reveal">
    <div class="finding-head"><span class="finding-index">Finding ${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(finding.title)}</h3></div>
    <div class="comparison">
      <article><h4>Original</h4><p>${highlightExact(finding.original, `finding ${index + 1} original`)}</p></article>
      <article><h4>Proposal</h4><p>${highlightExact(finding.proposal, `finding ${index + 1} proposal`)}</p></article>
    </div>
    <div class="proof-grid">
      <div><b>Evidence basis</b><p>${escapeHtml(finding.evidence)}</p></div>
      <div><b>What changed / why it matters</b><p>${escapeHtml(finding.changed)} ${escapeHtml(finding.whyItMatters)}</p></div>
      <div><b>Why better / meaning preserved</b><p>${escapeHtml(finding.whyBetter)} ${escapeHtml(finding.preserved)}</p></div>
    </div>
    <span class="finding-status">${escapeHtml(finding.status)}</span>
  </article>`).join("");

  const body = `<main>
    <header class="hero reveal is-visible">
      <span class="eyebrow">Writing refactor / ${data.findings.length ? "recommendations" : "no change"}</span>
      <h1>${escapeHtml(data.title)}</h1>
      <p>${escapeHtml(data.scope)}</p>
      <div class="meta-line"><span>${data.findings.length} retained finding${data.findings.length === 1 ? "" : "s"}</span><span>${escapeHtml(data.skillStatus)}</span><span>Source: ${escapeHtml(data.sourcePath)}</span></div>
    </header>
    <section class="verdict reveal"><div class="verdict-content"><span class="eyebrow">Verdict</span><h2>${escapeHtml(data.verdict)}</h2></div></section>
    <section class="section reveal"><div class="section-head"><span class="kicker">Protected meaning</span><div><h2>What the revision must keep intact</h2><p class="section-copy">These constraints were recorded before candidate changes were judged.</p></div></div>${list(data.protectedMeaning, "No protected meaning recorded")}</section>
    <section class="section" id="findings"><div class="section-head reveal"><span class="kicker">Evidence-backed changes</span><div><h2>${data.findings.length ? "Only consequential changes survived" : "No candidate change earned its cost"}</h2><p class="section-copy">Original and proposal remain adjacent; highlights identify only the targeted language.</p></div></div>${findings || '<p class="section-copy reveal">Every candidate was cosmetic, derivative, unsupported, or meaning-reducing.</p>'}</section>
    <section class="section reveal" id="final-output"><div class="section-head"><span class="kicker">Copy-ready output</span><div><h2>${escapeHtml(data.finalOutput.heading)}</h2><p class="section-copy">One clean document with no report annotations.</p></div></div>
      <div class="document-shell"><div class="document-toolbar"><span>${escapeHtml(data.finalOutput.heading)}</span><div class="copy-group"><span class="copy-status" aria-live="polite"></span>${copyButton("Copy document", "#finalCopy")}</div></div><noscript><p class="noscript-note">JavaScript is off. The complete document remains selectable below.</p></noscript><pre class="output-document" id="finalCopy" tabindex="0">${escapeHtml(data.finalOutput.content)}</pre></div>
    </section>
  </main>`;
  return page({ title: `${data.title} — Report`, current: "report", brand: data.title, body });
}

function renderSkill(data, skillSource, skillPath, skillHash) {
  const body = `<main>
    <header class="hero reveal is-visible"><span class="eyebrow">Exact active skill source</span><h1>SKILL.md used for this invocation</h1><p>The source is embedded without rewriting so the report can be traced to the exact operating instructions.</p><div class="meta-line"><span>Status: ${escapeHtml(data.skillStatus)}</span><span>Path: ${escapeHtml(skillPath)}</span><span>SHA-256: ${skillHash}</span></div></header>
    <section class="section reveal"><div class="document-shell"><div class="document-toolbar"><span>Exact SKILL.md</span><div class="copy-group"><span class="copy-status" aria-live="polite"></span>${copyButton("Copy SKILL.md", "#skillCopy")}</div></div><noscript><p class="noscript-note">JavaScript is off. The full skill source remains selectable below.</p></noscript><pre class="skill-document" id="skillCopy" tabindex="0">${escapeHtml(skillSource)}</pre></div><p class="source-note">Current, candidate, structurally valid, installed, and accepted describe different states. This page reports the status supplied for this invocation.</p></section>
  </main>`;
  return page({ title: `${data.title} — SKILL.md`, current: "skill", brand: data.title, body });
}

function renderMethod(data) {
  const boundaries = data.evidenceBoundaries.map((item) => `<div class="fact"><b>${escapeHtml(item.label)}</b><p>${escapeHtml(item.detail)}</p></div>`).join("");
  const redactions = list(data.redactions ?? [], "No redactions");
  const assumptions = list(data.assumptions ?? [], "No unresolved assumptions");
  const body = `<main>
    <header class="hero reveal is-visible"><span class="eyebrow">How this invocation worked</span><h1>Evidence boundaries before edits</h1><p>${escapeHtml(data.method.decisionSummary)}</p></header>
    <section class="section reveal"><div class="section-head"><span class="kicker">Evidence</span><div><h2>What each source established</h2><p class="section-copy">Evidence and inference remain visibly distinct.</p></div></div><div class="fact-list">${boundaries}</div></section>
    <section class="section"><div class="method-path">
      <article class="method-step reveal"><span class="finding-index">01 / Protect</span><div><h3>Record protected meaning</h3><p>Identify the job, audience, actions, facts, decision rights, uncertainty, tone, and constraints before proposing language changes.</p></div></article>
      <article class="method-step reveal"><span class="finding-index">02 / Test</span><div><h3>Require consequential value</h3><p>${escapeHtml(data.method.decisionSummary)}</p></div></article>
      <article class="method-step reveal"><span class="finding-index">03 / Stop</span><div><h3>Permit no change</h3><p>${escapeHtml(data.method.noChangeReason)}</p></div></article>
      <article class="method-step reveal"><span class="finding-index">04 / Deliver</span><div><h3>Return one complete document</h3><p>The report ends with copy-ready output, whether revised or unchanged, so no reconstruction is required.</p></div></article>
    </div></section>
    <section class="section reveal"><div class="section-head"><span class="kicker">Handling</span><div><h2>Redactions and assumptions</h2></div></div><h3>Redactions</h3>${redactions}<h3>Unresolved assumptions</h3>${assumptions}</section>
    <section class="section reveal"><div class="section-head"><span class="kicker">Artifact structure</span><div><h2>Four pages, four jobs</h2></div></div><div class="fact-list"><div class="fact"><b>Report</b><p>Verdict, comparisons, evidence, protected meaning, and complete output.</p></div><div class="fact"><b>SKILL.md</b><p>Exact active instructions, path, status, hash, and copy control.</p></div><div class="fact"><b>How it works</b><p>Decision process, evidence boundaries, no-change logic, redactions, and assumptions.</p></div><div class="fact"><b>System</b><p>Live tokens, layout primitives, components, states, Output Deviations, and implementation rules.</p></div></div></section>
  </main>`;
  return page({ title: `${data.title} — How it works`, current: "method", brand: data.title, body });
}

async function verifySystemSources() {
  const css = await readFile(path.join(assetDir, "artifact.css"), "utf8");
  const script = await readFile(path.join(assetDir, "artifact.js"), "utf8");
  const catalog = await readFile(path.join(assetDir, "design-system.html"), "utf8");
  const preview = await readFile(path.join(assetDir, "report.html"), "utf8");
  const requiredTokens = [
    "--paper", "--surface", "--ink", "--muted", "--line", "--line-strong",
    "--accent", "--accent-soft", "--success", "--mark", "--mark-ink", "--topbar",
    "--control-hover", "--focus", "--verdict-bg", "--verdict-ink", "--verdict-muted",
    "--verdict-signal-a", "--verdict-signal-b", "--verdict-signal-grid",
    "--hero-particle",
    "--editorial-grid", "--editorial-gap", "--motion-reveal-duration",
    "--motion-reveal-distance", "--motion-spotlight-duration",
    "--motion-particle-loop", "--motion-particle-fps", "--motion-verdict-loop",
    "--motion-verdict-micro-loop",
    "--spotlight-card-size"
  ];
  const requiredCatalogSections = [
    "foundations", "type", "layout", "iconography", "primitives",
    "motion-effects", "components", "patterns", "states", "deviations",
    "implementation", "qa"
  ];
  for (const token of requiredTokens) {
    if (!css.includes(`${token}:`)) throw new Error(`artifact.css is missing required system token ${token}`);
  }
  for (const id of requiredCatalogSections) {
    if (!catalog.includes(`id="${id}"`)) throw new Error(`design-system.html is missing required catalog section #${id}`);
  }
  for (const theme of ["dark", "mid", "light"]) {
    if (!catalog.includes(`data-theme-option="${theme}"`)) throw new Error(`design-system.html is missing the ${theme} theme control`);
  }
  if (!css.includes(".hero-particle-wave")) throw new Error("artifact.css is missing the procedural Hero particle field");
  if (css.includes("hero-dotted-wave.png")) throw new Error("artifact.css still references the retired Hero raster");
  for (const contract of [".verdict::before", ".verdict::after", "@keyframes verdict-signal-drift", "@keyframes verdict-micro-drift"]) {
    if (!css.includes(contract)) throw new Error(`artifact.css is missing revision 10 Verdict signal-field contract ${contract}`);
  }
  for (const contract of [".section > .pattern-grid", "container-type: inline-size", "@container (max-width: 440px)", "grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)"]) {
    if (!css.includes(contract)) throw new Error(`artifact.css is missing revision 10 Pattern layout contract ${contract}`);
  }
  for (const productionClass of ["hero", "section-head", "finding", "comparison", "proof-grid", "document-shell", "method-step", "verdict", "icon"]) {
    if (!catalog.includes(`class="${productionClass}`) && !catalog.includes(` ${productionClass}`)) {
      throw new Error(`design-system.html is missing production component .${productionClass}`);
    }
  }
  for (const contract of ["REVEAL_VIEWPORT_OFFSET", "PARTICLE_WAVE_COLUMNS", "startParticleMotion", "refactor-writing-theme", "storedTheme", "data-particle-wave", "data-replay-reveal", "data-replay-motion-tokens", "data-spotlight", "data-theme-option"]) {
    if (!script.includes(contract)) throw new Error(`artifact.js is missing revision 10 behavior ${contract}`);
  }
  for (const catalogContract of ["data-particle-wave-host", "data-replay-reveal", "data-replay-motion-tokens", "data-copy-icon", "RW-16", "catalog-index", "icon-card--blueprint", "motion-token-board", "material-verdict-sample", "Verdict signal field", "contract-summary", "page-layout-specimen", "Split-rail editorial section header", "primitive-grid catalog-wide"]) {
    if (!catalog.includes(catalogContract)) throw new Error(`design-system.html is missing revision 10 catalog contract ${catalogContract}`);
  }
  for (const kind of ["primitive", "component", "pattern"]) {
    if (!catalog.includes(`data-contract-kind="${kind}"`)) {
      throw new Error(`design-system.html is missing revision 10 ${kind} contracts`);
    }
  }
  for (const previewContract of ['./artifact.css', './artifact.js', 'aria-current="page"', 'class="verdict reveal"', 'class="finding reveal"', 'class="document-shell"', 'data-copy-icon']) {
    if (!preview.includes(previewContract)) throw new Error(`report.html preview is missing ${previewContract}`);
  }
  for (const legacyWaveMarker of ["verdict-wave", "verdict-wave-row"]) {
    if (catalog.includes(legacyWaveMarker) || preview.includes(legacyWaveMarker)) {
      throw new Error(`revision 10 must not ship retired Verdict wave markup: ${legacyWaveMarker}`);
    }
  }
}

async function verifyRelativeLinks(outputDir) {
  const files = ["report.html", "skill.html", "how-it-works.html", "design-system.html"];
  for (const file of files) {
    const html = await readFile(path.join(outputDir, file), "utf8");
    for (const legacyWaveMarker of ["verdict-wave", "verdict-wave-row"]) {
      if (html.includes(legacyWaveMarker)) throw new Error(`${file} contains retired Verdict wave markup: ${legacyWaveMarker}`);
    }
    const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const link of links) {
      if (link.startsWith("data:") || link.startsWith("#")) continue;
      if (!link.startsWith("./") || link.includes("..")) throw new Error(`${file} has non-local link: ${link}`);
    }
  }
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    console.error(help);
    process.exitCode = 1;
    return;
  }
  if (args.help) {
    console.log(help);
    return;
  }

  const inputPath = path.resolve(args.input);
  const outputDir = path.resolve(args.output);
  const skillPath = path.resolve(args.skill);
  const data = JSON.parse(await readFile(inputPath, "utf8"));
  const skillSource = await readFile(skillPath, "utf8");
  const skillHash = createHash("sha256").update(skillSource).digest("hex");
  validate(data);
  await validateOutputBoundary(data, outputDir, args.allowInsideSource);
  await verifySystemSources();

  await mkdir(outputDir, { recursive: true });
  await validateOutputBoundary(data, outputDir, args.allowInsideSource);
  await assertOwnedDestinationsSafe(outputDir);

  if (await lstatIfPresent(path.join(outputDir, "hero-dotted-wave.png"))) {
    console.warn("Renderer preserved unowned file hero-dotted-wave.png; it is no longer referenced by generated pages");
  }

  const stagingDir = await mkdtemp(path.join(
    path.dirname(outputDir),
    `.${path.basename(outputDir)}-staging-`
  ));
  try {
    await Promise.all([
      copyFile(path.join(assetDir, "artifact.css"), path.join(stagingDir, "artifact.css")),
      copyFile(path.join(assetDir, "artifact.js"), path.join(stagingDir, "artifact.js")),
      copyFile(path.join(assetDir, "design-system.html"), path.join(stagingDir, "design-system.html")),
      writeFile(path.join(stagingDir, "report.html"), renderReport(data), "utf8"),
      writeFile(path.join(stagingDir, "skill.html"), renderSkill(data, skillSource, skillPath, skillHash), "utf8"),
      writeFile(path.join(stagingDir, "how-it-works.html"), renderMethod(data), "utf8")
    ]);
    await verifyRelativeLinks(stagingDir);
    await assertOwnedDestinationsSafe(outputDir);
    for (const name of ownedFiles) {
      await rename(path.join(stagingDir, name), path.join(outputDir, name));
    }
  } finally {
    await rm(stagingDir, { recursive: true, force: true });
  }

  console.log(`Rendered 4 pages and 2 run-local assets to ${outputDir}`);
  console.log(`Embedded SKILL.md SHA-256 ${skillHash}`);
  console.log("Relative-link validation passed");
}

await main();
