/// <reference types="react-native-reanimated" />
import * as React from 'react';
import type { ScrollComponent } from '../../common/SharedProps';
import type { DetailsHeaderScrollViewProps } from '../DetailsHeaderProps';
export declare function useDetailsHeader<T extends ScrollComponent>(props: DetailsHeaderScrollViewProps): {
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
