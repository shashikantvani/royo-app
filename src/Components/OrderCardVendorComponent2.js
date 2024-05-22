import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  I18nManager,
  Keyboard,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {dummyUser} from '../constants/constants';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {currencyNumberFormatter} from '../utils/commonFunction';
import {getImageUrl, showError} from '../utils/helperFunctions';
import ButtonWithLoader from './ButtonWithLoader';

const OrderCardVendorComponent2 = ({
  data = {},
  titlestyle,
  selectedTab,
  onPress,
  navigation,
  onPressRateOrder,
  updateOrderStatus,
  onPressReturnOrder,
  etaTime = null,
  cardStyle,
  updateLocalItem,
  showRepeatOrderButton,
  onRepeatOrderPress,
}) => {
  let cardWidth = width - 21.5;
  const [reason, setReason] = useState('');
  const [cancellationItem, setCancellationItem] = useState(null);
  const [reasonError, setReasonError] = useState(false);
  const [cancelLoader, setLoader] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const businessType = appData?.profile?.preferences?.business_type || null;
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  const imageUrl =
    data && data.vendor
      ? getImageUrl(
          data.vendor.logo.image_fit,
          data.vendor.logo.image_path,
          '200/200',
        )
      : dummyUser;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({fontFamily, themeColors});

  const onCancel = async () => {
    if (reason == '') {
      setReasonError(true);
      return;
    }
    setLoader(true);
    const apiData = {
      order_id: cancellationItem.order_id,
      vendor_id: cancellationItem.vendor.id,
      reject_reason: reason,
    };
    // console.log('sendingapi data', apiData);
    try {
      const res = await actions.cancelOrder(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      setLoader(false);
      updateLocalItem(data);
      hideModal();
      // console.log('cancellation res+++++', res);
    } catch (error) {
      // showError(error?.message || error?.error)
      alert(error?.message || error?.error);
      // console.log('error raised', error);
      setLoader(false);
    }
  };

  const hideModal = () => {
    setReason('');
    setCancellationItem(null);
    setReasonError(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height + 10);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event) => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        ...styles.cardStyle,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
        ...cardStyle,
      }}>
      {showRepeatOrderButton ? (
        <View
          style={{
            marginTop: moderateScale(10),
            marginRight: moderateScale(10),
          }}>
          <TouchableOpacity
            onPress={onRepeatOrderPress}
            style={[
              styles.orderAcceptAndReadyStyleSecond,
              {
                // backgroundColor: themeColor.primary_color,
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(5),
                borderRadius: moderateScale(3),
                alignSelf: 'flex-end',
              },
            ]}>
            <Text
              style={{
                fontSize: textScale(10),
                color: colors.white,
                fontFamily: fontFamily.bold,
              }}>
              {strings.REPEAT_ORDER}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* {console.log('checking ssa', data)} */}
      {data?.order_status?.current_status?.title !== strings.DELIVERED &&
        data?.order_status?.current_status?.title !== strings.REJECTED &&
        (!!etaTime || !!data?.scheduled_date_time) && (
          <View
            style={{
              ...styles.ariveView,
              backgroundColor: themeColors?.primary_color,
            }}>
            <Text
              style={{
                ...styles.ariveTextStyle,
                color: colors.white,
              }}>
              {strings.YOUR_ORDER_WILL_ARRIVE_BY}{' '}
              {data?.scheduled_date_time ? data?.scheduled_date_time : etaTime}
            </Text>
          </View>
        )}

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          padding: moderateScale(8),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 0.5,
            alignItems: 'flex-start',
          }}>
          <Image
            source={{uri: imageUrl}}
            style={{
              height: moderateScale(50),
              width: moderateScale(50),
              borderRadius: moderateScale(50 / 2),
              resizeMode: 'contain',
              marginRight: moderateScale(8),
            }}
          />
          <Text
            numberOfLines={2}
            style={
              isDarkMode
                ? [styles.userName, {color: MyDarkTheme.colors.text}]
                : styles.userName
            }>
            {data?.vendor?.name || ''}
          </Text>
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.orderLableStyle, {color: MyDarkTheme.colors.text}]
                : styles.orderLableStyle
            }>
            {`${strings.ORDER_ID}: #${data?.order_number}`}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.orderLableStyle,
                    {
                      color: MyDarkTheme.colors.text,
                      marginVertical: moderateScaleVertical(5),
                    },
                  ]
                : [
                    styles.orderLableStyle,
                    {
                      marginVertical: moderateScaleVertical(5),
                      color: colors.black,
                    },
                  ]
            }>
            {data?.date_time}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.borderStyle,
          {marginHorizontal: moderateScale(10)},
        ]}></View>
      <View
        style={{
          borderColor: colors.borderColorB,
          padding: moderateScale(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: moderateScaleVertical(10),
          }}>
          {appStyle?.homePageLayout !== 4 ? (
            <Text
              style={{
                fontFamily: fontFamily.semiBold,
                fontSize: textScale(14),

                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {`${strings.TOTAL_ITEMS}: ${data?.product_details?.length}`}
            </Text>
          ) : (
            <></>
          )}
          {/* {data?.order_status?.current_status?.title == strings.DELIVERED && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModal(true)}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.icAttachments}
              />
            </TouchableOpacity>
          )} */}
        </View>
        <ScrollView bounces={true}>
          {data?.product_details.map((i, inx) => {
            return (
              <View key={inx}>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(10),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={
                        isDarkMode
                          ? [
                              styles.orderLableStyle,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.orderLableStyle
                      }>
                      {i?.title || ''}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={
                        isDarkMode
                          ? [
                              styles.qtyViewStyle,
                              {
                                color: MyDarkTheme.colors.text,
                                fontSize: textScale(10),
                              },
                            ]
                          : [styles.qtyViewStyle, {fontSize: textScale(10)}]
                      }>
                      {`x ${i?.qty || ''}`}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={imagePath.iconPayments}
              style={{tintColor: colors.textGreyB}}
            />
            <Text
              style={
                isDarkMode
                  ? [
                      styles.lableOrders,
                      {
                        paddingLeft: moderateScale(5),
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : [styles.lableOrders, {paddingLeft: moderateScale(5)}]
              }>
              {`${strings.PAYMENT} : `}
              <Text style={styles.valueOrders}>
                {data?.payment_option_title}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: themeColors.primary_color,
                marginHorizontal: moderateScale(10),
              }}>{`${currencies?.primary_currency?.symbol}${
              // Number(i?.pvariant?.multiplier) *
              currencyNumberFormatter(
                Number(data?.payable_amount),
                appData?.profile?.preferences?.digit_after_decimal,
              )
            }`}</Text>
          </View>
        </View>

        <View style={[styles.borderStyle, {marginHorizontal: -15}]}></View>

        {businessType == 'laundry' && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: moderateScale(10),
                marginTop: moderateScale(15),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  color: colors.black,
                }}>
                {strings.PICKUP_SCHEDULE_DATE}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  color: colors.blackOpacity66,
                }}>
                {data?.schedule_pickup} | {data?.scheduled_slot}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: moderateScale(10),
                marginTop: moderateScale(15),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  color: colors.black,
                }}>
                {strings.DROP_OFF_SCHEDULE_DATE}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  color: colors.blackOpacity66,
                }}>
                {data?.schedule_dropoff} | {data?.dropoff_scheduled_slot}
              </Text>
            </View>
          </>
        )}

        {selectedTab && selectedTab == strings.PAST_ORDERS ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: moderateScale(15),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text
                  style={[
                    styles.orderStatusStyle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>

            {data?.vendor?.return_request &&
            data?.order_status?.current_status?.title !== strings.REJECTED ? (
              <TouchableOpacity
                // onPress={onPressRateOrder}
                onPress={onPressReturnOrder}
                // style={{flex:0.6}}
                style={styles.bottomSecondHalf}>
                {appStyle?.homePageLayout === 4 ? null : (
                  <View style={styles.orderAcceptAndReadyStyleSecond}>
                    <Text style={styles.orderStatusStyleSecond}>
                      {strings.RETURNORDER}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={{flex: 0.6}} />
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: moderateScale(15),
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text
                  style={[
                    styles.orderStatusStyle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>
            {/* {selectedTab &&
            data?.dispatch_traking_url &&
            data?.product_details[0]?.category_type !=
              staticStrings.PICKUPANDDELIEVRY &&
            (selectedTab == strings.ACTIVE_ORDERS ||
              selectedTab == strings.SCHEDULED_ORDERS) ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.WEBVIEWSCREEN, {
                    title: strings.TRACKDETAIL,
                    url: data?.dispatch_traking_url,
                  })
                }
                style={{
                  borderRadius: 10,
                  backgroundColor: themeColors.primary_color,
                  justifyContent: 'center',
                }}>
                <View style={styles.trackStatusView}>
                  <Text style={styles.trackOrderTextStyle}>
                    {strings.TRACK_ORDER}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null} */}

            {selectedTab &&
            (selectedTab != strings.ACTIVE_ORDERS ||
              selectedTab != strings.SCHEDULED_ORDERS) ? null : (
              <View style={styles.bottomSecondHalf}>
                {data?.order_status?.current_status?.id == 1 ? (
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(data, 8)}
                      style={styles.orderReject}>
                      <Text style={styles.orderStatusStyleSecond}>
                        {strings.REJECT}
                      </Text>
                    </TouchableOpacity>
                    <View style={{width: moderateScale(10)}} />
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(data, 7)}
                      style={styles.orderAccept}>
                      <Text style={styles.orderStatusStyleSecond}>
                        {strings.ACCEPT}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : data?.order_status?.upcoming_status ? (
                  <TouchableOpacity
                    onPress={() =>
                      updateOrderStatus(
                        data,
                        data?.order_status?.upcoming_status?.id,
                      )
                    }
                    style={styles.orderAcceptAndReadyStyleSecond}>
                    <Text style={styles.orderStatusStyleSecond}>
                      {data?.order_status?.upcoming_status?.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        )}
        {data?.order_status?.current_status?.id != 3 ? (
          <TouchableOpacity
            onPress={() => setCancellationItem(data)}
            activeOpacity={0.8}
            style={{
              alignSelf: 'flex-start',
              marginLeft: moderateScale(10),
              marginTop: moderateScaleVertical(8),
            }}>
            <Text
              style={{
                ...styles.orderStatusStyle,
                color: colors.redB,
                fontFamily: fontFamily.medium,
              }}>
              {strings.CANCEL_ORDER}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        isVisible={!!cancellationItem ? true : false}
        onBackdropPress={hideModal}
        // animationIn="zoomIn"
        // animationOut="zoomOut"
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          marginBottom: moderateScale(keyboardHeight),
        }}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            borderRadius: moderateScale(8),
            overflow: 'hidden',
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(12),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text />
            <Text
              style={{
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                alignSelf: 'center',
                fontFamily: fontFamily.medium,
              }}>
              {strings.CANCELLATION_REASON}
            </Text>
            <TouchableOpacity onPress={hideModal}>
              <Image
                style={isDarkMode && {tintColor: colors.white}}
                source={imagePath.closeButton}
              />
            </TouchableOpacity>
          </View>

          {!!reasonError && (
            <Text
              style={{
                fontSize: textScale(12),
                color: colors.redB,
                fontFamily: fontFamily.medium,
                marginTop: moderateScaleVertical(8),
              }}>
              {strings.REQUIRED}*{' '}
            </Text>
          )}

          <View
            style={{
              // marginVertical: moderateScaleVertical(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyNew,
              height: moderateScale(82),
              borderRadius: moderateScale(4),
              paddingHorizontal: moderateScale(8),
              marginTop: reasonError
                ? moderateScaleVertical(8)
                : moderateScaleVertical(16),
            }}>
            <TextInput
              multiline
              value={reason}
              placeholder={strings.WRITE_YOUR_REASON_HERE}
              onChangeText={(val) => setReason(val)}
              style={{
                ...styles.reasonText,
                color: isDarkMode ? colors.textGreyB : colors.black,
                textAlignVertical: 'top',
              }}
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={
                isDarkMode ? colors.textGreyB : colors.blackOpacity40
              }
            />
          </View>
          <ButtonWithLoader
            isLoading={cancelLoader}
            btnText={strings.CANCEL}
            btnStyle={{
              backgroundColor: themeColors.primary_color,
              borderWidth: 0,
            }}
            onPress={onCancel}
          />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};
export function stylesFunc({fontFamily, themeColors}) {
  const commonStyles = commonStylesFunc({fontFamily});

  let cardWidth = width - 21.5;

  const styles = StyleSheet.create({
    cardStyle: {
      width: cardWidth,
      // ...commonStyles.shadowStyle,
      marginHorizontal: 2,
      justifyContent: 'center',
      padding: moderateScaleVertical(5),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderColorB,
      borderRadius: moderateScale(6),
    },
    lableOrders: {
      // ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
      lineHeight: moderateScaleVertical(19),
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    valueOrders: {
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
      // opacity: 0.6,

      lineHeight: moderateScaleVertical(16),
    },
    orderAddEditViews: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    rateOrder: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },

    //vendor app order listing styles.
    orderLableStyle: {
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      opacity: 0.6,
    },
    userName: {
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    qtyViewStyle: {
      marginHorizontal: moderateScale(15),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.6,
    },
    borderStyle: {
      borderWidth: 0.3,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: colors.lightGreyBgColor,
    },
    orderStatusStyle: {
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(12),
    },
    trackOrderTextStyle: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    orderStatusStyleSecond: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    orderAcceptAndReadyStyle: {
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    orderAcceptAndReadyStyleSecond: {
      flex: 0.6,
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    orderAccept: {
      backgroundColor: colors.green,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    orderReject: {
      backgroundColor: colors.redColor,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    imageCardStyle: {
      height: width / 6,
      width: width / 6,
      borderRadius: width / 12,
      marginRight: moderateScale(5),
    },
    circularQuantityView: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.primary_color,
      position: 'absolute',
      right: -2,
      top: -2,
      height: 25,
      width: 25,
      borderRadius: 25 / 2,
    },
    qunatityText: {
      color: colors.white,
      fontSize: textScale(10),
      fontFamily: fontFamily.medium,
    },
    scrollableContainer: {
      flexDirection: 'row',
      // marginBottom: moderateScaleVertical(10),
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: moderateScale(10),
    },
    currentStatusView: {
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    trackStatusView: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(8),
      alignItems: 'center',
    },
    bottomFirstHalf: {
      flex: 0.4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      // flexWrap:'wrap'
    },
    bottomSecondHalf: {
      flex: 0.6,
      alignItems: 'flex-end',
      justifyContent: 'center',
      // backgroundColor: 'black',
      // flexWrap:'wrap'
    },
    ariveTextStyle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
    },
    ariveView: {
      padding: moderateScale(6),
      borderTopRightRadius: moderateScale(6),
      borderTopLeftRadius: moderateScale(6),
    },
    reasonText: {
      flex: 1,
      fontFamily: fontFamily.medium,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      fontSize: textScale(11),
    },
  });
  return styles;
}
export default React.memo(OrderCardVendorComponent2);
