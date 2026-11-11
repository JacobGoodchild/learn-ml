// Run with: node tests/content.test.mjs
// Lints all content: links resolve, entry points exist, every non-floor concept has a check and recall questions.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { splitFile, parseBody, collectPieces } from '../js/content.js';

let failed = 0, warned = 0;
const fail = m => { console.log('FAIL  ' + m); failed++; };
const warn = m => { console.log('note  ' + m); warned++; };
const root = new URL('..', import.meta.url).pathname;
const planned = readFileSync(root + 'docs/concept-map.md', 'utf8');

const nodes = new Map();
for (const cid of JSON.parse(readFileSync(root + 'content/courses.json', 'utf8'))) {
  const course = JSON.parse(readFileSync(`${root}content/courses/${cid}/course.json`, 'utf8'));
  for (const s of course.slides) {
    const f = `${root}content/courses/${cid}/slides/${s}.md`;
    if (!existsSync(f)) { fail(`slide file missing: ${s}`); continue; }
    nodes.set(s, { file: f, kind: 'slide' });
  }
  for (const c of course.concepts) {
    const f = `${root}content/concepts/${c}.md`;
    if (!existsSync(f)) fail(`concept listed in ${cid} but file missing: ${c}`);
    else nodes.set(c, { file: f, kind: 'concept' });
  }
  for (const f of readdirSync(root + 'content/concepts')) {
    const id = f.replace(/\.md$/, '');
    if (!course.concepts.includes(id)) warn(`concept file not listed in any course yet: ${id}`);
  }
}

for (const [id, n] of nodes) {
  const { meta, body } = splitFile(readFileSync(n.file, 'utf8'));
  const blocks = parseBody(body);
  if (meta.id !== id) fail(`${id}: front-matter id is "${meta.id}"`);
  if (!meta.title || !meta.summary) fail(`${id}: needs a title and a summary`);
  const refs = new Set([...collectPieces(blocks), ...(meta.needs || []), ...(meta.related || [])]);
  for (const r of refs) {
    if (r === id && n.kind === 'concept') continue;
    if (!nodes.has(r)) (planned.includes(`| ${r} |`) ? warn : fail)(`${id}: links to "${r}", which is ${planned.includes(`| ${r} |`) ? 'planned but not written' : 'not in the concept map'}`);
  }
  const headings = new Set(blocks.filter(b => b.type === 'heading').map(b => b.id));
  for (const e of meta.entryPoints || []) if (!headings.has(e.section)) fail(`${id}: entry point "${e.label}" points at missing section #${e.section}`);
  if (n.kind === 'concept' && meta.level !== 0) {
    const checks = blocks.filter(b => b.type === 'check').flatMap(b => b.questions);
    const recall = blocks.filter(b => b.type === 'recall').flatMap(b => b.questions);
    if (checks.length < 2) fail(`${id}: needs at least 2 quick-check questions (has ${checks.length})`);
    if (recall.length < 2) fail(`${id}: needs at least 2 recall questions (has ${recall.length})`);
    checks.forEach((q, i) => {
      if (q.options.length && q.options.filter(o => o.correct).length !== 1) fail(`${id}: check ${i + 1} needs exactly one right option`);
      if (!q.options.length && q.value === undefined) fail(`${id}: check ${i + 1} has neither options nor a numeric answer`);
      if (!q.answer) fail(`${id}: check ${i + 1} has no worked answer`);
      q.options.forEach(o => { if (!o.why) fail(`${id}: check ${i + 1} option "${o.text}" has no explanation`); });
    });
    if (!(meta.needs || []).length) fail(`${id}: a non-floor concept should need something`);
  }
  for (const v of blocks.filter(b => b.type === 'visual')) if (!/^[\w-]+$/.test(v.name)) fail(`${id}: bad visual name`);
}
console.log(`\n${nodes.size} files checked. ${failed ? failed + ' problem(s)' : 'No problems'}${warned ? `, ${warned} note(s)` : ''}.`);
process.exit(failed ? 1 : 0);
