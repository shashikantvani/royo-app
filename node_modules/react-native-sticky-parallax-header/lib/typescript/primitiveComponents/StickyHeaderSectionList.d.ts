import type { ReactElement, RefAttributes } from 'react';
import { SectionList } from 'react-native';
import type { StickyHeaderSectionListProps } from './StickyHeaderProps';
declare type StickyHeaderSectionListType = <ItemT, SectionT>(props: StickyHeaderSectionListProps<ItemT, SectionT> & RefAttributes<SectionList<ItemT, SectionT>>) => ReactElement;
export declare const StickyHeaderSectionList: StickyHeaderSectionListType;
export {};
