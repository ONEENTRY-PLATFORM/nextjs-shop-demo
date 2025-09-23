import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

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
import { i18n, type Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';
import WithSidebar from './WithSidebar';

/**
 * Simple page
 *
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns page layout JSX.Element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PageLayout: FC<{ params: Promise<{ page: any; lang: any }> }> = async ({
  params,
}) => {
  const { page: p, lang } = await params;
  // Get dictionary and set to server provider
  const [dict] = ServerProvider('dict', await getDictionary(lang as Locale));

  // Get page by current url
  const { page, isError } = await getPageByUrl(p, lang);

  // if error return notFound
  if (isError || !page) {
    return notFound();
  }

  // extract data from page
  const { pageUrl, templateIdentifier } = page;

  // array of pages components with additional settings for next router
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
 * Pre-generation of pages for static export
 */
export async function generateStaticParams() {
  // array of pages components with additional settings for next router
  const pages = [
    'profile',
    'payment',
    'about_us',
    'services',
    'contact_us',
    'payment_success',
    'payment_canceled',
    'book_online',
    'delivery',
  ];

  const params: Array<{ lang: string; page: string }> = [];
  for (const page of pages) {
    for (const lang of i18n.locales) {
      params.push({ lang, page });
    }
  }
  return params;
}

/**
 * Generate page metadata
 *
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string; lang: string }>;
}): Promise<Metadata> {
  const { page: pageData, lang } = await params;
  // get page by Url
  const { page, isError } = await getPageByUrl(pageData, lang);

  if (isError || !page) {
    return notFound();
  }

  // extract data from page
  const { localizeInfos } = page;

  return {
    title: localizeInfos?.title,
    description: localizeInfos?.title,
    openGraph: {
      type: 'article',
    },
  };
}
