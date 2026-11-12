import { typeset } from '../math.js';
import { linearBetas, alphaBars, gaussianArray, noisy } from '../../js/visuals/maths.js';

typeset();
drawNoiseStrips();

// The strip under the diffusion chain: a drawn picture taken through the DDPM forward process,
// x_n = sqrt(abar_n) x_0 + sqrt(1 - abar_n) eps, with beta from 1e-4 to 0.02 over N = 1000 steps.
function drawNoiseStrips() {
  const S = 96, steps = [0, 50, 100, 200, 300, 450, 600, 1000];
  const pic = document.createElement('canvas'); pic.width = pic.height = S;
  const g = pic.getContext('2d');
  g.fillStyle = '#9cc3dd'; g.fillRect(0, 0, S, S * .62);
  g.fillStyle = '#5f8f3e'; g.fillRect(0, S * .62, S, S);
  g.fillStyle = '#f2c14e'; g.beginPath(); g.arc(S * .78, S * .2, S * .1, 0, 7); g.fill();
  g.fillStyle = '#c4553a'; g.fillRect(S * .2, S * .42, S * .34, S * .3);
  g.fillStyle = '#6b3b2a'; g.beginPath(); g.moveTo(S * .15, S * .43); g.lineTo(S * .37, S * .24); g.lineTo(S * .59, S * .43); g.fill();
  g.fillStyle = '#f4efe2'; g.fillRect(S * .27, S * .5, S * .08, S * .08); g.fillRect(S * .41, S * .5, S * .08, S * .08);
  g.fillStyle = '#3d2a1e'; g.fillRect(S * .34, S * .6, S * .07, S * .12);
  const d = g.getImageData(0, 0, S, S).data;
  const x0 = new Float64Array(S * S * 3);
  for (let i = 0, j = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) x0[j++] = d[i + k] / 127.5 - 1;
  const ab = alphaBars(linearBetas(1000));
  const eps = gaussianArray(x0.length, 3);
  const out = new Float64Array(x0.length);
  for (const strip of document.querySelectorAll('canvas.noise-strip')) {
    const c = strip.getContext('2d');
    steps.forEach((n, f) => {
      noisy(x0, eps, ab[n], out);
      const img = c.createImageData(S, S);
      for (let i = 0, j = 0; i < img.data.length; i += 4) {
        for (let k = 0; k < 3; k++) img.data[i + k] = Math.max(0, Math.min(255, (out[j++] + 1) * 127.5));
        img.data[i + 3] = 255;
      }
      c.putImageData(img, f * S, 0);
    });
  }
}

const slides = [...document.querySelectorAll('#deck .slide')];
const show = document.getElementById('show');
const stage = document.getElementById('stage');
const count = document.getElementById('count');
let current = 0;
let opener = null;

function render() {
  const copy = slides[current].cloneNode(true);
  copy.removeAttribute('id');
  // Canvases lose their pixels when cloned, so copy them across.
  const from = slides[current].querySelectorAll('canvas');
  copy.querySelectorAll('canvas').forEach((cv, i) => cv.getContext('2d').drawImage(from[i], 0, 0));
  stage.replaceChildren(copy);
  count.textContent = `${current + 1} / ${slides.length}`;
}

function go(i) {
  current = Math.max(0, Math.min(slides.length - 1, i));
  render();
}

function open(i = 0) {
  opener = document.activeElement;
  show.hidden = false;
  document.body.style.overflow = 'hidden';
  go(i);
  show.requestFullscreen?.().catch(() => {});
  document.getElementById('next').focus();
}

function close() {
  show.hidden = true;
  document.body.style.overflow = '';
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  slides[current].scrollIntoView({ block: 'center' });
  opener?.focus();
}

document.getElementById('present').addEventListener('click', () => open(0));
document.getElementById('prev').addEventListener('click', (e) => { e.stopPropagation(); go(current - 1); });
document.getElementById('next').addEventListener('click', (e) => { e.stopPropagation(); go(current + 1); });
document.getElementById('close').addEventListener('click', (e) => { e.stopPropagation(); close(); });

// Double-click a slide to present from there.
slides.forEach((slide, i) => slide.addEventListener('dblclick', () => open(i)));

// Click the right half for next, the left half for previous.
stage.addEventListener('click', (e) => {
  if (e.target.closest('a')) return;
  const { left, width } = stage.getBoundingClientRect();
  go(current + (e.clientX - left > width / 2 ? 1 : -1));
});

document.addEventListener('keydown', (e) => {
  if (show.hidden) return;
  const keys = {
    ArrowRight: 1, ArrowDown: 1, PageDown: 1,
    ArrowLeft: -1, ArrowUp: -1, PageUp: -1, Backspace: -1,
  };
  if (e.key === 'Escape') { close(); return; }
  if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
  else if (e.key in keys) go(current + keys[e.key]);
  else return;
  e.preventDefault();
});

// Leaving full screen with the browser's own Esc also closes the slideshow.
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && !show.hidden) close();
});
