'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface ContactSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContactSuccessDialog({ open, onClose }: ContactSuccessDialogProps) {
  if (!open) return null;

  return (
    <GlassCard variant="light" className="p-6 md:p-8">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle className="w-16 h-16 text-teal-500" />
        <h2 className="text-xl font-bold font-hebrew">הפנייה נשלחה!</h2>
        <p className="text-muted-foreground font-hebrew text-sm max-w-xs">
          תודה על פנייתך. נחזור אליך בהקדם האפשרי.
        </p>
        <Button variant="outline" className="font-hebrew mt-2" onClick={onClose}>
          שלח פנייה נוספת
        </Button>
      </div>
    </GlassCard>
  );
}
