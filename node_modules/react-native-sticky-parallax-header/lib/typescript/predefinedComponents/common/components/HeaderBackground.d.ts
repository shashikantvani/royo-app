import * as React from 'react';
import Animated from 'react-native-reanimated';
import type { AnimatedColorProp } from '../SharedProps';
interface HeaderBackgroundProps {
    backgroundColor?: AnimatedColorProp;
    hasBorderRadius?: boolean;
    height: number;
    scrollValue: Animated.SharedValue<number>;
}
export declare const HeaderBackground: React.FC<HeaderBackgroundProps>;
export {};
