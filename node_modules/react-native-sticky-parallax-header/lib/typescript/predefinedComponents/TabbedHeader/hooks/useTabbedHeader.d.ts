/// <reference types="react-native-reanimated" />
import * as React from 'react';
import type { NativeScrollEvent, ScrollView, SectionList, ViewToken } from 'react-native';
import type { TabbedHeaderListProps, TabbedHeaderPagerProps } from '../TabbedHeaderProps';
export declare function useTabbedHeaderPager(props: TabbedHeaderPagerProps): {
    currentPage: number;
    goToPage: (pageNumber: number) => void;
    innerScrollHeight: number;
    onHorizontalPagerScroll: (e: NativeScrollEvent) => void;
    onMomentumScrollEnd: (e: NativeScrollEvent) => void;
    onScroll: (e: NativeScrollEvent) => void;
    onScrollEndDrag: (e: NativeScrollEvent) => void;
    renderHeader: () => JSX.Element;
    renderTabs: () => JSX.Element | null;
    scrollHeight: number;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: React.RefObject<ScrollView>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};
export declare function useTabbedHeaderList<ItemT, SectionT, T extends SectionList<ItemT, SectionT> = SectionList<ItemT, SectionT>>(props: TabbedHeaderListProps<ItemT, SectionT>): {
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
