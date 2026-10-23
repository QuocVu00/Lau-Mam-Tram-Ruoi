import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer';

    const variants = {
      primary:
        'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-950/40 border border-orange-400/30',
      secondary:
        'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700',
      outline:
        'border border-neutral-700 hover:border-amber-500/50 hover:bg-amber-500/10 text-neutral-200 hover:text-amber-400',
      ghost: 'hover:bg-neutral-800 text-neutral-300 hover:text-white',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/40 border border-red-500/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
