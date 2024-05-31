import * as React from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
interface ForegroundProps {
    foregroundImage?: ImageSourcePropType;
    height: number;
    scrollValue: Animated.SharedValue<number>;
    title?: string;
    titleStyle?: StyleProp<Animated.AnimateStyle<TextStyle>>;
    titleTestID?: string;
}
export declare const Foreground: React.FC<ForegroundProps>;
export {};
