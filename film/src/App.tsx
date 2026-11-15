// A mock of the T3 Code window, demo data only: every repo, title, branch and number here is made up.
// "plain" follows native T3 Code (Nightly, Nov 2026): 3-line sidebar cards, breadcrumb header, tool-call timeline,
// composer with model/effort/access and an env bar. "orbit" is the same window with t3-orbit.json's CSS applied
// (Clawd's sidebar menu and 2-line rows, crew names, compact Flight Directors, orbit icons, glows).
import React from 'react';
import {Look, FONT, MONO, ORBIT_ICON_GRADIENT, shimmer} from './theme';

export const WIN_W = 1600;
export const WIN_H = 900;
export const SIDEBAR_W = 330;

type Card = {
  title: string;
  repo?: string; // undefined = chat without a project
  branch?: string;
  pr?: number;
  status: string;
  working?: boolean;
  pinned?: boolean;
  current?: boolean;
};

const CARDS: Card[] = [
  {title: 'Refactor auth', repo: 'acme/app', branch: 'app/refactor-auth-session', status: '3m', working: true},
  {title: 'Ship v2', repo: 'acme/app', branch: 'app/ship-v2-release', pr: 412, status: '14h', pinned: true},
  {title: 'Fix flaky test', repo: 'acme/app', branch: 'app/fix-flaky-checkout', status: '3m', working: true, current: true},
  {title: 'Plan the launch', status: '1h'},
  {title: 'Tidy CSS tokens', repo: 'acme/app', branch: 'app/tidy-css-tokens', pr: 418, status: '9m'},
  {title: 'Release notes', status: '2h', pinned: true},
  {title: 'Sketch onboarding', status: '1d'},
];

const BLUE = '#5b8cff';

// lucide-style icons, stroke 1.6
const I = ({d, size = 16, color = 'currentColor', sw = 1.6}: {d: React.ReactNode; size?: number; color?: string; sw?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none'}}>
    {d}
  </svg>
);
export const icons = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  folderPlus: <><path d="M12 10v6M9 13h6" /><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  square: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></>,
  msg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  pin: <><path d="M12 17v5" /><path d="M9 10.76V6h6v4.76l2 3.24H7z" /></>,
  up: <><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  terminal: <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  gauge: <><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1 1 17.4 0" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L2 10l8-8z" />,
  cloud: <path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9Z" />,
  branch: <><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="7" r="2" /><path d="M6 7v10M18 9a6 6 0 0 1-6 6H6" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  diff: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18" /></>,
  bookmark: <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
};

// Generic model mark (stands in for a provider logo; deliberately not any vendor's logo).
const ModelMark = ({color, size = 13}: {color: string; size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{flex: 'none'}}>
    <path d="M12 2c.6 4.8 2.9 7.4 10 10-7.1 2.6-9.4 5.2-10 10-.6-4.8-2.9-7.4-10-10 7.1-2.6 9.4-5.2 10-10z" />
  </svg>
);

export const OrbitGlyph = ({size, spin = 0}: {size: number; spin?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} style={{transform: `rotate(${spin}deg)`}}>
    <circle cx="12" cy="12" r="3.2" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-25 12 12)" />
  </svg>
);

// Project favicon for acme/app (made up): a small rounded tile.
const Favicon = ({size = 14}: {size?: number}) => (
  <div style={{width: size, height: size, borderRadius: size > 16 ? 5 : 3.5, background: 'linear-gradient(135deg,#3f8f6b,#2c6b52)', color: '#fff', fontSize: size * 0.62, fontWeight: 700, display: 'grid', placeItems: 'center', flex: 'none'}}>a</div>
);

const Spinner = ({color, frame, size = 12}: {color: string; frame: number; size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" style={{transform: `rotate(${frame * 9}deg)`, flex: 'none'}}>
    <path d="M12 3a9 9 0 1 1-9 9" strokeDasharray="2 3.2" />
  </svg>
);

export type Focus = {names?: number; pinned?: number; compact?: number; orbitIcons?: number; hover?: string; spin?: number; font?: number; glow?: number};

// ── native sidebar card (3 lines) ─────────────────────────────────────────────────────────────────────────────────────
const PlainCard = ({c, look, frame}: {c: Card; look: Look; frame: number}) => (
  <div style={{margin: '0 8px 4px', padding: '8px 10px', borderRadius: 10, background: c.current ? '#232327' : 'transparent', display: 'flex', flexDirection: 'column', gap: 3}}>
    <div style={{height: 18, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: look.muted2}}>
      {c.repo ? <Favicon /> : <I d={icons.msg} size={13} color={look.muted2} />}
      <span>{c.repo ?? 'No project'}</span>
      <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6}}>
        {c.pinned ? <I d={icons.pin} size={12} color={look.muted2} /> : null}
        {c.working ? (
          <span style={{color: BLUE, display: 'flex', alignItems: 'center', gap: 5}}>
            <Spinner color={BLUE} frame={frame} /> Working {c.status}
          </span>
        ) : (
          <span>{c.status}</span>
        )}
      </span>
    </div>
    <div style={{fontSize: 15, lineHeight: '21px', color: c.current ? '#f5f5f5' : '#b5b5ba', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.title}</div>
    {c.branch ? (
      <div style={{height: 18, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: look.muted2}}>
        <span style={{flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.branch}</span>
        {c.pr ? <span style={{color: BLUE, fontWeight: 500}}>#{c.pr}</span> : null}
        <I d={icons.diff} size={13} color={look.muted2} />
        <ModelMark color={look.muted2} />
      </div>
    ) : null}
  </div>
);

const DraftCard = ({look}: {look: Look}) => (
  <div style={{margin: '4px 8px 6px', padding: '8px 10px', borderRadius: 10, background: 'rgba(255,214,140,.07)', border: '1px solid rgba(255,214,140,.08)', display: 'flex', flexDirection: 'column', gap: 3}}>
    <div style={{height: 18, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: look.muted2}}>
      <I d={icons.edit} size={13} color="#d9b36a" />
      <Favicon />
      acme/app
      <span style={{marginLeft: 'auto', display: 'grid'}}><I d={icons.x} size={13} color={look.muted2} /></span>
    </div>
    <div style={{fontSize: 15, lineHeight: '21px', color: '#ededf0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Sketching a prompt, then I realized…</div>
  </div>
);

// ── Orbit card: Clawd's 2-line grid (icon | title … status / repo … #PR icons) ─────────────────────────────────────
const OrbitIcon = ({size, spin = 0}: {size: number; spin?: number}) => (
  <div style={{width: size, height: size, borderRadius: 6, background: ORBIT_ICON_GRADIENT, display: 'grid', placeItems: 'center', flex: 'none'}}>
    <OrbitGlyph size={size - 6} spin={spin} />
  </div>
);

const OrbitCard = ({c, look, frame, hi, compact, hover, spin}: {c: Card; look: Look; frame: number; hi?: number; compact?: boolean; hover?: boolean; spin?: number}) => (
  <div
    style={{
      position: 'relative',
      margin: '1px 8px',
      padding: compact ? '5px 10px' : '8px 10px',
      borderRadius: 10,
      display: 'grid',
      gridTemplateColumns: compact ? '22px minmax(0,1fr) auto auto' : '24px auto minmax(0,1fr) auto',
      gridTemplateRows: compact ? '20px' : '20px 18px',
      columnGap: 9,
      rowGap: 2,
      alignItems: 'center',
      background: c.current ? look.activeRow : hover ? 'rgba(127,127,127,.1)' : 'transparent',
      boxShadow: c.current ? look.activeRowShadow : 'none',
    }}
  >
    {hi ? <div style={{position: 'absolute', inset: -2, borderRadius: 12, boxShadow: `0 0 0 2px rgba(139,124,246,${0.9 * hi}), 0 0 24px rgba(111,211,255,${0.35 * hi})`}} /> : null}
    <div style={{gridColumn: 1, gridRow: compact ? 1 : '1 / 3', justifySelf: 'center', display: 'grid'}}>
      {c.repo ? <Favicon size={compact ? 18 : 22} /> : <OrbitIcon size={compact ? 18 : 22} spin={spin} />}
    </div>
    <div style={{gridColumn: compact ? 2 : '2 / 4', gridRow: 1, fontSize: 14, color: c.current ? '#fff' : look.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.title}</div>
    {compact ? (
      <>
        <div style={{gridColumn: 3, gridRow: 1, display: 'grid', opacity: 0.8}}><ModelMark color={look.muted} /></div>
        <div style={{gridColumn: 4, gridRow: 1, fontSize: 12, color: look.muted2}}>{c.status}</div>
      </>
    ) : (
      <>
        <div style={{gridColumn: 4, gridRow: 1, justifySelf: 'end', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, color: c.working ? '#A99DFA' : look.muted2}}>
          {c.working ? <Spinner color="#A99DFA" frame={frame} size={11} /> : null}
          {c.status}
        </div>
        <div style={{gridColumn: 2, gridRow: 2, fontSize: 12, color: look.muted, maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.repo ?? 'No project'}</div>
        <div style={{gridColumn: '3 / 5', gridRow: 2, justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: look.muted2}}>
          {c.pr ? <span style={{color: '#A99DFA', fontWeight: 500}}>#{c.pr}</span> : null}
          {c.repo ? <span style={{opacity: 0.7, display: 'grid'}}><I d={icons.diff} size={13} /></span> : null}
          {c.repo ? <span style={{opacity: 0.7, display: 'grid'}}><ModelMark color={look.muted2} /></span> : null}
        </div>
      </>
    )}
  </div>
);

const Shelf = ({label, count, look, open, style}: {label: string; count: number; look: Look; open?: boolean; style?: React.CSSProperties}) => (
  <div style={{height: 30, margin: '2px 8px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 500, color: look.muted, borderRadius: 10}}>
    <span style={style}>{label}</span>
    <span style={{fontSize: 12, color: '#8A91A6', fontWeight: 400}}>{count}</span>
    <span style={{display: 'grid', opacity: 0.8, transform: open ? undefined : 'rotate(-90deg)'}}><I d={icons.chevron} size={13} /></span>
  </div>
);

const SectionLabel = ({children, look}: {children: React.ReactNode; look: Look}) => (
  <div style={{padding: '10px 22px 4px', fontSize: 13.5, fontWeight: 500, color: look.muted}}>{children}</div>
);

// Native starry nebula band behind the traffic lights and title.
const STARS = Array.from({length: 46}, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return {x: r(1) * SIDEBAR_W, y: r(2) * 64, s: 0.6 + r(3) * 1.3, o: 0.3 + r(4) * 0.6};
});
const NebulaBand = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: SIDEBAR_W, height: 76, pointerEvents: 'none', overflow: 'hidden'}}>
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(60% 120% at 22% 0%,#4a2f86aa,#0000 70%),radial-gradient(55% 110% at 78% 0%,#22407a99,#0000 70%)', maskImage: 'linear-gradient(#000 40%,#0000)', WebkitMaskImage: 'linear-gradient(#000 40%,#0000)'}} />
    {STARS.map((st, i) => (
      <div key={i} style={{position: 'absolute', left: st.x, top: st.y, width: st.s, height: st.s, borderRadius: 9, background: '#fff', opacity: st.o * (1 - st.y / 70)}} />
    ))}
  </div>
);

const Sidebar = ({look, focus, frame}: {look: Look; focus: Focus; frame: number}) => {
  const nameHi = focus.names ?? 0;
  const nameStyle: React.CSSProperties = nameHi ? {color: `color-mix(in srgb, #C9C2FF ${Math.round(nameHi * 100)}%, ${look.muted})`, textShadow: `0 0 ${12 * nameHi}px rgba(139,124,246,${0.8 * nameHi})`} : {};
  const hiRow = (c: Card) => (!c.repo ? focus.orbitIcons : undefined);
  const rowProps = (c: Card) => ({hover: focus.hover === c.title, spin: focus.hover === c.title ? focus.spin : 0});
  const o = look.orbit;
  return (
    <div style={{position: 'relative', width: SIDEBAR_W, flex: `0 0 ${SIDEBAR_W}px`, background: look.sidebar, borderRight: `1px solid ${o ? 'rgba(127,127,127,.12)' : 'rgba(255,255,255,.06)'}`, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <NebulaBand />
      {/* title row */}
      <div style={{position: 'relative', height: 56, display: 'flex', alignItems: 'center', gap: 5, padding: '0 18px 0 92px', fontSize: 14.5, color: look.text}}>
        {o ? null : <span style={{marginRight: 8, display: 'grid'}}><I d={icons.square} size={16} color={look.muted} /></span>}
        {o ? (
          <>
            <span style={{fontWeight: 700, letterSpacing: '-.02em', marginLeft: 4}}>T3</span>
            <span style={{fontWeight: 600, letterSpacing: '-.01em', ...shimmer(frame)}}>Orbit</span>
          </>
        ) : (
          <span style={{fontWeight: 500}}>T3 Code</span>
        )}
      </div>
      {o ? (
        <div style={{padding: '8px 12px 0', display: 'flex', flexDirection: 'column', gap: 4}}>
          <div style={{height: 36, borderRadius: 10, background: 'rgba(127,127,127,.1)', border: '1px solid rgba(127,127,127,.18)', display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px', color: look.muted, fontSize: 14}}>
            <I d={icons.search} size={15} /> Search
          </div>
          {[['Projects', icons.folder], ['Add project', icons.folderPlus]].map(([label, ic]) => (
            <div key={label as string} style={{height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 14, color: look.text}}>
              <I d={ic as React.ReactNode} size={16} color={look.muted} /> {label as string}
            </div>
          ))}
          <div style={{position: 'relative', marginTop: 6, height: 30, borderRadius: 8, background: look.newChatBg, color: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, fontWeight: 500}}>
            <I d={icons.edit} size={15} color="#fff" /> <span style={nameHi ? nameStyle : undefined}>New mission</span>
            <span style={{position: 'absolute', right: 10, fontSize: 11.5, fontWeight: 500, letterSpacing: '.04em', color: 'rgba(255,255,255,.8)', background: 'rgba(0,0,0,.14)', padding: '2px 6px', borderRadius: 5}}>⌘N</span>
          </div>
        </div>
      ) : (
        <div style={{padding: '4px 12px 0', display: 'flex', flexDirection: 'column', gap: 2}}>
          <div style={{height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 14.5, color: '#d4d4d8'}}>
            <I d={icons.search} size={16} color={look.muted} /> Search
            <span style={{marginLeft: 'auto', display: 'grid'}}><I d={icons.edit} size={15} color={look.muted} /></span>
          </div>
          <div style={{height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 14.5, color: '#d4d4d8'}}>
            <I d={icons.folder} size={16} color={look.muted} /> All projects
            <span style={{marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center'}}>
              <I d={icons.chevron} size={14} color={look.muted} />
              <I d={icons.folderPlus} size={15} color={look.muted} />
            </span>
          </div>
        </div>
      )}

      <div style={{marginTop: o ? 8 : 6, position: 'relative'}}>
        {o ? (
          <>
            <div style={{position: 'relative'}}>
              {focus.pinned ? <div style={{position: 'absolute', inset: '2px 4px -2px', borderRadius: 12, boxShadow: `0 0 0 2px rgba(139,124,246,${0.9 * focus.pinned}), 0 0 30px rgba(111,211,255,${0.3 * focus.pinned})`}} /> : null}
              <SectionLabel look={look}><span style={nameStyle}>Flight Directors</span></SectionLabel>
              {CARDS.filter((c) => c.pinned).map((c) => <OrbitCard key={c.title} c={c} look={look} frame={frame} hi={focus.compact || hiRow(c)} compact {...rowProps(c)} />)}
            </div>
            <Shelf label="Active Crew" count={2} look={look} open style={nameStyle} />
            {CARDS.filter((c) => c.working).map((c) => <OrbitCard key={c.title} c={c} look={look} frame={frame} {...rowProps(c)} />)}
            <SectionLabel look={look}><span style={nameStyle}>Mission Log</span></SectionLabel>
            {CARDS.filter((c) => !c.working && !c.pinned).map((c) => <OrbitCard key={c.title} c={c} look={look} frame={frame} hi={hiRow(c)} {...rowProps(c)} />)}
          </>
        ) : (
          <>
            <DraftCard look={look} />
            {CARDS.map((c) => <PlainCard key={c.title} c={c} look={look} frame={frame} />)}
          </>
        )}
      </div>

      <div style={{marginTop: 'auto', paddingBottom: 10}}>
        {o ? (
          <>
            <Shelf label="In Orbit" count={2} look={look} style={nameStyle} />
            <Shelf label="Landed" count={5} look={look} style={nameStyle} />
          </>
        ) : null}
        <div style={{margin: '6px 12px 4px', height: 30, borderRadius: 8, background: o ? 'rgba(139,124,246,.16)' : 'rgba(64,110,240,.22)', color: o ? '#C9C2FF' : '#9cb8ff', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: 13}}>
          <I d={icons.download} size={14} /> Update available
          <span style={{marginLeft: 'auto', display: 'grid'}}><I d={icons.x} size={13} /></span>
        </div>
        {[['Usage', icons.gauge], ['Settings', icons.settings]].map(([label, ic]) => (
          <div key={label as string} style={{height: 32, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', fontSize: 14, color: o ? look.text : '#d4d4d8'}}>
            <I d={ic as React.ReactNode} size={16} color={look.muted} /> {label as string}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── conversation ─────────────────────────────────────────────────────────────────────────────────────────────────────
const Btn = ({children, look}: {children: React.ReactNode; look: Look}) => (
  <div style={{height: 28, display: 'flex', alignItems: 'center', borderRadius: 7, border: `1px solid ${look.orbit ? '#262D40' : 'rgba(255,255,255,.1)'}`, fontSize: 13, color: look.text, overflow: 'hidden'}}>
    {children}
  </div>
);

const RanCommand = ({cmd, look}: {cmd: string; look: Look}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: look.muted, height: 22}}>
    <I d={icons.terminal} size={14} color={look.muted} />
    <span style={{fontWeight: 500, color: look.orbit ? '#C2C7D6' : '#c8c8cc', flex: 'none'}}>Ran command</span>
    <span style={{fontFamily: MONO, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>{cmd}</span>
    <I d={icons.chevron} size={13} color={look.muted2} />
    <I d={icons.check} size={13} color={look.muted2} />
  </div>
);

const Collapsed = ({n, look}: {n: number; look: Look}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: look.muted, height: 22}}>
    <I d={icons.chevron} size={13} color={look.muted} /> <span style={{fontWeight: 500}}>+{n} previous tool calls</span>
  </div>
);

const Chat = ({look, focus, typed, frame}: {look: Look; focus: Focus; typed: string; frame: number}) => {
  const fontHi = focus.font ?? 0;
  const glow = focus.glow ?? 0;
  const done = typed.length > 0; // the agent finished; the user is typing the next message
  const md: React.CSSProperties = {fontSize: 14, lineHeight: 1.625, color: look.mdText};
  const o = look.orbit;
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: look.conversationBg, minWidth: 0}}>
      {/* header: breadcrumb + actions */}
      <div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 18px 0 22px', gap: 10, fontSize: 14.5, color: look.text, borderBottom: '1px solid transparent', borderImage: o ? `${look.headerBorder} 1` : undefined, borderBottomColor: o ? undefined : 'rgba(255,255,255,.06)'}}>
        <Favicon size={15} />
        <span style={{color: look.muted}}>app</span>
        <span style={{color: look.muted2}}>/</span>
        <span style={{fontWeight: 500}}>Fix flaky test</span>
        <div style={{marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center'}}>
          <Btn look={look}>
            <span style={{display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px'}}><I d={icons.wrench} size={13} color={look.muted} /> Setup Worktree</span>
            <span style={{borderLeft: `1px solid ${o ? '#262D40' : 'rgba(255,255,255,.1)'}`, padding: '0 6px', display: 'grid', alignSelf: 'stretch', placeItems: 'center'}}><I d={icons.chevron} size={13} color={look.muted} /></span>
          </Btn>
          <Btn look={look}>
            <span style={{display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px'}}><I d={icons.up} size={13} color={look.muted} /> Push</span>
            <span style={{borderLeft: `1px solid ${o ? '#262D40' : 'rgba(255,255,255,.1)'}`, padding: '0 6px', display: 'grid', alignSelf: 'stretch', placeItems: 'center'}}><I d={icons.chevron} size={13} color={look.muted} /></span>
          </Btn>
          <I d={icons.square} size={16} color={look.muted} />
        </div>
      </div>
      {/* timeline */}
      <div style={{flex: 1, padding: '0 0 40px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden'}}>
        <div style={{width: 780, display: 'flex', flexDirection: 'column', gap: 12}}>
          <p style={{...md, margin: 0, color: look.muted}}>
            …so the retry fires after the assertion has already run. That matches the one-in-eight failure rate in CI, and it explains why the spec never fails on its own.
          </p>
          <RanCommand look={look} cmd={'rg -n "setTimeout|retry" src/checkout --glob "*.ts"'} />
          <Collapsed n={9} look={look} />
          <RanCommand look={look} cmd="pnpm vitest run checkout.spec.ts --repeat 20 --reporter dot" />
          <Collapsed n={6} look={look} />
          <div style={{position: 'relative', ...md, marginTop: 4}}>
            {fontHi ? <div style={{position: 'absolute', inset: '-12px -16px', borderRadius: 14, boxShadow: `0 0 0 2px rgba(139,124,246,${0.85 * fontHi}), 0 0 40px rgba(111,211,255,${0.25 * fontHi})`}} /> : null}
            <p style={{margin: '0 0 .7em'}}>
              The flake comes from a retry timer that isn’t mocked. The spec passes alone and fails when the suite runs in parallel.
            </p>
            <p style={{margin: '0 0 .4em'}}>Here’s what I changed:</p>
            <ol style={{margin: '0 0 .7em', paddingLeft: '1.4em'}}>
              <li style={{margin: '.3em 0'}}>Mocked the clock in <code style={{fontFamily: MONO, fontSize: '.86em', padding: '.12em .38em', borderRadius: 5, background: 'rgba(127,127,127,.16)'}}>checkout.spec.ts</code>, so the retry runs at a fixed time.</li>
              <li style={{margin: '.3em 0'}}>Awaited the cart update before asserting the total.</li>
              <li style={{margin: '.3em 0'}}>Ran the spec 20 times in a row. All 20 passed.</li>
            </ol>
            <p style={{margin: 0}}>I’m running the changed tests once more.</p>
          </div>
          <RanCommand look={look} cmd="pnpm vitest run --changed --reporter dot" />
          <Collapsed n={3} look={look} />
          {done ? null : (
            <div style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: look.muted2, height: 22}}>
              <span style={{letterSpacing: 2, opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 8))}}>···</span> Working for 3m {31 + Math.floor(frame / 30)}s
            </div>
          )}
        </div>
      </div>
      {/* composer */}
      <div style={{padding: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: 800, position: 'relative'}}>
          <div style={{position: 'absolute', right: 14, top: -30, height: 22, display: 'flex', alignItems: 'center', gap: 6, padding: '0 9px', borderRadius: 7, border: `1px solid ${o ? '#262D40' : 'rgba(255,255,255,.08)'}`, fontSize: 12, color: look.muted}}>
            <I d={icons.bookmark} size={12} color={look.muted} /> Stash <span style={{color: look.muted2}}>2</span>
          </div>
          <div
            style={{
              borderRadius: 16,
              background: look.composer,
              border: `1px solid ${o && glow ? `rgba(139,124,246,${0.25 + 0.25 * glow})` : look.composerBorder}`,
              boxShadow: o ? look.composerShadow : 'none',
              padding: '14px 16px 10px',
            }}
          >
            <div style={{fontSize: 15, lineHeight: 1.5, height: 56, color: typed ? look.text : look.muted2}}>
              {typed || 'Ask anything, @tag files/folders, $use skills, or / for commands'}
              {typed ? <span style={{display: 'inline-block', width: 2, height: 18, marginLeft: 1, verticalAlign: -3, background: o ? look.accent : look.text}} /> : null}
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: look.text}}>
              <span style={{padding: '4px 8px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7}}>
                <ModelMark color={look.text} size={14} /> Nova 5.6 <I d={icons.chevron} size={12} color={look.muted} />
              </span>
              <span style={{padding: '4px 8px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 5, color: o ? '#A99DFA' : look.text}}>
                High <I d={icons.chevron} size={12} color={look.muted} />
              </span>
              <span style={{padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6}}>
                <I d={icons.lock} size={13} color={look.muted} /> Full access <I d={icons.chevron} size={12} color={look.muted} />
              </span>
              <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12}}>
                {done ? null : <Spinner color={look.muted} frame={frame} size={18} />}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    // native: red stop while working; Orbit paints the composer's round button violet (--o)
                    background: o ? look.sendBg : done ? '#f5f5f5' : '#e5484d',
                    boxShadow: o ? `0 1px 2px rgba(0,0,0,.25), 0 0 ${14 + 22 * glow}px rgba(139,124,246,${0.4 + 0.45 * glow})` : 'none',
                  }}
                >
                  {done ? <I d={icons.up} size={16} color={o ? '#fff' : '#000'} sw={2} /> : <div style={{width: 10, height: 10, borderRadius: 2, background: '#fff'}} />}
                </div>
              </span>
            </div>
          </div>
          {/* env bar */}
          <div style={{margin: '0 14px', height: 30, borderRadius: '0 0 12px 12px', background: o ? '#0E121C' : '#0f0f11', border: `1px solid ${o ? '#1d2333' : 'rgba(255,255,255,.06)'}`, borderTop: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px', fontSize: 12, color: look.muted2}}>
            <span style={{display: 'flex', alignItems: 'center', gap: 6}}><I d={icons.cloud} size={13} /> dev-1</span>
            <span style={{display: 'flex', alignItems: 'center', gap: 6}}><I d={icons.folder} size={13} /> Worktree</span>
            <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6}}><I d={icons.branch} size={13} /> app/fix-flaky-checkout <I d={icons.chevron} size={12} /></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppWindow = ({look, focus = {}, typed = '', frame = 0}: {look: Look; focus?: Focus; typed?: string; frame?: number}) => (
  <div style={{width: WIN_W, height: WIN_H, display: 'flex', background: look.canvas, fontFamily: FONT, color: look.text, position: 'relative', overflow: 'hidden', WebkitFontSmoothing: 'antialiased'}}>
    <div style={{position: 'absolute', left: 20, top: 22, display: 'flex', gap: 8, zIndex: 2}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 99, background: c}} />)}
    </div>
    <Sidebar look={look} focus={focus} frame={frame} />
    <Chat look={look} focus={focus} typed={typed} frame={frame} />
  </div>
);
