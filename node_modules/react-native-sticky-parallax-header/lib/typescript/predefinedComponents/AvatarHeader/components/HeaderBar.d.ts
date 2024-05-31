import * as React from 'react';
import type { ImageSourcePropType, StyleProp, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedColorProp, IconProps } from '../../common/SharedProps';
interface HeaderProps extends IconProps {
    backgroundColor?: AnimatedColorProp;
    enableSafeAreaTopInset?: boolean;
    height: number;
    image?: ImageSourcePropType;
    scrollValue: Animated.SharedValue<number>;
    title?: string;
    titleStyle?: StyleProp<Animated.AnimateStyle<TextStyle>>;
    titleTestID?: string;
}
export declare const HeaderBar: React.FC<HeaderProps>;
export {};
