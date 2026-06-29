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

for (const skill of skills) {
  const { id, path: skillPath, entrypoint = "SKILL.md", support_files = [], aliases = [] } = skill;
  if (!/^[a-z0-9-]+$/.test(id)) fail(`${id}: id must be lowercase letters, digits, or hyphens`);
  if (ids.has(id)) fail(`${id}: duplicate registry id`);
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

  const openaiYaml = path.join(dir, "agents/openai.yaml");
  if (exists(openaiYaml) && !read(openaiYaml).includes(`$${id}`)) {
    fail(`${id}: agents/openai.yaml default_prompt should mention $${id}`);
  }

  if (!readme.includes(`[${id}](${skillPath}/)`)) fail(`${id}: README skill table is missing entry`);
}

for (const item of fs.readdirSync(root, { withFileTypes: true })) {
  if (!item.isDirectory() || item.name.startsWith(".") || item.name === "scripts") continue;
  if (exists(path.join(root, item.name, "SKILL.md")) && !ids.has(item.name)) {
    fail(`${item.name}: skill directory is missing from skills.registry.json`);
  }
}

if (!process.exitCode) console.log(`Validated ${skills.length} skill package${skills.length === 1 ? "" : "s"}.`);
