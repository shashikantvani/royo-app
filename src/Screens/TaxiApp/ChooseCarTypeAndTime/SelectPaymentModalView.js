import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  Dimensions,
} from 'react-native';
// import { useDarkMode } from 'react-native-dark-mode';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { currencyNumberFormatter } from '../../../utils/commonFunction';
import { getImageUrl } from '../../../utils/helperFunctions';
import { androidCameraPermission } from '../../../utils/permissions';
import stylesFun from './styles';
import Modal from 'react-native-modal';
import { isEmpty } from 'lodash';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';

export default function SelectPaymentModalView({
  isLoading = false,
  onPressBack,
  _confirmAndPay,
  slectedDate = '',
  selectedTime = '',
  totalDistance = 0,
  totalDuration = 0,
  selectedCarOption,
  navigation = navigation,
  couponInfo = null,
  updatedPrice = null,
  removeCoupon,
  loyalityAmount = 0,
  pickUpTimeType = '',
  redirectToPayement,
  selectedPayment = null,
  pickup_taxi = false,
  uploadImage,
  updateInstruction,
  productFaqQuestionAnswers,
  onQuestionAnswerSubmit,
  indicatorLoader = false,
  _openDateTimeModal=()=>{}
}) {
  // console.log(pickUpTimeType, 'pickUpTimeType+++++++');
  // console.log(selectedTime, 'selectedTime+++++++');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  // console.log(selectedCarOption, 'selectedCarOption');
  // console.log(slectedDate, 'slectedDate');
  // console.log(updatedPrice, 'updatedPrice');
  // console.log(loyalityAmount, 'loyalityAmount');
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const userData = useSelector((state) => state?.auth?.userData);
  const [image, setImage] = useState([]);
  const [taskInstruction, setInstruction] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isError, setError] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [myAnswerdArray, setMyAllanswers] = useState([]);
  const [myFaqValidationArray, setMyFaqValidationArray] = useState([]);
  const [validationFucCalled, setvalidationFucCalled] = useState(true);
  const [faqModalLayoutHeight, setfaqModalLayoutHeight] = useState(null);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS2, {
      vendor: vendor,
      cabOrder: true,
      isTaxi: true,

      // cartId: cartData.id,
    })();
  };

  const onImageUpload = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS === 'ios') {
      Alert.alert(
        'Upload Image ',
        'Choose an option',
        [
          { text: 'Camera', onPress: () => onCamera() },
          { text: 'Gallery', onPress: () => onGallery() },
          { text: 'Cancel', onPress: () => { } },
        ],
        { cancelable: true },
      );
    }
  };

  const removeImage = (inx) => {
    let res = image.filter((val, i) => {
      if (i !== inx) {
        return val;
      }
    });
    setImage(res);
  };
  const onGallery = async () => {
    try {
      let imageRes = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: false,
        cropping: true,
        mediaType: 'photo',
      });
      // console.log('Image path', imageRes);
      uploadImage(imageRes.path);
      setImage([...image, ...[imageRes?.path]]);
    } catch (error) {
      // console.log(error);
    }
  };

  const onCamera = async (index) => {
    try {
      let imageRes = await ImagePicker.openCamera({
        width: 100,
        height: 100,
        useFrontCamera: true,
        multiple: false,
        mediaType: 'photo',
      });
      // console.log('Image path', imageRes);
      uploadImage(imageRes.path);
      setImage([...image, ...[imageRes?.path]]);
    } catch (error) {
      // console.log('Image Picker error: ', error);
    }
  };

  // console.log('image,image', image);

  const onInstructionDone = () => {
    if (taskInstruction == '') {
      setError(true);
      return;
    }
    updateInstruction(taskInstruction);
    setError(false);
    setShowModal(false);
  };

  const setAllFormData = () => {
    onInstructionDone();
    onQuestionAnswerSubmit(myAnswerdArray), setShowModal(false);
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

  const onChangeText = (item, text, index, arrLength) => {
    // const myAnswerdArray = [];
    const answerdArray = [...myAnswerdArray];
    answerdArray[index] = {
      question: item?.translations[0]?.name,
      answer: text,
    };

    if (item?.is_required) {
      setvalidationFucCalled(false);
      const arraywithAllRequiredQuestion = [...myFaqValidationArray];
      arraywithAllRequiredQuestion[index] = false;
      setMyFaqValidationArray(arraywithAllRequiredQuestion);
      if (text === '') {
        const arraywithAllRequiredQuestion = [...myFaqValidationArray];
        arraywithAllRequiredQuestion[index] = true;
        setMyFaqValidationArray(arraywithAllRequiredQuestion);
      }
    }
    setMyAllanswers(answerdArray);
  };

  const setAllRequiredQuestions = (item, index) => {
    if (validationFucCalled) {
      if (item?.is_required) {
        setvalidationFucCalled(false);
        const arraywithAllRequiredQuestion = [...myFaqValidationArray];
        arraywithAllRequiredQuestion[index] = true;

        setMyFaqValidationArray(arraywithAllRequiredQuestion);
      } else {
        setvalidationFucCalled(false);
      }
    }
  };


  return (
    <View
      style={
        isDarkMode
          ? [
            styles.bottomView,
            {
              backgroundColor: MyDarkTheme.colors.background,
            },
          ]
          : styles.bottomView
      }>
      <Text
        style={{
          fontSize: textScale(26),
          fontFamily: fontFamily.medium,
          // marginVertical: moderateScale(10),
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          alignSelf: 'center',
        }}>
        {selectedCarOption
          ? `${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
            Number(selectedCarOption?.variant[0]?.price),
            appData?.profile?.preferences?.digit_after_decimal,
          )}`
          : ''}
      </Text>
      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(20),
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomColor: colors.borderColorD,
          borderBottomWidth: 1,
        }}>
        <View style={{ flex: 0.33 }}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.distanceDurationDeliveryLable,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.distanceDurationDeliveryLable
            }>
            {strings.DISTANCE}
          </Text>
          <Text
            style={[
              styles.distanceDurationDeliveryLable,
              { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
            ]}>
            {`${totalDistance} ${getBundleId()===appIds?.weTogether ? 'Miles' : 'km'}`}
          </Text>
        </View>
        <View style={{ flex: 0.33 }}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.distanceDurationDeliveryLable,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.distanceDurationDeliveryLable
            }>
            {strings.DURATION}
          </Text>
          <Text
            style={[
              styles.distanceDurationDeliveryLable,
              { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
            ]}>
            {totalDuration < 60
              ? `${totalDuration} mins`
              : `${(totalDuration / 60).toFixed(2)} hrs`}
          </Text>
        </View>
        <View style={{ flex: 0.33 }}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.distanceDurationDeliveryLable,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.distanceDurationDeliveryLable
            }>
            {strings.DELIVERYFEE}
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryValue,
                    {
                      textDecorationLine: updatedPrice
                        ? 'line-through'
                        : 'none',
                      opacity: updatedPrice ? 0.5 : 1,
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(12),
                    },
                  ]
                  : [
                    styles.distanceDurationDeliveryValue,
                    {
                      textDecorationLine: updatedPrice
                        ? 'line-through'
                        : 'none',
                      opacity: updatedPrice ? 0.5 : 1,
                      fontSize: textScale(12),
                    },
                  ]
              }>
              {selectedCarOption
                ? `${currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(selectedCarOption?.variant[0]?.price),
                  appData?.profile?.preferences?.digit_after_decimal,
                )}`
                : ''}
            </Text>
            {updatedPrice && (
              <Text
                style={
                  (isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(12),
                      },
                    ]
                    : styles.distanceDurationDeliveryValue,
                    { fontSize: textScale(12) })
                }>
                {`${currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    Number(selectedCarOption.tags_price) - Number(updatedPrice) >
                      0
                      ? Number(selectedCarOption.tags_price) -
                      Number(updatedPrice)
                      : 0,
                    appData?.profile?.preferences?.digit_after_decimal,
                  )}`}
              </Text>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: moderateScale(20),
          paddingVertical: moderateScale(20),
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{ flex: 0.3, justifyContent: 'center' }}>
          <View
            style={{
              height: moderateScale(28),
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Image
              style={{ height: 40, width: 100 }}
              resizeMode={'contain'}
              source={
                selectedCarOption?.media.length &&
                  selectedCarOption?.media[0]?.image?.path
                  ? {
                    uri: getImageUrl(
                      selectedCarOption?.media[0]?.image?.path?.image_fit,
                      selectedCarOption?.media[0]?.image?.path?.image_path,
                      '500/500',
                    ),
                  }
                  : imagePath.user
              }
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.65,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryValue,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>
              {selectedCarOption?.translation.length
                ? selectedCarOption?.translation[0].title
                : ''}
            </Text>
            <Text
              style={
                (isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    {
                      color: MyDarkTheme.colors.text,
                      marginTop: moderateScale(5),
                    },
                  ]
                  : styles.distanceDurationDeliveryLable,
                {
                  marginTop: moderateScale(5),
                  color: '#ACB1C0',
                })
              }>
              {totalDuration < 60
                ? `${totalDuration} mins`
                : `${(totalDuration / 60).toFixed(2)} hrs`}
            </Text>
          </View>
        </View>
      </View>
      {!!loyalityAmount && (
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            justifyContent: 'space-between',
            marginVertical: moderateScale(16),
          }}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.distanceDurationDeliveryLable,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.distanceDurationDeliveryLable
            }>
            {strings.LOYALTY}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                  styles.distanceDurationDeliveryValue,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.distanceDurationDeliveryValue
            }>{`-${currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(selectedCarOption?.variant[0]?.multiplier) *
                Number(loyalityAmount),
                appData?.profile?.preferences?.digit_after_decimal,
              )}`}</Text>
        </View>
      )}

      {/* select payment method */}
      <TouchableOpacity
        onPress={redirectToPayement}
        style={
          isDarkMode
            ? [
              styles.paymentMainView,
              {
                justifyContent: 'space-between',
                backgroundColor: MyDarkTheme.colors.lightDark,
              },
            ]
            : [styles.paymentMainView, { justifyContent: 'space-between' }]
        }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
            source={imagePath.paymentMethod}
          />
          <Text
            style={
              isDarkMode
                ? [styles.selectedMethod, { color: MyDarkTheme.colors.text }]
                : styles.selectedMethod
            }>
            {!isEmpty(selectedPayment)
              ? selectedPayment?.title
              : strings.SELECT_PAYMENT_METHOD}
          </Text>
        </View>
        <View>
          <Image
            source={imagePath.goRight}
            style={
              isDarkMode
                ? {
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  tintColor: MyDarkTheme.colors.text,
                }
                : { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }
            }
          />
        </View>
      </TouchableOpacity>

      <View
        style={{
          ...styles.offersViewB,
          marginHorizontal: moderateScale(17),
          flexDirection: 'row',
          // backgroundColor: 'black'
        }}>
        <TouchableOpacity
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={{ flex: 1 }}>
          {couponInfo ? (
            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{
                  flex: 0.7,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{ tintColor: themeColors.primary_color }}
                  source={imagePath.percent2}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                <Text
                  onPress={removeCoupon}
                  style={[styles.removeCoupon, { color: colors.cartItemPrice }]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}
              onPress={() => _getAllOffers(selectedCarOption, '')}>
              <Image
                style={{ tintColor: themeColors.primary_color }}
                source={imagePath.percent2}
              />
              <Text
                style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginLeft: moderateScale(8),
              marginBottom: moderateScale(3),
            }}
            onPress={() => setShowModal(true)}>
            <Image
              style={{ tintColor: themeColors.primary_color }}
              source={imagePath.icInstruction}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        pointerEvents={indicatorLoader ? 'none' : 'auto'}
        style={{
          marginTop: moderateScale(10),
          marginHorizontal: moderateScale(20),
          marginBottom: moderateScale(32),
         
        }}>
       

        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={{ textTransform: 'none', fontSize: textScale(12) }}
          onPress={() => {
            const isRequired = myFaqValidationArray.some(checkRequird);
            function checkRequird(checkRequird) {
              return checkRequird == true;
            }

            if (isRequired) {
              alert(strings.PLEASEFILDALLREQUIREDFIELDS);
            } else {
              _confirmAndPay();
            }
          }}

          btnText={
            pickup_taxi
              ? appIds?.weTogether ? strings.REQUEST_RIDE : strings.BOOK_NOW_RIDE
              : selectedTime || slectedDate? strings.SCHEDULE_RIDE_FOR:pickUpTimeType === 'now'
                ? strings.BOOK_NOW
                : strings.SCHEDULE_RIDE_FOR
                
          }
          indicator={indicatorLoader}
          indicatorColor={colors.white}
          btnStyle={{ width:moderateScale(width-60),borderRadius: moderateScale(4),}}
        />
      </View>

      <Modal
        isVisible={showModal}
        style={{
          margin: moderateScale(0),
          justifyContent: 'flex-end',

          // backgroundColor: isDarkMode ? colors.black : colors.white,
        }}
        // animationInTiming={600}
        onBackdropPress={() => setShowModal(false)}>
        <View
          onLayout={(event) => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setfaqModalLayoutHeight(height);
          }}
          style={{
            paddingTop:
              faqModalLayoutHeight === Dimensions.get('window').height
                ? StatusBarHeight
                : moderateScaleVertical(0),
            backgroundColor: isDarkMode ? colors.black : colors.white,
            padding: moderateScale(12),
            borderRadius: moderateScale(8),
            paddingBottom: moderateScale(keyboardHeight),
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(25),
                }}>
                <Text />

                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Image source={imagePath.closeButton} />
                </TouchableOpacity>
              </View>

              {productFaqQuestionAnswers?.product_faq?.map((item, index) => {
                setAllRequiredQuestions(item, index);
                return (
                  <View
                    style={{
                      marginTop: moderateScaleVertical(10),
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          marginBottom: moderateScaleVertical(10),
                          color: colors.redColor,
                        }}>
                        {`${item?.is_required ? '* ' : ''}`}
                      </Text>
                      <Text
                        style={{
                          marginBottom: moderateScaleVertical(10),
                          fontFamily: fontFamily.medium,
                          color: isDarkMode ? colors.white : colors.blackC,
                        }}>
                        {item?.translations[0]?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        // marginVertical: moderateScaleVertical(16),
                        backgroundColor: isDarkMode
                          ? colors.whiteOpacity15
                          : colors.greyNew,
                        height: moderateScale(42),
                        borderRadius: moderateScale(4),
                        paddingHorizontal: moderateScale(8),
                      }}>
                      <TextInput
                        multiline
                        placeholder={strings.ANSWER}
                        onChangeText={(text) =>
                          onChangeText(item, text, index, item?.length)
                        }
                        style={{
                          ...styles.insctructionText,
                          color: isDarkMode ? colors.textGreyB : colors.black,
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        placeholderTextColor={
                          isDarkMode ? colors.textGreyB : colors.blackOpacity40
                        }
                      />
                    </View>
                  </View>
                );
              })}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(5),
                }}>
                <View
                  style={{
                    fontFamily: fontFamily.medium,
                    textAlign: 'left',
                    color: isDarkMode ? colors.white : colors.blackC,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.medium,
                      color: isDarkMode ? colors.white : colors.blackC,
                    }}>
                    {strings.ADDINSTRACTION}
                  </Text>
                </View>
              </View>

              {isError && (
                <Text
                  style={{
                    fontSize: textScale(10),
                    fontFamily: fontFamily.medium,
                    textAlign: 'left',
                    color: colors.redB,
                    marginBottom: moderateScaleVertical(4),
                  }}>
                  {strings.PLEASEADDINSTRACTION}
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
                }}>
                <TextInput
                  multiline
                  value={taskInstruction}
                  placeholder={strings.INSTRUCTION}
                  onChangeText={(val) => setInstruction(val)}
                  style={{
                    ...styles.insctructionText,
                    color: isDarkMode ? colors.textGreyB : colors.black,
                    textAlignVertical: 'top',
                  }}
                  onSubmitEditing={Keyboard.dismiss}
                  placeholderTextColor={
                    isDarkMode ? colors.textGreyB : colors.blackOpacity40
                  }
                />
              </View>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  textAlign: 'left',
                  marginTop: moderateScaleVertical(10),
                  color: isDarkMode ? colors.white : colors.blackC,
                }}>
                {strings.ADDIMAGE1}
              </Text>
              <View
                style={{
                  marginVertical: 0,
                  paddingVertical: 0,
                  // alignSelf: 'flex-start',
                  overflow: 'visible',
                }}>
                <FlatList
                  horizontal
                  data={image}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginLeft: 8 }} />
                  )}
                  ListHeaderComponent={() => {
                    return (
                      <TouchableOpacity
                        style={{
                          width: moderateScale(40),
                          height: moderateScale(40),
                          borderRadius: moderateScale(8),
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginVertical: moderateScaleVertical(5),
                          marginRight: moderateScale(10),
                        }}
                        onPress={() => onImageUpload()}>
                        <Image
                          style={{
                            tintColor: isDarkMode
                              ? colors.white
                              : colors.blackC,
                          }}
                          source={imagePath.icImageUpload}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <View>
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: moderateScale(40),
                              height: moderateScale(40),
                              borderRadius: moderateScale(8),
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              right: 0,
                            }}>
                            <Image
                              style={{
                                width: moderateScale(16),
                                height: moderateScale(16),
                                borderRadius: moderateScale(10),
                              }}
                              resizeMode="contain"
                              source={imagePath.icClose3}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>

              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={{ textTransform: 'none', fontSize: textScale(12) }}
                onPress={() => {
                  const isRequired = myFaqValidationArray.some(checkRequird);
                  function checkRequird(checkRequird) {
                    return checkRequird == true;
                  }

                  if (isRequired) {
                    alert(strings.PLEASEFILDALL);
                  } else {
                    setAllFormData();
                  }
                }}
                btnText={strings.SUBMIT}
                marginTop={moderateScaleVertical(16)}
                marginBottom={moderateScaleVertical(16)}
              />
            </>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
