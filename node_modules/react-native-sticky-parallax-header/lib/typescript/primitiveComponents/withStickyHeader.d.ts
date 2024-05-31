import * as React from 'react';
import Animated from 'react-native-reanimated';
import type { StickyHeaderSharedProps } from './StickyHeaderProps';
export declare function withStickyHeader<T extends React.ComponentClass<any>>(component: T): React.FC<StickyHeaderSharedProps & (React.ComponentPropsWithRef<T> extends infer T_1 ? { [K in keyof T_1]: React.ComponentPropsWithRef<T>[K] | Animated.Node<React.ComponentPropsWithRef<T>[K]>; } : never) & {
    style?: import("react-native").StyleProp<Animated.AnimateStyle<Animated.StylesOrDefault<React.ComponentPropsWithRef<T>>>>;
} & {
    animatedProps?: Partial<Animated.AnimateProps<React.ComponentPropsWithRef<T>>> | undefined;
    layout?: import("react-native-reanimated").BaseAnimationBuilder | import("react-native-reanimated").LayoutAnimationFunction | typeof import("react-native-reanimated").BaseAnimationBuilder | undefined;
    entering?: import("react-native-reanimated").BaseAnimationBuilder | typeof import("react-native-reanimated").BaseAnimationBuilder | import("react-native-reanimated").EntryExitAnimationFunction | import("react-native-reanimated").Keyframe | undefined;
    exiting?: import("react-native-reanimated").BaseAnimationBuilder | typeof import("react-native-reanimated").BaseAnimationBuilder | import("react-native-reanimated").EntryExitAnimationFunction | import("react-native-reanimated").Keyframe | undefined;
}>;
export declare const styles: {
    container: {
        alignSelf: "stretch";
        flex: number;
        overflow: "hidden";
    };
    header: {
        position: "absolute";
        left: number;
        right: number;
        zIndex: number;
    };
};
