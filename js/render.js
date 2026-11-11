// Rendering: inline Markdown, KaTeX with clickable pieces, and content blocks.
import katex from '../vendor/katex/katex.mjs';
import { recordCheck, checkState } from './progress.js';
import { mountVisual } from './visuals/index.js';

const MACROS = {
  // \p{concept-id}{latex}: a clickable piece that links to a concept.
  '\\p': '\\htmlData{c=#1}{#2}',
  '\\E': '\\mathbb{E}',
  '\\N': '\\mathcal{N}',
};

export function tex(latex, display = false) {
  try {
    return katex.renderToString(latex, {
      displayMode: display, throwOnError: false, strict: 'ignore', output: 'html',
      macros: { ...MACROS }, trust: ctx => ctx.command === '\\htmlData',
    });
  } catch (e) {
    return `<code>${esc(latex)}</code>`;
  }
}

export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function inline(md) {
  if (!md) return '';
  const math = [];
  let s = md.replace(/\$([^$]+?)\$/g, (_, m) => { math.push(m); return `\u0000${math.length - 1}\u0000`; });
  s = esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(c:([\w-]+)\)/g, '<a class="concept-link" href="#" data-c="$2">$1</a>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<span class="m" data-latex="${esc(math[i])}">${tex(math[i])}</span>`);
}

export function displayMath(latex, extraClass = '') {
  return `<div class="formula ${extraClass}" data-latex="${esc(latex)}">${tex(latex, true)}</div>`;
}

// Render a node's blocks into an element. ctx: { node, nodes, onUnderstood }
export function renderBlocks(el, blocks, ctx) {
  const frag = document.createDocumentFragment();
  let firstFormula = true;
  for (const b of blocks) {
    const d = document.createElement('div');
    switch (b.type) {
      case 'heading':
        d.innerHTML = `<h${b.level} id="sec-${b.id}" tabindex="-1">${inline(b.text)}</h${b.level}>`;
        break;
      case 'para': d.innerHTML = `<p>${inline(b.text)}</p>`; break;
      case 'note': d.innerHTML = `<div class="notation"><p>${inline(b.text)}</p></div>`; break;
      case 'list': {
        const tag = b.ordered ? 'ol' : 'ul';
        d.innerHTML = `<${tag}>${b.items.map(t => `<li>${inline(t)}</li>`).join('')}</${tag}>`;
        break;
      }
      case 'formula': {
        // A textbook band: a word on the side, a plain title saying what the formula is for,
        // the formula, what it says in words, and what each symbol means, all together.
        const where = (b.where || []).length ? `<dl class="where">${b.where.map(([sym, txt]) =>
          `<div><dt>${inline(sym)}</dt><dd>${inline(txt)}</dd></div>`).join('')}</dl>` : '';
        d.innerHTML = band('Formula', b.label, displayMath(b.latex, firstFormula ? 'draw' : '') +
          (b.reading ? `<p class="reading">${inline(b.reading)}</p>` : '') + where);
        firstFormula = false;
        break;
      }
      case 'band': {
        d.innerHTML = band(b.tag, b.title, '');
        renderBlocks(d.querySelector('.band-body'), b.blocks, ctx);
        break;
      }
      case 'breakdown': d.appendChild(breakdown(b)); break;
      case 'notation':
        d.innerHTML = band('Notation', b.title, `<dl class="where">${b.rows.map(([sym, txt]) =>
          `<div><dt>${inline(sym)}</dt><dd>${inline(txt)}</dd></div>`).join('')}</dl>`);
        break;
      case 'check': d.appendChild(checkBlock(b, ctx)); break;
      case 'recall':
        break; // recall questions live in Review, not on the page
      case 'visual': {
        d.innerHTML = band('Try it', b.caption, '');
        const v = document.createElement('figure');
        v.className = 'visual';
        d.querySelector('.band-body').appendChild(v);
        mountVisual(v, b.name, b.opts, '');
        break;
      }
      case 'code':
        d.innerHTML = `<pre><code>${esc(b.text)}</code></pre>`;
        break;
    }
    while (d.firstChild) frag.appendChild(d.firstChild);
  }
  el.appendChild(frag);
  // Stagger the draw-in of the first formula's parts.
  el.querySelectorAll('.formula.draw .katex-html > .base').forEach((b, i) => { b.style.animationDelay = `${80 + i * 110}ms`; });
}

export function band(tag, title, inner) {
  const id = title ? ` id="sec-${slugify(title)}"` : '';
  return `<section class="band band-${slugify(tag)}"${id} data-toc="${esc(title ? title.replace(/\$[^$]*\$/g, m => m) : tag)}" tabindex="-1">
    <div class="band-tag">${esc(tag)}</div>
    <div class="band-body">${title ? `<h3 class="band-title">${inline(title)}</h3>` : ''}${inner}</div></section>`;
}
const slugify = t => String(t).toLowerCase().replace(/\$[^$]*\$/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'band';

function breakdown(b) {
  const wrap = document.createElement('div');
  wrap.className = 'breakdown';
  wrap.innerHTML = displayMath(b.latex) + `<ol>${b.items.map((it, i) =>
    `<li data-item="${i}" data-for="${esc(it.id)}"><div class="sym">${it.sym ? `<span class="m" data-latex="${esc(it.sym)}">${tex(it.sym)}</span>` : ''}</div><div class="txt"><p>${inline(it.text)}</p></div></li>`).join('')}</ol>`;
  // Highlight each piece in turn as the reader hovers / focuses its row.
  const light = (id, on) => wrap.querySelectorAll(`.formula [data-c="${CSS.escape(id)}"]`).forEach(p => p.classList.toggle('is-lit', on));
  wrap.querySelectorAll('li[data-for]').forEach(li => {
    const id = li.dataset.for;
    const on = () => { li.classList.add('is-active'); light(id, true); };
    const off = () => { li.classList.remove('is-active'); light(id, false); };
    li.addEventListener('mouseenter', on); li.addEventListener('mouseleave', off);
    li.addEventListener('focusin', on); li.addEventListener('focusout', off);
  });
  return wrap;
}

function checkBlock(b, ctx) {
  const node = ctx.node;
  const wrap = document.createElement('div');
  wrap.className = 'checks';
  const done = checkState(node.id);
  const base = ctx.checkOffset || 0;
  ctx.checkOffset = base + b.questions.length;
  b.questions.forEach((q, qi) => {
    const idx = base + qi;
    const box = document.createElement('div');
    box.className = 'check';
    box.innerHTML = `<div class="qn">${idx + 1}.</div><div class="q">${inline(q.q)}</div>`;
    const fb = document.createElement('div');
    const tools = document.createElement('div');
    tools.className = 'check-tools';
    const finish = ok => {
      const all = recordCheck(node, idx, ok);
      if (ok && all && ctx.onUnderstood) ctx.onUnderstood();
    };
    if (q.options.length) {
      const opts = document.createElement('div');
      opts.className = 'options';
      q.options.forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = inline(o.text);
        btn.addEventListener('click', () => {
          opts.querySelectorAll('.option').forEach(x => x.classList.remove('right', 'wrong'));
          btn.classList.add(o.correct ? 'right' : 'wrong');
          fb.className = 'feedback ' + (o.correct ? 'right' : 'wrong');
          fb.innerHTML = `<p><strong>${o.correct ? 'Right.' : 'Not quite.'}</strong> ${inline(o.why)}</p>`;
          finish(o.correct);
        });
        opts.appendChild(btn);
      });
      box.appendChild(opts);
    } else if (q.value !== undefined) {
      const row = document.createElement('div');
      row.className = 'num-row';
      row.innerHTML = `<input type="text" inputmode="decimal" aria-label="Your answer"><button class="btn">Check</button>`;
      const input = row.querySelector('input');
      const go = () => {
        const v = Number(input.value.replace(/[^\d.eE+-]/g, ''));
        const ok = input.value.trim() !== '' && Math.abs(v - q.value) <= q.tol;
        fb.className = 'feedback ' + (ok ? 'right' : 'wrong');
        fb.innerHTML = `<p><strong>${ok ? 'Right.' : 'Not quite.'}</strong> ${ok ? '' : inline(q.wrong || 'Look at the hint, then try again.')}</p>`;
        finish(ok);
      };
      row.querySelector('button').addEventListener('click', go);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      box.appendChild(row);
    }
    box.appendChild(fb);
    if (q.hint) tools.appendChild(reveal('Hint', `<p>${inline(q.hint)}</p>`, box));
    if (q.answer) tools.appendChild(reveal('Worked answer', `<p>${inline(q.answer)}</p>`, box));
    box.appendChild(tools);
    wrap.appendChild(box);
  });
  return wrap;
}

function reveal(label, html, box) {
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = label;
  let shown = null;
  btn.addEventListener('click', () => {
    if (shown) { shown.remove(); shown = null; btn.setAttribute('aria-expanded', 'false'); return; }
    shown = document.createElement('div');
    shown.className = 'feedback';
    shown.innerHTML = html;
    box.appendChild(shown);
    btn.setAttribute('aria-expanded', 'true');
  });
  return btn;
}
