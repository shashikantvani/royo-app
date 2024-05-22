// import {
//   StripeProvider,
//   CardField,
//   createToken,
// } from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {showError} from '../../../utils/helperFunctions';
import stylesFun from './styles';

const PaymentOptions = ({navigation, route}) => {
  const [state, setState] = useState({
    pageNo: 1,
    limit: 12,
    apiPaymentOptions: [],
    walletPayment: {id: 2, title: strings.WALLET, off_site: 0},
    selectedPaymentMethod: null,
    cardInfo: null,
    btnLoader: false,
  });
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const darkthemeusingDevice = useDarkMode();
  // const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const isDarkMode =  theme;
  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const {
    pageNo,
    limit,
    apiPaymentOptions,
    walletPayment,
    selectedPaymentMethod,
    cardInfo,
    btnLoader,
  } = state;

  useEffect(() => {
    getAllPaymentOptions();
  }, []);

  useEffect(() => {
    getWalletData();
  }, [pageNo]);

  const getAllPaymentOptions = () => {
    actions
      .getListOfPaymentMethod(
        `/pickup_delivery`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        // console.log(res, 'responseFromServer');
        updateState({
          apiPaymentOptions: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const getWalletData = () => {
    actions
      .walletHistory(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        // console.log(res, 'Wallet Responce');
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          wallet_amount: res?.data?.wallet_amount,
          walletHistory:
            pageNo == 1
              ? res.data.transactions.data
              : [...walletHistory, ...res.data.transactions.data],
        });
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    // console.log(error, 'errorOccured');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _onPressWallet = () => {
    if (walletAmount >= 0) {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        selectedMethod: walletPayment,
      });
    } else {
      showError(strings.PLEASE_RECHARGE_WALLET);
    }
  };

  const _onPressPaymentOption = (item) => {
   
    updateState({
      selectedPaymentMethod: item,
    });

    if (item?.id == 4) {
      return;
    }
    navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
      selectedMethod: item,
    });
  };

  const selectPaymentOption = async () => {
    if (
      selectedPaymentMethod?.id == 4 &&
      selectedPaymentMethod?.off_site == 0
    ) {
      updateState({btnLoader: true});
      if (cardInfo) {
        // console.log(cardInfo, 'cardInfo>>>');
        await createToken({...cardInfo, type: 'Card'})
          .then((res) => {
            updateState({btnLoader: false});
            // console.log(res, 'res>>>>>');
            if (!!res?.error) {
              alert(res.error.localizedMessage);
              return;
            }
            navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
              selectedMethod: selectedPaymentMethod,
              cardInfo: cardInfo,
              tokenInfo: res.token?.id,
            });
          })
          .catch((err) => {
            updateState({btnLoader: false});
            // console.log(err, 'err>>');
          });
      } else {
        updateState({btnLoader: false});
        alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
      }
    }
  };

  const _onChangeStripeData = (cardDetails) => {
    // console.log(cardDetails, 'cardDetails>>>');
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
      updateState({cardInfo: null});
    }
  };

  const _renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => _onPressPaymentOption(item)}
          style={styles.renderItemStyle}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image source={imagePath.radioInActive} style={styles.imageStyle} />
            <Text
              style={[
                styles.textStyle,
                {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
              ]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4
        ) && (
         
          <></>
        )}
      </View>
    );
  };

   {/* <StripeProvider
            publishableKey={
              appData?.profile?.preferences?.stripe_publishable_key
            }
            merchantIdentifier="merchant.identifier">
            <CardField
              postalCodeEnabled={false}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: colors.backgroundGrey,
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
          </StripeProvider> */}
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      <Header
        rightViewStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.backgroundGrey,
          alignItems: 'center',
          paddingVertical: moderateScaleVertical(8),
          borderRadius: 14,
          flex: 0.15,
        }}
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.PAYMENT_OPTIONS}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginVertical: moderateScaleVertical(10),
          rightViewStyle: {backgroundColor: colors.greyColor},
        }}
      />
      <View style={styles.containerStyle}>
        <View style={{marginHorizontal: moderateScale(18)}}>
          <Text
            style={{
              opacity: 0.7,
              fontFamily: fontFamily.bold,
              fontSize: textScale(14),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: moderateScaleVertical(20),
              marginBottom: moderateScaleVertical(10),
            }}>
            {strings.PAYMENT_METHOD}
          </Text>
          {/* <TouchableOpacity
            onPress={_onPressWallet}
            style={{
              ...styles.renderItemStyle,
              flexDirection: 'row',
              marginBottom: moderateScale(20),
            }}>
            <Image source={imagePath.radioInActive} style={styles.imageStyle} />
            <Text
              style={[
                styles.textStyle,
                {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
              ]}>
              {strings.WALLET}
            </Text>
          </TouchableOpacity> */}
          <FlatList
            data={apiPaymentOptions}
            renderItem={_renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
        {selectedPaymentMethod?.id == 4 && (
          <GradientButton
            onPress={selectPaymentOption}
            containerStyle={{
              position: 'absolute',
              bottom: 0,
              width: width - moderateScale(40),
              alignSelf: 'center',
            }}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SELECT}
            indicator={btnLoader}
            indicatorColor={colors.white}
            colorsArray={[
              themeColors.primary_color,
              themeColors.primary_color,
            ]}
          />
        )}
      </View>
    </WrapperContainer>
  );
};

export default PaymentOptions;
