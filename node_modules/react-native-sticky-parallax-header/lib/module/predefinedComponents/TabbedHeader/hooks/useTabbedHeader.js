import * as React from 'react';
import { Platform } from 'react-native';
import { runOnJS, useSharedValue, useWorkletCallback } from 'react-native-reanimated';
import { HeaderWrapper } from '../../common/components/HeaderWrapper';
import { usePredefinedHeader } from '../../common/hooks/usePredefinedHeader';
import { debounce } from '../../common/utils/debounce';
import { Foreground } from '../components/HeaderForeground';
import { useRenderTabs } from './useRenderTabs';

function useRenderHeader(props) {
  const {
    contentBackgroundColor,
    innerScrollHeight,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    parallaxHeight,
    scrollHeight,
    scrollValue,
    scrollViewRef
  } = usePredefinedHeader(props);
  const {
    backgroundColor,
    backgroundImage,
    foregroundImage,
    hasBorderRadius,
    tabsContainerBackgroundColor,
    title,
    titleStyle,
    titleTestID
  } = props;
  const horizontalScrollValue = useSharedValue(0);
  const onHorizontalPagerScroll = useWorkletCallback(e => {
    horizontalScrollValue.value = e.contentOffset.x;
  }, []);
  const renderHeader = React.useCallback(() => {
    return /*#__PURE__*/React.createElement(HeaderWrapper, {
      backgroundColor: backgroundColor,
      backgroundImage: backgroundImage,
      contentBackgroundColor: contentBackgroundColor,
      hasBorderRadius: hasBorderRadius,
      parallaxHeight: parallaxHeight,
      scrollHeight: scrollHeight,
      scrollValue: scrollValue,
      tabsContainerBackgroundColor: tabsContainerBackgroundColor
    }, /*#__PURE__*/React.createElement(Foreground, {
      height: parallaxHeight,
      scrollValue: scrollValue,
      foregroundImage: foregroundImage,
      title: title,
      titleStyle: titleStyle,
      titleTestID: titleTestID
    }));
  }, [backgroundColor, backgroundImage, contentBackgroundColor, foregroundImage, hasBorderRadius, parallaxHeight, scrollHeight, scrollValue, tabsContainerBackgroundColor, title, titleStyle, titleTestID]);
  return {
    innerScrollHeight,
    horizontalScrollValue,
    onHorizontalPagerScroll,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    scrollHeight,
    scrollValue,
    scrollViewRef
  };
}

export function useTabbedHeaderPager(props) {
  const {
    innerScrollHeight,
    horizontalScrollValue,
    onHorizontalPagerScroll,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    scrollHeight,
    scrollValue,
    scrollViewRef
  } = useRenderHeader(props);
  const {
    backgroundColor,
    initialPage,
    tabsContainerBackgroundColor
  } = props;
  const [currentPage, setCurrentPage] = React.useState(initialPage !== null && initialPage !== void 0 ? initialPage : 0);
  const goToPage = React.useCallback(pageNumber => {
    setCurrentPage(prev => {
      if (prev !== pageNumber) {
        return pageNumber;
      }

      return prev;
    });
  }, []);
  const renderTabs = useRenderTabs({ ...props,
    activeTab: currentPage,
    horizontalScrollValue,
    onTabPressed: goToPage,
    tabsContainerBackgroundColor: tabsContainerBackgroundColor !== null && tabsContainerBackgroundColor !== void 0 ? tabsContainerBackgroundColor : backgroundColor
  });
  return {
    currentPage,
    goToPage,
    innerScrollHeight,
    onHorizontalPagerScroll,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    renderTabs,
    scrollHeight,
    scrollValue,
    scrollViewRef,
    setCurrentPage
  };
}
export function useTabbedHeaderList(props) {
  const ignoreViewabilityItemsChangedEvent = useSharedValue(false);
  const {
    innerScrollHeight,
    horizontalScrollValue,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    scrollValue,
    scrollViewRef
  } = useRenderHeader(props);
  const onMomentumScrollEndInternal = useWorkletCallback(e => {
    ignoreViewabilityItemsChangedEvent.value = false;
    onMomentumScrollEnd === null || onMomentumScrollEnd === void 0 ? void 0 : onMomentumScrollEnd(e);
  }, [onMomentumScrollEnd]);
  const debouncedIgnoreViewabilityItemsChangedCallback = debounce(() => {
    ignoreViewabilityItemsChangedEvent.value = false;
  }, 100);
  const onScrollInternal = useWorkletCallback(e => {
    if (Platform.OS === 'web') {
      // On web there is no onMomentumScrollEnd
      runOnJS(debouncedIgnoreViewabilityItemsChangedCallback)();
    }

    onScroll === null || onScroll === void 0 ? void 0 : onScroll(e);
  }, [onScroll]);
  const {
    backgroundColor,
    sections,
    tabsContainerBackgroundColor
  } = props;
  const [activeSection, setActiveSection] = React.useState(0);
  const goToSection = React.useCallback(sectionIndex => {
    var _scrollViewRef$curren;

    ignoreViewabilityItemsChangedEvent.value = true;
    (_scrollViewRef$curren = scrollViewRef.current) === null || _scrollViewRef$curren === void 0 ? void 0 : _scrollViewRef$curren.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex,
      viewPosition: 0
    });
    setActiveSection(sectionIndex); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onViewableItemsChanged = React.useCallback(({
    viewableItems
  }) => {
    if (!viewableItems.length || ignoreViewabilityItemsChangedEvent.value) {
      return;
    }

    const newActiveSection = sections.findIndex(section => {
      var _viewableItems$0$sect;

      return section.key === ((_viewableItems$0$sect = viewableItems[0].section) === null || _viewableItems$0$sect === void 0 ? void 0 : _viewableItems$0$sect.key);
    });

    if (newActiveSection !== -1) {
      setActiveSection(newActiveSection);
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [sections]);
  const renderTabs = useRenderTabs({ ...props,
    activeTab: activeSection,
    horizontalScrollValue,
    onTabPressed: goToSection,
    tabsContainerBackgroundColor: tabsContainerBackgroundColor !== null && tabsContainerBackgroundColor !== void 0 ? tabsContainerBackgroundColor : backgroundColor
  });
  return {
    goToSection,
    innerScrollHeight,
    onMomentumScrollEnd: onMomentumScrollEndInternal,
    onScroll: onScrollInternal,
    onScrollEndDrag,
    onViewableItemsChanged,
    renderHeader,
    renderTabs,
    scrollValue,
    scrollViewRef
  };
}
//# sourceMappingURL=useTabbedHeader.js.map