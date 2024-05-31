import * as React from 'react';
import { ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
export const HeaderBackgroundImage = ({
  background,
  backgroundHeight,
  backgroundImage
}) => {
  const {
    width
  } = useWindowDimensions();
  return /*#__PURE__*/React.createElement(ImageBackground, {
    style: [styles.headerStyle, {
      height: backgroundHeight,
      width
    }],
    source: backgroundImage,
    testID: "HeaderBackgroundImage"
  }, background);
};
const styles = StyleSheet.create({
  headerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    zIndex: -1
  }
});
//# sourceMappingURL=HeaderBackgroundImage.js.map