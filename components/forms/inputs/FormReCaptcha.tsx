import type { Dispatch } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

type FormCaptchaProps = {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
};

/**
 * FormReCaptcha
 * @param setToken
 * @param setIsCaptcha
 * @param captchaKey
 *
 * @returns FormReCaptcha
 */
const FormReCaptcha = ({
  setToken,
  setIsCaptcha,
  captchaKey,
}: FormCaptchaProps) => {
  useEffect(() => {
    setIsCaptcha(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReCAPTCHA
      sitekey={captchaKey}
      onChange={(token: string | null) => setToken(token || '')}
      className={'mx-auto'}
      theme="dark"
    />
  );
};

export default FormReCaptcha;
