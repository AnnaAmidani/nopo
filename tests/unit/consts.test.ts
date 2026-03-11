// tests/unit/consts.test.ts
import { describe, expect, it } from 'vitest';
import { CATEGORIES, SITE_DESCRIPTION, SITE_TITLE } from '../../src/consts';
import { TRANSLATIONS } from '../../src/i18n/translations';

describe('site constants', () => {
  it('SITE_TITLE is a non-empty string', () => {
    expect(typeof SITE_TITLE).toBe('string');
    expect(SITE_TITLE.length).toBeGreaterThan(0);
  });

  it('SITE_DESCRIPTION is a non-empty string', () => {
    expect(typeof SITE_DESCRIPTION).toBe('string');
    expect(SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it('CATEGORIES is a non-empty array with slug and label', () => {
    expect(CATEGORIES.length).toBeGreaterThan(0);
    for (const cat of CATEGORIES) {
      expect(typeof cat.slug).toBe('string');
      expect(typeof cat.label).toBe('string');
    }
  });

  it('every CATEGORIES slug exists as a key in TRANSLATIONS category maps', () => {
    for (const cat of CATEGORIES) {
      expect(
        cat.slug in TRANSLATIONS.en.categories,
        `slug "${cat.slug}" missing from TRANSLATIONS.en.categories`
      ).toBe(true);
      expect(
        cat.slug in TRANSLATIONS.it.categories,
        `slug "${cat.slug}" missing from TRANSLATIONS.it.categories`
      ).toBe(true);
    }
  });
});
