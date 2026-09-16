import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
}

export function Card({ children, className, glow = false, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md p-5 text-slate-900 shadow-md transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/70 dark:text-slate-100 dark:shadow-xl',
        glow && 'border-cyan-300/80 shadow-[0_4px_20px_-4px_rgba(6,182,212,0.15)] dark:border-cyan-500/30 dark:shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)]',
        interactive && 'hover:border-slate-300 hover:bg-slate-50/90 cursor-pointer dark:hover:border-slate-700 dark:hover:bg-slate-900/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-4 dark:border-slate-800/60', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2 dark:text-slate-400', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardValue({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('text-2xl font-bold font-mono text-slate-900 tracking-tight dark:text-slate-50', className)} {...props}>
      {children}
    </div>
  );
}
