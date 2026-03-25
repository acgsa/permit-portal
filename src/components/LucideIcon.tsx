import type { SVGProps } from 'react';
import type { LucideIcon as LucideIconType, LucideProps } from 'lucide-react';

type LucideIconProps = Omit<LucideProps, 'size'> & SVGProps<SVGSVGElement> & {
  icon: LucideIconType;
  size?: number;
};

/**
 * Shared Lucide wrapper for cases where no equivalent USDS icon exists.
 */
export function LucideIcon({ icon: Icon, size = 20, ...props }: LucideIconProps) {
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" {...props} />;
}

export default LucideIcon;
