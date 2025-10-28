import type { TBadgeVariant, TBadgeProps, TStatusBadgeProps, TTagProps } from './interface';

const variantStyles: Record<TBadgeVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-primary/10 text-primary',
  default: 'bg-muted text-muted-foreground',
};

export const Badge = ({ variant = 'default', children, className = '' }: TBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      variantStyles[variant]
    } ${className}`}
  >
    {children}
  </span>
);

const statusVariantMap: Record<TStatusBadgeProps['status'], TBadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  completed: 'success',
  cancelled: 'default',
};

const statusLabelMap: Record<TStatusBadgeProps['status'], string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const StatusBadge = ({ status, children }: TStatusBadgeProps) => (
  <Badge variant={statusVariantMap[status]}>
    {children || statusLabelMap[status]}
  </Badge>
);

export const Tag = ({ label, onRemove, variant = 'default' }: TTagProps) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
  >
    {label}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-1 text-current hover:opacity-70 focus:outline-none"
      >
        ×
      </button>
    )}
  </span>
);
