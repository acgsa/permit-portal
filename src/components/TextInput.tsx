import { ReactNode } from 'react';

interface TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  optional?: boolean;
  className?: string;
  [key: string]: any;
}

const sizeClasses = {
  sm: 'h-[var(--scale-800)] px-[var(--space-sm)] text-[var(--font-size-body-xs)]',
  md: 'h-[var(--scale-1000)] px-[var(--space-md)] text-[var(--font-size-body-sm)]',
  lg: 'h-[var(--scale-1200)] px-[var(--space-lg)] text-[var(--font-size-body-md)]',
};

export function TextInput({
  label,
  hint,
  error,
  size = 'md',
  disabled = false,
  optional = false,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-[var(--space-xs)] block text-[var(--font-size-body-sm)] font-semibold text-white">
          {label}
          {!optional && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        className={`
          w-full
          rounded-[var(--radius-sm)] border
          transition-all duration-200
          font-sans font-normal
          ${
            error
              ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
              : 'border-white/20 focus:border-white/40'
          }
          ${sizeClasses[size]}
          ${disabled ? 'cursor-not-allowed bg-white/5 text-white/50' : 'bg-white/8 text-white placeholder:text-white/40'}
          focus:outline-none focus:ring-0
          ${className}
        `}
        disabled={disabled}
        {...props}
      />
      {hint && !error && (
        <p className="mt-[var(--space-2xs)] text-[var(--font-size-body-xs)] text-[var(--color-text-placeholder)]">{hint}</p>
      )}
      {error && (
        <p className="mt-[var(--space-2xs)] text-[var(--font-size-body-xs)] text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
