import { describe, expect, it } from '@jest/globals';

import { getReviewAuthorName } from '@/app/utils/getReviewAuthorName';

/*
 * Unit tests for getReviewAuthorName — derives a review author's display name
 * from their `userIdentifier` (login / email), since the SDK offers no
 * user-by-identifier lookup. Guards the review card no longer shows raw emails.
 */
describe('getReviewAuthorName', () => {
  it('turns a seeding email into a two-word name (drops the "rvw" suffix)', () => {
    expect(getReviewAuthorName('emma.johnson.rvw@example.com')).toBe(
      'Emma Johnson',
    );
  });

  it('capitalizes a single-token local part', () => {
    expect(getReviewAuthorName('neibips@gmail.com')).toBe('Neibips');
  });

  it('splits on dots, underscores and hyphens', () => {
    expect(getReviewAuthorName('john_doe-smith@x.io')).toBe('John Doe Smith');
  });

  it('drops a "+tag" suffix from the local part', () => {
    expect(getReviewAuthorName('mary.sue+promo@x.io')).toBe('Mary Sue');
  });

  it('handles a non-email identifier', () => {
    expect(getReviewAuthorName('admin')).toBe('Admin');
  });

  it('lower-cases the remainder of each token', () => {
    expect(getReviewAuthorName('JOHN.DOE@x.io')).toBe('John Doe');
  });

  it('returns the fallback for null / undefined / empty', () => {
    expect(getReviewAuthorName(null)).toBe('Anonymous');
    expect(getReviewAuthorName(undefined)).toBe('Anonymous');
    expect(getReviewAuthorName('')).toBe('Anonymous');
    expect(getReviewAuthorName('   ')).toBe('Anonymous');
  });

  it('honors a custom fallback', () => {
    expect(getReviewAuthorName('', 'Guest')).toBe('Guest');
  });

  it('returns the fallback when only ignored tokens remain', () => {
    expect(getReviewAuthorName('rvw@example.com')).toBe('Anonymous');
  });

  it('collapses repeated separators without producing empty words', () => {
    expect(getReviewAuthorName('a..b__c@x.io')).toBe('A B C');
  });

  it('does not throw on a non-string identifier (callers pass `any`)', () => {
    // Review objects are typed `any` at the call sites, so a numeric/object
    // identifier must be coerced rather than crash on `.trim()`.
    expect(getReviewAuthorName(123 as unknown as string)).toBe('123');
    expect(() => getReviewAuthorName({} as unknown as string)).not.toThrow();
  });
});
