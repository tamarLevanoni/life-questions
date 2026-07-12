import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'start';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  size = 'md',
  className,
}: SectionHeaderProps) {
  const titleSizes = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-4xl md:text-5xl',
  };

  return (
    <div
      className={cn(
        'mb-6 md:mb-12',
        align === 'center' && 'text-center',
        className
      )}
    >
      <h2
        className={cn(
          'font-bold font-hebrew mb-4',
          titleSizes[size]
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs md:text-sm text-muted-foreground font-hebrew">{subtitle}</p>
      )}
    </div>
  );
}
