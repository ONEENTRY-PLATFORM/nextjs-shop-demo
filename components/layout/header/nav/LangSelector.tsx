'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { JSX } from 'react';

/**
 * Language selector component for switching between different locales in the application.
 * Renders a dropdown select element with available languages and handles navigation on selection change.
 * @param   {object}         props         - Lang selector props.
 * @param   {ILocalEntity[]} props.locales - locales list.
 * @param   {string}         props.lang    - current language shortcode.
 * @returns {JSX.Element}                  Lang selector select.
 */
const LangSelector = ({
  locales,
  lang,
}: {
  locales: ILocalEntity[];
  lang: string;
}): JSX.Element => {
  /**
   * Get current pathname from Next.js router
   * Used to maintain the current route when switching languages
   */
  const pathname = usePathname();

  /**
   * Get router replace function from Next.js router
   * Used to navigate to the same page in a different language
   */
  const { replace } = useRouter();

  /**
   * Return empty fragment if locales or current language are not provided
   * Prevents rendering an invalid language selector
   */
  if (!locales || !lang) {
    return <></>;
  }

  /**
   * Handle language change by redirecting to the same page in the selected language
   * @param {string} value - The selected language shortcode
   */
  const onChange = (value: string) => {
    /**
     * Replace current URL with the new language prefix
     * Preserves the rest of the path after the language segment
     */
    replace('/' + value + pathname.slice(3));
  };

  return (
    <select
      defaultValue={lang}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent cursor-pointer text-lg font-bold uppercase text-neutral-600"
    >
      {/** Map through active locales and create option elements */}
      {locales
        ?.filter((locale: { isActive: boolean }) => locale.isActive && locale)
        .map((locale: ILocalEntity) => {
          return (
            <option key={locale.shortCode} value={locale.shortCode}>
              {locale.shortCode}
            </option>
          );
        })}
    </select>
  );
};

export default LangSelector;
