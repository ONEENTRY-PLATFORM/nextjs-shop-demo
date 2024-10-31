/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import { useAppSelector } from '@/app/store/hooks';

type Props = {
  setToken: Dispatch<string>;
  setIsCaptcha: Dispatch<boolean>;
};

export const FormCaptcha = ({ setToken, setIsCaptcha }: Props) => {
  const recaptcha = useRef<unknown>();
  const { verify } = useAppSelector(
    (state) => state.systemContentReducer.content,
  );

  const send = () => {
    // recaptcha.current.open();
  };

  useEffect(() => {
    setIsCaptcha(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onVerify = (token: string) => {
    setToken(token);
  };

  return (
    <>
      {/* <ReCAPTCHA
        ref={recaptcha}
        sitekey="6Lc8mQwqAAAAAASbSC4ANjN7Rsq-xC63iMX8HWG9"
        onChange={onVerify}
      /> */}
      {/* <Recaptcha
        ref={recaptcha}
        siteKey="6Lc8mQwqAAAAAASbSC4ANjN7Rsq-xC63iMX8HWG9"
        baseUrl="https://react-native-course.oneentry.cloud"
        onVerify={onVerify}
        onExpire={onExpire}
        onError={onError}
        onLoad={onLoad}
        webViewProps={{
          containerStyle: {
            paddingTop: top,
          },
        }}
        size="normal"
      />*/}
    </>
  );
};
