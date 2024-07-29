import React from "react";
import FormInput from "./inputs/FormInput";
import FormSubmitButton from "./inputs/FormSubmitButton";
import SocialSignInButton from "./inputs/SocialSignInButton";
import ClosePopup from "../layout/popup/ClosePopup";

const SignInEmail: React.FC = () => {
  return (
    <form className="flex flex-col gap-4 min-h-full text-xl leading-5">
      <div className="box-border flex relative flex-col shrink-0 gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-w-full">
          Sign in
        </h2>
        <p className="text-xs text-gray-400 max-w-full">E-mail/Phone</p>
      </div>

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

      <FormSubmitButton title="SIGN IN" class="" icon="" />

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
        <SocialSignInButton imageSrc="" alt="Sign In Option 1" />
        <SocialSignInButton imageSrc="" alt="Sign In Option 2" />
      </div>

      <button className="self-stretch px-5 py-5 text-lg font-bold text-orange-500 border-2 border-orange-500 border-solid rounded-[30px] max-md:px-5 max-md:max-w-full">
        CREATE AN ACCOUNT
      </button>
    </form>
  );
};

export default SignInEmail;
