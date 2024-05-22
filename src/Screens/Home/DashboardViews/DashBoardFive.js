import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Animated,
  Image,
  Modal,
  BackHandler,
} from "react-native";
import * as Animatable from "react-native-animatable";
import AppLink from "react-native-app-link";
// import { useDarkMode } from "react-native-dark-mode";
import FastImage from "react-native-fast-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import BlurImages from "../../../Components/BlurImages";
import HomeCategoryCard2 from "../../../Components/HomeCategoryCard2";
import BannerLoader from "../../../Components/Loaders/BannerLoader";
import CategoryLoader2 from "../../../Components/Loaders/CategoryLoader2";
import HeaderLoader from "../../../Components/Loaders/HeaderLoader";
import SearchLoader from "../../../Components/Loaders/SearchLoader";
import MarketCard4 from "../../../Components/MarketCard4";
import ProductsComp from "../../../Components/ProductsComp";
import SearchBar2 from "../../../Components/SearchBar2";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import colors from "../../../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../styles/responsiveSize";
import { MyDarkTheme } from "../../../styles/theme";
import stylesFunc from "../styles";
import { SvgUri } from "react-native-svg";
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from "../../../utils/helperFunctions";
import { useScrollToTop } from "@react-navigation/native";
import staticStrings from "../../../constants/staticStrings";
import imagePath from "../../../constants/imagePath";
import { appIds } from "../../../utils/constants/DynamicAppKeys";
import DeviceInfo, { getBundleId } from "react-native-device-info";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { string } from "is_js";
import { isEmpty } from "lodash";
import LaundryCategoryCard from "../../../Components/LaundryCategoryCard";
import ButtonWithLoader from "../../../Components/ButtonWithLoader";
import DifferentAddOns from "../../../Components/DifferentAddOns ";
import LaundryAddonModal from "../../../Components/LaundryAddonModal";
import { rgba } from "react-native-color-matrix-image-filters";
import DashedLine from "react-native-dashed-line";
import ButtonComponent from "../../../Components/ButtonComponent";
// import { color } from "react-native-reanimated";
import GradientButton from "../../../Components/GradientButton";
import { colorsDark } from "react-native-elements/dist/config";
import { DefaultTheme,DarkTheme } from "react-native-paper";
import actions from "../../../redux/actions";
import { getItem, setItem } from "../../../utils/utils";
import RNExitApp from "react-native-exit-app";

export default function DashBoardFive({
  handleRefresh = () => {},
  bannerPress = () => {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  navigation = {},
  toggleData = {},
  onVendorFilterSeletion = () => {},
  tempCartData = null,
  onPressVendor = () => {},
  onPressAddLaundryItem = () => {},
  isLoadingAddons = false,
  selectedHomeCategory = {},
  onClose,
  onPressSubscribe,
  isSubscription,
}) {
  const { appData, themeColors, appStyle, themeColor, themeToggle } =
    useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);

  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  let businessType = appData?.profile?.preferences?.business_type || null;
  const allCategory = appMainData?.categories;
  console.log(appMainData, "appDtaa");
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

  const isGetEstimation = appData?.profile?.preferences?.get_estimations;

  const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: [],
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
  });
  const { slider1ActiveSlide, vendorsData, showMenu, categoriesData, seeMore } =
    state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    if (appMainData?.vendors && appMainData?.vendors.length) {
      updateState({
        vendorsData: appMainData?.vendors,
      });
      return;
    }
    updateState({
      vendorsData: [],
    });
  }, [appMainData?.vendors]);

  useEffect(() => {
    if (!!appMainData?.categories && appMainData?.categories.length) {
      if (appStyle?.homePageLayout == 5) {
        updateState({
          categoriesData: appMainData?.categories.filter(
            (item, indx) => indx < 8
          ),
        });
      } else {
        updateState({
          categoriesData: appMainData?.categories,
        });
      }
      return;
    }
    updateState({
      categoriesData: [],
    });
  }, [appMainData?.categories]);

  const { currSelectedFilter } = state;

  console.log("businessType", businessType);

  const onSelectedFilter = (selectedFilter) => {
    updateState({ showMenu: false, currSelectedFilter: selectedFilter });
    onVendorFilterSeletion(selectedFilter);
  };

  const homeAllFilters = () => {
    let homeFilter = [
      { id: 1, type: strings.OPEN },
      { id: 2, type: strings.CLOSE },
      { id: 3, type: strings.BESTSELLER },
    ];
    // if (appData?.profile?.preferences?.is_hyperlocal) {
    //   homeFilter.push({ id: 4, type: strings.NEAR_BY });
    // } else {
    //   if (homeFilter.length > 3) {
    //     homeFilter.pop();
    //   }
    // }
    return homeFilter;
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       androidBackButtonHandler,
  //     );
  //     return () => backHandler.remove();
  //   }, []),
  // );

  const OnTakeMeOut = () => {
    RNExitApp.exitApp();
  };

  const checkAgeModalPermission = async () => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        "isUserConfirmedAgeModal"
      );
      console.log(getIsUserCofirmedAgeModal, "isUserConfirmedAgeModal");
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(true);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    // checkAgeModalPermission();
  }, []);

  console.log(userData, "userData>>");
  const onConfirmAge = async (userPermission) => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        "isUserConfirmedAgeModal"
      );
      console.log(getIsUserCofirmedAgeModal, "checkkk");
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(false);
        if (!!(userData && userData?.auth_token)) {
          await setItem("isUserConfirmedAgeModal", userPermission);
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          marginRight: moderateScale(10),
        }}
      >
        <HomeCategoryCard2
          data={item}
          onPress={() => onPressCategory(item)}
          isLoading={isLoading}
        />
      </View>
    );
  };

  const _renderVendors = ({ item, index }) => (
    <View style={{ marginRight: moderateScale(10) }}>
      <MarketCard4
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  );

  const seeMoreCategories = () => {
    updateState({
      categoriesData: !seeMore
        ? appMainData?.categories
        : appMainData?.categories.filter((item, indx) => indx < 8),
      seeMore: !seeMore,
    });
  };

  const renderBanners = ({ item }) => {
    const imageUrl = getImageUrl(
      item.image.image_fit,
      item.image.image_path,
      appStyle?.homePageLayout === 5
        ? "800/600"
        : DeviceInfo.getBundleId() == appIds.masa
        ? "800/600"
        : "400/600"
    );
    // console.log("hfbgdh", item);
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => bannerPress(item)}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height:
              appStyle?.homePageLayout == 5
                ? moderateScale(140)
                : DeviceInfo.getBundleId() == appIds.masa
                ? moderateScale(260)
                : height / 3.8,
            width:
              appStyle?.homePageLayout == 5
                ? width / 1.2
                : DeviceInfo.getBundleId() == appIds.masa
                ? width / 1.1
                : moderateScale(160),
            borderRadius: moderateScale(16),
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  const renderLaundryBanners = ({ item }) => {
    const imageUrl = getImageUrl(
      item.image.image_fit,
      item.image.image_path,
      "400/600"
    );

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => bannerPress(item)}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: moderateScaleVertical(160),
            width: width - moderateScale(50),
            borderRadius: moderateScale(16),
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  const categoriesBanners = () => {
    return (
      <View style={{}}>
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories?.length && (
            <View
              style={{
                // marginHorizontal: moderateScale(8),
                marginVertical: moderateScaleVertical(16),
              }}
            >
              {appStyle?.homePageLayout === 5 ? (
                <FlatList
                  key={"7"}
                  numColumns={4}
                  data={categoriesData}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={_renderItem}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginTop: moderateScale(24) }} />
                  )}
                />
              ) : (
                <FlatList
                  key={"6"}
                  horizontal
                  data={categoriesData}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={_renderItem}
                  ListHeaderComponent={() => (
                    <View style={{ marginLeft: moderateScale(16) }} />
                  )}
                  ListFooterComponent={() => (
                    <View style={{ marginRight: moderateScale(12) }} />
                  )}
                />
              )}
              <View>
                {appMainData?.categories.length > 8 &&
                  appStyle?.homePageLayout === 5 && (
                    <TouchableOpacity
                      onPress={seeMoreCategories}
                      activeOpacity={0.8}
                      style={{
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: moderateScaleVertical(6),
                        marginHorizontal: moderateScale(8),
                        borderRadius: moderateScale(6),
                        marginTop: moderateScaleVertical(16),
                        borderColor: colors.borderColorB,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: textScale(10),
                            fontFamily: fontFamily.regular,
                            color: isDarkMode ? colors.white : colors.black,
                          }}
                        >
                          {!seeMore ? strings.SEE_MORE : strings.SEE_LESS}
                        </Text>
                        <Image
                          source={imagePath.icDropdown4}
                          style={{
                            tintColor: isDarkMode ? colors.white : colors.black,
                            transform: [
                              { rotate: seeMore ? "180deg" : "0deg" },
                            ],
                            marginLeft: moderateScale(4),
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          )}
          {/* {console.log(appData?.mobile_banners,'appData?.mobile_banners')} */}
        <View style={{}}>
          {!!appData?.mobile_banners?.length && (
            <View style={{ marginTop: moderateScaleVertical(4) }}>
              <FlatList
                horizontal
                data={appMainData?.mobile_banners || appData?.mobile_banners}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderBanners}
                ItemSeparatorComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
                ListHeaderComponent={() => (
                  <View style={{ marginLeft: moderateScale(16) }} />
                )}
                ListFooterComponent={() => (
                  <View style={{ marginRight: moderateScale(16) }} />
                )}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, { data });
    };
  const renderBrands = ({ item }) => {
    // const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '800/600');
    const imageURI = getImageUrl(
      item.image.proxy_url,
      item.image.image_path,
      "800/600"
    );
    const isSVG = imageURI ? imageURI.includes(".svg") : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      >
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{ uri: imageURI, priority: FastImage.priority.high }}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const onViewAll = (type, data) => {
    console.log(data, "type+++++", type);
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const listHeader = (type, data = [], isViewAll = false) => {
    return (
      <View style={styles.viewAllVeiw}>
        <Text
          style={{
            ...styles.exploreStoresTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginTop: 0,
          }}
        >
          {type}
        </Text>

        {!!isViewAll && !!vendorsData && vendorsData.length > 1 && (
          <TouchableOpacity onPress={() => onViewAll(type, data)}>
            <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFeaturedProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {!!isGetEstimation ? (
          <BannerLoader />
        ) : (
          <CategoryLoader2 viewStyles={{ marginVertical: moderateScale(16) }} />
        )}

        {!!isGetEstimation && (
          <View>
            <HeaderLoader
              widthLeft={moderateScale(180)}
              rectWidthLeft={moderateScale(180)}
              rectHeightLeft={moderateScaleVertical(60)}
              isRight={false}
              rx={4}
              ry={4}
              viewStyles={{
                marginVertical: moderateScale(20),
              }}
            />
            <BannerLoader homeLoaderHeight={moderateScaleVertical(80)} />
            <BannerLoader
              viewStyles={{ marginTop: moderateScale(8) }}
              homeLoaderHeight={moderateScaleVertical(80)}
            />
            <BannerLoader
              viewStyles={{ marginTop: moderateScale(8) }}
              homeLoaderHeight={moderateScaleVertical(80)}
            />
            <BannerLoader
              viewStyles={{
                marginTop: moderateScale(8),
                marginBottom: moderateScale(20),
              }}
              homeLoaderHeight={moderateScaleVertical(80)}
            />
          </View>
        )}

        {!isGetEstimation && appStyle?.homePageLayout === 5 ? (
          <CategoryLoader2 viewStyles={{ marginBottom: moderateScale(16) }} />
        ) : null}
        {!isGetEstimation && appStyle?.homePageLayout === 5 ? (
          <View
            style={{
              flexDirection: "row",
              marginBottom: moderateScaleVertical(16),
            }}
          >
            <HeaderLoader
              widthLeft={moderateScale(width / 1.2)}
              rectWidthLeft={moderateScale(width / 1.2)}
              heightLeft={moderateScaleVertical(140)}
              rectHeightLeft={moderateScaleVertical(140)}
              isRight={false}
              rx={15}
              ry={15}
            />
            <HeaderLoader
              widthLeft={moderateScale(width / 1.2)}
              rectWidthLeft={moderateScale(width / 1.2)}
              heightLeft={moderateScaleVertical(140)}
              rectHeightLeft={moderateScaleVertical(140)}
              isRight={false}
              rx={15}
              ry={15}
            />
          </View>
        ) : (
          !isGetEstimation && (
            <View style={{ flexDirection: "row" }}>
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                }}
                widthLeft={moderateScale(150)}
                rectWidthLeft={moderateScale(150)}
                heightLeft={moderateScaleVertical(240)}
                rectHeightLeft={moderateScaleVertical(240)}
                isRight={false}
                rx={15}
                ry={15}
              />
            </View>
          )
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <HeaderLoader
            widthLeft={moderateScale(180)}
            rectWidthLeft={moderateScale(180)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
        </View>

        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
      </ScrollView>
    );
  }

  const vendorHeader = () => {
    if (appData?.profile?.preferences?.single_vendor) {
      return (
        <View
          style={{
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(8),
          }}
        />
      );
    }
    return (
      <View key={Math.random()}>
        <View style={{ ...styles.viewAllVeiw }}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.exploreStoresTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: 0,
              flex: 1,
            }}
          >
            {`${appData?.profile?.preferences?.vendors_nomenclature}`}
          </Text>
         {console.log(vendorsData && vendorsData.length,'vendorsData && vendorsData.length')}
          {!!vendorsData && vendorsData.length > 1 && (
            <TouchableOpacity
              style={{ marginHorizontal: moderateScale(4) }}
              onPress={() => onViewAll("vendor", appMainData.vendors)}
            >
              <Text
                style={{
                  ...styles.viewAllText,
                  color: isDarkMode ? MyDarkTheme.colors.text : "#A3CD3D",
                }}
              >
                {`${strings.VIEW_ALL}>`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      // fromVendorApp: true,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  };

  const showAllTempCartOrders = () => {
    return (
      <View>
        {tempCartData && tempCartData.length
          ? tempCartData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressViewEditAndReplace(item)}
                  style={{
                    padding: moderateScale(8),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // alignItems: 'center',
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color,
                      20
                    ),
                    marginHorizontal: moderateScale(15),
                    marginTop: moderateScale(15),
                    borderRadius: moderateScale(5),
                    borderWidth: moderateScale(0.5),
                    borderColor: themeColors?.primary_color,
                  }}
                >
                  <View style={{ flex: 0.7 }}>
                    <Text
                      style={{
                        fontSize: textScale(12),
                        fontFamily: fontFamily.medium,
                      }}
                    >
                      {strings.YOURDRIVERHASMODIFIED}
                    </Text>
                    <Text
                      style={{
                        fontSize: textScale(12),
                        paddingTop: moderateScale(5),
                        fontFamily: fontFamily.bold,
                      }}
                    >
                      {strings.VIEW_DETAIL}
                    </Text>
                  </View>
                  <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                    <Text
                      style={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.medium,
                      }}
                    >{`#${item?.order_number}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </View>
    );
  };

  const _renderLaundryItem = ({ item, index }) => {
    return (
      <LaundryCategoryCard
        data={item}
        onPress={() => onPressAddLaundryItem(item)}
        isLoading={
          selectedHomeCategory?.id == item?.id ? isLoadingAddons : false
        }
      />
    );
  };

  const laundryCategoriesBanners = () => {
    return (
      <View>
        {!!appData?.mobile_banners?.length && (
          <View
            style={{
              marginTop: moderateScaleVertical(4),
            }}
          >
            <FlatList
              horizontal
              data={appData?.mobile_banners}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={renderLaundryBanners}
              ItemSeparatorComponent={() => (
                <View style={{ marginRight: moderateScale(12) }} />
              )}
              ListHeaderComponent={() => (
                <View style={{ marginLeft: moderateScale(16) }} />
              )}
              ListFooterComponent={() => (
                <View style={{ marginRight: moderateScale(16) }} />
              )}
            />
          </View>
        )}

        {!isEmpty(appMainData?.categories) && (
          <View style={{ marginBottom: moderateScaleVertical(16) }}>
            <Text
              style={{
                ...styles.exploreStoresTxt,
                marginLeft: moderateScale(15),
                marginVertical: moderateScale(20),
              }}
            >
              Select Service
            </Text>

            <FlatList
              key={"6"}
              data={categoriesData}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderLaundryItem}
              contentContainerStyle={{
                paddingHorizontal: moderateScale(15),
              }}
              ItemSeparatorComponent={() => (
                <View style={{ marginTop: moderateScale(10) }} />
              )}
              ListHeaderComponent={() => (
                <View style={{ marginLeft: moderateScale(12) }} />
              )}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        marginTop: -moderateScaleVertical(15),
        // backgroundColor: colors.white,
        backgroundColor: isDarkMode
          ? DefaultTheme.colors.background
          : colors.white,
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        paddingBottom:
          Platform.OS == "ios"
            ? moderateScaleVertical(55)
            : moderateScaleVertical(90),
        overflow: "hidden",
      }}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
      >
        {showAllTempCartOrders()}
        <Animatable.View animation={"fadeInUp"} delay={200}>
          {console.log(isGetEstimation,'isGetEstimation')}
          {!!isGetEstimation ? laundryCategoriesBanners() : categoriesBanners()}
          {
            <>
              <View>{vendorHeader()}</View>
              <FlatList
                key={"8"}
                horizontal
                data={vendorsData}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderVendors}
                contentContainerStyle={{
                  paddingLeft: moderateScale(16),
                }}
              />

              {checkForBrand && (
                <View style={{}}>
                  {appMainData &&
                    appMainData?.brands &&
                    !!appMainData?.brands.length && (
                      <>
                        <View>{listHeader(strings.POPULAR_BRANDS)}</View>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          data={appMainData?.brands}
                          renderItem={renderBrands}
                          keyExtractor={(item) => item.id.toString()}
                          ItemSeparatorComponent={() => (
                            <View style={{ marginRight: moderateScale(12) }} />
                          )}
                          ListHeaderComponent={() => (
                            <View style={{ marginLeft: moderateScale(16) }} />
                          )}
                          ListFooterComponent={() => (
                            <View style={{ marginRight: moderateScale(16) }} />
                          )}
                        />
                      </>
                    )}
                </View>
              )}
            </>
          }

          {businessType !== "laundry" && (
            <View style={{}}>
              {appMainData &&
                appMainData?.featured_products &&
                !!appMainData?.featured_products.length && (
                  <>
                    {appIds.orderchekout == DeviceInfo.getBundleId() ? (
                      <View>{listHeader(strings.ALCOHAL)}</View>
                    ) : (
                      <View>{listHeader(strings.FEATURED_PRODUCTS)}</View>
                    )}

                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      data={appMainData?.featured_products}
                      renderItem={renderFeaturedProducts}
                      keyExtractor={(item) => item.id.toString()}
                      ItemSeparatorComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                      ListHeaderComponent={() => (
                        <View style={{ marginLeft: moderateScale(16) }} />
                      )}
                      ListFooterComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                    />
                  </>
                )}
            </View>
          )}

          {businessType !== "laundry" &&
            appIds.orderchekout != DeviceInfo.getBundleId() && (
              <View style={{}}>
                {appMainData &&
                  appMainData?.new_products &&
                  !!appMainData?.new_products.length && (
                    <>
                      <View>{listHeader(strings.NEW_PRODUCTS)}</View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={appMainData?.new_products}
                        renderItem={renderFeaturedProducts}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => (
                          <View style={{ marginRight: moderateScale(16) }} />
                        )}
                        ListHeaderComponent={() => (
                          <View style={{ marginLeft: moderateScale(16) }} />
                        )}
                        ListFooterComponent={() => (
                          <View style={{ marginRight: moderateScale(16) }} />
                        )}
                      />
                    </>
                  )}
              </View>
            )}

          {console.log(appMainData.long_term_service, "long_term_service")}

          {appMainData &&
            appMainData?.long_term_service &&
            !!appMainData?.long_term_service.length && (
              <>
                <View>{listHeader(strings.LONGTERMSERVICE)}</View>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={appMainData?.long_term_service}
                  renderItem={renderFeaturedProducts}
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginRight: moderateScale(16) }} />
                  )}
                  ListHeaderComponent={() => (
                    <View style={{ marginLeft: moderateScale(16) }} />
                  )}
                  ListFooterComponent={() => (
                    <View style={{ marginRight: moderateScale(16) }} />
                  )}
                  contentContainerStyle={{
                    marginBottom: height / 20,
                  }}
                />
              </>
            )}

          {/* {appIds.orderchekout == DeviceInfo.getBundleId() ? (
            <></>
          ) : (
            <View>
              {appMainData &&
                appMainData?.on_sale_products &&
                !!appMainData?.on_sale_products.length && (
                  <>
                    <View>{listHeader(strings.ON_SALE)}</View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      keyExtractor={(item) => item?.id.toString() || ''}
                      data={appMainData?.on_sale_products}
                      renderItem={renderSale}
                      ItemSeparatorComponent={() => (
                        <View style={{marginRight: moderateScale(16)}} />
                      )}
                      ListHeaderComponent={() => (
                        <View style={{marginLeft: moderateScale(16)}} />
                      )}
                      ListFooterComponent={() => (
                        <View style={{marginRight: moderateScale(16)}} />
                      )}
                    />
                  </>
                )}
            </View>
          )} */}
        </Animatable.View>
      </ScrollView>

      {getBundleId() == appIds.easyDrink && isConfirmAgeModal && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={isConfirmAgeModal}
            // onRequestClose={() => {
            //   Alert.alert("Modal has been closed.");
            //   setModalVisible(!modalVisible);
            // }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View style={styles.innerAgeModaleView}>
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    marginBottom: moderateScale(10),
                  }}
                >
                  <Image
                    style={{
                      height: moderateScaleVertical(25),
                      width: moderateScale(25),
                    }}
                    source={imagePath.icCross18}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.ageModalText,
                    { color: isDarkMode ? colors.white : colors.black },
                  ]}
                >
                  {strings.AGE_VERIFICATION}
                </Text>
                {/* <View style={styles.horizontalLine} /> */}
                <View style={styles.horizontalLine}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={2}
                    dashColor={colors.black}
                    style={{ marginTop: moderateScale(7) }}
                  />
                </View>
                <Text style={styles.ageConfirmationText}>
                  {strings.YOU_MUST_BE_18}
                </Text>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(10),
                    width: "70%",
                  }}
                >
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={{
                      fontFamily: fontFamily.medium,
                      color: colors.white,
                    }}
                    onPress={() => {
                      onConfirmAge(false);
                    }}
                    borderRadius={moderateScale(5)}
                    btnText={strings.YES_I_AM_ABOVE_18}
                    containerStyle={{
                      width: "100%",
                    }}
                  />
                </View>

                <Text onPress={OnTakeMeOut} style={styles.takeMeOutStyle}>
                  {strings.TAKE_ME_OUT}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </View>
  );
}
