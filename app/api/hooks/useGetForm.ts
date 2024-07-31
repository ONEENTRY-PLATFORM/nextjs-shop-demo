import {useContext, useEffect, useRef, useState} from 'react';
import {IFormsEntity} from 'oneentry/dist/forms/formsInterfaces';
import {LanguageContext} from '../../providers/LanguageContext';
import {IAttributes} from 'oneentry/dist/base/utils';
import {api} from '../api/api';

type UseGetFormProps = {
  marker: string;
};

const notEditableTypes: {[key: string]: any} = {
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

export const useGetForm = ({marker}: UseGetFormProps) => {
  const [form, setForm] = useState<IFormsEntity>();
  const [loading, setLoading] = useState<boolean>(false);
  const appFormData = useRef<FormDataType | null>(null);
  const [refetch, setRefetch] = useState(false);
  const {activeLanguage} = useContext(LanguageContext);
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
      } catch (e) {
        console.log(e);
      }
    })();
    setLoading(false);
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
