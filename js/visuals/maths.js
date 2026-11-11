// Pure maths used by the visuals. Checked by tests/maths.test.mjs — keep these functions honest.

export function normalPdf(x, mu = 0, sigma = 1) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

// Small seeded random number generator, so the same "noise" is reused as a slider moves.
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Standard normal samples (Box–Muller).
export function gaussian(rand) {
  let u = 0;
  while (u === 0) u = rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function gaussianArray(n, seed = 1) {
  const r = rng(seed);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = gaussian(r);
  return out;
}

// DDPM linear schedule: beta_1 = 1e-4 up to beta_N = 0.02, N = 1000 (Ho et al. 2020, Sec. 4).
// Returned arrays are indexed 1..N (index 0 unused, so code matches the maths).
export function linearBetas(N = 1000, b1 = 1e-4, bN = 0.02) {
  const betas = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) betas[n] = N === 1 ? b1 : b1 + (bN - b1) * (n - 1) / (N - 1);
  return betas;
}

// alpha-bar_n = product of alpha_i = (1 - beta_i) for i = 1..n. alphaBar[0] = 1 (no noise yet).
export function alphaBars(betas) {
  const N = betas.length - 1;
  const ab = new Float64Array(N + 1);
  ab[0] = 1;
  for (let n = 1; n <= N; n++) ab[n] = ab[n - 1] * (1 - betas[n]);
  return ab;
}

// x_n = sqrt(abar) x_0 + sqrt(1 - abar) eps, element by element.
export function noisy(x0, eps, abar, out = new Float64Array(x0.length)) {
  const a = Math.sqrt(abar), b = Math.sqrt(1 - abar);
  for (let i = 0; i < x0.length; i++) out[i] = a * x0[i] + b * eps[i];
  return out;
}

export function mean(xs) { let s = 0; for (const x of xs) s += x; return s / xs.length; }
export function variance(xs) { const m = mean(xs); let s = 0; for (const x of xs) s += (x - m) ** 2; return s / xs.length; }

// Fraction of a normal distribution within k standard deviations of the mean (numerical integral).
export function withinK(k, steps = 4000) {
  let s = 0; const h = (2 * k) / steps;
  for (let i = 0; i < steps; i++) { const x = -k + (i + 0.5) * h; s += normalPdf(x) * h; }
  return s;
}
