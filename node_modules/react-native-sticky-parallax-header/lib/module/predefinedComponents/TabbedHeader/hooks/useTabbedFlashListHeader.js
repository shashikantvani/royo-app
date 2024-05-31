/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Platform } from 'react-native';
import { runOnJS, useSharedValue, useWorkletCallback } from 'react-native-reanimated';
import { HeaderWrapper } from '../../common/components/HeaderWrapper';
import { usePredefinedFlashListHeader } from '../../common/hooks/usePredefinedFlashListHeader';
import { debounce } from '../../common/utils/debounce';
import { isNotEmpty } from '../../common/utils/isNotEmpty';
import { Foreground } from '../components/HeaderForeground';
import { useRenderTabs } from './useRenderTabs';

function useRenderFlashListHeader(props) {
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
  } = usePredefinedFlashListHeader(props);
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

export function useTabbedFlashListHeader(props) {
  const {
    innerScrollHeight,
    horizontalScrollValue,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    scrollValue,
    scrollViewRef
  } = useRenderFlashListHeader(props);
  const {
    stickyHeaderIndices = [],
    backgroundColor,
    tabsContainerBackgroundColor
  } = props;
  const [activeSection, setActiveSection] = React.useState(0);
  const ignoreViewabilityItemsChangedEvent = useSharedValue(false);
  const onViewableItemsChanged = React.useCallback(({
    viewableItems
  }) => {
    if (!viewableItems.length || ignoreViewabilityItemsChangedEvent.value || !isNotEmpty(viewableItems[0].index)) {
      return;
    }

    let newActiveSection;

    for (let i = 0; i < stickyHeaderIndices.length; i++) {
      const firstIdx = stickyHeaderIndices[i];

      if (i === stickyHeaderIndices.length - 1) {
        if (viewableItems[0].index >= firstIdx) {
          newActiveSection = i;
          i = stickyHeaderIndices.length;
        }
      } else {
        const secondIdx = stickyHeaderIndices[i + 1];

        if (viewableItems[0].index >= firstIdx && viewableItems[0].index < secondIdx) {
          newActiveSection = i;
          i = stickyHeaderIndices.length;
        }
      }
    }

    if (typeof newActiveSection === 'number') {
      setActiveSection(newActiveSection);
    }
  }, [ignoreViewabilityItemsChangedEvent, stickyHeaderIndices]);
  const goToSection = React.useCallback(sectionIndex => {
    var _scrollViewRef$curren;

    ignoreViewabilityItemsChangedEvent.value = true;
    (_scrollViewRef$curren = scrollViewRef.current) === null || _scrollViewRef$curren === void 0 ? void 0 : _scrollViewRef$curren.scrollToIndex({
      animated: true,
      index: stickyHeaderIndices[sectionIndex],
      viewPosition: 0,
      viewOffset: 0
    });
    setActiveSection(sectionIndex);
  }, [ignoreViewabilityItemsChangedEvent, scrollViewRef, stickyHeaderIndices]);
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
//# sourceMappingURL=useTabbedFlashListHeader.js.map