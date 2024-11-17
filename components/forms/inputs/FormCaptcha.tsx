/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Dispatch } from 'react';
import { useEffect } from 'react';

type Props = {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
};

/**
 * FormCaptcha
 * @param setToken
 * @param setIsCaptcha
 * @param captchaKey
 *
 * @returns FormCaptcha
 */
const FormCaptcha = ({ setToken, setIsCaptcha, captchaKey }: Props) => {
  const testKey = '6LdF4HcqAAAAAD7Mia-zF5SMzY-XjHd_SU2xr0uQ';
  const siteKey = 'AIzaSyBC4rSjMl4SspgQ2J046ZyRv1IX44v3jgc';

  useEffect(() => {
    setIsCaptcha(true);
  }, []);

  const handleLoaded = () => {
    window.grecaptcha?.enterprise.ready(() => {
      window.grecaptcha?.enterprise
        .execute(testKey, { action: 'homepage' })
        .then((token: string) => {
          const validationObject = {
            event: {
              token,
              siteKey: testKey,
            },
          };
          validateRecaptcha(validationObject);
        });
    });
  };

  const validateRecaptcha = async (validationObject: {
    event: { token: string; siteKey: string };
  }) => {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/oneentrys-captchas/assessments?key=${siteKey}`;
    await fetch(url, { method: 'post', body: JSON.stringify(validationObject) })
      .then((response) => response.json())
      .then((data) => {
        console.log('validation result', data);
      });
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${testKey}`;
    script.addEventListener('load', handleLoaded);
    document.body.appendChild(script);
    return () => {
      script.removeEventListener('load', handleLoaded);
    };
  }, []);

  return '';
};

export default FormCaptcha;
