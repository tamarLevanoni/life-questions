import { GlassCard } from '@/components/ui/glass-card';
import { Mail, Phone, type LucideIcon } from 'lucide-react';

// ─── helpers ───────────────────────────────────────────────────────────────

function CardSectionHeader({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold font-hebrew text-foreground mb-4 flex items-center gap-2">
      <Icon className="w-4 h-4 text-teal-500" />
      {children}
    </h2>
  );
}

// ─── data ──────────────────────────────────────────────────────────────────

export const CONTACT_INFO = [
  { icon: Mail,  label: 'אימייל',    value: 'shnerb.books@gmail.com' },
  { icon: Phone, label: 'טלפון',     value: '055-2650099' },
];

// ─── components ────────────────────────────────────────────────────────────

function ContactInfoCard() {
  return (
    <GlassCard variant="light" className="p-6">
      <CardSectionHeader icon={Mail}>פרטי יצירת קשר</CardSectionHeader>
      <div className="space-y-4">
        {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-hebrew">{label}</p>
              <p className="text-sm font-medium font-hebrew">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function ContactSidebar() {
  return (
    <div className="space-y-5">
      <ContactInfoCard />
    </div>
  );
}
