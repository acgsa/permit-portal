import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizePadding = {
  sm: 'var(--space-md)',
  md: 'var(--space-lg)',
  lg: 'var(--space-xl)',
};

export function Card({ children, size = 'md', className = '' }: CardProps) {
  return (
    <div
      style={{ padding: sizePadding[size] }}
      className={`
        bg-[var(--color-bg)]
        border border-[var(--color-border)]
        rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
        transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}
