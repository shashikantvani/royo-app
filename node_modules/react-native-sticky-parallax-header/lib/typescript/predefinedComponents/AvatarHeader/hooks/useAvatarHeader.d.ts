/// <reference types="react-native-reanimated" />
import * as React from 'react';
import type { ScrollComponent } from '../../common/SharedProps';
import type { AvatarHeaderScrollViewProps } from '../AvatarHeaderProps';
export declare function useAvatarHeader<T extends ScrollComponent>(props: AvatarHeaderScrollViewProps): {
    onMomentumScrollEnd: (e: import("react-native").NativeScrollEvent) => void;
    onScroll: (e: import("react-native").NativeScrollEvent) => void;
    onScrollEndDrag: (e: import("react-native").NativeScrollEvent) => void;
    parallaxHeight: number;
    renderHeader: () => JSX.Element;
    scrollValue: import("react-native-reanimated").SharedValue<number>;
    scrollViewRef: React.RefObject<T>;
};
