import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { Tab, TabsConfig } from '../../common/SharedProps';
interface TabItemProps extends Pick<TabsConfig, 'tabTextActiveStyle' | 'tabTextContainerActiveStyle' | 'tabTextContainerStyle' | 'tabTextStyle' | 'tabWrapperStyle'> {
    tab: Tab;
    page: number;
    activeTab: number;
    onTabLayout?: (event: LayoutChangeEvent) => void;
    onTabPress?: () => void;
    renderIcon: (icon: Tab['icon'], page: number) => React.ReactElement | null | undefined;
}
export declare const TabItem: React.FC<TabItemProps>;
export {};
