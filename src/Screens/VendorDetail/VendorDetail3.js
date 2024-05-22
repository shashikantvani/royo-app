import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import VendorDetailLoader from '../../Components/Loaders/VendorDetailLoader';
import ThreeColumnCard from '../../Components/ThreeColumnCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import ListEmptyVendors from '../Vendors/ListEmptyVendors';
//import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import strings from '../../constants/lang';
import BrandCard2 from '../../Components/BrandCard2';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import {trim} from 'lodash';
import NoDataFound from '../../Components/NoDataFound';
import * as Animatable from 'react-native-animatable';

export default function VendorDetail3({navigation, route}) {
  let vendorParams = route?.params?.data;
  // console.log('vendor params', vendorParams);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  // alert("312")
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const userData = useSelector((state) => state?.auth?.userData);
  const [state, setState] = useState({
    vendorId: vendorParams?.item?.id || vendorParams?.id,
    vendordName: vendorParams.name || '',
    vendorData: [],
    isLoading: true,
    limit: 12,
    pageNo: 1,
  });
  const {vendorId, vendorData, isLoading, limit, pageNo, vendordName} = state;

  useEffect(() => {
    if (
      vendorParams &&
      vendorParams?.item &&
      vendorParams?.item?.redirect_to == staticStrings.SUBCATEGORY
    ) {
      getSubCategoryDetailData();
    } else {
      getVendorDetailData();
    }
  }, [vendorId]);

  const convertLocalDateToUTCDate = (date, toUTC) => {
    date = new Date(date);
    //Local time converted to UTC
    console.log('Time: ' + date);
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    return date;
  };

  useEffect(() => {
    convertLocalDateToUTCDate('2021-09-28T00:00', true);
  }, []);

  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const updateState = (data) => setState((state) => ({...state, ...data}));
  //Naviagtion to specific screen
  const moveToNewScreen = (item) => {

    if (item?.redirect_to == "Pickup/Delivery") {
      if (!!userData?.auth_token) {
        item['pickup_taxi'] = true;
        item['redirect_to'] = item.redirect_to;
        navigation.navigate(navigationStrings.ADDADDRESS, {data: item});
        return;
      }
      actions.setAppSessionData('on_login');
      return;
    }
    if (!!item?.redirect_to && item?.redirect_to == staticStrings.PRODUCT) {
      navigation.navigate(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          vendor: vendorParams?.rootProducts ? true : false,
          vendorData: vendorParams?.item,
          categoryInfo: item,
          name: item.name,
          isVendorList: false,
          category_slug: item?.slug,
          categoryExist: item?.id || null,
        },
      });
      return;
    }
    if (!!item?.type && item?.type.redirect_to == staticStrings.PRODUCT) {
      navigation.navigate(navigationStrings.PRODUCT_LIST, {
        data: {
          id: item.id,
          rootProducts: vendorParams?.rootProducts,
          vendor: vendorParams?.rootProducts ? true : false,
          vendorData: vendorParams?.item,
          categoryInfo: item,
          name: item.name,
          isVendorList: false,
          category_slug: item?.slug,
          categoryExist: item?.id || null,
        },
      });
      return;
    }
    if (item?.redirect_to == staticStrings.VENDOR) {
      navigation.navigate(navigationStrings.VENDOR, {data: item});
      return;
    }

    if (item?.redirect_to == staticStrings.SUBCATEGORY) {
      navigation.push(navigationStrings.VENDOR_DETAIL, {data: {item: item}});
      return;
    }

    navigation.navigate(navigationStrings.PRODUCT_LIST, {
      data: {
        id: item.id,
        rootProducts: vendorParams?.rootProducts,
        vendor: vendorParams?.rootProducts ? true : false,
        vendorData: vendorParams?.item,
        categoryInfo: item,
        name: item.name,
        isVendorList: false,
        category_slug: item?.slug,
        categoryExist: item?.id || null,
      },
    });
    return;
  };

  /***********GET SUBCATEGORY  DETAIL DATA******** */

  const getSubCategoryDetailData = () => {
    //
    actions
      .getProductByCategoryId(
        `/${vendorId}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        // console.log(res, 'res>>>category data');
        updateState({isLoading: false});
        if (res && res.data) {
          updateState({vendorData: res.data.listData});
        }
      })
      .catch(errorMethod);
  };
  /*********** */

  /*********GET VENDOR DETAIL********* */
  const getVendorDetailData = () => {
    let data = {};
    data['vendor_id'] = vendorId;

    actions
      .getVendorDetail(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({isLoading: false});
        if (res && res.data) {
          // console.log(res, 'res>>res');
          let newArray = res.data;
          // if (vendorParams?.rootProducts) {
          //   // console.log(
          //   //   newArray.filter((x) => x?.id != vendorParams?.categoryData?.id),
          //   //   'newArray>>>>',
          //   // );
          //   newArray= newArray.filter((x) => x?.id != vendorParams?.categoryData?.id)
          // }
          updateState({vendorData: newArray});
        }
      })
      .catch(errorMethod);
  };

  /********* */

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const _renderItem = ({item, index}) => {
    return (
      <Animatable.View
        // animation={'fadeInLeft'}
        delay={index * 40}>
        <BrandCard2
          onPress={() => moveToNewScreen(item)}
          // onPress={() => navigation.navigate(navigationStrings.PRODUCT_LIST)}
          data={item}
          withTextBG
          cardIndex={index}
        />
      </Animatable.View>
    );
  };

  if (isLoading) {
    return (
      <WrapperContainer
        statusBarColor={colors.backgroundGrey}
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }>
        <CategoryLoader2
          viewStyles={{marginTop: moderateScale(50)}}
          isFourthItem={false}
          widthTop={(width - moderateScale(50)) / 3}
          rectWidthTop={(width - moderateScale(50)) / 3}
          heightTop={moderateScaleVertical(90)}
          rectHeightTop={moderateScaleVertical(90)}
          isSubCategory
        />
        <CategoryLoader2
          viewStyles={{marginTop: moderateScale(25)}}
          isFourthItem={false}
          widthTop={(width - moderateScale(50)) / 3}
          rectWidthTop={(width - moderateScale(50)) / 3}
          heightTop={moderateScaleVertical(90)}
          rectHeightTop={moderateScaleVertical(90)}
          isSubCategory
        />
        <CategoryLoader2
          viewStyles={{marginTop: moderateScale(25)}}
          isFourthItem={false}
          widthTop={(width - moderateScale(50)) / 3}
          rectWidthTop={(width - moderateScale(50)) / 3}
          heightTop={moderateScaleVertical(90)}
          rectHeightTop={moderateScaleVertical(90)}
          isSubCategory
        />
        <CategoryLoader2
          viewStyles={{marginTop: moderateScale(25)}}
          isFourthItem={false}
          widthTop={(width - moderateScale(50)) / 3}
          rectWidthTop={(width - moderateScale(50)) / 3}
          heightTop={moderateScaleVertical(90)}
          rectHeightTop={moderateScaleVertical(90)}
          isSubCategory
        />
        <CategoryLoader2
          viewStyles={{marginTop: moderateScale(25)}}
          isFourthItem={false}
          widthTop={(width - moderateScale(50)) / 3}
          rectWidthTop={(width - moderateScale(50)) / 3}
          heightTop={moderateScaleVertical(90)}
          rectHeightTop={moderateScaleVertical(90)}
          isSubCategory
        />
      </WrapperContainer>
    );
  }

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      {/* <Header centerTitle={vendorParams?.item?.name} hideRight={false} /> */}

      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={vendorParams?.item?.name || vendordName}
        textStyle={{fontSize: textScale(13)}}
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{marginHorizontal: moderateScale(8)}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={vendorData || []}
          numColumns={3}
          ListFooterComponent={<View style={{height: moderateScale(120)}} />}
          ListHeaderComponent={<View style={{height: 10}} />}
          // columnWrapperStyle={{justifyContent: 'space-between'}}
          ItemSeparatorComponent={() => (
            <View style={{height: moderateScale(4)}} />
          )}
          renderItem={_renderItem}
          ListEmptyComponent={
            !isLoading && (
              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(width / 2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NoDataFound isLoading={state.isLoading} />
              </View>
            )
          }
          keyExtractor={(item, index) => item.id.toString()}
        />
      </View>
    </WrapperContainer>
  );
}
