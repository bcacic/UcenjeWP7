
import React from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageTitle = ({ title, subtitle, className }: PageTitleProps) => {
  return (
    <div className={cn("mb-8 animate-slide-down", className)}>
      <div className="inline-block">
        <div className="mb-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          Rođendaonica
        </div>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;
