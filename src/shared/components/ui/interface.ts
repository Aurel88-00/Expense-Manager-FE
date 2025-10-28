import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

// EmptyState / ErrorState / LoadingState
export interface TEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export interface TErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export interface TLoadingStateProps {
  message?: string;
}

// Card
export interface TCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export interface TCardBodyProps {
  children: ReactNode;
  className?: string;
}

export interface TCardHeaderProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
}

export interface TCardFooterProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
}

export interface TStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}

// Modal
export interface TModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export interface TModalFooterProps {
  onClose: () => void;
  onSubmit?: () => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

// Form Inputs
export interface TInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export interface TFormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
}

// Badge
export type TBadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';

export interface TBadgeProps {
  variant?: TBadgeVariant;
  children: ReactNode;
  className?: string;
}

export interface TStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  children?: ReactNode;
}

export interface TTagProps {
  label: string;
  onRemove?: () => void;
  variant?: TBadgeVariant;
}

// List
export interface TListProps {
  children: ReactNode;
  className?: string;
}

export interface TListItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export interface TListItemDetailProps {
  label: string;
  value: ReactNode;
}

// Button
export type TButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type TButtonSize = 'sm' | 'md' | 'lg';

export interface TButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
  fullWidth?: boolean;
}


