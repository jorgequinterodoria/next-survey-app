'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface FieldStatusProps {
  isValid: boolean;
  showWhenInvalid?: boolean;
  size?: 'sm' | 'md';
}

export function FieldStatus({ isValid, showWhenInvalid = false, size = 'sm' }: FieldStatusProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  if (isValid) {
    return (
      <CheckCircle2 className={`${sizeClasses[size]} text-green-500 transition-all duration-300`} />
    );
  }

  if (showWhenInvalid) {
    return (
      <Circle className={`${sizeClasses[size]} text-slate-300 transition-all duration-300`} />
    );
  }

  return null;
}

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function SectionProgress({ current, total, label }: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {label || `${current}/${total}`}
      </span>
    </div>
  );
}
