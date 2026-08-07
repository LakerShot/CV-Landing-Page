/**
 * Language-neutral résumé data.
 *
 * Everything here is a fact that reads the same in every language: ids, dates,
 * URLs, tags, skill levels. All human-readable prose lives in
 * `messages/{en,ru}.json` under a key derived from the `id` below — e.g.
 * experience entry `salmon` resolves `experience.items.salmon.description`.
 *
 * Adding a language therefore never requires touching a component.
 */

export const PROFILE = {
  firstName: 'Egor',
  lastName: 'Morozov',
  dateOfBirth: '2000-05-06',
  /** Displayed as-is, matching the source résumé. */
  dateOfBirthDisplay: '06/05/2000',
  yearsOfExperience: 7,
  email: 'egormorozdev@outlook.com',
  cvFile: '/Egor_Morozov_CV.pdf',
  avatar: '/avatar.jpg',
  avatarMask: '/avatar-mask.png',
} as const;

export type SocialId = 'linkedin' | 'github' | 'codesandbox' | 'telegram';

export type SocialLink = {
  id: SocialId;
  label: string;
  href: string;
};

export const SOCIALS: readonly SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/egor-morozov-a39ab71b5/',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/LakerShot',
  },
  {
    id: 'codesandbox',
    label: 'CodeSandbox',
    // TODO: this is the private workspace URL taken from the source résumé —
    // visitors will be bounced to a login screen. Replace with a public
    // profile URL, or remove this entry entirely to drop it from the site.
    href: 'https://codesandbox.io/dashboard/home?workspace=908f5dea-9a37-4d6c-a8d4-f83f17d2b215',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/egorMrDev',
  },
] as const;

/* --- Skills -------------------------------------------------------------- */

export type SkillGroup = {
  id: string;
  /** Tech names are not translated, so they live here rather than in messages. */
  label: string;
  /** 0–100, measured from the bar widths in the source résumé. */
  level: number;
};

export const SKILL_GROUPS: readonly SkillGroup[] = [
  { id: 'fundamentals', label: 'HTML / CSS / JavaScript / Git', level: 100 },
  { id: 'react', label: 'React / TypeScript / Next', level: 100 },
  { id: 'vue', label: 'Vue 3', level: 92 },
  { id: 'angular', label: 'Angular', level: 67 },
  { id: 'bundlers', label: 'Vite / Webpack', level: 95 },
  { id: 'devops', label: 'CI/CD / Docker / K8s', level: 84 },
  { id: 'testing', label: 'Testing / Vitest / Cypress / Playwright', level: 88 },
  { id: 'backend', label: 'Node.js / MongoDB / PostgreSQL', level: 62 },
] as const;

/** The secondary tech list from the résumé's bordered box. */
export const TECH_TAGS: readonly string[] = [
  'Storybook',
  'GraphQL',
  'Grafana',
  'Sentry',
  'Cypress',
  'Istio',
  'Kafka',
  'Splunk',
  'AWS',
  'Blue/Green Deployment',
  'Feature Toggles',
  'Claude Code',
  'Claude Design',
  'Codex',
  'Prometheus',
  'Strapi',
  'ELK stack',
  'Vitest',
  'Jest',
  'SEO',
  'BEM',
  'S3',
  'Git',
  'ESLint',
  'Prettier',
  'Materialize',
  'REST',
  'NEXT',
  'Vuex',
  'Pinia',
  'Redux',
  'Zustand',
  'RxJS',
  'Node.js',
  'MUI Material',
  'SOLID',
  'GRASP',
  'KISS',
  'DRY',
  'OOP',
  'Design Patterns',
  'Performance',
  'FSD',
  'CQRS',
  'Event Sourcing',
  'Algorithms',
  'Clean Code/Architecture',
] as const;

/* --- Experience ---------------------------------------------------------- */

export type WorkTag = {
  label: string;
  /** Drives the tag's accent colour. */
  tone: 'react' | 'vue' | 'angular' | 'neutral' | 'gold';
};

export type ExperienceItem = {
  id: string;
  company: string;
  website?: string;
  websiteUnavailable?: boolean;
  media?: {
    src: string;
    type: string;
  };
  tags: readonly WorkTag[];
  /** ISO start date, used only for ordering and machine-readable markup. */
  start: string;
  /** `null` means "present". */
  end: string | null;
  current?: boolean;
};

export const EXPERIENCE: readonly ExperienceItem[] = [
  {
    id: 'salmon',
    company: 'Salmon',
    website: 'https://salmon.ph',
    media: {
      src: '/videos/salmon-redesign.mov',
      type: 'video/quicktime',
    },
    tags: [
      { label: 'React', tone: 'react' },
      { label: 'Now', tone: 'gold' },
      { label: 'Fintech', tone: 'neutral' },
    ],
    start: '2023-01-01',
    end: null,
    current: true,
  },
  {
    id: 'reelmotion',
    company: 'Reelmotion Games',
    website: 'http://reelmotion.games/',
    tags: [
      { label: 'Vue', tone: 'vue' },
      { label: 'BTC', tone: 'neutral' },
    ],
    start: '2021-10-01',
    end: '2022-12-01',
  },
  {
    id: 'crimtan',
    company: 'Crimtan',
    website: 'https://crimtan.com/',
    tags: [
      { label: 'Angular', tone: 'angular' },
      { label: 'B2B', tone: 'neutral' },
    ],
    start: '2021-01-01',
    end: '2021-09-01',
  },
  {
    id: 'javaMentor',
    company: 'Java Mentor',
    websiteUnavailable: true,
    tags: [
      { label: 'React', tone: 'react' },
      { label: 'Education', tone: 'neutral' },
    ],
    start: '2019-01-01',
    end: '2020-12-01',
  },
] as const;

/* --- Mentoring ----------------------------------------------------------- */

export const MENTORING: readonly ExperienceItem[] = [
  {
    id: 'kata',
    company: 'Kata Academy',
    tags: [{ label: 'React', tone: 'react' }],
    start: '2021-01-01',
    end: '2022-12-01',
  },
] as const;

/* --- Education ----------------------------------------------------------- */

export type EducationItem = {
  id: string;
  institution: string;
};

export const EDUCATION: readonly EducationItem[] = [
  { id: 'apm', institution: 'Academy of Production Management' },
  { id: 'kotin', institution: 'Kotin Academy for engineering' },
] as const;

/**
 * Countries the roles above were based in — drives the hero's third stat, so it
 * stays in step with EXPERIENCE and MENTORING instead of being a magic number.
 */
export const COUNTRIES = [
  'Philippines',
  'Thailand',
  'United Kingdom',
  'Georgia',
  'Russia',
] as const;

/* --- Navigation ---------------------------------------------------------- */

/** Section ids double as anchor targets and message keys. */
export const SECTIONS = [
  'about',
  'skills',
  'experience',
  'mentoring',
  'education',
  'contact',
] as const;

export type SectionId = (typeof SECTIONS)[number];
