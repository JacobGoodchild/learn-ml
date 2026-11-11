// One step of noising applied to many values at once: y = sqrt(1-beta) x + sqrt(beta) eps.
// Shows that the spread stays at 1 — and what goes wrong without the square roots.
import { gaussianArray, variance, normalPdf } from './maths.js';
import { slider } from './index.js';
import { tex } from '../render.js';

const W = 560, H = 220, PAD = 30, BINS = 48, X0 = -4, X1 = 4, N = 6000;

export default function spreadKeeper(el) {
  const x = gaussianArray(N, 7), eps = gaussianArray(N, 99);
  let beta = 0.3, roots = true;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histogram of ${N} values after one noising step"></svg>
    <div class="controls"></div>
    <p style="margin:.6rem 0 0"><label class="small"><input type="checkbox" checked> use the square roots</label></p>
    <p class="caption"></p>`;
  const svg = el.querySelector('svg'), cap = el.querySelector('.caption');
  const sx = v => PAD + (v - X0) / (X1 - X0) * (W - 2 * PAD);
  const sy = d => H - PAD - d / 0.6 * (H - 2 * PAD); // tallest possible peak here is 0.564 (variance 0.5)
  const draw = () => {
    const a = roots ? Math.sqrt(1 - beta) : 1 - beta, b = roots ? Math.sqrt(beta) : beta;
    const y = x.map((v, i) => a * v + b * eps[i]);
    const counts = new Array(BINS).fill(0), w = (X1 - X0) / BINS;
    for (const v of y) { const k = Math.floor((v - X0) / w); if (k >= 0 && k < BINS) counts[k]++; }
    const bars = counts.map((c, k) => { const d = c / (N * w); return `<rect x="${sx(X0 + k * w) + .5}" y="${sy(d)}" width="${sx(X0 + w) - sx(X0) - 1}" height="${sy(0) - sy(d)}" fill="var(--cc)" fill-opacity=".55"/>`; }).join('');
    let ref = 'M'; for (let i = 0; i <= 160; i++) { const v = X0 + (X1 - X0) * i / 160; ref += `${sx(v).toFixed(1)},${sy(normalPdf(v)).toFixed(1)}${i < 160 ? 'L' : ''}`; }
    const vy = variance(y), theory = a * a + b * b;
    svg.innerHTML = `${bars}<path d="${ref}" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 3"/><line x1="${PAD}" x2="${W - PAD}" y1="${sy(0)}" y2="${sy(0)}" stroke="var(--rule-2)"/>
      ${[-3, -2, -1, 0, 1, 2, 3].map(t => `<text x="${sx(t)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="var(--ink-3)" font-family="system-ui,sans-serif">${t}</text>`).join('')}`;
    cap.innerHTML = `Bars: ${N.toLocaleString('en-GB')} values after one step. Dashed line: the bell curve with spread 1 they started on. Measured variance <strong>${vy.toFixed(3)}</strong>; the rule predicts ${roots ? tex(`(1-\\beta)+\\beta = 1`) : tex(`(1-\\beta)^2+\\beta^2 = ${theory.toFixed(3)}`)}.${roots ? '' : ' Without the square roots the values bunch up, so after many steps everything would shrink towards 0 instead of becoming a standard bell curve.'}`;
  };
  const s = slider(tex('\\beta'), 0, 1, 0.01, beta, v => v.toFixed(2), v => { beta = v; draw(); });
  el.querySelector('.controls').append(s); s.init();
  el.querySelector('input[type=checkbox]').addEventListener('change', e => { roots = e.target.checked; draw(); });
}
