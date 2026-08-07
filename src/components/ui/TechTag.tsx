import { cn } from '@/lib/cn';
import type { WorkTag } from '@/content/cv';

const TONE_CLASSES: Record<WorkTag['tone'], string> = {
  react: 'border-sky-400/40 text-sky-300',
  vue: 'border-emerald-400/40 text-emerald-300',
  angular: 'border-rose-400/40 text-rose-300',
  gold: 'border-gold/50 text-gold-bright',
  neutral: 'border-hairline text-ink-muted',
};

/** Small pill used for the coloured technology tags next to each company. */
export function TechTag({ label, tone = 'neutral' }: { label: string; tone?: WorkTag['tone'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5',
        'text-[0.6875rem] font-semibold tracking-[0.08em] uppercase',
        TONE_CLASSES[tone],
      )}
    >
      {label}
    </span>
  );
}
