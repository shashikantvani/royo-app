import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BrandProducts,
  BrandProducts2,
  BuyProduct,
  CategoryBrands,
  ChatRoom,
  ChatScreen,
  ConfirmDetailsBuy,
  Delivery,
  Filter,
  Home,
  LaundryAvailableVendors,
  Location,
  Payment,
  PaymentSuccess,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  ScrollableCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  ShippingDetails,
  SuperMarket,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  VendorDetail3,
  Vendors2,
  Vendors3,
  ViewAllData,
  TaxiHomeScreen,
  Subscriptions2,
  SubcategoryVendor,
  Addaddress,
} from '../Screens';
import AddVehicleDetails from '../Screens/AddVehicleDetails/AddVehicleDetails';

import {verticalAnimation} from '../utils/utils';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();

export default function () {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;

  const rendervendorScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return Vendors2;
      case 3:
        return Vendors3;
      case 5:
        return Vendors3;
      case 6:
        return Vendors3;

      default:
        return VendorDetail;
    }
  };

  const renderVendorDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return VendorDetail2;
      case 3:
        return VendorDetail3;
      case 5:
        return VendorDetail3;
      case 6:
        return VendorDetail3;

      default:
        return VendorDetail;
    }
  };

  const renderProductListScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductList2;
      case 3:
        return ProductList3;
      case 5:
        return ProductList3;
      case 6:
        return ProductList3;

      default:
        return ProductList;
    }
  };

  const renderProductDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductDetail2;
      case 3:
        return ProductDetail;
      case 5:
        return ProductDetail;
      case 6:
        return ProductDetail;

      default:
        return ProductDetail;
    }
  };

  const renderBrandProductsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return BrandProducts;
      case 3:
        return BrandProducts2;
      case 5:
        return BrandProducts2;
      case 6:
        return BrandProducts2;

      default:
        return BrandProducts;
    }
  };

  const renderSearchProductVendorItem2Screens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return SearchProductVendorItem;
      case 3:
        return SearchProductVendorItem2;
      case 5:
        return SearchProductVendorItem2;
      case 6:
        return SearchProductVendorItem2;

      default:
        return SearchProductVendorItem;
    }
  };

  return (
    <Stack.Navigator options={{ headerShown: false }} screenOptions={{ headerShown: false }}
   
    >
      <Stack.Screen
        name={
          businessType === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        component={businessType === 4 ? TaxiHomeScreen : Home}
      
        
        screenOptions={{ headerShown: true }}
        options={{headerTitle: '', headerTransparent: true}}
        
      />
 <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{headerShown: false}}
        screenOptions={{
          headerShown: false
        }}
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
        component={rendervendorScreen()}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={renderVendorDetailsScreens()}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={renderProductListScreen()}
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
        name={navigationStrings.ADD_VEHICLE_DETAILS}
        component={AddVehicleDetails}
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
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        component={ConfirmDetailsBuy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={renderProductDetailsScreens()}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={renderSearchProductVendorItem2Screens()}
        options={verticalAnimation}
      />

      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        component={Filter}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={renderBrandProductsScreens()}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT}
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        component={PaymentSuccess}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        component={ShippingDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        component={ViewAllData}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY_BRANDS}
        component={CategoryBrands}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CART_SCREEN}
        component={ChatScreen}
        options={{headerShown: false, gestureEnabled: true}}
      />

      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LAUNDRY_AVAILABLE_VENDORS}
        component={LaundryAvailableVendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={ChatRoom}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUBCATEGORY_VENDORS}
        component={SubcategoryVendor}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
