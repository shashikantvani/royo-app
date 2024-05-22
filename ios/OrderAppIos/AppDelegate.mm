#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
// #import <FBSDKCoreKit/FBSDKCoreKit.h>
// #import <TwitterKit/TWTRKit.h>
// #import "RNSplashScreen.h"  
// #import <React/RCTLinkingManager.h> //deeplinking
// #import <Firebase.h>
// #import <UserNotifications/UserNotifications.h>
// #import <RNCPushNotificationIOS.h>
// #import <GoogleMaps/GoogleMaps.h>
// #import <CodePush/CodePush.h>
// @import GooglePlaces;
// @import GoogleMaps;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"OrderAppIos";
//  if ([FIRApp defaultApp] == nil) {
//     [FIRApp configure];
//   }
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
