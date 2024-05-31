import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { parseAnimatedColorProp } from '../utils/parseAnimatedColorProp';
export const HeaderBackground = ({
  backgroundColor,
  hasBorderRadius,
  height,
  scrollValue
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const animatedBackgroundColor = parseAnimatedColorProp(backgroundColor);

    if (!hasBorderRadius) {
      return {
        backgroundColor: animatedBackgroundColor,
        borderBottomEndRadius: 0
      };
    }

    return {
      backgroundColor: animatedBackgroundColor,
      borderBottomEndRadius: interpolate(scrollValue.value, [0, height], [80, 0], Extrapolate.EXTEND)
    };
  }, [backgroundColor, hasBorderRadius, scrollValue, height]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "none",
    style: [styles.background, animatedStyle],
    testID: "HeaderBackground"
  });
};
const styles = StyleSheet.create({
  background: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: -1
  }
});
//# sourceMappingURL=HeaderBackground.js.map