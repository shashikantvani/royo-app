/// <reference types="react-native-reanimated" />
import type { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import type { DetailsHeaderFlashListProps } from '../DetailsHeaderProps';
export declare function useDetailsFlashListHeader<ItemT, T extends FlashList<ItemT> = FlashList<ItemT>>(props: DetailsHeaderFlashListProps<ItemT>): {
    headerTitleContainerAnimatedStyle: {
        opacity: number;
    };
    onMomentumScrollEnd: (e: import("react-native").NativeScrollEvent) => void;
    onScroll: (e: import("react-native").NativeScrollEvent) => void;
    onScrollEndDrag: (e: import("react-native").NativeScrollEvent) => void;
    renderHeader: () => JSX.Element;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: React.RefObject<T>;
};
