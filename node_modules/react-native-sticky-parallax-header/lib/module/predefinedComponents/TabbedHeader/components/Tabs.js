import * as React from 'react';
import { I18nManager, Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { commonStyles } from '../../../constants';
import { parseAnimatedColorProp } from '../../common/utils/parseAnimatedColorProp';
import { TabItem } from './TabItem';
const UNDERLINE_PADDING = 20;
export const Tabs = ({
  tabs,
  activeTab,
  horizontalScrollValue,
  onTabPressed,
  tabsContainerBackgroundColor,
  tabsContainerStyle,
  tabTextContainerStyle,
  tabTextContainerActiveStyle,
  tabWrapperStyle,
  tabUnderlineColor,
  tabTextActiveStyle,
  tabTextStyle,
  tabsContainerHorizontalPadding
}) => {
  const {
    width
  } = useWindowDimensions();
  const horizontalScrollRef = React.useRef(null);
  const currentPositionX = React.useRef(0);
  const [tabsWidth, setTabsWidth] = React.useState(tabs.map(_ => 0));
  const isInvertedAndroid = Platform.OS === 'android' ? I18nManager.isRTL : undefined;
  const isInvertedIOS = Platform.OS === 'ios' ? I18nManager.isRTL : undefined;
  const adjustPrevious = React.useCallback(page => {
    const lastHidden = Math.floor(currentPositionX.current / (width * 0.3));

    if (page <= lastHidden) {
      var _horizontalScrollRef$;

      currentPositionX.current = width * 0.3 * page;
      (_horizontalScrollRef$ = horizontalScrollRef.current) === null || _horizontalScrollRef$ === void 0 ? void 0 : _horizontalScrollRef$.scrollTo({
        animated: true,
        x: currentPositionX.current
      });
    }
  }, [width]);
  const adjustNext = React.useCallback(page => {
    const invisibleX = width + currentPositionX.current - width * 0.3 * (page + 1);

    if (invisibleX < 0) {
      var _horizontalScrollRef$2, _horizontalScrollRef$3;

      currentPositionX.current = currentPositionX.current - invisibleX;
      (_horizontalScrollRef$2 = horizontalScrollRef.current) === null || _horizontalScrollRef$2 === void 0 ? void 0 : (_horizontalScrollRef$3 = _horizontalScrollRef$2.scrollTo) === null || _horizontalScrollRef$3 === void 0 ? void 0 : _horizontalScrollRef$3.call(_horizontalScrollRef$2, {
        animated: true,
        x: currentPositionX.current
      });
    }
  }, [width]);
  const scrollToTab = React.useCallback(page => {
    if (tabs.length > 3) {
      if (page === 0) {
        var _horizontalScrollRef$4;

        (_horizontalScrollRef$4 = horizontalScrollRef.current) === null || _horizontalScrollRef$4 === void 0 ? void 0 : _horizontalScrollRef$4.scrollTo({
          animated: true,
          x: 0
        });
        currentPositionX.current = 0;
      } else if (page !== tabs.length - 1) {
        adjustPrevious(page - 1);
        adjustNext(page + 1);
      } else {
        var _horizontalScrollRef$5, _horizontalScrollRef$6;

        (_horizontalScrollRef$5 = horizontalScrollRef.current) === null || _horizontalScrollRef$5 === void 0 ? void 0 : (_horizontalScrollRef$6 = _horizontalScrollRef$5.scrollToEnd) === null || _horizontalScrollRef$6 === void 0 ? void 0 : _horizontalScrollRef$6.call(_horizontalScrollRef$5, {
          animated: true
        });
        currentPositionX.current = width * 0.3 * tabs.length - width;
      }
    }
  }, [adjustNext, adjustPrevious, tabs.length, width]);
  const scrollToTabRef = React.useRef(scrollToTab);
  React.useEffect(() => {
    scrollToTabRef.current = scrollToTab;
  }, [scrollToTab]);
  React.useEffect(() => {
    scrollToTabRef.current(activeTab); // Scroll also on width change to handle scrolling
    // when device orientation changes from landscape to portrait,
    // so that active tab is visible;
  }, [activeTab, width]);
  React.useEffect(() => {
    var _horizontalScrollRef$7, _horizontalScrollRef$8;

    (_horizontalScrollRef$7 = horizontalScrollRef.current) === null || _horizontalScrollRef$7 === void 0 ? void 0 : _horizontalScrollRef$7.scrollTo({
      x: 1
    });
    (_horizontalScrollRef$8 = horizontalScrollRef.current) === null || _horizontalScrollRef$8 === void 0 ? void 0 : _horizontalScrollRef$8.scrollTo({
      x: 0
    });
  }, []);
  const onTabLayout = React.useCallback(page => e => {
    const tabWidth = e.nativeEvent.layout.width;
    setTabsWidth(prevTabsWidth => {
      const newTabsWidth = prevTabsWidth.slice();
      newTabsWidth[page] = tabWidth;
      return newTabsWidth;
    });
  }, []);
  const onTabPress = React.useCallback(page => {
    return function () {
      scrollToTab(page);
      onTabPressed(page);
    };
  }, [onTabPressed, scrollToTab]);
  const renderIcon = React.useCallback((icon, page) => {
    const isActive = activeTab === page;

    if (typeof icon === 'function') {
      return icon(isActive);
    }

    return icon;
  }, [activeTab]);
  const HORIZONTAL_PADDINGS = tabsContainerHorizontalPadding !== null && tabsContainerHorizontalPadding !== void 0 ? tabsContainerHorizontalPadding : UNDERLINE_PADDING;
  const allSizes = tabsWidth.every(it => !!it) && tabsWidth.length > 0 && !!tabUnderlineColor;
  const {
    inputRange,
    translateXOutputRange,
    widthOutputRange
  } = React.useMemo(() => {
    const inRange = allSizes ? [0] : [0, 1];
    const translateXOutRange = allSizes ? [HORIZONTAL_PADDINGS] : [HORIZONTAL_PADDINGS, 100];
    const widthOutRange = translateXOutRange.slice();

    if (tabUnderlineColor) {
      tabsWidth.reduce((accTabWidth, tabWidth, index) => {
        if (allSizes) {
          widthOutRange[index] = tabWidth;

          if (index > 0) {
            inRange[index] = width * index;
            translateXOutRange[index] = accTabWidth;
          }

          return accTabWidth + tabWidth;
        }

        return accTabWidth;
      }, HORIZONTAL_PADDINGS);
    }

    return {
      inputRange: inRange,
      translateXOutputRange: translateXOutRange,
      widthOutputRange: widthOutRange
    };
  }, [tabsWidth, tabUnderlineColor, HORIZONTAL_PADDINGS, allSizes, width]);
  const tabUnderlineAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(horizontalScrollValue.value, inputRange, translateXOutputRange);
    return {
      backgroundColor: parseAnimatedColorProp(tabUnderlineColor),
      transform: [{
        translateX: isInvertedIOS ? translateX * -1 : translateX
      }],
      width: interpolate(horizontalScrollValue.value, inputRange, widthOutputRange)
    };
  }, [horizontalScrollValue, inputRange, isInvertedIOS, tabUnderlineColor, translateXOutputRange, widthOutputRange]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: parseAnimatedColorProp(tabsContainerBackgroundColor)
    };
  }, [tabsContainerBackgroundColor]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.container, containerAnimatedStyle]
  }, /*#__PURE__*/React.createElement(ScrollView, {
    ref: horizontalScrollRef,
    bounces: false,
    contentContainerStyle: [styles.contentContainer, Platform.OS === 'android' ? I18nManager.isRTL ? commonStyles.rowReverse : commonStyles.row : null, tabsContainerStyle, styles.noMargins, {
      paddingHorizontal: HORIZONTAL_PADDINGS
    }],
    horizontal: true,
    onScrollEndDrag: event => currentPositionX.current = event.nativeEvent.contentOffset.x,
    showsHorizontalScrollIndicator: false,
    style: [styles.nestedStyle, isInvertedAndroid && styles.inversionStyle]
  }, tabs.map((tab, page) => /*#__PURE__*/React.createElement(TabItem, {
    key: page,
    tab: tab,
    page: page,
    activeTab: activeTab,
    renderIcon: renderIcon,
    onTabLayout: onTabLayout(page),
    onTabPress: onTabPress(page),
    tabTextActiveStyle: tabTextActiveStyle,
    tabTextContainerActiveStyle: tabTextContainerActiveStyle,
    tabTextContainerStyle: tabTextContainerStyle,
    tabTextStyle: tabTextStyle,
    tabWrapperStyle: tabWrapperStyle
  })), tabUnderlineColor ? /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.tabUnderlineStyles, tabUnderlineAnimatedStyle]
  }) : null));
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  contentContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  inversionStyle: {
    transform: [{
      scaleX: -1
    }]
  },
  nestedStyle: {
    alignSelf: 'stretch'
  },
  noMargins: {
    marginHorizontal: 0,
    paddingHorizontal: 0
  },
  tabUnderlineStyles: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 6,
    height: 3
  }
});
//# sourceMappingURL=Tabs.js.map