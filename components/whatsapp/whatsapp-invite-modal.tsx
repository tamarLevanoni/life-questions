'use client';

import { useWhatsAppInvite } from '@/lib/whatsapp-context';
import { WHATSAPP_GROUP_URL, TEACHERS_GROUP_URL } from '@/lib/config/whatsapp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const GROUPS = [
  {
    href: WHATSAPP_GROUP_URL,
    title: 'קבוצה כללית',
    description: 'עדכונים על סיפורים חדשים, שאלות לדיון וטיפים לשיעורים',
  },
  {
    href: TEACHERS_GROUP_URL,
    title: 'קבוצת מורים',
    description: 'קבוצה ייעודית למורים ומחנכים: רעיונות להוראה, דיונים מקצועיים והתאמות לכיתה',
  },
];

export function WhatsAppInviteModal() {
  const { isOpen, closeWhatsAppModal } = useWhatsAppInvite();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeWhatsAppModal(); }}>
      <DialogContent className="sm:max-w-md border-black/10 dark:border-white/10" dir="rtl">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-3 shadow-lg shadow-green-500/30">
            <WhatsAppIcon className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold font-hebrew text-center">
            הצטרפו לקהילת הווצאפ שלנו
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-hebrew text-center leading-relaxed">
            בחרו את הקבוצה המתאימה לכם
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {GROUPS.map(({ href, title, description }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeWhatsAppModal}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 hover:bg-green-500/5 hover:border-green-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                <WhatsAppIcon className="w-4.5 h-4.5 text-white" />
              </span>
              <span className="flex flex-col text-right">
                <span className="font-hebrew font-bold text-sm">{title}</span>
                <span className="font-hebrew text-xs text-muted-foreground leading-relaxed">{description}</span>
              </span>
            </a>
          ))}
          <button
            onClick={closeWhatsAppModal}
            className="w-full py-2.5 text-sm text-muted-foreground font-hebrew hover:text-foreground transition-colors"
          >
            אולי מאוחר יותר
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
