/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import type { FC } from 'react';

import {
  CalendarForm,
  ContactUsForm,
  ForgotPasswordForm,
  // PaymentForm,
  ResetPasswordForm,
  SignInForm,
  SignUpForm,
  UserForm,
  VerificationForm,
} from '@/components/forms';
import { BlocksGridLoader } from '@/components/shared/Loader';

import { useGetOrderStorageByMarkerQuery } from '../../api';

const TestPage: FC<{ params: { lang: string } }> = ({ params: { lang } }) => {
  // const { data, error } = useGetOrderStorageByMarkerQuery({
  //   marker: 'order',
  // });

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          {/* <CalendarForm lang={lang} /> */}
          {/* <SignInForm lang={lang} /> */}
          {/* <SignUpForm lang={lang} /> */}
          <BlocksGridLoader />
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
