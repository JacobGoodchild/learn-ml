// Run with: node tests/maths.test.mjs
// Checks that the maths behind the visuals is numerically honest.
import { normalPdf, gaussianArray, linearBetas, alphaBars, noisy, mean, variance, withinK } from '../js/visuals/maths.js';

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'pass' : 'FAIL'}  ${msg}`); if (!cond) failed++; };
const close = (a, b, tol) => Math.abs(a - b) <= tol;

// Normal pdf integrates to 1 and has the right spread.
for (const [mu, s] of [[0, 1], [1.5, 2], [-2, 0.5]]) {
  let area = 0, m2 = 0; const h = 0.001;
  for (let x = mu - 12 * s; x < mu + 12 * s; x += h) { const p = normalPdf(x, mu, s); area += p * h; m2 += (x - mu) ** 2 * p * h; }
  ok(close(area, 1, 1e-4), `N(${mu}, ${s}^2) has area 1 (got ${area.toFixed(6)})`);
  ok(close(Math.sqrt(m2), s, 1e-3), `N(${mu}, ${s}^2) has standard deviation ${s} (got ${Math.sqrt(m2).toFixed(4)})`);
}
ok(close(normalPdf(0), 1 / Math.sqrt(2 * Math.PI), 1e-12), 'peak of N(0,1) is 1/sqrt(2 pi)');
ok(close(withinK(1), 0.6827, 1e-3), `68% within one sd (got ${withinK(1).toFixed(4)})`);
ok(close(withinK(2), 0.9545, 1e-3), `95% within two sd (got ${withinK(2).toFixed(4)})`);

// Sampler gives mean 0, variance 1.
const g = gaussianArray(200000, 5);
ok(close(mean(g), 0, 0.01), `sample mean ≈ 0 (got ${mean(g).toFixed(4)})`);
ok(close(variance(g), 1, 0.01), `sample variance ≈ 1 (got ${variance(g).toFixed(4)})`);

// DDPM schedule.
const b = linearBetas(1000), ab = alphaBars(b);
ok(b[1] === 1e-4 && close(b[1000], 0.02, 1e-15), 'beta_1 = 1e-4 and beta_1000 = 0.02');
ok(ab[0] === 1, 'abar_0 = 1');
ok(ab[1000] < 1e-4 && ab[1000] > 1e-5, `abar_1000 is tiny (got ${ab[1000].toExponential(3)}), so x_N is nearly pure noise`);
let mono = true; for (let n = 1; n <= 1000; n++) if (!(ab[n] < ab[n - 1])) mono = false;
ok(mono, 'abar_n strictly decreases');

// One step keeps variance 1 with the square roots, and shrinks it without them.
const x = gaussianArray(200000, 11), e = gaussianArray(200000, 12), beta = 0.3;
const y = x.map((v, i) => Math.sqrt(1 - beta) * v + Math.sqrt(beta) * e[i]);
ok(close(variance(y), 1, 0.01), `one step keeps variance 1 (got ${variance(y).toFixed(4)})`);
const z = x.map((v, i) => (1 - beta) * v + beta * e[i]);
ok(close(variance(z), (1 - beta) ** 2 + beta ** 2, 0.01), `without roots, variance is (1-b)^2+b^2 = ${((1 - beta) ** 2 + beta ** 2).toFixed(2)} (got ${variance(z).toFixed(4)})`);

// Closed form matches stepping one step at a time (in distribution: compare variances and correlation with x0).
const x0 = gaussianArray(50000, 21); let xs = Float64Array.from(x0);
for (let n = 1; n <= 200; n++) { const en = gaussianArray(50000, 1000 + n); for (let i = 0; i < xs.length; i++) xs[i] = Math.sqrt(1 - b[n]) * xs[i] + Math.sqrt(b[n]) * en[i]; }
const xc = noisy(x0, gaussianArray(50000, 77), ab[200]);
let cs = 0, cc = 0; for (let i = 0; i < x0.length; i++) { cs += xs[i] * x0[i]; cc += xc[i] * x0[i]; }
ok(close(cs / x0.length, Math.sqrt(ab[200]), 0.02) && close(cc / x0.length, Math.sqrt(ab[200]), 0.02), `200 single steps and the closed form both keep sqrt(abar_200) = ${Math.sqrt(ab[200]).toFixed(3)} of x0`);

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
