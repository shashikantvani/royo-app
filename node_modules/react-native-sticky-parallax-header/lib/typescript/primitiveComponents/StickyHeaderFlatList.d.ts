import type { ReactElement, RefAttributes } from 'react';
import { FlatList } from 'react-native';
import type { StickyHeaderFlatListProps } from './StickyHeaderProps';
declare type StickyHeaderFlatListType = <ItemT>(props: StickyHeaderFlatListProps<ItemT> & RefAttributes<FlatList<ItemT>>) => ReactElement;
export declare const StickyHeaderFlatList: StickyHeaderFlatListType;
export {};
