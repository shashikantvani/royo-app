import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  Addaddress,
  AddNewRider,
  AllContacts,
  AuthorizeNet,
  ChooseCarTypeAndTimeTaxi,
  HomeScreenTaxi,
  Offers,
  OrderDetail,
  Payfast,
  PaymentOptions,
  PayPhone,
  Paystack,
  PickupTaxiOrderDetail,
  PinAddressOnMap,
  RateOrder,
  VerifyAccount,
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import DirectPayOnline from '../Screens/PaymentGateways/DirectPayOnline';

import VerifyAccountSecond from '../Screens/VerifyAccountSecond/VerifyAccount';
import navigationStrings from './navigationStrings';
// ChooseCarTypeAndTimeTaxi;

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENTAXI}
        component={HomeScreenTaxi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_NEW_RIDER}
        component={AddNewRider}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PINADDRESSONMAP}
        component={PinAddressOnMap}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PAYMENT_OPTIONS}
        component={PaymentOptions}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.CHOOSECARTYPEANDTIMETAXI}
        component={ChooseCarTypeAndTimeTaxi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.OFFERS2}
        component={Offers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPTAXIORDERDETAILS}
        component={PickupTaxiOrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYPHONE}
        component={PayPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYSTACK}
        component={Paystack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.DIRECTPAYONLINE}
        component={DirectPayOnline}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{
          headerShown: false,
          unmountOnBlur: true,
        }}
      />
      {/* <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{headerShown: false}}
      /> */}
    </>
  );
}
