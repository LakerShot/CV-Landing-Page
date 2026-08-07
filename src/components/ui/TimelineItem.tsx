import { ExternalLink, MapPin } from 'lucide-react';
import { TechTag } from './TechTag';
import { cn } from '@/lib/cn';
import type { WorkTag } from '@/content/cv';

type TimelineItemProps = {
  title: string;
  titleHref?: string;
  titleNote?: string;
  /** Rendered next to the title, e.g. the role held at that company. */
  subtitle?: string;
  meta: string;
  location?: string;
  description: React.ReactNode;
  tags?: readonly WorkTag[];
  media?: {
    src: string;
    type: string;
  };
  /** Marks the entry as ongoing: the node gets a pulsing gold halo. */
  current?: boolean;
  className?: string;
};

/**
 * One entry on a vertical gold timeline.
 *
 * The connecting line itself is drawn by the parent (see `Timeline`), so items
 * can be composed into any list without each one re-deriving its position.
 */
export function TimelineItem({
  title,
  titleHref,
  titleNote,
  subtitle,
  meta,
  location,
  description,
  tags,
  media,
  current = false,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn('relative pl-10 md:pl-14', className)} data-reveal-child>
      {/* Node */}
      <span
        className={cn(
          'absolute top-2 left-0 flex size-3.5 items-center justify-center rounded-full',
          'border-2 border-gold bg-canvas',
          current && 'shadow-[0_0_0_5px_rgba(201,162,39,0.18)]',
        )}
        aria-hidden="true"
      >
        {current && <span className="size-1.5 animate-pulse rounded-full bg-gold" />}
      </span>

      <article className="card-surface p-5 transition-colors duration-300 md:p-7 xl:p-8">
        <header className="mb-3">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3 className="font-display text-fluid-lg font-semibold tracking-tight">
              {titleHref ? (
                <a
                  href={titleHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  {title}
                  <ExternalLink
                    className="size-[0.75em] text-ink-faint transition-colors group-hover:text-gold"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                title
              )}
            </h3>
            {titleNote && (
              <span className="rounded-full border border-hairline px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-faint uppercase">
                {titleNote}
              </span>
            )}
            {tags?.map((tag) => (
              <TechTag key={tag.label} label={tag.label} tone={tag.tone} />
            ))}
          </div>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fluid-xs text-ink-muted">
            {subtitle && (
              <>
                <span className="text-ink">{subtitle}</span>
                <span className="text-ink-faint" aria-hidden="true">
                  ·
                </span>
              </>
            )}
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                {location}
              </span>
            )}
            {location && (
              <span className="text-ink-faint" aria-hidden="true">
                ·
              </span>
            )}
            <span>{meta}</span>
          </p>
        </header>

        <p className="text-fluid-sm leading-relaxed text-ink-muted">{description}</p>

        {media && (
          <video
            className="mt-6 aspect-video w-full rounded-lg border border-hairline bg-canvas object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={title}
          >
            <source src={media.src} type={media.type} />
          </video>
        )}
      </article>
    </li>
  );
}

/**
 * Wraps timeline items and draws the vertical gold line behind them.
 *
 * The line is scaled in from the top by `Timeline`'s own ScrollTrigger in the
 * sections that use it, giving the "drawing itself" effect.
 */
export function Timeline({
  children,
  className,
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  /** React 19 accepts `ref` as an ordinary prop — no forwardRef needed. */
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={cn('relative', className)}>
      <span
        data-timeline-line
        className="absolute top-2 bottom-0 left-[6px] w-px origin-top bg-gradient-to-b from-gold via-gold/60 to-gold/0 md:left-[6px]"
        aria-hidden="true"
      />
      <ol className="space-y-6 md:space-y-8">{children}</ol>
    </div>
  );
}
