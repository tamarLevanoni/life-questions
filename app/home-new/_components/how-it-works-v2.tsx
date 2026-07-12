'use client';

import { BookOpen, HelpCircle, Lightbulb, GraduationCap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { MotionFadeIn } from '@/components/common/motion-fade-in';

/* ─── layout constants ──────────────────────────────────────────
   Circles never overlap each other — they sit GAP apart (matches the
   `gap-5`/`gap-x-5` Tailwind utility below). Only the small connector
   tab bridges that gap and pokes TIP px onto the next ring's face —
   earlier steps stack above later ones so each tab stays on top. */
const CIRCLE = 200; // px – ring outer diameter
const RING   = 14;  // px – gradient ring thickness
const GAP    = 20;  // px – space between adjacent rings (== Tailwind gap-5)
const TIP    = 10;   // px – how far the tab reaches under the next ring (kept small on purpose)
const TAB_W  = GAP + TIP; // px – connector length along the flow axis
const TAB_H  = 52;        // px – connector width, perpendicular to the flow

/* ─── step definitions ──────────────────────────────────────── */
type StepDef = {
  index: number;
  number: string;
  title: string;
  description: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
};

const STEPS: StepDef[] = [
  { index: 1, number: "01", title: "סיפור",    description: "סיפור קצר מהחיים",  color: "#f97316", Icon: BookOpen      },
  { index: 2, number: "02", title: "שאלה",    description: "התמודדות עם השאלה",    color: "#a855f7", Icon: HelpCircle    },
  { index: 3, number: "03", title: "תשובה",  description: "גילוי התשובה הקצרה",  color: "#22c55e", Icon: Lightbulb     },
  { index: 4, number: "04", title: "הרחבה",   description: "העמקה במקורות",     color: "#06b6d4", Icon: GraduationCap },
];

/* ─── connector: small tab pointing left, flush against the ring (desktop row) ── */
function ConnectorLeft({ from, to, gradId }: { from: string; to: string; gradId: string }) {
  return (
    <svg
      aria-hidden
      width={TAB_W}
      height={TAB_H}
      viewBox={`0 0 ${TAB_W} ${TAB_H}`}
      className="hidden lg:block absolute pointer-events-none"
      style={{ right: "100%", top: "50%", transform: "translateY(-50%)" }}
    >
      <defs>
        <linearGradient id={gradId} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <polygon
        points={`${TAB_W},0 ${TAB_W},${TAB_H} 0,${TAB_H / 2}`}
        fill={`url(#${gradId})`}
        stroke="white"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── connector: small tab pointing down (mobile column) ───────────────────── */
function ConnectorDown({ from, to, gradId }: { from: string; to: string; gradId: string }) {
  return (
    <svg
      aria-hidden
      width={TAB_H}
      height={TAB_W}
      viewBox={`0 0 ${TAB_H} ${TAB_W}`}
      className="block sm:hidden absolute pointer-events-none"
      style={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,0 ${TAB_H},0 ${TAB_H / 2},${TAB_W}`}
        fill={`url(#${gradId})`}
        stroke="white"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── one process step: gradient ring + white face + its outgoing connector ── */
function StepCircle({ step, next }: { step: StepDef; next?: StepDef }) {
  const { color, Icon, number, title, description } = step;
  const ringFrom = `color-mix(in srgb, ${color} 45%, white)`;

  return (
    <MotionFadeIn
      delay={step.index * 0.12}
      trigger="view"
      className="relative shrink-0"
      style={{ zIndex: STEPS.length - step.index }}
    >
      <div
        className="relative rounded-full shadow-[0_18px_36px_-16px_rgba(0,0,0,0.32)]"
        style={{
          width: CIRCLE,
          height: CIRCLE,
          background: `linear-gradient(135deg, ${ringFrom}, ${color})`,
        }}
      >
        {/* white face */}
        <div
          className="absolute rounded-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center"
          style={{ inset: RING }}
        >
          <Icon size={40} strokeWidth={1.6} color={color} />

          <div
            className="w-7/10 mt-3 mb-2.5"
            style={{ borderTop: `3px dotted ${color}`, opacity: 0.5 }}
          />

          <div dir="rtl" className="flex items-start justify-center w-7/10 gap-1.5">
            <span
              className="font-black leading-none shrink-0"
              style={{ color, fontSize: 26 }}
            >
              {number}
            </span>
            <div className="text-right">
              <span
                className="font-bold leading-none"
                style={{ color, fontSize: 16 }}
              >
                {title}
              </span>
              <p
                dir="rtl"
                className="text-right leading-snug text-neutral-500 dark:text-neutral-400"
                style={{ fontSize: 13 }}
              >
                {description}
              </p>
            </div>
          </div>
        </div>

        {next && (
          <>
            <ConnectorLeft
              from={color}
              to={next.color}
              gradId={`grad-l-${step.index}`}
            />
            <ConnectorDown
              from={color}
              to={next.color}
              gradId={`grad-d-${step.index}`}
            />
          </>
        )}
      </div>
    </MotionFadeIn>
  );
}

export function HowItWorksV2() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">

      <div className="relative max-w-5xl mx-auto">
        <MotionFadeIn>
          <SectionHeader
            title="איך זה עובד?"
            subtitle="מבנה קבוע וברור שמאפשר לימוד מהיר ויעיל"
            size="sm"
          />
        </MotionFadeIn>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center justify-center justify-items-center gap-y-4 sm:gap-x-10 sm:gap-y-16 lg:gap-x-4 lg:gap-y-0">
          {STEPS.map((step, i) => (
            <StepCircle key={step.index} step={step} next={STEPS[i + 1]} />
          ))}
        </div>
      </div>
    </section>
  );
}
