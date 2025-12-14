import type { IAttributeValues } from 'oneentry/dist/base/utils';

/**
 * ReviewForm component props
 * @property {string}           lang - Language code for localization (e.g., 'en_US', 'ru_RU')
 * @property {IAttributeValues} dict - Dictionary object containing localized strings for UI text
 */
export interface ReviewFormProps {
  /** Language code for form localization */
  lang: string;
  /** Dictionary with localized text strings */
  dict: IAttributeValues;
}
