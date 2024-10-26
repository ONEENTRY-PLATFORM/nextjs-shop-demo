/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(undefined);

  useEffect(() => {
    //   registerForPushNotificationsAsync().then(
    //     (token) => token && setExpoPushToken(token),
    //   );
    //   if (Platform.OS === 'android') {
    //     Notifications.getNotificationChannelsAsync().then();
    //   }
    //   notificationListener.current =
    //     Notifications.addNotificationReceivedListener(
    //       async (notification: {
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         request: { content: { title: any; body: any } };
    //       }) => {
    //         // await Notifications.scheduleNotificationAsync({
    //         //   content: {
    //         //     title: notification.request.content.title,
    //         //     body: notification.request.content.body,
    //         //   },
    //         //   trigger: { seconds: 1 },
    //         // });
    //         Toast.show({
    //           type: 'success',
    //           text1: notification.request.content.title || 'Notification',
    //           text2: notification.request.content.body || 'Notification',
    //         });
    //         setNotification(notification);
    //       },
    //     );
    //   responseListener.current =
    //     Notifications.addNotificationResponseReceivedListener((response) => {
    //       console.log(response);
    //     });
    //   return () => {
    //     notificationListener.current &&
    //       Notifications.removeNotificationSubscription(
    //         notificationListener.current,
    //       );
    //     responseListener.current &&
    //       Notifications.removeNotificationSubscription(responseListener.current);
    //   };
  }, []);

  return {
    token: expoPushToken,
    notification: notification,
  };
};
