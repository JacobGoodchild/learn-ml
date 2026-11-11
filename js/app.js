// Learn ML engine. One concept map, many views. See docs/content-format.md and docs/design.md.
import { loadSite } from './content.js';
import { renderBlocks, inline, tex, esc } from './render.js';
import * as P from './progress.js';
import { treeOf, ladderOrder, counts, nextUp, isFloor, allConceptIds } from './graph.js';

const FAMILY_LABEL = {
  probability: 'Probability', spread: 'Mean and spread', linalg: 'Vectors and matrices', calculus: 'Calculus',
  diffusion: 'Diffusion', information: 'Information', learning: 'Learning', notation: 'Notation',
};

let site = null;          // { courses, nodes }
let current = null;       // current parsed route
const scrolls = new Map(); // stack key -> scrollY
const main = document.getElementById('main');
const preview = document.querySelector('.preview');
let lastPointer = 'mouse';

const colourOf = n => `var(--c-${(n && n.colour) || 'notation'})`;
const node = id => site.nodes.get(id);
const reducedMotion = () => {
  const m = P.getSetting('motion', 'system');
  if (m === 'reduced') return true;
  if (m === 'full') return false;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ---------- Routes ----------
// #/                       home (slides)
// #/dive/<root>/<id>@<i>…  layer stack; optional ":section" on the last layer
// #/ladder[/<slide>]       ladder
// #/progress   #/review
function parse(hash) {
  const h = (hash || '').replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean).map(decodeURIComponent);
  const view = parts[0] || 'home';
  if (view === 'dive' && parts.length > 1) {
    const stack = parts.slice(1).map((p, k) => {
      let [idPart, section] = p.split(':');
      let [id, from] = idPart.split('@');
      return { id, from: k === 0 ? null : Number(from || 0), section: section || null };
    });
    return { view: 'dive', stack };
  }
  if (view === 'ladder') return { view, slide: parts[1] || null };
  if (view === 'progress' || view === 'review') return { view };
  return { view: 'home' };
}

export function diveHash(stack) {
  return '#/dive/' + stack.map((l, k) => encodeURIComponent(l.id) + (k > 0 ? '@' + l.from : '') + (l.section ? ':' + l.section : '')).join('/');
}
const stackKey = stack => stack.map(l => l.id + '@' + l.from).join('/');
const routeKey = r => r.view === 'dive' ? 'dive:' + stackKey(r.stack) : r.view + ':' + (r.slide || '');

function isPrefix(a, b) { // stack a is a strict prefix of b
  if (a.length >= b.length) return false;
  return a.every((l, k) => l.id === b[k].id && l.from === b[k].from);
}

// ---------- Boot ----------
async function boot() {
  main.innerHTML = '<div class="page"><p class="muted">Loading the concept map…</p></div>';
  try {
    site = await loadSite();
  } catch (e) {
    main.innerHTML = `<div class="page"><h1>Could not load content</h1><p>${esc(e.message)}</p></div>`;
    return;
  }
  buildSettings();
  P.onChange(updateHeader);
  updateHeader();
  window.addEventListener('hashchange', route);
  document.addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; }, true);
  document.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') lastPointer = 'mouse'; }, { passive: true });
  document.addEventListener('keydown', onKey);
  document.addEventListener('keydown', e => { if (e.key === 'Tab') lastPointer = 'keyboard'; }, true);
  document.addEventListener('click', e => { if (!preview.contains(e.target) && !e.target.closest('[data-c]')) hidePreview(); });
  window.addEventListener('scroll', () => { if (!preview.hidden && lastPointer === 'mouse') hidePreview(); }, { passive: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  route();
}

async function route() {
  const next = parse(location.hash);
  const prev = current;
  hidePreview();
  if (prev) scrolls.set(routeKey(prev), window.scrollY);
  let dir = 'none';
  if (prev && prev.view === 'dive' && next.view === 'dive') {
    if (isPrefix(prev.stack, next.stack)) dir = 'in';
    else if (isPrefix(next.stack, prev.stack)) dir = 'out';
    else if (stackKey(prev.stack) === stackKey(next.stack)) dir = 'same';
  }
  const animate = !reducedMotion() && (dir === 'in' || dir === 'out');
  const article = main.querySelector('.layer');
  let originPoint = null;

  if (animate && article) {
    if (dir === 'in') {
      const piece = pieceAt(article, next.stack[prev.stack.length].from);
      originPoint = piece ? centre(piece) : null;
      await play(article, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.12)', opacity: 0 }], 170, originPoint);
    } else {
      await play(article, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.96)', opacity: 0 }], 150, null);
    }
  }

  current = next;
  if (dir === 'same' && article) { // only the section changed
    openSection(article, next.stack.at(-1).section);
    return;
  }
  render(next);
  setNav(next.view);

  const fresh = main.querySelector('.layer');
  if (next.view === 'dive' && fresh) {
    if (dir === 'out') {
      window.scrollTo(0, scrolls.get(routeKey(next)) || 0);
      const piece = pieceAt(fresh, prev.stack[next.stack.length].from);
      if (piece) { piece.classList.add('is-lit'); setTimeout(() => piece.classList.remove('is-lit'), 1200); }
      if (animate) await play(fresh, [{ transform: 'scale(1.08)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], 200, piece ? centre(piece) : null);
      if (piece) piece.focus({ preventScroll: true });
    } else {
      const sec = next.stack.at(-1).section;
      window.scrollTo(0, dir === 'none' ? (scrolls.get(routeKey(next)) || 0) : 0);
      if (animate) await play(fresh, [{ transform: 'scale(.94)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], 220, originPoint);
      if (sec) openSection(fresh, sec);
      if (dir === 'in') fresh.querySelector('h1').focus({ preventScroll: true });
    }
  } else {
    window.scrollTo(0, scrolls.get(routeKey(next)) || 0);
  }
}

function centre(el) { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
function play(el, frames, ms, point) {
  if (point) {
    const r = el.getBoundingClientRect();
    el.style.transformOrigin = `${point.x - r.left}px ${point.y - r.top}px`;
  } else el.style.transformOrigin = '50% 20%';
  const a = el.animate(frames, { duration: ms, easing: 'cubic-bezier(.3,.1,.2,1)', fill: 'both' });
  return a.finished.then(() => a.cancel()).catch(() => {});
}
const pieceAt = (root, i) => root.querySelectorAll('.layer-body [data-c]')[i] || null;
function openSection(root, sec) {
  if (!sec) return;
  const h = root.querySelector(`#sec-${CSS.escape(sec)}`);
  if (!h) return;
  h.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  h.classList.add('section-target');
  setTimeout(() => h.classList.remove('section-target'), 1700);
  h.focus({ preventScroll: true });
}

function setNav(view) {
  document.querySelectorAll('[data-nav]').forEach(a => {
    const on = a.dataset.nav === view || (view === 'dive' && a.dataset.nav === 'home');
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function render(r) {
  main.innerHTML = '';
  if (r.view === 'dive') return renderDive(r.stack);
  if (r.view === 'ladder') return renderLadder(r.slide);
  if (r.view === 'progress') return renderProgress();
  if (r.view === 'review') return renderReview();
  return renderHome();
}

// ---------- Header ----------
function updateHeader() {
  const ids = allConceptIds(site.nodes);
  const c = counts(site.nodes, ids);
  const due = P.dueRecall(site.nodes).length;
  const el = document.querySelector('.header-progress');
  el.textContent = `${c.understood} of ${c.total} concepts understood · ${c.remembered} remembered` + (due ? ` · ${due} review${due === 1 ? '' : 's'} due` : '');
  const dc = document.querySelector('.due-count');
  dc.hidden = !due;
  dc.textContent = due;
}

// ---------- Settings ----------
function buildSettings() {
  const cog = document.querySelector('.cog');
  const menu = document.getElementById('settings-menu');
  const seg = (key, label, opts, apply) => {
    const cur = P.getSetting(key, opts[0][0]);
    return `<div class="row"><span class="label">${label}</span><div class="seg" data-key="${key}">${opts.map(([v, t]) =>
      `<button data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('')}</div></div>`;
  };
  menu.innerHTML =
    seg('theme', 'Theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]) +
    seg('motion', 'Motion', [['system', 'System'], ['reduced', 'Reduced'], ['full', 'Full']]) +
    seg('textSize', 'Text size', [['medium', 'Medium'], ['small', 'Small'], ['large', 'Large']]) +
    `<div class="menu-actions">
      <button data-act="export">Export progress to a file</button>
      <button data-act="import">Import progress from a file</button>
      <button data-act="reset" class="danger">Reset all progress</button>
      <input type="file" accept="application/json,.json" hidden>
    </div>`;
  const applyAll = () => {
    const root = document.documentElement;
    const t = P.getSetting('theme', 'system'); if (t === 'system') delete root.dataset.theme; else root.dataset.theme = t;
    const m = P.getSetting('motion', 'system'); if (m === 'system') delete root.dataset.motion; else root.dataset.motion = m;
    const s = P.getSetting('textSize', 'medium'); if (s === 'medium') delete root.dataset.text; else root.dataset.text = s;
  };
  menu.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const segEl = b.closest('.seg');
    if (segEl) {
      P.setSetting(segEl.dataset.key, b.dataset.v);
      segEl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      applyAll();
      if (current && current.view === 'dive') { scrolls.set(routeKey(current), scrollY); render(current); window.scrollTo(0, scrolls.get(routeKey(current))); }
      return;
    }
    const act = b.dataset.act;
    if (act === 'export') {
      const blob = new Blob([P.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `learn-ml-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } else if (act === 'import') menu.querySelector('input[type=file]').click();
    else if (act === 'reset') {
      if (confirm('Reset all progress? Your settings are kept. This cannot be undone unless you have exported a file.')) { P.resetAll(); route(); }
    }
  });
  menu.querySelector('input[type=file]').addEventListener('change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { P.importJSON(await f.text()); alert('Progress imported.'); route(); }
    catch (err) { alert(err.message); }
    e.target.value = '';
  });
  const toggle = open => { menu.hidden = !open; cog.setAttribute('aria-expanded', open); };
  cog.addEventListener('click', e => { e.stopPropagation(); toggle(menu.hidden); });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && e.target !== cog) toggle(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { toggle(false); cog.focus(); } });
}

// ---------- Dive view ----------
function renderDive(stack) {
  // Drop any layer whose node does not exist, so a bad link still lands somewhere sensible.
  const top = stack.at(-1);
  const n = node(top.id);
  const wrap = document.createElement('div');
  wrap.className = 'layers';
  const rail = document.createElement('aside');
  rail.className = 'rail';
  rail.setAttribute('aria-label', 'Layers you are in');
  const mainCol = document.createElement('div');
  mainCol.className = 'layer-main';
  wrap.append(rail, mainCol);
  main.appendChild(wrap);

  if (!n) {
    mainCol.innerHTML = `<article class="layer"><div class="layer-head"><p class="eyebrow">Not written yet</p><h1 tabindex="-1">${esc(top.id)}</h1></div><div class="layer-body"><p>This concept is planned in the concept map but its page has not been written yet.</p></div></article>`;
    renderRail(rail, stack);
    return;
  }
  if (n.kind === 'slide') P.setLastSlide(n.id);
  document.title = `${plain(n.kind === 'slide' ? 'Slide ' + n.meta.number : n.title)} · Learn ML`;
  P.markSeen(n.id);

  const art = document.createElement('article');
  art.className = 'layer';
  art.style.setProperty('--cc', n.kind === 'slide' ? 'var(--accent)' : colourOf(n));
  const depth = stack.length;
  const parent = depth > 1 ? node(stack[depth - 2].id) : null;
  const st = isFloor(n) ? 'floor' : P.status(n);
  const crumbs = depth > 1 ? `<nav class="crumbs" aria-label="Where you are"><ol>${stack.map((l, k) => {
      const t = node(l.id);
      const label = t ? inline(t.title) : esc(l.id);
      return k === depth - 1 ? `<li aria-current="page">${label}</li>` : `<li><a href="${diveHash(stack.slice(0, k + 1))}">${label}</a></li>`;
    }).join('')}</ol></nav>` : '';
  const meta = n.kind === 'slide' ? slideProgress(n)
    : isFloor(n) ? '<p class="meta">A reminder of something from A-level.</p>'
    : `<p class="meta" data-status>${statusDot(st, n)} ${statusSentence(st)}</p>`;
  const contents = n.entryPoints.length ? `<p class="contents">Jump to: ${n.entryPoints.map(e =>
      `<a href="${diveHash([...stack.slice(0, -1), { ...top, section: e.section }])}">${inline(e.label)}</a>`).join(', ')}</p>` : '';
  art.innerHTML = `
    ${crumbs}
    <div class="layer-head">
      <h1 tabindex="-1">${inline(n.title)}</h1>
      ${n.summary ? `<p class="summary">${inline(n.summary)}</p>` : ''}
      ${meta}
      ${contents}
    </div>
    <div class="layer-body"></div>`;
  mainCol.appendChild(art);
  const body = art.querySelector('.layer-body');
  const ctx = {
    node: n, nodes: site.nodes,
    onUnderstood: () => {
      const pill = art.querySelector('[data-status]');
      if (pill) pill.innerHTML = `${statusDot('understood', n)} Understood`;
      const note = document.createElement('p');
      note.className = 'check-summary';
      note.textContent = 'All correct. You will see review questions on this tomorrow.';
      art.querySelector('.checks:last-of-type')?.appendChild(note);
      renderRail(rail, stack);
    },
  };
  renderBlocks(body, n.blocks, ctx);
  appendAuto(body, n, stack);
  wirePieces(art, stack);
  renderRail(rail, stack);
}

function plain(s) { return String(s).replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\(mathcal|mathbb|bar|sqrt)\b/g, '').replace(/[\\{}]/g, '')); }

function statusSentence(st) {
  return { new: 'Not started', seen: 'Opened, quiz not passed yet', understood: 'Understood', remembered: 'Remembered' }[st] || '';
}

function courseTitle(cid) { const c = site.courses.find(c => c.id === cid); return c ? c.short || c.title : ''; }

function statusDot(st, n) {
  return `<span class="dot ${st === 'floor' ? 'understood' : st}" style="--cc:${st === 'floor' ? 'var(--rule-2)' : colourOf(n)}" aria-hidden="true"></span>`;
}

function slideProgress(n) {
  const c = counts(site.nodes, treeOf(site.nodes, n.id));
  return `<a class="bar-link" href="#/ladder/${n.id}" style="min-width:14rem" title="See this slide's tree">${bar(c)}<span class="bar-label">${c.understood} of ${c.total} ideas behind this slide understood</span></a>`;
}

function bar(c) {
  const u = c.total ? (c.understood / c.total) * 100 : 0, r = c.total ? (c.remembered / c.total) * 100 : 0;
  return `<div class="bar" role="img" aria-label="${c.understood} of ${c.total} understood, ${c.remembered} remembered"><span class="u" style="width:${u}%"></span><span class="r" style="width:${r}%"></span></div>`;
}

// "Built on", "What this unlocks" and "Sources" are generated from the map, so they are always right.
function appendAuto(body, n, stack) {
  const html = [];
  const needs = n.needs.filter(id => id);
  if (needs.length) {
    html.push(`<h2 id="sec-built-on" tabindex="-1">Built on</h2><ul>${needs.map(id => {
      const t = node(id);
      return `<li><a class="concept-link" href="#" data-c="${id}">${t ? inline(t.title) : esc(id)}</a>${t && t.summary ? ` <span class="muted">— ${inline(t.summary)}</span>` : ''}</li>`;
    }).join('')}</ul>`);
  }
  const ups = (n.usedBy || []).map(node).filter(Boolean);
  if (ups.length) {
    html.push(`<h2 id="sec-unlocks" tabindex="-1">Used in</h2><ul>${ups.map(u => {
      const k = stack.findIndex(l => l.id === u.id);
      const href = k >= 0 ? diveHash(stack.slice(0, k + 1)) : diveHash([{ id: u.id, from: null }]);
      return `<li><a href="${href}">${inline(u.title)}</a></li>`;
    }).join('')}</ul>`);
  }
  if (n.related.length) {
    html.push(`<h2 id="sec-related" tabindex="-1">Worth comparing</h2><ul>${n.related.map(id => {
      const t = node(id);
      return `<li><a class="concept-link" href="#" data-c="${id}">${t ? inline(t.title) : esc(id)}</a></li>`;
    }).join('')}</ul>`);
  }
  if (n.sources.length) {
    html.push(`<details class="sources"><summary>Sources</summary><ul>${n.sources.map(s =>
      `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${inline(s.title)}</a>` : inline(s.title)}${s.authors ? `, ${inline(s.authors)}` : ''}${s.note ? `. <span class="muted">${inline(s.note)}</span>` : ''}</li>`).join('')}</ul></details>`);
  }
  const d = document.createElement('div');
  d.innerHTML = html.join('');
  body.append(...d.childNodes);
}

// Give every piece its colour, keyboard access and link.
function wirePieces(art, stack) {
  const pieces = art.querySelectorAll('.layer-body [data-c]');
  pieces.forEach((el, i) => {
    const id = el.dataset.c;
    const t = node(id);
    el.style.setProperty('--pc', colourOf(t));
    el.dataset.i = i;
    if (!t) el.classList.add('missing');
    if (el.tagName !== 'A') { el.tabIndex = 0; el.setAttribute('role', 'link'); }
    el.setAttribute('aria-label', `${t ? plain(t.title) : id}${t ? '' : ' (not written yet)'}. Press Enter to open this layer.`);
    if (el.tagName === 'A') el.href = diveHash([...stack.map(l => ({ ...l, section: null })), { id, from: i }]);
  });
  art.addEventListener('click', e => {
    const el = e.target.closest('[data-c]');
    if (!el || !art.contains(el) || !el.closest('.layer-body')) return;
    e.preventDefault();
    if (lastPointer === 'touch' && preview.dataset.for !== el.dataset.i) { showPreview(el, stack); return; }
    diveFrom(el, stack);
  });
  art.addEventListener('keydown', e => {
    const el = e.target.closest('[data-c]');
    if (el && (e.key === 'Enter' || e.key === ' ') && el.tagName !== 'A') { e.preventDefault(); diveFrom(el, stack); }
  });
  let hoverT = null;
  art.addEventListener('mouseover', e => {
    const el = e.target.closest('.layer-body [data-c]');
    if (!el || lastPointer !== 'mouse') return;
    clearTimeout(hoverT); clearTimeout(hideT);
    hoverT = setTimeout(() => showPreview(el, stack), 280);
  });
  art.addEventListener('mouseout', e => {
    const el = e.target.closest('.layer-body [data-c]');
    if (!el || lastPointer === 'touch') return; // taps fire mouse events too; ignore them
    clearTimeout(hoverT);
    scheduleHide();
  });
  art.addEventListener('focusin', e => {
    const el = e.target.closest('.layer-body [data-c]');
    // Wait for the browser to scroll the piece into view before placing the card.
    if (el && e.target.matches(':focus-visible')) requestAnimationFrame(() => requestAnimationFrame(() => { if (document.activeElement === el) showPreview(el, stack); }));
  });
}

function diveFrom(el, stack, idOverride) {
  const id = idOverride || el.dataset.c;
  const base = stack.map(l => ({ ...l, section: null }));
  location.hash = diveHash([...base, { id, from: Number(el.dataset.i) }]);
}

// ---------- Rail ----------
const snippetCache = new Map();
function snippetFor(layerId, pieceIndex) {
  const k = layerId + '@' + pieceIndex;
  if (snippetCache.has(k)) return snippetCache.get(k);
  const n = node(layerId);
  let out = null;
  if (n) {
    // Prefer the live page if it is on screen; otherwise render the body off-screen (no visuals or checks).
    const tmp = document.createElement('div');
    renderBlocks(tmp, n.blocks.filter(b => !['visual', 'check', 'recall'].includes(b.type)), { node: n, nodes: site.nodes, lite: true });
    appendAuto(tmp, n, [{ id: n.id, from: null }]);
    const lite = tmp.querySelectorAll('[data-c]');
    // Pieces inside visuals/checks never come first in practice, but recount on the real order when possible.
    const live = main.querySelector('.layer-body') && current && current.view === 'dive' && current.stack.at(-1).id === layerId
      ? main.querySelectorAll('.layer-body [data-c]') : null;
    const el = (live || lite)[pieceIndex];
    if (el) {
      const host = el.closest('[data-latex]');
      if (host) {
        const latex = host.getAttribute('data-latex');
        const local = [...host.querySelectorAll('[data-c]')].indexOf(el);
        out = { latex, local, display: host.classList.contains('formula'), c: el.dataset.c };
      } else out = { text: el.textContent, c: el.dataset.c };
    }
  }
  snippetCache.set(k, out);
  return out;
}

function renderRail(rail, stack) {
  const cards = stack.map((l, k) => {
    const n = node(l.id);
    const isCur = k === stack.length - 1;
    const colour = n && n.kind === 'concept' ? colourOf(n) : 'var(--accent)';
    let f = '';
    if (!isCur) {
      const sn = snippetFor(l.id, stack[k + 1].from);
      const hl = node(stack[k + 1].id);
      if (sn && sn.latex) f = `<span class="f" data-hl="${sn.local}" style="--hl:${colourOf(hl)}">${tex(sn.latex, false)}</span>`;
    }
    const title = n ? n.title : l.id;
    const inner = `<span class="t">${inline(title)}</span>${f}`;
    return `<li>${isCur
      ? `<div class="rail-card current" style="--cc:${colour}" aria-current="location">${inner}</div>`
      : `<a class="rail-card" style="--cc:${colour}; text-decoration:none" href="${diveHash(stack.slice(0, k + 1))}">${inner}</a>`}</li>`;
  });
  const heads = [...main.querySelectorAll('.layer-body h2[id]')];
  const toc = heads.length ? `<p class="rail-title">On this page</p><ul class="toc">${heads.map(h =>
    `<li><a href="${diveHash([...stack.slice(0, -1), { ...stack.at(-1), section: h.id.replace(/^sec-/, '') }])}">${h.innerHTML}</a></li>`).join('')}</ul>` : '';
  rail.innerHTML = (stack.length > 1 ? `<p class="rail-title">Your path</p><ol>${cards.join('')}</ol>` : '') + toc;
  rail.querySelectorAll('.f[data-hl]').forEach(f => {
    const p = f.querySelectorAll('[data-c]')[Number(f.dataset.hl)];
    f.querySelectorAll('[data-c]').forEach(x => { x.style.cursor = 'inherit'; });
    if (p) p.classList.add('hl');
  });
}

// ---------- Preview card ----------
let hideT = null;
function scheduleHide() { clearTimeout(hideT); hideT = setTimeout(hidePreview, 300); }
preview.addEventListener('mouseenter', () => clearTimeout(hideT));
preview.addEventListener('mouseleave', () => { if (lastPointer !== 'touch') scheduleHide(); });

function showPreview(el, stack) {
  clearTimeout(hideT);
  if (!el.isConnected) return; // a hover timer can outlive the page it was set on
  const id = el.dataset.c;
  const n = node(id);
  const st = !n ? null : isFloor(n) ? 'floor' : P.status(n);
  preview.style.setProperty('--cc', colourOf(n));
  preview.dataset.for = el.dataset.i;
  const base = stack.map(l => ({ ...l, section: null }));
  const here = { id, from: Number(el.dataset.i) };
  if (!n) {
    preview.innerHTML = `<div class="pt">${esc(id)}</div><p class="ps">Not written yet.</p>`;
  } else {
    preview.innerHTML = `
      <div class="pt">${inline(n.title)}</div>
      <p class="ps">${inline(n.summary)}</p>
      <a class="popen" href="${diveHash([...base, here])}">Open</a>`;
  }
  preview.hidden = false;
  const r = el.getBoundingClientRect();
  const w = preview.offsetWidth, h = preview.offsetHeight;
  let x = r.left + scrollX + r.width / 2 - w / 2;
  x = Math.max(scrollX + 8, Math.min(x, scrollX + document.documentElement.clientWidth - w - 8));
  let y = r.bottom + scrollY + 8;
  if (r.bottom + h + 16 > innerHeight && r.top - h - 8 > 0) y = r.top + scrollY - h - 8;
  preview.style.left = x + 'px';
  preview.style.top = y + 'px';
}
function hidePreview() { preview.hidden = true; delete preview.dataset.for; }

function onKey(e) {
  if (e.key !== 'Escape') return;
  if (!preview.hidden) { hidePreview(); return; }
  if (!document.getElementById('settings-menu').hidden) return;
  if (current && current.view === 'dive' && current.stack.length > 1) location.hash = diveHash(current.stack.slice(0, -1));
}

// ---------- Home ----------
function renderHome() {
  const html = site.courses.map(course => {
    const slideId = P.lastSlide() && site.nodes.get(P.lastSlide())?.course === course.id ? P.lastSlide() : course.slides[0];
    const nu = nextUp(site.nodes, slideId);
    const sl = node(slideId);
    const ordered = [...course.outline.filter(o => node(o.id)), ...course.outline.filter(o => !node(o.id))];
    const rows = ordered.map(o => {
      const n = node(o.id);
      const built = !!n;
      const c = built ? counts(site.nodes, treeOf(site.nodes, o.id)) : null;
      return `<li class="slide-row ${built ? '' : 'planned'}">
        <span class="title">${built ? `<a href="${diveHash([{ id: o.id, from: null }])}">${inline(o.title)}</a>` : inline(o.title)}<span class="sub">${inline(o.part || '')}${built ? '' : ', coming later'}</span></span>
        <span class="prog">${built ? `<a class="bar-link" href="#/ladder/${o.id}">${bar(c)}<span class="bar-label">${c.understood} of ${c.total}</span></a>` : ''}</span>
      </li>`;
    }).join('');
    return `<section>
      <h1>${inline(course.title)}</h1>
      <p class="lede">${inline(course.description)}</p>
      ${nu ? nextUpBox(nu, sl) : ''}
      <h2>The slides</h2>
      <p>Click any part of a formula to open the idea behind it.</p>
      <ul class="slide-list">${rows}</ul>
    </section>`;
  }).join('');
  main.innerHTML = `<div class="page wide">${html}</div>`;
}

function nextUpBox(n, slide) {
  return `<div class="next-up" style="--cc:${colourOf(n)}"><p class="label">Next up</p>
    <a href="${diveHash([{ id: n.id, from: null }])}">${inline(n.title)}</a><div>${inline(n.summary)}</div></div>`;
}

// ---------- Ladder ----------
function renderLadder(slideId) {
  const slides = site.courses.flatMap(c => c.slides).map(node).filter(Boolean);
  const sl = node(slideId) || node(P.lastSlide()) || slides[0];
  const ids = treeOf(site.nodes, sl.id);
  const order = ladderOrder(site.nodes, ids);
  const c = counts(site.nodes, ids);
  const rows = order.map(id => {
    const n = node(id);
    if (!n) return `<li><span class="dot" style="--cc:var(--rule-2)"></span><span class="t">${esc(id)}<span class="s">Planned, not written yet</span></span><span class="st">—</span></li>`;
    const st = isFloor(n) ? 'floor' : P.status(n);
    return `<li class="${isFloor(n) ? 'floor' : ''}"><span class="dot ${st === 'floor' ? 'understood' : st}" style="--cc:${isFloor(n) ? 'var(--rule-2)' : colourOf(n)}"></span>
      <span class="t"><a href="${diveHash([{ id: sl.id, from: null }, ...pathTo(sl.id, id)])}">${inline(n.title)}</a><span class="s">${inline(n.summary)}</span></span>
      <span class="st">${P.STATUS_LABEL[st]}</span></li>`;
  }).join('');
  const nu = nextUp(site.nodes, sl.id);
  main.innerHTML = `<div class="page">
    <h1>Ladder</h1>
    <p class="lede">Every idea behind <a href="${diveHash([{ id: sl.id, from: null }])}">${inline(sl.title)}</a>, from what you already know at the top. Each idea only uses the ones above it.</p>
    ${slides.length > 1 ? `<p>Other slides: ${slides.filter(s => s !== sl).map(s => `<a href="#/ladder/${s.id}">${inline(s.title)}</a>`).join(', ')}</p>` : ''}
    ${bar(c)}<span class="bar-label">${c.understood} of ${c.total} understood, ${c.remembered} remembered</span>
    ${nu ? nextUpBox(nu, sl) : '<p>Everything under this slide is understood.</p>'}
    <div class="legend"><span><span class="dot" style="--cc:var(--ink-3)"></span>not started</span><span><span class="dot seen" style="--cc:var(--ink-3)"></span>seen</span><span><span class="dot understood" style="--cc:var(--ink-3)"></span>understood</span><span><span class="dot remembered" style="--cc:var(--ink-3)"></span>remembered</span><span><span class="dot understood" style="--cc:var(--rule-2)"></span>floor (already known)</span></div>
    <ol class="ladder">${rows}</ol></div>`;
}

// A sensible layer stack from a slide down to a concept: shortest chain of pieces / needs.
function pathTo(fromId, toId) {
  const prev = new Map([[fromId, null]]);
  const q = [fromId];
  while (q.length) {
    const id = q.shift();
    if (id === toId) break;
    const n = node(id);
    if (!n) continue;
    for (const d of [...(n.kind === 'slide' ? n.pieces : []), ...n.needs]) if (!prev.has(d)) { prev.set(d, id); q.push(d); }
  }
  if (!prev.has(toId)) return [{ id: toId, from: 0 }];
  const chain = [];
  for (let id = toId; id !== fromId; id = prev.get(id)) chain.unshift(id);
  // Piece index: the first piece on the parent page that links to the child (computed from a lite render).
  return chain.map((id, k) => ({ id, from: firstPieceIndex(k === 0 ? fromId : chain[k - 1], id) }));
}
function firstPieceIndex(parentId, childId) {
  const n = node(parentId);
  if (!n) return 0;
  const tmp = document.createElement('div');
  renderBlocks(tmp, n.blocks.filter(b => !['visual', 'check', 'recall'].includes(b.type)), { node: n, nodes: site.nodes, lite: true });
  appendAuto(tmp, n, [{ id: n.id, from: null }]);
  const i = [...tmp.querySelectorAll('[data-c]')].findIndex(e => e.dataset.c === childId);
  return Math.max(0, i);
}

// ---------- Progress ----------
function renderProgress() {
  const all = allConceptIds(site.nodes);
  const c = counts(site.nodes, all);
  const due = P.dueRecall(site.nodes);
  const sl = node(P.lastSlide()) || node(site.courses[0].slides[0]);
  const nu = sl ? nextUp(site.nodes, sl.id) : null;
  const courseRows = site.courses.map(course => {
    const cc = counts(site.nodes, course.concepts);
    const slideRows = course.slides.map(node).filter(Boolean).map(s => {
      const sc = counts(site.nodes, treeOf(site.nodes, s.id));
      return `<tr><td><a href="${diveHash([{ id: s.id, from: null }])}">${inline(s.title)}</a></td><td class="barcell"><a class="bar-link" href="#/ladder/${s.id}">${bar(sc)}</a></td><td class="small">${sc.understood}/${sc.total} · ${sc.remembered} remembered</td></tr>`;
    }).join('');
    return `<h2>${inline(course.short || course.title)}</h2>
      <table class="prog-table"><tr><th>Whole course</th><th class="barcell">${''}</th><th></th></tr>
      <tr><td>All concepts in this course</td><td class="barcell">${bar(cc)}</td><td class="small">${cc.understood}/${cc.total} · ${cc.remembered} remembered</td></tr>
      ${slideRows}</table>`;
  }).join('');
  const dueList = due.length
    ? `<p>${due.length} question${due.length === 1 ? '' : 's'} due, from ${new Set(due.map(d => d.node.id)).size} concept${new Set(due.map(d => d.node.id)).size === 1 ? '' : 's'}. <a class="btn primary" href="#/review">Start review</a></p>`
    : `<p class="muted">Nothing is due for review today.${upcoming()}</p>`;
  main.innerHTML = `<div class="page">
    <h1>${c.understood} of ${c.total} concepts understood</h1>
    <p class="lede">${c.remembered} remembered, ${due.length} review${due.length === 1 ? '' : 's'} due. A concept counts as understood when you have answered its quick check, and as remembered when you still get its review questions right a week or more later.</p>
    ${nu ? nextUpBox(nu, sl) : ''}
    <h2>Reviews</h2>${dueList}
    ${courseRows}
    <p style="margin-top:2rem">A-level reminders are not counted. Progress is saved in this browser; to move it to another device, use Export and Import in the settings menu.</p>
  </div>`;
}
function upcoming() {
  const t = P.nextDue();
  return t ? ` The next one is due on ${new Date(t).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.` : '';
}

// ---------- Review ----------
function renderReview() {
  const due = P.dueRecall(site.nodes);
  if (!due.length) {
    main.innerHTML = `<div class="page"><h1>Nothing to review today</h1>
      <p class="lede">Questions appear here about a day, three days, a week, two weeks and a month after you understand a concept. Getting one wrong sends it back to the start.</p>
      <p><a href="#/progress">See your progress</a></p></div>`;
    return;
  }
  const item = due[0];
  const n = item.node;
  main.innerHTML = `<div class="page">
    <h1>Review</h1><p>${due.length} question${due.length === 1 ? '' : 's'} left today.</p>
    <div class="review-card" style="--cc:${colourOf(n)}">
      <p class="from">${inline(n.title)}</p>
      <p style="font-size:1.1em">${inline(item.q.q)}</p>
      <div class="review-actions"><button class="btn primary" data-show>Show the answer</button></div>
      <div class="answer" hidden><p>${inline(item.q.a)}</p>
        <div class="review-actions"><button class="btn" data-ok="1">I had it</button><button class="btn" data-ok="0">I didn't</button>
        <a class="btn" href="${diveHash([{ id: n.id, from: null }])}">Open the page</a></div></div>
    </div></div>`;
  const card = main.querySelector('.review-card');
  card.querySelector('[data-show]').addEventListener('click', e => {
    card.querySelector('.answer').hidden = false;
    e.target.remove();
    card.querySelector('[data-ok]').focus();
  });
  card.querySelectorAll('[data-ok]').forEach(b => b.addEventListener('click', () => {
    P.answerRecall(item.q.id, b.dataset.ok === '1');
    renderReview();
  }));
}

boot();
