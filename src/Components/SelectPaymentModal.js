import { useNavigation } from '@react-navigation/native';
import {
  CardField, createPaymentMethod, createToken,
  initStripe,
  StripeProvider
} from '@stripe/stripe-react-native';
// import {CardField, createToken, initStripe} from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard, ScrollView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import { useDarkMode } from 'react-native-dark-mode';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../Components/CheckoutPaymentView';
import GradientButton from '../Components/GradientButton';
import Header from '../Components/Header';
import { loaderOne } from '../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../Components/WrapperContainer';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang/index';
import actions from '../redux/actions';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorCodeWithOpactiyNumber } from '../utils/helperFunctions';
import HomeLoader from './Loaders/HomeLoader';
export default function SelectPaymentModal({
  onSelectPayment,
  paymentModalClose = () => {},
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const navigation = useNavigation();
  const userData = useSelector((state) => state?.auth?.userData);
  // console.log(userData, 'userData');
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const {appData, appStyle, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {preferences} = appData?.profile;

  // console.log(appData, 'appDataappDataappData');
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const [state, setState] = useState({
    isLoading: false,
    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
    keyboardHeight: 0,
    btnLoader: false,
  });
  const {
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
    keyboardHeight,
    btnLoader,
  } = state;

  useEffect(() => {
    // console.log(selectedPaymentMethod, 'selectedPaymentMethod>>');
  }, [selectedPaymentMethod]);
  //Update states in screen
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      (async () => {
        try {
          let res = await initStripe({
            publishableKey: preferences?.stripe_publishable_key,
            merchantIdentifier: 'merchant.identifier',
          });
        } catch (error) {
          // console.log('error raised');
        }
      })();
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        updateState({keyboardHeight: event.endCoordinates.height});
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event) => {
        updateState({keyboardHeight: 0});
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateState({isLoading: true});
    getListOfPaymentMethod();
  }, []);

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/cart',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        // console.log(res, 'allpayments gate');
        updateState({isLoading: false, isRefreshing: false});
        if (res && res?.data) {
          updateState({payementMethods: res?.data});
          // updateState({allAvailAblePaymentMethods: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false,btnLoader:false});
    // showError(error?.message || error?.error);
    // console.log(error, 'error');
    alert(error?.message || error?.error);

  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    // console.log(cardInfo, '_createPaymentMethod>>>ardInfo');
    if (res2) {
      await createPaymentMethod({
        type: 'Card',
        token:res2,
        card: cardInfo,
        billing_details: {
          name: 'Jenny Rosen',
        },
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          // console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
            updateState({isLoading: false});
            paymentModalClose();
          } else {
            // console.log(res, 'success_createPaymentMethod ');
            updateState({isLoading: false});
            onSelectPayment({
              selectedPaymentMethod,
              cardInfo,
              tokenInfo: res2,
              payment_method_id: res?.paymentMethod?.id,
            });
            paymentModalClose();
          }
        })
        .catch(errorMethod);
    }
  };

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      updateState({btnLoader: true});
      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          await createToken({...cardInfo, type: 'Card'})
            .then((res) => {
              // console.log(res, 'stripeTokenres>>');
              // console.log(cardInfo, 'stripeTokencardInfo>>');
              if (!!res?.error) {
                alert(res.error.localizedMessage);
                updateState({isLoading: false,btnLoader:false});
                return;
              }
              if (res && res?.token && res.token?.id) {
                _createPaymentMethod(cardInfo, res.token?.id);

                // updateState({isLoading: false});
                // onSelectPayment({
                //   selectedPaymentMethod,
                //   cardInfo,
                //   tokenInfo: res.token?.id,
                // });
                // paymentModalClose();
              } else {
                updateState({btnLoader: false});
              }
            })
            .catch((err) => {
              updateState({btnLoader: false});
              console.log(err, 'err>>');
            });
        } else {
          updateState({btnLoader: false});
          alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
          //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        setTimeout(() => {
          updateState({btnLoader: false});
          onSelectPayment({
            selectedPaymentMethod,
            cardInfo,
          });
          paymentModalClose();
        }, 1000);
      }
    } else {
      alert(strings.SELECTPAYEMNTMETHOD);
      //   showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  // //Select/ Update payment method
  // const selectPaymentMethod = (data, inx) => {
  //   console.log(selectedPaymentMethod,"selectedPaymentMethod")
  //   console.log(data,"data")
  //   if (selectedPaymentMethod?.id === 4) {
  //     return;
  //   }
  //   {
  //     selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
  //       ? updateState({selectedPaymentMethod: null})
  //       : updateState({selectedPaymentMethod: data});
  //   }
  // };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: data});
    }
  };

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    // return {}
    if (selectedPaymentMethod && selectedPaymentMethod.id == item.id) {
      return {
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };

  const _renderItemPayments = ({item, index}) => {
    return (
      <Animatable.View
        // animation={'slideInUp'}
        // duration={200}
        style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[
            styles.caseOnDeliveryView,
            //  {...getAndCheckStyle(item)}
          ]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          {/* {strings.CASE_ON_DELIVERY} */}
          <Text
            style={
              isDarkMode
                ? [styles.caseOnDeliveryText, {color: MyDarkTheme.colors.text}]
                : styles.caseOnDeliveryText
            }>
            {item?.title_lng ? item?.title_lng : item?.title}
          </Text>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4
        ) && (
          <View>
            <CardField
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
              onFocus={(focusedField) => {
                // console.log('focusField', focusedField);
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
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17
        ) && (
          <CheckoutPaymentView
            cardTokenized={(e) => {
              updateState({isLoading: false});
              if (e.token) {
                onSelectPayment({
                  selectedPaymentMethod,
                  cardInfo: e.token,
                });
                paymentModalClose();
              }
            }}
            cardTokenizationFailed={(e) => {
              setTimeout(() => {
                updateState({isLoading: false});
                alert(strings.INVALID_CARD_DETAILS);
                // showError(strings.INVALID_CARD_DETAILS);
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
      </Animatable.View>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    // console.log("_onChangeStripeData_onChangeStripeData",cardDetails)
    if (cardDetails?.complete) {
      // updateState({
      //   cardInfo: {
      //     brand: cardDetails.brand,
      //     complete: true,
      //     expiryMonth: cardDetails?.expiryMonth,
      //     expiryYear: cardDetails?.expiryYear,
      //     last4: cardDetails?.last4,
      //     // name:userData?.name
      //     // postalCode: cardDetails?.postalCode,
      //   },
      // });
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
        // isLoadingB={isLoading}
      >
        <Header
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
          }
          onPressLeft={paymentModalClose}
          centerTitle={strings.PAYMENT}
          headerStyle={
            isDarkMode
              ? {backgroundColor: MyDarkTheme.colors.background}
              : {backgroundColor: colors.backgroundGrey}
          }
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.borderLight,
          }}
        />

        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginHorizontal: moderateScale(16),
            marginVertical: moderateScaleVertical(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScaleVertical(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}
        />
      </WrapperContainer>
    );
  }

  const mainView = () => {
    return (
      <>
        <ScrollView
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginTop: moderateScaleVertical(10),
          }}>
          {payementMethods && payementMethods?.length
            ? payementMethods.map((item, index) => {
                return (
                  <>
                    <Animatable.View
                      // animation={'slideInUp'}
                      // duration={200}
                      style={{flex: 1}}>
                      <TouchableOpacity
                        onPress={() => selectPaymentMethod(item, index)}
                        key={index}
                        style={[
                          styles.caseOnDeliveryView,
                          //  {...getAndCheckStyle(item)}
                        ]}>
                        <Image
                          source={
                            selectedPaymentMethod &&
                            selectedPaymentMethod?.id == item.id
                              ? imagePath.radioActive
                              : imagePath.radioInActive
                          }
                        />
                        {/* {strings.CASE_ON_DELIVERY} */}
                        <Text
                          style={
                            isDarkMode
                              ? [
                                  styles.caseOnDeliveryText,
                                  {color: MyDarkTheme.colors.text},
                                ]
                              : styles.caseOnDeliveryText
                          }>
                          {item?.title_lng ? item?.title_lng : item?.title}
                        </Text>
                      </TouchableOpacity>
                      {!!(
                        selectedPaymentMethod &&
                        selectedPaymentMethod?.id == item.id &&
                        selectedPaymentMethod?.off_site == 0 &&
                        selectedPaymentMethod?.id === 4
                      ) && (
                        <View>
                          <CardField
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
                            onFocus={(focusedField) => {
                              // console.log('focusField', focusedField);
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
                        selectedPaymentMethod?.off_site == 0 &&
                        selectedPaymentMethod?.id === 17
                      ) && (
                        <CheckoutPaymentView
                          cardTokenized={(e) => {
                            updateState({isLoading: false});
                            if (e.token) {
                              onSelectPayment({
                                selectedPaymentMethod,
                                cardInfo: e.token,
                              });
                              paymentModalClose();
                            }
                          }}
                          cardTokenizationFailed={(e) => {
                            setTimeout(() => {
                              updateState({isLoading: false});
                              alert(strings.INVALID_CARD_DETAILS);
                              // showError(strings.INVALID_CARD_DETAILS);
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
                    </Animatable.View>
                    <View style={{marginBottom: moderateScaleVertical(16)}} />
                  </>
                );
              })
            : !isLoading && (
                <Text style={{textAlign: 'center'}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
        </ScrollView>
        {/* <KeyboardAwareScrollView
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
          style={{
            marginHorizontal: moderateScaleVertical(20),
          }}> */}

        {/* <FlatList
            data={payementMethods}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
            // horizontal
            style={{marginTop: moderateScaleVertical(10)}}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItemPayments}
            ItemSeparatorComponent={() => (
              <View style={{marginBottom: moderateScaleVertical(16)}} />
            )}
            ListEmptyComponent={() =>
              !isLoading && (
                <Text style={{textAlign: 'center'}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )
            }
          /> */}
        {/* </KeyboardAwareScrollView> */}

        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginBottom:
              keyboardHeight == 0
                ? keyboardHeight
                : moderateScale(keyboardHeight - 80),
          }}>
          {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
            <GradientButton
            colorsArray={[
              themeColors.primary_color,
              themeColors.primary_color,
            ]}
              onPress={selectPaymentOption}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.SELECT}
              indicator={btnLoader}
              indicatorColor={colors.white}
            />
          ) : (
            <></>
          )}
        </View>
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      // isLoadingB={isLoading}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        onPressLeft={paymentModalClose}
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.backgroundGrey}
        }
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <StripeProvider
        publishableKey={preferences?.stripe_publishable_key}
        merchantIdentifier="merchant.identifier">
        {mainView()}
      </StripeProvider>
    </WrapperContainer>
  );
}

const stylesFun = ({fontFamily, themeColors}) => {
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    packingBoxStyle: {
      height: moderateScaleVertical(120),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      padding: 5,
      marginVertical: 5,
    },
    caseOnDeliveryView: {
      borderRadius: moderateScaleVertical(13),
      alignItems: 'center',
      flexDirection: 'row',
    },
    useNewCartView: {
      padding: moderateScaleVertical(10),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      marginVertical: 5,
      marginHorizontal: moderateScaleVertical(20),
      marginTop: moderateScaleVertical(15),
    },
    useNewCartText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
      marginLeft: moderateScaleVertical(100),
      fontSize: moderateScaleVertical(14),
    },
    caseOnDeliveryText: {
      marginHorizontal: moderateScaleVertical(10),
      fontFamily: fontFamily.medium,
      fontSize: textScale(16),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(13),
      marginTop: moderateScaleVertical(10),
    },
    dropOff: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginTop: moderateScaleVertical(40),
    },
    dots: {
      width: 4,
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 50,
      marginVertical: 3,
      marginLeft: 4,
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    totalPayableView: {
      flexDirection: 'row',
      marginTop: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(60),
      justifyContent: 'center',
    },
    totalPayableText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      marginLeft: moderateScale(5),
      marginVertical: moderateScaleVertical(2),
    },
    totalPayableValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(22),
      marginVertical: moderateScaleVertical(2),
    },
    allIncludedText: {
      color: colors.walletTextD,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(2),
    },
    cardImageView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(5),
    },
    masterCardLogo: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      marginRight: moderateScaleVertical(10),
    },
  });
  return styles;
};
