
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @brooons/react-native-bluetooth-escpos-printer
import cn.jystudio.bluetooth.RNBluetoothEscposPrinterPackage;
// @heasy/react-native-sunmi-printer
import com.reactnativesunmiprinter.SunmiPrinterPackage;
// @invertase/react-native-apple-authentication
import com.RNAppleAuthentication.AppleAuthenticationAndroidPackage;
// @notifee/react-native
import io.invertase.notifee.NotifeePackage;
// @paytabs/react-native-paytabs
import com.paymentsdk.RNPaymentSDKLibraryPackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-clipboard/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/blur
import com.reactnativecommunity.blurview.BlurViewPackage;
// @react-native-community/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-google-signin/google-signin
import com.reactnativegooglesignin.RNGoogleSigninPackage;
// @react-native-picker/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// @react-native-voice/voice
import com.wenkesj.voice.VoicePackage;
// @stripe/stripe-react-native
import com.reactnativestripesdk.StripeSdkPackage;
// appcenter
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-background-actions
import com.asterinet.react.bgactions.BackgroundActionsPackage;
// react-native-code-push
import com.microsoft.codepush.react.CodePush;
// react-native-color-matrix-image-filters
import iyegoroff.RNColorMatrixImageFilters.ColorMatrixImageFiltersPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-date-picker
import com.henninghall.date_picker.DatePickerPackage;
// react-native-device-country
import com.reactnativedevicecountry.DeviceCountryPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-document-picker
import com.reactnativedocumentpicker.RNDocumentPickerPackage;
// react-native-exit-app
import com.github.wumke.RNExitApp.RNExitAppPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-geocoder
import com.devfd.RNGeocoder.RNGeocoderPackage;
// react-native-geolocation-service
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-google-places
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
// react-native-haptic-feedback
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localization
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-maps
import com.rnmaps.maps.MapsPackage;
// react-native-month-year-picker
import com.gusparis.monthpicker.RNMonthPickerPackage;
// react-native-otp-verify
import com.faizal.OtpVerify.OtpVerifyPackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-photo-view-ex
import io.amarcruz.photoview.PhotoViewPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-razorpay
import com.razorpay.rn.RazorpayPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-restart
import com.reactnativerestart.RestartPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-select-contact
import com.streem.selectcontact.SelectContactPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// rn-fetch-blob-v2
import com.RNFetchBlob.RNFetchBlobPackage;
// rn-zendesk
import aero.rbgroup.rnzendesk.RNZendeskPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new RNBluetoothEscposPrinterPackage(),
      new SunmiPrinterPackage(),
      new AppleAuthenticationAndroidPackage(),
      new NotifeePackage(),
      new RNPaymentSDKLibraryPackage(),
      new AsyncStoragePackage(),
      new ClipboardPackage(),
      new BlurViewPackage(),
      new RNCMaskedViewPackage(),
      new NetInfoPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new RNGoogleSigninPackage(),
      new RNCPickerPackage(),
      new VoicePackage(),
      new StripeSdkPackage(),
      new AppCenterReactNativePackage(getApplication()),
      new LottiePackage(),
      new BackgroundActionsPackage(),
      new CodePush(getResources().getString(com.orderapp.R.string.CodePushDeploymentKey), getApplicationContext(), com.orderapp.BuildConfig.DEBUG),
      new ColorMatrixImageFiltersPackage(),
      new ReactNativeContacts(),
      new DatePickerPackage(),
      new DeviceCountryPackage(),
      new RNDeviceInfo(),
      new RNDocumentPickerPackage(),
      new RNExitAppPackage(),
      new FastImageViewPackage(),
      new RNGeocoderPackage(),
      new RNFusedLocationPackage(),
      new RNGestureHandlerPackage(),
      new RNGooglePlacesPackage(),
      new RNReactNativeHapticFeedbackPackage(),
      new PickerPackage(),
      new LinearGradientPackage(),
      new ReactNativeLocalizationPackage(),
      new RNLocalizePackage(),
      new MapsPackage(),
      new RNMonthPickerPackage(),
      new OtpVerifyPackage(),
      new PagerViewPackage(),
      new RNPermissionsPackage(),
      new PhotoViewPackage(),
      new ReactNativePushNotificationPackage(),
      new RazorpayPackage(),
      new ReanimatedPackage(),
      new RestartPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new SelectContactPackage(),
      new RNSharePackage(),
      new SplashScreenReactPackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new RNCWebViewPackage(),
      new RNFetchBlobPackage(),
      new RNZendeskPackage()
    ));
  }
}
