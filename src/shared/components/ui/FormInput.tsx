import type { TInputProps, TTextareaProps, TSelectProps, TFormFieldProps } from './interface';
import { AlertCircle } from 'lucide-react';

export const TextInput = ({ label, error, helperText, id, className = '', ...props }: TInputProps) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <input
      id={id}
      className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm ${
        error 
          ? 'border-destructive focus:ring-destructive bg-destructive/10' 
          : 'border-input focus:ring-ring focus:border-primary bg-background text-foreground hover:border-border'
      } disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      {...props}
    />
    {error && (
      <div id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-destructive text-sm font-medium" role="alert">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <p>{error}</p>
      </div>
    )}
    {helperText && !error && <p id={`${id}-helper`} className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
  </div>
);


export const Textarea = ({ label, error, helperText, id, className = '', ...props }: TTextareaProps) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <textarea
      id={id}
      className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm resize-vertical ${
        error 
          ? 'border-destructive focus:ring-destructive bg-destructive/10' 
          : 'border-input focus:ring-ring focus:border-primary bg-background text-foreground hover:border-border'
      } disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${className}`}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
      {...props}
    />
    {error && (
      <div id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-destructive text-sm font-medium" role="alert">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <p>{error}</p>
      </div>
    )}
    {helperText && !error && <p id={`${id}-helper`} className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
  </div>
);


export const Select = ({ label, error, options, id, className = '', ...props }: TSelectProps) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </label>
    )}
    <select
      id={id}
      className={`w-full px-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-sm appearance-none bg-right bg-no-repeat pr-10 ${
        error 
          ? 'border-destructive focus:ring-destructive bg-destructive/10' 
          : 'border-input focus:ring-ring focus:border-primary bg-background text-foreground hover:border-border'
      } disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${error ? 'dc' : '333'}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
        backgroundPosition: 'right 1rem center'
      }}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-destructive text-sm font-medium" role="alert">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <p>{error}</p>
      </div>
    )}
  </div>
);


export const FormField = ({ label, children, error, helperText, required }: TFormFieldProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
    {children}
    {error && (
      <div className="mt-1.5 flex items-center gap-1 text-destructive text-sm font-medium" role="alert">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <p>{error}</p>
      </div>
    )}
    {helperText && !error && <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>}
  </div>
);
