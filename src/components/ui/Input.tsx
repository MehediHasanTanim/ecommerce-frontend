import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-[13px] text-[var(--color-danger)] mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
