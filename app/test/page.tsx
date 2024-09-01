'use client';

import {
  CalendarForm,
  ForgotPasswordForm,
  PaymentForm,
  ResetPasswordForm,
  SignInEmail,
  SignInPhone,
  SignUpForm,
  VerificationForm,
} from '@/components/forms';

const TestPage = () => {
  return (
    <main className="flex flex-col items-center justify-between gap-16 px-5 py-8">
      <section className="relative mx-auto box-border flex w-full max-w-screen-xl shrink-0 grow flex-col self-stretch">
        <div className="flex w-full flex-col items-center gap-5 bg-white">
          {/* <CalendarForm /> */}
          {/* <ForgotPasswordForm /> */}
          {/* <ResetPasswordForm /> */}
          {/* <PaymentForm /> */}
          {/* <SignInEmail /> */}
          <SignInPhone />
          {/* <SignUpForm /> */}
          {/* <VerificationForm /> */}
        </div>
      </section>
    </main>
  );
};

export default TestPage;
