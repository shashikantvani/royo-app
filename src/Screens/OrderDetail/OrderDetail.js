import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { cloneDeep } from "lodash";
import LottieView from "lottie-react-native";
import moment from "moment";
import React, { Fragment, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Communications from "react-native-communications";
//import { useDarkMode } from "react-native-dark-mode";
import { getBundleId } from "react-native-device-info";
import FastImage from "react-native-fast-image";
// import { showMessage } from 'react-native-flash-message';
import { Calendar } from "react-native-calendars";
import * as RNLocalize from "react-native-localize";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import GradientButton from "../../Components/GradientButton";
import Header from "../../Components/Header";
import LeftRightText from "../../Components/LeftRightText";
import {
  loaderFive,
  loaderOne,
} from "../../Components/Loaders/AnimatedLoaderFiles";
import RatingModal from "../../Components/RatingModal";
import SpecificInstruction from "../../Components/SpecificInstruction";
import StepIndicators from "../../Components/StepIndicator";
import UserDetail from "../../Components/UserDetail";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import { hitSlopProp } from "../../styles/commonStyles";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { currencyNumberFormatter } from "../../utils/commonFunction";
import { appIds } from "../../utils/constants/DynamicAppKeys";
import {
  getImageUrl,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
import useInterval from "../../utils/useInterval";
import stylesFunc from "./styles";
import stylesFun from "./stylesCart";
import LongTermDetail from "../../Components/LongTermDetail";

const { height, width } = Dimensions.get("window");

export default function OrderDetail({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const paramData = route?.params;
  console.log(paramData, "paramData");
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const [lalaMoveUrl, setLalaMoveUrl] = useState(null);
  const [modalType, setModalType] = useState("");
  const [laundrySelectedPickupDate, setLaundrySelectedPickupDate] =
    useState(null);
  const [laundrySelectedPickupSlot, setLaundrySelectedPickupSlot] =
    useState("");
  const [laundrySelectedDropOffDate, setLaundrySelectedDropOffDate] =
    useState(null);
  const [laundrySelectedDropOffSlot, setLaundrySelectedDropOffSlot] =
    useState("");
  const [laundryAvailableDropOffSlot, setLaundryAvailableDropOffSlot] =
    useState([]);
  const [laundryAvailablePickupSlot, setLaundryAvailablePickupSlot] = useState(
    []
  );
  const [minimumDelayVendorDate, setMinimumDelayVendorDate] = useState(null);

  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    dispatcherStatus: null,
    selectedPayment: null,
    labels: [
      strings.ACCEPTED,
      strings.PROCESSING,
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    updatedcartItems: [],
    updatedcartData: {},

    // labels: [
    //   {lable: 'Accepted', orderDate: '12/12/1233'},
    //   {lable: 'Processing', orderDate: ''},
    //   {lable: 'Out For Delivery', orderDate: ''},
    //   {lable: 'Delivered', orderDate: ''},
    // ],
    currentPosition: null,
    orderStatus: null,
    selectedTipvalue: null,
    selectedTipAmount: null,
    headingAngle: 0,
    curLoc: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    coordinate: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    animateDriver: new AnimatedRegion({
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    }),
    driverStatus: null,
    swipeKey: "randomStrings",
    showTaxFeeArea: false,
    trackingUrl: paramData?.orderDetail?.dispatch_traking_url || null,
    ratingData: null,
    isDriverRateModal: false,
    isVisibleTimeModal: false,
    currentPickupDate: paramData?.orderDetail?.schedule_pickup,
    currentDropOffDate: paramData?.orderDetail?.schedule_dropoff,
  });
  const {
    showTaxFeeArea,
    updatedcartItems,
    updatedcartData,
    isLoading,
    cartItems,
    cartData,
    labels,
    currentPosition,
    orderStatus,
    selectedTipvalue,
    selectedTipAmount,
    coordinate,
    curLoc,
    driverStatus,
    swipeKey,
    dispatcherStatus,
    trackingUrl,
    ratingData,
    isDriverRateModal,
    isVisibleTimeModal,
    currentPickupDate,
    currentDropOffDate,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);
  console.log(isLoading, "isLoading>>>>>>");
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot
  );

  console.log(driverStatus, "driverStatusdriverStatusdriverStatus");

  const { preferences } = appData?.profile;
  let businessType = preferences?.business_type;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const styles2 = stylesFun({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, { data });
    };

  const dialCall = (number, type = "phone") => {
    type === "phone"
      ? Communications.phonecall(number.toString(), true)
      : Communications.text(number.toString());
  };
  const isFocused = useIsFocused();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     updateState({ isLoading: true });
  //     if (!!userData?.auth_token) {
  //       // _getOrderDetailScreen();
  //     } else {
  //       showError(strings.UNAUTHORIZED_MESSAGE);
  //     }
  //   }, [currencies, languages, paramData]),
  // );

  useInterval(
    () => {
      if (paramData?.fromActive) {
        getOrders();
      }
    },
    isFocused ? 5000 : null
  );

  console.log("cartDatacartData", cartData);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData?.fromActive) {
        return;
      } else {
        getOrders();
      }
    }, [])
  );

  const getOrders = () => {
    if (!!userData?.auth_token) {
      _getOrderDetailScreen();
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const createRoom = async (item, type) => {
    try {
      const apiData = {
        sub_domain: "192.168.101.88", //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: type,
        order_vendor_id: String(item?.id),
        vendor_id: String(item?.vendor_id),
        order_id: String(item?.order_id),
      };
      updateState({ isLoading: true });

      console.log("sending api data", apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      console.log("start chat res", res);
      updateState({ isLoading: false });
      if (!!res?.roomData) {
        onChat(res.roomData);
      }
    } catch (error) {
      console.log("error raised in start chat api", error);
      showError(error?.message);
      updateState({ isLoading: false });
    }
  };

  const new_dispatch_traking_url = trackingUrl
    ? trackingUrl.replace("/order/", "/order-details/")
    : null;

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = () => {
    let data = {};
    data["order_id"] = paramData?.orderId;
    if (paramData?.selectedVendor) {
      data["vendor_id"] = paramData?.selectedVendor.id;
    }
    if (!!new_dispatch_traking_url) {
      data["new_dispatch_traking_url"] = new_dispatch_traking_url;
    }

    console.log("sending api data", data);

    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res.data, "order detail res===>>>>");

        if (
          !!res?.data &&
          !!res?.data?.vendors[0] &&
          res?.data?.vendors[0].lalamove_tracking_url &&
          res?.data?.vendors[0].shipping_delivery_type == "L"
        ) {
          setLalaMoveUrl(res?.data?.vendors[0].lalamove_tracking_url);
        }

        if (
          !!res?.data?.vendors[0] &&
          res?.data?.vendors[0].order_status.current_status.title ==
            "Delivered" &&
          !res?.data?.vendors[0]?.products[0]?.product_rating &&
          !ratingData
        ) {
          updateState({ ratingData: res?.data?.vendors[0].products[0] });
        }
        updateState({ isLoading: false });
        setMinimumDelayVendorDate(res?.data?.vendors[0]?.delaySlot);

        if (res?.data) {
          if (res?.data?.vendors[0]?.tempCart) {
            updateState({
              updatedcartData: res?.data?.vendors[0]?.tempCart,
              updatedcartItems: res?.data?.vendors[0]?.tempCart?.products,
            });
          } else {
            updateState({
              updatedcartData: null,
              updatedcartItems: [],
            });
          }
          if (res?.data?.luxury_option_name !== strings.DELIVERY) {
            updateState({
              labels: [
                strings.ACCEPTED,
                strings.PROCESSING,
                strings.ORDER_PREPARED,
                strings.DELIVERED,
              ],
            });
          }
          let checkDriver =
            !!res?.data?.order_data && !!res?.data?.order_data
              ? res?.data?.order_data
              : null;
          if (
            !!checkDriver?.agent_location?.lat &&
            !!checkDriver?.agent_location?.lat
          ) {
            let lat = Number(driverStatus?.agent_location?.lat);
            let lng = Number(driverStatus?.agent_location?.long);
            if (!!lat && !!lng) {
              animate(lat, lng);
            }
          }
          console.log(
            driverStatus?.agent_location?.lat,
            driverStatus?.agent_location?.long,
            "driverStatus?.agent_location?.lat"
          );
          if (!trackingUrl) {
            updateState({
              trackingUrl: res.data.vendors[0].dispatch_traking_url,
            });
          }

          updateState({
            dispatcherStatus: res.data.vendors[0],
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
            driverStatus:
              !!res?.data?.order_data && !!res?.data?.order_data
                ? res?.data?.order_data
                : null,
            // driverDetail:
            selectedTipvalue:
              res.data.payable_amount == "0.00" ? "custom" : null,
            currentPosition: res.data.vendors[0].order_status
              ? res?.data?.luxury_option_name !== strings.DELIVERY
                ? res.data.vendors[0].order_status?.current_status?.title ==
                  strings.OUT_FOR_DELIVERY
                  ? 2
                  : labels.indexOf(
                      res.data.vendors[0].order_status?.current_status?.title
                        .charAt(0)
                        .toUpperCase() +
                        res.data.vendors[0].order_status?.current_status?.title.slice(
                          1
                        )
                    )
                : labels.indexOf(
                    res.data.vendors[0].order_status?.current_status?.title
                      .charAt(0)
                      .toUpperCase() +
                      res.data.vendors[0].order_status?.current_status?.title.slice(
                        1
                      )
                  )
              : null,

            // ? dineInType==="Delivery"? labels.indexOf(
            //       res.data.vendors[0].order_status?.current_status?.title
            //         .charAt(0)
            //         .toUpperCase() +
            //         res.data.vendors[0].order_status?.current_status?.title.slice(
            //           1,
            //         ),
            //     ) :  res.data.vendors[0].order_status?.current_status?.title==="Order Predpared"? 3,

            orderStatus: res?.data?.vendors[0]?.order_status,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, "Error>>>>>>");
    updateState({ isLoading: false, isLoading: false, isLoadingC: false });
    // showError(error?.message || error?.error);
  };

  const onStarRatingPress = (i, rating) => {
    // updateState({isLoading: true});
    _giveRatingToProduct(i, rating);
  };

  const _giveRatingToProduct = (productDetail, rating) => {
    let data = {};
    data["order_vendor_product_id"] = productDetail?.id;
    data["order_id"] = productDetail?.order_id;
    data["product_id"] = productDetail?.product_id;
    data["rating"] = rating;
    data["review"] = productDetail?.product_rating?.review
      ? productDetail?.product_rating?.review
      : "";
    // data['vendor_id'] = productDetail.vendor_id; =

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, "ressssssssr");
        let cloned_cartItems = cloneDeep(cartItems);
        updateState({
          isLoading: false,
          cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
            itm.products.map((j, jnx) => {
              if (j?.product_id == productDetail?.product_id) {
                j.product_rating = res.data;
                return j;
              } else {
                return j;
              }
            });
            return itm;
          })),
        });
      })
      .catch(errorMethod);
  };

  //give review and update the rate
  const rateYourOrder = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, { item });
  };

  const onSuccessRating = () => {
    getOrders();
  };

  const _renderItem2 = ({ item, index }) => {
    return (
      <View key={index}>
        <View
          // key={swipeKey + Math.random()}
          style={{
            ...styles2.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
        >
          <View
            style={{
              ...styles2.vendorView,
              paddingHorizontal: moderateScale(8),
              flexDirection: "column",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.medium,
              }}
            >
              {item?.vendor?.name}
            </Text>
          </View>
          {/************ start  render cart items *************/}
          {item?.vendor_products.length > 0
            ? item?.vendor_products.map((i, inx) => {
                return (
                  <Animated.View
                    style={{
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.transactionHistoryBg,
                      marginBottom: moderateScaleVertical(12),
                      marginRight: moderateScale(8),
                      borderRadius: moderateScale(10),
                      transform: [],
                      minHeight: height * 0.125,
                    }}
                    key={inx}
                  >
                    <View style={[styles2.cartItemMainContainer]}>
                      <View
                        style={[
                          styles2.cartItemImage,
                          {
                            backgroundColor: isDarkMode
                              ? MyDarkTheme.colors.lightDark
                              : colors.white,
                          },
                        ]}
                      >
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
                          style={styles2.imageStyle}
                        />
                      </View>

                      <View style={styles2.cartItemDetailsCon}>
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
                              <Text
                                numberOfLines={1}
                                style={{
                                  ...styles2.priceItemLabel2,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.blackOpacity86,
                                  fontSize: textScale(12),
                                  fontFamily: fontFamily.medium,
                                  flex: 0.7,
                                }}
                              >
                                {i?.product?.translation[0]?.title},
                              </Text>
                            </View>
                            <Text
                              style={{
                                ...styles2.priceItemLabel2,
                                fontSize: textScale(12),
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : "#B3B3B3",
                                marginTop: moderateScaleVertical(4),
                                fontFamily: fontFamily.regular,
                              }}
                            >
                              <Text style={{}}>
                                {`${currencies?.primary_currency?.symbol} ${
                                  // Number(i?.pvariant?.multiplier) *
                                  currencyNumberFormatter(
                                    Number(i?.variants?.price).toFixed(2)
                                  )
                                }`}
                              </Text>{" "}
                              X {i?.quantity} ={" "}
                              <Text
                                style={{
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}
                              >
                                <Text style={{}}>
                                  {`${currencies?.primary_currency?.symbol} ${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.variants?.price),
                                      appData?.profile?.preferences
                                        ?.digit_after_decimal
                                    )
                                  }`}
                                </Text>
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
                                                styles2.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles2.cartItemWeight2
                                        }
                                        numberOfLines={1}
                                      >
                                        {j.title}{" "}
                                      </Text>
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                                styles2.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles2.cartItemWeight2
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
                            {!!i?.product_addons.length > 0 && (
                              <View>
                                <Text
                                  style={{
                                    ...styles2.cartItemWeight2,
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.textGreyB,
                                    marginVertical: moderateScale(2),
                                  }}
                                >
                                  {`${currencies?.primary_currency?.symbol} ${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.variants?.quantity_price),
                                      appData?.profile?.preferences
                                        ?.digit_after_decimal
                                    )
                                  }`}
                                </Text>
                              </View>
                            )}
                            <View>
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
                                                    styles2.cartItemWeight2,
                                                    {
                                                      color:
                                                        MyDarkTheme.colors.text,
                                                    },
                                                  ]
                                                : styles2.cartItemWeight2
                                            }
                                            numberOfLines={1}
                                          >
                                            {j.addon_title}:
                                          </Text>

                                          <View
                                            style={{ flexDirection: "row" }}
                                          >
                                            <Text
                                              style={
                                                isDarkMode
                                                  ? [
                                                      styles2.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                  : styles2.cartItemWeight2
                                              }
                                              numberOfLines={1}
                                            >{`(${j.option_title})`}</Text>
                                            <Text
                                              style={
                                                isDarkMode
                                                  ? [
                                                      styles2.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                  : styles2.cartItemWeight2
                                              }
                                              numberOfLines={1}
                                            >
                                              {` ${
                                                currencies?.primary_currency
                                                  ?.symbol
                                              } ${currencyNumberFormatter(
                                                Number(
                                                  j?.quantity_price
                                                ).toFixed(2)
                                              )}`}
                                            </Text>
                                          </View>
                                        </View>
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
                              {!!i?.product_addons.length > 0 && (
                                <View>
                                  <Text
                                    style={{
                                      ...styles2.cartItemWeight2,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyB,
                                      marginVertical: moderateScale(2),
                                    }}
                                  >
                                    {strings.EXTRA}
                                    {":"}
                                  </Text>
                                </View>
                              )}
                              <View>
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
                                                      styles2.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                  : styles2.cartItemWeight2
                                              }
                                              numberOfLines={1}
                                            >
                                              {j.addon_title}:
                                            </Text>

                                            <View
                                              style={{ flexDirection: "row" }}
                                            >
                                              <Text
                                                style={
                                                  isDarkMode
                                                    ? [
                                                        styles2.cartItemWeight2,
                                                        {
                                                          color:
                                                            MyDarkTheme.colors
                                                              .text,
                                                        },
                                                      ]
                                                    : styles2.cartItemWeight2
                                                }
                                                numberOfLines={1}
                                              >{`(${j.option_title})`}</Text>
                                              <Text
                                                style={
                                                  isDarkMode
                                                    ? [
                                                        styles2.cartItemWeight2,
                                                        {
                                                          color:
                                                            MyDarkTheme.colors
                                                              .text,
                                                        },
                                                      ]
                                                    : styles2.cartItemWeight2
                                                }
                                                numberOfLines={1}
                                              >
                                                {` ${
                                                  currencies?.primary_currency
                                                    ?.symbol
                                                } ${currencyNumberFormatter(
                                                  Number(j?.quantity_price),
                                                  appData?.profile?.preferences
                                                    ?.digit_after_decimal
                                                )}`}
                                              </Text>
                                            </View>
                                          </View>
                                        </View>
                                      );
                                    })
                                  : null}
                              </View>
                            </View>
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

                    {/* <View style={styles2.dashedLine} /> */}
                  </Animated.View>
                );
              })
            : null}
          {/************ end render cart items *************/}

          {/* start amount view       */}
          <View
            style={{
              marginHorizontal: moderateScale(4),
              marginTop: moderateScaleVertical(8),
            }}
          >
            {!!item?.discount_amount && (
              <View style={styles2.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles2.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles2.priceItemLabel
                  }
                >
                  {strings.COUPON_DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles2.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles2.priceItemLabel
                  }
                >{`- ${
                  currencies?.primary_currency?.symbol
                } ${currencyNumberFormatter(
                  Number(item?.discount_amount ? item?.discount_amount : 0),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}</Text>
              </View>
            )}
            {!!item?.deliver_charge && (
              <View style={styles2.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles2.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }
                >
                  {strings.DELIVERY_CHARGES}
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
                } ${currencyNumberFormatter(
                  Number(item?.deliver_charge ? item?.deliver_charge : 0),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}</Text>
              </View>
            )}
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        { color: MyDarkTheme.colors.text },
                      ]
                    : styles.priceItemLabel
                }
              >
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
                }
              >
                {currencies?.primary_currency?.symbol}{" "}
                {currencyNumberFormatter(
                  Number(item?.payable_amount ? item?.payable_amount : 0),
                  appData?.profile?.preferences?.digit_after_decimal
                )}
              </Text>

              {/* <NumberFormat
                thousandsGroupStyle="thousand"
                value={2456981}
                prefix="$"
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              /> */}
              {/* <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(
                item?.payable_amount ? item?.payable_amount : 0,
              ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text> */}
            </View>
          </View>
        </View>
      </View>
    );
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

  const _renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          // marginVertical: moderateScale(10),
        }}
      >
        {/* show ETA Time */}
        <View style={{ paddingHorizontal: moderateScale(10) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <UserDetail
              data={item}
              type={strings.VENDER}
              containerStyle={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,
                flex: 1,
              }}
              textStyle={{
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
            {!userData?.is_superadmin ? (
              <View>
                {!!appData?.profile?.socket_url ? (
                  <TouchableOpacity
                    onPress={() => createRoom(item, "vendor_to_user")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <Text style={styles.startChatText}>Vendor</Text>
                    <Image
                      resizeMode="contain"
                      style={styles.agentUserIcon}
                      source={imagePath.icVendorChat}
                    />
                  </TouchableOpacity>
                ) : null}

                {!!appData?.profile?.socket_url &&
                !!(driverStatus?.order && driverStatus?.agent_location?.lat) ? (
                  <TouchableOpacity
                    onPress={() => createRoom(item, "agent_to_user")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.startChatText}>Agent</Text>
                    <Image
                      resizeMode="contain"
                      style={styles.agentUserIcon}
                      source={imagePath.icUserChat}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>

          {item?.products.length
            ? item?.products.map((i, inx) => {
                if (item?.vendor_id == i?.vendor_id) {
                  return (
                    <View
                      style={{
                        marginBottom: moderateScaleVertical(6),
                      }}
                      key={inx}
                    >
                      <View
                        style={{
                          ...styles.cartItemMainContainer,
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : "#F8F8F8",
                        }}
                      >
                        <FastImage
                          source={
                            i?.image_path
                              ? {
                                  uri: getImageUrl(
                                    i?.image_path?.image_fit,
                                    i?.image_path?.image_path,
                                    "300/300"
                                  ),
                                  priority: FastImage.priority.high,
                                }
                              : ""
                          }
                          style={styles.imageStyle}
                        />

                        <View style={styles.cartItemDetailsCon}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}
                              >
                                {i?.product_name}
                              </Text>
                              {i?.quantity && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      ...styles.quantityStyles,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGrey,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        ...styles.quantityStyles,
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGrey,
                                      }}
                                    >
                                      {strings.QTY}
                                    </Text>
                                    <Text style={styles.cartItemWeight}>
                                      {i?.quantity}
                                    </Text>
                                  </Text>
                                </View>
                              )}
                              {!!i?.product_addons.length && (
                                <View>
                                  <Text style={styles.cartItemWeight2}>
                                    {strings.EXTRA}
                                    {":"}
                                  </Text>
                                </View>
                              )}
                              {i?.product_addons.length
                                ? i?.product_addons.map((j, jnx) => {
                                    return (
                                      <View>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={1}
                                        >
                                          {j.addon_title}{" "}
                                        </Text>
                                        <View style={{ flexDirection: "row" }}>
                                          <Text
                                            style={styles.cartItemWeight2}
                                            numberOfLines={1}
                                          >{`(${j.option_title})`}</Text>
                                          <Text
                                            style={styles.cartItemWeight2}
                                            numberOfLines={1}
                                          >
                                            {` ${
                                              currencies?.primary_currency
                                                ?.symbol
                                            } ${currencyNumberFormatter(
                                              Number(j?.price),
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
                                    !!i?.container_charges &&
                                    Number(i?.container_charges)
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
                                justifyContent: "center",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                numberOfLines={1}
                                style={{
                                  ...styles.priceItemLabel2,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.blackOpacity86,
                                  fontSize: textScale(12),
                                  fontFamily: fontFamily.medium,
                                }}
                              >
                                <Text style={styles.cartItemPrice}>
                                  {`${currencies?.primary_currency?.symbol} ${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.price),
                                      appData?.profile?.preferences
                                        ?.digit_after_decimal
                                    )
                                  }`}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        ></View>
                      </View>

                      {!!driverStatus?.order &&
                      driverStatus?.order?.status === "completed" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingBottom: moderateScaleVertical(5),
                            paddingHorizontal: moderateScale(10),
                            marginVertical: moderateScaleVertical(16),
                          }}
                        >
                          <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={Number(i?.product_rating?.rating)}
                            selectedStar={(rating) =>
                              onStarRatingPress(i, rating)
                            }
                            fullStarColor={colors.ORANGE}
                            starSize={15}
                          />
                          <View>
                            <Text
                              onPress={() => updateState({ ratingData: i })}
                              style={[
                                styles.writeAReview,
                                { color: themeColors.primary_color },
                              ]}
                            >
                              {strings.WRITE_REVIEW}
                            </Text>
                          </View>
                          {/* {i?.product_rating?.rating ? (
                          <View>
                            <Text
                              onPress={() => rateYourOrder(i)}
                              style={[
                                styles.writeAReview,
                                { color: themeColors.primary_color },
                              ]}>
                              {strings.WRITE_REVIEW}
                            </Text>
                          </View>
                        ) : null} */}
                        </View>
                      ) : null}
                    </View>
                  );
                } else {
                  null;
                }
              })
            : null}

          {businessType == "laundry" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: moderateScale(20),
                paddingHorizontal: moderateScale(5),
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => _selectTimeLaundry("pickup")}
              >
                <Image source={imagePath.pickUpSchedule} />
                <View>
                  <Text
                    style={{
                      ...styles.laundryApppriceItemLabel2,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : themeColors?.primary_color,
                    }}
                  >
                    {" "}
                    {strings.RE_SCEDULE_PICKUP}
                  </Text>
                  {laundrySelectedPickupDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.laundryApppriceItemLabel2,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedPickupDate}
                      {", "}
                      {laundrySelectedPickupSlot}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => _selectTimeLaundry("dropoff")}
              >
                <Image source={imagePath.dropOffSchedule} />
                <View>
                  <Text
                    style={{
                      ...styles.laundryApppriceItemLabel2,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : themeColors?.primary_color,
                    }}
                  >
                    {" "}
                    {strings.RE_SCEDULE_DROP}
                  </Text>
                  {laundrySelectedDropOffDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.laundryApppriceItemLabel2,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedDropOffDate}
                      {", "}
                      {laundrySelectedDropOffSlot}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {!!Number(item?.discount_amount) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >
                {strings.DISCOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >{`- ${
                currencies?.primary_currency?.symbol
              } ${currencyNumberFormatter(
                Number(item?.discount_amount ? item?.discount_amount : 0),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}</Text>
            </View>
          )}

          {!!cartData?.comment_for_vendor && (
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <LeftRightText
                leftText={strings.SPECIAL_INSTRUCTION}
                rightText={cartData?.comment_for_vendor}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              />
            </View>
          )}
          {!!Number(item?.delivery_fee) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >
                {strings.DELIVERY_CHARGES}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >{`${
                currencies?.primary_currency?.symbol
              } ${currencyNumberFormatter(
                Number(item?.delivery_fee ? item?.delivery_fee : 0),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}</Text>
            </View>
          )}
          {!!Number(item?.total_container_charges) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >
                {strings.CONTAINER_CHARGES}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }
              >{`${
                currencies?.primary_currency?.symbol
              } ${currencyNumberFormatter(
                Number(
                  item?.total_container_charges
                    ? item?.total_container_charges
                    : 0
                ),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}</Text>
            </View>
          )}
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            >
              {strings.AMOUNT}
            </Text>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            >{`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(item?.payable_amount ? item?.payable_amount : 0),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        </View>
      </View>
    );
  };
  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        {/* <Text style={styles.price}>{strings.PRICE}</Text> */}
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}
        >
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }
          >
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }
          >{`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
            Number(cartData?.total_amount),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>
        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                cartData?.loyalty_amount_saved
                  ? cartData?.loyalty_amount_saved
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >
              {strings.TOTAL_DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(cartData?.total_discount),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {/* {!!cartData?.taxable_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
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
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.taxable_amount ? cartData?.taxable_amount : 0,
              ), appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )} */}

        <View style={styles.amountPayable}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }
          >
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }
          >{`${currencies?.primary_currency?.symbol} ${currencyNumberFormatter(
            Number(cartData?.payable_amount),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>
      </View>
    );
  };

  Number(cartData?.total_service_fee) + Number(cartData?.taxable_amount);
  const getFooter = () => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      >
        <View
          style={{
            padding: moderateScale(16),
          }}
        >
          <Text
            style={{
              ...styles.summaryText,
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
          >
            {/* {console.log(preferences?.business_type, "preferences?.business_type")}
            { (preferences?.business_type == 'home_service') ? strings.DELIEVERY_ADDRESS: 'Service Address' } */}
            {getBundleId() == appIds.quickLube &&
            preferences?.business_type == "home_service"
              ? strings.SERVICE_ADDRESS
              : strings.DELIEVERY_ADDRESS}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginBottom: moderateScaleVertical(16),
            }}
          >
            {!!cartData?.address?.latitude ? (
              <View
                style={{
                  height: moderateScale(60),
                  width: moderateScale(60),
                  borderRadius: 10,
                }}
              >
                <MapView
                  scrollEnabled={false}
                  zoomEnabled={false}
                  zoomTapEnabled={false}
                  zoomControlEnabled={false}
                  pitchEnabled={false}
                  toolbarEnabled={false}
                  scrollDuringRotateOrZoomEnabled={false}
                  style={{
                    height: moderateScale(60),
                    width: moderateScale(60),
                    borderRadius: 10,
                  }}
                  region={{
                    latitude: Number(cartData?.address?.latitude),
                    longitude: Number(cartData?.address?.longitude),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0922,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: Number(cartData?.address?.latitude),
                      longitude: Number(cartData?.address?.longitude),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0922,
                    }}
                    image={imagePath.markerPin}
                  />
                </MapView>
              </View>
            ) : (
              <Image source={imagePath.mapIcon} />
            )}
            {/* Service Address */}

            <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
              {cartData?.luxury_option_id == 3 ? (
                <Text
                  style={{
                    ...styles.summaryText,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    flex: 1,
                  }}
                >
                  {cartData?.vendors[0]?.vendor?.address}
                </Text>
              ) : (
                <Text
                  style={{
                    ...styles.summaryText,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    flex: 1,
                  }}
                >
                  {`${
                    cartData?.address?.house_number === null
                      ? ""
                      : `${cartData?.address?.house_number}, `
                  }`}
                  {cartData?.address?.address} {""}
                  {cartData?.address?.pincode}
                </Text>
              )}
            </View>
          </View>

          <LeftRightText
            leftText={strings.ORDER_NUMBER}
            rightText={`#${cartData?.order_number || ""}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          <LeftRightText
            leftText={strings.PAYMENT_METHOD}
            rightText={
              cartData?.payment_option?.title_lng
                ? cartData?.payment_option?.title_lng
                : cartData?.payment_option?.title || ""
            }
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <LeftRightText
            leftText={strings.PLACED_ON}
            rightText={cartData?.created_date}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          {!!cartData && !!cartData?.specific_instructions && (
            <SpecificInstruction
              leftText={strings.SPECIFIC_INSTRUCTIONS}
              rightText={cartData?.specific_instructions}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              leftTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
              }}
              rightTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          )}

          {!!cartData?.scheduled_date_time && (
            <LeftRightText
              leftText={strings.SEHEDLEDFOR}
              rightText={cartData?.scheduled_date_time}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              leftTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
              }}
              rightTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          )}

          {!!cartItems[0]?.vendor_dinein_table_id && (
            <View>
              <View
                style={{
                  height: 0.8,
                  backgroundColor: "grey",
                  marginBottom: moderateScale(10),
                  opacity: 0.5,
                }}
              />
              <LeftRightText
                leftText={"Table info"}
                rightText={""}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              />
              {cartItems[0]?.dineInTableCategory && (
                <LeftRightText
                  leftText={"Category Name"}
                  rightText={cartItems[0]?.dineInTableCategory}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableName && (
                <LeftRightText
                  leftText={"Table Number"}
                  rightText={cartItems[0]?.dineInTableName}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableCapacity && (
                <LeftRightText
                  leftText={"Seat Capacity"}
                  rightText={cartItems[0]?.dineInTableCapacity}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
            </View>
          )}
        </View>
        <View
          style={{
            padding: moderateScale(16),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.greyColor,
          }}
        >
          <Text
            style={{
              ...styles.summaryText,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          >
            {strings.PAYMENT_SUMMARY}
          </Text>

          {!!cartData?.total_amount && cartData?.total_amount !== "0.00" && (
            <LeftRightText
              leftText={strings.SUBTOTAL}
              rightText={`${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(cartData?.total_amount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_delivery_fee &&
            cartData?.total_delivery_fee > 0 && (
              <LeftRightText
                leftText={strings.DELIVERY_FEE}
                rightText={`${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(cartData?.total_delivery_fee),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {!!cartData?.wallet_amount_used &&
            cartData?.wallet_amount_used > 0 && (
              <LeftRightText
                leftText={strings.WALLET}
                rightText={`- ${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(cartData?.wallet_amount_used),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}

          {Number(cartData?.fixed_fee_amount) > 0 && (
            <LeftRightText
              leftText={
                preferences?.fixed_fee_nomenclature != "" &&
                preferences?.fixed_fee_nomenclature != null
                  ? preferences?.fixed_fee_nomenclature
                  : strings.FIXED_FEE
              }
              rightText={`${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(
                  cartData?.fixed_fee_amount ? cartData?.fixed_fee_amount : 0
                ),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {(cartData?.total_service_fee > 0 ||
            Number(cartData?.taxable_amount) > 0) && (
            <LeftRightText
              leftText={strings.TAXES_FEES}
              rightText={`${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(cartData?.total_service_fee) +
                  Number(cartData?.taxable_amount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.loyalty_amount_saved &&
            cartData?.loyalty_amount_saved > 0 && (
              <LeftRightText
                leftText={strings.LOYALTY}
                rightText={`- ${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(cartData?.loyalty_amount_saved),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {!!cartData?.vendors[0]?.total_container_charges &&
            Number(cartData?.total_container_charges) > 0 && (
              <LeftRightText
                leftText={strings.TOTALCONTAINERCHARGES}
                rightText={`- ${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(cartData?.total_container_charges),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}

          {!!cartData?.tip_amount && cartData?.tip_amount > 0 && (
            <LeftRightText
              leftText={strings.TIP_AMOUNT}
              rightText={`${
                currencies?.primary_currency?.symbol
              } ${currencyNumberFormatter(
                Number(cartData?.tip_amount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_discount && cartData?.total_discount > 0 && (
            <LeftRightText
              leftText={strings.DISCOUNT}
              rightText={`- ${
                currencies?.primary_currency?.symbol
              }${currencyNumberFormatter(
                Number(cartData?.total_discount),
                appData?.profile?.preferences?.digit_after_decimal
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          <View
            style={{
              ...styles.dottedLine,
              borderColor: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.lightGreyBgColor,
            }}
          />
          <LeftRightText
            leftText={strings.TOTAL}
            rightText={`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(cartData?.payable_amount),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(16),
              marginBottom: moderateScaleVertical(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
            rightTextStyle={{
              fontSize: textScale(16),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          {!!(
            paramData?.orderStatus?.current_status?.title ===
              strings.DELIVERED &&
            appData?.profile?.preferences?.tip_after_order &&
            (Number(cartData?.tip_amount) == 0 ||
              Number(cartData?.tip_amount) == null) &&
            !!cartData?.tip &&
            cartData?.tip.length
          ) && (
            <View
              style={{
                flexDirection: "column",
                marginTop: 20,
                justifyContent: "space-between",
                marginVertical: moderateScaleVertical(5),
              }}
            >
              <Text
                style={{
                  color: colors.textGreyB,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                }}
              >
                {strings.DOYOUWANTTOGIVEATIP}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {cartData?.payable_amount !== "0.00" &&
                  cartData?.tip.map((j, jnx) => {
                    return (
                      <TouchableOpacity
                        key={String(jnx)}
                        style={{
                          backgroundColor:
                            selectedTipvalue?.value == j?.value
                              ? themeColors.primary_color
                              : "transparent",
                          flex: 0.18,
                          justifyContent: "center",
                          alignItems: "center",
                          borderWidth: 0.7,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginRight: 5,
                          marginVertical: 20,
                          borderRadius: moderateScale(5),
                          borderColor: themeColors.primary_color,
                        }}
                        onPress={() => selectedTip(j)}
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
                          {`${
                            currencies?.primary_currency?.symbol
                          } ${currencyNumberFormatter(
                            j.value,
                            appData?.profile?.preferences?.digit_after_decimal
                          )}`}
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
                    );
                  })}

                {cartData?.payable_amount !== "0.00" && (
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        selectedTipvalue == "custom"
                          ? themeColors.primary_color
                          : "transparent",
                      flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0.7,
                      paddingHorizontal: 15,
                      paddingVertical: 5,
                      marginLeft: 2,
                      marginVertical: 20,
                      borderRadius: moderateScale(5),
                      borderColor: themeColors.primary_color,
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
                )}
              </ScrollView>

              {!!selectedTipvalue && selectedTipvalue == "custom" && (
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: colors.textGreyB,
                    height: 40,
                    marginTop: moderateScaleVertical(12),
                  }}
                >
                  <TextInput
                    value={selectedTipAmount}
                    onChangeText={(text) =>
                      updateState({ selectedTipAmount: text })
                    }
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
              <TouchableOpacity
                // onPress={onPressRateOrder}
                onPress={_onAddTip}
                // style={{flex:0.6}}
                style={{
                  justifyContent: "center",
                  backgroundColor: themeColors.primary_color,
                  alignItems: "center",
                  borderRadius: moderateScale(10),
                  paddingVertical: moderateScaleVertical(10),
                  marginTop: moderateScaleVertical(10),
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(10),
                  }}
                >
                  {strings.ADD_TIP}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              height: moderateScaleVertical(40),
            }}
          />
        </View>
      </View>
    );
  };

  const selectedTip = (tip) => {
    if (selectedTipvalue == "custom") {
      updateState({ selectedTipvalue: tip, selectedTipAmount: null });
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({ selectedTipvalue: null, selectedTipAmount: null });
      } else {
        updateState({ selectedTipvalue: tip, selectedTipAmount: tip?.value });
      }
    }
  };

  const _onAddTip = () => {
    if (!selectedTipAmount) {
      showError(strings.PLEASE_SELECT_VALID_OPTION);
    } else if (!userData?.auth_token) {
      actions.setAppSessionData("on_login");
    } else {
      moveToNewScreen(navigationStrings.TIP_PAYMENT_OPTIONS, {
        selectedTipAmount: selectedTipAmount,
        order_number: cartData?.order_number,
      })();
    }
  };

  const onCenter = () => {
    console.log("driverStatusdriverStatus", driverStatus);
    // return
    mapRef.current.fitToCoordinates(
      [
        {
          latitude: Number(driverStatus.tasks[0]?.latitude),
          longitude: Number(driverStatus.tasks[0]?.longitude),
        },
        {
          latitude: Number(driverStatus.tasks[1]?.latitude),
          longitude: Number(driverStatus.tasks[1]?.longitude),
        },
        {
          latitude: Number(driverStatus?.agent_location?.lat),
          longitude: Number(driverStatus?.agent_location?.long),
        },
      ],
      {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      }
    );
  };

  console.log("driverStatusdriverStatus", driverStatus);

  const acceptRejectDriverUpdation = (status) => {
    if (
      status == 1 &&
      updatedcartData &&
      Number(updatedcartData?.user_wallet_balance) <
        Number(updatedcartData?.difference_to_be_paid) &&
      cartData?.payment_option?.id != 1
    ) {
      showError(strings.INSUFFICIENT_FUNDS_IN_WALLET_PLEASERECHARGE);
    } else {
      let data = {};
      data["cart_id"] = updatedcartData?.id;
      data["address_id"] = updatedcartData?.address_id;
      data["order_vendor_id"] = updatedcartData?.order_vendor_id;
      data["status"] = status;
      data["total_payable_amount"] = updatedcartData?.difference_to_be_paid;

      updateState({ isLoading: true });
      actions
        .acceptRejectDriveUpdate(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          // systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          showSuccess(res?.message);
          // updateState({isLoading: false});
          _getOrderDetailScreen();
        })
        .catch((error) => console.log(error, "errorororor"));
    }
  };

  //get footer start
  const getFooter2 = () => {
    return (
      <View style={{ marginHorizontal: moderateScale(5) }}>
        <View style={styles2.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel
            }
          >
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel
            }
          >{`${currencies?.primary_currency?.symbol} ${currencyNumberFormatter(
            Number(updatedcartData?.gross_paybale_amount),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>
        {!!updatedcartData?.wallet_amount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                updatedcartData?.wallet_amount
                  ? updatedcartData?.wallet_amount
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {!!updatedcartData?.loyalty_amount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                updatedcartData?.loyalty_amount
                  ? updatedcartData?.loyalty_amount
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}

        {!!updatedcartData?.wallet_amount_used && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                updatedcartData?.wallet_amount_used
                  ? updatedcartData?.wallet_amount_used
                  : 0
              ),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {!!updatedcartData?.total_subscription_discount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.TOTALSUBSCRIPTION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(updatedcartData?.total_subscription_discount),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        )}
        {(updatedcartData?.total_tax > 0 ||
          updatedcartData?.total_service_fee > 0) && (
          <Animatable.View
            style={{
              ...styles2.bottomTabLableValue,
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
                    ...styles2.priceItemLabel,
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
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(
                updatedcartData?.total_tax ? updatedcartData?.total_tax : 0
              ) +
                Number(
                  updatedcartData?.total_service_fee
                    ? updatedcartData?.total_service_fee
                    : 0
                ),
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
              {updatedcartData?.total_service_fee > 0 && (
                <View
                  style={{ ...styles2.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles2.priceItemLabel,
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
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >{`${
                    currencies?.primary_currency?.symbol
                  } ${currencyNumberFormatter(
                    Number(
                      updatedcartData?.total_service_fee
                        ? updatedcartData?.total_service_fee
                        : 0
                    ),
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}</Text>
                </View>
              )}
              {updatedcartData?.total_tax > 0 && (
                <View
                  style={{ ...styles2.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles2.priceItemLabel,
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
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >{`${
                    currencies?.primary_currency?.symbol
                  } ${currencyNumberFormatter(
                    Number(
                      updatedcartData?.total_tax
                        ? updatedcartData?.total_tax
                        : 0
                    ),
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}</Text>
                </View>
              )}
            </Animatable.View>
          </View>
        )}

        <View style={styles2.amountPayable}>
          <Text
            style={{
              ...styles2.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
          >
            {strings.TOTAL_AMOUNT}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel2, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel2
            }
          >{`${currencies?.primary_currency?.symbol} ${currencyNumberFormatter(
            Number(updatedcartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ""
                ? Number(selectedTipAmount)
                : 0),
            appData?.profile?.preferences?.digit_after_decimal
          )}`}</Text>
        </View>
        <View style={styles2.amountPayable}>
          <View>
            <Text
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {`${strings.AMOUNT_PAYABLE}`}
            </Text>
            <Text
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
                fontSize: textScale(10),
              }}
            >
              {`(${strings.DIFFERENCEAMOUNT})`}
            </Text>
          </View>
          <View>
            <Text
              style={
                isDarkMode
                  ? [
                      styles2.priceItemLabel2,
                      {
                        color: MyDarkTheme.colors.text,
                        textDecorationLine: "line-through",
                      },
                    ]
                  : [
                      styles2.priceItemLabel2,
                      { textDecorationLine: "line-through" },
                    ]
              }
            >{`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(updatedcartData?.total_payable_amount).toFixed(
                appData?.profile?.preferences?.digit_after_decimal
              )
            )}`}</Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles2.priceItemLabel2,
                      { color: MyDarkTheme.colors.text },
                    ]
                  : styles2.priceItemLabel2
              }
            >{`${
              currencies?.primary_currency?.symbol
            } ${currencyNumberFormatter(
              Number(updatedcartData?.difference_to_be_paid),
              appData?.profile?.preferences?.digit_after_decimal
            )}`}</Text>
          </View>
        </View>

        <View
          style={{
            marginVertical: moderateScale(10),
            marginHorizontal: moderateScale(10),
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => acceptRejectDriverUpdation(1)}
            style={{
              borderRadius: 50,
              alignItems: "center",
              backgroundColor: themeColors?.primary_color,
              width: width / 4,
              borderColor: themeColors?.primary_color,
              borderWidth: 1,
              padding: moderateScale(5),
            }}
          >
            <Text
              style={{
                color: colors?.white,
                fontFamily: fontFamily?.medium,
                fontSize: textScale(14),
              }}
            >
              {strings.APPROVE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onChat = (item) => {
    console.log("item+++", item);
    navigation.navigate(navigationStrings.CHAT_SCREEN, {
      data: { ...item, comeFromOrder: true },
    });
  };

  const _onRateDriver = () => {
    updateState({
      isDriverRateModal: true,
    });
  };

  const getHeader = () => {
    let getUserImage = getImageUrl(
      cartData?.user_image?.image_fit,
      cartData?.user_image?.image_path,
      "500/500"
    );
    return (
      <View>
        {!!(driverStatus?.order && driverStatus?.agent_location?.lat) ? (
          <UserDetail
            data={driverStatus}
            type={strings.DRIVER}
            containerStyle={{ paddingHorizontal: moderateScale(8) }}
            isDriver={cartData?.driver_rating == null}
            _onRateDriver={_onRateDriver}
            startChatWithAgent={() => createRoom(cartItems[0], "agent_to_user")}
          />
        ) : null}

        {!!driverStatus &&
        !!driverStatus?.agent_location?.lat &&
        !lalaMoveUrl ? (
          <View style={{ width: "100%", height: height / 2.2 }}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: Number(driverStatus.tasks[0]?.latitude),
                longitude: Number(driverStatus.tasks[0]?.longitude),
                latitudeDelta: 0.0222,
                longitudeDelta: 0.032,
              }}
              rotateEnabled={true}
            >
              <MapViewDirections
                resetOnChange={false}
                origin={
                  orderStatus !== "completed" && orderStatus !== "unassigned"
                    ? {
                        latitude: Number(driverStatus?.agent_location?.lat),
                        longitude: Number(
                          driverStatus?.agent_location?.long ||
                            driverStatus?.agent_location?.lng
                        ),
                      }
                    : driverStatus.tasks[0]
                }
                // origin={{
                //   latitude: Number(driverStatus.tasks[0]?.latitude),
                //   longitude: Number(driverStatus.tasks[0]?.longitude),
                //   // latitude: Number(driverStatus?.agent_location?.lat),
                //   // longitude: Number(driverStatus?.agent_location?.long),
                //   latitudeDelta: 0.0222,
                //   longitudeDelta: 0.032,
                // }}
                destination={{
                  latitude: Number(driverStatus.tasks[1]?.latitude),
                  longitude: Number(driverStatus.tasks[1]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                apikey={appData.profile?.preferences?.map_key}
                strokeWidth={3}
                strokeColor={themeColors?.primary_color}
                optimizeWaypoints={true}
                onStart={(params) => {}}
                precision={"high"}
                timePrecision={"now"}
                mode={"DRIVING"}
                // maxZoomLevel={20}
                onReady={(result) => {
                  // updateState({
                  //   totalDistance: result.distance.toFixed(appData?.profile?.preferences?.digit_after_decimal),v
                  //   totalDuration: result.duration.toFixed(appData?.profile?.preferences?.digit_after_decimal),
                  // });
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: width / 20,
                      bottom: height / 20,
                      left: width / 20,
                      top: height / 20,
                    },
                  });
                }}
                onError={(errorMessage) => {
                  //
                }}
              />
              <Marker
                coordinate={{
                  latitude: Number(driverStatus.tasks[0]?.latitude),
                  longitude: Number(driverStatus.tasks[0]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              <Marker
                coordinate={{
                  latitude: Number(driverStatus.tasks[1]?.latitude),
                  longitude: Number(driverStatus.tasks[1]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              {!!driverStatus?.agent_location?.lat &&
              orderStatus?.current_status?.title != "Delivered" ? (
                <Marker.Animated
                  ref={markerRef}
                  coordinate={state.animateDriver}
                >
                  <Image
                    source={
                      appIds?.sabroson
                        ? imagePath?.icBikeMarker
                        : imagePath.icScooter
                    }
                    style={{
                      transform: [
                        {
                          rotate: `${
                            Number(driverStatus.agent_location?.heading_angle) +
                            180
                          }deg`,
                        },
                      ],
                    }}
                  />
                </Marker.Animated>
              ) : null}
            </MapView>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
              }}
              onPress={onCenter}
            >
              <Image
                style={{
                  width: moderateScale(34),
                  height: moderateScale(34),
                  borderRadius: moderateScale(34 / 2),
                }}
                source={imagePath.mapNavigation}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {!!lalaMoveUrl ? (
          <View style={{ height: moderateScale(height / 1.8) }}>
            <WebView source={{ uri: lalaMoveUrl }} />
          </View>
        ) : null}

        {!!orderStatus && orderStatus?.current_status?.title == "Placed" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: moderateScaleVertical(10),
            }}
          >
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: "right sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "right sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left sand 2",
                  color: themeColors.primary_color,
                },

                {
                  keypath: "right top sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left top sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top left sand 1",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top left sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "right fallin sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "bottom cyrcle 12",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "bottom cyrcle 11",
                  color: themeColors.primary_color,
                },

                {
                  keypath: "left fallin sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top right sand 1",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top right sand 1",
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text
              style={{
                ...styles.waitToAccept,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {strings.WAITINGTOACCEPT}
            </Text>
          </View>
        )}
        {!!orderStatus &&
          orderStatus?.current_status?.title != "Rejected" &&
          orderStatus?.current_status?.title != "Placed" &&
          !!dispatcherStatus?.dispatch_traking_url && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}
            >
              {!!dispatcherStatus ? (
                <StepIndicators
                  labels={[]}
                  currentPosition={currentPosition}
                  themeColor={themeColors}
                  dispatcherStatus={dispatcherStatus}
                />
              ) : null}
              {!!dispatcherStatus ? (
                <Text
                  style={{
                    marginTop: moderateScaleVertical(15),
                    marginVertical: moderateScaleVertical(10),
                    marginHorizontal: moderateScale(31),
                    color: themeColors?.primary_color,
                    fontFamily: fontFamily?.bold,
                  }}
                >
                  {
                    dispatcherStatus.vendor_dispatcher_status[
                      dispatcherStatus.vendor_dispatcher_status.length - 1
                    ]?.status_data.driver_status
                  }
                </Text>
              ) : null}

              {dispatcherStatus?.order_status?.current_status?.title !==
                strings.DELIVERED &&
                dispatcherStatus?.order_status?.current_status?.title !==
                  strings.REJECTED &&
                (!!cartData.vendors[0]?.scheduled_date_time ||
                  !!cartData?.vendors[0].ETA) && (
                  <View
                    style={{
                      ...styles.ariveView,
                      marginHorizontal: moderateScale(28),
                    }}
                  >
                    <Text
                      style={{
                        ...styles.ariveTextStyle,
                        color: colors.blackC,
                      }}
                    >
                      {strings.YOUR_ORDER_WILL_ARRIVE_BY}{" "}
                      {cartData?.scheduled_date_time
                        ? cartData?.scheduled_date_time
                        : cartData?.vendors[0]?.ETA}
                    </Text>
                  </View>
                )}
            </View>
          )}

        {/* {!orderStatus &&
          paramData?.orderStatus?.current_status?.title != 'Rejected' &&
          paramData?.orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )} */}

        {!!(updatedcartItems && updatedcartItems.length) && (
          <FlatList
            data={updatedcartItems}
            extraData={updatedcartItems}
            ListHeaderComponent={getHeader2()}
            ListFooterComponent={updatedcartItems?.length ? getFooter2() : null}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item, index) => String(index)}
            keyExtractor={(item) => item.id}
            renderItem={_renderItem2}
            style={{
              flex: 1,
              borderColor: themeColors?.primary_color,
              borderWidth: 2,
              marginHorizontal: moderateScale(10),
              backgroundColor: colors.backgroundGrey,
            }}
          />
        )}
      </View>
    );
  };

  const getHeader2 = () => {
    return (
      <View style={{ margin: moderateScale(15) }}>
        <Text
          style={{
            color: colors?.black,
            fontSize: textScale(14),
            fontFamily: fontFamily.medium,
          }}
        >
          {strings.YOURDRIVERHASMODIFIED}
        </Text>
      </View>
    );
  };
  // useEffect(() => {
  //   const _watchId = Geolocation.watchPosition(
  //     position => {
  //       console.log("watch position", position)
  //       updateState({ headingAngle: position.coords.heading })
  //       const { latitude, longitude } = position.coords;
  //       animate(latitude, longitude);
  //       updateState({
  //         coordinate: {
  //           latitude: latitude,
  //           longitude: longitude,
  //           latitudeDelta: 0.0222,
  //           longitudeDelta: 0.0320,
  //         }
  //       })
  //       // setLocation({latitude, longitude});
  //     },
  //     error => {
  //       console.log(error);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       distanceFilter: 20,
  //       interval: 8000,
  //       fastestInterval: 1000,
  //     },
  //   );
  //   return () => {
  //     if (_watchId) {
  //       Geolocation.clearWatch(_watchId);
  //     }
  //   };
  // }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 3000);
      }
    } else {
      state.animateDriver?.timing(newCoordinate).start();
    }
  };

  const customRight = () => {
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(cartData?.reports?.report?.original)}
        activeOpacity={0.7}
        style={{
          backgroundColor: themeColors.primary_color,
          paddingVertical: 3,
          width: moderateScale(92),
          alignItems: "center",
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: colors.white,
          }}
        >
          Order Report
        </Text>
      </TouchableOpacity>
    );
  };

  const onSelectTime = (item) => {
    if (modalType == "pickup") {
      setLaundrySelectedPickupSlot(item?.value);
    } else {
      setLaundrySelectedDropOffSlot(item?.value);
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
          backgroundColor: isSlotSelected1(item)
            ? themeColors?.primary_color
            : colors.white,

          padding: 8,
          borderRadius: 8,
          borderWidth: isSlotSelected1(item) ? 0 : 1,
          borderColor: colors.borderColorGrey,
        }}
      >
        <Text
          style={{
            color: isSlotSelected1(item) ? colors.white : colors.black,
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

  const onCloseModal = () => {
    setLaundrySelectedPickupDate(null);
    setLaundrySelectedDropOffDate(null);
    setLaundrySelectedPickupSlot("");
    setLaundrySelectedDropOffSlot("");
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const laundrySlotSelection = (day) => {
    if (modalType == "pickup") {
      setLaundrySelectedPickupDate(day.dateString);
      setLaundrySelectedPickupSlot("");
    } else {
      setLaundrySelectedDropOffDate(day.dateString);
      setLaundrySelectedDropOffSlot("");
    }

    checkVendorSlots(day.dateString);
  };

  const checkVendorSlots = async (date) => {
    if (modalType !== "pickup") {
      try {
        let vendorId = cartItems[0].vendor.id;
        const res = await actions.getVendorDropoffSlots(
          `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
          {},
          {
            code: appData?.profile?.code,
            timezone: RNLocalize.getTimeZone(),
          }
        );
        setLaundryAvailableDropOffSlot(res);
      } catch (error) {
        console.log("error riased", error);
      }
    } else {
      try {
        let vendorId = cartItems[0].vendor.id;
        const res = await actions.checkVendorSlots(
          `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
          {
            code: appData?.profile?.code,
            timezone: RNLocalize.getTimeZone(),
          }
        );

        setLaundryAvailablePickupSlot(res);
      } catch (error) {
        console.log("error riased", error);
      }
    }
  };

  const selectOrderDate = () => {
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
    } else {
      setDateAndTimeSchedule();
      return;
    }
  };

  const setDateAndTimeSchedule = () => {
    if (
      modalType == "pickup" &&
      !cartItems[0]?.same_day_orders_for_rescheduling &&
      moment(currentDropOffDate, "DD/MM/YYYY").format("DD/MM/YYYY") ==
        moment(laundrySelectedPickupDate).format("DD/MM/YYYY")
    ) {
      alert("You can not reschedule pickup & drop off on the same day");
      return;
    }
    if (
      modalType !== "pickup" &&
      !cartItems[0]?.same_day_orders_for_rescheduling &&
      moment(currentPickupDate, "DD/MM/YYYY").format("DD/MM/YYYY") ==
        moment(laundrySelectedDropOffDate).format("DD/MM/YYYY")
    ) {
      alert("You can not reschedule pickup & drop off on the same day");
      return;
    }

    if (
      modalType == "pickup" &&
      moment(currentDropOffDate, "DD/MM/YYYY").format("DD/MM/YYYY") <
        moment(laundrySelectedPickupDate).format("DD/MM/YYYY")
    ) {
      alert(`Selected date is invalid.`);
      return;
    }

    if (
      modalType !== "pickup" &&
      moment(currentPickupDate, "DD/MM/YYYY").format("DD/MM/YYYY") >
        moment(laundrySelectedDropOffDate).format("DD/MM/YYYY")
    ) {
      alert(`Selected date is invalid.`);
      return;
    }

    updateState({
      isVisibleTimeModal: false,
    });

    actions
      .rescheduleOrder(
        {
          order_id: cartData?.id,
          vendor_id: cartItems[0]?.vendor_id,
          pickup_reschdule_slot: laundrySelectedPickupSlot || "",
          pickup_reschdule_date: laundrySelectedPickupDate || "",
          drop_reschdule_slot: laundrySelectedDropOffSlot || "",
          drop_reschdule_date: laundrySelectedDropOffDate || "",
          reschdule_type: modalType == "pickup" ? "P" : "D",
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "res>>>>res");
        if (res?.status == "Success") {
          updateState({
            currentPickupDate: moment(laundrySelectedPickupDate).format(
              "DD/MM/YYYY"
            ),
            currentDropOffDate: moment(laundrySelectedDropOffDate).format(
              "DD/MM/YYYY"
            ),
          });
          showSuccess(res?.message);
        }
      })
      .catch((err) => {
        showError(err?.error || err?.message || "");
      });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.ORDER + `${"#"}${cartData?.order_number || ""}`}
        customRight={!!cartData?.reports?.report?.original ? customRight : ""}
        onPressLeft={
          paramData?.from
            ? moveToNewScreen(navigationStrings.HOME)
            : () => navigation.goBack()
        }
        leftIconStyle={{tintColor:isDarkMode?colors.white:colors.black}}
      />
      <View
        style={{
          height: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.borderLight,
        }}
      />
      <View
        style={{
          ...styles.mainComponent,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.greyColor,
        }}
      >
        {cartData?.is_long_term == 1 ? (
          <LongTermDetail data={cartData} paramData={paramData} />
        ) : (
          <FlatList
            data={cartItems}
            extraData={cartItems}
            ListHeaderComponent={cartItems.length ? getHeader() : null}
            ListFooterComponent={cartItems.length ? getFooter() : null}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={_renderItem}
            ListEmptyComponent={null}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        )}

        {!!(ratingData || isDriverRateModal) ? (
          <RatingModal
            productDetail={ratingData}
            productData={cartData}
            isDriverRateModal={isDriverRateModal}
            modalClose={() =>
              updateState({ ratingData: null, isDriverRateModal: false })
            }
            onSuccessRating={onSuccessRating}
          />
        ) : null}
      </View>

      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={"none"}
        onBackdropPress={onCloseModal}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.white }}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={{
            ...styles.modalMainViewContainer,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          }}
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
            {businessType == "laundry" && (
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
                        current={new Date()}
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
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
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={laundryAvailablePickupSlot || []}
                          renderItem={renderTimeSlots}
                          keyExtractor={(item) => item.value || ""}
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
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={laundryAvailableDropOffSlot || []}
                          renderItem={renderTimeSlots2}
                          keyExtractor={(item) => item.value || ""}
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
                      </View>
                    )}
                  </ScrollView>
                </Fragment>
              </View>
            )}
            <View
              style={{
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
    </WrapperContainer>
  );
}
