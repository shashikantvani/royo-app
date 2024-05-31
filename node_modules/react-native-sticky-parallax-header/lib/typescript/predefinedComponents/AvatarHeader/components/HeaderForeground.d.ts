import * as React from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
interface ForegroundProps {
    height: number;
    image?: ImageSourcePropType;
    scrollValue: Animated.SharedValue<number>;
    subtitle?: string;
    subtitleStyle?: StyleProp<Animated.AnimateStyle<TextStyle>>;
    subtitleTestID?: string;
    title?: string;
    titleStyle?: StyleProp<Animated.AnimateStyle<TextStyle>>;
    titleTestID?: string;
}
export declare const Foreground: React.FC<ForegroundProps>;
export {};
