/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@headlessui/react';
import type { Dispatch } from 'react';
import { useEffect, useRef } from 'react';

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

  const onExpire = () => {
    console.warn('expired!');
  };

  const onLoad = () => {
    console.log('loading');
  };

  const onError = (e: unknown) => {
    console.log('error ' + e);
  };

  return (
    <>
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
      />
      <Button
        rounded
        style={{
          width: '100%',
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
        }}
        paragraphProps={{
          weight: '600',
          style: { fontSize: 20 },
        }}
        onPress={send}
      >
        {verify}
      </Button> */}
    </>
  );
};
