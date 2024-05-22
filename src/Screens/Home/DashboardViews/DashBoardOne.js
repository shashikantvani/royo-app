import React, { useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import BannerHome from '../../../Components/BannerHome';
import BrickList from '../../../Components/BrickList';
import ImgCardForBrickList from '../../../Components/ImgCardForBrickList';
import CardLoader from '../../../Components/Loaders/CardLoader';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
} from '../../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';

export default function DashBoardOne({
  handleRefresh = () => { },
  bannerPress = () => { },
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  selcetedToggle,
  toggleData,
  isDineInSelected = false,
  tempCartData = null,
  navigation = {},
  onClose,
  onPressSubscribe,
  isSubscription
}) {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const userData = useSelector((state) => state?.auth?.userData);

  const homeData = useSelector((state) => state?.home);
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  console.log(appMainData, 'appMainData');
  console.log(homeData, 'homeData');

  const fontFamily = appStyle?.fontSizeData;
  const { bannerRef } = useRef();
  const { slider1ActiveSlide, newCategoryData } = state;
  const styles = stylesFunc({ themeColors, fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const newCategoryAry =
    appMainData && appMainData?.categories ? [...appMainData?.categories] : [];
  useEffect(() => {
    gridFn(10, 5);
  }, [appMainData]);

  let gapper = 0;
  const gridFn = (setItems, setValue) => {
    newCategoryAry.forEach((element, index) => {
      if (index <= setValue + gapper) {
        element['span'] = 1.5;
        updateState({ newCategoryData: [...newCategoryAry] });
      } else if (index === setValue + 1 + gapper) {
        element['span'] = 3;
        updateState({ newCategoryData: [...newCategoryAry] });
      } else if (
        index === setValue + 2 + gapper ||
        index === setValue + 3 + gapper
      ) {
        element['span'] = 1.5;
        element['rowHeight'] = moderateScaleVertical(250);
        updateState({ newCategoryData: [...newCategoryAry] });
      } else {
        element['span'] = 3;
        updateState({ newCategoryData: [...newCategoryAry] });
        gapper += setItems;
      }
    });
  };

  const renderView = (prop) => {
    return (
      <ImgCardForBrickList
        onPress={() => onPressCategory(prop)}
        text={prop.name}
        data={prop}
      />
    );
  };
  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      // fromVendorApp: true,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  }

  console.log(appData?.banners, "Banners");
  const showAllTempCartOrders = () => {
    return (
      <View>
        {
          tempCartData &&
            tempCartData.length
            ? tempCartData.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => onPressViewEditAndReplace(item)}
                  style={{
                    padding: moderateScale(8),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems: 'center',
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color,
                      20,
                    ),
                    marginHorizontal: moderateScale(15),
                    marginTop: moderateScale(15),
                    borderRadius: moderateScale(5),
                    borderWidth: moderateScale(0.5),
                    borderColor: themeColors?.primary_color
                  }}>
                  <View style={{ flex: 0.7 }}>
                    <Text style={{ fontSize: textScale(12), fontFamily: fontFamily.medium }}>{strings.YOURDRIVERHASMODIFIED}</Text>
                    <Text style={{ fontSize: textScale(12), paddingTop: moderateScale(5), fontFamily: fontFamily.bold }}>{strings.VIEW_DETAIL}</Text>
                  </View>
                  <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: textScale(14), fontFamily: fontFamily.medium }}>{`#${item?.order_number}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
            : null}
      </View>
    );
  };
  return (
    <ScrollView
      // bounces={false}
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={themeColors.primary_color}
        />
      }
      alwaysBounceVertical={true}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, marginHorizontal: moderateScale(3) }}>
      {isLoading && (
        <CardLoader
          listSize={1}
          cardWidth={sliderWidth}
          height={180}
          containerStyle={{ marginHorizontal: moderateScale(10) }}
        />
      )}
      {!!(
        !isLoading &&
        appData &&
        appData?.banners &&
        appData.banners.length
      ) && (
          <>
            {appData?.banners ? (
              <BannerHome
                bannerRef={bannerRef}
                slider1ActiveSlide={slider1ActiveSlide}
                bannerData={appData?.banners ? appData?.banners : []}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                onSnapToItem={(index) => updateState({ slider1ActiveSlide: index })}
                onPress={(item) => bannerPress(item)}
              />
            ) : null}
            <View style={{ height: moderateScaleVertical(5) }} />
          </>
        )}

      <ToggleTabBar
        toggleData={toggleData}
        selcetedToggle={selcetedToggle}
        isDineInSelected={isDineInSelected}
      />
      {showAllTempCartOrders()}

      {isLoading && <CardLoader listSize={6} isRow />}
      {!isLoading &&
        appMainData &&
        appMainData?.categories &&
        appMainData?.categories.length ? (
        <BrickList
          data={newCategoryData}
          renderItem={(prop) => renderView(prop)}
          columns={3}
        />
      ) : null}
      <View style={{ height: moderateScaleVertical(65) }} />
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </ScrollView>
  );
}
