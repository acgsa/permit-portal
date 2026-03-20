'use client';

import { ArrowLineLeftIcon, ArrowLineRightIcon, DrawerClosedIcon, DrawerOpenIcon } from '@/components/Icons';

type DrawerButtonState = 'open' | 'closed';
type DrawerDirection = 'left' | 'right';

type DrawerButtonProps = {
  state?: DrawerButtonState;
  direction?: DrawerDirection;
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
};

export function DrawerButton({
  state = 'open',
  direction = 'right',
  className = '',
  onClick,
  'aria-label': ariaLabel,
}: DrawerButtonProps) {
  const defaultIcon = state === 'closed' ? <DrawerClosedIcon size={24} /> : <DrawerOpenIcon size={24} />;
  const hoverIcon =
    state === 'closed'
      ? direction === 'right'
        ? <ArrowLineRightIcon size={24} />
        : <ArrowLineLeftIcon size={24} />
      : direction === 'right'
        ? <ArrowLineLeftIcon size={24} />
        : <ArrowLineRightIcon size={24} />;

  return (
    <button
      type="button"
      className={`group relative inline-flex h-10 w-10 min-h-10 min-w-10 shrink-0 flex-none items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-body)] transition-colors hover:bg-[var(--steel-800)] hover:text-white ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover:opacity-0">
        {defaultIcon}
      </span>
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        {hoverIcon}
      </span>
    </button>
  );
}
