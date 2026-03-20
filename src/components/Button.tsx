import { ButtonHTMLAttributes, ReactNode, SVGAttributes, cloneElement, isValidElement } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type PillVariant = 'primary' | 'secondary' | 'outline';
type IconVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type IconShape = 'square' | 'circle';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

interface ButtonProps extends BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

interface PillButtonProps extends BaseButtonProps {
  variant?: PillVariant;
  size?: ButtonSize;
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconVariant;
  size?: ButtonSize;
  shape?: IconShape;
  className?: string;
  icon: ReactNode;
  label: string;
}

interface PlusIconProps extends SVGAttributes<SVGSVGElement> {
  size?: number;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  outline: 'ui-button--outline',
  ghost: 'ui-button--ghost',
  destructive: 'ui-button--destructive',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-[var(--scale-600)] px-[var(--space-xs)] py-[2px] text-[10px]',
  sm: 'h-[36px] px-[var(--space-md)] text-[var(--font-size-body-sm)] leading-[var(--line-height-body-sm)]',
  md: 'h-[var(--scale-1000)] px-[var(--space-md)] text-[var(--font-size-body-sm)] leading-[var(--line-height-body-sm)]',
  lg: 'h-[var(--scale-1200)] px-[var(--space-lg)] text-[var(--font-size-body-md)] leading-[var(--line-height-body-md)]',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 w-7',
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
};

const iconPixelSizes: Record<ButtonSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

export function PlusIcon({ size = 14, ...props }: PlusIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true" style={{ flexShrink: 0 }} {...props}>
      <line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function baseButtonClasses(className: string) {
  return `
  ui-button
        inline-flex items-center justify-center gap-2
        whitespace-nowrap border font-sans font-semibold rounded-[var(--radius-sm)]
        transition-all duration-200
        focus-visible:outline-[var(--border-md)] focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]
        disabled:cursor-not-allowed disabled:opacity-100
        ${className}
      `;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leadingIcon,
  trailingIcon,
  ...props
}: ButtonProps) {
  return (
    <button
      className={baseButtonClasses(`${variantClasses[variant]} ${sizeClasses[size]} ${className}`)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

export function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leadingIcon,
  trailingIcon,
  ...props
}: PillButtonProps) {
  return (
    <button
      className={baseButtonClasses(`${variantClasses[variant]} ${sizeClasses[size]} rounded-[var(--radius-pill)] ${className}`)}
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

export function IconButton({
  variant = 'primary',
  size = 'md',
  shape = 'square',
  className = '',
  icon,
  label,
  ...props
}: IconButtonProps) {
  const resizedIcon = isValidElement<{ size?: number }>(icon)
    ? cloneElement(icon, {
        size: iconPixelSizes[size],
      })
    : icon;

  return (
    <button
      className={baseButtonClasses(
        `${variantClasses[variant]} ${iconOnlySizeClasses[size]} ${shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-sm)]'} ${className}`
      )}
      aria-label={label}
      {...props}
    >
      {resizedIcon}
    </button>
  );
}
