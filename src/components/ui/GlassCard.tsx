import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  ...props 
}) => {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-300
        bg-white/75 dark:bg-slate-900/65
        backdrop-blur-xl
        border border-white/60 dark:border-white/10
        shadow-[0_8px_32px_0_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-xl hover:border-blue-500/30 hover:bg-white/90 dark:hover:bg-slate-900/80' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
