import * as React from 'react';
import type { SectionList } from 'react-native';
import type { TabbedHeaderListProps } from './TabbedHeaderProps';
declare type TabbedHeaderListType = <ItemT, SectionT>(props: TabbedHeaderListProps<ItemT, SectionT> & React.RefAttributes<SectionList<ItemT>>) => React.ReactElement;
export declare const TabbedHeaderList: TabbedHeaderListType;
export {};
