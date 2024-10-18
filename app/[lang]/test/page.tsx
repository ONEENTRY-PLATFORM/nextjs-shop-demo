/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC } from 'react';

import { useServerProvider } from '@/app/store/providers/ServerProvider';
import {
  // CalendarForm,
  // ContactUsForm,
  // ForgotPasswordForm,
  // PaymentForm,
  // ResetPasswordForm,
  SignInForm,
  // SignUpForm,
  // UserForm,
  // VerificationForm,
} from '@/components/forms';
import ProductsGridLoader from '@/components/layout/products-grid/ProductsGridLoader';
import type { Locale } from '@/i18n-config';

import { getDictionary } from '../dictionaries';

const TestPage: FC<{ params: { lang: string } }> = async ({
  params: { lang },
}) => {
  const [dict] = useServerProvider('dict', await getDictionary(lang as Locale));
  // const { data, error } = useGetOrderStorageByMarkerQuery({
  //   marker: 'order',
  // });

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <ProductsGridLoader />
          {/* <CategoriesLoader /> */}
          {/* <BlocksGridLoader /> */}

          {/* <CalendarForm lang={lang} /> */}
          {/* <SignInForm lang={lang} dict={dict} /> */}
          {/* <SignUpForm lang={lang} /> */}
          {/* <ContactUsForm lang={lang} className={''} /> */}
          {/* <VerificationForm lang={lang} /> */}
          {/* <UserForm lang={lang} /> */}
          {/* <ForgotPasswordForm lang={lang} /> */}
          {/* <ResetPasswordForm lang={lang} /> */}
          {/* <PaymentForm lang={lang} /> */}
        </div>
      </section>
    </main>
  );
};

export default TestPage;
