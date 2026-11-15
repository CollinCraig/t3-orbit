# T3 Orbit launch film

A 29-second film (1920×1080 and 1080×1080, 30 fps), plus the README previews (`src/Previews.tsx`: two GIF loops and the before/after still; the morph GIF is cut from the film) made in [Remotion](https://www.remotion.dev) 4.0.539. It shows a plain T3 Code window, adds `t3-orbit.json` in Settings → Appearance, and morphs into T3 Orbit.

- `src/App.tsx` recreates the T3 Code window with **demo data only**. `src/theme.ts` reads Orbit's colours from `../t3-orbit.json` and copies the theme's CSS values (gradients, glows, compact rows, crew names). The "plain" look uses T3 Code's own default dark tokens.
- `src/Film.tsx` holds the story, camera and captions. `src/timing.json` is the beat sheet that both the picture and the score read.
- `audio/score.mjs` synthesizes the original score in code: a pad, a whoosh on the morph, bells and UI ticks. It uses no samples. The mix is mastered to −16 LUFS with ffmpeg `loudnorm`.
- `public/inter-latin.woff2` is Inter (SIL OFL 1.1), T3 Code's default sans.

Render with `scripts/render.sh` (or `--stills` for half-size layout checks). It runs on a Windows box over SSH through `scripts/render-starkpc.ps1`, which uses BelowNormal priority and 6 threads, pauses while the box is above 85% CPU, stops if a game starts, and encodes with NVENC. Locally: `npm i && npx remotion studio src/index.ts`.
