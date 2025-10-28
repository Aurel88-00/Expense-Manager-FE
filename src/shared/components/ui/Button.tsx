import type { TButtonProps, TButtonSize, TButtonVariant } from './interface';

const variantStyles: Record<TButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 focus:ring-ring shadow-sm hover:shadow-md',
  secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 active:bg-secondary/70 focus:ring-ring shadow-sm hover:shadow-md',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 focus:ring-ring shadow-sm hover:shadow-md',
  success: 'bg-success text-success-foreground hover:bg-success/90 active:bg-success/80 focus:ring-ring shadow-sm hover:shadow-md',
  warning: 'bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80 focus:ring-ring shadow-sm hover:shadow-md',
};

const sizeStyles: Record<TButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded',
  md: 'px-4 py-2 text-sm font-medium rounded-md',
  lg: 'px-4 py-2.5 text-base font-medium rounded-lg',
};

const iconSizeStyles: Record<TButtonSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: TButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center border border-transparent font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm';
  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${className}`;

  return (
    <button
      disabled={disabled || isLoading}
      className={combinedClassName}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" aria-hidden="true" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizeStyles[size]} ${children ? 'mr-2' : ''} shrink-0`} aria-hidden="true" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizeStyles[size]} ${children ? 'ml-2' : ''} shrink-0`} aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
};
