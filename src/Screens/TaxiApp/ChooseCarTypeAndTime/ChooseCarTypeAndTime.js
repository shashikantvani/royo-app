import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import * as RNLocalize from 'react-native-localize';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import CustomCallouts from '../../../Components/CustomCallouts';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import {
  deviceCountryCode,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
} from '../../../utils/helperFunctions';
import PaymentProcessingModal from '../../CourierService/PaymentProcessingModal';
import AvailableDriver from './AvailableDriver';
import SelectPaymentModalView from './SelectPaymentModalView';
import SelectTimeModalView from './SelectTimeModalView';
import SelectVendorModalView from './SelectVendorModalView';
import stylesFun from './styles';
import BottomViewModal from '../../../Components/BottomViewModal';
import DatePicker from 'react-native-date-picker';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function ChooseCarTypeAndTime({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const paramData = route?.params;
  console.log('my route', paramData);
  const bottomSheetRef = useRef(null);
  console.log(paramData?.cabVendors,"paramData?.cabVendors[0]");

  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {profile} = appData;
  const userData = useSelector((state) => state?.auth?.userData);
  const {pickUpTimeType} = useSelector((state) => state?.home);

  const fontFamily = appStyle?.fontSizeData;
  const [refArr, setRefArr] = useState([]);

  const [state, setState] = useState({
    region: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false,
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    availableVendors: paramData?.cabVendors,
    availableCarList: [],
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    selectedCarOption: null,
    selectedAvailableTimeOption: null,
    showVendorModal: false,
    showCarModal: true,
    showTimeModal: false,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),
    slectedDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : null,
    selectedTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : null,

    isModalVisible: false,

    selectedDateAndTime: `${moment().format('YYYY-MM-DD')} ${moment().format(
      'H:MM',
    )}`,
    selectedVendorOption: paramData?.cabVendors[0]
      ? paramData?.cabVendors[0]
      : null,
    pageNo: 1,
    limit: 12,
    uploadImages: [],
    isLoadingB: false,
    totalDistance: 0,
    totalDuration: 0,
    updatedAmount: null,
    couponInfo: null,
    loyalityAmount: null,
    isTimerPickerModal: false,
    formatedTime: moment().format('hh:mm A'),
    isDatePickerModal: false,
    pickedUpTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : null,
    selectedDate: moment().format('YYY-MM-DD'),
    pickedUpDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : null,
    selectedPayment: {},
    taskInstruction: '',
    productFaqQuestionAnswers: [],
    allSubmittedAnswers: null,
    indicatorLoader: false,
    defaultDeviceCountryCode: null,
    isScheduleModalVisible: false,
    scheduleDateTime: {},
  });
  const {
    selectedPayment,
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    showVendorModal,
    selectedDateAndTime,

    isModalVisible,
    isLoading,
    addressLabel,
    formattedAddress,
    region,
    coordinate,
    availableCarList,
    selectedCarOption,
    selectedAvailableTimeOption,
    showCarModal,
    showTimeModal,
    availAbleTimes,
    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    selectedVendorOption,
    date,
    availableVendors,
    pageNo,
    limit,
    isLoadingB,
    loyalityAmount,
    isTimerPickerModal,
    formatedTime,
    isDatePickerModal,
    pickedUpTime,
    selectedDate,
    pickedUpDate,
    uploadImages,
    taskInstruction,
    productFaqQuestionAnswers,
    allSubmittedAnswers,
    indicatorLoader,
    defaultDeviceCountryCode,
    isScheduleModalVisible,
    scheduleDateTime,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );

  const mapRef = useRef();

  const markerRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData && paramData?.selectedMethod) {
        updateState({selectedPayment: paramData?.selectedMethod});
      }
      // updateState({isLoadingB: true});
    }, [paramData]),
  );
  console.log(selectedPayment, 'selectedPayment');
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  const _confirmAddress = (addressType) => {};
  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
    markerRef.current.showCallout();

    // animate(region);
  };

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    {
      !!selectedVendorOption &&  
       _getAllCarAndPrices(true);
    }
    getDeviceCounrtyCode();
  }, [selectedVendorOption]);

  const getDeviceCounrtyCode = () => {
    deviceCountryCode()
      .then((res) => {
        updateState({
          defaultDeviceCountryCode: `+${res[0]?.countryCodes[0]}`,
        });
      })
      .catch((error) => {
        console.log(error, 'erroror');
      });
  };
  useEffect(() => {
    updateState({
      updatedAmount: paramData?.promocodeDetail?.couponInfo?.new_amount,
      couponInfo: paramData?.promocodeDetail?.couponInfo,
    });
  }, [
    paramData?.promocodeDetail?.couponInfo,
    paramData?.promocodeDetail?.new_amount,
  ]);

  //Get list of all orders api
  const _getAllCarAndPrices = (showInitalModal = true) => {
    if (showInitalModal) {
      updateState({showCarModal: true});
    }
    console.log('i am hiting >>>>>>');
    updateState({isLoading: true, showVendorModal: false});
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}/${paramData?.id}?page=${pageNo}&limit=${limit}`,
        {
          locations: paramData?.location,
          schedule_date_delivery: scheduleDateTime?.selectedDateAndTime
            ? scheduleDateTime?.selectedDateAndTime
            : `${pickedUpDate ? pickedUpDate : ''} ${
                pickedUpTime ? pickedUpTime : ''
              }`,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'ressssss');
        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(
                appData?.profile?.preferences?.digit_after_decimal,
              )
            : 0,
          availableCarList:
            pageNo == 1
              ? res?.data?.products?.data
              : [...availableCarList, ...res?.data?.products?.data],
          selectedCarOption: res?.data?.products?.data[0],
          // selectedCarOption
          //   ? selectedCarOption
          //   : res?.data?.products?.data[0],
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          productFaqQuestionAnswers: res?.data?.products?.data?.map(
            (item, index) => {
              return item;
            },
          ),
        });
      })
      .catch(errorMethod);
  };

  console.log(availableCarList, 'selectedCarOption');

  //error handling of api
  const errorMethod = (error) => {
    console.log(error, 'errorOccured');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      indicatorLoader: false,
    });
    showError(error?.message || error?.error || error?.description);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        var addressComponent = json.results[0].formatted_address;
        updateState({
          formattedAddress: addressComponent,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  const _selectTime = () => {
    updateState({showTimeModal: false, showPaymentModal: true});
  };

  const sendStripeToken = (extraData, data) => {
    console.log(' i amhere>>>>>>>');
    data['order_number'] = extraData?.orderDetail?.order_number;
    data['action'] = 'pickup_delivery';
    data['stripe_token'] = paramData?.tokenInfo;
    data['card_last_four_digit']=paramData?.cardInfo?.last4
    data['card_expiry_month']=paramData?.cardInfo?.expiryMonth
    data['card_expiry_year']=paramData?.cardInfo?.expiryYear
   
    console.log(data, 'extraData....');
    
    actions
      .openPaymentWebUrlPost(`/${selectedPayment?.code}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res>>>>>++++++++');
        updateState({
          isModalVisible: false,
          isLoading: false,
          isRefreshing: false,
          indicatorLoader: false,
        });
        let newObj = extraData?.orderDetail;
        newObj['dispatch_traking_url'] = res?.data?.data?.dispatch_traking_url;
        extraData['orderDetail'] = newObj;

        navigation.navigate(
          navigationStrings.PICKUPTAXIORDERDETAILS,
          extraData,
        );
      })
      .catch(errorMethod);
  };

  const checkPaymentOptions = (extraData, res) => {
    console.log(extraData, 'extraData');
    console.log(res, 'res');
    let paymentId = selectedPayment?.id;
    // let order_number = res?.orderDetail?.order_number;
    // console.log('api res success', res);

    let paymentData = {
      total_payable_amount: Number(
        extraData?.orderDetail?.payable_amount
          ? extraData?.orderDetail?.payable_amount
          : extraData?.orderDetail?.total_amount,
      ).toFixed(appData?.profile?.preferences?.digit_after_decimal),
      payment_option_id: selectedPayment?.id,
      orderDetail: extraData?.orderDetail,
      redirectFrom: 'pickup_delivery',
      selectedPayment: selectedPayment,
      extraData: extraData,
    };

    console.log(paymentData, 'paymentData>paymentData');
    updateState({
      isModalVisible: false,
      isLoading: false,
      isRefreshing: false,
      // indicatorLoader: false,
    });
    switch (paymentId) {
      case 4: //Stripe Payment Getway
       console.log(' i amerereerererere');
        sendStripeToken(extraData, res);
        break;
      case 6: //Payfast Payment Getway
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        break;
      case 32: //PAYPHONE Payment Getway
        navigation.navigate(navigationStrings.PAYPHONE, paymentData);
        break;
      case 18: //Authorize.net Payment Gatway
        navigation.navigate(navigationStrings.AuthorizeNet, paymentData);
        break;
      case 5: // PayStack Payment Getway
        navigation.navigate(navigationStrings.PAYSTACK, paymentData);
        break;
      case 42: //DIRECTPAYONLINE Payment Gatway
        navigation.navigate(navigationStrings.DIRECTPAYONLINE, paymentData);
        break;
      default:
        console.log('i mah shfjgdghdjgs');
        navigation.navigate(
          navigationStrings.PICKUPTAXIORDERDETAILS,
          extraData,
        );
        break;
    }
  };

  const _finalPayment = (data) => {
    if (isEmpty(selectedPayment)) {
      // showError(strings.PLEASE_SELECT_A_PAYMENT_METHOD);
      _redirectToPayement();
      return;
    }

    updateState({
      isLoading: true,
      indicatorLoader: true,
    });
    console.log(JSON.stringify(data), 'data>>>>>');
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'resresresres');
        if (res && res?.status == 200) {
          let extraData = {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: {id: selectedCarOption?.vendor_id},
            orderDetail: res?.data,
            fromCab: paramData?.pickup_taxi ? false : true,
            pickup_taxi: paramData?.pickup_taxi,
            totalDuration: totalDuration,
            selectedCarOption: selectedCarOption?.sku,
          };
          console.log(extraData, data,"extraData, data");
          checkPaymentOptions(extraData, data);
        } else {
          console.log(res, 'res>>>>>');
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
            indicatorLoader: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };
console.log(scheduleDateTime,"scheduleDateTime")
  const _confirmAndPay = () => {
    console.log(selectedPayment.id,"selectedPayment.id");
    let data = {};
    data['task_type'] = scheduleDateTime?.selectedDateAndTime
      ? ''
      : pickUpTimeType
      ? pickUpTimeType
      : '';
    data['schedule_time'] = scheduleDateTime?.selectedDateAndTime
      ? `${scheduleDateTime?.selectedDateAndTime}`
      : pickUpTimeType == 'now'
      ? ''
      : slectedDate && selectedTime && `${slectedDate} ${selectedTime}`;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = taskInstruction;
    data['amount'] = selectedCarOption?.tags_price;
    data['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    data['images_array'] = uploadImages;
    data['user_product_order_form'] = allSubmittedAnswers
      ? allSubmittedAnswers
      : [];
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    data['bookingType'] = paramData?.friendBookingDetails?.bookingType;
    (data[
      'friendName'
    ] = `${paramData?.friendBookingDetails?.firstName} ${paramData?.friendBookingDetails?.lastName}`),
      (data['friendPhoneNumber'] = paramData?.friendBookingDetails?.bookingType
        ? paramData?.friendBookingDetails?.mobileNumber?.includes('+')
          ? paramData?.friendBookingDetails?.mobileNumber
          : ` ${defaultDeviceCountryCode}${paramData?.friendBookingDetails?.mobileNumber}`
        : ''),
      console.log(data, 'dataaaaa');

    if (
      !!(
        !!userData?.client_preference?.verify_email &&
        !userData?.verify_details?.is_email_verified
      ) ||
      !!(
        !!userData?.client_preference?.verify_phone &&
        !userData?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
        ...userData,
        fromCart: true,
      })();
    } else {
      selectedPayment.id == 10 ? renderRazorPay(data) : _finalPayment(data);
    }
  };

  const renderRazorPay = (data) => {
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount: Number(selectedCarOption?.tags_price) * 100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: {color: themeColors.primary_color},
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          data['transaction_id'] = res?.razorpay_payment_id;
          _finalPayment(data); // placeOrder
        }
      })
      .catch(errorMethod);
  };

  const onBookNow = () => {
    var isRequired = false;
    !!selectedCarOption?.product_faq.length > 0 &&
      selectedCarOption.product_faq.forEach((val) => {
        if (val.is_required) {
          isRequired = true;
        }
      });
    if (isRequired) {
      alert('Please fill all required fields in detail form');
    } else {
      _confirmAndPay();
    }
  };

  const onPressAvailableVendor = (item) => {
    updateState({
      isLoading: true,
      availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };
  //Modal to select car

  const renderVendors = ({item}) => {
    return (
      <TouchableOpacity
        disabled={selectedVendorOption.id == item.id}
        onPress={() => onPressAvailableVendor(item)}
        style={{
          backgroundColor:
            selectedVendorOption.id == item.id
              ? themeColors.primary_color
              : 'white',
          padding: moderateScale(8),
          borderRadius: moderateScale(4),
          borderWidth: selectedVendorOption.id == item.id ? 0 : 0.5,
          borderColor: themeColors.primary_color,
        }}>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            color:
              selectedVendorOption.id == item.id
                ? themeColors.secondary_color
                : colors.black,
          }}>
          {item?.name || ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const carModalHeader = () => {
    if (!!showPaymentModal) {
      return (
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            padding: moderateScale(16),
            // alignItems: 'center',
            borderRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() =>
                redirectFromNow
                  ? updateState({showCarModal: true, showPaymentModal: false})
                  : updateState({showTimeModal: true, showPaymentModal: false})
              }>
              <Image
                style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
            <Text />
          </View>
          <View style={{marginBottom: moderateScaleVertical(32)}} />
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          borderRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginTop: moderateScaleVertical(18),
        }}>
        <View
          style={{
            // padding: moderateScale(16),
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image style={{opacity: 0}} source={imagePath.backArrowCourier} />

            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? colors.whiteOpacity77 : colors.black,
              marginTop: moderateScaleVertical(8),
            }}>
            {availableCarList.length > 0 ? strings.CHOOSE_A_TRIP : ''}
          </Text>
        </View>
        <View style={{marginVertical: moderateScale(8)}}>
          <FlatList
            horizontal
            data={availableVendors}
            renderItem={renderVendors}
            extraData={availableVendors}
            ItemSeparatorComponent={() => (
              <View style={{marginRight: moderateScale(12)}} />
            )}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(16)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginRight: moderateScale(16)}} />
            )}
          />
        </View>
      </View>
    );
  };

  const _selectCarModalView = () => {
    return (
      <AvailableDriver
        onPressAvailableCar={(item) => updateState({selectedCarOption: item})}
        selectedCarOption={selectedCarOption}
        onPressPickUpNow={() => {
          selectedCarOption
            ? updateState({
                // pickUpTimeType: 'now',
                showPaymentModal: true,
                redirectFromNow: true,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        isLoading={isLoading}
        onPressPickUplater={() => {
          selectedCarOption
            ? updateState({
                // pickUpTimeType: 'schedule',
                showTimeModal: true,
                redirectFromNow: false,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        availableCarList={availableCarList}
        // onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices(true)
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const _redirectToPayement = () => {
    moveToNewScreen(navigationStrings.PAYMENT_OPTIONS, {
      screenName: strings.PAYMENT,
    })();
  };

  console.log('app data');

  const uploadImage = async (img) => {
    console.log('selected image', img);

    const imgData = new FormData();
    imgData.append('upload_photo', {
      uri: img,
      name: 'image.png',
      fileName: 'image',
      type: 'image/png',
    });
    try {
      const res = await actions.imageUpload(imgData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      console.log('image upload res', res);
      updateState({
        uploadImages: [...uploadImages, ...[res.image]],
      });
    } catch (error) {
      console.log('erro rraised', error);
      showError(error?.error || error?.message);
    }
  };

  // console.log('image uploaded res', uploadImages);

  const updateInstruction = (val) => {
    updateState({taskInstruction: val});
  };

  const onQuestionAnswerSubmit = (item) => {
    updateState({
      allSubmittedAnswers: item,
    });
  };

  const _onDateChange = (date) => {
    // console.log(date, 'date');
    let time = moment(date).format('HH:mm ');
    let dateSelectd = moment(date).format('YYYY-MM-DD');

    // console.log(time, 'time');
    // console.log(dateSelectd, 'dateSelectd');
    updateState({
      scheduleDateTime: {
        selectedDateAndTime: `${dateSelectd} ${time}`,
        slectedDate: dateSelectd,
        selectedTime: moment(date).format('HH:mm'),
        date: date,
        isScheduleModalVisible: false,
      },
    });
  };

  const _ModalMainView = () => {
    return (
      <View style={styles.modalContainer}>
        <View>
          <View
            style={{
              alignItems: 'center',
              height: height / 3.5,
            }}>
            <DatePicker
              date={
                scheduleDateTime?.date ? scheduleDateTime?.date : new Date()
              }
              locale={
                languages?.primary_language?.sort_code
                  ? languages?.primary_language?.sort_code
                  : 'en'
              }
              mode="datetime"
              textColor={isDarkMode ? colors.black : colors.blackB}
              minimumDate={new Date()}
              style={{
                width: width - 20,
                height: height / 4.4,
              }}
              onDateChange={(value) => _onDateChange(value)}
              
              
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: 24,
              }}>
              <TouchableOpacity
                style={styles.scheduleModalBtnStyle}
                onPress={_modalClose}>
                <Text
                  style={{color: colors.white, fontFamily: fontFamily.regular}}>
                  {strings.CANCEL}
                </Text>
              </TouchableOpacity>

              <View style={{marginHorizontal: 4}} />
              <TouchableOpacity
                style={styles.scheduleModalBtnStyle}
                onPress={_modalCloseModal}>
                <Text
                  style={{color: colors.white, fontFamily: fontFamily.regular}}>
                  {strings.SET}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _modalClose = () => {
    updateState({
      isScheduleModalVisible: false,
    });
  };

  const _modalCloseModal = () => {
    updateState({
      isScheduleModalVisible: false,
    });
    _getAllCarAndPrices(false);
  };

  const _openDateTimeModal = () => {
    updateState({
      isScheduleModalVisible: true,
    });
  };

  const _selectPaymentView = () => {
    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={
          scheduleDateTime?.slectedDate
            ? scheduleDateTime?.slectedDate
            : pickedUpDate
        }
        isModalVisible={isModalVisible}
        selectedTime={
          scheduleDateTime?.selectedTime
            ? scheduleDateTime?.selectedTime
            : pickedUpTime
        }
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({showCarModal: true, showPaymentModal: false})
            : updateState({showTimeModal: true, showPaymentModal: false})
        }
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        selectedCarOption={selectedCarOption}
        navigation={navigation}
        couponInfo={couponInfo}
        updatedPrice={updatedAmount}
        loyalityAmount={loyalityAmount}
        removeCoupon={() => removeCoupon()}
        pickUpTimeType={pickUpTimeType}
        redirectToPayement={() => _redirectToPayement()}
        selectedPayment={selectedPayment}
        pickup_taxi={paramData?.pickup_taxi}
        uploadImage={uploadImage}
        updateInstruction={updateInstruction}
        productFaqQuestionAnswers={selectedCarOption}
        onQuestionAnswerSubmit={(item) => onQuestionAnswerSubmit(item)}
        indicatorLoader={indicatorLoader}
        _openDateTimeModal={_openDateTimeModal}
      />
    );
  };

  const removeCoupon = () => {
    updateState({
      updatedAmount: null,
      couponInfo: null,
    });
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({isModalVisible: false});
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const _pickerOpen = (value) => {
    updateState({[value]: true});
  };

  const _pickerCancel = (value) => {
    updateState({[value]: false});
  };

  const _onDayPress = (value) => {
    updateState({selectedDate: value.dateString});
  };

  const _modalOkPress = (value1, value2) => {
    updateState({
      [value1]: false,
      [value2]: value2 === 'pickedUpTime' ? formatedTime : selectedDate,
    });
  };

  const _onNewDateChange = (value) => {
    updateState({formatedTime: moment(value).format('hh:mm A')});
  };

  const onCenter = () => {
    if (paramData?.location.length > 0 && !!mapRef?.current?.fitToCoordinates) {
      mapRef.current.fitToCoordinates(paramData?.location, {
        edgePadding: {
          right: width / 3.2,
          bottom: height / 20,
          left: width / 3.2,
          top: height / 20,
        },
      });
    }
  };

  const onPressPickUpNow = () => {
    selectedCarOption
      ? updateState({
          // pickUpTimeType: 'now',
          showPaymentModal: true,
          redirectFromNow: true,
          showCarModal: false,
        })
      : showError(strings.PLEASE_SELECT_CAR);
  };

  // console.log('showCarModalshowCarModal', showCarModal);

  return (
    <View style={{...styles.container}}>
      <View style={{flex: 1}}>
        {!!paramData?.location.length > 0 && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            customMapStyle={
              appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
            }
            style={{height: height / 2.3}}
            region={region}
            initialRegion={region}
            tracksViewChanges={false}>
            <CustomCallouts data={paramData?.tasks} />

            <MapViewDirections
              origin={paramData?.location[0]}
              waypoints={
                paramData?.location.length > 2
                  ? paramData?.location.slice(1, -1)
                  : []
              }
              destination={paramData?.location[paramData?.location.length - 1]}
              apikey={profile?.preferences?.map_key}
              strokeWidth={4}
              strokeColor={colors.black}
              optimizeWaypoints={true}
              onStart={(params) => {
                // console.log(Started routing between "${params.origin}" and "${params.destination}");
              }}
              precision={'high'}
              timePrecision={'now'}
              mode={'DRIVING'}
              // maxZoomLevel={20}
              onReady={(result) => {
                // console.log(`Distance: ${result.distance} km`);
                // console.log(`Duration: ${result.duration} min.`);
                updateState({
                  totalDistance: result.distance.toFixed(2),
                  totalDuration: result.duration.toFixed(2),
                });
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 3.2,
                    bottom: height / 20,
                    left: width / 3.2,
                    top: height / 20,
                  },
                });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          </MapView>
        )}

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
          }}
          onPress={onCenter}>
          <Image
            style={{
              width: moderateScale(34),
              height: moderateScale(34),
              borderRadius: moderateScale(34 / 2),
            }}
            source={imagePath.mapNavigation}
          />
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height / 2.2, height / 1.25]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={carModalHeader}
          onChange={() => playHapticEffect(hapticEffects.impactMedium)}>
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,
              }}>
              {!!showCarModal && _selectCarModalView()}
              {!!showPaymentModal && _selectPaymentView()}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
        {!!showCarModal && (
          <View
            style={{
              width: '90%',
              position: 'absolute',
              bottom: 20,
              marginHorizontal: moderateScale(16),
              flexDirection: 'row',
            }}>
            {availableCarList.length > 0 && (
              <GradientButton
                colorsArray={[colors.white, colors.white]}
                textStyle={{
                  textTransform: 'none',
                  fontSize: textScale(13),
                  color: themeColors?.primary_color,
                }}
                onPress={_openDateTimeModal}
                btnText={`${
                  scheduleDateTime?.selectedDateAndTime
                    ? `${scheduleDateTime?.selectedDateAndTime}`
                    : slectedDate || selectedTime
                    ? `${slectedDate} ${selectedTime}`
                    : 'Schedule a ride'
                }`}
                btnStyle={styles.scheduleBtnStyle}
              />
            )}

            {availableCarList.length > 0 && (
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={{textTransform: 'none', fontSize: textScale(14)}}
                onPress={
                  selectedCarOption?.variant[0]?.price > 0
                    ? onPressPickUpNow
                    : () => {}
                }
                btnText={
                  selectedCarOption?.variant[0]?.price > 0
                    ? `${strings.CONFIRM} ${selectedCarOption?.translation[0]?.title} `
                    : strings.NORIDEAVAILABLE
                }
                containerStyle={{flex: 1}}
                btnStyle={{borderRadius: moderateScale(4)}}
              />
            )}
          </View>
        )}
      </View>

      {/* BottomView */}

      <View style={styles.topView}>
        <TouchableOpacity
          style={{
            marginTop: moderateScaleVertical(4),
            height: moderateScale(40),
            width: moderateScale(40),
            borderRadius: moderateScale(16),
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() =>
            // navigation.navigate(navigationStrings.PICKUPLOCATION)
            navigation.goBack()
          }>
          <Image
            source={imagePath.backArrowCourier}
            style={{
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>

      <PaymentProcessingModal
        isModalVisible={isModalVisible}
        updateModalState={_updateState}
      />

      {isScheduleModalVisible && (
        <BottomViewModal
          isDatetimePicker={true}
          show={isScheduleModalVisible}
          mainContainView={_ModalMainView}
          closeModal={_modalClose}
        />
      )}
    </View>
  );
}
