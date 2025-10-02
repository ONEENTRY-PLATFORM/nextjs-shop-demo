import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

type FormCaptchaProps = {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
};

/**
 * FormReCaptcha
 *
 * @param {object} props - FormReCaptcha props.
 * @param {Function} props.setToken - setToken.
 * @param {Function} props.setIsCaptcha - setIsCaptcha.
 * @param {string} props.captchaKey - captchaKey.
 *
 * @returns FormReCaptcha
 */
const FormReCaptcha = ({
  setToken,
  setIsCaptcha,
  captchaKey,
}: FormCaptchaProps): JSX.Element => {
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
