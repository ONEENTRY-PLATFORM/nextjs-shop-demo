/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type FC, useEffect } from 'react';

import GSDevTools from '@/app/animations/GSDevTools';
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
import {
  BlocksGridLoader,
  CategoriesLoader,
  ProductsGridLoader,
} from '@/components/shared/Loader';

import { useGetOrderStorageByMarkerQuery } from '../../api';

const TestPage: FC<{ params: { lang: string } }> = ({ params: { lang } }) => {
  // const { data, error } = useGetOrderStorageByMarkerQuery({
  //   marker: 'order',
  // });

  useEffect(() => {
    gsap.registerPlugin(GSDevTools);
    GSDevTools.create();
  }, []);

  useGSAP(() => {
    // gsap code here...
    gsap.set('.box', { scale: 0 }); // <-- automatically reverted
    gsap.to('.box', { stagger: 0.2, scale: 1 }); // <-- automatically reverted
  });

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          <CategoriesLoader />
          {/* <BlocksGridLoader /> */}
          {/* <CalendarForm lang={lang} /> */}
          {/* <SignInForm lang={lang} /> */}
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
