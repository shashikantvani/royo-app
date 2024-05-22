import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import actions from '../redux/actions';
import { printReciept, StartPrinting } from '../Screens/PrinterConnection/PrinteFunc';
import notifee, { EventType } from '@notifee/react-native';


// let arr = []
// let canEnablePrinter = true

const ForegroundHandler = (props) => {

  // const initPrinter = () => {
  //   canEnablePrinter = false

  //   printReciept(arr[0]).then(() => {
  //     arr.shift()
  //     setTimeout(() => {
  //       if(arr.length > 0){
  //         initPrinter()
  //       }else{
  //         canEnablePrinter = true
  //       }
  //     }, 2000);
  //   })
  // }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  useEffect(() => {
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   console.log("remote message foreground", remoteMessage)
    //   const { data, messageId, notification } = remoteMessage
    //   {
    //     Platform.OS == 'ios' ?
    //       PushNotificationIOS.addNotificationRequest({
    //         id: messageId,
    //         body: data?.body || '',
    //         title: data?.title || '',
    //         sound: notification.sound,
    //       })
    //       :
    //       PushNotification.localNotification({
    //         channelId: notification.android.channelId,
    //         id: messageId,
    //         body: data?.message || '',
    //         title: data?.type || '',
    //         soundName: notification.android.sound,
    //         vibrate: true,
    //         playSound: true
    //       })
    //   }


    //   if (Platform.OS == 'android' && notification.android.sound == 'notification') {
    //     actions.isVendorNotification(true)
    //     actions.refreshNotification(messageId);
    //     const { data } = remoteMessage.data
    //     let _data = JSON.parse(data)
    //     console.log('foreground notification listener checking data >>>>',_data)
    //     console.log('foreground notification listener checking data >>>>',_data.vendors[0].vendor.auto_accept_order == 1)
    //     if(_data.vendors[0].vendor.auto_accept_order == 1){
    //       StartPrinting(_data)
    //     }
    //   }

    //   if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
    //     actions.isVendorNotification(true)
    //     actions.refreshNotification(messageId);
    //   }

    // });
   // return unsubscribe;
   //return []
  }, []);

  return null;
};

export default ForegroundHandler;