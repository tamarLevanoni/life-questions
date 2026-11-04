'use client';

import { Children, cloneElement, isValidElement, useId, type ReactElement, type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ControlProps = ComponentProps<'input'>;
interface FormFieldProps {
  label: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

// Associate the direct Input/native control, preserving its ref and explicit ID.
// Read-only content uses a caption rather than an unbound HTML label.
export function FormField({ label, error, hint, className, children }: FormFieldProps) {
  const generatedId = useId();
  const controls = Children.toArray(children);
  const isControl = (child: React.ReactNode): child is ReactElement<ControlProps> => isValidElement(child) && [Input, 'input', 'textarea', 'select'].includes(child.type as typeof Input);
  const firstControl = controls.find(isControl);
  const controlId = firstControl ? firstControl.props.id ?? generatedId : undefined;
  const content = controls.map(child => {
    if (!isControl(child)) return child;
    const control = child;
    const descriptionId = `${controlId}-description`;
    return cloneElement(control, {
      id: controlId,
      'aria-invalid': error ? true : control.props['aria-invalid'],
      'aria-describedby': [control.props['aria-describedby'], error || hint ? descriptionId : undefined].filter(Boolean).join(' ') || undefined,
    });
  });
  const labelClass = 'text-xs text-muted-foreground font-hebrew flex items-center gap-1';
  return (
    <div className={cn('space-y-1.5', className)}>
      {controlId ? <Label htmlFor={controlId} className={labelClass}>{label}</Label> : <span className={labelClass}>{label}</span>}
      {content}
      {(error || hint) && <p id={controlId ? `${controlId}-description` : undefined} className={cn('text-xs font-hebrew', error ? 'text-destructive' : 'text-muted-foreground')}>
        {error || hint}
      </p>}
    </div>
  );
}
