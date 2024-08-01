import Image from 'next/image';
import React from 'react';

import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

const PaymentForm: React.FC = () => {
  return (
    <form className="flex min-h-full flex-col gap-4 text-xl leading-5">
      <Image
        loading="lazy"
        src=""
        alt=""
        className="mb-12 aspect-[1.61] w-full max-w-[375px] self-center max-md:mt-10"
      />
      <div className="relative mb-16 box-border flex shrink-0 flex-col gap-5">
        <FormInput
          type="text"
          label="Card holder name"
          placeholder="ONEENTRY"
          name="cardHolderName"
          required
        />
        <FormInput
          type="text"
          label="Card number"
          placeholder="2300 0000 0000 0000"
          name="cardNumber"
          required
        />
        <div className="relative box-border flex shrink-0 flex-row justify-between">
          <FormInput
            type="text"
            label="MM/YY"
            placeholder="09/32"
            name="expiryDate"
            required
          />
          <FormInput
            type="text"
            label="CVC"
            placeholder="xxx"
            name="cvc"
            required
          />
        </div>
      </div>

      <FormSubmitButton title="Apply" class="" icon="CH" />
    </form>
  );
};

export default PaymentForm;
