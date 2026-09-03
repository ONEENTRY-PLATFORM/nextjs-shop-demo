/* eslint-disable no-console */
import type { Dispatch, JSX } from 'react';
import { useEffect, useRef } from 'react';

import { getApi } from '@/app/api/api/api';

/**
 * FormReCaptcha component for Google reCAPTCHA v3 Enterprise integration.
 * @param   {object}            props              - FormReCaptcha props.
 * @param   {string}            props.siteKey      - Google reCAPTCHA site key.
 * @param   {string}            props.action       - Action name for this verification.
 * @param   {Dispatch<string>}  props.setToken     - Function to set the token.
 * @param   {Dispatch<boolean>} props.setIsCaptcha - Function to set captcha state.
 * @param   {Dispatch<boolean>} props.setIsValid   - Function to set validation state.
 * @returns {JSX.Element}                          FormReCaptcha component.
 */
const FormReCaptcha = ({
  siteKey,
  action = 'verify',
  setToken,
  setIsCaptcha,
  setIsValid,
}: {
  siteKey: string;
  action?: string;
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
  setIsValid: Dispatch<boolean>;
}): JSX.Element => {
  const { System } = getApi();
  const scriptLoadedRef = useRef(false);
  const executedRef = useRef(false);

  /**
   * Executes reCAPTCHA verification and gets token
   */
  const executeRecaptcha = async () => {
    if (executedRef.current) return;

    try {
      if (typeof window !== 'undefined' && window.grecaptcha?.enterprise) {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha?.enterprise?.execute(
              siteKey,
              {
                action,
              },
            );

            if (token) {
              executedRef.current = true;
              setToken(token);
            }
          } catch (error) {
            console.error('reCAPTCHA execution error:', error);
            setIsValid(false);
          }
        });
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      setIsValid(false);
    }
  };

  /**
   * Loads reCAPTCHA script dynamically
   */
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const loadRecaptchaScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector(
        `script[src*="recaptcha/enterprise.js"]`,
      );

      if (existingScript) {
        scriptLoadedRef.current = true;
        executeRecaptcha();
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        executeRecaptcha();
      };

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        setIsValid(false);
      };

      document.head.appendChild(script);
    };

    setIsCaptcha(true);
    loadRecaptchaScript();

    return () => {
      // Cleanup: remove script on unmount
      const script = document.querySelector(
        `script[src*="recaptcha/enterprise.js?render=${siteKey}"]`,
      );
      if (script) {
        script.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, setIsCaptcha, setIsValid]);

  /**
   * Validates token with backend when token is received
   */
  useEffect(() => {
    if (!executedRef.current) return;

    const validateToken = async () => {
      try {
        // const token = await new Promise<string>((resolve) => {
        await new Promise<string>((resolve) => {
          const checkToken = () => {
            if (window.grecaptcha?.enterprise) {
              window.grecaptcha.enterprise.ready(async () => {
                const newToken = await window.grecaptcha?.enterprise?.execute(
                  siteKey,
                  { action },
                );
                if (newToken) resolve(newToken);
              });
            }
          };
          checkToken();
        });

        // const data = {
        //   token,
        //   expectedAction: action,
        //   siteKey,
        // };

        // const isValid = await System.validateCaptcha(data);
        // setIsValid(isValid);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValid(false);
      }
    };

    validateToken();
  }, [action, siteKey, System, setIsValid]);

  /**
   * reCAPTCHA v3 is invisible, so no UI is rendered
   */
  return <></>;
};

export default FormReCaptcha;
