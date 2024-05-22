// import stripe from 'tipsi-stripe';
// import {
//   CardField,
//   createToken,
//   initStripe,
//   StripeProvider,
//   handleCardAction,
//   createPaymentMethod,
//   confirmPayment,
// } from '@stripe/stripe-react-native';
import queryString from 'query-string';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import RazorpayCheckout from 'react-native-razorpay';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import {generateTransactionRef, payWithCard} from '../../utils/paystackMethod';
import stylesFun from './styles';
import {PayWithFlutterwave} from 'flutterwave-react-native';
import Modal from 'react-native-modal';

export default function AddMoney({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const [state, setState] = useState({
    amount: '',
    data: [
      {id: 0, amount: 10},
      {id: 1, amount: 20},
      {id: 2, amount: 50},
      {id: 3, amount: 100},
    ],
    allAvailAblePaymentMethods: [],
    selectedPaymentMethod: null,
    isLoadingB: false,
    cardInfo: null,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );

  const userData = useSelector((state) => state.auth.userData);
  console.log(userData, 'userDatauserDatauserData');
  const {preferences} = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {
    allAvailAblePaymentMethods,
    selectedPaymentMethod,
    amount,
    isLoadingB,
    cardInfo,
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
  } = state;
  useEffect(() => {
    getListOfPaymentMethod();
  }, []);

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
        console.log('payment list options', res.data);
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res?.data) {
          updateState({allAvailAblePaymentMethods: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'errorerrorerror');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      isModalVisibleForPayFlutterWave: false,
    });
    showError(error?.message || error?.error);
  };

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  //Onchange Texinput function
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //Select Amount
  const chooseAmount = (item) => {
    let addedAmount = item.amount;
    updateState({amount: addedAmount});
  };

  //Render all Available amounts
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => chooseAmount(item)}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(8),
          }}>
          <View
            style={
              isDarkMode
                ? [
                    styles.selectAmountCon,
                    {
                      backgroundColor: MyDarkTheme.colors.lightDark,
                      borderColor: MyDarkTheme.colors.text,
                    },
                  ]
                : styles.selectAmountCon
            }>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.chooseAddMoney, {color: MyDarkTheme.colors.text}]
                  : styles.chooseAddMoney
              }>
              {`+ ${currencies?.primary_currency?.symbol}`}{' '}
              {currencyNumberFormatter(
                item.amount,
                appData?.profile?.preferences?.digit_after_decimal,
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const _selectPaymentMethod = (item) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == item?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: item});
    }
  };
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
            <Image
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
                      ? isDarkMode
                        ? colors.white
                        : colors.blackC
                      : colors.textGreyJ,
                },
              ]}>
              {item?.title_lng ? item?.title_lng : item?.title}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4 && (
            <View>
             <></>
            </View>
          )}

          {/*  <CardField
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
                onFocus={(focusedField) => {
                  console.log('focusField', focusedField);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              /> */}

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17 && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={(e) => {
                setTimeout(() => {
                  updateState({isLoadingB: false});
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={(res) => {
                updateState({
                  isLoadingB: true,
                });
              }}
              btnTitle={strings.ADD}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(40),
              }}
            />
          )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  const renderRazorPay = () => {
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: preferences?.razorpay_api_key, // Your api key
      amount: amount * 100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: {color: themeColors.primary_color},
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        if (res?.razorpay_payment_id) {
          const data = {};
          data['amount'] = amount;
          data['transaction_id'] = res?.razorpay_payment_id;
          actions
            .walletCredit(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            })
            .then((res) => {
              Alert.alert('', strings.PAYMENT_SUCCESS, [
                {
                  text: strings.OK,
                  onPress: () => console.log('Okay pressed'),
                },
              ]);
              navigation.navigate(navigationStrings.WALLET);
            })
            .catch(errorMethod);
        }
      })
      .catch(errorMethod);
  };

  const openPayTabs = async (data) => {
    // console.log(appData, 'openPayTabsappData');
    // console.log('openPayTabsdata', data);

    data['serverKey'] = appData?.profile?.preferences?.paytab_server_key;
    data['clientKey'] = appData?.profile?.preferences?.paytab_client_key;
    data['profileID'] = appData?.profile?.preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;

    try {
      const res = await payWithCard(data);
      console.log('payWithCard res++++', res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: 'wallet',
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
              navigation.goBack();
            }
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const _addMoneyToWallet = () => {
    console.log(selectedPaymentMethod, 'selectedPaymentMethod');

    if (amount == '') {
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
      return;
    }
    // if (!selectedPaymentMethod) {
    //   showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
    //   return;
    // }
    if (
      selectedPaymentMethod?.off_site == 0 &&
      selectedPaymentMethod?.id == 1
    ) {
      renderRazorPay();
      return;
    }

    if (selectedPaymentMethod?.id == 27) {
      let paymentData = {
        payment_option_id: selectedPaymentMethod?.id,
        total_payable_amount: amount,
      };
      openPayTabs(paymentData);
      return;
    }
    if (selectedPaymentMethod?.id == 30) {
      let paymentData = {
        payment_option_id: selectedPaymentMethod?.id,
        total_payable_amount: amount,
        selectedPayment: selectedPaymentMethod,
      };
      updateState({
        isModalVisibleForPayFlutterWave: true,
        paymentDataFlutterWave: paymentData,
      });
      return;
    }
    if (selectedPaymentMethod?.off_site == 1) {
      _webPayment();
      return;
    }
    _offineLinePayment();
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
          action: 'wallet',
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
              navigation.goBack();
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

  const _checkoutPayment = (token) => {
    if (amount == '') {
      updateState({isLoadingB: false});
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
    } else {
      let selectedMethod = selectedPaymentMethod.title.toLowerCase();
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPaymentMethod?.id}&token=${token}&action=wallet`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'resresresresres');
          updateState({isLoadingB: false, isRefreshing: false});
          if (res && res?.status == 'Success' && res?.data) {
            Alert.alert('', strings.PAYMENT_SUCCESS, [
              {
                text: strings.OK,
                onPress: () => console.log('Cancel Pressed'),
                // style: 'destructive',
              },
            ]);
            navigation.navigate(navigationStrings.WALLET);
          }
        })
        .catch(errorMethod);
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod.code;
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;

    updateState({isLoadingB: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoadingB: false, isRefreshing: false});
        // const URL = queryString.parseUrl(res.data);
        console.log('res==>>>>', res);
        if (
          res &&
          res?.status == 'Success' &&
          (res?.data || res?.payment_link)
        ) {
          let sendingData = {
            id: selectedPaymentMethod.id,
            title: selectedPaymentMethod.title,
            screenName: navigationStrings.WALLET,
            paymentUrl: res?.data || res?.payment_link,
            action: 'wallet',
          };
             
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
        }
      })
      .catch(errorMethod);
  };
  const _createPaymentMethod = async (cardInfo, res2) => {
    // console.log(cardInfo, 'cardInfo');
    if (res2) {
      await createPaymentMethod({
        type: 'Card',
        card: cardInfo,
        token: res2,
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
          } else {
            console.log(res, 'success_createPaymentMethod ');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  action: 'wallet',
                  amount: amount,
                  payment_method_id: res?.paymentMethod?.id,
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
                  if (paymentIntent) {
                    console.log(paymentIntent, 'paymentIntent');
                    if (paymentIntent) {
                      actions
                        .confirmPaymentIntentStripe(
                          {
                            payment_option_id: selectedPaymentMethod?.id,
                            action: 'wallet',
                            amount: amount,
                            payment_intent_id: paymentIntent?.id,
                          },
                          {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                          },
                        )
                        .then((res) => {
                          if (res) {
                            Alert.alert('', strings.PAYMENT_SUCCESS, [
                              {
                                text: strings.OK,
                                onPress: () => console.log('Cancel Pressed'),
                                // style: 'destructive',
                              },
                            ]);
                            updateState({isLoadingB: false});
                            navigation.navigate(navigationStrings.WALLET);
                          }
                        })
                        .catch(errorMethod);
                    }
                  } else {
                    updateState({isLoadingB: false});
                    console.log(error, 'error');
                    showError(error?.message || 'payment failed');
                  }
                } else {
                  updateState({isLoadingB: false});
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
    if (cardInfo) {
      console.log(cardInfo, 'cardInfo>cardInfo>cardInfo');
      updateState({isLoadingB: true});
      await createToken({...cardInfo, type: 'Card'})
        .then((res) => {
          console.log(res, 'res>>STRIpe');
          if (!!res?.error && !!res?.error?.localizedMessage) {
            showError(res?.error?.localizedMessage);
            updateState({isLoadingB: false});
            return;
          }

          //Creating the createPaymentMehod
          if (res && res?.token && res.token?.id) {
            _createPaymentMethod(cardInfo, res.token?.id);
          }
         

          // if (res && res?.token && res.token?.id) {
          //   let selectedMethod = selectedPaymentMethod.code.toLowerCase();
          //   // updateState({isLoadingB: true});
          //   let apiData = `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet&stripe_token=${res.token?.id}`;
          //   actions
          //     .openPaymentWebUrl(
          //       apiData,
          //       {},
          //       {
          //         code: appData?.profile?.code,
          //         currency: currencies?.primary_currency?.id,
          //         language: languages?.primary_language?.id,
          //       },
          //     )
          //     .then((res) => {
          //       updateState({isLoadingB: false, isRefreshing: false});
          //       if (res && res?.status == 'Success' && res?.data) {
          //         // updateState({allAvailAblePaymentMethods: res?.data});
          //         // alert('Payment successfull');
          //         Alert.alert('', strings.PAYMENT_SUCCESS, [
          //           {
          //             text: strings.OK,
          //             onPress: () => console.log('Cancel Pressed'),
          //             // style: 'destructive',
          //           },
          //         ]);
          //         navigation.navigate(navigationStrings.WALLET);
          //       }
          //     })
          //     .catch(errorMethod);
          // } else {
          //   updateState({isLoadingB: false});
          // }
        })
        .catch(errorMethod);
    }
  };

  const listFooterComp = () => {
    return (
      <View>
        {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
          <View style={{}}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={_addMoneyToWallet}
              marginTop={moderateScaleVertical(50)}
              marginBottom={moderateScaleVertical(50)}
              btnText={strings.ADD}
            />
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  const mainView = () => {
    return (
      <>
        <View style={{...commonStyles.headerTopLine}} />
        <View
          style={
            isDarkMode
              ? [
                  styles.addMoneyTopCon,
                  {backgroundColor: MyDarkTheme.colors.background},
                ]
              : styles.addMoneyTopCon
          }>
          <View
            style={
              isDarkMode
                ? [
                    styles.inputAmountCon,
                    {backgroundColor: MyDarkTheme.colors.background},
                  ]
                : styles.inputAmountCon
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={
                  isDarkMode
                    ? [styles.inputAmountText, {color: MyDarkTheme.colors.text}]
                    : styles.inputAmountText
                }>
                {strings.INPUT_AMOUNT}
              </Text>
            </View>

            <View
              style={{
                height: moderateScaleVertical(35),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(3),
                borderBottomWidth: 0.5,
                borderBottomColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyJ,
              }}>
              <Text
                style={{
                  ...styles.currencySymble,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {currencies?.primary_currency?.symbol}
              </Text>
              <TextInput
                style={
                  isDarkMode
                    ? [
                        styles.addMoneyInputField,
                        {
                          marginLeft: moderateScale(10),
                          width: width - 50,
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.addMoneyInputField
                }
                value={`${state.amount}`}
                onChangeText={_onChangeText('amount')}
                keyboardType={'numeric'}
                placeholder={strings.ENTER_AMOUNT}
                placeholderTextColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ
                }
              />
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <FlatList
              data={state.data}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal
              ItemSeparatorComponent={(data, index) =>
                index == data.length ? null : (
                  <View style={styles.cartItemLine}></View>
                )
              }
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItem}
            />
          </View>
        </View>
        <View style={{...commonStyles.headerTopLine}} />

        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {!!(
              allAvailAblePaymentMethods && allAvailAblePaymentMethods.length
            ) && (
              <Text
                style={
                  isDarkMode
                    ? [styles.debitFrom, {color: MyDarkTheme.colors.text}]
                    : styles.debitFrom
                }>
                {strings.DEBIT_FROM}
              </Text>
            )}

            <FlatList
              data={allAvailAblePaymentMethods}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{marginTop: moderateScaleVertical(10)}}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListFooterComponent={listFooterComp}
              ListEmptyComponent={() => (
                <Text style={{textAlign: 'center',color: isDarkMode ? MyDarkTheme.colors.text : colors.black,}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
              contentContainerStyle={{
                paddingBottom: moderateScaleVertical(100),
              }}
            />
          </View>
        </View>
      </>
    );
  };

  const _confirmCardPayment = async (paymentData) => {
    const {paymentIntent, error} = await handleCardAction(
      paymentData?.clientSecret,
    );
    if (paymentIntent) {
      console.log(paymentIntent, 'paymentIntent');
    } else {
      console.log(error, 'error');
      showError(error?.message || 'payment faild');
    }
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.ADD_MONEY}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: Colors.white}
        }
      />
        {/* <StripeProvider
          publishableKey={preferences?.stripe_publishable_key}
          curr
          merchantIdentifier="merchant.identifier">
          {mainView()}
        </StripeProvider> */}
      {preferences?.stripe_publishable_key ? (
      <></>
      ) : (
        mainView()
      )}

      <Modal
        onBackdropPress={() =>
          updateState({isModalVisibleForPayFlutterWave: false})
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
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
}
