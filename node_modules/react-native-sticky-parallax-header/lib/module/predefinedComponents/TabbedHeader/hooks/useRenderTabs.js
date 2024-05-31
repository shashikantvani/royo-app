import * as React from 'react';
import { Tabs } from '../components/Tabs';
export function useRenderTabs(tabsProps) {
  const {
    activeTab,
    horizontalScrollValue,
    onTabPressed,
    tabTextActiveStyle,
    tabTextContainerActiveStyle,
    tabTextContainerStyle,
    tabTextStyle,
    tabUnderlineColor,
    tabWrapperStyle,
    tabs,
    tabsContainerBackgroundColor,
    tabsContainerHorizontalPadding,
    tabsContainerStyle
  } = tabsProps;
  return React.useCallback(() => {
    if (!tabs) {
      return null;
    }

    return /*#__PURE__*/React.createElement(Tabs, {
      tabs: tabs,
      activeTab: activeTab,
      horizontalScrollValue: horizontalScrollValue,
      onTabPressed: onTabPressed,
      tabTextActiveStyle: tabTextActiveStyle,
      tabTextContainerActiveStyle: tabTextContainerActiveStyle,
      tabTextContainerStyle: tabTextContainerStyle,
      tabTextStyle: tabTextStyle,
      tabUnderlineColor: tabUnderlineColor,
      tabWrapperStyle: tabWrapperStyle,
      tabsContainerBackgroundColor: tabsContainerBackgroundColor,
      tabsContainerHorizontalPadding: tabsContainerHorizontalPadding,
      tabsContainerStyle: tabsContainerStyle
    });
  }, [activeTab, horizontalScrollValue, onTabPressed, tabTextActiveStyle, tabTextContainerActiveStyle, tabTextContainerStyle, tabTextStyle, tabUnderlineColor, tabWrapperStyle, tabs, tabsContainerBackgroundColor, tabsContainerHorizontalPadding, tabsContainerStyle]);
}
//# sourceMappingURL=useRenderTabs.js.map