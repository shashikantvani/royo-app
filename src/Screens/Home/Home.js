import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Linking, DeviceEventEmitter } from "react-native";

import AppLink from "react-native-app-link";
// import { useDarkMode } from "react-native-dark-mode";
import DeviceInfo from "react-native-device-info";
import Geocoder from "react-native-geocoding";
import { useSelector } from "react-redux";
import WrapperContainer from "../../Components/WrapperContainer";
import strings from "../../constants/lang";
import staticStrings from "../../constants/staticStrings";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import { MyDarkTheme } from "../../styles/theme";
import { shortCodes } from "../../utils/constants/DynamicAppKeys";

import {
  androidBackButtonHandler,
  getCurrentLocation,
  getImageUrl,
  getNearestLocation,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
import { chekLocationPermission } from "../../utils/permissions";
import {
  DashBoardFive,
  DashBoardFour,
  DashBoardHeaderFive,
  DashBoardHeaderFour,
  DashBoardHeaderOne,
  DashBoardOne,
  DashBoardSix,
  TaxiHomeDashbord,
} from "./DashboardViews/Index";
import Voice from "@react-native-voice/voice";
import FastImage from "react-native-fast-image";
import DashBoardEight from "./DashboardViews/DashBoardEight";
import LaundryAddonModal from "../../Components/LaundryAddonModal";
import _, { isEmpty } from "lodash";
import socketServices from "../../utils/scoketService";
import SubscriptionModal from "../../Components/SubscriptionModal";
import StopAcceptingOrderModal from "../../Components/StopAcceptingOrderModal";

// navigator.geolocation = require('react-native-geolocation-service');

let maxMinObj = {
  max_select: 1,
  min_select: 1,
};

export default function Home({ route, navigation }) {
  const paramData = route?.params;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    allAddresss,
  } = useSelector((state) => state?.initBoot);
  const { location, appMainData, dineInType } = useSelector(
    (state) => state?.home
  );

  // console.log("latest code", appData);

  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const addressSearch = useSelector(
    (state) => state?.addressSearch.addressSearch
  );
  const userData = useSelector((state) => state?.auth?.userData);
  const pendingNotifications = useSelector(
    (state) => state?.pendingNotifications?.pendingNotifications
  );

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode = themeColor;
  
  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: "",
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    currentLocation: "",
    saveAllUserAddress: null,
    isLoadingB: false,
    searchDataLoader: false,
    openVendor: 0,
    closeVendor: 0,
    bestSeller: 0,
    nearMe: 1,
    tempCartData: null,
    isVoiceRecord: false,
    singleVendor: false,
    selectedAddonSet: [],
    unPresentAry: [],
    isSubscription: true,
    stopOrderModalVisible: true,
  });

  const {
    tempCartData,
    updateTime,
    isLoading,
    isRefreshing,
    selectedTabType,
    pageActive,
    currentLocation,
    saveAllUserAddress,
    isLoadingB,
    searchDataLoader,
    openVendor,
    closeVendor,
    bestSeller,
    nearMe,
    isVoiceRecord,
    singleVendor,
    selectedAddonSet,
    unPresentAry,
    isSubscription,
    stopOrderModalVisible,
  } = state;

  const { profile } = appData;

  // console.log("appDataappData home++", appData);

  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        androidBackButtonHandler
      );
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    updateState({ updatedData: appMainData?.categories });
  }, [appMainData]);

  useEffect(() => {
    _getLocationFromParams();
  }, [paramData?.details]);

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!!userData?.auth_token) {
        getAllTempOrders();
      }
    }, [])
  );

  useEffect(() => {
    chekLocationPermission(true)
      .then((result) => {
        if (result !== "goback" && result == "granted") {
          console.log(result, "chekLocationPermission");
          getCurrentLocation("home")
            .then((curLoc) => {
              let locData = location?.latitude ? location : curLoc;
              console.log("res++++ chekLocationPermission", curLoc);
              if (!!userData?.auth_token) {
                //IS LOGIN USER YES
                if (!!appData?.profile?.preferences?.is_hyperlocal) {
                  //YES
                  getAllAddress()
                    .then((savedAddress) => {
                      if (savedAddress.length > 0) {
                        let filterAddress = savedAddress.filter(
                          (val) => !!val?.latitude
                        );
                        console.log(curLoc,filterAddress,'sssssss')
                        getNearestLocation(curLoc, filterAddress)
                          .then((nearestLoc) => {
                            console.log(nearestLoc,'ppppppp')
                            actions.locationData(nearestLoc);
                            homeData(nearestLoc);
                          })
                          .catch((error) => {
                            actions.locationData(locData);
                            homeData(locData);
                            console.log(
                              "error raised in get nearestlocation",
                              error
                            );
                          });
                        return;
                      } else {
                        actions.locationData(locData);
                        homeData(locData);
                        return;
                      }
                    })
                    .catch((error) => {
                      homeData(locData);
                      return;
                    });
                } else {
                  //NO
                  console.log("api hit without lat lng");
                  homeData();
                  return;
                }
              } else {
                //In case of guest user
                if (!!appData?.profile?.preferences?.is_hyperlocal) {
                  //YES
                  // console.log("api hit with current lat lng");
                  actions.locationData(locData);
                  homeData(locData);
                  return;
                } else {
                  //NO
                  console.log("api hit without lat lng");
                  homeData();
                  return;
                }
              }
              return;
            })
            .catch((err) => {
              console.log(err, "chekLocationPermission error");
              console.log("api hit without lat lng");
              homeData();
              return;
            });
        } else {
          if (appData?.profile?.preferences?.is_hyperlocal) {
            const data = {
              address: appData?.profile?.preferences?.Default_location_name,
              latitude: appData?.profile?.preferences?.Default_latitude,
              longitude: appData?.profile?.preferences?.Default_longitude,
            };
            if (!!data?.latitude) {
              // console.log("api hit with current lat lng");
              actions.locationData(data);
              homeData(data);
              return;
            } else {
              console.log("api hit without lat lng");
              homeData();
              return;
            }
          }
        }
      })
      .catch((error) => {
        console.log("error while accessing location", error);
        console.log("api hit without lat lng");
        homeData();
        return;
      });
  }, [selectedTabType, appData, bestSeller, openVendor, closeVendor]);

  // useEffect(() => {
  //   homeData();
  // }, [selectedTabType, appData, location, bestSeller, openVendor, closeVendor]);

  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: "en" }); // set the language
  }, []);

  const _getLocationFromParams = () => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      const address = paramData?.details?.formatted_address;
      const res = {
        address: address,
        latitude: paramData?.details?.geometry?.location.lat,
        longitude: paramData?.details?.geometry?.location.lng,
      };
      if (
        res?.latitude != location?.latitude &&
        res?.longitude != location?.longitude
      ) {
        if (cartItemCount?.data?.item_count) {
          checkCartWithLatLang(res);
        } else {
          updateLatLang(res);
        }
      } else {
        updateLatLang(res);
      }
    }
  };

  const checkCartWithLatLang = (res) => {
    Alert.alert("", strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log("Cancel Pressed"),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
    ]);
  };

  const clearCart = (location) => {
    updateLatLang(location);
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
        actions.cartItemQty(res);
        console.log("homeData===== calling from clearCart");
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = (res) => {
    actions.locationData(res);
    homeData(res);
  };

  //get All address
  const getAllAddress = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await actions.getAddress(
          {},
          { code: appData?.profile?.code }
        );
        if (!!res?.data) {
          resolve(res.data);
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const getAllTempOrders = () => {
    actions
      .getAllTempOrders(
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        if (res && res?.data) {
          updateState({
            tempCartData: res?.data,
          });
        }
      })
      .catch(errorMethod);
  };

  //Home data
  const homeData = (locationData = null) => {
    if (!!paramData) {
      updateState({ searchDataLoader: true });
    }
    let latlongObj = {};

    if (!!locationData) {
      latlongObj = {
        address: locationData?.address || "",
        latitude: locationData?.latitude || "",
        longitude: locationData?.longitude || "",
      };
    }

    let vendorFilterData = {
      close_vendor: closeVendor,
      open_vendor: openVendor,
      best_vendor: bestSeller,
      // near_me: nearMe,
    };
    if (closeVendor == 0 && openVendor == 0 && bestSeller == 0) {
      updateState({ singleVendor: true });
    } else {
      updateState({ singleVendor: false });
    }

    {
      console.log(latlongObj, vendorFilterData, "data>>>>>>>");

      var selectedVendorType = null;
      var defaultVendorType = null;

      console.log(
        "dineInTypedineInType",
        appData?.profile?.preferences?.vendorMode
      );

      if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
        defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type; //
        appData?.profile?.preferences?.vendorMode.forEach((val, i) => {
          if (val?.type == dineInType) {
            selectedVendorType = val.type;
          }
        });
      }
      if (!selectedVendorType) {
        actions.dineInData(defaultVendorType);
      }
      let apiData = {
        type: !!selectedVendorType ? selectedVendorType : defaultVendorType,
        ...latlongObj,
        ...vendorFilterData,
      };
      let apiHeader = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      // console.log("sending api data header", apiData);
      // console.log("homeData===== calling from main function");

      actions
        .homeData(apiData, apiHeader)
        .then(async (res) => {
          // console.log("Home data++++++", res);
          // await preLoadImages(res.data);
          updateState({ searchDataLoader: false });
          if (
            appData?.profile?.preferences?.is_hyperlocal &&
            location?.latitude == "" &&
            location?.longitude == ""
          ) {
            if (
              typeof res?.data?.reqData == "object" &&
              res?.data?.reqData?.latitude &&
              res?.data?.reqData?.longitude
            ) {
              const data = {
                address: res?.data?.reqData?.address,
                latitude: res?.data?.reqData?.latitude,
                longitude: res?.data?.reqData?.longitude,
              };
              actions.locationData(data);
            }
          }
          setTimeout(() => {
            updateState({
              isLoading: false,
              isLoadingB: false,
              searchDataLoader: false,
            });
          }, 1500);
        })
        .catch(errorMethod);
    }
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, "erro>>>>>>errorerrorr");
    setLoadingAddons(false);
    updateState({
      isLoading: false,
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
      isLoadingB: false,
      searchDataLoader: false,
    });
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, { data });
    };

  const { viewRef2, viewRef3, bannerRef } = useRef();

  // const preLoadImages = async (data) => {
  //   if (data.categories.length > 0) {
  //     let preLoadCategories = data.categories.map((item, inx) => {
  //       return {
  //         uri: getImageUrl(
  //           item?.icon?.image_fit,
  //           item?.icon?.image_path,
  //           '140/140',
  //         ),
  //       };
  //     });
  //     FastImage.preload(preLoadCategories); //preload categories
  //   }

  //   if (!!appData?.mobile_banners && appData?.mobile_banners?.length > 0) {
  //     let preLoadBanner = appData?.mobile_banners.map((item) => {
  //       return {
  //         uri: getImageUrl(
  //           item.image.image_fit,
  //           item.image.image_path,
  //           appStyle?.homePageLayout === 5 ? '600/400' : '200/400',
  //         ),
  //       };
  //     });
  //     FastImage.preload(preLoadBanner); //preload banners
  //   }

  //   if (data.vendors.length > 0) {
  //     let preLoadVendors = data.vendors.map((item, inx) => {
  //       return {
  //         uri: getImageUrl(
  //           item.banner.proxy_url || item.image.proxy_url,
  //           item.banner.image_path || item.image.image_path,
  //           '700/300',
  //         ),
  //       };
  //     });
  //     FastImage.preload(preLoadVendors); //preload vendors
  //   }
  // };

  const openUber = () => {
    let appName = "Uber - Easy affordable trips";
    let appStoreLocale = "";
    let playStoreId = "com.ubercab";
    let appStoreId = "368677368";
    AppLink.maybeOpenURL("uber://", {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then((res) => {})
      .catch((err) => {
        Linking.openURL("https://www.uber.com/in/en/");
        console.log("errro raised", err);
        // handle error
      });
  };

  const onPressVendor = (item) => {
    console.log("item+++", item);

    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item["pickup_taxi"] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData("on_login");
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
        // categoryData: data,
      })();
    } else {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
      })();
    }
  };
  //onPress Category
  const onPressCategory = (item) => {
    console.log(item, "item>>>>item");
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();
      return;
    }
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE
            ? false
            : item.redirect_to == staticStrings.PRODUCT
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          // if (item?.warning_page_id) {
          //   if (item?.warning_page_id == 2) {
          //     moveToNewScreen(navigationStrings.DELIVERY, item)();
          //   } else {
          //     moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
          //   }
          // } else {
          //   if (item?.template_type_id == 1) {
          //     moveToNewScreen(navigationStrings.SEND_PRODUCT, item)();
          //   } else {
          //     item['pickup_taxi'] = true;

          //     // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          //     moveToNewScreen(navigationStrings.HOMESCREENTAXI, item)();
          //   }
          // }
          item["pickup_taxi"] = true;
          // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData("on_login");
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    } else if (!item.is_show_category || item.is_show_category) {
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
            isVendorList: true,
            fetchOffers: true,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  // console.log(appData, "appData>>>>appData");

  //On Press banner
  const bannerPress = (data) => {
    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR && data?.is_show_category) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          vendor: true,
          name: data.redirect_name,
          fetchOffers: true,
        })();
        return;
      }
      if (data?.redirect_to == staticStrings.VENDOR) {
        item = {
          ...data?.vendor,
          redirect_to: data.redirect_to,
        };
      } else {
        item = {
          id: data.redirect_id,
          redirect_to: data.redirect_to,
          name: data.redirect_name,
        };
      }

      if (data.redirect_to == staticStrings.VENDOR) {
        data?.is_show_category
          ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })()
          : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2["id"] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
          return;
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            return;
            // let dat2 = data;
            // dat2['id'] = data?.redirect_id;
            // moveToNewScreen(navigationStrings.VENDOR, dat2)();
          }
          if (data.redirect_to == staticStrings.CATEGORY) {
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })();
            return;
          } else {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
          }
        }
        if (data.redirect_to == staticStrings.CATEGORY) {
          moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })();
          return;
        }
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    let header = {};
    header = {
      code: appData?.profile?.code,
      language: languages?.primary_language?.id,
    };

    actions
      .initApp(
        {},
        header,
        true,
        currencies?.primary_currency,
        languages?.primary_language
      )
      .then((res) => {
        console.log(res, "initApp");
        updateState({ isRefreshing: false });
      })
      .catch((error) => {
        updateState({ isRefreshing: false });
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    initApiHit();
  };

  const selcetedToggle = (type) => {
    actions.dineInData(type);
    if (dineInType != type) {
      {
        updateState({
          selectedTabType: type,
          isLoadingB: true,
        });
      }
    } else {
      updateState({
        selectedTabType: type,
      });
    }
  };

  // console.log("dineInTypedineInTypedineInType", dineInType);
  const onVendorFilterSeletion = (selectedFilter) => {
    switch (selectedFilter?.id) {
      case 1:
        updateState({
          isLoadingB: true,
          openVendor: 1,
          closeVendor: 0,
          bestSeller: 0,
          nearMe: 0,
        });
        break;
      case 2:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 1,
          bestSeller: 0,
          nearMe: 0,
        });
        break;
      case 3:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 0,
          bestSeller: 1,
          nearMe: 0,
        });
        break;
      case 4:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 0,
          bestSeller: 0,
          nearMe: 1,
        });
        break;
      default:
        break;
    }
  };

  const onSpeechStartHandler = (e) => {};
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      voiceInput: text,
    })();
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({
      isVoiceRecord: true,
    });
    try {
      await Voice.start(langType);
    } catch (error) {}
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log("error raised", error);
    }
  };

  const onPressAddLaundryItem = (item) => {
    setSelectedHomeCategory(item);
    setLoadingAddons(true);
    updateState({
      selectedAddonSet: [],
    });
    let url = `?category_id=${item?.id}`;
    actions
      .getProductEstimationWithAddons(
        url,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        setLoadingAddons(false);
        setEsitmatedLaundryProducts(res?.data);
        setSelectedLaundryCategory(res?.data[0]);
        setLaundryAddonModal(true);
      })
      .catch(errorMethod);
  };

  const onPressLaundryCategory = (item) => {
    setIsOnPressed(false);
    setSelectedLaundryCategory(item);
    updateState({
      selectedAddonSet: [],
    });
  };

  const onLaundryAddonSelect = (item, categoryDetails) => {
    let newSelectedAddonSet = [...selectedAddonSet];
    let counter = 0;
    let maxSelectLimit = categoryDetails.estimate_addon_set?.max_select;
    newSelectedAddonSet.map((item) => {
      if (item?.estimate_addon_id == categoryDetails.estimate_addon_set?.id) {
        counter++;
      }
    });

    let selectedSetIndex = newSelectedAddonSet.findIndex(
      (x) => x?.id === item?.id
    );

    item.estimate_product_id = categoryDetails?.estimate_product_id;

    if (selectedSetIndex == -1 && counter !== maxSelectLimit) {
      updateState({
        selectedAddonSet: [...newSelectedAddonSet, item],
      });

      return;
    } else if (selectedSetIndex == -1 && counter == maxSelectLimit) {
      updateState({
        selectedAddonSet: [item],
      });
    } else {
      let filteredAddonSet = newSelectedAddonSet.filter(
        (item, index) => index !== selectedSetIndex
      );
      updateState({
        selectedAddonSet: filteredAddonSet,
      });
    }
  };

  // console.log("appMainDataappMainData", appMainData);

  const onFindVendors = () => {
    let newAry = [];
    selectedLaundryCategory?.estimate_product_addons.map((item, index) => {
      let newObj = {
        addon_id: item?.estimate_addon_id,
        min_select_count: item?.estimate_addon_set?.min_select,
        max_select_count: item?.estimate_addon_set?.max_select,
      };
      newAry[index] = newObj;
    });
    let unPresentItems = [];
    newAry.map((itm) => {
      if (
        !selectedAddonSet.some(
          (item) => item?.estimate_addon_id == itm?.addon_id
        )
      ) {
        if (itm?.min_select_count !== 0) {
          unPresentItems.push(itm);
        }
      }
    });
    updateState({
      unPresentAry: unPresentItems,
    });
    setIsOnPressed(true);
    if (unPresentItems.length == 0) {
      onHideModal();
      moveToNewScreen(navigationStrings.LAUNDRY_AVAILABLE_VENDORS, {
        selectedAddonSet: selectedAddonSet,
      })();
    }
  };

  const onHideModal = () => {
    setIsOnPressed(false);
    setLaundryAddonModal(false);
  };

  const _closeModal = () => {
    updateState({
      isSubscription: false,
    });
  };

  const _stopOrderModalClose = () => {
    updateState({
      stopOrderModalVisible: false,
    });
  };
 console.log(appStyle?.homePageLayout,dineInType,'homePageLayout')
  const renderHomeScreen = () => {
    switch (appStyle?.homePageLayout) {
      // switch (case_) {
      case 1:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardOne
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                tempCartData={tempCartData}
                onPressCategory={(item) => onPressCategory(item)}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );

      case 2:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardFour
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                tempCartData={tempCartData}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />

            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardFive
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
                navigation={navigation}
                onVendorFilterSeletion={onVendorFilterSeletion}
                singleVendor={singleVendor}
                onPressAddLaundryItem={onPressAddLaundryItem}
                isLoadingAddons={isLoadingAddons}
                selectedHomeCategory={selectedHomeCategory}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );

      case 4:
        return (
          <>
            <DashBoardHeaderFour
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
            />
            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardSix
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                tempCartData={tempCartData}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );

      case 5:
        return (
          <>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />
            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardFive
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
                navigation={navigation}
                onVendorFilterSeletion={onVendorFilterSeletion}
                singleVendor={singleVendor}
                onPressAddLaundryItem={onPressAddLaundryItem}
                isLoadingAddons={isLoadingAddons}
                selectedHomeCategory={selectedHomeCategory}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );
      case 6:
        return (
          <>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />
            {dineInType == "pick_drop" ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            ) : (
              <DashBoardEight
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
                navigation={navigation}
                onVendorFilterSeletion={onVendorFilterSeletion}
                singleVendor={singleVendor}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            }
          );
          console.log("pending res==>>>", res.data.order_list);
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log("erro rirased", error);
        }
      })();
    }
  }, []);

  const _onPressSubscribe = () => {
    moveToNewScreen(navigationStrings.SUBSCRIPTION)();
    updateState({
      isSubscription: false,
    });
  };

  const { blurRef } = useRef();

  return (
    <WrapperContainer
      statusBarColor={"#202064"}
      barStyle="light-content"
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.statusbarColor
      }
      isLoading={searchDataLoader}
    >
      {/* <View style={{flex: 1}}>{}</View> */}
      <>{renderHomeScreen()}</>
      <LaundryAddonModal
        isVisible={isLaundryAddonModal}
        hideModal={onHideModal}
        // isLoadingAddons={isLoadingAddons}
        selectedLaundryCategory={selectedLaundryCategory}
        onPressLaundryCategory={onPressLaundryCategory}
        flatlistData={esitmatedLaundryProducts}
        onLaundryAddonSelect={onLaundryAddonSelect}
        selectedAddonSet={selectedAddonSet}
        onFindVendors={onFindVendors}
        minMaxError={minMaxError}
        isOnPressed={isOnPressed}
        selectedHomeCategory={selectedHomeCategory}
        unPresentAry={unPresentAry}
      />

      {!!appData?.stop_order_acceptance_for_users && (
        <StopAcceptingOrderModal
          isVisible={stopOrderModalVisible}
          onClose={_stopOrderModalClose}
        />
      )}
    </WrapperContainer>
  );
}
