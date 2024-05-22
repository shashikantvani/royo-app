import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {Appearance} from 'react-native';
// import { AppearanceProvider } from 'react-native-appearance';
import { useSelector } from 'react-redux';
import { Cart, ChatRoom, ChatScreen } from '../Screens';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';

import { navigationRef } from './NavigationService';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
const Stack = createStackNavigator();

export default function Routes() {
  const { userData, appSessionInfo, isGuestLogin } = useSelector(
    (state) => state?.auth,
  );
  const { appStyle } = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  // console.log(appSessionInfo, 'appSessionInfo..appSessionInfo');
  // console.log(!!(businessType == 4), "businessType????businessType")
  console.log(appSessionInfo,'appSessionInfo--->')
  return (
    // <AppearanceProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          {appSessionInfo == 'shortcode' ||
            appSessionInfo == 'show_shortcode' ? (
            <Stack.Screen
              name={navigationStrings.SHORT_CODE}
              component={ShortCode}
              options={{ headerShown: false }}
              screenOptions={{
                headerShown: false
              }}
            />
          ) : appSessionInfo == 'app_intro' ? (
            <Stack.Screen
              name={navigationStrings.APP_INTRO}
              component={AppIntro}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : appSessionInfo == 'guest_login' || !!userData?.auth_token ? (
            <Stack.Screen
              name={navigationStrings.TAB_ROUTES}
              component={businessType === 4 ? TaxiTabRoutes : TabRoutes}
              options={{ headerShown: false, gestureEnabled: false }}
            />
          ) : (
            // <>{console.log(appSessionInfo,'authStack')}</>
            AuthStack(Stack, appStyle)
          )}
          {/* {CourierStack(Stack)} */}

          {/* {TaxiAppStack(Stack)} */}

          {/* <Stack.Screen
            name={navigationStrings.CHAT_SCREEN}
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={navigationStrings.CHAT_ROOM}
            component={ChatRoom}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name={navigationStrings.TABROUTESVENDOR}
            component={TabRoutesVendor}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name={navigationStrings.TABROUTESVENDORNEW}
            component={TabRoutesVendorNewTemplate}
            options={{ headerShown: false, gestureEnabled: false }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    // </AppearanceProvider>
  );
}
