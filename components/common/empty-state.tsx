import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state" dir="rtl">
      {Icon && <Icon className="w-16 h-16 mb-4 opacity-30" />}
      <p className="text-lg font-medium font-hebrew">{title}</p>
      {description && (
        <p className="text-sm mt-2 font-hebrew text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
