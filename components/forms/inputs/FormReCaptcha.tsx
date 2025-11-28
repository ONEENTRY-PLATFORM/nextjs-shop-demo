import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha-enterprise';

/**
 * FormReCaptcha component for Google reCAPTCHA integration.
 * Provides bot protection for forms using Google's reCAPTCHA service.
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
  /**
   * Effect hook to initialize captcha state
   * Sets the captcha state to true when component mounts
   */
  useEffect(() => {
    setIsCaptcha(true);
  }, [setIsCaptcha]);

  /**
   * Google reCAPTCHA component
   * Renders the reCAPTCHA widget with dark theme
   * @param   {string | null} token - reCAPTCHA token
   * @returns {JSX.Element}         JSX.Element
   */
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
