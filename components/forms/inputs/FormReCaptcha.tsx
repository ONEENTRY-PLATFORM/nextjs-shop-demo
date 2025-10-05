import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

/**
 * FormReCaptcha.
 * @param   {object}            props              - FormReCaptcha props.
 * @param   {Dispatch<string>}  props.setToken     - Function to set the token.
 * @param   {Dispatch<boolean>} props.setIsCaptcha - Function to set captcha state.
 * @param   {string}            props.captchaKey   - Captcha key.
 * @returns {JSX.Element}                          FormReCaptcha component.
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
