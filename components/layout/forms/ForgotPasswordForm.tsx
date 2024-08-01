import React from 'react';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

interface ForgotPasswordFormProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
  name: string;
  contentType: string;
  method: string;
  sendWithJs: boolean;
  validate: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  sendSubmissionsTo,
  sendSubmissionsToEmail,
  name,
  contentType,
  method,
  sendWithJs,
  validate
}) => {
  return (
    <form
      action={sendSubmissionsTo}
      data-email={sendSubmissionsToEmail}
      name={name}
      encType={contentType}
      method={method}
      className="flex flex-col gap-4 min-h-full text-xl leading-5"
      data-send-with-js={sendWithJs}
      data-validate={validate}
    >
      <header className="box-border flex relative flex-col shrink-0 gap-2.5">
        <h1 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Forgot password
        </h1>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Please enter your email address. You will receive a link to create a new password via email.
        </p>
      </header>
      <section className="box-border flex relative flex-col shrink-0 gap-4 mb-8">
        <FormInput
          label="Enter your email"
          type="email"
          placeholder="info@example.com"
          name="email"
          required={false}
        />
      </section>
      <FormSubmitButton text="SEND" />
    </form>
  );
};