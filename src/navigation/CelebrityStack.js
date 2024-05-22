import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  BrandProducts,
  BuyProduct,
  Celebrity,
  Celebrity2,
  CelebrityProduct,
  CelebrityProduct2,
  Delivery,
  Filter,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  Vendors,
  Vendors2,
} from '../Screens';
import { shortCodes } from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const { appData, appStyle } = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CELEBRITY}
        component={appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? Celebrity2 : Celebrity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.CELEBRITYDETAIL}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? CelebrityProduct2 : CelebrityProduct
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? SearchProductVendorItem2
            : SearchProductVendorItem
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        component={Filter}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
