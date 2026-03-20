import React from 'react';
import { DownloadIcon } from 'usds';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function ActionButton({
  size = 'md',
  icon = <DownloadIcon size={20} />,
  disabled = false,
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {icon}
    </button>
  );
}
