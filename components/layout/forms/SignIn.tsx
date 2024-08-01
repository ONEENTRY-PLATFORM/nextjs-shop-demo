import React from 'react';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import SocialSignInButton from './SocialSignInButton';
import ClosePopup from "./ClosePopup";

interface SignInPageProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
}

const SignInForm: React.FC<SignInPageProps> = ({ sendSubmissionsTo, sendSubmissionsToEmail }) => {
  const socialButtons = [
    { src: "", alt: "Social sign-in option 1" },
    { src: "", alt: "Social sign-in option 2" }
  ];

  return (
    <main className="flex flex-col px-10 py-8 bg-white rounded-3xl max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>
      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          name="signin-form"
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
          action={sendSubmissionsTo}
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            // Add form submission logic here
          }}
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5">
            <h1 className="text-xl font-bold text-neutral-600 max-md:max-w-full">Sign in</h1>
            <p className="text-xs text-gray-400 max-md:max-w-full">E-mail/Phone</p>
          </div>
          <div className="box-border flex relative flex-col shrink-0 gap-4 mb-32">
            <FormInput
              type="tel"
              placeholder="+91 ("
              name="phone"
              label="Phone number"
              required={false}
            />
          </div>
          <FormSubmitButton text="SIGN IN" />
          <div className="flex gap-5 mx-auto mb-2.5 max-w-full text-sm w-[280px] max-md:mt-10">
            <p className="flex-auto text-gray-400">Forgot Password?</p>
            <a href="#" className="font-bold text-orange-500 underline">Reset Password</a>
          </div>
          <p className="mx-auto mb-2.5 text-base font-bold leading-8 text-neutral-600">Sign in with</p>
          <div className="flex gap-5 justify-between mx-auto mb-5">
            {socialButtons.map((button, index) => (
              <SocialSignInButton key={index} src={button.src} alt={button.alt} />
            ))}
          </div>
          <button type="button" className="self-stretch px-16 py-5 text-lg font-bold text-orange-500 border-2 border-orange-500 border-solid rounded-[30px] max-md:px-5 max-md:max-w-full">
            CREATE AN ACCOUNT
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignInForm;