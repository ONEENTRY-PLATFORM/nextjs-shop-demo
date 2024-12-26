import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { FC } from 'react';

import { getPageByUrl } from '@/app/api';
import { useServerProvider } from '@/app/store/providers/ServerProvider';
import type { PageProps } from '@/app/types/global';
import PaymentPage from '@/components/layout/payment';
import ProfilePage from '@/components/layout/profile';
import AboutPage from '@/components/pages/AboutPage';
import ContactsPage from '@/components/pages/ContactsPage';
import PaymentCanceled from '@/components/pages/PaymentCanceled';
import PaymentSuccess from '@/components/pages/PaymentSuccess';
import ServicesPage from '@/components/pages/ServicesPage';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';
import WithSidebar from './WithSidebar';

/**
 * Generate page metadata
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns metadata
 */
export async function generateMetadata({
  params,
}: {
  params: { page: string; lang: string };
}): Promise<Metadata> {
  // get page by Url
  const { page, isError } = await getPageByUrl(params.page, params.lang);

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

/**
 * Simple page
 * @async server component
 * @param params page params
 * @see {@link https://doc.oneentry.cloud/docs/pages OneEntry CMS docs}
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/page Next.js docs}
 * @returns page layout JSX.Element
 */
const PageLayout: FC<PageProps> = async ({ params }) => {
  const lang = params.lang;
  // Get dictionary and set to server provider
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));

  // Get page by current url
  const { page, isError } = await getPageByUrl(params.page, lang);

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
      component: <ProfilePage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment',
      component: <PaymentPage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'about_us',
      component: <AboutPage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'services',
      component: <ServicesPage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'contact_us',
      component: <ContactsPage page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_success',
      component: <PaymentSuccess page={page} lang={lang} dict={dict} />,
    },
    {
      templateType: templateIdentifier,
      name: 'payment_canceled',
      component: <PaymentCanceled page={page} lang={lang} dict={dict} />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-80 w-full max-w-screen-xl flex-col overflow-hidden">
      {pages.map((p, i) => {
        if (pageUrl !== p.name) {
          return;
        }
        return p.templateType === 'withSidebar' ? (
          <WithSidebar lang={lang} key={i}>
            {p.component}
          </WithSidebar>
        ) : (
          <div key={i}>{p.component}</div>
        );
      })}
    </div>
  );
};

export default PageLayout;
