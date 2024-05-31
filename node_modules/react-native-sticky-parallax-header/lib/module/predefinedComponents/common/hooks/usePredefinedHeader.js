import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useResponsiveSize } from '../../../hooks/useResponsiveSize';
import { useStickyHeaderScrollProps } from '../../../primitiveComponents/useStickyHeaderScrollProps';
export function usePredefinedHeader(props) {
  const {
    height
  } = useWindowDimensions();
  const {
    responsiveHeight
  } = useResponsiveSize();
  const {
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    scrollHeight,
    scrollValue,
    scrollViewRef
  } = useStickyHeaderScrollProps(props);
  const {
    contentContainerStyle,
    headerHeight = 100,
    parallaxHeight = responsiveHeight(53)
  } = props;
  const innerScrollHeight = height - headerHeight - parallaxHeight;
  const {
    contentBackgroundColor
  } = useMemo(() => {
    const contentContainerFlattenedStyle = StyleSheet.flatten(contentContainerStyle);
    return {
      contentBackgroundColor: contentContainerFlattenedStyle === null || contentContainerFlattenedStyle === void 0 ? void 0 : contentContainerFlattenedStyle.backgroundColor
    };
  }, [contentContainerStyle]);
  return {
    contentBackgroundColor,
    innerScrollHeight,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    parallaxHeight,
    scrollHeight,
    scrollValue,
    scrollViewRef
  };
}
//# sourceMappingURL=usePredefinedHeader.js.map