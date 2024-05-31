import * as React from 'react';
import { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { HeaderWrapper } from '../../common/components/HeaderWrapper';
import { usePredefinedHeader } from '../../common/hooks/usePredefinedHeader';
import { scrollPosition } from '../../common/utils/scrollPosition';
import { Foreground } from '../components/HeaderForeground';
export function useDetailsHeader(props) {
  const {
    contentBackgroundColor,
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
    contentIcon,
    contentIconNumber,
    contentIconNumberStyle,
    contentIconNumberTestID,
    hasBorderRadius,
    image,
    subtitle,
    subtitleStyle,
    subtitleTestID,
    tabsContainerBackgroundColor,
    tag,
    tagStyle,
    tagTestID,
    title,
    titleStyle,
    titleTestID
  } = props;
  const headerTitleInputRange = [0, scrollPosition(scrollHeight, 60), scrollPosition(scrollHeight, 90)];
  const headerTitleContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, headerTitleInputRange, [0, 0, 1], Extrapolate.CLAMP)
    };
  });
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
      contentIcon: contentIcon,
      contentIconNumber: contentIconNumber,
      contentIconNumberStyle: contentIconNumberStyle,
      contentIconNumberTestID: contentIconNumberTestID,
      image: image,
      subtitle: subtitle,
      subtitleStyle: subtitleStyle,
      subtitleTestID: subtitleTestID,
      tag: tag,
      tagStyle: tagStyle,
      tagTestID: tagTestID,
      title: title,
      titleStyle: titleStyle,
      titleTestID: titleTestID
    }));
  }, [backgroundColor, backgroundImage, contentBackgroundColor, contentIcon, contentIconNumber, contentIconNumberStyle, contentIconNumberTestID, hasBorderRadius, image, parallaxHeight, scrollHeight, scrollValue, subtitle, subtitleStyle, subtitleTestID, tabsContainerBackgroundColor, tag, tagStyle, tagTestID, title, titleStyle, titleTestID]);
  return {
    headerTitleContainerAnimatedStyle,
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    renderHeader,
    scrollValue,
    scrollViewRef
  };
}
//# sourceMappingURL=useDetailsHeader.js.map