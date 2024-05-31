import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';
interface Props {
    icon?: (() => React.ReactElement | null) | ImageSourcePropType;
}
declare const IconRenderer: React.FC<Props>;
export default IconRenderer;
