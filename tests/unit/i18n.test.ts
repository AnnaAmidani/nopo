// tests/unit/i18n.test.ts
import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGS, TRANSLATIONS } from '../../src/i18n/translations';

describe('SUPPORTED_LANGS', () => {
  it('contains en and it', () => {
    expect(SUPPORTED_LANGS).toContain('en');
    expect(SUPPORTED_LANGS).toContain('it');
  });
});

describe('TRANSLATIONS', () => {
  it('all languages have the same top-level keys', () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const itKeys = Object.keys(TRANSLATIONS.it).sort();
    expect(itKeys).toEqual(enKeys);
  });

  it('all languages have the same category keys', () => {
    const enCats = Object.keys(TRANSLATIONS.en.categories).sort();
    const itCats = Object.keys(TRANSLATIONS.it.categories).sort();
    expect(itCats).toEqual(enCats);
  });

  it('no translation value is an empty string', () => {
    for (const lang of SUPPORTED_LANGS) {
      for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
        if (typeof value === 'string') {
          expect(value, `TRANSLATIONS.${lang}.${key} is empty`).not.toBe('');
        } else if (typeof value === 'object' && value !== null) {
          for (const [subKey, subValue] of Object.entries(value)) {
            if (typeof subValue === 'string') {
              expect(subValue, `TRANSLATIONS.${lang}.${key}.${subKey} is empty`).not.toBe('');
            }
          }
        }
      }
    }
  });
});
