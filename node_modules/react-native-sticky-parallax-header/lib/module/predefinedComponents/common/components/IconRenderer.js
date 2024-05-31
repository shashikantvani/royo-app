import * as React from 'react';
import { Image, StyleSheet } from 'react-native';

const IconRenderer = ({
  icon
}) => {
  if (typeof icon === 'function') {
    return icon();
  }

  return icon ? /*#__PURE__*/React.createElement(Image, {
    style: styles.icon,
    resizeMode: "contain",
    source: icon
  }) : null;
};

const styles = StyleSheet.create({
  icon: {
    width: 16,
    height: 16,
    marginTop: 3
  }
});
export default IconRenderer;
//# sourceMappingURL=IconRenderer.js.map