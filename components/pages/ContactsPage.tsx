/* eslint-disable jsdoc/no-undefined-types */
import parse from 'html-react-parser';
import type { JSX } from 'react';

import type { SimplePageProps } from '@/app/types/global';
import ContactUsForm from '@/components/forms/ContactUsForm';

/**
 * Contacts page component that displays contact information and a contact form.
 * This component renders the contact page with title, content from the CMS, and a contact form,
 * allowing users to get in touch with the business.
 * @param   {object}               props      - Component properties
 * @param   {IPagesEntity}         props.page - Page entity containing contact page data from CMS
 * @param   {string}               props.lang - Current language shortcode (e.g., 'en', 'ru')
 * @returns {Promise<JSX.Element>}            Contacts page with content and contact form
 */
const ContactsPage = async ({
  page,
  lang,
}: SimplePageProps): Promise<JSX.Element> => {
  /** Check if page exists and has localization information */
  if (!page || !page.localizeInfos) {
    /** Fallback content if page data is not available */
    return (
      <div className="flex flex-col pb-5 max-md:max-w-full">
        <div className="flex flex-col items-center">
          <h1>Contact Us</h1>
          <p>Contact information and form.</p>
          {/** Render contact form with current language */}
          <ContactUsForm lang={lang as string} />
        </div>
      </div>
    );
  }

  /** Extract content from page localizeInfos for rendering */
  const { localizeInfos } = page;

  return (
    <div className="flex flex-col pb-5 max-md:max-w-full">
      <div className="flex flex-col items-center">
        {/** Display page title from CMS or fallback to default */}
        <h1 className="mb-3">{localizeInfos?.title || 'Contact Us'}</h1>
        {/** Display page content from CMS or fallback to default text */}
        {localizeInfos?.htmlContent ? (
          <div className="mb-6">{parse(localizeInfos.htmlContent)}</div>
        ) : (
          <p>Contact information and form.</p>
        )}
        {/** Render contact form with current language */}
        <ContactUsForm lang={lang as string} />
      </div>
    </div>
  );
};

export default ContactsPage;
