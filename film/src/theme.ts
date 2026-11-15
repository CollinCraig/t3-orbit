// Two looks for the same mock window. "plain" is T3 Code's default dark theme (tokens read from the app's own CSS,
// Nightly, Nov 2026). "orbit" reads its colours straight from ../../t3-orbit.json and copies the CSS values
// the theme sets (gradients, glows, radii), so the film shows what the theme actually does.
import orbitJson from '../../t3-orbit.json';

const c = orbitJson.colors;

export type Look = {
  id: 'plain' | 'orbit';
  canvas: string;
  chrome: string;
  sidebar: string;
  surface: string;
  raised: string;
  border: string;
  input: string;
  text: string;
  muted: string;
  muted2: string;
  accent: string;
  accentFg: string;
  bubble: string;
  code: string;
  composer: string;
  composerBorder: string;
  conversationBg: string;
  headerBorder: string;
  activeRow: string;
  activeRowShadow: string;
  sendBg: string;
  sendShadow: string;
  composerShadow: string;
  newChatBg: string;
  newChatFg: string;
  radius: number;
  orbit: boolean;
};

export const plain: Look = {
  id: 'plain',
  canvas: '#000000',
  chrome: '#000000',
  sidebar: '#0a0a0a',
  surface: '#111111',
  raised: '#161616',
  border: 'rgba(255,255,255,0.08)',
  input: 'rgba(255,255,255,0.11)',
  text: '#f5f5f5',
  muted: '#a3a3a3',
  muted2: '#7a7a7a',
  accent: 'oklch(57.1% 0.21 264)',
  accentFg: '#ffffff',
  bubble: '#1a1a1a',
  code: '#0d0d0d',
  composer: '#111111',
  composerBorder: 'rgba(255,255,255,0.11)',
  conversationBg: '#000000',
  headerBorder: 'rgba(255,255,255,0.08)',
  activeRow: 'rgba(255,255,255,0.06)',
  activeRowShadow: 'none',
  sendBg: '#f5f5f5',
  sendShadow: 'none',
  composerShadow: 'none',
  newChatBg: 'transparent',
  newChatFg: '#f5f5f5',
  radius: 8,
  orbit: false,
};

export const orbit: Look = {
  id: 'orbit',
  canvas: c.canvas,
  chrome: c.chrome,
  sidebar: c.sidebar,
  surface: c.surface,
  raised: c.surfaceRaised,
  border: c.border,
  input: c.input,
  text: c.text,
  muted: c.textMuted,
  muted2: '#7E7F80',
  accent: c.accent,
  accentFg: c.accentForeground,
  bubble: c.messageSurface,
  code: c.codeBackground,
  composer: '#141927',
  composerBorder: '#262D40',
  // [data-workspace-area=conversation]
  conversationBg: `radial-gradient(120% 80% at 85% -15%,#2a1f5c40,#0000 60%),radial-gradient(90% 70% at -5% 115%,#123a5a26,#0000 60%),${c.canvas}`,
  // [data-chat-header] border-image
  headerBorder: 'linear-gradient(90deg,#0000,#8B7CF655,#4FB6E855,#0000)',
  // [data-testid=sidebar-row-card][aria-current]
  activeRow: 'linear-gradient(90deg,#8B7CF622,#0000 75%)',
  activeRowShadow: 'inset 2px 0 0 #8B7CF6',
  sendBg: c.accent,
  sendShadow: '0 0 14px #8B7CF666',
  composerShadow: '0 0 0 3px #8B7CF61c,0 10px 34px #4FB6E812',
  newChatBg: c.accent,
  newChatFg: '#ffffff',
  radius: 10,
  orbit: true,
};

export const WORDMARK_GRADIENT = 'linear-gradient(90deg,#A99DFA,#6FD3FF)';
export const ORBIT_ICON_GRADIENT = 'linear-gradient(135deg,#8B7CF6,#4FB6E8)';
export const FONT = '"Inter Orbit", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
