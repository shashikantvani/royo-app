import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { useDarkMode } from 'react-native-dark-mode';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';

// import {
//   CardField,
//   createToken,
//   initStripe,
//   StripeProvider,
//   handleCardAction,
//   createPaymentMethod,
//   confirmPayment,
// } from '@stripe/stripe-react-native';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import Modal from 'react-native-modal';

export default function TipPaymentOptions({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const { appData, appStyle, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  const data = route?.params?.data;
  const userData = useSelector((state) => state?.auth?.userData);
  // console.log(selectedPaymentMethodHandler, 'selectedPaymentMethod');

  const [state, setState] = useState({
    isLoading: false,

    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
  });
  const {
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    updateState({ isLoading: true });
    getListOfPaymentMethod();
  }, []);

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/wallet',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        // console.log(res, 'allpayments gate');
        updateState({ isLoading: false, payementMethods: res?.data });
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false });
    showError(error?.message || error?.error);
  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    // console.log(res2, 'cardInfo');
    if (res2) {
      await createPaymentMethod({
        type: 'Card',
        card: cardInfo,
        token: res2
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          // console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
          } else {
            // console.log(res, 'success_createPaymentMethod ');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  action: 'tip',
                  amount: data?.selectedTipAmount,
                  payment_method_id: res?.paymentMethod?.id,
                  order_number: data?.order_number,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then(async (res) => {
                // console.log(res, 'getStripePaymentIntent response');
                if (res && res?.client_secret) {
                  const { paymentIntent, error } = await handleCardAction(
                    res?.client_secret,
                  );
                  if (paymentIntent) {
                    // console.log(data?.order_number, 'paymentIntent');
                    if (paymentIntent) {
                      actions
                        .confirmPaymentIntentStripe(
                          {
                            payment_option_id: selectedPaymentMethod?.id,
                            action: 'tip',
                            tip_amount: data?.selectedTipAmount,
                            payment_intent_id: paymentIntent?.id,
                            order_number: data?.order_number,
                          },
                          {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                          },
                        )
                        .then((res) => {
                          updateState({ isLoading: false });
                          if (res && res?.status == 'Success' && res?.data) {
                            Alert.alert('', strings.PAYMENT_SUCCESS, [
                              {
                                text: strings.OK,
                                onPress: () => console.log('Cancel Pressed'),
                              },
                            ]);
                            navigation.navigate(navigationStrings.ORDER_DETAIL);
                          }
                        })
                        .catch((error) => console.log(error, 'errrorrrer'));
                    }
                  } else {
                    updateState({ isLoading: false });
                    // console.log(error, 'error');
                    showError(error?.message || 'payment failed');
                  }
                } else {
                  updateState({ isLoadingB: false });
                }
              })
              .catch(errorMethod);
          }
        })
        .catch(errorMethod);
    }
  };

  const openPayTabs = async (data) => {
    data['serverKey'] = appData?.profile?.preferences?.paytab_server_key;
    data['clientKey'] = appData?.profile?.preferences?.paytab_client_key;
    data['profileID'] = appData?.profile?.preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;
    // console.log('openPayTabsdata', data);

    try {
      const res = await payWithCard(data);
      // console.log('payWithCard res++++', res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          order_number: data?.order_number,
          action: 'tip',
        };

        // console.log(apiData, 'apiData');
        actions
          .openPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            // console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              navigation.goBack();
            }
          })
          .catch(errorMethod);
      }
    } catch (error) {
      // console.log('error raised', error);
    }
  };

  //flutter wave
  var redirectTimeout;
  const handleOnRedirect = (data) => {
    // console.log('flutterwaveresponse', data);
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      // do something with the result
      updateState({ isModalVisibleForPayFlutterWave: false });
    }, 200);
    try {
      if (data && data?.transaction_id) {
        let apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          order_number: paymentDataFlutterWave?.order_number,
          action: 'tip',
        };

        // console.log(apiData, 'apiData');
        actions
          .openSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            },
          )
          .then((res) => {
            // console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              navigation.goBack();
            } else {
              redirectTimeout = setTimeout(() => {
                // do something with the result
                updateState({ isModalVisibleForPayFlutterWave: false });
              }, 200);
            }
          })
          .catch(errorMethod);
      } else {
        redirectTimeout = setTimeout(() => {
          // do something with the result
          updateState({ isModalVisibleForPayFlutterWave: false });
        }, 200);
      }
    } catch (error) {
      // console.log('error raised', error);
      redirectTimeout = setTimeout(() => {
        // do something with the result
        updateState({ isModalVisibleForPayFlutterWave: false });
      }, 200);
    }
  };
  //flutter wave

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          updateState({ isLoading: true });
          await createToken({ ...cardInfo, type: 'Card' })
            .then((res) => {
              if (res && res?.token && res.token?.id) {
                _createPaymentMethod(cardInfo, res.token?.id);
                // updateState({isLoading: false});
                // actions
                //   .tipAfterOrder(
                //     {
                //       tip_amount: data?.selectedTipAmount,
                //       order_number: data?.order_number,
                //       transaction_id: res.token?.id,
                //     },
                //     {
                //       code: appData?.profile?.code,
                //       currency: currencies?.primary_currency?.id,
                //       language: languages?.primary_language?.id,
                //     },
                //   )
                //   .then((res) => {
                //     updateState({isLoading: false});
                //     if (res && res?.status == 'Success' && res?.data) {
                //       Alert.alert('', strings.PAYMENT_SUCCESS, [
                //         {
                //           text: strings.OK,
                //           onPress: () => console.log('Cancel Pressed'),
                //         },
                //       ]);
                //       navigation.navigate(navigationStrings.ORDER_DETAIL);
                //     }
                //   })
                //   .catch(errorMethod);
              } else {
                updateState({ isLoading: false });
              }
            })
            .catch((err) => {
              updateState({ isLoading: false });
              errorMethod;
            });
        } else {
          updateState({ isLoading: false });
          showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        if (selectedPaymentMethod?.id == 27) {
          let paymentData = {
            payment_option_id: selectedPaymentMethod?.id,
            total_payable_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
          };
          setTimeout(() => {
            openPayTabs(paymentData);
          }, 500);
        } else if (selectedPaymentMethod?.id == 30) {
          let paymentData = {
            payment_option_id: selectedPaymentMethod?.id,
            total_payable_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
            selectedPayment: selectedPaymentMethod,
          };
          updateState({
            isModalVisibleForPayFlutterWave: true,
            paymentDataFlutterWave: paymentData,
          });
        } else {
          setTimeout(() => {
            updateState({ isLoading: false });
            _webPayment(selectedPaymentMethod);
          }, 1000);
        }
      }
    } else {
      showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? updateState({ selectedPaymentMethod: null })
        : updateState({ selectedPaymentMethod: data });
    }
  };

  const _checkoutPayment = (token) => {
    // console.log(token, 'tokenOfCheckout');

    let selectedMethod = selectedPaymentMethod.code.toLowerCase();
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${data?.selectedTipAmount}&payment_option_id=${selectedPaymentMethod?.id}&token=${token}&order_number=${data?.order_number}&action=tip`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        // console.log(res, 'responseFromServer');
        updateState({ isLoading: false, isRefreshing: false });
        if (res && res?.status == 'Success' && res?.data) {
          Alert.alert('', strings.PAYMENT_SUCCESS, [
            {
              text: strings.OK,
              onPress: () => console.log('Cancel Pressed'),
              // style: 'destructive',
            },
          ]);
          navigation.navigate(navigationStrings.ORDER_DETAIL);
        }
      })
      .catch(errorMethod);
  };

  const _renderItemPayments = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[styles.caseOnDeliveryView]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <Text
            style={
              isDarkMode
                ? [styles.caseOnDeliveryText, { color: MyDarkTheme.colors.text }]
                : styles.caseOnDeliveryText
            }>
            {item?.title_lng ? item?.title_lng : item?.title}
          </Text>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id == 4
        ) && (
            <View>
              {/* <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: colors.white,
                  textColor: colors.black,
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                  _onChangeStripeData(cardDetails);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              /> */}
              <></>
            </View>
          )}
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17
        ) && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={(e) => {
                setTimeout(() => {
                  updateState({ isLoading: false });
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={(res) => {
                updateState({
                  isLoading: true,
                });
              }}
              btnTitle={strings.SELECT}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(45),
              }}
            />
          )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: {
          brand: cardDetails.brand,
          complete: true,
          expiryMonth: cardDetails?.expiryMonth,
          expiryYear: cardDetails?.expiryYear,
          last4: cardDetails?.last4,
          postalCode: cardDetails?.postalCode,
        },
      });
    } else {
      updateState({ cardInfo: null });
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;

    updateState({ isLoading: true });
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${data?.selectedTipAmount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&order_number=${data?.order_number}&action=tip`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({ isLoading: false });
        if (
          res &&
          res?.status == 'Success' &&
          (res?.data || res?.payment_link)
        ) {
          // console.log('generate payment url', res.data);
          let sendingData = {
            id: selectedPaymentMethod?.id,
            title: selectedPaymentMethod?.title,
            screenName: navigationStrings.ORDER_DETAIL,
            paymentUrl: res.data || res?.payment_link,
            action: 'tip',
            tip_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
          };
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
          // navigation.navigate(navigationStrings.WEBPAYMENTS, {
          //   paymentUrl: res?.data,
          //   paymentTitle: selectedPaymentMethod?.title,
          //   redirectFrom: 'tip',
          // tip_amount: data?.selectedTipAmount,
          // order_number: data?.order_number,
          // });
        }
      })
      .catch(errorMethod);
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.backgroundGrey }
        }
      />
      <View style={{ height: 1, backgroundColor: colors.borderLight }} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: moderateScaleVertical(20) }}>
        <FlatList
          data={payementMethods}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          // horizontal
          style={{ marginTop: moderateScaleVertical(10) }}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItemPayments}
          ListEmptyComponent={() =>
            !isLoading && (
              <Text style={{ textAlign: 'center' }}>
                {strings.NO_PAYMENT_METHOD}
              </Text>
            )
          }
        />
      </KeyboardAwareScrollView>
      {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginBottom: 65,
          }}>
          <GradientButton
            textStyle={styles.textStyle}
            onPress={selectPaymentOption}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SELECT}
          />
        </View>
      ) : (
        <></>
      )}
      <Modal
        onBackdropPress={() =>
          updateState({ isModalVisibleForPayFlutterWave: false })
        }
        isVisible={isModalVisibleForPayFlutterWave}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          // marginBottom: 20,
        }}>
        <View
          style={{
            padding: moderateScale(20),
            backgroundColor: colors?.white,
            height: height / 8,
            justifyContent: 'flex-end',
          }}>
          <PayWithFlutterwave
            onAbort={() =>
              updateState({ isModalVisibleForPayFlutterWave: false })
            }
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: generateTransactionRef(10),
              authorization:
                appData?.profile?.preferences?.flutterwave_public_key,
              customer: {
                email: userData?.email,
                name: userData?.name,
              },
              amount: paymentDataFlutterWave?.total_payable_amount,
              currency: currencies?.primary_currency?.iso_code,
              payment_options: 'card',
            }}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
}
