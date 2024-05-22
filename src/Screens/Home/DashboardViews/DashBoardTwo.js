import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import CircleList from '../../../library/react-native-circle-list';
import {moderateScaleVertical, width} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

const RADIUS = (1.5 * width) / 5;

export default function DashBoardTwo({
  handleRefresh = () => {},
  bannerPress = () => {},
  updatedData = [],
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  updateCircleData,
  // appMainData = {},
}) {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    scrolling: false,
    updateScreen: true,
    unique_key: null,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);

  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const profileInfo = appData?.profile;

  const {viewRef2, viewRef3, bannerRef} = useRef();
  const {slider1ActiveSlide, updateScreen, unique_key} = state;

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const _onScrollBegin = () => updateState({scrolling: true});

  const _onScrollEnd = () => updateState({scrolling: false});
  // var unique_key = Math.round(new Date().getTime() / 1000);

  var uniqueKey;
  useEffect(() => {
    uniqueKey = Math.floor(Math.random() * 10000 + 1);
    updateState({unique_key: uniqueKey});
  }, [appMainData]);

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressCategory(item)}>
        <View style={styles.container1}>
          <View style={styles.circularView}>
            <FastImage
              style={styles.circularListImage}
              source={{
                uri: getImageUrl(
                  item.icon.image_fit,
                  item.icon.image_path,
                  '600/360',
                ),
                priority: FastImage.priority.high,
              }}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    updateCircleData(appMainData?.categories);
  }, [appMainData]);

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: moderateScaleVertical(70),
        justifyContent: 'center',
      }}>
      <View style={styles.container}>
        {!!(updatedData && updatedData.length) && (
          <CircleList
            data={updatedData.slice(0, 6)}
            elementCount={6}
            key={unique_key}
            keyExtractor={(item) => item.id}
            radius={RADIUS}
            swipeSpeedMultiplier={40}
            onScrollBegin={_onScrollBegin}
            onScrollEnd={_onScrollEnd}
            renderItem={renderItem}
            containerStyle={{flex: 1}}
            visibilityPadding={5}
            selectedItemScale={1}
          />
        )}
        <View style={styles.circularListCenterImage}>
          <Image source={imagePath.carlitooFace} />
        </View>
      </View>
    </View>
  );
}
