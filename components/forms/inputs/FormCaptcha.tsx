import type { Dispatch, JSX } from 'react';
import { useEffect } from 'react';

/**
 * FormCaptcha.
 * @param   {object}            props              - Form captcha props.
 * @param   {Dispatch<boolean>} props.setIsCaptcha - Set captcha.
 * @returns {JSX.Element}                          FormCaptcha component.
 */
const FormCaptcha = ({
  setIsCaptcha,
}: {
  setIsCaptcha: Dispatch<boolean>;
}): JSX.Element => {
  const testKey = '6LdF4HcqAAAAAD7Mia-zF5SMzY-XjHd_SU2xr0uQ';
  const siteKey = 'AIzaSyBC4rSjMl4SspgQ2J046ZyRv1IX44v3jgc';

  useEffect(() => {
    setIsCaptcha(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handles the loading of the reCAPTCHA script and executes the verification process
   */
  const handleLoaded = () => {
    // Wait for reCAPTCHA to be ready and execute the verification
    window.grecaptcha?.enterprise.ready(() => {
      window.grecaptcha?.enterprise
        .execute(testKey, { action: 'homepage' })
        .then((token: string) => {
          // Create validation object with token and site key
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

  /**
   * Validates the reCAPTCHA response by sending the validation object to Google's reCAPTCHA Enterprise API
   * @param {object} validationObject               - Object containing the reCAPTCHA token and site key
   * @param {object} validationObject.event         - Event data containing token and siteKey
   * @param {string} validationObject.event.token   - The reCAPTCHA token generated after user verification
   * @param {string} validationObject.event.siteKey - The site key for the reCAPTCHA service
   */
  const validateRecaptcha = async (validationObject: {
    event: { token: string; siteKey: string };
  }) => {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/oneentrys-captchas/assessments?key=${siteKey}`;
    await fetch(url, { method: 'post', body: JSON.stringify(validationObject) })
      .then((response) => response.json())
      .then((data) => {
        // eslint-disable-next-line no-console
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default FormCaptcha;
