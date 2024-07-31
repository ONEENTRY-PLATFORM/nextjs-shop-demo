"use client";
import {useState} from 'react';
import {IFormsPost} from 'oneentry/dist/formsData/formsDataInterfaces';
import {api} from '../api/api';
//import {logJSON} from '../../utils/logJSON';

// type UseSetFormProps = {};

export const useSetForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const sendData = (data: IFormsPost) => {
    setLoading(true);
    const result = async () => {
      try {
        const result = await api.FormData.postFormsData(data);
        return result;
      } catch (e: any) {
        //logJSON(e);
        return e;
      }
    };
    setLoading(false);
    return result;
  };
  return {
    loading,
    sendData,
  };
};
