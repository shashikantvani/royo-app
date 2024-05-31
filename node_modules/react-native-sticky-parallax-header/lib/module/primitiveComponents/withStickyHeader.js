function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStickyHeaderProps } from './useStickyHeaderProps'; // eslint-disable-next-line @typescript-eslint/no-empty-function

const NOOP = () => {};

const createCellRenderer = itemLayoutAnimation => {
  const cellRenderer = props => {
    return /*#__PURE__*/React.createElement(Animated.View, {
      layout: itemLayoutAnimation,
      onLayout: props.onLayout
    }, props.children);
  };

  return cellRenderer;
};

export function withStickyHeader(component) {
  const AnimatedComponent = Animated.createAnimatedComponent(component);
  return /*#__PURE__*/React.forwardRef((props, ref) => {
    const {
      containerStyle,
      contentContainerStyle,
      itemLayoutAnimation,
      overScrollMode = 'never',
      renderHeader,
      renderTabs,
      scrollEventThrottle = 16,
      style,
      ...rest
    } = props;
    const {
      contentContainerPaddingTop,
      contentContainerPaddingBottom,
      headerAnimatedStyle,
      headerHeight,
      listPaddingTop,
      onHeaderLayoutInternal,
      onTabsLayoutInternal,
      scrollHandler,
      tabsHeight
    } = useStickyHeaderProps(props);
    const cellRenderer = React.useMemo(() => createCellRenderer(itemLayoutAnimation), // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
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
    }, renderTabs()) : null), /*#__PURE__*/React.createElement(AnimatedComponent, _extends({
      ref: ref
    }, rest, {
      CellRendererComponent: cellRenderer,
      contentContainerStyle: [contentContainerStyle, {
        paddingTop: headerHeight + contentContainerPaddingTop
      }, {
        paddingBottom: tabsHeight + contentContainerPaddingBottom
      }],
      onScroll: scrollHandler
      /**
       * Workaround for reanimated v2.3+ bug
       *
       * https://github.com/software-mansion/react-native-reanimated/issues/2735#issuecomment-1001714779
       */
      ,
      onScrollBeginDrag: NOOP,
      onScrollEndDrag: NOOP,
      onMomentumScrollBegin: NOOP,
      onMomentumScrollEnd: NOOP,
      overScrollMode: overScrollMode,
      progressViewOffset: headerHeight,
      scrollEventThrottle: scrollEventThrottle,
      style: [style, {
        paddingTop: tabsHeight + listPaddingTop
      }]
    })));
  });
}
export const styles = StyleSheet.create({
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
//# sourceMappingURL=withStickyHeader.js.map