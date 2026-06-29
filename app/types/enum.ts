/**
 * Language codes mapping
 */
export enum LanguageEnum {
  en = 'en_US',
  fr = 'fr_FR',
}

/**
 * Converts a Next.js route lang code (`'en'`, `'fr'`) to a OneEntry SDK
 * `langCode` (`'en_US'`, `'fr_FR'`). Centralized so call sites do not have to
 * repeat `LanguageEnum[lang as keyof typeof LanguageEnum]`.
 * @param   {string} lang - Short locale from `params.lang`.
 * @returns {string}      Long locale code accepted by the SDK.
 */
export const toLangCode = (lang: string): string =>
  LanguageEnum[lang as keyof typeof LanguageEnum];

/**
 * Internationalization codes mapping
 */
export enum IntlEnum {
  en = 'en-US',
  fr = 'fr-FR',
}

/**
 * Currency codes mapping
 */
export enum CurrencyEnum {
  en = 'USD',
  fr = 'EUR',
}

/**
 * Size options
 */
export enum Sizes {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

/**
 * Condition markers for filtering
 */
export enum ConditionMarkersEnum {
  IN = 'in',
  NIN = 'nin',
  EQ = 'eq',
  NEQ = 'neq',
  MTH = 'mth',
  LTH = 'lth',
  EXS = 'exs',
  NEXS = 'nexs',
}

/**
 * Form field types mapping
 */
export enum FormFieldsEnum {
  string = 'text',
  email = 'email',
  password = 'password',
  phone = 'tel',
  date = 'date',
  dateTime = 'datetime-local',
  time = 'time',
  text = 'textarea',
  list = 'list',
  spam = 'spam',
  button = 'button',

  email_reg = email,
  email_notifications = email,
  phone_reg = phone,
  password_reg = password,
  password_confirm = password,
  card_cvc = password,
}

/**
 * Minimum length constraints for fields
 */
export enum minLengthFieldsEnum {
  card_cvc = 3,
}

/**
 * Maximum length constraints for fields
 */
export enum maxLengthFieldsEnum {
  card_cvc = 3,
}
