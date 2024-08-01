import React from 'react';

import FormInput from './inputs/FormInput';
import SubmitButton from './inputs/FormSubmitButton';

const formFields = [
  {
    type: 'email',
    label: 'Your e-mail',
    placeholder: 'info@example.com',
    name: '',
    required: false,
  },
  {
    type: 'password',
    label: 'Create password',
    placeholder: '•••••',
    name: '',
    required: false,
  },
  {
    type: 'password',
    label: 'Confirm password',
    placeholder: '•••••',
    name: '',
    required: false,
  },
  {
    type: 'text',
    label: 'First name',
    placeholder: 'ONE',
    name: '',
    required: false,
  },
  {
    type: 'text',
    label: 'Surname',
    placeholder: 'ENTRY',
    name: '',
    required: false,
  },
];

const SignUpForm: React.FC = () => {
  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          Sign up
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">
          Sign in or create account to quickly manage order
        </p>
      </div>
      <div className="relative mb-auto box-border flex shrink-0 flex-col gap-4">
        {formFields.map((field, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <FormInput key={index} {...field} />
        ))}
      </div>
      <SubmitButton title="SIGN UP" class="" icon="" />
    </form>
  );
};

export default SignUpForm;
