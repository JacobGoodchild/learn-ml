// Progress, spaced repetition and settings. Everything is saved under one localStorage key.
// All storage access is wrapped so the site still works when storage is blocked.

const KEY = 'learnml.v1';
export const INTERVALS = [1, 3, 7, 14, 30]; // days, one per box
const DAY = 86400000;

let state = load();
const listeners = new Set();

function blank() {
  return { version: 1, seen: {}, understood: {}, checks: {}, recall: {}, settings: {}, lastSlide: null };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...blank(), ...JSON.parse(raw) };
  } catch (e) { /* storage unavailable */ }
  return blank();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  listeners.forEach(fn => fn());
}

export function onChange(fn) { listeners.add(fn); }
export const now = () => Date.now();

// ---------- Settings ----------
export function getSetting(k, d) { return state.settings[k] ?? d; }
export function setSetting(k, v) { state.settings[k] = v; save(); }

// ---------- Seen / understood ----------
export function markSeen(id) {
  if (!state.seen[id]) { state.seen[id] = now(); save(); }
}
export function setLastSlide(id) { if (state.lastSlide !== id) { state.lastSlide = id; save(); } }
export function lastSlide() { return state.lastSlide; }

// Record one quick-check question as answered correctly. When every question on the node is right,
// the node becomes understood and its recall questions are scheduled.
export function recordCheck(node, qIndex, correct) {
  const c = (state.checks[node.id] ||= {});
  if (correct) c[qIndex] = true;
  const all = node.checks.length > 0 && node.checks.every((_, i) => c[i]);
  if (all && !state.understood[node.id]) {
    state.understood[node.id] = now();
    for (const r of node.recall) {
      if (!state.recall[r.id]) state.recall[r.id] = { box: 0, due: now() + INTERVALS[0] * DAY, history: [] };
    }
  }
  save();
  return all;
}
export function checkState(id) { return state.checks[id] || {}; }

// ---------- Recall (spaced repetition) ----------
export function answerRecall(rid, correct, t = now()) {
  const r = state.recall[rid];
  if (!r) return;
  r.history.push({ t, ok: !!correct });
  if (correct) r.box = Math.min(r.box + 1, INTERVALS.length - 1);
  else r.box = 0;
  r.due = t + INTERVALS[r.box] * DAY;
  save();
}

export function dueRecall(nodes, t = now()) {
  const out = [];
  for (const n of nodes.values()) {
    for (const r of n.recall || []) {
      const s = state.recall[r.id];
      if (s && s.due <= t) out.push({ node: n, q: r, s });
    }
  }
  return out.sort((a, b) => a.s.due - b.s.due);
}

// ---------- Status of one concept ----------
// 'new' | 'seen' | 'understood' | 'remembered'
export function status(node, t = now()) {
  if (!node) return 'new';
  const id = node.id;
  const u = state.understood[id];
  if (u) {
    const rs = (node.recall || []).map(r => state.recall[r.id]).filter(Boolean);
    const remembered = rs.length > 0 && rs.length === node.recall.length &&
      rs.every(s => s.due > t && s.history.some(h => h.ok && h.t >= u + 7 * DAY));
    return remembered ? 'remembered' : 'understood';
  }
  return state.seen[id] ? 'seen' : 'new';
}

export const STATUS_LABEL = { new: 'not started', seen: 'seen', understood: 'understood', remembered: 'remembered', floor: 'already known' };

// ---------- Export / import / reset ----------
export function exportJSON() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}
export function importJSON(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || !('seen' in data)) throw new Error('This file does not look like Learn ML progress.');
  state = { ...blank(), ...data };
  save();
}
export function resetAll() {
  const settings = state.settings;
  state = blank();
  state.settings = settings;
  save();
}

export function nextDue() {
  const ds = Object.values(state.recall).map(r => r.due);
  return ds.length ? Math.min(...ds) : null;
}

// For tests only.
export function _setState(s) { state = { ...blank(), ...s }; }
