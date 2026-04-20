import React from 'react';

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  size?: number;
}

/**
 * Download Icon
 * Displays a download arrow pointing downward with a save indicator below
 */
export const DownloadIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M12.8438 3.84375C12.8438 3.37776 12.466 3 12 3C11.534 3 11.1563 3.37776 11.1563 3.84375V13.534L7.83217 10.0144C7.51221 9.67563 6.97819 9.66037 6.63941 9.98033C6.30063 10.3003 6.28538 10.8343 6.60533 11.1731L11.3866 16.2356C11.546 16.4044 11.7679 16.5 12 16.5C12.2321 16.5 12.454 16.4044 12.6134 16.2356L17.3947 11.1731C17.7146 10.8343 17.6994 10.3003 17.3606 9.98033C17.0218 9.66037 16.4878 9.67563 16.1678 10.0144L12.8438 13.534V3.84375Z" fill="currentColor" />
    <path d="M3 20.8438C3 21.3097 3.37776 21.6875 3.84375 21.6875L20.1562 21.6875C20.6222 21.6875 21 21.3097 21 20.8438C21 20.3778 20.6222 20 20.1562 20L3.84375 20C3.37776 20 3 20.3778 3 20.8438Z" fill="currentColor" />
  </svg>
);

/**
 * Upload Icon
 * Displays an upload arrow pointing upward with a save indicator below
 */
export const UploadIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M11.1563 20.1562C11.1563 20.6222 11.534 21 12 21C12.466 21 12.8438 20.6222 12.8438 20.1562V10.466L16.1678 13.9856C16.4878 14.3244 17.0218 14.3396 17.3606 14.0197C17.6994 13.6997 17.7146 13.1657 17.3947 12.8269L12.6134 7.76441C12.454 7.59564 12.2321 7.5 12 7.5C11.7679 7.5 11.546 7.59564 11.3866 7.76441L6.60533 12.8269C6.28538 13.1657 6.30063 13.6997 6.63941 14.0197C6.97819 14.3396 7.51221 14.3244 7.83217 13.9856L11.1563 10.466V20.1562Z" fill="currentColor" />
    <path d="M3 3.15625C3 2.69026 3.37776 2.3125 3.84375 2.3125L20.1562 2.3125C20.6222 2.3125 21 2.69026 21 3.15625C21 3.62224 20.6222 4 20.1562 4L3.84375 4C3.37776 4 3 3.62224 3 3.15625Z" fill="currentColor" />
  </svg>
);

/**
 * Copy Icon (Document Duplicate)
 * Displays two overlapping document pages representing a copy action
 */
export const CopyIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M18.75 9C19.5784 9 20.25 8.32843 20.25 7.5V2.25C20.25 1.41797 19.5784 0.75 18.75 0.75H5.25C4.41797 0.75 3.75 1.41797 3.75 2.25V16.5C3.75 17.3281 4.41797 18 5.25 18H7.5V20.25C7.5 21.0781 8.16797 21.75 9 21.75H21.75C22.5781 21.75 23.25 21.0781 23.25 20.25V6.75C23.25 5.91797 22.5781 5.25 21.75 5.25H18.75V9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Eye Icon
 * Displays an open eye representing visibility or a view action
 */
export const EyeIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M2.0355 12.3224C1.96642 12.1151 1.96635 11.8907 2.03531 11.6834C3.42368 7.50972 7.36074 4.5 12.0008 4.5C16.6386 4.5 20.5742 7.50692 21.9643 11.6776C22.0334 11.8849 22.0334 12.1093 21.9645 12.3166C20.5761 16.4903 16.639 19.5 11.999 19.5C7.36115 19.5 3.42559 16.4931 2.0355 12.3224Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 12C15 13.6569 13.6568 15 12 15C10.3431 15 8.99995 13.6569 8.99995 12C8.99995 10.3431 10.3431 9 12 9C13.6568 9 15 10.3431 15 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Plus Icon
 * Displays a plus sign for add/create actions
 */
export const PlusIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M4 12H20M12 4V20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Menu Icon
 * Displays three horizontal lines representing a menu or navigation toggle
 */
export const MenuIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Drawer Closed Icon
 * Indicates a collapsed sidebar drawer state.
 */
export const DrawerClosedIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 6.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Drawer Open Icon
 * Indicates an expanded sidebar drawer state.
 */
export const DrawerOpenIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 6.75V17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Arrow Line Left Icon
 * Indicates drawer collapse direction when hovering an open right drawer.
 */
export const ArrowLineLeftIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12.25 18L6 12M6 12L12.25 6M6 12L21 12M3 3V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Arrow Line Right Icon
 * Indicates drawer expand direction when hovering a closed right drawer.
 */
export const ArrowLineRightIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M11.75 18L18 12M18 12L11.75 6M18 12L3 12M21 3V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Chevron Down Icon
 * Displays a downward pointing chevron for collapse/dropdown actions
 */
export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M19.5 8.25L12 15.75L4.5 8.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Chevron Up Icon
 * Displays an upward pointing chevron for expand/collapse actions
 */
export const ChevronUpIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M4.5 15.75L12 8.25L19.5 15.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Arrow Down Icon
 * Displays a downward arrow with a vertical stem
 */
export const ArrowDownIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 3V20"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 12.5L12 20L19.5 12.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * X Mark Icon
 * Displays an X for close/dismiss actions
 */
export const XMarkIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M6 18L18 6M6 6L18 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Star Icon (Linear/Default)
 * Displays an outlined star
 */
export const StarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 1.5L15.391 10.135H24.537L17.573 15.365L20.964 24L12 18.771L3.036 24L6.427 15.365L-0.537 10.135H8.609L12 1.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Star Icon Filled (Active)
 * Displays a filled star
 */
export const StarIconFilled: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 1.5L15.391 10.135H24.537L17.573 15.365L20.964 24L12 18.771L3.036 24L6.427 15.365L-0.537 10.135H8.609L12 1.5Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Chat Icon (Linear/Default)
 * Displays an outlined chat bubble
 */
export const ChatIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0508 3C19.6009 3.00039 21.6688 5.06802 21.6689 7.61816V13.2832C21.6688 15.8333 19.6009 17.901 17.0508 17.9014H13.2686L9.23926 21.7168C8.58852 22.3323 7.5166 21.8705 7.5166 20.9746V17.8984C5.01299 17.8445 3.00011 15.7997 3 13.2832V7.61816C3.00012 5.06785 5.06785 3.00012 7.61816 3H17.0508Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Chat Icon Filled (Active)
 * Displays a filled chat bubble
 */
export const ChatIconFilled: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0508 3C19.6009 3.00039 21.6688 5.06802 21.6689 7.61816V13.2832C21.6688 15.8333 19.6009 17.901 17.0508 17.9014H13.2686L9.23926 21.7168C8.58852 22.3323 7.5166 21.8705 7.5166 20.9746V17.8984C5.01299 17.8445 3.00011 15.7997 3 13.2832V7.61816C3.00012 5.06785 5.06785 3.00012 7.61816 3H17.0508Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Console Icon (Linear/Default)
 * Displays a console with bars
 */
export const ConsoleIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M16.5262 2H21.7721V19.7049H16.5262V2Z" fill="currentColor" />
    <path
      d="M21.7721 2V19.7049H16.5262V2H21.7721ZM18.0262 18.2049H20.2722V3.49999H18.0262V18.2049Z"
      fill="currentColor"
    />
    <path d="M22.1943 21.25V22.75H1.67773V21.25H22.1943Z" fill="currentColor" />
    <path d="M2.1 5.2793H7.34591V19.7055H2.1V5.2793Z" fill="currentColor" />
    <path
      d="M7.34591 5.2793V19.7055H2.1V5.2793H7.34591ZM3.6 18.2051H5.8461V6.7793H3.6V18.2051Z"
      fill="currentColor"
    />
    <path d="M9.31314 9.21289H14.559V19.7047H9.31314V9.21289Z" fill="currentColor" />
    <path
      d="M14.559 9.21289V19.7047H9.31314V9.21289H14.559ZM10.8131 18.2051H13.0592V10.7129H10.8131V18.2051Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * Console Icon Filled (Active)
 * Displays a filled console representation
 */
export const ConsoleIconFilled: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M16.5262 2H21.7721V19.7049H16.5262V2Z" fill="currentColor" />
    <path d="M2.1 5.2793H7.34591V19.7055H2.1V5.2793Z" fill="currentColor" />
    <path d="M9.31314 9.21289H14.559V19.7047H9.31314V9.21289Z" fill="currentColor" />
    <path d="M22.1943 21.25V22.75H1.67773V21.25H22.1943Z" fill="currentColor" />
  </svg>
);

/**
 * API Icon (Linear/Default)
 * Displays an API interface icon
 */
export const APIIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M17.0508 2H21.7721V19.7049H17.0508V2Z"
      fill="currentColor"
    />
    <path d="M2.1 5.2793H7.34591V19.7055H2.1V5.2793Z" fill="currentColor" />
    <path
      d="M9.31314 9.21289H14.559V19.7047H9.31314V9.21289Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * API Icon Filled (Active)
 * Displays a filled API interface icon
 */
export const APIIconFilled: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M17.0508 2H21.7721V19.7049H17.0508V2Z" fill="currentColor" />
    <path d="M2.1 5.2793H7.34591V19.7055H2.1V5.2793Z" fill="currentColor" />
    <path d="M9.31314 9.21289H14.559V19.7047H9.31314V9.21289Z" fill="currentColor" />
  </svg>
);

/**
 * Help Icon (Linear/Default)
 * Displays a help icon
 */
export const HelpIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M9.09009 8.99999C9.32519 8.33166 9.78924 7.7681 10.4 7.40912C11.0108 7.05015 11.729 6.91893 12.4273 7.0387C13.1255 7.15848 13.7589 7.52151 14.2152 8.06352C14.6714 8.60552 14.9211 9.29151 14.9201 9.99999C14.9201 12 11.9201 13 11.9201 13M12 17H12.01"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Help Icon Filled (Active)
 * Displays a filled help icon
 */
export const HelpIconFilled: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M9.09009 8.99999C9.32519 8.33166 9.78924 7.7681 10.4 7.40912C11.0108 7.05015 11.729 6.91893 12.4273 7.0387C13.1255 7.15848 13.7589 7.52151 14.2152 8.06352C14.6714 8.60552 14.9211 9.29151 14.9201 9.99999C14.9201 12 11.9201 13 11.9201 13M12 17H12.01"
      fill="var(--color-bg-subtle)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Gear Icon
 * Displays a settings gear icon.
 */
export const GearIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M10.3254 4.31797C10.7337 2.56092 13.2663 2.56093 13.6746 4.31797C13.9386 5.45475 15.2384 5.99253 16.2458 5.40083C17.8023 4.48635 19.5942 6.27823 18.6797 7.83474C18.088 8.84218 18.6258 10.142 19.7625 10.406C21.5196 10.8143 21.5196 13.3469 19.7625 13.7552C18.6258 14.0192 18.088 15.319 18.6797 16.3264C19.5942 17.8829 17.8023 19.6748 16.2458 18.7603C15.2384 18.1686 13.9386 18.7064 13.6746 19.8432C13.2663 21.6002 10.7337 21.6002 10.3254 19.8432C10.0614 18.7064 8.76159 18.1686 7.75416 18.7603C6.19765 19.6748 4.40577 17.8829 5.32025 16.3264C5.91195 15.319 5.37417 14.0192 4.23739 13.7552C2.48035 13.3469 2.48034 10.8143 4.23739 10.406C5.37417 10.142 5.91195 8.84218 5.32025 7.83474C4.40577 6.27823 6.19765 4.48635 7.75416 5.40083C8.7616 5.99253 10.0614 5.45475 10.3254 4.31797Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12.0806" r="3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/**
 * Icon component map for easy access by name
 * Usage: <Icon name="download" />
 */
export const iconMap = {
  download: DownloadIcon,
  upload: UploadIcon,
  copy: CopyIcon,
  eye: EyeIcon,
  plus: PlusIcon,
  menu: MenuIcon,
  drawerClosed: DrawerClosedIcon,
  drawerOpen: DrawerOpenIcon,
  arrowLineLeft: ArrowLineLeftIcon,
  arrowLineRight: ArrowLineRightIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  arrowDown: ArrowDownIcon,
  xMark: XMarkIcon,
  star: StarIcon,
  starFilled: StarIconFilled,
  chat: ChatIcon,
  chatFilled: ChatIconFilled,
  console: ConsoleIcon,
  consoleFilled: ConsoleIconFilled,
  api: APIIcon,
  apiFilled: APIIconFilled,
  help: HelpIcon,
  helpFilled: HelpIconFilled,
} as const;

export type IconName = keyof typeof iconMap;

interface IconComponentProps extends IconProps {
  name: IconName;
}

/**
 * Generic Icon component that renders icons by name
 * Usage: <Icon name="download" size={32} className="text-blue-500" />
 */
export const Icon: React.FC<IconComponentProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  return <IconComponent {...props} />;
};

export default Icon;
