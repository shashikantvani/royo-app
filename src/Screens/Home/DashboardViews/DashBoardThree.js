import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import BottomSheetModalTwo from '../../../Components/BottomSheetModal';
import ImgCardLarge from '../../../Components/ImgCardLarge';
import ImgCardSmall from '../../../Components/ImgCardSmall';
import imagePath from '../../../constants/imagePath';
import {
  height,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

export default function DashBoardThree({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
}) {
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const currentTheme = useSelector((state) => state?.initBoot);
  const {themeColors, appStyle, themeLayout} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({themeColors, fontFamily});

  const _renderItem = () => {
    return (
      <View style={styles.sheetContent}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: '100%',
            alignItems: 'center',
          }}>
          {appMainData &&
          appMainData?.categories &&
          appMainData?.categories.length
            ? appMainData?.categories.map((itm, inx) => {
                if (inx === 0)
                  return (
                    <ImgCardSmall
                      onPress={() => onPressCategory(itm)}
                      text={itm.name}
                      containerStyle={{height: width * 2 * 0.33}}
                      imageStyle={{height: width * 2 * 0.33}}
                      rectImage={getImageUrl(
                        itm.image.proxy_url,
                        itm.image.image_path,
                        '600/280',
                      )}
                    />
                  );
              })
            : null}

          <View>
            {appMainData &&
            appMainData?.categories &&
            appMainData?.categories.length
              ? appMainData.categories.map((itm, inx) => {
                  if (inx >= 1 && inx < 3)
                    return (
                      <ImgCardSmall
                        onPress={() => onPressCategory(itm)}
                        text={itm.name}
                        rectImage={getImageUrl(
                          itm.image.proxy_url,
                          itm.image.image_path,
                          '600/280',
                        )}
                      />
                    );
                })
              : null}
          </View>
        </View>

        {appMainData &&
        appMainData?.categories &&
        appMainData?.categories.length
          ? appMainData?.categories.map((itm, inx) => {
              if (inx >= 3)
                return (
                  <View style={{marginBottom: moderateScaleVertical(8)}}>
                    <ImgCardLarge
                      onPress={() => onPressCategory(itm)}
                      text={itm.name}
                      rectImage={getImageUrl(
                        itm.image.proxy_url,
                        itm.image.image_path,
                        '600/280',
                      )}
                    />
                  </View>
                );
            })
          : null}
      </View>
    );
  };
  return (
    <ImageBackground source={imagePath.nature} style={styles.mainView}>
      <BottomSheetModalTwo
        index={1}
        maxSnapPoint={height - height / 5}
        minSnapPoint={height / 4}
        enableContentPanningGesture={false}>
        {Platform.OS === 'ios' ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            contentContainerStyle={{
              paddingBottom:
                appStyle?.tabBarLayout === 1
                  ? moderateScaleVertical(1)
                  : moderateScaleVertical(60),
            }}>
            {_renderItem()}
          </ScrollView>
        ) : (
          <BottomSheetScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            contentContainerStyle={{
              paddingBottom:
                appStyle?.tabBarLayout === 1
                  ? moderateScaleVertical(1)
                  : moderateScaleVertical(80),
            }}>
            {_renderItem()}
          </BottomSheetScrollView>
        )}
      </BottomSheetModalTwo>
    </ImageBackground>
  );
}
