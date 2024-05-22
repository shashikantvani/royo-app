import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {VendorList, VendorRevenue} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.VENDOR_REVENUE}
        component={VendorRevenue}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDORLIST}
        component={VendorList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
