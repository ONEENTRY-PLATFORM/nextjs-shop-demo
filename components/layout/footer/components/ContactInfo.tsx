import type { FC } from 'react';

import { getBlockByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';

/**
 * Contact Info
 * @async
 * @returns JSX.Element
 */
const ContactInfo: FC = async () => {
  const [lang] = ServerProvider('lang');
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];
  const { block } = await getBlockByMarker('contact_info', lang);

  if (!block) {
    return 'Block not found';
  }

  const attributeValues =
    block.attributeValues?.[langCode] || block?.attributeValues;

  if (!attributeValues) {
    return 'Attributes not found';
  }

  const {
    info_title,
    address,
    info_emails_title,
    email_1,
    email_2,
    info_phones_title,
    phone_1,
    phone_2,
    info_address_title,
  } = attributeValues;

  return (
    <nav className="flex w-full max-w-[240px] grow flex-col font-bold text-neutral-600 max-lg:max-w-[160px] max-md:max-w-[30%] max-sm:mb-5 max-sm:max-w-full">
      <h2 className="mb-5 text-xl">{info_title?.value}</h2>
      <div className="flex flex-col gap-1.5 whitespace-nowrap text-sm leading-5 max-md:flex-row max-md:flex-wrap">
        <div className="mb-2 flex w-full flex-col gap-1">
          <div className="text-orange-500">{info_address_title?.value}</div>
          <div className="font-semibold">{address?.value}</div>
        </div>
        <div className="mb-2 mr-auto flex flex-col gap-1 max-md:max-w-[50%]">
          <div className="text-orange-500">{info_phones_title?.value}</div>
          <a
            href={'tel:' + phone_1?.value}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {phone_1?.value}
          </a>
          <a
            href={'tel:' + phone_2?.value}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {phone_2?.value}
          </a>
        </div>
        <div className="mb-2 mr-auto flex flex-col gap-1 max-md:max-w-[50%]">
          <div className="text-orange-500">{info_emails_title?.value}</div>
          <a
            href={'mailto:' + email_1?.value}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {email_1?.value}
          </a>
          <a
            href={'mailto:' + email_2?.value}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {email_2?.value}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default ContactInfo;
