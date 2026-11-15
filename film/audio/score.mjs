// T3 Orbit launch film score. Original, synthesized in code: no samples, nothing we don't own.
// Warm space pad (additive, slow detune) + a noise whoosh on the theme morph + small UI ticks, all placed from
// src/timing.json so every sound lands on its frame. Output: 48 kHz stereo 32-bit float WAV (mastered later by
// ffmpeg loudnorm to -16 LUFS). Usage: node audio/score.mjs out/score.wav
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const T = JSON.parse(fs.readFileSync(path.join(here, '../src/timing.json'), 'utf8'));
const SR = 48000;
const sec = (frame) => frame / T.fps;
const DUR = sec(T.total) + 0.2;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N), R = new Float32Array(N);
const dry = {L: new Float32Array(N), R: new Float32Array(N)}; // ticks: mostly dry

let seed = 7;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// ── pad ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Before the morph: one dim, low chord. After: a slow progression that brightens, one chord per feature beat.
const F = T.features;
const chords = [
  {at: 0, notes: [38, 50, 57, 64, 69]}, // D  (dim, low)
  {at: sec(T.morphStart + 20), notes: [38, 50, 57, 61, 64, 69, 76]}, // Dmaj9 opens up
  {at: sec(F[1]), notes: [35, 47, 54, 61, 62, 66, 73]}, // Bm9
  {at: sec(F[4]), notes: [31, 43, 50, 54, 57, 61, 69]}, // Gmaj9(#11-ish)
  {at: sec(F[6]), notes: [33, 45, 52, 57, 59, 64, 71]}, // A sus
  {at: sec(T.endCard), notes: [38, 50, 57, 61, 64, 69, 73, 76]}, // Dmaj9 home
];
const brightness = (t) => 0.25 + 0.75 * smooth((t - sec(T.morphStart)) / 1.6); // filter opens on the morph
for (let ci = 0; ci < chords.length; ci++) {
  const c = chords[ci];
  const start = Math.max(0, c.at - 0.4);
  const end = ci + 1 < chords.length ? chords[ci + 1].at + 1.2 : DUR;
  c.notes.forEach((m, vi) => {
    const f0 = midi(m);
    const high = m > 60;
    const voices = [-6, 0, 6].map((cents) => ({f: f0 * 2 ** (cents / 1200), ph: rnd() * 6.283}));
    const pan = ((vi % 2 ? 1 : -1) * (0.2 + 0.5 * (vi / c.notes.length)));
    const gL = Math.cos(((pan + 1) * Math.PI) / 4), gR = Math.sin(((pan + 1) * Math.PI) / 4);
    const level = (m < 45 ? 0.16 : 0.1) * (ci === 0 ? 0.8 : 1);
    for (let i = Math.floor(start * SR); i < Math.min(N, end * SR); i++) {
      const t = i / SR;
      const a = smooth((t - start) / 1.1) * (1 - smooth((t - (end - 1.2)) / 1.2));
      if (a <= 0) continue;
      const b = brightness(t);
      const vib = 1 + 0.0015 * Math.sin(6.283 * 0.21 * t + vi);
      let v = 0;
      for (const vo of voices) {
        const p = 6.283 * vo.f * vib * t + vo.ph;
        v += Math.sin(p) + 0.32 * b * Math.sin(2 * p) + 0.12 * b * Math.sin(3 * p);
      }
      v *= level * a * (high ? 0.35 + 0.65 * b : 1) / 3;
      L[i] += v * gL;
      R[i] += v * gR;
    }
  });
}
// end-card swell to the home chord, then fade
const fadeOut = (t) => 1 - smooth((t - (DUR - 2.2)) / 2.0);

// ── whoosh on the morph: band-passed noise sweeping up, panned left → right ───────────────────────────────────────────
{
  const t0 = sec(T.morphStart) - 0.45, len = sec(T.morphEnd - T.morphStart) + 1.1;
  let lp1 = 0, lp2 = 0, bp = 0, z1 = 0, z2 = 0;
  for (let i = Math.floor(t0 * SR); i < (t0 + len) * SR; i++) {
    const u = (i / SR - t0) / len;
    const fc = 250 * 2 ** (u * 4.2); // 250 Hz → ~4.5 kHz
    const q = 2.2;
    const w = (2 * Math.PI * fc) / SR, alpha = Math.sin(w) / (2 * q);
    // state-variable-ish band-pass via biquad (RBJ, constant skirt), recomputed per sample
    const b0 = alpha, a0 = 1 + alpha, a1 = -2 * Math.cos(w), a2 = 1 - alpha;
    const x = rnd() * 2 - 1;
    const y = (b0 * x - b0 * lp2 - a1 * z1 - a2 * z2) / a0;
    lp2 = lp1; lp1 = x; z2 = z1; z1 = y;
    bp = y;
    const env = Math.sin(Math.PI * Math.min(1, u * 1.25)) ** 2 * (u < 0.8 ? 1 : 1 - smooth((u - 0.8) / 0.2));
    const p = -0.8 + 1.6 * u;
    const v = bp * env * 1.1;
    L[i] += v * Math.cos(((p + 1) * Math.PI) / 4);
    R[i] += v * Math.sin(((p + 1) * Math.PI) / 4);
  }
  // a soft sub swell under it
  for (let i = Math.floor((t0 + 0.3) * SR); i < (t0 + len + 0.6) * SR; i++) {
    const t = i / SR - t0 - 0.3;
    const e = Math.sin(Math.PI * Math.min(1, t / (len + 0.3))) ** 2;
    const v = 0.22 * e * Math.sin(6.283 * 49 * t);
    L[i] += v; R[i] += v;
  }
}

// ── bells: wordmark reveal and end card (inharmonic partials, exponential decay) ─────────────────────────────────────
const bell = (t0, m, gain, panP = 0, decay = 1.6) => {
  const f = midi(m);
  const parts = [[1, 1], [2.01, 0.42], [2.76, 0.28], [5.4, 0.08]];
  const gL = Math.cos(((panP + 1) * Math.PI) / 4), gR = Math.sin(((panP + 1) * Math.PI) / 4);
  for (let i = Math.floor(t0 * SR); i < Math.min(N, (t0 + decay * 3) * SR); i++) {
    const t = i / SR - t0;
    let v = 0;
    for (const [k, a] of parts) v += a * Math.sin(6.283 * f * k * t) * Math.exp(-t * (k > 2 ? 3.5 : 1) / decay);
    v *= gain * Math.min(1, t / 0.004);
    L[i] += v * gL; R[i] += v * gR;
  }
};
[74, 78, 81, 85].forEach((m, k) => bell(sec(T.morphEnd - 16) + k * 0.09, m, 0.07, -0.4 + k * 0.27));
[69, 73, 76, 81, 85].forEach((m, k) => bell(sec(T.endCard + 6) + k * 0.12, m, 0.06, -0.5 + k * 0.25, 2.2));
F.forEach((fr, k) => bell(sec(fr + 4), [81, 83, 85, 88, 86, 85, 83][k], 0.035, k % 2 ? 0.35 : -0.35, 1.0));

// ── UI ticks (dry-ish) ───────────────────────────────────────────────────────────────────────────────────────────────
const tick = (t0, f = 2400, gain = 0.12, panP = 0, dec = 0.012) => {
  const gL = Math.cos(((panP + 1) * Math.PI) / 4), gR = Math.sin(((panP + 1) * Math.PI) / 4);
  for (let i = Math.floor(t0 * SR); i < Math.min(N, (t0 + 0.08) * SR); i++) {
    const t = i / SR - t0;
    const v = gain * (Math.sin(6.283 * f * t) * Math.exp(-t / dec) + 0.5 * Math.sin(6.283 * f * 0.5 * t) * Math.exp(-t / (dec * 1.6)));
    dry.L[i] += v * gL; dry.R[i] += v * gR;
  }
};
const thump = (t0, gain = 0.35) => {
  for (let i = Math.floor(t0 * SR); i < Math.min(N, (t0 + 0.35) * SR); i++) {
    const t = i / SR - t0;
    const f = 120 * Math.exp(-t * 9) + 52;
    const v = gain * Math.sin(6.283 * f * t) * Math.exp(-t * 11) * Math.min(1, t / 0.002);
    dry.L[i] += v; dry.R[i] += v;
  }
};
tick(sec(T.settingsOpen), 1800, 0.07, 0.1, 0.02);
tick(sec(T.clickAdd), 2600, 0.13, 0.3);
tick(sec(T.dragStart), 1500, 0.06, 0.6, 0.02);
thump(sec(T.drop), 0.32); tick(sec(T.drop), 2000, 0.09, 0.1);
tick(sec(T.selectOrbit), 2900, 0.12, 0.2);
F.forEach((fr) => tick(sec(fr + 2), 3200, 0.05, 0, 0.008));
for (let k = 0; k < 'Ship it.'.length; k++) tick(sec(F[6] + T.typeDelay + k * T.typeEvery), 3600 + rnd() * 500, 0.045, 0.25, 0.006);
// hover spin: a tiny rising shimmer
for (let k = 0; k < 6; k++) tick(sec(F[4] + 12) + k * 0.07, 3000 + k * 260, 0.025, -0.45, 0.02);

// ── reverb (Schroeder: 4 combs + 2 allpasses per side) on the wet bus ───────────────────────────────────────────────
const reverb = (x, combs, aps, fb = 0.84, damp = 0.35) => {
  const out = new Float32Array(N);
  for (const d of combs) {
    const buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      lp = y * (1 - damp) + lp * damp;
      buf[idx] = x[i] + lp * fb;
      out[i] += y / combs.length;
      idx = (idx + 1) % d;
    }
  }
  for (const d of aps) {
    const buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < N; i++) {
      const b = buf[idx];
      const y = -out[i] + b;
      buf[idx] = out[i] + b * 0.5;
      out[i] = y;
      idx = (idx + 1) % d;
    }
  }
  return out;
};
const s = SR / 44100;
const wetL = reverb(L, [1557, 1617, 1491, 1422].map((d) => Math.round(d * s * 1.6)), [225, 556].map((d) => Math.round(d * s)));
const wetR = reverb(R, [1580, 1640, 1514, 1445].map((d) => Math.round(d * s * 1.6)), [248, 579].map((d) => Math.round(d * s)));
const dL = new Float32Array(N), dR = new Float32Array(N);
for (let i = 0; i < N; i++) { dL[i] = dry.L[i]; dR[i] = dry.R[i]; }
const tickWetL = reverb(dL, [1116, 1188], [225]), tickWetR = reverb(dR, [1139, 1211], [248]);

// ── mix, gentle soft-clip, fade ──────────────────────────────────────────────────────────────────────────────────────
const outL = new Float32Array(N), outR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const g = fadeOut(i / SR) * smooth(i / SR / 0.25);
  const l = 0.62 * L[i] + 0.55 * wetL[i] + dry.L[i] + 0.25 * tickWetL[i];
  const r = 0.62 * R[i] + 0.55 * wetR[i] + dry.R[i] + 0.25 * tickWetR[i];
  outL[i] = Math.tanh(l * 1.1) * g;
  outR[i] = Math.tanh(r * 1.1) * g;
}

// ── write 32-bit float WAV ───────────────────────────────────────────────────────────────────────────────────────────
const outPath = process.argv[2] || 'out/score.wav';
fs.mkdirSync(path.dirname(outPath), {recursive: true});
const data = Buffer.alloc(N * 8);
for (let i = 0; i < N; i++) { data.writeFloatLE(outL[i], i * 8); data.writeFloatLE(outR[i], i * 8 + 4); }
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
fs.writeFileSync(outPath, Buffer.concat([h, data]));
console.log(`score: ${outPath} ${(N / SR).toFixed(2)} s`);
