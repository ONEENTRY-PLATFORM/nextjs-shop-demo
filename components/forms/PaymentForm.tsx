import Image from 'next/image';
import React from 'react';

import { paymentFormFields } from '../data';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const PaymentForm: React.FC = () => {
  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <Image
        width={375}
        height={233}
        loading="lazy"
        src="/images/card.svg"
        alt=""
        className="mb-12 aspect-[1.61] w-full max-w-[375px] self-center max-md:mt-10"
      />
      <div className="relative mb-16 box-border flex shrink-0 flex-col gap-5">
        {paymentFormFields.map((field, i) => {
          if (field.fieldType !== 'group') {
            return (
              <span key={i}>
                <FormInput {...field} />
              </span>
            );
          } else {
            return (
              <div
                key={field.marker}
                className="relative box-border flex shrink-0 flex-row justify-between"
              >
                {field.fields?.map((f) => (
                  <span key={f.marker}>
                    <FormInput {...f} />
                  </span>
                ))}
              </div>
            );
          }
        })}
      </div>

      <FormSubmitButton title="Apply" class="" icon="CH" />
    </form>
  );
};

export default PaymentForm;
