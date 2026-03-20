'use client';

import { useState, useEffect } from 'react';

interface CyclingHeadlineProps {
  words: string[];
  staticText: string;
  className?: string;
}

export function CyclingHeadline({
  words,
  staticText,
  className = '',
}: CyclingHeadlineProps) {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <h1 className={className}>
      <span className="text-white">{words[wordIndex]}</span>
      {staticText && <span className="text-white"> {staticText}</span>}
    </h1>
  );
}
