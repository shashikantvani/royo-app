import type { StyleProp } from 'react-native';
/**
 * helper hook returning correct styles in rtl mode for Android and other platforms
 *
 * for some weird reason, padding/margin start/end does not work on Android
 *
 * example:
 *
 * const style = useRTLStyles<ViewStyle>({ paddingLeft: 5 }, { paddingRight: 5 }, { paddingStart: 5 })
 */
export declare function useRTLStyles<T>(ltrStyle: StyleProp<T>, rtlStyle: StyleProp<T>, defaultStyle: StyleProp<T>): StyleProp<T>;
