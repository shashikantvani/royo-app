import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedColorProp } from '../SharedProps';
interface HeaderWrapperProps {
    backgroundColor?: AnimatedColorProp;
    backgroundImage?: ImageSourcePropType;
    contentBackgroundColor?: AnimatedColorProp;
    hasBorderRadius?: boolean;
    parallaxHeight: number;
    scrollHeight: number;
    scrollValue: Animated.SharedValue<number>;
    tabsContainerBackgroundColor?: AnimatedColorProp;
}
export declare const HeaderWrapper: React.FC<React.PropsWithChildren<HeaderWrapperProps>>;
export {};
