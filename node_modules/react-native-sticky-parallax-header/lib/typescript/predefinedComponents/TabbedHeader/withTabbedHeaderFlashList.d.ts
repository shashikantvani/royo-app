import type { FlashList, FlashListProps } from '@shopify/flash-list';
import * as React from 'react';
import type { TabbedHeaderFlashListProps } from './TabbedHeaderProps';
export declare function withTabbedHeaderFlashList<ItemT>(flashListComponent: React.ComponentClass<FlashListProps<ItemT>>): React.ForwardRefExoticComponent<TabbedHeaderFlashListProps<ItemT> & React.RefAttributes<FlashList<ItemT>>>;
