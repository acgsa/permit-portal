'use client';

import Player from '@vimeo/player';
import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO_ID = '1177024911';
const HERO_VIDEO_SRC =
  `https://player.vimeo.com/video/${HERO_VIDEO_ID}?autoplay=1&loop=1&autopause=0&muted=1&background=1`;
const DEFAULT_HERO_STILL =
  'https://i.vimeocdn.com/video/2138249444-ba571cbd5b07ab214c0fbecbb25366d381b900f54a26eb2346ec5128e5820e25-d_1280?region=us';

export function HeroBackgroundVideo() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isLoadedRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return;
    }

    let isMounted = true;
    const player = new Player(iframe);

    const markLoaded = () => {
      if (!isMounted) {
        return;
      }

      isLoadedRef.current = true;
      setHasError(false);
    };

    const markPlaying = () => {
      if (!isMounted) {
        return;
      }

      // Wait briefly to let the first decoded frame paint before removing poster.
      window.setTimeout(() => {
        if (isMounted) {
          setIsVideoVisible(true);
        }
      }, 180);
    };

    const markError = () => {
      if (!isMounted) {
        return;
      }

      isLoadedRef.current = false;
      setHasError(true);
      setIsVideoVisible(false);
    };

    player.ready().catch(markError);
    player.on('loaded', markLoaded);
    player.on('play', markPlaying);
    player.on('error', markError);

    // If Vimeo never becomes ready in this environment, switch to a clean fallback.
    const timeout = window.setTimeout(() => {
      if (!isLoadedRef.current) {
        markError();
      }
    }, 5000);

    return () => {
      isMounted = false;
      window.clearTimeout(timeout);
      player.off('loaded', markLoaded);
      player.off('play', markPlaying);
      player.off('error', markError);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <iframe
        ref={iframeRef}
        src={HERO_VIDEO_SRC}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: isVideoVisible && !hasError ? 1 : 0,
          transition: 'opacity 700ms ease',
          backgroundColor: '#000',
        }}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        title="PERMIT.GOV hero background video"
        loading="eager"
      />

      <div
        className="absolute inset-0 bg-black bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url('${DEFAULT_HERO_STILL}')`,
          opacity: isVideoVisible && !hasError ? 0 : 1,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_50%)]" />
    </div>
  );
}
