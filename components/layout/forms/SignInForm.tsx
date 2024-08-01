import React from 'react';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import SocialSignInButton from './SocialSignInButton';

interface SignInFormProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
  name: string;
  contentType: string;
  method: string;
  previewState: string;
}

const SignInForm: React.FC<SignInFormProps> = ({
  sendSubmissionsTo,
  sendSubmissionsToEmail,
  name,
  contentType,
  method,
  previewState
}) => {
  return (
    <form
      className="flex flex-col gap-4 min-h-full text-xl leading-5"
      name={name}
      method={method}
      action={sendSubmissionsTo === 'email' ? `mailto:${sendSubmissionsToEmail}` : undefined}
      encType={contentType}
      data-preview-state={previewState}
    >
      <header className="box-border flex relative flex-col shrink-0 gap-2.5">
        <h1 className="text-xl font-bold text-neutral-600 max-md:max-w-full">Sign in</h1>
        <p className="text-xs text-gray-400 max-md:max-w-full">E-mail/Phone</p>
      </header>

      <div className="box-border flex relative flex-col shrink-0 gap-4 mb-8">
        <FormInput
          type="email"
          placeholder="info@example.com"
          name="email"
          label="Username"
          required={false}
        />
        <FormInput
          type="password"
          placeholder="•••••"
          name="password"
          label="Confirm password"
          required={false}
        />
      </div>

      <FormSubmitButton text="SIGN IN" />

      <div className="flex gap-5 mx-auto mb-5 max-w-full text-sm w-[280px] max-md:mt-10">
        <p className="mr-auto text-gray-400">Forgot Password?</p>
        <a href="#" className="ml-auto font-bold text-orange-500 underline">
          Reset Password
        </a>
      </div>

      <p className="mx-auto mb-5 text-base font-bold leading-8 text-neutral-600">
        Sign in with
      </p>

      <div className="flex gap-5 justify-between mx-auto">
        <SocialSignInButton src="" alt="Social Sign In Option 1" />
        <SocialSignInButton src="" alt="Social Sign In Option 2" />
      </div>

      <button className="self-stretch px-5 py-5 text-lg font-bold text-orange-500 border-2 border-orange-500 border-solid rounded-[30px] max-md:px-5 max-md:max-w-full">
        CREATE AN ACCOUNT
      </button>
    </form>
  );
};

export default SignInForm;