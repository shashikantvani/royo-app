/// <reference types="react" />
/// <reference types="react-native-reanimated" />
import type { FlashList } from '@shopify/flash-list';
import type { NativeScrollEvent } from 'react-native';
import type { StickyHeaderSharedProps, StickyHeaderSnapProps } from './StickyHeaderProps';
export declare function useStickyHeaderFlashListScrollProps<T extends FlashList<any> = FlashList<any>>(props: StickyHeaderSharedProps & StickyHeaderSnapProps): {
    onMomentumScrollEnd: (e: NativeScrollEvent) => void;
    onScroll: (e: NativeScrollEvent) => void;
    onScrollEndDrag: (e: NativeScrollEvent) => void;
    scrollHeight: number;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: import("react").RefObject<T>;
};
