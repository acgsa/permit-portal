'use client';

import { useState, useEffect } from 'react';

interface AnchorNavProps {
  sections: Array<{
    slug: string;
    title: string;
  }>;
}

export function AnchorNav({ sections }: AnchorNavProps) {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const [manuallySelected, setManuallySelected] = useState<string>('');

  useEffect(() => {
    // Initialize with first section
    if (sections.length > 0 && !activeSlug) {
      setActiveSlug(sections[0].slug);
    }
  }, [sections, activeSlug]);

  useEffect(() => {
    const handleScroll = () => {
      // Only update scroll-based active if user hasn't manually selected
      if (manuallySelected) return;

      let activeSection = '';

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        const element = document.getElementById(s.slug);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If section's top is in the upper half of viewport, consider it active
          if (rect.top <= window.innerHeight / 2) {
            activeSection = s.slug;
            break;
          }
        }
      }

      if (activeSection) {
        setActiveSlug(activeSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, manuallySelected]);

  const handleClick = (slug: string) => {
    setActiveSlug(slug);
    setManuallySelected(slug);
    // Clear manual selection after 2 seconds so scroll detection resumes
    setTimeout(() => setManuallySelected(''), 2000);
  };

  return (
    <div className="sticky top-14 z-30" style={{ background: 'none', border: 'none' }}>
      <div className="flex justify-center px-2 sm:px-6 lg:px-8">
        <div className="w-full overflow-x-auto use-cases-anchor-scroll" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <nav className="flex" aria-label="Jump to use case">
          {sections.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              onClick={() => handleClick(s.slug)}
              className={`type-body-sm shrink-0 whitespace-nowrap tracking-normal transition-colors ${
                activeSlug === s.slug
                  ? 'text-white'
                  : 'text-[color:var(--color-text-body)/0.5] hover:text-[var(--color-text-body)]'
              }`}
              style={{
                padding: 'var(--space-lg) var(--space-lg)',
                ...(activeSlug === s.slug && { fontWeight: '600', color: '#fff' })
              }}
            >
              {s.title}
            </a>
          ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
