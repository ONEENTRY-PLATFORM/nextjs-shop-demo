import React from 'react';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import ClosePopup from "./ClosePopup";

export const ForgotPasswordComponent: React.FC = () => {
  return (
    <main className="flex flex-col px-10 pt-8 pb-16 bg-white rounded-3xl max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <ForgotPasswordForm
          sendSubmissionsTo="email"
          sendSubmissionsToEmail="your@email.com"
          name="My form"
          contentType="application/json"
          method="POST"
          sendWithJs={true}
          validate={true}
        />
      </section>
    </main>
  );
};