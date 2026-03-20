'use client';

import { useState, useEffect, useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
}

export function ParallaxImage({ src, alt }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-all duration-1000 ease-out ${
          isInView
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-0 blur-lg scale-110'
        }`}
      />
    </div>
  );
}
