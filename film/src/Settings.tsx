// Settings → Appearance, mocked in T3 Code's default dark look. Window coordinates.
import React from 'react';
import {plain, FONT, ORBIT_ICON_GRADIENT} from './theme';
import {OrbitGlyph, icons} from './App';

export const MODAL = {x: 330, y: 130, w: 940, h: 640};
const CARD_W = 150, CARD_H = 104, CARD_GAP = 14, CARDS_X = 236, CARDS_Y = 176;
export const ADD_BTN = {x: MODAL.x + 780, y: MODAL.y + 120};
export const DROPZONE = {x: MODAL.x + CARDS_X, y: MODAL.y + 330, w: 640, h: 150};
export const DROP_CENTER = {x: DROPZONE.x + DROPZONE.w / 2, y: DROPZONE.y + DROPZONE.h / 2};
export const ORBIT_CARD = {x: MODAL.x + CARDS_X + 3 * (CARD_W + CARD_GAP) + CARD_W / 2, y: MODAL.y + CARDS_Y + CARD_H / 2};

const L = plain;

const Card = ({name, swatch, selected, orbit, pop}: {name: string; swatch: string; selected: boolean; orbit?: boolean; pop?: number}) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 10,
      border: `1px solid ${selected ? (orbit ? '#8B7CF6' : L.accent) : L.border}`,
      boxShadow: selected ? `0 0 0 2px ${orbit ? '#8B7CF655' : 'rgba(80,120,255,.3)'}${orbit ? ', 0 0 24px #8B7CF655' : ''}` : 'none',
      background: L.surface,
      overflow: 'hidden',
      transform: pop !== undefined ? `scale(${0.6 + 0.4 * pop})` : undefined,
      opacity: pop !== undefined ? pop : 1,
    }}
  >
    <div style={{height: 64, background: swatch, position: 'relative'}}>
      {orbit ? (
        <div style={{position: 'absolute', left: 12, top: 12, width: 22, height: 22, borderRadius: 6, background: ORBIT_ICON_GRADIENT, display: 'grid', placeItems: 'center'}}>
          <OrbitGlyph size={16} />
        </div>
      ) : null}
    </div>
    <div style={{padding: '9px 12px', fontSize: 13, color: L.text, display: 'flex', alignItems: 'center', gap: 6}}>
      {name}
      {selected ? (
        <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={orbit ? '#A99DFA' : L.text} strokeWidth={2.2} style={{marginLeft: 'auto'}}>
          {icons.check}
        </svg>
      ) : null}
    </div>
  </div>
);

export const SettingsModal = ({open, dropzone, dropFlash, orbitCard, orbitSelected}: {open: number; dropzone: number; dropFlash: number; orbitCard: number; orbitSelected: boolean}) => {
  if (open <= 0) return null;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT, opacity: open}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)'}} />
      <div
        style={{
          position: 'absolute',
          left: MODAL.x,
          top: MODAL.y,
          width: MODAL.w,
          height: MODAL.h,
          borderRadius: 14,
          background: '#0c0c0c',
          border: `1px solid ${L.border}`,
          boxShadow: '0 30px 80px rgba(0,0,0,.6)',
          transform: `translateY(${(1 - open) * 18}px) scale(${0.97 + 0.03 * open})`,
          display: 'flex',
          overflow: 'hidden',
          color: L.text,
        }}
      >
        <div style={{width: 200, borderRight: `1px solid ${L.border}`, padding: '22px 12px', display: 'flex', flexDirection: 'column', gap: 2, fontSize: 14}}>
          <div style={{fontSize: 15, fontWeight: 600, padding: '0 10px 14px'}}>Settings</div>
          {['General', 'Appearance', 'Models', 'Keybindings', 'Archive'].map((n) => (
            <div key={n} style={{padding: '8px 10px', borderRadius: 7, background: n === 'Appearance' ? 'rgba(255,255,255,.07)' : 'transparent', color: n === 'Appearance' ? L.text : L.muted}}>
              {n}
            </div>
          ))}
        </div>
        <div style={{flex: 1, position: 'relative'}}>
          <div style={{position: 'absolute', left: CARDS_X - 200, top: 26, fontSize: 20, fontWeight: 600}}>Appearance</div>
          <div style={{position: 'absolute', left: CARDS_X - 200, top: 76, fontSize: 14, fontWeight: 500}}>Theme</div>
          <div style={{position: 'absolute', left: CARDS_X - 200, top: 98, fontSize: 13, color: L.muted}}>Pick a built-in theme or add your own.</div>
          <div
            style={{
              position: 'absolute',
              left: ADD_BTN.x - MODAL.x - 200 - 62,
              top: ADD_BTN.y - MODAL.y - 17,
              width: 124,
              height: 34,
              borderRadius: 7,
              border: `1px solid ${L.input}`,
              background: dropzone > 0 ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 13,
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>{icons.plus}</svg>
            Add a theme
          </div>
          <div style={{position: 'absolute', left: CARDS_X - 200, top: CARDS_Y, display: 'flex', gap: CARD_GAP}}>
            <Card name="Dark" swatch="linear-gradient(135deg,#000,#1a1a1a)" selected={!orbitSelected} />
            <Card name="Light" swatch="linear-gradient(135deg,#fafafa,#e4e4e7)" selected={false} />
            <Card name="System" swatch="linear-gradient(135deg,#000 50%,#fafafa 50%)" selected={false} />
            {orbitCard > 0 ? (
              <Card name="T3 Orbit" swatch="radial-gradient(120% 90% at 85% 0%,#2a1f5c,#0B0E16 70%)" selected={orbitSelected} orbit pop={orbitCard} />
            ) : null}
          </div>
          {dropzone > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: DROPZONE.x - MODAL.x - 200,
                top: DROPZONE.y - MODAL.y,
                width: DROPZONE.w,
                height: DROPZONE.h,
                borderRadius: 12,
                border: `1.5px dashed ${dropFlash > 0 ? `rgba(139,124,246,${0.5 + 0.5 * dropFlash})` : L.input}`,
                background: dropFlash > 0 ? `rgba(139,124,246,${0.14 * dropFlash})` : 'rgba(255,255,255,.02)',
                opacity: dropzone,
                transform: `translateY(${(1 - dropzone) * 10}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: L.muted,
                fontSize: 14,
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>{icons.file}</svg>
              Drop a theme file here, or paste Theme JSON
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const FileChip = ({scale = 1}: {scale?: number}) => (
  <div
    style={{
      fontFamily: FONT,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderRadius: 12,
      background: '#1b1b1d',
      border: '1px solid rgba(255,255,255,.14)',
      boxShadow: '0 18px 40px rgba(0,0,0,.55)',
      color: '#f5f5f5',
      fontSize: 15,
      fontWeight: 500,
      transform: `scale(${scale})`,
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{width: 30, height: 36, borderRadius: 5, background: ORBIT_ICON_GRADIENT, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, color: '#fff'}}>JSON</div>
    t3-orbit.json
  </div>
);

export const Cursor = () => (
  <svg width={26} height={26} viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.5))'}}>
    <path d="M4 2.5v17.2l4.6-4.4 2.9 6.7 3-1.3-2.9-6.6h6.3z" fill="#fff" stroke="#000" strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);
