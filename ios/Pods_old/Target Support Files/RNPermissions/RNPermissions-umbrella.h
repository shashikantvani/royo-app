#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "RNPermissions.h"
#import "RNPermissionHandlerLocationAlways.h"
#import "RNPermissionHandlerLocationWhenInUse.h"
#import "RNPermissionHandlerContacts.h"
#import "RNPermissionHandlerLocationAccuracy.h"

FOUNDATION_EXPORT double RNPermissionsVersionNumber;
FOUNDATION_EXPORT const unsigned char RNPermissionsVersionString[];

