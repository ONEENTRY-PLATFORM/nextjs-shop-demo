/**
 * Tokens dropped when deriving a display name. `rvw` is the suffix used by the
 * review-seeding accounts (`<first>.<last>.rvw@example.com`); stripping it turns
 * `emma.johnson.rvw@example.com` into `Emma Johnson` instead of `Emma Johnson Rvw`.
 */
const IGNORED_NAME_TOKENS = new Set(['rvw']);

/**
 * Capitalizes a single token: first letter upper-cased, the rest lower-cased.
 * @param   {string} word - Raw token (e.g. `"johnson"`).
 * @returns {string}      Capitalized token (e.g. `"Johnson"`).
 */
const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

/**
 * Derives a human-friendly display name for a review author from their OneEntry
 * `userIdentifier` (a login / email).
 *
 * The SDK exposes no way to resolve another user's profile name by identifier
 * (`Users.getUser()` only returns the *current* user, and there is no
 * user-by-identifier lookup for the app token), so the name is derived locally
 * from the identifier itself:
 *
 * - empty / null identifier → `fallback` (default `"Anonymous"`);
 * - the local part before `@` is taken and any `"+tag"` suffix dropped;
 * - it is split on `.`, `_`, `-`, seeding/service tokens are removed, and each
 * remaining token is capitalized.
 * @example
 * getReviewAuthorName('emma.johnson.rvw@example.com') // → 'Emma Johnson'
 * getReviewAuthorName('neibips@gmail.com')            // → 'Neibips'
 * getReviewAuthorName('admin')                        // → 'Admin'
 * getReviewAuthorName(null)                           // → 'Anonymous'
 * @param   {string | null | undefined} userIdentifier - Review author's identifier (login / email).
 * @param   {string}                    [fallback]     - Text shown when there is no identifier. Default: `"Anonymous"`.
 * @returns {string}                                   Display name for the review card.
 */
export const getReviewAuthorName = (
  userIdentifier?: string | null,
  fallback = 'Anonymous',
): string => {
  // Coerce defensively: callers pass `review.userIdentifier` from `any`-typed
  // review objects, so a non-string value must not throw on `.trim()`.
  const raw = String(userIdentifier ?? '').trim();
  if (!raw) {
    return fallback;
  }

  /** Local part of an email (before `@`), stripped of any `"+tag"` suffix. */
  const localPart = (raw.split('@')[0] ?? raw).split('+')[0] ?? '';

  /** Meaningful, capitalized name tokens. */
  const words = localPart
    .split(/[._-]+/)
    .map((word) => word.trim())
    .filter(
      (word) => word.length > 0 && !IGNORED_NAME_TOKENS.has(word.toLowerCase()),
    )
    .map(capitalize);

  return words.join(' ') || fallback;
};
