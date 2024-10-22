// import {Alert, Platform} from 'react-native';
// import * as Notifications from 'expo-notifications';
// import messaging from '@react-native-firebase/messaging';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if ('Device.isDevice') {
//     const {status: existingStatus} = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const {status} = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       Alert.alert('Failed to get push token for push notification!');
//       return;
//     }
//     try {
//       // const projectId =
//       //   Constants?.expoConfig?.extra?.eas?.projectId ??
//       //   Constants?.easConfig?.projectId;
//       // if (!projectId) {
//       //   throw new Error('Project ID not found');
//       // }
//       // token = (
//       //   await Notifications.getExpoPushTokenAsync({
//       //     projectId,
//       //   })
//       // ).data;
//       token = (await Notifications.getDevicePushTokenAsync()).data;
//       if (Platform.OS === 'ios') {
//         await messaging().setAPNSToken(token);
//         await messaging().registerDeviceForRemoteMessages();
//         token = await messaging().getToken();
//       }
//       console.log(token);
//     } catch (e) {
//       token = `${e}`;
//     }
//   } else {
//     Alert.alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
