import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
//import { useDarkMode } from 'react-native-dark-mode';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import {
  checkEvenOdd,
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const transparentColor = ['transparent', 'transparent'];
const greyColor = ['rgba(0,0,0,0.52)', 'rgba(0,0,0,0.52)'];

const MarketCard3 = ({
  data = {},
  onPress = () => { },
  extraStyles = {},
  fastImageStyle = {},
  imageResizeMode = 'cover',
  isMaxSaftey = true,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const { appStyle, themeColors, appData } = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, extraStyles, MyDarkTheme, isDarkMode });
  const scaleInAnimated = new Animated.Value(0);

  let imageUrl = getImageUrl(
    data.banner.proxy_url || data.image.proxy_url,
    data.banner.image_path || data.image.image_path,
    '700/300',
  );

  const distanceView = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {!!appData?.profile?.preferences?.is_hyperlocal ? (
          <View
            style={{
              ...styles.ratingView,
              backgroundColor: colors.white,
            }}>
            <Text
              style={{
                fontSize: textScale(10),
                textAlign: 'left',
                color: data?.show_slot
                  ? colors.green
                  : data?.is_vendor_closed
                    ? colors.redB
                    : colors.green,
              }}>
              {data?.show_slot
                ? strings.OPEN
                : data?.is_vendor_closed
                  ? strings.CLOSE
                  : strings.OPEN}
            </Text>
          </View>
        ) : (
          <View />
        )}

        {!!data?.lineOfSightDistance || !!data?.timeofLineOfSightDistance ? (
          <View
            style={{
              ...styles.ratingView,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            {!!data?.lineOfSightDistance && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{
                      tintColor: data?.is_vendor_closed
                        ? colors.black
                        : themeColors.primary_color,
                      width: moderateScale(12),
                      height: moderateScale(12),
                      opacity: data?.is_vendor_closed ? 0.5 : 1,
                    }}
                    resizeMode="contain"
                    source={imagePath.location2}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.distanceTimeStyle,
                    }}>
                    {data?.lineOfSightDistance}
                  </Text>
                </View>

                {!!data?.timeofLineOfSightDistance && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        height: moderateScale(12),
                        borderRightWidth: 0.8,
                        marginHorizontal: moderateScale(8),
                        borderRightColor: colors.black,
                      }}
                    />
                    <Image
                      style={{
                        tintColor: data?.is_vendor_closed
                          ? colors.black
                          : themeColors.primary_color,
                        width: moderateScale(12),
                        height: moderateScale(12),
                        opacity: data?.is_vendor_closed ? 0.5 : 1,
                      }}
                      resizeMode="contain"
                      source={imagePath.icTime2}
                    />
                    {data?.timeofLineOfSightDistance / 60 > 1 && appIds.hokitch ==getBundleId() ?

                      <Text numberOfLines={1} style={styles.distanceTimeStyle}>
                        ≈{checkEvenOdd(data?.timeofLineOfSightDistance)}
                      </Text> :
                      <Text numberOfLines={1} style={styles.distanceTimeStyle}>
                        {checkEvenOdd(data?.timeofLineOfSightDistance)}
                        -
                        {checkEvenOdd(data?.timeofLineOfSightDistance + 5)}

                      </Text>

                    }
                  </View>
                )}
              </View>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={
        !!data?.is_vendor_closed && data?.closed_store_order_scheduled == 0
          ? {
            ...styles.mainTouchContainer,
            ...getScaleTransformationStyle(scaleInAnimated),
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : getColorCodeWithOpactiyNumber(
                colors.textGreyLight.substring(1),
                20,
              ),
          }
          : {
            ...styles.mainTouchContainer,
            ...getScaleTransformationStyle(scaleInAnimated),
          }
      }
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>
      <View>
        {!!data?.is_vendor_closed && !!data?.closed_store_order_scheduled ? (
          <View >

            <View style={{ justifyContent: 'center',  }}>
              <FastImage
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}

                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                  // opacity: 0.8,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.vendorScheduledView} >
                <Text
                  style={styles.vendorScheduledText}>
                  {getBundleId() == appIds.masa ? `${strings.WE_ACCEPT_ONLY_SCHEDULE_ORDER} ${data?.delaySlot} ` : ` ${strings.WE_ARE_NOT_ACCEPTING} ${data?.delaySlot} `}

                </Text>
              </View>
            </View>
          </View>

        ) : !!data?.is_vendor_closed &&
          data?.closed_store_order_scheduled == 0 ? (
          <Grayscale>
            <View style={{ justifyContent: 'center' }}>
              <FastImage
                source={{
                  uri: imageUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={{
                  ...styles.mainImage,
                  ...fastImageStyle,
                  opacity: 0.8,
                }}
                resizeMode={FastImage.resizeMode.cover}

              />
              <Text style={{ ...styles.currentlyUnavailable }}>
                {strings.CURRENTLYUNAVAILABLE}
              </Text>
            </View>
          </Grayscale>
        ) : (
          <View>
            <FastImage
              source={{
                uri: imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                ...styles.mainImage,
                ...fastImageStyle,
              }}
              resizeMode={FastImage.resizeMode.cover}>
              {distanceView()}
            </FastImage>
          </View>
        )}
      </View>
      <View style={{ padding: moderateScale(8) }}>
        <View style={styles.descView}>
          <Text
            numberOfLines={1}
            style={
              isDarkMode
                ? [styles.categoryText, { color: MyDarkTheme.colors.text }]
                : styles.categoryText
            }>
            {data.name}
          </Text>

          {!!data?.product_avg_average_rating && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.green,
                borderRadius: moderateScale(4),
                padding: 2,
                paddingHorizontal: 6,
              }}>
              <Text
                style={{
                  ...styles.ratingTxt,
                  color: colors.white,
                  fontSize: textScale(9),
                }}>
                {Number(data?.product_avg_average_rating).toFixed(1)}
              </Text>
              <Image
                style={{
                  tintColor: colors.white,
                  marginLeft: 2,
                  width: 9,
                  height: 9,
                }}
                source={imagePath.star}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        {!!data?.categoriesList ? (
          <Text
            numberOfLines={1}
            style={{
              color: colors.greyLight,
              fontSize: textScale(12),
              fontFamily: fontFamily.regular,
              textAlign: 'left',
              marginVertical: moderateScaleVertical(4),
              marginTop: moderateScaleVertical(6),
            }}>
            {data?.categoriesList}
          </Text>
        ) : null}

        {!!appData?.profile?.preferences?.max_safety_mod &&
          isMaxSaftey &&
          appStyle?.homePageLayout === 5 ? (
          <View>
            <View
              style={{
                height: 1,
                borderWidth: 0.5,
                borderColor: 'rgba(1,1,1,0.05)',
                marginTop: moderateScaleVertical(2),
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 50,
                  height: 25,
                  marginTop: 4,
                }}
                resizeMode="contain"
                source={imagePath.icMegaSafe}
              />
              <Text
                style={{
                  color: colors.greyLight,
                  fontSize: textScale(10),
                  fontFamily: fontFamily.regular,
                  marginTop: moderateScaleVertical(6),
                  marginLeft: moderateScale(8),
                  flex: 1,
                }}>
                Follow all Max Safety measures to ensure your food is safe
              </Text>
            </View>
          </View>
        ) : null}
        
      </View>
    </TouchableOpacity>
  );
};

export function stylesFunc({ fontFamily, extraStyles, isDarkMode, MyDarkTheme }) {
  const styles = StyleSheet.create({
    mainTouchContainer: {
      borderRadius: moderateScale(10),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 1.84,
      elevation: 2,
      backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      margin: 6,
      ...extraStyles,
    },
    categoryText: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily.medium,
      width: '85%',
      textAlign: 'left',
    },
    mainImage: {
      height: moderateScaleVertical(200),
      width: '100%',
      borderTopRightRadius: moderateScale(9),
      borderTopLeftRadius: moderateScale(9),
      padding: moderateScale(12),
    },
    descView: {
      marginTop: moderateScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ratingTxt: {
      color: colors.yellowC,
      fontSize: textScale(11),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
    },
    ratingView: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.green,
      borderRadius: moderateScale(4),
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(8),
      alignSelf: 'flex-end',
    },
    distanceView: {
      marginTop: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    distanceTimeStyle: {
      color: colors.black,
      fontSize: textScale(8),
      fontFamily: fontFamily.regular,
      textAlign: 'left',
      marginLeft: moderateScale(4),
    },
    currentlyUnavailable: {
      position: 'absolute',
      alignSelf: 'center',
      fontSize: textScale(16),
      color: colors.white,
      fontFamily: fontFamily?.bold,
    },
    vendorScheduledView: {
      position: 'absolute',
      bottom: moderateScaleVertical(1),
      // width: moderateScale(width / 1.2),
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      // paddingHorizontal: moderateScale(6),
    },
    vendorScheduledText: {
      color: colors.white,
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      textAlign: 'center',
      paddingHorizontal: moderateScaleVertical(4),
      backgroundColor: getColorCodeWithOpactiyNumber(
        colors.black.substring(1),
        60,
      ),
    }
  });
  return styles;
}
export default React.memo(MarketCard3);
