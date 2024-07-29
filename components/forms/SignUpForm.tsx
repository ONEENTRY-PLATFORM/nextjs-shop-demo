import React from "react";
import FormInput from "./inputs/FormInput";
import SubmitButton from "./inputs/FormSubmitButton";
import ClosePopup from "../layout/popup/ClosePopup";

const formFields = [
  {
    type: "email",
    label: "Your e-mail",
    placeholder: "info@example.com",
    name: "",
    required: false,
  },
  {
    type: "password",
    label: "Create password",
    placeholder: "•••••",
    name: "",
    required: false,
  },
  {
    type: "password",
    label: "Confirm password",
    placeholder: "•••••",
    name: "",
    required: false,
  },
  {
    type: "text",
    label: "First name",
    placeholder: "ONE",
    name: "",
    required: false,
  },
  {
    type: "text",
    label: "Surname",
    placeholder: "ENTRY",
    name: "",
    required: false,
  },
];

const SignUpForm: React.FC = () => {
  return (
    <div className="flex flex-col px-10 py-8 bg-white rounded-3xl border border-solid border-neutral-400 max-w-[550px] w-[550px]">
      <header className="box-border flex relative flex-col shrink-0 mb-16">
        <ClosePopup />
      </header>

      <main className="flex flex-col w-full min-h-[calc(100%_-_120px)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
        <form className="flex flex-col gap-4 min-h-full text-xl leading-5">
          <div className="box-border flex relative flex-col shrink-0 gap-2.5">
            <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
              Sign up
            </h2>
            <p className="text-xs text-gray-400 max-md:max-w-full">
              Sign in or create account to quickly manage order
            </p>
          </div>
          <div className="box-border flex relative flex-col shrink-0 gap-4 mb-auto">
            {formFields.map((field, index) => (
              <FormInput key={index} {...field} />
            ))}
          </div>
          <SubmitButton title="SIGN UP" class="" icon="" />
        </form>
      </main>
    </div>
  );
};

export default SignUpForm;
