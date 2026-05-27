import { GlassCard } from '@/components/ui/glass-card';
import { Mail, Phone, Clock, Globe, ExternalLink, type LucideIcon } from 'lucide-react';

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

const CONTACT_INFO = [
  { icon: Mail,  label: 'אימייל',    value: 'shnerb.books@gmail.com' },
  { icon: Phone, label: 'טלפון',     value: '055-2650099' },
];

const OTHER_PROJECTS = [
  { name: 'שם פרויקט א׳', description: 'תיאור קצר של הפרויקט', url: '#' },
  { name: 'שם פרויקט ב׳', description: 'תיאור קצר של הפרויקט', url: '#' },
];

const MAIN_SITE_URL = '#';

// ─── components ────────────────────────────────────────────────────────────

function ContactInfoCard() {
  return (
    <GlassCard variant="light" className="p-6">
      <CardSectionHeader icon={Mail}>פרטי יצירת קשר</CardSectionHeader>
      <div className="space-y-4">
        {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center flex-shrink-0">
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

function ProjectsCard() {
  return (
    <GlassCard variant="light" className="p-6">
      <CardSectionHeader icon={Globe}>הפרויקטים שלנו</CardSectionHeader>
      <div className="space-y-3">
        {OTHER_PROJECTS.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium font-hebrew group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {project.name}
              </p>
              <p className="text-xs text-muted-foreground font-hebrew mt-0.5">
                {project.description}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 transition-colors flex-shrink-0 mt-0.5" />
          </a>
        ))}
      </div>
      <a
        href={MAIN_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-teal-200 dark:border-teal-800 text-sm font-medium font-hebrew text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
      >
        <Globe className="w-4 h-4" />
        לאתר המרכזי
      </a>
    </GlassCard>
  );
}

export function ContactSidebar() {
  return (
    <div className="space-y-5">
      <ContactInfoCard />
      {/* <ProjectsCard /> */}
    </div>
  );
}
