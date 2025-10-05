import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

/**
 * FormReCaptcha.
 * @param props              - FormReCaptcha props.
 * @param props.setToken     - Function to set the token.
 * @param props.setIsCaptcha - Function to set captcha state.
 * @param props.captchaKey   - Captcha key.
 * @returns                  FormReCaptcha component.
 */
const FormReCaptcha = ({
  setToken,
  setIsCaptcha,
  captchaKey,
}: {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  captchaKey: string;
}): JSX.Element => {
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
