import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import {useSelector} from 'react-redux';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarFive from '../Components/CustomBottomTabBarFive';
import CustomBottomTabBarFour from '../Components/CustomBottomTabBarFour';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import {MyOrders} from '../Screens';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {appIds} from '../utils/constants/DynamicAppKeys';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import AccountStack from './AccountStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';

const Tab = createBottomTabNavigator();

export default function TaxiTabRoutes(props) {
  const {appStyle, themeColors, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  const fontFamily = appStyle?.fontSizeData;

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      tabBar={(props) => {
        switch (appStyle?.tabBarLayout) {
          case 1:
            return <CustomBottomTabBar {...props} />;
          case 2:
            return <CustomBottomTabBarTwo {...props} />;
          case 3:
            return <CustomBottomTabBarThree {...props} />;
          case 4:
            return <CustomBottomTabBarFour {...props} />;
          case 5:
            return <CustomBottomTabBarFive {...props} />;
        }
      }}
      screenOptions={{
        labelStyle: {
          textTransform: 'capitalize',
          fontFamily: fontFamily?.medium,
          fontSize: textScale(12),
          color: colors.white,
        },

        // showLabel: false,
      }}>
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={{
          tabBarLabel: strings.HOME,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={[
                appStyle?.tabBarLayout == 4
                  ? {
                      // tintColor: focused
                      //   ? themeColors?.primary_color
                      //   : getColorCodeWithOpactiyNumber(
                      //       themeColors?.secondary_color.substr(1),
                      //       70,
                      //     ),
                    }
                  : appStyle?.tabBarLayout == 5
                  ? null
                  : {
                      // tintColor: focused
                      //   ? themeColors?.secondary_color
                      //   : getColorCodeWithOpactiyNumber(
                      //       themeColors?.secondary_color.substr(1),
                      //       70,
                      //     ),
                    },
                appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
              ]}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.homeActive
                    : imagePath.homeInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.homeRedActive
                    : imagePath.homeRedInActive
                  : focused
                  ? imagePath.tabAActive
                  : imagePath.tabAInActive
              }
            />
          ),
          // unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        component={MyOrders}
        name={navigationStrings.MY_ORDERS}
        options={{
          tabBarLabel:
            appStyle?.tabBarLayout === 6
              ? strings.SERVICES
              : appIds.mml == getBundleId()
              ? strings.MYDELIERIES
              : appIds.jiffex == getBundleId()
              ? strings.MY_ORDERS
              : strings.MYRIDES,
          tabBarIcon: ({focused, tintColor}) => {
            let tabIconColor =
              appStyle?.tabBarLayout == 4
                ? {
                    // tintColor: focused
                    //   ? themeColors?.primary_color
                    //   : getColorCodeWithOpactiyNumber(
                    //       themeColors?.secondary_color.substr(1),
                    //       70,
                    //     ),
                  }
                : appStyle?.tabBarLayout == 5
                ? null
                : {
                    // tintColor: focused
                    //   ? themeColors?.secondary_color
                    //   : getColorCodeWithOpactiyNumber(
                    //       themeColors?.secondary_color.substr(1),
                    //       70,
                    //     ),
                  };
            return (
              <Image
                style={[
                  {
                    ...tabIconColor,
                    height: 25,
                    width: 25,
                  },
                ]}
                resizeMode="contain"
                source={
                  appStyle?.tabBarLayout === 6
                    ? focused
                      ? imagePath.settings_red_icon
                      : imagePath.settings_icon
                    : appStyle?.tabBarLayout === 5
                    ? focused
                      ? appIds.mml == getBundleId()
                        ? imagePath?.activeTruck
                        : imagePath.icMyRideActive
                      : appIds.mml == getBundleId()
                      ? imagePath?.inactiveTruck
                      : imagePath.icMyRideInActive
                    : focused
                    ? appIds.mml == getBundleId()
                      ? imagePath?.activeTruck
                      : imagePath.rideFilled
                    : appIds.mml == getBundleId()
                    ? imagePath?.inactiveTruck
                    : imagePath.ride
                }
              />
            );
          },
          // unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={{
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={[
                appStyle?.tabBarLayout == 4
                  ? {
                      // tintColor: focused
                      //   ? themeColors.primary_color
                      //   : getColorCodeWithOpactiyNumber(
                      //       themeColors?.secondary_color.substr(1),
                      //       70,
                      //     ),
                    }
                  : appStyle?.tabBarLayout == 5
                  ? null
                  : {
                      // tintColor: focused
                      //   ? themeColors.secondary_color
                      //   : getColorCodeWithOpactiyNumber(
                      //       themeColors?.secondary_color.substr(1),
                      //       70,
                      //     ),
                    },
                appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
              ]}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.profileActive
                    : imagePath.profileInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.accountRedActive
                    : imagePath.accountRedInActive
                  : focused
                  ? imagePath.tabEActive
                  : imagePath.tabEInActive
              }
            />
          ),
          //  unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const styles = StyleSheet.create({
    cartItemCountView: {
      position: 'absolute',
      zIndex: 100,
      top: -5,
      right: -5,
      backgroundColor: colors.cartItemPrice,
      width: moderateScale(18),
      height: moderateScale(18),
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartItemCountNumber: {
      fontFamily: fontFamily?.bold,
      color: colors.white,
      fontSize: textScale(8),
    },
  });
  return styles;
}
