import {useFocusEffect} from '@react-navigation/native';
import React, {createRef, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../Components/Modal';
import SubscriptionComponent2 from '../../Components/SubscriptionComponent2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {generateTransactionRef, payWithCard} from '../../utils/paystackMethod';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import Modal from 'react-native-modal';
// import SubscriptionComponent from '../../Components/SubscriptionComponent';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptySubscriptions from './ListEmptySubscriptions';
import stylesFun from './styles';
import {
  CardField,
  createToken,
  initStripe,
  StripeProvider,
  handleCardAction,
  createPaymentMethod,
  confirmPayment,
} from '@stripe/stripe-react-native';
export default function Subscriptions2({navigation, route}) {
  //   console.log(route, 'route>>>');
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const [state, setState] = useState({
    isLoading: false,
    isLoadingB: false,
    allSubscriptions: [],
    isRefreshing: false,
    limit: 12,
    currentSubscription: null,
    clientCurrency,
    isModalVisibleForPayment: false,
    selectedPlan: null,
    paymentOptions: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    planPrice: 0,
    paymentDataFlutterWave: null,
    isModalVisibleForPayFlutterWave: false,
  });

  const {
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    allSubscriptions,
    isRefreshing,
    isLoading,
    isLoadingB,
    clientCurrency,
    currentSubscription,
    isModalVisibleForPayment,
    selectedPlan,
    paymentOptions,
    selectedPaymentMethod,
    cardInfo,
    planPrice,
  } = state;
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {preferences} = appData?.profile;
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const explosion = createRef();

  useFocusEffect(
    React.useCallback(() => {
      updateState({isLoadingB: true});
      getAllSubscriptions();
      console.log(explosion, 'explosion---');
    }, []),
  );

  // useEffect(() => {
  //   updateState({isLoadingB: true});
  //   getAllSubscriptions();
  //   console.log(explosion, 'explosion');
  // }, []);

  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: preferences?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
      });
    }
  }, []);

  //Get list of all payment method
  const getAllSubscriptions = (showSuccess) => {
    
    actions
      .getAllSubscriptions(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('Get all subscription plans', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          allSubscriptions: res?.data?.all_plans,
          currentSubscription: res?.data?.subscription,
        });
      })
      .catch(errorMethod);
  };

  //Subscribe for specific plan
  const selectSpecificSubscriptionPlan = (item) => {
    console.log(item, '>>>>>>>>>>>>>selectSpecificSubscriptionPlan');
    updateState({isLoading: true, planPrice: 120.0});
    actions
      .selectSpecificSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        if (res && res.status == 'Success') {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: true,
            selectedPlan: res?.data?.sub_plan,
            paymentOptions: res?.data?.payment_options
              ? res?.data?.payment_options
              : [],
          });
        } else {
          showError(res?.message);
          updateState({
            isLoadingB: false,
            isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //cancel subscription
  const cancelSubscription = (item) => {
    console.log(item, 'item>>selectSpecificSubscriptionPlan');
    updateState({isLoading: true});
    actions
      .cancelSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };
  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const renderProduct = ({item, index}) => {
    // const {isSelectItem} = state;
    // if (item?.id == currentSubscription?.subscription_id) {
    //   return null;
    // }

    return (
      <View>
        {!!(index == 0) && (
          <View
            style={{
              marginTop: currentSubscription ? moderateScale(40) : null,
              marginBottom: moderateScale(20),
            }}>
            <Text style={styles.subscriptionTitle}>
              {currentSubscription
                ? strings.OTHERSUBSCRIPTION
                : strings.ALLSUBSCRIPTION}
            </Text>
          </View>
        )}
        <SubscriptionComponent2
          data={item}
          clientCurrency={clientCurrency}
          onPress={(item) => selectSpecificSubscriptionPlan(item)}
          payNowUpcoming={() =>
            selectSpecificSubscriptionPlan(currentSubscription?.plan)
          }
          subscriptionData={currentSubscription}
          currentSubscription={item?.id == currentSubscription?.subscription_id}
          cancelSubscription={() => cancelSubscription(item)}
        />
      </View>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  //Pull to refresh
  const handleRefresh = () => {
    updateState({isRefreshing: true});
    getAllSubscriptions();
  };

  const topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(20),
        }}>
        <Text style={styles.subscription2}>{strings.SUBSCRIPTION2}</Text>
        <TouchableOpacity
          onPress={() => updateState({isModalVisibleForPayment: false})}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
      </View>
    );
  };

  const _selectPaymentMethod = (item) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == item?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: item});
    }
  };

  const _onChangeStripeData = (cardDetails) => {
    console.log(cardDetails, '_onChangeStripeData>');
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  const _checkoutPayment = (token) => {
    console.log(token, 'tokentokentokentoken');
    let selectedMethod = selectedPaymentMethod.code.toLowerCase();
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${planPrice}&token=${token}&subscription_id=${selectedPlan?.slug}&payment_option_id=${selectedPaymentMethod?.id}&action=subscription`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'responseFromServer');
        getAllSubscriptions(true);
        if (res && res?.status == 'Success' && res?.data) {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: false,
            isRefreshing: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //render pyaments icons
  const _renderItemPayments = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={() => _selectPaymentMethod(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(5),
            }}>
            <FastImage
              source={
                selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                  ? imagePath.radioActive
                  : imagePath.radioInActive
              }
            />
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedPaymentMethod &&
                    selectedPaymentMethod?.id == item.id
                      ? colors.blackC
                      : colors.textGreyJ,
                  marginLeft: moderateScale(5),
                },
              ]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item?.id &&
          selectedPaymentMethod?.id == 4 && (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                  // console.log('cardDetails', cardDetails);
                  _onChangeStripeData(cardDetails);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
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
                updateState({isLoading: false});
                showError(strings.INVALID_CARD_DETAILS);
              }, 1000);
            }}
            onPressSubmit={(res) => {
              updateState({
                isModalVisibleForPayment: false,
              });
              setTimeout(() => {
                updateState({
                  isLoading: true,
                });
              }, 500);
            }}
            isSubmitBtn={selectedPaymentMethod?.id == 17 ? true : false}
            btnTitle={strings.PAY}
            submitBtnStyle={{
              width: width / 3,
              marginTop: 0,
              height: moderateScale(45),
              borderRadius: 5,
            }}
            renderCustomLeft={renderCustomLeft}
            btnsMainView={{
              marginTop: moderateScale(10),
            }}
            mainContainer={{
              paddingHorizontal: 0,
            }}
          />
        )}
      </>
    );
  };

  const renderCustomLeft = () => {
    return (
      <GradientButton
        colorsArray={[themeColors.primary_color, themeColors.primary_color]}
        textStyle={styles.textStyle}
        onPress={() => updateState({isModalVisibleForPayment: false})}
        borderRadius={moderateScale(5)}
        containerStyle={{
          marginHorizontal: moderateScale(10),
          width: paymentOptions.length ? width / 3 : width - 60,
        }}
        btnText={strings.CANCEL}
      />
    );
  };

  console.log(isLoading, 'isLoadingisLoadingisLoading');
  //Modal main component
  const modalMainContent = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}>
          <Text style={styles.title}>{selectedPlan?.title}</Text>
          <Text
            style={[
              styles.title2,
              {marginTop: moderateScale(10)},
            ]}>{`${selectedPlan?.price}/${selectedPlan?.frequency}`}</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.title}>{strings.FEATURED_INCLUDED}</Text>

          <View
            style={{
              flexDirection: 'row',
              //   marginHorizontal: moderateScale(10),
              marginTop: moderateScale(10),
              alignItems: 'center',
            }}>
            <Image source={imagePath.tick2} />
            <Text
              style={[
                styles.title2,
                {marginLeft: moderateScale(10)},
              ]}>{`${selectedPlan?.features[0]}`}</Text>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: colors.textGreyJ,
            marginTop: moderateScale(10),
          }}
        />

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <View>
            <Text style={styles.title}>{strings.DEBIT_FROM}</Text>
          </View>
          <View>
            <FlatList
              data={paymentOptions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{marginTop: moderateScaleVertical(10)}}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListEmptyComponent={() => (
                <Text style={{textAlign: 'center'}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
            />
          </View>
        </View>
      </>
    );
  };

  const openPayTabs = async (data) => {
    data['serverKey'] = appData?.profile?.preferences?.paytab_server_key;
    data['clientKey'] = appData?.profile?.preferences?.paytab_client_key;
    data['profileID'] = appData?.profile?.preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;
    console.log('openPayTabsdata', data);
    try {
      const res = await payWithCard(data);
      console.log('payWithCard res++++', res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: 'subscription',
          subscription_id: selectedPlan?.slug,
        };

        console.log(apiData, 'apiData');
        actions
          .openPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              // navigation.goBack()
              getAllSubscriptions(true);
            }
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('error raised', error);
    }
  };

  //flutter wave
  var redirectTimeout;
  const handleOnRedirect = (data) => {
    console.log('flutterwaveresponse', data);
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      // do something with the result
      updateState({isModalVisibleForPayFlutterWave: false});
    }, 200);
    try {
      if (data && data?.transaction_id) {
        let apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          action: 'subscription',
          subscription_id: selectedPlan?.slug,
        };

        console.log(apiData, 'apiData');
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
            console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              getAllSubscriptions(true);
            } else {
              redirectTimeout = setTimeout(() => {
                // do something with the result
                updateState({isModalVisibleForPayFlutterWave: false});
              }, 200);
            }
          })
          .catch(errorMethod);
      } else {
        redirectTimeout = setTimeout(() => {
          // do something with the result
          updateState({isModalVisibleForPayFlutterWave: false});
        }, 200);
      }
    } catch (error) {
      console.log('error raised', error);
      redirectTimeout = setTimeout(() => {
        // do something with the result
        updateState({isModalVisibleForPayFlutterWave: false});
      }, 200);
    }
  };
  //flutter wave

  const payAmount = () => {
    updateState({isModalVisibleForPayment: false});
    if (!!selectedPaymentMethod) {
      if (selectedPaymentMethod?.id == 4) {
        console.log(selectedPaymentMethod?.id, 'selectedPaymentMethod?.id');

        _offineLinePayment();
        return;
      } else if (selectedPaymentMethod?.id == 27) {
        let paymentData = {
          payment_option_id: selectedPaymentMethod?.id,
          total_payable_amount: planPrice,
        };
        setTimeout(() => {
          openPayTabs(paymentData);
        }, 500);
      } else if (selectedPaymentMethod?.id == 30) {
        let paymentData = {
          payment_option_id: selectedPaymentMethod?.id,
          total_payable_amount: planPrice,
          selectedPayment: selectedPaymentMethod,
        };
        setTimeout(() => {
          updateState({
            isModalVisibleForPayFlutterWave: true,
            paymentDataFlutterWave: paymentData,
          });
        }, 1000);
      } else {
        _webPayment();
      }
    } else {
      alert(strings.PLEASE_SELECT_PAYMENT_METHOD);
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod?.code?.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/subscription`;
    let queryData = `/${selectedMethod}?amount=${planPrice}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&subscription_id=${selectedPlan?.slug}&payment_option_id=${selectedPaymentMethod?.id}&action=subscription`;
    updateState({isLoading: true});
    console.log('query data', queryData);
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoading: false});
        if (
          res &&
          res?.status == 'Success' &&
          (res?.data || res?.payment_link)
        ) {
          console.log('generate payment url', res.data);
          let sendingData = {
            id: selectedPaymentMethod.id,
            title: selectedPaymentMethod.title,
            screenName: navigationStrings.SUBSCRIPTION,
            paymentUrl: res.data || res?.payment_link,
            action: 'subscription',
            selectedPlanSlug: selectedPlan?.slug,
          };
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
          // navigation.navigate(navigationStrings.WEBPAYMENTS, {
          //   paymentUrl: res?.data,
          //   paymentTitle: selectedPaymentMethod?.title,
          //   redirectFrom: 'subscription',
          //   selectedPaymentMethod: selectedPaymentMethod,
          // selectedPlanSlug: selectedPlan?.slug
          // });
        }
      })
      .catch(errorMethod);
  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    console.log(cardInfo, res2, 'cardInfo');
    if (res2) {
      await createPaymentMethod({
        type: 'Card',
        token: res2,
        card: cardInfo,
        billing_details: {
          name: 'Jenny Rosen',
        },
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
            updateState({isLoading: false});
          } else {
            console.log(res, 'success_createPaymentMethod ');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  amount: selectedPlan?.price,
                  payment_method_id: res?.paymentMethod?.id,
                  action: 'subscription',
                  subscription_slug: selectedPlan?.slug,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then(async (res) => {
                console.log(res, 'getStripePaymentIntent response');
                if (res && res?.client_secret) {
                  const {paymentIntent, error} = await handleCardAction(
                    res?.client_secret,
                  );

                  console.log(paymentIntent, 'paymentIntent');
                  if (paymentIntent) {
                    actions
                      .confirmPaymentIntentStripe(
                        {
                          payment_option_id: selectedPaymentMethod?.id,
                          action: 'subscription',
                          amount: selectedPlan?.price,
                          payment_intent_id: paymentIntent?.id,
                          subscription_slug: selectedPlan?.slug,
                        },
                        {
                          code: appData?.profile?.code,
                          currency: currencies?.primary_currency?.id,
                          language: languages?.primary_language?.id,
                        },
                      )
                      .then((res) => {
                        console.log(
                          res,
                          'confirmPaymentIntentStripe api reponse',
                        );
                        if (res) {
                          getAllSubscriptions(true);
                          updateState({
                            isLoadingB: false,
                            isLoading: false,
                            isRefreshing: false,
                          });
                          // navigation.navigate(navigationStrings.WALLET);
                        }
                      })
                      .catch(errorMethod);
                  } else {
                    console.log(error, 'error');
                    showError(error?.message || 'payment failed');
                  }
                } else {
                  updateState({isLoadingB: false, isLoading: false});
                }
              })
              .catch(errorMethod);
          }
        })
        .catch(errorMethod);
    }
  };

  //Offline payments
  const _offineLinePayment = async () => {
    console.log(cardInfo, 'cardInfocardInfocardInfo+++++++');

    if (cardInfo) {
      //  updateState({isModalVisibleForPayment: false});

      await createToken({...cardInfo, type: 'Card'})
        .then((res) => {
          console.log(res, 'res>');
          console.log(selectedPlan, 'selectedPlan>');
          updateState({isLoading: true});
          if (res && res?.token && res.token?.id) {
            console.log(res.token, 'i am here');
            _createPaymentMethod(cardInfo, res.token?.id);
          }

          // if (res && res?.token && res.token?.id) {
          //   updateState({isLoading: true});
          //   let selectedMethod = selectedPaymentMethod.title.toLowerCase();
          //   actions
          //     .purchaseSubscriptionPlan(
          //       `/${selectedPlan?.slug}`,
          //       {
          //         payment_option_id: selectedPaymentMethod?.id,
          //         transaction_id: res?.token?.id,
          //         // amount: selectedPlan?.id,
          //       },
          //       {
          //         code: appData?.profile?.code,
          //         currency: currencies?.primary_currency?.id,
          //         language: languages?.primary_language?.id,
          //       },
          //     )
          //     .then((res) => {
          //       getAllSubscriptions(true);
          //       updateState({
          //         isLoadingB: false,
          //         isLoading: false,
          //         isRefreshing: false,
          //       });
          //     })
          //     .catch(errorMethod);
          // } else {
          //   if (res && res?.error) {
          //     updateState({
          //       isLoadingB: false,
          //       isLoading: false,
          //       isRefreshing: false,
          //     });
          //     showError(res?.error?.message);
          //   }
          // }
        })
        .catch((err) => {
          console.log(err, 'errerrerr');
          updateState({isLoadingB: false});
        });
    } else {
      updateState({isLoading: false});
    }
  };

  const modalBottomContent = () => {
    return (
      <>
        {selectedPaymentMethod?.id != 17 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: moderateScale(10),
              
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={() => updateState({isModalVisibleForPayment: false})}
              borderRadius={moderateScale(5)}
              containerStyle={{
                marginHorizontal: moderateScale(10),
                width: paymentOptions.length ? width / 3 : width-moderateScale(100),
              }}
              btnText={strings.CANCEL}
            />
            {paymentOptions.length ? (
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                onPress={payAmount}
                borderRadius={moderateScale(5)}
                containerStyle={{
                  marginHorizontal: moderateScale(10),
                  width: width / 3,
                }}
                btnText={strings.PAY}
              />
            ) : null}
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const _payNowUpcoming = () => {
    console.log(currentSubscription, 'currentSubscription');
    updateState({isLoading: true});
    actions
      .cancelSubscriptionPlan(
        `/${currentSubscription?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };

  const listHeaderComponent = () => {
    return (
      <>
        {!!currentSubscription && (
          <>
            <View style={{marginVertical: moderateScale(10)}}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.subscriptionTitle,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.subscriptionTitle
                }>
                {strings.MYSUBSCRIPTION}
              </Text>
            </View>
            <SubscriptionComponent2
              data={currentSubscription?.plan}
              subscriptionData={currentSubscription}
              clientCurrency={clientCurrency}
              allSubscriptions={allSubscriptions}
              currentSubscription={true}
              payNowUpcoming={() =>
                selectSpecificSubscriptionPlan(currentSubscription?.plan)
              }
              cancelSubscription={() => cancelSubscription(currentSubscription)}
            />
          </>
        )}
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.SUBSCRIPTION}
        textStyle={{fontSize: textScale(14)}}
      />
      <StripeProvider
        publishableKey={preferences?.stripe_publishable_key}
        merchantIdentifier="merchant.identifier">
        <View
          style={{
            flex: 1,
            marginHorizontal: moderateScale(10),
          }}>
          <FlatList
            data={(!isLoadingB && allSubscriptions) || []}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent()}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 7}} />}
            refreshing={isRefreshing}
            //   getItemLayout={getItemLayout}
            // style={{flex:1}}
            contentContainerStyle={{flexGrow: 1}}
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            ListFooterComponent={() => (
              <View style={{height: moderateScaleVertical(90)}} />
            )}
            ListEmptyComponent={
              <ListEmptySubscriptions isLoading={isLoadingB} />
            }
          />
        </View>

        <ModalView
          data={selectedPlan}
          isVisible={isModalVisibleForPayment}
          // onClose={() => updateState({isModalVisibleForPayment: false})}

          leftIcon={imagePath.cross}
          topCustomComponent={topCustomComponent}
          modalMainContent={modalMainContent}
          modalBottomContent={modalBottomContent}
          avoidKeyboard={Platform.OS == 'ios' ? true : false}
        />

        <Modal
          onBackdropPress={() =>
            updateState({isModalVisibleForPayFlutterWave: false})
          }
          isVisible={isModalVisibleForPayFlutterWave}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              padding: moderateScale(20),
              backgroundColor: colors?.white,
              height: height / 8,
              justifyContent: 'flex-end',
            }}>
            {/* <PayWithFlutterwave
              onAbort={() =>
                updateState({isModalVisibleForPayFlutterWave: false})
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
            /> */}
          </View>
        </Modal>
      </StripeProvider>
    </WrapperContainer>
  );
}
