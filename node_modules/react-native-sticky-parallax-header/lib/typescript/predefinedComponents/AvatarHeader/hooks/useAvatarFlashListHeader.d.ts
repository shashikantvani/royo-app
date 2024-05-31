/// <reference types="react-native-reanimated" />
import type { FlashList } from '@shopify/flash-list';
import * as React from 'react';
import type { AvatarHeaderFlashListProps } from '../AvatarHeaderProps';
export declare function useAvatarFlashListHeader<ItemT, T extends FlashList<ItemT> = FlashList<ItemT>>(props: AvatarHeaderFlashListProps<ItemT>): {
    onMomentumScrollEnd: (e: import("react-native").NativeScrollEvent) => void;
    onScroll: (e: import("react-native").NativeScrollEvent) => void;
    onScrollEndDrag: (e: import("react-native").NativeScrollEvent) => void;
    parallaxHeight: number;
    renderHeader: () => JSX.Element;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: React.RefObject<T>;
};
