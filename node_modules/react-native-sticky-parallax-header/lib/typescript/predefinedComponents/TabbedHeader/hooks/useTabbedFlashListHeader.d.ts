/// <reference types="react-native-reanimated" />
import type { FlashList, ViewToken } from '@shopify/flash-list';
import * as React from 'react';
import type { NativeScrollEvent } from 'react-native';
import type { TabbedHeaderFlashListProps } from '../TabbedHeaderProps';
export declare function useTabbedFlashListHeader<ItemT, T extends FlashList<ItemT> = FlashList<ItemT>>(props: TabbedHeaderFlashListProps<ItemT>): {
    goToSection: (sectionIndex: number) => void;
    innerScrollHeight: number;
    onMomentumScrollEnd: (e: NativeScrollEvent) => void;
    onScroll: (e: NativeScrollEvent) => void;
    onScrollEndDrag: (e: NativeScrollEvent) => void;
    onViewableItemsChanged: ({ viewableItems }: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => void;
    renderHeader: () => JSX.Element;
    renderTabs: () => JSX.Element | null;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: React.RefObject<T>;
};
