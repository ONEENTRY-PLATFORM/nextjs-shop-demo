import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';

import { getPageByUrl } from '@/app/api';
import { ServerProvider } from '@/app/store/providers/ServerProvider';
import PaymentPage from '@/components/layout/payment';
import ProfilePage from '@/components/layout/profile';
import AboutPage from '@/components/pages/AboutPage';
import BookOnlinePage from '@/components/pages/BookOnlinePage';
import ContactsPage from '@/components/pages/ContactsPage';
import DeliveryPage from '@/components/pages/DeliveryPage';
import PaymentCanceled from '@/components/pages/PaymentCanceled';
import PaymentSuccess from '@/components/pages/PaymentSuccess';
import ServicesPage from '@/components/pages/ServicesPage';
import { type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';
import WithSidebar from './WithSidebar';

/**
 * Simple page layout
 * @async
 * @param   {object}                                  params        - Page parameters
 * @param   {Promise<{ page: string; lang: string }>} params.params - The page and language parameters
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns {Promise<JSX.Element>}                                  page layout JSX.Element
 */
const PageLayout = async ({
  params,
}: {
  params: Promise<{ page: string; lang: string }>;
}): Promise<JSX.Element> => {
  /** Extract page name and language from params */
  const { page: p, lang } = await params;

  /** Get dictionary and set to server provider for internationalization */
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  /** Get page data by current url */
  const { page, isError } = await getPageByUrl(p, lang);

  /** if error return notFound */
  if (isError || !page) {
    return notFound();
  }

  /** extract data from page */
  const { pageUrl, templateIdentifier } = page;

  /** array of pages components with additional settings for next router */
  const pages = [
    {
      templateType: templateIdentifier,
      name: 'profile',
      component: <ProfilePage lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment',
      component: <PaymentPage lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'about_us',
      component: <AboutPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'services',
      component: <ServicesPage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'contact_us',
      component: <ContactsPage lang={lang} page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_success',
      component: <PaymentSuccess page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_canceled',
      component: <PaymentCanceled page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'book_online',
      component: <BookOnlinePage page={page} />,
    },
    {
      templateType: templateIdentifier,
      name: 'delivery',
      component: <DeliveryPage page={page} />,
    },
  ];

  /** Render the page component based on the page URL and template type */
  return (
    <div className="mx-auto flex min-h-80 w-full max-w-(--breakpoint-xl) flex-col overflow-hidden">
      {Array.isArray(pages) ? (
        pages.map((p, i) => {
          if (pageUrl !== p.name) {
            return null;
          }
          return p.templateType === 'withSidebar' ? (
            <WithSidebar lang={lang} key={i}>
              {p.component}
            </WithSidebar>
          ) : (
            <div key={i}>{p.component}</div>
          );
        })
      ) : (
        <div>Page not found</div>
      )}
    </div>
  );
};

export default PageLayout;

/**
 * Generate page metadata
 * @async
 * @param   {object}                                  params        - Page params
 * @param   {Promise<{ page: string; lang: string }>} params.params - The page and language parameters
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns {Promise<Metadata>}                                     page metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; lang: string }>;
}): Promise<Metadata> {
  /** Extract page name from params */
  const { page: pageData, lang } = await params;
  /** Get page data by current url */
  const { page, isError } = await getPageByUrl(pageData, lang);

  /** if error return notFound */
  if (isError || !page) {
    return notFound();
  }

  /** extract data from page */
  const { localizeInfos } = page;

  return {
    title: localizeInfos?.title,
    description: localizeInfos?.title,
    openGraph: {
      type: 'article',
    },
  };
}
