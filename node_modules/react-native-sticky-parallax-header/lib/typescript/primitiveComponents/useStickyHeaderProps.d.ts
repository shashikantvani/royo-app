import type { LayoutChangeEvent } from 'react-native';
import type { StickyHeaderFlatListProps, StickyHeaderScrollViewProps, StickyHeaderSectionListProps } from './StickyHeaderProps';
export declare function useStickyHeaderProps(props: StickyHeaderFlatListProps<unknown> | StickyHeaderScrollViewProps | StickyHeaderSectionListProps<unknown, unknown>): {
    contentContainerPaddingTop: number;
    contentContainerPaddingBottom: number;
    headerAnimatedStyle: {
        transform: {
            translateY: number;
        }[];
    };
    headerHeight: number;
    listPaddingTop: number;
    onHeaderLayoutInternal: (e: LayoutChangeEvent) => void;
    onTabsLayoutInternal: (e: LayoutChangeEvent) => void;
    scrollHandler: (event: import("react-native").NativeSyntheticEvent<import("react-native").NativeScrollEvent>) => void;
    tabsHeight: number;
};
