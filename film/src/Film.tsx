import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';
import {AppWindow, OrbitGlyph, WIN_W, WIN_H} from './App';
import {SettingsModal, FileChip, Cursor, ADD_BTN, DROP_CENTER, ORBIT_CARD} from './Settings';
import {plain, orbit, FONT, ORBIT_ICON_GRADIENT, shimmer} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: ease});
const window1 = (f: number, a: number, b: number, fade = 10) => Math.min(ramp(f, a, a + fade), 1 - ramp(f, b - fade, b));

import './font';

// Camera keys: [frame, zoom, focusX, focusY] in window coordinates; each move eases over MOVE frames.
const MOVE = 24;
const F = T.features;
const CAM: [number, number, number, number][] = [
  [0, 1, 800, 450],
  [T.settingsOpen - 10, 1.1, 800, 450],
  [T.morphStart, 1.0, 800, 450],
  [F[0] - 18, 1.9, 260, 285],
  [F[1] - 14, 1.15, 380, 470],
  [F[2] - 14, 2.4, 210, 285],
  [F[3] - 14, 1.55, 260, 470],
  [F[4] - 14, 2.5, 185, 536],
  [F[5] - 14, 1.45, 965, 560],
  [F[6] - 14, 1.6, 1000, 740],
  [T.endCard - 10, 0.92, 800, 450],
];
const camera = (f: number) => {
  let [, s, x, y] = CAM[0];
  for (let i = 1; i < CAM.length; i++) {
    const [k, s2, x2, y2] = CAM[i];
    const p = ramp(f, k, k + MOVE);
    s = s + (s2 - s) * p;
    x = x + (x2 - x) * p;
    y = y + (y2 - y) * p;
  }
  return {s, x, y};
};

// Soft nebula only, like the theme's conversation background (no stars).
const Space = ({opacity}: {opacity: number}) => (
  <AbsoluteFill style={{opacity, background: 'radial-gradient(80% 70% at 78% 8%,#2a1f5c 0%,#0000 60%),radial-gradient(70% 60% at 8% 100%,#123a5a 0%,#0000 65%),#05070d'}} />
);

const Caption = ({f, from, to, text, sub, big, top}: {f: number; from: number; to: number; text: string; sub?: string; big: boolean; top?: boolean}) => {
  const {fps} = useVideoConfig();
  if (f < from - 2 || f > to + 2) return null;
  const inn = spring({frame: f - from, fps, config: {damping: 18, stiffness: 160}});
  const out = ramp(f, to - 8, to);
  const o = Math.min(inn, 1 - out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, ...(top ? {top: big ? 40 : 60} : {bottom: big ? 46 : 120}), display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - inn) * 24 + out * 10}px)`}}>
      <div
        style={{
          fontFamily: FONT,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: big ? '16px 28px 16px 18px' : '14px 24px 14px 16px',
          borderRadius: 18,
          background: 'rgba(8,10,18,.86)',
          border: '1px solid rgba(139,124,246,.38)',
          boxShadow: '0 14px 50px rgba(0,0,0,.55), 0 0 30px rgba(139,124,246,.18)',
          maxWidth: big ? 1500 : 980,
        }}
      >
        <div style={{width: big ? 40 : 46, height: big ? 40 : 46, flex: 'none', borderRadius: 11, background: ORBIT_ICON_GRADIENT, display: 'grid', placeItems: 'center'}}>
          <OrbitGlyph size={big ? 28 : 32} />
        </div>
        <div>
          <div style={{fontSize: big ? 40 : 44, fontWeight: 650, color: '#EEF0F7', letterSpacing: '-.02em', lineHeight: 1.15}}>{text}</div>
          {sub ? <div style={{fontSize: big ? 22 : 26, color: '#A6ADC2', marginTop: 4}}>{sub}</div> : null}
        </div>
      </div>
    </div>
  );
};

const FEATURES = [
  {text: 'Pinned chats, back on top', sub: 'Under their own “Pinned” label'},
  {text: 'Your pinned chats are now Flight Directors', sub: 'Plus Active Crew, In Orbit, Landed, Mission Log and New mission'},
  {text: 'Pinned, compact', sub: 'Icon, title, model logo and time'},
  {text: 'Orbit icons for chats without a project', sub: 'A small violet orbit, so loose chats stand out'},
  {text: 'A little orbit on hover', sub: 'The icon spins while you point at it'},
  {text: 'T3’s own font', sub: 'Inter and T3’s own message typography'},
  {text: 'Deep-space glow', sub: 'A soft nebula and a glowing send button'},
];

const EndCard = ({f}: {f: number}) => {
  const {fps} = useVideoConfig();
  const a = spring({frame: f - T.endCard - 6, fps, config: {damping: 16}});
  const b = spring({frame: f - T.endCard - 20, fps, config: {damping: 18}});
  const c = spring({frame: f - T.endCard - 32, fps, config: {damping: 18}});
  const ang = (f - T.endCard) / 22;
  const px = 50 + 44 * Math.cos(ang), py = 50 + 18 * Math.sin(ang);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: FONT, opacity: ramp(f, T.endCard, T.endCard + 14)}}>
      <div style={{position: 'relative', width: 200, height: 200, opacity: a, transform: `scale(${0.7 + 0.3 * a})`}}>
        <svg width={200} height={200} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="og" x1="0" x2="1">
              <stop offset="0" stopColor="#A99DFA" />
              <stop offset="1" stopColor="#6FD3FF" />
            </linearGradient>
            <radialGradient id="core">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#8B7CF6" />
            </radialGradient>
          </defs>
          <g transform="rotate(-25 50 50)">
            <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="url(#og)" strokeWidth="2.4" />
            <circle cx={px} cy={py} r="4.2" fill="#6FD3FF" style={{filter: 'drop-shadow(0 0 4px #6FD3FF)'}} />
          </g>
          <circle cx="50" cy="50" r="13" fill="url(#core)" style={{filter: 'drop-shadow(0 0 10px #8B7CF6)'}} />
        </svg>
      </div>
      <div style={{marginTop: 26, fontSize: 112, fontWeight: 700, letterSpacing: '-.04em', color: '#F2F3F8', opacity: b, transform: `translateY(${(1 - b) * 20}px)`, display: 'flex', gap: 26}}>
        T3 <span style={{...shimmer(f), fontWeight: 650}}>Orbit</span>
      </div>
      <div style={{marginTop: 10, fontSize: 32, color: '#A6ADC2', opacity: c}}>a fork of T3 Clawd</div>
      <div style={{marginTop: 30, fontSize: 30, fontWeight: 500, color: '#E8EAF2', opacity: c, padding: '12px 24px', borderRadius: 14, border: '1px solid rgba(139,124,246,.4)', background: 'rgba(139,124,246,.1)'}}>
        github.com/CollinCraig/t3-orbit
      </div>
    </AbsoluteFill>
  );
};

export const Film = ({square = false, withAudio = true}: {square?: boolean; withAudio?: boolean}) => {
  const f = useCurrentFrame();
  const {width: W, height: H} = useVideoConfig();
  const base = square ? 1000 / WIN_W : 0.97;
  const cy = square ? 455 : H / 2 - 8;
  const cam = camera(f);
  const scale = base * cam.s;

  // story state
  const open = Math.min(ramp(f, T.settingsOpen, T.settingsOpen + 12), 1 - ramp(f, T.settingsClose, T.morphStart + 8));
  const dropzone = ramp(f, T.clickAdd + 2, T.clickAdd + 14);
  const dropFlash = Math.max(0, 1 - Math.abs(f - T.drop - 4) / 14) * (f >= T.drop ? 1 : 0);
  const orbitCard = ramp(f, T.drop + 6, T.drop + 18);
  const orbitSelected = f >= T.selectOrbit;

  // cursor path (window coords)
  const start = {x: 1180, y: 620};
  const chipStart = {x: 1820, y: 760};
  const cursorKeys: [number, number, number][] = [
    [T.settingsOpen, start.x, start.y],
    [T.clickAdd - 18, ADD_BTN.x + 4, ADD_BTN.y + 2],
    [T.dragStart, chipStart.x, chipStart.y],
    [T.drop - 4, DROP_CENTER.x, DROP_CENTER.y],
    [T.selectOrbit - 14, ORBIT_CARD.x + 10, ORBIT_CARD.y + 8],
  ];
  let cx = cursorKeys[0][1], cyy = cursorKeys[0][2];
  for (let i = 1; i < cursorKeys.length; i++) {
    const p = ramp(f, cursorKeys[i - 1][0] + (i === 3 ? 2 : 0), cursorKeys[i][0]);
    cx += (cursorKeys[i][1] - cx) * p;
    cyy += (cursorKeys[i][2] - cyy) * p;
  }
  // chip appears offstage, travels with the cursor while dragging
  const chipVis = f >= T.dragStart - 14 && f < T.drop + 6;
  const chipIn = ramp(f, T.dragStart - 14, T.dragStart);
  const chipPos = f < T.dragStart ? {x: chipStart.x + 160 * (1 - chipIn), y: chipStart.y} : {x: cx, y: cyy};
  const chipScale = f >= T.drop ? 1 - ramp(f, T.drop, T.drop + 6) : 1;
  const clickPulse = (k: number) => Math.max(0, 1 - Math.abs(f - k) / 4);
  const press = Math.max(clickPulse(T.clickAdd), clickPulse(T.drop), clickPulse(T.selectOrbit));
  const HOVER = {x: 200, y: 536}; // "Plan the launch" row in the Orbit sidebar
  const hoverCursor = f >= F[4] - 4 && f < F[4] + T.featureLen;
  if (hoverCursor) {
    const p = ramp(f, F[4] - 4, F[4] + 12);
    cx = 420 + (HOVER.x - 420) * p;
    cyy = 640 + (HOVER.y - 640) * p;
  }
  const cursorVis = (f >= T.settingsOpen && f < T.settingsClose + 6) || hoverCursor;

  // morph: a circle of Orbit sweeps out from the chosen card
  const m = interpolate(f, [T.morphStart, T.morphEnd], [0, 1], {...clamp, easing: Easing.bezier(0.6, 0, 0.25, 1)});
  const R = m * 2100;
  const morphed = f >= T.morphEnd;

  // feature focus
  const fw = (i: number) => window1(f, F[i] - 2, F[i] + T.featureLen - 8, 14);
  const HF = F[4];
  const hoverOn = f >= HF + 12 && f < HF + T.featureLen + 4;
  const spin = hoverOn ? ((f - (HF + 12)) / (4 * 30)) * 360 : 0; // @keyframes s, 4 s per turn
  const focus = {pinned: fw(0), names: fw(1), compact: fw(2), orbitIcons: fw(3), hover: hoverOn ? T.hoverRow : undefined, spin, font: fw(5), glow: fw(6)};
  const typeStart = F[6] + T.typeDelay;
  const typedText = 'Ship it.';
  const nType = Math.max(0, Math.min(typedText.length, Math.floor((f - typeStart) / T.typeEvery) + 1));
  const typed = f >= typeStart && f < T.endCard ? typedText.slice(0, nType) : '';

  // wordmark reveal
  const wm = window1(f, T.morphEnd - 18, F[0] - 6, 14);
  const wmPop = spring({frame: f - (T.morphEnd - 18), fps: 30, config: {damping: 14}});

  const winFade = 1 - ramp(f, T.endCard - 6, T.endCard + 10);
  const spaceOn = ramp(f, T.morphStart + 10, T.morphEnd + 10);

  const inner = (
    <div style={{position: 'absolute', left: 0, top: 0, width: WIN_W, height: WIN_H}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', boxShadow: spaceOn > 0 ? `0 40px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(139,124,246,${0.25 * spaceOn}), 0 0 80px rgba(139,124,246,${0.12 * spaceOn})` : '0 40px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08)'}}>
        {!morphed ? <AppWindow look={plain} frame={f} /> : null}
        {f >= T.morphStart ? (
          <div style={{position: 'absolute', inset: 0, clipPath: morphed ? undefined : `circle(${R}px at ${ORBIT_CARD.x}px ${ORBIT_CARD.y}px)`}}>
            <AppWindow look={orbit} focus={focus} typed={typed} frame={f} />
          </div>
        ) : null}
        <SettingsModal open={open} dropzone={dropzone} dropFlash={dropFlash} orbitCard={orbitCard} orbitSelected={orbitSelected} />
        {f >= T.morphStart && !morphed ? (
          <div
            style={{
              position: 'absolute',
              left: ORBIT_CARD.x - R,
              top: ORBIT_CARD.y - R,
              width: R * 2,
              height: R * 2,
              borderRadius: '50%',
              border: '3px solid rgba(169,157,250,.9)',
              boxShadow: '0 0 40px 8px rgba(139,124,246,.55), inset 0 0 60px rgba(111,211,255,.35)',
              opacity: 1 - m * 0.8,
            }}
          />
        ) : null}
      </div>
      {chipVis ? (
        <div style={{position: 'absolute', left: chipPos.x - 40, top: chipPos.y - 26}}>
          <FileChip scale={chipScale} />
        </div>
      ) : null}
      {cursorVis ? (
        <div style={{position: 'absolute', left: cx - 4, top: cyy - 3, transform: `scale(${1 - 0.15 * press})`, transformOrigin: '4px 3px'}}>
          <Cursor />
        </div>
      ) : null}
    </div>
  );

  return (
    <AbsoluteFill style={{background: '#0a0a0b', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'radial-gradient(70% 60% at 50% 40%,#1a1a1d,#060607)'}} />
      <Space opacity={spaceOn} />
      <div style={{position: 'absolute', left: W / 2, top: cy, opacity: winFade, transform: `scale(${scale}) translate(${-cam.x}px, ${-cam.y}px)`, transformOrigin: '0 0'}}>{inner}</div>

      {wm > 0 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: wm, pointerEvents: 'none'}}>
          <div style={{fontFamily: FONT, fontSize: square ? 120 : 150, fontWeight: 700, letterSpacing: '-.04em', color: '#F2F3F8', display: 'flex', gap: 30, transform: `scale(${0.85 + 0.15 * wmPop})`, textShadow: '0 10px 60px rgba(0,0,0,.8)', padding: '20px 60px', borderRadius: 40, background: 'radial-gradient(closest-side,rgba(5,7,13,.85),rgba(5,7,13,0))'}}>
            T3 <span style={{...shimmer(f), fontWeight: 650, filter: 'drop-shadow(0 0 24px rgba(139,124,246,.6))'}}>Orbit</span>
          </div>
        </AbsoluteFill>
      ) : null}

      <Caption f={f} from={8} to={T.settingsOpen - 4} text="T3 Code, out of the box." big={!square} />
      <Caption f={f} from={T.settingsOpen + 6} to={T.drop - 6} text="Settings → Appearance → Add a theme" big={!square} />
      <Caption f={f} from={T.drop - 2} to={T.morphStart + 4} text="Drop in t3-orbit.json" big={!square} />
      {FEATURES.map((c, i) => (
        <Caption key={i} f={f} from={F[i] + 4} to={F[i] + T.featureLen - 4} text={c.text} sub={c.sub} big={!square} top={i === 1} />
      ))}

      {f >= T.endCard ? <EndCard f={f} /> : null}
      <div style={{position: 'absolute', right: 26, top: 22, fontFamily: FONT, fontSize: 15, color: 'rgba(255,255,255,.45)', letterSpacing: '.02em', padding: '4px 10px', borderRadius: 8, background: 'rgba(5,7,13,.7)'}}>Recreated UI · demo data</div>
      {withAudio ? <Audio src={staticFile('score.wav')} /> : null}
    </AbsoluteFill>
  );
};
