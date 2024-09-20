import type { FC } from 'react';

import { contactInfo } from '@/components/data';

const ContactInfo: FC = async () => {
  const {
    title,
    address_title,
    address,
    phone_title,
    phone_1,
    phone_2,
    web_title,
    email_1,
    email_2,
  } = contactInfo;

  return (
    <nav className="flex w-full max-w-[240px] max-lg:max-w-[160px] grow flex-col font-bold text-neutral-600 max-md:max-w-[30%] max-sm:mb-5 max-sm:max-w-full">
      <h2 className="mb-5 text-xl">{title}</h2>
      <div className="flex flex-col gap-1.5 whitespace-nowrap text-sm leading-5 max-md:flex-row max-md:flex-wrap">
        <div className="mb-2 flex w-full flex-col gap-1">
          <div className="text-orange-500">{address_title}</div>
          <div className="font-semibold">{address}</div>
        </div>
        <div className="max-md:max-w-[50%] mb-2 mr-auto flex flex-col gap-1">
          <div className="text-orange-500">{phone_title}</div>
          <a
            href={'tel:' + { phone_1 }}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {phone_1}
          </a>
          <a
            href={'tel:' + { phone_2 }}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {phone_2}
          </a>
        </div>
        <div className="max-md:max-w-[50%] mb-2 mr-auto flex flex-col gap-1">
          <div className="text-orange-500">{web_title}</div>
          <a
            href={'mailto:' + email_1}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {email_1}
          </a>
          <a
            href={'mailto:' + email_2}
            className="relative box-border transition-colors hover:text-orange-500"
          >
            {email_2}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default ContactInfo;
