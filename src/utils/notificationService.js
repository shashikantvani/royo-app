import AsyncStorage from '@react-native-async-storage/async-storage';
// import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';
import {navigate} from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';
import actions from '../redux/actions';
import {getItem} from './utils';

export async function requestUserPermission() {
  // if (Platform.OS == 'ios') {
  //     await messaging().registerDeviceForRemoteMessages();
  // }
  // const authStatus = await messaging().requestPermission();
  // const enabled =
  //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // if (enabled) {
  //   // console.log('Authorization status:', authStatus);
  //   getFcmToken();
  // }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  // console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    // try {
    //   const fcmToken = await messaging().getToken();
    //   if (fcmToken) {
    //     // console.log(fcmToken, 'the new genrated token');
    //     // user has a device token
    //     await AsyncStorage.setItem('fcmToken', fcmToken);
    //   }
    // } catch (error) {
    //   // console.log(error, 'error in fcmToken');
    //   // showError(error.message)
    // }
  }
};

const _getOrderDetail = async (id) => {
  const getAppData = await getItem('appData');
  const {appData} = getAppData;
  // console.log('manage Redirections', appData);
  let data = {};
  data['order_id'] = id;

  actions
    .getOrderDetail(data, {
      code: appData?.profile?.code,
      currency: appData.currencies[0].currency_id,
      language: appData.languages[0].language_id,
      // systemuser: DeviceInfo.getUniqueId(),
    })
    .then((res) => {
      // console.log(res, 'resorder detail on redirection >>>');
      // navigation.navigate(navigationStrings.ORDER_DETAIL, {
      //   orderId: item?.order_id,
      //   fromVendorApp: true,
      //   orderDetail: item,
      //   orderStatus: item?.order_status,
      //   selectedVendor: { id: item?.vendor_id },
      //   showRating: item?.order_status?.current_status?.id != 6 ? false : true,
      // });
    })
    .catch(errorMethod);
};

const manageRedirections = async (data) => {
  // console.log('manage Redirections +++++ ', data);
  if (data.type == 'order_status_change') {
    // _getOrderDetail(4);
  }
};



export const notificationListener = async () => {
  // _openApp()

  PushNotification.configure({
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: true,      
    popInitialNotification: true,
  });

  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   // console.log('tap on notification',remoteMessage);
  //   const {data} = remoteMessage
  //   if(!!data?.room_id){
  //   navigate(navigationStrings.CHAT_SCREEN, { data: { _id: data?.room_id, room_id: data?.room_id_text } })
  // }
  // });

  createDefaultChannels();

  function createDefaultChannels() {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: `Default channel`, // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'sound-channel-id', // (required)
        channelName: `Sound channel 2`, // (required)
        channelDescription: 'A sound channel 2', // (optional) default: undefined.
        soundName: 'notification.wav', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'sound-channel-id', // (required)
        channelName: `Sound channel 2`, // (required)
        channelDescription: 'A sound channel 2', // (optional) default: undefined.
        soundName: 'notification.wav', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  // messaging()
  //   .getInitialNotification()
  //   .then((remoteMessage) => {
  //     if (remoteMessage) {
  //       // console.log('remote message inital notification', remoteMessage);
  //       const {data, messageId, notification} = remoteMessage;
  //       if (
  //         Platform.OS == 'android' &&
  //         notification.android.sound == 'notification'
  //       ) {
  //         actions.isVendorNotification(true);
  //       }
  //       if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
  //         actions.isVendorNotification(true);
  //       }
  //     }
  //   });

  return null;
};

const _openApp = () => {
  // messaging().onNotificationOpenedApp((remoteMessage) => {
  //   // console.log(
  //   //   'Notification caused app to open from background state bla bla:',
  //   //   remoteMessage,
  //   // );
  //   const {data, messageId, notification} = remoteMessage;

  //   manageRedirections(data);

  //   if (
  //     Platform.OS == 'android' &&
  //     notification.android.sound == 'notification'
  //   ) {
  //     actions.isVendorNotification(true);
  //   }
  //   if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
  //     actions.isVendorNotification(true);
  //   }
  // });
  // console.log('i am here>>>>>');
};

const _onRedirectOrderScreen = (id) => {
  if (id) {
    navigate(navigationStrings.ORDER_DETAIL, {
      orderId: id,
      fromActive: true, // this value use for useInterval
    });
  }
};
