'use client';

import Player from '@vimeo/player';
import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO_SRC =
  'https://player.vimeo.com/video/1170729303?autoplay=1&loop=1&autopause=0&muted=1&background=1&dnt=1';

export function HeroBackgroundVideo() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isLoadedRef = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

      setIsPlaying(true);
    };

    const markError = () => {
      if (!isMounted) {
        return;
      }

      isLoadedRef.current = false;
      setHasError(true);
      setIsPlaying(false);
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
      <div
        className="absolute inset-0 bg-black bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-video-still.jpg')" }}
      />

      <iframe
        ref={iframeRef}
        src={HERO_VIDEO_SRC}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${
          isPlaying && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        title="PERMIT.GOV hero background video"
        loading="eager"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_50%)]" />
    </div>
  );
}
