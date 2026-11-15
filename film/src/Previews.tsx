// README previews: short loops cropped from the same mock window (demo data only), plus a before/after still.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import './font';
import {AppWindow, WIN_W, WIN_H, Focus} from './App';
import {Cursor} from './Settings';
import {plain, orbit, FONT, shimmer} from './theme';

const BG = 'radial-gradient(80% 70% at 85% 0%,#2a1f5c 0%,#0000 60%),radial-gradient(70% 60% at 0% 100%,#123a5a 0%,#0000 65%),#05070d';

// Show the window region (x, y, w, h) at `scale`, placed at (left, top) inside the composition.
const Crop = ({x, y, w, h, scale, left, top, children, radius = 14}: {x: number; y: number; w: number; h: number; scale: number; left: number; top: number; children: React.ReactNode; radius?: number}) => (
  <div style={{position: 'absolute', left, top, width: w * scale, height: h * scale, overflow: 'hidden', borderRadius: radius, boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(139,124,246,.25)'}}>
    <div style={{position: 'absolute', left: -x * scale, top: -y * scale, width: WIN_W, height: WIN_H, transform: `scale(${scale})`, transformOrigin: '0 0'}}>{children}</div>
  </div>
);

/** 1. Sidebar: Flight Directors, Active Crew, Mission Log, New mission. The crew names glow in turn. */
export const PreviewSidebar = () => {
  const f = useCurrentFrame();
  const names = 0.5 - 0.5 * Math.cos((f / 90) * 2 * Math.PI); // 0 → 1 → 0 over the 3 s loop
  const focus: Focus = {names};
  return (
    <AbsoluteFill style={{background: BG}}>
      <Crop x={0} y={0} w={640} h={470} scale={1.125} left={20} top={16}>
        <AppWindow look={orbit} focus={focus} frame={f} />
      </Crop>
    </AbsoluteFill>
  );
};

/** 2. Orbit icon spinning on hover, plus the shimmering wordmark. 8 s = one shimmer loop, two spins. */
export const PreviewHover = () => {
  const f = useCurrentFrame();
  const spin = (f / 120) * 360; // @keyframes s: 4 s per turn
  const focus: Focus = {hover: 'Plan the launch', spin};
  const win = <AppWindow look={orbit} focus={focus} frame={f} />;
  return (
    <AbsoluteFill style={{background: BG, fontFamily: FONT}}>
      <Crop x={72} y={10} w={140} h={34} scale={3.4} left={(720 - 476) / 2} top={22} radius={12}>
        {win}
      </Crop>
      <div style={{position: 'absolute', left: 50, top: 168}}>
        <Crop x={10} y={444} w={280} h={176} scale={2.2} left={0} top={0}>
          {win}
        </Crop>
        <div style={{position: 'absolute', left: (160 - 10) * 2.2, top: (531 - 444) * 2.2}}>
          <div style={{transform: 'scale(1.6)', transformOrigin: '4px 3px'}}>
            <Cursor />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Before / after still: plain T3 Code next to T3 Orbit. */
export const BeforeAfter = () => {
  const s = 0.565;
  const label = (t: string, orbitLabel: boolean) => (
    <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 650, letterSpacing: '-.02em', color: '#EEF0F7', display: 'flex', gap: 10, marginBottom: 18}}>
      T3 {orbitLabel ? <span style={shimmer(60)}>Orbit</span> : <span style={{color: '#a3a3a3', fontWeight: 500}}>{t}</span>}
    </div>
  );
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: 36, top: 34}}>
        {label('Code', false)}
        <Crop x={0} y={0} w={WIN_W} h={WIN_H} scale={s} left={0} top={70}>
          <AppWindow look={plain} />
        </Crop>
      </div>
      <div style={{position: 'absolute', left: 36 + WIN_W * s + 36, top: 34}}>
        {label('', true)}
        <Crop x={0} y={0} w={WIN_W} h={WIN_H} scale={s} left={0} top={70}>
          <AppWindow look={orbit} frame={60} />
        </Crop>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 22, textAlign: 'center', fontFamily: FONT, fontSize: 20, color: 'rgba(255,255,255,.45)'}}>
        Recreated UI · demo data · same window, one theme file
      </div>
    </AbsoluteFill>
  );
};
