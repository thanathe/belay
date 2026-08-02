#!/usr/bin/env node
/*
 * belay-skill installer
 *
 *   npx belay-skill              install/update into ~/.claude/skills/belay
 *   npx belay-skill --project    install into ./.claude/skills/belay (this project only)
 *   npx belay-skill --uninstall  remove it again
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const args = process.argv.slice(2);
const projectMode = args.includes('--project');
const uninstall = args.includes('--uninstall');

const baseDir = projectMode
  ? path.join(process.cwd(), '.claude', 'skills')
  : path.join(os.homedir(), '.claude', 'skills');
const target = path.join(baseDir, 'belay');
const where = projectMode ? 'this project' : 'all projects (user-level)';

if (uninstall) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('Removed ' + target);
  } else {
    console.log('Nothing to remove — ' + target + ' does not exist.');
  }
  process.exit(0);
}

// The skill files ship inside this npm package, next to bin/.
const pkgRoot = path.join(__dirname, '..');
const skillFile = path.join(pkgRoot, 'SKILL.md');
const refsDir = path.join(pkgRoot, 'references');

if (!fs.existsSync(skillFile) || !fs.existsSync(refsDir)) {
  console.error('Package looks broken (SKILL.md or references/ missing). Try again with:');
  console.error('  npx belay-skill@latest');
  process.exit(1);
}

const updating = fs.existsSync(target);
if (updating) fs.rmSync(target, { recursive: true, force: true });

fs.mkdirSync(target, { recursive: true });
fs.copyFileSync(skillFile, path.join(target, 'SKILL.md'));
fs.cpSync(refsDir, path.join(target, 'references'), { recursive: true });

console.log('');
console.log('  🧗 belay ' + (updating ? 'updated' : 'installed') + ' — for ' + where);
console.log('     ' + target);
console.log('');
console.log('  Next: restart Claude Code (or open a new session) and it is on.');
console.log('  Claude picks it up by itself on any coding task — nothing to configure.');
console.log('');
console.log('  Check:      ask Claude  "what skills do you have?"');
console.log('  Uninstall:  npx belay-skill --uninstall' + (projectMode ? ' --project' : ''));
console.log('');
console.log('  "On belay?" — "Belay on." — "Climbing."');
console.log('');
