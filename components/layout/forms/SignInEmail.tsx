import React from 'react';
import SignInForm from './SignInForm';
import ClosePopup from "./ClosePopup";

const MyComponent: React.FC = () => {
  return (
    <main className="flex flex-col px-10 py-8 bg-white rounded-3xl border border-solid border-[black] max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <SignInForm
          sendSubmissionsTo="email"
          sendSubmissionsToEmail="your@email.com"
          name="My form"
          contentType="application/json"
          method="POST"
          previewState="unsubmitted"
        />
      </section>
    </main>
  );
};

export default MyComponent;