import { BluetoothManager } from "@brooons/react-native-bluetooth-escpos-printer";

import ActionSheet from "react-native-actionsheet";
import React, { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useDarkMode } from "react-native-dark-mode";
import DeviceInfo, { getBundleId } from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
// import SunmiV2Printer from "react-native-sunmi-v2-printer";
import SunmiPrinter from '@heasy/react-native-sunmi-printer';
// import ZendeskChat from "react-native-zendesk-chat";
import * as RNZendesk from "rn-zendesk";
import { useSelector } from "react-redux";
import Header from "../../Components/Header";
import ListItemHorizontal from "../../Components/ListItemHorizontalWithImage";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang/index";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import commonStylesFun from "../../styles/commonStyles";

import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { appIds } from "../../utils/constants/DynamicAppKeys";
import {
  getImageUrl,
  getRandomColor,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
import stylesFun from "./styles";
import { useRef } from "react";
export default function Account3({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const {
    themeColors,
    appStyle,
    appData,
    shortCodeStatus,
    currencies,
    languages,
  } = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;

  const [allVendors, setAllVendors] = useState([]);

  const [state, setState] = useState({
    isLoading: false,
  });

  const { preferences, phone_number, contact_phone_number } = appData?.profile;

  // const profileInfo = appData?.profile;
  console.log("appDataappDataappDataappDataappData", appData);
  const [isVisible, setIsVisible] = useState(false);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });

  //Navigation to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const userData = useSelector((state) => state.auth.userData);
  const appMainData = useSelector((state) => state?.home?.appMainData);
  console.log("user data", userData);

  console.log(contact_phone_number, "userDAta");
  // useFocusEffect(
  //   React.useCallback(() => {
  //     _scrollRef.current.scrollTo(0);
  //   }, []),
  // );

  //Share your app

  useEffect(() => {
    if (!!appMainData?.is_admin) {
      fetchAllVendors();
    }
  }, [appMainData?.is_admin]);

  const fetchAllVendors = async (value = null) => {
    let query = `?limit=${100000}&page=${1}`;
    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    try {
      const res = await actions.storeVendors(query, headers);
      if (res?.data?.data) {
        setAllVendors(res.data.data);
        return;
      }
      console.log("available vendors res", res);
    } catch (error) {
      console.log("error riased", error);
      showError(error?.message);
    }
  };

  const onShare = () => {
    console.log("onShare", appData);
    if (!!appData?.domain_link) {
      let hyperLink = appData?.domain_link + "/share";
      let options = { url: hyperLink };
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
      return;
    }
    alert("link not found");
  };

  // initalize Zendesk
  useEffect(() => { 
    // ZendeskChat.init(
    //   `${preferences?.customer_support_key}`,
    //   `${preferences?.customer_support_application_id}`
    // );
    RNZendesk.initialize({
      appId: `${preferences?.customer_support_application_id}`,
      // zendeskUrl: ZENDESK_URL,
      clientId: `${preferences?.customer_support_key}`
    });
  }, [
    preferences?.customer_support_application_id,
    preferences?.customer_support_key,
  ]);

  const onStartSupportChat = () => {
    // RNZendesk.setVisitorInfo({
    //   name: userData?.name,
    //   phone: userData?.phone_number ? userData?.phone_number : "",
    // });
    RNZendesk.showHelpCenter({
      subject: "Title for any new ticket created by the user inside helpcenter",
  tags: ["tag1", "tag2", "tag3"],
      name: userData?.name,
      phone: userData?.phone_number ? userData?.phone_number : "",
      withChat: true,
      color: "#000",
      messagingOptions: {},
    });
  };

  const usernameFirstlater = !!userData?.name && userData?.name?.charAt(0);

  const goToChatRoom = (type) => {
    if (!!appMainData?.is_admin && type == "vendor_chat") {
      navigation.navigate(navigationStrings.CHAT_ROOM, {
        type: type,
        allVendors: allVendors,
      });
    } else {
      navigation.navigate(navigationStrings.CHAT_ROOM, { type: type });
    }
  };
  //----------------------------------ActionSheet------------------------------//
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const onSosButton = (index) => {
    console.log(index, "index");
    switch (index) {
      case 0:
        Linking.openURL(
          `tel:${appData?.profile?.preferences?.sos_police_contact}`
        );

        break;
      case 1:
        Linking.openURL(
          `tel:${appData?.profile?.preferences?.sos_ambulance_contact}`
        );
        break;

      default:
        break;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}
    >
      <StatusBar barStyle={"light-content"} />
      <View
        style={{
          flex: 0.2,
          backgroundColor: "#1D175D",
        }}
      />

      <View
        style={{
          flex: 1,
          marginTop: -moderateScale(10),
          borderTopLeftRadius: moderateScaleVertical(10),
          borderTopRightRadius: moderateScaleVertical(10),
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      >
        {!!userData?.auth_token && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={moveToNewScreen(navigationStrings.MY_PROFILE)}
              style={{
                marginHorizontal: moderateScale(24),
                alignItems: "center",
                justifyContent:'center',
                borderRadius: 12,
                position: "absolute",
                top: moderateScaleVertical(width / 30) - moderateScaleVertical(70),
                left: "25%"
                // top: -50,
                // left: 100,
                // flex: 1,
              }}
            >
              {userData?.source ? (
                <View
                  style={{
                    height: moderateScale(110),
                    width: moderateScale(110),
                    borderRadius: moderateScale(55),
                    backgroundColor: colors.white,
                    alignItems: "center",
                    justifyContent: "center",
                    
                  }}
                >
                  <FastImage
                    source={
                      userData?.source?.image_path
                        ? {
                          uri: getImageUrl(
                            userData?.source?.proxy_url,
                            userData?.source?.image_path,
                            "200/200"
                          ),
                        }
                        : userData?.source
                    }
                    style={{
                      height: moderateScale(90),
                      width: moderateScale(90),
                      borderRadius: moderateScale(45),
                      backgroundColor: colors.blackOpacity10,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    // backgroundColor: getRandomColor(),
                    // height: moderateScale(46),
                    // width: moderateScale(46),
                    borderRadius: moderateScale(12),
                    marginHorizontal: moderateScale(15),
                    alignItems: "center",
                    justifyContent: "center",
                    height: moderateScale(110),
                    width: moderateScale(110),
                    borderRadius: moderateScale(55),
                    borderWidth: 2,
                    borderColor:  themeColors.primary_color,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                  }}
                >
                  <Text
                    style={{
                      fontSize: textScale(20),
                      textTransform: "uppercase",
                      // color: 'red',
                      color:isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackB,
                    }}
                  >
                    {usernameFirstlater}
                  </Text>
                </View>
              )}

              <Text
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : themeColors.primary_color,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                  textAlign: "left",
                }}
              >
                {userData?.name}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(14),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyJ,
                  marginTop: moderateScaleVertical(5),
                  textAlign: "left",
                }}
              >
                {userData?.email}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View
          style={{
            // backgroundColor: "#f7f7f7",
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : "#f7f7f7",
            paddingVertical: moderateScaleVertical(10),
            marginHorizontal: moderateScale(20),
            borderRadius: moderateScale(15),
            marginTop: moderateScale(120),

            marginTop: moderateScaleVertical(120),
            height: height / 1.7,
          }}
        >
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {!!userData?.auth_token &&
              (businessType == 4 ? null : (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={moveToNewScreen(navigationStrings.MY_ORDERS, {
                    isBack: true,
                  })}
                  iconLeft={imagePath.myOrder2}
                  centerHeading={strings.MY_ORDERS}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />
              ))}

            {!!userData?.auth_token &&
              !!appData &&
              !!appData?.profile &&
              appData?.profile?.preferences?.subscription_mode == 1 && (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={moveToNewScreen(navigationStrings.SUBSCRIPTION)}
                  iconLeft={imagePath.subscription}
                  centerHeading={strings.SUBSCRIPTION}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />
              )}

            {!!userData?.auth_token && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={moveToNewScreen(navigationStrings.LOYALTY)}
                iconLeft={imagePath.loyalty}
                centerHeading={strings.LOYALTYPOINTS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

            {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            onPress={moveToNewScreen(navigationStrings.NOTIFICATION)}
            iconLeft={imagePath.notifcation}
            centerHeading={strings.NOTIFICATION}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
            {!!userData?.auth_token && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={moveToNewScreen(navigationStrings.WALLET)}
                iconLeft={imagePath.wallet3}
                centerHeading={strings.WALLET}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}
            {!!userData?.auth_token &&
              (businessType == 4 ? null : (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={moveToNewScreen(navigationStrings.WISHLIST)}
                  iconLeft={imagePath.wishlist}
                  centerHeading={strings.FAVOURITE}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />
              ))}

            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: "row" }}
              leftIconStyle={{ flex: 0.1, alignItems: "center" }}
              onPress={moveToNewScreen(navigationStrings.CMSLINKS)}
              iconLeft={imagePath.links}
              centerHeading={strings.LINKS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />

            {!!userData?.auth_token && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={onShare}
                iconLeft={imagePath.share1}
                centerHeading={strings.SHARE_APP}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

            <ListItemHorizontal
              centerContainerStyle={{ flexDirection: "row" }}
              leftIconStyle={{ flex: 0.1, alignItems: "center" }}
              onPress={moveToNewScreen(navigationStrings.SETTIGS)}
              iconLeft={imagePath.settings1}
              centerHeading={strings.SETTINGS}
              containerStyle={styles.containerStyle2}
              centerHeadingStyle={{
                fontSize: textScale(14),
                fontFamily: fontFamily.regular,
              }}
            // iconRight={imagePath.goRight}
            // rightIconStyle={{tintColor: colors.textGreyLight}}
            />
            {appData.profile.preferences.sos == 1 ? (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={showActionSheet}
                iconLeft={imagePath.icSos}
                centerHeading={strings.SOS}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ) : null}
            {!!userData?.auth_token &&
              Platform.OS === "android" &&
              !!appMainData?.is_admin ? (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={() => {
                  BluetoothManager.checkBluetoothEnabled().then(
                    (enabled) => {
                      if (Boolean(enabled)) {
                        navigation.navigate(navigationStrings.ATTACH_PRINTER);
                      } else {
                        BluetoothManager.enableBluetooth()
                          .then(() => {
                            navigation.navigate(
                              navigationStrings.ATTACH_PRINTER
                            );
                          })
                          .catch((err) => { });
                      }
                    },
                    (err) => {
                      err;
                    }
                  );
                }}
                iconLeft={imagePath.printer}
                centerHeading={strings.ATTACH_PRINTER}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            ) : null}

            {!!userData?.auth_token &&
              Platform.OS === "android" &&
              SunmiPrinter.hasPrinter &&
              __DEV__ &&
              (businessType == "taxi" ? null : (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={() => {
                    BluetoothManager.checkBluetoothEnabled().then(
                      (enabled) => {
                        if (Boolean(enabled)) {
                          navigation.navigate(
                            navigationStrings.ATTACH_PRINTER + "sunmi"
                          );
                        } else {
                          BluetoothManager.enableBluetooth()
                            .then(() => {
                              navigation.navigate(
                                navigationStrings.ATTACH_PRINTER + "sunmi"
                              );
                            })
                            .catch((err) => { });
                        }
                      },
                      (err) => {
                        err;
                      }
                    );
                  }}
                  iconLeft={imagePath.printer}
                  centerHeading={"Sunmi " + SunmiPrinter.printerModal}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />
              ))}

            {/* {!!userData?.auth_token && (
          <ListItemHorizontal
            centerContainerStyle={{flexDirection: 'row'}}
            leftIconStyle={{flex: 0.1, alignItems: 'center'}}
            iconLeft={imagePath.payment}
            centerHeading={strings.PAYMENTS}
            containerStyle={styles.containerStyle2}
            centerHeadingStyle={{fontSize: textScale(15)}}
            iconRight={imagePath.goRight}
            rightIconStyle={{tintColor: colors.textGreyLight}}
          />
        )} */}
            {!!userData?.auth_token && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={
                  appIds.hokitch == getBundleId()
                    ? () =>
                      Linking.openURL(
                        `https://api.whatsapp.com/send?phone=${contact_phone_number
                          ? contact_phone_number
                          : phone_number
                        }`
                      )
                    : moveToNewScreen(navigationStrings.CONTACT_US)
                }
                iconLeft={imagePath.contactUs}
                centerHeading={strings.CONTACT_US}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

            {!!userData?.auth_token && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={() => onStartSupportChat()}
                iconLeft={imagePath.support}
                centerHeading={strings.SUPPORT}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              // iconRight={imagePath.goRight}
              // rightIconStyle={{tintColor: colors.textGreyLight}}
              />
            )}

            {!!userData?.auth_token &&
              !!appMainData?.is_admin &&
              businessType != 4 && (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={moveToNewScreen(
                    navigationStrings.TABROUTESVENDORNEW
                  )}
                  iconLeft={imagePath.mystores2}
                  centerHeading={strings.MYSTORES}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                // iconRight={imagePath.goRight}
                // rightIconStyle={{tintColor: colors.textGreyLight}}
                />
              )}

            {!!userData?.auth_token && !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={() => goToChatRoom("agent_chat")}
                iconLeft={imagePath.icUserChat}
                centerHeading={"Driver Chat"}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              />
            )}

            {!!userData?.auth_token &&
              !!appMainData?.is_admin &&
              !!appData?.profile?.socket_url && (
                <ListItemHorizontal
                  centerContainerStyle={{ flexDirection: "row" }}
                  leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                  onPress={() => goToChatRoom("vendor_chat")}
                  iconLeft={imagePath.icUserChat}
                  centerHeading={"User Chat"}
                  containerStyle={styles.containerStyle2}
                  centerHeadingStyle={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                  }}
                />
              )}

            {!!userData?.auth_token && !!appData?.profile?.socket_url && (
              <ListItemHorizontal
                centerContainerStyle={{ flexDirection: "row" }}
                leftIconStyle={{ flex: 0.1, alignItems: "center" }}
                onPress={() => goToChatRoom("user_chat")}
                iconLeft={imagePath.icVendorChat}
                centerHeading={"Vendor Chat"}
                containerStyle={styles.containerStyle2}
                centerHeadingStyle={{
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                }}
              />
            )}

            {!!userData?.auth_token ? null : (
              <View style={styles.loginView}>
                <TouchableOpacity
                  // onPress={()=>actions.isVendorNotification(true)}
                  onPress={() => actions.setAppSessionData("on_login")}
                  style={styles.touchAbleLoginVIew}
                >
                  <Text style={styles.loginLogoutText}>{strings.LOGIN}</Text>
                  <Image
                    source={imagePath.rightBlue}
                    style={{
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.POLICE, strings.AMBULANCE, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => onSosButton(index)}
        />
      </View>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.POLICE, strings.AMBULANCE, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => onSosButton(index)}
      />
    </View>
  );
}
