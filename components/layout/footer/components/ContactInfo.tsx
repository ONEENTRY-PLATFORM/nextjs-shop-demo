import type { JSX } from 'react';

import { getBlockByMarker } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import { LanguageEnum } from '@/app/types/enum';

/**
 * Contact Info component for displaying company contact information in the footer.
 * Fetches contact data from CMS block and renders address, phone numbers, and emails.
 * @returns {Promise<JSX.Element>} JSX.Element.
 */
const ContactInfo = async (): Promise<JSX.Element> => {
  /**
   * Get current language from server provider
   * Used to fetch localized content from the CMS
   */
  const [lang] = ServerProvider('lang');

  /**
   * Convert language shortcode to language enum value
   * This is used to access localized attribute values
   */
  const langCode = LanguageEnum[lang as keyof typeof LanguageEnum];

  /**
   * Fetch contact information block from CMS by marker
   * This retrieves all the contact data stored in the CMS
   */
  const { block } = await getBlockByMarker('contact_info', lang);

  /** Return error message if block is not found */
  if (!block) {
    return <>Block not found</>;
  }

  /**
   * Get attribute values for the current language or fallback to default
   * This ensures we display localized content when available
   */
  const attributeValues =
    block.attributeValues?.[langCode] || block?.attributeValues;

  /** Return error message if attribute values are not found */
  if (!attributeValues) {
    return <>Attributes not found</>;
  }

  /**
   * Destructure contact information from attribute values
   * Extracts all the needed contact fields for rendering
   */
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
    /** Navigation container for contact information. Uses flex layout for responsive design across different screen sizes */
    <nav className="flex flex-col font-bold text-white max-lg:max-w-40 max-md:max-w-[50%] max-sm:mb-5 max-sm:max-w-full">
      {/** Contact information title from CMS */}
      <h2 className="mb-5 text-xl">{info_title?.value}</h2>
      {/** Container for all contact details. Uses responsive flex layout that changes on smaller screens*/}
      <div className="flex flex-col gap-1.5 whitespace-nowrap text-sm leading-5 max-md:flex-row max-md:flex-wrap">
        {/** Address section with title and value */}
        <div className="mb-2 flex w-full flex-col gap-1">
          <div className="font-bold">{info_address_title?.value}</div>
          <div className="text-[1rem] font-normal">{address?.value}</div>
        </div>
        {/** Phone numbers section with clickable links */}
        <div className="mb-2 mr-auto flex flex-col gap-1 max-md:max-w-[50%]">
          <div className="font-bold">{info_phones_title?.value}</div>
          <a
            href={'tel:' + phone_1?.value}
            className="relative box-border text-[1rem] font-normal transition-colors hover:text-orange-500"
          >
            {phone_1?.value}
          </a>
          <a
            href={'tel:' + phone_2?.value}
            className="relative box-border text-[1rem] font-normal transition-colors hover:text-orange-500"
          >
            {phone_2?.value}
          </a>
        </div>
        {/** Email addresses section with clickable links.  Each email is a mailto: link for easy contact */}
        <div className="mb-2 mr-auto flex flex-col gap-1 max-md:max-w-[50%]">
          <div className="font-bold">{info_emails_title?.value}</div>
          <a
            href={'mailto:' + email_1?.value}
            className="relative box-border text-[1rem] font-normal transition-colors hover:text-orange-500"
          >
            {email_1?.value}
          </a>
          <a
            href={'mailto:' + email_2?.value}
            className="relative box-border text-[1rem] font-normal transition-colors hover:text-orange-500"
          >
            {email_2?.value}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default ContactInfo;
