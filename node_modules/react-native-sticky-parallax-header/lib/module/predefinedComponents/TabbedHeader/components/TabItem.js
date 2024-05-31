import * as React from 'react';
import { I18nManager, Platform, Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors } from '../../../constants';
export const TabItem = ({
  tab,
  page,
  onTabLayout,
  onTabPress,
  tabWrapperStyle,
  tabTextActiveStyle,
  tabTextContainerActiveStyle,
  tabTextContainerStyle,
  tabTextStyle,
  activeTab,
  renderIcon
}) => {
  const isInvertedAndroid = Platform.OS === 'android' ? I18nManager.isRTL : undefined;
  const isTabActive = activeTab === page;
  const tabKey = tab.title || `tab ${page}`;
  const tabTestID = tab.testID || `${tabKey}TestID`;
  return /*#__PURE__*/React.createElement(Pressable, {
    accessibilityLabel: tabKey,
    accessibilityRole: "button",
    key: tabKey,
    onLayout: onTabLayout,
    onPress: onTabPress,
    style: ({
      pressed
    }) => [isInvertedAndroid && styles.inversionStyle, styles.tabsWrapper, tabWrapperStyle, styles.noMargins, pressed && styles.pressed],
    testID: tabTestID
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.tabContainer, styles.tabTextContainerStyle, tabTextContainerStyle, isTabActive && styles.tabTextContainerActiveStyle, isTabActive && tabTextContainerActiveStyle]
  }, renderIcon(tab.icon, page), tab.title ? /*#__PURE__*/React.createElement(Animated.Text, {
    style: [styles.tabText, tabTextStyle, isTabActive && tabTextActiveStyle]
  }, tab.title) : null));
};
const styles = StyleSheet.create({
  inversionStyle: {
    transform: [{
      scaleX: -1
    }]
  },
  noMargins: {
    marginHorizontal: 0,
    paddingHorizontal: 0
  },
  pressed: {
    opacity: 0.9
  },
  tabContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.white,
    textAlign: 'left'
  },
  tabsWrapper: {
    flex: 1,
    paddingVertical: 12
  },
  tabTextContainerStyle: {
    backgroundColor: colors.transparent,
    borderRadius: 18
  },
  tabTextContainerActiveStyle: {
    backgroundColor: colors.darkMint
  }
});
//# sourceMappingURL=TabItem.js.map