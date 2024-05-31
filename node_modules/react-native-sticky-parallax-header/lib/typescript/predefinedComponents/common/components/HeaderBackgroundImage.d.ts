import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
interface HeaderBackgroundImageProps {
    background: React.ReactNode;
    backgroundHeight: number;
    backgroundImage: ImageSourcePropType;
}
export declare const HeaderBackgroundImage: React.FC<HeaderBackgroundImageProps>;
export {};
