import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  BrandProducts,
  BuyProduct,
  Cart,
  ContactUs,
  Delivery,
  Location,
  MyOrders,
  MyProfile,
  MyProfile2,
  MyProfile3,
  Notifications,
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  Settings,
  SuperMarket,
  SupermarketProductsCategory,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
  ChatScreen,
  ChatRoom,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';

export default function (Stack) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <>
      <Stack.Screen
        name={navigationStrings.TAXITABROUTES}
        component={TaxiTabRoutes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        component={SuperMarket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET_PRODUCTS_CATEGORY}
        component={SupermarketProductsCategory}
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
        name={navigationStrings.SETTIGS}
        component={Settings}
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
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
          appStyle?.homePageLayout === 3
            ? SearchProductVendorItem2
            : SearchProductVendorItem
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CART}
        component={Cart}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={ChatRoom}
        options={{headerShown: false}}
      />
          {TaxiAppStack(Stack)}
    </>
  );
}
