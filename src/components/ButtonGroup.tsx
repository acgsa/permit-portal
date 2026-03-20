import React from 'react';

type ButtonGroupDirection = 'horizontal' | 'vertical';

interface ButtonGroupProps {
  children: React.ReactNode;
  direction?: ButtonGroupDirection;
  fullWidth?: boolean;
}

export function ButtonGroup({
  children,
  direction = 'horizontal',
  fullWidth = false,
}: ButtonGroupProps) {
  const classes = [
    'flex',
    direction === 'horizontal' ? 'flex-row items-center gap-3' : 'flex-col gap-3',
    fullWidth ? 'w-full' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
