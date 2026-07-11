#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "skills.registry.json");
const read = (file) => fs.readFileSync(file, "utf8");
const exists = (file) => fs.existsSync(file);
const fail = (msg) => {
  console.error(`validate-skills: ${msg}`);
  process.exitCode = 1;
};

const registry = JSON.parse(read(registryPath));
const skills = Array.isArray(registry.skills) ? registry.skills : [];
const ids = new Set();
const readme = read(path.join(root, "README.md"));
const bannedCorePhrases = ["Claude folder", "Codex folder", "Claude skill", "Codex skill"];
const allowedSupportLevels = new Set(["portable", "host-adapted", "host-specific"]);

if (!skills.length) fail("skills.registry.json must list at least one skill");

function walkFiles(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === ".DS_Store") continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function checkMarkdownLinks(file) {
  const body = read(file);
  const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;
  for (const match of body.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith("#") || /^[a-z]+:/i.test(target)) continue;
    const cleanTarget = decodeURIComponent(target.split("#")[0]);
    if (!cleanTarget) continue;
    const resolved = path.resolve(path.dirname(file), cleanTarget);
    if (!exists(resolved)) {
      fail(`${path.relative(root, file)}: broken markdown link: ${target}`);
    }
  }
}

function markdownSection(body, title) {
  const marker = `## ${title}\n`;
  const start = body.indexOf(marker);
  if (start === -1) return "";
  const contentStart = start + marker.length;
  const nextHeading = body.slice(contentStart).search(/^## /m);
  return nextHeading === -1
    ? body.slice(contentStart)
    : body.slice(contentStart, contentStart + nextHeading);
}

function checkStoryboardStyleModules(id, dir, supportFiles, skillMd) {
  const modules = supportFiles
    .filter((file) => /^references\/style-[a-f]-.*\.md$/.test(file))
    .sort();
  const sectionMinimums = new Map([
    ["Non-negotiable signature", 7],
    ["Composition grammar", 5],
    ["Mark-making and material", 4],
    ["Color system", 5],
    ["Lettering and annotations", 4],
    ["Drift exclusions", 6],
    ["Style-specific QA gate", 8],
  ]);
  const promptLocks = new Set();

  if (modules.length !== 6) {
    fail(`${id}: expected six registered style modules`);
  }

  for (const letter of ["a", "b", "c", "d", "e", "f"]) {
    if (!modules.some((file) => file.startsWith(`references/style-${letter}-`))) {
      fail(`${id}: missing Style ${letter.toUpperCase()} module`);
    }
  }

  for (const file of modules) {
    const body = read(path.join(dir, file));
    for (const title of ["Contents", "Visual goal", ...sectionMinimums.keys(), "Prompt lock"]) {
      if (!markdownSection(body, title)) fail(`${file}: missing section: ${title}`);
    }
    for (const [title, minimum] of sectionMinimums) {
      const count = (markdownSection(body, title).match(/^- /gm) || []).length;
      if (count < minimum) fail(`${file}: ${title} needs at least ${minimum} concrete checks or rules`);
    }

    const promptBlock = markdownSection(body, "Prompt lock").match(/```text\n([\s\S]*?)\n```/)?.[1] || "";
    const promptWords = promptBlock.trim().split(/\s+/).filter(Boolean).length;
    const promptName = promptBlock.split("\n")[0];
    if (!promptName.startsWith("STYLE LOCK — ")) fail(`${file}: prompt lock needs a named STYLE LOCK block`);
    if (promptWords < 120) fail(`${file}: prompt lock is too thin to preserve visual fidelity`);
    if (promptLocks.has(promptName)) fail(`${file}: prompt lock name must be unique`);
    promptLocks.add(promptName);

    if (!skillMd.includes(`](${file})`)) fail(`${file}: orchestrator does not link this style module`);
  }

  if (!skillMd.includes("Copy the module's complete **Prompt lock**")) {
    fail(`${id}: orchestrator must require the complete module prompt lock`);
  }
}

for (const skill of skills) {
  const { id, path: skillPath, entrypoint = "SKILL.md", support_files = [], aliases = [] } = skill;
  if (!/^[a-z0-9-]+$/.test(id)) fail(`${id}: id must be lowercase letters, digits, or hyphens`);
  if (ids.has(id)) fail(`${id}: duplicate registry id`);
  if (skillPath !== id) fail(`${id}: path must match id for top-level skill packages`);
  if (!allowedSupportLevels.has(skill.support_level)) {
    fail(`${id}: support_level must be portable, host-adapted, or host-specific`);
  }
  ids.add(id);

  const dir = path.join(root, skillPath);
  const entry = path.join(dir, entrypoint);
  if (!exists(entry)) {
    fail(`${id}: missing ${skillPath}/${entrypoint}`);
    continue;
  }

  const skillMd = read(entry);
  const frontmatter = skillMd.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    fail(`${id}: missing YAML frontmatter`);
  } else {
    const name = frontmatter[1].match(/^name:\s*("?)([^"\n]+)\1\s*$/m)?.[2];
    const description = frontmatter[1].match(/^description:\s*(?:>-\s*)?([\s\S]*)/m)?.[0];
    if (name !== id) fail(`${id}: frontmatter name must match registry id`);
    if (!description || description.length < 80) fail(`${id}: description is too short for reliable triggering`);
  }

  for (const alias of aliases) {
    if (!skillMd.includes(alias)) fail(`${id}: alias ${alias} is missing from SKILL.md`);
  }

  for (const file of support_files) {
    if (!exists(path.join(dir, file))) fail(`${id}: listed support file is missing: ${file}`);
  }

  const registeredFiles = new Set([entrypoint, ...support_files]);
  for (const file of walkFiles(dir)) {
    const rel = path.relative(dir, file);
    if (!registeredFiles.has(rel)) fail(`${id}: support file is not listed in registry: ${rel}`);
  }

  if (skillMd.includes("## Load the selected style module")) {
    checkStoryboardStyleModules(id, dir, support_files, skillMd);
  }

  for (const file of [entrypoint, ...support_files].filter((name) => name.endsWith(".md"))) {
    const full = path.join(dir, file);
    if (!exists(full)) continue;
    const body = read(full);
    for (const phrase of bannedCorePhrases) {
      if (body.includes(phrase)) fail(`${id}: host-specific phrase in ${file}: ${phrase}`);
    }
    checkMarkdownLinks(full);
  }

  const openaiYaml = path.join(dir, "agents/openai.yaml");
  if (exists(openaiYaml) && !read(openaiYaml).includes(`$${id}`)) {
    fail(`${id}: agents/openai.yaml default_prompt should mention $${id}`);
  }

  if (!readme.includes(`[${id}](${skillPath}/)`)) fail(`${id}: README skill table is missing entry`);
}

for (const file of ["README.md", "NOTES.md"]) {
  if (exists(path.join(root, file))) checkMarkdownLinks(path.join(root, file));
}

for (const item of fs.readdirSync(root, { withFileTypes: true })) {
  if (!item.isDirectory() || item.name.startsWith(".") || item.name === "scripts") continue;
  if (exists(path.join(root, item.name, "SKILL.md")) && !ids.has(item.name)) {
    fail(`${item.name}: skill directory is missing from skills.registry.json`);
  }
}

if (!process.exitCode) console.log(`Validated ${skills.length} skill package${skills.length === 1 ? "" : "s"}.`);
