import * as React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { colors } from '../../../constants';
import { parseAnimatedColorProp } from '../utils/parseAnimatedColorProp';
import { HeaderBackground } from './HeaderBackground';
import { HeaderBackgroundImage } from './HeaderBackgroundImage';
export const HeaderWrapper = ({
  backgroundColor,
  backgroundImage,
  children,
  contentBackgroundColor,
  hasBorderRadius,
  parallaxHeight,
  scrollHeight,
  scrollValue,
  tabsContainerBackgroundColor
}) => {
  const {
    width
  } = useWindowDimensions();
  const hasBackgroundImage = !!backgroundImage;
  const contentAnimatedStyle = useAnimatedStyle(() => {
    // TypeScript complains about AnimatedNode<StyleProp<ViewStyle>> from reanimated v1
    return {
      backgroundColor: parseAnimatedColorProp(contentBackgroundColor)
    };
  }, [contentBackgroundColor]);
  const foregroundAnimatedStyle = useAnimatedStyle(() => {
    if (hasBackgroundImage) {
      return {
        backgroundColor: colors.transparent
      };
    }

    return {
      backgroundColor: parseAnimatedColorProp(tabsContainerBackgroundColor)
    };
  }, [hasBackgroundImage, tabsContainerBackgroundColor]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: contentAnimatedStyle
  }, backgroundImage ? /*#__PURE__*/React.createElement(View, {
    pointerEvents: "none"
  }, /*#__PURE__*/React.createElement(HeaderBackgroundImage, {
    background: /*#__PURE__*/React.createElement(HeaderBackground, {
      backgroundColor: backgroundColor,
      hasBorderRadius: hasBorderRadius,
      height: parallaxHeight,
      scrollValue: scrollValue
    }),
    backgroundHeight: scrollHeight,
    backgroundImage: backgroundImage
  })) : /*#__PURE__*/React.createElement(View, {
    pointerEvents: "none",
    style: [styles.headerStyle, {
      height: scrollHeight
    }, {
      width
    }]
  }, /*#__PURE__*/React.createElement(HeaderBackground, {
    backgroundColor: backgroundColor,
    hasBorderRadius: hasBorderRadius,
    height: parallaxHeight,
    scrollValue: scrollValue
  })), /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: [{
      height: scrollHeight
    }, foregroundAnimatedStyle],
    testID: "HeaderForeground"
  }, children));
};
const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  }
});
//# sourceMappingURL=HeaderWrapper.js.map