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
import SearchBar from '../../../Components/SearchBar3';
import CategoryCard from '../../../Components/CategoryCard';

export default function DashBoardFour({
  handleRefresh = () => { },
  bannerPress = () => { },
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  selcetedToggle,
  toggleData,
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
    <CategoryCard data={item} onPress={() => onPressCategory(item)} />
  );

  const _renderVendors = ({ item }) => (
    <MarketCard2 data={item} onPress={() => onPressVendor(item)} />
  );
  const _changeVendorListStyle = () =>
    updateState({ isVendorColumnList: !isVendorColumnList });

  return (
    <ScrollView
      style={{
        flex: 1,
        // paddingHorizontal: moderateScale(15),
      }}
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
    >
      <SearchBar
        containerStyle={{
          marginHorizontal: moderateScale(10),
          borderRadius: 50,
          width: width / 1.15,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
          height: moderateScaleVertical(45),
          alignSelf: 'center',
          paddingVertical: 0
        }}
        searchValue={''}
        placeholder={strings.SEARCH_ITEM}
        // onChangeText={(value) => onChangeText(value)}
        // showRightIcon
        rightIconPress={() =>
          updateState({
            searchInput: '',
            isSearch: false,
            isLoading: false,
          })
        }
      />
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
            itemWidth={moderateScale(320)}
            onSnapToItem={(index) => updateState({ slider1ActiveSlide: index })}
            onPress={(item) => bannerPress(item)}
            isDarkMode={isDarkMode}
            isPagination
            imagestyle={{ marginRight: moderateScale(0), borderRadius: moderateScale(10), }}
          />
          <View style={{ height: moderateScaleVertical(5) }} />
        </>
      ) : null}
      <View
        style={{
          // flex: 1,
          // paddingHorizontal: moderateScale(15),
        }}>

        {/* <ToggleTabBar toggleData={toggleData} selcetedToggle={selcetedToggle} /> */}
        {/* {userData?.auth_token && (
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
      )} */}
        {isLoading && (
          <EmptyListLoader isLoading={isLoading} listSize={1} isRow />
        )}
        {isLoading && <ProductLoader2 isLoading={isLoading} isProductList />}
        {/* {!isLoading &&
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
      ) : null} */}
        {!isLoading &&
          appMainData &&
          appMainData?.categories &&
          appMainData?.categories.length ? (
          <View
            style={{
              marginTop: moderateScaleVertical(10),

            }}>
            <FlatList
              contentContainerStyle={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                width: '100%',
                // marginHorizontal: moderateScale(10)
                // backgroundColor: 'red'
                // justifyContent: 'center'
              }}
              data={[...appMainData?.categories, ...appMainData?.categories]}
              // keyExtractor={(item) => item.id.toString()}
              keyExtractor={(item) => item.toString()}
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
              {strings.CHOOSE_FROM_CUISINES}
            </Text>
          </>
        ) : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            ['Beverages', 'Snacks', 'Rice', 'Sweets', 'Beverages', 'Snacks', 'Rice', 'Sweets'].map((el) => {
              return (
                <View style={{ alignItems: 'center', marginLeft: moderateScale(15) }}>
                  <View style={{ backgroundColor: colors.greyMedium, borderRadius: 50, width: 70, height: 70, }} />
                  <Text style={{ textAlign: 'center', alignSelf: 'center', marginTop: moderateScale(10), fontSize: textScale(11), fontFamily: fontFamily.bold, marginLeft: moderateScale(3) }}>{el}</Text>
                </View>
              )
            })
          }
        </ScrollView>
        <View style={{ height: moderateScaleVertical(65) }} />
      </View>
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
