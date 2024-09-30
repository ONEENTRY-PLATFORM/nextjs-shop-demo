/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePathname, useRouter } from 'next/navigation';
import type { FC, Key } from 'react';

const LangSelector: FC<{ locales: any; lang: string }> = ({
  locales,
  lang,
}) => {
  const pathname = usePathname();
  const { replace } = useRouter();

  if (!lang) {
    return;
  }

  const onChange = (e: any) => {
    replace('/' + e.target.value + pathname.slice(3));
  };

  return (
    <select
      defaultValue={lang}
      onChange={onChange}
      className="uppercase text-neutral-600"
    >
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
