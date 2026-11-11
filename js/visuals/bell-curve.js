// Bell curve with sliders for the mean and the standard deviation. The axes stay fixed so the
// spread really changes on screen: sigma = 2 is drawn twice as wide as sigma = 1.
import { normalPdf } from './maths.js';
import { slider } from './index.js';
import { tex } from '../render.js';

const W = 560, H = 250, PAD = { l: 34, r: 12, t: 12, b: 34 };
const X0 = -6, X1 = 6, Y1 = 0.85;
const sx = x => PAD.l + (x - X0) / (X1 - X0) * (W - PAD.l - PAD.r);
const sy = y => H - PAD.b - (y / Y1) * (H - PAD.t - PAD.b);

export default function bellCurve(el, opts) {
  let mu = opts.mu ?? 0, sigma = opts.sigma ?? 1;
  const showRef = opts.reference !== false;
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="A normal distribution curve. Move the sliders to change its mean and spread."></svg><div class="controls"></div><p class="caption"></p>`;
  const svg = el.querySelector('svg'), ctr = el.querySelector('.controls'), cap = el.querySelector('.caption');
  const path = pts => 'M' + pts.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join('L');
  const curve = (m, s) => { const pts = []; for (let i = 0; i <= 240; i++) { const x = X0 + (X1 - X0) * i / 240; pts.push([x, normalPdf(x, m, s)]); } return pts; };
  const ticks = [];
  for (let x = -6; x <= 6; x++) ticks.push(`<line x1="${sx(x)}" x2="${sx(x)}" y1="${sy(0)}" y2="${sy(0) + 5}" stroke="var(--ink-3)"/><text x="${sx(x)}" y="${sy(0) + 19}" text-anchor="middle" font-size="11" fill="var(--ink-3)" font-family="system-ui,sans-serif">${x}</text>`);
  const draw = () => {
    const band = curve(mu, sigma).filter(([x]) => x >= mu - sigma && x <= mu + sigma);
    const bandPath = band.length ? path([[band[0][0], 0], ...band, [band.at(-1)[0], 0]]) + 'Z' : '';
    const peak = normalPdf(mu, mu, sigma);
    svg.innerHTML = `
      <line x1="${PAD.l}" x2="${W - PAD.r}" y1="${sy(0)}" y2="${sy(0)}" stroke="var(--rule-2)"/>${ticks.join('')}
      ${showRef ? `<path d="${path(curve(0, 1))}" fill="none" stroke="var(--ink-3)" stroke-dasharray="4 4" stroke-width="1.2"/>` : ''}
      <path d="${bandPath}" fill="var(--cc)" fill-opacity=".16"/>
      <path d="${path(curve(mu, sigma))}" fill="none" stroke="var(--cc)" stroke-width="2.2"/>
      <line x1="${sx(mu)}" x2="${sx(mu)}" y1="${sy(0)}" y2="${sy(peak)}" stroke="var(--cc)" stroke-dasharray="2 3"/>
      <line x1="${sx(mu - sigma)}" x2="${sx(mu + sigma)}" y1="${sy(0) - 8}" y2="${sy(0) - 8}" stroke="var(--ink)" stroke-width="1.2" marker-start="url(#a)" marker-end="url(#a)"/>
      <defs><marker id="a" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6" fill="var(--ink)"/></marker></defs>`;
    cap.innerHTML = `Variance ${tex('\\sigma^2=' + (sigma * sigma).toFixed(2))}. About 68% of values land in the shaded band.${showRef ? ' Dashed: ' + tex('\\mathcal N(0,1)') + '.' : ''}`;
  };
  const a = slider(tex('\\mu'), -3, 3, 0.1, mu, v => v.toFixed(1), v => { mu = v; draw(); });
  const b = slider(tex('\\sigma'), 0.5, 2.5, 0.05, sigma, v => v.toFixed(2), v => { sigma = v; draw(); });
  ctr.append(a, b); a.init(); b.init();
}
