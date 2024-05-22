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

#import "RNZendesk-Bridging-Header.h"
#import "RNZendeskBridge.h"

FOUNDATION_EXPORT double rn_zendeskVersionNumber;
FOUNDATION_EXPORT const unsigned char rn_zendeskVersionString[];

