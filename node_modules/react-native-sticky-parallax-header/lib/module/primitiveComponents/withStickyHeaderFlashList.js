function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStickyHeaderProps } from './useStickyHeaderProps'; // eslint-disable-next-line @typescript-eslint/no-empty-function

const NOOP = () => {};

export function withStickyHeaderFlashList(flashListComponent) {
  const AnimatedFlashList = Animated.createAnimatedComponent(flashListComponent);
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    const {
      containerStyle,
      contentContainerStyle,
      overScrollMode = 'never',
      onScroll,
      onScrollEndDrag,
      onMomentumScrollEnd,
      onTabsLayout,
      renderHeader,
      renderTabs,
      scrollEventThrottle = 16,
      ...rest
    } = props;
    const {
      contentContainerPaddingTop,
      contentContainerPaddingBottom,
      headerAnimatedStyle,
      headerHeight,
      onHeaderLayoutInternal,
      onTabsLayoutInternal,
      scrollHandler,
      tabsHeight
    } = useStickyHeaderProps({
      contentContainerStyle,
      sections: [],
      // is not needed with FlashList
      onMomentumScrollEnd,
      onScroll,
      onScrollEndDrag,
      onTabsLayout
    });
    const flattenContentContainerStyle = React.useMemo(() => {
      return StyleSheet.flatten([contentContainerStyle, {
        paddingBottom: tabsHeight + contentContainerPaddingBottom,
        paddingTop: headerHeight + contentContainerPaddingTop
      }]);
    }, [contentContainerPaddingTop, contentContainerPaddingBottom, contentContainerStyle, headerHeight, tabsHeight]);
    return /*#__PURE__*/React.createElement(View, {
      style: [styles.container, containerStyle]
    }, /*#__PURE__*/React.createElement(Animated.View, {
      pointerEvents: "box-none",
      style: [styles.header, headerAnimatedStyle]
    }, renderHeader ? /*#__PURE__*/React.createElement(View, {
      pointerEvents: "box-none",
      onLayout: onHeaderLayoutInternal
    }, renderHeader()) : null, renderTabs ? /*#__PURE__*/React.createElement(View, {
      pointerEvents: "box-none",
      onLayout: onTabsLayoutInternal
    }, renderTabs()) : null), /*#__PURE__*/React.createElement(View, {
      style: [styles.container, {
        paddingTop: tabsHeight
      }]
    }, /*#__PURE__*/React.createElement(AnimatedFlashList, _extends({
      ref: ref
    }, rest, {
      contentContainerStyle: flattenContentContainerStyle,
      onScroll: scrollHandler,
      onScrollBeginDrag: NOOP,
      onScrollEndDrag: NOOP,
      onMomentumScrollBegin: NOOP,
      onMomentumScrollEnd: NOOP,
      overScrollMode: overScrollMode,
      progressViewOffset: headerHeight,
      scrollEventThrottle: scrollEventThrottle
    }))));
  });
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    overflow: 'hidden'
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999
  }
});
//# sourceMappingURL=withStickyHeaderFlashList.js.map