import React from "react";
import FormInput from "./inputs/FormInput";
import FormSubmitButton from "./inputs/FormSubmitButton";

export const ForgotPasswordForm: React.FC = () => {
  return (
    <form className="flex flex-col gap-4 min-h-[480px] text-xl leading-5">
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

      <FormSubmitButton title="SEND" class="" icon="" />
    </form>
  );
};

export default ForgotPasswordForm;
