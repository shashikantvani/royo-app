import * as React from 'react';
import Animated from 'react-native-reanimated';
import type { TabsConfig } from '../../common/SharedProps';
export interface TabsProps extends TabsConfig {
    activeTab: number;
    horizontalScrollValue: Animated.SharedValue<number>;
    onTabPressed: (index: number) => void;
}
export declare const Tabs: React.FC<TabsProps>;
