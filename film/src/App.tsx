// A mock of the T3 Code window, demo data only. Every name, title and path here is made up.
import React from 'react';
import {Look, FONT, MONO, ORBIT_ICON_GRADIENT, shimmer} from './theme';

export const WIN_W = 1600;
export const WIN_H = 900;
export const SIDEBAR_W = 290;

type Row = {title: string; sub: string; time: string; kind: 'project' | 'none'; mono?: string; hue?: string; active?: boolean; pinned?: boolean; working?: boolean};

const ROWS: Row[] = [
  {title: 'Refactor auth', sub: 'web-app', time: 'now', kind: 'project', mono: 'W', hue: '#3f8f6b', working: true},
  {title: 'Fix flaky test', sub: 'api', time: '12m', kind: 'project', mono: 'A', hue: '#b86b3a'},
  {title: 'Ship v2', sub: 'orbit-app', time: '18m', kind: 'project', mono: 'O', hue: '#5b6bd6', active: true, pinned: true},
  {title: 'Plan the launch', sub: 'No project', time: '1h', kind: 'none'},
  {title: 'Release notes', sub: 'No project', time: '2h', kind: 'none', pinned: true},
  {title: 'Tidy CSS tokens', sub: 'web-app', time: '3h', kind: 'project', mono: 'W', hue: '#3f8f6b'},
  {title: 'Sketch onboarding', sub: 'No project', time: '1d', kind: 'none'},
];

// A generic model mark for the compact rows (stands in for the provider logo; deliberately not any vendor's logo).
const ModelMark = ({color}: {color: string}) => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2c.6 4.8 2.9 7.4 10 10-7.1 2.6-9.4 5.2-10 10-.6-4.8-2.9-7.4-10-10 7.1-2.6 9.4-5.2 10-10z" />
  </svg>
);

// lucide-style icons, stroke 1.6
const I = ({d, size = 16, color = 'currentColor', sw = 1.6}: {d: React.ReactNode; size?: number; color?: string; sw?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
export const icons = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  msg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  pin: <><path d="M12 17v5" /><path d="M9 10.76V6h6v4.76l2 3.24H7z" /><path d="M8 2h8" /></>,
  up: <><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  terminal: <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
};

export const OrbitGlyph = ({size, spin = 0}: {size: number; spin?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} style={{transform: `rotate(${spin}deg)`}}>
    <circle cx="12" cy="12" r="3.2" />
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-25 12 12)" />
  </svg>
);

const RowIcon = ({r, look, size = 22, spin = 0}: {r: Row; look: Look; size?: number; spin?: number}) => {
  if (r.kind === 'project')
    return (
      <div style={{width: size, height: size, borderRadius: look.orbit ? 5 : 4, background: r.hue, color: '#fff', fontSize: size > 20 ? 12 : 10.5, fontWeight: 600, display: 'grid', placeItems: 'center'}}>
        {r.mono}
      </div>
    );
  if (look.orbit)
    return (
      <div style={{width: size, height: size, borderRadius: 6, background: ORBIT_ICON_GRADIENT, display: 'grid', placeItems: 'center'}}>
        <OrbitGlyph size={size - 6} spin={spin} />
      </div>
    );
  return (
    <div style={{width: 22, height: 22, display: 'grid', placeItems: 'center', color: look.muted}}>
      <I d={icons.msg} size={16} />
    </div>
  );
};

const ThreadRow = ({r, look, hi, compact, hover, spin}: {r: Row; look: Look; hi?: number; compact?: boolean; hover?: boolean; spin?: number}) => (
  <div
    style={{
      position: 'relative',
      margin: '1px 8px',
      padding: compact ? '5px 10px' : '8px 10px',
      borderRadius: look.radius,
      display: 'grid',
      gridTemplateColumns: compact ? '22px minmax(0,1fr) auto auto' : '24px minmax(0,1fr) auto',
      gridTemplateRows: compact ? '20px' : '20px 18px',
      columnGap: 9,
      rowGap: 2,
      alignItems: 'center',
      background: r.active ? look.activeRow : hover ? 'rgba(127,127,127,.1)' : 'transparent',
      boxShadow: r.active ? look.activeRowShadow : 'none',
    }}
  >
    {hi ? <div style={{position: 'absolute', inset: -2, borderRadius: look.radius + 2, boxShadow: `0 0 0 2px rgba(139,124,246,${0.9 * hi}), 0 0 24px rgba(111,211,255,${0.35 * hi})`}} /> : null}
    <div style={{gridColumn: 1, gridRow: compact ? 1 : '1 / 3', justifySelf: 'center', display: 'grid'}}>
      <RowIcon r={r} look={look} size={compact ? 18 : 22} spin={spin} />
    </div>
    <div style={{gridColumn: 2, gridRow: 1, fontSize: 14, color: r.active ? '#fff' : look.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
      {r.title}
    </div>
    {compact ? (
      <>
        <div style={{gridColumn: 3, gridRow: 1, display: 'grid', opacity: 0.8}}><ModelMark color={look.muted} /></div>
        <div style={{gridColumn: 4, gridRow: 1, fontSize: 12, color: look.muted2}}>{r.time}</div>
      </>
    ) : (
      <div style={{gridColumn: 3, gridRow: 1, fontSize: 12, color: r.working ? (look.orbit ? '#A99DFA' : look.muted) : look.muted2, display: 'flex', alignItems: 'center', gap: 5}}>
        {r.working ? <span style={{width: 6, height: 6, borderRadius: 9, background: look.orbit ? '#8B7CF6' : look.muted, boxShadow: look.orbit ? '0 0 6px #8B7CF6' : 'none'}} /> : null}
        {r.working ? 'Working' : r.time}
      </div>
    )}
    {compact ? null : <div style={{gridColumn: 2, gridRow: 2, fontSize: 12, color: look.muted}}>{r.sub}</div>}
    {!look.orbit && r.pinned ? (
      <div style={{gridColumn: 3, gridRow: 2, justifySelf: 'end', color: look.muted2}}>
        <I d={icons.pin} size={12} />
      </div>
    ) : null}
  </div>
);

const Shelf = ({label, count, look, open, style}: {label: string; count: number; look: Look; open?: boolean; style?: React.CSSProperties}) => (
  <div style={{height: 32, margin: '4px 8px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 500, color: look.muted, borderRadius: 10}}>
    <span style={style}>{label}</span>
    <span style={{fontSize: 12, color: look.orbit ? '#8A91A6' : look.muted2, fontWeight: 400}}>{count}</span>
    <span style={{display: 'grid', opacity: 0.8, transform: open ? undefined : 'rotate(-90deg)'}}><I d={icons.chevron} size={13} /></span>
  </div>
);

const SectionLabel = ({children, look}: {children: React.ReactNode; look: Look}) => (
  <div style={{padding: '12px 22px 4px', fontSize: 13.5, fontWeight: 500, color: look.muted}}>{children}</div>
);

export type Focus = {names?: number; pinned?: number; compact?: number; orbitIcons?: number; hover?: string; spin?: number; font?: number; glow?: number};

const Sidebar = ({look, focus, frame}: {look: Look; focus: Focus; frame: number}) => {
  const pinned = ROWS.filter((r) => r.pinned);
  const working = ROWS.filter((r) => r.working);
  const rest = ROWS.filter((r) => !r.working && !(look.orbit && r.pinned));
  const N = look.orbit
    ? {pinned: 'Flight Directors', working: 'Active Crew', snoozed: 'In Orbit', settled: 'Landed', recents: 'Mission Log', newChat: 'New mission'}
    : {pinned: '', working: 'Working', snoozed: 'Snoozed', settled: 'Settled', recents: 'Threads', newChat: 'New thread'};
  const nameHi = focus.names ?? 0;
  const nameStyle: React.CSSProperties = nameHi ? {color: `color-mix(in srgb, #C9C2FF ${Math.round(nameHi * 100)}%, ${look.muted})`, textShadow: `0 0 ${12 * nameHi}px rgba(139,124,246,${0.8 * nameHi})`} : {};
  const hiRow = (r: Row) => (look.orbit && r.kind === 'none' ? focus.orbitIcons : undefined);
  const rowProps = (r: Row) => ({hover: look.orbit && focus.hover === r.title, spin: look.orbit && focus.hover === r.title ? focus.spin : 0});
  return (
    <div style={{width: SIDEBAR_W, flex: `0 0 ${SIDEBAR_W}px`, background: look.sidebar, borderRight: `1px solid ${look.orbit ? 'rgba(127,127,127,.12)' : look.border}`, display: 'flex', flexDirection: 'column'}}>
      {/* wordmark */}
      <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 5, padding: '0 18px 0 84px', fontSize: 14.5, color: look.text}}>
        <span style={{fontWeight: 700, letterSpacing: '-.02em'}}>T3</span>
        {look.orbit ? (
          <span style={{fontWeight: 600, letterSpacing: '-.01em', ...shimmer(frame)}}>Orbit</span>
        ) : (
          <span style={{fontWeight: 500, color: look.muted}}>Code</span>
        )}
      </div>
      <div style={{padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4}}>
        <div style={{height: 36, borderRadius: look.orbit ? 10 : 8, background: look.orbit ? 'rgba(127,127,127,.1)' : 'rgba(255,255,255,.04)', border: `1px solid ${look.orbit ? 'rgba(127,127,127,.18)' : look.border}`, display: 'flex', alignItems: 'center', gap: 9, padding: '0 10px', color: look.muted, fontSize: 14}}>
          <I d={icons.search} size={15} /> Search
        </div>
        {[['Projects', icons.folder], ['Add project', icons.plus]].map(([label, ic]) => (
          <div key={label as string} style={{height: 34, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', fontSize: 14, color: look.text}}>
            <I d={ic as React.ReactNode} size={16} color={look.muted} /> {label as string}
          </div>
        ))}
        <div style={{position: 'relative', marginTop: look.orbit ? 6 : 8, height: look.orbit ? 30 : 36, borderRadius: 8, background: look.newChatBg, color: look.newChatFg, border: look.orbit ? 'none' : `1px solid ${look.border}`, boxShadow: look.orbit ? '0 1px 2px rgba(0,0,0,.25)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: look.orbit ? 7 : 8, fontSize: look.orbit ? 13 : 14, fontWeight: 500}}>
          <I d={icons.edit} size={16} color={look.newChatFg} /> <span style={look.orbit ? {...nameStyle, color: nameHi ? nameStyle.color : '#fff'} : undefined}>{N.newChat}</span>
          {look.orbit ? (
            <span style={{position: 'absolute', right: 10, fontSize: 11.5, fontWeight: 500, letterSpacing: '.04em', color: 'rgba(255,255,255,.8)', background: 'rgba(0,0,0,.14)', padding: '2px 6px', borderRadius: 5}}>⌘N</span>
          ) : null}
        </div>
      </div>
      <div style={{marginTop: 10, position: 'relative'}}>
        {look.orbit ? (
          <div style={{position: 'relative'}}>
            {focus.pinned ? <div style={{position: 'absolute', inset: '2px 4px -2px', borderRadius: 12, boxShadow: `0 0 0 2px rgba(139,124,246,${0.9 * focus.pinned}), 0 0 30px rgba(111,211,255,${0.3 * focus.pinned})`}} /> : null}
            <SectionLabel look={look}><span style={nameStyle}>{N.pinned}</span></SectionLabel>
            {pinned.map((r) => <ThreadRow key={r.title} r={r} look={look} hi={focus.compact || hiRow(r)} compact {...rowProps(r)} />)}
          </div>
        ) : null}
        <Shelf label={N.working} count={working.length} style={nameStyle} look={look} open />
        {working.map((r) => <ThreadRow key={r.title} r={r} look={look} {...rowProps(r)} />)}
        <SectionLabel look={look}><span style={nameStyle}>{N.recents}</span></SectionLabel>
        {rest.map((r) => <ThreadRow key={r.title} r={r} look={look} hi={hiRow(r)} {...rowProps(r)} />)}
      </div>
      <div style={{marginTop: 'auto'}}>
        <Shelf label={N.snoozed} count={2} style={nameStyle} look={look} />
        <Shelf label={N.settled} count={5} style={nameStyle} look={look} />
      </div>
      <div style={{padding: '8px 18px 14px', display: 'flex', alignItems: 'center', gap: 9, color: look.muted, fontSize: 13.5}}>
        <I d={icons.settings} size={16} /> Settings
      </div>
    </div>
  );
};

const Chat = ({look, focus, typed}: {look: Look; focus: Focus; typed: string}) => {
  const fontHi = focus.font ?? 0;
  const glow = focus.glow ?? 0;
  const md: React.CSSProperties = {fontSize: 14, lineHeight: 1.625, color: look.mdText};
  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', background: look.conversationBg, minWidth: 0}}>
      {/* header */}
      <div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 12, fontSize: 14, color: look.text, borderBottom: '1px solid transparent', borderImage: look.orbit ? `${look.headerBorder} 1` : undefined, borderBottomColor: look.orbit ? undefined : look.headerBorder}}>
        <span style={{fontWeight: 500}}>Ship v2</span>
        <span style={{color: look.muted, fontSize: 13}}>orbit-app</span>
        <div style={{marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center'}}>
          <span style={{color: look.orbit ? look.accent : look.muted, fontWeight: look.orbit ? 500 : 400, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', padding: '5px 9px', borderRadius: 6}}>
            <I d={icons.check} size={14} color={look.orbit ? look.accent : look.muted} /> Settle
          </span>
          <I d={icons.terminal} size={16} color={look.muted} />
        </div>
      </div>
      {/* messages */}
      <div style={{flex: 1, padding: '34px 0 0', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: 820, display: 'flex', flexDirection: 'column', gap: 22}}>
          <div style={{alignSelf: 'flex-end', maxWidth: '80%', background: look.bubble, borderRadius: look.orbit ? 14 : 12, padding: '10px 16px', fontSize: 15, lineHeight: 1.5, color: look.text}}>
            Can you get v2 ready to ship? Tests first, then the changelog.
          </div>
          <div style={{fontSize: 14.5, color: look.muted, display: 'flex', gap: 8, alignItems: 'center'}}>
            <I d={icons.terminal} size={15} /> Ran 128 tests · all passing · 3.2s
          </div>
          <div style={{position: 'relative', ...md}}>
            {fontHi ? <div style={{position: 'absolute', inset: '-14px -18px', borderRadius: 14, boxShadow: `0 0 0 2px rgba(139,124,246,${0.85 * fontHi}), 0 0 40px rgba(111,211,255,${0.25 * fontHi})`}} /> : null}
            <p style={{margin: '0 0 .6em'}}>
              On it. The suite is green and I fixed the one flaky test in{' '}
              <code style={{fontFamily: MONO, fontSize: '.86em', padding: '.12em .38em', borderRadius: 5, background: 'rgba(127,127,127,.16)'}}>checkout.spec.ts</code>. Here’s the plan:
            </p>
            <ol style={{margin: '.2em 0 .8em', paddingLeft: '1.4em'}}>
              <li style={{margin: '.25em 0'}}>Bump the version to <strong style={{fontWeight: 600}}>2.0.0</strong></li>
              <li style={{margin: '.25em 0'}}>Write the changelog from the merged pull requests</li>
              <li style={{margin: '.25em 0'}}>Tag the release and open the draft notes</li>
            </ol>
            <div style={{borderRadius: 10, background: look.code, border: `1px solid ${look.orbit ? 'transparent' : look.border}`, padding: '14px 16px', fontFamily: MONO, fontSize: 13, color: look.text}}>
              <span style={{color: look.orbit ? '#A99DFA' : '#9ab'}}>pnpm</span> test <span style={{color: look.muted}}>&amp;&amp;</span> <span style={{color: look.orbit ? '#A99DFA' : '#9ab'}}>pnpm</span> release --tag <span style={{color: look.orbit ? '#6FD3FF' : '#cba'}}>v2.0.0</span>
            </div>
          </div>
        </div>
      </div>
      {/* composer */}
      <div style={{padding: '0 0 26px', display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            width: 860,
            borderRadius: 14,
            background: look.composer,
            border: `1px solid ${look.orbit && glow ? `rgba(139,124,246,${0.25 + 0.25 * glow})` : look.composerBorder}`,
            boxShadow: look.orbit ? look.composerShadow : 'none',
            padding: '14px 16px 8px',
          }}
        >
          <div style={{fontSize: 15, lineHeight: 1.5, height: 46, color: typed ? look.text : look.muted2}}>
            {typed || 'Ask anything, @ to mention files'}
            {typed ? <span style={{display: 'inline-block', width: 2, height: 18, marginLeft: 1, verticalAlign: -3, background: look.orbit ? look.accent : look.text}} /> : null}
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: look.muted}}>
            <span style={{padding: '4px 8px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6}}>Opus 5.5 <I d={icons.chevron} size={12} /></span>
            <span style={{padding: '4px 8px', borderRadius: 7, color: look.orbit ? '#A99DFA' : look.muted}}>High</span>
            <span style={{marginLeft: 'auto', padding: '4px 8px'}}>Full access</span>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                background: look.sendBg,
                boxShadow: look.orbit ? `0 1px 2px rgba(0,0,0,.25), 0 0 ${14 + 22 * glow}px rgba(139,124,246,${0.4 + 0.45 * glow})` : 'none',
              }}
            >
              <I d={icons.up} size={16} color={look.orbit ? '#fff' : '#000'} sw={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppWindow = ({look, focus = {}, typed = '', frame = 0}: {look: Look; focus?: Focus; typed?: string; frame?: number}) => (
  <div style={{width: WIN_W, height: WIN_H, display: 'flex', background: look.canvas, fontFamily: FONT, color: look.text, position: 'relative', overflow: 'hidden', WebkitFontSmoothing: 'antialiased'}}>
    <div style={{position: 'absolute', left: 20, top: 20, display: 'flex', gap: 8, zIndex: 2}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 12, height: 12, borderRadius: 99, background: c}} />)}
    </div>
    <Sidebar look={look} focus={focus} frame={frame} />
    <Chat look={look} focus={focus} typed={typed} />
  </div>
);
