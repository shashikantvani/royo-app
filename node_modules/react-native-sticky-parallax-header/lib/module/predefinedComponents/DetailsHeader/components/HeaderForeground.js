import * as React from 'react';
import { Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { colors, commonStyles, constants } from '../../../constants';
import { useRTLStyles } from '../../common/hooks/useRTLStyles';
import { scrollPosition } from '../../common/utils/scrollPosition';
export const Foreground = ({
  contentIcon,
  contentIconNumber,
  contentIconNumberStyle,
  contentIconNumberTestID = 'DetailsHeaderForegroundContentIconNumberTestID',
  height,
  image,
  scrollValue,
  subtitle,
  subtitleStyle,
  subtitleTestID = 'DetailsHeaderForegroundSubtitleTestID',
  tag,
  tagStyle,
  tagTestID = 'DetailsHeaderForegroundTagTestID',
  title,
  titleStyle,
  titleTestID = 'DetailsHeaderForegroundTitleTestID'
}) => {
  const {
    height: windowHeight,
    width: windowWidth
  } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight && windowHeight <= constants.breakpoints.mediumPhoneShorterEdge;
  const outputRange = [1, 0.8, 0];
  const labelInputRange = [0, scrollPosition(height, 19), scrollPosition(height, 25)];
  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, labelInputRange, outputRange, Extrapolate.CLAMP)
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollValue, height]);
  const titleInputRange = [0, scrollPosition(height, 45), scrollPosition(height, 55)];
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, titleInputRange, outputRange, Extrapolate.CLAMP)
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollValue, height]);
  const authorInputRange = [0, scrollPosition(height, 55), scrollPosition(height, 70)];
  const authorAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollValue.value, authorInputRange, outputRange, Extrapolate.CLAMP)
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollValue, height]);
  const authorNameRTLStyle = useRTLStyles(styles.authorNamePaddingLeft, styles.authorNamePaddingRight, styles.authorNamePaddingStart);
  const numberRTLStyle = useRTLStyles(styles.numberPaddingLeft, styles.numberPaddingRight, styles.numberPaddingStart);
  const landscapeStyle = useRTLStyles(commonStyles.row, commonStyles.rowReverse, commonStyles.row);
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "none",
    style: isLandscape ? [commonStyles.foregroundRow, landscapeStyle] : [commonStyles.foreground, commonStyles.column]
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.foregroundTitle, labelAnimatedStyle]
  }, /*#__PURE__*/React.createElement(Animated.Text, {
    style: [styles.foregroundText, tagStyle !== null && tagStyle !== void 0 ? tagStyle : titleStyle],
    testID: tagTestID
  }, tag)), /*#__PURE__*/React.createElement(Animated.View, {
    style: [commonStyles.messageContainer, titleAnimatedStyle]
  }, /*#__PURE__*/React.createElement(Animated.Text, {
    numberOfLines: 3,
    style: [commonStyles.message, titleStyle],
    testID: titleTestID
  }, title))), /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.infoContainer, authorAnimatedStyle]
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.iconContainer
  }, contentIcon && /*#__PURE__*/React.createElement(Image, {
    source: contentIcon,
    style: styles.icon
  }), /*#__PURE__*/React.createElement(Animated.Text, {
    style: [styles.number, numberRTLStyle, contentIconNumberStyle !== null && contentIconNumberStyle !== void 0 ? contentIconNumberStyle : titleStyle],
    testID: contentIconNumberTestID
  }, contentIconNumber)), /*#__PURE__*/React.createElement(View, {
    style: styles.footerContainer
  }, image && /*#__PURE__*/React.createElement(Image, {
    source: image,
    style: styles.authorPhoto,
    resizeMode: "contain"
  }), /*#__PURE__*/React.createElement(Animated.Text, {
    numberOfLines: 1,
    style: [styles.authorName, authorNameRTLStyle, subtitleStyle !== null && subtitleStyle !== void 0 ? subtitleStyle : titleStyle],
    testID: subtitleTestID
  }, subtitle !== null && subtitle !== void 0 ? subtitle : title))));
};
const styles = StyleSheet.create({
  authorName: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'left'
  },
  authorNamePaddingStart: {
    paddingStart: 12
  },
  authorNamePaddingLeft: {
    paddingLeft: 12
  },
  authorNamePaddingRight: {
    paddingRight: 12
  },
  authorPhoto: {
    borderRadius: Platform.select({
      android: 50,
      default: 8
    }),
    height: 32,
    width: 32
  },
  foregroundText: {
    color: colors.white,
    paddingHorizontal: 12,
    textAlign: 'left'
  },
  foregroundTitle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.whiteTransparent10,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center'
  },
  footerContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 24
  },
  icon: {
    height: 16,
    marginTop: 3,
    width: 16
  },
  iconContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 8,
    width: 56
  },
  infoContainer: {
    flexDirection: 'row',
    paddingBottom: 32
  },
  number: {
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'left'
  },
  numberPaddingStart: {
    paddingStart: 4
  },
  numberPaddingLeft: {
    paddingLeft: 4
  },
  numberPaddingRight: {
    paddingRight: 4
  }
});
//# sourceMappingURL=HeaderForeground.js.map