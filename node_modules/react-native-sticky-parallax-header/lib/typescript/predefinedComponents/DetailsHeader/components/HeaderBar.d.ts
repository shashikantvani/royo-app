import * as React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedColorProp, IconProps } from '../../common/SharedProps';
interface HeaderBarProps extends IconProps {
    backgroundColor?: AnimatedColorProp;
    enableSafeAreaTopInset?: boolean;
    headerTitleContainerAnimatedStyle: {
        opacity: number;
    };
    title?: string;
    titleStyle?: StyleProp<Animated.AnimateStyle<TextStyle>>;
    titleTestID?: string;
}
export declare const HeaderBar: React.FC<HeaderBarProps>;
export {};
