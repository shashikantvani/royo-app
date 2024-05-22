import React from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useDarkMode } from "react-native-dark-mode";
import FastImage from "react-native-fast-image";
import { useSelector } from "react-redux";
import imagePath from "../constants/imagePath";
import strings from "../constants/lang";
import colors from "../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import { MyDarkTheme } from "../styles/theme";
import { currencyNumberFormatter } from "../utils/commonFunction";
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from "../utils/helperFunctions";

const ProductsComp = ({ isDiscount, item, imageStyle, onPress = () => {} }) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const { themeColors, appStyle, currencies, appData } = useSelector(
    (state) => state?.initBoot
  );
  const fontFamily = appStyle?.fontSizeData;

  const scaleInAnimated = new Animated.Value(0);

  const {
    translation = [],
    category = {},
    media = [],
    vendor = {},
    variant = [],
  } = item;
  const imageUrl = getImageUrl(
    media[0]?.image?.path?.image_fit,
    media[0]?.image?.path?.image_path,
    "600/600"
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: width / 2.5,
        ...getScaleTransformationStyle(scaleInAnimated),
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
    >
      <FastImage
        source={{
          uri: imageUrl,
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={{
          height: moderateScale(180),
          width: width / 2.5,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.blackOpacity20,
          borderTopLeftRadius: moderateScale(8),
          borderTopRightRadius: moderateScale(8),
          ...imageStyle,
        }}
        imageStyle={{
          borderRadius: moderateScale(10),
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}
      >
        {!!item?.averageRating && item?.averageRating !== "0.0" && (
          <View style={styles.hdrRatingTxtView}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}
            >
              {Number(item?.averageRating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
      </FastImage>
      <View style={{ marginVertical: moderateScaleVertical(6) }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: "left",
            lineHeight: moderateScale(16),
          }}
        >
          {translation[0]?.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            marginVertical: moderateScaleVertical(4),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            textAlign: "left",
          }}
        >
          {vendor?.name}
        </Text>
        {!isDiscount ? (
          <View style={{ flex: 1 }}>
            {category?.category_detail?.translation[0]?.name && (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.inTextStyle,
                  fontFamily: fontFamily.regular,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity30,
                  fontSize: textScale(12),
                }}
              >
                {strings.IN} {category?.category_detail?.translation[0]?.name}
              </Text>
            )}

            <Text
              numberOfLines={1}
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.bold,
                color: isDarkMode ? MyDarkTheme.colors.text : "#489F22",
              }}
            >
              <Text>
                {`${
                  currencies?.primary_currency?.symbol
                } ${currencyNumberFormatter(
                  Number(variant[0]?.price),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
              </Text>
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={{
                ...styles.inTextStyle,
                fontFamily: fontFamily.regular,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity66,
              }}
            >
              {strings.IN} {category?.category_detail?.translation[0]?.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.green,
                  marginVertical: moderateScaleVertical(8),
                }}
              >
                {currencies?.primary_currency.symbol} {variant[0]?.price}
              </Text>
              <Text
                style={{
                  textDecorationLine: "line-through",
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                  marginLeft: moderateScale(12),
                }}
              >
                {currencies?.primary_currency.symbol} {variant[0]?.price}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hdrRatingTxtView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(2),
    paddingHorizontal: moderateScale(4),
    alignSelf: "flex-start",
    borderRadius: moderateScale(2),
    marginTop: moderateScaleVertical(16),
    backgroundColor: "#F79738",
  },
  ratingTxt: {
    textAlign: "left",
    color: colors.white,
    fontSize: textScale(9),
    textAlign: "left",
  },
  starImg: {
    tintColor: colors.white,
    marginLeft: 2,
    width: 9,
    height: 9,
  },
  inTextStyle: {
    fontSize: textScale(9),
    width: width / 3,
    textAlign: "left",
  },
});

export default React.memo(ProductsComp);
