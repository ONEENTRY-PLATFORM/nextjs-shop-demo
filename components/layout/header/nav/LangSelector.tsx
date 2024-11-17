'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ILocalEntity } from 'oneentry/dist/locales/localesInterfaces';
import type { FC, Key } from 'react';

/**
 * Lang selector
 * @param locales
 * @param lang current language shortcode
 *
 * @returns Lang selector select
 */
const LangSelector: FC<{ locales: ILocalEntity[]; lang: string }> = ({
  locales,
  lang,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  if (!locales || !lang) {
    return;
  }

  // redirect to locale on change
  const onChange = (value: string) => {
    replace('/' + value + pathname.slice(3));
  };

  return (
    <select
      defaultValue={lang}
      onChange={(e) => onChange(e.target.value)}
      className="uppercase text-neutral-600"
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
