'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { JSX, Key } from 'react';

/**
 * Lang selector.
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
  const pathname = usePathname();
  const { replace } = useRouter();

  if (!locales || !lang) {
    return <></>;
  }

  // redirect to locale on change
  const onChange = (value: string) => {
    replace('/' + value + pathname.slice(3));
  };

  return (
    <select
      defaultValue={lang}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent cursor-pointer text-lg font-bold uppercase text-neutral-600"
    >
      {locales
        ?.filter((locale: { isActive: boolean }) => locale.isActive && locale)
        .map((locale: ILocalEntity, i: Key) => {
          return (
            <option key={i} value={locale.shortCode}>
              {locale.shortCode}
            </option>
          );
        })}
    </select>
  );
};

export default LangSelector;
