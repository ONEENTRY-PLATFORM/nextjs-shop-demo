'use client';

import type { IAttributes } from 'oneentry/dist/base/utils';
import type { IFormsEntity } from 'oneentry/dist/forms/formsInterfaces';
import { useContext, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { LanguageContext } from '../../../store/providers/LanguageContext';
import { api } from '../../api/api';

type UseGetFormProps = {
  marker: string;
};

const notEditableTypes: { [key: string]: unknown } = {
  button: false,
  spam: false,
  null: true,
};

export interface FormDataType {
  [p: string]: {
    value: string;
    valid: boolean;
    required: boolean;
  };
}

export const useGetForm = ({ marker }: UseGetFormProps) => {
  const [form, setForm] = useState<IFormsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const appFormData = useRef<FormDataType | null>(null);
  const [refetch, setRefetch] = useState(false);
  const { activeLanguage } = useContext(LanguageContext);
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await api.Forms.getFormByMarker(marker, activeLanguage);
        result.attributes = (result.attributes as IAttributes[]).sort(
          (a, b) => {
            return a.position - b.position;
          },
        );
        const initValue: FormDataType = {};
        const reduced = (result?.attributes as IAttributes[]).reduce(
          (obj, currentValue) => {
            if (notEditableTypes[currentValue.type] === false) {
              return obj;
            }

            // eslint-disable-next-line no-param-reassign
            obj[currentValue.marker] = {
              value: '',
              valid: false,
              required: currentValue?.validators?.requiredValidator?.strict,
            };
            return obj;
          },
          initValue,
        );
        appFormData.current = reduced;
        setForm(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // console.log(e);
      }
    })();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage, refetch]);
  return {
    loading,
    form,
    initialFormData: appFormData.current,
    refetch() {
      setRefetch(!refetch);
    },
  };
};
