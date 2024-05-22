import React, { useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import BannerHome2 from '../../../Components/BannerHome2';
import EmptyListLoader from '../../../Components/EmptyListLoader';
import HomeCategoryCard from '../../../Components/HomeCategoryCard';
import CardLoader from '../../../Components/Loaders/CardLoader';
import ProductLoader2 from '../../../Components/Loaders/ProductLoader2';
import MarketCard2 from '../../../Components/MarketCard2';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { getUserData } from '../../../utils/utils';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';
//import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import { getColorCodeWithOpactiyNumber } from '../../../utils/helperFunctions';
import navigationStrings from '../../../navigation/navigationStrings';

export default function DashBoardFour({
  handleRefresh = () => { },
  bannerPress = () => { },
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  selcetedToggle,
  toggleData,
  tempCartData = null,
  navigation = {},
  onPressVendor = () => { },
  onClose,
  onPressSubscribe,
  isSubscription
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

  const fontFamily = appStyle?.fontSizeData;
  const { bannerRef } = useRef();
  const { slider1ActiveSlide, newCategoryData, isVendorColumnList } = state;
  const styles = stylesFunc({ themeColors, fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const _renderItem = ({ item }) => (
    <HomeCategoryCard data={item} onPress={() => onPressCategory(item)} />
  );

  const _renderVendors = ({ item }) => (
    <MarketCard2 data={item} onPress={() => onPressVendor(item)} />
  );
  const _changeVendorListStyle = () =>
    updateState({ isVendorColumnList: !isVendorColumnList });

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
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  backgroundColor: getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color,
                    20,
                  ),
                  // marginHorizontal:moderateScale(15),
                  marginTop: moderateScale(15),
                  borderRadius: moderateScale(5),
                  borderWidth: moderateScale(0.5),
                  borderColor: themeColors?.primary_color,
                }}>
                <View style={{ flex: 0.7 }}>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.YOURDRIVERHASMODIFIED}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      paddingTop: moderateScale(5),
                      fontFamily: fontFamily.bold,
                    }}>
                    {strings.VIEW_DETAIL}
                  </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                    }}>{`#${item?.order_number}`}</Text>
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
      style={{
        flex: 1,
        paddingHorizontal: moderateScale(15),
      }}>
      {isLoading && appData?.banners?.length ? (
        <CardLoader
          listSize={1}
          cardWidth={sliderWidth}
          height={180}
          containerStyle={{ marginHorizontal: moderateScale(10) }}
        />
      ) : null}
      {!isLoading && appData?.banners?.length ? (
        <>
          <BannerHome2
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={appData.banners}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => updateState({ slider1ActiveSlide: index })}
            onPress={(item) => bannerPress(item)}
            isDarkMode={isDarkMode}
          />
          <View style={{ height: moderateScaleVertical(5) }} />
        </>
      ) : null}
      <ToggleTabBar toggleData={toggleData} selcetedToggle={selcetedToggle} />
      {showAllTempCartOrders()}
      {userData?.auth_token && (
        <>
          <Text
            style={[
              styles.heyMsg,
              { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
            ]}>
            {strings.HEY_MSG} {userData.name},
          </Text>
          <Text
            style={[
              styles.greetingMsg,
              { color: isDarkMode ? MyDarkTheme.colors.text : colors.black },
            ]}>
            {strings.GREETING_MSG}
          </Text>
        </>
      )}
      {isLoading && (
        <EmptyListLoader isLoading={isLoading} listSize={1} isRow />
      )}
      {isLoading && <ProductLoader2 isLoading={isLoading} isProductList />}
      {!isLoading &&
        appMainData &&
        appMainData?.categories &&
        appMainData?.categories.length ? (
        <View
          style={{
            marginTop: moderateScaleVertical(10),
          }}>
          <FlatList
            horizontal={true}
            data={appMainData?.categories}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          />
        </View>
      ) : null}
      <View style={{ height: moderateScale(25) }} />
      {appMainData?.vendors && appMainData?.vendors?.length ? (
        <>
          <Text
            style={
              isDarkMode
                ? [styles.nearVendorTxt, { color: MyDarkTheme.colors.text }]
                : styles.nearVendorTxt
            }>
            {strings.NEAR_VENDOR}
          </Text>
        </>
      ) : null}
      {!isLoading && !isVendorColumnList && appMainData?.vendors?.length ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'column',
            marginLeft: moderateScale(2),
          }}>
          <View
            style={{ flexDirection: 'row', marginBottom: moderateScale(15) }}
            horizontal={true}>
            {appMainData?.vendors
              ? appMainData?.vendors.map((itm, inx) => {
                if (inx < appMainData?.vendors.length / 2) {
                  return (
                    <MarketCard2
                      key={inx}
                      data={itm}
                      onPress={() => onPressCategory(itm)}
                      extraStyles={{
                        width: width * 0.8,
                        marginRight: moderateScale(20),
                      }}
                    />
                  );
                }
              })
              : null}
          </View>
          <View style={{ flexDirection: 'row', marginTop: moderateScale(15) }}>
            {!isLoading && appMainData?.vendors
              ? appMainData?.vendors.map((itm, inx) => {
                if (inx >= appMainData?.vendors.length / 2) {
                  return (
                    <MarketCard2
                      key={inx}
                      data={itm}
                      onPress={() => onPressCategory(itm)}
                      extraStyles={{
                        width: width * 0.8,
                        marginRight: moderateScale(20),
                      }}
                    />
                  );
                }
              })
              : null}
          </View>
        </ScrollView>
      ) : null}
      {!isLoading && isVendorColumnList && appMainData?.vendors ? (
        <FlatList
          data={appMainData?.vendors || []}
          showsVerticalScrollIndicator={false}
          renderItem={_renderVendors}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScale(20) }} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : null}
      {!isLoading && appMainData?.vendors?.length ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={_changeVendorListStyle}
          style={styles.applyPromoBtn}>
          <Text style={styles.viewAllBtn}>
            {!isVendorColumnList ? strings.VIEW_ALL_VENDORS : strings.CLOSE}
          </Text>
        </TouchableOpacity>
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
