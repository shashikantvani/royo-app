import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BlurView } from "@react-native-community/blur";
// import Clipboard from "@react-native-community/clipboard";
import Clipboard from '@react-native-clipboard/clipboard';
import _, { cloneDeep, debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import { useDarkMode } from "react-native-dark-mode";
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { UIActivityIndicator } from "react-native-indicators";
import LinearGradient from "react-native-linear-gradient";
import Share from "react-native-share";
import Toast from "react-native-simple-toast";
import SectionList from "react-native-tabs-section-list";
import { useSelector } from "react-redux";
import BottomSlideModal from "../../Components/BottomSlideModal";
import CustomAnimatedLoader from "../../Components/CustomAnimatedLoader";
import DifferentAddOns from "../../Components/DifferentAddOns ";
import FilterComp from "../../Components/FilterComp";
import GradientButton from "../../Components/GradientButton";
import GradientCartView from "../../Components/GradientCartView";
import HomeServiceVariantAddons from "../../Components/HomeServiceVariantAddons";
import { loaderOne } from "../../Components/Loaders/AnimatedLoaderFiles";
import HeaderLoader from "../../Components/Loaders/HeaderLoader";
import HomeLoader from "../../Components/Loaders/HomeLoader";
import ProductListLoader3 from "../../Components/Loaders/ProductListLoader3";
import NoDataFound from "../../Components/NoDataFound";
import ProductCard4 from "../../Components/ProductCard4";
import RepeatModal from "../../Components/RepeatModal";
import VariantAddons from "../../Components/VariantAddons";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import staticStrings from "../../constants/staticStrings";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import commonStylesFunc, { hitSlopProp } from "../../styles/commonStyles";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import { currencyNumberFormatter } from "../../utils/commonFunction";
import {
  checkEvenOdd,
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
import { removeItem } from "../../utils/utils";
import stylesFunc from "./styles";

let timeOut = undefined;

var tempQty = 0;
var loadMore = true;

const filtersData = [
  {
    id: -2,
    label: strings.SORT_BY,
    value: [
      {
        id: 1,
        label: strings.LOW_TO_HIGH,
        labelValue: "low_to_high",
        parent: strings.SORT_BY,
      },
      {
        id: 2,
        label: strings.HIGH_TO_LOW,
        labelValue: "high_to_low",
        parent: strings.SORT_BY,
      },
      {
        id: 3,
        label: strings.POPULARITY,
        labelValue: "popularity",
        parent: strings.SORT_BY,
      },
      {
        id: 4,
        label: strings.MOST_PURCHASED,
        labelValue: "most_purcahsed",
        parent: strings.SORT_BY,
      },
    ],
  },
];

export default function Products({ route, navigation }) {
  const bottomSheetRef = useRef(null);
  let selectedFilters = useRef(null);
  // console.log(route.params, 'route.params');
  const { data } = route.params;
  const routeData = data?.fetchOffers;
  const { blurRef } = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const CartItems = useSelector((state) => state?.cart?.cartItemCount);
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);

  const [activeIdx, setActiveIdx] = useState(0);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  let sectionListRef = useRef(null);
  const [state, setState] = useState({
    sortFilters: filtersData,
    searchInput: "",
    pageNo: 1,
    limit: 200,
    selectedItemID: -1,
    selectedDiffAdsOnId: 0,
    minimumPrice: 0,
    maximumPrice: 50000,
    typeId: null,
    cartId: null,
    selectedItemIndx: null,
    // selectedSortFilter: {id: 1,
    //   label: "A to Z",
    //   labelValue: "a_to_z",
    //   parent: "Sort by",},
    selectedSortFilter: null,
    updateQtyLoader: false,
    isSearch: false,
    isLoadingC: false,
    AnimatedHeaderValue: false,
    btnLoader: false,
    offersModalVisible: false,
    MenuModalVisible: false,
    updateTagFilter: false,
    differentAddsOnsModal: false,
    isShowFilter: false,
    showListEndLoader: false,

    slider1ActiveSlide: 0,
    productId: null,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    showErrorMessageTitle: false,
    selectedVariant: null,
    selectedOption: null,
    isProductImageLargeViewVisible: false,
  });
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector((state) => state?.initBoot);

  let businessType = appData?.profile?.preferences?.business_type || null;

  const {
    isLoadingC,
    pageNo,
    limit,
    minimumPrice,
    maximumPrice,
    AnimatedHeaderValue,
    updateQtyLoader,
    cartId,
    isSearch,
    searchInput,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    typeId,
    offersModalVisible,
    MenuModalVisible,
    updateTagFilter,
    differentAddsOnsModal,
    selectedDiffAdsOnId,
    isShowFilter,
    selectedSortFilter,
    showListEndLoader,

    variantSet,
    addonSet,
    productDetailData,
    showErrorMessageTitle,
    productTotalQuantity,
    productPriceData,

    productSku,
    productVariantId,
    productQuantityForCart,

    selectedVariant,
    selectedOption,
    isProductImageLargeViewVisible,
  } = state;
  const [showShimmer, setShowShimmer] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isVisibleHomeServiceModal, setIsVisiblHomeServiceModal] =
    useState(false);

  const [productListData, setProductListData] = useState([]);
  const [sectionListData, setSectionListData] = useState([]);
  const [cloneSectionList, setCloneSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [listendLoad, stListendLoader] = useState(false);
  const [repeatItems, setRepeatItems] = useState(null);
  const [selectedCartItem, setSelectedCarItems] = useState(null);
  const [differentAddsOns, setDifferentAddsOns] = useState([]);
  const [selectedDiffAdsOnItem, setSelectedDiffAdsOnItem] = useState(null);
  const [selectedDiffAdsOnSection, setSelectedDiffAdsOnSection] =
    useState(null);
  const [allFilters, setAllFilter] = useState([]);
  const [ProductTags, setProductTags] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [storeLocalQty, setStoreLocalQty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productListId, setProductListId] = useState(data);
  const [isLoading, setLoading] = useState(true);
  const [apiHitAgain, setApiHitAgain] = useState(false);
  const [animateText, setAnimateText] = useState(0);
  const [isSingleVendor, setIsSingleVendor] = useState({});
  const [filteredAtoZData, setFilteredAtoZData] = useState([]);
  const [
    productDataLengthAfterViewMoreSearch,
    setProductDataLengthAfterViewMoreSearch,
  ] = useState([1]);
  const [currentPage, setCurrentPage] = useState({
    current_page: 1,
    id: 0,
  });
  const [tagFilteredData, setTagFilteredData] = useState([]);
  const [isFilteredData, setIsFilteredData] = useState(false);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  const styles = stylesFunc({
    themeColors,
    fontFamily,
    isDarkMode,
    MyDarkTheme,
  });
  console.log(
    productDataLengthAfterViewMoreSearch,
    "productDataLengthAfterViewMoreSearch"
  );

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector((state) => state?.auth?.userData);
  //app Main Data
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const updateState = (data) => {
    setState((state) => ({ ...state, ...data }));
  };

  //usecallback functions
console.log(isVisibleModal,"isVisibleModalisVisibleModal")
  const renderSectionItem = useCallback(
    ({ item, index, section }) => {
      // const url1 = item?.media[0]?.image?.path.image_fit;
      return (
        <View
          key={String(index)}
          style={
            {
              // height: 180,
              // minHeight: url1
              //   ? moderateScaleVertical(200)
              //   : 0,
              // overflow: 'visible',
              // backgroundColor: 'red',
              // marginBottom: moderateScaleVertical(5),
            }
          }
        >
          <ProductCard4
            data={item}
            index={index}
            onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() => addSingleItem(item, section, index)}
            onIncrement={() => checkIsCustomize(item, section, index, 1)}
            onDecrement={() => checkIsCustomize(item, section, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={btnLoader}
            selectedItemIndx={selectedItemIndx}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
            section={section}
          />
        </View>
      );
    },
    [
      cloneSectionList,
      btnLoader,
      productListId,
      repeatItems,
      cartId,
      categoryInfo,
    ]
  );

  const getItemLayout = useCallback((data, index) => {
    return { length: 180, offset: 180 * index, index };
  }, []);

  const renderSectionHeader = useCallback(
    (props) => {
      const { section } = props;
      return (
        <View
          style={{
            marginHorizontal: moderateScale(16),
            marginVertical: moderateScaleVertical(8),
          }}
        >
          <Text
            style={{
              ...styles.hdrTitleTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : "#808080",
            }}
          >
            {section?.translation[0]?.name}
          </Text>
        </View>
      );
    },
    [cloneSectionList]
  );

  const renderSectionTab = useCallback(
    (props) => {
      const { translation, isActive, index } = props;

      return (
        <LinearGradient
          style={{
            marginTop: moderateScaleVertical(4),
            marginLeft: moderateScale(12),
            marginBottom: moderateScaleVertical(16),
            padding: 8,
            borderRadius: moderateScale(10),
            // borderWidth: 1,
            // borderColor: colors.black,
          }}
          // colors={
          //   props.isActive
          //     ? ["rgba(100,183,236,0.46)", "rgba(164,205,62,0.68)"]
          //     : [colors.greyA, colors.greyA]
          // }
        >
          {/* <View
            // animation={'fadeInUp'}
            style={{
              marginTop: moderateScaleVertical(4),
              marginLeft: moderateScale(12),
              marginBottom: moderateScaleVertical(16),
              padding: 4,
              borderBottomWidth: 3,
              borderColor: props.isActive
                ? themeColors.primary_color
                : colors.transparent,
              backgroundColor: colors.green,
            }}
          > */}
          <TouchableOpacity onPress={() => scrollHeader(index)}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {translation[0]?.name}
            </Text>
          </TouchableOpacity>
          {/* </View> */}
        </LinearGradient>
      );
    },
    [AnimatedHeaderValue]
  );

  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?.id}`,
    [productListData, cloneSectionList]
  );

  const listEmptyComponent = useCallback(() => {
    return (
      <NoDataFound
        isLoading={isLoading}
        containerStyle={{}}
        text={strings.NOPRODUCTFOUND}
      />
    );
  }, [isLoading, productListData, sectionListData]);

  const listFooterComponent = () => {
    return (
      <>
        {!!loadMore && (
          <View style={{ height: moderateScale(60) }}>
            <UIActivityIndicator />
          </View>
        )}
      </>
    );
  };

  const renderProduct = useCallback(
    ({ item, index }) => {
      return (
        <View key={String(index)} style={{ flex: 1 }}>
          <ProductCard4
            data={item}
            index={index}
            onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() => addSingleItem(item, null, index)}
            onIncrement={() => checkIsCustomize(item, null, index, 1)}
            onDecrement={() => checkIsCustomize(item, null, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={false}
            selectedItemIndx={selectedItemIndx}
            differentAddsOns={differentAddsOns}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
          // section={section}
          />
          <View style={styles.horizontalLine} />
        </View>
      );
    },
    [
      productListData,
      btnLoader,
      productListId,
      repeatItems,
      cartId,
      categoryInfo,
    ]
  );

  const preLoadImages = async (data) => {
    data.map((item) => {
      item?.data.map((val) => {
        if (val?.media?.length > 0) {
          const url1 = val?.media[0]?.image?.path?.image_fit;
          const url2 = val?.media[0]?.image?.path?.image_path;
          FastImage.preload([{ uri: getImageUrl(url1, url2, "200/200") }]);
        }
      });
    });
  };

  const addSingleItem = useCallback(
    async (item, section = null, inx) => {
      console.log(item, "item>>>>>item");
      if (
        !!categoryInfo?.is_vendor_closed &&
        !categoryInfo?.show_slot &&
        !categoryInfo?.closed_store_order_scheduled
      ) {
        alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
        return;
      }
      // playHapticEffect(hapticEffects.impactLight);
      let getTypeId =
        !!item?.category && item?.category?.category_detail?.type_id;
      updateState({ selectedItemID: item?.id, btnLoader: true });

      if (item?.add_on_count !== 0 || item?.variant_set_count !== 0) {
        console.log("coming hereeee");
        setSelectedSection(section);
        setSelectedCarItems(item);
      
        item?.category?.category_detail?.type_id == 8
          ? setIsVisiblHomeServiceModal(true)
          : setIsVisibleModal(true);
        updateState({
          updateQtyLoader: false,
          typeId: getTypeId,
          selectedItemID: -1,
          btnLoader: false,
        });
        return;
      }

      if (item?.add_on_count === 0 && item?.mode_of_service === "schedule") {
        console.log("coming hereeee2", getTypeId);

        setSelectedSection(section);
        setSelectedCarItems(item);
        item?.category?.category_detail?.type_id == 8
          ? setIsVisiblHomeServiceModal(true)
          : setIsVisibleModal(true);

        updateState({
          updateQtyLoader: false,
          typeId: getTypeId,
          selectedItemID: -1,
          btnLoader: false,
        });
        return;
      }

      let data = {};
      data["sku"] = item.sku;
      data["quantity"] = !!item?.minimum_order_count
        ? Number(item?.minimum_order_count)
        : 1;
      data["product_variant_id"] = item?.variant[0].id;
      data["type"] = dine_In_Type;

      console.log("Sending api data", data);
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          console.log(res.data, "add single item addProductsToCart");
          actions.cartItemQty(res);
          updateState({ cartId: res.data.id });
          // showSuccess('Product successfully added');
          if (!!section) {
            console.log("itemSectionUpdateitemSectionUpdate", section);
            //here we updated particular item of array with the help of item index and section index.
            let itemSectionUpdate = cloneDeep(section);
            itemSectionUpdate.data[inx].qty = !!itemSectionUpdate?.data[inx]
              ?.minimum_order_count //here we added new key name as qty
              ? Number(itemSectionUpdate?.data[inx]?.minimum_order_count)
              : 1;
            itemSectionUpdate.data[inx].cart_product_id =
              res.data.cart_product_id;
            let sectionItem = cloneDeep(sectionListData);
            sectionItem[section.index] = itemSectionUpdate;
            setSectionListData(sectionItem);
            setCloneSectionList(sectionItem);
            fetchTags(sectionItem);
          } else {
            let updateArray = productListData.map((val, i) => {
              if (val.id == item.id) {
                return {
                  ...val,
                  qty: !!item?.minimum_order_count
                    ? Number(item?.minimum_order_count)
                    : 1,
                  cart_product_id: res.data.cart_product_id,
                  isRemove: false,
                };
              }
              return val;
            });
            setProductListData(updateArray);
          }
          setSelectedSection(section);
          setSelectedCarItems(item);
          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        })
        .catch((error) => errorMethodSecond(error, [], item, section, inx));
    },
    [cloneSectionList, productListData, selectedCartItem]
  );

  const checkIsCustomize = useCallback(
    async (item, section = null, index, type) => {
      let itemToUpdate = cloneDeep(item);
      // console.log('check item to update', itemToUpdate);
      // return;

      if (
        itemToUpdate?.add_on_count == 0 &&
        itemToUpdate?.variant_set_count == 0
      ) {
        // hit in case of simple products withou any customization
        addProductsWithoutCustomize(item, section, index, type);
        return;
      }

      let productId = !!itemToUpdate?.cart_product_id
        ? itemToUpdate?.cart_product_id
        : itemToUpdate?.check_if_in_cart_app[0]?.id;
      let parentCartId = !!cartId
        ? cartId
        : itemToUpdate.check_if_in_cart_app[0]?.cart_id;

      var totalProductQty = 0;
      if (itemToUpdate?.variant && itemToUpdate?.check_if_in_cart_app) {
        itemToUpdate?.check_if_in_cart_app.map((val) => {
          totalProductQty = totalProductQty + val?.quantity;
        });
      }
      console.log("totalProductQty", totalProductQty);

      // return;

      var isExistqty = itemToUpdate?.qty ? itemToUpdate?.qty : totalProductQty; //this variable contain only local product quantity
      var tempQty = 0; //this variable contain latest updated quantity of products

      if (
        (type == 2 && itemToUpdate?.add_on_count !== 0) ||
        (type == 2 && itemToUpdate?.variant_set_count !== 0)
      ) {
        //hit in case of subtruction
        let apiData = { cart_id: parentCartId, product_id: item.id };
        let checkIsAvailable = await getDiffAddsOn(apiData, section, item); //check products with different addOns is exist or not.
        // console.log("check available", checkIsAvailable)
        !!checkIsAvailable?.data &&
          checkIsAvailable?.data.map((val) => {
            console.log("check available", val);
            tempQty = tempQty + val?.quantity; //store updated total quantity of products
          });

        if (!!checkIsAvailable?.goNext) {
          //if different adOns is exist then open DifferentAddOns Modal.
          return;
        }
      }

      if (type == 2) {
        // direct subtract customize items if products added with same addons
        addDeleteCartItems(
          itemToUpdate,
          tempQty == 0 ? isExistqty : tempQty,
          productId,
          parentCartId,
          section,
          index,
          2
        );
        return;
      }

      if (type == 1) {
        //hit in case of add new products
        let apiData = { cart_id: parentCartId, product_id: item.id };
        let header = {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        };
        console.log("api data checkLastAdded", apiData);
        try {
          // setRepeatItems(true);
          const res = await actions.checkLastAdded(apiData, header);
          console.log("check last addedres++++++", res);
          if (!!res.data) {
            //open RepeatModal
            const addData = {
              item: itemToUpdate,
              index: index,
              type: type,
              section: section,
              isExistqty: tempQty == 0 ? isExistqty : tempQty,
              updateLocalQty: res.data?.quantity,
              productId: res?.data?.id,
              parentCartId: res.data.cart_id,
            };
            setSelectedSection(section);
            setRepeatItems(addData);
          }
        } catch (error) {
          console.log("error riased++++", error);
          showError(error?.message || error?.error);
        }
        return;
      }
    },
    [cloneSectionList, productListData, selectedCartItem]
  );

  //useCallback end

  useEffect(() => {
    // setLoading(true)
    updateState({ pageNo: 1 });
    loadMore = true;
    getAllListItems(1);
    if (productListId?.vendor && routeData) {
      fetchOffers();
    }
    if (isLoadingC) {
      getAllProductsByCategoryId(true);
    }
  }, [navigation, languages, currencies, reloadData]);

  const getAllProductTags = () => {
    actions
      .getAllProductTags(
        "",
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        const productTagsArr = res?.data?.map((el) => {
          return {
            ...el,
            isSelected: false,
          };
        });
        setProductTags(productTagsArr);

        // if (res && res.data) {
        //   updateState({allAvailableCoupons: res.data});
        // }
      })
      // .catch(errorMethod);
      .catch((error) => {
        console.log("tags api error >>>>>", error);
      });
  };

  const getAllListItems = (pageNo = 1) => {
    if (data?.vendor) {
      console.log(data, "getAllListItemsdata");
      {
        console.log(selectedFilters.current, "selectedFilters.current"); //false
        !!selectedFilters.current
          ? newVendorFilter(pageNo)
          : getAllProductsByVendor(pageNo);
      }
    } else {
      {
        !!selectedFilters.current
          ? getAllProductsCategoryFilter(pageNo)
          : getAllProductsByCategoryId(pageNo);
      }
    }
  };

  //  to load  catagerios by A-z
  // const onAtoZFilter  =  () => {
  //   try {
  //     let allFilterData = cloneDeep(allFilters);
  //     var newData = [];
  //     var variants = [];
  //     var options = [];

  //     var allSelectedVariantOptionsPairs = allFilterData
  //         .filter((i) => i?.id != -1 && i?.id != -2)
  //         .map((itm, inx) => {
  //             return itm?.value;
  //         })
  //         .map((j, jnx) => {
  //             if (j.length) return j.filter((x) => x?.value?.selected);
  //         })
  //         .filter((final) => final?.length)
  //         .map((finalArray, finalIndex) => {
  //             finalArray?.map((z, znx) => {
  //                 newData?.push(z);
  //             });
  //             return finalArray;
  //         });

  //     if (newData.length) {
  //         newData.map((i) => {
  //             variants.push(i?.variant_type_id);
  //             options.push(i?.id);
  //         });
  //         allSelectedVariantOptionsPairs = newData;
  //     }

  //     let filterData = {
  //         selectedSorting: 'a_to_z',
  //         selectedVariants: variants,
  //         selectedOptions: options,
  //         sleectdBrands: []
  //     }
  //     onFilterApply(filterData)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    getAllVendorFilters();
  }, []);

  const getAllVendorFilters = () => {
    actions
      .getVendorFilters(
        `/${productListId?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        console.log(res, "getVendorFilter with variants");

        if (!!res.data.filterData?.length) {
          let filterDataNew = res.data.filterData.map((i, inx) => {
            return {
              id: i.variant_type_id,
              label: i.title,
              value: i.options.map((j, jnx) => {
                return {
                  id: j.id,
                  parent: i.title,
                  label: j.title,
                  variant_type_id: i.variant_type_id,
                };
              }),
            };
          });
          setAllFilter(filterDataNew);
          console.log("filterDataNewfilterDataNew", filterDataNew);
        }
        // getAllVendorFilters()
      })
      .catch(errorMethod);
    // }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    console.log("api hit getAllProductsByVendorCategory", data);
    actions
      .getProductByVendorCategoryId(
        `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        console.log(res, "getProductByVendorCategoryId");
        // setFilterData(res?.data?.filterData)
        setCategoryInfo(res?.data?.vendor);
        setLoading(false);
        setProductListData(
          pageNo == 1
            ? res.data.products.data
            : [...productListData, ...res?.data?.products?.data]
        );
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];
    // if (allBrands.length) {
    //   brandDatas = [
    //     {
    //       id: -1,
    //       label: strings.BRANDS,
    //       value: allBrands.map((i, inx) => {
    //         return {
    //           id: i?.translation[0]?.brand_id,
    //           label: i?.translation[0]?.title,
    //           parent: strings.BRANDS,
    //         };
    //       }),
    //     },
    //   ];

    //   updateState({allFilters: [...allFilters,...brandDatas]});
    // }

    // Price filter
    if (!!filterData?.length) {
      filterDataNew = filterData.map((i, inx) => {
        return {
          id: i.variant_type_id,
          label: i.title,
          value: i.options.map((j, jnx) => {
            return {
              id: j.id,
              parent: i.title,
              label: j.title,
              variant_type_id: i.variant_type_id,
            };
          }),
        };
      });
      setAllFilter(filterDataNew);
    }
  };

  const onFilterApply = (filterData = {}) => {
    console.log(filterData, "filterDatafilterData");
    selectedFilters.current = filterData;
    // setFilteredAtoZData(filterData)
    loadMore = true;
    updateState({ pageNo: 1 });
    getAllListItems(1);
  };
  const allClearFilters = () => {
    loadMore = true;
    selectedFilters.current = null;
    updateState({
      pageNo: 1,
      selectedSortFilter: null,
      minimumPrice: 0,
      maximumPrice: 50000,
    });
    getAllListItems(1);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = (pageNo) => {
    console.log(data, "api hit getAllProductsByVendor");

    let vendorId = !!data?.vendorData ? data?.vendorData.id : productListId.id;

    let apiData = `/${vendorId}?page=${pageNo ? pageNo : 1}&type=${dineInType}`;
    if (!!data?.categoryExist) {
      //sent category id if user comes from category>>vendor>>productList

      apiData = apiData + `&category_id=${data?.categoryExist}`;
    }
    console.log(apiData, "apiData");
    actions
      .getProductByVendorIdOptamizeV2(
        apiData,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          latitude: appMainData?.reqData?.latitude,
          longitude: appMainData?.reqData?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then(async (res) => {
        console.log("get all products by vendor res", res?.data);
        // return;
        if (res?.data?.vendor) {
          FastImage.preload([
            {
              uri: getImageUrl(
                res?.data?.vendor?.banner?.image_fit ||
                res?.data?.vendor?.image?.image_fit,
                res?.data?.vendor?.banner?.image_path ||
                res?.data?.vendor?.image?.image_path,
                "400/400"
              ),
            },
          ]); //category banner preload
        }
        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];
          await preLoadImages(resData);
          setSectionListData(resData);
          setCloneSectionList(resData);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          fetchTags(resData);
          setLoading(false);
        } else {
          console.log("fetch data res ", res);

          if (res?.data) {
            if (res.data.products.data.length == 0) {
              loadMore = false;
            }
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res?.data?.products.data
                : [...productListData, ...res?.data?.products.data]
            );
          } else {
            setLoading(false);
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(
            res?.data?.filterData,
            appMainData.brands
          );
        }
      })
      .catch(errorMethod);
  };

  //***************get products by vendor filter**************
  const newVendorFilter = async (pageNo, loading = false) => {
    console.log("api hit new vendorFilter", selectedFilters);
    let data = {};
    data["variants"] = selectedFilters?.current?.selectedVariants || [];
    data["options"] = selectedFilters?.current?.selectedOptions || [];
    data["brands"] = selectedFilters?.current?.sleectdBrands || [];
    data["order_type"] = selectedFilters?.current?.selectedSorting || 0;
    data["range"] = `${minimumPrice};${maximumPrice}`;
    data["vendor_id"] = productListId.id;
    // data['limit'] = limit;
    data["page"] = pageNo;
    data["type"] = dineInType;
    data["tag_products"] =
      ProductTags && ProductTags?.length
        ? ProductTags.map((i) => {
          return i?.isSelected ? i?.id : null;
        }).filter((x) => x != null)
        : [];
    console.log(data, ">data>data");
    console.log("sending data", data);
    setLoading(loading ? false : true);
    actions
      .newVendorFilters(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(async (res) => {
        console.log("filter vendor res", res);

        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];
          // await preLoadImages(resData);
          setSectionListData(resData);
          setCloneSectionList(resData);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          // fetchTags(resData);
          setLoading(false);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (res?.data) {
            if (res.data.products.data.length == 0) {
              loadMore = false;
            }
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data]
            );
          } else {
            setLoading(false);
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
        }
      })
      .catch(errorMethod);
    // }
  };
  /**********Get all list items by category id */
  const getAllProductsByCategoryId = (pageNo) => {
    console.log("api hit getProductByCategoryId", data);
    actions
      .getProductByCategoryIdOptamize(
        `/${productListId?.id}?page=${pageNo}&product_list=${data?.rootProducts ? true : false
        }&type=${dineInType} `,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        console.log(res, "resres");

        if (!!res?.data) {
          console.log(res, "res getProductByCategoryId");
          setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
          // checkSingleVendor(categoryInfo ? categoryInfo : res.data.category)
          // setCategoryInfo(res.data.category);
          setLoading(false);

          if (res.data.listData.data.length == 0) {
            loadMore = false;
          }
          // onAtoZFilter()
          setProductListData(
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data]
          );
          if (
            pageNo == 1 &&
            res?.data?.listData?.data.length == 0 &&
            res?.data?.category &&
            res?.data?.category?.childs.length
          ) {
            setSelectedCategory(res.data.category.childs[0]);
            setProductListId(res.data.category.childs[0]);
            updateState({
              pageNo: 1,
              limit: 10,
              isLoadingC: true,
            });
          }
          setLoading(false);
        }
        setLoading(false);
        // getAllVendorFilters()
        // updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })

      .catch(errorMethod);
    // }
  };

  /**********Get all list items category filters */
  const getAllProductsCategoryFilter = (pageNo) => {
    let data = {};
    data["variants"] = selectedFilters?.current?.selectedVariants || [];
    data["options"] = selectedFilters?.current?.selectedOptions || [];
    data["brands"] = selectedFilters?.current?.sleectdBrands || [];
    data["order_type"] = selectedFilters?.current?.selectedSorting || 0;
    data["range"] = `${minimumPrice};${maximumPrice}`;
    console.log("api hit getAllProductsCategoryFilter", data);

    actions
      .getProductByCategoryFiltersOptamize(
        `/${productListId.id}?page=${pageNo}&product_list=${data?.rootProducts ? true : false
        }&type=${dineInType}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        setLoading(false);

        if (res.data.data.length == 0) {
          loadMore = false;
        }
        console.log(res, "getAllProductsCategoryFilter  res ++++++");
        setLoading(false);
        setProductListData(
          pageNo == 1 ? res.data.data : [...productListData, ...res.data.data]
        );
        setLoading(false);
      })
      .catch(errorMethod);
    // }
  };

  const fetchTags = (filterArray) => {
    if (filterArray && filterArray.length > 0) {
      let tagsArr = [];
      filterArray.forEach((el) => {
        // console.log('checking data for tags >>>', el);
        el.data.forEach((data_) => {
          if (data_ && data_.tags) {
            tagsArr.push(...data_.tags);
          }
        });
      });
      tagsArr = _.uniqBy(tagsArr, "tag_id");
      let productTagsArr = tagsArr.map((el) => {
        return {
          ...el.tag,
          isSelected: false,
        };
      });
      setProductTags(productTagsArr);
    }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item) => {
    playHapticEffect(hapticEffects.impactLight);
    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          }
        )
        .then((res) => {
          console.log(res, "updateProductWishListData");
          showSuccess(res.message);
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  /*******Upadte products in wishlist>*********/
  const updateProductList = (item) => {
    let newArray = cloneDeep(productListData);
    newArray = newArray.map((i, inx) => {
      if (i.id == item.id) {
        if (item.inwishlist) {
          i.inwishlist = null;
          return { ...i, inwishlist: null };
        } else {
          return { ...i, inwishlist: { product_id: i.id } };
        }
      } else {
        return i;
      }
    });
    setProductListData(newArray);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
    });
  };

  const errorMethod = (error) => {
    console.log("checking error", error);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
    });
    setLoading(false);
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1 });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (loadMore) {
      updateState({ pageNo: pageNo + 1 });
      getAllListItems(pageNo + 1);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const clearCartAndAddProduct = async (item, section = null) => {
    updateState({ updateQtyLoader: true });
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
        console.log("clear cart and add product res", res);
        // alert("add single item")
        addSingleItem(item, section);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const hideDifferentAddOns = () => {
    updateState({ differentAddsOnsModal: false });
    setDifferentAddsOns([]);
  };

  const onCloseModal = () => {
    setIsVisibleModal(false);
    setIsVisiblHomeServiceModal(false);
    setShowShimmer(true);
  };

  const addDeleteCartItems = async (
    item,
    isExistqty,
    isExistproductId,
    isExistCartId,
    section = null,
    index,
    type,
    updateLocalQty = null,
    differentAddsOnsQty = null
  ) => {
    console.log("categoryInfocategoryInfo", index);
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      if (type == 1) {
        //user can remove item if vendor closed
        alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
        return;
      }
    }
    let quantityToIncreaseDecrease = !!item?.batch_count
      ? Number(item?.batch_count)
      : 1;
    // playHapticEffect(hapticEffects.impactLight);

    let quanitity = null;
    let itemToUpdate = cloneDeep(item);

    console.log("exist qty", isExistqty);
    /** This will restring unneccessary api call , only hit api once user wait for 1.5 seconds ***/

    if (timeOut) {
      clearTimeout(timeOut);
    }

    tempQty = tempQty + 1;

    if (type == 1) {
      quanitity = Number(isExistqty) + quantityToIncreaseDecrease;
    } else {
      console.log(isExistqty, item?.minimum_order_count, "kdhgkjdfkjgh");
      if (
        Number(isExistqty - item?.batch_count) <
        Number(item?.minimum_order_count)
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(isExistqty) - quantityToIncreaseDecrease;
      }
    }

    updateLocally(
      section,
      quanitity,
      item,
      isExistproductId,
      differentAddsOnsQty,
      index
    );

    timeOut = setTimeout(
      () => {
        if (quanitity) {
          updateState({
            selectedItemID: itemToUpdate.id,
            btnLoader: true,
            selectedItemIndx: index,
          });
          let data = {};
          data["cart_id"] = isExistCartId;
          data["quantity"] = !!updateLocalQty
            ? type == 1
              ? updateLocalQty + quantityToIncreaseDecrease
              : updateLocalQty - quantityToIncreaseDecrease
            : quanitity;
          data["cart_product_id"] = isExistproductId;
          data["type"] = dineInType;
          console.log("sending api data", data);

          actions
            .increaseDecreaseItemQty(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
              console.log("update qty res", res);
              tempQty = 0;
              actions.cartItemQty(res);
              setAnimateText(res.data.total_payable_amount);
              updateState({
                cartItems: res.data.products,
                cartData: res.data,
                updateQtyLoader: false,
                selectedItemID: -1,
                btnLoader: false,
              });
            })
            .catch(async () => {
              errorMethod();
              if (type == 1) {
                quanitity = quanitity - tempQty;
              } else {
                quanitity = quanitity + tempQty;
              }
              updateLocally(section, quanitity, item, isExistproductId);
              tempQty = 0;
            });
        } else {
          updateState({
            selectedItemID: itemToUpdate?.id,
            btnLoader: false,
          });
          removeItem("selectedTable");
          removeProductFromCart(itemToUpdate, section, isExistproductId);
        }
      },
      quanitity === 1 ? 0 : 900
    );
  };

  const updateLocally = (
    section,
    quanitity,
    item,
    isExistproductId,
    differentAddsOnsQty,
    index
  ) => {
    console.log("quanitity", quanitity);
    console.log("quanitity localy", differentAddsOnsQty);

    // return;
    if (!!section) {
      let itemSectionUpdate = cloneDeep(section);
      itemSectionUpdate.data[index].qty = !!differentAddsOnsQty
        ? differentAddsOnsQty
        : quanitity;
      itemSectionUpdate.data[index].cart_product_id = isExistproductId;

      let sectionItem = cloneDeep(sectionListData);
      sectionItem[section.index] = itemSectionUpdate;
      setSectionListData(sectionItem);
      setCloneSectionList(sectionItem);
      fetchTags(sectionItem);
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: !!differentAddsOnsQty ? differentAddsOnsQty : quanitity,
            cart_product_id: isExistproductId,
            isRemove: false,
          };
        }
        return val;
      });
      setStoreLocalQty(differentAddsOnsQty);
      setProductListData(updateArray);
      updateState({ selectedItemID: -1 });
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (
    itemToUpdate,
    section = null,
    diffAdOnId = 0
  ) => {
    // console.log("item to update remove item", itemToUpdate)

    let updateLocallyAddOns = [];
    if (differentAddsOnsModal) {
      let cloneArr = differentAddsOns;
      updateLocallyAddOns = cloneArr.filter((val) => {
        if (diffAdOnId !== val.id) {
          return val;
        }
      });
      setDifferentAddsOns(updateLocallyAddOns);
    }

    let data = {};
    let isExistproductId = diffAdOnId;
    let isExistCartId =
      !!itemToUpdate?.check_if_in_cart_app &&
        !!itemToUpdate?.check_if_in_cart_app.length > 0
        ? itemToUpdate?.check_if_in_cart_app[0]?.cart_id
        : cartId;
    console.log("item", itemToUpdate);

    data["cart_id"] = isExistCartId;
    data["cart_product_id"] = isExistproductId;
    data["type"] = dineInType;
    updateState({ btnLoader: true });
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == itemToUpdate?.id) {
              return {
                ...x,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                check_if_in_cart_app: differentAddsOnsModal
                  ? updateLocallyAddOns
                  : [],
                // variant: itemToUpdate?.variant.map((val, i) => {
                //   return { ...val, check_if_in_cart_app: differentAddsOnsModal ? updateLocallyAddOns : [] };
                // }),
              };
            }
            return x;
          });
          section["data"] = updatedSection;

          const filterArr = sectionListData.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          const filterArryClone = cloneSectionList.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          setSectionListData(filterArr);
          setCloneSectionList(filterArryClone);

          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        } else {
          let updateArray = productListData.map((val, i) => {
            if (val.id == itemToUpdate.id) {
              return {
                ...val,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                check_if_in_cart_app: differentAddsOnsModal
                  ? updateLocallyAddOns
                  : [],
                // variant: itemToUpdate?.variant.map((val, i) => {
                //   return { ...val, check_if_in_cart_app: differentAddsOnsModal ? updateLocallyAddOns : [] };
                // }),
              };
            }
            return val;
          });
          setProductListData(updateArray);
          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethodSecond = (error, addonSet = [], item, section, inx) => {
    console.log(error, "Error>>>>>");
    console.log("item+++++", item);
    console.log("sectin++++", section);
    updateState({ updateQtyLoader: false });
    if (error?.message?.alert == 1) {
      updateState({
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      setLoading(false);
      // showError(error?.message?.error || error?.error);
      Alert.alert("", strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => console.log("Cancel Pressed"),
          // style: 'destructive',
        },
        {
          text: strings.CLEARCART,
          onPress: () => clearCart(addonSet, item, section, inx),
        },
      ]);
    } else {
      setLoading(false);
      updateState({
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  const clearCart = async (addonSet = [], item, section, inx) => {
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
        addSingleItem(item, section, inx);
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const onRepeat = async () => {
    console.log("repeate items", repeatItems);
    const { item, isExistqty, productId, parentCartId, updateLocalQty } =
      repeatItems;
    await addDeleteCartItems(
      item,
      isExistqty,
      productId,
      parentCartId,
      repeatItems?.section,
      repeatItems?.index,
      1,
      updateLocalQty
    );
    setRepeatItems(null);
  };

  const onAddNew = () => {
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    let getTypeId =
      !!repeatItems?.item?.category &&
      repeatItems?.item?.category.category_detail?.type_id;
    setRepeatItems(null);
    setSelectedCarItems(repeatItems?.item);
    setIsVisibleModal(true);
    updateState({
      updateQtyLoader: false,
      typeId: getTypeId,
      selectedItemID: -1,
      btnLoader: false,
    });
  };

  const addProductsWithoutCustomize = (item, section, index, type) => {
    console.log("very nice", item);
    // return;
    let itemToUpdate = cloneDeep(item);
    let quanitity = !!itemToUpdate?.qty
      ? itemToUpdate?.qty
      : itemToUpdate?.check_if_in_cart_app[0].quantity;
    let productId = !!itemToUpdate?.cart_product_id
      ? itemToUpdate?.cart_product_id
      : itemToUpdate?.check_if_in_cart_app[0].id;
    let parentCartId = !!cartId
      ? cartId
      : itemToUpdate?.check_if_in_cart_app[0].cart_id;

    if (type == 1) {
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        1
      );
    } else {
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        2
      );
    }
  };

  const getDiffAddsOn = async (apiData, section, item) => {
    console.log("get diffadds on data", apiData);
    let header = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
    };
    try {
      const res = await actions.differentAddOns(apiData, header);
      console.log("res+++++++", res);
      if (res?.data.length > 1) {
        setDifferentAddsOns(res?.data || []);
        setSelectedDiffAdsOnItem(item);
        setSelectedDiffAdsOnSection(section);
        updateState({ differentAddsOnsModal: true });
        return { data: res?.data, goNext: true };
      }
      return { data: res?.data, goNext: false };
    } catch (error) {
      console.log("error raised,error");
      return { data: null, goNext: false };
    }
  };

  const difAddOnsAdded = async (
    item,
    qty,
    productId,
    cartId,
    section,
    index,
    type
  ) => {
    let batchCount = !!item?.batch_count ? item?.batch_count : 1;
    let differentAddsOnsQty = 0;
    let cloneArr = differentAddsOns;
    let updateLocallyAddOns = cloneArr.map((val) => {
      differentAddsOnsQty = differentAddsOnsQty + val.quantity;
      if (cartId == val.id) {
        return {
          ...val,
          quantity: type == 1 ? qty + batchCount : qty - batchCount,
        };
      }
      return val;
    });
    await addDeleteCartItems(
      item,
      qty,
      cartId,
      productId,
      section,
      index,
      type,
      null,
      type == 1
        ? differentAddsOnsQty + batchCount
        : differentAddsOnsQty - batchCount //send updated total quantity
    );
    setDifferentAddsOns(updateLocallyAddOns);
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);
    console.log("selcted section", selectedSection);

    if (!!selectedSection) {
      let updatedSection = selectedSection.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return x;
      });
      selectedSection["data"] = updatedSection;
      const filterArr = sectionListData.map((f, fnx) => {
        if (f?.id == selectedSection?.id) {
          return selectedSection;
        }
        return f;
      });
      const filterArryClone = cloneSectionList.map((f, fnx) => {
        if (f?.id == selectedSection?.id) {
          return selectedSection;
        }
        return f;
      });
      setSectionListData(filterArr);
      setCloneSectionList(filterArryClone);
      setStoreLocalQty(quanitity);
      setIsVisibleModal(false);
      updateState({
        cartId: cartID,
      });
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        setStoreLocalQty(quanitity);
        return val;
      });
      setProductListData(updateArray);
      setIsVisibleModal(false);
      updateState({
        cartId: cartID,
      });
    }
  };

  useEffect(() => {
    if (isLoadingC) {
      getAllProductsByCategoryId(1);
      if (productListId?.vendor && routeData) {
        fetchOffers();
      }
      getAllProductTags();
    }
  }, [isLoadingC]);

  const checkIfItemExist = (item, tags) => {
    let result = false;
    tags.forEach((el) => {
      if (el.id === item.tag_id) {
        result = true;
      }
    });
    return result;
  };

  // useEffect(() => {
  //   // console.log(ProductTags, 'ProductTags');
  //   let EnabledTags = ProductTags.filter((el) => el.isSelected);
  //   console.log(EnabledTags, 'EnabledTags');
  //   if (EnabledTags.length > 0) {
  //     console.log(sectionListData, 'sectionListData>>>>BEFORE');
  //     const newArr = sectionListData.map((el) => {
  //       const records =
  //         el.data &&
  //         el.data.filter((item) => {
  //           if (
  //             item.tags.length > 0 &&
  //             checkIfItemExist(item.tags[0], EnabledTags)
  //           )
  //             return item;
  //         });
  //       const newObj = {
  //         ...el,
  //       };
  //       newObj.data = records;
  //       return newObj;
  //     });

  //     console.log(newArr, 'sectionListData>>>>AFTER');
  //     setCloneSectionList(newArr);
  //   } else {
  //     // getAllProductsByVendor();
  //   }
  // }, [ProductTags]);

  useEffect(() => {
    let EnabledTags = ProductTags.filter((el) => el.isSelected);
    if (EnabledTags.length > 0) {
      setApiHitAgain(true);
      // appendData(null,1)
      newVendorFilter(1, true);
      const newArr = sectionListData
        .map((el) => {
          const records =
            el.data &&
            el.data.filter((item) => {
              if (
                item.tags.length > 0 &&
                checkIfItemExist(item.tags[0], EnabledTags)
              )
                return item;
            });
          const newObj = {
            ...el,
          };
          if (records && records.length) {
            newObj.data = records;
            return newObj;
          } else {
            return null;
          }
        })
        .filter((x) => x != null);
      setCloneSectionList(newArr);
      setTagFilteredData(newArr);
      setIsFilteredData(true);
      console.log(newArr, "newArrnewArr");
    } else {
      setCloneSectionList(sectionListData);
      if (apiHitAgain) {
        setIsFilteredData(false);
        setApiHitAgain(false);
        setLoading(true);
        getAllProductsByVendor();
      }
    }
  }, [updateTagFilter, ProductTags]);

  // Search with more
  const onSearchWithinMenu = (text, data = [], withApiSearch = false) => {
    console.log(data, withApiSearch, sectionListData, "datadatadata");
    updateState({ searchInput: text });
    if (text) {
      let searchItems = withApiSearch ? data : sectionListData;

      const newArr = searchItems.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            return item?.translation[0]?.title
              .toLowerCase()
              .includes(text.toLowerCase());
          });
        const newObj = {
          ...el,
        };

        newObj.data = records;
        return newObj;
        console.log("checking products >>>>>", records);
        // Arr.push(...records)
      });
      setCloneSectionList(newArr);
    } else {
      getAllProductsByVendor();
    }
  };

  const fetchOffers = () => {
    let data = {};
    // data['vendor_id'] = 2;
    data["vendor_id"] = productListId?.id;
    // data['cart_id'] = vendorInfo.cartId;
    // console.log(data, 'vendor_id');
    actions
      .getAllPromoCodesForProductList(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        // console.log('res >>>>>>> offers >>>', res);
        if (res && res.data) {
          setOfferList(res.data);
        }
      });
    // .catch(errorMethod);
  };

  const onPressMenuOption = (index) => {
    setActiveIdx(index);
    updateState({ MenuModalVisible: !MenuModalVisible });
    sectionListRef.current.sectionList.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 1,
    });
  };

  const rightIconPress = () => {
    updateState({
      searchInput: "",
      isSearch: false,
    });
    setLoading(false);
  };

  const _onEndList = (data) => {
    console.log(data, "data");
    !categoryInfo?.is_show_products_with_category && onEndReachedDelayed(data);
  };

  // renders

  const listHeaderComponent2 = () => {
    return (
      <View>
        <View
          style={{
            marginBottom: moderateScaleVertical(50),
          }}
        >
          <ImageBackground
            source={{
              uri: getImageUrl(
                // data?.item?.banner.image_fit ||
                categoryInfo?.banner?.image_fit ||
                categoryInfo?.image?.image_fit,
                // data?.item?.banner.image_path ||
                categoryInfo?.banner?.image_path ||
                categoryInfo?.image?.image_path,
                "400/400"
              ),
            }}
            style={{
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              height: width / 1.9,
            }}
            resizeMode="cover"
          >
            <LinearGradient
              style={{
                height: "100%",
              }}
              colors={["rgba(100,183,236,0.5)", "rgba(100,183,236,0.5)"]}
            >
              <SafeAreaView>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: moderateScale(16),
                    marginBottom: moderateScaleVertical(16),
                  }}
                >
                  <TouchableOpacity
                    hitSlop={styles.hitSlopProp}
                    activeOpacity={0.7}
                    style={{}}
                    onPress={() => navigation.goBack()}
                  >
                    <Image
                      source={imagePath.icBackFab}
                      style={{
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      height: moderateScale(100),
                      width: moderateScale(100),
                      borderRadius: moderateScale(50),
                      backgroundColor: colors.white,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FastImage
                      source={{
                        uri: getImageUrl(
                          // data?.item?.banner.image_fit ||
                          categoryInfo?.banner?.image_fit ||
                          categoryInfo?.image?.image_fit,
                          // data?.item?.banner.image_path ||
                          categoryInfo?.banner?.image_path ||
                          categoryInfo?.image?.image_path,
                          "400/400"
                        ),
                      }}
                      style={{
                        height: moderateScale(50),
                        width: moderateScale(50),
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    hitSlop={styles.hitSlopProp}
                    activeOpacity={0.7}
                    onPress={moveToNewScreen(
                      navigationStrings.SEARCHPRODUCTOVENDOR,
                      {
                        type: data?.vendor
                          ? staticStrings.VENDOR
                          : staticStrings.CATEGORY,
                        id: data?.vendor ? data?.id : productListId?.id,
                      }
                    )}
                  >
                    <Image
                      source={imagePath.icSearchFab}
                      style={{
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </LinearGradient>
            <View
              style={{
                ...styles.hdrAbsoluteView,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.grey2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    ...styles.hdrTitleTxt,
                    flex: 0,
                    textAlign: "left",
                    fontSize: textScale(18),
                    color: isDarkMode ? MyDarkTheme.colors.text : "#2F353F",
                  }}
                >
                  {data?.name || categoryInfo?.name || ""}
                </Text>
                {!!categoryInfo &&
                  !!categoryInfo?.product_avg_average_rating ? (
                  <View
                    style={[
                      styles.hdrRatingTxtView,
                      {
                        backgroundColor: colors.yellowC,
                        width: moderateScale(50),
                        justifyContent: "center",
                        height: moderateScale(20),
                      },
                    ]}
                  >
                    <Image
                      style={styles.starImg}
                      source={imagePath.star}
                      resizeMode="contain"
                    />
                    <Text
                      style={[styles.ratingTxt, { fontSize: textScale(9.5) }]}
                    >
                      {Number(categoryInfo?.product_avg_average_rating).toFixed(
                        1
                      )}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    marginTop: moderateScaleVertical(8),
                  }}
                >
                  <Text>{categoryInfo.lineOfSightDistance}</Text>
                  {categoryInfo?.timeofLineOfSightDistance != undefined &&
                    categoryInfo.timeofLineOfSightDistance != null ? (
                    <Text>
                      {" | "}
                      {checkEvenOdd(categoryInfo.timeofLineOfSightDistance)}-
                      {checkEvenOdd(categoryInfo.timeofLineOfSightDistance + 5)}
                    </Text>
                  ) : null}
                </Text>

                <Text
                  style={{
                    ...styles.ratingTxt,
                    color: categoryInfo?.show_slot
                      ? colors.green
                      : categoryInfo?.is_vendor_closed
                        ? colors.redB
                        : colors.green,
                    fontSize: textScale(12),
                    marginRight: moderateScale(7),
                  }}
                >
                  {categoryInfo?.show_slot
                    ? strings.OPEN
                    : categoryInfo?.is_vendor_closed
                      ? strings.CLOSE
                      : strings.OPEN}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  const RenderMenuView = () => {
    return (
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <ScrollView style={{ width: "100%" }}>
          <Text
            style={{
              paddingHorizontal: moderateScale(16),
              fontSize: textScale(14),
              fontFamily: fontFamily.medium,
            }}
          >
            {strings.MENU}
          </Text>
          <View
            style={{
              width: "100%",
              height: 1,
              marginVertical: moderateScaleVertical(10),
            }}
          />
          {cloneSectionList.map((el, index) => {
            console.log("cloneSectionList>>>el", el);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPressMenuOption(index)}
                style={styles.menuView}
              >
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}
                >
                  {el?.translation[0]?.name}
                </Text>
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}
                >
                  {el.data.length}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const RenderOfferView = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: textScale(14),
            paddingHorizontal: moderateScale(15),
            fontFamily: fontFamily.regular,
          }}
        >
          {strings.AVAILABLE_OFFERS}
        </Text>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: colors.greyMedium,
            marginVertical: moderateScaleVertical(10),
          }}
        />
        <ScrollView style={{ width: "100%" }}>
          {offerList?.length > 0 &&
            offerList.map((el, indx) => {
              // console.log(el);
              return (
                <View
                  key={indx}
                  style={{
                    borderBottomWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    width: "100%",
                    borderBottomColor: colors.greyMedium,
                    marginBottom: moderateScale(10),
                  }}
                >
                  <Text
                    style={{
                      fontSize: textScale(13),
                      marginBottom: moderateScale(5),
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {el.title ? el.title : ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(11),
                      marginBottom: moderateScale(5),
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.regular,
                    }}
                  >
                    {el.title ? el.title : ""}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      borderTopWidth: 1,
                      borderTopColor: colors.greyMedium,
                      alignItems: "center",
                      paddingTop: moderateScaleVertical(15),
                      marginTop: moderateScale(8),
                      paddingBottom: moderateScale(15),
                    }}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.primary_color,
                        borderRadius: moderateScale(3),
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: moderateScale(4),
                        borderStyle: "dashed",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: textScale(11),
                          fontFamily: fontFamily.regular,
                          textTransform: "uppercase",
                        }}
                      >
                        {el.name ? el.name : ""}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(`${el.name ? el.name : ""}`);
                        Toast.show(strings.COPIED);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: textScale(11),
                          color: themeColors.primary_color,
                          fontFamily: fontFamily.regular,
                        }}
                      >
                        {strings.TAP_TO_COPY}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {!!data?.categoryExist && !data?.isVerndorList ? (
              <SafeAreaView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: moderateScale(16),
                      marginBottom: moderateScaleVertical(16),
                    }}
                  >
                    <HomeLoader
                      height={36}
                      rectHeight={36}
                      rectWidth={36}
                      width={36}
                      rx={20}
                      ry={20}
                    />
                    <View style={{ marginRight: moderateScale(8) }} />
                    <HomeLoader
                      height={12}
                      rectHeight={12}
                      rectWidth={80}
                      width={80}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: moderateScale(16),
                      marginBottom: moderateScaleVertical(16),
                    }}
                  >
                    <HomeLoader
                      height={25}
                      rectHeight={25}
                      rectWidth={25}
                      width={25}
                    />
                    <View style={{ marginRight: moderateScale(16) }} />
                    <HomeLoader
                      height={25}
                      rectHeight={25}
                      rectWidth={25}
                      width={25}
                    />
                  </View>
                </View>
              </SafeAreaView>
            ) : (
              <View>
                <HeaderLoader
                  viewStyles={{
                    // marginHorizontal: moderateScale(20),
                    // marginBottom: moderateScale(10),
                    marginHorizontal: 0,
                  }}
                  widthLeft={width}
                  rectWidthLeft={width}
                  heightLeft={moderateScaleVertical(152)}
                  rectHeightLeft={moderateScaleVertical(152)}
                  isRight={false}
                  rx={4}
                  ry={4}
                />
                <HomeLoader
                  width={width / 1.1}
                  height={18}
                  rectHeight={18}
                  rectWidth={width / 1.1}
                  viewStyles={{
                    marginTop: moderateScaleVertical(8),
                    marginHorizontal: moderateScale(16),
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScaleVertical(16),
                  }}
                >
                  <HomeLoader
                    height={40}
                    rectHeight={40}
                    rectWidth={60}
                    width={60}
                  />
                  <HomeLoader
                    height={40}
                    rectHeight={40}
                    rectWidth={60}
                    width={60}
                  />
                </View>
                <View
                  style={{
                    ...styles.horizontalLine,
                    marginVertical: 16,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: moderateScale(16),
                    marginBottom: moderateScaleVertical(16),
                  }}
                >
                  <HomeLoader
                    height={20}
                    rectHeight={20}
                    rectWidth={60}
                    width={60}
                  />
                  <View style={{ marginRight: moderateScale(16) }} />
                  <HomeLoader
                    height={20}
                    rectHeight={20}
                    rectWidth={60}
                    width={60}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <HomeLoader
                    width={width / 1.2}
                    height={34}
                    rectHeight={34}
                    rectWidth={width / 1.2}
                    viewStyles={{
                      marginHorizontal: 16,
                    }}
                  />
                  {/* <View style={{ marginHorizontal: moderateScale(16) }} /> */}
                  <HomeLoader
                    height={25}
                    width={25}
                    rectHeight={25}
                    rectWidth={25}
                  />
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginTop: moderateScaleVertical(8),
            }}
          >
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
          </View>
          {!data?.isVerndorList && (
            <View style={{ marginHorizontal: moderateScale(16) }}>
              <ProductListLoader3 />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
              <ProductListLoader3 />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  const updateMinMax = (min, max) => {
    updateState({ minimumPrice: min, maximumPrice: max });
  };

  const onShowHideFilter = () => {
    updateState({ isShowFilter: !isShowFilter });
  };

  const bottomSheetHeader = () => {
    return (
      <View
        style={{
          height: 0,
          backgroundColor: "transparent",
        }}
      />
    );
  };

  const onShare = () => {
    console.log("onShare", appData);
    if (!!categoryInfo.share_link) {
      let hyperLink = categoryInfo.share_link;
      let options = { url: hyperLink };
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
      return;
    }
    alert("link not found");
  };

  // const onShare = async () => {
  //   let convertJson = JSON.stringify(data);
  //   let shareLink = `${categoryInfo.share_link + `?data=${convertJson}`}`;
  //   try {
  //     const result = await Share.share({
  //       url: shareLink,
  //     });

  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //       } else {
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const scrollHeader = (index) => {
    setActiveIdx(index);
    sectionListRef.current.sectionList.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 1,
    });
  };

  const onScroll = (props) => {
    const { nativeEvent } = props;
    if (
      productListData &&
      productListData.length &&
      productListData.length < 6
    ) {
      return;
    }

    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 8); // your cell height
    if (index > moderateScale(36)) {
      if (!AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: true });
      }
      return;
    }
    if (index < moderateScale(36)) {
      if (AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: false });
        return;
      }
      return;
    }
  };

  const onMenuTap = () => {
    // playHapticEffect(hapticEffects.impactLight);
    updateState({ MenuModalVisible: !MenuModalVisible });
  };

  let uri1 = categoryInfo?.banner?.image_fit || categoryInfo?.icon?.image_fit;
  let uri2 = categoryInfo?.banner?.image_path || categoryInfo?.icon?.image_path;
  let imageURI = getImageUrl(uri1, uri2, "200/200");
  const isSVG = imageURI ? imageURI.includes(".svg") : null;

  let name =
    data?.name ||
    data?.categoryInfo?.name ||
    (!!categoryInfo?.translation && categoryInfo?.translation[0]?.name);
  let desc =
    categoryInfo?.desc ||
    (!!categoryInfo?.translation &&
      categoryInfo?.translation[0]?.meta_description);

  const backgroundComponent = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsVisibleModal(false)}
        style={{ alignSelf: "center", marginBottom: moderateScaleVertical(16) }}
      >
        <Image source={imagePath.icClose4} />
      </TouchableOpacity>
    );
  };

  console.log("productListDataproductListData", productListData);

  const appendData = async (section) => {
    console.log("section", section);

    console.log("currentPagecurrentPage", currentPage);
    console.log("dataaa>>>", selectedFilters);
    try {
      let vendorId = !!data?.vendorData
        ? data?.vendorData.id
        : productListId.id;
      let currPage =
        section?.id == currentPage?.id
          ? `&page=${currentPage.current_page + 1}`
          : `&page=2`;
      let totalLimit = `&limit=${15}`;

      let apiData =
        `/${vendorId}?category_id=${section?.id}` + totalLimit + currPage;
      console.log(apiData, "apidata");
      let data = {};
      data["variants"] = selectedFilters?.current?.selectedVariants || [];
      data["options"] = selectedFilters?.current?.selectedOptions || [];
      data["brands"] = selectedFilters?.current?.sleectdBrands || [];
      data["order_type"] = selectedFilters?.current?.selectedSorting || 0;
      data["range"] = `${minimumPrice};${maximumPrice}`;
      data["vendor_id"] = productListId.id;
      data["type"] = dineInType;
      data["tag_products"] =
        ProductTags && ProductTags?.length
          ? ProductTags.map((i) => {
            return i?.isSelected ? i?.id : null;
          }).filter((x) => x != null)
          : [];
      console.log(data, ">data>data");
      console.log(ProductTags, "ProductTags?ProductTags");
      let headers = {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        latitude: appMainData?.reqData?.latitude,
        longitude: appMainData?.reqData?.longitude,
        systemuser: DeviceInfo.getUniqueId(),
      };
      console.log("sending header", headers);
      const res = await actions.getMoreCategories(apiData, data, headers);
      console.log("get more cat res", res.data.products);
      console.log("res++++", res);
      let cloneArry = cloneSectionList[section.index];
      console.log("append clonearry", cloneArry.data);
      let arry = [...cloneArry?.data, ...res?.data.products.data];
      console.log("append item", arry);
      let dummyData = cloneSectionList;
      dummyData[section.index].data = arry;
      console.log("append last data", dummyData);

      if (!!searchInput) {
        onSearchWithinMenu(searchInput, dummyData, true);
        //  console.log(' i am here');
        setProductDataLengthAfterViewMoreSearch(res.data.products?.data);
      } else {
        updateState({
          cloneSectionList: dummyData,
        });
      }
      setCurrentPage({
        ...section,
        current_page:
          section?.id == currentPage?.id ? currentPage.current_page + 1 : 2,
        total: res?.data?.products?.total,
      });
    } catch (error) {
      console.log("error riased", error);
      showError(error?.message);
    }
  };

  const getAdditionalPriceOfAddons = () => {
    // console.log(
    //   'productPriceDataproductPriceDataproductPriceData>>>',
    //   productQuantityForCart,
    // );
    let addOnsAdditionalPrice = 0;
    if (addonSet && addonSet[0]) {
      for (let i = 0; i < addonSet?.length; i++) {
        addonSet[i].setoptions.forEach((el) => {
          if (el.value) {
            addOnsAdditionalPrice = addOnsAdditionalPrice + Number(el.price);
          }
        });
      }
    }

    addOnsAdditionalPrice = currencyNumberFormatter(
      Number(productPriceData?.multiplier) *
      Number(productPriceData?.price) *
      productQuantityForCart +
      addOnsAdditionalPrice,
      appData?.profile?.preferences?.digit_after_decimal
    );
    return addOnsAdditionalPrice;
  };

  const productIncrDecreamentForCart = (type) => {
    playHapticEffect(hapticEffects.rigid);
    let quantityToIncreaseDecrease = !!productDetailData?.batch_count
      ? Number(productDetailData?.batch_count)
      : 1;

    if (type == 2) {
      let limitOfMinimumQuantity = !!productDetailData?.minimum_order_count
        ? Number(productDetailData?.minimum_order_count)
        : 1;
      if (productQuantityForCart <= limitOfMinimumQuantity) {
        onCloseModal();
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart - quantityToIncreaseDecrease,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart + quantityToIncreaseDecrease,
        });
      }
    }
  };

  const checkIfMaxReached = (minVal, Arr) => {
    const SelectedItems = Arr.filter((el) => el.value);
    if (SelectedItems.length >= minVal) {
      return true;
    }
    return false;
  };

  const addToCart = (addonSet) => {
    playHapticEffect(hapticEffects.rigid);
    console.log("add on set", addonSet);
    const addon_ids = [];
    const addon_options = [];

    addonSet.map((i, inx) => {
      const temp = checkIfMaxReached(i.min_select, i.setoptions);
      console.log("temp value", temp);
      if (temp) {
        i.setoptions.map((j, jnx) => {
          if (j?.value == true) {
            addon_ids.push(j?.addon_id);
            addon_options.push(j?.id);
          }
        });
        let CloneArr = addonSet;
        CloneArr[inx] = { ...CloneArr[inx], errorShow: false };
        updateState({ addonSet: CloneArr });
      } else {
        let CloneArr = addonSet;
        CloneArr[inx] = { ...CloneArr[inx], errorShow: true };
        updateState({ addonSet: CloneArr });
      }
    });

    const checkIsError = addonSet.findIndex((el) => el.errorShow);
    let data = {};
    if (checkIsError == -1) {
      data["sku"] = productSku;
      data["quantity"] = productQuantityForCart;
      data["product_variant_id"] = productVariantId;
      data["type"] = dine_In_Type;
      if (addonSet && addonSet.length) {
        // console.log(addonSetData, 'addonSetData');
        data["addon_ids"] = addon_ids;
        data["addon_options"] = addon_options;
      }
      console.log(data, "data for cart");
      updateState({ btnLoader: true });
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then(async (res) => {
          actions.cartItemQty(res);
          showSuccess(strings.PRODUCT_ADDED_SUCCESS);
          updateCartItems(
            selectedCartItem,
            res.data.product_total_qty_in_cart, ////localy update cart quanity
            res.data.cart_product_id,
            res.data.id
          );
          updateState({ isLoadingC: false, btnLoader: false });
          // onClose();
        })
        .catch((error) => errorMethodSecond(error, addonSet));
      return;
    }
  };

  const renderSectionFooter = (props) => {
    const { section } = props;

    console.log("section?.data ", section?.data);
    console.log("section?.data_count ", section?.data_count);
    console.log(
      productDataLengthAfterViewMoreSearch,
      searchInput,
      "searchInputsearchInput"
    );
    //&& !!(searchInput && productDataLengthAfterViewMoreSearch?.length !=0)
    return section?.data.length !== section?.data_count &&
      section?.data.length !== 0 &&
      searchInput &&
      productDataLengthAfterViewMoreSearch?.length != 0 ? (
      <View>
        <TouchableOpacity
          onPress={() => appendData(section)}
          style={{
            // alignSelf: 'center',
            padding: 7,
            borderRadius: 5,
            marginHorizontal: moderateScale(20),
            borderWidth: 1,
            borderColor: themeColors?.primary_color,
            // backgroundColor: colors?.greyColor3,
            justifyContent: "center",
          }}
        >
          {section?.data.length !== section?.data_count ? (
            <Text
              style={{
                textAlign: "center",
                color: themeColors?.primary_color,
                fontSize: textScale(12),
                fontFamily: fontFamily?.medium,
              }}
            >
              View More
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    ) : null;
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          flex: 1,
          // paddingVertical: moderateScale(16),
        }}
      >
        <View style={{ flex: 1 }}>
          {/* {((AnimatedHeaderValue && productListData.length > 6) ||
            (!!sectionListData?.length && AnimatedHeaderValue)) && (
            <View
              style={{
                ...styles.headerStyle,
                marginBottom: moderateScale(12),
                // height: 52
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.goBack()}
                  hitSlop={styles.hitSlopProp}
                >
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={imagePath.icBackb}
                  />
                </TouchableOpacity>

                <View style={{ marginLeft: moderateScale(8), flex: 0.7 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {isSVG ? (
                      <SvgUri
                        height={moderateScale(40)}
                        width={moderateScale(40)}
                        uri={imageURI}
                      />
                    ) : (
                      <RoundImg
                        img={imageURI}
                        size={30}
                        isDarkMode={isDarkMode}
                        MyDarkTheme={MyDarkTheme}
                      />
                    )}
                    <View style={{ marginLeft: moderateScale(8) }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          fontSize: moderateScale(14),
                          fontFamily: fontFamily.medium,
                        }}
                      >
                        {name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity43,
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.regular,
                          marginTop: moderateScaleVertical(2),
                        }}
                      >
                        {categoryInfo?.categoriesList || ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {isSearch ? (
                <View>
                  <SearchBar
                    containerStyle={{
                      marginHorizontal: moderateScale(18),
                      borderRadius: 8,
                      width: width / 1.15,
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.greyColor,
                      height: moderateScaleVertical(37),
                    }}
                    searchValue={searchInput}
                    placeholder={strings.SEARCH_ITEM}
                    // onChangeText={(value) => onChangeText(value)}
                    showRightIcon
                    rightIconPress={rightIconPress}
                  />
                </View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() => updateState({isSearch: true})}
                    onPress={moveToNewScreen(
                      navigationStrings.SEARCHPRODUCTOVENDOR,
                      {
                        type: data?.vendor
                          ? staticStrings.VENDOR
                          : staticStrings.CATEGORY,
                        id: data?.vendor ? data?.id : productListId?.id,
                      }
                    )}
                  >
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                      source={
                        !!data?.showAddToCart ? false : imagePath.icSearchb
                      }
                    />
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: moderateScale(8) }} />
                  <TouchableOpacity
                    onPress={onShare}
                    hitSlop={hitSlopProp}
                    activeOpacity={0.8}
                  >
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                      }}
                      source={imagePath.icShareb}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )} */}
          {listHeaderComponent2()}
          {/* <View style={{height: moderateScale(10)}} /> */}
          {console.log(categoryInfo?.is_show_products_with_category, "is_show_products_with_category")}
          {!!categoryInfo?.is_show_products_with_category ? (
            <SectionList
              onScroll={onScroll}
              ref={sectionListRef}
              showsVerticalScrollIndicator={false}
              sections={isFilteredData ? tagFilteredData : cloneSectionList}
              stickySectionHeadersEnabled={false}
              keyExtractor={awesomeChildListKeyExtractor}
              // tabBarStyle={styles.tabBar}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderTab={renderSectionTab}
              renderItem={renderSectionItem}
              // ListFooterComponent={() => (
              //   <View style={{height: moderateScale(80)}} />
              // )}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={listEmptyComponent}
              onScrollToIndexFailed={(val) => console.log("indexed failed")}
              extraData={cloneSectionList}
              getItemLayout={getItemLayout}
              // Performance settings
              removeClippedSubviews={true} // Unmount components when outside of window
              // initialNumToRender={2} // Reduce initial render amount
              // maxToRenderPerBatch={10} // Redu ce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              // windowSize={7} // Reduce the window size
              renderSectionFooter={renderSectionFooter}
            />
          ) : (
            <FlatList
              onScroll={onScroll}
              disableScrollViewPanResponder
              showsVerticalScrollIndicator={false}
              data={productListData}
              renderItem={renderProduct}
              keyExtractor={awesomeChildListKeyExtractor}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ flexGrow: 1 }}
              extraData={productListData}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              //  getItemLayout={getItemLayout}
              // refreshing={isRefreshing}
              // initialNumToRender={12}
              // maxToRenderPerBatch={10}
              // windowSize={10}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={isRefreshing}
              //     onRefresh={handleRefresh}
              //     tintColor={themeColors.primary_color}
              //   />
              // }
              onEndReached={
                !categoryInfo?.is_show_products_with_category &&
                onEndReachedDelayed
              }
              onEndReachedThreshold={0.5}
              ListFooterComponent={listFooterComponent}
              ListEmptyComponent={listEmptyComponent}
            />
          )}

          {isVisibleModal ? (
            <TouchableWithoutFeedback onPress={() => setIsVisibleModal(false)}>
              <BlurView
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
                viewRef={blurRef}
                blurType="dark"
                blurAmount={10}
                blurRadius={10}
              />
            </TouchableWithoutFeedback>
          ) : null}
        </View>

        {console.log(typeId, "typeId>>>>typeId")}
        {!!typeId && typeId == 8 ? (
          <View>
            {isVisibleHomeServiceModal && (
              <HomeServiceVariantAddons
                addonSet={selectedCartItem?.add_on}
                isVisible={isVisibleHomeServiceModal}
                productdetail={selectedCartItem}
                onClose={onCloseModal}
                showShimmer={showShimmer}
                shimmerClose={(val) => setShowShimmer(val)}
                updateCartItems={updateCartItems}
              // modeOfService={selectedCartItem?.mode_of_service}
              />
            )}
          </View>
        ) : (
          <>
            {isVisibleModal ? (
              <>
                <BottomSheet
                  ref={bottomSheetRef}
                  index={1}
                  snapPoints={[0, height / 1.5, height / 1.25]}
                  enablePanDownToClose
                  activeOffsetY={[-1, 1]}
                  failOffsetX={[-5, 5]}
                  animateOnMount={true}
                  handleComponent={bottomSheetHeader}
                  onChange={(index) => {
                    if (index == 0) {
                      onCloseModal();
                    }
                    // playHapticEffect(hapticEffects.impactMedium);
                  }}
                  backdropComponent={() => <View style={{ height: 0 }} />}
                  backgroundComponent={backgroundComponent}
                >
                  <BottomSheetScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{
                      flex: 1,
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      borderTopLeftRadius: moderateScale(15),
                      borderTopRightRadius: moderateScale(15),
                    }}
                  >
                    <VariantAddons
                      addonSet={addonSet}
                      isVisible={isVisibleModal}
                      productdetail={selectedCartItem}
                      onClose={onCloseModal}
                      typeId={typeId}
                      showShimmer={showShimmer}
                      shimmerClose={(val) => setShowShimmer(val)}
                      updateCartItems={updateCartItems}
                      filterData={allFilters}
                      variantSet={variantSet}
                      productDetailData={productDetailData}
                      showErrorMessageTitle={showErrorMessageTitle}
                      productTotalQuantity={productTotalQuantity}
                      productPriceData={productPriceData}
                      productSku={productSku}
                      productVariantId={productVariantId}
                      productQuantityForCart={productQuantityForCart}
                      selectedVariant={selectedVariant}
                      selectedOption={selectedOption}
                      isProductImageLargeViewVisible={
                        isProductImageLargeViewVisible
                      }
                      isLoadingC={isLoadingC}
                      btnLoader={btnLoader}
                      updateState={updateState}
                    />
                  </BottomSheetScrollView>
                </BottomSheet>
                {!!(
                  productDetailData?.has_inventory == 0 ||
                  (!showErrorMessageTitle && productTotalQuantity > 0) ||
                  (!!typeId && typeId == 8) ||
                  !!productDetailData?.sell_when_out_of_stock
                ) ? (
                  <View>
                    {true ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingHorizontal: moderateScale(16),
                          paddingBottom: moderateScaleVertical(16),
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : "#fff",
                        }}
                      >
                        {!showErrorMessageTitle && (
                          <View style={{ flex: 0.25 }}>
                            <View
                              style={{
                                ...commonStyles.buttonRect,
                                ...styles.incDecBtnStyle,
                                backgroundColor: getColorCodeWithOpactiyNumber(
                                  themeColors.primary_color,
                                  15
                                ),
                                borderColor: themeColors?.primary_color,
                                height: moderateScale(38),
                              }}
                            // onPress={onPress}
                            >
                              <TouchableOpacity
                                onPress={() => productIncrDecreamentForCart(2)}
                                hitSlop={hitSlopProp}
                              >
                                <Text
                                  style={{
                                    ...commonStyles.mediumFont14,
                                    color: themeColors?.primary_color,
                                    fontFamily: fontFamily.bold,
                                  }}
                                >
                                  -
                                </Text>
                              </TouchableOpacity>
                              <Text
                                style={{
                                  ...commonStyles.mediumFont14,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                }}
                              >
                                {productQuantityForCart}
                              </Text>
                              <TouchableOpacity
                                onPress={() => productIncrDecreamentForCart(1)}
                                hitSlop={hitSlopProp}
                              >
                                <Text
                                  style={{
                                    ...commonStyles.mediumFont14,
                                    color: themeColors?.primary_color,
                                    fontFamily: fontFamily.bold,
                                  }}
                                >
                                  +
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}

                        <View style={{ marginHorizontal: 8 }} />
                        {!showErrorMessageTitle && (
                          <View
                            pointerEvents={btnLoader ? "none" : "auto"}
                            style={{ flex: 0.75 }}
                          >
                            <GradientButton
                              indicator={btnLoader}
                              indicatorColor={colors.white}
                              colorsArray={[
                                themeColors.primary_color,
                                themeColors.primary_color,
                              ]}
                              textStyle={{
                                fontFamily: fontFamily.medium,
                                textTransform: "capitalize",
                                color: colors.white,
                              }}
                              onPress={() => addToCart(addonSet)}
                              btnText={`${strings.ADD_ITEM} - ${currencies?.primary_currency?.symbol
                                } ${getAdditionalPriceOfAddons()}`}
                              btnStyle={{
                                borderRadius: moderateScale(4),
                                height: moderateScale(38),
                              }}
                            />
                          </View>
                        )}
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </>
            ) : null}
          </>
        )}

        <CustomAnimatedLoader
          source={loaderOne}
          loaderTitle="Loading"
          containerColor={colors.white}
          loadercolor={themeColors.primary_color}
          animationStyle={[
            {
              height: moderateScaleVertical(40),
              width: moderateScale(40),
            },
          ]}
          visible={updateQtyLoader}
        />

        {!searchInput && !isVisibleModal && (
          <GradientCartView
            onPress={() => {
              playHapticEffect(hapticEffects.notificationSuccess);
              navigation.navigate(navigationStrings.CART);
            }}
            btnText={
              CartItems && CartItems.data && CartItems.data.item_count
                ? `${CartItems.data.item_count} ${CartItems.data.item_count == 1
                  ? strings.ITEM
                  : strings.ITEMS
                } | ${currencies.primary_currency.symbol
                } ${currencyNumberFormatter(
                  Number(CartItems.data.total_payable_amount),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`
                : ""
            }
            ifCartShow={
              CartItems && CartItems.data && CartItems.data.item_count > 0
                ? true
                : false
            }
            isMenuBtnShow={categoryInfo?.is_show_products_with_category}
            onMenuTap={onMenuTap}
            isLoading={btnLoader}
            sectionListData={sectionListData}
          // btnStyle={
          //   appStyle?.tabBarLayout == 4 && {marginBottom: moderateScale(160)}
          // }
          />
        )}

        <BottomSlideModal
          mainContainView={RenderOfferView}
          isModalVisible={offersModalVisible}
          mainContainerStyle={{
            width: "100%",
            paddingHorizontal: 0,
            marginHorizontal: 0,
            maxHeight: moderateScale(450),
          }}
          innerViewContainerStyle={{
            width: "100%",
            paddingHorizontal: 0,
            marginHorizontal: 0,
          }}
          onBackdropPress={() =>
            updateState({ offersModalVisible: !offersModalVisible })
          }
        />

        <BottomSlideModal
          mainContainView={RenderMenuView}
          isModalVisible={MenuModalVisible}
          mainContainerStyle={{
            width: "100%",
            paddingHorizontal: moderateScale(15),
            marginHorizontal: 0,
            height: moderateScale(250),
            backgroundColor: "transparent",
            marginBottom: moderateScaleVertical(16),
          }}
          innerViewContainerStyle={{
            width: "100%",
            paddingHorizontal: 0,
            marginHorizontal: 0,
            backgroundColor: "white",
            borderRadius: moderateScale(10),
            marginBottom: moderateScaleVertical(16),
          }}
          onBackdropPress={() => {
            updateState({ MenuModalVisible: !MenuModalVisible });
          }}
        />

        {/* Add new addons and repeat item view */}
        {!!repeatItems ? (
          <RepeatModal
            data={repeatItems?.item}
            modalHide={() => setRepeatItems(null)}
            onRepeat={onRepeat}
            onAddNew={onAddNew}
          />
        ) : null}

        {!!differentAddsOns && differentAddsOns.length > 1 ? (
          <DifferentAddOns
            differentAddsOnsModal={differentAddsOnsModal}
            data={differentAddsOns}
            selectedDiffAdsOnItem={selectedDiffAdsOnItem}
            hideDifferentAddOns={hideDifferentAddOns}
            difAddOnsAdded={difAddOnsAdded}
            selectedDiffAdsOnSection={selectedDiffAdsOnSection}
            storeLocalQty={storeLocalQty}
            btnLoader={btnLoader}
            selectedDiffAdsOnId={selectedDiffAdsOnId}
          />
        ) : null}

        {isShowFilter ? (
          <FilterComp
            isDarkMode={isDarkMode}
            themeColors={themeColors}
            onFilterApply={onFilterApply}
            onShowHideFilter={onShowHideFilter}
            allClearFilters={allClearFilters}
            selectedSortFilter={selectedSortFilter}
            onSelectedSortFilter={(val) =>
              updateState({ selectedSortFilter: val })
            }
            maximumPrice={maximumPrice}
            minimumPrice={minimumPrice}
            updateMinMax={updateMinMax}
            filterData={allFilters}
          />
        ) : null}
      </View>
    </View>
  );
}
