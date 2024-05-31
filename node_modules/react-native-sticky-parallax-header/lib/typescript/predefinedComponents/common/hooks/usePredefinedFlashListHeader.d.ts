/// <reference types="react" />
/// <reference types="react-native-reanimated" />
import type { FlashList } from '@shopify/flash-list';
import type { SharedPredefinedProps } from '../SharedProps';
export declare function usePredefinedFlashListHeader<T extends FlashList<any>>(props: SharedPredefinedProps): {
    contentBackgroundColor: import("react-native").ColorValue | undefined;
    innerScrollHeight: number;
    onMomentumScrollEnd: (e: import("react-native").NativeScrollEvent) => void;
    onScroll: (e: import("react-native").NativeScrollEvent) => void;
    onScrollEndDrag: (e: import("react-native").NativeScrollEvent) => void;
    parallaxHeight: number;
    scrollHeight: number;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: import("react").RefObject<T>;
};
