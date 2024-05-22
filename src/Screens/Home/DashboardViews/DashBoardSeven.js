import React, {useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
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
import {getUserData} from '../../../utils/utils';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';
// import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import SearchBar from '../../../Components/SearchBar3';
import CategoryCard from '../../../Components/CategoryCard';
import ServiceCategoryCard from '../../../Components/ServiceCategoryCard';

export default function DashBoardSeven({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  selcetedToggle,
  toggleData,
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
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {slider1ActiveSlide, newCategoryData, isVendorColumnList} = state;
  const styles = stylesFunc({themeColors, fontFamily});
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const _renderItem = ({item}) => (
    <ServiceCategoryCard data={item} onPress={() => onPressCategory(item)} />
  );

  const _renderVendors = ({item}) => (
    <MarketCard2 data={item} onPress={() => onPressCategory(item)} />
  );
  const _changeVendorListStyle = () =>
    updateState({isVendorColumnList: !isVendorColumnList});

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
      showsVerticalScrollIndicator={false}>
      {/* <SearchBar
        containerStyle={{
          marginHorizontal: moderateScale(10),
          borderRadius: 50,
          width: width / 1.15,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
          height: moderateScaleVertical(50),
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
      /> */}
      {/* {isLoading && appData?.banners?.length ? (
        <CardLoader
          listSize={1}
          cardWidth={sliderWidth}
          height={180}
          containerStyle={{ marginHorizontal: moderateScale(10) }}
        />
      ) : null} */}

      <Text
        style={[
          styles.greetingMsg,
          {
            fontFamily: fontFamily.semiBold,
            marginTop: moderateScale(40),
            marginBottom: moderateScale(20),
          },
        ]}>
        Please select your service
      </Text>

      <View
        style={
          {
            // flex: 1,
            // paddingHorizontal: moderateScale(15),
          }
        }>
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
          <>
            <EmptyListLoader
              isLoading={isLoading}
              listSize={1}
              cardWidth={moderateScale(120)}
              isRow
              containerStyle={{width: '60%'}}
            />
            <EmptyListLoader
              isLoading={isLoading}
              listSize={1}
              cardWidth={moderateScale(120)}
              isRow
              containerStyle={{width: '60%'}}
            />
          </>
        )}

        {/* {isLoading && <ProductLoader2 isLoading={isLoading} isProductList />} */}
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
              data={[...appMainData?.categories]}
              // keyExtractor={(item) => item.id.toString()}
              keyExtractor={(item) => item.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderItem}
              ItemSeparatorComponent={() => <View style={{width: 6}} />}
            />
          </View>
        ) : null}
        <View style={{height: moderateScale(25)}} />

        <View style={{height: moderateScaleVertical(65)}} />
      </View>
    </ScrollView>
  );
}
