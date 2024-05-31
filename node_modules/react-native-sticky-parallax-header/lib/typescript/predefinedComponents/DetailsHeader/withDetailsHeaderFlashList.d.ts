import type { FlashList, FlashListProps } from '@shopify/flash-list';
import * as React from 'react';
import type { DetailsHeaderFlashListProps } from './DetailsHeaderProps';
export declare function withDetailsHeaderFlashList<ItemT>(flashListComponent: React.ComponentClass<FlashListProps<ItemT>>): React.ForwardRefExoticComponent<DetailsHeaderFlashListProps<ItemT> & React.RefAttributes<FlashList<ItemT>>>;
