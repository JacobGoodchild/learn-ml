// Visual registry. A content block ```visual <name> mounts one of these. Planned visuals that are
// not built yet show a quiet placeholder pointing at docs/visuals.md.
import bellCurve from './bell-curve.js';
import noising from './noising.js';
import spreadKeeper from './spread-keeper.js';

const registry = { 'bell-curve': bellCurve, 'noising': noising, 'spread-keeper': spreadKeeper };

export function mountVisual(el, name, opts = {}, caption = '') {
  const fn = registry[name];
  if (!fn) {
    el.innerHTML = `<div class="placeholder">Planned visual “${name}”. Its spec is in docs/visuals.md.${caption ? ' ' + caption : ''}</div>`;
    return;
  }
  try { fn(el, opts); } catch (e) { console.error(e); el.innerHTML = `<div class="placeholder">This visual failed to load.</div>`; }
}

export const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export function slider(label, min, max, step, value, fmt, onInput, id) {
  const row = document.createElement('div');
  row.style.display = 'contents';
  const uid = id || ('s' + Math.random().toString(36).slice(2, 8));
  row.innerHTML = `<label for="${uid}">${label}</label><input id="${uid}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><span class="readout"></span>`;
  const input = row.querySelector('input'), out = row.querySelector('.readout');
  const upd = () => { const v = Number(input.value); out.innerHTML = fmt(v); onInput(v); };
  input.addEventListener('input', upd);
  row.init = upd;
  row.input = input;
  return row;
}
