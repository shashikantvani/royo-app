import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Image, Linking, Text, View } from "react-native";
//import { useDarkMode } from "react-native-dark-mode";
import { getBundleId } from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { MaterialIndicator } from "react-native-indicators";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob-v2";
import ButtonWithLoader from "../../Components/ButtonWithLoader";
import { loaderOne } from "../../Components/Loaders/AnimatedLoaderFiles";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import * as NavigationService from "../../navigation/NavigationService";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import store from "../../redux/store";
import colors from "../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";
import {
  getImageUrl,
  getUrlRoutes,
  showError,
} from "../../utils/helperFunctions";
import { getItem, setItem } from "../../utils/utils";
import styles from "./styles";

const fs = RNFetchBlob.fs;

export default function ShortCode({ route, navigation }) {
  const shortCodeParam = route?.params?.shortCodeParam;

  console.log(shortCodeParam, "shortCodeParam>>>");

  const [state, setState] = useState({
    email: "",
    password: "",
    shortCode: "806be0",
    isShortcodePrefilled: true,
    isBtnDisabled: true,
    isLoading: false,
    changeInShortCode: false,
    LoadingScreen: true,
    videoDurationEnded: false,
    allAppData: null,
    initapiresponse: false,
  });
  const { dispatch } = store;

  const {
    shortCode,
    changeInShortCode,
    isBtnDisabled,
    isLoading,
    isShortcodePrefilled,
    LoadingScreen,
    videoDurationEnded,
    allAppData,

    initapiresponse,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot
  );
  const { userData, appSessionInfo } = useSelector((state) => state.auth);
  const { themeColors } = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  //const darkthemeusingDevice = useDarkMode();
  //const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;

  const customColor = themeColors.primary_color;

  useEffect(() => {
    (async () => {
      const saveShortCode = await getItem("saveShortCode");
      switch (getBundleId()) {
        case appIds.fawaz:
          updateState({
            shortCode: shortCodes.fawaz,
            isShortcodePrefilled: true,
          });
          break;
      }
    })();
  }, []);

  useEffect(() => {
    console.log(shortCode, "short code");
    console.log(isShortcodePrefilled, "isShortcodePrefilled");
    if (shortCode && isShortcodePrefilled) {
      checkScreen();
    }
  }, [shortCode, isShortcodePrefilled]);

  useEffect(() => {
    console.log(videoDurationEnded,'videoDurationEnded')
    console.log(initapiresponse,'initapiresponse')
    if (videoDurationEnded && initapiresponse) {
      navigateToNextScreen(allAppData);
    }
  }, [videoDurationEnded, initapiresponse]);

  const checkScreen = () => {
    initApiHit();
    updateState({ isShortcodePrefilled: true });
  };

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  //i did added in this fun signup page replace with tabroutes
  const _onSubmitShortCode = () => {
    updateState({ isLoading: true });
    setTimeout(() => {
      initApiHit();
    }, 1000);
  };

  const initApiHit = async () => {
    const res = await getItem("setPrimaryLanguage");

    let header = {};

    if (!!res?.primary_language?.id) {
      header = {
        // code: "245bae",
        code: shortCode,
        language: res?.primary_language?.id,
      };
    } else {
      header = {
        // code: "245bae",
        code: shortCode,
      };
    }
    // console.log(header, "header*******");
    actions
      .initApp({}, header, false, null, null, true)
      .then((res) => {
        // console.log(res, "<====headerResponse");
        if (res.data.mobile_banners.length > 0) {
          let preLoadBanners = res.data.mobile_banners.map((item, inx) => {
            return {
              uri: getImageUrl(
                item.image.image_fit,
                item.image.image_path,
                "800/600"
              ),
            };
          });
          FastImage.preload(preLoadBanners); //preload banners
        }
        if (res.data.dynamic_tutorial.length > 0) {
          let preLoadTutorial = res.data.dynamic_tutorial.map((el, inx) => {
            return {
              uri: `${el.file_name.image_fit}800/1600${el.file_name.image_path}`,
            };
          });
          FastImage.preload(preLoadTutorial); //preload tutorial images
        }

        updateState({ changeInShortCode: false });
        if (getBundleId() == appIds.royoorder) {
          actions.saveShortCode(shortCode);
        }

        if (
          getBundleId() == (appIds.masa || appIds.iPicknDrop || appIds.muvpod)
        ) {
          updateState({
            isLoading: false,
            LoadingScreen: false,
            allAppData: res,
            initapiresponse: true,
          });
        } else {
          updateState({ isLoading: false, LoadingScreen: false });
          navigateToNextScreen(res);
        }
      })
      .catch((error) => {
        // console.log(error, "error>>>>>error");
        updateState({
          isLoading: false,
          changeInShortCode: false,
          shortCode: "",
        });
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };
  async function handleDynamicLink(deepLinkUrl) {
    if (deepLinkUrl != null) {
      setItem("deepLinkUrl", deepLinkUrl);
      let routeName = getUrlRoutes(deepLinkUrl, 1);
      var data = deepLinkUrl?.split("=").pop();
      console.log("checking deep link data >>> ", data);
      let removePer = decodeURI(data);
      let sendingData = JSON.parse(removePer);

      let decodedUri = decodeURI(deepLinkUrl);
      let vendorName = decodedUri.split("?")[1].split("&")[1].split("=")[1];
      let vendorId = decodedUri.split("?")[1].split("&")[0].split("=")[1];

      // return;
      setTimeout(() => {
        NavigationService.navigate(navigationStrings.TAB_ROUTES, {
          screen: navigationStrings.HOMESTACK,
          params: {
            screen: navigationStrings.PRODUCT_LIST,
            params: {
              data: {
                category_slug: "Restaurants",
                id: vendorId,
                name: vendorName,
                vendor: true,
                table_id: sendingData,
              },
            },
          },
        });
      }, 1800);
    } else {
      actions.setAppSessionData("guest_login");
    }
  }

  const handleNotiRedirectionForVendorApp = (deepLinkUrl) => {
    if (deepLinkUrl != null) {
      navigation.navigate(navigationStrings.TABROUTESVENDORNEW, {
        screen: navigationStrings.ROYO_VENDOR_ORDER,
        params: { index: 1 },
      });
    } else {
      navigation.navigate(navigationStrings.TABROUTESVENDORNEW);
    }
  };

  const navigateToNextScreen = (res) => {
    // return;

    getItem("firstTime").then((el) => {
      if (!el && !isEmpty(res?.data?.dynamic_tutorial)) {
        actions.setAppSessionData("app_intro");
      } else {
        Linking.getInitialURL()
          .then((link) => {
            handleDynamicLink(link);
          })
          .catch((err) => {
            console.log("checking deep link> >> 3232sdsd", err);
          });
      }
    });
  };

  const onOtpInput = (code) => {
    (async () => {
      updateState({
        isLoading: true,
        shortCode: code,
        changeInShortCode: true,
      });
    })();
  };

  useEffect(() => {
    (async () => {
      if (changeInShortCode) {
        const saveShortCode = await getItem("saveShortCode");
        if (saveShortCode && shortCode != saveShortCode) {
          actions.userLogout();
          actions.cartItemQty("");
          actions.saveAddress(null);
          actions.saveAllUserAddress([]);
        }
        initApiHit();
      }
    })();
  }, [changeInShortCode]);

  useEffect(() => {
    if (shortCode?.length === 6) {
      updateState({ isBtnDisabled: false });
    } else {
      updateState({ isBtnDisabled: true });
    }
  }, [shortCode, isLoading]);

  const _renderSplash = () => {
    switch (getBundleId()) {
      case appIds.masa:
        return animatedSplash();
      case appIds.iPicknDrop:
        return animatedSplash();
      case appIds.muvpod:
        return animatedSplash();
      default:
        return imageSplash();
    }
  };
  const imageSplash = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            position: "absolute",
            zIndex: 99,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ position: "absolute", bottom: moderateScale(100) }}>
            {LoadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{ uri: "Splash" }} style={{ flex: 1, zIndex: -1 }} />
      </View>
    );
  };

  const animationVideo = () => {
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
      // case appIds?.iPicknDrop:
      //   return imagePath.ipd;
      case appIds?.muvpod:
        return imagePath.muvpod;
      // case appIds?.sabroson:
      //   return imagePath.sabroson
    }
  };

  const onVideoDurationEnded = () => {
    navigateToNextScreen(allAppData);
    // updateState({
    //   videoDurationEnded: true,
    // });
  };

  const animatedSplash = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <Video
          source={animationVideo()} // Can be a URL or a local file.
          style={{
            height: width,
            width: width,
          }}
          resizeMode={getBundleId() == appIds.muvpod ? "contain" : "cover"}
          onEnd={() => onVideoDurationEnded()}
        />
      </View>
    );
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
      {isShortcodePrefilled ? (
        _renderSplash()
      ) : (
        <WrapperContainer
          statusBarColor={colors.white}
          bgColor={colors.white}
          isLoadingB={isLoading}
          source={loaderOne}
        >
          <View
            style={{
              paddingHorizontal: moderateScale(24),
              flex: 1,
              marginTop: width / 3,
            }}
          >
            <Image style={{ alignSelf: "center" }} source={imagePath.logo} />
            <View style={{ height: moderateScaleVertical(50) }} />
            <Text style={styles.enterShortCode}>
              {strings.ENTER_SHORT_CODE}
            </Text>
            <View style={{ height: 10 }} />
            <Text style={styles.enterShortCode2}>
              {strings.ENTERSHORTCODEBELOW}
            </Text>

            <View style={{ height: 10 }} />
            <SmoothPinCodeInput
              containerStyle={{ alignSelf: "center" }}
              password
              mask={
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 25,
                    backgroundColor: "blue",
                  }}
                ></View>
              }
              cellSize={width / 10}
              codeLength={6}
              cellSpacing={10}
              editable={true}
              cellStyle={{
                borderBottomWidth: 1,
                borderColor: "gray",
              }}
              cellStyleFocused={{
                borderColor: "black",
              }}
              textStyle={{
                fontSize: 24,
                color: colors.textBlue,
              }}
              textStyleFocused={{
                color: colors.textBlue,
              }}
              inputProps={{
                autoCapitalize: "none",
              }}
              value={shortCode}
              autoFocus={false}
              keyboardType={"default"}
              onTextChange={(shortCode) => updateState({ shortCode })}
              onFulfill={(code) => onOtpInput(code)}
            />

            <View style={{ height: 20 }} />

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <ButtonWithLoader
                color={colors.black}
                disabled={isBtnDisabled}
                btnStyle={{
                  ...styles.guestBtn,
                  ...{
                    backgroundColor: isBtnDisabled
                      ? colors.blueBackGroudB
                      : colors.blueBackGroudB,
                  },
                }}
                onPress={_onSubmitShortCode}
                btnText={strings.SUBMIT}
                btnTextStyle={{
                  color: isBtnDisabled ? colors.white : colors.white,
                }}
              />
            </View>

            <View style={{ height: 20 }} />
          </View>
        </WrapperContainer>
      )}
    </View>
  );
}
