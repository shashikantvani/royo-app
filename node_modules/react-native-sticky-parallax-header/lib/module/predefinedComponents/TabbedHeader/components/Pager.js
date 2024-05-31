function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { Dimensions, FlatList, I18nManager, Platform, StyleSheet, View } from 'react-native';
import Animated, { cancelAnimation, runOnJS, runOnUI, scrollTo, useAnimatedRef, useAnimatedScrollHandler, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { commonStyles } from '../../../constants';
import { debounce } from '../../common/utils/debounce';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const NOOP = () => {};

const SCROLL_TO_PAGE_OFFSET_TIMEOUT = 250;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export const Pager = /*#__PURE__*/React.forwardRef(({
  automaticallyAdjustContentInsets = false,
  children,
  contentContainerStyle,
  contentOffset: _contentOffset,
  directionalLockEnabled = true,
  disableScrollToPosition,
  initialPage = 0,
  keyboardDismissMode = 'on-drag',
  minScrollHeight,
  onChangeTab,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  page = -1,
  pageContainerStyle,
  rememberTabScrollPosition,
  scrollEventThrottle = 16,
  scrollHeight,
  scrollRef,
  scrollValue,
  scrollsToTop = false,
  showsHorizontalScrollIndicator = false,
  swipedPage,
  ...rest
}, ref) => {
  const [containerWidth, setContainerWidth] = React.useState(() => Dimensions.get('window').width);
  const containerWidthRef = React.useRef(containerWidth);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const currentPageRef = React.useRef(currentPage);
  const horizontalFlatListRef = useAnimatedRef();
  const horizontalScrollValue = useSharedValue(initialPage * Dimensions.get('window').width);
  const scrollToTabPositionTimeoutValue = useSharedValue(1);
  const data = React.useMemo(() => {
    return React.Children.toArray(children);
  }, [children]);
  const tabsScrollPosition = React.useRef(Array(data.length).fill(-1));
  const goToPageAnimationFrame = React.useRef();
  const isInvertedAndroid = Platform.OS === 'android' ? I18nManager.isRTL : undefined;
  React.useEffect(() => {
    var _horizontalFlatListRe, _horizontalFlatListRe2;

    /**
     * Scroll to make first rendered tab visible (if not used, sometimes when Pager is first rendered, it has blank first tab)
     */
    (_horizontalFlatListRe = horizontalFlatListRef.current) === null || _horizontalFlatListRe === void 0 ? void 0 : _horizontalFlatListRe.scrollToOffset({
      offset: 1,
      animated: true
    });
    (_horizontalFlatListRe2 = horizontalFlatListRef.current) === null || _horizontalFlatListRe2 === void 0 ? void 0 : _horizontalFlatListRe2.scrollToOffset({
      offset: 0,
      animated: true
    });
    return () => {
      cancelAnimation(scrollToTabPositionTimeoutValue);

      if (goToPageAnimationFrame.current) {
        cancelAnimationFrame(goToPageAnimationFrame.current);
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    if (page !== currentPageRef.current && page >= 0) {
      goToPage(page);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [page]);

  function onContainerLayout(e) {
    const {
      width
    } = e.nativeEvent.layout;

    if (!width || width <= 0 || Math.round(width) === Math.round(containerWidth)) {
      return;
    }

    setContainerWidth(width);
    containerWidthRef.current = width;
    goToPageAnimationFrame.current = requestAnimationFrame(() => {
      goToPage(currentPage);
    });
  }

  function scrollToPage(offset) {
    'worklet';

    if (Platform.OS === 'web') {
      var _horizontalFlatListRe3;

      (_horizontalFlatListRe3 = horizontalFlatListRef.current) === null || _horizontalFlatListRe3 === void 0 ? void 0 : _horizontalFlatListRe3.scrollToOffset({
        offset,
        animated: true
      });
      return;
    }

    scrollTo(horizontalFlatListRef, offset, 0, true);
  }

  function scrollToTabPosition(position) {
    'worklet';

    if (Platform.OS === 'web') {
      var _scrollRef$current;

      (_scrollRef$current = scrollRef.current) === null || _scrollRef$current === void 0 ? void 0 : _scrollRef$current.scrollTo({
        x: 0,
        y: position,
        animated: true
      });
      return;
    }

    scrollTo(scrollRef, 0, position, true);
  }

  function goToPage(pageNumber) {
    const offset = pageNumber * containerWidthRef.current;
    handleScrollToTabPosition(currentPage, pageNumber);
    runOnUI(scrollToPage)(offset);
    setCurrentPage(page);
    currentPageRef.current = page;
    onChangeTab === null || onChangeTab === void 0 ? void 0 : onChangeTab(currentPage, pageNumber);
  }

  function handleScrollToTabPosition(prevPage, newPage) {
    if (!data.length || scrollValue.value === 0 || disableScrollToPosition) {
      return;
    }

    tabsScrollPosition.current[prevPage] = scrollValue.value;
    const scrollTargetPosition = rememberTabScrollPosition && tabsScrollPosition.current[newPage] !== -1 ? tabsScrollPosition.current[newPage] : scrollHeight;
    scrollToTabPositionTimeoutValue.value = withDelay(SCROLL_TO_PAGE_OFFSET_TIMEOUT, withTiming(scrollToTabPositionTimeoutValue.value * -1, {
      duration: 0
    }, () => {
      'worklet';

      scrollToTabPosition(scrollTargetPosition);
    }));
  }

  function handlePossiblePageChange(offsetX) {
    const newPage = Math.round(offsetX / containerWidthRef.current);

    if (currentPage !== newPage) {
      swipedPage === null || swipedPage === void 0 ? void 0 : swipedPage(newPage);
      onChangeTab === null || onChangeTab === void 0 ? void 0 : onChangeTab(currentPage, newPage);
      setCurrentPage(newPage);
      handleScrollToTabPosition(currentPage, newPage);
    }
  }

  const handlePossiblePageChangeOnWeb = debounce(offsetX => {
    const newPage = Math.round(offsetX / containerWidthRef.current);

    if (currentPageRef.current !== newPage) {
      const prevPage = currentPageRef.current;
      swipedPage === null || swipedPage === void 0 ? void 0 : swipedPage(newPage);
      onChangeTab === null || onChangeTab === void 0 ? void 0 : onChangeTab(prevPage, newPage);
      setCurrentPage(newPage);
      handleScrollToTabPosition(prevPage, newPage);
      currentPageRef.current = newPage;
    }
  }, 100);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      horizontalScrollValue.value = e.contentOffset.x;
      onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);

      if (Platform.OS === 'web') {
        // On web there is no onMomentumScrollEnd
        const offsetX = e.contentOffset.x;
        runOnJS(handlePossiblePageChangeOnWeb)(offsetX);
      }
    },
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
      const offsetX = e.contentOffset.x;
      runOnJS(handlePossiblePageChange)(offsetX);
    }
  });
  React.useImperativeHandle(ref, () => ({
    goToPage
  }));
  const renderItem = React.useCallback(({
    item
  }) => {
    return /*#__PURE__*/React.createElement(Animated.View, {
      style: [isInvertedAndroid && styles.inversionStyle, // used to calculate current height of scroll
      {
        width: containerWidth
      }, pageContainerStyle]
    }, item);
  }, [containerWidth, isInvertedAndroid, pageContainerStyle]);
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container,
    onLayout: onContainerLayout
  }, /*#__PURE__*/React.createElement(AnimatedFlatList, _extends({
    ref: horizontalFlatListRef
  }, rest, {
    automaticallyAdjustContentInsets: automaticallyAdjustContentInsets,
    contentContainerStyle: [Platform.OS === 'android' ? I18nManager.isRTL ? commonStyles.rowReverse : commonStyles.row : null, {
      minHeight: minScrollHeight
    }, contentContainerStyle],
    contentOffset: {
      x: initialPage * containerWidth,
      y: 0
    },
    data: data,
    directionalLockEnabled: directionalLockEnabled,
    horizontal: true,
    keyExtractor: (_, i) => `${i}`,
    keyboardDismissMode: keyboardDismissMode,
    onScroll: scrollHandler
    /**
     * Workaround for reanimated v2.3+ bug
     *
     * https://github.com/software-mansion/react-native-reanimated/issues/2735#issuecomment-1001714779
     */
    ,
    onMomentumScrollBegin: NOOP,
    onMomentumScrollEnd: NOOP,
    onScrollBeginDrag: NOOP,
    onScrollEndDrag: NOOP,
    pagingEnabled: true,
    renderItem: renderItem,
    scrollEventThrottle: scrollEventThrottle,
    scrollsToTop: scrollsToTop,
    showsHorizontalScrollIndicator: showsHorizontalScrollIndicator,
    style: [isInvertedAndroid && styles.inversionStyle]
  })));
});
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inversionStyle: {
    transform: [{
      scaleX: -1
    }]
  }
});
//# sourceMappingURL=Pager.js.map