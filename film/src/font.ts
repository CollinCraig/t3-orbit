// Load Inter (T3 Code's own default sans) from public/ before any frame renders.
import {continueRender, delayRender, staticFile} from 'remotion';

if (typeof window !== 'undefined' && !(window as unknown as {__orbitFont?: boolean}).__orbitFont) {
  (window as unknown as {__orbitFont?: boolean}).__orbitFont = true;
  const handle = delayRender('font');
  const ff = new FontFace('Inter Orbit', `url(${staticFile('inter-latin.woff2')}) format('woff2')`, {weight: '100 900'});
  ff.load().then((f) => {
    document.fonts.add(f);
    continueRender(handle);
  });
}
