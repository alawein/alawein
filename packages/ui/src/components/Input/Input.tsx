import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.ComponentProps<'input'> {
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  description?: string;
  /** Error message displayed below the input */
  error?: string;
  /** Success message displayed below the input */
  success?: string;
  /** Icon element to display inside the input */
  icon?: React.ReactNode;
  /** Position of the icon */
  iconPosition?: 'left' | 'right';
}

/**
 * Input component with optional label, description, error/success states, and icon support.
 * Follows accessibility best practices with proper ARIA attributes.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      description,
      error,
      success,
      icon,
      iconPosition = 'left',
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const labelId = `${inputId}-label`;
    const descId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;

    const describedByIds = [
      ariaDescribedBy,
      description ? descId : undefined,
      error ? errorId : undefined,
      success ? successId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              hasError && 'border-destructive focus-visible:ring-destructive',
              hasSuccess && 'border-green-500 focus-visible:ring-green-500',
              className
            )}
            ref={ref}
            aria-describedby={describedByIds}
            aria-invalid={hasError || undefined}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>

        {description && !error && !success && (
          <p id={descId} className="mt-1.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {success && !error && (
          <p id={successId} className="mt-1.5 text-sm text-green-600">
            {success}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

