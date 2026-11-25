// Gradatim's entry for OpenCode, so that the host finds the plugin's skills with nothing for the
// user to link or add to their config. OpenCode 1.x runs the plugin function exported by name,
// whose config hook points skills.paths at skills/. OpenCode 2.x runs the default export's setup(),
// which hands each skill to the host through ctx.skill.transform.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'skills');

// A SKILL.md's frontmatter as its top-level `key: value` pairs, and the text after it. A line that
// isn't a new key continues the key above it, as a folded description does, and quotes around a
// whole value are dropped. That is all name and description need: this is not a YAML parser.
function parseSkillFile(text) {
  const lines = text.split(/\r?\n/);
  const close = lines[0] === '---' ? lines.indexOf('---', 1) : -1;
  if (close < 0) return { meta: {}, body: text };
  const meta = {};
  let key = null;
  for (const line of lines.slice(1, close)) {
    const pair = /^([^\s:][^:]*):(.*)$/.exec(line);
    if (pair) {
      key = pair[1].trim();
      const value = pair[2].trim();
      meta[key] = /^[|>][+-]?$/.test(value) ? '' : value;
    } else if (key !== null && line.trim() !== '') {
      meta[key] = meta[key] ? `${meta[key]} ${line.trim()}` : line.trim();
    }
  }
  for (const [name, value] of Object.entries(meta)) {
    const quoted = /^(["'])([\s\S]*)\1$/.exec(value);
    if (quoted) meta[name] = quoted[2];
  }
  return { meta, body: lines.slice(close + 1).join('\n') };
}

// Each skills/<folder>/SKILL.md, shaped as OpenCode 2.x's Skill.Info.
function listSkills() {
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((folder) => folder.isDirectory() && !folder.name.startsWith('.'))
    .map((folder) => join(skillsRoot, folder.name, 'SKILL.md'))
    .filter((file) => existsSync(file))
    .map((file) => {
      const id = basename(dirname(file));
      const { meta, body } = parseSkillFile(readFileSync(file, 'utf8'));
      const skill = { id, name: meta.name || id, path: file, content: body };
      if (meta.description) skill.description = meta.description;
      return skill;
    });
}

// OpenCode 1.x runs every function this module exports by name as a plugin, so this is the only one.
export const GradatimPlugin = async () => ({
  async config(config) {
    if (Array.isArray(config.skills)) return; // 2.x keeps a list here, which setup() fills
    const skills = (config.skills ??= {});
    const paths = (skills.paths ??= []);
    if (!paths.includes(skillsRoot)) paths.push(skillsRoot);
  },
});

// OpenCode 2.x: draft.add() throws on a skill that doesn't fit the host's schema, and a throw out of
// the transform turns the whole plugin off; so a skill that doesn't fit is logged and left out.
async function setup(ctx) {
  if (typeof ctx?.skill?.transform !== 'function') return; // 1.x calls setup() as well, with no skill domain
  const skills = listSkills();
  await ctx.skill.transform((draft) => {
    for (const skill of skills) {
      try {
        draft.add(skill);
      } catch (err) {
        console.error(`[gradatim] OpenCode refused the skill "${skill.id}":`, err);
      }
    }
  });
}

export default { id: 'gradatim', server: GradatimPlugin, setup };
