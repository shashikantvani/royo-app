import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React, {useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import { getBundleId } from 'react-native-device-info';
import {useSelector} from 'react-redux';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {currencyNumberFormatter} from '../../../utils/commonFunction';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {getImageUrl} from '../../../utils/helperFunctions';
import ListEmptyCar from './ListEmptyCar';
import stylesFun from './styles';

export default function AvailableDriver({
  isLoading = false,
  availableCarList = [],
  onPressPickUpNow,
  onPressPickUplater,
  onPressAvailableCar,
  selectedCarOption = null,
  availableVendors,
  selectedVendorOption = null,
  _select,
  onPressAvailableVendor,
}) {
  console.log(availableCarList, 'availableCarListavailableCarList');
  const viewRef2 = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  console.log(
    selectedCarOption?.variant[0]?.price,
    'selectedCarOptionselectedCarOptionselectedCarOption',
  );

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  // choose a trip or swipe up for more
  //Render all Available amounts
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPressAvailableCar(item)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: moderateScaleVertical(12),
          paddingHorizontal: moderateScale(16),
          // marginBottom: moderateScaleVertical(8),
          opacity: selectedCarOption?.id == item?.id ? 0.8 : 1,
          backgroundColor: isDarkMode
            ? selectedCarOption?.id == item?.id
              ? colors.whiteOpacity15
              : colors.textGrey
            : selectedCarOption?.id == item?.id
            ? colors.lightGreyBg
            : colors.whiteOpacity77,

          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
          borderBottomWidth: 0.6,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            resizeMode={'contain'}
            style={{
              height: moderateScale(60),
              width: moderateScale(60),
            }}
            source={{
              uri: getImageUrl(
                item?.media[0]?.image?.path?.proxy_url,
                item?.media[0]?.image?.path?.image_path,
                '350/350',
              ),
            }}
          />
          <View
            style={{
              marginLeft: moderateScale(16),
            }}>
            <Text
              numberOfLines={1}
              style={{
                color: isDarkMode
                  ? selectedCarOption?.id == item?.id
                    ? colors.white
                    : colors.whiteOpacity50
                  : selectedCarOption?.id == item?.id
                  ? colors.black
                  : colors.blackC,
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
                textAlign: 'left',
              }}>
              {item?.translation[0]?.title}
            </Text>
            <Text
              style={{
                color: isDarkMode
                  ? selectedCarOption?.id == item?.id
                    ? colors.white
                    : colors.whiteOpacity50
                  : selectedCarOption?.id == item?.id
                  ? colors.black
                  : colors.blackOpacity66,
                fontFamily: fontFamily.regular,
                fontSize: textScale(10),
                textAlign: 'left',
              }}>
              {item?.translation[0]?.meta_description}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={{
            color: isDarkMode
              ? selectedCarOption?.id == item?.id
                ? colors.white
                : colors.whiteOpacity50
              : selectedCarOption?.id == item?.id
              ? colors.black
              : colors.blackC,
            fontFamily: fontFamily.medium,
            fontSize: textScale(14),
            textAlign: 'left',
          }}>
          {`${currencies?.primary_currency?.symbol}${currencyNumberFormatter(
            Number(item.tags_price),
            appData?.profile?.preferences?.digit_after_decimal,
          )}`}
        </Text>
      </TouchableOpacity>
    );
  };
  const _listEmptyComponent = () => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              // height: height / 4,
              marginBottom: moderateScaleVertical(20),
            }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i, inx) => {
              return (
                <View
                  style={{marginBottom: moderateScaleVertical(8)}}
                  key={inx}>
                  <ListEmptyCar isLoading={isLoading} />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              height: height / 3.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...styles.noCarsAvailable,
                color: isDarkMode ? colors.white : colors.blackC,
              }}>
              {
              appIds.jiffex == getBundleId() ? strings.NODELIVERIESAGENTAVAILABLE:strings.NO_CARS_AVAILABLE}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <BottomSheetFlatList
        // scrollEnabled={false}
        data={availableCarList}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        ListEmptyComponent={_listEmptyComponent}
      />
    </View>
  );
}
