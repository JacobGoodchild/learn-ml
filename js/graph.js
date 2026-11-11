// Graph helpers over the concept map: trees, ladder order, progress, next up.
import { status } from './progress.js';

export const isFloor = n => n && n.kind === 'concept' && n.level === 0;

// Everything below a node: its pieces (for slides) and needs, transitively.
export function treeOf(nodes, rootId) {
  const seen = new Set();
  const root = nodes.get(rootId);
  if (!root) return seen;
  const stack = [...new Set([...(root.kind === 'slide' ? root.pieces : []), ...root.needs])];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id) || id === rootId) continue;
    seen.add(id);
    const n = nodes.get(id);
    if (n) stack.push(...n.needs, ...(n.kind === 'slide' ? n.pieces : []));
  }
  return seen;
}

// Topological order of a set of ids (needs first). Ties broken by level, then title.
export function ladderOrder(nodes, ids) {
  const set = new Set(ids);
  const indeg = new Map([...set].map(id => [id, 0]));
  const kids = new Map([...set].map(id => [id, []]));
  for (const id of set) {
    const n = nodes.get(id);
    for (const d of (n ? n.needs : [])) if (set.has(d)) { indeg.set(id, indeg.get(id) + 1); kids.get(d).push(id); }
  }
  const key = id => { const n = nodes.get(id); return [n ? n.level : 9, n ? n.title : id]; };
  const cmp = (a, b) => { const [la, ta] = key(a), [lb, tb] = key(b); return la - lb || ta.localeCompare(tb); };
  const ready = [...set].filter(id => indeg.get(id) === 0).sort(cmp);
  const out = [];
  while (ready.length) {
    const id = ready.shift();
    out.push(id);
    for (const k of kids.get(id)) { indeg.set(k, indeg.get(k) - 1); if (indeg.get(k) === 0) { ready.push(k); ready.sort(cmp); } }
  }
  // Any cycle leftovers (should not happen) go at the end so nothing disappears.
  for (const id of set) if (!out.includes(id)) out.push(id);
  return out;
}

export function counts(nodes, ids) {
  let total = 0, understood = 0, remembered = 0;
  for (const id of ids) {
    const n = nodes.get(id);
    if (!n || isFloor(n) || n.kind !== 'concept') continue;
    total++;
    const s = status(n);
    if (s === 'understood' || s === 'remembered') understood++;
    if (s === 'remembered') remembered++;
  }
  return { total, understood, remembered };
}

export function nextUp(nodes, slideId) {
  const order = ladderOrder(nodes, treeOf(nodes, slideId));
  for (const id of order) {
    const n = nodes.get(id);
    if (!n || isFloor(n)) continue;
    const s = status(n);
    if (s !== 'understood' && s !== 'remembered') return n;
  }
  return null;
}

export function allConceptIds(nodes) {
  return [...nodes.values()].filter(n => n.kind === 'concept').map(n => n.id);
}
