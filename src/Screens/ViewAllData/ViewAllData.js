import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import * as Animatable from "react-native-animatable";
// import { useDarkMode } from "react-native-dark-mode";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import Header3 from "../../Components/Header3";
import HeaderLoader from "../../Components/Loaders/HeaderLoader";
import SearchLoader from "../../Components/Loaders/SearchLoader";
import MarketCard3 from "../../Components/MarketCard3";
import NoDataFound from "../../Components/NoDataFound";
import SearchBar2 from "../../Components/SearchBar2";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import commonStylesFun from "../../styles/commonStyles";
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";

export default function ViewAllData({ route, navigation }) {
  const {
    appData,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state.initBoot);

  const { appMainData, dineInType, location } = useSelector(
    (state) => state?.home
  );
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const isDarkMode =  themeColor;
  
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });

  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
    data: [],
    totalProduct: 0,
    loadMore: false,
    openVendor: 1,
    closeVendor: 0,
    bestSeller: 0,
    nearMe: 0,
  });

  const {
    isLoading,
    pageNo,
    isRefreshing,
    limit,
    data,
    totalProduct,
    loadMore,
    openVendor,
    closeVendor,
    bestSeller,
    nearMe,
  } = state;

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    apiHit(pageNo);

    const homeAllFilters = () => {
      let homeFilter = [
        { id: 1, type: strings.OPEN },
        { id: 2, type: strings.CLOSE },
        { id: 3, type: strings.BESTSELLER },
      ];
      if (appData?.profile?.preferences?.is_hyperlocal) {
        homeFilter.push({ id: 4, type: strings.NEAR_BY });
      } else {
        if (homeFilter.length > 3) {
          homeFilter.pop();
        }
      }
      return homeFilter;
    };
  }, []);

  //Home data
  const apiHit = (pageNo) => {
    let latlongObj = {};
    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
    let vendorFilterData = {
      close_vendor: 1,
      open_vendor: 0,
      best_vendor: 0,
      near_me: 0,
    };

    // console.log(vendorFilterData, "vendorFilterData");
    // let query = `?limit=${limit}&page=${pageNo}&close_vendor=${1}&open_vendor=${0}&best_vendor=${0}&near_me=${0}`
    let query = `?limit=${limit}&page=${pageNo}&type=${
      dineInType ? dineInType : dineInType
    }&latitude=${latlongObj?.latitude || ""}&longitude=${
      latlongObj?.longitude || ""
    }`;

    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    // console.log("sending headers", headers);
    // console.log("sending query", query);

    actions
      .vendorAll(query, {}, headers)
      .then((res) => {
        // console.log("Home data++++++", res);
        if (totalProduct == 0) {
          updateState({ totalProduct: res?.data?.total });
        }
        updateState({
          data: pageNo == 1 ? res?.data?.data : [...data, ...res?.data?.data],
          isLoading: false,
          loadMore: false,
        });
      })
      .catch((error) => {
        // console.log("error raised", error);
        updateState({
          isLoading: false,
          loadMore: false,
        });
      });
  };
  // console.log("data length", data.length);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, { data });
    };

  const _checkRedirectScreen = (item) => {
    {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item.id,
            vendor: true,
            name: item.name,
            isVendorList: true,
            fetchOffers: true,
          })();
    }
  };

  /**********/

  const _renderItem = ({ item, index }) => {
    return (
      <Animatable.View
        style={{ marginHorizontal: moderateScale(15) }}
        // animation={'fadeInUp'}
        // delay={index * 60}
      >
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </Animatable.View>
    );
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
      >
        <Header3
          leftIcon={imagePath.icBackb}
          centerTitle={data?.name}
          rightIcon={imagePath.search}
          location={location}
          onPressRight={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
        />
        <View style={{ alignItems: "center" }}>
          <SearchLoader viewStyles={{ marginVertical: moderateScale(17) }} />
          <HeaderLoader
            viewStyles={{ marginTop: 5 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{ marginTop: 15 }}
            widthLeft={width - moderateScaleVertical(40)}
            rectWidthLeft={width - moderateScaleVertical(40)}
            heightLeft={moderateScaleVertical(170)}
            rectHeightLeft={moderateScaleVertical(170)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>
      </WrapperContainer>
    );
  }

  const onEndReached = () => {
    if (totalProduct !== data.length) {
      updateState({ pageNo: pageNo + 1, loadMore: true });
      apiHit(pageNo + 1);
    } else {
      updateState({ loadMore: false });
    }
  };

  const listFooterComponent = () => {
    return <View style={{ height: moderateScale(40) }}></View>;
  };

  // console.log(location, "location>>>>location");

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header3
          leftIcon={imagePath.icBackb}
          centerTitle={data?.name}
          rightIcon={imagePath.search}
          location={location}
        />
        {/* <TouchableOpacity>
          <Image source={imagePath.filter} />
        </TouchableOpacity> */}
      </View>
      <SearchBar2 navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        extraData={data}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        initialNumToRender={6}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NoDataFound isLoading={isLoading} />
            </View>
          )
        }
        ListFooterComponent={listFooterComponent}
      />
    </WrapperContainer>
  );
}
