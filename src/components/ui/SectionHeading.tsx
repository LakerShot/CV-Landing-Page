import { SplitHeading } from './SplitHeading';

type SectionHeadingProps = {
  kicker: string;
  title: string;
  /** Links the section's `aria-labelledby` to the rendered heading. */
  headingId: string;
};

/** Shared eyebrow + gold rule + large title used at the top of every section. */
export function SectionHeading({ kicker, title, headingId }: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16 xl:mb-20">
      <div className="mb-4 flex items-center gap-4" data-reveal-child>
        <span className="h-px w-8 shrink-0 bg-gold" aria-hidden="true" />
        <span className="text-fluid-xs font-semibold tracking-[0.22em] text-gold uppercase">
          {kicker}
        </span>
      </div>

      <SplitHeading
        id={headingId}
        className="text-fluid-3xl font-semibold tracking-[-0.03em]"
        stagger={0.02}
      >
        {title}
      </SplitHeading>
    </div>
  );
}
