// Noising slider for slide 19: a drawn test picture taken through n steps of the DDPM forward
// process, using the closed form x_n = sqrt(abar_n) x_0 + sqrt(1 - abar_n) eps.
// Schedule: beta from 1e-4 to 0.02 over N = 1000 steps (Ho et al. 2020).
import { linearBetas, alphaBars, gaussianArray, noisy } from './maths.js';
import { slider } from './index.js';
import { tex } from '../render.js';

const S = 96, N = 1000;

function testImage() {
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#9cc3dd'; g.fillRect(0, 0, S, S * .62);          // sky
  g.fillStyle = '#5f8f3e'; g.fillRect(0, S * .62, S, S);           // grass
  g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(S * .78, S * .2, S * .1, 0, 7); g.fill(); // sun
  g.fillStyle = '#c4553a'; g.fillRect(S * .2, S * .42, S * .34, S * .3); // house
  g.fillStyle = '#6b3b2a'; g.beginPath(); g.moveTo(S * .15, S * .43); g.lineTo(S * .37, S * .24); g.lineTo(S * .59, S * .43); g.fill(); // roof
  g.fillStyle = '#f4efe2'; g.fillRect(S * .27, S * .5, S * .08, S * .08); g.fillRect(S * .41, S * .5, S * .08, S * .08);
  g.fillStyle = '#3d2a1e'; g.fillRect(S * .34, S * .6, S * .07, S * .12);
  const d = g.getImageData(0, 0, S, S).data;
  const x0 = new Float64Array(S * S * 3);
  for (let i = 0, j = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) x0[j++] = d[i + k] / 127.5 - 1; // pixels → [-1, 1]
  return x0;
}

export default function noising(el) {
  const betas = linearBetas(N), ab = alphaBars(betas);
  const x0 = testImage();
  let seed = 3, eps = gaussianArray(x0.length, seed), n = 0;
  el.innerHTML = `<div class="noise-wrap"><canvas width="${S}" height="${S}" role="img" aria-label="A simple drawn picture of a house, with noise added according to the slider"></canvas><div><dl class="stats"></dl><svg viewBox="0 0 300 120" style="margin-top:.6rem" aria-label="How much picture and how much noise is left at each step"></svg></div></div>
    <div class="controls"></div><p style="margin:.4rem 0 0"><button class="btn">New noise</button></p><p class="caption"></p>`;
  const cv = el.querySelector('canvas'), g = cv.getContext('2d'), img = g.createImageData(S, S);
  const stats = el.querySelector('.stats'), chart = el.querySelector('svg'), cap = el.querySelector('.caption');
  const out = new Float64Array(x0.length);
  const cx = k => 10 + k / N * 280, cy = v => 105 - v * 95;
  let sig = 'M', noi = 'M';
  for (let k = 0; k <= N; k += 10) { sig += `${cx(k)},${cy(Math.sqrt(ab[k]))}${k < N ? 'L' : ''}`; noi += `${cx(k)},${cy(Math.sqrt(1 - ab[k]))}${k < N ? 'L' : ''}`; }
  const draw = () => {
    noisy(x0, eps, ab[n], out);
    for (let i = 0, j = 0; i < img.data.length; i += 4) {
      for (let k = 0; k < 3; k++) img.data[i + k] = Math.max(0, Math.min(255, (out[j++] + 1) * 127.5));
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    stats.innerHTML = `<dt>step ${tex('n')}</dt><dd>${n}</dd>
      <dt>${tex('\\beta_n')}</dt><dd>${n ? betas[n].toFixed(5) : '—'}</dd>
      <dt>${tex('\\alpha_n = 1-\\beta_n')}</dt><dd>${n ? (1 - betas[n]).toFixed(5) : '—'}</dd>
      <dt>${tex('\\bar\\alpha_n')}</dt><dd>${ab[n] < 1e-3 ? ab[n].toExponential(2) : ab[n].toFixed(4)}</dd>
      <dt>picture kept, ${tex('\\sqrt{\\bar\\alpha_n}')}</dt><dd>${Math.sqrt(ab[n]).toFixed(3)}</dd>
      <dt>noise, ${tex('\\sqrt{1-\\bar\\alpha_n}')}</dt><dd>${Math.sqrt(1 - ab[n]).toFixed(3)}</dd>`;
    chart.innerHTML = `<path d="${sig}" fill="none" stroke="var(--cc)" stroke-width="2"/><path d="${noi}" fill="none" stroke="var(--ink-3)" stroke-width="2" stroke-dasharray="4 3"/>
      <line x1="${cx(n)}" x2="${cx(n)}" y1="8" y2="105" stroke="var(--ink)" stroke-width="1"/>
      <line x1="10" x2="290" y1="105" y2="105" stroke="var(--rule-2)"/>
      <text x="12" y="${cy(1) + 12}" font-size="10" fill="var(--cc)" font-family="system-ui,sans-serif">picture</text>
      <text x="230" y="${cy(1) + 12}" font-size="10" fill="var(--ink-3)" font-family="system-ui,sans-serif">noise</text>
      <text x="10" y="118" font-size="9" fill="var(--ink-3)" font-family="system-ui,sans-serif">0</text><text x="290" y="118" text-anchor="end" font-size="9" fill="var(--ink-3)" font-family="system-ui,sans-serif">1000</text>`;
    cap.innerHTML = n === 0 ? 'Step 0 is the clean picture, ' + tex('x_0') + '. Drag the slider to add noise one step at a time.'
      : n < 300 ? `After ${n} steps the picture is still clear: each step only adds a tiny amount of noise.`
      : n < 700 ? `Around here the picture fades fast. The kept fraction ${tex('\\sqrt{\\bar\\alpha_n}')} shrinks because it is a product of many numbers just below 1.`
      : `By step ${n} almost nothing of the picture is left: ${tex('x_n')} is very close to pure noise, ${tex('\\mathcal N(0, I)')}.`;
  };
  const s = slider(tex('n'), 0, N, 1, 0, v => String(v), v => { n = v; draw(); });
  el.querySelector('.controls').append(s); s.init();
  el.querySelector('button').addEventListener('click', () => { seed++; eps = gaussianArray(x0.length, seed); draw(); });
}
