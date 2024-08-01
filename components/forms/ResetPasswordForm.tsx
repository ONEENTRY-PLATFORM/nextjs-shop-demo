import React from "react";
import FormInput from "./inputs/FormInput";
import FormSubmitButton from "./inputs/FormSubmitButton";
import ClosePopup from "../layout/popup/ClosePopup";

const ResetPasswordForm: React.FC = () => {
  return (
    <form
      name="resetPasswordForm"
      className="flex flex-col gap-4 min-h-full text-xl leading-5"
      method="POST"
    >
      <div className="box-border flex relative flex-col shrink-0 gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Reset password
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Enter new password and confirm.
        </p>
      </div>
      <div className="box-border flex relative flex-col shrink-0 gap-4 mb-8">
        <FormInput
          label="New password"
          type="password"
          placeholder="xxx"
          name="new_password"
          required={true}
        />
        <FormInput
          label="Confirm password"
          type="password"
          placeholder="xxx"
          name="confirm_password"
          required={true}
        />
      </div>
      <FormSubmitButton title="CHANGE PASSWORD" class="" icon="" />
    </form>
  );
};

export default ResetPasswordForm;
