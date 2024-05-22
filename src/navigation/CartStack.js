import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  AllPaymentMethods,
  Cart,
  Cart2,
  Cart3,
  Offers,
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  VerifyAccount,
  WebPayment,
  Wishlist,
  Wishlist2,
  //Pyament Screens
  Mobbex,
  Payfast,
  Paylink,
  Yoco,
  AllinonePyments,
  Simplify,
  Square,
  Checkout,
  Paystack,
  ScrollableCategory,
  AuthorizeNet,
  Avenue,
  FPX,
  Cashfree,
  MyProfile3,
  MyProfile2,
  Easebuzz,
  ToyyibPay,
  Mpaisa,
  WindCave,
  PayPhone,
  StripeOXXO,
  VivaWallet,
  MyCash,
  OpenPay,
  Userede,
} from '../Screens';
import MyProfile from '../Screens/MyProfile/MyProfile2';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import DirectPayOnline from '../Screens/PaymentGateways/DirectPayOnline';
import Khalti from '../Screens/PaymentGateways/Khalti';
import KongaPay from '../Screens/PaymentGateways/KongaPay';
import Pagarme from '../Screens/PaymentGateways/Pagarme';
import StripeIdeal from '../Screens/PaymentGateways/StripeIdeal';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CART}
        component={Cart3}
        options={{headerShown: false, animationEnabled: false}}
      />

      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{headerShown: false, animationEnabled: false}}
      />

      <Stack.Screen
        name={navigationStrings.ALL_PAYMENT_METHODS}
        component={AllPaymentMethods}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? Wishlist2
            : Wishlist
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? ProductList3
            : ProductList
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTWITHCATEGORY}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? ProductWithCategory
            : ProductList
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={
          appStyle?.homePageLayout === 2
            ? MyProfile2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? MyProfile3
            : MyProfile
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MOBBEX}
        component={Mobbex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.YOCO}
        component={Yoco}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYLINK}
        component={Paylink}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ALL_IN_ONE_PAYMENTS}
        component={AllinonePyments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SIMPLIFY}
        component={Simplify}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SQUARE}
        component={Square}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAGARME}
        component={Pagarme}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYSTACK}
        component={Paystack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.FPX}
        component={FPX}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.KONGOPAY}
        component={KongaPay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.AVENUE}
        component={Avenue}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CASH_FREE}
        component={Cashfree}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.EASEBUZZ}
        component={Easebuzz}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TOYYIAPAY}
        component={ToyyibPay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MPAISA}
        component={Mpaisa}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WINDCAVE}
        component={WindCave}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PAYPHONE}
        component={PayPhone}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.STRIPEOXXO}
        component={StripeOXXO}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VIVAWALLET}
        component={VivaWallet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MYCASH}
        component={MyCash}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.STRIPEIDEAL}
        component={StripeIdeal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.DIRECTPAYONLINE}
        component={DirectPayOnline}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.KHALTI}
        component={Khalti}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.OPENPAY}
        component={OpenPay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.USEREDE}
        component={Userede}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
