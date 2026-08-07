import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import ru from '../../messages/ru.json';
import { locales } from '@/i18n/routing';

type Dict = Record<string, unknown>;

/** Flatten nested messages into dotted paths so the two files can be compared. */
function flatten(value: unknown, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, child] of Object.entries(value as Dict)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === 'object' && !Array.isArray(child)) {
      Object.assign(out, flatten(child, path));
    } else {
      out[path] = String(child);
    }
  }

  return out;
}

/** Extract `{placeholder}` names, ignoring rich-text tags like `<b>`. */
function placeholders(message: string) {
  return [...message.matchAll(/\{(\w+)[^}]*\}/g)].map((match) => match[1]).sort();
}

const flatEn = flatten(en);
const flatRu = flatten(ru);

describe('message catalogues', () => {
  it('declares a catalogue for every configured locale', () => {
    expect(locales).toEqual(['en', 'ru']);
  });

  it('has identical key sets in en and ru', () => {
    const enKeys = Object.keys(flatEn).sort();
    const ruKeys = Object.keys(flatRu).sort();

    // Reported as diffs rather than a bare inequality so a failure names the key.
    expect(ruKeys.filter((key) => !enKeys.includes(key))).toEqual([]);
    expect(enKeys.filter((key) => !ruKeys.includes(key))).toEqual([]);
  });

  it.each([
    ['en', flatEn],
    ['ru', flatRu],
  ])('has no untranslated placeholder text in %s', (_locale, dict) => {
    const suspicious = Object.entries(dict).filter(
      ([, value]) => value.includes('TODO') || value.includes('FIXME'),
    );
    expect(suspicious).toEqual([]);
  });

  it('uses the same interpolation placeholders in both locales', () => {
    const mismatched = Object.keys(flatEn)
      .filter((key) => key in flatRu)
      .filter((key) => placeholders(flatEn[key]).join(',') !== placeholders(flatRu[key]).join(','));

    expect(mismatched).toEqual([]);
  });

  it('keeps every message non-empty except the deliberately optional ones', () => {
    // `education.items.*.note` is blank for schools with no attendance qualifier.
    const optional = /^education\.items\.\w+\.note$|^experience\.durationSuffix$/;

    for (const [locale, dict] of [
      ['en', flatEn],
      ['ru', flatRu],
    ] as const) {
      const empty = Object.entries(dict)
        .filter(([key]) => !optional.test(key))
        .filter(([, value]) => value.trim() === '')
        .map(([key]) => `${locale}:${key}`);

      expect(empty).toEqual([]);
    }
  });
});
