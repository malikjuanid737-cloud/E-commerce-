import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = ''
}) => {
  const variantStyles = {
    primary: 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-300',
    secondary: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-300',
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-300',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300',
    danger: 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-300',
    info: 'bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-300'
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
        border backdrop-blur-md whitespace-nowrap
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
