import AsyncStorage from '@react-native-async-storage/async-storage';
// import Clipboard from '@react-native-community/clipboard';
import Clipboard from '@react-native-clipboard/clipboard';
import NetInfo from '@react-native-community/netinfo';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  SafeAreaView,
  Text,
  View,
  Button,
} from 'react-native';
import codePush from 'react-native-code-push';
// import {useDarkMode} from 'react-native-dark-mode';
import FlashMessage from 'react-native-flash-message';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import PushNotification from 'react-native-push-notification';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
import Container from './src/library/toastify-react-native';
import * as NavigationService from './src/navigation/NavigationService';
import navigationStrings from './src/navigation/navigationStrings';
import Routes from './src/navigation/Routes';
import {updateInternetConnection} from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
import PrinterScreen from './src/Screens/PrinterConnection/PrinterScreen';
import colors from './src/styles/colors';
import fontFamily from './src/styles/fontFamily';
// import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from './src/styles/responsiveSize';
import ForegroundHandler from './src/utils/ForegroundHandler';
import {getUrlRoutes} from './src/utils/helperFunctions';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationService';
import {getItem, getUserData, setItem} from './src/utils/utils';
import {MenuProvider} from 'react-native-popup-menu';
import {getBundleId} from 'react-native-device-info';
import {appIds} from './src/utils/constants/DynamicAppKeys';
import socketServices from './src/utils/scoketService';
// import firebase from '@react-native-firebase/app';
let CodePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

// if (!firebase.apps.length) {
//   firebase.initializeApp({ apiKey: 'AIzaSyAKxlO9OKIncFrbcb1tSpQgbfnY64Ou6sk',
//   authDomain: 'royo-order-version2.firebaseapp.com',
//   databaseURL: 'https://royo-order-version2.firebaseio.com',
//   projectId: 'royo-order-version2',
//   storageBucket: 'royo-order-version2.appspot.com',
//   appId: '1:1073948422654:ios:dc0471afc0e5c629c410af',
//   messagingSenderId: '1073948422654' });
// }
const App = () => {

   

  const [progress, setProgress] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('black');
  const ConnectBTFunction = async () => {
    await AsyncStorage.removeItem('autoConnectEnabled');

    const temp = new PrinterScreen();
    AsyncStorage.getItem('BleDevice2').then((res) => {
      const tt = JSON.parse(res);
      temp.connectBTFunc({
        address: tt.boundAddress,
        name: tt.name,
      });
    });
    AsyncStorage.removeItem('BleDevice2');
  };

  // useEffect(() => {
  //   FastImage.clearMemoryCache()
  //   FastImage.clearDiskCache()
  // }, [])

  const [internetConnection, setInternet] = useState(true);
  // const appMainData = useSelector((state) => state?.home?.appMainData);
  const appMainData = store.getState().home;

  async function handleDynamicLink(deepLinkUrl) {
    if (deepLinkUrl != null) {
      setItem('deepLinkUrl', deepLinkUrl);
      ('https://sales.royoorders.com/vendor/la-fresca-de-italia?id=2&name=La%20Fresca%20de%20Italia&table=2');
      let routeName = getUrlRoutes(deepLinkUrl, 1);
      if (routeName === 'vendor') {
        return;
      }
      var data = deepLinkUrl?.split('=').pop();
      let removePer = decodeURI(data);
      let sendingData = JSON.parse(removePer);

      // return;
      setTimeout(() => {
        NavigationService.navigate(navigationStrings.TAB_ROUTES, {
          screen: navigationStrings.HOMESTACK,
          params: {
            screen: navigationStrings.PRODUCT_LIST,
            params: {
              data: {
                category_slug: 'Restaurants',
                id: 2,
                name: 'La Fresca de Italia',
                vendor: true,
                table_id: sendingData,
              },
            },
          },
        });
      }, 1800);
    }
  }

  useEffect(() => {
    // Linking.getInitialURL().then((link) => handleDynamicLink(link));
    // Linking.addEventListener('url', (event) => handleDynamicLink(event.url));
    // return () => {
    //   Linking.removeEventListener('url', (event) =>
    //     handleDynamicLink(event.url),
    //   );
    // };
  }, [handleDynamicLink]);

  // const isDarkMode = useDarkMode();
  const isDarkMode = false;
  useEffect(() => {
    //stop splashs screen from loading
    if (getBundleId() == (appIds.masa || appIds.iPicknDrop || appIds.muvpod)) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 200);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }

    // AsyncStorage.getItem('autoConnectEnabled').then((res) => {
    //   if (res !== null) {
    //     ConnectBTFunction();
    //   }
    // });
  }, []);

  const notificationConfig = () => {
    requestUserPermission();
    notificationListener();

    if (Platform.OS == 'android') {
      checkExistChannel();
    }
  };

  const checkExistChannel = () => {
    PushNotification.getChannels(function (channel_ids) {});
  };
  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      // notificationConfig();
      const {dispatch} = store;
      if (userData && !!userData.auth_token) {
        dispatch({
          type: types.LOGIN,
          payload: userData,
        });
      }
      const getAppData = await getItem('appData');

      if (!!getAppData) {
        setPrimaryColor(getAppData.themeColors.primary_color);
      }
      dispatch({
        type: types.APP_INIT,
        payload: getAppData,
      });

      const locationData = await getItem('location');
      dispatch({
        type: types.LOCATION_DATA,
        payload: locationData,
      });

      const profileAddress = await getItem('profileAddress');

      dispatch({
        type: types.PROFILE_ADDRESS,
        payload: profileAddress,
      });

      const cartItemCount = await getItem('cartItemCount');
      if (cartItemCount) {
        dispatch({
          type: types.CART_ITEM_COUNT,
          payload: cartItemCount,
        });
      }

      const allUserAddress = await getItem('saveUserAddress');
      if (allUserAddress) {
        dispatch({
          type: types.SAVE_ALL_ADDRESS,
          payload: allUserAddress,
        });
      }

      const walletData = await getItem('walletData');
      if (walletData) {
        dispatch({
          type: types.WALLET_DATA,
          payload: walletData,
        });
      }

      const selectedAddress = await getItem('saveSelectedAddress');
      if (selectedAddress) {
        dispatch({
          type: types.SELECTED_ADDRESS,
          payload: selectedAddress,
        });
      }

      const dine_in_type = await getItem('dine_in_type');
      if (dine_in_type) {
        dispatch({
          type: types.DINE_IN_DATA,
          payload: dine_in_type,
        });
      }
      const theme = await getItem('theme');
      const themeToggle = await getItem('istoggle');
      if (JSON.parse(themeToggle)) {
        dispatch({
          type: types.THEME,
          payload: isDarkMode,
        });
        dispatch({
          type: types.THEME_TOGGLE,
          payload: JSON.parse(themeToggle),
        });
      } else {
        dispatch({
          type: types.THEME_TOGGLE,
          payload: JSON.parse(themeToggle),
        });
        if (JSON.parse(theme)) {
          dispatch({
            type: types.THEME,
            payload: true,
          });
        } else {
          dispatch({
            type: types.THEME,
            payload: false,
          });
        }
      }

      const searchResult = await getItem('searchResult');

      if (searchResult) {
        dispatch({
          type: types.ALL_RECENT_SEARCH,
          payload: searchResult,
        });
      }

      //Language
      const getLanguage = await getItem('language');
      if (getLanguage) {
        strings.setLanguage(getLanguage);
      }

      //saveShortCode
      const saveShortCode = await getItem('saveShortCode');
      if (saveShortCode) {
        dispatch({
          type: types.SAVE_SHORT_CODE,
          payload: saveShortCode,
        });
      }
      //Gamil configure
      // GoogleSignin.configure();

      // clip copy issue
      if (__DEV__) {
        Clipboard.setString('');
      }
    })();
    return () => {};
  }, []);

  //Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });
    return () => removeNetInfoSubscription();
  }, []);
  const {blurRef} = useRef();
  // let isVal = store.getState().pendingNotifications.isVendorNotification

  useEffect(() => {
    // codePush.sync(
    //   {
    //     installMode: codePush.InstallMode.IMMEDIATE,
    //     updateDialog: true,
    //   },
    //   codePushStatusDidChange,
    //   codePushDownloadDidProgress,
    // );
  }, []);

  function codePushStatusDidChange(syncStatus) {
    // switch (syncStatus) {
    //   case codePush.SyncStatus.CHECKING_FOR_UPDATE:
    //     console.log('codepush status Checking for update');
    //     break;
    //   case codePush.SyncStatus.DOWNLOADING_PACKAGE:
    //     console.log('codepush status Downloading package');
    //     break;
    //   case codePush.SyncStatus.AWAITING_USER_ACTION:
    //     console.log('codepush status Awaiting user action');
    //     break;
    //   case codePush.SyncStatus.INSTALLING_UPDATE:
    //     console.log('codepush status Installing update');
    //     setProgress(false);
    //     break;
    //   case codePush.SyncStatus.UP_TO_DATE:
    //     console.log('codepush status App up to date');
    //     setProgress(false);
    //     break;
    //   case codePush.SyncStatus.UPDATE_IGNORED:
    //     console.log('codepush status Update cancelled by user');
    //     setProgress(false);
    //     break;
    //   case codePush.SyncStatus.UPDATE_INSTALLED:
    //     console.log(
    //       'codepush status Update installed and will be applied on restart',
    //     );
    //     setProgress(false);
    //     break;
    //   case codePush.SyncStatus.UNKNOWN_ERROR:
    //     console.log('codepush status An unknown error occurred.');
    //     setProgress(false);
    //     break;
    // }
  }

  function codePushDownloadDidProgress(progress) {
    // console.log('codepush status progress status', progress);
    // setProgress(progress);
  }

  const progressView = () => {
    return (
      <View>
        <Modal isVisible={true}>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: moderateScale(8),
              padding: moderateScale(16),
            }}>
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: fontFamily.medium,
                color: colors.blackOpacity70,
                fontSize: textScale(14),
              }}>
              In Progress...
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(12),
                marginBottom: moderateScaleVertical(4),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  color: colors.blackOpacity70,
                  fontSize: textScale(12),
                }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
                2,
              )}MB/${(Number(progress.totalBytes) / 1048576).toFixed(
                2,
              )}MB`}</Text>

              <Text
                style={{
                  color: primaryColor,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(12),
                }}>
                {(
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0)}
                %
              </Text>
            </View>

            <Progress.Bar
              progress={
                (
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0) / 100
              }
              width={width / 1.2}
              color={primaryColor}
            />
          </View>
        </Modal>
      </View>
    );
  };
  
  // console.log(progress,'progress')
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Provider ref={blurRef} store={store}>
          <ForegroundHandler />
          {progress ? progressView() : null}
          <Routes />
          <NotificationModal />
        </Provider>
      </MenuProvider>
      <Container
        width={width - 20}
        position="top"
        duration={2000}
        positionValue={moderateScaleVertical(20)}
      />
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};

// export default codePush(CodePushOptions)(App);
export default App;
