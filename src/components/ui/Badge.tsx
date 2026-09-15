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
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50 shadow-cyan-950/50',
    emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50 shadow-emerald-950/50',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-700/50 shadow-amber-950/50',
    rose: 'bg-rose-950/80 text-rose-300 border-rose-700/50 shadow-rose-950/50',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-700/50 shadow-purple-950/50',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60 shadow-slate-950/50',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const dotColors = {
    cyan: 'bg-cyan-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    purple: 'bg-purple-400',
    slate: 'bg-slate-400',
    outline: 'bg-slate-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium gap-1.5',
    md: 'text-sm px-3 py-1 font-semibold gap-2',
    lg: 'text-base px-3.5 py-1.5 font-semibold gap-2.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-sm backdrop-blur-sm transition-all select-none',
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
