'use client';

import { useContext } from 'react';

import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import CreateAccountButton from './inputs/CreateAccountButton';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';
import SocialSignInButton from './inputs/SocialSignInButton';

const socialButtons = [
  {
    src: '/icons/google.svg',
    alt: 'Social sign-in option 1',
  },
  {
    src: '/icons/google.svg',
    alt: 'Social sign-in option 2',
  },
];

const SignInEmail: React.FC = () => {
  const { open, setOpen } = useContext(OpenDrawerContext);

  return (
    <>
      <button onClick={() => setOpen(!open)}>open</button>
      <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
        <div className="relative box-border flex shrink-0 flex-col gap-2.5">
          <h2 className="max-w-full text-xl font-bold text-neutral-600">
            Sign in
          </h2>
          <p className="max-w-full text-xs text-gray-400">E-mail/Phone</p>
        </div>

        <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
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

        <FormSubmitButton title="SIGN IN" class="" icon="" />

        <div className="mx-auto mb-5 flex w-[280px] max-w-full gap-5 text-sm max-md:mt-10">
          <p className="mr-auto text-gray-400">Forgot Password?</p>
          <a href="#" className="ml-auto font-bold text-orange-500 underline">
            Reset Password
          </a>
        </div>

        <p className="mx-auto mb-5 text-base font-bold leading-8 text-neutral-600">
          Sign in with
        </p>

        <div className="mx-auto flex justify-between gap-5">
          {socialButtons.map((button, index) => (
            <SocialSignInButton
              key={index}
              imageSrc={button.src}
              alt={button.alt}
            />
          ))}
        </div>

        <CreateAccountButton title="Create AN Account" icon={''} class={''} />
      </form>
    </>
  );
};

export default SignInEmail;
