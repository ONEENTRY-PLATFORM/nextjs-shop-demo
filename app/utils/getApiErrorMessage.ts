import { isError } from '@/app/api/api/api';

/** Generic fallback shown when the error carries no usable message. */
const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Human-readable fallbacks per HTTP status, used only when the API
 * response has no `message` (real OneEntry errors usually have one,
 * e.g. "User with provided login not found").
 */
const STATUS_FALLBACKS: Record<number, string> = {
  400: 'Please check the entered data and try again.',
  401: 'Incorrect login or password.',
  403: 'Access denied.',
  404: 'Not found.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Server error. Please try again later.',
  502: 'Server error. Please try again later.',
  503: 'Server error. Please try again later.',
  504: 'Server error. Please try again later.',
};

/**
 * Friendly field names for Joi-style validation messages such as
 * `"notificationData.email" must be a valid email` (verified against the
 * live API on signUp with a malformed email).
 */
const FIELD_LABELS: Record<string, string> = {
  'notificationData.email': 'Email',
  'notificationData.phoneSMS': 'Phone',
};

/**
 * Rewrites known technical API messages into user-friendly wording.
 * @param   {string} message - Raw `message` from an API error response.
 * @returns {string}         Cleaned-up message safe to show to the user.
 */
const humanize = (message: string): string => {
  /** Project record limit (405 on signUp) — meaningless to the end user. */
  if (message.includes('exceeds the threshold')) {
    return 'Registration is temporarily unavailable. Please try again later.';
  }

  /** Joi validation: `"path.to.field" must be ...` → `Email must be ...` */
  const joiMatch = message.match(/^"([\w.]+)"\s+(.*)$/);
  if (joiMatch) {
    const path = joiMatch[1] ?? '';
    const rest = joiMatch[2] ?? '';
    const label = FIELD_LABELS[path] || path.split('.').pop() || path;
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${rest}`;
  }

  return message;
};

/**
 * Converts any error shape the OneEntry SDK can produce (a returned
 * `IError`, a thrown `Error`, or anything else) into a message suitable
 * for direct display in a form.
 *
 * Prefers `localizeMessage` (set by the SDK on response-validation
 * failures, where `message` is technical), then the humanized API
 * `message`, then a per-status fallback.
 * @param   {unknown} error      - Value returned or thrown by an SDK call.
 * @param   {string}  [fallback] - Message to use when nothing better is available.
 * @returns {string}             Human-readable error message.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_MESSAGE,
): string => {
  if (isError(error)) {
    if (error.localizeMessage) {
      return error.localizeMessage;
    }
    if (typeof error.message === 'string' && error.message.trim()) {
      return humanize(error.message);
    }
    return STATUS_FALLBACKS[error.statusCode] || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
