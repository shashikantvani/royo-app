import * as React from 'react';
import type { FlatList } from 'react-native';
import type { DetailsHeaderFlatListProps } from './DetailsHeaderProps';
declare type DetailsHeaderFlatListType = <ItemT>(props: DetailsHeaderFlatListProps<ItemT> & React.RefAttributes<FlatList<ItemT>>) => React.ReactElement;
export declare const DetailsHeaderFlatList: DetailsHeaderFlatListType;
export {};
