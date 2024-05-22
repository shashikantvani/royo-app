import { string } from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import FastImage from "react-native-fast-image";
import { UIActivityIndicator } from "react-native-indicators";
import LinearGradient from "react-native-linear-gradient";
import StarRating from "react-native-star-rating";
import { useSelector } from "react-redux";
import imagePath from "../constants/imagePath";
import strings from "../constants/lang";
import colors from "../styles/colors";
import commonStylesFunc, { hitSlopProp } from "../styles/commonStyles";
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
  pressInAnimation,
  pressOutAnimation,
} from "../utils/helperFunctions";

let numberOfHits = [];
let heightOfEveryView = 0;

const ProductCard3 = ({
  data = {},
  onPress = () => {},
  addToCart = () => {},
  index,
  onIncrement,
  onDecrement,
  selectedItemID,
  Servicetype,
  isVisibleModal,
  selectedItemIndx,
  btnLoader,
  categoryInfo = "",
  businessType,
  animateText = 0,
  section = {},
}) => {
  // data['qty'] = 1
  const [isAdd, setAdd] = useState(false);
  const [state, setState] = useState({
    selectedIndex: -1,
    selectedIndexForCartIcon: -1,
    isVisibleTextSlideUp: false,
    qtyText: "1",
    isVisibleText: true,
    disabledBtn: false,
    isIncrement: true,
  });
  const {
    selectedIndex,
    selectedIndexForCartIcon,
    isVisibleText,
    qtyText,
    isVisibleTextSlideUp,
    disabledBtn,
    isIncrement,
  } = state;

  var totalProductQty = 0;
  if (data?.check_if_in_cart_app) {
    data?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const { appStyle, themeColors, appData } = useSelector(
    (state) => state?.initBoot
  );

  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({ themeColors, fontFamily });

  const { themeLayouts } = currentTheme;
  const commonStyles = commonStylesFunc({ fontFamily });

  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = (quality) => getImageUrl(url1, url2, quality);
  const getIconImage = (url1, url2, quality) =>
    getImageUrl(url1, url2, quality);

  const scaleInAnimated = new Animated.Value(0);

  const changePosition = () => {
    let i = selectedIndex == -1 ? index : -1;
    updateState({ selectedIndex: i });
  };

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [totalProductQty]);

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [data?.qty]);

  const changePositionForCartIcon = () => {
    let i = selectedIndexForCartIcon == -1 ? index : -1;
    updateState({ selectedIndexForCartIcon: i });
  };

  const textAnimateForIncrement = {
    0: {
      top: 0,
    },
    0.5: {
      top: -3,
      height: 20,
    },
    1: {
      top: -50,
      height: 20,
    },
  };

  const textAnimateForIncrement_ = {
    0: {
      top: 50,
      height: 0,
    },
    0.5: {
      top: 30,
      height: 0,
    },
    1: {
      top: 9,
      height: 20,
    },
  };

  const textAnimateForDecrement = {
    0: {
      top: 9,
      height: 0,
    },
    0.5: {
      top: 20,
      height: 0,
    },
    1: {
      top: 35,
      height: 20,
    },
  };

  const textAnimateForDecrement_ = {
    0: {
      top: -50,
      height: 0,
    },
    0.5: {
      top: -3,
      height: 0,
    },
    1: {
      top: 9,
      height: 20,
    },
  };

  const initAnimation = async () => {
    updateState({ disabledBtn: true });
    // console.log("checking text >>>>", numberOfHits[0]);
    updateState({ isVisibleTextSlideUp: true });
    updateState({ qtyText: Number(numberOfHits[0]) + 1 });

    await setTimeout(() => {
      updateState({ isVisibleText: false, isVisibleTextSlideUp: false });
      updateState({ isVisibleText: true });
    }, 250);
    await setTimeout(() => {
      numberOfHits.shift();
    }, 200);
    setTimeout(() => {
      if (numberOfHits.length > 0) {
        initAnimation();
      }
    }, 800);
    setTimeout(() => {
      updateState({ disabledBtn: false });
    }, 300);

    return;
    numberOfHits.forEach((el, index) => {
      // console.log("checking text >>>>", el);
      updateState({ isVisibleTextSlideUp: true });
      updateState({ qtyText: el });

      setTimeout(() => {
        updateState({ isVisibleText: false });
        updateState({ isVisibleText: true });
        updateState({ isVisibleTextSlideUp: false });
      }, 500);
      if (numberOfHits.length === index + 1) {
        numberOfHits = [];
      }
    });
  };

  const onIncrementQty = () => {
    setAdd(true);
    // console.log("data", data);
    if (
      !!categoryInfo?.is_vendor_closed &&
      categoryInfo?.closed_store_order_scheduled !== 1
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    if (
      (!!data?.add_on_count && data?.add_on_count !== 0) ||
      (!!data?.variant_set_count && data?.variant_set_count !== 0)
    ) {
      onIncrement();
    } else {
      updateState({ ...state, isIncrement: true });
      // if (!disabledBtn) {
      //   const isEnabled = numberOfHits.length === 0;
      //   numberOfHits.push(data?.qty || totalProductQty);
      //   if (isEnabled) {
      //     initAnimation();
      //   }
      // }
      onIncrement();
    }
  };
  // console.log();
  const onDecrementQty = () => {
    setAdd(false);
    if (
      (!!data?.add_on_count && data?.add_on_count !== 0) ||
      (!!data?.variant_set_count && data?.variant_set_count !== 0)
    ) {
      onDecrement();
    } else {
      updateState({ ...state, isIncrement: false });
      // if (!disabledBtn) {
      //   const isEnabled = numberOfHits.length === 0;
      //   numberOfHits.push(data?.qty || totalProductQty);
      //   if (isEnabled) {
      //     initAnimation();
      //   }
      // }
      onDecrement();
    }
  };

  let typeId = data?.category_id;
  return (
    <View pointerEvents={btnLoader ? "none" : "auto"} style={{ flex: 1 }}>
      <TouchableOpacity
        // disabled
        activeOpacity={0.6}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          flexDirection: "row",
          marginVertical: moderateScaleVertical(10),
          paddingHorizontal: moderateScale(16),
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          //first section
          style={{
            alignItems: "center",
          }}
        >
          {!!url1 ? (
            <FastImage
              style={{
                ...styles.imgStyle,
              }}
              source={{
                uri: getImage("200/200"),
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
            />
          ) : null}
        </View>

        <View
          //second section
          style={{
            flex: 0.9,
            marginLeft: moderateScale(15),
          }}
        >
          {/* Title View */}
          <View style={{}}>
            {data && !!data?.tags && data?.tags.length > 0 ? (
              <View>
                {!!data.tags[0]?.tag?.icon ? (
                  <Image
                    source={{
                      uri: getIconImage(
                        data.tags[0]?.tag?.icon?.image_fit,
                        data?.tags[0]?.tag?.icon?.image_path,
                        "50/50"
                      ),
                    }}
                    style={{
                      marginLeft: moderateScale(1),
                      marginBottom: moderateScale(5),
                      width: moderateScale(17),
                      height: moderateScale(17),
                    }}
                  />
                ) : null}
              </View>
            ) : null}
            <Text
              // numberOfLines={1}
              style={{
                ...commonStyles.futuraBtHeavyFont14,
                // width: moderateScaleVertical(220),
                // fontFamily: 'Eina02-SemiBold',
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.regular,
                fontSize: textScale(12),
                width: width / 2.5,
                textTransform: "capitalize",
                // flex:1
              }}
            >
              {data?.translation[0]?.title || data?.title || data?.sku}
            </Text>
            {data?.vendor?.name && (
              <Text
                style={{
                  fontSize: textScale(9),
                  color: colors.grayOpacity51,
                  marginVertical: moderateScaleVertical(4),
                }}
              >
                {data?.vendor?.name}
              </Text>
            )}
            {!!section?.title ? (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.inTextStyle,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                }}
              >
                {strings.IN}
                {` ${data?.title}`}
              </Text>
            ) : null}
          </View>

          {/* Price view */}
          <View
            style={{
              paddingTop: moderateScale(5),
              paddingBottom: moderateScale(5),
              flexDirection: "row",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.mediumFont14,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontSize: textScale(12),
                fontFamily: fontFamily.regular,
              }}
            >
              {`${
                currencies?.primary_currency?.symbol
              } ${currencyNumberFormatter(
                // Number(data?.variant_multiplier) *
                Number(data?.variant[0]?.price),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
            </Text>
            {Number(data?.variant[0]?.compare_at_price) >
              Number(data?.variant[0]?.price) && (
              <Text
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.redB,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                  textDecorationLine: "line-through",
                  marginHorizontal: moderateScale(8),
                }}
              >
                {`${
                  currencies?.primary_currency?.symbol
                } ${currencyNumberFormatter(
                  // Number(data?.variant_multiplier) *
                  Number(data?.variant[0]?.compare_at_price),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
              </Text>
            )}
          </View>
          <View>
            {!!data?.translation_description ||
            !!data?.translation[0]?.translation_description ? (
              <View style={{}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: textScale(10),
                    fontFamily: fontFamily.regular,
                    lineHeight: moderateScale(14),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity66,
                    textAlign: "left",
                  }}
                >
                  {!!data?.translation_description
                    ? data?.translation_description.toString()
                    : !!data?.translation[0]?.translation_description
                    ? data?.translation[0]?.translation_description
                    : ""}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View
          // third section
          style={{ flex: 0.4, alignItems: "center" }}
        >
          {data?.has_inventory == 0 ||
          !!data?.variant[0]?.quantity ||
          (!!typeId && typeId == 8) ||
          (!!businessType && businessType == "laundry") ? (
            <View
              style={{
                alignItems: "center",
              }}
            >
              {(!!data?.check_if_in_cart_app &&
                data?.check_if_in_cart_app.length > 0) ||
              !!data?.qty ||
              totalProductQty ? (
                <LinearGradient
                  colors={["rgba(100,183,236,0.46)", "#A4CD3E"]}
                  style={{
                    ...styles.addBtnStyle,
                    paddingVertical: 0,

                    borderRadius: moderateScale(8),
                    paddingHorizontal: moderateScale(6),
                  }}
                >
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}
                    onPress={onIncrementQty}
                    style={{
                      marginVertical: moderateScaleVertical(13),
                    }}
                  >
                    <Image
                      style={{
                        tintColor: colors.white,
                      }}
                      source={imagePath.icAdd4}
                    />
                  </TouchableOpacity>
                  <Animatable.View>
                    {selectedItemID == data?.id && btnLoader ? (
                      <ActivityIndicator
                        size={10}
                        color={colors.white}
                        style={{
                          marginHorizontal: moderateScale(7),
                          marginVertical: 5,
                        }}
                      />
                    ) : (
                      <Animatable.View style={{ overflow: "hidden" }}>
                        {isVisibleText ? (
                          <Animatable.Text
                            // key={String(animateText)}

                            // animation={isAdd ? 'slideInUp' : 'slideInDown'}
                            // easing={'ease-out-sine'}
                            // animation={
                            //   isIncrement
                            //     ? isVisibleTextSlideUp
                            //       ? textAnimateForIncrement
                            //       : textAnimateForIncrement_
                            //     : isVisibleTextSlideUp
                            //     ? textAnimateForDecrement
                            //     : textAnimateForDecrement_
                            // }
                            duration={200}
                            // delay={200}
                            numberOfLines={2}
                            style={{
                              fontFamily: fontFamily.bold,
                              fontSize: moderateScale(15),
                              color: colors.white,
                              marginHorizontal: moderateScale(8),
                            }}
                          >
                            {/* {qtyText || data?.qty || totalProductQty} */}
                            {qtyText}
                          </Animatable.Text>
                        ) : null}
                      </Animatable.View>
                    )}
                  </Animatable.View>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    onPress={onDecrementQty}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}
                    style={{
                      marginVertical: moderateScaleVertical(13),
                    }}
                  >
                    <Image
                      style={{
                        tintColor: colors.white,
                      }}
                      source={imagePath.icMinus2}
                    />
                  </TouchableOpacity>
                </LinearGradient>
              ) : (
                <>
                  <TouchableOpacity
                    // hitSlopProp={hitSlopProp}
                    disabled={selectedItemID == data?.id}
                    onPress={addToCart}
                  >
                    {selectedItemID == data?.id ? (
                      <ActivityIndicator
                        size={10}
                        color={themeColors.primary_color}
                        style={{
                          marginHorizontal: moderateScale(8),
                        }}
                      />
                    ) : (
                      <View>
                        <Image source={imagePath.icAddFab} />
                      </View>
                    )}

                    {/* <Image source={imagePath.greyRoundPlus} /> */}
                  </TouchableOpacity>
                </>
              )}
              {(!!data?.add_on_count && data?.add_on_count !== 0) ||
              (!!data?.variant_set_count && data?.variant_set_count !== 0) ? (
                <Text
                  style={{
                    ...styles.customTextStyle,
                    textTransform: "lowercase",
                    color: isDarkMode
                      ? colors.whiteOpacity77
                      : colors.blackOpacity40,
                  }}
                >
                  {strings.CUSTOMISABLE}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

function styleData({ themeColors, fontFamily }) {
  const styles = StyleSheet.create({
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    customTextStyle: {
      fontSize: textScale(8),
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
      color: colors.yellowC,
    },
    addStyleText: {
      fontSize: textScale(10),
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      marginHorizontal: moderateScale(16),
    },
    addBtnStyle: {
      borderRadius: moderateScale(8),
      borderColor: themeColors.primary_color,
      alignItems: "center",
    },
    inTextStyle: {
      width: moderateScaleVertical(220),
      fontFamily: fontFamily.regular,
      fontSize: textScale(9),
      width: width / 3,
      textAlign: "left",
      marginTop: moderateScaleVertical(6),
      marginBottom: moderateScaleVertical(4),
    },
    imgStyle: {
      height: moderateScale(85),
      width: moderateScale(85),
      borderRadius: moderateScale(20),
    },
  });
  return styles;
}
export default React.memo(ProductCard3);
