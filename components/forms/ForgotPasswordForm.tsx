import React from 'react';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import ClosePopup from '../layout/popup/ClosePopup';

export const ForgotPasswordForm: React.FC = () => {
  return (
    <main className="flex flex-col px-10 pt-8 pb-16 bg-white rounded-3xl border border-solid border-[black] max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5">
            <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
              Forgot password
            </h2>
            <p className="text-xs text-gray-400 max-md:max-w-full">
              Please enter your email address. You will receive a link to create a new password via email.
            </p>
          </div>
          <div className="box-border flex relative flex-col shrink-0 gap-4 mb-8">
            <FormInput
              label="Enter your email"
              type="email"
              placeholder="info@example.com"
              name="email"
              required={false}
            />
          </div>
          <FormSubmitButton 
            title='SEND' 
            class='' 
            icon='' 
          />
        </form>
      </section>
    </main>
  );
};

export default ForgotPasswordForm;
