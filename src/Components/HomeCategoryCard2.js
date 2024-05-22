import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import colors from "../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import { getImageUrl } from "../utils/helperFunctions";
import { SvgUri } from "react-native-svg";
import Elevations from "react-native-elevation";
//import { useDarkMode } from "react-native-dark-mode";
import { MyDarkTheme } from "../styles/theme";
import LinearGradient from "react-native-linear-gradient";

const HomeCategoryCard2 = ({
  data = {},
  onPress = () => {},
  isLoading = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    "160/160"
  );

  const isSVG = imageURI ? imageURI.includes(".svg") : null;

  const onLoad = (evl) => {};

  let imgHeight =
    appStyle?.homePageLayout === 5 ? moderateScale(80) : moderateScale(50);
  let imgWidth =
    appStyle?.homePageLayout === 5 ? moderateScale(80) : moderateScale(50);
  let imgRadius =
    appStyle?.homePageLayout === 5 ? moderateScale(40) : moderateScale(25);

  return (
    <LinearGradient
      colors={["rgba(100,183,236,0.46)", "#A4CD3E"]}
      style={{
        borderRadius: moderateScale(10),
        padding: moderateScale(8),
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: width / 4,
          height: width / 3.4,
        }}
      >
        <View
          style={{
            flex: 0.8,
            borderRadius: moderateScale(40),
            width: moderateScale(80),
            height: moderateScale(80),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isSVG ? (
            <SvgUri
              height={imgHeight}
              width={imgWidth}
              uri={imageURI}
              style={{}}
            />
          ) : (
            <View>
              <FastImage
                style={{
                  height: imgHeight,
                  width: imgWidth,
                  borderRadius: imgRadius,
                }}
                source={{
                  uri: imageURI,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode="cover"
                onLoad={onLoad}
              />
            </View>
          )}
        </View>
        <Text
          numberOfLines={2}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
            fontFamily: fontFamily.regular,
            fontSize: textScale(10),
            textAlign: "center",
            marginTop: moderateScaleVertical(4),
          }}
        >
          {data.name || data?.translation[0]?.name}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};
export default React.memo(HomeCategoryCard2);
const styles = StyleSheet.create({});
