import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Extrapolate, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
export function useStickyHeaderProps(props) {
  const {
    contentContainerStyle,
    onHeaderLayout,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    onScroll,
    onScrollBeginDrag,
    onScrollEndDrag,
    onTabsLayout,
    stickyTabs = true,
    style
  } = props;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabsHeight, setTabsHeight] = useState(0);
  const scrollValue = useSharedValue(0);

  function onHeaderLayoutInternal(e) {
    setHeaderHeight(e.nativeEvent.layout.height);
    onHeaderLayout === null || onHeaderLayout === void 0 ? void 0 : onHeaderLayout(e);
  }

  function onTabsLayoutInternal(e) {
    setTabsHeight(e.nativeEvent.layout.height);
    onTabsLayout === null || onTabsLayout === void 0 ? void 0 : onTabsLayout(e);
  }

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: e => {
      onScrollBeginDrag === null || onScrollBeginDrag === void 0 ? void 0 : onScrollBeginDrag(e);
    },
    onEndDrag: e => {
      onScrollEndDrag === null || onScrollEndDrag === void 0 ? void 0 : onScrollEndDrag(e);
    },
    onMomentumBegin: e => {
      onMomentumScrollBegin === null || onMomentumScrollBegin === void 0 ? void 0 : onMomentumScrollBegin(e);
    },
    onMomentumEnd: e => {
      onMomentumScrollEnd === null || onMomentumScrollEnd === void 0 ? void 0 : onMomentumScrollEnd(e);
    },
    onScroll: e => {
      scrollValue.value = e.contentOffset.y;
      onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
    }
  });
  const contentContainerPaddingTop = useMemo(() => {
    var _StyleSheet$flatten;

    const paddingTop = (_StyleSheet$flatten = StyleSheet.flatten(contentContainerStyle)) === null || _StyleSheet$flatten === void 0 ? void 0 : _StyleSheet$flatten.paddingTop;

    if (typeof paddingTop === 'number') {
      return paddingTop;
    } // We do not support string values


    return 0;
  }, [contentContainerStyle]);
  const contentContainerPaddingBottom = useMemo(() => {
    var _StyleSheet$flatten2;

    const paddingBottom = (_StyleSheet$flatten2 = StyleSheet.flatten(contentContainerStyle)) === null || _StyleSheet$flatten2 === void 0 ? void 0 : _StyleSheet$flatten2.paddingBottom;

    if (typeof paddingBottom === 'number') {
      return paddingBottom;
    } // We do not support string values


    return 0;
  }, [contentContainerStyle]);
  const listPaddingTop = useMemo(() => {
    var _StyleSheet$flatten3;

    const paddingTop = (_StyleSheet$flatten3 = StyleSheet.flatten(style)) === null || _StyleSheet$flatten3 === void 0 ? void 0 : _StyleSheet$flatten3.paddingTop;

    if (typeof paddingTop === 'number') {
      return paddingTop;
    } // We do not support string values


    return 0;
  }, [style]);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: interpolate(scrollValue.value, [0, headerHeight], [0, -headerHeight], stickyTabs ? Extrapolate.CLAMP : Extrapolate.EXTEND)
      }]
    };
  }, [scrollValue, headerHeight, stickyTabs]);
  return {
    contentContainerPaddingTop,
    contentContainerPaddingBottom,
    headerAnimatedStyle,
    headerHeight,
    listPaddingTop,
    onHeaderLayoutInternal,
    onTabsLayoutInternal,
    scrollHandler,
    tabsHeight
  };
}
//# sourceMappingURL=useStickyHeaderProps.js.map