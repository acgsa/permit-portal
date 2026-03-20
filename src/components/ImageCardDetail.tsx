type ImageCardDetailProps = {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  agencies: string;
  examples: string;
  reviews: string[];
};

export function ImageCardDetail({ href, image, imageAlt, title, agencies, examples, reviews }: ImageCardDetailProps) {
  return (
    <a href={href} className="image-card-link">
      <div className="image-card rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
        <div className="image-card-image">
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
        <div className="image-card-content">
          <div className="image-card-text" style={{ alignItems: 'flex-start' }}>
            <div className="image-card-text-inner" style={{ gap: 'var(--space-sm)' }}>
              <div className="image-card-title">{title}</div>
              <p className="type-body-sm text-[var(--color-text-body)]">
                <span className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]">Agencies:</span>{' '}
                {agencies}
              </p>
              <p className="type-body-sm text-[var(--color-text-body)]">
                <span className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]">Examples:</span>{' '}
                {examples}
              </p>
              <div>
                <p className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]" style={{ marginBottom: 'var(--space-2xs)' }}>
                  Reviews
                </p>
                <ul className="grid" style={{ gap: 'var(--space-2xs)', margin: 0, paddingLeft: 'var(--space-md)' }}>
                  {reviews.map((review) => (
                    <li key={review} className="type-body-sm text-[var(--color-text-body)]">
                      <span aria-hidden="true">• </span>
                      <span>{review}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
