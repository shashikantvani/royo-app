import type Animated from 'react-native-reanimated';
import type { Tab } from '../../common/SharedProps';
import type { TabsProps } from '../components/Tabs';
export declare function useRenderTabs(tabsProps: Omit<TabsProps, 'tabs'> & {
    tabs?: Tab[];
    horizontalScrollValue: Animated.SharedValue<number>;
}): () => JSX.Element | null;
