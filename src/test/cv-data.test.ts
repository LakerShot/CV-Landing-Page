import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import ru from '../../messages/ru.json';
import {
  EDUCATION,
  EXPERIENCE,
  MENTORING,
  PROFILE,
  SECTIONS,
  SKILL_GROUPS,
  SOCIALS,
  TECH_TAGS,
} from '@/content/cv';

const catalogues = { en, ru } as const;

/** Walk a dotted path through a message catalogue. */
function lookup(catalogue: unknown, path: string) {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined,
      catalogue,
    );
}

describe('cv data', () => {
  it('has unique ids within every collection', () => {
    const collections = {
      experience: EXPERIENCE.map((item) => item.id),
      mentoring: MENTORING.map((item) => item.id),
      education: EDUCATION.map((item) => item.id),
      skills: SKILL_GROUPS.map((item) => item.id),
      socials: SOCIALS.map((item) => item.id),
    };

    for (const [name, ids] of Object.entries(collections)) {
      expect(new Set(ids).size, `${name} has duplicate ids`).toBe(ids.length);
    }
  });

  it('keeps skill levels within 0-100', () => {
    for (const skill of SKILL_GROUPS) {
      expect(skill.level, skill.id).toBeGreaterThanOrEqual(0);
      expect(skill.level, skill.id).toBeLessThanOrEqual(100);
    }
  });

  it('exposes only absolute, parseable social URLs', () => {
    for (const social of SOCIALS) {
      expect(() => new URL(social.href), social.id).not.toThrow();
      expect(new URL(social.href).protocol, social.id).toBe('https:');
    }
  });

  it('has no duplicate tech tags', () => {
    expect(new Set(TECH_TAGS).size).toBe(TECH_TAGS.length);
  });

  it('points at assets the extraction script produces', () => {
    expect(PROFILE.avatar).toBe('/avatar.jpg');
    expect(PROFILE.avatarMask).toBe('/avatar-mask.png');
    expect(PROFILE.cvFile.endsWith('.pdf')).toBe(true);
  });

  /*
   * This is the pairing that actually breaks in practice: adding an entry to
   * cv.ts without adding its copy leaves the UI rendering a raw message key.
   */
  it.each(Object.keys(catalogues) as Array<keyof typeof catalogues>)(
    'has %s copy for every data entry',
    (locale) => {
      const catalogue = catalogues[locale];
      const missing: string[] = [];

      const require_ = (path: string) => {
        const value = lookup(catalogue, path);
        if (typeof value !== 'string') missing.push(path);
      };

      for (const job of EXPERIENCE) {
        for (const field of ['role', 'location', 'arrangement', 'duration', 'description']) {
          require_(`experience.items.${job.id}.${field}`);
        }
      }

      for (const item of MENTORING) {
        for (const field of ['role', 'location', 'arrangement', 'duration', 'description']) {
          require_(`mentoring.items.${item.id}.${field}`);
        }
      }

      for (const item of EDUCATION) {
        for (const field of ['period', 'note', 'location', 'description']) {
          require_(`education.items.${item.id}.${field}`);
        }
      }

      for (const section of SECTIONS) {
        require_(`nav.${section}`);
      }

      expect(missing).toEqual([]);
    },
  );

  it('gives every nav section a matching page anchor id', () => {
    // Hero renders as `about`; the rest map to their own section components.
    expect([...SECTIONS]).toEqual([
      'about',
      'skills',
      'experience',
      'mentoring',
      'education',
      'contact',
    ]);
  });
});
