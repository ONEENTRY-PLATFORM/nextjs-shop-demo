import React from 'react';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import SocialSignInButton from './inputs/SocialSignInButton';

interface SignInPhoneProps {
  sendSubmissionsTo: string;
  sendSubmissionsToEmail: string;
  name: string;
  contentType: string;
  method: string;
}

const socialButtons = [
  { 
    src: "", 
    alt: "Social sign-in option 1" 
  },
  { 
    src: "", 
    alt: "Social sign-in option 2" 
  }
];

const SignInPhone: React.FC<SignInPhoneProps> = ({
  sendSubmissionsTo,
  sendSubmissionsToEmail,
  name,
  contentType,
  method
}) => {

  return (
    <main className="flex flex-col px-10 py-8 bg-white rounded-3xl border border-solid border-[black] max-w-[550px] w-[550px]">
      
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <img loading="lazy" src="" alt="" className="self-end w-10 aspect-square max-md:mr-2.5" />
      </header>

      <section className="flex flex-col w-full min-h-[calc(100%_-_110px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form
          name="signin-form"
          className="flex flex-col gap-4 min-h-full text-xl leading-5"
          action={sendSubmissionsTo}
          method="POST"
        >
          <div className="box-border flex relative flex-col shrink-0 gap-2.5">
            <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
              Sign in
            </h2>
            <p className="text-xs text-gray-400 max-md:max-w-full">
              E-mail/<b>Phone</b>
            </p>
          </div>
          <div className="box-border flex relative flex-col shrink-0 gap-4 mb-32">
            <FormInput
              type="tel"
              placeholder="+91 ("
              name="phone"
              label="Phone number"
              required={true}
            />
          </div>
          <FormSubmitButton 
            title="SIGN IN" 
            class="" 
            icon='' 
          />
          <div className="flex gap-5 mx-auto mb-2.5 max-w-full text-sm w-[280px] max-md:mt-10">
            <a href="#" className="flex-auto text-gray-400">
              Forgot Password?
            </a>
            <a href="#" className="font-bold text-orange-500 underline">
              Reset Password
            </a>
          </div>
          <p className="mx-auto mb-2.5 text-base font-bold leading-8 text-neutral-600">
            Sign in with
          </p>
          <div className="flex gap-5 justify-between mx-auto mb-5">
            {socialButtons.map((button, index) => (
              <SocialSignInButton key={index} imageSrc={button.src} alt={button.alt} />
            ))}
          </div>
          <button className="self-stretch px-16 py-5 text-lg font-bold text-orange-500 border-2 border-orange-500 border-solid rounded-[30px] max-md:px-5 max-md:max-w-full">
            CREATE AN ACCOUNT
          </button>
        </form>
      </section>

    </main>
  );
};

export default SignInPhone;