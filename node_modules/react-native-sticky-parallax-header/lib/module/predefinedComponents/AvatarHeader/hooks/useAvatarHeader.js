import * as React from 'react';
import { HeaderWrapper } from '../../common/components/HeaderWrapper';
import { usePredefinedHeader } from '../../common/hooks/usePredefinedHeader';
import { Foreground } from '../components/HeaderForeground';
export function useAvatarHeader(props) {
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
    hasBorderRadius,
    image,
    subtitle,
    subtitleStyle,
    subtitleTestID,
    tabsContainerBackgroundColor,
    title,
    titleStyle,
    titleTestID
  } = props;
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
      image: image,
      subtitle: subtitle,
      subtitleStyle: subtitleStyle,
      subtitleTestID: subtitleTestID,
      title: title,
      titleStyle: titleStyle,
      titleTestID: titleTestID
    }));
  }, [backgroundColor, backgroundImage, contentBackgroundColor, hasBorderRadius, image, parallaxHeight, scrollHeight, scrollValue, subtitle, subtitleStyle, subtitleTestID, tabsContainerBackgroundColor, title, titleStyle, titleTestID]);
  return {
    onMomentumScrollEnd,
    onScroll,
    onScrollEndDrag,
    parallaxHeight,
    renderHeader,
    scrollValue,
    scrollViewRef
  };
}
//# sourceMappingURL=useAvatarHeader.js.map