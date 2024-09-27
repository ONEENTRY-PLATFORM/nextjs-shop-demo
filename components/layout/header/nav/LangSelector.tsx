/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { FC, Key } from 'react';

const LangSelector: FC<{ locales: any; lang: string }> = ({
  locales,
  lang,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();
  const { replace } = useRouter();

  const onChange = (e: any) => {
    replace('/' + e.target.value);
  };

  return (
    <select defaultValue={lang} onChange={onChange} className="uppercase">
      {locales?.map((locale: any, i: Key) => {
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
