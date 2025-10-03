import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

/**
 * Form captcha props
 *
 * @property setToken - Function to set the token
 * @property setIsCaptcha - Function to set captcha state
 * @property captchaKey - Captcha key
 */
type FormCaptchaProps = {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
};

/**
 * FormReCaptcha
 *
 * @param props - FormReCaptcha props
 * @param props.setToken - Function to set the token
 * @param props.setIsCaptcha - Function to set captcha state
 * @param props.captchaKey - Captcha key
 *
 * @returns FormReCaptcha component
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
