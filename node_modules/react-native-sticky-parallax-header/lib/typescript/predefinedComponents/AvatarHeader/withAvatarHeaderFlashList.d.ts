import type { FlashList, FlashListProps } from '@shopify/flash-list';
import * as React from 'react';
import type { AvatarHeaderFlashListProps } from './AvatarHeaderProps';
export declare function withAvatarHeaderFlashList<ItemT>(flashListComponent: React.ComponentClass<FlashListProps<ItemT>>): React.ForwardRefExoticComponent<AvatarHeaderFlashListProps<ItemT> & React.RefAttributes<FlashList<ItemT>>>;
