import { FaLinkedin } from 'react-icons/fa6';
import { SiCodesandbox, SiGithub, SiTelegram } from 'react-icons/si';
import type { SocialId } from '@/content/cv';

/**
 * Brand marks come from Simple Icons rather than Lucide, whose brand set is
 * deprecated. Keeping the mapping in one file means an upstream rename only
 * ever breaks here — which it already did: Simple Icons has dropped LinkedIn,
 * so that one mark comes from Font Awesome instead.
 */
const ICONS: Record<SocialId, React.ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedin,
  github: SiGithub,
  codesandbox: SiCodesandbox,
  telegram: SiTelegram,
};

export function BrandIcon({ id, className }: { id: SocialId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} />;
}
