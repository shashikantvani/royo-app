import * as React from 'react';
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedColorProp } from '../../common/SharedProps';
interface HeaderBarProps {
    backgroundColor?: AnimatedColorProp;
    enableSafeAreaTopInset?: boolean;
    logo: ImageSourcePropType;
    logoContainerStyle?: StyleProp<Animated.AnimateStyle<ViewStyle>>;
    logoResizeMode?: ImageResizeMode;
    logoStyle?: StyleProp<Animated.AnimateStyle<ImageStyle>>;
}
export declare const HeaderBar: React.FC<HeaderBarProps>;
export {};
