import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import imagePath from "../../../constants/imagePath";
import navigationStrings from "../../../navigation/navigationStrings";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../styles/responsiveSize";
import { getImageUrl } from "../../../utils/helperFunctions";
import stylesFunc from "../styles";

import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
// import { useDarkMode } from "react-native-dark-mode";
import CustomAnimatedLoader from "../../../Components/CustomAnimatedLoader";
import DeliveryTypeComp from "../../../Components/DeliveryTypeComp";
import {
  loaderOne,
  voiceListen,
} from "../../../Components/Loaders/AnimatedLoaderFiles";
import strings from "../../../constants/lang";
import { MyDarkTheme } from "../../../styles/theme";
import CategoryLoader2 from "../../../Components/Loaders/CategoryLoader2";

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => {},
  isVoiceRecord = false,
  _onVoiceStop = () => {},
  showAboveView = true,
}) {
  const navigation = useNavigation();

  const {
    appData,
    themeColors,
    appStyle,

    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const imageURI = getImageUrl(
    profileInfo?.logo?.image_fit,
    profileInfo?.logo?.image_path,
    "600/600"
  );

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 0.45 }}
      ></ScrollView>
    );
  }

  return (
    <ImageBackground
      source={imagePath.icBannerFab}
      style={{
        flex: 0.45,
      }}
    >
      <View
        style={{
          ...styles.headerContainer,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            alignItems: "center",
          }}
        >
          {!!(profileInfo && profileInfo?.logo) ? (
            <FastImage
              style={{
                width: moderateScale(width / 4),
                height: moderateScale(50),
              }}
              resizeMode={FastImage.resizeMode.contain}
              source={{
                uri: imageURI,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
            />
          ) : null}

          {!!appData?.profile?.preferences?.is_hyperlocal && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate(navigationStrings.LOCATION, {
                  type: "Home1",
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 0.85,
                marginLeft: moderateScale(8),
              }}
            >
              <Image
                style={styles.locationIcon}
                source={imagePath.icLocationFab}
                resizeMode="contain"
              />
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.locationTxt,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.white,
                      fontFamily: fontFamily.medium,
                    },
                  ]}
                >
                  {location?.address}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={{
          marginTop: "auto",
          marginBottom: moderateScaleVertical(25),
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.medium,
            fontSize: textScale(20),
            color: colors.white,
            width: width / 1.8,
            marginLeft: moderateScale(25),
            marginTop: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(15),
          }}
        >
          Get your services done without any hassel
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            height: moderateScaleVertical(45),
            // backgroundColor: colors.white,

            backgroundColor:isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white ,

            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: moderateScale(20),
            borderRadius: moderateScale(10),
            paddingHorizontal: moderateScale(15),
          }}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
        >
          <Image
            style={{
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            source={imagePath.search1}
          />
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              color: isDarkMode ? colors.textGreyB : "#4D4D4D",
              opacity: 0.4,
              marginLeft: moderateScale(15),
            }}
          >
            Search for service here….
          </Text>
        </TouchableOpacity>
      </View>
      {/* <DeliveryTypeComp selectedToggle={selcetedToggle} /> */}

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle={strings.LOADING}
        containerColor={
          isDarkMode ? MyDarkTheme.colors.lightDark : colors.white
        }
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={isLoadingB}
      />
    </ImageBackground>
  );
}
