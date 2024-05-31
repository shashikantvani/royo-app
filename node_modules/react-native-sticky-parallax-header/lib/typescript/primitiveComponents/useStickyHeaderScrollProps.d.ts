/// <reference types="react" />
/// <reference types="react-native-reanimated" />
import type { FlatList, NativeScrollEvent, ScrollView, SectionList } from 'react-native';
import type { StickyHeaderSharedProps, StickyHeaderSnapProps } from './StickyHeaderProps';
export declare type ScrollComponent = ScrollView | FlatList<any> | SectionList<any, any>;
export declare function useStickyHeaderScrollProps<T extends ScrollComponent>(props: StickyHeaderSharedProps & StickyHeaderSnapProps): {
    onMomentumScrollEnd: (e: NativeScrollEvent) => void;
    onScroll: (e: NativeScrollEvent) => void;
    onScrollEndDrag: (e: NativeScrollEvent) => void;
    scrollHeight: number;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: import("react").RefObject<T>;
};
