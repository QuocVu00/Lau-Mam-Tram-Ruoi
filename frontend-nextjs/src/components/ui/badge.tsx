import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    success: 'bg-emerald-950/70 text-emerald-400 border-emerald-700/50',
    warning: 'bg-amber-950/70 text-amber-400 border-amber-700/50',
    danger: 'bg-red-950/70 text-red-400 border-red-700/50',
    info: 'bg-sky-950/70 text-sky-400 border-sky-700/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
