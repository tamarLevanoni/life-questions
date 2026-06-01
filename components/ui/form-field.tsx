import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs text-muted-foreground font-hebrew flex items-center gap-1">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-muted-foreground/60 font-hebrew">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive font-hebrew">{error}</p>
      )}
    </div>
  );
}
