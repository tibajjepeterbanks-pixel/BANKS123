'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-300 rounded-lg focus:outline-none active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-makerere-maroon to-makerere-gold text-white hover:shadow-lg disabled:opacity-50',
    secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 disabled:opacity-50',
    outline: 'border-2 border-makerere-maroon text-makerere-maroon hover:bg-makerere-maroon hover:text-white disabled:opacity-50',
    ghost: 'text-makerere-maroon hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <span className="animate-spin">⏳</span>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
