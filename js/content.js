// Content loading and parsing. Format documented in docs/content-format.md.
// No build step: every node file is fetched and parsed in the browser.

const cache = new Map();

async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return res.text();
}

// ---------- Front-matter (small YAML subset) ----------
// Supports:  key: value | key: [a, b] | key: (newline) - scalar | - k: v (+ indented k: v lines)
function scalar(v) {
  v = v.trim();
  if (v === '') return '';
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    return inner ? inner.split(',').map(s => scalar(s)) : [];
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

export function parseFrontMatter(text) {
  const out = {};
  const lines = text.split('\n');
  let key = null, list = null, item = null;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const top = raw.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (top) {
      key = top[1];
      if (top[2].trim() === '') { list = []; out[key] = list; item = null; }
      else { out[key] = scalar(top[2]); list = null; }
      continue;
    }
    const li = raw.match(/^\s*-\s+(.*)$/);
    if (li && list) {
      const kv = li[1].match(/^([A-Za-z][\w-]*):\s*(.*)$/);
      if (kv) { item = { [kv[1]]: scalar(kv[2]) }; list.push(item); }
      else { item = null; list.push(scalar(li[1])); }
      continue;
    }
    const cont = raw.match(/^\s+([A-Za-z][\w-]*):\s*(.*)$/);
    if (cont && item) { item[cont[1]] = scalar(cont[2]); continue; }
  }
  return out;
}

export function splitFile(text) {
  text = text.replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  return { meta: parseFrontMatter(m[1]), body: m[2] };
}

// ---------- Body → blocks ----------
// Block types: heading, para, list, formula, check, recall, visual, breakdown, notation, code, note
export function parseBody(body) {
  const lines = body.split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```\s*([\w-]+)?\s*(.*)$/);
    if (fence) {
      const kind = fence[1] || 'code';
      const arg = fence[2] || '';
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      blocks.push(fenced(kind, arg, buf.join('\n')));
      continue;
    }
    if (/^\$\$/.test(line.trim())) {
      const buf = [line.trim().replace(/^\$\$/, '')];
      let done = buf[0].endsWith('$$') && buf[0].length > 0;
      if (done) buf[0] = buf[0].replace(/\$\$$/, '');
      i++;
      while (!done && i < lines.length) {
        const l = lines[i];
        if (l.trim().endsWith('$$')) { buf.push(l.replace(/\$\$\s*$/, '')); done = true; }
        else buf.push(l);
        i++;
      }
      blocks.push({ type: 'formula', latex: buf.join('\n').trim() });
      continue;
    }
    const h = line.match(/^(#{2,3})\s+(.*?)\s*(?:\{#([\w-]+)\})?\s*$/);
    if (h) {
      blocks.push({ type: 'heading', level: h[1].length, text: h[2], id: h[3] || slug(h[2]) });
      i++; continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        let t = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) { t += ' ' + lines[i].trim(); i++; }
        items.push(t);
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      blocks.push({ type: 'note', text: buf.join(' ') });
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(```|#{2,3}\s|\$\$|>|\s*([-*]|\d+\.)\s+)/.test(lines[i])) { buf.push(lines[i]); i++; }
    blocks.push({ type: 'para', text: buf.join(' ') });
  }
  return blocks;
}

// Tidy older pages into textbook bands: a formula followed by "In words" and "Piece by piece" becomes
// one Formula band with its reading and a symbol list, instead of showing the same formula twice.
const stripP = l => l.replace(/\\p\{[\w-]+\}/g, '').replace(/[\s{}]/g, '');
export function restructure(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'heading' && (b.id === 'aloud' || b.id === 'breakdown')) {
      const target = [...out].reverse().find(x => x.type === 'formula');
      const next = blocks[i + 1];
      if (b.id === 'aloud' && target && next && next.type === 'para') { target.reading = next.text; i++; continue; }
      if (b.id === 'breakdown' && next && next.type === 'breakdown') {
        const where = next.items.map(it => [it.sym ? `$${it.sym}$` : '', it.text]);
        if (target && stripP(target.latex) === stripP(next.latex)) {
          const links = l => (l.match(/\\p\{/g) || []).length;
          if (links(next.latex) > links(target.latex)) target.latex = next.latex;
          target.where = where;
        } else {
          out.push({ type: 'formula', latex: next.latex, label: '', where });
        }
        i++; continue;
      }
    }
    out.push(b);
  }
  return out;
}

export function slug(s) {
  return s.toLowerCase().replace(/\$[^$]*\$/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function fenced(kind, arg, text) {
  switch (kind) {
    case 'formula': {
      // ```formula Title, then the LaTeX, then optionally '---' and 'symbol :: meaning' lines
      const [f, rest = ''] = text.split(/\n---\n/);
      const lines = rest.split('\n');
      const where = lines.filter(l => l.includes('::')).map(l => l.split('::').map(x => x.trim()));
      // Any other text after '---' is the formula in plain words, shown under it.
      const reading = lines.filter(l => l.trim() && !l.includes('::')).join(' ').trim();
      return { type: 'formula', latex: f.trim(), label: arg.trim(), where, reading };
    }
    case 'keypoint': return { type: 'band', tag: 'Key point', title: arg.trim(), blocks: parseBody(text) };
    case 'example': return { type: 'band', tag: 'Example', title: arg.trim(), blocks: parseBody(text) };
    case 'note': return { type: 'band', tag: 'Note', title: arg.trim(), blocks: parseBody(text) };
    case 'check': return { type: 'check', questions: parseCheck(text) };
    case 'recall': return { type: 'recall', questions: parseRecall(text) };
    case 'visual': return { type: 'visual', name: arg.trim().split(/\s+/)[0], opts: parseOpts(text), caption: arg.trim().split(/\s+/).slice(1).join(' ') };
    case 'breakdown': return parseBreakdown(text);
    case 'notation': return { type: 'notation', title: arg.trim(), rows: text.split('\n').filter(l => l.includes('::')).map(l => l.split('::').map(s => s.trim())) };
    default: return { type: 'code', lang: kind, text };
  }
}

function parseOpts(text) {
  const o = {};
  for (const m of text.matchAll(/([\w-]+)\s*=\s*("[^"]*"|\S+)/g)) o[m[1]] = scalar(m[2]);
  return o;
}

// Breakdown:  first lines = formula latex, then a line '---', then 'concept-id | latex-of-piece | explanation'
function parseBreakdown(text) {
  const [f, rest = ''] = text.split(/\n---\n/);
  const items = rest.split('\n').filter(l => l.trim()).map(l => {
    const [id, sym, ...txt] = l.split('|');
    return { id: id.trim(), sym: (sym || '').trim(), text: txt.join('|').trim() };
  });
  return { type: 'breakdown', latex: f.trim(), items };
}

// Quick check format:
// ? Question text            (starts a question)
// - [x] right option :: why it is right
// - [ ] wrong option :: the likely mistake
// = 0.5 ± 0.01               (numeric answer, instead of options)
// wrong: text for any wrong numeric answer
// hint: ...
// answer: worked answer (may continue on following lines)
function parseCheck(text) {
  const qs = [];
  let q = null, field = null;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('? ')) { q = { q: t.slice(2), options: [], hint: '', answer: '', wrong: '' }; qs.push(q); field = 'q'; continue; }
    if (!q) continue;
    let m;
    if ((m = t.match(/^- \[( |x)\]\s+(.*)$/))) {
      const [txt, why = ''] = m[2].split('::');
      q.options.push({ text: txt.trim(), correct: m[1] === 'x', why: why.trim() });
      field = null; continue;
    }
    if ((m = t.match(/^=\s*(-?[\d.eE+-]+)\s*(?:±\s*([\d.eE+-]+))?/))) { q.value = Number(m[1]); q.tol = m[2] ? Number(m[2]) : 1e-9; field = null; continue; }
    if ((m = t.match(/^(hint|answer|wrong):\s*(.*)$/))) { field = m[1]; q[field] = m[2]; continue; }
    if (t && field && field !== 'q') { q[field] += ' ' + t; continue; }
    if (t && field === 'q') q.q += ' ' + t;
  }
  return qs;
}

// Recall format:  "? question" then answer lines until next "?"
function parseRecall(text) {
  const qs = [];
  let q = null;
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('? ')) { q = { q: t.slice(2), a: '' }; qs.push(q); continue; }
    if (q && t) q.a += (q.a ? ' ' : '') + t;
  }
  return qs;
}

// ---------- Loading ----------
export async function loadNodeFile(url, kind) {
  if (cache.has(url)) return cache.get(url);
  const text = await fetchText(url);
  const { meta, body } = splitFile(text);
  const blocks = restructure(parseBody(body));
  const node = {
    kind,
    id: meta.id,
    title: meta.title || meta.id,
    summary: meta.summary || '',
    colour: meta.colour || 'notation',
    level: meta.level ?? 1,
    needs: meta.needs || [],
    related: meta.related || [],
    entryPoints: meta.entryPoints || [],
    sources: meta.sources || [],
    meta,
    blocks,
    pieces: collectPieces(blocks),
  };
  node.recall = blocks.filter(b => b.type === 'recall').flatMap(b => b.questions).map((r, i) => ({ ...r, id: `${node.id}#r${i}` }));
  node.checks = blocks.filter(b => b.type === 'check').flatMap(b => b.questions);
  cache.set(url, node);
  return node;
}

// Every \p{id}{...} and [text](c:id) in a node = the concepts its pieces link to.
export function collectPieces(blocks) {
  const ids = new Set();
  const scan = s => {
    if (!s) return;
    for (const m of s.matchAll(/\\p\{([\w-]+)\}/g)) ids.add(m[1]);
    for (const m of s.matchAll(/\]\(c:([\w-]+)\)/g)) ids.add(m[1]);
  };
  for (const b of blocks) {
    scan(b.latex); scan(b.text); scan(b.reading);
    if (b.where) b.where.forEach(r => r.forEach(scan));
    if (b.blocks) collectPieces(b.blocks).forEach(id => ids.add(id));
    if (b.items) b.items.forEach(it => { scan(typeof it === 'string' ? it : it.text); if (it.id) ids.add(it.id); scan(it.sym); });
    if (b.rows) b.rows.forEach(r => r.forEach(scan));
  }
  return [...ids];
}

export async function loadSite() {
  const courseIds = JSON.parse(await fetchText('content/courses.json'));
  const courses = [];
  const nodes = new Map();
  const conceptIds = new Set();
  for (const cid of courseIds) {
    const course = JSON.parse(await fetchText(`content/courses/${cid}/course.json`));
    course.id = cid;
    courses.push(course);
    (course.concepts || []).forEach(id => conceptIds.add(id));
  }
  const jobs = [];
  for (const course of courses) {
    for (const s of course.slides) {
      jobs.push(loadNodeFile(`content/courses/${course.id}/slides/${s}.md`, 'slide').then(n => { n.course = course.id; nodes.set(n.id, n); }));
    }
  }
  for (const id of conceptIds) {
    jobs.push(loadNodeFile(`content/concepts/${id}.md`, 'concept').then(n => nodes.set(n.id, n)).catch(err => console.warn(err.message)));
  }
  await Promise.all(jobs);
  // Reverse links: who uses this node? (powers "What this unlocks")
  for (const n of nodes.values()) n.usedBy = [];
  for (const n of nodes.values()) {
    const down = new Set([...n.needs, ...(n.kind === 'slide' ? n.pieces : [])]);
    for (const d of down) { const t = nodes.get(d); if (t && t !== n) t.usedBy.push(n.id); }
  }
  return { courses, nodes };
}
