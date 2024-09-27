/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  CalendarForm,
  ForgotPasswordForm,
  // PaymentForm,
  ResetPasswordForm,
  SignInForm,
  SignUpForm,
  UserForm,
  VerificationForm,
} from '@/components/forms';

import { useGetOrderStorageByMarkerQuery } from '../../api';

const TestPage = () => {
  const { data, error } = useGetOrderStorageByMarkerQuery({
    marker: 'order',
  });

  return (
    <main className="flex flex-col items-center justify-between gap-16 p-5">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          {/* <CalendarForm />
          <ResetPasswordForm />
          <VerificationForm /> */}
          <SignUpForm />
          {/* <ForgotPasswordForm />
          <SignInForm />
          <UserForm />
          <PaymentForm /> */}
        </div>
      </section>
    </main>
  );
};

export default TestPage;
