'use client';

import { Loader2 } from 'lucide-react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

export function LoadingButton({
  isLoading = false,
  loadingText = 'Procesando...',
  children,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: LoadingButtonProps) {
  const baseStyles = 'flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-green-900/30',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-red-900/30',
  };

  const disabledStyles = 'opacity-70 cursor-not-allowed';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${(isLoading || disabled) ? disabledStyles : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
