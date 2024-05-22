import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  Account,
  Account2,
  Account3,
  AddMoney,
  BrandProducts,
  BuyProduct,
  CMSLinks,
  ContactUs,
  Delivery,
  Loyalty,
  Loyalty2,
  MyOrders,
  MyProfile,
  MyProfile2,
  MyProfile3,
  Notifications,
  OrderDetail,
  PickupOrderDetail,
  PrinterConnection,
  PrinterConnectionSunmi,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  RateOrder,
  ReturnOrder,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  SendRefferal,
  Settings,
  Subscriptions2,
  TipPaymentOptions,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
  Wallet,
  WebLinks,
  WebPayment,
  WebviewScreen,
  Wishlist,
  Wishlist2,
  //Pyament Screens
  Mobbex,
  Payfast,
  Paylink,
  Yoco,
  AllinonePyments,
  Inventory,
  UdhaarLedger,
  SalesExpenses,
  AddProduct,
  AddNewCustomer,
  CustomerEarningHistory,
  Location,
  ChatRoom,
} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function ({navigation}) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const checkLayout = (inx) => {
    switch (inx) {
      case 2:
        return Account2;
      case 3:
        return Account3;
      case 4:
        return Account3;
      case 5:
        return Account3;
      case 6:
        return Account3;
      default:
        return Account;
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        component={checkLayout(appStyle?.homePageLayout)}
        name={navigationStrings.ACCOUNTS}
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
        name={navigationStrings.MY_ORDERS}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name={navigationStrings.ORDER_DETAIL2}
        component={OrderDetail2}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notifications}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ABOUT_US}
        component={AboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CONTACT_US}
        component={ContactUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SETTIGS}
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER}
        component={PrinterConnection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER + 'sunmi'}
        component={PrinterConnectionSunmi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WALLET}
        component={Wallet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_MONEY}
        component={AddMoney}
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
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TRACKING}
        component={Tracking}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? SearchProductVendorItem2
            : SearchProductVendorItem
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={appStyle?.homePageLayout === 2 ? ProductList2 : ProductList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SENDREFFERAL}
        component={SendRefferal}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CMSLINKS}
        component={CMSLinks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TRACKORDER}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{headerShown: false, tabBarVisible: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEWSCREEN}
        // component={WebviewScreen}
        component={
          WebviewScreen
          // appStyle?.homePageLayout === 3 ? StaticTrackOrder :
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        // component={appStyle?.homePageLayout === 3 ? Subscriptions2 : Subscriptions}
        component={Subscriptions2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOYALTY}
        // component={appStyle?.homePageLayout === 3 ? Loyalty2 : Loyalty}
        component={Loyalty2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.RETURNORDER}
        component={ReturnOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TIP_PAYMENT_OPTIONS}
        component={TipPaymentOptions}
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
        name={navigationStrings.INVENTORY}
        component={Inventory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.UDHAARLEDGER}
        component={UdhaarLedger}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SALES_EXPENSES}
        component={SalesExpenses}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_PRODUCT}
        component={AddProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_NEW_CUSTOMER}
        component={AddNewCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CUSTOMER_EARNING_HISTORY}
        component={CustomerEarningHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={ChatRoom}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
