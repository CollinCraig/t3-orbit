import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import T from './timing.json';
import {PreviewSidebar, PreviewHover, BeforeAfter} from './Previews';

export const Root = () => (
  <>
    <Composition id="orbit-16x9" component={Film} durationInFrames={T.total} fps={T.fps} width={1920} height={1080} defaultProps={{square: false, withAudio: false}} />
    <Composition id="orbit-square" component={Film} durationInFrames={T.total} fps={T.fps} width={1080} height={1080} defaultProps={{square: true, withAudio: false}} />
    <Composition id="preview-sidebar" component={PreviewSidebar} durationInFrames={90} fps={30} width={760} height={562} />
    <Composition id="preview-hover" component={PreviewHover} durationInFrames={240} fps={30} width={720} height={580} />
    <Composition id="before-after" component={BeforeAfter} durationInFrames={1} fps={30} width={1920} height={680} />
  </>
);
