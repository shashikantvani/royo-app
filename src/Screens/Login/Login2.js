import AsyncStorage from "@react-native-async-storage/async-storage";
import codes from "country-calling-code";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { Image, Platform, Text, View } from "react-native";
//import { useDarkMode } from "react-native-dark-mode";
import DeviceCountry from "react-native-device-country";
import DeviceInfo from "react-native-device-info";
import { useSelector } from "react-redux";
import GradientButton from "../../Components/GradientButton";
import PhoneNumberInput from "../../Components/PhoneNumberInput";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { showError } from "../../utils/helperFunctions";
import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from "../../utils/socialLogin";
import validator from "../../utils/validations";
import stylesFunc from "./styles2";
var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
  .then((result) => {
    // {"code": "BY", "type": "telephony"}
    getPhonesCallingCodeAndCountryData = codes.filter(
      (x) => x.isoCode2 == result.code.toUpperCase()
    );
  })
  .catch((e) => {
    console.log(e);
  });
// import {mobile} from 'is_js';
import { useNavigation } from "@react-navigation/native";
import RNOtpVerify from "react-native-otp-verify";
import BorderTextInputWithLable from "../../Components/BorderTextInputWithLable";
import { setUserData } from "../../utils/utils";

export default function Login2({ navigation }) {
  const navigation_ = useNavigation();
  const {
    appData,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const { apple_login, fb_login, twitter_login, google_login } = useSelector(
    (state) => state?.initBoot?.appData?.profile?.preferences
  );

//  const darkthemeusingDevice = useDarkMode();
 // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  var clonedState = {};

  const [state, setState] = useState({
    // email: '',
    password: "",
    isLoading: false,
    phoneInput: false,
    phoneNoVisibility: false,
    phoneNumber: "",
    email: {
      value: "",
      focus: true,
    },
    mobilNo: {
      phoneNo: "",
      callingCode:
        getPhonesCallingCodeAndCountryData &&
        getPhonesCallingCodeAndCountryData.length
          ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
          : appData?.profile.country?.phonecode
          ? appData?.profile?.country?.phonecode
          : "91",
      cca2:
        getPhonesCallingCodeAndCountryData &&
        getPhonesCallingCodeAndCountryData.length
          ? getPhonesCallingCodeAndCountryData[0].isoCode2
          : appData?.profile?.country?.code
          ? appData?.profile?.country?.code
          : "IN",
      focus: false,
      countryName: "",
      appHashKey: "WpV3+5pgxIH",
    },
  });

  const fontFamily = appStyle?.fontSizeData;
  //CLone deep all the states
  useEffect(() => {
    if (Platform.OS == "android") {
      RNOtpVerify.getHash()
        .then((res) => {
          updateState({
            appHashKey: res[0],
          });
        })
        .catch();
    }
    clonedState = cloneDeep(state);
  }, []);

  //Update states
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  //Styles in app
  const styles = stylesFunc({ themeColors, fontFamily });

  //all states used in this screen
  const {
    password,
    isLoading,
    phoneInput,
    phoneNoVisibility,
    mobilNo,
    email,
    number,
    appHashKey,
  } = state;

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };
  //On change textinput
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  //Validate form
  const isValidData = () => {
    const error = email.focus
      ? validator({ email: email.value, password })
      : validator({
          phoneNumber: mobilNo.phoneNo,
          callingCode: mobilNo.callingCode,
        });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const checkIfEmailVerification = (_data) => {
    if (
      !!_data?.client_preference?.verify_email &&
      !_data?.verify_details?.is_email_verified
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, _data)();
    } else {
      successLogin(_data);
    }
  };

  //Login api fucntion
  const _onLogin = async () => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");

    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
//    device_token: DeviceInfo.getUniqueId(),
    let data = {
      username: email.focus ? email.value : mobilNo.phoneNo,
      password: password,
      device_type: Platform.OS,
      device_token: 'test',
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      dialCode: mobilNo.focus ? mobilNo.callingCode : "",
      countryData: mobilNo.focus ? mobilNo.cca2 : "",
      app_hash_key: appHashKey,
    };
    updateState({ isLoading: true });
    console.log("chck login data >>>", data);
    actions
      .loginUsername(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log("login via user name", res);
        if (!!res.data) {
          if (res?.data?.is_phone) {
            navigation.navigate(navigationStrings.OTP_VERIFICATION, {
              username: mobilNo?.phoneNo,
              dialCode: mobilNo?.callingCode,
              countryData: mobilNo?.cca2,
              data: res.data,
            });
          } else {
            checkIfEmailVerification(res.data);
          }
        }
        updateState({ isLoading: false });
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Get your cart detail
  const getCartDetail = () => {
    actions
      .getCartDetail(
        "",
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        actions.cartItemQty(res);
      })
      .catch((error) => {});
  };
  //Error handling in api
  const errorMethod = (error) => {
    console.log(error, "errorrrrr");
    updateState({ isLoading: false });
    setTimeout(() => {
      showError(error?.message || error?.error);
    }, 500);
  };

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    let data = {};
    data["name"] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName;
    data["auth_id"] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data["phone_number"] = "";
    data["email"] = socialLoginData?.email;
    data["device_type"] = Platform.OS;
    data["device_token"] = DeviceInfo.getUniqueId();
    data["fcm_token"] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();

    let query = "";
    if (
      type == "facebook" ||
      type == "twitter" ||
      type == "google" ||
      type == "apple"
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, "res>>>SOCIAL");
        updateState({ isLoading: false });

        if (!!res.data) {
          checkEmailPhoneVerified(res?.data);
          getCartDetail();
        }
      })
      .catch(errorMethod);
  };

  const checkEmailPhoneVerified = (data) => {
    if (
      !!(
        !!data?.client_preference?.verify_email &&
        !data?.verify_details?.is_email_verified
      ) ||
      !!(
        !!data?.client_preference?.verify_phone &&
        !data?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, data)();
    } else {
      successLogin(data);
    }
  };

  const successLogin = (data) => {
    if (!!data) {
      setUserData(data).then((suc) => {
        actions.saveUserData(data);
      });
    }
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({ isLoading: false });
    handleAppleLogin()
      .then((res) => {
        _saveSocailLogin(res, "apple");
        // updateState({isLoading: false});
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({ isLoading: true });
    googleLogin()
      .then((res) => {
        if (res?.user) {
          console.log(res, "googlegooogle");
          _saveSocailLogin(res.user, "google");
        } else {
          updateState({ isLoading: false });
        }
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };

  const _responseInfoCallback = (error, result) => {
    updateState({ isLoading: true });
    if (error) {
      updateState({ isLoading: false });
    } else {
      if (result && result?.id) {
        console.log(result, "fbresult");
        _saveSocailLogin(result, "facebook");
      } else {
        updateState({ isLoading: false });
      }
    }
  };
  //FacebookLogin
  const openFacebookLogin = () => {
    fbLogin(_responseInfoCallback);
  };

  //twitter login
  const openTwitterLogin = () => {
    _twitterSignIn()
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, "twitter");
        }
      })
      .catch((err) => {});
  };
  const _onCountryChange = (data) => {
    updateState({
      mobilNo: {
        phoneNo: mobilNo.phoneNo,
        cca2: data.cca2,
        callingCode: data.callingCode.toString(),
        focus: true,
      },
      // cca2: data.cca2,
      // callingCode: data.mobilNo.callingCode[0],
    });
    return;
  };

  /*************************** Check Input Handler */
  const checkInputHandler = (data = "") => {
    let re = /^[0-9]{1,45}$/;
    let c = re.test(data);

    if (c) {
      updateState({
        phoneInput: true,
        mobilNo: {
          ...mobilNo,
          phoneNo: data,
          focus: true,
        },
        email: {
          ...email,
          focus: false,
        },
      });
    } else {
      updateState({
        phoneInput: false,
        email: {
          value: data,
          focus: true,
        },
        mobilNo: {
          ...mobilNo,
          focus: false,
        },
      });
    }
  };

  /*************************** On Text Change
   */ const textChangeHandler = (type, data, value = "value") => {
    updateState((preState) => {
      return {
        [type]: {
          ...preState[type],
          [value]: data,
        },
      };
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 0.4,
          backgroundColor: "#F5F6F7",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={imagePath.icLogobigFab} />
      </View>
      <View
        style={{
          flex: 0.65,
          borderTopRightRadius: moderateScale(15),
          borderTopLeftRadius: moderateScale(15),
          marginTop: -15,
          backgroundColor: colors.white,
          paddingHorizontal: moderateScale(16),
          paddingTop: moderateScaleVertical(60),
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(18),
            marginBottom: moderateScaleVertical(30),
          }}
        >
          Login
        </Text>

        {!phoneInput && (
          <>
            <BorderTextInputWithLable
              label={"EMAIL ID/ PHONE NUMBER"}
              onChangeText={(data) => checkInputHandler(data)}
              value={email.value}
              keyboardType={"email-address"}
              autoCapitalize={"none"}
              autoFocus={true}
              returnKeyType={"next"}
              labelStyle={{
                fontSize: textScale(12),
                color: "#979797",
                fontFamily: fontFamily.regular,
              }}
            />
            <BorderTextInputWithLable
              onChangeText={_onChangeText("password")}
              label={"PASSWORD"}
              value={password}
              labelStyle={{
                fontSize: textScale(12),
                color: "#979797",
                fontFamily: fontFamily.regular,
              }}
              // returnKeyType={'next'}
            />
          </>
        )}
        {phoneInput && (
          <View style={{ marginBottom: moderateScale(18) }}>
            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              onChangePhone={(data) => checkInputHandler(data)}
              cca2={mobilNo.cca2}
              phoneNumber={mobilNo.phoneNo}
              callingCode={mobilNo.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={"phone-pad"}
              color={isDarkMode ? MyDarkTheme.colors.text : null}
              autoFocus={true}
            />
          </View>
        )}

        <GradientButton
          containerStyle={{ marginTop: moderateScaleVertical(40) }}
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          onPress={_onLogin}
          btnText={"Login"}
          textStyle={{
            textTransform: "none",
            fontSize: textScale(14),
          }}
        />

        <View style={styles.bottomContainer}>
          <Text
            style={{
              ...styles.txtSmall,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.textGreyLight,
            }}
          >
            {strings.DONT_HAVE_ACCOUNT}
            <Text
              onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
              style={{
                fontFamily: fontFamily.bold,
                color: "#A3CD3D",
                fontSize: textScale(12),
              }}
            >
              {" "}
              {strings.SIGN_UP}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
