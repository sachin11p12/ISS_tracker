import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  children,
  className,
  variant = 'cyan',
  size = 'sm',
  dot = false,
  pulse = false,
  ...props
}: BadgeProps) {
  const variantStyles = {
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700/50',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/50',
    amber: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/50',
    rose: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/50',
    purple: 'bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-700/50',
    slate: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
    outline: 'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
  };

  const dotColors = {
    cyan: 'bg-cyan-500 dark:bg-cyan-400',
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-500 dark:bg-rose-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
    slate: 'bg-slate-500 dark:bg-slate-400',
    outline: 'bg-slate-500 dark:bg-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium gap-1.5',
    md: 'text-sm px-3 py-1 font-semibold gap-2',
    lg: 'text-base px-3.5 py-1.5 font-semibold gap-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-xs backdrop-blur-xs transition-all select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                dotColors[variant]
              )}
            />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotColors[variant])} />
        </span>
      )}
      {children}
    </span>
  );
}
