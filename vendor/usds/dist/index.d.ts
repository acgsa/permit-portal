import { default as default_2 } from 'react';
import { JSX } from 'react/jsx-runtime';

export declare function Alert({ variant, title, children, onDismiss }: AlertProps): JSX.Element;

declare interface AlertProps {
    variant: AlertVariant;
    title?: string;
    children: default_2.ReactNode;
    onDismiss?: () => void;
}

declare type AlertVariant = "info" | "success" | "warning" | "error";

/**
 * Arrow Down Icon
 * Displays a vertical arrow pointing down
 */
export declare const ArrowDownIcon: default_2.FC<IconProps>;

export declare function Avatar({ initials, src, alt, size, shape, color, status, }: AvatarProps): JSX.Element;

declare type AvatarColor = "steel" | "blue" | "blue-400" | "green" | "gold" | "pink" | "violet";

declare interface AvatarProps {
    initials?: string;
    src?: string;
    alt?: string;
    size?: AvatarSize;
    shape?: AvatarShape;
    color?: AvatarColor;
    status?: AvatarStatus;
}

declare type AvatarShape = "circle" | "square";

declare type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

declare type AvatarStatus = "online" | "offline" | "busy";

export declare function AvatarWithInfo({ initials, fullName, governmentEntity, size, shape, color, ...avatarProps }: AvatarWithInfoProps): JSX.Element;

declare interface AvatarWithInfoProps extends Omit<AvatarProps, "initials"> {
    initials: string;
    fullName: string;
    governmentEntity: string;
}

export declare function Badge({ children, color, size, dot, icon, dismissible, onDismiss, }: BadgeProps): JSX.Element;

export declare type BadgeColor = "steel" | "blue" | "red" | "orange" | "gold" | "yellow" | "green" | "pink" | "turquoise" | "violet";

declare type BadgeDotStatus = "active" | "error" | "pending" | "draft";

declare interface BadgeProps {
    children: default_2.ReactNode;
    color?: BadgeColor;
    size?: BadgeSize;
    dot?: boolean | BadgeDotStatus;
    icon?: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
}

declare type BadgeSize = "sm" | "md" | "lg";

export declare function BarChart({ title, items }: BarChartProps): JSX.Element;

declare interface BarChartItem {
    label: string;
    value: number;
}

declare interface BarChartProps {
    title: string;
    items: BarChartItem[];
}

export declare function Breadcrumb({ items }: BreadcrumbProps): JSX.Element;

declare interface BreadcrumbItem {
    label: string;
    href?: string;
}

declare interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export declare function Button({ variant, size, className, leadingIcon, trailingIcon, children, ...props }: ButtonProps): JSX.Element;

export declare function ButtonGroup({ children, direction, fullWidth, }: ButtonGroupProps): JSX.Element;

declare type ButtonGroupDirection = "horizontal" | "vertical";

declare interface ButtonGroupProps {
    children: default_2.ReactNode;
    direction?: ButtonGroupDirection;
    fullWidth?: boolean;
}

declare interface ButtonProps extends default_2.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leadingIcon?: default_2.ReactNode;
    trailingIcon?: default_2.ReactNode;
    children: default_2.ReactNode;
}

declare type ButtonSize = "xs" | "sm" | "md" | "lg";

declare type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

export declare function Card({ title, children, footer, size }: CardProps): JSX.Element;

declare interface CardProps {
    title?: string;
    children: default_2.ReactNode;
    footer?: default_2.ReactNode;
    size?: CardSize;
    className?: string;
}

declare type CardSize = "sm" | "md" | "lg";

export declare function Checkbox({ label, id, ...props }: CheckboxProps): JSX.Element;

declare interface CheckboxProps extends default_2.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

declare interface CompletionSegment {
    label: string;
    percent: number;
    colorVar: string;
    /** Darker color on hover (e.g. --red-400 → --red-600). If omitted, no color change. */
    hoverColorVar?: string;
    /** Optional subtle texture overlay for accessibility. */
    texture?: CompletionSegmentTexture;
}

/** Subtle texture for accessibility (distinguish without relying on color alone). */
declare type CompletionSegmentTexture = "stripes" | "stripes-alt" | "dots" | "crosshatch";

export declare function CompletionTracker({ title, description, actionLabel, onAction, segments, totalApplications }: CompletionTrackerProps): JSX.Element;

declare interface CompletionTrackerProps {
    title: string;
    /** Optional description shown beneath the title, above the chart. Rendered with text-sm. */
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    segments: CompletionSegment[];
    /** Total applications; used to compute count in hover card. Default 150000. */
    totalApplications?: number;
}

export declare function Divider({ strong, subtle }: DividerProps): JSX.Element;

declare interface DividerProps {
    strong?: boolean;
    subtle?: boolean;
}

export declare function DonutChart({ title, segments, size, ringThickness }: DonutChartProps): JSX.Element;

declare interface DonutChartProps {
    title: string;
    segments: DonutSegment[];
    size?: number;
    ringThickness?: number;
}

declare interface DonutSegment {
    label: string;
    value: number;
    colorVar: string;
}

/**
 * Download Icon
 * Displays a download arrow pointing downward with a save indicator below
 */
export declare const DownloadIcon: default_2.FC<IconProps>;

export declare function DrawerButton({ state, direction, disabled, className, ...props }: DrawerButtonProps): JSX.Element;

declare interface DrawerButtonProps extends default_2.ButtonHTMLAttributes<HTMLButtonElement> {
    state?: DrawerButtonState;
    direction?: DrawerDirection;
}

declare type DrawerButtonState = "closed" | "open";

declare type DrawerDirection = "left" | "right";

export declare function Dropdown({ trigger, label, size, disabled, items }: DropdownProps): JSX.Element;

declare interface DropdownItem {
    label: string;
    onClick?: () => void;
    divider?: boolean;
    destructive?: boolean;
}

declare interface DropdownProps {
    trigger?: default_2.ReactNode;
    label?: string;
    size?: DropdownSize;
    disabled?: boolean;
    items: DropdownItem[];
}

declare type DropdownSize = "sm" | "md" | "lg";

export declare function FilterGroup({ items, shape, onSelect }: FilterGroupProps): JSX.Element;

declare interface FilterGroupProps {
    items: FilterItem[];
    shape?: "default" | "pill";
    onSelect?: (id: string) => void;
}

declare interface FilterItem {
    label: string;
    id: string;
    hasDropdown?: boolean;
}

export declare function FormChoice({ options, value, onChange, type, name, layout, className, }: FormChoiceProps): JSX.Element;

declare interface FormChoiceOption {
    value: string;
    label: string;
}

declare interface FormChoiceProps {
    /** Array of selectable options */
    options: FormChoiceOption[];
    /** Currently selected value(s) — string for radio, string[] for checkbox */
    value: string | string[];
    /** Called when selection changes — returns updated value(s) */
    onChange: (value: string | string[]) => void;
    /** Input type: "checkbox" for multi-select, "radio" for single-select */
    type?: FormChoiceType;
    /** Shared name attribute for radio groups */
    name?: string;
    /** Layout direction: "inline" (default wrapping pills), "stacked" (full-width vertical), or "split" (equal-width side by side, stacks on mobile) */
    layout?: "inline" | "stacked" | "split";
    /** Additional className on the wrapper */
    className?: string;
}

declare type FormChoiceType = "checkbox" | "radio";

export declare function IconButton({ variant, size, shape, className, icon, label, ...props }: IconButtonProps): JSX.Element;

declare interface IconButtonProps extends default_2.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: IconVariant;
    size?: ButtonSize;
    shape?: IconShape;
    icon: default_2.ReactNode;
    label: string;
}

declare interface IconProps extends default_2.SVGAttributes<SVGSVGElement> {
    className?: string;
    size?: number;
}

declare type IconShape = "square" | "circle";

declare type IconVariant = "primary" | "secondary" | "outline" | "ghost";

export declare function Input({ label, hint, error, inputSize, className, id, ...props }: InputProps): JSX.Element;

declare interface InputProps extends default_2.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
    inputSize?: InputSize;
}

declare type InputSize = "sm" | "md" | "lg";

export declare function Link({ variant, href, leadingIcon, trailingIcon, disabled, children, className, ...rest }: LinkProps): JSX.Element;

declare interface LinkProps extends Omit<default_2.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
    variant?: LinkVariant;
    href?: string;
    leadingIcon?: default_2.ReactNode;
    trailingIcon?: default_2.ReactNode;
    disabled?: boolean;
    children: default_2.ReactNode;
    className?: string;
}

declare type LinkVariant = "default" | "inline";

export declare function Menu({ items, size, defaultActiveIndex, activeIndex: controlledActiveIndex, onActiveIndexChange, allowDeselect }: MenuProps): JSX.Element;

declare type MenuItem = MenuItemIcon | MenuItemSubtext;

declare interface MenuItemIcon {
    type: "icon";
    label: string;
    icon?: default_2.ReactNode;
    activeIcon?: default_2.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

declare interface MenuItemSubtext {
    type: "subtext";
    label: string;
    subtext: string;
    onClick?: () => void;
    disabled?: boolean;
}

declare interface MenuProps {
    items: MenuItem[];
    size?: "md" | "sm";
    defaultActiveIndex?: number | null;
    activeIndex?: number | null;
    onActiveIndexChange?: (index: number | null) => void;
    allowDeselect?: boolean;
}

export declare function Modal({ open, onClose, title, description, children, footer }: ModalProps): JSX.Element | null;

declare interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: default_2.ReactNode;
    footer?: default_2.ReactNode;
}

export declare function Navbar({ brand, links, actions }: NavbarProps): JSX.Element;

declare interface NavbarProps {
    brand: string;
    links?: {
        label: string;
        href: string;
    }[];
    actions?: default_2.ReactNode;
}

export declare function PillButton({ variant, size, className, leadingIcon, trailingIcon, children, ...props }: PillButtonProps): JSX.Element;

declare interface PillButtonProps extends default_2.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: PillVariant;
    size?: ButtonSize;
    leadingIcon?: default_2.ReactNode;
    trailingIcon?: default_2.ReactNode;
    children: default_2.ReactNode;
}

declare type PillVariant = "primary" | "secondary" | "outline";

export declare const PlusIcon: ({ size }: {
    size?: number;
}) => JSX.Element;

export declare function Progress({ value, max, size, variant, showLabel, }: ProgressProps): JSX.Element;

declare interface ProgressProps {
    value: number;
    max?: number;
    size?: ProgressSize;
    variant?: ProgressVariant;
    showLabel?: boolean;
}

declare type ProgressSize = "sm" | "md" | "lg";

declare type ProgressVariant = "default" | "info" | "success" | "warning" | "error" | "gold";

export declare function Radio({ label, id, ...props }: RadioProps): JSX.Element;

declare interface RadioProps extends default_2.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export declare function Select({ label, options, selectSize, id, ...props }: SelectProps): JSX.Element;

declare interface SelectProps extends default_2.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: {
        value: string;
        label: string;
    }[];
    selectSize?: SelectSize;
}

declare type SelectSize = "sm" | "md" | "lg";

export declare function SidebarNavigationPanel(): JSX.Element;

export declare function SmallKpiCard({ label, value, changePercent, trend }: SmallKpiCardProps): JSX.Element;

declare interface SmallKpiCardProps {
    label: string;
    value: string | number;
    changePercent: number;
    trend: "increase" | "decrease";
}

export declare function Spinner({ size }: SpinnerProps): JSX.Element;

declare interface SpinnerProps {
    size?: SpinnerSize;
}

declare type SpinnerSize = "sm" | "md" | "lg";

declare interface TabItem {
    id: string;
    label: string;
    icon?: default_2.ReactNode;
    content?: default_2.ReactNode;
}

export declare function Table({ header, columns, data }: TableProps): JSX.Element;

declare interface TableColumn {
    key: string;
    header: string;
    render?: (value: unknown, row: Record<string, unknown>) => default_2.ReactNode;
}

export declare function TableHeader({ title, actionButtons, dropdown }: TableHeaderProps): JSX.Element;

declare interface TableHeaderAction {
    icon: default_2.ReactNode;
    label: string;
    onClick?: () => void;
}

declare interface TableHeaderProps {
    title: string;
    /** Up to 3 icon-only action buttons (e.g. download, duplicate, expand). */
    actionButtons?: TableHeaderAction[];
    /** Optional dropdown for sort/filter (e.g. right-aligned sorter). */
    dropdown?: default_2.ReactNode;
}

declare interface TableProps {
    /** Optional header with title, action buttons, and dropdown. */
    header?: default_2.ReactNode;
    columns: TableColumn[];
    data: Record<string, unknown>[];
}

export declare function Tabs({ items, defaultTab }: TabsProps): JSX.Element;

declare interface TabsProps {
    items: TabItem[];
    defaultTab?: string;
}

export declare function Textarea({ label, id, ...props }: TextareaProps): JSX.Element;

declare interface TextareaProps extends default_2.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export declare function ThemeProvider({ children }: {
    children: React.ReactNode;
}): JSX.Element;

export declare function Toggle({ label, checked, onChange, size, disabled, }: ToggleProps): JSX.Element;

declare interface ToggleProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    size?: ToggleSize;
    disabled?: boolean;
}

declare type ToggleSize = "sm" | "md" | "lg";

export declare function Tooltip({ text, children }: TooltipProps): JSX.Element;

declare interface TooltipProps {
    text: string;
    children: default_2.ReactNode;
}

export { }
