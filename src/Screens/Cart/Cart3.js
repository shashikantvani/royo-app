import { useFocusEffect } from "@react-navigation/native";
import { cloneDeep, isEmpty, set } from "lodash";
import moment from "moment";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  BackHandler,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Calendar } from "react-native-calendars";
// import { useDarkMode } from "react-native-dark-mode";
import DatePicker from "react-native-date-picker";
import DeviceInfo, { getBundleId } from "react-native-device-info";
import DropDownPicker from "react-native-dropdown-picker";
import FastImage from "react-native-fast-image";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { UIActivityIndicator } from "react-native-indicators";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as RNLocalize from "react-native-localize";
import Modal from "react-native-modal";
import ModalDropdown from "react-native-modal-dropdown";
import RazorpayCheckout from "react-native-razorpay";
import { useSelector } from "react-redux";
import AddressModal3 from "../../Components/AddressModal3";
import BorderTextInput from "../../Components/BorderTextInput";
import ButtonComponent from "../../Components/ButtonComponent";
import ChooseAddressModal from "../../Components/ChooseAddressModal";
import ConfirmationModal from "../../Components/ConfirmationModal";
import GradientButton from "../../Components/GradientButton";
import Header from "../../Components/Header";
import HorizontalLine from "../../Components/HorizontalLine";
import { loaderOne } from "../../Components/Loaders/AnimatedLoaderFiles";
import HeaderLoader from "../../Components/Loaders/HeaderLoader";
import ProductListLoader from "../../Components/Loaders/ProductListLoader";
import MarketCard3 from "../../Components/MarketCard3";
import ProductsComp from "../../Components/ProductsComp";
import SelectPaymentModal from "../../Components/SelectPaymentModal";
import WishlistCard from "../../Components/WishlistCard";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import Vi from "../../constants/lang/vi";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import { hitSlopProp } from "../../styles/commonStyles";
import staticStrings from "../../constants/staticStrings";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { currencyNumberFormatter } from "../../utils/commonFunction";
import { appIds } from "../../utils/constants/DynamicAppKeys";
import {
  getImageUrl,
  getParameterByName,
  showError,
  showInfo,
  showSuccess,
  timeInLocalLangauge,
} from "../../utils/helperFunctions";
import { getItem, removeItem, setItem } from "../../utils/utils";
import stylesFun from "./styles";
import {
  CardField,
  createToken,
  initStripe,
  StripeProvider,
  handleCardAction,
  createPaymentMethod,
  confirmPayment,
} from "@stripe/stripe-react-native";
import { cameraHandler } from "../../utils/commonFunction";
import ActionSheet from "react-native-actionsheet";
import { androidCameraPermission } from "../../utils/permissions";
import DocumentPicker from "react-native-document-picker";
import {
  generateTransactionRef,
  payWithCard,
} from "../../utils/paystackMethod";
import { PayWithFlutterwave } from "flutterwave-react-native";

import { FlutterwaveInit } from "flutterwave-react-native";
import { setRedirection } from "../../redux/actions/auth";
import ImagePicker from "react-native-image-crop-picker";
import BottomModal from "../../Components/BottomModal";
import ButtonWithLoader from "../../Components/ButtonWithLoader";
import LinearGradient from "react-native-linear-gradient";
import DashedLine from "react-native-dashed-line";

let clickedItem = {};
let isFAQsSubmitted = true;
let addtionSelectedImageIndex = null;
let addtionSelectedImage = null;
let dayAfterToday = new Date().getTime() + 24 * 60 * 60 * 1000;

function Cart({ navigation, route }) {
  let paramsData = route?.params;

  let actionSheet = useRef(null);

  const checkCartItem = useSelector((state) => state?.cart?.cartItemCount);
  // const darkthemeusingDevice = useDarkMode();
  const darkthemeusingDevice =false;
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);
  const [defaultSelectedTable, setDefaultSelectedTable] = useState("");
  const [type, setType] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [instruction, setInstruction] = useState("");
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState("");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState("");
  const [sel_types, setSelTypes] = useState("");
  const [viewHeight, setViewHeight] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [wishlistArray, setWishlistArray] = useState([]);
  const [cartData, setCartData] = useState({});
  const [selectedPayment, setSelectedPayment] = useState({});
  const [selectedTipvalue, setSelectedTipvalue] = useState(null);
  const [selectedTipAmount, setSelectedTipAmount] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [scheduleType, setScheduleType] = useState(null);
  const [localeSheduledOrderDate, setLocaleSheduledOrderDate] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState(null);
  const [btnLoadrId, setBtnLoaderId] = useState(null);
  const [swipeKey, setSwipeKey] = useState(null);
  const [pickupDriverComment, setPickupDriverComment] = useState(null);
  const [dropOffDriverComment, setDropOffDriverComment] = useState(null);
  const [vendorComment, setVendorComment] = useState(null);
  const [localePickupDate, setLocalPickupDate] = useState(null);
  const [localeDropOffDate, setLocaleDropOffDate] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [minimumDelayVendorDate, setMinimumDelayVendorDate] = useState(null);
  const [sheduledorderdate, setSheduledorderdate] = useState(null);
  const [sheduledpickupdate, setSheduledpickupdate] = useState(null);
  const [sheduleddropoffdate, setSheduleddropoffdate] = useState(null);
  const [productFaqs, setProductFaqs] = useState([]);
  const [myAnswerdArray, setMyAllanswers] = useState([]);
  const [myFaqValidationArray, setMyFaqValidationArray] = useState([]);
  const [validationFucCalled, setvalidationFucCalled] = useState(true);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [kycTxtInpts, setKycTxtInpts] = useState([]);
  const [kycImages, setKycImages] = useState([]);
  const [kycPdfs, setKycPdfs] = useState([]);
  const [apiScheduledDate, setApiScheduledDate] = useState(null);
  const [laundrySelectedPickupDate, setLaundrySelectedPickupDate] =
    useState(null);
  const [laundrySelectedPickupSlot, setLaundrySelectedPickupSlot] =
    useState("");
  const [laundryAvailablePickupSlot, setLaundryAvailablePickupSlot] = useState(
    []
  );
  const [laundrySelectedDropOffDate, setLaundrySelectedDropOffDate] =
    useState(null);
  const [laundrySelectedDropOffSlot, setLaundrySelectedDropOffSlot] =
    useState("");
  const [laundryAvailableDropOffSlot, setLaundryAvailableDropOffSlot] =
    useState([]);
  const [selectedItemForPrescription, setItemForPrescription] = useState({});
  const [isPrescriptionModal, setPrescriptionModal] = useState(false);
  const [selectedPrescriptionImgs, setPrescriptionImgs] = useState([]);
  const [isPrescriptionLoading, setPrescriptionLoading] = useState(false);
  const [isCheckSlotLoading, setCheckSloatLoading] = useState(false);

  const [state, setState] = useState({
    showTaxFeeArea: false,
    isGiftBoxSelected: false,
    selectViaMap: false,
    paymentModal: false,
    deliveryFeeLoader: false,
    isTableDropDown: false,
    btnLoader: false,
    placeLoader: false,
    isVisibleTimeModal: false,
    isVisible: false,
    isLoadingB: true,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    isRefreshing: false,
    isProductOrderForm: false,
    isProductLoader: false,
    isSubmitFaqLoader: false,
    isCategoryKyc: false,
    isCategoryKycLoader: false,
    isSubmitKycLoader: false,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
  });

  const {
    isVisibleTimeModal,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    isRefreshing,
    isTableDropDown,
    btnLoader,
    placeLoader,
    showTaxFeeArea,
    isGiftBoxSelected,
    selectViaMap,
    paymentModal,
    deliveryFeeLoader,
    isProductOrderForm,
    isProductLoader,
    isSubmitFaqLoader,
    isCategoryKyc,
    isCategoryKycLoader,
    isSubmitKycLoader,
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {
    appData,
    allAddresss,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  console.log(appData, "core appData");
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  console.log(selectedPayment, "selectedPayment");

  const { preferences } = appData?.profile;

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress
  );
  const recommendedVendorsdata = appMainData?.vendors;

  const { dineInType, appMainData, location } = useSelector(
    (state) => state?.home
  );
  //Update states on screens
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  console.log("isCheckSlotLoadingisCheckSlotLoading", isCheckSlotLoading);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, { data });
    };

  let businessType = appData?.profile?.preferences?.business_type || null;

  // console.log("cartitems", cartItems);

  const closeForm = () => {
    setPrescriptionModal(false);
    updateState({
      isProductOrderForm: false,
      isCategoryKyc: false,
    });
    Keyboard.dismiss();
  };
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        androidBackButtonHandler
      );
      return () => backHandler.remove();
    }, [])
  );

  const androidBackButtonHandler = () => {
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!checkCartItem?.data?.item_count) {
        updateState({ isLoadingB: true });
      }
      getCartDetail();
      // getAllWishListData();
      // if (!!checkCartItem?.data) {
      //   getCartDetail();
      // } else {
      //   getAllWishListData();
      // }
      return () => {
        // alert('blur')
      };
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      selectedAddress,
      isRefreshing,
      checkCartItem?.data?.item_count,
      // sheduledorderdate,
      sel_types,
    ])
  );

  useEffect(() => {
    if (
      !!checkCartItem?.data &&
      !!checkCartItem?.data?.products &&
      !!checkCartItem?.data?.products.length
    ) {
      console.log("useEffect 1", checkCartItem);
      // checkforAddressUpdate();
    }
  }, [selectedAddress, allAddresss]);

  //check for addreess Update and change
  const checkforAddressUpdate = () => {
    if (allAddresss.length == 0) {
      setSelectedAddress(null);
      actions.saveAddress(null);
      return;
    }
    if (!selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.is_primary);
      if (find) {
        setSelectedAddress(find);
        actions.saveAddress(find);
      } else {
        selectAddress(allAddresss[0]);
      }
      return;
    }
    if (selectedAddress && allAddresss.length) {
      let find = allAddresss.find(
        (x) =>
          x.id == selectedAddress.id &&
          x.is_primary == selectedAddress.is_primary
      );
      if (find) {
        selectAddress(find);
        return;
      } else {
        selectAddress(allAddresss[0]);
        return;
        // actions.saveAddress(null);
      }
      return;
    }
  };

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          }
        )
        .then((res) => {
          updateState({
            isLoadingB: false,
          });
          if (res.data) {
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };

  const getDate = (date) => {
    const local = moment.utc(date).local().format("DD MMM YYYY hhðŸ‡²ðŸ‡²a");
    return local;
  };
  console.log(location, "nocationnnnnnn");
  //get the entire cart detail
  const getCartDetail = () => {
    console.log(
      dineInType,
      paramsData?.data?.queryURL,
      "paramsData?.data?.queryURL"
    );
    // alert("cart detail hit")
    let apiData = `/?type=${dineInType}${
      paramsData?.data?.queryURL ? `&${paramsData?.data?.queryURL}` : ""
    }`;
    if (!!sel_types) {
      apiData = apiData + `&code=${sel_types}`;
    }
    console.log("Sending api data", apiData);
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
      timezone: RNLocalize.getTimeZone(),
      device_token: DeviceInfo.getUniqueId(),
    };
    console.log("Sending api header", apiHeader);
    actions
      .getCartDetail(apiData, {}, apiHeader)
      .then((res) => {
        console.log("cart details>>>", res);
        closeForm();
        actions.cartItemQty(res);
        let checkDate = !!res?.data?.scheduled_date_time;
        updateState({ deliveryFeeLoader: false, isSubmitFaqLoader: false });

        if (!!checkDate && res.data.schedule_type == "schedule") {
          let formatDate = new Date(res?.data?.scheduled_date_time);
          setLocaleSheduledOrderDate(
            timeInLocalLangauge(formatDate, selectedLanguage)
          );
        } else {
          setScheduleType("now");
          setLocaleSheduledOrderDate(null);
        }

        //schedule date for pickup and  dropoff
        let checkDateDropOFf = !!res?.data?.schedule_dropoff;
        let checkDatePickUp = !!res?.data?.schedule_pickup;

        if (!!checkDatePickUp) {
          let formatDate2 = new Date(res?.data?.schedule_pickup);
          setLocalPickupDate(
            timeInLocalLangauge(formatDate2, selectedLanguage)
          );
        }

        if (!!checkDateDropOFf) {
          let formatDate3 = new Date(res?.data?.schedule_dropoff);
          setLocaleDropOffDate(
            timeInLocalLangauge(formatDate3, selectedLanguage)
          );
        }
        setPickupDriverComment(
          res?.data?.comment_for_pickup_driver
            ? res?.data?.comment_for_pickup_driver
            : pickupDriverComment
        );
        setDropOffDriverComment(
          res?.data?.comment_for_dropoff_driver
            ? res?.data?.comment_for_dropoff_driver
            : dropOffDriverComment
        );
        setVendorComment(
          res?.data?.comment_for_vendor
            ? res?.data?.comment_for_vendor
            : vendorComment
        );
        setSheduledorderdate(res?.data?.scheduled_date_time);
        setSheduledpickupdate(res?.data?.schedule_pickup);
        setSheduleddropoffdate(res?.data?.schedule_dropoff);
        updateState({
          isRefreshing: false,
          isLoadingB: false,
        });
        setScheduleType(res?.data?.schedule_type);
        if (res && res.data) {
          if (
            !!res.data.vendor_details?.vendor_tables &&
            res?.data?.vendor_details?.vendor_tables?.length > 0
          ) {
            res?.data?.vendor_details?.vendor_tables.forEach(
              (item, indx) =>
                (tableData[indx] = {
                  id: item.id,
                  label: `${strings.CATEGORY}: ${
                    item.category.title ? item.category.title : ""
                  } | ${strings.TABLE}: ${
                    item.table_number ? item.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  value: `${strings.CATEGORY}: ${
                    item.category.title ? item.category.title : ""
                  } | ${strings.TABLE}: ${
                    item.table_number ? item.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  title: item.category.title,
                  table_number: item.table_number,
                  seating_number: item.seating_number,
                  vendor_id: res.data.vendor_details.vendor_address.id,
                }),
              setTableData(tableData)
            );
            const data = {
              vendor_id: tableData[0].vendor_id,
              table: tableData[0].id,
            };
            _vendorTableCart(data, tableData[0]);
          }

          if (
            !!res?.data?.products?.length &&
            res?.data?.products[0]?.delaySlot
          ) {
            var timeSlot = res?.data?.products[0]?.delaySlot;
            console.log("netxt festilval2", new Date(timeSlot.replace(" ")));
            setMinimumDelayVendorDate(timeSlot);
          }
          setCartItems(res.data.products);
          let currentDate = moment(new Date()).format("YYYY-MM-DD");
          // console.log(res?.data?.scheduled_date_time.slice(0, -6), "res?.data?.scheduled_date_time")
          let getApiScheduledDate =
            currentDate == res?.data?.scheduled_date_time?.slice(0, -6);
          setApiScheduledDate(getApiScheduledDate);

          // if (getBundleId == appIds.masa) {
          //   if (currentDate == sheduledorderdate || currentDate == getApiScheduledDate) {
          //     setAvailableTimeSlots([])
          //   } else {
          //     setAvailableTimeSlots(res.data.slots)
          //   }
          // } else {
          //   setAvailableTimeSlots(res.data.slots);
          // }
          // getBundleId == appIds.masa ? currentDate == sheduledorderdate ||  currentDate == getApiScheduledDate ? setAvailableTimeSlots([]):  setAvailableTimeSlots(res.data.slots): setAvailableTimeSlots(res.data.slots)
          setAvailableTimeSlots(res.data.slots);
          // setLaundryAvailablePickupSlot(res.data.slots);
          // setLaundryAvailableDropOffSlot(res.data.slots);

          setCartData(res.data);
          setSelectedTipvalue(
            res?.data?.total_payable_amount == 0 ? "custom" : null
          );
          updateState({
            isLoadingB: false,
            isRefreshing: false,
          });
          if (!res?.data?.schedule_type && res?.data?.products?.length > 0) {
            //if schedule type is null then hit the api again with now option
            setDateAndTimeSchedule();
          }

          if (
            res?.data &&
            res?.data?.tip?.length &&
            preferences?.auto_implement_5_percent_tip
          ) {
            setSelectedTipvalue(res?.data?.tip[0]);
            setSelectedTipAmount(res?.data?.tip[0]?.value);
          } else {
            setSelectedTipvalue(null);
            setSelectedTipAmount(null);
          }
        } else {
          setVendorAddress("");
          setCartItems([]);
          setCartData({});
          updateState({
            isLoadingB: false,
            isRefreshing: false,
            deliveryFeeLoader: false,
          });
        }
      })
      .catch(errorMethod);

    getItem("selectedTable")
      .then((res) => {
        setDefaultSelectedTable(res);
      })
      .catch(errorMethod);
  };

  console.log("cart data_++++++++", cartData);
  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    console.log(item, "itemitemitemitem");
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    let quantityToIncrease = !!itemToUpdate?.product?.batch_count
      ? Number(itemToUpdate?.product?.batch_count)
      : 1;
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + quantityToIncrease;
    } else {
      if (
        Number(itemToUpdate.quantity - itemToUpdate?.product?.batch_count) <=
        itemToUpdate?.product?.minimum_order_count
      ) {
        quanitity = itemToUpdate.quantity - 1;
      } else {
        quanitity = Number(itemToUpdate.quantity) - quantityToIncrease;
      }
    }
    if (quanitity) {
      let data = {};
      data["cart_id"] = itemToUpdate?.cart_id;
      data["quantity"] = quanitity;
      data["cart_product_id"] = itemToUpdate?.id;
      data["type"] = dineInType;
      setBtnLoaderId(item?.id);
      updateState({ btnLoader: true });
      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          console.log("cart detail", res);
          actions.cartItemQty(res);
          setCartItems(res.data.products);
          setCartData(res.data);
          actions.reloadData(!reloadData);

          updateState({
            btnLoader: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({ btnLoader: true });
      removeItem("selectedTable");
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    let data = {};
    data["cart_id"] = item?.cart_id;
    data["cart_product_id"] = item?.id;
    data["type"] = dineInType;
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log("cart res remove", res);
        actions.reloadData(!reloadData);
        if (!!res?.data && !!res?.data?.products) {
          actions.cartItemQty(res);
          setCartItems(res.data.products || []);
          setCartData(res.data);
          actions.reloadData(!reloadData);
          updateState({
            isLoadingB: false,
            btnLoader: false,
          });
        } else {
          actions.cartItemQty({});
          updateState({
            isLoadingB: false,
            btnLoader: false,
          });
        }
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({ isModalVisibleForClearCart: false });
  };

  const bottomButtonClick = () => {
    updateState({ isLoadingB: true, isModalVisibleForClearCart: false });
    removeItem("selectedTable");
    setTimeout(() => {
      clearEntireCart();
    }, 1000);
  };

  //Clear cart
  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        actions.cartItemQty({});
        setCartItems([]);
        setCartData({});

        updateState({
          isLoadingB: false,
        });
        // getAllWishListData();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, "<==errorOccured");
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
      deliveryFeeLoader: false,
      isProductLoader: false,
      isSubmitFaqLoader: false,
      isCategoryKycLoader: false,
      isSubmitKycLoader: false,
      isModalVisibleForPayFlutterWave: false,
    });
    setPrescriptionModal(false);
    setPrescriptionLoading(false);
    showError(
      error?.error?.description ||
        error?.description ||
        error?.message ||
        error?.error ||
        error
    );
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId && !!checkCartItem?.data) {
      _directOrderPlace();
      console.log("useEffect 2");
    }
  }, [paramsData?.transactionId]);

  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    // updateState({ isLoadingB: true });
    let data = {};
    data["vendor_id"] = item?.vendor_id;
    data["cart_id"] = cartData?.id;
    data["coupon_id"] = item?.couponData?.coupon_id;

    actions
      .removePromoCode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message || res?.error);
          getCartDetail();
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
  };

  console.log("cart data++++", cartData);

  //flutter wave
  var redirectTimeout;
  const handleOnRedirect = (data) => {
    console.log("flutterwaveresponse", data);
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      // do something with the result
      updateState({ isModalVisibleForPayFlutterWave: false });
    }, 200);
    try {
      if (data && data?.transaction_id) {
        let apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          order_number: paymentDataFlutterWave?.orderDetail?.order_number,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          action: "cart",
        };

        console.log(apiData, "apiData");
        actions
          .openSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            }
          )
          .then((res) => {
            console.log(res, "openSdkUrl");
            if (res && res?.status == "Success") {
              setCartItems([]);
              setCartData({});
              actions.reloadData(!reloadData);
              moveToNewScreen(navigationStrings.ORDERSUCESS, {
                orderDetail: {
                  order_number:
                    paymentDataFlutterWave?.orderDetail?.order_number,
                  id: paymentDataFlutterWave?.orderDetail?.id,
                },
              })();
            } else {
              redirectTimeout = setTimeout(() => {
                // do something with the result
                updateState({
                  isModalVisibleForPayFlutterWave: false,
                  placeLoader: false,
                  deliveryFeeLoader: false,
                });
              }, 200);
            }
          })
          .catch(errorMethod);
      } else {
        let apiData = {
          order_number: paymentDataFlutterWave?.orderDetail?.order_number,
          action: "cart",
        };
        actions
          .cancelSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            }
          )
          .then((res) => {
            console.log(res, "cancelPaytabUrl---resfrompaytab");
            redirectTimeout = setTimeout(() => {
              // do something with the result
              updateState({
                isModalVisibleForPayFlutterWave: false,
                placeLoader: false,
                deliveryFeeLoader: false,
              });
            }, 200);
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log("error raised", error);
      redirectTimeout = setTimeout(() => {
        // do something with the result
        updateState({
          isModalVisibleForPayFlutterWave: false,
          placeLoader: false,
        });
      }, 200);
    }
  };
  //flutter wave

  const checkPaymentOptions = (res) => {
    updateState({ placeLoader: true });
    let paymentId = res?.data?.payment_option_id;
    let order_number = res?.data?.order_number;
    setSelectedPayment(selectedPayment);
    console.log("api res success", res);

    let paymentData = {
      total_payable_amount: (
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ""
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(appData?.profile?.preferences?.digit_after_decimal),
      payment_option_id: selectedPayment?.id,
      orderDetail: res.data,
      redirectFrom: "cart",
      selectedPayment: selectedPayment,
    };
    if (
      !!paymentId &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) ===
        0
      )
    ) {
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        orderDetail: res.data,
      })();
      updateState({ placeLoader: false });
      return;
    }

    switch (paymentId) {
      case 4:
        // updateState({ placeLoader: false });
        _offineLinePayment(order_number);
        break;
      case 5: //Paystack Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYSTACK, paymentData);
        break;
      case 6: //Payfast Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        break;
      case 7: //Mobbex Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MOBBEX, paymentData);
        break;
      case 8: //Yoco Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.YOCO, paymentData);
        break;
      case 9: //Pyalink Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYLINK, paymentData);
        break;
      case 12: //Simplify Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.SIMPLIFY, paymentData);
        break;
      case 13: //Square Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.SQUARE, paymentData);
        break;
      case 15: //Pagarme Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAGARME, paymentData);
        break;
      case 17: //Checkout Payment Getway
        updateState({ placeLoader: false });
        checkoutPayment(paymentData);
        break;
      case 18: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.AuthorizeNet, paymentData);
        break;
      case 19: //FPX Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.FPX, paymentData);
        break;
      case 20: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.KONGOPAY, paymentData);
        break;

      case 22: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.AVENUE, paymentData);
        break;
      case 24: //Cashfree Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.CASH_FREE, paymentData);
        break;
      case 25: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.EASEBUZZ, paymentData);
        break;
      case 28: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.VNPAY, paymentData);
      case 26: //ToyyibPay Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.TOYYIAPAY, paymentData);
        break;
      case 36: //ToyyibPay Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MYCASH, paymentData);
        break;
      case 27: //Paytab Payment Getway
        // updateState({ placeLoader: false });
        console.log(res.data, "res.data>res.data");

        openPayTabs(paymentData);

        break;

      case 30: //Paytab Payment Getway
        // updateState({ placeLoader: false });
        console.log(res.data, "res.data>res.data");
        // payWithFlutterWave(paymentData.orderDetail, handleOnRedirect)
        updateState({
          isModalVisibleForPayFlutterWave: true,
          paymentDataFlutterWave: paymentData,
        });

        // openPayTabs(paymentData)

        break;

      case 29: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MPAISA, paymentData);
        break;

      case 34: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.WINDCAVE, paymentData);
        break;

      case 32: //PAYPHONE Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYPHONE, paymentData);
        break;

      case 37: //STRIPEOXXO Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.STRIPEOXXO, paymentData);
        break;

      case 39: //STRIPEOXXO Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.STRIPEIDEAL, paymentData);
        break;

      case 21: //VIVAWALLET Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.VIVAWALLET, paymentData);
        break;
      case 40: //USEREDE Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.USEREDE, paymentData);
        break;
      case 41: //OPENPAY Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.OPENPAY, paymentData);
        break;
      case 42: //Direct Pay Online Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.DIRECTPAYONLINE, paymentData);
        break;
      case 46: //Direct Pay Online Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.KHALTI, paymentData);
        break;

      default:
        if (
          !!businessType &&
          businessType == "home_service" &&
          res?.data?.vendors.length == 1
        ) {
          _getOrderDetail(res.data.vendors[0]);
        } else {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res.data,
          })();
          actions.cartItemQty({});
        }
        break;
    }
  };

  const openPayTabs = async (data) => {
    data["serverKey"] = appData?.profile?.preferences?.paytab_server_key;
    data["clientKey"] = appData?.profile?.preferences?.paytab_client_key;
    data["profileID"] = appData?.profile?.preferences?.paytab_profile_id;
    data["currency"] = currencies?.primary_currency?.iso_code;
    data["merchantname"] = appData?.profile?.company_name;
    data["countrycode"] = appData?.profile?.country?.code;
    console.log("openPayTabsdata", data);
    try {
      const res = await payWithCard(data);
      console.log("payWithCard res++++", res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          order_number: data?.orderDetail?.order_number,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: "cart",
        };

        console.log(apiData, "apiData");
        actions
          .openPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            console.log(res, "resfrompaytab");
            if (res && res?.status == "Success") {
              updateState({ placeLoader: false, deliveryFeeLoader: false });
              setCartItems([]);
              setCartData({});
              actions.reloadData(!reloadData);
              moveToNewScreen(navigationStrings.ORDERSUCESS, {
                orderDetail: {
                  order_number: data?.orderDetail?.order_number,
                  id: data?.orderDetail?.id,
                },
              })();
            } else {
              updateState({ placeLoader: false, deliveryFeeLoader: false });
            }
          })
          .catch(errorMethod);
      } else {
        let apiData = {
          order_number: data?.orderDetail?.order_number,
          action: "cart",
        };
        actions
          .cancelPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            console.log(res, "cancelPaytabUrl---resfrompaytab");
            updateState({ placeLoader: false, deliveryFeeLoader: false });
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const checkoutPayment = (paymentData) => {
    let queryData = `/${paymentData?.selectedPayment?.code?.toLowerCase()}?amount=${
      paymentData?.total_payable_amount
    }&payment_option_id=${paymentData?.payment_option_id}&order_number=${
      paymentData?.orderDetail?.order_number
    }&token=${!!cardInfo ? cardInfo : null}&action=cart`;

    {
      alert("heyyyy");
    }
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "ressssss");
        setCartItems([]);
        setCartData({});
        actions.reloadData(!reloadData);
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: paymentData?.orderDetail?.order_number,
            id: paymentData?.orderDetail?.id,
          },
        })();
      })
      .catch(errorMethod);
  };

  console.log(dineInType, "vendorAddress?");

  const _directOrderPlace = () => {
    let data = {};
    data["vendor_id"] = cartData?.products[0]?.vendor_id;
    data["address_id"] =
      dineInType != "delivery"
        ? ""
        : paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data["payment_option_id"] =
      Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ""
          ? Number(selectedTipAmount)
          : 0) >
      0
        ? paramsData?.selectedPayment?.id || selectedPayment?.id
        : 1;

    data["type"] = dineInType || "";
    data["is_gift"] = isGiftBoxSelected ? 1 : 0;
    data["specific_instructions"] = instruction;
    if (paramsData?.transactionId) {
      data["transaction_id"] = paramsData?.transactionId;
    }
    if (!!selectedTipAmount) {
      data["tip"] = selectedTipAmount || "";
    }
    placeOrderData(data);
  };

  const placeOrderData = (data) => {
    console.log("Sending data", data);
    let headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      latitude: !isEmpty(location) ? location?.latitude.toString() : "",
      longitude: !isEmpty(location) ? location?.longitude.toString() : "",
      // systemuser: DeviceInfo.getUniqueId(),
    };
    console.log(headerData, "headerData");

    actions
      .placeOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        latitude: !isEmpty(location) ? location?.latitude.toString() : "",
        longitude: !isEmpty(location) ? location?.longitude.toString() : "",
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, "placeOrder");
        actions.reloadData(!reloadData);
        setSelectedTipvalue(null);
        setPickupDriverComment(null);
        setDropOffDriverComment(null);
        setVendorComment(null);
        setLocalPickupDate(null);
        setLocaleDropOffDate(null);
        setSheduledpickupdate(null);
        setModalType(null);
        setSheduleddropoffdate(null);
        updateState({
          isLoadingB: false,
          placeLoader: false,
        });
        console.log("paymebnt res", res);
        checkPaymentOptions(res);
        if (
          selectedPayment?.id != 32 &&
          selectedPayment?.id != 17 &&
          selectedPayment?.id != 4 &&
          selectedPayment?.id != 27 &&
          selectedPayment?.id != 26 &&
          selectedPayment?.id != 30 &&
          selectedPayment?.id != 29 &&
          selectedPayment?.id != 37 &&
          selectedPayment?.id != 21 &&
          selectedPayment?.id != 36 &&
          selectedPayment?.id != 39 &&
          selectedPayment?.id != 34 &&
          selectedPayment?.id != 41
        ) {
          setCartItems([]);
          setCartData({});
          actions.reloadData(!reloadData);
          if (selectedPayment?.id == 1 || res?.data?.payable_amount == 0) {
            showSuccess(res?.message);
            return;
          }
          return;
        }
      })
      .catch(errorMethod);
  };

  const _getOrderDetail = ({ order_id, vendor_id }) => {
    // return;
    let data = {};
    data["order_id"] = order_id;
    data["vendor_id"] = vendor_id;
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, "res===> order detail");
        if (res?.data) {
          if (
            !!businessType &&
            businessType == "home_service" &&
            res?.data?.vendors.length == 1 &&
            res?.data?.vendors[0]?.dispatch_traking_url
          ) {
            setCartItems([]);
            setCartData({});
            actions.reloadData(!reloadData);

            updateState({
              isLoadingB: false,
              placeLoader: false,
            });
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
              orderId: order_id,
              fromVendorApp: true,
              selectedVendor: { id: vendor_id },
              orderDetail: res.data.vendors[0],
              showRating:
                res.data.vendors[0]?.order_status?.current_status?.id != 6
                  ? false
                  : true,
            });
            actions.cartItemQty({});
          } else {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
            setCartItems([]);
            setCartData({});
            actions.reloadData(!reloadData);
            updateState({
              isLoadingB: false,
              placeLoader: false,
            });
          }
        }
      })
      .catch(errorMethod);
  };

  // false, 'schedule', value
  const setDateAndTimeSchedule = (
    toHitApiForPlaceOrder = false,
    dateType = scheduleType,
    scheduleDate = sheduledorderdate
  ) => {
    if (!userData?.auth_token) {
      return;
    }

    let data = {};

    if (businessType == "laundry") {
      data["comment_for_pickup_driver"] = pickupDriverComment;
      data["comment_for_dropoff_driver"] = dropOffDriverComment;
      data["comment_for_vendor"] = vendorComment;
      data["schedule_pickup"] = laundrySelectedPickupDate
        ? laundrySelectedPickupDate
        : null;
      data["schedule_dropoff"] = laundrySelectedDropOffDate
        ? laundrySelectedDropOffDate
        : null;
      data["slot"] = !!laundrySelectedPickupSlot
        ? laundrySelectedPickupSlot
        : null;
      data["dropoff_scheduled_slot"] = !!laundrySelectedDropOffSlot
        ? laundrySelectedDropOffSlot
        : null;
    } else {
      data["task_type"] = !!selectedTimeSlots ? "schedule" : dateType;

      if (!!selectedTimeSlots) {
        const date = selectedDateFromCalendar;
        const time = selectedTimeSlots.split("-")[0];

        // const formatDate = moment(
        //   `${date} ${time}`,
        //   'YYYY-MM-DD HH:mm:ss',
        // ).format();
        // console.log('formatDate', formatDate);
        data["schedule_dt"] = selectedDateFromCalendar;
      } else {
        data["schedule_dt"] =
          dateType != "now" && scheduleDate
            ? new Date(scheduleDate).toISOString()
            : null;
      }
      data["specific_instructions"] = instruction;
      data["slot"] = selectedTimeSlots;
    }

    console.log(data, "fsdjkhfkjshfkjahsdkjfhak");

    // updateState({isLoading: false});

    actions
      .scheduledOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, "schedulte api res res>>>");
        if (res && res?.status == "Success") {
          if (toHitApiForPlaceOrder && businessType == "laundry") {
            _finalPayment();
          }
          updateState({
            // isLoadingB: toHitApiForPlaceOrder ? true : false,
          });
        } else {
          updateState({
            isLoadingB: false,
          });
        }
        // getCartDetail();
      })
      .catch((error) => console.log(error, "errororor"));
  };

  const _finalPayment = () => {
    // if (selectedPayment?.id == 4 && selectedPayment?.off_site == 0) {
    //   _offineLinePayment();
    //   return;
    // }
    console.log("payment option", selectedPayment);

    if (
      selectedPayment?.id == 10 &&
      selectedPayment?.off_site == 0 &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) !==
        0
      )
    ) {
      _renderRazor();
      return;
    }
    if (
      selectedPayment?.id === 3 &&
      selectedPayment?.off_site === 1 &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) !==
        0
      )
    ) {
      _webPayment();
      return;
    } else {
      _directOrderPlace();
    }

    // !!(Number(cartData?.total_payable_amount) !== 0) ||
    //   Number(selectedTipAmount) !== 0) {
    //   _webPayment()
    // }

    // else if (selectedPayment?.off_site == 1 && selectedPayment?.id === 3) {
    //   _webPayment();
    //   return;
    // } else if (
    //   selectedPayment?.off_site == 1 &&
    //   !!(
    //     selectedPayment?.id === 6 ||
    //     selectedPayment?.id === 7 ||
    //     selectedPayment?.id === 8 ||
    //     selectedPayment?.id === 9
    //   )
    // ) {
    //   _directOrderPlace();
    //   return;
    // }
    // _offineLinePayment();
  };

  const formatDateSlot = (date, time) => {
    return moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").format();
  };
  console.log(appData, "appDataappDataappData");

  //Clear cart
  const placeOrder = () => {
    isFAQsSubmitted = true;
    if (!!userData?.auth_token) {
      if (businessType == "laundry") {
        const pickupTime = laundrySelectedPickupSlot.split("-")[0];
        const dropTime = laundrySelectedDropOffSlot.split("-")[0];
        const formattedPickup = formatDateSlot(
          laundrySelectedPickupDate,
          pickupTime
        );
        const formattedDrop = formatDateSlot(
          laundrySelectedDropOffDate,
          dropTime
        );

        if (formattedPickup >= formattedDrop) {
          showError("Drop off date time must be greater then pickup date time");
          return;
        }
      }

      if (
        !!cartData?.closed_store_order_scheduled &&
        cartData?.products[0]?.vendor?.is_vendor_closed &&
        !localeSheduledOrderDate
      ) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (!!cartData?.delay_date && !localeSheduledOrderDate) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (!!cartData?.pickup_delay_date && !!cartData?.dropoff_delay_date) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (
        Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ""
            ? Number(selectedTipAmount)
            : 0) !=
          0 &&
        isEmpty(selectedPayment)
      ) {
        // showError(strings.PLEASE_SELECT_PAYMENT_METHOD);

        updateState({ paymentModal: true });
        // moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)();
        return;
      }

      if (cartData?.without_category_kyc === 0) {
        showError("Please submit KYC form!");
        return;
      }
      cartItems.map((itm, inx) => {
        itm?.vendor_products.map((item, index) => {

          if (item?.faq_count && item?.user_product_order_form == null) {
            isFAQsSubmitted = isEmpty(item?.long_term_products)?false:true;
          }
        });
      });

      if (!isFAQsSubmitted) {
        showInfo("Please fill all product's FAQs");
        return;
      }

      updateState({ placeLoader: true });
      var d1 = new Date();
      var d2 = new Date(localeSheduledOrderDate);

      console.log("shceduleORderdata", sheduledorderdate);
      if (!selectedAddressData && dineInType !== "takeaway") {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!selectedPayment) {
        errorMethod(strings.PLEASE_SELECT_PAYMENT_METHOD);
      } else if (scheduleType == "schedule" && d1.getTime() >= d2.getTime()) {
        errorMethod(strings.INVALID_SCHEDULED_DATE);
      } else {
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
          updateState({
            isLoadingB: false,
            placeLoader: false,
          });
          moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
            ...userData,
            fromCart: true,
          })();
        } else {
          _finalPayment();
        }
      }
    } else {
      updateState({ placeLoader: false });
      setAppSessionRedirection();
    }
  };

  const setAppSessionRedirection = () => {
    actions.setRedirection("cart");
    actions.setAppSessionData("on_login");
  };

  useEffect(() => {
    if (paramsData?.redirectFrom && !!checkCartItem?.data) {
      _directOrderPlace();
      console.log("useEffect 3");
    }
  }, [paramsData?.redirectFrom]);

  const swipeRef = useRef(null);

  const openDeleteView = async (item) => {
    let itemToUpdate = cloneDeep(item);
    removeItem("selectedTable");
    removeProductFromCart(itemToUpdate);
    // updateState({ isLoadingB: true });
    // if (!!swipeRef && swipeRef?.current) {
    //     swipeRef?.current.openRight()
    // }
  };

  const swipeBtns = (progress, dragX) => {
    return (
      <Animated.View
        key={String(cartItems.length)}
        style={{
          ...styles.swipeView,
        }}
      >
        <FastImage
          source={imagePath.deleteRed}
          resizeMode="contain"
          style={{
            width: moderateScale(16),
            height: moderateScale(16),
          }}
        />
      </Animated.View>
    );
  };

  const _webPayment = () => {
    let selectedMethod = selectedPayment.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    console.log(returnUrl, "returnUrl");
    console.log(cancelUrl, "cancelUrl");
    let queryData = `/${selectedMethod}?tip=${
      selectedTipAmount && selectedTipAmount != ""
        ? Number(selectedTipAmount)
        : 0
    }&amount=${(
      Number(cartData?.total_payable_amount) +
      (selectedTipAmount != null && selectedTipAmount != ""
        ? Number(selectedTipAmount)
        : 0)
    ).toFixed(
      appData?.profile?.preferences?.digit_after_decimal
    )}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${
      selectedAddressData?.id
    }&payment_option_id=${selectedPayment?.id}&action=cart`;

    console.log(queryData, "queryData");
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "response===>");
        setPickupDriverComment(null);
        setDropOffDriverComment(null);
        setVendorComment(null);
        setLocalPickupDate(null);
        setLocaleDropOffDate(null);
        setModalType(null);
        setSheduledpickupdate(null);
        setSheduleddropoffdate(null);
        updateState({
          isLoadingB: false,
          isRefreshing: false,
          placeLoader: false,
        });
        if (res && res?.status == "Success" && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: "cart",
            selectedAddressData: selectedAddressData,
          });

          setSelectedPayment(selectedPayment);
        }
      })
      .catch(errorMethod);
  };
  console.log(cartData, "cartDataaaaa");
  // const _createPaymentMethod = async (cardInfo, res2) => {
  //   console.log(cardInfo, '_createPaymentMethod>>>ardInfo');
  //   if (res2) {
  //    await createPaymentMethod({
  //       type: 'Card',
  //       // token:tokenInfo,
  //       card: cardInfo,
  //       billing_details: {
  //         name: 'Jenny Rosen',
  //       },
  //     }).then((res) => {
  //         // updateState({isLoadingB: false});
  //         console.log('_createPaymentMethod res', res);
  //         if (res && res?.error && res?.error?.message) {
  //           showError(res?.error?.message);
  //           updateState({
  //             isRefreshing:false,
  //             isLoadingB: false,
  //             placeLoader: false,
  //           });
  //         } else {
  //           console.log(res, 'success_createPaymentMethod ');
  //           actions
  //             .getStripePaymentIntent(
  //               // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
  //               {
  //                 payment_option_id: selectedPayment?.id,
  //                 action: 'cart',
  //                 amount:
  //                   Number(cartData?.total_payable_amount) +
  //                   (selectedTipAmount != null && selectedTipAmount != ''
  //                     ? Number(selectedTipAmount)
  //                     : 0),
  //                 payment_method_id: res?.paymentMethod?.id,
  //               },
  //               {
  //                 code: appData?.profile?.code,
  //                 currency: currencies?.primary_currency?.id,
  //                 language: languages?.primary_language?.id,
  //               },
  //             )
  //             .then(async (res) => {
  //               console.log(res, 'getStripePaymentIntent response');
  //               if (res && res?.client_secret) {
  //                 const {paymentIntent, error} = await handleCardAction(
  //                   res?.client_secret,
  //                 );
  //                 if (paymentIntent) {
  //                   console.log(paymentIntent, 'paymentIntent');
  //                   if (paymentIntent) {
  //                     actions
  //                       .confirmPaymentIntentStripe(
  //                         {
  //                           payment_option_id: selectedPayment?.id,
  //                           action: 'cart',
  //                           amount:
  //                             Number(cartData?.total_payable_amount) +
  //                             (selectedTipAmount != null &&
  //                             selectedTipAmount != ''
  //                               ? Number(selectedTipAmount)
  //                               : 0),
  //                           payment_intent_id: paymentIntent?.id,
  //                           address_id: selectedAddressData?.id,
  //                           tip:
  //                             selectedTipAmount && selectedTipAmount != ''
  //                               ? Number(selectedTipAmount)
  //                               : 0,
  //                         },
  //                         {
  //                           code: appData?.profile?.code,
  //                           currency: currencies?.primary_currency?.id,
  //                           language: languages?.primary_language?.id,
  //                         },
  //                       )
  //                       .then((res) => {
  //                         updateState({isRefreshing: false});
  //                         if (res && res?.status == 'Success' && res?.data) {
  //                           // updateState({allAvailAblePaymentMethods: res?.data});
  //                           actions.cartItemQty({});
  //                           setCartItems([]);
  //                           setCartData({});
  //                           setSelectedPayment({
  //                             id: 1,
  //                             off_site: 0,
  //                             title: 'Cash On Delivery',
  //                             title_lng: strings.CASH_ON_DELIVERY,
  //                           });
  //                           setPickupDriverComment(null);
  //                           setDropOffDriverComment(null);
  //                           setVendorComment(null);
  //                           setLocalPickupDate(null);
  //                           setLocaleDropOffDate(null);
  //                           setModalType(null);
  //                           setSheduledpickupdate(null);

  //                           updateState({
  //                             isLoadingB: false,
  //                             placeLoader: false,
  //                           });
  //                           moveToNewScreen(navigationStrings.ORDERSUCESS, {
  //                             orderDetail: res.data,
  //                           })();
  //                           showSuccess(res?.message);
  //                         } else {
  //                           setSelectedPayment({
  //                             id: 1,
  //                             off_site: 0,
  //                             title: 'Cash On Delivery',
  //                             title_lng: strings.CASH_ON_DELIVERY,
  //                           });
  //                           updateState({
  //                             isLoadingB: false,
  //                             placeLoader: false,
  //                           });
  //                         }
  //                       })
  //                       .catch(errorMethod);
  //                   }
  //                 } else {
  //                   updateState({
  //                     isRefreshing:false,
  //                     isLoadingB: false,
  //                     placeLoader: false,
  //                   });
  //                   console.log(error, 'error');
  //                   showError(error?.message || 'payment failed');
  //                 }
  //               } else {
  //                 updateState({isLoadingB: false});
  //               }
  //             })
  //             .catch(errorMethod);

  //         }
  //       })
  //       .catch(errorMethod);
  //   }
  // };
  console.log(paymentMethodId, "paymentMethodId");
  const _paymentWithStripe = async (
    cardInfo,
    tokenInfo,
    paymentMethodId,
    order_number
  ) => {
    console.log(order_number, "order_numberrrrr");

    actions
      .getStripePaymentIntent(
        // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
        {
          payment_option_id: selectedPayment?.id,
          action: "cart",
          amount:
            Number(cartData?.total_payable_amount) +
            (selectedTipAmount != null && selectedTipAmount != ""
              ? Number(selectedTipAmount)
              : 0),
          payment_method_id: paymentMethodId,
          order_number: order_number,
          card: cardInfo,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then(async (res) => {
        console.log(res, "getStripePaymentIntent response");
        if (res && res?.client_secret) {
          const { paymentIntent, error } = await handleCardAction(
            res?.client_secret
          );
          if (paymentIntent) {
            console.log(paymentIntent, "paymentIntent");
            if (paymentIntent) {
              actions
                .confirmPaymentIntentStripe(
                  {
                    order_number: order_number,
                    payment_option_id: selectedPayment?.id,
                    action: "cart",
                    amount:
                      Number(cartData?.total_payable_amount) +
                      (selectedTipAmount != null && selectedTipAmount != ""
                        ? Number(selectedTipAmount)
                        : 0),
                    payment_intent_id: paymentIntent?.id,
                    address_id: selectedAddressData?.id,
                    tip:
                      selectedTipAmount && selectedTipAmount != ""
                        ? Number(selectedTipAmount)
                        : 0,
                  },
                  {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                  }
                )
                .then((res) => {
                  console.log(res, "secondresponse");
                  updateState({ isRefreshing: false });
                  if (res && res?.status == "Success" && res?.data) {
                    // updateState({allAvailAblePaymentMethods: res?.data});
                    actions.cartItemQty({});
                    setCartItems([]);
                    setCartData({});
                    actions.reloadData(!reloadData);
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: "Cash On Delivery",
                      title_lng: strings.CASH_ON_DELIVERY,
                    });
                    setPickupDriverComment(null);
                    setDropOffDriverComment(null);
                    setVendorComment(null);
                    setLocalPickupDate(null);
                    setLocaleDropOffDate(null);
                    setModalType(null);
                    setSheduledpickupdate(null);

                    updateState({
                      isLoadingB: false,
                      placeLoader: false,
                    });
                    moveToNewScreen(navigationStrings.ORDERSUCESS, {
                      orderDetail: res.data,
                    })();
                    showSuccess(res?.message);
                  } else {
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: "Cash On Delivery",
                      title_lng: strings.CASH_ON_DELIVERY,
                    });
                    updateState({
                      isLoadingB: false,
                      placeLoader: false,
                    });
                  }
                })
                .catch(errorMethod);
            }
          } else {
            updateState({
              isRefreshing: false,
              isLoadingB: false,
              placeLoader: false,
            });
            console.log(error, "error");
            showError(error?.message || "payment failed");
          }
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async (order_number) => {
    console.log(tokenInfo, "tokenInfo>tokenInfo>tokenInfo");
    if (!!paymentMethodId) {
      // _createPaymentMethod(cardInfo, tokenInfo);
      _paymentWithStripe(cardInfo, tokenInfo, paymentMethodId, order_number);
      // let selectedMethod = selectedPayment.code.toLowerCase();
      // actions
      //   .openPaymentWebUrl(
      //     `/${selectedMethod}?tip=${
      //       selectedTipAmount && selectedTipAmount != ''
      //         ? Number(selectedTipAmount)
      //         : 0
      //     }&amount=${
      //       Number(cartData?.total_payable_amount) +
      //       (selectedTipAmount != null && selectedTipAmount != ''
      //         ? Number(selectedTipAmount)
      //         : 0)
      //     }&auth_token=${userData?.auth_token}&address_id=${
      //       selectedAddressData?.id
      //     }&payment_option_id=${
      //       selectedPayment?.id
      //     }&action=cart&stripe_token=${tokenInfo}`,
      //     {},
      //     {
      //       code: appData?.profile?.code,
      //       currency: currencies?.primary_currency?.id,
      //       language: languages?.primary_language?.id,
      //     },
      //   )

      //   .then((res) => {
      //     updateState({isRefreshing: false});
      //     if (res && res?.status == 'Success' && res?.data) {
      //       // updateState({allAvailAblePaymentMethods: res?.data});
      //       actions.cartItemQty({});
      //       setCartItems([]);
      //       setCartData({});
      //       setSelectedPayment({
      //         id: 1,
      //         off_site: 0,
      //         title: 'Cash On Delivery',
      //         title_lng: strings.CASH_ON_DELIVERY,
      //       });
      //       setPickupDriverComment(null);
      //       setDropOffDriverComment(null);
      //       setVendorComment(null);
      //       setLocalPickupDate(null);
      //       setLocaleDropOffDate(null);
      //       setModalType(null);
      //       setSheduledpickupdate(null);

      //       updateState({
      //         isLoadingB: false,
      //         placeLoader: false,
      //       });
      //       moveToNewScreen(navigationStrings.ORDERSUCESS, {
      //         orderDetail: res.data,
      //       })();
      //       showSuccess(res?.message);
      //     } else {
      //       setSelectedPayment({
      //         id: 1,
      //         off_site: 0,
      //         title: 'Cash On Delivery',
      //         title_lng: strings.CASH_ON_DELIVERY,
      //       });
      //       updateState({
      //         isLoadingB: false,
      //         placeLoader: false,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     showError(err.message);
      //     updateState({
      //       isLoadingB: false,
      //       placeLoader: false,
      //     });
      //     console.log(err, 'errorInPlaceOrder');
      //   });
    } else {
      errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };
  const _renderRazor = () => {
    updateState({ isLoadingB: true });
    let options = {
      description: "Payment for your order",
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        "1000/1000"
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount: (
        (Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ""
            ? Number(selectedTipAmount)
            : 0)) *
        100
      ).toFixed(0),
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || "",
        name: userData?.name,
      },
      theme: { color: themeColors.primary_color },
    };

    console.log(options, "optios");
    RazorpayCheckout.open(options)
      .then((res) => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          let data = {};
          data["address_id"] = selectedAddressData?.id;
          data["payment_option_id"] = selectedPayment?.id;
          data["type"] = dineInType || "";
          data["transaction_id"] = res?.razorpay_payment_id;
          placeOrderData(data); // placeOrder
        } else {
          console.log(res, "razorpay_payment_id>>>>res");
        }
      })
      .catch(errorMethod);
  };

  const clearSceduleDate = async () => {
    setScheduleType("now");
    setLocaleSheduledOrderDate(null);
    setSheduledorderdate(null);
  };

  useEffect(() => {
    if (
      scheduleType != null &&
      scheduleType == "now" &&
      !!checkCartItem?.data &&
      !!checkCartItem?.data.products &&
      !!checkCartItem?.data.products.length
    ) {
      console.log("scheduleTypescheduleType", scheduleType);
      setDateAndTimeSchedule();
      console.log("useEffect 4");
    }
  }, [scheduleType]);

  const _selectTime = (item) => {
    setModalType("schedule");
    updateState({
      isVisibleTimeModal: true,
    });
  };
  //Select Time Laundry
  const _selectTimeLaundry = (item) => {
    if (item == "dropoff") {
      setModalType("dropoff");
      updateState({
        isVisibleTimeModal: true,
      });
    } else {
      setModalType("pickup");
      updateState({
        isVisibleTimeModal: true,
      });
    }
  };

  const selectOrderDate = () => {
    if (businessType == "laundry") {
      if (laundrySelectedPickupDate > laundrySelectedDropOffDate) {
        alert("Please select valid dates.");
        return;
      }
      if (
        modalType == "pickup" &&
        (!laundrySelectedPickupDate || !laundrySelectedPickupSlot)
      ) {
        alert("Please select pickup date and time slots");
        return;
      }
      if (
        modalType !== "pickup" &&
        (!laundrySelectedDropOffDate || !laundrySelectedDropOffSlot)
      ) {
        alert("Please select drop-off date and time slots");
        return;
      }
      if (
        !cartData?.same_day_delivery_for_schedule &&
        laundrySelectedDropOffDate == laundrySelectedPickupDate
      ) {
        alert("You can not schedule pickup and drop off on the same day ");
        return;
      } else {
        onClose();
        setDateAndTimeSchedule();
        return;
      }
    } else {
      if (availableTimeSlots.length > 0 || cartData.slots.length > 0) {
        if (selectedDateFromCalendar == "" || selectedTimeSlots == "") {
          alert(strings.PLEASE_SELECT_DATETIME_SLOTS);
          return;
        } else {
          // let formatDate = new Date(selectedDateFromCalendar);
          const date = selectedDateFromCalendar;
          const time = selectedTimeSlots.split("-")[0];
          const formatDate = moment(
            `${date} ${time}`,
            "YYYY-MM-DD HH:mm:ss"
          ).format();
          setLocaleSheduledOrderDate(
            moment(new Date(formatDate)).format("lll")
          );
        }
      }

      onClose();
      if (modalType != "schedule" && businessType != "laundry") {
        setScheduleType("schedule");
      }
      setDateAndTimeSchedule();
    }
  };

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const deleteItem = async (i, index) => {
    setSwipeKey(makeid(5));
    openDeleteView(i);
    swipeRef.current.close();
    // return;

    // Animated.timing(height, {
    //   toValue: 0,
    //   duration: 350,
    //   useNativeDriver: false,
    // }).start(() => openDeleteView(i));
  };

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
      return;
    }
    setWishlistArray([]);
    updateState({ isRefreshing: false });
    return;
  };
  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    // updateState({ isLoadingB: true });
    actions
      .getWishlistProducts(
        `?limit=${10}&page=${1}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        setWishlistArray(res.data.data);
        updateState({
          isLoadingB: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const renderMinAmountMsg = (item) => {
    if (
      Number(item?.vendor?.order_min_amount) >
      Number(item?.payable_amount ? item?.payable_amount : 0).toFixed(
        appData?.profile?.preferences?.digit_after_decimal
      )
    ) {
      return (
        <Text
          numberOfLines={1}
          style={{
            ...styles.priceItemLabel2,
            color: colors.redB,
            fontSize: textScale(13),
            fontFamily: fontFamily.medium,
            marginTop: moderateScaleVertical(10),
            paddingHorizontal: moderateScale(5),
          }}
        >
          {`${strings.ACCEPTING_ORDER_MSG} ${currencies?.primary_currency?.symbol}${item?.vendor?.order_min_amount}`}
        </Text>
      );
    }
  };

  const onSelectDropDown = (val) => {
    setSelTypes(val?.code);
    setTimeout(() => {
      updateState({
        deliveryFeeLoader: true,
      });
    }, 800);
  };

  const renderDropDown = (val, item) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectDropDown(val)}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          // marginBottom: moderateScaleVertical(8),
          justifyContent: "space-between",
          marginVertical: moderateScaleVertical(8),
          // padding: moderateScale(8)
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FastImage
              source={
                (sel_types || item?.sel_types) == val?.code
                  ? imagePath.radioNewActive
                  : imagePath.radioInActive
              }
              style={{
                tintColor: themeColors.primary_color,
                height: moderateScale(14),
                width: moderateScale(14),
                marginRight: moderateScale(4),
              }}
              resizeMode="contain"
            />
            {appIds.hokitch == getBundleId() ? (
              <Text
                style={{
                  fontSize: textScale(12),
                  color:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? themeColors.primary_color
                      : colors.black,
                  fontFamily:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? fontFamily.bold
                      : fontFamily.regular,
                  textAlign: "left",
                }}
              >
                {strings.CHARGES}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: textScale(12),
                  color:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? themeColors.primary_color
                      : colors.black,
                  fontFamily:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? fontFamily.bold
                      : fontFamily.regular,
                  textAlign: "left",
                }}
              >
                {val?.courier_name}
              </Text>
            )}
          </View>
        </View>

        <Text
          style={{
            fontSize: textScale(12),
            color:
              (!!sel_types ? sel_types : item?.sel_types) == val?.code
                ? themeColors.primary_color
                : colors.black,
            fontFamily:
              (!!sel_types ? sel_types : item?.sel_types) == val?.code
                ? fontFamily.bold
                : fontFamily.regular,
            textAlign: "left",
          }}
        >
          {val?.rate}
        </Text>
      </TouchableOpacity>
    );
  };
  const _redirectVendorProducts = (item) => {
    console.log(item, "itemmmmm");

    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      fetchOffers: true,
      id: item?.vendor?.id,
      vendor:
        item.redirect_to == staticStrings.ONDEMANDSERVICE
          ? false
          : item.redirect_to == staticStrings.PRODUCT
          ? false
          : true,
      name: item?.vendor?.name,
      isVendorList: false,
    })();
  };
  const onModalDropDown = () => {
    setSelTypes(val?.code);
  };

  const getProductFAQs = (item) => {
    clickedItem = item;
    updateState({
      isProductOrderForm: true,
      isProductLoader: true,
    });
    actions
      .getProductFaqs(
        `/${item?.product?.id}`,
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        setProductFaqs(res?.data);
        updateState({
          isProductLoader: false,
        });
      })
      .catch(errorMethod);
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

  const onChangeText = (item, text, index, arrLength) => {
    // const myAnswerdArray = [];
    const answerdArray = [...myAnswerdArray];
    answerdArray[index] = {
      question: item?.translations[0]?.name,
      answer: text,
      product_faq_id: item?.id,
    };

    if (item?.is_required) {
      setvalidationFucCalled(false);
      const arraywithAllRequiredQuestion = [...myFaqValidationArray];
      arraywithAllRequiredQuestion[index] = false;
      setMyFaqValidationArray(arraywithAllRequiredQuestion);
      if (text === "") {
        const arraywithAllRequiredQuestion = [...myFaqValidationArray];
        arraywithAllRequiredQuestion[index] = true;
        setMyFaqValidationArray(arraywithAllRequiredQuestion);
      }
    }
    setMyAllanswers(answerdArray);
  };

  const setAllFormData = () => {
    const isRequired = myFaqValidationArray.some(checkRequird);
    function checkRequird(checkRequird) {
      return checkRequird == true;
    }

    if (isRequired) {
      alert(strings.PLEASEFILDALL);
    } else {
      updateState({
        isSubmitFaqLoader: true,
      });
      actions
        .updateProductFAQs(
          {
            product_id: clickedItem?.product?.id,
            user_product_order_form: myAnswerdArray,
          },
          {
            code: appData?.profile?.code,
          }
        )
        .then((res) => {
          getCartDetail();
        })
        .catch(errorMethod);
    }
  };

  const openPickerForPrescription = async (item, index) => {
    setItemForPrescription(item);
    setPrescriptionModal(true);
  };

  const _renderItem = ({ item, index }) => {
    console.log(item, "item>>><>>>");
    return (
      <View>
        {index === 0 && (
          <View style={Platform.OS === "ios" ? { zIndex: 5000 } : {}}>
            {dineInType === "dine_in" &&
              userData?.auth_token &&
              !!cartData?.vendor_details?.vendor_tables &&
              cartData?.vendor_details?.vendor_tables.length > 0 && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({ isTableDropDown: true })}
                  onClose={() => updateState({ isTableDropDown: false })}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : tableData[0]?.label || ""
                  }
                  containerStyle={styles.dropDownContainerStyle}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  labelStyle={
                    isDarkMode
                      ? { color: MyDarkTheme.colors.text }
                      : { color: colors.textGrey }
                  }
                  itemStyle={{
                    justifyContent: "flex-start",
                    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
                  }}
                  dropDownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  onChangeItem={(item) => _onTableSelection(item)}
                />
              )}
          </View>
        )}
        <View
          key={swipeKey + Math.random()}
          style={{
            ...styles.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
        >
          {renderMinAmountMsg(item)}
          <View
            style={{
              ...styles.vendorView,
              // paddingHorizontal: moderateScale(8),
              flexDirection: "column",
            }}
          >
            {/* <TouchableOpacity onPress={() => _redirectVendorProducts(item)}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
              >
                {item?.vendor?.name}
              </Text>
            </TouchableOpacity> */}

            {!!cartData?.closed_store_order_scheduled &&
            !!item?.vendor?.is_vendor_closed ? (
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}
              >
                {/* {strings.WE_ARE_NOT_ACCEPTING} {item?.delaySlot} */}
                {getBundleId() == appIds.masa
                  ? `${strings.WE_ACCEPT_ONLY_SCHEDULE_ORDER} ${item?.delaySlot} `
                  : ` ${strings.WE_ARE_NOT_ACCEPTING} ${item?.delaySlot} `}
              </Text>
            ) : null}

            {item?.is_vendor_closed ? (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}
              >
                {strings.VENDOR_NOT_ACCEPTING_ORDERS}
              </Text>
            ) : null}
          </View>
          {console.log(item?.vendor_products, "item?.vendor_products")}
          {/************ start  render cart items *************/}
          {item?.vendor_products.length > 0
            ? item?.vendor_products.map((i, inx) => {
                console.log(
                  i,
                  "itemmmmmm"
                );
                return (
                  <Swipeable
                    ref={swipeRef}
                    key={swipeKey + Math.random()}
                    renderRightActions={swipeBtns}
                    onSwipeableOpen={() => deleteItem(i, index)}
                    rightThreshold={width / 1.4}
                    // overshootFriction={8}
                  >
                    <Animated.View
                      style={{
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.lightDark
                          : colors.transactionHistoryBg,
                        marginBottom: moderateScaleVertical(12),
                        // marginRight: moderateScale(8),
                        borderRadius: moderateScale(10),
                        transform: [],
                        // minHeight: height * 0.125,
                      }}
                      key={inx}
                    >
                      {!isEmpty(i?.long_term_products) ? (
                        <>
                          <View style={styles.itemCardHeadingView}>
                            <Text
                              numberOfLines={1}
                              // style={{
                              //   ...styles.priceItemLabel2,
                              //   color: isDarkMode
                              //     ? MyDarkTheme.colors.text
                              //     : colors.blackOpacity86,
                              //   fontSize: textScale(12),
                              //   fontFamily: fontFamily.medium,
                              // }}
                            >
                              {i?.product?.translation[0]?.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              // style={{
                              //   ...styles.priceItemLabel2,
                              //   color: isDarkMode
                              //     ? MyDarkTheme.colors.text
                              //     : colors.themeColor,
                              //   fontSize: textScale(12),
                              //   fontFamily: fontFamily.medium,
                              // }}
                            >
                              {item?.vendor?.name}
                            </Text>
                          </View>
                          <DashedLine
                            dashLength={4}
                            dashThickness={1}
                            dashGap={5}
                            dashColor={colors.greyA}
                          />
                        </>
                      ) : null}

                      <View style={{ height: moderateScaleVertical(4) }} />

                      <View
                        style={{
                          ...styles.cartItemMainContainer,
                        }}
                      >
                        <View
                          style={[
                            styles.cartItemImage,
                            {
                              backgroundColor: isDarkMode
                                ? MyDarkTheme.colors.lightDark
                                : colors.white,
                            },
                          ]}
                        >
                      
                        
                           {!isEmpty(i.product.long_term_products)||!!i.product.long_term_products?
                          <FastImage
                          source={
                            i?.cartImg != "" && i?.cartImg != null
                              ? {
                                  uri: getImageUrl(
                                    i.product.long_term_products.product.media[0].image.path.proxy_url,
                                    i.product.long_term_products.product.media[0].image.path.image_path,
                                    "300/300"
                                  ),
                                  priority: FastImage.priority.high,
                                  cache: FastImage.cacheControl.immutable,
                                }
                              : imagePath.patternOne
                          }
                          style={styles.imageStyle}
                        />:
                          
                          <FastImage
                            source={
                              i?.cartImg != "" && i?.cartImg != null
                                ? {
                                    uri: getImageUrl(
                                      i?.cartImg?.path?.proxy_url,
                                      i?.cartImg?.path?.image_path,
                                      "300/300"
                                    ),
                                    priority: FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable,
                                  }
                                : imagePath.patternOne
                            }
                            style={styles.imageStyle}
                          />}
                        </View>

                        <View style={styles.cartItemDetailsCon}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  flex: 1,
                                }}
                              >
                                <View>
                                  {/* {!!i?.product?.category_name?.name && (
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      ...styles.priceItemLabel2,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyB,
                                      fontSize: textScale(12),
                                      fontFamily: fontFamily.medium,
                                      width: width / 2.1,
                                    }}
                                  >
                                    {i?.product?.category_name.name},
                                  </Text>
                                )} */}
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      ...styles.priceItemLabel2,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.blackOpacity86,
                                      fontSize: textScale(12),
                                      fontFamily: fontFamily.medium,
                                      width: width / 2.1,
                                    }}
                                  >
                                     {i?.product?.long_term_products?.product
                                ?.translation_one?.title ||
                                i?.product?.long_term_products?.product?.sku}
                                   
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => openDeleteView(i)}
                                >
                                  <FastImage
                                    source={imagePath.deleteRed}
                                    resizeMode="contain"
                                    style={{
                                      width: moderateScale(16),
                                      height: moderateScale(16),
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>

                              {item?.is_long_term_service == "1" ? (
                                <View>
                                  <View>
                                    <View
                                      style={{
                                        marginBottom: moderateScaleVertical(2),
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          ...styles.priceItemLabel2,
                                          color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.textGreyB,
                                          fontSize: textScale(10),
                                          fontFamily: fontFamily.medium,
                                          width: width / 2.1,
                                        }}
                                      >
                                        {strings.NOOFBOOK} {": "}
                                        {i?.long_term_products?.quantity}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        marginBottom: moderateScaleVertical(5),
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          ...styles.priceItemLabel2,
                                          color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.textGreyB,
                                          fontSize: textScale(10),
                                          fontFamily: fontFamily.medium,
                                          width: width / 2.1,
                                        }}
                                      >
                                        {strings.SERVICETIME}
                                      </Text>
                                    </View>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      mnarginTop: moderateScale(8),
                                    }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          ...styles.cartItemWeight2,
                                          color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.black,
                                          textTransform: "capitalize",

                                          // fontFamily: fontFamily.medium,
                                          // width: width / 2.1,
                                        }}
                                      >
                                        {"Frequency"}
                                      </Text>
                                      <View style={styles.boxView}>
                                        <Text
                                          style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.textGreyOpcaity7,
                                            textTransform: "capitalize",
                                            // fontFamily: fontFamily.medium,
                                            // width: width / 2.1,
                                          }}
                                        >
                                          {i?.service_period}
                                        </Text>
                                      </View>
                                    </View>
                                    {i?.service_period === "days" ? null : (
                                      <View>
                                        <Text
                                          style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.black,
                                            // fontFamily: fontFamily.medium,
                                            // width: width / 2.1,
                                          }}
                                        >
                                          {i?.service_period === "months"
                                            ? "Date"
                                            : "Day"}
                                        </Text>
                                        <View style={styles.boxView}>
                                          <Text
                                            style={{
                                              ...styles.cartItemWeight2,
                                              color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.textGreyOpcaity7,
                                              // fontFamily: fontFamily.medium,
                                              // width: width / 2.1,
                                            }}
                                          >
                                           
                                            {i?.service_period === "months"?i?.service_date:i.service_day}
                                          </Text>
                                        </View>
                                      </View>
                                    )}
                                    <View>
                                      <Text
                                        style={{
                                          ...styles.cartItemWeight2,
                                          color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.black,
                                        }}
                                      >
                                        {strings.TIME}
                                      </Text>
                                      <View style={styles.boxView}>
                                        <Text
                                          style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.textGreyOpcaity7,
                                          }}
                                        >
                                          {i?.service_start_time}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              ) : null}

                              <Text
                                style={{
                                  ...styles.priceItemLabel2,
                                  fontSize: textScale(12),
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.textGreyOpcaity7,
                                  marginTop: moderateScaleVertical(4),
                                  fontFamily: fontFamily.regular,
                                }}
                              >
                                {i?.quantity} X
                                <Text
                                  style={{
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                  }}
                                >
                                  {`${currencies?.primary_currency?.symbol}${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.variants?.quantity_price),
                                      appData?.profile?.preferences
                                        ?.digit_after_decimal
                                    )
                                  }`}
                                </Text>
                                ={" "}
                                <Text
                                  style={{
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                  }}
                                >
                                  {`${currencies?.primary_currency?.symbol}${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.variants?.price),
                                      appData?.profile?.preferences
                                        ?.digit_after_decimal
                                    )
                                  }`}
                                </Text>
                              </Text>

                              {i?.variant_options.length > 0
                                ? i?.variant_options.map((j, jnx) => {
                                    return (
                                      <View style={{ flexDirection: "row" }}>
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                  styles.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors.text,
                                                  },
                                                ]
                                              : styles.cartItemWeight2
                                          }
                                          numberOfLines={1}
                                        >
                                          {j.title}{" "}
                                        </Text>
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                  styles.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors.text,
                                                  },
                                                ]
                                              : styles.cartItemWeight2
                                          }
                                          numberOfLines={1}
                                        >{`(${j.option})`}</Text>
                                      </View>
                                    );
                                  })
                                : null}
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                justifyContent: "center",
                              }}
                            >
                              {!!i?.product_addons.length > 0 ? (
                                <View>
                                  <Text
                                    style={{
                                      ...styles.cartItemWeight2,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyOpcaity7,
                                      marginBottom: moderateScale(2),
                                      marginTop: moderateScaleVertical(6),
                                    }}
                                  >
                                    {strings.EXTRA}
                                  </Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {i?.product_addons.length > 0
                                ? i?.product_addons.map((j, jnx) => {
                                    return (
                                      <View
                                        style={{
                                          marginBottom:
                                            moderateScaleVertical(4),
                                        }}
                                      >
                                        <View
                                          style={{
                                            marginRight: moderateScale(10),
                                          }}
                                        >
                                          <Text
                                            style={
                                              isDarkMode
                                                ? [
                                                    styles.cartItemWeight2,
                                                    {
                                                      color:
                                                        MyDarkTheme.colors.text,
                                                    },
                                                  ]
                                                : styles.cartItemWeight2
                                            }
                                            // numberOfLines={1}
                                          >
                                            {j.addon_title}{" "}
                                            {`(${j.option_title})`} ={" "}
                                            {`${
                                              currencies?.primary_currency
                                                ?.symbol
                                            }${currencyNumberFormatter(
                                              Number(j.price),
                                              appData?.profile?.preferences
                                                ?.digit_after_decimal
                                            )}`}
                                          </Text>
                                        </View>
                                      </View>
                                    );
                                  })
                                : null}

                              {!!(
                                !!i?.pvariant &&
                                Number(i?.pvariant?.container_charges)
                              ) && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: moderateScale(2),
                                  }}
                                >
                                  <View>
                                    <Text
                                      style={{
                                        ...styles.cartItemWeight2,
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGreyB,
                                        marginBottom: moderateScale(2),
                                        // marginTop: moderateScaleVertical(6),
                                      }}
                                    >
                                      {`${strings.CONTAINERCHARGES} : `}
                                    </Text>
                                  </View>
                                  {!!(
                                    !!i?.pvariant &&
                                    Number(i?.pvariant?.container_charges)
                                  ) && (
                                    <View
                                      style={{
                                        marginBottom: moderateScaleVertical(2),
                                      }}
                                    >
                                      <View
                                        style={{
                                          marginRight: moderateScale(10),
                                        }}
                                      >
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                  styles.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors.text,
                                                  },
                                                ]
                                              : styles.cartItemWeight2
                                          }
                                          // numberOfLines={1}
                                        >
                                          {`${
                                            currencies?.primary_currency?.symbol
                                          }${currencyNumberFormatter(
                                            Number(
                                              i?.pvariant?.container_charges
                                            ) * Number(i?.quantity),
                                            appData?.profile?.preferences
                                              ?.digit_after_decimal
                                          )}`}
                                        </Text>
                                      </View>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "flex-end",
                                marginTop: moderateScale(6),
                              }}
                            >
                              {!!(
                                !item?.is_long_term_service &&
                                i?.faq_count &&
                                i?.user_product_order_form == null
                              ) && (
                                <>
                                  <TouchableOpacity
                                    style={{
                                      marginRight: moderateScale(14),
                                    }}
                                    onPress={() => getProductFAQs(i)}
                                  >
                                    <FastImage
                                      source={imagePath.edit1Royo}
                                      resizeMode="contain"
                                      style={{
                                        width: moderateScale(16),
                                        height: moderateScale(16),
                                      }}
                                    />
                                  </TouchableOpacity>
                                </>
                              )}

                              <View
                                pointerEvents={btnLoader ? "none" : "auto"}
                                style={{
                                  minWidth: moderateScale(74),
                                  // position:
                                  //   item?.is_long_term_service == "1"
                                  //     ? "absolute"
                                  //     : null,
                                  // right:
                                  //   item?.is_long_term_service == "1"
                                  //     ? 5
                                  //     : null,
                                  // bottom:
                                  //   item?.is_long_term_service == "1"
                                  //     ? 6
                                  //     : null,
                                }}
                              >
                                <LinearGradient
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 0 }}
                                  colors={["rgba(100,183,236,0.85)", "#A4CD3E"]}
                                  style={styles.incDecBtnContainer}
                                >
                                  <TouchableOpacity
                                    style={{ alignItems: "center" }}
                                    onPress={() =>
                                      addDeleteCartItems(i, inx, 2)
                                    }
                                  >
                                    <Text style={styles.cartItemValueBtn}>
                                      -
                                    </Text>
                                  </TouchableOpacity>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      // width: moderateScale(20),
                                      height: moderateScale(20),
                                      justifyContent: "center",
                                    }}
                                  >
                                    {btnLoadrId === i.id && btnLoader ? (
                                      <UIActivityIndicator
                                        size={moderateScale(16)}
                                        color={colors.white}
                                      />
                                    ) : (
                                      <Text style={styles.cartItemValue}>
                                        {i?.quantity}
                                      </Text>
                                    )}
                                  </View>
                                  <TouchableOpacity
                                    style={{ alignItems: "center" }}
                                    onPress={() =>
                                      addDeleteCartItems(i, inx, 1)
                                    }
                                  >
                                    <Text style={styles.cartItemValueBtn}>
                                      +
                                    </Text>
                                  </TouchableOpacity>
                                </LinearGradient>
                              </View>
                            </View>
                          </View>
                        </View>
                        {!!cartData?.delay_date && (
                          <Text
                            style={{
                              fontSize: moderateScale(12),
                              fontFamily: fontFamily.medium,
                              color: colors.redFireBrick,
                              marginBottom: moderateScale(3),
                            }}
                          >{`${
                            i?.product.delay_order_hrs > 0 ||
                            i?.product.delay_order_min > 0
                              ? strings.PREPARATION_TIME_IS
                              : ""
                          }${
                            i?.product.delay_order_hrs > 0
                              ? ` ${i?.product.delay_order_hrs} hrs`
                              : ""
                          }${
                            i?.product.delay_order_min > 0
                              ? ` ${i?.product.delay_order_min} mins`
                              : ""
                          }`}</Text>
                        )}
                      </View>
                      {/* <View style={styles.dashedLine} /> */}
                   
                      
                    </Animated.View>
                  </Swipeable>
                );
              })
            : null}
{/* --------------------LongTerm addons */}
{item?.is_long_term_service == "1" ? (
                          <View
                            style={{
                              paddingHorizontal: moderateScaleVertical(8),
                              // backgroundColor: "white",
                            }}
                          >
                            <Text
                              style={{
                                textTransform: "uppercase",
                                marginTop: moderateScaleVertical(7),
                                marginBottom: moderateScaleVertical(2),
                                ...styles.cartItemWeight2,
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.text,
                                fontFamily: fontFamily.medium,
                                width: width / 2.1,
                              }}
                            >
                              {strings.ADD_ON}
                           
                            </Text>
                            {item?.vendor_products[0]?.product?.long_term_products?.product?.add_on?.map(
                              (item) => {
                                console.log(item, "item>>");
                                return (
                                  <View
                                    style={[
                                      styles?.addOnstextView,
                                      {
                                        marginVertical:
                                          moderateScaleVertical(1),
                                        flexDirection: "row",
                                      },
                                    ]}
                                  >
                                    <View
                                      style={{
                                        flex: 0.05,
                                        marginRight: moderateScale(4),
                                      }}
                                    >
                                      <Image
                                        source={imagePath?.camera}
                                        style={{
                                          height: height / 150,
                                          width: height / 150,
                                          tintColor:  isDarkMode?colors.white:colors.black
                                        }}
                                      />
                                    </View>

                                    <View>
                                      <Text
                                        style={{
                                          ...styles.cartItemWeight2,
                                          color: isDarkMode
                                            ? MyDarkTheme.colors.text
                                            : colors.textGreyOpcaity7,
                                          fontFamily: fontFamily.regular,
                                          width: width / 2.1,
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {item?.title}
                                        {" : "}
                                        {item?.setoptions[0]?.title}
                                      </Text>
                                    </View>
                                  </View>
                                );
                              }
                            )}
                          </View>
                        ) : null}
          {/************ end render cart items *************/}
          {item?.isDeliverable ? null : (
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.redFireBrick,
                }}
              >
                {strings.ITEM_NOT_DELIVERABLE}
              </Text>
            </View>
          )}
          {/* offerview */}
          {!!item?.is_promo_code_available && (
            <TouchableOpacity
              disabled={item?.couponData ? true : false}
              onPress={() => _getAllOffers(item.vendor, cartData)}
              style={styles.offersViewB}
            >
              {item?.couponData ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 0.7,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FastImage
                      source={imagePath.percent}
                      resizeMode="contain"
                      style={{
                        width: moderateScale(16),
                        height: moderateScale(16),
                        tintColor: themeColors.primary_color,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.viewOffers,
                        { marginLeft: moderateScale(10) },
                      ]}
                    >
                      {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                    </Text>
                  </View>
                  <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                    {/* <Image source={imagePath.crossBlueB}  /> */}
                    <Text
                      onPress={() => _removeCoupon(item, cartData)}
                      style={[
                        styles.removeCoupon,
                        { color: colors.cartItemPrice },
                      ]}
                    >
                      {strings.REMOVE}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FastImage
                    source={imagePath.percent}
                    resizeMode="contain"
                    style={{
                      width: moderateScale(24),
                      height: moderateScale(24),
                      tintColor: themeColors.primary_color,
                    }}
                  />

                  <Text
                    style={[
                      styles.viewOffers,
                      { marginLeft: moderateScale(10) },
                    ]}
                  >
                    {strings.APPLY_PROMO_CODE}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {/* start amount view       */}
          <View
            style={{
              marginHorizontal: moderateScale(4),
              marginTop: moderateScaleVertical(8),
            }}
          >
            {!!item?.discount_amount && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }
                >
                  {strings.COUPON_DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }
                >{`- ${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(item?.discount_amount ? item?.discount_amount : 0),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}</Text>
              </View>
            )}

            {!!(item?.vendor && item?.vendor?.fixed_fee) && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }
                >
                  {preferences?.fixed_fee_nomenclature != "" &&
                  preferences?.fixed_fee_nomenclature != null
                    ? preferences?.fixed_fee_nomenclature
                    : strings.FIXED_FEE}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }
                >{`${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(
                    item?.vendor?.fixed_fee_amount
                      ? item?.vendor?.fixed_fee_amount
                      : 0
                  ),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}</Text>
              </View>
            )}

            {appIds?.meatEasy == DeviceInfo.getBundleId() ? (
              <View style={styles.itemPriceDiscountTaxView}>
                {!!item?.delivery_types && item?.delivery_types?.length > 0 ? (
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      marginBottom: moderateScaleVertical(8),
                    }}
                  >
                    {strings.DELIVERY_CHARGES}:
                  </Text>
                ) : null}

                {!!item?.delivery_types && item?.delivery_types.length > 0 ? (
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.priceItemLabel,
                            {
                              color: MyDarkTheme.colors.text,
                            },
                          ]
                        : styles.priceItemLabel
                    }
                  >{`${
                    currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    Number(
                      item?.delivery_types.filter(
                        (val2) => (sel_types || item?.sel_types) == val2?.code
                      )[0]?.rate
                    ),
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}</Text>
                ) : null}
              </View>
            ) : (
              <>
                {!!item?.delivery_types && item?.delivery_types?.length > 0 ? (
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      marginBottom: moderateScaleVertical(8),
                    }}
                  >
                    {strings.DELIVERY_CHARGES}:
                  </Text>
                ) : null}

                {!!item?.delivery_types && item?.delivery_types.length > 0 ? (
                  <ModalDropdown
                    multipleSelect={false}
                    options={item?.delivery_types}
                    renderRow={(val) => renderDropDown(val, item)}
                    dropdownStyle={{
                      minWidth: "40%",
                      // minHeight: 50,
                      paddingHorizontal: moderateScale(6),
                      paddingVertical: moderateScaleVertical(12),
                    }}
                  >
                    <View
                      style={{
                        ...styles.deliveryFeeDropDown,
                        borderColor: themeColors.primary_color,
                      }}
                    >
                      {appIds.hokitch == getBundleId() ? (
                        <Text style={styles.dropDownTextStyle}>
                          {strings.CHARGES}
                        </Text>
                      ) : (
                        <Text style={[styles.dropDownTextStyle.fontFamily,{   color:isDarkMode?colors.white:colors.black}]}>
                          {
                            item?.delivery_types.filter(
                              (val2) =>
                                (sel_types || item?.sel_types) == val2?.code
                            )[0]?.courier_name
                          }
                        </Text>
                      )}
                      <Text
                        style={{
                          ...styles.dropDownTextStyle,
                          marginHorizontal: moderateScale(8),
                          color:isDarkMode?colors.white:colors.black
                        }}
                      >
                        {
                          item?.delivery_types.filter(
                            (val2) =>
                              (sel_types || item?.sel_types) == val2?.code
                          )[0]?.rate
                        }
                      </Text>
                      <FastImage
                        style={{
                          width: moderateScale(10),
                          height: moderateScale(10), 
                          
                          
                        }}
                        source={imagePath.icDropdown4}tintColor={isDarkMode?colors.white:colors.black}
                        resizeMode="contain"
                      />
                    </View>
                  </ModalDropdown>
                ) : null}
              </>
            )}

            {/* <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.AMOUNT}
              </Text>

              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>
                {currencies?.primary_currency?.symbol}
                {currencyNumberFormatter(
                  Number(
                    item?.payable_amount ? item?.payable_amount : 0,
                  ), appData?.profile?.preferences?.digit_after_decimal
                )}
              </Text>
            </View> */}

            {/* <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.SUBTOTAL}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>{`${currencies?.primary_currency?.symbol}${Number(
                cartData?.gross_paybale_amount,
              ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
            </View>
            {!!cartData?.wallet_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.wallet_amount ? cartData?.wallet_amount : 0,
                ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
              </View>
            )}
            {!!cartData?.loyalty_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.LOYALTY}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
                ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
              </View>
            )}

            {!!cartData?.wallet_amount_used && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.WALLET}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.wallet_amount_used
                    ? cartData?.wallet_amount_used
                    : 0,
                ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
              </View>
            )}
            {!!cartData?.total_subscription_discount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.TOTALSUBSCRIPTION}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.total_subscription_discount,
                ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
              </View>
            )} */}

            {/* {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
            </View>
          )} */}

            {/* {!!appData?.profile?.preferences?.tip_before_order &&
              !!cartData?.tip &&
              cartData?.tip.length && (
                <View
                  style={[
                    styles.bottomTabLableValue,
                    {
                      flexDirection: 'column',
                      marginTop: moderateScaleVertical(8),
                    },
                  ]}>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.priceTipLabel,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : [styles.priceTipLabel]
                    }>
                    {strings.DOYOUWANTTOGIVEATIP}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}>
                    {cartData?.total_payable_amount !== 0 &&
                      cartData?.tip.map((j, jnx) => {
                        return (
                          <TouchableOpacity
                            key={String(jnx)}
                            style={[
                              styles.tipArrayStyle,
                              {
                                backgroundColor:
                                  selectedTipvalue?.value == j?.value
                                    ? themeColors.primary_color
                                    : 'transparent',
                                flex: 0.18,
                              },
                            ]}
                            onPress={() => selectedTip(j)}>
                            <Text
                              style={
                                isDarkMode
                                  ? {
                                      color:
                                        selectedTipvalue?.value == j?.value
                                          ? colors.white
                                          : MyDarkTheme.colors.text,
                                    }
                                  : {
                                      color:
                                        selectedTipvalue?.value == j?.value
                                          ? colors.white
                                          : colors.black,
                                    }
                              }>
                              {`${currencies?.primary_currency?.symbol} ${j.value}`}
                            </Text>
                            <Text
                              style={{
                                color:
                                  selectedTipvalue?.value == j?.value
                                    ? colors.white
                                    : colors.textGreyB,
                              }}>
                              {j.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}

                    <TouchableOpacity
                      style={[
                        styles.tipArrayStyle2,
                        {
                          backgroundColor:
                            selectedTipvalue == 'custom'
                              ? themeColors.primary_color
                              : 'transparent',
                          flex:
                            cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                        },
                      ]}
                      onPress={() => selectedTip('custom')}>
                      <Text
                        style={
                          isDarkMode
                            ? {
                                color:
                                  selectedTipvalue == 'custom'
                                    ? colors.white
                                    : MyDarkTheme.colors.text,
                              }
                            : {
                                color:
                                  selectedTipvalue == 'custom'
                                    ? colors.white
                                    : colors.black,
                              }
                        }>
                        {strings.CUSTOM}
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>

                  {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                    <View
                      style={{
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: colors.textGreyB,
                        height: 40,
                        marginTop: moderateScaleVertical(8),
                      }}>
                      <TextInput
                        value={selectedTipAmount}
                        onChangeText={(text) =>
                          updateState({selectedTipAmount: text})
                        }
                        style={{
                          height: 40,
                          alignItems: 'center',
                          paddingHorizontal: 10,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}
                        maxLength={5}
                        returnKeyType={'done'}
                        keyboardType={'number-pad'}
                        placeholder={strings.ENTER_CUSTOM_AMOUNT}
                        placeholderTextColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7
                        }
                      />
                    </View>
                  )}
                </View>
              )} */}

            {/* {!!cartData?.total_tax && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.TAX_AMOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.total_tax ? cartData?.total_tax : 0,
                ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
              </View>
            )}

            <View style={styles.amountPayable}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.AMOUNT_PAYABLE}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${(
                Number(cartData?.total_payable_amount) +
                (selectedTipAmount != null && selectedTipAmount != ''
                  ? Number(selectedTipAmount)
                  : 0)
              ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
            </View> */}
          </View>
        </View>
      </View>
    );
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      console.log(data,'type--->')
      setType(type);
      updateState({
        updateData: data,
        isVisible: visible,
        selectedId: id,
      });
    } else {
      setAppSessionRedirection();
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    updateState({ selectViaMap: false });
    if (!!userData?.auth_token) {
      updateState({ isVisible: false });
      setTimeout(() => {
        setType(type);
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          selectedId: id,
        });
      }, 1000);
    } else {
      setAppSessionRedirection();
    }
  };

  const selectedTip = (tip) => {
    console.log(tip, "tip?");
    if (tip == "custom") {
      setSelectedTipvalue(tip);
      setSelectedTipAmount(null);
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        setSelectedTipvalue(null);
        setSelectedTipAmount(null);
      } else {
        setSelectedTipvalue(tip);
        setSelectedTipAmount(tip?.value);
      }
    }
  };

  const _onGiftBoxSelection = () => {
    updateState({ isGiftBoxSelected: !isGiftBoxSelected });
  };

  //get footer start
  const getFooter = () => {
    return (
      <View style={{}}>
        {!!cartData?.category_kyc_count && (
          <ButtonComponent
            onPress={onCategoryKYC}
            btnText={strings.CATEGORY_KYC}
            borderRadius={moderateScale(13)}
            textStyle={{ color: colors.white, textTransform: "none" }}
            containerStyle={{
              ...styles.placeOrderButtonStyle,
              marginHorizontal: moderateScale(10),
            }}
            placeLoader={false}
          />
        )}

        <TextInput
          value={instruction}
          onChangeText={(text) => setInstruction(text)}
          multiline={true}
          numberOfLines={4}
          style={{
            ...styles.instructionView,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyNew,
          }}
          placeholderTextColor={
            isDarkMode ? colors.textGreyB : colors.textGreyB
          }
          placeholder={strings.SPECIAL_INSTRUCTION}
          returnKeyType={"next"}
        />

        {/* Laundry Section only */}
        {!!(businessType == "laundry") && (
          <View style={styles.laundrySection}>
            <View>
              <View style={{ flex: 0.5, flexWrap: "wrap" }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          { color: MyDarkTheme.colors.text },
                        ]
                      : styles.LaundryApppriceItemLabel
                  }
                >
                  {strings.COMMENTFORPICKUPDRIVER}
                </Text>
              </View>
              <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
                <TextInput
                  value={pickupDriverComment}
                  onChangeText={(text) => setPickupDriverComment(text)}
                  placeholder={strings.PLACEHOLDERCOMMENTFORPICKUPDRIVER}
                  style={{
                    height: 40,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={"done"}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{ marginTop: moderateScale(15) }}>
              <View style={{ flex: 0.5, flexWrap: "wrap" }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          { color: MyDarkTheme.colors.text },
                        ]
                      : styles.LaundryApppriceItemLabel
                  }
                >
                  {strings.COMMENTFORDROPUPDRIVER}
                </Text>
              </View>
              <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
                <TextInput
                  value={dropOffDriverComment}
                  onChangeText={(text) => setDropOffDriverComment(text)}
                  placeholder={strings.PLACEHOLDERCOMMENTFORDROPUPDRIVER}
                  style={{
                    height: 40,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={"done"}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{ marginTop: moderateScale(15) }}>
              <View style={{ flex: 0.5, flexWrap: "wrap" }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          { color: MyDarkTheme.colors.text },
                        ]
                      : styles.LaundryApppriceItemLabel
                  }
                >
                  {strings.COMMENTFORVENDOR}
                </Text>
              </View>
              <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
                <TextInput
                  placeholder={strings.PLACEHOLDERCOMMENTFORVENDOR}
                  value={vendorComment}
                  onChangeText={(text) => setVendorComment(text)}
                  style={{
                    height: 40,
                    alignItems: "center",
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={"done"}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: moderateScale(20),
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => _selectTimeLaundry("pickup")}
                style={{ flex: 0.5, flexDirection: "row" }}
              >
                <Image source={imagePath.pickUpSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            { color: MyDarkTheme.colors.text },
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }
                  >
                    {strings.SCEDULEPICKUP}
                  </Text>
                  {/* Schedule Pickup */}
                  {laundrySelectedPickupDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.LaundryApppriceItemLabel3,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedPickupDate
                        ? laundrySelectedPickupDate
                        : ""}
                      {", "}
                      {laundrySelectedPickupSlot
                        ? laundrySelectedPickupSlot
                        : ""}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => _selectTimeLaundry("dropoff")}
                style={{ flex: 0.5, flexDirection: "row" }}
              >
                <Image source={imagePath.dropOffSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            { color: MyDarkTheme.colors.text },
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }
                  >
                    {strings.SCEDULEDROP}
                  </Text>

                  {!!(businessType !== "laundry" && localeDropOffDate) && (
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                              styles.LaundryApppriceItemLabel3,
                              { color: MyDarkTheme.colors.text },
                            ]
                          : styles.LaundryApppriceItemLabel3
                      }
                    >
                      {localeDropOffDate
                        ? localeDropOffDate
                        : strings.SCEDULEDROP}
                    </Text>
                  )}

                  {laundrySelectedDropOffDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.LaundryApppriceItemLabel3,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedDropOffDate
                        ? laundrySelectedDropOffDate
                        : ""}
                      {", "}
                      {laundrySelectedDropOffSlot
                        ? laundrySelectedDropOffSlot
                        : ""}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* tip_before_order view start */}

        {!!appData?.profile?.preferences?.tip_before_order &&
          !!cartData?.tip &&
          cartData?.tip.length > 0 && (
            <View
              style={[
                styles.bottomTabLableValue,
                {
                  flexDirection: "column",
                },
              ]}
            >
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(14),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyB,
                }}
              >
                {preferences?.want_to_tip_nomenclature != "" &&
                preferences?.want_to_tip_nomenclature != null
                  ? preferences?.want_to_tip_nomenclature
                  : "Add Tip"}
              </Text>

              <Text
                style={{
                  ...styles.priceTipLabel,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyB,
                }}
              >
                Select tip amount
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {cartData?.total_payable_amount !== 0 &&
                  cartData?.tip?.map((j, jnx) => {
                    return (
                      <LinearGradient
                        // colors={["#A4CD3E", "rgba(100,183,236,0.85)"]}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 1,
                          marginRight: 5,
                          marginTop: moderateScaleVertical(8),
                          borderRadius: moderateScale(5),
                        }}
                      >
                        <TouchableOpacity
                          key={String(jnx)}
                          onPress={() => selectedTip(j)}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: moderateScaleVertical(8),
                            paddingVertical: 5,
                            borderRadius: moderateScale(5),
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? colors.transparent
                                : isDarkMode
                                ? MyDarkTheme.colors.lightDark
                                : colors.white,
                          }}
                        >
                          <Text
                            style={
                              isDarkMode
                                ? {
                                    color:
                                      selectedTipvalue?.value == j?.value
                                        ? colors.white
                                        : MyDarkTheme.colors.text,
                                  }
                                : {
                                    color:
                                      selectedTipvalue?.value == j?.value
                                        ? colors.white
                                        : colors.black,
                                  }
                            }
                          >
                            {`${currencies?.primary_currency?.symbol} ${j.value}`}
                          </Text>
                          <Text
                            style={{
                              color:
                                selectedTipvalue?.value == j?.value
                                  ? colors.white
                                  : colors.textGreyB,
                            }}
                          >
                            {j.label}
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    );
                  })}

                {cartData?.total_payable_amount !== 0 && (
                  <LinearGradient
                    // colors={["#A4CD3E", "rgba(100,183,236,0.85)"]}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 1,
                      marginRight: 5,
                      marginTop: moderateScaleVertical(8),
                      borderRadius: moderateScale(5),
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: moderateScaleVertical(8),
                        paddingVertical: 5,
                        borderRadius: moderateScale(5),
                        backgroundColor:
                          selectedTipvalue == "custom"
                            ? colors.transparent
                            : isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.white,
                      }}
                      onPress={() => selectedTip("custom")}
                    >
                      <Text
                        style={
                          isDarkMode
                            ? {
                                color:
                                  selectedTipvalue == "custom"
                                    ? colors.white
                                    : MyDarkTheme.colors.text,
                              }
                            : {
                                color:
                                  selectedTipvalue == "custom"
                                    ? colors.white
                                    : colors.black,
                              }
                        }
                      >
                        {strings.CUSTOM}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </ScrollView>

              {!!selectedTipvalue && selectedTipvalue == "custom" && (
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: colors.textGreyB,
                    height: 40,
                    marginTop: moderateScaleVertical(8),
                  }}
                >
                  <TextInput
                    value={selectedTipAmount}
                    onChangeText={(text) => setSelectedTipAmount(text)}
                    style={{
                      height: 40,
                      alignItems: "center",
                      paddingHorizontal: 10,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}
                    maxLength={5}
                    returnKeyType={"done"}
                    keyboardType={"number-pad"}
                    placeholder={strings.ENTER_CUSTOM_AMOUNT}
                    placeholderTextColor={
                      isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7
                    }
                  />
                </View>
              )}
            </View>
          )}
        {/* tip_before_order view end */}

        {appData?.profile?.preferences?.gifting == 1 && (
          <View
            style={{
              borderTopWidth: 0.8,
              borderBottomWidth: 0.8,
              paddingVertical: moderateScaleVertical(8),
              borderColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          >
            <TouchableOpacity
              onPress={_onGiftBoxSelection}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 16,
              }}
              activeOpacity={1}
            >
              <Image
                style={{ tintColor: themeColors.primary_color }}
                source={
                  isGiftBoxSelected
                    ? imagePath.checkBox2Active
                    : imagePath.checkBox2InActive
                }
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: moderateScale(12),
                }}
              >
                <Image
                  source={imagePath.icGiftIcon}
                  style={{
                    marginTop: moderateScale(-3),
                    tintColor: colors.blackOpacity43,
                  }}
                />
                <Text
                  style={{
                    ...styles.priceTipLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    marginLeft: moderateScale(6),
                  }}
                >
                  {strings.DOES_THIS_INCLUDE_GIFT}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <Text
          style={{
            fontFamily: fontFamily.medium,
            fontSize: textScale(17),
            marginHorizontal: moderateScale(18),
            marginBottom: moderateScale(5),
            marginTop: moderateScaleVertical(20),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
          }}
        >
          Payment Summary
        </Text>
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }
          >
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }
          >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
            Number(cartData?.gross_paybale_amount),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>

        {/* total_delivery_fee */}
        {!!cartData?.total_delivery_fee ? (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {appIds?.meatEasy == DeviceInfo.getBundleId()
                ? strings?.DELIVERY_FEE
                : strings.TOTAL_DELIVERY_FEE}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(
                cartData?.total_delivery_fee ? cartData?.total_delivery_fee : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        ) : null}

        {!!cartData?.wallet_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(cartData?.wallet_amount ? cartData?.wallet_amount : 0),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.TOTAL_DISCOUNT}</Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.total_discount_amount
                  ? cartData?.total_discount_amount
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!cartData?.loyalty_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(cartData?.loyalty_amount ? cartData?.loyalty_amount : 0),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!Number(cartData?.total_fixed_fee_amount) && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {preferences?.fixed_fee_nomenclature != "" &&
              preferences?.fixed_fee_nomenclature != null
                ? preferences?.fixed_fee_nomenclature
                : strings.FIXED_FEE}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(
                cartData?.total_fixed_fee_amount
                  ? cartData?.total_fixed_fee_amount
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!Number(cartData?.total_container_charges) && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {strings.TOTALCONTAINERCHARGES}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
              Number(cartData?.total_container_charges),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {!!cartData?.total_subscription_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >
              {strings.TOTALSUBSCRIPTION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(cartData?.total_subscription_discount),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {(cartData?.total_tax > 0 || cartData?.total_service_fee > 0) && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}
                >
                  {strings.TAXES_FEES}
                </Text>

                <Image
                  source={imagePath.dropDownNew}
                  style={{
                    transform: [{ scaleY: showTaxFeeArea ? -1 : 1 }],
                    marginHorizontal: moderateScale(2),
                  }}
                />
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }
            >{`${currencies?.primary_currency?.symbol} ${(
              Number(cartData?.total_tax ? cartData?.total_tax : 0) +
              Number(
                cartData?.total_service_fee ? cartData?.total_service_fee : 0
              )
            ).toFixed(
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </Animatable.View>
        )}
        {showTaxFeeArea && (
          <View>
            <Animatable.View
              animation="fadeIn"
              style={{ marginLeft: moderateScale(15) }}
            >
              {cartData?.total_service_fee > 0 && (
                <View
                  style={{ ...styles.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {strings.TOTAL_SERVICE_FEE}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_service_fee
                      ? cartData?.total_service_fee
                      : 0
                  ).toFixed(
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}</Text>
                </View>
              )}
              {cartData?.total_tax > 0 && (
                <View
                  style={{ ...styles.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {strings.TAX_AMOUNT}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >{`${currencies?.primary_currency?.symbol}${Number(
                    cartData?.total_tax ? cartData?.total_tax : 0
                  ).toFixed(
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}</Text>
                </View>
              )}
            </Animatable.View>
          </View>
        )}
        <View
          style={{
            marginHorizontal: moderateScale(18),

            borderStyle: "dashed",
            borderColor: "#979797",
            borderWidth: 0.5,
          }}
        />

        <View style={styles.amountPayable}>
          <Text
            style={{
              ...styles.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.medium,
              fontSize: textScale(17),
            }}
          >
            Total
          </Text>
          <Text
            style={{
              ...styles.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.medium,
              fontSize: textScale(17),
            }}
          >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
            Number(cartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ""
                ? Number(selectedTipAmount)
                : 0),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>

        {cartData &&
          Number(cartData?.total_payable_amount) +
            (selectedTipAmount != null && selectedTipAmount != ""
              ? Number(selectedTipAmount)
              : 0) >
            0 && (
            <TouchableOpacity
              onPress={() =>
                !!userData?.auth_token
                  ? updateState({ paymentModal: true })
                  : setAppSessionRedirection()
              }
              style={{
                ...styles.paymentMainView,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : "rgba(188,219,121,0.32)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FastImage
                  source={imagePath.paymentMethod}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(32),
                    height: moderateScale(32),
                  }}
                  tintColor={
                    isDarkMode ? MyDarkTheme.colors.text : colors.black
                  }
                />

                <Text
                  style={{
                    ...styles.priceItemLabel2,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    marginLeft: moderateScale(4),
                  }}
                >
                  {selectedPayment.title_lng
                    ? selectedPayment.title_lng
                    : selectedPayment.title
                    ? selectedPayment.title
                    : "Payment Method "}
                </Text>
              </View>
              <View>
                <FastImage
                  source={imagePath.goRight}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(14),
                    height: moderateScale(14),
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  tintColor={
                    isDarkMode ? MyDarkTheme.colors.text : colors.black
                  }
                  transform={[{ scaleX: I18nManager.isRTL ? -1 : 1 }]}
                />
              </View>
            </TouchableOpacity>
          )}

        {!!(
          userData?.auth_token &&
          !appData?.profile?.preferences?.off_scheduling_at_cart &&
          businessType !== "laundry"
        ) &&
          !!(scheduleType == "schedule" && localeSheduledOrderDate) && (
            <TouchableOpacity
              style={{
                marginTop: moderateScale(16),
                marginLeft: moderateScale(16),
                alignSelf: "flex-start",
              }}
              onPress={clearSceduleDate}
            >
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  color: themeColors.primary_color,
                  textAlign: "left",
                }}
              >
                {strings.CLEAR_SCHEDULE_DATE}
              </Text>
            </TouchableOpacity>
          )}

        {!!cartData?.deliver_status ||
        cartData?.closed_store_order_scheduled ? (
          <View
            pointerEvents={placeLoader ? "none" : "auto"}
            style={styles.paymentView}
          >
            {
              // !!(
              //   userData?.auth_token &&
              //   !appData?.profile?.preferences?.off_scheduling_at_cart &&
              //   businessType !== "laundry"
              // )
              true && (
                <LinearGradient
                  colors={["#A4CD3E", "rgba(100,183,236,0.85)"]}
                  style={{
                    padding: 1,
                    flex: 1,
                    marginHorizontal: moderateScale(5),
                    borderRadius: moderateScale(13),
                  }}
                >
                  <ButtonComponent
                    onPress={_selectTime}
                    btnText={
                      localeSheduledOrderDate
                        ? localeSheduledOrderDate
                        : strings.SCHEDULE_ORDER
                    }
                    borderRadius={moderateScale(0)}
                    textStyle={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}
                    containerStyle={{
                      ...styles.placeOrderButtonStyle,
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                    }}
                  />
                </LinearGradient>
              )
            }

            <GradientButton
              colorsArray={["#A4CD3E", "rgba(100,183,236,0.85)"]}
              onPress={placeOrder}
              btnText={strings.PLACE_ORDER}
              borderRadius={moderateScale(13)}
              textStyle={{ color: colors.black }}
              containerStyle={styles.placeOrderButtonStyle}
              placeLoader={placeLoader}
            />
          </View>
        ) : null}
        {!!cartData &&
          !!cartData?.upSell_products &&
          !!cartData?.upSell_products.length > 0 && (
            <View
              style={{
                ...styles.suggetionView,
                marginTop: cartData?.deliver_status ? 0 : moderateScale(10),
              }}
            >
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
              >
                {strings.FREQUENTLY_BOUGHT_TOGETHER}
              </Text>
              <View style={{ height: moderateScaleVertical(16) }} />
              <FlatList
                data={cartData?.upSell_products || []}
                renderItem={_renderUpSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        {!!cartData &&
          !!cartData?.crossSell_products &&
          !!cartData?.crossSell_products.length > 0 && (
            <View style={{ ...styles.suggetionView }}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
              >
                {strings.YOU_MIGHT_INTERESTED}
              </Text>
              <View style={{ height: moderateScaleVertical(16) }} />
              <FlatList
                data={cartData?.crossSell_products || []}
                renderItem={_renderCrossSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        <View
          style={{
            height: moderateScaleVertical(80),
            backgroundColor: colors.transparent,
          }}
        />
      </View>
    );
  };

  console.log("selectedAddressData", selectedAddressData);

  //end footer

  //Header section of cart screen

  const homeType = (data) => {
    let value = strings.HOME;
    if (!!vendorAddress) {
      return (value = strings.HOME_1);
    }
    // vendorAddress
    // ? strings.HOME_1
    // : selectedAddressData.type
    //   ? strings.HOME
    //   : strings.ADD_ADDRESS
    switch (data?.type) {
      case 1:
        value = strings.HOME;
        break;
      case 2:
        value = strings.WORK;
        break;
      case 3:
        value = data?.type_name;
        break;
      default:
        value = strings.ADD_ADDRESS;
        break;
    }
    return value;
  };
  const getHeader = () => {
    return (
      <TouchableOpacity
        disabled={!!vendorAddress}
        onPress={() => setModalVisible(true)}
        style={{
          ...styles.topLable,
          marginVertical: moderateScale(7),
          justifyContent: "space-between",
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : null,
        }}
      >
        <View style={{ flexDirection: "row", flex: 0.85 }}>
          <FastImage
            source={imagePath.mapIcon}
            resizeMode="contain"
            style={{
              width: moderateScale(50),
              height: moderateScale(50),
            }}
          />
          <View style={styles.addressView}>
            <Text
              style={{
                ...styles.homeTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {homeType(selectedAddressData)}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                ...styles.addAddressTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginTop: moderateScaleVertical(4),
              }}
            >
              {vendorAddress
                ? vendorAddress
                : selectedAddressData
                ? `${
                    !!selectedAddressData?.house_number
                      ? selectedAddressData?.house_number + ",  "
                      : ""
                  }${selectedAddressData?.address}`
                : strings.TAP_HERE_ADD_ADDRESS}
            </Text>
          </View>
        </View>
        {!vendorAddress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            <FastImage
              source={imagePath.icEdit1}
              resizeMode="contain"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert("", strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => {},
        // style: 'destructive',
      },
      { text: strings.CONFIRM, onPress: () => bottomButtonClick() },
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    if (!!userData?.auth_token) {
      // updateState({ isLoadingB: true });
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          actions.saveAddress(address);
          setSelectedAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            placeLoader: false,
          });
        })
        .catch(errorMethod);
    }
  };

  //Add and update the addreess
  const addUpdateLocation = (childData) => {
    // setModalVisible(false);
    updateState({ isLoading: true });
    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
          placeLoader: false,
          selectViaMap: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address["is_primary"] = 1;
          setSelectedAddress(address);
          actions.saveAddress(address);
        });
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        showError(error?.message || error?.error);
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  const onClose = () => {
    setSelectedDateFromCalendar("");
    setSelectedTimeSlots("");
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const onDateChangeSecond = (value) => {
    if (modalType == "pickup") {
      setLocalPickupDate(
        `${value.toLocaleDateString(selectedLanguage, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      setSheduledpickupdate(value);
    } else {
      setLocaleDropOffDate(
        `${value.toLocaleDateString(selectedLanguage, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      setSheduleddropoffdate(value);
    }
  };

  const onDateChange = (value) => {
    setSheduledorderdate(value);
    setScheduleType("schedule");
    setLocaleSheduledOrderDate(
      `${value.toLocaleDateString(selectedLanguage, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}, ${value.toLocaleTimeString(selectedLanguage, {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
    setDateAndTimeSchedule(false, "schedule", value);
  };

  useEffect(() => {
    if (!!checkCartItem?.data) {
      console.log("useEffect 5");
      getItem("deepLinkUrl")
        .then((res) => {
          if (res) {
            let table_number = getParameterByName("table", res);
            setDeepLinkUrl(table_number);
          }
        })
        .catch(errorMethod);
    }
  }, [deepLinkUrl]);

  const _onTableSelection = (item) => {
    const data = {
      vendor_id: item.vendor_id,
      table: item?.id,
    };
    _vendorTableCart(data, item);
  };

  const _vendorTableCart = (data, item) => {
    if (!!userData?.auth_token) {
      actions
        .vendorTableCart(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          removeItem("deepLinkUrl");
          setItem("selectedTable", item?.label);
        })
        .catch(errorMethod);
      return;
    }
    return;
  };

  const onPressRecommendedVendors = (item) => {
    if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: true,
            name: item?.name,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const renderRecommendedVendors = ({ item, index }) => {
    return (
      <View
        key={String(index)}
        style={{
          width: moderateScale(width / 2),
          marginLeft: moderateScale(5),
        }}
      >
        <MarketCard3
          data={item}
          extraStyles={{
            marginTop: 0,
            marginVertical: moderateScaleVertical(2),
          }}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="cover"
          onPress={() => onPressRecommendedVendors(item)}
          isMaxSaftey={false}
        />
      </View>
    );
  };

  const ListEmptyComp = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: '#fff',
          }}
        >
          {appIds.codiner == DeviceInfo.getBundleId() ? (
            <FastImage
              source={{
                uri: Image.resolveAssetSource(imagePath.emptyCart3).uri,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              style={{
                marginVertical: moderateScaleVertical(20),
                height: moderateScale(120),
                width: moderateScale(140),
              }}
              resizeMode="contain"
            />
          ) : (
            <FastImage
              source={{
                uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              style={{
                marginVertical: moderateScaleVertical(20),
                height: moderateScale(120),
                width: moderateScale(120),
              }}
              tintColor={isDarkMode && colors.white}
              // resizeMode="contain"s
            />
          )}

          <Text
            style={{
              ...styles.textStyle,
              color: isDarkMode ? colors.white : colors.blackOpacity40,
            }}
          >
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />
        {wishlistArray.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {strings.SHOP_FROM_WISHLIST}
            </Text>
            {wishlistArray.map((val, i) => {
              return (
                <View key={String(i)}>
                  <WishlistCard
                    data={val.product}
                    onPress={moveToNewScreen(
                      navigationStrings.PRODUCTDETAIL,
                      val.product
                    )}
                  />
                </View>
              );
            })}
          </View>
        )}
        <View style={{ marginVertical: moderateScaleVertical(8) }} />

        {recommendedVendorsdata && recommendedVendorsdata.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {strings.RECOMMENDED_VENDORS}
            </Text>
            <FlatList
              horizontal
              data={recommendedVendorsdata}
              extraData={recommendedVendorsdata}
              renderItem={renderRecommendedVendors}
              keyExtractor={(item, index) => item?.id.toString()}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </View>
        )}

        <View style={{ marginBottom: moderateScale(100) }} />
      </View>
    );
  };
  const renderCardItemLoader = () => {
    return (
      <View>
        <HeaderLoader
          widthLeft={moderateScale(140)}
          rectWidthLeft={moderateScale(140)}
          heightLeft={15}
          rectHeightLeft={15}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(30),
          }}
          isRight={false}
        />
        <ProductListLoader
          widthLeft={moderateScale(100)}
          mainView={{
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(5),
            alignItems: "flex-start",
          }}
        />
        <HeaderLoader
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScale(35)}
          rectHeightLeft={moderateScale(35)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
          isRight={false}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(8),
          }}
        />
      </View>
    );
  };

  console.log("sheduledorderdate+++", sheduledorderdate);

  if (isLoadingB) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
      >
        <Header
          centerTitle={strings.CART}
          noLeftIcon
          leftIcon={imagePath.icBackFab}
        />
        {/* <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri}}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

            // resizeMode="contain"s
          />
          <Text style={{...styles.textStyle}}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: "center",
            }}

            // resizeMode="contain"s
          />
          {renderCardItemLoader()}
          {renderCardItemLoader()}
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{ flexDirection: "row" }}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
    );
  }

  const _renderUpSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const _renderCrossSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const checkVendorSlots = async (date) => {
    if (businessType == "laundry") {
      if (modalType !== "pickup") {
        try {
          let vendorId = cartItems[0].vendor.id;
          // vendor_id,date,delivery
          const res = await actions.getVendorDropoffSlots(
            `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
            {},
            {
              code: appData?.profile?.code,
              timezone: RNLocalize.getTimeZone(),
            }
          );
          setCheckSloatLoading(false);
          setLaundryAvailableDropOffSlot(res);
        } catch (error) {
          setCheckSloatLoading(false);

          console.log("error riased", error);
        }
        return;
      }
    }

    try {
      let vendorId = cartItems[0].vendor.id;
      // vendor_id,date,delivery
      const res = await actions.checkVendorSlots(
        `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
        {
          code: appData?.profile?.code,
          // currency: currencies?.primary_currency?.id,
          // language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
          // device_token: DeviceInfo.getUniqueId(),
        }
      );
      console.log("avail slots++", res);
      if (modalType == "pickup") {
        setLaundryAvailablePickupSlot(res);
      }
      setAvailableTimeSlots(res);
      if (res.length == 0) {
        setSelectedTimeSlots("");
      }
      setCheckSloatLoading(false);
    } catch (error) {
      setCheckSloatLoading(false);

      console.log("error riased", error);
    }
  };
  const onSelectTime = (item) => {
    if (businessType == "laundry") {
      if (modalType == "pickup") {
        setLaundrySelectedPickupSlot(item?.value);
      } else {
        setLaundrySelectedDropOffSlot(item?.value);
      }
    } else {
      setSelectedTimeSlots(item?.value);
    }
  };

  console.log(selectedTimeSlots, "SelectedTimeSlots");
  const onSelectPayment = (data) => {
    console.log("my data++++", data);

    // const [paymentMethodId, setPaymentMethodId] = useState(null);
    setPaymentMethodId(data?.payment_method_id);
    setSelectedPayment(data?.selectedPaymentMethod);
    if (!!data?.cardInfo) {
      setCardInfo(data?.cardInfo);
    }
    if (!!data?.tokenInfo) {
      setTokenInfo(data?.tokenInfo);
    }
  };

  const isSlotSelected = (item) => {
    if (selectedTimeSlots == item.value) {
      return true;
    } else {
      return false;
    }
  };

  const isSlotSelected1 = (item) => {
    if (laundrySelectedPickupSlot == item.value) {
      return true;
    } else {
      return false;
    }
  };

  const isSlotSelected2 = (item) => {
    if (laundrySelectedDropOffSlot == item.value) {
      return true;
    } else {
      return false;
    }
  };

  const renderTimeSlots = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor:
            businessType == "laundry"
              ? isSlotSelected1(item)
                ? themeColors?.primary_color
                : colors.white
              : isSlotSelected(item)
              ? themeColors.primary_color
              : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth:
            businessType == "laundry"
              ? isSlotSelected1(item)
                ? 0
                : 1
              : isSlotSelected(item)
              ? 0
              : 1,
          borderColor: colors.borderColorGrey,
        }}
      >
        <Text
          style={{
            color:
              businessType == "laundry"
                ? isSlotSelected1(item)
                  ? colors.white
                  : colors.black
                : isSlotSelected(item)
                ? colors.white
                : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}
        >
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlots2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor: isSlotSelected2(item)
            ? themeColors.primary_color
            : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth: isSlotSelected2(item) ? 0 : 1,
          borderColor: colors.borderColorGrey,
        }}
      >
        <Text
          style={{
            color: isSlotSelected2(item) ? colors.white : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}
        >
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const onSelectDateFromCalendar = (day) => {
    setCheckSloatLoading(true);
    setSelectedDateFromCalendar(day.dateString);
    setScheduleType("schedule");
    setModalType("schedule");
    setSheduledorderdate(day.dateString);
    checkVendorSlots(day.dateString);
  };

  const laundrySlotSelection = (day) => {
    setCheckSloatLoading(true);

    if (modalType == "pickup") {
      setLaundrySelectedPickupDate(day.dateString);
      setLaundrySelectedPickupSlot("");
    } else {
      setLaundrySelectedDropOffDate(day.dateString);
      setLaundrySelectedDropOffSlot("");
    }
    // setScheduleType('schedule');
    // setModalType('schedule');
    checkVendorSlots(day.dateString);
  };

  const openCloseMapAddress = (type) => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };

  const renderProductForm = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            maxHeight: height / 2,
            minHeight: moderateScaleVertical(250),
            borderTopLeftRadius: moderateScale(16),
            borderTopRightRadius: moderateScale(16),
            backgroundColor: colors.white,
            padding: moderateScale(12),
          }}
        >
          {isProductLoader ? (
            <View>
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: isDarkMode ? colors.black : colors.white,
                borderRadius: moderateScale(8),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text />

                <TouchableOpacity onPress={closeForm}>
                  <Image source={imagePath.closeButton} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {productFaqs.map((item, index) => {
                  setAllRequiredQuestions(item, index);
                  return (
                    <View
                      style={{
                        marginTop: moderateScaleVertical(10),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            marginBottom: moderateScaleVertical(10),
                            color: colors.redColor,
                          }}
                        >
                          {`${item?.is_required ? "* " : ""}`}
                        </Text>
                        <Text
                          style={{
                            marginBottom: moderateScaleVertical(10),
                            fontFamily: fontFamily.medium,
                            color: isDarkMode ? colors.white : colors.blackC,
                          }}
                        >
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
                        }}
                      >
                        <TextInput
                          placeholder={strings.ANSWER}
                          onChangeText={(text) =>
                            onChangeText(item, text, index, item?.length)
                          }
                          style={{
                            ...styles.insctructionText,
                            color: isDarkMode ? colors.textGreyB : colors.black,
                          }}
                          placeholderTextColor={
                            isDarkMode
                              ? colors.textGreyB
                              : colors.blackOpacity40
                          }
                        />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={{
                  textTransform: "none",
                  fontSize: textScale(12),
                }}
                indicator={isSubmitFaqLoader}
                indicatorColor={colors.white}
                onPress={setAllFormData}
                btnText={strings.SUBMIT}
                marginTop={moderateScaleVertical(16)}
                marginBottom={moderateScaleVertical(16)}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  };

  // Category KYC start

  const onCategoryKYC = () => {
    updateState({
      isCategoryKyc: true,
      isCategoryKycLoader: true,
    });
    actions
      .getCategoryKycDocument(
        {
          category_ids: cartData?.category_ids,
        },
        { code: appData?.profile?.code }
      )
      .then((res) => {
        console.log(res?.data, "res?.data>>>");
        setKycTxtInpts(res?.data.filter((x) => x?.file_type == "Text"));
        setKycImages(res?.data.filter((x) => x?.file_type == "Image"));
        setKycPdfs(res?.data.filter((x) => x?.file_type == "Pdf"));

        updateState({
          isCategoryKycLoader: false,
        });
      })
      .catch(errorMethod);
  };

  const showActionSheet = () => {
    actionSheet.current.show();
  };
  const updateImages = (type, index) => {
    addtionSelectedImageIndex = index;
    addtionSelectedImage = type;
    showActionSheet(false);
  };

  const getDoc = async (value, index) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      let data = cloneDeep(kycPdfs);
      if (res) {
        data[index].value = res[0].uri;
        data[index].filename = res[0].name;
        data[index].fileData = res[0];
        setKycPdfs(data);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: "photo",
        })
          .then((res) => {
            if (isPrescriptionModal) {
              let imgData = [...selectedPrescriptionImgs];
              const isFound = imgData.some(
                (item) => item?.filename == res?.filename
              );
              if (isFound) {
                alert("File already uploaded");
                return;
              }
              imgData.push({
                mime: res?.mime,
                path: res?.path,
                filename: res?.filename,
              });
              setPrescriptionImgs(imgData);
              return;
            }

            let data = cloneDeep(kycImages);
            data[addtionSelectedImageIndex].value = res?.sourceURL || res?.path;
            data[addtionSelectedImageIndex].fileData = res;
            setKycImages(data);
          })
          .catch((err) => {
            console.log(err, "err>>>>");
          });
      }
    }
  };

  const onSubmitKycDocs = () => {
    let formdata = new FormData();
    formdata.append("category_ids", cartData?.category_ids);
    var isRequired = true;
    if (!isEmpty(kycTxtInpts)) {
      kycTxtInpts.map((i, inx) => {
        if (i?.contents != "" && !!i?.contents) {
          formdata.append(i?.translations[0].slug, i?.contents);
        } else if (i?.is_required) {
          if (isRequired) {
            alert(
              `${strings.PLEASE_ENTER} ${i?.translations[0].name.toLowerCase()}`
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    let concatinatedArray = kycImages.concat(kycPdfs);
    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata.append(
            i?.translations[0].slug,
            i?.file_type == "Image"
              ? {
                  uri: i.fileData.path,
                  name: i.fileData.filename,
                  filename: i.fileData.filename,
                  type: i.fileData.mime,
                }
              : i?.fileData
          );
        } else if (i?.is_required) {
          if (isRequired) {
            alert(
              `${
                strings.PLEASE_UPLOAD
              } ${i?.translations[0].name.toLowerCase()}`
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    if (!isRequired) {
      return;
    }
    updateState({
      isSubmitKycLoader: true,
    });

    console.log(formdata, "formdata>>>");

    actions
      .submitCategoryKYC(formdata, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        console.log(res, "res_submit_Kyc>>>>");
        updateState({
          isCategoryKyc: false,
          isSubmitKycLoader: false,
        });
        showSuccess(res?.message);
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Get TextInput
  const getTextInputField = (type, index) => {
    return (
      <BorderTextInput
        // secureTextEntry={true}
        placeholder={type?.translations[0]?.name || ""}
        // onChangeText={(text) => handleDynamicTxtInput(text, index, type)}
      />
    );
  };

  const getImageFieldView = (type, index) => {
    return (
      <View
        style={{
          marginRight: moderateScale(15),
          marginTop: moderateScale(10),
          width: moderateScale(95),
        }}
      >
        <TouchableOpacity
          onPress={() => updateImages(type, index)}
          style={styles.imageUpload}
        >
          {kycImages[index].value != undefined &&
          kycImages[index].value != null &&
          kycImages[index].value != "" ? (
            <Image
              source={{ uri: kycImages[index].value }}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.icPhoto} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{ ...styles.label3, minHeight: moderateScale(25) }}
        >
          {type?.translations[0]?.name}
          {type.is_required ? "*" : ""}
        </Text>
      </View>
    );
  };

  const getPdfView = (type, index) => {
    return (
      <View
        style={{ marginRight: moderateScale(20), marginTop: moderateScale(20) }}
      >
        <TouchableOpacity
          onPress={() => getDoc(type, index)}
          style={{
            ...styles.imageUpload,
            height: 100,
            width: 100,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: colors.blue,
          }}
        >
          <Text style={styles.uploadStyle}>
            {kycPdfs[index].value != undefined &&
            kycPdfs[index].value != null &&
            kycPdfs[index].value != ""
              ? `${kycPdfs[index].filename}`
              : `+ ${strings.UPLOAD}`}
          </Text>
        </TouchableOpacity>
        <Text style={styles.label3}>
          {type?.translations[0]?.name}
          {type.is_required ? "*" : ""}
        </Text>
      </View>
    );
  };

  const renderCategoryKYC = () => {
    return (
      <View>
        {isCategoryKycLoader ? (
          <View>
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              paddingHorizontal: moderateScale(15),
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: moderateScaleVertical(60),
              }}
            >
              {!isEmpty(kycTxtInpts) &&
                kycTxtInpts.map((item, index) => {
                  return getTextInputField(item, index);
                })}

              {!isEmpty(kycImages) && (
                <View style={styles.viewStyleForUploadImage}>
                  {kycImages.map((item, index) => {
                    return getImageFieldView(item, index);
                  })}
                </View>
              )}

              {!isEmpty(kycPdfs) && (
                <View style={styles.viewStyleForUploadImage}>
                  {kycPdfs.map((item, index) => {
                    return getPdfView(item, index);
                  })}
                </View>
              )}
            </ScrollView>
            <ButtonComponent
              onPress={onSubmitKycDocs}
              btnText={"Submit"}
              borderRadius={moderateScale(13)}
              textStyle={{ color: colors.white }}
              containerStyle={{
                position: "absolute",
                backgroundColor: themeColors.primary_color,
                width: width - moderateScale(30),
                bottom: 10,
              }}
              placeLoader={isSubmitKycLoader}
            />
          </View>
        )}
      </View>
    );
  };

  const onCloseModal = () => {
    setLaundrySelectedPickupSlot("");
    setLaundrySelectedDropOffSlot("");
    setLaundrySelectedDropOffDate(null);
    setLaundrySelectedPickupDate(null);
    setLaundryAvailablePickupSlot([]);
    setLaundryAvailableDropOffSlot([]);
    updateState({
      isVisibleTimeModal: false,
    });
  };
  const onAddPrescriptionDocs = () => {
    showActionSheet();
  };

  const onSubmitPrescriptionDocs = () => {
    if (isEmpty(selectedPrescriptionImgs)) {
      alert("Please upload atleast one image.");
      return;
    }
    setPrescriptionLoading(true);
    let formdata = new FormData();
    formdata.append("vendor_id", selectedItemForPrescription?.vendor_id);
    formdata.append("product_id", selectedItemForPrescription?.product_id);

    selectedPrescriptionImgs.map((item) => {
      formdata.append("prescriptions[]", {
        name: item?.filename,
        type: item?.mime,
        uri: item?.path,
      });
    });

    actions
      .addPrescriptions(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        "Content-Type": "multipart/form-data",
      })
      .then((res) => {
        setPrescriptionImgs([]);
        setPrescriptionLoading(false);
        setPrescriptionModal(false);
        showSuccess(res?.message);
        getCartDetail();
      })
      .catch(errorMethod);
  };

  const onRemovePrescriptionImg = (item, type) => {
    if (type == "API") {
      actions
        .deletePrescriptions(
          {
            prescription_id: item?.prescription_id,
          },
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          }
        )
        .then((res) => {
          setPrescriptionModal(false);
          setTimeout(() => {
            showSuccess(res?.message);
            getCartDetail();
          }, 500);
        })
        .catch(errorMethod);
    }

    const imgData = [...selectedPrescriptionImgs];
    const indexOfObject = imgData.findIndex((object) => {
      return object.filename === item?.filename;
    });
    imgData.splice(indexOfObject, 1);
    setPrescriptionImgs(imgData);
  };

  const renderUploadedPrescriptionImgs = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          marginRight: moderateScale(10),
        }}
      >
        <FastImage
          source={{
            uri: getImageUrl(item?.proxy_url, item?.image_path, "300/300"),
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: width / 4.5,
            width: width / 4.5,
            borderRadius: moderateScale(8),
          }}
        />
        <TouchableOpacity
          hitSlop={hitSlopProp}
          onPress={() => onRemovePrescriptionImg(item, "API")}
          style={{
            position: "absolute",
            right: -2,
            top: 0,
          }}
        >
          <Image
            source={imagePath.crossC}
            style={{
              height: 12,
              width: 12,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPrescriptionModalView = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(14),
          }}
        >
          Prescriptions Details
        </Text>

        <ScrollView>
          {!isEmpty(
            selectedItemForPrescription?.product?.uploaded_prescriptions
          ) && (
            <View>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                  marginVertical: moderateScaleVertical(10),
                  color: colors.blackOpacity70,
                }}
              >
                Added Prescriptions (
                {
                  selectedItemForPrescription?.product?.uploaded_prescriptions
                    .length
                }
                )
              </Text>
              <View>
                <FlatList
                  horizontal
                  data={
                    selectedItemForPrescription?.product
                      ?.uploaded_prescriptions || []
                  }
                  contentContainerStyle={{
                    height: width / 4,
                  }}
                  renderItem={renderUploadedPrescriptionImgs}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          )}

          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              color: colors.blackOpacity70,
              marginVertical: moderateScaleVertical(10),
            }}
          >
            Add Prescriptions
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: width / 4,
              }}
            >
              <TouchableOpacity onPress={onAddPrescriptionDocs}>
                <Image
                  source={imagePath.icAddPlaceholder}
                  style={{
                    height: width / 4.5,
                    width: width / 4.5,
                  }}
                />
              </TouchableOpacity>
              {selectedPrescriptionImgs.map((item) => (
                <View>
                  <Image
                    source={{ uri: item.path }}
                    style={{
                      height: width / 4.5,
                      width: width / 4.5,
                      borderRadius: moderateScale(8),
                      marginLeft: moderateScale(10),
                    }}
                  />
                  <TouchableOpacity
                    hitSlop={hitSlopProp}
                    onPress={() => onRemovePrescriptionImg(item)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: -3,
                    }}
                  >
                    <Image
                      source={imagePath.crossC}
                      style={{
                        height: 12,
                        width: 12,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
        <ButtonWithLoader
          isLoading={isPrescriptionLoading}
          onPress={onSubmitPrescriptionDocs}
          btnText={"Submit"}
          borderRadius={moderateScale(13)}
          textStyle={{ color: colors.white }}
          btnStyle={{
            position: "absolute",
            backgroundColor: themeColors.primary_color,
            width: width - moderateScale(30),
            bottom: 10,
            borderWidth: 0,
          }}
          // placeLoader={}
        />
      </View>
    );
  };

  // Category KYC end

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={deliveryFeeLoader}
    >
      <Header
        centerTitle={strings.CART}
        leftIcon={imagePath.icBackFab}
        isRightText={cartItems && !!cartItems?.length}
        onPressRightTxt={() => openClearCartModal()}
        onPressLeft={() => navigation.navigate(navigationStrings.HOMESTACK)}
      />

<FlatList
        data={cartItems}
        extraData={cartItems}
        ListHeaderComponent={cartItems?.length ? getHeader() : null}
        ListFooterComponent={cartItems?.length ? getFooter() : null}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        // style={{
        //   flex: 1,
        //   backgroundColor: isDarkMode
        //     ? MyDarkTheme.colors.background
        //     : colors.white,
        //   marginTop: moderateScaleVertical(10),
        // }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefreshing}
        //     onRefresh={handleRefresh}
        //     tintColor={themeColors.primary_color}
        //   />
        // }
        // ListEmptyComponent={() => (!isLoadingB ? <ListEmptyComp /> : <></>)}
      />

{!!isModalVisibleForClearCart && (
        <ConfirmationModal
          closeModal={() => closeOptionModal()}
          ShowModal={isModalVisibleForClearCart}
          showBottomButton={true}
          mainText={strings.AREYOUSURE}
          bottomButtonClick={bottomButtonClick}
          // updateStatus={(item) => updateStatus(item)}
        />
      )}

      <ChooseAddressModal
        isVisible={isVisible}
        onClose={() => {
          updateState({ placeLoader: false });
          setModalVisible(false);
        }}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, "addAddress")
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal3
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(!isVisibleAddressModal)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
        navigation={navigation}
        selectViaMap={selectViaMap}
        openCloseMapAddress={openCloseMapAddress}
        constCurrLoc={location}
      />

      {/* Date time modal */}
      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={"none"}
        style={{ margin: 0, justifyContent: "flex-end" }}
        onLayout={(event) => {
          setViewHeight(event.nativeEvent.layout.height);
        }}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.white }}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                  styles.modalMainViewContainer,
                  { backgroundColor: MyDarkTheme.colors.lightDark },
                ]
              : styles.modalMainViewContainer
          }
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            }}
          >
            <View
              style={{
                // flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  ...styles.carType,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
                }}
              >
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>

            {businessType == "laundry" ? (
              <View>
                <Fragment>
                  <ScrollView>
                    {modalType == "pickup" ? (
                      <Calendar
                        current={new Date()}
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedPickupDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    ) : (
                      <Calendar
                        current={
                          getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedDropOffDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    )}

                    {modalType == "pickup" ? (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}
                        >
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}
                          >
                            Loading...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={laundryAvailablePickupSlot || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item.value || ""}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(12) }}
                              />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(24) }}
                              />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.blackOpacity66,
                                  }}
                                >
                                  {!laundrySelectedPickupDate
                                    ? " Please select date."
                                    : " Slots are not found for selected date."}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}
                        >
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}
                          >
                            Loading...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={laundryAvailableDropOffSlot || []}
                            renderItem={renderTimeSlots2}
                            keyExtractor={(item) => item.value || ""}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(12) }}
                              />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(24) }}
                              />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.blackOpacity66,
                                  }}
                                >
                                  {!laundrySelectedDropOffDate
                                    ? " Please select date."
                                    : " Slots are not found for selected date."}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    )}
                  </ScrollView>
                </Fragment>
              </View>
            ) : (
              <View>
                {(!!availableTimeSlots && availableTimeSlots.length > 0) ||
                (!!cartData &&
                  !!cartData?.slots &&
                  !!cartData?.slots.length > 0) ? (
                  <Fragment>
                    <ScrollView>
                      <Calendar
                        current={
                          getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        onDayPress={onSelectDateFromCalendar}
                        markedDates={{
                          [selectedDateFromCalendar]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                          // textDayFontSize: textScale(12),
                          // textMonthFontSize: textScale(10),
                          // textDayHeaderFontSize: textScale(10),
                        }}
                      />
                      {/* {
                        getBundleId == appIds.masa ? currentDate == sheduledorderdate || currentDate == apiScheduledDate ? null : (<View>
                          <Text
                            style={{
                              marginHorizontal: moderateScale(24),
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                              marginBottom: moderateScaleVertical(8),
                              // height:moderateScale(20)
                            }}>
                            {strings.TIME_SLOT}
                          </Text>
                          {console.log(availableTimeSlots, "availableTimeSlots")}
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item.value || ''}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        </View>) : (<View>
                          <Text
                            style={{
                              marginHorizontal: moderateScale(24),
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                              marginBottom: moderateScaleVertical(8),
                              // height:moderateScale(20)
                            }}>
                            {strings.TIME_SLOT}
                          </Text>
                          {console.log(availableTimeSlots, "availableTimeSlots")}
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item.value || ''}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        </View>)
                      } */}

                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                            // height:moderateScale(20)
                          }}
                        >
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}
                          >
                            Loading...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item.value || ""}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(12) }}
                              />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View
                                style={{ marginRight: moderateScale(24) }}
                              />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}
                                >
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    </ScrollView>
                  </Fragment>
                ) : (
                  <DatePicker
                    locale={selectedLanguage}
                    date={
                      !!sheduledorderdate
                        ? new Date(sheduledorderdate)
                        : new Date()
                    }
                    textColor={isDarkMode ? colors.white : colors.blackB}
                    mode="datetime"
                    minimumDate={
                      !!cartData?.delay_date
                        ? new Date(cartData?.delay_date)
                        : new Date()
                    }
                    // maximumDate={undefined}
                    // style={styles.datetimePickerText}
                    // onDateChange={setDate}
                    onDateChange={(value) => onDateChange(value)}
                  />
                )}
              </View>
            )}
            <View
              style={{
                // styles.bottomAddToCartView,
                // { top: viewHeight - height / 6 },
                marginHorizontal: moderateScale(24),
              }}
            >
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                // textStyle={styles.textStyle}
                onPress={selectOrderDate}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(30)}
                btnText={strings.SELECT}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      <Modal
        isVisible={paymentModal}
        style={{
          margin: 0,
        }}
      >
        <View style={{ flex: 1 }}>
          <StripeProvider
            publishableKey={preferences?.stripe_publishable_key}
            merchantIdentifier="merchant.identifier"
          >
            <SelectPaymentModal
              onSelectPayment={onSelectPayment}
              paymentModalClose={() => updateState({ paymentModal: false })}
            />
          </StripeProvider>
        </View>
      </Modal>

      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isProductOrderForm}
        renderModalContent={renderProductForm}
      />
      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isCategoryKyc}
        renderModalContent={renderCategoryKYC}
      />

      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isPrescriptionModal}
        // isVisible={true}
        renderModalContent={renderPrescriptionModalView}
        mainViewStyle={{
          minHeight: height / 2.3,
        }}
      />

      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
      <Modal
        onBackdropPress={() =>
          updateState({
            isModalVisibleForPayFlutterWave: false,
            placeLoader: false,
          })
        }
        isVisible={isModalVisibleForPayFlutterWave}
        style={{
          margin: 0,
          justifyContent: "flex-end",
          // marginBottom: 20,
        }}
      >
        <View
          style={{
            padding: moderateScale(20),
            backgroundColor: colors?.white,
            height: height / 8,
            justifyContent: "flex-end",
          }}
        >
          <PayWithFlutterwave
            onAbort={() =>
              updateState({
                isModalVisibleForPayFlutterWave: false,
                placeLoader: false,
              })
            }
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTransactionRef(10),
              authorization:
                appData?.profile?.preferences?.flutterwave_public_key,
              customer: {
                email: userData?.email,
                name: userData?.name,
              },
              amount: paymentDataFlutterWave?.total_payable_amount,
              currency: currencies?.primary_currency?.iso_code,
              payment_options: "card",
            }}
          />
        </View>
      </Modal>
      
    
    </WrapperContainer>
  );
}
export default React.memo(Cart);
