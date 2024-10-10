import type { IAttributes } from 'oneentry/dist/base/utils';
import type { FC, FormEvent, Key } from 'react';
import { useContext, useEffect, useState } from 'react';

import { api, useGetFormByMarkerQuery } from '@/app/api';
import { useAppSelector } from '@/app/store/hooks';
import { OpenDrawerContext } from '@/app/store/providers/OpenDrawerContext';

import Loader from '../shared/Loader';
import ErrorMessage from './inputs/ErrorMessage';
import FormInput from './inputs/FormInput';
import FormSubmitButton from './inputs/FormSubmitButton';

export const ForgotPasswordForm: FC<{ lang: string }> = ({ lang }) => {
  const { setComponent, setAction } = useContext(OpenDrawerContext);
  const [isError, setError] = useState<string>('');

  const { data, isLoading } = useGetFormByMarkerQuery({
    marker: 'reg',
    lang,
  });

  const fields = useAppSelector(
    (state) => state.formFieldsReducer.fields,
  ) as object as {
    email_reg: {
      value: string;
      valid: boolean;
    };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.AuthProvider.generateCode(
        'email',
        fields.email_reg.value,
        'generate_code',
      );
      setComponent('VerificationForm');
      setAction('checkCode');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
      if (e.statusCode === 400) {
        setTimeout(() => {
          setComponent('VerificationForm');
        }, 800);
      }
    }
  };

  const { reset_descr, send_text } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );
  const [resetText, setResetText] = useState<string>('');
  const [sendText, setSendText] = useState<string>('');

  useEffect(() => {
    if (reset_descr) {
      setResetText(reset_descr.value);
    }
    if (send_text) {
      setSendText(send_text.value);
    }
  }, [reset_descr, send_text]);

  if (!data || isLoading) {
    return <Loader />;
  }

  return (
    <form
      className="mx-auto flex min-h-[480px] max-w-[350px] flex-col gap-4 text-xl leading-5"
      onSubmit={(e) => onSubmit(e)}
    >
      <div className="relative box-border flex shrink-0 flex-col gap-2.5">
        <h2 className="text-xl font-bold text-neutral-600 max-md:max-w-full">
          {data.localizeInfos.titleForSite}
        </h2>
        <p className="text-xs text-gray-400 max-md:max-w-full">{resetText}</p>
      </div>

      <div className="relative mb-8 box-border flex shrink-0 flex-col gap-4">
        {data?.attributes.map((field: IAttributes, index: Key) => {
          if (field.marker === 'email_reg') {
            return <FormInput key={index} {...field} />;
          }
        })}
      </div>

      <FormSubmitButton title={sendText} isLoading={isLoading} />
      {isError && <ErrorMessage error={isError} />}
    </form>
  );
};

export default ForgotPasswordForm;
